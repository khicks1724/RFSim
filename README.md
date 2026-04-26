# RF Planner

Browser-based RF planning and visualization for building scenarios, placing emitters, running coverage analysis, and reviewing terrain-aware results in 2D and 3D.

## What It Does

- Build RF scenarios on a Leaflet map with a synchronized Cesium 3D view
- Place radios, jammers, relays, and receivers with configurable heights and propagation properties
- Import `GeoJSON`, `KML`, `KMZ`, and ATAK data package `ZIP` overlays as editable map content
- Organize everything in **Map Contents** with folders, search, rename, hide, reorder, and bulk delete
- Draw circles, rectangles, polylines, and polygons directly on the map
- Run coverage simulations with configurable propagation models and view the results as an overlay
- Control how coverage is rendered — transparent, gradient, or shadowed no-LOS areas
- Run terrain-aware Tx/Rx site planning inside a drawn region
- Use the **AI assistant** for PACE planning, SOI/CEOI drafting, spectrum documents, COA support, and live scenario queries
- Save and switch between named projects with per-project autosave

## Architecture

The app is primarily **client-side**.

| File | Purpose |
|---|---|
| `app.js` | UI, map state, imports, Cesium/Leaflet sync, persistence, AI integration |
| `simulation-worker.js` | Coverage, inspection, and planning — runs off the main thread |
| `index.html` + `styles.css` | Application shell and UI |
| `localStorage` | Settings, map state, profiles, AI config, Cesium token, per-project KMZ geometry |

Coverage math runs **in the browser worker on the user's machine**, not on the server. The server handles auth and project storage only.

## Quick Start

### Browser-only (no backend)

Serve the repo with any local web server:

```bash
python -m http.server 8080
# or
npx serve .
```

Open `http://localhost:8080`.

### Hosted multi-user

See [deploy/](deploy/) and [docs/aws-ec2-production.md](docs/aws-ec2-production.md) for the full stack (Node backend + PostgreSQL + nginx on EC2).

```bash
docker compose up -d --build
```

## Core Workflows

### 1 — Place emitters

Click the map to open the emitter placement tool. Configure:

- Radio type (see [Radio Library](#radio-library) below)
- Tx power, frequency, antenna gain, height
- Propagation model and terrain/building settings

### 2 — Import overlays

Drop `GeoJSON`, `KML`, `KMZ`, or ATAK `ZIP` files onto the map. Folder hierarchy, styles, and item names are preserved. KMZ geometry is stored **per project** in browser storage so it survives project switches and page reloads without re-importing.

### 3 — Run coverage

Open the **Simulate** panel, select an emitter, configure the propagation options, and run. Results appear as a color-coded RSSI overlay. Use the render controls to set how no-LOS areas appear:

- **Transparent** — blocked areas show nothing (default)
- **Shadow** — blocked areas show a light gray tint
- **Gradient** — full RSSI gradient regardless of LOS

### 4 — Review in 3D

Switch to **3D View** at any time to see terrain, city mesh, and coverage layers in context.

### 5 — AI planning

Open **AI Chat** and ask the assistant to help draft:

- PACE plan
- SOI / CEOI
- Spectrum management document
- After-action report
- Route analysis narrative
- COA support
- Relay node placement

The assistant has full read access to the current map state — assets, overlays, shapes, viewsheds, and planning regions.

## Radio Library

Includes the following emitter types:

**Tactical Radios**
- AN/PRC-163 Falcon IV — multiband wideband
- AN/PRC-158 — multiband manpack
- AN/PRC-152A — multiband handheld
- AN/PRC-117G — manpack SATCOM/UHF
- AN/PRC-160 HF — HF/NVIS manpack
- Motorola XTS 2500 — P25 VHF/UHF

**Vehicle / Elevated**
- AN/VRC-110 — vehicle-mounted
- WIN-T CPM-200 / PSE-5 — vehicle network node
- CP Node — network infrastructure

**Mesh / MANET**
- Silvus StreamCaster 4200 / 4400 — MIMO mesh
- Wave Relay MPU-5 — MANET

**SATCOM**
- Starlink / Starshield — LEO SATCOM
- MUOS terminal — GEO UHF SATCOM

**EW / ISR**
- AN/MLQ-40 Prophet — EW/SIGINT
- Generic jammer / generic receiver

## Cesium Setup

A Cesium Ion token unlocks streamed terrain, Google Photorealistic 3D Tiles, and OSM building RF modeling.

**Without a token** — the app defaults to:
- Ellipsoid terrain (flat earth in 3D)
- Google Satellite basemap
- Google Photorealistic 3D city mesh (visual only)
- RF building model off

**With a token** — the app defaults to:
- Cesium World Terrain
- Esri World Imagery basemap
- Esri World Imagery (3D)
- Google Photorealistic 3D city mesh
- Cesium Ion OSM Buildings (RF obstruction model)
- Reinforced Concrete building material

### Getting a token

1. Go to [cesium.com/ion](https://cesium.com/ion) → **Access Tokens** → **Create token**
2. Name it (e.g. `RFPlanner`), enable `assets:read`, restrict Allowed URLs if deploying publicly
3. Copy the token and paste it into the app's **Imagery → Cesium Ion Token** field

The app saves the token in browser storage. Clearing site data will remove it.

## Propagation Models

| Model | Description |
|---|---|
| Free Space Path Loss | Ideal free-space, no terrain |
| Terrain | Terrain-aware LOS and diffraction |
| Terrain and Weather | Adds atmospheric refraction |
| Buildings and Weather | Adds OSM building obstruction (requires Cesium Ion) |
| HF / NVIS | Short-range NVIS (2–12 MHz) and long-haul skywave (12–30 MHz) |

Only **Buildings and Weather** streams OSM building data — it is slower than terrain-only modes.

## Workspaces and Projects

Sign in to enable named projects. The active project is shown in the top bar.

- **Autosave** runs automatically after every map change and shows a ring/checkmark/error indicator
- **KMZ geometry** is stored per project in browser storage — switching projects restores the correct overlays
- Projects store assets, drawn shapes, and map state on the server; large KMZ files stay in browser storage only
- **Snapshots** can be created from the workspace menu to preserve a point-in-time state

Guest mode (no sign-in) works fully in browser storage only.

## AI Providers

The AI assistant supports three provider types. Configure them in **Settings → AI Integration**.

### Anthropic (Claude) / GenAI.mil (STARK)

Enter your API key in the settings panel. GenAI.mil keys start with `STARK_`. If direct browser access to GenAI.mil is blocked by network policy, run the included HTTP proxy:

```bash
node genai-proxy.js
```

The app will automatically fall back to the proxy at `http://127.0.0.1:8787` when direct access fails.

### Local Model (Ollama / LM Studio / llama.cpp)

Run AI inference entirely on your own hardware with no external API keys or internet access required.

**Prerequisites:** Node.js and one of:
- [Ollama](https://ollama.com) — recommended, simplest setup
- [LM Studio](https://lmstudio.ai) — GUI-based, good for Windows
- [llama.cpp](https://github.com/ggerganov/llama.cpp) server mode

#### Setup (one time)

**1. Start your local model server**

```bash
# Ollama
ollama serve
ollama pull llama3          # or mistral, phi3, gemma3, etc.

# LM Studio
# Load a model and enable Local Server in the app (default port 1234)

# llama.cpp
./server -m your-model.gguf --port 8080
```

**2. Start the proxy with TLS**

The proxy generates a self-signed certificate the first time so the browser can call it from HTTPS pages without being blocked by mixed-content policy.

```bash
node genai-proxy.js --local-model
```

On first run it prints a one-time platform-specific command to trust the certificate:

| Platform | Trust command |
|---|---|
| **Windows** (PowerShell as Admin) | `Import-Certificate -FilePath "certs\proxy.crt" -CertStoreLocation Cert:\LocalMachine\Root` |
| **macOS** | `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain certs/proxy.crt` |
| **Linux (Chrome)** | Import via `chrome://settings/certificates` → Authorities |
| **Linux (Firefox)** | Import via `about:preferences#privacy` → View Certificates → Authorities |

Restart your browser after trusting the certificate.

**3. Configure in the app**

1. Open **Settings → AI Integration**
2. Select **Local Model (Ollama / LM Studio)** from the Provider dropdown
3. Leave the Model Server URL at the default or change it to match your server:
   - Ollama: `http://localhost:11434/v1/chat/completions`
   - LM Studio: `http://localhost:1234/v1/chat/completions`
   - llama.cpp: `http://localhost:8080/v1/chat/completions`
4. Click **Detect Models** — the app will find all loaded models and fill in the model name
5. Click **Test Connection**

#### Overriding the model server URL

Set the `LOCAL_MODEL_URL` environment variable before starting the proxy to change the default forwarding target:

```bash
LOCAL_MODEL_URL=http://localhost:1234/v1/chat/completions node genai-proxy.js --local-model
```

#### Proxy endpoints

| Endpoint | Purpose |
|---|---|
| `http://127.0.0.1:8787/v1/chat/completions` | GenAI.mil forwarding (HTTP) |
| `https://127.0.0.1:8788/v1/local/chat/completions` | Local model forwarding (HTTPS) |
| `https://127.0.0.1:8788/v1/local/health` | Model discovery / health check |

## Deployment

The full stack runs as Docker containers behind nginx. This is the path for a shared hosted deployment where multiple users sign in and have persistent projects.

### Prerequisites

- A Linux server (EC2, VPS, bare metal) with Docker and Docker Compose installed
- A domain name pointed at the server's public IP
- Ports 80 and 443 open in the firewall / security group

### Configuration

Copy the example environment file and fill in your values:

```bash
cp deploy/.env.example deploy/.env
```

Key variables in `deploy/.env`:

| Variable | Description |
|---|---|
| `POSTGRES_PASSWORD` | Database password (choose a strong one) |
| `JWT_SECRET` | Random secret for signing auth tokens (32+ chars) |
| `APP_ORIGIN` | Your public URL, e.g. `https://rfplanner.example.com` |
| `PORT` | Backend port inside the container (default `3000`) |

### Start the stack

```bash
docker compose up -d --build
```

This starts three containers:
- `rfplanner-db` — PostgreSQL database
- `rfplanner-backend` — Node.js auth and project API
- `rfplanner-nginx` — nginx reverse proxy serving the frontend and proxying `/api` to the backend

Database migrations run automatically on startup.

### HTTPS / TLS

The nginx config in [deploy/](deploy/) is set up for Certbot. After the stack is running:

```bash
# Install Certbot on the host
sudo apt install certbot python3-certbot-nginx

# Obtain a certificate
sudo certbot --nginx -d rfplanner.example.com
```

Certbot will patch the nginx config and set up auto-renewal.

### Updating

```bash
git pull
docker compose up -d --build
```

Migrations run automatically on restart. No manual SQL steps needed.

### Logs

```bash
docker compose logs -f backend    # API logs
docker compose logs -f nginx      # nginx access / error logs
docker compose logs -f db         # Postgres logs
```

See [docs/aws-ec2-production.md](docs/aws-ec2-production.md) for a step-by-step EC2 setup guide.

## Repository Layout

```
app.js                  Main application controller
simulation-worker.js    Coverage and planning worker (runs off main thread)
index.html              App shell and UI structure
styles.css              Styling and layout
app-config.js           Frontend runtime config (API base URL, feature flags)
genai-proxy.js          Optional GenAI.mil CORS proxy
backend/                Auth and project persistence API (Node + PostgreSQL)
deploy/                 Docker Compose and nginx deployment assets
docs/                   Deployment and operations notes
images/                 README images
```

## Notes

- This is a planning and exploration tool, not a certified RF engineering package.
- OSM building obstruction and material loss values are approximate.
- Imported overlays should be user-validated before operational use.
- Web Serial GPS, voice input, and some AI provider features require a modern Chromium-based browser.
- External imagery, terrain, and AI services depend on network access and valid credentials.
