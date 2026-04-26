# EW / RF Propagation Simulator

Browser-based RF planning and visualization for building scenarios, placing emitters, importing overlays, running coverage, and reviewing terrain-aware results in 2D and 3D.

## What It Does

- Build RF scenarios on a Leaflet map with synchronized Cesium 3D view
- Place radios, jammers, relays, and receivers with terrain-aware heights
- Import `GeoJSON`, `KML`, `KMZ`, and ATAK data package `ZIP` overlays as editable map content
- Preserve imported names, folders, common line/polygon styles, and packaged KMZ point symbols where possible
- Organize scenario data in `Map Contents` with folders, search, rename, hide, focus, drag/reorder, and bulk delete
- Draw circles, rectangles, polylines, and polygons directly in the app
- Run coverage with compact progress + cancel support using:
  - `Free Space Path Loss`
  - `Terrain`
  - `Terrain and Weather`
  - `Buildings and Weather`
- Inspect generated coverage for RSSI, path loss, range, LOS, diffraction, and building loss
- Run terrain-aware Tx/Rx site planning inside a drawn region
- Use streamed Cesium terrain, local DTED, Google Photorealistic 3D Tiles, and Cesium Ion OSM Buildings
- Ask the AI assistant questions against live map content and scenario state

## Architecture

This app is primarily **client-side**.

- `app.js`: UI, map state, imports, Cesium/Leaflet sync, persistence, AI integration
- `simulation-worker.js`: coverage, inspection, and planning work off the main UI thread
- `index.html` + `styles.css`: application shell and UI
- `localStorage`: settings, map state, profiles, AI provider config, Cesium token

The coverage math runs on the **user's machine in the browser worker**, not on the EC2 host. The server mainly serves the app and optional backend/API paths.

## Core Workflows

### Scenario Authoring

- Place emitters on the map in 2D or 3D
- Import mission graphics and overlays
- Draw supporting geometry
- Keep everything together in `Map Contents`

### Terrain / 3D

- `Cesium World Terrain` or custom Cesium terrain endpoint
- Local DTED import for client-side terrain-backed analysis
- `Google Photorealistic 3D Tiles` for visual city mesh
- `Cesium Ion OSM Buildings` for RF obstruction modeling

### Coverage / Planning

- Generate coverage around a selected emitter
- Inspect point results on the map
- Run Tx/Rx recommendation planning inside a polygon
- Review results in 2D and 3D

### AI Assistant

- Supports `GenAI.mil (STARK)` and `Anthropic (Claude)`
- Can answer against live assets, imported items, shapes, viewsheds, planning regions, and recommendations
- Includes local map lookup shortcuts for direct location/grid questions

## Quick Start

Serve the repo with a local web server.

```powershell
python -m http.server 8080
```

or

```powershell
npx serve .
```

Open:

```text
http://localhost:8080
```

## Quick Use

1. Start the site.
2. Add a Cesium Ion token if you want streamed terrain / 3D services.
3. Place one or more emitters.
4. Optionally import `GeoJSON`, `KML`, `KMZ`, or ATAK `ZIP`.
5. Generate coverage.
6. Inspect the layer on the map.
7. Draw a planning region and run recommendations if needed.
8. Switch to `3D View` for terrain / city review.

## Cesium Setup

If you want streamed terrain, photorealistic 3D tiles, or OSM buildings, configure a Cesium Ion token.

### Why

Without a token:

- 3D can still open
- ellipsoid-only 3D still works
- local DTED still works
- Cesium World Terrain / Ion-backed services may not

### Create A Token

Use the `Access Tokens` page in Cesium Ion.

![Cesium Ion Access Tokens page with the Create token button](./images/cesium-ion-access-tokens.svg)

Recommended token setup:

- name it something recognizable, e.g. `RFSim`
- enable browser-safe read access such as `assets:read`
- restrict `Allowed URLs` if deploying publicly
- keep scopes narrow

![Cesium Ion token settings form with the public-client configuration options](./images/cesium-ion-token-settings.svg)

Copy the generated token:

![Cesium Ion generated token value ready to copy](./images/cesium-ion-copy-token.svg)

Paste it into the app's `Cesium Ion Token` field:

![Imagery dropdown showing the Cesium Ion Token field at the bottom](./images/imagery-menu-cesium-token-field.svg)

### Current 3D Modes

- `3D Terrain Source`: ellipsoid, Cesium World Terrain, or custom Cesium terrain URL
- `3D City Mesh`: Google Photorealistic 3D Tiles
- `RF Building Model`: Cesium Ion OSM Buildings

Recommended split:

- use **Photorealistic 3D Tiles** for visual realism
- use **OSM Buildings** for RF obstruction modeling

## Map Contents / Import

`Map Contents` is the scenario tree for:

- emitters
- imported overlays
- drawn shapes
- coverage layers
- planning outputs
- terrain items

Import supports:

- `GeoJSON`
- `KML`
- `KMZ`
- ATAK data package `ZIP`

Imported overlays are added as native editable map items. Folder hierarchy is preserved in a nested form, imports default to collapsed, and large imports show a progress UI.

## Propagation Models

The current coverage modes are:

- `Free Space Path Loss`
- `Terrain`
- `Terrain and Weather`
- `Buildings and Weather`

Only `Buildings and Weather` uses the slower streamed OSM building sampling path.

## Optional AI Proxy

The main app does not require a backend, but `genai-proxy.js` is included for `GenAI.mil` environments where direct browser access is blocked.

Run:

```powershell
node genai-proxy.js
```

Default local endpoint:

```text
http://127.0.0.1:8787/v1/chat/completions
```

## Hosted / Multi-User Path

This repo also includes a backend/deployment scaffold for a shared hosted deployment:

- `backend/`: auth + project persistence API
- `deploy/`: container / nginx assets
- `docs/aws-ec2-production.md`: deployment notes

Use that path if you want shared accounts and server-backed projects. The browser-only mode is still the main analysis path.

## Repository Layout

- `index.html`: app shell and UI structure
- `styles.css`: styling and layout
- `app.js`: main application controller
- `simulation-worker.js`: coverage / planning worker
- `app-config.js`: frontend runtime config
- `genai-proxy.js`: optional GenAI.mil helper
- `backend/`: hosted persistence/auth scaffold
- `deploy/`: EC2 / nginx deployment assets
- `images/`: README support images

## Limits / Notes

- This is a planning and exploration tool, not a certified engineering package.
- OSM building obstruction and material loss are approximate.
- Imported overlays should still be user-validated.
- Browser support matters for Web Serial GPS, voice input, and some provider features.
- External imagery / terrain / AI providers depend on network access and credentials.
