# EW / RF Propagation Simulator

Browser-based electronic warfare and RF propagation simulator with:

- Satellite or street basemap support, including custom XYZ imagery endpoints
- DTED terrain import for terrain-aware line-of-sight and attenuation
- Radio, relay, receiver, or jammer placement with richer emitter parameters and saved profiles
- Local weather pull from Open-Meteo for propagation adjustments
- ITU-oriented propagation model selection with worker-side terrain caching
- Faster canvas-rendered coverage layers with click-to-inspect RSSI, path loss, and blockage
- GeoJSON, KML, and KMZ export for emitter locations and metadata
- Browser GPS and USB NMEA GPS display with MGRS readout
- Site-planning mode for bounded-region Tx/Rx recommendations against enemy intercept risk
- Resizable and collapsible side tray plus 2D / 3D map modes

## Run

Serve the folder with any static file server, then open `index.html`.

Examples:

```powershell
python -m http.server 8080
```

or

```powershell
npx serve .
```

Then browse to `http://localhost:8080`.

## Notes

- Direct Google Earth imagery, exact Google Earth control parity, and direct `gpsd` browser access are not bundled here. Google services require a licensed API path and compliance with Google's terms, and `gpsd` requires a local bridge service because browsers cannot connect to it directly.
- The included USB GPS path uses the browser Web Serial API and expects a device that emits NMEA sentences.
- The 3D viewer uses Cesium-compatible imagery and terrain providers. Cesium World Terrain or other hosted terrain sources may require credentials or service availability outside this repo.
- DTED parsing is implemented client-side as a best-effort reader for common `.dt0`, `.dt1`, `.dt2`, and `.dted` files. If header georeferencing is unavailable, provide the southwest latitude and longitude overrides before import.
- The propagation stack now includes ITU-R P.525 free-space loss, a terrain diffraction penalty path inspired by ITU-R P.526, and a hybrid mode with additional atmospheric attenuation. It is still suitable for scenario exploration rather than formal certification.
- For another performance step beyond the current worker + canvas approach, the next upgrade path is still Rust or C++ compiled to WebAssembly.
