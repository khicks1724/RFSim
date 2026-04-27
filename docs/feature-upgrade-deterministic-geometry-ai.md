**What and why**
The AI drawing flow currently asks the model to generate geometry that the app should compute deterministically. That is the wrong split for borders, coastlines, offshore limits, and imported vertex workflows.

The app already has the main hooks needed to fix this:
- AI UI and attachments exist at `index.html:611` and `app.js:5073`.
- Structured AI actions already flow through `app.js:6581` and end in `draw-shape` at `app.js:7942`.
- The main gaps are upstream and geometric:
	- attachments are text-only excerpts at `app.js:5601`, `app.js:5617`, and `app.js:5643`
	- screenshots are only passed through for Anthropic at `app.js:6913` and `app.js:6922`
	- compact AI summaries truncate imported geometry at `app.js:5857` and `app.js:5892`
	- circles still use simple degree math at `app.js:12943`
	- pasted/uploaded coordinates are not normalized through the existing MGRS parsing path at `app.js:15035`

That causes several failures:
- the model is pushed to hallucinate long vertex arrays
- large geometry burns tokens instead of reserving them for intent resolution
- screenshot-guided drawing depends on provider behavior instead of app behavior
- offshore and legal-style geometry is not source-backed or geodesically correct
- the user cannot review provenance, worldview, or approximation status before commit

This issue should move the app to a deterministic geometry workflow where the model returns a compact operation spec and the client resolves the actual geometry locally.

**Proposed approach**
Keep `draw-shape` as the final render step only. Insert a deterministic geometry layer between AI intent parsing and rendering.

1. Add `geometry-worker.js`.
The worker should accept compact operation specs and return normalized GeoJSON plus preview metadata. It should own geometry generation, validation, clipping, snapping, geodesic math, and provenance assembly.

2. Replace raw-vertex AI output with higher-level operations.
Add actions such as `resolve-point-set`, `resolve-shared-boundary`, `resolve-offshore-offset`, `import-vertices`, `trace-from-image`, and `preview-geometry`.

3. Add provenance for every generated shape.
Each result should carry source, dataset version, worldview, operation, tolerance, confidence, warnings, and exact-vs-approximate status.

4. Use the right geometry stack.
Use GeographicLib for ellipsoidal geodesic math and Turf for GeoJSON helpers, cleanup, clipping, validation, and QA. Offshore limits must be treated as geodesic operations, not planar or degree-based buffers.

5. Add deterministic source-backed workflows.
Start with:
- GNIS for US named points and point-set resolution
- TIGER/Line for US boundaries
- a vetted global admin dataset for international borders and disputed regions

Requests like “12nm offshore” should resolve from an explicit coastline or baseline source. If only a coastline fallback is available, the result must be labeled approximate.

6. Parse structured geometry inputs before the model.
Add browser-side `xlsx`, `xls`, `csv`, and `txt` ingestion with SheetJS, normalize rows into one vertex schema, and reuse the existing MGRS parsing path so pasted grids, MGRS, and lat/lon tables can be previewed directly.

7. Make screenshot tracing a hint pipeline.
If the screenshot comes from the active map view, georegister it from current bounds. Otherwise collect 2 to 4 anchor clicks. Extract a rough line or polygon, then snap it to an authoritative dataset or imported vertex sequence.

8. Add preview before commit.
Show vertex count, open or closed status, simplification level, source, dataset version, worldview, and exact-vs-approximate status. For Taiwan or Russia/Ukraine style requests, always show the selected dataset and worldview.

9. Stop sending large geometry through the model.
The model should return a compact operation spec. The worker should generate full geometry locally. Keep a per-message large-geometry or token-budget override in the chat UI because the current limits at `app.js:6928` and `app.js:6931` are too rigid for OCR-heavy or ambiguous requests.

10. Add golden tests.
Cover US state capitals, shared-border extraction, Taiwan/worldview-sensitive requests, geodesic offshore offsets, CSV/XLSX/MGRS import normalization, and screenshot trace plus snapping.

**Acceptance criteria**

- [ ] AI geometry actions are refactored so the model requests operations and parameters, not long raw border/coast vertex arrays.
- [ ] A new `geometry-worker.js` computes geometry deterministically and returns normalized GeoJSON plus preview metadata.
- [ ] `draw-shape` is used only after geometry resolution and validation are complete.
- [ ] Generated geometry includes provenance fields for source, dataset version, worldview, operation, confidence, warnings, and exact vs approximate classification.
- [ ] The app can resolve deterministic point sets such as US state capitals from an authoritative source rather than relying on model-generated coordinate lists.
- [ ] The app can extract a shared boundary between two named regions from the selected admin dataset and attach dispute or worldview metadata.
- [ ] Offshore offset requests use geodesic calculations, not degree math, and surface approximation warnings when only coastline fallbacks are available.
- [ ] Circle and offset generation no longer rely on the current simple degree-based geometry path for legal-style or offshore requests.
- [ ] Uploaded `xlsx`, `xls`, `csv`, and `txt` files are parsed client-side into a common vertex schema before prompt construction.
- [ ] Pasted coordinate tables, MGRS strings, and lat/lon rows can be previewed and normalized without requiring the model to reinterpret them.
- [ ] Screenshot-assisted geometry works across supported providers as an app-side hint pipeline instead of being limited to Anthropic-only passthrough behavior.
- [ ] The preview card shows vertex count, open vs closed shape, simplification level, source, worldview, and exact vs approximate status before commit.
- [ ] Worldview-sensitive requests always display the dataset and worldview used before the user confirms the result.
- [ ] The AI request path exposes a per-message large-geometry or token-budget override instead of relying only on the current hardcoded limits.
- [ ] Golden tests cover capitals, shared-boundary extraction, offshore offsets, imported vertex normalization, and screenshot trace plus snapping.

**Risks / dependencies**
This work depends on both data packaging and client architecture changes.

- New dependencies: GeographicLib, Turf, and SheetJS.
- A source-pack strategy is needed for GNIS, TIGER/Line, and the selected global admin dataset, including version pinning and worldview labeling.
- Dataset licensing, update cadence, and packaging size need to be settled before broad rollout.
- Screenshot tracing quality will vary, so the UI must keep it clearly labeled as hint-to-snap, not authoritative geometry.
- Worker-side validation, simplification policy, and performance budgets will matter for large borders and coasts.
- Preview and provenance need to integrate with the existing AI action path in `app.js:7942`, not become a parallel shape system.
- The attachment and compact-summary paths at `app.js:5601`, `app.js:5857`, and `app.js:6913` need coordinated refactoring so files, screenshots, and context previews all use the same operation model.

Suggested implementation order:
1. Refactor AI actions so the model requests geometry operations instead of raw vertices.
2. Add the geometry worker, provenance model, and preview plus confirm flow.
3. Add CSV/XLSX/pasted-grid import and normalize everything into one vertex schema.
4. Add screenshot georegistration and snapping.
5. Add authoritative source packs and golden tests for capitals, shared borders, and offshore offsets.