#!/usr/bin/env node
/**
 * RF Planner local proxy
 *
 * Two modes — both run on the same process:
 *
 *   HTTP mode  (default, port 8787)
 *     Forwards /v1/chat/completions → GenAI.mil
 *     Works from http:// origins only (local dev).
 *
 *   HTTPS mode  (--local-model, port 8788)
 *     Self-signed TLS so https:// pages can call it without mixed-content errors.
 *     Forwards /v1/local/chat/completions → your local model (Ollama / LM Studio /
 *     llama.cpp), and optionally /v1/chat/completions → GenAI.mil as well.
 *
 * Usage
 *   node genai-proxy.js                  # GenAI.mil proxy only (HTTP)
 *   node genai-proxy.js --local-model    # also start HTTPS bridge for local models
 *
 * First run with --local-model generates a self-signed cert in ./certs/ and prints
 * instructions for trusting it once in the browser.
 */

"use strict";

const http  = require("http");
const https = require("https");
const fs    = require("fs");
const path  = require("path");
const { execSync, spawnSync } = require("child_process");

// ─── Config ──────────────────────────────────────────────────────────────────

const HTTP_PORT  = 8787;
const HTTPS_PORT = 8788;
const GENAI_BASE_URL = "https://api.genai.mil/v1";
const GENAI_CHAT_URL = `${GENAI_BASE_URL}/chat/completions`;
const GENAI_MODELS_URL = `${GENAI_BASE_URL}/models`;
const CERTS_DIR  = path.join(__dirname, "certs");
const CERT_FILE  = path.join(CERTS_DIR, "proxy.crt");
const KEY_FILE   = path.join(CERTS_DIR, "proxy.key");

const LOCAL_MODEL_MODE = process.argv.includes("--local-model");

// Default local model endpoint — Ollama. Override with env var.
// LM Studio: http://localhost:1234/v1/chat/completions
// llama.cpp: http://localhost:8080/v1/chat/completions
const LOCAL_MODEL_ENDPOINT = process.env.LOCAL_MODEL_URL
  || "http://localhost:11434/v1/chat/completions";

// ─── CORS headers ────────────────────────────────────────────────────────────

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, X-Api-Key, X-Local-Model-Url",
  "Access-Control-Max-Age":       "86400",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function writeJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json", ...CORS });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let buf = "";
    req.on("data", (chunk) => {
      buf += chunk;
      if (buf.length > 4 * 1024 * 1024) req.destroy(new Error("Request too large."));
    });
    req.on("end",   () => resolve(buf));
    req.on("error", reject);
  });
}

async function proxyPost(targetUrl, headers, body) {
  const res = await fetch(targetUrl, { method: "POST", headers, body });
  const text = await res.text();
  return { status: res.status, contentType: res.headers.get("content-type") || "application/json", text };
}

async function proxyGet(targetUrl, headers) {
  const res = await fetch(targetUrl, { method: "GET", headers });
  const text = await res.text();
  return { status: res.status, contentType: res.headers.get("content-type") || "application/json", text };
}

// ─── Certificate generation ───────────────────────────────────────────────────

function ensureCert() {
  if (fs.existsSync(CERT_FILE) && fs.existsSync(KEY_FILE)) return;

  console.log("\n🔐  Generating self-signed TLS certificate for localhost...");
  fs.mkdirSync(CERTS_DIR, { recursive: true });

  // Try openssl (available on macOS, Linux, Git Bash on Windows)
  const openssl = spawnSync("openssl", [
    "req", "-x509", "-newkey", "rsa:2048",
    "-keyout", KEY_FILE,
    "-out",    CERT_FILE,
    "-days",   "3650",
    "-nodes",
    "-subj",   "/CN=localhost",
    "-addext", "subjectAltName=IP:127.0.0.1,DNS:localhost",
  ], { stdio: "pipe" });

  if (openssl.status !== 0) {
    console.error("openssl not found. Install Git for Windows (includes OpenSSL) or use WSL.");
    console.error("Alternatively set LOCAL_MODEL_URL to an http:// address and access the app over http://.");
    process.exit(1);
  }

  console.log(`✅  Certificate written to ${CERTS_DIR}`);
  printTrustInstructions();
}

function printTrustInstructions() {
  const platform = process.platform;
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(" ONE-TIME SETUP — trust the self-signed certificate");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  if (platform === "win32") {
    console.log(`
  Run this once in PowerShell (as Administrator):

    Import-Certificate -FilePath "${CERT_FILE}" -CertStoreLocation Cert:\\LocalMachine\\Root

  Then restart Chrome / Edge.
`);
  } else if (platform === "darwin") {
    console.log(`
  Run this once in Terminal:

    sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain "${CERT_FILE}"

  Then restart Chrome / Safari.
`);
  } else {
    console.log(`
  Linux — Chrome:
    Go to chrome://settings/certificates → Authorities → Import → ${CERT_FILE}
    Check "Trust this certificate for identifying websites."

  Linux — Firefox:
    Go to about:preferences#privacy → View Certificates → Authorities → Import → ${CERT_FILE}
`);
  }
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

// ─── Request handlers ─────────────────────────────────────────────────────────

async function handleGenAiMil(req, res) {
  let body;
  try { body = await readBody(req); } catch { return writeJson(res, 400, { error: { message: "Could not read request body." } }); }

  const authHeader = req.headers["authorization"];
  const xApiKey    = req.headers["x-api-key"];
  if (!authHeader && !xApiKey) {
    return writeJson(res, 401, { error: { message: "Missing Authorization or X-Api-Key header." } });
  }
  const bareKey = xApiKey ?? authHeader.replace(/^Bearer\s+/i, "");

  try {
    const upstream = await proxyPost(GENAI_CHAT_URL, {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${bareKey}`,
    }, body);
    res.writeHead(upstream.status, { "Content-Type": upstream.contentType, ...CORS });
    res.end(upstream.text);
  } catch (err) {
    writeJson(res, 502, { error: { message: err.message || "Upstream request failed." } });
  }
}

async function handleGenAiMilModels(req, res) {
  const authHeader = req.headers["authorization"];
  const xApiKey = req.headers["x-api-key"];
  if (!authHeader && !xApiKey) {
    return writeJson(res, 401, { error: { message: "Missing Authorization or X-Api-Key header." } });
  }
  const bareKey = xApiKey ?? authHeader.replace(/^Bearer\s+/i, "");

  try {
    const upstream = await proxyGet(GENAI_MODELS_URL, {
      "Authorization": `Bearer ${bareKey}`,
    });
    res.writeHead(upstream.status, { "Content-Type": upstream.contentType, ...CORS });
    res.end(upstream.text);
  } catch (err) {
    writeJson(res, 502, { error: { message: err.message || "Upstream request failed." } });
  }
}

async function handleLocalModel(req, res) {
  let body;
  try { body = await readBody(req); } catch { return writeJson(res, 400, { error: { message: "Could not read request body." } }); }

  // The browser can pass a custom endpoint via header; fall back to env/default.
  const targetUrl = req.headers["x-local-model-url"] || LOCAL_MODEL_ENDPOINT;

  // Validate it points at localhost — refuse to relay to external addresses.
  let parsed;
  try { parsed = new URL(targetUrl); } catch {
    return writeJson(res, 400, { error: { message: "Invalid X-Local-Model-Url header." } });
  }
  const host = parsed.hostname;
  if (host !== "localhost" && host !== "127.0.0.1" && host !== "::1") {
    return writeJson(res, 403, { error: { message: "Local model proxy only forwards to localhost addresses." } });
  }

  // Inject model from request body if not already set (convenience for Ollama which
  // requires the model field even for the completions endpoint).
  let parsedBody = {};
  try { parsedBody = JSON.parse(body); } catch {}

  try {
    const upstream = await proxyPost(targetUrl, { "Content-Type": "application/json" }, body);
    res.writeHead(upstream.status, { "Content-Type": upstream.contentType, ...CORS });
    res.end(upstream.text);
  } catch (err) {
    const hint = targetUrl.includes("11434")
      ? " Is Ollama running? (ollama serve)"
      : targetUrl.includes("1234")
        ? " Is LM Studio running with the local server enabled?"
        : targetUrl.includes("8080")
          ? " Is llama.cpp server running? (./server -m model.gguf)"
          : "";
    writeJson(res, 502, { error: { message: `Could not reach local model at ${targetUrl}.${hint}` } });
  }
}

// ─── /health endpoint ────────────────────────────────────────────────────────

async function handleLocalModelHealth(req, res) {
  // Try to reach the local model with a lightweight request.
  const targetUrl = req.headers["x-local-model-url"] || LOCAL_MODEL_ENDPOINT;
  let reachable = false;
  let models = [];

  try {
    // Ollama exposes GET /api/tags; LM Studio exposes GET /v1/models
    const base = new URL(targetUrl);
    const ollamaTagsUrl = `${base.protocol}//${base.host}/api/tags`;
    const openaiModelsUrl = `${base.protocol}//${base.host}/v1/models`;

    const tryFetch = async (url) => {
      const r = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (!r.ok) return null;
      return r.json();
    };

    let data = await tryFetch(ollamaTagsUrl).catch(() => null);
    if (data?.models) {
      reachable = true;
      models = data.models.map((m) => m.name ?? m.model ?? "").filter(Boolean);
    } else {
      data = await tryFetch(openaiModelsUrl).catch(() => null);
      if (data?.data) {
        reachable = true;
        models = data.data.map((m) => m.id ?? "").filter(Boolean);
      }
    }
  } catch {}

  res.writeHead(200, { "Content-Type": "application/json", ...CORS });
  res.end(JSON.stringify({ reachable, models, endpoint: LOCAL_MODEL_ENDPOINT }));
}

// ─── Router ───────────────────────────────────────────────────────────────────

function createRouter(enableLocalModel) {
  return async function router(req, res) {
    if (req.method === "OPTIONS") {
      res.writeHead(204, CORS);
      res.end();
      return;
    }

    const url = req.url.split("?")[0];

    // GenAI.mil proxy (HTTP server only)
    if (req.method === "POST" && url === "/v1/chat/completions") {
      return handleGenAiMil(req, res);
    }
    if (req.method === "GET" && url === "/v1/models") {
      return handleGenAiMilModels(req, res);
    }

    if (enableLocalModel) {
      if (req.method === "POST" && url === "/v1/local/chat/completions") {
        return handleLocalModel(req, res);
      }
      if (req.method === "GET" && url === "/v1/local/health") {
        return handleLocalModelHealth(req, res);
      }
    }

    writeJson(res, 404, { error: { message: "Not found." } });
  };
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

// HTTP server — GenAI.mil proxy
const httpServer = http.createServer(createRouter(false));
httpServer.listen(HTTP_PORT, "127.0.0.1", () => {
  console.log(`\n🌐  GenAI.mil proxy   →  http://127.0.0.1:${HTTP_PORT}/v1/chat/completions`);
  console.log(`🔎  Model discovery   →  http://127.0.0.1:${HTTP_PORT}/v1/models`);
});

if (LOCAL_MODEL_MODE) {
  ensureCert();

  const tlsOptions = {
    key:  fs.readFileSync(KEY_FILE),
    cert: fs.readFileSync(CERT_FILE),
  };

  const httpsServer = https.createServer(tlsOptions, createRouter(true));
  httpsServer.listen(HTTPS_PORT, "127.0.0.1", () => {
    console.log(`🤖  Local model proxy →  https://127.0.0.1:${HTTPS_PORT}/v1/local/chat/completions`);
    console.log(`🔍  Model health      →  https://127.0.0.1:${HTTPS_PORT}/v1/local/health`);
    console.log(`\n    Forwarding to: ${LOCAL_MODEL_ENDPOINT}`);
    console.log("    Override with: LOCAL_MODEL_URL=http://localhost:1234/v1/chat/completions node genai-proxy.js --local-model\n");

    if (fs.existsSync(CERT_FILE)) {
      const certAge = (Date.now() - fs.statSync(CERT_FILE).mtimeMs) / 1000;
      if (certAge < 30) {
        // Just generated — instructions already printed by ensureCert
      } else {
        console.log(`    Certificate: ${CERT_FILE} (run with a fresh --local-model flag to regenerate if expired)\n`);
      }
    }
  });
}

process.on("SIGINT",  () => { console.log("\nProxy stopped."); process.exit(0); });
process.on("SIGTERM", () => { console.log("\nProxy stopped."); process.exit(0); });
