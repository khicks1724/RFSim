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

For a site-wide default token in a deployed build, set `window.EW_SIM_CONFIG.cesiumIonDefaultToken` in [app-config.js](app-config.js). User-saved local tokens still override the default. Do not commit a sensitive unrestricted token to source control; use a restricted token scoped to your deployed origin.

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

Enter your API key in the settings panel. GenAI.mil keys start with `STARK_`. If GenAI.mil is restricted to approved workstation/network paths, run the included secure localhost relay:

```bash
node genai-proxy.js --local-model
```

For GenAI.mil, the app now queries `/v1/models` for the selected key, populates the model dropdown in Settings, and prefers `gemini-3.1-pro` or `gemini-3.1` when those are available. Transport order is now:

1. `https://127.0.0.1:8788/v1/*` secure local relay on the operator workstation
2. Same-origin backend relay under `/api/ai/genai-mil/*`
3. Direct `https://api.genai.mil/v1/*` access when running on localhost
4. Legacy `http://127.0.0.1:8787/v1/*` proxy for non-secure local runs

### Local Model (Ollama / LM Studio / llama.cpp)

Run AI inference entirely on your own hardware — no external API keys or internet access required.

**Prerequisites:**
- [Node.js](https://nodejs.org) (v18 or later)
- [Git for Windows](https://git-scm.com/download/win) (includes OpenSSL, required for cert generation on Windows)
- One of: [Ollama](https://ollama.com), [LM Studio](https://lmstudio.ai), or llama.cpp

---

#### Step 1 — Install and start your model server

**Ollama (recommended)**

Download and install from [ollama.com](https://ollama.com). Then in a terminal:

```powershell
ollama serve
ollama pull gemma3:4b     # or llama3, mistral, phi3, etc.
```

Ollama runs on `http://localhost:11434` by default.

**LM Studio**

Download from [lmstudio.ai](https://lmstudio.ai). Load a model, then go to **Local Server** in the left sidebar and click **Start Server**. Runs on `http://localhost:1234` by default.

**llama.cpp**

```powershell
./server.exe -m your-model.gguf --port 8080
```

---

#### Step 2 — Add Git's OpenSSL to your PATH (Windows only, one time)

The proxy needs OpenSSL to generate a self-signed TLS certificate. Git for Windows ships OpenSSL at `C:\Program Files\Git\usr\bin`.

Open PowerShell and run:

```powershell
# Temporary (this session only)
$env:PATH += ";C:\Program Files\Git\usr\bin"

# Permanent (restart terminal after running this)
[System.Environment]::SetEnvironmentVariable("PATH", $env:PATH + ";C:\Program Files\Git\usr\bin", "User")
```

---

#### Step 3 — Start the proxy and generate the certificate

Navigate to the project folder and run:

```powershell
cd "C:\Users\<you>\Desktop\Test Coding\EW_Sim"
node genai-proxy.js --local-model
```

On first run the proxy generates `certs/proxy.crt` and prints the trust command for your platform. You will see output like:

```
🔐  Generating self-signed TLS certificate for localhost...
✅  Certificate written to certs/

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 ONE-TIME SETUP — trust the certificate
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Run this once in PowerShell (as Administrator):

    Import-Certificate -FilePath "...\certs\proxy.crt" -CertStoreLocation Cert:\LocalMachine\Root

  Then restart Chrome / Edge.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐  GenAI.mil proxy   →  http://127.0.0.1:8787/v1/chat/completions
🤖  Local model proxy →  https://127.0.0.1:8788/v1/local/chat/completions
```

---

#### Step 4 — Trust the certificate (one time per machine)

Open PowerShell **as Administrator** (right-click → Run as Administrator) and paste the command printed by the proxy:

```powershell
Import-Certificate -FilePath "C:\Users\<you>\Desktop\Test Coding\EW_Sim\certs\proxy.crt" -CertStoreLocation Cert:\LocalMachine\Root
```

You should see output confirming the thumbprint was added to the Root store. Then **fully close and reopen Chrome or Edge**.

| Platform | Trust command |
|---|---|
| **Windows** (Admin PowerShell) | `Import-Certificate -FilePath "certs\proxy.crt" -CertStoreLocation Cert:\LocalMachine\Root` |
| **macOS** | `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain certs/proxy.crt` |
| **Linux — Chrome** | `chrome://settings/certificates` → Authorities → Import |
| **Linux — Firefox** | `about:preferences#privacy` → View Certificates → Authorities → Import |

> The certificate is valid for 10 years. You only need to do this once per machine. If you delete the `certs/` folder and regenerate, trust it again.

---

#### Step 5 — Configure the app

1. Open **Settings → AI Integration**
2. Set **Provider** to **Local Model (Ollama / LM Studio)**
3. Click **Detect** — the app queries the proxy which discovers all loaded models
4. Select your model from the dropdown (e.g. `gemma3:4b`)
5. Click **Test Connection** — status should change to **Connected**
6. Click **Save Key** to persist the config

If the Model Server URL field is blank it defaults to Ollama (`http://localhost:11434/v1/chat/completions`). Change it only if using LM Studio (`http://localhost:1234/v1/chat/completions`) or llama.cpp.

---

#### Keep the proxy running

The proxy must be running whenever you use the local model. Start it before opening the app:

```powershell
cd "C:\Users\<you>\Desktop\Test Coding\EW_Sim"
node genai-proxy.js --local-model
```

To use a different model server port, set the `LOCAL_MODEL_URL` environment variable:

```powershell
$env:LOCAL_MODEL_URL = "http://localhost:1234/v1/chat/completions"
node genai-proxy.js --local-model
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

## Contributing

Contributions are welcome — bug reports, feature ideas, refactors, and operational chores all help. AI-assisted contributions are welcome too.

If you're new here, the short version is: file an issue first, wait for a maintainer thumbs-up, then open a PR. There is no public roadmap yet, so the issue-first step matters.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide — issue templates, PR scope rules, and the policy on AI-generated contributions.

## Notes

- This is a planning and exploration tool, not a certified RF engineering package.
- OSM building obstruction and material loss values are approximate.
- Imported overlays should be user-validated before operational use.
- Web Serial GPS, voice input, and some AI provider features require a modern Chromium-based browser.
- External imagery, terrain, and AI services depend on network access and valid credentials.
