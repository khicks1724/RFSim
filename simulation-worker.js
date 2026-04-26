self.addEventListener("message", (event) => {
  const { type, payload } = event.data;

  try {
    if (type === "terrain:cache") {
      terrainCache.set(payload.id, payload);
      self.postMessage({
        type: "terrain:cached",
        payload: { id: payload.id },
      });
      return;
    }

    if (type === "terrain:clear") {
      terrainCache.clear();
      return;
    }

    if (type === "terrain:remove") {
      terrainCache.delete(payload.id);
      return;
    }

    if (type === "simulation:start") {
      const result = runSimulation(payload, (progress) => {
        self.postMessage({
          type: "simulation:progress",
          payload: progress,
        });
      });
      self.postMessage(
        {
          type: "simulation:complete",
          payload: result,
        },
        [
          result.latitudes.buffer,
          result.longitudes.buffer,
          result.rssi.buffer,
          result.lineOfSight.buffer,
        ],
      );
      return;
    }

    if (type === "inspection:start") {
      self.postMessage({
        type: "inspection:complete",
        payload: inspectPoint(payload),
      });
      return;
    }

    if (type === "planning:start") {
      self.postMessage({
        type: "planning:complete",
        payload: planSites(payload),
      });
    }
  } catch (error) {
    self.postMessage({
      type: "engine:error",
      payload: {
        message: error instanceof Error ? error.message : "Simulation engine error.",
      },
    });
  }
});

const terrainCache = new Map();

function runSimulation(payload, reportProgress = () => {}) {
  const {
    requestId,
    asset,
    weather,
    terrainId,
    radiusMeters,
    gridMeters,
    receiverHeight,
    opacity,
    propagationModel,
  } = payload;
  const terrain = resolveTerrain(terrainId);
  const latStep = metersToLatitudeDegrees(gridMeters);
  const lonStep = metersToLongitudeDegrees(gridMeters, asset.lat);
  const estimatedCells = Math.ceil(Math.PI * (radiusMeters / gridMeters) ** 2);
  const latitudes = new Float64Array(estimatedCells);
  const longitudes = new Float64Array(estimatedCells);
  const rssi = new Float32Array(estimatedCells);
  const lineOfSight = new Uint8Array(estimatedCells);
  const totalRows = Math.max(1, Math.floor((radiusMeters * 2) / gridMeters) + 1);

  let count = 0;
  let processedRows = 0;
  reportProgress({
    requestId,
    fraction: 0,
    stage: "Tracing RF paths...",
    detail: "0%",
  });
  for (let northMeters = -radiusMeters; northMeters <= radiusMeters; northMeters += gridMeters) {
    const lat = asset.lat + metersToLatitudeDegrees(northMeters);
    for (let eastMeters = -radiusMeters; eastMeters <= radiusMeters; eastMeters += gridMeters) {
      const distanceMeters = Math.hypot(northMeters, eastMeters);
      if (distanceMeters > radiusMeters) {
        continue;
      }

      const lon = asset.lon + metersToLongitudeDegrees(eastMeters, asset.lat);
      const result = simulateLink(
        asset,
        {
          lat,
          lon,
          antennaHeightM: receiverHeight,
          receiverGainDbi: 0,
          systemLossDb: 0,
        },
        terrain,
        weather,
        propagationModel,
      );

      latitudes[count] = lat;
      longitudes[count] = lon;
      rssi[count] = result.rssiDbm;
      lineOfSight[count] = result.lineOfSight ? 1 : 0;
      count += 1;
    }
    processedRows += 1;
    if (processedRows === totalRows || processedRows === 1 || processedRows % 4 === 0) {
      const fraction = clamp(processedRows / totalRows, 0, 1);
      reportProgress({
        requestId,
        fraction,
        stage: "Tracing RF paths...",
        detail: `${Math.round(fraction * 100)}%`,
      });
    }
  }

  return {
    requestId,
    asset,
    terrainId,
    receiverHeight,
    radiusMeters,
    opacity,
    propagationModel,
    gridLatStepDeg: latStep,
    gridLonStepDeg: lonStep,
    latitudes: latitudes.slice(0, count),
    longitudes: longitudes.slice(0, count),
    rssi: rssi.slice(0, count),
    lineOfSight: lineOfSight.slice(0, count),
  };
}

function inspectPoint(payload) {
  const { asset, target, weather, terrainId, receiverHeight, propagationModel } = payload;
  return simulateLink(
    asset,
    {
      lat: target.lat,
      lon: target.lon,
      antennaHeightM: receiverHeight,
      receiverGainDbi: 0,
      systemLossDb: 0,
    },
    resolveTerrain(terrainId),
    weather,
    propagationModel,
  );
}

function planSites(payload) {
  const {
    requestId,
    polygon,
    txAsset,
    rxAsset,
    enemyAssets,
    gridMeters,
    minSeparationMeters,
    detectionWeight,
    separationWeight,
    floorM,
    ceilingM,
    weather,
    terrainId,
    propagationModel,
  } = payload;

  if (!polygon?.length || polygon.length < 3) {
    throw new Error("Draw a planning region first.");
  }

  const terrain = resolveTerrain(terrainId);
  const bounds = polygonBounds(polygon);
  const anchorLat = polygon[0].lat;
  const candidates = [];
  const latStep = metersToLatitudeDegrees(gridMeters);
  const lonStep = metersToLongitudeDegrees(gridMeters, anchorLat);

  for (let lat = bounds.minLat; lat <= bounds.maxLat; lat += latStep) {
    for (let lon = bounds.minLon; lon <= bounds.maxLon; lon += lonStep) {
      if (!pointInPolygon({ lat, lon }, polygon)) {
        continue;
      }
      candidates.push({ lat, lon });
    }
  }

  if (candidates.length < 2) {
    throw new Error("Planning region is too small for the selected candidate spacing.");
  }

  const plannedTxHeight = clamp(txAsset.antennaHeightM, floorM, ceilingM);
  const plannedRxHeight = clamp(rxAsset.antennaHeightM, floorM, ceilingM);
  const best = [];
  const terrainAvailable = Boolean(terrain);

  for (let txIndex = 0; txIndex < candidates.length; txIndex += 1) {
    const txCandidate = candidates[txIndex];
    const txGroundElevationM = terrainAvailable ? sampleTerrain(txCandidate.lat, txCandidate.lon, terrain) : null;
    const txPlacement = {
      ...txAsset,
      lat: txCandidate.lat,
      lon: txCandidate.lon,
      antennaHeightM: plannedTxHeight,
      groundElevationM: txGroundElevationM,
    };

    for (let rxIndex = txIndex + 1; rxIndex < candidates.length; rxIndex += 1) {
      const rxCandidate = candidates[rxIndex];
      const separationMeters = haversineKm(
        txCandidate.lat,
        txCandidate.lon,
        rxCandidate.lat,
        rxCandidate.lon,
      ) * 1000;
      if (separationMeters < minSeparationMeters) {
        continue;
      }

      const rxGroundElevationM = terrainAvailable ? sampleTerrain(rxCandidate.lat, rxCandidate.lon, terrain) : null;
      const rxPlacement = {
        ...rxAsset,
        lat: rxCandidate.lat,
        lon: rxCandidate.lon,
        antennaHeightM: plannedRxHeight,
        groundElevationM: rxGroundElevationM,
      };
      const friendlyLink = simulateLink(
        txPlacement,
        {
          ...rxPlacement,
          receiverGainDbi: rxPlacement.antennaGainDbi ?? 0,
          systemLossDb: rxPlacement.systemLossDb ?? 0,
        },
        terrain,
        weather,
        propagationModel,
      );

      let detectionPenalty = 0;
      let maxEnemyRssi = -140;
      for (let enemyIndex = 0; enemyIndex < enemyAssets.length; enemyIndex += 1) {
        const enemy = enemyAssets[enemyIndex];
        const txExposure = simulateLink(
          txPlacement,
          {
            lat: enemy.lat,
            lon: enemy.lon,
            antennaHeightM: 2,
            receiverGainDbi: 0,
            systemLossDb: 0,
          },
          terrain,
          weather,
          propagationModel,
        );
        const rxExposure = simulateLink(
          rxPlacement,
          {
            lat: enemy.lat,
            lon: enemy.lon,
            antennaHeightM: 2,
            receiverGainDbi: 0,
            systemLossDb: 0,
          },
          terrain,
          weather,
          propagationModel,
        );
        detectionPenalty += normalizedSignal(txExposure.rssiDbm) + normalizedSignal(rxExposure.rssiDbm);
        maxEnemyRssi = Math.max(maxEnemyRssi, txExposure.rssiDbm, rxExposure.rssiDbm);
      }

      const friendlyScore = normalizedSignal(friendlyLink.rssiDbm) * 1.8;
      const separationScore = Math.min(separationMeters / Math.max(minSeparationMeters, 1), 3) * 15;
      const enemyPenaltyScore = enemyAssets.length
        ? (detectionPenalty / enemyAssets.length) * detectionWeight
        : 0;
      const score = friendlyScore + separationScore * separationWeight - enemyPenaltyScore;

      best.push({
        score,
        friendlyRssiDbm: friendlyLink.rssiDbm,
        friendlyPathLossDb: friendlyLink.pathLossDb,
        friendlyLineOfSight: friendlyLink.lineOfSight,
        maxEnemyRssiDbm: maxEnemyRssi,
        separationMeters,
        tx: txPlacement,
        rx: rxPlacement,
      });
    }
  }

  best.sort((left, right) => right.score - left.score);

  return {
    requestId,
    terrainId,
    recommendations: best.slice(0, 5),
    candidateCount: candidates.length,
  };
}

function simulateLink(txAsset, rxTarget, terrain, weather, propagationModel) {
  const distanceKm = haversineKm(txAsset.lat, txAsset.lon, rxTarget.lat, rxTarget.lon);
  const includeTerrain = usesTerrainEffects(propagationModel);
  const includeAtmosphere = usesAtmosphericEffects(propagationModel);
  const includeBuildings = usesBuildingEffects(propagationModel);
  const terrainProfile = includeTerrain
    ? traceTerrain(
      txAsset,
      rxTarget,
      txAsset.antennaHeightM ?? 0,
      rxTarget.antennaHeightM ?? 0,
      terrain,
    )
    : { lineOfSight: true, maxObstructionM: 0, buildingPathMeters: 0, buildingHitSamples: 0 };
  const freeSpaceDb = freeSpacePathLoss(distanceKm, txAsset.frequencyMHz);
  const atmosphericDb = includeAtmosphere
    ? atmosphericAttenuation(txAsset.frequencyMHz, weather, distanceKm)
    : 0;
  const diffractionDb = includeTerrain
    ? diffractionPenalty(terrainProfile.maxObstructionM, distanceKm, txAsset.frequencyMHz)
    : 0;
  const buildingLossDb = includeBuildings
    ? buildingStructurePenalty(terrainProfile, txAsset.frequencyMHz, terrain)
    : 0;

  let pathLossDb = freeSpaceDb;
  if (propagationModel === "itu-p526") {
    pathLossDb += diffractionDb;
  } else if (propagationModel === "itu-hybrid") {
    pathLossDb += atmosphericDb + diffractionDb;
  } else if (propagationModel === "itu-buildings-weather") {
    pathLossDb += atmosphericDb + diffractionDb + buildingLossDb;
  }

  const txPowerDbm = wattsToDbm(txAsset.powerW);
  const txGainDb = txAsset.antennaGainDbi ?? 0;
  const rxGainDb = rxTarget.receiverGainDbi ?? 0;
  const totalSystemLossDb = (txAsset.systemLossDb ?? 0) + (rxTarget.systemLossDb ?? 0);
  const jammerBoostDb = txAsset.type === "jammer" ? 6 : 0;
  const rssiDbm = txPowerDbm + txGainDb + rxGainDb + jammerBoostDb - pathLossDb - totalSystemLossDb;

  return {
    distanceKm,
    pathLossDb,
    lineOfSight: terrainProfile.lineOfSight,
    maxObstructionM: terrainProfile.maxObstructionM,
    buildingLossDb,
    buildingPathMeters: terrainProfile.buildingPathMeters,
    buildingHitSamples: terrainProfile.buildingHitSamples,
    rssiDbm,
  };
}

function usesTerrainEffects(propagationModel) {
  return propagationModel === "itu-p526"
    || propagationModel === "itu-hybrid"
    || propagationModel === "itu-buildings-weather";
}

function usesAtmosphericEffects(propagationModel) {
  return propagationModel === "itu-hybrid" || propagationModel === "itu-buildings-weather";
}

function usesBuildingEffects(propagationModel) {
  return propagationModel === "itu-buildings-weather";
}

function traceTerrain(source, target, txHeightM, rxHeightM, terrain) {
  if (!terrain) {
    return { lineOfSight: true, maxObstructionM: 0, buildingPathMeters: 0, buildingHitSamples: 0, maxBuildingObstructionM: 0, buildingLineOfSightBlocked: false };
  }

  const totalDistanceKm = haversineKm(source.lat, source.lon, target.lat, target.lon);
  const totalDistanceMeters = totalDistanceKm * 1000;
  const traceSampleMeters = estimateTraceSampleMeters(terrain, (source.lat + target.lat) / 2);
  const steps = Math.max(24, Math.ceil(totalDistanceMeters / traceSampleMeters));
  const sourceGround = sampleTerrain(source.lat, source.lon, terrain);
  const targetGround = sampleTerrain(target.lat, target.lon, terrain);
  const sourceAlt = sourceGround + txHeightM;
  const targetAlt = targetGround + rxHeightM;
  let maxObstructionM = 0;
  let buildingPathMeters = 0;
  let buildingHitSamples = 0;
  let maxBuildingObstructionM = 0;
  const stepDistanceMeters = totalDistanceMeters / steps;

  for (let step = 1; step < steps; step += 1) {
    const t = step / steps;
    const lat = lerp(source.lat, target.lat, t);
    const lon = lerp(source.lon, target.lon, t);
    const terrainHeight = sampleSurfaceObstruction(lat, lon, terrain);
    const baseTerrainHeight = sampleTerrainBase(lat, lon, terrain);
    const losHeight = lerp(sourceAlt, targetAlt, t);
    const earthCurveDrop = earthCurvatureDropMeters(totalDistanceKm * t);
    const obstruction = terrainHeight - (losHeight - earthCurveDrop);
    if (obstruction > maxObstructionM) {
      maxObstructionM = obstruction;
    }
    const buildingHeight = Math.max(0, terrainHeight - baseTerrainHeight);
    if (buildingHeight > 2 && obstruction > 0) {
      buildingPathMeters += stepDistanceMeters;
      buildingHitSamples += 1;
      maxBuildingObstructionM = Math.max(maxBuildingObstructionM, Math.min(obstruction, buildingHeight));
    }
  }

  return {
    lineOfSight: maxObstructionM <= 0,
    maxObstructionM: Math.max(0, maxObstructionM),
    buildingPathMeters,
    buildingHitSamples,
    maxBuildingObstructionM,
    buildingLineOfSightBlocked: maxBuildingObstructionM > 0.5,
  };
}

function estimateTraceSampleMeters(terrain, latitude) {
  const latMeters = Math.abs(terrain.latStepDeg ?? 0) * 111320;
  const lonMeters = Math.abs(terrain.lonStepDeg ?? 0) * 111320 * Math.max(Math.cos((latitude * Math.PI) / 180), 1e-6);
  const cellMeters = Math.max(1, Math.min(latMeters || Number.POSITIVE_INFINITY, lonMeters || Number.POSITIVE_INFINITY));
  return Math.max(8, Math.min(40, cellMeters / 3));
}

function sampleSurfaceObstruction(lat, lon, terrain) {
  if (!terrain?.osmBuildingsEnabled) {
    return sampleTerrain(lat, lon, terrain);
  }
  const cellLatOffset = Math.abs(terrain.latStepDeg ?? 0) * 0.42;
  const cellLonOffset = Math.abs(terrain.lonStepDeg ?? 0) * 0.42;
  const samplePoints = [
    [lat, lon],
    [lat + cellLatOffset, lon],
    [lat - cellLatOffset, lon],
    [lat, lon + cellLonOffset],
    [lat, lon - cellLonOffset],
    [lat + cellLatOffset * 0.7, lon + cellLonOffset * 0.7],
    [lat + cellLatOffset * 0.7, lon - cellLonOffset * 0.7],
    [lat - cellLatOffset * 0.7, lon + cellLonOffset * 0.7],
    [lat - cellLatOffset * 0.7, lon - cellLonOffset * 0.7],
  ];
  let maxHeight = sampleTerrain(lat, lon, terrain);
  for (const [sampleLat, sampleLon] of samplePoints) {
    maxHeight = Math.max(maxHeight, sampleTerrain(sampleLat, sampleLon, terrain));
  }
  return maxHeight;
}

function sampleTerrain(lat, lon, terrain) {
  return sampleTerrainField(lat, lon, terrain, "elevations");
}

function sampleTerrainBase(lat, lon, terrain) {
  return sampleTerrainField(lat, lon, terrain, "baseElevations");
}

function sampleTerrainField(lat, lon, terrain, fieldName) {
  const rowFloat = (lat - terrain.origin.lat) / terrain.latStepDeg;
  const colFloat = (lon - terrain.origin.lon) / terrain.lonStepDeg;
  const row = Math.floor(rowFloat);
  const col = Math.floor(colFloat);

  if (row < 0 || col < 0 || row >= terrain.rows - 1 || col >= terrain.cols - 1) {
    return 0;
  }

  const rowRatio = rowFloat - row;
  const colRatio = colFloat - col;
  const source = terrain[fieldName] ?? terrain.elevations;
  const q11 = source[row * terrain.cols + col];
  const q21 = source[row * terrain.cols + col + 1];
  const q12 = source[(row + 1) * terrain.cols + col];
  const q22 = source[(row + 1) * terrain.cols + col + 1];
  return bilinear(q11, q21, q12, q22, colRatio, rowRatio);
}

function getBuildingBandProfile(frequencyMHz) {
  if (frequencyMHz < 30) {
    return null;
  }
  if (frequencyMHz < 300) {
    return {
      band: "vhf",
      penetrationMultiplier: 0.75,
      shadowBaseLossDb: 16,
      shadowObstructionMultiplier: 2.2,
      shadowDistanceMultiplier: 0.7,
      maxShadowExtraDb: 26,
    };
  }
  if (frequencyMHz < 3000) {
    return {
      band: "uhf",
      penetrationMultiplier: 1,
      shadowBaseLossDb: 24,
      shadowObstructionMultiplier: 3.4,
      shadowDistanceMultiplier: 1.2,
      maxShadowExtraDb: 42,
    };
  }
  return {
    band: "shf",
    penetrationMultiplier: 1.35,
    shadowBaseLossDb: 32,
    shadowObstructionMultiplier: 4.2,
    shadowDistanceMultiplier: 1.7,
    maxShadowExtraDb: 56,
  };
}

function buildingStructurePenalty(terrainProfile, frequencyMHz, terrain) {
  if (!terrain?.osmBuildingsEnabled) {
    return 0;
  }
  const bandProfile = getBuildingBandProfile(frequencyMHz);
  if (!bandProfile) {
    return 0;
  }
  if (!terrainProfile || terrainProfile.buildingHitSamples <= 0 || terrainProfile.buildingPathMeters <= 0) {
    return 0;
  }

  const presets = {
    "light-frame": { entryLossDb: 6, lossPerMeterDb: 0.8, maxAdditionalLossDb: 18 },
    brick: { entryLossDb: 10, lossPerMeterDb: 1.3, maxAdditionalLossDb: 24 },
    "reinforced-concrete": { entryLossDb: 16, lossPerMeterDb: 2.1, maxAdditionalLossDb: 34 },
    "steel-glass": { entryLossDb: 18, lossPerMeterDb: 2.6, maxAdditionalLossDb: 38 },
  };
  const preset = presets[terrain.buildingMaterialPreset] ?? presets["reinforced-concrete"];
  const effectivePathMeters = Math.min(terrainProfile.buildingPathMeters, 12);
  const obstructionFactor = clamp(terrainProfile.maxBuildingObstructionM / 10, 0.35, 1);
  const penetrationLossDb = (preset.entryLossDb + effectivePathMeters * preset.lossPerMeterDb)
    * obstructionFactor
    * bandProfile.penetrationMultiplier;
  if (!terrainProfile.buildingLineOfSightBlocked) {
    return Math.min(penetrationLossDb, preset.maxAdditionalLossDb);
  }

  const shadowLossDb = bandProfile.shadowBaseLossDb
    + terrainProfile.maxBuildingObstructionM * bandProfile.shadowObstructionMultiplier
    + effectivePathMeters * bandProfile.shadowDistanceMultiplier;
  const totalLossDb = penetrationLossDb + shadowLossDb;
  return Math.min(totalLossDb, preset.maxAdditionalLossDb + bandProfile.maxShadowExtraDb);
}

function diffractionPenalty(maxObstructionM, distanceKm, frequencyMHz) {
  if (maxObstructionM <= 0) {
    return 0;
  }

  const wavelengthM = 300 / Math.max(frequencyMHz, 0.1);
  const effectiveDistanceM = Math.max(distanceKm * 1000, 1);
  const v = maxObstructionM * Math.sqrt((2 / wavelengthM) * (2 / effectiveDistanceM));
  if (v <= -0.78) {
    return 0;
  }
  return 6.9 + 20 * Math.log10(Math.sqrt((v - 0.1) ** 2 + 1) + v - 0.1);
}

function atmosphericAttenuation(freqMHz, weather, distanceKm) {
  const freqGHz = Math.max(freqMHz, 1) / 1000;
  const humidityFactor = (weather.humidity / 100) * 0.18;
  const pressureFactor = weather.pressureHpa / 1013.25;
  const tempFactor = 293.15 / (weather.temperatureC + 273.15);
  const oxygenLoss = freqGHz * 0.012 * pressureFactor;
  const waterVaporLoss = freqGHz * humidityFactor * tempFactor;
  const windNoise = weather.windSpeedMps * 0.002;
  return Math.max(0, (oxygenLoss + waterVaporLoss + windNoise) * distanceKm);
}

function freeSpacePathLoss(distanceKm, frequencyMHz) {
  return 32.44 + 20 * Math.log10(Math.max(distanceKm, 0.001)) + 20 * Math.log10(Math.max(frequencyMHz, 0.1));
}

function wattsToDbm(watts) {
  return 10 * Math.log10(Math.max(watts, 0.000001) * 1000);
}

function resolveTerrain(terrainId) {
  if (!terrainId) {
    return null;
  }
  return terrainCache.get(terrainId) ?? null;
}

function polygonBounds(polygon) {
  let minLat = Number.POSITIVE_INFINITY;
  let maxLat = Number.NEGATIVE_INFINITY;
  let minLon = Number.POSITIVE_INFINITY;
  let maxLon = Number.NEGATIVE_INFINITY;

  for (let index = 0; index < polygon.length; index += 1) {
    const point = polygon[index];
    minLat = Math.min(minLat, point.lat);
    maxLat = Math.max(maxLat, point.lat);
    minLon = Math.min(minLon, point.lon);
    maxLon = Math.max(maxLon, point.lon);
  }

  return { minLat, maxLat, minLon, maxLon };
}

function pointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const xi = polygon[i].lon;
    const yi = polygon[i].lat;
    const xj = polygon[j].lon;
    const yj = polygon[j].lat;
    const intersect =
      yi > point.lat !== yj > point.lat &&
      point.lon < ((xj - xi) * (point.lat - yi)) / ((yj - yi) || Number.EPSILON) + xi;
    if (intersect) {
      inside = !inside;
    }
  }
  return inside;
}

function normalizedSignal(rssiDbm) {
  return clamp(rssiDbm, -130, -40) + 130;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function metersToLatitudeDegrees(meters) {
  return meters / 111320;
}

function metersToLongitudeDegrees(meters, lat) {
  return meters / (111320 * Math.max(Math.cos((lat * Math.PI) / 180), 0.01));
}

function earthCurvatureDropMeters(distanceKm) {
  return (distanceKm * 1000) ** 2 / (2 * 6371000);
}

function bilinear(q11, q21, q12, q22, xRatio, yRatio) {
  return (
    q11 * (1 - xRatio) * (1 - yRatio) +
    q21 * xRatio * (1 - yRatio) +
    q12 * (1 - xRatio) * yRatio +
    q22 * xRatio * yRatio
  );
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
