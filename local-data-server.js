#!/usr/bin/env node
/**
 * RF Planner local data server  (port 8789)
 *
 * Serves map tiles, elevation data, and OSM building files that were
 * previously downloaded via the "Download for Offline" tool in the app.
 *
 * Directory layout under ./offline-data/
 *   tiles/{source}/{z}/{x}/{y}.png      — raster map tiles
 *   elevation/{z}/{x}/{y}.json          — elevation grid JSON files
 *   osm/{bbox_key}.geojson              — OSM building GeoJSON
 *
 * Endpoints
 *   GET /health                         — { ok:true, tileCount, elevCount, osmCount }
 *   GET /tiles/{source}/{z}/{x}/{y}.png — serve cached tile image
 *   GET /elevation/{z}/{x}/{y}.json     — serve cached elevation JSON
 *   GET /osm/{bbox_key}.geojson         — serve cached OSM GeoJSON
 *   GET /inventory                      — list all cached regions/sources
 *   DELETE /cache                       — wipe entire offline-data directory
 *
 * The app auto-detects this server at startup (same way as the genai proxy)
 * and switches imagery/elevation sources to local when available.
 */

"use strict";

const http   = require("http");
const fs     = require("fs");
const path   = require("path");
const crypto = require("crypto");

const PORT       = 8789;
const DATA_DIR   = path.join(__dirname, "offline-data");
const TILES_DIR  = path.join(DATA_DIR, "tiles");
const ELEV_DIR   = path.join(DATA_DIR, "elevation");
const OSM_DIR    = path.join(DATA_DIR, "osm");

// ─── Bootstrap directories ───────────────────────────────────────────────────

[DATA_DIR, TILES_DIR, ELEV_DIR, OSM_DIR].forEach((d) => fs.mkdirSync(d, { recursive: true }));

// ─── CORS ────────────────────────────────────────────────────────────────────

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age":       "86400",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function send(res, status, body, contentType = "application/json") {
  const buf = typeof body === "string" ? Buffer.from(body) : body;
  res.writeHead(status, { "Content-Type": contentType, "Content-Length": buf.length, ...CORS });
  res.end(buf);
}

function sendJson(res, status, obj) {
  send(res, status, JSON.stringify(obj));
}

function countFiles(dir) {
  let total = 0;
  if (!fs.existsSync(dir)) return 0;
  function walk(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(path.join(d, entry.name));
      else total++;
    }
  }
  walk(dir);
  return total;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => {
      chunks.push(c);
      if (chunks.reduce((s, b) => s + b.length, 0) > 64 * 1024 * 1024) {
        req.destroy(new Error("Payload too large"));
      }
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function rmrf(dir) {
  if (!fs.existsSync(dir)) return;
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

// ─── Route handlers ──────────────────────────────────────────────────────────

function handleHealth(res) {
  sendJson(res, 200, {
    ok: true,
    tileCount: countFiles(TILES_DIR),
    elevCount: countFiles(ELEV_DIR),
    osmCount:  countFiles(OSM_DIR),
  });
}

function handleTile(res, parts) {
  // parts: ["tiles", source, z, x, "y.png"]
  if (parts.length < 5) return sendJson(res, 400, { error: "Bad tile path" });
  const [, source, z, x, yfile] = parts;
  const filePath = path.join(TILES_DIR, source, z, x, yfile);
  if (!filePath.startsWith(TILES_DIR)) return sendJson(res, 400, { error: "Invalid path" });
  if (!fs.existsSync(filePath)) return sendJson(res, 404, { error: "Tile not found" });
  const buf = fs.readFileSync(filePath);
  send(res, 200, buf, "image/png");
}

function handleElevation(res, parts) {
  // parts: ["elevation", z, x, "y.json"]
  if (parts.length < 4) return sendJson(res, 400, { error: "Bad elevation path" });
  const [, z, x, yfile] = parts;
  const filePath = path.join(ELEV_DIR, z, x, yfile);
  if (!filePath.startsWith(ELEV_DIR)) return sendJson(res, 400, { error: "Invalid path" });
  if (!fs.existsSync(filePath)) return sendJson(res, 404, { error: "Elevation not found" });
  const data = fs.readFileSync(filePath, "utf8");
  send(res, 200, data, "application/json");
}

function handleOsm(res, parts) {
  // parts: ["osm", "bbox_key.geojson"]
  if (parts.length < 2) return sendJson(res, 400, { error: "Bad OSM path" });
  const filePath = path.join(OSM_DIR, parts[1]);
  if (!filePath.startsWith(OSM_DIR)) return sendJson(res, 400, { error: "Invalid path" });
  if (!fs.existsSync(filePath)) return sendJson(res, 404, { error: "OSM file not found" });
  const data = fs.readFileSync(filePath, "utf8");
  send(res, 200, data, "application/json");
}

function handleInventory(res) {
  const sources = fs.existsSync(TILES_DIR)
    ? fs.readdirSync(TILES_DIR).filter((e) => fs.statSync(path.join(TILES_DIR, e)).isDirectory())
    : [];
  const osmFiles = fs.existsSync(OSM_DIR)
    ? fs.readdirSync(OSM_DIR).filter((f) => f.endsWith(".geojson"))
    : [];
  sendJson(res, 200, {
    tileSources: sources,
    tileCount:   countFiles(TILES_DIR),
    elevCount:   countFiles(ELEV_DIR),
    osmFiles,
    dataDir:     DATA_DIR,
  });
}

async function handleStoreTile(req, res, parts) {
  // POST /store/tiles/{source}/{z}/{x}/{y}.png  body=raw PNG bytes
  if (parts.length < 6) return sendJson(res, 400, { error: "Bad store tile path" });
  const [,, source, z, x, yfile] = parts;
  const dir = path.join(TILES_DIR, source, z, x);
  const filePath = path.join(dir, yfile);
  if (!filePath.startsWith(TILES_DIR)) return sendJson(res, 400, { error: "Invalid path" });
  fs.mkdirSync(dir, { recursive: true });
  const body = await readBody(req);
  fs.writeFileSync(filePath, body);
  sendJson(res, 200, { ok: true, path: filePath });
}

async function handleStoreElevation(req, res, parts) {
  // POST /store/elevation/{z}/{x}/{y}.json  body=JSON string
  if (parts.length < 5) return sendJson(res, 400, { error: "Bad store elevation path" });
  const [,, z, x, yfile] = parts;
  const dir = path.join(ELEV_DIR, z, x);
  const filePath = path.join(dir, yfile);
  if (!filePath.startsWith(ELEV_DIR)) return sendJson(res, 400, { error: "Invalid path" });
  fs.mkdirSync(dir, { recursive: true });
  const body = await readBody(req);
  fs.writeFileSync(filePath, body);
  sendJson(res, 200, { ok: true, path: filePath });
}

async function handleStoreOsm(req, res, parts) {
  // POST /store/osm/{bbox_key}.geojson  body=GeoJSON string
  if (parts.length < 3) return sendJson(res, 400, { error: "Bad store OSM path" });
  const filePath = path.join(OSM_DIR, parts[2]);
  if (!filePath.startsWith(OSM_DIR)) return sendJson(res, 400, { error: "Invalid path" });
  const body = await readBody(req);
  fs.writeFileSync(filePath, body);
  sendJson(res, 200, { ok: true, path: filePath });
}

function handleDeleteCache(res) {
  rmrf(TILES_DIR);
  rmrf(ELEV_DIR);
  rmrf(OSM_DIR);
  sendJson(res, 200, { ok: true, message: "Offline cache cleared." });
}

// ─── Request router ──────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS);
    res.end();
    return;
  }

  const url   = new URL(req.url, `http://localhost:${PORT}`);
  const parts = url.pathname.replace(/^\//, "").split("/");
  const root  = parts[0];

  try {
    if (req.method === "GET") {
      if (root === "health")    return handleHealth(res);
      if (root === "inventory") return handleInventory(res);
      if (root === "tiles")     return handleTile(res, parts);
      if (root === "elevation") return handleElevation(res, parts);
      if (root === "osm")       return handleOsm(res, parts);
    }

    if (req.method === "POST" && root === "store") {
      const sub = parts[1];
      if (sub === "tiles")     return await handleStoreTile(req, res, parts);
      if (sub === "elevation") return await handleStoreElevation(req, res, parts);
      if (sub === "osm")       return await handleStoreOsm(req, res, parts);
    }

    if (req.method === "DELETE" && root === "cache") {
      return handleDeleteCache(res);
    }

    sendJson(res, 404, { error: "Not found" });
  } catch (err) {
    console.error("Error handling request:", err.message);
    sendJson(res, 500, { error: err.message });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`\n📦  RF Planner local data server`);
  console.log(`    Listening on http://127.0.0.1:${PORT}`);
  console.log(`    Data directory: ${DATA_DIR}`);
  console.log(`    Tiles:     ${countFiles(TILES_DIR)} files`);
  console.log(`    Elevation: ${countFiles(ELEV_DIR)} files`);
  console.log(`    OSM:       ${countFiles(OSM_DIR)} files`);
  console.log(`\n    App will auto-detect this server and use local data when available.\n`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\nPort ${PORT} is already in use. Local data server may already be running.`);
  } else {
    console.error("Server error:", err);
  }
  process.exit(1);
});
