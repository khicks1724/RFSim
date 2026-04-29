# RF Sim

RF Sim is a browser-based RF planning and analysis web app for building tactical communications and EW scenarios, placing emitters on a live map, running terrain-aware coverage analysis, organizing unit structures, and generating planning products with AI assistance.

The primary way to use the app is the hosted site:

**https://www.rfsim.us**

This repository contains the web client, local helper services, and the optional backend/API used for authenticated projects, snapshots, analytics, and shared deployments.

## What The App Does

RF Sim currently includes four major workspace views:

- `PLAN` for building a table of organization and creating unit hierarchies with MIL-STD2525 icons
- `MAP` for placing radios, jammers, relays, receivers, overlays, routes, DTED terrain, and other scenario content on a 2D map with linked 3D Cesium viewing
- `TOPOLOGY` for visualizing network link relationships and connection quality between placed emitters
- `ANALYZE` for reviewing RF analytics, terrain impacts, conflicts, frequency distribution, and emitter summaries

Additional capabilities in the current app:

- 2D Leaflet map and synchronized 3D Cesium scene
- Terrain-aware LOS and propagation analysis
- Building-aware propagation when Cesium terrain/buildings are enabled
- DTED import and custom terrain source support
- Import of `GeoJSON`, `KML`, `KMZ`, and ATAK data package `ZIP` files
- Editable map drawings including circles, rectangles, polylines, and polygons
- Map Contents panel with folders, visibility toggles, search, rename, reorder, and delete
- Project saving, duplication, deletion, and snapshots when signed in
- Guest mode for local/in-browser use without an account
- AI-assisted planning and document generation
- Optional offline data caching through the local data server

## Primary Use

For most users, the correct entry point is the hosted deployment:

`https://www.rfsim.us`

Use the hosted site if you want:

- the normal production experience
- account sign-in and server-backed projects
- snapshots and shared persistence
- admin analytics, if your account has admin access
- the least setup work

Run the repo locally only if you are developing, testing, using guest/local-only workflows, or operating your own deployment.

## Repository Layout

```text
app.js                  Main frontend application logic
index.html              Application shell
styles.css              Frontend styling
app-config.js           Frontend runtime config
simulation-worker.js    Coverage/planning worker
frontend-dev-server.js  Local static server with /api proxy
genai-proxy.js          Local AI relay for GenAI.mil and local model access
local-data-server.js    Local offline tile/elevation/OSM cache server
backend/                Node.js + PostgreSQL API for auth/projects/analytics
deploy/                 Docker Compose + nginx deployment assets
docs/                   Deployment and operational notes
launchers/              Windows/macOS helper launchers
images/                 App imagery and symbology assets
```

## How It Runs

The frontend is mostly client-side. The browser handles:

- UI state and interaction
- map rendering
- Cesium 3D rendering
- most scenario editing
- simulation worker execution
- local persistence for guest sessions, settings, tokens, and some cached data

The optional backend handles:

- user registration and sign-in
- project persistence
- snapshots
- admin analytics
- server-side AI config storage and relays

## Requirements

The exact requirements depend on how you want to run the app.

### Hosted use

- A modern desktop browser
- Chrome or Edge is preferred for the best compatibility

### Frontend-only local use

- Any static web server
- Node.js is recommended because this repo includes a purpose-built frontend dev server

### Full local stack

- Node.js 18+
- PostgreSQL
- Backend dependencies installed from `backend/package.json`
- A browser with WebGL support

### Optional local helper services

- `genai-proxy.js` for GenAI.mil and local model relays
- `local-data-server.js` for offline tile/elevation/OSM caching
- Git for Windows is useful on Windows because the proxy uses OpenSSL from Git to generate local certificates

## Quick Start

### 1. Hosted Site

Open:

```text
https://www.rfsim.us
```

This is the primary supported way to use RF Sim.

### 2. Frontend-Only Local Run

Use this when you want to work locally in guest mode without running the backend.

### Option A: built-in Node frontend server

```powershell
node frontend-dev-server.js
```

Then open:

```text
http://127.0.0.1:8080
```

This is the best local frontend option because it serves the app correctly and can proxy `/api/*` requests to a backend on port `3000` if you later start one.

### Option B: any static server

```powershell
python -m http.server 8080
```

Then open:

```text
http://127.0.0.1:8080
```

If you use a plain static server, backend-only features such as sign-in, saved projects, snapshots, and admin analytics will not work unless you also provide an API endpoint.

### 3. Full Local Development Stack

Use this when you want authenticated projects, snapshots, backend APIs, or to develop the full app locally.

### Backend setup

1. Install backend dependencies.

```powershell
cd backend
npm install
```

2. Copy the backend environment file.

```powershell
Copy-Item .env.example .env
```

3. Create a PostgreSQL database named `ew_sim` or update `DATABASE_URL` in `backend/.env` to point at your database.

Default development values in `backend/.env.example`:

```env
PORT=3000
NODE_ENV=development
APP_ORIGIN=http://localhost:8080
JWT_SECRET=replace-this-before-production
DATABASE_SSL=false
DATABASE_URL=postgres://postgres:postgres@localhost:5432/ew_sim
```

4. Start the backend.

```powershell
node src/server.js
```

### Frontend setup

In a second terminal, from the repo root:

```powershell
node frontend-dev-server.js
```

Then open:

```text
http://127.0.0.1:8080
```

### Windows one-click launcher

If you are on Windows, the repo includes:

```text
launchers/local_run.bat
```

That launcher starts:

- backend API on `3000`
- frontend on `8080`
- AI relay on `8787` and `8788`
- offline data server on `8789`

Use it only after Node.js is installed and your local PostgreSQL/backend configuration is ready.

## Feature Overview

### PLAN View

PLAN is the table-of-organization builder. It currently supports:

- adding units by affiliation, type, and echelon
- arranging parent/child relationships
- auto-layout for hierarchies
- renaming, duplicating, deleting, and linking units
- AI assistance scoped to the PLAN scenario
- `AIGEN` renderer for the existing in-app generated icon style
- `MILSTD` renderer for MIL-STD-2525-style symbology built from vendored Esri assets

### MAP View

MAP is the main scenario workspace. It supports:

- placing emitters and RF/EW assets
- configuring frequencies, power, antenna settings, and propagation options
- drawing shapes and planning regions
- importing terrain and geospatial overlays
- browsing content in Map Contents
- switching between 2D and Cesium 3D
- terrain sampling and LOS inspection
- offline download and local cache workflows

### TOPOLOGY View

TOPOLOGY summarizes network relationships derived from placed emitters and scenario state. It is used to inspect:

- link connections
- link quality
- parent/child or network structure at a glance

### ANALYZE View

ANALYZE is the RF dashboard. It currently includes:

- coverage summaries
- frequency distribution charts
- terrain impact summaries
- conflict detection
- waveform/configuration summaries
- AI-assisted analysis based on current scenario state

## Imports And Data

RF Sim currently supports importing:

- `GeoJSON`
- `KML`
- `KMZ`
- ATAK data package `ZIP`
- DTED terrain files

Imported content can be organized and managed from Map Contents. Some large imported geometry, especially KMZ-derived content, is intentionally kept in browser storage rather than the server project payload.

## Terrain, 3D, And Propagation

The app can operate with different terrain levels:

- no terrain
- local DTED
- Cesium World Terrain
- custom Cesium terrain URL

Propagation modes in the current app include:

- free-space style calculations
- terrain-aware propagation
- terrain plus weather
- buildings plus weather
- HF/NVIS workflows

Cesium support enables:

- 3D terrain
- imagery streaming
- Google Photorealistic 3D Tiles for visualization
- OSM building obstruction modeling when enabled

## Cesium Token Setup

A Cesium Ion token is required for the full Cesium streaming feature set.

Without a token, the app still works, but some terrain/building features are reduced or unavailable.

You can provide a token through the app settings/UI. The app also supports a site-wide default token through `app-config.js`.

Use a restricted token for deployed environments. Do not rely on an unrestricted token in public source or public deployments.

## AI Providers

The app currently supports these AI provider modes:

- `GenAI.mil (STARK)`
- `Anthropic (Claude)`
- `Local Model (Ollama / LM Studio / llama.cpp-compatible relay)`

AI is used for:

- planning assistance
- document generation
- scenario interrogation
- topology and analysis support
- RF and EW narrative generation

For hosted-site use with GenAI.mil or local models, the app can use the included local relay:

```powershell
node genai-proxy.js --local-model
```

The relay exposes:

- `http://127.0.0.1:8787` for HTTP fallback flows
- `https://127.0.0.1:8788` for the secure localhost relay

The frontend contains guided setup text for these provider modes in the Settings UI.

## Offline Data Server

The repo includes an optional local cache server:

```powershell
node local-data-server.js
```

It serves previously cached:

- raster tiles
- elevation data
- OSM building data

The app can detect this service automatically and use it for offline/local workflows. The offline workflow is driven from the app's "Download for Offline Use" UI.

## Accounts, Projects, And Persistence

When the backend is available, signed-in users get:

- persistent projects
- project duplication
- project deletion
- snapshots
- server-backed AI configuration

Guest mode is also supported. In guest mode:

- the app remains usable
- state is local/browser-scoped
- server-backed projects are unavailable
- backend analytics and account features are unavailable

## Deployment

For shared multi-user deployment, use the assets under:

- `deploy/`
- `docs/aws-ec2-production.md`

The deployment path is:

- frontend served behind nginx
- backend API in Node.js
- PostgreSQL for persistence
- optional HTTPS termination and reverse proxying through nginx/Certbot

See the deployment docs for the production stack details.

## Running Checks

There is no single root `package.json` at the repo top level. The most relevant built-in checks are currently:

```powershell
node --check app.js
cd backend
npm run check
```

## Browser Notes

For the best experience, use a current Chromium-based browser.

Some features depend on browser/platform support:

- Web Serial GPS requires Chrome or Edge with Web Serial support
- browser geolocation may require HTTPS or localhost
- Cesium 3D features require WebGL-capable hardware/browser support
- AI relays and local model access require local helper services when using those modes

## Operational Notes

- RF Sim is a planning and scenario-support tool, not a certified RF engineering package.
- Terrain, building, and propagation outputs are approximations and should be validated before operational use.
- Imported geospatial data should be reviewed for correctness before relying on it.
- External imagery, terrain, AI, and auth services depend on network availability and correct credentials/configuration.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidance.
