const FORCE_COLORS = {
  friendly: "#38bdf8",
  enemy: "#ff6b6b",
  "host-nation": "#f7b955",
  civilian: "#a78bfa",
};

const FORCE_LABELS = {
  friendly: "Friendly",
  enemy: "Enemy",
  "host-nation": "Host Nation",
  civilian: "Civilian",
};

const BASEMAPS = {
  esri: {
    label: "Esri World Imagery",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
    maxZoom: 19,
  },
  "carto-dark": {
    label: "CARTO Dark Matter",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
    maxZoom: 20,
  },
  osm: {
    label: "OpenStreetMap",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19,
  },
};

const PROFILE_STORAGE_KEY = "ew-sim-emitter-profiles";
const SETTINGS_STORAGE_KEY = "ew-sim-map-settings";
const CESIUM_ION_TOKEN_STORAGE_KEY = "ew-sim-cesium-ion-token";

const dom = {
  collapsePanelBtn: document.querySelector("#collapsePanelBtn"),
  collapsePanelIcon: document.querySelector("#collapsePanelIcon"),
  controlPanel: document.querySelector("#controlPanel"),
  panelDivider: document.querySelector("#panelDivider"),
  imageryMenuBtn: document.querySelector("#imageryMenuBtn"),
  imageryMenu: document.querySelector("#imageryMenu"),
  imageryMenuValue: document.querySelector("#imageryMenuValue"),
  settingsMenuBtn: document.querySelector("#settingsMenuBtn"),
  settingsMenu: document.querySelector("#settingsMenu"),
  measurementUnitsSelect: document.querySelector("#measurementUnitsSelect"),
  coordinateSystemSelect: document.querySelector("#coordinateSystemSelect"),
  gridlinesToggle: document.querySelector("#gridlinesToggle"),
  gridlinesColor: document.querySelector("#gridlinesColor"),
  clockValue: document.querySelector("#clockValue"),
  gpsStatusValue: document.querySelector("#gpsStatusValue"),
  coordsLabel: document.querySelector("#coordsLabel"),
  mgrsValue: document.querySelector("#mgrsValue"),
  statusBadge: document.querySelector("#statusBadge"),
  view3dToggleBtn: document.querySelector("#view3dToggleBtn"),
  basemapSelect: document.querySelector("#basemapSelect"),
  customTileUrl: document.querySelector("#customTileUrl"),
  radiusKm: document.querySelector("#radiusKm"),
  terrainSourceSelect: document.querySelector("#terrainSourceSelect"),
  imagerySourceSelect: document.querySelector("#imagerySourceSelect"),
  customTerrainUrl: document.querySelector("#customTerrainUrl"),
  cesiumIonToken: document.querySelector("#cesiumIonToken"),
  dtedInput: document.querySelector("#dtedInput"),
  clearTerrainBtn: document.querySelector("#clearTerrainBtn"),
  terrainSummary: document.querySelector("#terrainSummary"),
  terrainList: document.querySelector("#terrainList"),
  terrainSection: document.querySelector("#terrainSection"),
  mapContentsCard: document.querySelector("#mapContentsCard"),
  mapContentsList: document.querySelector("#mapContentsList"),
  addMapFolderBtn: document.querySelector("#addMapFolderBtn"),
  mapContentsMenu: document.querySelector("#mapContentsMenu"),
  mapContentsRename: document.querySelector("#mapContentsRename"),
  mapContentsRenameInput: document.querySelector("#mapContentsRenameInput"),
  mapContentsRenameSave: document.querySelector("#mapContentsRenameSave"),
  mapContentsRenameCancel: document.querySelector("#mapContentsRenameCancel"),
  fetchWeatherBtn: document.querySelector("#fetchWeatherBtn"),
  tempLabel: document.querySelector("#tempLabel"),
  tempC: document.querySelector("#tempC"),
  humidity: document.querySelector("#humidity"),
  pressureLabel: document.querySelector("#pressureLabel"),
  pressure: document.querySelector("#pressure"),
  windLabel: document.querySelector("#windLabel"),
  windSpeed: document.querySelector("#windSpeed"),
  weatherSummary: document.querySelector("#weatherSummary"),
  profileSelect: document.querySelector("#profileSelect"),
  profileName: document.querySelector("#profileName"),
  saveProfileBtn: document.querySelector("#saveProfileBtn"),
  deleteProfileBtn: document.querySelector("#deleteProfileBtn"),
  applyProfileBtn: document.querySelector("#applyProfileBtn"),
  placeAssetBtn: document.querySelector("#placeAssetBtn"),
  assetType: document.querySelector("#assetType"),
  assetForce: document.querySelector("#assetForce"),
  assetName: document.querySelector("#assetName"),
  unitName: document.querySelector("#unitName"),
  frequencyMHz: document.querySelector("#frequencyMHz"),
  powerW: document.querySelector("#powerW"),
  antennaHeight: document.querySelector("#antennaHeight"),
  antennaGain: document.querySelector("#antennaGain"),
  receiverSensitivity: document.querySelector("#receiverSensitivity"),
  systemLoss: document.querySelector("#systemLoss"),
  assetIcon: document.querySelector("#assetIcon"),
  assetColor: document.querySelector("#assetColor"),
  assetNotes: document.querySelector("#assetNotes"),
  emittersSection: document.querySelector("#emittersSection"),
  assetList: document.querySelector("#assetList"),
  exportGeoJsonBtn: document.querySelector("#exportGeoJsonBtn"),
  exportKmlBtn: document.querySelector("#exportKmlBtn"),
  exportKmzBtn: document.querySelector("#exportKmzBtn"),
  clearAssetsBtn: document.querySelector("#clearAssetsBtn"),
  assetSelect: document.querySelector("#assetSelect"),
  propagationModel: document.querySelector("#propagationModel"),
  viewshedOpacity: document.querySelector("#viewshedOpacity"),
  viewshedList: document.querySelector("#viewshedList"),
  clearViewshedsBtn: document.querySelector("#clearViewshedsBtn"),
  gridMeters: document.querySelector("#gridMeters"),
  receiverHeight: document.querySelector("#receiverHeight"),
  runSimulationBtn: document.querySelector("#runSimulationBtn"),
  simulationSection: document.querySelector("#simulationSection"),
  coverageMetric: document.querySelector("#coverageMetric"),
  minRssiMetric: document.querySelector("#minRssiMetric"),
  maxRssiMetric: document.querySelector("#maxRssiMetric"),
  connectGeolocationBtn: document.querySelector("#connectGeolocationBtn"),
  connectUsbGpsBtn: document.querySelector("#connectUsbGpsBtn"),
  gpsCenterMode: document.querySelector("#gpsCenterMode"),
  drawPlanningRegionBtn: document.querySelector("#drawPlanningRegionBtn"),
  runPlanningBtn: document.querySelector("#runPlanningBtn"),
  planningTxAsset: document.querySelector("#planningTxAsset"),
  planningRxAsset: document.querySelector("#planningRxAsset"),
  planningGridMeters: document.querySelector("#planningGridMeters"),
  planningMinSeparation: document.querySelector("#planningMinSeparation"),
  planningEnemyWeight: document.querySelector("#planningEnemyWeight"),
  planningSeparationWeight: document.querySelector("#planningSeparationWeight"),
  planningFloorM: document.querySelector("#planningFloorM"),
  planningCeilingM: document.querySelector("#planningCeilingM"),
  planningSummary: document.querySelector("#planningSummary"),
  planningList: document.querySelector("#planningList"),
  planningSection: document.querySelector("#planningSection"),
  centerCoordinateLabel: document.querySelector("#centerCoordinateLabel"),
  centerCoordinateValue: document.querySelector("#centerCoordinateValue"),
  centerElevationValue: document.querySelector("#centerElevationValue"),
  cesiumCompassBtn: document.querySelector("#cesiumCompassBtn"),
  cesiumCompassRose: document.querySelector("#cesiumCompassRose"),
  map: document.querySelector("#map"),
  cesiumContainer: document.querySelector("#cesiumContainer"),
};

const state = {
  map: null,
  baseLayer: null,
  placingAsset: false,
  assetMarkers: new Map(),
  assets: [],
  importedItems: [],
  terrains: [],
  activeTerrainId: null,
  terrainCoverageLayers: new Map(),
  viewshedRootLayer: L.layerGroup(),
  viewsheds: [],
  activeInspectionViewshedId: null,
  view3dEnabled: false,
  cesiumViewer: null,
  cesiumTerrainProvider: null,
  gridLayer: null,
  terrainReadyIds: new Set(),
  terrainCacheResolvers: new Map(),
  ionTerrainCache: new Map(),
  worker: new Worker("./simulation-worker.js", { type: "module" }),
  pendingInspection: null,
  pendingPlanningRequestId: null,
  editingAssetId: null,
  editingViewshedId: null,
  mapContentOrder: [],
  mapContentFolders: [],
  mapContentAssignments: new Map(),
  activeMapContentMenuId: null,
  renamingMapContentId: null,
  imageryMenuOpen: false,
  settingsMenuOpen: false,
  settings: {
    measurementUnits: "metric",
    coordinateSystem: "mgrs",
    gridLinesEnabled: false,
    gridColor: "#8fb7ff",
  },
  weather: {
    temperatureC: 20,
    humidity: 50,
    pressureHpa: 1013.2,
    windSpeedMps: 3,
    source: "manual",
  },
  profiles: [],
  gps: {
    geolocationWatchId: null,
    serialPort: null,
    serialReader: null,
    mode: "disconnected",
    marker: null,
    accuracyCircle: null,
    centeredOnce: false,
    location: null,
  },
  planning: {
    regionLayer: null,
    regionName: "Planning Region",
    resultsName: "Planning Recommendations",
    terrainId: null,
    recommendations: [],
    markersLayer: L.layerGroup(),
  },
  ui: {
    resizeActive: false,
  },
};

function init() {
  initMap();
  loadCesiumIonToken();
  loadSettings();
  loadProfiles();
  applyBasemap(dom.basemapSelect.value);
  updateImageryMenuValue();
  wireEvents();
  renderAssets();
  renderTerrains();
  renderViewsheds();
  renderPlanningResults();
  refreshActionButtons();
  updateTerrainSummary();
  updateWeatherState();
  applySettings();
  updateMapOverlayMetrics();
  updateClock();
  window.setInterval(updateClock, 1000);
  setStatus("Ready.");

  state.map.on("click", onMapClick);
  state.map.on("moveend zoomend resize", updateMapOverlayMetrics);
  state.map.on(L.Draw.Event.CREATED, onPlanningRegionCreated);
  state.worker.addEventListener("message", onWorkerMessage);
  state.planning.markersLayer.addTo(state.map);
}

function initMap() {
  state.map = L.map("map", {
    zoomControl: true,
  }).setView([34.744, -116.151], 10);
  state.viewshedRootLayer.addTo(state.map);
}

function wireEvents() {
  dom.collapsePanelBtn.addEventListener("click", togglePanelCollapse);
  dom.panelDivider.addEventListener("mousedown", beginPanelResize);
  window.addEventListener("mousemove", onPanelResize);
  window.addEventListener("mouseup", endPanelResize);
  dom.imageryMenuBtn.addEventListener("click", toggleImageryMenu);
  dom.imageryMenu.addEventListener("click", (event) => event.stopPropagation());
  dom.settingsMenuBtn.addEventListener("click", toggleSettingsMenu);
  dom.settingsMenu.addEventListener("click", (event) => event.stopPropagation());
  document.addEventListener("click", closeTopBarMenus);
  document.addEventListener("click", closeMapContentsMenu);
  document.addEventListener("click", closeRenamePopover);
  dom.addMapFolderBtn.addEventListener("click", addMapContentFolder);
  dom.mapContentsMenu.addEventListener("click", onMapContentsMenuAction);
  dom.mapContentsRename.addEventListener("click", (event) => event.stopPropagation());
  dom.mapContentsRenameSave.addEventListener("click", commitRenameMapContent);
  dom.mapContentsRenameCancel.addEventListener("click", closeRenamePopover);
  dom.mapContentsRenameInput.addEventListener("keydown", onRenamePopoverKeyDown);
  dom.map.addEventListener("dragover", onMapFileDragOver);
  dom.map.addEventListener("dragleave", onMapFileDragLeave);
  dom.map.addEventListener("drop", onMapFileDrop);
  dom.measurementUnitsSelect.addEventListener("change", onSettingsChanged);
  dom.coordinateSystemSelect.addEventListener("change", onSettingsChanged);
  dom.gridlinesToggle.addEventListener("change", onSettingsChanged);
  dom.gridlinesColor.addEventListener("input", onSettingsChanged);
  dom.view3dToggleBtn.addEventListener("click", toggle3dView);
  dom.cesiumCompassBtn.addEventListener("click", resetCesiumNorthUp);
  dom.basemapSelect.addEventListener("change", onBasemapChange);
  dom.customTileUrl.addEventListener("change", onBasemapChange);
  dom.terrainSourceSelect.addEventListener("change", onTerrainSourceSettingsChanged);
  dom.imagerySourceSelect.addEventListener("change", syncCesiumScene);
  dom.customTerrainUrl.addEventListener("change", onTerrainSourceSettingsChanged);
  dom.cesiumIonToken.addEventListener("change", onCesiumIonTokenChanged);
  dom.dtedInput.addEventListener("change", onTerrainImport);
  dom.clearTerrainBtn.addEventListener("click", clearTerrain);
  dom.fetchWeatherBtn.addEventListener("click", fetchWeather);
  dom.saveProfileBtn.addEventListener("click", saveProfile);
  dom.deleteProfileBtn.addEventListener("click", deleteProfile);
  dom.applyProfileBtn.addEventListener("click", applySelectedProfile);
  dom.profileSelect.addEventListener("change", onProfileSelectionChange);
  dom.placeAssetBtn.addEventListener("click", () => {
    if (state.editingAssetId) {
      saveAssetEdits();
      return;
    }
    state.placingAsset = true;
    setStatus("Click on the map to place the emitter.");
  });
  dom.clearAssetsBtn.addEventListener("click", clearAssets);
  dom.exportGeoJsonBtn.addEventListener("click", exportAssetsGeoJson);
  dom.exportKmlBtn.addEventListener("click", () => exportAssetsKml(false));
  dom.exportKmzBtn.addEventListener("click", () => exportAssetsKml(true));
  dom.clearViewshedsBtn.addEventListener("click", clearViewsheds);
  dom.runSimulationBtn.addEventListener("click", runSimulation);
  dom.connectGeolocationBtn.addEventListener("click", connectBrowserGeolocation);
  dom.connectUsbGpsBtn.addEventListener("click", connectUsbGps);
  dom.drawPlanningRegionBtn.addEventListener("click", drawPlanningRegion);
  dom.runPlanningBtn.addEventListener("click", runPlanning);
  ["tempC", "humidity", "pressure", "windSpeed"].forEach((id) => {
    dom[id].addEventListener("input", updateWeatherState);
  });
}

function loadSettings() {
  const stored = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!stored) {
    return;
  }

  try {
    const parsed = JSON.parse(stored);
    state.settings.measurementUnits = ["metric", "standard"].includes(parsed.measurementUnits)
      ? parsed.measurementUnits
      : state.settings.measurementUnits;
    state.settings.coordinateSystem = ["mgrs", "latlon", "dms"].includes(parsed.coordinateSystem)
      ? parsed.coordinateSystem
      : state.settings.coordinateSystem;
    state.settings.gridLinesEnabled = Boolean(parsed.gridLinesEnabled);
    state.settings.gridColor = typeof parsed.gridColor === "string" ? parsed.gridColor : state.settings.gridColor;
  } catch {
    window.localStorage.removeItem(SETTINGS_STORAGE_KEY);
  }
}

function persistSettings() {
  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(state.settings));
}

function toggleSettingsMenu(event) {
  event.stopPropagation();
  closeImageryMenu();
  state.settingsMenuOpen = !state.settingsMenuOpen;
  dom.settingsMenu.classList.toggle("hidden", !state.settingsMenuOpen);
  dom.settingsMenuBtn.setAttribute("aria-expanded", String(state.settingsMenuOpen));
}

function toggleImageryMenu(event) {
  event.stopPropagation();
  closeSettingsMenu();
  state.imageryMenuOpen = !state.imageryMenuOpen;
  dom.imageryMenu.classList.toggle("hidden", !state.imageryMenuOpen);
  dom.imageryMenuBtn.setAttribute("aria-expanded", String(state.imageryMenuOpen));
}

function closeSettingsMenu() {
  if (!state.settingsMenuOpen) {
    return;
  }
  state.settingsMenuOpen = false;
  dom.settingsMenu.classList.add("hidden");
  dom.settingsMenuBtn.setAttribute("aria-expanded", "false");
}

function closeImageryMenu() {
  if (!state.imageryMenuOpen) {
    return;
  }
  state.imageryMenuOpen = false;
  dom.imageryMenu.classList.add("hidden");
  dom.imageryMenuBtn.setAttribute("aria-expanded", "false");
}

function closeTopBarMenus() {
  closeSettingsMenu();
  closeImageryMenu();
}

function closeMapContentsMenu() {
  state.activeMapContentMenuId = null;
  dom.mapContentsMenu.classList.add("hidden");
}

function closeRenamePopover() {
  state.renamingMapContentId = null;
  dom.mapContentsRename.classList.add("hidden");
}

function onRenamePopoverKeyDown(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    commitRenameMapContent();
    return;
  }

  if (event.key === "Escape") {
    closeRenamePopover();
  }
}

function onSettingsChanged() {
  state.settings.measurementUnits = dom.measurementUnitsSelect.value;
  state.settings.coordinateSystem = dom.coordinateSystemSelect.value;
  state.settings.gridLinesEnabled = dom.gridlinesToggle.checked;
  state.settings.gridColor = dom.gridlinesColor.value;
  persistSettings();
  applySettings();
}

function applySettings() {
  dom.measurementUnitsSelect.value = state.settings.measurementUnits;
  dom.coordinateSystemSelect.value = state.settings.coordinateSystem;
  dom.gridlinesToggle.checked = state.settings.gridLinesEnabled;
  dom.gridlinesColor.value = state.settings.gridColor;
  dom.coordsLabel.textContent = coordinateSystemStatusLabel(state.settings.coordinateSystem);
  updateWeatherUnitLabels();
  syncWeatherInputsFromState();
  updateCoordinateDisplays();
  updateMapOverlayMetrics();
  updateGridLayer();
  renderViewsheds();
  renderPlanningResults();
}

function updateWeatherUnitLabels() {
  const isStandard = state.settings.measurementUnits === "standard";
  dom.tempLabel.textContent = `Temperature ${isStandard ? "F" : "C"}`;
  dom.pressureLabel.textContent = `Pressure ${isStandard ? "inHg" : "hPa"}`;
  dom.windLabel.textContent = `Wind ${isStandard ? "mph" : "m/s"}`;
}

function syncWeatherInputsFromState() {
  dom.tempC.value = formatInputNumber(displayTemperature(state.weather.temperatureC), 1);
  dom.humidity.value = formatInputNumber(state.weather.humidity, 0);
  dom.pressure.value = formatInputNumber(displayPressure(state.weather.pressureHpa), state.settings.measurementUnits === "standard" ? 2 : 1);
  dom.windSpeed.value = formatInputNumber(displayWindSpeed(state.weather.windSpeedMps), 1);
}

function coordinateSystemStatusLabel(system) {
  if (system === "latlon") {
    return "LAT/LONG";
  }
  if (system === "dms") {
    return "DMS";
  }
  return "MGRS";
}

function updateCoordinateDisplays() {
  if (!state.gps.location) {
    dom.mgrsValue.textContent = state.settings.coordinateSystem === "mgrs" ? "----------" : "--";
    return;
  }

  dom.mgrsValue.textContent = formatCoordinate(state.gps.location.lat, state.gps.location.lon, state.settings.coordinateSystem);
}

function updateMapOverlayMetrics() {
  if (!state.map) {
    return;
  }

  const center = state.map.getCenter();
  dom.centerCoordinateLabel.textContent = state.settings.coordinateSystem === "mgrs" ? "Center Grid" : "Center Pos";
  dom.centerCoordinateValue.textContent = formatCoordinate(center.lat, center.lng, state.settings.coordinateSystem);

  const centerElevationM = sampleTerrainElevation(center.lat, center.lng);
  dom.centerElevationValue.textContent = centerElevationM === null
    ? "No terrain"
    : formatElevation(centerElevationM);
}

function sampleTerrainElevation(lat, lon) {
  return sampleTerrainElevationForTerrain(lat, lon, getActiveTerrain());
}

function sampleTerrainElevationForTerrainId(lat, lon, terrainId) {
  return sampleTerrainElevationForTerrain(lat, lon, getTerrainById(terrainId));
}

function sampleTerrainElevationForTerrain(lat, lon, terrain) {
  if (!terrain) {
    return null;
  }

  if (
    lat < terrain.bounds.sw.lat || lat > terrain.bounds.ne.lat
    || lon < terrain.bounds.sw.lon || lon > terrain.bounds.ne.lon
  ) {
    return null;
  }

  const rowFloat = (lat - terrain.origin.lat) / terrain.latStepDeg;
  const colFloat = (lon - terrain.origin.lon) / terrain.lonStepDeg;
  const row = clamp(Math.floor(rowFloat), 0, terrain.rows - 1);
  const col = clamp(Math.floor(colFloat), 0, terrain.cols - 1);
  const nextRow = Math.min(row + 1, terrain.rows - 1);
  const nextCol = Math.min(col + 1, terrain.cols - 1);
  const rowRatio = clamp(rowFloat - row, 0, 1);
  const colRatio = clamp(colFloat - col, 0, 1);
  const q11 = terrain.elevations[row * terrain.cols + col];
  const q21 = terrain.elevations[row * terrain.cols + nextCol];
  const q12 = terrain.elevations[nextRow * terrain.cols + col];
  const q22 = terrain.elevations[nextRow * terrain.cols + nextCol];
  return bilinear(q11, q21, q12, q22, colRatio, rowRatio);
}

function resolveAbsoluteHeight(position, terrainId = null) {
  const groundElevationM = Number.isFinite(position.groundElevationM)
    ? position.groundElevationM
    : terrainId
      ? sampleTerrainElevationForTerrainId(position.lat, position.lon, terrainId)
      : sampleTerrainElevation(position.lat, position.lon);
  const antennaHeightM = Number(position.antennaHeightM) || 0;

  if (!Number.isFinite(groundElevationM)) {
    return {
      groundElevationM: null,
      absoluteHeightM: antennaHeightM,
      useRelativeToGround: true,
    };
  }

  return {
    groundElevationM,
    absoluteHeightM: groundElevationM + antennaHeightM,
    useRelativeToGround: false,
  };
}

function updateGridLayer() {
  if (!state.settings.gridLinesEnabled) {
    if (state.gridLayer) {
      state.gridLayer.remove();
      state.gridLayer = null;
    }
    return;
  }

  const options = {
    coordinateSystem: state.settings.coordinateSystem,
    color: state.settings.gridColor,
  };

  if (!state.gridLayer) {
    state.gridLayer = new CoordinateGridLayer(options);
    state.gridLayer.addTo(state.map);
    return;
  }

  state.gridLayer.setOptions(options);
}

function onWorkerMessage(event) {
  const { type, payload } = event.data;

  if (type === "terrain:cached") {
    state.terrainReadyIds.add(payload.id);
    const resolver = state.terrainCacheResolvers.get(payload.id);
    if (resolver) {
      resolver();
      state.terrainCacheResolvers.delete(payload.id);
    }
    return;
  }

  if (type === "simulation:complete") {
    consumeSimulationResult(payload);
    return;
  }

  if (type === "inspection:complete") {
    consumeInspectionResult(payload);
    return;
  }

  if (type === "planning:complete") {
    consumePlanningResult(payload);
    return;
  }

  if (type === "engine:error") {
    setStatus(payload.message, true);
  }
}

function loadCesiumIonToken() {
  const stored = window.localStorage.getItem(CESIUM_ION_TOKEN_STORAGE_KEY);
  if (stored) {
    dom.cesiumIonToken.value = stored;
  }
}

function onCesiumIonTokenChanged() {
  const token = dom.cesiumIonToken.value.trim();
  if (token) {
    window.localStorage.setItem(CESIUM_ION_TOKEN_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(CESIUM_ION_TOKEN_STORAGE_KEY);
  }
  state.cesiumTerrainProvider = null;
  state.ionTerrainCache.clear();
  syncCesiumScene();
}

function onTerrainSourceSettingsChanged() {
  state.cesiumTerrainProvider = null;
  syncCesiumScene();
}

function togglePanelCollapse() {
  document.body.classList.toggle("panel-collapsed");
  dom.collapsePanelIcon.innerHTML = document.body.classList.contains("panel-collapsed") ? "&#9654;" : "&#9664;";
  state.map.invalidateSize();
  if (state.cesiumViewer) {
    state.cesiumViewer.resize();
  }
}

function beginPanelResize() {
  if (window.innerWidth <= 1024 || document.body.classList.contains("panel-collapsed")) {
    return;
  }
  state.ui.resizeActive = true;
}

function onPanelResize(event) {
  if (!state.ui.resizeActive) {
    return;
  }
  const nextWidth = clamp(event.clientX, 280, 620);
  document.documentElement.style.setProperty("--panel-width", `${nextWidth}px`);
  state.map.invalidateSize();
}

function endPanelResize() {
  state.ui.resizeActive = false;
}

function updateClock() {
  dom.clockValue.textContent = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

function onBasemapChange() {
  applyBasemap(dom.basemapSelect.value);
  updateImageryMenuValue();
  syncCesiumScene();
}

function applyBasemap(key) {
  if (state.baseLayer) {
    state.map.removeLayer(state.baseLayer);
  }

  let config = BASEMAPS[key];
  if (key === "custom") {
    const customUrl = dom.customTileUrl.value.trim();
    if (!customUrl) {
      setStatus("Enter a valid custom XYZ tile URL.", true);
      return;
    }
    config = {
      label: "Custom XYZ",
      url: customUrl,
      attribution: "Custom imagery source",
      maxZoom: 20,
    };
  }

  state.baseLayer = L.tileLayer(config.url, {
    attribution: config.attribution,
    maxZoom: config.maxZoom,
    crossOrigin: true,
  });
  state.baseLayer.addTo(state.map);
  updateImageryMenuValue(config.label);
}

function updateImageryMenuValue(labelOverride = null) {
  if (labelOverride) {
    dom.imageryMenuValue.textContent = labelOverride;
    return;
  }

  if (dom.basemapSelect.value === "custom") {
    dom.imageryMenuValue.textContent = dom.customTileUrl.value.trim() ? "Custom XYZ" : "Custom XYZ";
    return;
  }

  dom.imageryMenuValue.textContent = BASEMAPS[dom.basemapSelect.value]?.label ?? "Imagery";
}

function onMapClick(event) {
  if (state.placingAsset) {
    addAsset(event.latlng);
    state.placingAsset = false;
    setStatus("Emitter placed.");
    return;
  }

  if (state.activeInspectionViewshedId) {
    inspectSignalPoint(event.latlng);
  }
}

function getEmitterFormData() {
  return {
    type: dom.assetType.value,
    force: dom.assetForce.value,
    name: dom.assetName.value.trim() || "Unnamed",
    unit: dom.unitName.value.trim() || "Unknown Unit",
    frequencyMHz: Number(dom.frequencyMHz.value),
    powerW: Number(dom.powerW.value),
    antennaHeightM: Number(dom.antennaHeight.value),
    antennaGainDbi: Number(dom.antennaGain.value),
    receiverSensitivityDbm: Number(dom.receiverSensitivity.value),
    systemLossDb: Number(dom.systemLoss.value),
    icon: dom.assetIcon.value,
    color: dom.assetColor.value || FORCE_COLORS[dom.assetForce.value],
    notes: dom.assetNotes.value.trim(),
  };
}

function applyEmitterFormData(profile) {
  dom.assetType.value = profile.type ?? dom.assetType.value;
  dom.assetForce.value = profile.force ?? dom.assetForce.value;
  dom.assetName.value = profile.name ?? dom.assetName.value;
  dom.unitName.value = profile.unit ?? dom.unitName.value;
  dom.frequencyMHz.value = profile.frequencyMHz ?? dom.frequencyMHz.value;
  dom.powerW.value = profile.powerW ?? dom.powerW.value;
  dom.antennaHeight.value = profile.antennaHeightM ?? dom.antennaHeight.value;
  dom.antennaGain.value = profile.antennaGainDbi ?? dom.antennaGain.value;
  dom.receiverSensitivity.value = profile.receiverSensitivityDbm ?? dom.receiverSensitivity.value;
  dom.systemLoss.value = profile.systemLossDb ?? dom.systemLoss.value;
  dom.assetIcon.value = profile.icon ?? dom.assetIcon.value;
  dom.assetColor.value = profile.color ?? dom.assetColor.value;
  dom.assetNotes.value = profile.notes ?? dom.assetNotes.value;
}

function addAsset(latlng) {
  const asset = {
    id: crypto.randomUUID(),
    ...getEmitterFormData(),
    lat: latlng.lat,
    lon: latlng.lng,
    groundElevationM: sampleTerrainElevation(latlng.lat, latlng.lng),
  };

  const marker = L.marker(latlng, {
    icon: createEmitterIcon(asset),
    pane: getMapContentPaneName(`asset:${asset.id}`),
  }).addTo(state.map);

  marker.bindPopup(renderAssetPopup(asset));
  state.assetMarkers.set(asset.id, marker);
  state.assets.push(asset);
  renderAssets();
  marker.openPopup();
  syncCesiumEntities();
}

function createEmitterIcon(asset) {
  const markerColor = asset.color || FORCE_COLORS[asset.force];
  const symbol = asset.type === "jammer"
    ? "J"
    : asset.type === "relay"
      ? "R"
      : asset.type === "receiver"
        ? "V"
        : "A";

  return L.divIcon({
    className: "",
    html: `<div class="emitter-marker ${escapeHtml(asset.type)}" style="background:${escapeHtml(markerColor)}"><span>${symbol}</span></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}

function updateAssetMarker(asset) {
  const marker = state.assetMarkers.get(asset.id);
  if (!marker) {
    return;
  }

  marker.setIcon(createEmitterIcon(asset));
  marker.setPopupContent(renderAssetPopup(asset));
}

function saveAssetEdits() {
  const asset = state.assets.find((entry) => entry.id === state.editingAssetId);
  if (!asset) {
    state.editingAssetId = null;
    refreshActionButtons();
    return;
  }

  Object.assign(asset, getEmitterFormData());
  asset.groundElevationM = sampleTerrainElevation(asset.lat, asset.lon);
  updateAssetMarker(asset);
  renderAssets();
  renderMapContents();
  syncCesiumEntities();
  setStatus(`Updated ${asset.name}.`);
  state.editingAssetId = null;
  refreshActionButtons();
}

function renderAssetPopup(asset) {
  const groundElevationLine = Number.isFinite(asset.groundElevationM)
    ? `Ground ${formatElevation(asset.groundElevationM)}<br>`
    : "";
  return `
    <strong>${escapeHtml(asset.name)}</strong><br>
    ${escapeHtml(asset.unit)}<br>
    ${escapeHtml(asset.type)} | ${asset.frequencyMHz} MHz | ${asset.powerW} W<br>
    Gain ${asset.antennaGainDbi} dBi | Height ${asset.antennaHeightM} m<br>
    ${groundElevationLine}
    ${asset.lat.toFixed(5)}, ${asset.lon.toFixed(5)}
  `;
}

function renderAssets() {
  dom.assetList.innerHTML = "";
  dom.assetSelect.innerHTML = "";
  dom.planningTxAsset.innerHTML = "";
  dom.planningRxAsset.innerHTML = "";

  if (!state.assets.length) {
    dom.assetList.innerHTML = `<div class="asset-item">No systems placed yet.</div>`;
    dom.assetSelect.innerHTML = `<option value="">No emitters available</option>`;
    dom.planningTxAsset.innerHTML = `<option value="">No assets</option>`;
    dom.planningRxAsset.innerHTML = `<option value="">No assets</option>`;
    renderMapContents();
    return;
  }

  state.assets.forEach((asset, index) => {
    const row = document.createElement("article");
    row.className = "asset-item";
    row.innerHTML = `
      <header>
        <strong>${escapeHtml(asset.name)}</strong>
        <span class="force-pill"><span class="force-dot" style="background:${asset.color || FORCE_COLORS[asset.force]}"></span>${FORCE_LABELS[asset.force]}</span>
      </header>
      <div class="asset-meta">
        <span>${escapeHtml(asset.unit)}</span>
        <span>${escapeHtml(asset.type)}</span>
        <span>${asset.frequencyMHz} MHz</span>
        <span>${asset.powerW} W</span>
        <span>${asset.antennaGainDbi} dBi</span>
        <span>${asset.antennaHeightM} m</span>
      </div>
    `;
    dom.assetList.appendChild(row);

    const optionLabel = `${index + 1}. ${asset.name} (${asset.unit})`;
    [dom.assetSelect, dom.planningTxAsset, dom.planningRxAsset].forEach((select) => {
      const option = document.createElement("option");
      option.value = asset.id;
      option.textContent = optionLabel;
      select.appendChild(option);
    });
  });

  renderMapContents();
}

function renderTerrains() {
  dom.terrainList.innerHTML = "";

  if (!state.terrains.length) {
    dom.terrainList.innerHTML = `<div class="asset-item">No DTED loaded yet.</div>`;
    return;
  }

  state.terrains.forEach((terrain) => {
    const row = document.createElement("article");
    row.className = `asset-item terrain-item${terrain.id === state.activeTerrainId ? " is-active" : ""}`;
    row.innerHTML = `
      <header>
        <strong>${escapeHtml(terrain.name)}</strong>
        <span>${terrain.id === state.activeTerrainId ? "Active" : "Loaded"}</span>
      </header>
      <div class="terrain-bounds">
        <span>${terrain.rows} x ${terrain.cols} posts</span>
        <span>SW ${terrain.bounds.sw.lat.toFixed(4)}, ${terrain.bounds.sw.lon.toFixed(4)}</span>
        <span>NE ${terrain.bounds.ne.lat.toFixed(4)}, ${terrain.bounds.ne.lon.toFixed(4)}</span>
      </div>
      <div class="terrain-actions">
        <button class="ghost-button small" type="button" data-terrain-action="toggle" data-terrain-id="${terrain.id}">
          ${terrain.extentVisible ? "Hide Coverage" : "Show Coverage"}
        </button>
        <button class="primary-button small" type="button" data-terrain-action="activate" data-terrain-id="${terrain.id}">
          ${terrain.id === state.activeTerrainId ? "In Use" : "Use In Sim"}
        </button>
      </div>
    `;
    dom.terrainList.appendChild(row);
  });

  dom.terrainList.querySelectorAll("[data-terrain-action]").forEach((button) => {
    button.addEventListener("click", onTerrainAction);
  });
}

function renderViewsheds() {
  dom.viewshedList.innerHTML = "";

  if (!state.viewsheds.length) {
    dom.viewshedList.innerHTML = `<div class="asset-item">No coverage layers rendered yet.</div>`;
    renderMapContents();
    return;
  }

  state.viewsheds.forEach((viewshed) => {
    const row = document.createElement("article");
    row.className = `asset-item terrain-item${viewshed.id === state.activeInspectionViewshedId ? " is-active" : ""}`;
    row.innerHTML = `
      <header>
        <strong>${escapeHtml(viewshed.name ?? viewshed.asset.name)}</strong>
        <span>${escapeHtml(viewshed.propagationModelLabel)}</span>
      </header>
      <div class="terrain-bounds">
        <span>${viewshed.asset.frequencyMHz} MHz</span>
        <span>${viewshed.asset.powerW} W</span>
        <span>${viewshed.cellCount} cells</span>
        <span>Radius ${formatDistance(viewshed.radiusMeters)}</span>
      </div>
      <div class="terrain-actions">
        <button class="ghost-button small" type="button" data-viewshed-action="focus" data-viewshed-id="${viewshed.id}">
          ${viewshed.id === state.activeInspectionViewshedId ? "Inspecting" : "Inspect"}
        </button>
        <button class="ghost-button small" type="button" data-viewshed-action="remove" data-viewshed-id="${viewshed.id}">
          Remove
        </button>
      </div>
      <label>
        Layer Opacity
        <input type="range" min="0.15" max="1" step="0.05" value="${viewshed.opacity}" data-viewshed-action="opacity" data-viewshed-id="${viewshed.id}">
      </label>
    `;
    dom.viewshedList.appendChild(row);
  });

  dom.viewshedList.querySelectorAll("[data-viewshed-action]").forEach((control) => {
    const action = control.dataset.viewshedAction;
    control.addEventListener(action === "opacity" ? "input" : "click", onViewshedAction);
  });

  renderMapContents();
}

function renderPlanningResults() {
  dom.planningList.innerHTML = "";

  if (!state.planning.recommendations.length) {
    dom.planningList.innerHTML = `<div class="asset-item">No recommendations computed yet.</div>`;
    renderMapContents();
    return;
  }

  state.planning.recommendations.forEach((entry, index) => {
    const row = document.createElement("article");
    row.className = "asset-item";
    row.innerHTML = `
      <header>
        <strong>Recommendation ${index + 1}</strong>
        <span>Score ${entry.score.toFixed(1)}</span>
      </header>
      <div class="terrain-bounds">
        <span>Friendly RSSI ${entry.friendlyRssiDbm.toFixed(1)} dBm</span>
        <span>Enemy Max ${entry.maxEnemyRssiDbm.toFixed(1)} dBm</span>
        <span>Separation ${formatDistance(entry.separationMeters)}</span>
      </div>
    `;
    dom.planningList.appendChild(row);
  });

  renderMapContents();
}

function onViewshedAction(event) {
  const viewshedId = event.currentTarget.dataset.viewshedId;
  const action = event.currentTarget.dataset.viewshedAction;
  const viewshed = state.viewsheds.find((entry) => entry.id === viewshedId);
  if (!viewshed) {
    return;
  }

  if (action === "focus") {
    state.activeInspectionViewshedId = viewshed.id;
    updateMetrics(viewshed.rssi);
    renderViewsheds();
    focusMapContent(`viewshed:${viewshed.id}`);
    setStatus(`Inspecting ${viewshed.asset.name}. Click the map for point estimates.`);
    return;
  }

  if (action === "remove") {
    removeViewshed(viewshed.id);
    return;
  }

  if (action === "opacity") {
    const opacity = Number(event.currentTarget.value);
    viewshed.opacity = opacity;
    viewshed.layer.setOpacity(opacity);
    renderViewsheds();
  }
}

function removeViewshed(viewshedId) {
  const index = state.viewsheds.findIndex((entry) => entry.id === viewshedId);
  if (index === -1) {
    return;
  }

  const [viewshed] = state.viewsheds.splice(index, 1);
  viewshed.layer.remove();
  state.mapContentAssignments.delete(`viewshed:${viewshedId}`);

  if (state.activeInspectionViewshedId === viewshedId) {
    state.activeInspectionViewshedId = state.viewsheds[0]?.id ?? null;
    updateMetrics(state.viewsheds[0]?.rssi ?? null);
  }

  if (state.editingViewshedId === viewshedId) {
    state.editingViewshedId = null;
    refreshActionButtons();
  }

  renderViewsheds();
  renderMapContents();
  setStatus(`Removed ${viewshed.asset.name} coverage layer.`);
}

function clearViewsheds() {
  state.viewsheds.forEach((viewshed) => viewshed.layer.remove());
  state.viewsheds.forEach((viewshed) => state.mapContentAssignments.delete(`viewshed:${viewshed.id}`));
  state.viewsheds = [];
  state.activeInspectionViewshedId = null;
  state.editingViewshedId = null;
  updateMetrics(null);
  renderViewsheds();
  renderMapContents();
  refreshActionButtons();
  setStatus("All coverage layers cleared.");
}

function onTerrainAction(event) {
  const terrainId = event.currentTarget.dataset.terrainId;
  const action = event.currentTarget.dataset.terrainAction;
  const terrain = state.terrains.find((entry) => entry.id === terrainId);
  if (!terrain) {
    return;
  }

  if (action === "activate") {
    state.activeTerrainId = terrain.id;
    updateTerrainSummary();
    renderTerrains();
    updateMapOverlayMetrics();
    setStatus(`${terrain.name} selected for simulation.`);
    syncCesiumScene();
    return;
  }

  if (action === "toggle") {
    terrain.extentVisible = !terrain.extentVisible;
    if (terrain.extentVisible) {
      showTerrainCoverage(terrain);
    } else {
      hideTerrainCoverage(terrain.id);
    }
    renderTerrains();
  }
}

function showTerrainCoverage(terrain) {
  hideTerrainCoverage(terrain.id);
  const layer = L.rectangle(
    [
      [terrain.bounds.sw.lat, terrain.bounds.sw.lon],
      [terrain.bounds.ne.lat, terrain.bounds.ne.lon],
    ],
    {
      pane: getMapContentPaneName(`terrain:${terrain.id}`),
      color: "#8fb7ff",
      weight: 2,
      fillColor: "#8fb7ff",
      fillOpacity: 0.08,
      dashArray: "8 4",
    },
  ).addTo(state.map);
  layer.bindTooltip(`${terrain.name} terrain coverage`, { sticky: true });
  state.terrainCoverageLayers.set(terrain.id, layer);
  renderMapContents();
}

function hideTerrainCoverage(terrainId) {
  const layer = state.terrainCoverageLayers.get(terrainId);
  if (layer) {
    layer.remove();
    state.terrainCoverageLayers.delete(terrainId);
  }
  state.mapContentAssignments.delete(`terrain:${terrainId}`);
  const terrain = state.terrains.find((entry) => entry.id === terrainId);
  if (terrain) {
    terrain.extentVisible = false;
  }
  renderMapContents();
}

function updateTerrainSummary() {
  const terrain = getActiveTerrain();
  if (!terrain) {
    dom.terrainSummary.textContent = "No terrain loaded. Propagation uses free-space or terrain diffraction only.";
    return;
  }

  dom.terrainSummary.textContent =
    `Active terrain: ${terrain.name}. ${terrain.rows} x ${terrain.cols} posts with ` +
    `${terrain.latStepDeg.toFixed(6)} x ${terrain.lonStepDeg.toFixed(6)} degree spacing.`;
}

function clearAssets() {
  state.assetMarkers.forEach((marker) => marker.remove());
  state.assetMarkers.clear();
  state.assets = [];
  state.editingAssetId = null;
  clearViewsheds();
  state.planning.markersLayer.clearLayers();
  state.planning.recommendations = [];
  renderAssets();
  renderPlanningResults();
  renderMapContents();
  refreshActionButtons();
  syncCesiumEntities();
  setStatus("All emitters removed.");
}

function updateWeatherState() {
  state.weather.temperatureC = parseTemperatureInput(dom.tempC.value);
  state.weather.humidity = Number(dom.humidity.value);
  state.weather.pressureHpa = parsePressureInput(dom.pressure.value);
  state.weather.windSpeedMps = parseWindSpeedInput(dom.windSpeed.value);
  if (state.weather.source === "manual") {
    dom.weatherSummary.textContent = "Manual weather profile active.";
  }
}

async function fetchWeather() {
  const center = state.gps.location
    ? L.latLng(state.gps.location.lat, state.gps.location.lon)
    : state.assets.length
      ? L.latLng(state.assets[0].lat, state.assets[0].lon)
      : state.map.getCenter();

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", center.lat.toFixed(5));
  url.searchParams.set("longitude", center.lng.toFixed(5));
  url.searchParams.set("current", "temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m");

  setStatus("Fetching local weather...");

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("Weather request failed.");
    }

    const payload = await response.json();
    const current = payload.current;
    state.weather.temperatureC = current.temperature_2m ?? state.weather.temperatureC;
    state.weather.humidity = current.relative_humidity_2m ?? state.weather.humidity;
    state.weather.pressureHpa = current.surface_pressure ?? state.weather.pressureHpa;
    state.weather.windSpeedMps = current.wind_speed_10m ?? state.weather.windSpeedMps;

    state.weather.source = "open-meteo";
    syncWeatherInputsFromState();
    dom.weatherSummary.textContent = `Weather from Open-Meteo at ${payload.current.time}.`;
    setStatus("Weather updated.");
  } catch (error) {
    state.weather.source = "manual";
    dom.weatherSummary.textContent = "Weather fetch failed. Manual values remain active.";
    setStatus(error.message, true);
  }
}

async function onTerrainImport(event) {
  const [file] = event.target.files;
  if (!file) {
    return;
  }

  setStatus(`Importing terrain from ${file.name}...`);

  try {
    const buffer = await file.arrayBuffer();
    const terrain = parseDted(buffer, file.name);
    terrain.id = crypto.randomUUID();
    terrain.name = file.name;
    terrain.extentVisible = false;

    state.terrains.push(terrain);
    state.activeTerrainId = terrain.id;
    renderTerrains();
    updateTerrainSummary();
    updateMapOverlayMetrics();
    await cacheTerrainInWorker(terrain);
    syncCesiumScene();
    setStatus("Terrain imported.");
  } catch (error) {
    dom.terrainSummary.textContent = "Terrain import failed. Check DTED format.";
    setStatus(error.message, true);
  } finally {
    dom.dtedInput.value = "";
  }
}

function cacheTerrainInWorker(terrain) {
  const elevations = terrain.elevations.slice(0);
  return new Promise((resolve) => {
    state.terrainCacheResolvers.set(terrain.id, resolve);
    state.worker.postMessage(
      {
        type: "terrain:cache",
        payload: {
          id: terrain.id,
          name: terrain.name,
          origin: terrain.origin,
          bounds: terrain.bounds,
          rows: terrain.rows,
          cols: terrain.cols,
          latStepDeg: terrain.latStepDeg,
          lonStepDeg: terrain.lonStepDeg,
          elevations,
        },
      },
      [elevations.buffer],
    );
  });
}

function clearTerrain() {
  state.terrains.forEach((terrain) => hideTerrainCoverage(terrain.id));
  state.terrains = [];
  state.activeTerrainId = null;
  state.terrainReadyIds.clear();
  state.ionTerrainCache.clear();
  state.worker.postMessage({ type: "terrain:clear" });
  renderTerrains();
  updateTerrainSummary();
  updateMapOverlayMetrics();
  renderMapContents();
  syncCesiumScene();
  setStatus("Terrain cleared.");
}

async function runSimulation() {
  const assetId = dom.assetSelect.value;
  const selected = state.assets.find((asset) => asset.id === assetId);
  if (!selected) {
    setStatus("Place and select an emitter first.", true);
    return;
  }

  try {
    const existingViewshed = state.viewsheds.find((entry) => entry.id === state.editingViewshedId);
    setStatus(state.editingViewshedId ? `Updating ${existingViewshed?.name ?? "coverage layer"}...` : "Generating coverage layer...");
    const terrainId = await resolveTerrainIdForSimulation(selected);
    state.worker.postMessage({
      type: "simulation:start",
      payload: {
        requestId: state.editingViewshedId ?? crypto.randomUUID(),
        asset: selected,
        weather: state.weather,
        terrainId,
        radiusMeters: Number(dom.radiusKm.value) * 1000,
        gridMeters: Number(dom.gridMeters.value),
        receiverHeight: Number(dom.receiverHeight.value),
        opacity: Number(dom.viewshedOpacity.value),
        propagationModel: dom.propagationModel.value,
      },
    });
  } catch (error) {
    setStatus(error.message, true);
  }
}

function consumeSimulationResult(payload) {
  const latitudes = new Float64Array(payload.latitudes);
  const longitudes = new Float64Array(payload.longitudes);
  const rssi = new Float32Array(payload.rssi);
  const pathLoss = new Float32Array(payload.pathLoss);
  const obstruction = new Float32Array(payload.obstruction);
  const lineOfSight = new Uint8Array(payload.lineOfSight);
  const existingViewshed = state.viewsheds.find((entry) => entry.id === payload.requestId);
  const layer = new CanvasViewshedLayer({
    pane: getMapContentPaneName(`viewshed:${payload.requestId}`),
    latitudes,
    longitudes,
    rssi,
    lineOfSight,
    gridLatStepDeg: payload.gridLatStepDeg,
    gridLonStepDeg: payload.gridLonStepDeg,
    opacity: payload.opacity,
  });
  layer.addTo(state.viewshedRootLayer);

  const viewshed = {
    id: payload.requestId,
    name: existingViewshed?.name ?? `${payload.asset.name} Coverage`,
    layer,
    asset: payload.asset,
    terrainId: payload.terrainId ?? null,
    radiusMeters: payload.radiusMeters,
    receiverHeight: payload.receiverHeight,
    opacity: payload.opacity,
    propagationModel: payload.propagationModel,
    propagationModelLabel: propagationModelLabel(payload.propagationModel),
    cellCount: latitudes.length,
    latitudes,
    longitudes,
    rssi,
    pathLoss,
    obstruction,
    lineOfSight,
    bounds: leafletBoundsFromData(payload.asset, payload.radiusMeters),
  };

  if (existingViewshed) {
    existingViewshed.layer.remove();
    const index = state.viewsheds.findIndex((entry) => entry.id === payload.requestId);
    state.viewsheds.splice(index, 1, viewshed);
  } else {
    state.viewsheds.push(viewshed);
  }
  state.activeInspectionViewshedId = viewshed.id;
  state.editingViewshedId = null;
  refreshActionButtons();

  const emitterMarker = state.assetMarkers.get(payload.asset.id);
  if (emitterMarker) {
    emitterMarker.openPopup();
  }

  updateMetrics(rssi);
  renderViewsheds();
  renderMapContents();
  setStatus(`Coverage complete for ${payload.asset.name}.`);
}

function inspectSignalPoint(latlng) {
  const viewshed = state.viewsheds.find((entry) => entry.id === state.activeInspectionViewshedId);
  if (!viewshed || state.pendingInspection) {
    return;
  }

  state.pendingInspection = {
    id: viewshed.id,
    lat: latlng.lat,
    lon: latlng.lng,
  };

  state.worker.postMessage({
    type: "inspection:start",
    payload: {
      asset: viewshed.asset,
      target: { lat: latlng.lat, lon: latlng.lng },
      weather: state.weather,
      terrainId: viewshed.terrainId ?? state.activeTerrainId,
      receiverHeight: viewshed.receiverHeight,
      propagationModel: viewshed.propagationModel,
    },
  });
}

function consumeInspectionResult(payload) {
  if (!state.pendingInspection) {
    return;
  }

  const { lat, lon } = state.pendingInspection;
  state.pendingInspection = null;
  const popup = `
    <strong>Point Signal Estimate</strong><br>
    RSSI: ${payload.rssiDbm.toFixed(1)} dBm<br>
    Path Loss: ${payload.pathLossDb.toFixed(1)} dB<br>
    Range: ${formatDistance(payload.distanceKm * 1000)}<br>
    Line of Sight: ${payload.lineOfSight ? "Yes" : "Blocked"}<br>
    Terrain Blockage: ${formatElevation(payload.maxObstructionM)}
  `;

  L.popup()
    .setLatLng([lat, lon])
    .setContent(popup)
    .openOn(state.map);
}

function updateMetrics(rssiArray) {
  if (!rssiArray?.length) {
    dom.coverageMetric.textContent = "0 cells";
    dom.minRssiMetric.textContent = "n/a";
    dom.maxRssiMetric.textContent = "n/a";
    return;
  }

  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (let index = 0; index < rssiArray.length; index += 1) {
    const value = rssiArray[index];
    if (value < min) {
      min = value;
    }
    if (value > max) {
      max = value;
    }
  }

  dom.coverageMetric.textContent = `${rssiArray.length} cells`;
  dom.minRssiMetric.textContent = `${min.toFixed(1)} dBm`;
  dom.maxRssiMetric.textContent = `${max.toFixed(1)} dBm`;
}

function setStatus(message, isError = false) {
  dom.statusBadge.textContent = message;
  dom.statusBadge.style.color = isError ? "#ff9f9f" : "";
}

function getTerrainById(terrainId) {
  if (!terrainId) {
    return null;
  }
  return state.terrains.find((terrain) => terrain.id === terrainId)
    ?? Array.from(state.ionTerrainCache.values()).find((terrain) => terrain.id === terrainId)
    ?? null;
}

function getActiveTerrain() {
  return getTerrainById(state.activeTerrainId);
}

function loadProfiles() {
  const stored = window.localStorage.getItem(PROFILE_STORAGE_KEY);
  if (stored) {
    state.profiles = JSON.parse(stored);
  } else {
    state.profiles = [
      {
        id: crypto.randomUUID(),
        profileName: "Standard VHF",
        type: "radio",
        force: "friendly",
        name: "RF-01",
        unit: "Alpha",
        frequencyMHz: 350,
        powerW: 50,
        antennaHeightM: 10,
        antennaGainDbi: 2.1,
        receiverSensitivityDbm: -95,
        systemLossDb: 1.5,
        icon: "radio",
        color: "#38bdf8",
        notes: "",
      },
    ];
    persistProfiles();
  }

  renderProfiles();
  if (state.profiles[0]) {
    dom.profileSelect.value = state.profiles[0].id;
    onProfileSelectionChange();
  }
}

function persistProfiles() {
  window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(state.profiles));
}

function renderProfiles() {
  dom.profileSelect.innerHTML = "";
  if (!state.profiles.length) {
    dom.profileSelect.innerHTML = `<option value="">No profiles saved</option>`;
    return;
  }

  state.profiles.forEach((profile) => {
    const option = document.createElement("option");
    option.value = profile.id;
    option.textContent = profile.profileName;
    dom.profileSelect.appendChild(option);
  });
}

function onProfileSelectionChange() {
  const profile = state.profiles.find((entry) => entry.id === dom.profileSelect.value);
  if (!profile) {
    return;
  }
  dom.profileName.value = profile.profileName;
  applyEmitterFormData(profile);
}

function saveProfile() {
  const name = dom.profileName.value.trim();
  if (!name) {
    setStatus("Enter a profile name.", true);
    return;
  }

  const existing = state.profiles.find((entry) => entry.id === dom.profileSelect.value);
  const payload = {
    ...(existing ?? { id: crypto.randomUUID() }),
    profileName: name,
    ...getEmitterFormData(),
  };

  if (existing) {
    Object.assign(existing, payload);
  } else {
    state.profiles.push(payload);
  }

  persistProfiles();
  renderProfiles();
  dom.profileSelect.value = payload.id;
  setStatus(`Saved profile ${name}.`);
}

function deleteProfile() {
  const index = state.profiles.findIndex((entry) => entry.id === dom.profileSelect.value);
  if (index === -1) {
    setStatus("Select a profile to delete.", true);
    return;
  }
  const [removed] = state.profiles.splice(index, 1);
  persistProfiles();
  renderProfiles();
  if (state.profiles[0]) {
    dom.profileSelect.value = state.profiles[0].id;
    onProfileSelectionChange();
  }
  setStatus(`Deleted profile ${removed.profileName}.`);
}

function applySelectedProfile() {
  const profile = state.profiles.find((entry) => entry.id === dom.profileSelect.value);
  if (!profile) {
    setStatus("Select a profile first.", true);
    return;
  }
  applyEmitterFormData(profile);
  setStatus(`Applied profile ${profile.profileName}.`);
}

function exportAssetsGeoJson() {
  if (!state.assets.length) {
    setStatus("No emitters to export.", true);
    return;
  }

  const featureCollection = {
    type: "FeatureCollection",
    features: state.assets.map((asset) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [asset.lon, asset.lat],
      },
      properties: {
        ...asset,
        exportedAt: new Date().toISOString(),
      },
    })),
  };

  downloadBlob(
    new Blob([JSON.stringify(featureCollection, null, 2)], { type: "application/geo+json" }),
    `emitters-${timestampSlug()}.geojson`,
  );
  setStatus("GeoJSON exported.");
}

async function exportAssetsKml(asKmz) {
  if (!state.assets.length) {
    setStatus("No emitters to export.", true);
    return;
  }

  const kml = buildKmlDocument();
  if (!asKmz) {
    downloadBlob(new Blob([kml], { type: "application/vnd.google-earth.kml+xml" }), `emitters-${timestampSlug()}.kml`);
    setStatus("KML exported.");
    return;
  }

  const zip = new window.JSZip();
  zip.file("doc.kml", kml);
  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(blob, `emitters-${timestampSlug()}.kmz`);
  setStatus("KMZ exported.");
}

function buildKmlDocument() {
  const placemarks = state.assets.map((asset) => {
    const kmlColor = hexToKmlColor(asset.color || FORCE_COLORS[asset.force]);
    const fields = [
      ["id", asset.id],
      ["name", asset.name],
      ["unit", asset.unit],
      ["type", asset.type],
      ["force", asset.force],
      ["frequencyMHz", asset.frequencyMHz],
      ["powerW", asset.powerW],
      ["antennaHeightM", asset.antennaHeightM],
      ["antennaGainDbi", asset.antennaGainDbi],
      ["receiverSensitivityDbm", asset.receiverSensitivityDbm],
      ["systemLossDb", asset.systemLossDb],
      ["icon", asset.icon],
      ["color", asset.color],
      ["notes", asset.notes],
    ]
      .map(([name, value]) => `<Data name="${escapeXml(String(name))}"><value>${escapeXml(String(value ?? ""))}</value></Data>`)
      .join("");

    return `
      <Placemark>
        <name>${escapeXml(asset.name)}</name>
        <description>${escapeXml(asset.notes || "")}</description>
        <Style>
          <IconStyle>
            <color>${kmlColor}</color>
            <scale>1.1</scale>
          </IconStyle>
          <LabelStyle>
            <scale>0.9</scale>
          </LabelStyle>
        </Style>
        <ExtendedData>${fields}</ExtendedData>
        <Point><coordinates>${asset.lon},${asset.lat},0</coordinates></Point>
      </Placemark>
    `;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Emitter Export</name>
    ${placemarks}
  </Document>
</kml>`;
}

async function connectBrowserGeolocation() {
  if (!navigator.geolocation) {
    setStatus("Geolocation API is not available in this browser.", true);
    return;
  }

  if (state.gps.geolocationWatchId !== null) {
    navigator.geolocation.clearWatch(state.gps.geolocationWatchId);
  }

  state.gps.geolocationWatchId = navigator.geolocation.watchPosition(
    (position) => {
      applyGpsFix({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        accuracyM: position.coords.accuracy ?? null,
      }, "browser");
    },
    (error) => setStatus(error.message, true),
    { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 },
  );

  setStatus("Browser GPS connected.");
}

async function connectUsbGps() {
  if (!("serial" in navigator)) {
    setStatus("Web Serial is not supported in this browser.", true);
    return;
  }

  try {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    state.gps.serialPort = port;
    state.gps.serialReader = port.readable.getReader();
    state.gps.mode = "usb";
    dom.gpsStatusValue.textContent = "USB GPS Connected";
    setStatus("USB GPS connected. Waiting for NMEA sentences...");
    readUsbGpsLoop();
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function readUsbGpsLoop() {
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (state.gps.serialReader) {
      const { value, done } = await state.gps.serialReader.read();
      if (done) {
        break;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? "";
      lines.forEach((line) => {
        const fix = parseNmeaSentence(line.trim());
        if (fix) {
          applyGpsFix(fix, "usb");
        }
      });
    }
  } catch (error) {
    setStatus(error.message, true);
  }
}

function parseNmeaSentence(sentence) {
  if (!sentence.startsWith("$")) {
    return null;
  }
  const parts = sentence.split(",");
  if (parts[0] === "$GPGGA" || parts[0] === "$GNGGA") {
    if (!parts[2] || !parts[4] || parts[6] === "0") {
      return null;
    }
    return {
      lat: nmeaToDecimal(parts[2], parts[3]),
      lon: nmeaToDecimal(parts[4], parts[5]),
      accuracyM: null,
    };
  }
  if (parts[0] === "$GPRMC" || parts[0] === "$GNRMC") {
    if (parts[2] !== "A") {
      return null;
    }
    return {
      lat: nmeaToDecimal(parts[3], parts[4]),
      lon: nmeaToDecimal(parts[5], parts[6]),
      accuracyM: null,
    };
  }
  return null;
}

function nmeaToDecimal(raw, hemisphere) {
  const value = Number(raw);
  const degrees = Math.floor(value / 100);
  const minutes = value - degrees * 100;
  let decimal = degrees + minutes / 60;
  if (hemisphere === "S" || hemisphere === "W") {
    decimal *= -1;
  }
  return decimal;
}

function applyGpsFix(fix, mode) {
  state.gps.mode = mode;
  state.gps.location = fix;
  dom.gpsStatusValue.textContent = mode === "usb" ? "USB GPS Active" : "Browser GPS Active";
  updateCoordinateDisplays();

  if (!state.gps.marker) {
    state.gps.marker = L.marker([fix.lat, fix.lon], {
      icon: L.divIcon({
        className: "user-location-marker",
        iconSize: [16, 16],
      }),
    }).addTo(state.map);
  } else {
    state.gps.marker.setLatLng([fix.lat, fix.lon]);
  }

  if (fix.accuracyM) {
    if (!state.gps.accuracyCircle) {
      state.gps.accuracyCircle = L.circle([fix.lat, fix.lon], {
        radius: fix.accuracyM,
        color: "#34d399",
        weight: 1,
        fillOpacity: 0.08,
      }).addTo(state.map);
    } else {
      state.gps.accuracyCircle.setLatLng([fix.lat, fix.lon]).setRadius(fix.accuracyM);
    }
  }

  const centerMode = dom.gpsCenterMode.value;
  if (centerMode === "follow" || (centerMode === "once" && !state.gps.centeredOnce)) {
    state.map.setView([fix.lat, fix.lon], Math.max(state.map.getZoom(), 13));
    state.gps.centeredOnce = true;
  }

  updateMapOverlayMetrics();
  syncCesiumEntities();
}

function drawPlanningRegion() {
  new L.Draw.Polygon(state.map, {
    shapeOptions: {
      color: "#d9e4ff",
      weight: 2,
    },
    allowIntersection: false,
  }).enable();
  setStatus("Draw the planning boundary on the map.");
}

function onPlanningRegionCreated(event) {
  if (event.layerType !== "polygon") {
    return;
  }

  if (state.planning.regionLayer) {
    state.planning.regionLayer.remove();
  }
  const latLngs = event.layer.getLatLngs()[0];
  event.layer.remove();
  state.planning.regionLayer = L.polygon(latLngs, {
    pane: getMapContentPaneName("planning-region"),
    color: "#d9e4ff",
    fillColor: "#d9e4ff",
    fillOpacity: 0.08,
  }).addTo(state.map);
  renderMapContents();
  setStatus("Planning region updated.");
  syncCesiumEntities();
}

async function runPlanning() {
  if (!state.planning.regionLayer) {
    setStatus("Draw a planning region first.", true);
    return;
  }

  const txAsset = state.assets.find((asset) => asset.id === dom.planningTxAsset.value);
  const rxAsset = state.assets.find((asset) => asset.id === dom.planningRxAsset.value);
  if (!txAsset || !rxAsset) {
    setStatus("Select both Tx and Rx assets.", true);
    return;
  }

  const polygon = state.planning.regionLayer.getLatLngs()[0].map((point) => ({
    lat: point.lat,
    lon: point.lng,
  }));
  const enemyAssets = state.assets.filter((asset) => asset.force === "enemy");

  try {
    const terrainId = await resolveTerrainIdForPlanning(polygon, Number(dom.planningGridMeters.value));

    state.pendingPlanningRequestId = crypto.randomUUID();
    setStatus("Evaluating candidate placements...");
    state.worker.postMessage({
      type: "planning:start",
      payload: {
        requestId: state.pendingPlanningRequestId,
        polygon,
        txAsset,
        rxAsset,
        enemyAssets,
        gridMeters: Number(dom.planningGridMeters.value),
        minSeparationMeters: Number(dom.planningMinSeparation.value),
        detectionWeight: Number(dom.planningEnemyWeight.value),
        separationWeight: Number(dom.planningSeparationWeight.value),
        floorM: Number(dom.planningFloorM.value),
        ceilingM: Number(dom.planningCeilingM.value),
        weather: state.weather,
        terrainId,
        propagationModel: dom.propagationModel.value,
      },
    });
  } catch (error) {
    setStatus(error.message, true);
  }
}

function consumePlanningResult(payload) {
  if (payload.requestId !== state.pendingPlanningRequestId) {
    return;
  }

  state.planning.terrainId = payload.terrainId ?? null;
  state.planning.recommendations = payload.recommendations;
  state.planning.markersLayer.clearLayers();

  payload.recommendations.forEach((recommendation, index) => {
    const txGround = Number.isFinite(recommendation.tx.groundElevationM)
      ? ` | Ground ${formatElevation(recommendation.tx.groundElevationM)}`
      : "";
    const txMarker = L.circleMarker([recommendation.tx.lat, recommendation.tx.lon], {
      pane: getMapContentPaneName("planning-results"),
      radius: 7,
      color: "#4ade80",
      fillColor: "#4ade80",
      fillOpacity: 0.9,
      weight: 2,
    }).bindPopup(`Recommended Tx ${index + 1}<br>${recommendation.tx.lat.toFixed(5)}, ${recommendation.tx.lon.toFixed(5)}${txGround}`);

    const rxGround = Number.isFinite(recommendation.rx.groundElevationM)
      ? ` | Ground ${formatElevation(recommendation.rx.groundElevationM)}`
      : "";
    const rxMarker = L.circleMarker([recommendation.rx.lat, recommendation.rx.lon], {
      pane: getMapContentPaneName("planning-results"),
      radius: 7,
      color: "#facc15",
      fillColor: "#facc15",
      fillOpacity: 0.9,
      weight: 2,
    }).bindPopup(`Recommended Rx ${index + 1}<br>${recommendation.rx.lat.toFixed(5)}, ${recommendation.rx.lon.toFixed(5)}${rxGround}`);

    const link = L.polyline(
      [
        [recommendation.tx.lat, recommendation.tx.lon],
        [recommendation.rx.lat, recommendation.rx.lon],
      ],
      {
        pane: getMapContentPaneName("planning-results"),
        color: recommendation.friendlyLineOfSight ? "#d9e4ff" : "#f97316",
        weight: 2,
        dashArray: recommendation.friendlyLineOfSight ? "" : "6 6",
      },
    );

    state.planning.markersLayer.addLayer(txMarker);
    state.planning.markersLayer.addLayer(rxMarker);
    state.planning.markersLayer.addLayer(link);
  });

  renderPlanningResults();
  if (payload.recommendations[0]) {
    const best = payload.recommendations[0];
    dom.planningSummary.textContent =
      `Top solution uses ${payload.candidateCount} candidate points. Friendly RSSI ${best.friendlyRssiDbm.toFixed(1)} dBm, ` +
      `enemy max ${best.maxEnemyRssiDbm.toFixed(1)} dBm, separation ${formatDistance(best.separationMeters)}.`;
  }
  syncCesiumEntities();
  renderMapContents();
  setStatus("Site planning complete.");
}

async function toggle3dView() {
  state.view3dEnabled = !state.view3dEnabled;
  dom.view3dToggleBtn.textContent = state.view3dEnabled ? "2D View" : "3D View";
  dom.cesiumContainer.classList.toggle("hidden", !state.view3dEnabled);
  dom.cesiumCompassBtn.classList.toggle("hidden", !state.view3dEnabled);
  dom.map.style.visibility = state.view3dEnabled ? "hidden" : "visible";

  if (state.view3dEnabled) {
    await initCesiumIfNeeded();
    await syncCesiumScene();
    syncCesiumEntities();
    updateCesiumCompass();
  }
}

async function initCesiumIfNeeded() {
  if (state.cesiumViewer) {
    state.cesiumViewer.resize();
    return;
  }

  state.cesiumViewer = new window.Cesium.Viewer("cesiumContainer", {
    animation: false,
    timeline: false,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: true,
    sceneModePicker: false,
    navigationHelpButton: false,
    fullscreenButton: false,
    infoBox: false,
    selectionIndicator: false,
    terrainProvider: new window.Cesium.EllipsoidTerrainProvider(),
  });

  state.cesiumViewer.camera.percentageChanged = 0.001;
  state.cesiumViewer.camera.changed.addEventListener(updateCesiumCompass);
}

async function syncCesiumScene() {
  if (!state.cesiumViewer) {
    return;
  }

  try {
    const viewer = state.cesiumViewer;
    viewer.imageryLayers.removeAll();
    viewer.imageryLayers.addImageryProvider(buildImageryProvider());
    viewer.terrainProvider = await buildTerrainProvider();
    const center = state.gps.location
      ? { lat: state.gps.location.lat, lon: state.gps.location.lon }
      : state.assets[0]
        ? { lat: state.assets[0].lat, lon: state.assets[0].lon }
        : { lat: 34.744, lon: -116.151 };

    viewer.camera.flyTo({
      destination: window.Cesium.Cartesian3.fromDegrees(center.lon, center.lat, 18000),
      duration: 0.8,
    });
    updateCesiumCompass();
  } catch (error) {
    setStatus(`3D scene error: ${error.message}`, true);
  }
}

function updateCesiumCompass() {
  if (!state.cesiumViewer) {
    return;
  }

  const headingDegrees = window.Cesium.Math.toDegrees(state.cesiumViewer.camera.heading);
  dom.cesiumCompassRose.style.transform = `rotate(${-headingDegrees}deg)`;
}

function resetCesiumNorthUp() {
  if (!state.cesiumViewer) {
    return;
  }

  const camera = state.cesiumViewer.camera;
  const position = camera.positionCartographic;
  if (!position) {
    return;
  }

  camera.flyTo({
    destination: window.Cesium.Cartesian3.fromRadians(position.longitude, position.latitude, position.height),
    orientation: {
      heading: 0,
      pitch: camera.pitch,
      roll: 0,
    },
    duration: 0.45,
  });
}

function buildImageryProvider() {
  const selected = dom.imagerySourceSelect.value === "selected-basemap" ? dom.basemapSelect.value : dom.imagerySourceSelect.value;
  const config = selected === "custom"
    ? {
      url: dom.customTileUrl.value.trim(),
      credit: "Custom imagery source",
    }
    : BASEMAPS[selected] ?? BASEMAPS.esri;

  return new window.Cesium.UrlTemplateImageryProvider({
    url: config.url,
    credit: config.attribution || config.credit,
  });
}

async function buildTerrainProvider() {
  const selection = dom.terrainSourceSelect.value;
  if (selection === "ellipsoid") {
    state.cesiumTerrainProvider = null;
    return new window.Cesium.EllipsoidTerrainProvider();
  }
  if (selection === "custom") {
    const url = dom.customTerrainUrl.value.trim();
    if (!url) {
      throw new Error("Enter a custom terrain URL first.");
    }
    state.cesiumTerrainProvider = null;
    return await window.Cesium.CesiumTerrainProvider.fromUrl(url);
  }
  return await getCesiumWorldTerrainProvider();
}

async function getCesiumWorldTerrainProvider() {
  const token = dom.cesiumIonToken.value.trim();
  if (!token) {
    throw new Error("Enter a Cesium Ion token first.");
  }

  window.Cesium.Ion.defaultAccessToken = token;
  if (!state.cesiumTerrainProvider) {
    state.cesiumTerrainProvider = await window.Cesium.createWorldTerrainAsync();
  }
  return state.cesiumTerrainProvider;
}

async function resolveTerrainIdForSimulation(asset) {
  if (state.activeTerrainId) {
    await ensureTerrainReady(state.activeTerrainId);
    return state.activeTerrainId;
  }

  if (dom.terrainSourceSelect.value !== "cesium-world") {
    return null;
  }

  const radiusMeters = Number(dom.radiusKm.value) * 1000;
  const bounds = boundsFromCenter(asset.lat, asset.lon, radiusMeters);
  return await ensureIonTerrainGrid(bounds, Number(dom.gridMeters.value), `sim:${asset.id}:${radiusMeters}:${dom.gridMeters.value}`);
}

async function resolveTerrainIdForPlanning(polygon, gridMeters) {
  if (state.activeTerrainId) {
    await ensureTerrainReady(state.activeTerrainId);
    return state.activeTerrainId;
  }

  if (dom.terrainSourceSelect.value !== "cesium-world") {
    return null;
  }

  const bounds = boundsFromPolygon(polygon);
  const key = `plan:${polygon.map((point) => `${point.lat.toFixed(4)},${point.lon.toFixed(4)}`).join("|")}:${gridMeters}`;
  return await ensureIonTerrainGrid(bounds, gridMeters, key);
}

async function ensureTerrainReady(terrainId) {
  if (!terrainId) {
    return;
  }
  if (!state.terrainReadyIds.has(terrainId)) {
    throw new Error("Terrain is still caching in the worker. Try again in a moment.");
  }
}

async function ensureIonTerrainGrid(bounds, gridMeters, cacheKey) {
  const cached = state.ionTerrainCache.get(cacheKey);
  if (cached) {
    await ensureTerrainReady(cached.id);
    return cached.id;
  }

  setStatus("Sampling Cesium World Terrain for propagation...");
  const terrain = await sampleCesiumTerrainGrid(bounds, gridMeters, cacheKey);
  state.ionTerrainCache.set(cacheKey, terrain);
  await cacheTerrainInWorker(terrain);
  return terrain.id;
}

async function sampleCesiumTerrainGrid(bounds, gridMeters, cacheKey) {
  const provider = await getCesiumWorldTerrainProvider();
  const centerLat = (bounds.sw.lat + bounds.ne.lat) / 2;
  const latStepDeg = metersToLatitudeDegrees(gridMeters);
  const lonStepDeg = metersToLongitudeDegrees(gridMeters, centerLat);
  const rows = Math.max(2, Math.round((bounds.ne.lat - bounds.sw.lat) / latStepDeg) + 1);
  const cols = Math.max(2, Math.round((bounds.ne.lon - bounds.sw.lon) / lonStepDeg) + 1);
  const positions = [];

  for (let row = 0; row < rows; row += 1) {
    const lat = bounds.sw.lat + row * latStepDeg;
    for (let col = 0; col < cols; col += 1) {
      const lon = bounds.sw.lon + col * lonStepDeg;
      positions.push(window.Cesium.Cartographic.fromDegrees(lon, lat));
    }
  }

  const sampled = await window.Cesium.sampleTerrainMostDetailed(provider, positions);
  const elevations = new Float32Array(rows * cols);
  sampled.forEach((position, index) => {
    elevations[index] = Number.isFinite(position.height) ? position.height : 0;
  });

  return {
    id: `ion:${cacheKey}`,
    name: "Cesium World Terrain",
    origin: { lat: bounds.sw.lat, lon: bounds.sw.lon },
    bounds,
    rows,
    cols,
    latStepDeg,
    lonStepDeg,
    elevations,
  };
}

function boundsFromCenter(lat, lon, radiusMeters) {
  const latDelta = metersToLatitudeDegrees(radiusMeters);
  const lonDelta = metersToLongitudeDegrees(radiusMeters, lat);
  return {
    sw: { lat: lat - latDelta, lon: lon - lonDelta },
    ne: { lat: lat + latDelta, lon: lon + lonDelta },
  };
}

function boundsFromPolygon(polygon) {
  let minLat = Number.POSITIVE_INFINITY;
  let maxLat = Number.NEGATIVE_INFINITY;
  let minLon = Number.POSITIVE_INFINITY;
  let maxLon = Number.NEGATIVE_INFINITY;

  polygon.forEach((point) => {
    minLat = Math.min(minLat, point.lat);
    maxLat = Math.max(maxLat, point.lat);
    minLon = Math.min(minLon, point.lon);
    maxLon = Math.max(maxLon, point.lon);
  });

  return {
    sw: { lat: minLat, lon: minLon },
    ne: { lat: maxLat, lon: maxLon },
  };
}

function leafletBoundsFromData(asset, radiusMeters) {
  const bounds = boundsFromCenter(asset.lat, asset.lon, radiusMeters);
  return L.latLngBounds(
    [bounds.sw.lat, bounds.sw.lon],
    [bounds.ne.lat, bounds.ne.lon],
  );
}

function refreshActionButtons() {
  dom.placeAssetBtn.textContent = state.editingAssetId ? "Save Changes" : "Place On Map";
  dom.runSimulationBtn.textContent = state.editingViewshedId ? "Update Coverage" : "Generate Coverage";
}

function getMapContentPaneName(contentId) {
  const safeId = contentId.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  const paneName = `content-${safeId}`;
  if (!state.map.getPane(paneName)) {
    const pane = state.map.createPane(paneName);
    pane.style.zIndex = "410";
  }
  return paneName;
}

function getMapContentEntries() {
  const entries = [];

  state.mapContentFolders.forEach((folder) => {
    const folderContentId = `folder:${folder.id}`;
    const childCount = state.mapContentOrder.filter((entryId) => state.mapContentAssignments.get(entryId) === folderContentId).length;
    entries.push({
      id: folderContentId,
      kind: "folder",
      name: folder.name,
      subtitle: `${childCount} item${childCount === 1 ? "" : "s"}`,
    });
  });

  state.assets.forEach((asset) => {
    entries.push({
      id: `asset:${asset.id}`,
      kind: "asset",
      name: asset.name,
      subtitle: `${asset.type} | ${asset.unit}`,
    });
  });

  state.importedItems.forEach((item) => {
    entries.push({
      id: `imported:${item.id}`,
      kind: item.kind,
      name: item.name,
      subtitle: item.subtitle,
    });
  });

  state.viewsheds.forEach((viewshed) => {
    entries.push({
      id: `viewshed:${viewshed.id}`,
      kind: "viewshed",
      name: viewshed.name ?? `${viewshed.asset.name} Coverage`,
      subtitle: viewshed.propagationModelLabel,
    });
  });

  state.terrains.forEach((terrain) => {
    if (!terrain.extentVisible || !state.terrainCoverageLayers.has(terrain.id)) {
      return;
    }
    entries.push({
      id: `terrain:${terrain.id}`,
      kind: "terrain",
      name: terrain.name,
      subtitle: "Terrain Coverage",
    });
  });

  if (state.planning.regionLayer) {
    entries.push({
      id: "planning-region",
      kind: "planning-region",
      name: state.planning.regionName,
      subtitle: "Boundary",
    });
  }

  if (state.planning.recommendations.length) {
    entries.push({
      id: "planning-results",
      kind: "planning-results",
      name: state.planning.resultsName,
      subtitle: `${state.planning.recommendations.length} recommendation${state.planning.recommendations.length === 1 ? "" : "s"}`,
    });
  }

  return entries;
}

function syncMapContentOrder(entries) {
  const ids = entries.map((entry) => entry.id);
  state.mapContentOrder = state.mapContentOrder.filter((id) => ids.includes(id));
  ids.forEach((id) => {
    if (!state.mapContentOrder.includes(id)) {
      state.mapContentOrder.unshift(id);
    }
  });
}

function getMapContentFolderId(contentId) {
  return state.mapContentAssignments.get(contentId) ?? null;
}

function setMapContentFolderId(contentId, folderId) {
  if (!folderId) {
    state.mapContentAssignments.delete(contentId);
    return;
  }
  state.mapContentAssignments.set(contentId, folderId);
}

function buildMapContentRow(entry, isChild = false) {
  const row = document.createElement("article");
  row.className = "asset-item map-content-item";
  row.draggable = true;
  row.dataset.contentId = entry.id;
  if (isChild) {
    row.dataset.child = "true";
  }
  row.innerHTML = `
    <div class="map-content-row">
      <div class="map-content-grip">::</div>
      <div class="map-content-copy">
        <strong>${escapeHtml(entry.name)}</strong>
        <span>${escapeHtml(entry.subtitle)}</span>
      </div>
      <span class="map-content-kind">${escapeHtml(entry.kind.replace(/-/g, " "))}</span>
    </div>
  `;

  row.addEventListener("click", () => focusMapContent(entry.id));
  row.addEventListener("contextmenu", (event) => openMapContentsMenu(event, entry.id));
  row.addEventListener("dragstart", onMapContentDragStart);
  row.addEventListener("dragover", onMapContentDragOver);
  row.addEventListener("dragleave", onMapContentDragLeave);
  row.addEventListener("drop", onMapContentDrop);
  row.addEventListener("dragend", onMapContentDragEnd);
  return row;
}

function renderMapContents() {
  const entries = getMapContentEntries();
  syncMapContentOrder(entries);
  dom.mapContentsList.innerHTML = "";
  dom.mapContentsCard.classList.toggle("hidden", !entries.length);

  if (!entries.length) {
    return;
  }

  const entryMap = new Map(entries.map((entry) => [entry.id, entry]));
  const folderIds = new Set(state.mapContentFolders.map((folder) => `folder:${folder.id}`));
  const rendered = new Set();
  state.mapContentOrder.forEach((contentId) => {
    if (rendered.has(contentId)) {
      return;
    }

    const entry = entryMap.get(contentId);
    if (!entry) {
      return;
    }

    if (folderIds.has(contentId)) {
      const folderRow = buildMapContentRow(entry);
      dom.mapContentsList.appendChild(folderRow);
      rendered.add(contentId);

      const childIds = state.mapContentOrder.filter((id) => getMapContentFolderId(id) === contentId && entryMap.has(id));
      if (childIds.length) {
        const childWrap = document.createElement("div");
        childWrap.className = "map-content-folder-children";
        childIds.forEach((childId) => {
          const childEntry = entryMap.get(childId);
          rendered.add(childId);
          childWrap.appendChild(buildMapContentRow(childEntry, true));
        });
        dom.mapContentsList.appendChild(childWrap);
      }
      return;
    }

    if (getMapContentFolderId(contentId)) {
      return;
    }

    dom.mapContentsList.appendChild(buildMapContentRow(entry));
    rendered.add(contentId);
  });

  applyMapContentOrder();
}

function onMapContentDragStart(event) {
  event.dataTransfer.setData("text/plain", event.currentTarget.dataset.contentId);
  event.dataTransfer.effectAllowed = "move";
  event.currentTarget.classList.add("is-dragging");
}

function onMapContentDragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add("is-drop-target");
}

function onMapContentDragLeave(event) {
  event.currentTarget.classList.remove("is-drop-target");
}

function onMapContentDrop(event) {
  event.preventDefault();
  const draggedId = event.dataTransfer.getData("text/plain");
  const targetId = event.currentTarget.dataset.contentId;
  event.currentTarget.classList.remove("is-drop-target");

  if (!draggedId || draggedId === targetId) {
    return;
  }

  const draggedIsFolder = draggedId.startsWith("folder:");
  const targetIsFolder = targetId.startsWith("folder:");
  if (draggedIsFolder) {
    state.mapContentAssignments.delete(draggedId);
  } else if (targetIsFolder) {
    setMapContentFolderId(draggedId, targetId);
  } else {
    setMapContentFolderId(draggedId, getMapContentFolderId(targetId));
  }

  const nextOrder = state.mapContentOrder.filter((id) => id !== draggedId);
  const targetIndex = nextOrder.indexOf(targetId);
  nextOrder.splice(targetIndex, 0, draggedId);
  state.mapContentOrder = nextOrder;
  renderMapContents();
}

function onMapContentDragEnd(event) {
  event.currentTarget.classList.remove("is-dragging");
  dom.mapContentsList.querySelectorAll(".is-drop-target").forEach((node) => node.classList.remove("is-drop-target"));
}

function applyMapContentOrder() {
  const total = state.mapContentOrder.length;
  state.mapContentOrder.forEach((contentId, index) => {
    const pane = state.map.getPane(getMapContentPaneName(contentId));
    if (pane) {
      pane.style.zIndex = String(410 + (total - index));
    }
  });
}

function focusMapContent(contentId) {
  if (contentId.startsWith("folder:")) {
    return;
  }

  if (contentId.startsWith("asset:")) {
    const assetId = contentId.slice("asset:".length);
    const marker = state.assetMarkers.get(assetId);
    if (!marker) {
      return;
    }
    state.map.setView(marker.getLatLng(), Math.max(state.map.getZoom(), 15));
    marker.openPopup();
    return;
  }

  if (contentId.startsWith("viewshed:")) {
    const viewshedId = contentId.slice("viewshed:".length);
    const viewshed = state.viewsheds.find((entry) => entry.id === viewshedId);
    if (!viewshed) {
      return;
    }
    state.map.fitBounds(viewshed.bounds.pad(0.08));
    state.activeInspectionViewshedId = viewshed.id;
    renderViewsheds();
    return;
  }

  if (contentId.startsWith("terrain:")) {
    const terrainId = contentId.slice("terrain:".length);
    const layer = state.terrainCoverageLayers.get(terrainId);
    if (layer) {
      state.map.fitBounds(layer.getBounds().pad(0.08));
    }
    return;
  }

  if (contentId === "planning-region" && state.planning.regionLayer) {
    state.map.fitBounds(state.planning.regionLayer.getBounds().pad(0.08));
    return;
  }

  if (contentId === "planning-results" && state.planning.recommendations.length) {
    const bounds = L.latLngBounds([]);
    state.planning.recommendations.forEach((recommendation) => {
      bounds.extend([recommendation.tx.lat, recommendation.tx.lon]);
      bounds.extend([recommendation.rx.lat, recommendation.rx.lon]);
    });
    if (bounds.isValid()) {
      state.map.fitBounds(bounds.pad(0.08));
    }
    return;
  }

  if (contentId.startsWith("imported:")) {
    const item = state.importedItems.find((entry) => `imported:${entry.id}` === contentId);
    if (!item) {
      return;
    }
    if (typeof item.layer.getBounds === "function") {
      state.map.fitBounds(item.layer.getBounds().pad(0.08));
    } else if (typeof item.layer.getLatLng === "function") {
      state.map.setView(item.layer.getLatLng(), Math.max(state.map.getZoom(), 15));
      item.layer.openPopup?.();
    }
  }
}

function openMapContentsMenu(event, contentId) {
  event.preventDefault();
  event.stopPropagation();
  state.activeMapContentMenuId = contentId;
  dom.mapContentsMenu.style.left = `${event.clientX}px`;
  dom.mapContentsMenu.style.top = `${event.clientY}px`;
  dom.mapContentsMenu.classList.remove("hidden");
}

function onMapContentsMenuAction(event) {
  event.stopPropagation();
  const action = event.target.dataset.mapContentAction;
  const contentId = state.activeMapContentMenuId;
  closeMapContentsMenu();
  if (!action || !contentId) {
    return;
  }

  if (action === "rename") {
    renameMapContent(contentId);
    return;
  }

  if (action === "edit") {
    editMapContent(contentId);
    return;
  }

  if (action === "delete") {
    deleteMapContent(contentId);
  }
}

function renameMapContent(contentId) {
  const entry = getMapContentEntries().find((item) => item.id === contentId);
  state.renamingMapContentId = contentId;
  dom.mapContentsRenameInput.value = entry?.name ?? "";
  dom.mapContentsRename.style.left = dom.mapContentsMenu.style.left;
  dom.mapContentsRename.style.top = dom.mapContentsMenu.style.top;
  dom.mapContentsRename.classList.remove("hidden");
  dom.mapContentsRenameInput.focus();
  dom.mapContentsRenameInput.select();
}

function commitRenameMapContent() {
  const contentId = state.renamingMapContentId;
  const nextName = dom.mapContentsRenameInput.value.trim();
  closeRenamePopover();
  if (!contentId || !nextName) {
    return;
  }

  if (contentId.startsWith("asset:")) {
    const asset = state.assets.find((entry) => entry.id === contentId.slice("asset:".length));
    if (asset) {
      asset.name = nextName;
      updateAssetMarker(asset);
      renderAssets();
    }
  } else if (contentId.startsWith("viewshed:")) {
    const viewshed = state.viewsheds.find((entry) => entry.id === contentId.slice("viewshed:".length));
    if (viewshed) {
      viewshed.name = nextName;
      renderViewsheds();
    }
  } else if (contentId.startsWith("terrain:")) {
    const terrain = state.terrains.find((entry) => entry.id === contentId.slice("terrain:".length));
    if (terrain) {
      terrain.name = nextName;
      renderTerrains();
    }
  } else if (contentId === "planning-region") {
    state.planning.regionName = nextName;
  } else if (contentId === "planning-results") {
    state.planning.resultsName = nextName;
  } else if (contentId.startsWith("folder:")) {
    const folder = state.mapContentFolders.find((entry) => `folder:${entry.id}` === contentId);
    if (folder) {
      folder.name = nextName;
    }
  } else if (contentId.startsWith("imported:")) {
    const item = state.importedItems.find((entry) => `imported:${entry.id}` === contentId);
    if (item) {
      item.name = nextName;
      item.layer.setPopupContent?.(renderImportedItemPopup(item));
    }
  }

  renderMapContents();
  syncCesiumEntities();
}

function editMapContent(contentId) {
  if (contentId.startsWith("folder:")) {
    return;
  }

  if (contentId.startsWith("asset:")) {
    const asset = state.assets.find((entry) => entry.id === contentId.slice("asset:".length));
    if (!asset) {
      return;
    }
    state.editingAssetId = asset.id;
    state.placingAsset = false;
    applyEmitterFormData(asset);
    refreshActionButtons();
    dom.emittersSection.scrollIntoView({ block: "nearest", behavior: "smooth" });
    setStatus(`Editing ${asset.name}. Update the form and click Save Changes.`);
    return;
  }

  if (contentId.startsWith("viewshed:")) {
    const viewshed = state.viewsheds.find((entry) => entry.id === contentId.slice("viewshed:".length));
    if (!viewshed) {
      return;
    }
    state.editingViewshedId = viewshed.id;
    dom.assetSelect.value = viewshed.asset.id;
    dom.propagationModel.value = viewshed.propagationModel;
    dom.receiverHeight.value = viewshed.receiverHeight;
    dom.viewshedOpacity.value = viewshed.opacity;
    dom.radiusKm.value = Math.round(viewshed.radiusMeters / 1000);
    refreshActionButtons();
    dom.simulationSection.scrollIntoView({ block: "nearest", behavior: "smooth" });
    setStatus(`Editing ${viewshed.name}. Adjust the simulation inputs and click Update Coverage.`);
    return;
  }

  if (contentId.startsWith("terrain:")) {
    dom.terrainSection.scrollIntoView({ block: "nearest", behavior: "smooth" });
    setStatus("Terrain extents are edited by re-importing terrain or toggling coverage visibility.");
    return;
  }

  if (contentId === "planning-region") {
    dom.planningSection.scrollIntoView({ block: "nearest", behavior: "smooth" });
    drawPlanningRegion();
    return;
  }

  if (contentId === "planning-results") {
    dom.planningSection.scrollIntoView({ block: "nearest", behavior: "smooth" });
    setStatus("Adjust planning inputs and click Recommend to update the planning results.");
    return;
  }

  if (contentId.startsWith("imported:")) {
    const item = state.importedItems.find((entry) => `imported:${entry.id}` === contentId);
    if (!item) {
      return;
    }
    toggleImportedItemEditing(item);
  }
}

function addMapContentFolder() {
  const folder = {
    id: crypto.randomUUID(),
    name: `Folder ${state.mapContentFolders.length + 1}`,
  };
  state.mapContentFolders.unshift(folder);
  state.mapContentOrder.unshift(`folder:${folder.id}`);
  renderMapContents();
}

function deleteMapContent(contentId) {
  if (contentId.startsWith("folder:")) {
    state.mapContentFolders = state.mapContentFolders.filter((entry) => `folder:${entry.id}` !== contentId);
    Array.from(state.mapContentAssignments.entries()).forEach(([itemId, folderId]) => {
      if (folderId === contentId) {
        state.mapContentAssignments.delete(itemId);
      }
    });
    state.mapContentOrder = state.mapContentOrder.filter((entryId) => entryId !== contentId);
    renderMapContents();
    return;
  }

  if (contentId.startsWith("asset:")) {
    removeAsset(contentId.slice("asset:".length));
    return;
  }

  if (contentId.startsWith("viewshed:")) {
    removeViewshed(contentId.slice("viewshed:".length));
    return;
  }

  if (contentId.startsWith("terrain:")) {
    hideTerrainCoverage(contentId.slice("terrain:".length));
    renderTerrains();
    return;
  }

  if (contentId === "planning-region") {
    state.planning.regionLayer?.remove();
    state.planning.regionLayer = null;
    renderMapContents();
    syncCesiumEntities();
    return;
  }

  if (contentId === "planning-results") {
    state.planning.markersLayer.clearLayers();
    state.planning.recommendations = [];
    renderPlanningResults();
    syncCesiumEntities();
    return;
  }

  if (contentId.startsWith("imported:")) {
    removeImportedItem(contentId.slice("imported:".length));
  }
}

function removeAsset(assetId) {
  const asset = state.assets.find((entry) => entry.id === assetId);
  const marker = state.assetMarkers.get(assetId);
  marker?.remove();
  state.assetMarkers.delete(assetId);
  state.assets = state.assets.filter((entry) => entry.id !== assetId);
  state.viewsheds
    .filter((entry) => entry.asset.id === assetId)
    .map((entry) => entry.id)
    .forEach((viewshedId) => removeViewshed(viewshedId));
  state.mapContentAssignments.delete(`asset:${assetId}`);
  if (state.editingAssetId === assetId) {
    state.editingAssetId = null;
    refreshActionButtons();
  }
  renderAssets();
  renderMapContents();
  syncCesiumEntities();
  if (asset) {
    setStatus(`Removed ${asset.name}.`);
  }
}

function renderImportedItemPopup(item) {
  return `
    <strong>${escapeHtml(item.name)}</strong><br>
    ${escapeHtml(item.subtitle)}
  `;
}

function toggleImportedItemEditing(item) {
  if (item.geometryType === "Point") {
    if (item.layer.dragging?.enabled()) {
      item.layer.dragging.disable();
      setStatus(`Stopped editing ${item.name}.`);
    } else {
      item.layer.dragging?.enable();
      setStatus(`Drag ${item.name} to a new location, then right-click Edit again to finish.`);
    }
    return;
  }

  if (item.layer.editing) {
    if (item.layer.editing.enabled()) {
      item.layer.editing.disable();
      setStatus(`Stopped editing ${item.name}.`);
    } else {
      item.layer.editing.enable();
      setStatus(`Adjust the vertices for ${item.name}, then right-click Edit again to finish.`);
    }
  }
}

function removeImportedItem(itemId) {
  const item = state.importedItems.find((entry) => entry.id === itemId);
  if (!item) {
    return;
  }
  item.layer.remove();
  state.importedItems = state.importedItems.filter((entry) => entry.id !== itemId);
  state.mapContentAssignments.delete(`imported:${itemId}`);
  state.mapContentOrder = state.mapContentOrder.filter((entryId) => entryId !== `imported:${itemId}`);
  renderMapContents();
  setStatus(`Removed ${item.name}.`);
}

function onMapFileDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "copy";
  setStatus("Drop GeoJSON, KML, or KMZ files onto the map to import them.");
}

function onMapFileDragLeave(event) {
  event.preventDefault();
  setStatus("Ready.");
}

async function onMapFileDrop(event) {
  event.preventDefault();
  const files = [...(event.dataTransfer?.files ?? [])];
  if (!files.length) {
    return;
  }

  try {
    for (const file of files) {
      await importMapFile(file);
    }
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function importMapFile(file) {
  const lowerName = file.name.toLowerCase();
  let features = [];

  if (lowerName.endsWith(".geojson") || lowerName.endsWith(".json")) {
    features = parseGeoJsonFeatures(await file.text(), file.name);
  } else if (lowerName.endsWith(".kml")) {
    features = parseKmlFeatures(await file.text(), file.name);
  } else if (lowerName.endsWith(".kmz")) {
    features = await parseKmzFeatures(await file.arrayBuffer(), file.name);
  } else {
    throw new Error(`Unsupported map import: ${file.name}`);
  }

  if (!features.length) {
    throw new Error(`No supported features were found in ${file.name}.`);
  }

  const rootFolderId = createMapContentFolderFromName(file.name.replace(/\.[^.]+$/, ""));
  features.forEach((feature, index) => {
    const folderId = feature.folderPath?.length
      ? createMapContentFolderFromName(`${file.name.replace(/\.[^.]+$/, "")} / ${feature.folderPath.join(" / ")}`)
      : rootFolderId;
    addImportedFeature(feature, folderId, index);
  });

  renderMapContents();
  setStatus(`Imported ${features.length} item${features.length === 1 ? "" : "s"} from ${file.name}.`);
}

function createMapContentFolderFromName(name) {
  const existing = state.mapContentFolders.find((entry) => entry.name === name);
  if (existing) {
    return `folder:${existing.id}`;
  }

  const folder = {
    id: crypto.randomUUID(),
    name,
  };
  state.mapContentFolders.push(folder);
  state.mapContentOrder.unshift(`folder:${folder.id}`);
  return `folder:${folder.id}`;
}

function addImportedFeature(feature, folderId, index) {
  const item = {
    id: crypto.randomUUID(),
    name: feature.name || `${feature.geometryType} ${index + 1}`,
    subtitle: `${feature.sourceLabel} | ${feature.geometryType}`,
    kind: `imported-${feature.geometryType.toLowerCase()}`,
    geometryType: feature.geometryType,
    properties: feature.properties ?? {},
    layer: null,
  };

  const contentId = `imported:${item.id}`;
  const pane = getMapContentPaneName(contentId);

  if (feature.geometryType === "Point") {
    item.layer = L.marker(feature.coordinates, {
      pane,
      draggable: false,
    });
  } else if (feature.geometryType === "LineString") {
    item.layer = L.polyline(feature.coordinates, {
      pane,
      color: "#f7b955",
      weight: 3,
    });
  } else {
    item.layer = L.polygon(feature.coordinates, {
      pane,
      color: "#34d399",
      weight: 2,
      fillOpacity: 0.12,
    });
  }

  item.layer.addTo(state.map);
  item.layer.bindPopup(renderImportedItemPopup(item));
  if (item.layer.on) {
    item.layer.on("dragend edit", () => renderMapContents());
  }

  item.layer.on?.("click", () => focusMapContent(contentId));
  state.importedItems.push(item);
  setMapContentFolderId(contentId, folderId);
  state.mapContentOrder.unshift(contentId);
}

function parseGeoJsonFeatures(text, fileName) {
  const payload = JSON.parse(text);
  const features = [];

  const appendGeometry = (geometry, properties = {}, name = "") => {
    if (!geometry) {
      return;
    }
    const sourceLabel = fileName.endsWith(".json") ? "JSON" : "GeoJSON";
    if (geometry.type === "Point") {
      features.push({
        name: name || properties.name || "Imported Point",
        geometryType: "Point",
        coordinates: [geometry.coordinates[1], geometry.coordinates[0]],
        properties,
        sourceLabel,
      });
      return;
    }
    if (geometry.type === "MultiPoint") {
      geometry.coordinates.forEach((coordinate, index) => appendGeometry({ type: "Point", coordinates: coordinate }, properties, `${name || properties.name || "Imported Point"} ${index + 1}`));
      return;
    }
    if (geometry.type === "LineString") {
      features.push({
        name: name || properties.name || "Imported Line",
        geometryType: "LineString",
        coordinates: geometry.coordinates.map((coordinate) => [coordinate[1], coordinate[0]]),
        properties,
        sourceLabel,
      });
      return;
    }
    if (geometry.type === "MultiLineString") {
      geometry.coordinates.forEach((coordinates, index) => appendGeometry({ type: "LineString", coordinates }, properties, `${name || properties.name || "Imported Line"} ${index + 1}`));
      return;
    }
    if (geometry.type === "Polygon") {
      features.push({
        name: name || properties.name || "Imported Polygon",
        geometryType: "Polygon",
        coordinates: geometry.coordinates[0].map((coordinate) => [coordinate[1], coordinate[0]]),
        properties,
        sourceLabel,
      });
      return;
    }
    if (geometry.type === "MultiPolygon") {
      geometry.coordinates.forEach((coordinates, index) => appendGeometry({ type: "Polygon", coordinates }, properties, `${name || properties.name || "Imported Polygon"} ${index + 1}`));
      return;
    }
    if (geometry.type === "GeometryCollection") {
      geometry.geometries.forEach((entry, index) => appendGeometry(entry, properties, `${name || properties.name || "Imported Geometry"} ${index + 1}`));
    }
  };

  if (payload.type === "FeatureCollection") {
    payload.features.forEach((feature) => appendGeometry(feature.geometry, feature.properties ?? {}, feature.properties?.name ?? feature.id ?? ""));
  } else if (payload.type === "Feature") {
    appendGeometry(payload.geometry, payload.properties ?? {}, payload.properties?.name ?? payload.id ?? "");
  } else {
    appendGeometry(payload, {}, "Imported Geometry");
  }

  return features;
}

function parseKmlFeatures(text, fileName) {
  const xml = new DOMParser().parseFromString(text, "text/xml");
  const features = [];

  const walk = (node, folderPath = []) => {
    Array.from(node.children).forEach((child) => {
      const localName = child.localName;
      if (localName === "Folder" || localName === "Document") {
        const nextFolderPath = child.querySelector(":scope > name")?.textContent?.trim();
        walk(child, nextFolderPath ? [...folderPath, nextFolderPath] : folderPath);
        return;
      }

      if (localName === "Placemark") {
        const name = child.querySelector(":scope > name")?.textContent?.trim() || "Imported Placemark";
        features.push(...parseKmlPlacemark(child, folderPath, name, fileName));
      }
    });
  };

  walk(xml.documentElement, []);
  return features;
}

function parseKmlPlacemark(placemark, folderPath, name, fileName) {
  const sourceLabel = fileName.toLowerCase().endsWith(".kmz") ? "KMZ" : "KML";
  const properties = {};
  const extendedData = placemark.querySelector("ExtendedData");
  if (extendedData) {
    extendedData.querySelectorAll("Data").forEach((entry) => {
      const key = entry.getAttribute("name");
      const value = entry.querySelector("value")?.textContent?.trim();
      if (key) {
        properties[key] = value ?? "";
      }
    });
  }

  const geometries = [];
  placemark.querySelectorAll("Point,LineString,Polygon").forEach((geometry) => {
    if (geometry.closest("Placemark") === placemark) {
      geometries.push(geometry);
    }
  });

  return geometries.map((geometry, index) => {
    if (geometry.localName === "Point") {
      const [lon, lat] = parseKmlCoordinateList(geometry.querySelector("coordinates")?.textContent ?? "")[0] ?? [];
      return {
        name: geometries.length > 1 ? `${name} ${index + 1}` : name,
        geometryType: "Point",
        coordinates: [lat, lon],
        properties,
        folderPath,
        sourceLabel,
      };
    }
    if (geometry.localName === "LineString") {
      return {
        name: geometries.length > 1 ? `${name} ${index + 1}` : name,
        geometryType: "LineString",
        coordinates: parseKmlCoordinateList(geometry.querySelector("coordinates")?.textContent ?? "").map(([lon, lat]) => [lat, lon]),
        properties,
        folderPath,
        sourceLabel,
      };
    }
    return {
      name: geometries.length > 1 ? `${name} ${index + 1}` : name,
      geometryType: "Polygon",
      coordinates: parseKmlCoordinateList(geometry.querySelector("outerBoundaryIs coordinates")?.textContent ?? geometry.querySelector("coordinates")?.textContent ?? "").map(([lon, lat]) => [lat, lon]),
      properties,
      folderPath,
      sourceLabel,
    };
  }).filter((entry) => entry.coordinates?.length);
}

function parseKmlCoordinateList(value) {
  return value
    .trim()
    .split(/\s+/)
    .map((coordinate) => coordinate.split(",").slice(0, 2).map(Number))
    .filter((coordinate) => coordinate.length === 2 && coordinate.every((entry) => Number.isFinite(entry)));
}

async function parseKmzFeatures(buffer, fileName) {
  const zip = await window.JSZip.loadAsync(buffer);
  const kmlEntry = Object.values(zip.files).find((entry) => entry.name.toLowerCase().endsWith(".kml"));
  if (!kmlEntry) {
    return [];
  }
  const text = await kmlEntry.async("text");
  return parseKmlFeatures(text, fileName);
}

function syncCesiumEntities() {
  if (!state.cesiumViewer) {
    return;
  }

  const viewer = state.cesiumViewer;
  const entities = viewer.entities;
  const managedIds = [];
  entities.values.forEach((entity) => {
    if (entity.id && String(entity.id).startsWith("managed:")) {
      managedIds.push(entity.id);
    }
  });
  managedIds.forEach((id) => entities.removeById(id));

  state.assets.forEach((asset) => {
    const assetHeight = resolveAbsoluteHeight(asset);
    entities.add({
      id: `managed:asset:${asset.id}`,
      position: window.Cesium.Cartesian3.fromDegrees(asset.lon, asset.lat, assetHeight.absoluteHeightM),
      point: {
        pixelSize: 10,
        color: window.Cesium.Color.fromCssColorString(asset.color || FORCE_COLORS[asset.force]),
        outlineColor: window.Cesium.Color.WHITE,
        outlineWidth: 1.5,
        heightReference: assetHeight.useRelativeToGround
          ? window.Cesium.HeightReference.RELATIVE_TO_GROUND
          : window.Cesium.HeightReference.NONE,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: asset.name,
        fillColor: window.Cesium.Color.WHITE,
        font: "14px Bahnschrift",
        pixelOffset: new window.Cesium.Cartesian2(0, -18),
        heightReference: assetHeight.useRelativeToGround
          ? window.Cesium.HeightReference.RELATIVE_TO_GROUND
          : window.Cesium.HeightReference.NONE,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });
  });

  if (state.gps.location) {
    entities.add({
      id: "managed:gps:user",
      position: window.Cesium.Cartesian3.fromDegrees(state.gps.location.lon, state.gps.location.lat, 0),
      point: {
        pixelSize: 12,
        color: window.Cesium.Color.fromCssColorString("#34d399"),
        outlineColor: window.Cesium.Color.WHITE,
        outlineWidth: 2,
      },
      label: {
        text: "User",
        font: "14px Bahnschrift",
        fillColor: window.Cesium.Color.WHITE,
      },
    });
  }

  if (state.planning.regionLayer) {
    const positions = state.planning.regionLayer.getLatLngs()[0].map((point) =>
      window.Cesium.Cartesian3.fromDegrees(point.lng, point.lat, 0),
    );
    entities.add({
      id: "managed:planning:region",
      polygon: {
        hierarchy: positions,
        material: window.Cesium.Color.fromCssColorString("#d9e4ff").withAlpha(0.12),
        outline: true,
        outlineColor: window.Cesium.Color.fromCssColorString("#d9e4ff"),
      },
    });
  }

  state.planning.recommendations.forEach((recommendation, index) => {
    const txHeight = resolveAbsoluteHeight(recommendation.tx, state.planning.terrainId);
    const rxHeight = resolveAbsoluteHeight(recommendation.rx, state.planning.terrainId);
    const linkColor = window.Cesium.Color.fromCssColorString(
      recommendation.friendlyLineOfSight ? "#d9e4ff" : "#f97316",
    );
    const linkDashLength = recommendation.friendlyLineOfSight ? 32 : 14;
    const linkPositions = window.Cesium.Cartesian3.fromDegreesArrayHeights([
      recommendation.tx.lon,
      recommendation.tx.lat,
      txHeight.absoluteHeightM,
      recommendation.rx.lon,
      recommendation.rx.lat,
      rxHeight.absoluteHeightM,
    ]);

    entities.add({
      id: `managed:planning:tx:${index}`,
      position: window.Cesium.Cartesian3.fromDegrees(recommendation.tx.lon, recommendation.tx.lat, txHeight.absoluteHeightM),
      point: {
        pixelSize: 10,
        color: window.Cesium.Color.fromCssColorString("#4ade80"),
        outlineColor: window.Cesium.Color.WHITE,
        outlineWidth: 2,
        heightReference: txHeight.useRelativeToGround
          ? window.Cesium.HeightReference.RELATIVE_TO_GROUND
          : window.Cesium.HeightReference.NONE,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: `Tx ${index + 1}`,
        font: "14px Bahnschrift",
        fillColor: window.Cesium.Color.WHITE,
        pixelOffset: new window.Cesium.Cartesian2(0, -18),
        heightReference: txHeight.useRelativeToGround
          ? window.Cesium.HeightReference.RELATIVE_TO_GROUND
          : window.Cesium.HeightReference.NONE,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });
    entities.add({
      id: `managed:planning:rx:${index}`,
      position: window.Cesium.Cartesian3.fromDegrees(recommendation.rx.lon, recommendation.rx.lat, rxHeight.absoluteHeightM),
      point: {
        pixelSize: 10,
        color: window.Cesium.Color.fromCssColorString("#facc15"),
        outlineColor: window.Cesium.Color.WHITE,
        outlineWidth: 2,
        heightReference: rxHeight.useRelativeToGround
          ? window.Cesium.HeightReference.RELATIVE_TO_GROUND
          : window.Cesium.HeightReference.NONE,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: `Rx ${index + 1}`,
        font: "14px Bahnschrift",
        fillColor: window.Cesium.Color.WHITE,
        pixelOffset: new window.Cesium.Cartesian2(0, -18),
        heightReference: rxHeight.useRelativeToGround
          ? window.Cesium.HeightReference.RELATIVE_TO_GROUND
          : window.Cesium.HeightReference.NONE,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });
    entities.add({
      id: `managed:planning:link:${index}`,
      polyline: {
        positions: linkPositions,
        width: 2.5,
        arcType: window.Cesium.ArcType.NONE,
        material: new window.Cesium.PolylineDashMaterialProperty({
          color: linkColor,
          dashLength: linkDashLength,
        }),
        depthFailMaterial: new window.Cesium.PolylineDashMaterialProperty({
          color: linkColor.withAlpha(0.95),
          dashLength: linkDashLength,
        }),
      },
    });
  });
}

function parseDted(buffer, fileName, overrideLat, overrideLon) {
  const bytes = new Uint8Array(buffer);
  const uhl = textSlice(bytes, 0, 80);
  if (!uhl.startsWith("UHL")) {
    throw new Error("Unsupported DTED header.");
  }

  const dataOffset = 80 + 648 + 2700;
  const declaredLonLines = parseInt(uhl.slice(47, 51).replace(/\D/g, ""), 10);
  const declaredLatPoints = parseInt(uhl.slice(51, 55).replace(/\D/g, ""), 10);
  const lonInterval = parseArcSeconds(uhl.slice(20, 24));
  const latInterval = parseArcSeconds(uhl.slice(24, 28));
  const uhlOrigins = extractUhlOrigins(uhl);
  const originLon = overrideLon ?? parseDmsCoordinate(uhlOrigins.lon);
  const originLat = overrideLat ?? parseDmsCoordinate(uhlOrigins.lat);

  if (!Number.isFinite(declaredLonLines) || !Number.isFinite(declaredLatPoints)) {
    throw new Error("DTED sample dimensions could not be read.");
  }

  const rows = declaredLatPoints;
  const cols = declaredLonLines;
  const elevations = new Float32Array(rows * cols);
  const recordSize = 8 + rows * 2 + 4;

  for (let col = 0; col < cols; col += 1) {
    const offset = dataOffset + col * recordSize;
    if (offset + recordSize > bytes.length) {
      break;
    }

    for (let row = 0; row < rows; row += 1) {
      const sampleOffset = offset + 8 + row * 2;
      elevations[row * cols + col] = decodeSignedMagnitude(bytes[sampleOffset], bytes[sampleOffset + 1]);
    }
  }

  const latStepDeg = latInterval / 3600;
  const lonStepDeg = lonInterval / 3600;

  if (!Number.isFinite(originLat) || !Number.isFinite(originLon) || !latStepDeg || !lonStepDeg) {
    throw new Error(`DTED georeference could not be resolved from ${fileName}.`);
  }

  return {
    origin: {
      lat: originLat,
      lon: originLon,
    },
    bounds: {
      sw: {
        lat: originLat,
        lon: originLon,
      },
      ne: {
        lat: originLat + latStepDeg * Math.max(rows - 1, 0),
        lon: originLon + lonStepDeg * Math.max(cols - 1, 0),
      },
    },
    rows,
    cols,
    latStepDeg,
    lonStepDeg,
    elevations,
    sourceName: fileName,
  };
}

function extractUhlOrigins(uhl) {
  const compact = uhl.replace(/\s+/g, "");
  const match = compact.match(/(\d{7}[EW])(\d{7}[NS])/i);
  if (match) {
    return {
      lon: match[1],
      lat: match[2],
    };
  }

  return {
    lon: uhl.slice(4, 12),
    lat: uhl.slice(12, 20),
  };
}

function decodeSignedMagnitude(hi, lo) {
  const raw = (hi << 8) | lo;
  const sign = raw & 0x8000 ? -1 : 1;
  const magnitude = raw & 0x7fff;
  return sign * magnitude;
}

function parseArcSeconds(value) {
  const numeric = parseInt(value.replace(/\D/g, ""), 10);
  if (!Number.isFinite(numeric)) {
    return NaN;
  }
  return numeric / 10;
}

function parseDmsCoordinate(value) {
  const clean = value.trim();
  const hemisphere = clean.slice(-1).toUpperCase();
  const numeric = clean.slice(0, -1).replace(/\D/g, "");
  if (!numeric) {
    return NaN;
  }

  const isLat = hemisphere === "N" || hemisphere === "S";
  const candidates = [];

  for (const degDigits of [3, 2]) {
    const trailingDigits = numeric.length - degDigits;
    if (trailingDigits !== 4 && trailingDigits !== 5) {
      continue;
    }

    const deg = Number(numeric.slice(0, degDigits));
    const min = Number(numeric.slice(degDigits, degDigits + 2));
    const sec = Number(numeric.slice(degDigits + 2, degDigits + 4));
    const tenthDigits = numeric.slice(degDigits + 4);
    const fractionalSeconds = tenthDigits ? Number(tenthDigits) / 10 ** tenthDigits.length : 0;

    if (!Number.isFinite(deg) || !Number.isFinite(min) || !Number.isFinite(sec)) {
      continue;
    }
    if (min >= 60 || sec >= 60) {
      continue;
    }

    const limit = isLat ? 90 : 180;
    if (deg > limit) {
      continue;
    }

    let decimal = deg + min / 60 + (sec + fractionalSeconds) / 3600;
    if (hemisphere === "S" || hemisphere === "W") {
      decimal *= -1;
    }

    candidates.push({
      decimal,
      degDigits,
      degreesMagnitude: deg,
    });
  }

  if (!candidates.length) {
    return NaN;
  }

  candidates.sort((left, right) => {
    if (right.degreesMagnitude !== left.degreesMagnitude) {
      return right.degreesMagnitude - left.degreesMagnitude;
    }
    return right.degDigits - left.degDigits;
  });

  return candidates[0].decimal;
}

function textSlice(bytes, start, end) {
  return new TextDecoder("ascii").decode(bytes.slice(start, end));
}

function rssiColor(rssi, lineOfSight, opacity = 0.7) {
  const minRssi = -120;
  const maxRssi = -40;
  const normalized = Math.min(1, Math.max(0, (rssi - minRssi) / (maxRssi - minRssi)));
  const hue = normalized * 250;
  const alpha = lineOfSight ? opacity : Math.max(0.12, opacity * 0.35);
  return `hsla(${hue}, 82%, 58%, ${alpha})`;
}

function propagationModelLabel(value) {
  if (value === "itu-p526") {
    return "ITU-R P.526";
  }
  if (value === "itu-hybrid") {
    return "ITU Hybrid";
  }
  return "ITU-R P.525";
}

function toMgrs(lat, lon) {
  try {
    const raw = window.mgrs.forward([lon, lat], 5);
    return raw.replace(/\s+/g, "");
  } catch {
    return "----------";
  }
}

function getMgrsComponents(lat, lon) {
  const value = toMgrs(lat, lon);
  const match = value.match(/^(\d{1,2}[C-HJ-NP-X])([A-HJ-NP-Z]{2})(\d{5})(\d{5})$/i);
  if (!match) {
    return null;
  }

  return {
    zoneBand: match[1],
    square: match[2],
    easting: match[3],
    northing: match[4],
  };
}

function formatCoordinate(lat, lon, system) {
  if (system === "latlon") {
    return `${formatDecimalDegrees(lat, true)}, ${formatDecimalDegrees(lon, false)}`;
  }
  if (system === "dms") {
    return `${formatDms(lat, true)} ${formatDms(lon, false)}`;
  }
  return toMgrs(lat, lon);
}

function displayTemperature(celsius) {
  return state.settings.measurementUnits === "standard" ? celsius * 9 / 5 + 32 : celsius;
}

function displayPressure(hectopascals) {
  return state.settings.measurementUnits === "standard" ? hectopascals * 0.0295299830714 : hectopascals;
}

function displayWindSpeed(metersPerSecond) {
  return state.settings.measurementUnits === "standard" ? metersPerSecond * 2.2369362921 : metersPerSecond;
}

function parseTemperatureInput(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return state.weather.temperatureC;
  }
  return state.settings.measurementUnits === "standard" ? (numeric - 32) * 5 / 9 : numeric;
}

function parsePressureInput(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return state.weather.pressureHpa;
  }
  return state.settings.measurementUnits === "standard" ? numeric / 0.0295299830714 : numeric;
}

function parseWindSpeedInput(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return state.weather.windSpeedMps;
  }
  return state.settings.measurementUnits === "standard" ? numeric / 2.2369362921 : numeric;
}

function formatInputNumber(value, digits) {
  return Number(value).toFixed(digits).replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1");
}

function formatDistance(meters) {
  if (state.settings.measurementUnits === "standard") {
    return `${(meters / 1609.344).toFixed(2)} mi`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
}

function formatElevation(meters) {
  if (state.settings.measurementUnits === "standard") {
    return `${Math.round(meters * 3.28084).toLocaleString()} ft`;
  }
  return `${Math.round(meters).toLocaleString()} m`;
}

function formatDecimalDegrees(value, isLatitude) {
  const hemisphere = isLatitude
    ? (value >= 0 ? "N" : "S")
    : (value >= 0 ? "E" : "W");
  return `${Math.abs(value).toFixed(5)} ${hemisphere}`;
}

function formatDms(value, isLatitude) {
  const hemisphere = isLatitude
    ? (value >= 0 ? "N" : "S")
    : (value >= 0 ? "E" : "W");
  const absolute = Math.abs(value);
  const degrees = Math.floor(absolute);
  const minutesFloat = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = ((minutesFloat - minutes) * 60).toFixed(1).padStart(4, "0");
  return `${degrees}d ${minutes.toString().padStart(2, "0")}m ${seconds}s ${hemisphere}`;
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

function timestampSlug() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function hexToKmlColor(value) {
  const hex = value.replace("#", "");
  const [r, g, b] = hex.match(/.{1,2}/g) ?? ["ff", "ff", "ff"];
  return `ff${b}${g}${r}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return map[char];
  });
}

function escapeXml(value) {
  return escapeHtml(value);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function geographicGridStep(zoom) {
  if (zoom >= 14) {
    return 0.01;
  }
  if (zoom >= 12) {
    return 0.025;
  }
  if (zoom >= 10) {
    return 0.05;
  }
  if (zoom >= 8) {
    return 0.1;
  }
  if (zoom >= 6) {
    return 0.25;
  }
  return 0.5;
}

function metricGridStep(zoom) {
  if (zoom >= 14) {
    return 250;
  }
  if (zoom >= 12) {
    return 500;
  }
  if (zoom >= 10) {
    return 1000;
  }
  if (zoom >= 8) {
    return 5000;
  }
  if (zoom >= 6) {
    return 10000;
  }
  return 20000;
}

const METRIC_GRID_STEPS = [250, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];

function metersToLatitudeDegrees(meters) {
  return meters / 111320;
}

function metersToLongitudeDegrees(meters, latitude) {
  const cosine = Math.cos((latitude * Math.PI) / 180);
  const safeCosine = Math.max(Math.abs(cosine), 0.000001);
  return meters / (111320 * safeCosine);
}

function resolveMetricGridStep(map) {
  const center = map.getCenter();
  const centerPoint = map.latLngToLayerPoint(center);
  const minimumPixels = 80;
  const baseStep = metricGridStep(map.getZoom());
  let fallback = METRIC_GRID_STEPS[METRIC_GRID_STEPS.length - 1];

  for (const stepMeters of METRIC_GRID_STEPS) {
    if (stepMeters < baseStep) {
      continue;
    }

    fallback = stepMeters;
    const latStep = metersToLatitudeDegrees(stepMeters);
    const lonStep = metersToLongitudeDegrees(stepMeters, center.lat);
    const northPoint = map.latLngToLayerPoint([center.lat + latStep, center.lng]);
    const eastPoint = map.latLngToLayerPoint([center.lat, center.lng + lonStep]);
    const latPixels = Math.abs(centerPoint.y - northPoint.y);
    const lonPixels = Math.abs(centerPoint.x - eastPoint.x);

    if (Math.min(latPixels, lonPixels) >= minimumPixels) {
      return stepMeters;
    }
  }

  return fallback;
}

const CoordinateGridLayer = L.Layer.extend({
  initialize(options) {
    this.options = options;
    this._canvas = null;
  },

  onAdd(map) {
    this._map = map;
    this._canvas = L.DomUtil.create("canvas", "leaflet-coordinate-grid");
    const pane = map.getPane("overlayPane");
    pane.appendChild(this._canvas);
    map.on("moveend zoomend resize", this._redraw, this);
    this._redraw();
  },

  onRemove(map) {
    map.off("moveend zoomend resize", this._redraw, this);
    if (this._canvas?.parentNode) {
      this._canvas.parentNode.removeChild(this._canvas);
    }
    this._canvas = null;
  },

  setOptions(options) {
    Object.assign(this.options, options);
    this._redraw();
  },

  _redraw() {
    if (!this._canvas || !this._map) {
      return;
    }

    const size = this._map.getSize();
    const bounds = this._map.getBounds();
    const topLeft = this._map.containerPointToLayerPoint([0, 0]);
    this._canvas.width = size.x;
    this._canvas.height = size.y;
    this._canvas.style.width = `${size.x}px`;
    this._canvas.style.height = `${size.y}px`;
    this._canvas.style.position = "absolute";
    this._canvas.style.pointerEvents = "none";
    L.DomUtil.setPosition(this._canvas, topLeft);

    const context = this._canvas.getContext("2d");
    context.clearRect(0, 0, size.x, size.y);
    context.strokeStyle = this.options.color;
    context.fillStyle = this.options.color;
    context.lineWidth = 1;
    context.globalAlpha = 0.75;
    context.font = "11px Bahnschrift";

    if (this.options.coordinateSystem === "mgrs") {
      this._drawMetricGrid(context, bounds, topLeft);
      return;
    }

    this._drawGeographicGrid(context, bounds, topLeft);
  },

  _drawGeographicGrid(context, bounds, topLeft) {
    const step = geographicGridStep(this._map.getZoom());
    const south = Math.floor(bounds.getSouth() / step) * step;
    const west = Math.floor(bounds.getWest() / step) * step;

    for (let lat = south; lat <= bounds.getNorth(); lat += step) {
      const start = this._map.latLngToLayerPoint([lat, bounds.getWest()]).subtract(topLeft);
      const end = this._map.latLngToLayerPoint([lat, bounds.getEast()]).subtract(topLeft);
      this._drawLine(context, start, end);
      this._drawLabel(context, formatDecimalDegrees(lat, true), { x: 8, y: start.y - 4 });
    }

    for (let lon = west; lon <= bounds.getEast(); lon += step) {
      const start = this._map.latLngToLayerPoint([bounds.getSouth(), lon]).subtract(topLeft);
      const end = this._map.latLngToLayerPoint([bounds.getNorth(), lon]).subtract(topLeft);
      this._drawLine(context, start, end);
      this._drawLabel(context, formatDecimalDegrees(lon, false), { x: start.x + 4, y: 14 });
    }
  },

  _drawMetricGrid(context, bounds, topLeft) {
    const center = this._map.getCenter();
    const stepMeters = resolveMetricGridStep(this._map);
    const latStep = metersToLatitudeDegrees(stepMeters);
    const lonStep = metersToLongitudeDegrees(stepMeters, center.lat);
    const south = Math.floor(bounds.getSouth() / latStep) * latStep;
    const west = Math.floor(bounds.getWest() / lonStep) * lonStep;

    for (let lat = south; lat <= bounds.getNorth(); lat += latStep) {
      const start = this._map.latLngToLayerPoint([lat, bounds.getWest()]).subtract(topLeft);
      const end = this._map.latLngToLayerPoint([lat, bounds.getEast()]).subtract(topLeft);
      this._drawLine(context, start, end);
      const label = this._getMgrsLineLabel(lat, center.lng, "northing");
      if (label) {
        this._drawLabel(context, label, { x: 8, y: start.y - 4 });
      }
    }

    for (let lon = west; lon <= bounds.getEast(); lon += lonStep) {
      const start = this._map.latLngToLayerPoint([bounds.getSouth(), lon]).subtract(topLeft);
      const end = this._map.latLngToLayerPoint([bounds.getNorth(), lon]).subtract(topLeft);
      this._drawLine(context, start, end);
      const label = this._getMgrsLineLabel(center.lat, lon, "easting");
      if (label) {
        this._drawLabel(context, label, { x: start.x + 4, y: 14 });
      }
    }
  },

  _getMgrsLineLabel(lat, lon, axis) {
    const parts = getMgrsComponents(lat, lon);
    if (!parts) {
      return "";
    }

    const prefix = `${parts.zoneBand}${parts.square}`;
    return axis === "easting"
      ? `${prefix} ${parts.easting.slice(0, 3)}`
      : `${prefix} ${parts.northing.slice(0, 3)}`;
  },

  _drawLabel(context, text, point) {
    const metrics = context.measureText(text);
    const width = metrics.width + 8;
    const x = clamp(point.x, 2, this._canvas.width - width - 2);
    const y = clamp(point.y, 12, this._canvas.height - 4);

    context.save();
    context.globalAlpha = 0.95;
    context.fillStyle = "rgba(22, 24, 29, 0.9)";
    context.fillRect(x - 3, y - 10, width, 14);
    context.fillStyle = this.options.color;
    context.fillText(text, x, y);
    context.restore();
  },

  _drawLine(context, start, end) {
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  },
});

const CanvasViewshedLayer = L.Layer.extend({
  initialize(options) {
    this.options = options;
    this._canvas = null;
  },

  onAdd(map) {
    this._map = map;
    this._canvas = L.DomUtil.create("canvas", "leaflet-viewshed-canvas");
    const pane = map.getPane(this.options.pane || "overlayPane");
    pane.appendChild(this._canvas);
    map.on("moveend zoomend resize", this._redraw, this);
    this._redraw();
  },

  onRemove(map) {
    map.off("moveend zoomend resize", this._redraw, this);
    if (this._canvas?.parentNode) {
      this._canvas.parentNode.removeChild(this._canvas);
    }
    this._canvas = null;
  },

  setOpacity(opacity) {
    this.options.opacity = opacity;
    this._redraw();
  },

  _redraw() {
    if (!this._map || !this._canvas) {
      return;
    }

    const size = this._map.getSize();
    const bounds = this._map.getBounds();
    const topLeft = this._map.containerPointToLayerPoint([0, 0]);
    this._canvas.width = size.x;
    this._canvas.height = size.y;
    this._canvas.style.width = `${size.x}px`;
    this._canvas.style.height = `${size.y}px`;
    this._canvas.style.position = "absolute";
    this._canvas.style.pointerEvents = "none";
    L.DomUtil.setPosition(this._canvas, topLeft);

    const context = this._canvas.getContext("2d");
    context.clearRect(0, 0, size.x, size.y);

    const latitudes = this.options.latitudes;
    const longitudes = this.options.longitudes;
    const rssi = this.options.rssi;
    const lineOfSight = this.options.lineOfSight;
    const latHalf = this.options.gridLatStepDeg / 2;
    const lonHalf = this.options.gridLonStepDeg / 2;

    for (let index = 0; index < latitudes.length; index += 1) {
      const lat = latitudes[index];
      const lon = longitudes[index];
      if (!bounds.contains([lat, lon])) {
        continue;
      }

      const northWest = this._map.latLngToLayerPoint([lat + latHalf, lon - lonHalf]).subtract(topLeft);
      const southEast = this._map.latLngToLayerPoint([lat - latHalf, lon + lonHalf]).subtract(topLeft);
      const width = Math.max(1, southEast.x - northWest.x);
      const height = Math.max(1, southEast.y - northWest.y);

      context.fillStyle = rssiColor(rssi[index], Boolean(lineOfSight[index]), this.options.opacity);
      context.fillRect(northWest.x, northWest.y, width, height);
    }
  },
});

init();
