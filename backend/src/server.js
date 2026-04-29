const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Readable } = require("stream");
const fs = require("fs");
const path = require("path");
const { z } = require("zod");
const { config } = require("./config");
const { pool, query } = require("./db");

const app = express();

app.use(helmet());
app.use(cors({ origin: config.appOrigin, credentials: true }));

app.use(express.json({ limit: "10mb" }));

const projectSchemaCapabilities = {
  hasStateSchemaVersion: false,
  hasClientSavedAt: false,
};

const rateLimitState = new Map();
const rateLimitBuckets = {
  auth: { limit: 10, windowMs: 15 * 60 * 1000 },
  aiRelay: { limit: 30, windowMs: 60 * 1000 },
  analytics: { limit: 60, windowMs: 60 * 1000 },
};

function getClientIp(request) {
  const forwarded = request.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  return request.ip || request.socket?.remoteAddress || "unknown";
}

function rateLimit(bucketName) {
  const bucket = rateLimitBuckets[bucketName];
  return (request, response, next) => {
    if (!bucket) {
      next();
      return;
    }
    const now = Date.now();
    const key = `${bucketName}:${getClientIp(request)}`;
    const entry = rateLimitState.get(key);
    if (!entry || now >= entry.resetAt) {
      rateLimitState.set(key, { count: 1, resetAt: now + bucket.windowMs });
      next();
      return;
    }
    if (entry.count >= bucket.limit) {
      response.status(429).json({ error: "Too many requests. Please try again shortly." });
      return;
    }
    entry.count += 1;
    next();
  };
}

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    config.jwtSecret,
    { expiresIn: "7d" }
  );
}

function authRequired(request, response, next) {
  const authorization = request.headers.authorization ?? "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : null;
  if (!token) {
    response.status(401).json({ error: "Authentication required." });
    return;
  }

  try {
    request.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    response.status(401).json({ error: "Invalid token." });
  }
}

function normalizeUsername(value = "") {
  return String(value).trim();
}

function deriveEncryptionKey(secret) {
  return crypto.createHash("sha256").update(String(secret || "")).digest();
}

const AI_CONFIG_ENCRYPTION_KEY = deriveEncryptionKey(config.aiConfigSecret);

function encryptSecret(plainText = "") {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", AI_CONFIG_ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(String(plainText), "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `enc:${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted.toString("base64")}`;
}

function decryptSecret(payload = "") {
  const raw = String(payload || "");
  if (!raw.startsWith("enc:")) {
    return raw;
  }
  const [, ivB64, tagB64, dataB64] = raw.split(":");
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error("Encrypted secret payload is malformed.");
  }
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    AI_CONFIG_ENCRYPTION_KEY,
    Buffer.from(ivB64, "base64")
  );
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

function usernameToInternalEmail(username) {
  const slug = normalizeUsername(username)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "user";
  return `${slug}@rfsim.local`;
}

function buildLoginIdentifierCandidates(rawIdentifier = "") {
  const trimmed = normalizeUsername(rawIdentifier);
  if (!trimmed) {
    return [];
  }

  const candidates = new Set();
  const lowered = trimmed.toLowerCase();
  candidates.add(lowered);

  // Support the current username -> internal email scheme.
  candidates.add(usernameToInternalEmail(trimmed).toLowerCase());

  // If the user typed an email address, also allow its local-part to resolve to
  // the synthesized internal account form for backward compatibility.
  const atIndex = lowered.indexOf("@");
  if (atIndex > 0) {
    const localPart = lowered.slice(0, atIndex).trim();
    if (localPart) {
      candidates.add(localPart);
      candidates.add(usernameToInternalEmail(localPart).toLowerCase());
    }
  }

  return [...candidates];
}

async function findUserByLoginIdentifier(identifier) {
  const candidates = buildLoginIdentifierCandidates(identifier);
  if (!candidates.length) {
    return null;
  }

  const result = await query(
    `select id, email, full_name, password_hash, is_admin
     from app_user
     where lower(email) = any($1::text[])
        or lower(full_name) = any($1::text[])
     order by
       case
         when lower(email) = $2 then 0
         when lower(full_name) = $2 then 1
         else 2
       end
     limit 1`,
    [candidates, candidates[0]]
  );

  return result.rows[0] ?? null;
}

async function fetchUserById(userId) {
  const result = await query(
    "select id, email, full_name, is_admin from app_user where id = $1",
    [userId]
  );
  return result.rows[0] ?? null;
}

function formatUser(user) {
  if (!user) {
    return null;
  }
  return {
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    isAdmin: Boolean(user.is_admin),
  };
}

const registerSchema = z.object({
  username: z.string().min(1).max(120),
  password: z.string().min(12),
  fullName: z.string().min(1).max(120).optional()
});

const loginSchema = z.object({
  username: z.string().min(1).max(120),
  password: z.string().min(1)
});

const projectSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional().default(""),
  state: z.any().optional().default({}),
  schemaVersion: z.number().int().nonnegative().optional(),
  clientSavedAt: z.string().datetime({ offset: true }).optional()
});

const snapshotSchema = z.object({
  label: z.string().min(1).max(120),
  state: z.any().optional()
});

const aiConfigItemSchema = z.object({
  id: z.string().min(1).max(200),
  label: z.string().max(120).optional().default(""),
  provider: z.string().min(1).max(80),
  apiKey: z.string().min(1).max(4096),
  model: z.string().max(120).optional().default("")
});

const aiConfigListSchema = z.object({
  configs: z.array(aiConfigItemSchema).default([])
});

const aiGenAiMilModelsSchema = z.object({
  apiKey: z.string().min(1).max(4096)
});

const aiGenAiMilChatSchema = z.object({
  apiKey: z.string().min(1).max(4096),
  model: z.string().min(1).max(200),
  messages: z.array(z.any()).min(1),
  max_tokens: z.number().int().positive().max(200000).optional(),
  temperature: z.number().min(0).max(2).optional(),
  stream: z.boolean().optional()
});

const GENAI_MIL_BASE_URL = "https://api.genai.mil/v1";
const GENAI_MIL_TIMEOUT_MS = 30000;

function isHtmlLike(text = "") {
  const normalized = String(text).trimStart();
  return normalized.startsWith("<!doctype")
    || normalized.startsWith("<!DOCTYPE")
    || normalized.startsWith("<html")
    || normalized.startsWith("<head")
    || normalized.startsWith("<body");
}

function stripHtml(text = "") {
  return String(text)
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildGenAiMilErrorPayload(status, bodyText, fallbackMessage) {
  if (!bodyText) {
    return { message: fallbackMessage };
  }

  if (!isHtmlLike(bodyText)) {
    try {
      const parsed = JSON.parse(bodyText);
      if (parsed?.error && typeof parsed.error === "object") {
        return parsed.error;
      }
      if (typeof parsed?.error === "string") {
        return { message: parsed.error };
      }
      if (parsed && typeof parsed === "object") {
        if (typeof parsed.message === "string") {
          return { ...parsed, message: parsed.message };
        }
        return parsed;
      }
    } catch {}
  }

  const plainText = stripHtml(bodyText).slice(0, 400);
  if (/Unauthorized Access - GenAI\.mil/i.test(plainText)) {
    return {
      type: "unauthorized",
      message: `GenAI.mil rejected this network path (HTTP ${status}). Run the relay from an approved workstation/network and unlock the key if required.`,
    };
  }
  return { message: plainText || fallbackMessage };
}

function sendGenAiMilError(response, status, payload, fallbackMessage) {
  const safeStatus = Number.isInteger(status) ? status : 502;
  const safePayload = payload && typeof payload === "object"
    ? payload
    : { message: fallbackMessage };
  console.error(`[GenAI relay] client error (${safeStatus}): ${safePayload.message || fallbackMessage}`);
  response.status(safeStatus).json({ error: safePayload });
}

async function requestGenAiMil(pathname, { apiKey, method = "GET", body, stream = false } = {}) {
  const headers = {
    Accept: stream ? "text/event-stream, application/json" : "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(`${GENAI_MIL_BASE_URL}${pathname}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(GENAI_MIL_TIMEOUT_MS),
  });
}

async function relayGenAiMilJson(response, upstreamResponse, fallbackMessage) {
  const bodyText = await upstreamResponse.text();
  if (!upstreamResponse.ok) {
    const payload = buildGenAiMilErrorPayload(upstreamResponse.status, bodyText, fallbackMessage);
    sendGenAiMilError(response, upstreamResponse.status, payload, fallbackMessage);
    return;
  }

  try {
    const parsed = JSON.parse(bodyText);
    response.status(upstreamResponse.status).json(parsed);
  } catch {
    sendGenAiMilError(
      response,
      502,
      { message: "GenAI.mil returned a non-JSON response." },
      fallbackMessage
    );
  }
}

async function relayGenAiMilStream(response, upstreamResponse, fallbackMessage) {
  if (!upstreamResponse.ok) {
    const bodyText = await upstreamResponse.text();
    const payload = buildGenAiMilErrorPayload(upstreamResponse.status, bodyText, fallbackMessage);
    sendGenAiMilError(response, upstreamResponse.status, payload, fallbackMessage);
    return;
  }

  response.status(upstreamResponse.status);
  response.setHeader("Content-Type", upstreamResponse.headers.get("content-type") || "text/event-stream; charset=utf-8");
  response.setHeader("Cache-Control", upstreamResponse.headers.get("cache-control") || "no-cache, no-transform");
  response.setHeader("Connection", "keep-alive");
  response.flushHeaders?.();

  if (!upstreamResponse.body) {
    response.end();
    return;
  }

  const stream = Readable.fromWeb(upstreamResponse.body);
  stream.on("error", (error) => {
    console.error(`[GenAI relay] stream error: ${error.message}`);
    response.end();
  });
  stream.pipe(response);
}

app.get("/api/health", async (_request, response) => {
  try {
    await query("select 1");
    response.json({ ok: true, database: "reachable" });
  } catch (error) {
    response.status(500).json({ ok: false, error: error.message });
  }
});

// Diagnostic: test raw reachability of api.genai.mil (no key needed)
app.get("/api/ai/genai-mil/ping", authRequired, rateLimit("aiRelay"), async (_request, response) => {
  try {
    const res = await fetch(`${GENAI_MIL_BASE_URL}/models`, {
      method: "GET",
      headers: { "Authorization": "Bearer test_ping_no_key" },
      signal: AbortSignal.timeout(8000),
    });
    const text = await res.text();
    response.json({
      reachable: true,
      status: res.status,
      contentType: res.headers.get("content-type"),
      body: text.slice(0, 500),
    });
  } catch (error) {
    response.json({
      reachable: false,
      error: error.message,
    });
  }
});

app.post("/api/auth/register", rateLimit("auth"), async (request, response) => {
  const parsed = registerSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const username = normalizeUsername(parsed.data.username);
  const password = parsed.data.password;
  const fullName = normalizeUsername(parsed.data.fullName || username);
  const internalEmail = usernameToInternalEmail(username);
  const identifierCandidates = buildLoginIdentifierCandidates(username);

  try {
    const existing = await query(
      `select id
       from app_user
       where lower(email) = any($1::text[])
          or lower(full_name) = any($1::text[])`,
      [identifierCandidates]
    );
    if (existing.rowCount > 0) {
      response.status(409).json({ error: "An account with that username already exists." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await query(
      "insert into app_user (email, password_hash, full_name) values ($1, $2, $3) returning id, email, full_name, is_admin",
      [internalEmail, passwordHash, fullName]
    );
    const user = result.rows[0];
    await logAnalyticsEventForUser(user.id, {
      event_type: "auth_register",
      meta: { source: "self_service", username },
    }, { username: user.full_name || user.email });
    response.status(201).json({
      token: signToken(user),
      user: formatUser(user),
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/login", rateLimit("auth"), async (request, response) => {
  const parsed = loginSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const username = normalizeUsername(parsed.data.username);
  const password = parsed.data.password;

  try {
    const user = await findUserByLoginIdentifier(username);
    if (!user) {
      response.status(401).json({ error: "Invalid username or password." });
      return;
    }

    const matches = await bcrypt.compare(password, user.password_hash);
    if (!matches) {
      response.status(401).json({ error: "Invalid username or password." });
      return;
    }

    await logAnalyticsEventForUser(user.id, {
      event_type: "auth_login",
      meta: { source: "password_login" },
    }, { username: user.full_name || user.email });
    response.json({
      token: signToken(user),
      user: formatUser(user),
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.get("/api/auth/me", authRequired, async (request, response) => {
  try {
    const user = await fetchUserById(request.user.sub);
    if (!user) {
      response.status(404).json({ error: "User not found." });
      return;
    }
    response.json({ user: formatUser(user) });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.get("/api/user/ai-configs", authRequired, async (request, response) => {
  try {
    const result = await query(
      `select id, label, provider, api_key as "apiKey", model
       from user_ai_config
       where owner_user_id = $1
       order by position asc, updated_at desc`,
      [request.user.sub]
    );
    response.json({
      configs: result.rows.map((row) => ({
        ...row,
        apiKey: decryptSecret(row.apiKey),
      })),
    });
  } catch (error) {
    // Table may not exist yet if migration hasn't run — return empty rather than 500
    if (error.code === "42P01") {
      response.json({ configs: [] });
      return;
    }
    response.status(500).json({ error: error.message });
  }
});

app.put("/api/user/ai-configs", authRequired, async (request, response) => {
  const parsed = aiConfigListSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("begin");
    await client.query("delete from user_ai_config where owner_user_id = $1", [request.user.sub]);

    for (const [index, configItem] of parsed.data.configs.entries()) {
      await client.query(
        `insert into user_ai_config (id, owner_user_id, label, provider, api_key, model, position)
         values ($1, $2, $3, $4, $5, $6, $7)`,
        [
          configItem.id,
          request.user.sub,
          configItem.label ?? "",
          configItem.provider,
          encryptSecret(configItem.apiKey),
          configItem.model ?? "",
          index,
        ]
      );
    }

    await client.query("commit");
    response.json({ configs: parsed.data.configs });
  } catch (error) {
    await client.query("rollback");
    if (error.code === "42P01") {
      response.status(503).json({ error: "AI config storage not available — run the latest database migration." });
      return;
    }
    response.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

app.post("/api/ai/genai-mil/models", authRequired, rateLimit("aiRelay"), async (request, response) => {
  const parsed = aiGenAiMilModelsSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    const upstream = await requestGenAiMil("/models", {
      apiKey: parsed.data.apiKey,
      method: "GET",
    });
    await relayGenAiMilJson(response, upstream, "GenAI.mil model discovery failed.");
  } catch (error) {
    sendGenAiMilError(response, 502, { message: error.message }, "GenAI.mil model discovery failed.");
  }
});

app.post("/api/ai/genai-mil/chat/completions", authRequired, rateLimit("aiRelay"), async (request, response) => {
  const parsed = aiGenAiMilChatSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    const { apiKey, ...chatBody } = parsed.data;
    const upstream = await requestGenAiMil("/chat/completions", {
      apiKey,
      method: "POST",
      body: chatBody,
      stream: Boolean(chatBody.stream),
    });
    if (chatBody.stream) {
      await relayGenAiMilStream(response, upstream, "GenAI.mil chat completion failed.");
      return;
    }
    await relayGenAiMilJson(response, upstream, "GenAI.mil chat completion failed.");
  } catch (error) {
    sendGenAiMilError(response, 502, { message: error.message }, "GenAI.mil chat completion failed.");
  }
});

app.get("/api/projects", authRequired, async (request, response) => {
  try {
    const result = await query(
      "select id, name, description, updated_at from project where owner_user_id = $1 order by updated_at desc",
      [request.user.sub]
    );
    response.json({ projects: result.rows });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.post("/api/projects", authRequired, async (request, response) => {
  const parsed = projectSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { name, description, state } = parsed.data;
  try {
    const result = await query(
      "insert into project (owner_user_id, name, description, latest_state_json) values ($1, $2, $3, $4::jsonb) returning id, name, description, latest_state_json, updated_at",
      [request.user.sub, name, description, JSON.stringify(state)]
    );
    await logAnalyticsEventForUser(request.user.sub, {
      event_type: "project_create",
      meta: {
        project_id: result.rows[0].id,
        project_name: result.rows[0].name,
        description_excerpt: clampExcerpt(description, 120),
      },
    }, { username: request.user.email });
    response.status(201).json({ project: result.rows[0] });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

async function getProjectSchemaCapabilities() {
  return projectSchemaCapabilities;
}

app.get("/api/projects/:projectId", authRequired, async (request, response) => {
  try {
    const schema = await getProjectSchemaCapabilities();
    const optionalSelect = [
      schema.hasStateSchemaVersion
        ? "state_schema_version"
        : "0::integer as state_schema_version",
      schema.hasClientSavedAt
        ? "client_saved_at"
        : "null::timestamptz as client_saved_at",
    ].join(", ");
    const result = await query(
      `select id, name, description, latest_state_json, ${optionalSelect}, updated_at
       from project
       where id = $1 and owner_user_id = $2`,
      [request.params.projectId, request.user.sub]
    );
    if (result.rowCount === 0) {
      response.status(404).json({ error: "Project not found." });
      return;
    }
    response.json({ project: result.rows[0] });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.put("/api/projects/:projectId", authRequired, async (request, response) => {
  const parsed = projectSchema.partial().safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const updates = [];
  const values = [request.params.projectId, request.user.sub];
  let index = values.length;
  const schema = await getProjectSchemaCapabilities();

  if (parsed.data.name !== undefined) {
    index += 1;
    updates.push(`name = $${index}`);
    values.push(parsed.data.name);
  }
  if (parsed.data.description !== undefined) {
    index += 1;
    updates.push(`description = $${index}`);
    values.push(parsed.data.description);
  }
  if (parsed.data.state !== undefined) {
    index += 1;
    updates.push(`latest_state_json = $${index}::jsonb`);
    values.push(JSON.stringify(parsed.data.state));
  }
  if (parsed.data.schemaVersion !== undefined && schema.hasStateSchemaVersion) {
    index += 1;
    updates.push(`state_schema_version = $${index}`);
    values.push(parsed.data.schemaVersion);
  }
  if (parsed.data.clientSavedAt !== undefined && schema.hasClientSavedAt) {
    index += 1;
    updates.push(`client_saved_at = $${index}`);
    values.push(parsed.data.clientSavedAt);
  }

  updates.push("updated_at = now()");

  try {
    const result = await query(
      `update project set ${updates.join(", ")} where id = $1 and owner_user_id = $2 returning id, name, description, latest_state_json, updated_at`,
      values
    );
    if (result.rowCount === 0) {
      response.status(404).json({ error: "Project not found." });
      return;
    }
    await logAnalyticsEventForUser(request.user.sub, {
      event_type: "project_save",
      meta: {
        project_id: result.rows[0].id,
        project_name: result.rows[0].name,
        field_count: updates.length,
        schema_version: schema.hasStateSchemaVersion ? (parsed.data.schemaVersion ?? null) : null,
        client_saved_at: schema.hasClientSavedAt ? (parsed.data.clientSavedAt ?? null) : null,
      },
    }, { username: request.user.email });
    response.json({ project: result.rows[0] });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.delete("/api/projects/:projectId", authRequired, async (request, response) => {
  try {
    const projectInfo = await query(
      "select id, name from project where id = $1 and owner_user_id = $2",
      [request.params.projectId, request.user.sub]
    );
    if (projectInfo.rowCount === 0) {
      response.status(404).json({ error: "Project not found." });
      return;
    }
    const result = await query(
      "delete from project where id = $1 and owner_user_id = $2",
      [request.params.projectId, request.user.sub]
    );
    if (result.rowCount === 0) {
      response.status(404).json({ error: "Project not found." });
      return;
    }
    await logAnalyticsEventForUser(request.user.sub, {
      event_type: "project_delete",
      meta: {
        project_id: projectInfo.rows[0].id,
        project_name: projectInfo.rows[0].name,
      },
    }, { username: request.user.email });
    response.status(204).send();
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.post("/api/projects/:projectId/duplicate", authRequired, async (request, response) => {
  try {
    const sourceResult = await query(
      "select id, name, description, latest_state_json from project where id = $1 and owner_user_id = $2",
      [request.params.projectId, request.user.sub]
    );
    if (sourceResult.rowCount === 0) {
      response.status(404).json({ error: "Project not found." });
      return;
    }

    const source = sourceResult.rows[0];
    const duplicateResult = await query(
      "insert into project (owner_user_id, name, description, latest_state_json) values ($1, $2, $3, $4::jsonb) returning id, name, description, latest_state_json, updated_at",
      [request.user.sub, `${source.name} Copy`, source.description, JSON.stringify(source.latest_state_json)]
    );
    await logAnalyticsEventForUser(request.user.sub, {
      event_type: "project_duplicate",
      meta: {
        project_id: duplicateResult.rows[0].id,
        project_name: duplicateResult.rows[0].name,
        source_project_id: source.id,
        source_project_name: source.name,
      },
    }, { username: request.user.email });
    response.status(201).json({ project: duplicateResult.rows[0] });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.get("/api/projects/:projectId/snapshots", authRequired, async (request, response) => {
  try {
    const result = await query(
      `select snapshot.id, snapshot.label, snapshot.created_at
       from project_snapshot snapshot
       inner join project on project.id = snapshot.project_id
       where snapshot.project_id = $1 and project.owner_user_id = $2
       order by snapshot.created_at desc`,
      [request.params.projectId, request.user.sub]
    );
    response.json({ snapshots: result.rows });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.post("/api/projects/:projectId/snapshots", authRequired, async (request, response) => {
  const parsed = snapshotSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    const projectResult = await query(
      "select name, latest_state_json from project where id = $1 and owner_user_id = $2",
      [request.params.projectId, request.user.sub]
    );
    if (projectResult.rowCount === 0) {
      response.status(404).json({ error: "Project not found." });
      return;
    }

    const snapshotState = parsed.data.state ?? projectResult.rows[0].latest_state_json;
    const result = await query(
      "insert into project_snapshot (project_id, label, state_json) values ($1, $2, $3::jsonb) returning id, label, created_at",
      [request.params.projectId, parsed.data.label, JSON.stringify(snapshotState)]
    );
    await logAnalyticsEventForUser(request.user.sub, {
      event_type: "snapshot",
      meta: {
        project_id: request.params.projectId,
        project_name: projectResult.rows[0].name,
        snapshot_id: result.rows[0].id,
        snapshot_label: result.rows[0].label,
      },
    }, { username: request.user.email });
    response.status(201).json({ snapshot: result.rows[0] });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// ── Analytics ─────────────────────────────────────────────────────────────────

async function adminRequired(request, response, next) {
  try {
    const user = await fetchUserById(request.user?.sub);
    if (!user?.is_admin) {
      response.status(403).json({ error: "Forbidden." });
      return;
    }
    request.adminUser = user;
    next();
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
}

const analyticsEventSchema = z.object({
  event_type: z.enum([
    "visit",
    "auth_login",
    "auth_register",
    "ai_request",
    "project_create",
    "project_save",
    "project_duplicate",
    "project_delete",
    "snapshot"
  ]),
  provider:       z.string().max(80).optional(),
  model:          z.string().max(120).optional(),
  input_tokens:   z.number().int().nonnegative().optional(),
  output_tokens:  z.number().int().nonnegative().optional(),
  meta:           z.record(z.any()).optional().default({}),
});

async function fetchAnalyticsUsername(userId, fallback = "") {
  const userResult = await query(
    "select full_name, email from app_user where id = $1",
    [userId]
  );
  return userResult.rows[0]?.full_name || userResult.rows[0]?.email || fallback || null;
}

async function logAnalyticsEventForUser(userId, event, { username: explicitUsername = "" } = {}) {
  try {
    const username = explicitUsername || await fetchAnalyticsUsername(userId);
    await query(
      `insert into analytics_event (user_id, username, event_type, provider, model, input_tokens, output_tokens, meta)
       values ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)`,
      [
        userId,
        username,
        event.event_type,
        event.provider ?? null,
        event.model ?? null,
        event.input_tokens ?? null,
        event.output_tokens ?? null,
        JSON.stringify(event.meta ?? {}),
      ]
    );
  } catch (error) {
    console.warn(`[Analytics] event dropped (${event?.event_type || "unknown"}): ${error.message}`);
  }
}

function clampExcerpt(value, max = 220) {
  const normalized = String(value ?? "").replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "";
  }
  return normalized.length > max ? `${normalized.slice(0, max - 1)}…` : normalized;
}

app.post("/api/analytics/event", authRequired, rateLimit("analytics"), async (request, response) => {
  const parsed = analyticsEventSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { event_type, provider, model, input_tokens, output_tokens, meta } = parsed.data;
  try {
    await logAnalyticsEventForUser(
      request.user.sub,
      { event_type, provider, model, input_tokens, output_tokens, meta },
      { username: request.user.email }
    );
    response.status(204).send();
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.delete("/api/admin/user/:userId", authRequired, adminRequired, async (request, response) => {
  const { userId } = request.params;
  if (!userId || typeof userId !== "string" || userId.length > 64) {
    return response.status(400).json({ error: "Invalid user ID." });
  }
  // Prevent admins from deleting themselves
  if (userId === String(request.user.sub)) {
    return response.status(400).json({ error: "Cannot delete your own account." });
  }
  try {
    const existing = await query("SELECT id, full_name, email FROM app_user WHERE id = $1", [userId]);
    if (!existing.rows.length) {
      return response.status(404).json({ error: "User not found." });
    }
    const user = existing.rows[0];
    // Cascade: delete related data first to avoid FK violations
    await query("DELETE FROM user_ai_config WHERE owner_user_id = $1", [userId]);
    await query("DELETE FROM project WHERE owner_user_id = $1", [userId]);
    await query("DELETE FROM app_user WHERE id = $1", [userId]);
    console.log(`[admin] Deleted user id=${userId} email=${user.email} by admin id=${request.user.sub}`);
    return response.json({ ok: true, deleted: { id: userId, email: user.email, full_name: user.full_name } });
  } catch (error) {
    console.error("[admin] delete user error:", error.message);
    return response.status(500).json({ error: error.message });
  }
});

app.get("/api/admin/analytics", authRequired, adminRequired, async (_request, response) => {
  try {
    const tableAvailability = await query(`
      select
        to_regclass('public.analytics_event') as analytics_table,
        to_regclass('public.project') as project_table,
        to_regclass('public.project_snapshot') as project_snapshot_table
    `);
    const hasAnalyticsTable = Boolean(tableAvailability.rows[0]?.analytics_table);
    const hasProjectTable = Boolean(tableAvailability.rows[0]?.project_table);
    const hasProjectSnapshotTable = Boolean(tableAvailability.rows[0]?.project_snapshot_table);

    const usersPromise = query(`
      with project_counts as (
        select owner_user_id as user_id,
               count(*)::int as project_count,
               max(updated_at) as last_project_updated_at
        from project
        group by owner_user_id
      ),
      last_project as (
        select distinct on (owner_user_id)
               owner_user_id as user_id,
               name as last_project_name
        from project
        order by owner_user_id, updated_at desc
      ),
      snapshot_counts as (
        ${hasProjectSnapshotTable
          ? `select p.owner_user_id as user_id,
                    count(s.id)::int as snapshot_count,
                    max(s.created_at) as last_snapshot_at
             from project_snapshot s
             join project p on p.id = s.project_id
             group by p.owner_user_id`
          : `select null::uuid as user_id, 0::int as snapshot_count, null::timestamptz as last_snapshot_at where false`}
      ),
      event_counts as (
        ${hasAnalyticsTable
          ? `select e.user_id,
                    count(*) filter (where e.event_type = 'visit')::int as visit_count,
                    count(*) filter (where e.event_type = 'auth_login')::int as login_count,
                    count(*) filter (where e.event_type = 'ai_request')::int as ai_request_count,
                    coalesce(sum(e.input_tokens), 0)::int as total_input_tokens,
                    coalesce(sum(e.output_tokens), 0)::int as total_output_tokens,
                    max(e.created_at) as last_seen,
                    max(e.created_at) filter (where e.event_type = 'auth_login') as last_login_at
             from analytics_event e
             group by e.user_id`
          : `select null::uuid as user_id,
                    0::int as visit_count,
                    0::int as login_count,
                    0::int as ai_request_count,
                    0::int as total_input_tokens,
                    0::int as total_output_tokens,
                    null::timestamptz as last_seen,
                    null::timestamptz as last_login_at
             where false`}
      ),
      favorite_provider as (
        ${hasAnalyticsTable
          ? `select distinct on (e.user_id)
                    e.user_id,
                    e.provider as favorite_provider
             from analytics_event e
             where e.event_type = 'ai_request' and coalesce(e.provider, '') <> ''
             group by e.user_id, e.provider
             order by e.user_id, count(*) desc, max(e.created_at) desc`
          : `select null::uuid as user_id, null::text as favorite_provider where false`}
      ),
      top_intent as (
        ${hasAnalyticsTable
          ? `select distinct on (e.user_id)
                    e.user_id,
                    nullif(e.meta->>'intent_category', '') as top_intent
             from analytics_event e
             where e.event_type = 'ai_request' and nullif(e.meta->>'intent_category', '') is not null
             group by e.user_id, e.meta->>'intent_category'
             order by e.user_id, count(*) desc, max(e.created_at) desc`
          : `select null::uuid as user_id, null::text as top_intent where false`}
      )
      select u.id,
             u.full_name as username,
             u.email,
             u.created_at,
             coalesce(pc.project_count, 0)::int as project_count,
             coalesce(sc.snapshot_count, 0)::int as snapshot_count,
             coalesce(ec.visit_count, 0)::int as visit_count,
             coalesce(ec.login_count, 0)::int as login_count,
             coalesce(ec.ai_request_count, 0)::int as ai_request_count,
             coalesce(ec.total_input_tokens, 0)::int as total_input_tokens,
             coalesce(ec.total_output_tokens, 0)::int as total_output_tokens,
             (coalesce(ec.total_input_tokens, 0) + coalesce(ec.total_output_tokens, 0))::int as total_tokens,
             ec.last_seen,
             ec.last_login_at,
             sc.last_snapshot_at,
             pc.last_project_updated_at,
             lp.last_project_name,
             fp.favorite_provider,
             ti.top_intent
      from app_user u
      left join project_counts pc on pc.user_id = u.id
      left join snapshot_counts sc on sc.user_id = u.id
      left join event_counts ec on ec.user_id = u.id
      left join last_project lp on lp.user_id = u.id
      left join favorite_provider fp on fp.user_id = u.id
      left join top_intent ti on ti.user_id = u.id
      order by ec.last_seen desc nulls last, u.created_at desc
    `);

    const eventsPromise = hasAnalyticsTable
      ? query(`
          select e.id, e.username, e.event_type, e.provider, e.model,
                 e.input_tokens, e.output_tokens,
                 (coalesce(e.input_tokens, 0) + coalesce(e.output_tokens, 0))::int as total_tokens,
                 nullif(e.meta->>'intent_category', '') as intent_category,
                 nullif(e.meta->>'project_name', '') as project_name,
                 nullif(e.meta->>'prompt_excerpt', '') as prompt_excerpt,
                 nullif(e.meta->>'outcome', '') as outcome,
                 e.meta,
                 e.created_at
          from analytics_event e
          order by e.created_at desc
          limit 800
        `)
      : Promise.resolve({ rows: [] });

    const aiUsagePromise = hasAnalyticsTable
      ? query(`
          select username,
                 provider,
                 model,
                 nullif(meta->>'intent_category', '') as intent_category,
                 count(*)::int as request_count,
                 coalesce(sum(input_tokens), 0)::int as total_input_tokens,
                 coalesce(sum(output_tokens), 0)::int as total_output_tokens,
                 (coalesce(sum(input_tokens), 0) + coalesce(sum(output_tokens), 0))::int as total_tokens,
                 round(avg(coalesce(input_tokens, 0) + coalesce(output_tokens, 0)))::int as avg_total_tokens,
                 max(created_at) as last_request_at
          from analytics_event
          where event_type = 'ai_request'
          group by username, provider, model, nullif(meta->>'intent_category', '')
          order by total_tokens desc, request_count desc
        `)
      : Promise.resolve({ rows: [] });

    const projectsPromise = hasProjectTable
      ? query(`
          select u.full_name as username,
                 u.email,
                 p.id,
                 p.name,
                 p.description,
                 p.created_at,
                 p.updated_at,
                 ${hasProjectSnapshotTable
                   ? "(select count(*) from project_snapshot s where s.project_id = p.id)::int"
                   : "0::int"} as snapshot_count,
                 ${hasProjectSnapshotTable
                   ? "(select max(created_at) from project_snapshot s where s.project_id = p.id)"
                   : "null::timestamptz"} as last_snapshot_at,
                 ${hasAnalyticsTable
                   ? "(select count(*) from analytics_event e where e.event_type = 'project_save' and nullif(e.meta->>'project_id','') = p.id::text)::int"
                   : "0::int"} as save_count,
                 ${hasAnalyticsTable
                   ? "(select nullif(e.meta->>'intent_category','') from analytics_event e where e.event_type = 'ai_request' and nullif(e.meta->>'project_id','') = p.id::text order by e.created_at desc limit 1)"
                   : "null::text"} as latest_intent
          from project p
          join app_user u on u.id = p.owner_user_id
          order by p.updated_at desc
        `)
      : Promise.resolve({ rows: [] });

    const dailyPromise = hasAnalyticsTable
      ? query(`
          select date_trunc('day', created_at)::date as day,
                 count(distinct user_id)::int as unique_users,
                 count(*) filter (where event_type = 'visit')::int as total_visits,
                 count(*) filter (where event_type = 'ai_request')::int as ai_requests,
                 (coalesce(sum(input_tokens), 0) + coalesce(sum(output_tokens), 0))::int as total_tokens
          from analytics_event
          where created_at >= now() - interval '60 days'
          group by 1
          order by 1
        `)
      : Promise.resolve({ rows: [] });

    const providerUsagePromise = hasAnalyticsTable
      ? query(`
          select coalesce(provider, '(unspecified)') as provider,
                 count(*)::int as request_count,
                 count(distinct user_id)::int as user_count,
                 coalesce(sum(input_tokens), 0)::int as total_input_tokens,
                 coalesce(sum(output_tokens), 0)::int as total_output_tokens,
                 (coalesce(sum(input_tokens), 0) + coalesce(sum(output_tokens), 0))::int as total_tokens
          from analytics_event
          where event_type = 'ai_request'
          group by coalesce(provider, '(unspecified)')
          order by total_tokens desc, request_count desc
        `)
      : Promise.resolve({ rows: [] });

    const intentUsagePromise = hasAnalyticsTable
      ? query(`
          select coalesce(nullif(meta->>'intent_category', ''), '(uncategorized)') as intent_category,
                 count(*)::int as event_count,
                 count(distinct user_id)::int as user_count,
                 count(*) filter (where event_type = 'ai_request')::int as ai_requests,
                 (coalesce(sum(input_tokens), 0) + coalesce(sum(output_tokens), 0))::int as total_tokens
          from analytics_event
          group by coalesce(nullif(meta->>'intent_category', ''), '(uncategorized)')
          order by ai_requests desc, event_count desc
        `)
      : Promise.resolve({ rows: [] });

    const summaryPromise = Promise.all([
      query("select count(*)::int as registered_users from app_user"),
      hasProjectTable
        ? query("select count(*)::int as total_projects from project")
        : Promise.resolve({ rows: [{ total_projects: 0 }] }),
      hasProjectSnapshotTable
        ? query("select count(*)::int as total_snapshots from project_snapshot")
        : Promise.resolve({ rows: [{ total_snapshots: 0 }] }),
      hasAnalyticsTable
        ? query(`
            select
              count(*) filter (where event_type = 'visit')::int as total_visits,
              count(*) filter (where event_type = 'auth_login')::int as total_logins,
              count(*) filter (where event_type = 'ai_request')::int as ai_requests,
              count(distinct user_id) filter (where created_at >= now() - interval '7 days')::int as active_users_7d,
              count(distinct user_id) filter (where created_at >= now() - interval '30 days')::int as active_users_30d,
              coalesce(sum(input_tokens), 0)::int as total_input_tokens,
              coalesce(sum(output_tokens), 0)::int as total_output_tokens
            from analytics_event
          `)
        : Promise.resolve({
            rows: [{
              total_visits: 0,
              total_logins: 0,
              ai_requests: 0,
              active_users_7d: 0,
              active_users_30d: 0,
              total_input_tokens: 0,
              total_output_tokens: 0,
            }]
          }),
    ]).then(([usersCountRes, projectsCountRes, snapshotsCountRes, analyticsSummaryRes]) => {
      const analytics = analyticsSummaryRes.rows[0] ?? {};
      const totalInput = Number(analytics.total_input_tokens ?? 0);
      const totalOutput = Number(analytics.total_output_tokens ?? 0);
      return {
        registered_users: Number(usersCountRes.rows[0]?.registered_users ?? 0),
        total_projects: Number(projectsCountRes.rows[0]?.total_projects ?? 0),
        total_snapshots: Number(snapshotsCountRes.rows[0]?.total_snapshots ?? 0),
        total_visits: Number(analytics.total_visits ?? 0),
        total_logins: Number(analytics.total_logins ?? 0),
        ai_requests: Number(analytics.ai_requests ?? 0),
        active_users_7d: Number(analytics.active_users_7d ?? 0),
        active_users_30d: Number(analytics.active_users_30d ?? 0),
        total_input_tokens: totalInput,
        total_output_tokens: totalOutput,
        total_tokens: totalInput + totalOutput,
      };
    });

    const [
      summary,
      usersRes,
      eventsRes,
      aiUsageRes,
      projectsRes,
      dailyRes,
      providerUsageRes,
      intentUsageRes,
    ] = await Promise.all([
      summaryPromise,
      usersPromise,
      eventsPromise,
      aiUsagePromise,
      projectsPromise,
      dailyPromise,
      providerUsagePromise,
      intentUsagePromise,
    ]);

    response.json({
      summary,
      users: usersRes.rows,
      events: eventsRes.rows.map((row) => ({
        ...row,
        prompt_excerpt: clampExcerpt(row.prompt_excerpt),
      })),
      aiUsage: aiUsageRes.rows,
      projects: projectsRes.rows,
      daily: dailyRes.rows,
      providers: providerUsageRes.rows,
      intents: intentUsageRes.rows,
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

async function runMigrations() {
  await query(`
    create table if not exists schema_migration (
      filename text primary key,
      applied_at timestamptz not null default now()
    )
  `);
  const applied = await query("select filename from schema_migration");
  const appliedFiles = new Set(applied.rows.map((row) => row.filename));
  const sqlDir = path.join(__dirname, "../sql");
  const files = fs.readdirSync(sqlDir).filter((f) => f.endsWith(".sql")).sort();
  for (const file of files) {
    if (appliedFiles.has(file)) {
      continue;
    }
    const sql = fs.readFileSync(path.join(sqlDir, file), "utf8");
    const client = await pool.connect();
    try {
      await client.query("begin");
      await client.query(sql);
      await client.query(
        "insert into schema_migration (filename) values ($1) on conflict (filename) do nothing",
        [file]
      );
      await client.query("commit");
      console.log(`Migration applied: ${file}`);
    } catch (error) {
      await client.query("rollback");
      throw new Error(`Migration failed (${file}): ${error.message}`);
    } finally {
      client.release();
    }
  }
}

async function loadProjectSchemaCapabilities() {
  const result = await query(
    `select column_name
     from information_schema.columns
     where table_schema = 'public'
       and table_name = 'project'
       and column_name in ('state_schema_version', 'client_saved_at')`
  );
  const columns = new Set(result.rows.map((row) => row.column_name));
  projectSchemaCapabilities.hasStateSchemaVersion = columns.has("state_schema_version");
  projectSchemaCapabilities.hasClientSavedAt = columns.has("client_saved_at");
}

runMigrations().then(() => {
  return loadProjectSchemaCapabilities();
}).then(() => {
  app.listen(config.port, () => {
    console.log(`EW Sim backend listening on port ${config.port}`);
  });
}).catch((error) => {
  console.error("Failed to run migrations:", error.message);
  process.exit(1);
});
