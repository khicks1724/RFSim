const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Readable } = require("stream");
const net = require("net");
const tls = require("tls");
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

function isPemLike(value = "", { kind = "generic" } = {}) {
  const text = String(value || "").trim();
  if (!text) {
    return false;
  }
  if (kind === "certificate") {
    return /-----BEGIN CERTIFICATE-----[\s\S]+-----END CERTIFICATE-----/i.test(text);
  }
  if (kind === "privateKey") {
    return /-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----[\s\S]+-----END [A-Z0-9 ]*PRIVATE KEY-----/i.test(text);
  }
  return /-----BEGIN [A-Z0-9 ]+-----[\s\S]+-----END [A-Z0-9 ]+-----/i.test(text);
}

function isTakCertUploadLike(value = "") {
  const text = String(value || "").trim();
  if (!text) {
    return false;
  }
  if (isPemLike(text)) {
    return true;
  }
  return /^data:[^;]+;base64,[a-z0-9+/=\s]+$/i.test(text);
}

function summarizeTakProfileRow(row) {
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    label: row.label,
    serverHost: row.server_host,
    serverPort: Number(row.server_port ?? 8089),
    transport: row.transport,
    enrollForClientCert: Boolean(row.enroll_for_client_cert),
    useAuthentication: Boolean(row.use_authentication),
    username: row.username,
    hasAuthSecret: Boolean(row.auth_secret),
    hasClientCert: Boolean(row.client_cert_pem),
    hasClientCertPassword: Boolean(row.client_cert_password_secret),
    hasCaCert: Boolean(row.ca_cert_pem),
    hasCaCertPassword: Boolean(row.ca_cert_password_secret),
    clientCertFileName: row.client_cert_file_name || "",
    caCertFileName: row.ca_cert_file_name || "",
    clientCertUpdatedAt: row.client_cert_updated_at,
    caCertUpdatedAt: row.ca_cert_updated_at,
    lastTestedAt: row.last_tested_at,
    lastTestStatus: row.last_test_status || "",
  };
}

const TAK_CONNECTOR_IDLE_MS = 2 * 60 * 1000;
const TAK_CONTACT_MAX_AGE_MS = 10 * 60 * 1000;
const takConnectorState = new Map();

function decodeXmlEntities(value = "") {
  return String(value || "")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function parseXmlAttributes(fragment = "") {
  const attributes = {};
  const attrRegex = /([A-Za-z_][\w:.-]*)\s*=\s*(['"])(.*?)\2/g;
  let match = attrRegex.exec(fragment);
  while (match) {
    attributes[match[1]] = decodeXmlEntities(match[3] || "");
    match = attrRegex.exec(fragment);
  }
  return attributes;
}

function extractCotEventsFromBuffer(buffer = "") {
  const events = [];
  let remainder = String(buffer || "");
  while (true) {
    const startIndex = remainder.indexOf("<event");
    if (startIndex < 0) {
      remainder = remainder.slice(-4096);
      break;
    }
    if (startIndex > 0) {
      remainder = remainder.slice(startIndex);
    }
    const endIndex = remainder.indexOf("</event>");
    if (endIndex < 0) {
      break;
    }
    const xml = remainder.slice(0, endIndex + "</event>".length);
    events.push(xml);
    remainder = remainder.slice(endIndex + "</event>".length);
  }
  return { events, remainder };
}

function parseTakCotEvent(xml = "") {
  const eventMatch = String(xml || "").match(/<event\b([^>]*)>/i);
  const pointMatch = String(xml || "").match(/<point\b([^>]*)\/?>/i);
  if (!eventMatch || !pointMatch) {
    return null;
  }

  const eventAttrs = parseXmlAttributes(eventMatch[1]);
  const pointAttrs = parseXmlAttributes(pointMatch[1]);
  const lat = Number(pointAttrs.lat);
  const lon = Number(pointAttrs.lon);
  if (!eventAttrs.uid || !Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }

  const type = String(eventAttrs.type || "");
  if (type && !type.toLowerCase().startsWith("a-")) {
    return null;
  }

  const contactMatch = String(xml || "").match(/<contact\b([^>]*)\/?>/i);
  const groupMatch = String(xml || "").match(/<__group\b([^>]*)\/?>/i);
  const remarksMatch = String(xml || "").match(/<remarks[^>]*>([\s\S]*?)<\/remarks>/i);
  const contactAttrs = contactMatch ? parseXmlAttributes(contactMatch[1]) : {};
  const groupAttrs = groupMatch ? parseXmlAttributes(groupMatch[1]) : {};
  const callsign = (
    contactAttrs.callsign
    || groupAttrs.name
    || decodeXmlEntities((remarksMatch?.[1] || "").trim())
    || eventAttrs.uid
  ).trim();

  return {
    uid: String(eventAttrs.uid).trim(),
    cotType: type,
    callsign,
    lat,
    lon,
    hae: Number.isFinite(Number(pointAttrs.hae)) ? Number(pointAttrs.hae) : null,
    ce: Number.isFinite(Number(pointAttrs.ce)) ? Number(pointAttrs.ce) : null,
    le: Number.isFinite(Number(pointAttrs.le)) ? Number(pointAttrs.le) : null,
    how: String(eventAttrs.how || "").trim(),
    time: String(eventAttrs.time || "").trim(),
    start: String(eventAttrs.start || "").trim(),
    stale: String(eventAttrs.stale || "").trim(),
    team: String(groupAttrs.name || "").trim(),
    role: String(groupAttrs.role || "").trim(),
  };
}

function decodeTakUploadBlob(rawValue = "") {
  const value = String(rawValue || "").trim();
  if (!value) {
    return { kind: "empty", text: "", buffer: null, mimeType: "", nameHint: "" };
  }
  if (value.startsWith("data:")) {
    const match = value.match(/^data:([^;,]+)?(?:;[^,]*)?;base64,([\s\S]+)$/i);
    if (!match) {
      throw new Error("TAK certificate upload is malformed.");
    }
    return {
      kind: "data-url",
      text: "",
      buffer: Buffer.from(match[2].replace(/\s+/g, ""), "base64"),
      mimeType: String(match[1] || "application/octet-stream").toLowerCase(),
      nameHint: "",
    };
  }
  return {
    kind: "text",
    text: value,
    buffer: Buffer.from(value, "utf8"),
    mimeType: isPemLike(value) ? "application/x-pem-file" : "text/plain",
    nameHint: "",
  };
}

function buildTakSocketConfig(profileRow) {
  const host = String(profileRow?.server_host || "").trim();
  const port = Number(profileRow?.server_port || 0);
  const transport = String(profileRow?.transport || "ssl").trim().toLowerCase();
  if (!host || !Number.isFinite(port) || port < 1 || port > 65535) {
    throw new Error("TAK profile is missing a valid host or port.");
  }

  const clientCertRaw = decryptSecret(profileRow.client_cert_pem || "");
  const clientCertPassword = decryptSecret(profileRow.client_cert_password_secret || "");
  const caCertRaw = decryptSecret(profileRow.ca_cert_pem || "");
  const clientCert = decodeTakUploadBlob(clientCertRaw);
  const caCert = decodeTakUploadBlob(caCertRaw);

  if (!clientCertRaw || !clientCertPassword) {
    throw new Error("TAK client certificate bundle or password is missing.");
  }

  const tlsOptions = { host, port };
  let verificationMode = "system";
  let verificationNote = "";

  if (clientCert.kind === "data-url") {
    tlsOptions.pfx = clientCert.buffer;
    tlsOptions.passphrase = clientCertPassword;
  } else if (isPemLike(clientCert.text, { kind: "certificate" })) {
    tlsOptions.cert = clientCert.text;
  } else {
    throw new Error("Client certificate bundle format is not supported.");
  }

  if (!caCertRaw) {
    tlsOptions.rejectUnauthorized = false;
    verificationMode = "unverified";
    verificationNote = "No CA trust bundle was available, so server identity verification is disabled.";
  } else if (caCert.kind === "text" && isPemLike(caCert.text, { kind: "certificate" })) {
    tlsOptions.ca = caCert.text;
    tlsOptions.rejectUnauthorized = true;
    tlsOptions.checkServerIdentity = () => undefined;
    verificationMode = "custom-ca";
    verificationNote = "The uploaded CA trust bundle is used, but hostname mismatch checks are relaxed so direct server IP connections can succeed.";
  } else {
    tlsOptions.rejectUnauthorized = false;
    verificationMode = "p12-truststore-unverified";
    verificationNote = "PKCS#12 truststores cannot be validated directly by this Node connector, so server identity verification is disabled.";
  }

  return {
    host,
    port,
    transport,
    tlsOptions,
    verificationMode,
    verificationNote,
  };
}

function buildTakConnectorKey(userId, profileId) {
  return `${userId}:${profileId}`;
}

function serializeTakConnectorContact(contact) {
  return {
    uid: contact.uid,
    cotType: contact.cotType,
    callsign: contact.callsign,
    lat: contact.lat,
    lon: contact.lon,
    hae: contact.hae,
    ce: contact.ce,
    le: contact.le,
    how: contact.how,
    time: contact.time,
    start: contact.start,
    stale: contact.stale,
    team: contact.team,
    role: contact.role,
    lastSeenAt: contact.lastSeenAt,
  };
}

function pruneTakConnectorContacts(connector) {
  const now = Date.now();
  connector.contacts.forEach((contact, uid) => {
    const staleAt = contact.stale ? Date.parse(contact.stale) : NaN;
    const lastSeenAt = contact.lastSeenAt ? Date.parse(contact.lastSeenAt) : NaN;
    const expired = Number.isFinite(staleAt)
      ? staleAt <= now
      : (Number.isFinite(lastSeenAt) ? (lastSeenAt + TAK_CONTACT_MAX_AGE_MS) <= now : false);
    if (expired) {
      connector.contacts.delete(uid);
    }
  });
}

function summarizeTakConnector(connector) {
  pruneTakConnectorContacts(connector);
  return {
    status: connector.status,
    connected: connector.status === "connected",
    message: connector.lastError || connector.statusMessage || "",
    verificationMode: connector.verificationMode,
    verificationNote: connector.verificationNote || "",
    connectedAt: connector.connectedAt,
    lastMessageAt: connector.lastMessageAt,
    contactCount: connector.contacts.size,
    contacts: [...connector.contacts.values()].map(serializeTakConnectorContact),
  };
}

function closeTakConnectorSocket(connector) {
  if (connector.socket) {
    connector.socket.removeAllListeners();
    connector.socket.destroy();
    connector.socket = null;
  }
}

function stopTakConnector(connector, reason = "stopped") {
  connector.manualStop = true;
  connector.status = reason;
  connector.statusMessage = reason;
  if (connector.reconnectTimer) {
    clearTimeout(connector.reconnectTimer);
    connector.reconnectTimer = null;
  }
  closeTakConnectorSocket(connector);
}

function scheduleTakConnectorReconnect(connector) {
  if (connector.manualStop || connector.reconnectTimer) {
    return;
  }
  connector.status = "reconnecting";
  connector.statusMessage = connector.lastError || "Reconnecting to TAK server...";
  connector.reconnectTimer = setTimeout(() => {
    connector.reconnectTimer = null;
    startTakConnector(connector);
  }, Math.min(30000, 2000 * Math.max(1, connector.reconnectAttempts)));
}

function connectTakSocket(connector) {
  const { transport, tlsOptions, host, port } = connector.connection;
  if (transport === "tcp" || transport === "plain") {
    return net.connect({ host, port });
  }
  return tls.connect(tlsOptions);
}

function startTakConnector(connector) {
  if (connector.manualStop || connector.socket) {
    return connector;
  }
  connector.status = "connecting";
  connector.statusMessage = `Connecting to ${connector.connection.host}:${connector.connection.port}...`;
  connector.lastError = "";

  let socket;
  try {
    socket = connectTakSocket(connector);
  } catch (error) {
    connector.lastError = error.message;
    connector.status = "error";
    connector.statusMessage = error.message;
    scheduleTakConnectorReconnect(connector);
    return connector;
  }

  connector.socket = socket;
  socket.setKeepAlive?.(true, 10000);
  socket.setEncoding?.("utf8");

  const markConnected = () => {
    connector.status = "connected";
    connector.statusMessage = `Connected to ${connector.connection.host}:${connector.connection.port}.`;
    connector.connectedAt = new Date().toISOString();
    connector.lastError = "";
    connector.reconnectAttempts = 0;
  };

  if (socket instanceof tls.TLSSocket) {
    socket.once("secureConnect", markConnected);
  } else {
    socket.once("connect", markConnected);
  }

  socket.on("data", (chunk) => {
    connector.lastAccessAt = Date.now();
    connector.lastMessageAt = new Date().toISOString();
    connector.buffer += String(chunk || "");
    const parsed = extractCotEventsFromBuffer(connector.buffer);
    connector.buffer = parsed.remainder;
    parsed.events.forEach((xml) => {
      const event = parseTakCotEvent(xml);
      if (!event) {
        return;
      }
      connector.contacts.set(event.uid, {
        ...event,
        lastSeenAt: new Date().toISOString(),
      });
    });
    pruneTakConnectorContacts(connector);
  });

  socket.on("error", (error) => {
    connector.lastError = error.message;
    connector.status = "error";
    connector.statusMessage = error.message;
  });

  socket.on("close", () => {
    closeTakConnectorSocket(connector);
    connector.reconnectAttempts += 1;
    if (!connector.manualStop) {
      scheduleTakConnectorReconnect(connector);
    }
  });

  return connector;
}

function ensureTakConnector(userId, profileRow) {
  const key = buildTakConnectorKey(userId, profileRow.id);
  const version = String(profileRow.updated_at || "");
  const existing = takConnectorState.get(key);
  if (existing && existing.profileVersion !== version) {
    stopTakConnector(existing, "profile-updated");
    takConnectorState.delete(key);
  } else if (existing) {
    existing.lastAccessAt = Date.now();
    if (!existing.socket && !existing.reconnectTimer && !existing.manualStop) {
      startTakConnector(existing);
    }
    return existing;
  }

  const connection = buildTakSocketConfig(profileRow);
  const connector = {
    key,
    userId,
    profileId: profileRow.id,
    profileVersion: version,
    connection,
    verificationMode: connection.verificationMode,
    verificationNote: connection.verificationNote,
    socket: null,
    buffer: "",
    contacts: new Map(),
    status: "idle",
    statusMessage: "",
    lastError: "",
    connectedAt: "",
    lastMessageAt: "",
    lastAccessAt: Date.now(),
    reconnectAttempts: 0,
    reconnectTimer: null,
    manualStop: false,
  };
  takConnectorState.set(key, connector);
  startTakConnector(connector);
  return connector;
}

function stopIdleTakConnectors() {
  const now = Date.now();
  takConnectorState.forEach((connector, key) => {
    if ((now - connector.lastAccessAt) > TAK_CONNECTOR_IDLE_MS) {
      stopTakConnector(connector, "idle");
      takConnectorState.delete(key);
    }
  });
}

setInterval(stopIdleTakConnectors, 30000).unref?.();

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

const takProfileItemSchema = z.object({
  id: z.string().min(1).max(200),
  label: z.string().max(120).optional().default(""),
  serverHost: z.string().min(1).max(255),
  serverPort: z.number().int().min(1).max(65535).optional().default(8089),
  transport: z.string().min(1).max(80).optional().default("ssl"),
  enrollForClientCert: z.boolean().optional().default(false),
  useAuthentication: z.boolean().optional().default(false),
  username: z.string().max(120).optional().default(""),
  authSecret: z.string().max(4096).optional(),
  deleteAuthSecret: z.boolean().optional().default(false),
  clientCertData: z.string().max(2000000).optional(),
  clientCertFileName: z.string().max(255).optional().default(""),
  clientCertPassword: z.string().max(4096).optional(),
  deleteClientCert: z.boolean().optional().default(false),
  caCertData: z.string().max(2000000).optional(),
  caCertFileName: z.string().max(255).optional().default(""),
  caCertPassword: z.string().max(4096).optional(),
  deleteCaCert: z.boolean().optional().default(false),
});

const takProfileListSchema = z.object({
  profiles: z.array(takProfileItemSchema).default([])
});

const takProjectBindingListSchema = z.object({
  bindings: z.array(z.object({
    projectId: z.string().uuid(),
    takProfileId: z.string().min(1).max(200).nullable().optional().default(null),
  })).default([])
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

app.get("/api/user/tak-profiles", authRequired, async (request, response) => {
  try {
    const result = await query(
      `select *
       from user_tak_profile
       where owner_user_id = $1
       order by position asc, updated_at desc`,
      [request.user.sub]
    );
    response.json({ profiles: result.rows.map(summarizeTakProfileRow) });
  } catch (error) {
    if (error.code === "42P01") {
      response.json({ profiles: [] });
      return;
    }
    response.status(500).json({ error: error.message });
  }
});

app.put("/api/user/tak-profiles", authRequired, async (request, response) => {
  const parsed = takProfileListSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("begin");
    const existingResult = await client.query(
      "select * from user_tak_profile where owner_user_id = $1",
      [request.user.sub]
    );
    const existingById = new Map(existingResult.rows.map((row) => [row.id, row]));
    const retainedIds = parsed.data.profiles.map((profile) => profile.id);

    for (const [index, profile] of parsed.data.profiles.entries()) {
      const existing = existingById.get(profile.id);

      const authSecret = profile.deleteAuthSecret
        ? ""
        : typeof profile.authSecret === "string"
          ? (profile.authSecret.trim() ? encryptSecret(profile.authSecret.trim()) : "")
          : (existing?.auth_secret ?? "");

      let clientCertPem = existing?.client_cert_pem ?? "";
      let clientCertFileName = existing?.client_cert_file_name ?? "";
      let clientCertUpdatedAt = existing?.client_cert_updated_at ?? null;
      let clientCertPasswordSecret = existing?.client_cert_password_secret ?? "";
      if (profile.deleteClientCert) {
        clientCertPem = "";
        clientCertFileName = "";
        clientCertUpdatedAt = null;
        clientCertPasswordSecret = "";
      } else if (typeof profile.clientCertData === "string") {
        if (!isTakCertUploadLike(profile.clientCertData)) {
          throw new Error(`Client certificate for "${profile.label || profile.serverHost}" must be a certificate bundle or PEM file.`);
        }
        if (!String(profile.clientCertPassword || "").trim()) {
          throw new Error(`Client certificate password is required for "${profile.label || profile.serverHost}".`);
        }
        clientCertPem = encryptSecret(profile.clientCertData.trim());
        clientCertFileName = profile.clientCertFileName ?? "";
        clientCertUpdatedAt = new Date().toISOString();
        clientCertPasswordSecret = encryptSecret(String(profile.clientCertPassword).trim());
      } else if (typeof profile.clientCertPassword === "string" && profile.clientCertPassword.trim() && clientCertPem) {
        clientCertPasswordSecret = encryptSecret(profile.clientCertPassword.trim());
      }

      let caCertPem = existing?.ca_cert_pem ?? "";
      let caCertFileName = existing?.ca_cert_file_name ?? "";
      let caCertUpdatedAt = existing?.ca_cert_updated_at ?? null;
      let caCertPasswordSecret = existing?.ca_cert_password_secret ?? "";
      if (profile.deleteCaCert) {
        caCertPem = "";
        caCertFileName = "";
        caCertUpdatedAt = null;
        caCertPasswordSecret = "";
      } else if (typeof profile.caCertData === "string") {
        if (!isTakCertUploadLike(profile.caCertData)) {
          throw new Error(`CA certificate for "${profile.label || profile.serverHost}" must be a certificate bundle or PEM file.`);
        }
        if (!String(profile.caCertPassword || "").trim()) {
          throw new Error(`Certificate Authority password is required for "${profile.label || profile.serverHost}".`);
        }
        caCertPem = encryptSecret(profile.caCertData.trim());
        caCertFileName = profile.caCertFileName ?? "";
        caCertUpdatedAt = new Date().toISOString();
        caCertPasswordSecret = encryptSecret(String(profile.caCertPassword).trim());
      } else if (typeof profile.caCertPassword === "string" && profile.caCertPassword.trim() && caCertPem) {
        caCertPasswordSecret = encryptSecret(profile.caCertPassword.trim());
      }

      await client.query(
        `insert into user_tak_profile (
           id, owner_user_id, label, server_host, server_port, transport, enroll_for_client_cert, use_authentication, username, auth_secret,
           client_cert_pem, client_key_pem, ca_cert_pem,
           client_cert_file_name, client_key_file_name, ca_cert_file_name,
           client_cert_updated_at, client_key_updated_at, ca_cert_updated_at,
           client_cert_password_secret, ca_cert_password_secret,
           position, updated_at
         )
         values (
           $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
           $11, $12, $13,
           $14, $15, $16,
           $17, $18, $19,
           $20, $21,
           $22, now()
         )
         on conflict (id) do update set
           label = excluded.label,
           server_host = excluded.server_host,
           server_port = excluded.server_port,
           transport = excluded.transport,
           enroll_for_client_cert = excluded.enroll_for_client_cert,
           use_authentication = excluded.use_authentication,
           username = excluded.username,
           auth_secret = excluded.auth_secret,
           client_cert_pem = excluded.client_cert_pem,
           client_key_pem = excluded.client_key_pem,
           ca_cert_pem = excluded.ca_cert_pem,
           client_cert_file_name = excluded.client_cert_file_name,
           client_key_file_name = excluded.client_key_file_name,
           ca_cert_file_name = excluded.ca_cert_file_name,
           client_cert_updated_at = excluded.client_cert_updated_at,
           client_key_updated_at = excluded.client_key_updated_at,
           ca_cert_updated_at = excluded.ca_cert_updated_at,
           client_cert_password_secret = excluded.client_cert_password_secret,
           ca_cert_password_secret = excluded.ca_cert_password_secret,
           position = excluded.position,
           updated_at = now()
         where user_tak_profile.owner_user_id = excluded.owner_user_id`,
        [
          profile.id,
          request.user.sub,
          profile.label ?? "",
          profile.serverHost.trim(),
          profile.serverPort ?? 8089,
          profile.transport ?? "ssl",
          Boolean(profile.enrollForClientCert),
          Boolean(profile.useAuthentication),
          profile.username ?? "",
          authSecret,
          clientCertPem,
          "",
          caCertPem,
          clientCertFileName,
          "",
          caCertFileName,
          clientCertUpdatedAt,
          null,
          caCertUpdatedAt,
          clientCertPasswordSecret,
          caCertPasswordSecret,
          index,
        ]
      );
    }

    if (retainedIds.length) {
      await client.query(
        "delete from user_tak_profile where owner_user_id = $1 and not (id = any($2::text[]))",
        [request.user.sub, retainedIds]
      );
    } else {
      await client.query("delete from user_tak_profile where owner_user_id = $1", [request.user.sub]);
    }

    const result = await client.query(
      `select *
       from user_tak_profile
       where owner_user_id = $1
       order by position asc, updated_at desc`,
      [request.user.sub]
    );
    await client.query("commit");
    response.json({ profiles: result.rows.map(summarizeTakProfileRow) });
  } catch (error) {
    await client.query("rollback");
    if (error.code === "42P01") {
      response.status(503).json({ error: "TAK profile storage not available — run the latest database migration." });
      return;
    }
    response.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

app.delete("/api/user/tak-profiles/:profileId", authRequired, async (request, response) => {
  try {
    const result = await query(
      "delete from user_tak_profile where id = $1 and owner_user_id = $2",
      [request.params.profileId, request.user.sub]
    );
    if (result.rowCount === 0) {
      response.status(404).json({ error: "TAK profile not found." });
      return;
    }
    response.status(204).end();
  } catch (error) {
    if (error.code === "42P01") {
      response.status(503).json({ error: "TAK profile storage not available — run the latest database migration." });
      return;
    }
    response.status(500).json({ error: error.message });
  }
});

app.post("/api/user/tak-profiles/:profileId/test", authRequired, async (request, response) => {
  try {
    const result = await query(
      "select * from user_tak_profile where id = $1 and owner_user_id = $2",
      [request.params.profileId, request.user.sub]
    );
    if (result.rowCount === 0) {
      response.status(404).json({ error: "TAK profile not found." });
      return;
    }
    const profile = result.rows[0];
    const hasCore = Boolean(profile.server_host && profile.server_port && profile.transport);
    const hasTakCerts = Boolean(
      profile.client_cert_pem
      && profile.ca_cert_pem
      && profile.client_cert_password_secret
      && profile.ca_cert_password_secret
    );
    const status = hasCore ? (hasTakCerts ? "ready" : "incomplete") : "error";
    const checkedAt = new Date().toISOString();
    const message = hasCore
      ? (hasTakCerts
        ? "Profile is bridge-ready. Live TAK transport can use this CA and client certificate bundle configuration."
        : "Server settings are saved, but the CA certificate, client certificate, or their passwords are still missing.")
      : "Profile is missing required TAK server settings.";

    await query(
      "update user_tak_profile set last_tested_at = $3, last_test_status = $4, updated_at = now() where id = $1 and owner_user_id = $2",
      [request.params.profileId, request.user.sub, checkedAt, status]
    );

    response.json({
      ok: status === "ready",
      status,
      checkedAt,
      message,
      requirements: {
        hasServerHost: Boolean(profile.server_host),
        hasServerPort: Boolean(profile.server_port),
        hasTransport: Boolean(profile.transport),
        hasAuthSecret: Boolean(profile.auth_secret),
        hasClientCert: Boolean(profile.client_cert_pem),
        hasClientCertPassword: Boolean(profile.client_cert_password_secret),
        hasCaCert: Boolean(profile.ca_cert_pem),
        hasCaCertPassword: Boolean(profile.ca_cert_password_secret),
      },
    });
  } catch (error) {
    if (error.code === "42P01") {
      response.status(503).json({ error: "TAK profile storage not available — run the latest database migration." });
      return;
    }
    response.status(500).json({ error: error.message });
  }
});

app.get("/api/user/tak-project-bindings", authRequired, async (request, response) => {
  try {
    const result = await query(
      `select project_id as "projectId", tak_profile_id as "takProfileId"
       from project_tak_binding
       where owner_user_id = $1
       order by updated_at desc`,
      [request.user.sub]
    );
    response.json({ bindings: result.rows });
  } catch (error) {
    if (error.code === "42P01") {
      response.json({ bindings: [] });
      return;
    }
    response.status(500).json({ error: error.message });
  }
});

app.put("/api/user/tak-project-bindings", authRequired, async (request, response) => {
  const parsed = takProjectBindingListSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const normalizedBindings = parsed.data.bindings.filter((binding) => binding.takProfileId);
  const projectIds = [...new Set(parsed.data.bindings.map((binding) => binding.projectId))];
  const profileIds = [...new Set(normalizedBindings.map((binding) => binding.takProfileId))];

  const client = await pool.connect();
  try {
    await client.query("begin");
    if (projectIds.length) {
      const ownedProjects = await client.query(
        "select id from project where owner_user_id = $1 and id = any($2::uuid[])",
        [request.user.sub, projectIds]
      );
      if (ownedProjects.rowCount !== projectIds.length) {
        throw new Error("One or more selected projects are not owned by this user.");
      }
    }
    if (profileIds.length) {
      const ownedProfiles = await client.query(
        "select id from user_tak_profile where owner_user_id = $1 and id = any($2::text[])",
        [request.user.sub, profileIds]
      );
      if (ownedProfiles.rowCount !== profileIds.length) {
        throw new Error("One or more selected TAK profiles are not owned by this user.");
      }
    }

    await client.query("delete from project_tak_binding where owner_user_id = $1", [request.user.sub]);
    for (const binding of normalizedBindings) {
      await client.query(
        `insert into project_tak_binding (project_id, tak_profile_id, owner_user_id)
         values ($1, $2, $3)
         on conflict (project_id) do update set
           tak_profile_id = excluded.tak_profile_id,
           owner_user_id = excluded.owner_user_id,
           updated_at = now()`,
        [binding.projectId, binding.takProfileId, request.user.sub]
      );
    }
    await client.query("commit");
    response.json({ bindings: normalizedBindings });
  } catch (error) {
    await client.query("rollback");
    if (error.code === "42P01") {
      response.status(503).json({ error: "TAK project binding storage not available — run the latest database migration." });
      return;
    }
    response.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

app.get("/api/projects/:projectId/tak-contacts", authRequired, async (request, response) => {
  try {
    const projectResult = await query(
      "select id from project where id = $1 and owner_user_id = $2",
      [request.params.projectId, request.user.sub]
    );
    if (projectResult.rowCount === 0) {
      response.status(404).json({ error: "Project not found." });
      return;
    }

    const bindingResult = await query(
      `select t.*, p.project_id
       from project_tak_binding p
       join user_tak_profile t
         on t.id = p.tak_profile_id
        and t.owner_user_id = p.owner_user_id
       where p.project_id = $1
         and p.owner_user_id = $2`,
      [request.params.projectId, request.user.sub]
    );

    if (bindingResult.rowCount === 0) {
      response.json({
        linked: false,
        status: "unlinked",
        message: "This project is not linked to a TAK server.",
        contacts: [],
      });
      return;
    }

    const profileRow = bindingResult.rows[0];
    const connector = ensureTakConnector(request.user.sub, profileRow);
    connector.lastAccessAt = Date.now();
    const snapshot = summarizeTakConnector(connector);

    response.json({
      linked: true,
      profile: summarizeTakProfileRow(profileRow),
      ...snapshot,
    });
  } catch (error) {
    response.status(500).json({ error: error.message });
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
