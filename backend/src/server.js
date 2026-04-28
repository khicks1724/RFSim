const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

function usernameToInternalEmail(username) {
  const slug = normalizeUsername(username)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "user";
  return `${slug}@rfsim.local`;
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
app.get("/api/ai/genai-mil/ping", async (_request, response) => {
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

app.post("/api/auth/register", async (request, response) => {
  const parsed = registerSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const username = normalizeUsername(parsed.data.username);
  const password = parsed.data.password;
  const fullName = normalizeUsername(parsed.data.fullName || username);
  const internalEmail = usernameToInternalEmail(username);

  try {
    const existing = await query(
      "select id from app_user where lower(email) = lower($1) or lower(full_name) = lower($2)",
      [internalEmail, username]
    );
    if (existing.rowCount > 0) {
      response.status(409).json({ error: "An account with that username already exists." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await query(
      "insert into app_user (email, password_hash, full_name) values ($1, $2, $3) returning id, email, full_name",
      [internalEmail, passwordHash, fullName]
    );
    const user = result.rows[0];
    response.status(201).json({
      token: signToken(user),
      user: { id: user.id, email: user.email, fullName: user.full_name }
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/login", async (request, response) => {
  const parsed = loginSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const username = normalizeUsername(parsed.data.username);
  const password = parsed.data.password;

  try {
    const result = await query(
      "select id, email, full_name, password_hash from app_user where lower(email) = lower($1) or lower(full_name) = lower($1)",
      [username]
    );
    if (result.rowCount === 0) {
      response.status(401).json({ error: "Invalid username or password." });
      return;
    }

    const user = result.rows[0];
    const matches = await bcrypt.compare(password, user.password_hash);
    if (!matches) {
      response.status(401).json({ error: "Invalid username or password." });
      return;
    }

    response.json({
      token: signToken(user),
      user: { id: user.id, email: user.email, fullName: user.full_name }
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.get("/api/auth/me", authRequired, async (request, response) => {
  try {
    const result = await query(
      "select id, email, full_name from app_user where id = $1",
      [request.user.sub]
    );
    if (result.rowCount === 0) {
      response.status(404).json({ error: "User not found." });
      return;
    }
    const user = result.rows[0];
    response.json({ user: { id: user.id, email: user.email, fullName: user.full_name } });
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
    response.json({ configs: result.rows });
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
          configItem.apiKey,
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

app.post("/api/ai/genai-mil/models", async (request, response) => {
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

app.post("/api/ai/genai-mil/chat/completions", async (request, response) => {
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
    response.status(201).json({ project: result.rows[0] });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.get("/api/projects/:projectId", authRequired, async (request, response) => {
  try {
    const result = await query(
      "select id, name, description, latest_state_json, state_schema_version, client_saved_at, updated_at from project where id = $1 and owner_user_id = $2",
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
  if (parsed.data.schemaVersion !== undefined) {
    index += 1;
    updates.push(`state_schema_version = $${index}`);
    values.push(parsed.data.schemaVersion);
  }
  if (parsed.data.clientSavedAt !== undefined) {
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
    response.json({ project: result.rows[0] });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

app.delete("/api/projects/:projectId", authRequired, async (request, response) => {
  try {
    const result = await query(
      "delete from project where id = $1 and owner_user_id = $2",
      [request.params.projectId, request.user.sub]
    );
    if (result.rowCount === 0) {
      response.status(404).json({ error: "Project not found." });
      return;
    }
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
      "select latest_state_json from project where id = $1 and owner_user_id = $2",
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
    response.status(201).json({ snapshot: result.rows[0] });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// ── Analytics ─────────────────────────────────────────────────────────────────

const ADMIN_USERNAME = "kyle.hicks";
const ADMIN_INTERNAL_EMAIL = usernameToInternalEmail(ADMIN_USERNAME);

function adminRequired(request, response, next) {
  const userEmail = request.user?.email ?? "";
  if (userEmail.toLowerCase() !== ADMIN_INTERNAL_EMAIL.toLowerCase()) {
    response.status(403).json({ error: "Forbidden." });
    return;
  }
  next();
}

const analyticsEventSchema = z.object({
  event_type: z.enum(["visit", "ai_request", "project_create", "project_save", "snapshot"]),
  provider:       z.string().max(80).optional(),
  model:          z.string().max(120).optional(),
  input_tokens:   z.number().int().nonnegative().optional(),
  output_tokens:  z.number().int().nonnegative().optional(),
  meta:           z.record(z.any()).optional().default({}),
});

app.post("/api/analytics/event", authRequired, async (request, response) => {
  const parsed = analyticsEventSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { event_type, provider, model, input_tokens, output_tokens, meta } = parsed.data;
  try {
    const userResult = await query("select full_name from app_user where id = $1", [request.user.sub]);
    const username = userResult.rows[0]?.full_name ?? request.user.email;
    await query(
      `insert into analytics_event (user_id, username, event_type, provider, model, input_tokens, output_tokens, meta)
       values ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)`,
      [request.user.sub, username, event_type, provider ?? null, model ?? null,
       input_tokens ?? null, output_tokens ?? null, JSON.stringify(meta)]
    );
    response.status(204).send();
  } catch (error) {
    if (error.code === "42P01") { response.status(204).send(); return; } // table not yet created
    response.status(500).json({ error: error.message });
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

    let usersQuery;
    if (hasAnalyticsTable && hasProjectTable) {
      usersQuery = query(`
        select u.id, u.full_name as username, u.email, u.created_at,
               count(distinct p.id)::int as project_count,
               count(distinct case when e.event_type='visit' then e.id end)::int as visit_count,
               max(e.created_at) as last_seen
        from app_user u
        left join project p on p.owner_user_id = u.id
        left join analytics_event e on e.user_id = u.id
        group by u.id
        order by last_seen desc nulls last, u.created_at desc
      `);
    } else if (hasProjectTable) {
      usersQuery = query(`
        select u.id, u.full_name as username, u.email, u.created_at,
               count(distinct p.id)::int as project_count,
               0::int as visit_count,
               null::timestamptz as last_seen
        from app_user u
        left join project p on p.owner_user_id = u.id
        group by u.id
        order by u.created_at desc
      `);
    } else if (hasAnalyticsTable) {
      usersQuery = query(`
        select u.id, u.full_name as username, u.email, u.created_at,
               0::int as project_count,
               count(distinct case when e.event_type='visit' then e.id end)::int as visit_count,
               max(e.created_at) as last_seen
        from app_user u
        left join analytics_event e on e.user_id = u.id
        group by u.id
        order by last_seen desc nulls last, u.created_at desc
      `);
    } else {
      usersQuery = query(`
        select u.id, u.full_name as username, u.email, u.created_at,
               0::int as project_count,
               0::int as visit_count,
               null::timestamptz as last_seen
        from app_user u
        order by u.created_at desc
      `);
    }

    const [usersRes, eventsRes, aiRes, projectsRes, dailyRes] = await Promise.all([
      usersQuery,
      hasAnalyticsTable
        ? query(`
            select e.id, e.username, e.event_type, e.provider, e.model,
                   e.input_tokens, e.output_tokens, e.meta, e.created_at
            from analytics_event e
            order by e.created_at desc
            limit 500
          `)
        : Promise.resolve({ rows: [] }),
      hasAnalyticsTable
        ? query(`
            select username, provider, model,
                   count(*)::int                        as request_count,
                   coalesce(sum(input_tokens),0)::int   as total_input,
                   coalesce(sum(output_tokens),0)::int  as total_output
            from analytics_event
            where event_type = 'ai_request'
            group by username, provider, model
            order by total_input + total_output desc
          `)
        : Promise.resolve({ rows: [] }),
      hasProjectTable
        ? query(`
            select u.full_name as username, p.name, p.created_at, p.updated_at,
                   ${hasProjectSnapshotTable
                     ? "(select count(*) from project_snapshot s where s.project_id = p.id)::int"
                     : "0::int"} as snapshot_count
            from project p
            join app_user u on u.id = p.owner_user_id
            order by p.updated_at desc
          `)
        : Promise.resolve({ rows: [] }),
      hasAnalyticsTable
        ? query(`
            select date_trunc('day', created_at)::date as day,
                   count(distinct user_id)::int         as unique_users,
                   count(*)::int                        as total_visits
            from analytics_event
            where event_type = 'visit'
              and created_at >= now() - interval '60 days'
            group by 1
            order by 1
          `)
        : Promise.resolve({ rows: [] }),
    ]);

    response.json({
      users:    usersRes.rows,
      events:   eventsRes.rows,
      aiTokens: aiRes.rows,
      projects: projectsRes.rows,
      daily:    dailyRes.rows,
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

async function runMigrations() {
  const sqlDir = path.join(__dirname, "../sql");
  const files = fs.readdirSync(sqlDir).filter((f) => f.endsWith(".sql")).sort();
  for (const file of files) {
    const sql = fs.readFileSync(path.join(sqlDir, file), "utf8");
    try {
      await query(sql);
      console.log(`Migration applied: ${file}`);
    } catch (error) {
      console.error(`Migration failed (${file}): ${error.message}`);
    }
  }
}

runMigrations().then(() => {
  app.listen(config.port, () => {
    console.log(`EW Sim backend listening on port ${config.port}`);
  });
}).catch((error) => {
  console.error("Failed to run migrations:", error.message);
  process.exit(1);
});
