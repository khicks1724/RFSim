# EW / RF Propagation Simulator

EW / RF Propagation Simulator is a browser-based planning and analysis tool for placing emitters on a map, modeling RF coverage, evaluating terrain-aware site recommendations, and viewing the scenario in both 2D and 3D.

It is designed as a static client-side application. There is no backend service in this repo. Most workflows run entirely in the browser, including terrain sampling caches, propagation calculations, map import/export, and 3D visualization.

## What The Site Can Do

The current application supports:

- 2D mapping with satellite, dark, OSM, or custom XYZ imagery
- 3D visualization with Cesium-compatible imagery and terrain
- Cesium World Terrain support when a Cesium Ion token is provided
- Client-side DTED terrain import for terrain-aware RF calculations
- Placement of radios, jammers, relays, and receivers on the map
- Saved emitter profiles that can be reapplied to the form
- Terrain-aware coverage generation using multiple propagation models
- Point inspection of generated coverage layers for RSSI, path loss, range, line-of-sight, and terrain blockage
- Terrain-aware site planning for Tx/Rx recommendations inside a drawn planning region
- Terrain-aware 3D placement of recommended sites and direct-path 3D dashed links between paired recommendations
- Map content management with folders, drag/reorder, focus, rename, edit, and delete actions
- Drag-and-drop import of GeoJSON, KML, and KMZ into editable map layers
- Export of placed emitters to GeoJSON, KML, or KMZ
- Browser GPS and USB GPS input using the Web Serial path for NMEA devices
- Coordinate display in MGRS, lat/long, or degrees-minutes-seconds
- Configurable measurement units and gridline display

## Run The Site

This repo must be served through a local web server. Opening the HTML file directly from disk is not recommended.

Example with Python:

```powershell
python -m http.server 8080
```

Example with Node:

```powershell
npx serve .
```

Then open:

```text
http://localhost:8080
```

## Cesium Setup

If you want streamed 3D terrain and Cesium-backed 3D imagery, you should configure a Cesium Ion token.

### Why You Need A Token

Cesium World Terrain is not anonymous in this app. The 3D terrain streaming path expects a valid Cesium Ion access token. Without one:

- 3D mode can still open
- the app can still use ellipsoid-only 3D mode
- DTED terrain imported into the app can still be used for propagation calculations
- Cesium World Terrain requests may fail with authorization errors

### How To Create A Cesium Ion Token

The Cesium Ion page you need is the `Access Tokens` page. Use the `Create token` button shown below.

![Cesium Ion Access Tokens page with the Create token button](./images/cesium-ion-access-tokens.svg)

1. Open the app.
2. Click the `Imagery` control in the top bar.
3. In the imagery dropdown, find `Cesium Ion Token`.
4. Click `Create token`.
5. Sign up for or sign in to Cesium Ion.
6. Create an access token in Cesium Ion.
7. When Cesium shows the generated token value, use the copy button next to the token field.

![Cesium Ion generated token value ready to copy](./images/cesium-ion-copy-token.svg)

8. Paste the copied token into the `Cesium Ion Token` field at the bottom of the `Imagery` dropdown in the app.

![Imagery dropdown showing the Cesium Ion Token field at the bottom](./images/imagery-menu-cesium-token-field.svg)

The token is stored in browser local storage for later sessions on that machine/browser profile.

### Recommended Token Settings

When Cesium Ion shows the token configuration form, you can use a simple public-client setup like the one shown below.

![Cesium Ion token settings form with the public-client configuration options](./images/cesium-ion-token-settings.svg)

Recommended settings for this app:

- Name the token something recognizable such as `RFSim`.
- Enable the public scopes needed for browser use, especially `assets:read`.
- Leave private account-management scopes disabled unless you explicitly need them for a separate private workflow.
- Set `Allowed URLs` to `All Urls` for quick local testing, or use `Selected Urls` if you want to restrict the token to your deployed app URL later.
- Leave `Resources` on `All assets` unless you are intentionally limiting the token to a smaller Cesium asset set.

For browser-based use, keep the token scoped as narrowly as practical. If you deploy this app publicly, prefer a restricted token over a broad reusable account token.

### How To Use Cesium Imagery And Terrain In The App

After adding a token:

1. Open the `Imagery` dropdown.
2. Confirm `3D Terrain Source` is set to `Cesium World Terrain`.
3. Choose `3D Imagery`.
4. Click the `3D View` button in the map area.

When a token is present, the app defaults the terrain source to `Cesium World Terrain`.

### What The Imagery Dropdown Controls Do

- `Basemap`: Controls the 2D Leaflet imagery layer.
- `Radius (km)`: Used by coverage generation and terrain sampling workflows.
- `Custom Tile URL`: Lets you use a custom XYZ tile source in 2D.
- `3D Terrain Source`: Chooses ellipsoid-only, Cesium World Terrain, or a custom Cesium terrain endpoint.
- `3D Imagery`: Chooses which imagery source Cesium uses in 3D.
- `Custom Terrain URL`: Lets you point Cesium to a terrain service other than Cesium World Terrain.
- `Cesium Ion Token`: Stores the token used for Cesium Ion-backed terrain services.

## Main Interface Overview

### Top Bar

The top bar contains:

- `Imagery`: Opens imagery and Cesium settings
- `Terrain`: Opens DTED import, terrain clearing, and terrain source details
- `Weather`: Opens manual weather inputs and live weather fetch controls
- `Date/Time`
- `GPS Status`: Opens browser GPS, USB GPS, and GPS centering settings
- coordinate status display
- the settings gear: Opens map settings such as units, coordinates, and gridlines

### Map Area

The map area contains:

- Leaflet map in 2D mode
- Cesium scene in 3D mode
- a `3D View` or `2D View` toggle near the zoom controls
- a compass rose in 3D mode that rotates with camera heading
- bottom-left center-grid and elevation overlay
- bottom-right RSSI legend

### Left Panel

The left panel contains the main working controls:

- Map Contents
- Emitter Profiles
- Emitters
- Simulation
- Site Planning

## Terrain Workflows

### Option 1: Use Cesium World Terrain

This is the streamed terrain path. Use it when you want Cesium terrain and terrain-backed planning/propagation without manually loading DTED.

Typical workflow:

1. Add a Cesium Ion token.
2. Set `3D Terrain Source` to `Cesium World Terrain`.
3. Run coverage or planning.

The app samples Cesium terrain into an internal terrain grid and caches that grid in the simulation worker so propagation and planning use the same terrain surface.

### Option 2: Import DTED

Use the `Terrain` card in the left panel.

1. Click the DTED file input.
2. Choose a `.dt0`, `.dt1`, `.dt2`, or `.dted` file.
3. Wait for the terrain to be parsed and cached.

Imported terrain becomes available to the worker and can be used for coverage, inspection, and site planning.

### Clearing Terrain

Use `Clear Terrain` in the Terrain card to remove loaded terrain and clear terrain caches associated with that terrain session.

## Weather

The `Weather` card controls environmental inputs used in the propagation models.

You can:

- manually set temperature, humidity, pressure, and wind
- fetch local weather using the weather button
- switch between metric and standard units from the top-right settings menu

The weather state is used by the hybrid propagation mode and related attenuation calculations.

## Emitter Profiles

Emitter profiles let you save and reuse a full form configuration.

You can:

- create or overwrite a profile with `Save`
- delete a saved profile
- select a saved profile and apply it to the current emitter form

Profiles store the emitter form values such as type, force, frequency, power, height, gain, icon, color, and notes.

## Placing Emitters

Use the `Emitters` card to define the emitter and place it on the map.

### Supported Emitter Types

- Radio
- Jammer
- Relay
- Receiver

### Typical Placement Workflow

1. Fill in the emitter fields.
2. Click `Place On Map`.
3. Click the desired location on the map.

Placed emitters:

- appear on the map
- appear in `Placed Systems`
- appear in `Map Contents`
- inherit terrain elevation at the placed location when terrain is available
- appear in 3D at terrain-aware heights

### Editing Existing Emitters

Emitters can be managed through the `Map Contents` panel.

You can:

- click an item to focus it
- right-click an item to edit, rename, or delete it
- drag items into folders
- reorder items in the content tree

## Map Contents

The `Map Contents` card is the main organization panel for scenario items.

It supports:

- folders
- drag-and-drop ordering
- assigning items into folders
- focusing map items
- renaming items
- editing items
- deleting items

Content that appears there includes:

- placed emitters
- imported GeoJSON/KML/KMZ items
- coverage layers
- planning layers and regions

## Importing Existing Map Data

You can import data by dragging files directly onto the map.

Supported formats:

- GeoJSON
- KML
- KMZ

### Import Behavior

- imported files create a folder based on file name
- imported features are added as editable map items
- points, lines, and polygons are supported
- imported items are added to `Map Contents`
- imported items can be focused, renamed, moved into folders, and deleted

## Exporting Emitters

Placed emitters can be exported from the `Placed Systems` section.

Supported exports:

- GeoJSON
- KML
- KMZ

These exports include emitter metadata in feature properties or KML description content.

## Coverage Simulation

Use the `Simulation` card to generate coverage around a selected emitter.

### Available Controls

- selected asset
- propagation model
- receiver height
- grid step
- viewshed opacity

### Supported Propagation Modes

- `ITU-R P.525 Free Space`
- `ITU-R P.526 Terrain Diffraction`
- `ITU Hybrid Terrain + Atmosphere`

### Coverage Workflow

1. Place at least one emitter.
2. Select the emitter in `Simulation`.
3. Choose propagation settings.
4. Click `Generate Coverage`.

The app creates a terrain-aware coverage layer and adds it to the map and the coverage list.

### Inspecting Coverage

After coverage is generated, click the map while the layer is active to inspect a point.

The inspection popup reports:

- RSSI
- path loss
- range
- line of sight
- terrain blockage

## GPS

The top-bar `GPS Status` control opens the GPS menu.

### Browser GPS

Use `Browser GPS` to request position data from the browser Geolocation API.

### USB GPS

Use `USB GPS` to connect to a serial device that emits NMEA sentences.

This path relies on browser Web Serial support.

### GPS Centering

The GPS menu lets you choose:

- `Follow User`
- `Center Once`
- `Do Not Center`

GPS updates also feed the top-bar status and map overlays.

## Site Planning

The `Site Planning` card generates recommended Tx/Rx site pairs inside a drawn planning region.

### What Planning Considers

Planning uses:

- the selected Tx and Rx assets
- enemy assets already placed on the map
- terrain, when available
- weather state
- the selected propagation model
- grid spacing and minimum separation
- detection and separation weighting
- floor and ceiling height constraints

### Planning Workflow

1. Place at least one friendly Tx and one Rx asset.
2. Optionally place enemy assets if you want enemy detection pressure included.
3. Click `Draw Region`.
4. Draw a polygon on the map.
5. Select Tx and Rx assets in the planning form.
6. Configure candidate spacing and weights.
7. Click `Recommend`.

The app evaluates candidate positions inside the polygon and returns ranked recommendations.

### Planning Outputs

The app shows:

- recommended Tx points
- recommended Rx points
- dashed or solid link lines between paired sites in 2D
- a recommendation summary in the panel
- recommendation entries in the planning list

When terrain is available, recommended points retain ground elevation values and are rendered in 3D at terrain-aware heights.

## 3D View

The `3D View` button in the map area toggles the Cesium globe.

### In 3D Mode

- the map switches from Leaflet to Cesium
- placed emitters render at terrain-aware heights when terrain is available
- planned Tx/Rx recommendations render at terrain-aware heights
- planning link lines render as direct 3D paths between endpoints
- the compass rose appears under the 2D/3D toggle
- clicking the compass rose resets the camera to north up

### If 3D Does Not Load Correctly

Check:

- that your Cesium Ion token is valid
- that `3D Terrain Source` is configured correctly
- that the custom terrain URL is valid if using a custom provider
- that your network can reach the selected terrain and imagery sources

## Settings Menu

The top-right gear opens general map settings.

You can change:

- measurement units
- coordinate format
- gridline visibility
- gridline color

## Typical End-To-End Workflow

If you are new to the app, this is a good full workflow to follow:

1. Start the local web server.
2. Open the app.
3. Add a Cesium Ion token in `Imagery` if you want streamed 3D terrain.
4. Configure imagery and terrain.
5. Place one or more emitters.
6. Optionally import additional map content by dragging GeoJSON, KML, or KMZ onto the map.
7. Adjust weather.
8. Generate coverage for a selected asset.
9. Draw a planning region and run site planning.
10. Switch to `3D View` to inspect terrain-aware placements and links.
11. Organize items in `Map Contents`.
12. Export placed emitters if needed.

## Important Notes And Limitations

- This is a browser-based planning and exploration tool, not a certified engineering package.
- Cesium World Terrain and some hosted imagery or terrain services require valid credentials and external service availability.
- Direct Google Earth imagery is not included.
- Exact Google Earth UI behavior is not included.
- Direct `gpsd` access is not included because browsers cannot directly connect to that service without a bridge.
- USB GPS requires browser Web Serial support and a compatible NMEA device.
- DTED parsing is best-effort and client-side.
- Imported KML and KMZ support common point, line, and polygon workflows but should still be user-validated for mission-critical use.
- 3D mode can still open even when Cesium terrain or imagery authentication is incomplete, but remote resources may fail.

## Summary

Use this site to build a map-based RF scenario, place and organize emitters, import supporting map content, model propagation and line-of-sight, plan candidate Tx/Rx locations with terrain and enemy exposure in mind, and inspect the result in both 2D and 3D.
