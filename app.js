const FORCE_COLORS = {
  friendly: "#a8d8ea",
  enemy: "#f4a8a0",
  "host-nation": "#a8dbb5",
  civilian: "#e8e8e8",
  other: "#c0c0c0",
};

const FORCE_LABELS = {
  friendly: "Friendly",
  enemy: "Enemy",
  "host-nation": "Host Nation",
  civilian: "Civilian",
  other: "Other",
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

function generateId() {
  if (typeof crypto !== "undefined") {
    if (typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    if (typeof crypto.getRandomValues === "function") {
      const bytes = crypto.getRandomValues(new Uint8Array(16));
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
      return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
    }
  }

  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// ─── Radio Library ────────────────────────────────────────────────────────────
// Each entry: radioType → { label, programs: { programKey → profile } }
// Profile schema mirrors the emitter modal fields.
const RADIO_LIBRARY = {
  "prc-163": {
    label: "AN/PRC-163 Falcon IV",
    programs: {
      "vhf-sincgars": {
        label: "VHF LOS — SINCGARS",
        rf: { frequencyMHz: 46, bandwidthKHz: 25, modulation: "FHSS", waveform: "SINCGARS", duplex: "half-duplex", channelSpacingKHz: 25 },
        tx: { powerW: 5, dutyCycle: 0.5, papr: 0, spectralEfficiency: 4.8 },
        rx: { sensitivityDbm: -107, noiseFigDb: 6, requiredSnrDb: 12, acrDb: 70, bdrDb: 90 },
        antenna: { type: "whip", gainDbi: 2.15, pattern: "omnidirectional", polarization: "vertical", heightM: 2, cableLossDb: 0.5, systemLossDb: 3 },
        prop: { model: "itu-p526", clutter: "open", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: false, relayCapable: false, maxHops: 1, latencyMs: 200, adaptiveDataRate: false },
      },
      "uhf-los": {
        label: "UHF LOS — Tactical",
        rf: { frequencyMHz: 370, bandwidthKHz: 25, modulation: "FM", waveform: "analog", duplex: "half-duplex", channelSpacingKHz: 25 },
        tx: { powerW: 5, dutyCycle: 0.5, papr: 0, spectralEfficiency: 2.4 },
        rx: { sensitivityDbm: -107, noiseFigDb: 6, requiredSnrDb: 12, acrDb: 65, bdrDb: 85 },
        antenna: { type: "whip", gainDbi: 2.15, pattern: "omnidirectional", polarization: "vertical", heightM: 2, cableLossDb: 0.5, systemLossDb: 3 },
        prop: { model: "itu-p526", clutter: "open", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: false, relayCapable: false, maxHops: 1, latencyMs: 150, adaptiveDataRate: false },
      },
      "srw-manet": {
        label: "SRW MANET — Soldier Radio",
        rf: { frequencyMHz: 2400, bandwidthKHz: 5000, modulation: "OFDM", waveform: "SRW", duplex: "full-duplex", channelSpacingKHz: 5000 },
        tx: { powerW: 2, dutyCycle: 1, papr: 8, spectralEfficiency: 1.5 },
        rx: { sensitivityDbm: -95, noiseFigDb: 8, requiredSnrDb: 10, acrDb: 30, bdrDb: 60 },
        antenna: { type: "blade", gainDbi: 0, pattern: "omnidirectional", polarization: "vertical", heightM: 1.5, cableLossDb: 0.3, systemLossDb: 2 },
        prop: { model: "itu-p526", clutter: "urban", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: true, relayCapable: true, maxHops: 8, latencyMs: 50, adaptiveDataRate: true },
      },
      "muos-satcom": {
        label: "MUOS SATCOM — WCDMA",
        rf: { frequencyMHz: 300, bandwidthKHz: 5000, modulation: "QPSK", waveform: "MUOS", duplex: "full-duplex", channelSpacingKHz: 5000 },
        tx: { powerW: 20, dutyCycle: 1, papr: 6, spectralEfficiency: 2 },
        rx: { sensitivityDbm: -107, noiseFigDb: 4, requiredSnrDb: 8, acrDb: 60, bdrDb: 80 },
        antenna: { type: "satcom_patch", gainDbi: 10, pattern: "directional", polarization: "circular", heightM: 1.5, cableLossDb: 1, systemLossDb: 4 },
        prop: { model: "itu-p528", clutter: "open", terrainEnabled: false, diffractionEnabled: false },
        net: { isManet: false, relayCapable: false, maxHops: 1, latencyMs: 600, adaptiveDataRate: true, satcomEnabled: true, satType: "GEO", satUplinkMHz: 292, satDownlinkMHz: 243, satGainDbi: 10 },
      },
    },
  },
  "prc-152a": {
    label: "AN/PRC-152A Falcon III",
    programs: {
      "vhf-los": {
        label: "VHF LOS — SINCGARS",
        rf: { frequencyMHz: 60, bandwidthKHz: 25, modulation: "FHSS", waveform: "SINCGARS", duplex: "half-duplex", channelSpacingKHz: 25 },
        tx: { powerW: 5, dutyCycle: 0.5, papr: 0, spectralEfficiency: 4.8 },
        rx: { sensitivityDbm: -107, noiseFigDb: 6, requiredSnrDb: 12, acrDb: 70, bdrDb: 90 },
        antenna: { type: "whip", gainDbi: 2.15, pattern: "omnidirectional", polarization: "vertical", heightM: 2, cableLossDb: 0.5, systemLossDb: 3 },
        prop: { model: "itu-p526", clutter: "open", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: false, relayCapable: false, maxHops: 1, latencyMs: 200, adaptiveDataRate: false },
      },
      "anw2": {
        label: "ANW2 MANET",
        rf: { frequencyMHz: 1800, bandwidthKHz: 2000, modulation: "OFDM", waveform: "ANW2", duplex: "full-duplex", channelSpacingKHz: 2000 },
        tx: { powerW: 5, dutyCycle: 1, papr: 6, spectralEfficiency: 2 },
        rx: { sensitivityDbm: -98, noiseFigDb: 7, requiredSnrDb: 10, acrDb: 40, bdrDb: 70 },
        antenna: { type: "blade", gainDbi: 0, pattern: "omnidirectional", polarization: "vertical", heightM: 2, cableLossDb: 0.5, systemLossDb: 3 },
        prop: { model: "itu-p526", clutter: "open", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: true, relayCapable: true, maxHops: 6, latencyMs: 80, adaptiveDataRate: true },
      },
    },
  },
  "prc-117g": {
    label: "AN/PRC-117G Falcon III",
    programs: {
      "vhf-cmd": {
        label: "VHF Command Net",
        rf: { frequencyMHz: 50, bandwidthKHz: 25, modulation: "FM", waveform: "analog", duplex: "half-duplex", channelSpacingKHz: 25 },
        tx: { powerW: 20, dutyCycle: 0.5, papr: 0, spectralEfficiency: 2.4 },
        rx: { sensitivityDbm: -107, noiseFigDb: 5, requiredSnrDb: 12, acrDb: 70, bdrDb: 90 },
        antenna: { type: "whip", gainDbi: 2.15, pattern: "omnidirectional", polarization: "vertical", heightM: 2, cableLossDb: 0.5, systemLossDb: 3 },
        prop: { model: "itu-p526", clutter: "open", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: false, relayCapable: true, maxHops: 1, latencyMs: 200, adaptiveDataRate: false },
      },
      "uhf-satcom-dama": {
        label: "UHF SATCOM DAMA",
        rf: { frequencyMHz: 305, bandwidthKHz: 25, modulation: "PSK", waveform: "MUOS", duplex: "full-duplex", channelSpacingKHz: 25 },
        tx: { powerW: 20, dutyCycle: 1, papr: 3, spectralEfficiency: 1.2 },
        rx: { sensitivityDbm: -107, noiseFigDb: 4, requiredSnrDb: 8, acrDb: 60, bdrDb: 80 },
        antenna: { type: "satcom_patch", gainDbi: 10, pattern: "directional", polarization: "circular", heightM: 1.5, cableLossDb: 1, systemLossDb: 4 },
        prop: { model: "itu-p528", clutter: "open", terrainEnabled: false, diffractionEnabled: false },
        net: { isManet: false, relayCapable: false, maxHops: 1, latencyMs: 600, adaptiveDataRate: false, satcomEnabled: true, satType: "GEO", satUplinkMHz: 305, satDownlinkMHz: 255, satGainDbi: 10 },
      },
      "wb-anw2": {
        label: "Wideband ANW2",
        rf: { frequencyMHz: 1500, bandwidthKHz: 5000, modulation: "OFDM", waveform: "ANW2", duplex: "full-duplex", channelSpacingKHz: 5000 },
        tx: { powerW: 20, dutyCycle: 1, papr: 8, spectralEfficiency: 3 },
        rx: { sensitivityDbm: -95, noiseFigDb: 6, requiredSnrDb: 10, acrDb: 40, bdrDb: 75 },
        antenna: { type: "blade", gainDbi: 2, pattern: "omnidirectional", polarization: "vertical", heightM: 2, cableLossDb: 0.5, systemLossDb: 3 },
        prop: { model: "itu-p526", clutter: "open", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: true, relayCapable: true, maxHops: 6, latencyMs: 60, adaptiveDataRate: true },
      },
    },
  },
  "prc-160": {
    label: "AN/PRC-160",
    programs: {
      "hf-nvis": {
        label: "HF NVIS — Short Range",
        rf: { frequencyMHz: 5.5, bandwidthKHz: 3, modulation: "USB", waveform: "ALE", duplex: "half-duplex", channelSpacingKHz: 3 },
        tx: { powerW: 20, dutyCycle: 0.5, papr: 0, spectralEfficiency: 0.4 },
        rx: { sensitivityDbm: -110, noiseFigDb: 10, requiredSnrDb: 6, acrDb: 60, bdrDb: 90 },
        antenna: { type: "dipole", gainDbi: 2, pattern: "omnidirectional", polarization: "horizontal", heightM: 5, cableLossDb: 0.5, systemLossDb: 2 },
        prop: { model: "hf-skywave", clutter: "open", terrainEnabled: false, diffractionEnabled: false, nvisEnabled: true, ionoModel: "itu-r", timeDayEffects: true, solarIndex: 80 },
        net: { isManet: false, relayCapable: false, maxHops: 1, latencyMs: 500, adaptiveDataRate: false },
      },
      "hf-longhaul": {
        label: "HF Long-Haul — Skywave",
        rf: { frequencyMHz: 14, bandwidthKHz: 3, modulation: "USB", waveform: "ALE", duplex: "half-duplex", channelSpacingKHz: 3 },
        tx: { powerW: 20, dutyCycle: 0.5, papr: 0, spectralEfficiency: 0.4 },
        rx: { sensitivityDbm: -110, noiseFigDb: 10, requiredSnrDb: 6, acrDb: 60, bdrDb: 90 },
        antenna: { type: "dipole", gainDbi: 2, pattern: "directional", polarization: "horizontal", heightM: 8, cableLossDb: 1, systemLossDb: 3 },
        prop: { model: "hf-skywave", clutter: "open", terrainEnabled: false, diffractionEnabled: false, nvisEnabled: false, ionoModel: "itu-r", timeDayEffects: true, solarIndex: 80 },
        net: { isManet: false, relayCapable: false, maxHops: 1, latencyMs: 800, adaptiveDataRate: false },
      },
      "vhf-fallback": {
        label: "VHF Fallback — Analog",
        rf: { frequencyMHz: 50, bandwidthKHz: 25, modulation: "FM", waveform: "analog", duplex: "half-duplex", channelSpacingKHz: 25 },
        tx: { powerW: 5, dutyCycle: 0.5, papr: 0, spectralEfficiency: 2.4 },
        rx: { sensitivityDbm: -107, noiseFigDb: 6, requiredSnrDb: 12, acrDb: 70, bdrDb: 90 },
        antenna: { type: "whip", gainDbi: 2.15, pattern: "omnidirectional", polarization: "vertical", heightM: 2, cableLossDb: 0.5, systemLossDb: 3 },
        prop: { model: "itu-p526", clutter: "open", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: false, relayCapable: false, maxHops: 1, latencyMs: 200, adaptiveDataRate: false },
      },
    },
  },
  "prc-77": {
    label: "AN/PRC-77",
    programs: {
      "vhf-analog": {
        label: "VHF Analog — Legacy",
        rf: { frequencyMHz: 60, bandwidthKHz: 50, modulation: "FM", waveform: "analog", duplex: "simplex", channelSpacingKHz: 50 },
        tx: { powerW: 4, dutyCycle: 0.5, papr: 0, spectralEfficiency: 1 },
        rx: { sensitivityDbm: -105, noiseFigDb: 8, requiredSnrDb: 15, acrDb: 55, bdrDb: 75 },
        antenna: { type: "whip", gainDbi: 2, pattern: "omnidirectional", polarization: "vertical", heightM: 2, cableLossDb: 0.5, systemLossDb: 3 },
        prop: { model: "itu-p526", clutter: "open", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: false, relayCapable: false, maxHops: 1, latencyMs: 0, adaptiveDataRate: false },
      },
    },
  },
  "vrc-90": {
    label: "AN/VRC-90 SINCGARS",
    programs: {
      "sincgars-fh": {
        label: "SINCGARS Frequency Hop",
        rf: { frequencyMHz: 50, bandwidthKHz: 25, modulation: "FHSS", waveform: "SINCGARS", duplex: "half-duplex", channelSpacingKHz: 25 },
        tx: { powerW: 50, dutyCycle: 0.5, papr: 0, spectralEfficiency: 4.8 },
        rx: { sensitivityDbm: -107, noiseFigDb: 5, requiredSnrDb: 12, acrDb: 70, bdrDb: 90 },
        antenna: { type: "whip", gainDbi: 2.15, pattern: "omnidirectional", polarization: "vertical", heightM: 3, cableLossDb: 1, systemLossDb: 2 },
        prop: { model: "itu-p526", clutter: "open", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: false, relayCapable: true, maxHops: 1, latencyMs: 200, adaptiveDataRate: false },
      },
    },
  },
  "prc-119": {
    label: "AN/PRC-119 SINCGARS",
    programs: {
      "sincgars-fh": {
        label: "SINCGARS Frequency Hop",
        rf: { frequencyMHz: 50, bandwidthKHz: 25, modulation: "FHSS", waveform: "SINCGARS", duplex: "half-duplex", channelSpacingKHz: 25 },
        tx: { powerW: 5, dutyCycle: 0.5, papr: 0, spectralEfficiency: 4.8 },
        rx: { sensitivityDbm: -107, noiseFigDb: 6, requiredSnrDb: 12, acrDb: 70, bdrDb: 90 },
        antenna: { type: "whip", gainDbi: 2.15, pattern: "omnidirectional", polarization: "vertical", heightM: 2, cableLossDb: 0.5, systemLossDb: 3 },
        prop: { model: "itu-p526", clutter: "open", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: false, relayCapable: false, maxHops: 1, latencyMs: 200, adaptiveDataRate: false },
      },
    },
  },
  "mbitr": {
    label: "AN/PRC-148 MBITR",
    programs: {
      "vhf-los": {
        label: "VHF LOS",
        rf: { frequencyMHz: 150, bandwidthKHz: 25, modulation: "FM", waveform: "analog", duplex: "half-duplex", channelSpacingKHz: 25 },
        tx: { powerW: 5, dutyCycle: 0.5, papr: 0, spectralEfficiency: 2.4 },
        rx: { sensitivityDbm: -107, noiseFigDb: 7, requiredSnrDb: 12, acrDb: 65, bdrDb: 85 },
        antenna: { type: "whip", gainDbi: 2.15, pattern: "omnidirectional", polarization: "vertical", heightM: 2, cableLossDb: 0.5, systemLossDb: 3 },
        prop: { model: "itu-p526", clutter: "open", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: false, relayCapable: false, maxHops: 1, latencyMs: 200, adaptiveDataRate: false },
      },
    },
  },
  "prc-154": {
    label: "AN/PRC-154 Rifleman Radio",
    programs: {
      "srw": {
        label: "Soldier Radio Waveform",
        rf: { frequencyMHz: 2400, bandwidthKHz: 5000, modulation: "OFDM", waveform: "SRW", duplex: "full-duplex", channelSpacingKHz: 5000 },
        tx: { powerW: 0.4, dutyCycle: 1, papr: 8, spectralEfficiency: 1.5 },
        rx: { sensitivityDbm: -95, noiseFigDb: 8, requiredSnrDb: 10, acrDb: 30, bdrDb: 60 },
        antenna: { type: "blade", gainDbi: 0, pattern: "omnidirectional", polarization: "vertical", heightM: 1.5, cableLossDb: 0.3, systemLossDb: 2 },
        prop: { model: "itu-p526", clutter: "urban", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: true, relayCapable: true, maxHops: 8, latencyMs: 50, adaptiveDataRate: true },
      },
    },
  },
  // ── Commercial P25 ───────────────────────────────────────────────────────────
  "p25-portable": {
    label: "P25 Portable (generic)",
    programs: {
      "p25-ph1-vhf": {
        label: "P25 Phase 1 VHF",
        rf: { frequencyMHz: 155, bandwidthKHz: 12.5, modulation: "FM", waveform: "P25-C4FM", duplex: "half-duplex", channelSpacingKHz: 12.5 },
        tx: { powerW: 5, dutyCycle: 0.5, papr: 0, spectralEfficiency: 4.8 },
        rx: { sensitivityDbm: -116, noiseFigDb: 5, requiredSnrDb: 12, acrDb: 70, bdrDb: 90 },
        antenna: { type: "whip", gainDbi: 2.15, pattern: "omnidirectional", polarization: "vertical", heightM: 1.8, cableLossDb: 0.3, systemLossDb: 2 },
        prop: { model: "itu-p526", clutter: "urban", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: false, relayCapable: false, maxHops: 1, latencyMs: 100, adaptiveDataRate: false },
      },
      "p25-ph1-uhf": {
        label: "P25 Phase 1 UHF",
        rf: { frequencyMHz: 460, bandwidthKHz: 12.5, modulation: "FM", waveform: "P25-CQPSK", duplex: "half-duplex", channelSpacingKHz: 12.5 },
        tx: { powerW: 4, dutyCycle: 0.5, papr: 0, spectralEfficiency: 4.8 },
        rx: { sensitivityDbm: -116, noiseFigDb: 5, requiredSnrDb: 12, acrDb: 70, bdrDb: 90 },
        antenna: { type: "whip", gainDbi: 2.15, pattern: "omnidirectional", polarization: "vertical", heightM: 1.8, cableLossDb: 0.3, systemLossDb: 2 },
        prop: { model: "itu-p526", clutter: "urban", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: false, relayCapable: false, maxHops: 1, latencyMs: 100, adaptiveDataRate: false },
      },
      "p25-ph2-tdma": {
        label: "P25 Phase 2 TDMA",
        rf: { frequencyMHz: 460, bandwidthKHz: 12.5, modulation: "QPSK", waveform: "P25-TDMA", duplex: "half-duplex", channelSpacingKHz: 12.5 },
        tx: { powerW: 4, dutyCycle: 0.5, papr: 3, spectralEfficiency: 9.6 },
        rx: { sensitivityDbm: -116, noiseFigDb: 5, requiredSnrDb: 12, acrDb: 70, bdrDb: 90 },
        antenna: { type: "whip", gainDbi: 2.15, pattern: "omnidirectional", polarization: "vertical", heightM: 1.8, cableLossDb: 0.3, systemLossDb: 2 },
        prop: { model: "itu-p526", clutter: "urban", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: false, relayCapable: false, maxHops: 1, latencyMs: 80, adaptiveDataRate: false },
      },
    },
  },
  "p25-mobile": {
    label: "P25 Mobile (generic)",
    programs: {
      "p25-vhf-mobile": {
        label: "P25 VHF Mobile",
        rf: { frequencyMHz: 155, bandwidthKHz: 12.5, modulation: "FM", waveform: "P25-C4FM", duplex: "half-duplex", channelSpacingKHz: 12.5 },
        tx: { powerW: 50, dutyCycle: 0.5, papr: 0, spectralEfficiency: 4.8 },
        rx: { sensitivityDbm: -116, noiseFigDb: 4, requiredSnrDb: 12, acrDb: 75, bdrDb: 95 },
        antenna: { type: "whip", gainDbi: 2.15, pattern: "omnidirectional", polarization: "vertical", heightM: 1.5, cableLossDb: 1, systemLossDb: 2 },
        prop: { model: "itu-p526", clutter: "suburban", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: false, relayCapable: false, maxHops: 1, latencyMs: 100, adaptiveDataRate: false },
      },
    },
  },
  "p25-repeater": {
    label: "P25 Repeater",
    programs: {
      "vhf-repeat": {
        label: "VHF Repeater",
        rf: { frequencyMHz: 155, bandwidthKHz: 12.5, modulation: "FM", waveform: "P25-C4FM", duplex: "full-duplex", channelSpacingKHz: 12.5 },
        tx: { powerW: 100, dutyCycle: 1, papr: 0, spectralEfficiency: 4.8 },
        rx: { sensitivityDbm: -120, noiseFigDb: 3, requiredSnrDb: 12, acrDb: 80, bdrDb: 100 },
        antenna: { type: "dipole", gainDbi: 6, pattern: "omnidirectional", polarization: "vertical", heightM: 30, cableLossDb: 2, systemLossDb: 3 },
        prop: { model: "itu-p526", clutter: "open", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: false, relayCapable: true, maxHops: 1, latencyMs: 50, adaptiveDataRate: false },
      },
    },
  },
  // ── Commercial DMR ───────────────────────────────────────────────────────────
  "dmr-portable": {
    label: "DMR Portable (Tier II)",
    programs: {
      "dmr-uhf": {
        label: "DMR UHF Direct",
        rf: { frequencyMHz: 460, bandwidthKHz: 12.5, modulation: "QPSK", waveform: "DMR", duplex: "half-duplex", channelSpacingKHz: 12.5 },
        tx: { powerW: 4, dutyCycle: 0.5, papr: 3, spectralEfficiency: 9.6 },
        rx: { sensitivityDbm: -116, noiseFigDb: 5, requiredSnrDb: 12, acrDb: 70, bdrDb: 90 },
        antenna: { type: "whip", gainDbi: 2.15, pattern: "omnidirectional", polarization: "vertical", heightM: 1.8, cableLossDb: 0.3, systemLossDb: 2 },
        prop: { model: "itu-p526", clutter: "urban", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: false, relayCapable: false, maxHops: 1, latencyMs: 80, adaptiveDataRate: false },
      },
    },
  },
  "dmr-mobile": {
    label: "DMR Mobile (Tier II)",
    programs: {
      "dmr-uhf-mobile": {
        label: "DMR UHF Mobile",
        rf: { frequencyMHz: 460, bandwidthKHz: 12.5, modulation: "QPSK", waveform: "DMR", duplex: "half-duplex", channelSpacingKHz: 12.5 },
        tx: { powerW: 25, dutyCycle: 0.5, papr: 3, spectralEfficiency: 9.6 },
        rx: { sensitivityDbm: -116, noiseFigDb: 4, requiredSnrDb: 12, acrDb: 75, bdrDb: 95 },
        antenna: { type: "whip", gainDbi: 2.15, pattern: "omnidirectional", polarization: "vertical", heightM: 1.5, cableLossDb: 1, systemLossDb: 2 },
        prop: { model: "itu-p526", clutter: "suburban", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: false, relayCapable: false, maxHops: 1, latencyMs: 80, adaptiveDataRate: false },
      },
    },
  },
  "dmr-repeater": {
    label: "DMR Repeater (Tier III)",
    programs: {
      "dmr-tier3": {
        label: "DMR Trunked Repeater",
        rf: { frequencyMHz: 460, bandwidthKHz: 12.5, modulation: "QPSK", waveform: "DMR", duplex: "full-duplex", channelSpacingKHz: 12.5 },
        tx: { powerW: 100, dutyCycle: 1, papr: 3, spectralEfficiency: 9.6 },
        rx: { sensitivityDbm: -120, noiseFigDb: 3, requiredSnrDb: 12, acrDb: 80, bdrDb: 100 },
        antenna: { type: "dipole", gainDbi: 6, pattern: "omnidirectional", polarization: "vertical", heightM: 30, cableLossDb: 2, systemLossDb: 3 },
        prop: { model: "itu-p526", clutter: "open", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: false, relayCapable: true, maxHops: 1, latencyMs: 50, adaptiveDataRate: true },
      },
    },
  },
  "mototrbo-r7": {
    label: "Motorola MOTOTRBO R7",
    programs: {
      "dmr-vhf": {
        label: "DMR VHF",
        rf: { frequencyMHz: 155, bandwidthKHz: 12.5, modulation: "QPSK", waveform: "DMR", duplex: "half-duplex", channelSpacingKHz: 12.5 },
        tx: { powerW: 5, dutyCycle: 0.5, papr: 3, spectralEfficiency: 9.6 },
        rx: { sensitivityDbm: -118, noiseFigDb: 5, requiredSnrDb: 12, acrDb: 70, bdrDb: 90 },
        antenna: { type: "whip", gainDbi: 2.15, pattern: "omnidirectional", polarization: "vertical", heightM: 1.8, cableLossDb: 0.3, systemLossDb: 2 },
        prop: { model: "itu-p526", clutter: "urban", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: false, relayCapable: false, maxHops: 1, latencyMs: 80, adaptiveDataRate: false },
      },
      "p25-analog": {
        label: "P25 / Analog Fallback",
        rf: { frequencyMHz: 460, bandwidthKHz: 12.5, modulation: "FM", waveform: "P25-C4FM", duplex: "half-duplex", channelSpacingKHz: 12.5 },
        tx: { powerW: 4, dutyCycle: 0.5, papr: 0, spectralEfficiency: 4.8 },
        rx: { sensitivityDbm: -118, noiseFigDb: 5, requiredSnrDb: 12, acrDb: 70, bdrDb: 90 },
        antenna: { type: "whip", gainDbi: 2.15, pattern: "omnidirectional", polarization: "vertical", heightM: 1.8, cableLossDb: 0.3, systemLossDb: 2 },
        prop: { model: "itu-p526", clutter: "urban", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: false, relayCapable: false, maxHops: 1, latencyMs: 100, adaptiveDataRate: false },
      },
    },
  },
  "harris-xg100p": {
    label: "Harris XG-100P (P25/LTE)",
    programs: {
      "p25-uhf": {
        label: "P25 UHF",
        rf: { frequencyMHz: 460, bandwidthKHz: 12.5, modulation: "FM", waveform: "P25-CQPSK", duplex: "half-duplex", channelSpacingKHz: 12.5 },
        tx: { powerW: 5, dutyCycle: 0.5, papr: 0, spectralEfficiency: 4.8 },
        rx: { sensitivityDbm: -116, noiseFigDb: 5, requiredSnrDb: 12, acrDb: 70, bdrDb: 90 },
        antenna: { type: "whip", gainDbi: 2.15, pattern: "omnidirectional", polarization: "vertical", heightM: 1.8, cableLossDb: 0.3, systemLossDb: 2 },
        prop: { model: "itu-p526", clutter: "urban", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: false, relayCapable: false, maxHops: 1, latencyMs: 100, adaptiveDataRate: false },
      },
    },
  },
  "broadband-lte": {
    label: "Broadband LTE (FirstNet)",
    programs: {
      "firstnet-700": {
        label: "FirstNet Band 14 (700 MHz)",
        rf: { frequencyMHz: 758, bandwidthKHz: 10000, modulation: "OFDM", waveform: "LTE", duplex: "full-duplex", channelSpacingKHz: 10000 },
        tx: { powerW: 0.2, dutyCycle: 1, papr: 10, spectralEfficiency: 6 },
        rx: { sensitivityDbm: -97, noiseFigDb: 7, requiredSnrDb: 8, acrDb: 45, bdrDb: 70 },
        antenna: { type: "panel", gainDbi: 0, pattern: "omnidirectional", polarization: "vertical", heightM: 1.5, cableLossDb: 0.2, systemLossDb: 2 },
        prop: { model: "itu-p526", clutter: "suburban", terrainEnabled: true, diffractionEnabled: true },
        net: { isManet: false, relayCapable: false, maxHops: 1, latencyMs: 20, adaptiveDataRate: true },
      },
    },
  },
};

// ─── Link budget helpers ──────────────────────────────────────────────────────
function wattsToDbm(w) { return 10 * Math.log10(w * 1000); }
function dbmToWatts(dbm) { return Math.pow(10, dbm / 10) / 1000; }
function fsplDb(freqMHz, distM) {
  return 20 * Math.log10(distM) + 20 * Math.log10(freqMHz * 1e6) - 147.55;
}
function computeLinkBudget(profile) {
  const txDbm = wattsToDbm(profile.tx.powerW);
  const gainDbi = profile.antenna.gainDbi;
  const cableLossDb = profile.antenna.cableLossDb;
  const systemLossDb = profile.antenna.systemLossDb;
  const eirpDbm = txDbm + gainDbi - cableLossDb - (systemLossDb - cableLossDb);
  const rxSensDbm = profile.rx.sensitivityDbm;
  const freqMHz = profile.rf.frequencyMHz;
  const fspl10km = fsplDb(freqMHz, 10000);
  const rxPower10km = eirpDbm - fspl10km + gainDbi;
  const margin10km = rxPower10km - rxSensDbm;
  // Max range where margin = 0: solve eirp - fspl + gain = rxSens
  // fspl = 20log(d) + 20log(f) - 147.55 → d = 10^((eirp+gain-rxSens+147.55 - 20log(f))/20)
  const maxRangeM = Math.pow(10, (eirpDbm + gainDbi - rxSensDbm + 147.55 - 20 * Math.log10(freqMHz * 1e6)) / 20);
  return { txDbm, eirpDbm, fspl10km, rxPower10km, margin10km, maxRangeM };
}

const PROFILE_STORAGE_KEY = "ew-sim-emitter-profiles";
const SETTINGS_STORAGE_KEY = "ew-sim-map-settings";
const CESIUM_ION_TOKEN_STORAGE_KEY = "ew-sim-cesium-ion-token";
const AI_PROVIDER_STORAGE_KEY = "ew-sim-ai-provider";
const MAP_STATE_STORAGE_KEY = "ew-sim-map-state";
const MAP_STATE_STORAGE_KEY_LEGACY = null; // no prior keys to migrate
const AUTH_TOKEN_STORAGE_KEY = "ew-sim-auth-token";
const ACTIVE_PROJECT_STORAGE_KEY = "ew-sim-active-project";
const API_BASE_URL = window.EW_SIM_CONFIG?.apiBaseUrl ?? `${window.location.origin}/api`;
const GENAI_MIL_ENDPOINT = "https://api.genai.mil/v1/chat/completions";
const GENAI_MIL_PROXY_ENDPOINT = "http://127.0.0.1:8787/v1/chat/completions";
const AI_PROVIDER_CATALOG = {
  "genai-mil": {
    shortLabel: "GenAI.mil",
    keyLabel: "GenAI.mil API Key",
    keyPlaceholder: "Paste STARK_ API key",
    defaultModel: "gemini-2.5-flash",
    models: [
      { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
      { value: "gpt-4.1", label: "GPT-4.1" },
    ],
  },
  anthropic: {
    shortLabel: "Claude",
    keyLabel: "Anthropic API Key",
    keyPlaceholder: "Paste sk-ant-... API key",
    defaultModel: "claude-sonnet-4-6",
    models: [
      { value: "claude-sonnet-4-6", label: "Claude Sonnet 4.6" },
      { value: "claude-3-7-sonnet-latest", label: "Claude 3.7 Sonnet" },
    ],
  },
};

const dom = {
  collapsePanelBtn: document.querySelector("#collapsePanelBtn"),
  collapsePanelIcon: document.querySelector("#collapsePanelIcon"),
  controlPanel: document.querySelector("#controlPanel"),
  mcSelectBtn: document.querySelector("#mcSelectBtn"),
  undoBanner: document.querySelector("#undoBanner"),
  undoBannerMsg: document.querySelector("#undoBannerMsg"),
  undoBannerBtn: document.querySelector("#undoBannerBtn"),
  undoBannerDismiss: document.querySelector("#undoBannerDismiss"),
  panelDivider: document.querySelector("#panelDivider"),
  controlPanelSectionDivider: document.querySelector("#controlPanelSectionDivider"),
  panelModeBtn: document.querySelector("#panelModeBtn"),
  aiPanelDivider: document.querySelector("#aiPanelDivider"),
  imageryMenuBtn: document.querySelector("#imageryMenuBtn"),
  imageryMenu: document.querySelector("#imageryMenu"),
  imageryMenuValue: document.querySelector("#imageryMenuValue"),
  terrainMenuBtn: document.querySelector("#terrainMenuBtn"),
  terrainMenu: document.querySelector("#terrainMenu"),
  terrainMenuValue: document.querySelector("#terrainMenuValue"),
  weatherMenuBtn: document.querySelector("#weatherMenuBtn"),
  weatherMenu: document.querySelector("#weatherMenu"),
  weatherMenuValue: document.querySelector("#weatherMenuValue"),
  topBarDropdownLayer: document.querySelector("#topBarDropdownLayer"),
  workspaceMenuBtn: document.querySelector("#workspaceMenuBtn"),
  workspaceMenu: document.querySelector("#workspaceMenu"),
  workspaceMenuValue: document.querySelector("#workspaceMenuValue"),
  workspaceMenuHeadline: document.querySelector("#workspaceMenuHeadline"),
  workspaceStatus: document.querySelector("#workspaceStatus"),
  workspaceAuthGuest: document.querySelector("#workspaceAuthGuest"),
  workspaceAuthMember: document.querySelector("#workspaceAuthMember"),
  workspaceFullName: document.querySelector("#workspaceFullName"),
  workspaceEmail: document.querySelector("#workspaceEmail"),
  workspacePassword: document.querySelector("#workspacePassword"),
  workspaceLoginBtn: document.querySelector("#workspaceLoginBtn"),
  workspaceRegisterBtn: document.querySelector("#workspaceRegisterBtn"),
  workspaceSignOutBtn: document.querySelector("#workspaceSignOutBtn"),
  workspaceUserLabel: document.querySelector("#workspaceUserLabel"),
  workspaceProjectMode: document.querySelector("#workspaceProjectMode"),
  workspaceProjectSelect: document.querySelector("#workspaceProjectSelect"),
  workspaceProjectName: document.querySelector("#workspaceProjectName"),
  workspaceProjectCreateBtn: document.querySelector("#workspaceProjectCreateBtn"),
  workspaceProjectSaveBtn: document.querySelector("#workspaceProjectSaveBtn"),
  workspaceProjectReloadBtn: document.querySelector("#workspaceProjectReloadBtn"),
  workspaceProjectSnapshotBtn: document.querySelector("#workspaceProjectSnapshotBtn"),
  workspaceProjectStatus: document.querySelector("#workspaceProjectStatus"),
  aiMenuBtn: null,
  aiMenu: null,
  aiMenuValue: null,
  aiProviderSelect: document.querySelector("#aiProviderSelect"),
  aiSavedConfigSelect: document.querySelector("#aiSavedConfigSelect"),
  aiSavedConfigLabelInput: document.querySelector("#aiSavedConfigLabelInput"),
  aiApiKeyInput: document.querySelector("#aiApiKeyInput"),
  aiApiKeyLabelText: document.querySelector("#aiApiKeyLabelText"),
  aiProviderSummary: document.querySelector("#aiProviderSummary"),
  saveAiProviderBtn: document.querySelector("#saveAiProviderBtn"),
  deleteAiProviderBtn: document.querySelector("#deleteAiProviderBtn"),
  testAiConnectionBtn: document.querySelector("#testAiConnectionBtn"),
  clearAiProviderBtn: document.querySelector("#clearAiProviderBtn"),
  openAiPanelBtn: null, // removed from topbar — kept as null so refs don't throw
  aiChatToggleBtn: document.querySelector("#aiChatToggleBtn"),
  aiChatToggleValue: document.querySelector("#aiChatToggleValue"),
  aiChatToggleChevron: document.querySelector("#aiChatToggleChevron"),
  gpsMenuBtn: document.querySelector("#gpsMenuBtn"),
  gpsMenu: document.querySelector("#gpsMenu"),
  settingsMenuBtn: document.querySelector("#settingsMenuBtn"),
  settingsMenu: document.querySelector("#settingsMenu"),
  settingsModalDialog: document.querySelector("#settingsMenu .settings-modal"),
  settingsMenuCloseBtn: document.querySelector("#settingsMenuCloseBtn"),
  measurementUnitsSelect: document.querySelector("#measurementUnitsSelect"),
  themeSelect: document.querySelector("#themeSelect"),
  coordinateSystemSelect: document.querySelector("#coordinateSystemSelect"),
  gridlinesToggle: document.querySelector("#gridlinesToggle"),
  centerGridToggle: document.querySelector("#centerGridToggle"),
  gridlinesColor: document.querySelector("#gridlinesColor"),
  clockValue: document.querySelector("#clockValue"),
  gpsStatusValue: document.querySelector("#gpsStatusValue"),
  coordsLabel: document.querySelector("#coordsLabel"),
  mgrsValue: document.querySelector("#mgrsValue"),
  statusBadge: document.querySelector("#statusBadge"),
  view3dToggleBtn: document.querySelector("#view3dToggleBtn"),
  basemapSelect: document.querySelector("#basemapSelect"),
  customTileUrl: document.querySelector("#customTileUrl"),
  radiusValue: document.querySelector("#radiusValue"),
  radiusUnit: document.querySelector("#radiusUnit"),
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
  drawShapeBtn: document.querySelector("#drawShapeBtn"),
  drawDropdown: document.querySelector("#drawDropdown"),
  drawCircleBtn: document.querySelector("#drawCircleBtn"),
  drawRectangleBtn: document.querySelector("#drawRectangleBtn"),
  drawPolylineBtn: document.querySelector("#drawPolylineBtn"),
  shapeStylePanel: document.querySelector("#shapeStylePanel"),
  shapeColorInput: document.querySelector("#shapeColorInput"),
  shapeLineStyleSelect: document.querySelector("#shapeLineStyleSelect"),
  shapeOpacityInput: document.querySelector("#shapeOpacityInput"),
  shapeWeightInput: document.querySelector("#shapeWeightInput"),
  shapeOpacityValue: document.querySelector("#shapeOpacityValue"),
  shapeWeightValue: document.querySelector("#shapeWeightValue"),
  shapeStyleEditVerticesBtn: document.querySelector("#shapeStyleEditVerticesBtn"),
  shapeStyleDoneBtn: document.querySelector("#shapeStyleDoneBtn"),
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
  exportMenuBtn: document.querySelector("#exportMenuBtn"),
  exportDropdown: document.querySelector("#exportDropdown"),
  exportGeoJsonBtn: document.querySelector("#exportGeoJsonBtn"),
  exportKmlBtn: document.querySelector("#exportKmlBtn"),
  exportKmzBtn: document.querySelector("#exportKmzBtn"),
  exportZipBtn: document.querySelector("#exportZipBtn"),
  assetSelect: document.querySelector("#assetSelect"),
  propagationModel: document.querySelector("#propagationModel"),
  viewshedOpacity: document.querySelector("#viewshedOpacity"),
  viewshedList: document.querySelector("#viewshedList"),
  clearViewshedsBtn: document.querySelector("#clearViewshedsBtn"),
  gridMeters: document.querySelector("#gridMeters"),
  receiverHeight: document.querySelector("#receiverHeight"),
  runSimulationBtn: document.querySelector("#runSimulationBtn"),
  simulationSection: document.querySelector("#simulationSection"),
  simulationModal: document.querySelector("#simulationModal"),
  simulationModalCloseBtn: document.querySelector("#simulationModalCloseBtn"),
  simulationAssetSummary: document.querySelector("#simulationAssetSummary"),
  coverageMetric: document.querySelector("#coverageMetric"),
  minRssiMetric: document.querySelector("#minRssiMetric"),
  maxRssiMetric: document.querySelector("#maxRssiMetric"),
  connectGeolocationBtn: document.querySelector("#connectGeolocationBtn"),
  connectUsbGpsBtn: document.querySelector("#connectUsbGpsBtn"),
  gpsCenterMode: document.querySelector("#gpsCenterMode"),
  gpsHelpText: document.querySelector("#gpsHelpText"),
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
  centerGridCrosshair: document.querySelector("#centerGridCrosshair"),
  cesiumCompassBtn: document.querySelector("#cesiumCompassBtn"),
  cesiumCompassRose: document.querySelector("#cesiumCompassRose"),
  aiPanel: document.querySelector("#aiPanel"),
  collapseAiPanelBtn: document.querySelector("#collapseAiPanelBtn"),
  collapseAiPanelIcon: document.querySelector("#collapseAiPanelIcon"),
  aiPanelStatus: document.querySelector("#aiPanelStatus"),
  aiChatMessages: document.querySelector("#aiChatMessages"),
  aiChatForm: document.querySelector("#aiChatForm"),
  aiChatModelSelect: document.querySelector("#aiChatModelSelect"),
  aiChatInput: document.querySelector("#aiChatInput"),
  aiSendBtn: document.querySelector("#aiSendBtn"),
  aiClearChatBtn: document.querySelector("#aiClearChatBtn"),
  aiAttachmentBar: document.querySelector("#aiAttachmentBar"),
  aiImagePreviews: document.querySelector("#aiImagePreviews"),
  aiFileChips: document.querySelector("#aiFileChips"),
  aiContextChips: document.querySelector("#aiContextChips"),
  aiAddAttachmentBtn: document.querySelector("#aiAddAttachmentBtn"),
  aiFileInput: document.querySelector("#aiFileInput"),
  aiAttachmentMenu: document.querySelector("#aiAttachmentMenu"),
  aiAddMapContextOption: document.querySelector("#aiAddMapContextOption"),
  aiAddFilesOption: document.querySelector("#aiAddFilesOption"),
  aiContextPicker: document.querySelector("#aiContextPicker"),
  aiVoiceBtn: document.querySelector("#aiVoiceBtn"),
  aiMentionDropdown: document.querySelector("#aiMentionDropdown"),
  map: document.querySelector("#map"),
  cesiumContainer: document.querySelector("#cesiumContainer"),
};

const state = {
  map: null,
  baseLayer: null,
  placingAsset: false,
  pendingEmitterData: null,
  draw: {
    mode: null,        // "circle" | "rectangle" | "polyline" | null
    points: [],        // accumulated latlngs for polyline/rectangle
    previewLayer: null,
    editingItemId: null,
  },
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
  cesiumPointElevationCache: new Map(),
  centerElevationRequestId: null,
  cesiumTerrainProviderKey: null,
  worker: new Worker("./simulation-worker.js?v=20260424-2", { type: "module" }),
  pendingInspection: null,
  pendingPlanningRequestId: null,
  editingAssetId: null,
  editingViewshedId: null,
  mapContentOrder: [],
  mapContentFolders: [],
  mapContentAssignments: new Map(),
  hiddenContentIds: new Set(),
  mcSelectMode: false,
  mcSelectedIds: new Set(),
  mcLastClickedId: null,
  undoStack: [],          // [{label, snapshots:[{contentId, restoreFn}]}]
  undoBannerTimerId: null,
  activeMapContentMenuId: null,
  renamingMapContentId: null,
  workspaceMenuOpen: false,
  imageryMenuOpen: false,
  terrainMenuOpen: false,
  weatherMenuOpen: false,
  aiMenuOpen: false,
  gpsMenuOpen: false,
  settingsMenuOpen: false,
  settings: {
    measurementUnits: "standard",
    theme: "dark",
    coordinateSystem: "mgrs",
    gridLinesEnabled: false,
    centerGridEnabled: false,
    gridColor: "#ffffff",
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
    statusMessage: "",
    statusIsError: false,
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
    sectionResizeActive: false,
    aiResizeActive: false,
    aiPanelWidth: 400,
    panelMode: "edit",
  },
  session: {
    token: window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY),
    activeProjectId: window.localStorage.getItem(ACTIVE_PROJECT_STORAGE_KEY),
    user: null,
    projects: [],
    autosaveTimerId: null,
    autosavePending: false,
  },
  ai: {
    activeConfigId: "",
    savedConfigs: [],
    configLabel: "",
    provider: "",
    apiKey: "",
    model: "",
    status: "offline",
    statusMessage: "Add a provider and API key to enable the AI planning assistant.",
    pendingImages: [],    // [{dataUrl, mediaType}]
    pendingFiles: [],     // [{id, name, mediaType, size, textExcerpt, contentAvailable}]
    contextItemIds: [],  // content IDs to include as extra context
    activeContextId: null,
    voiceRecording: false,
    panelOpen: false,
    messages: [],
    requestInFlight: false,
  },
};

async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers ?? {});
  headers.set("Content-Type", headers.get("Content-Type") ?? "application/json");
  if (state.session.token) {
    headers.set("Authorization", `Bearer ${state.session.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error ?? payload.message ?? `API request failed (${response.status}).`);
  }

  return payload;
}

function defaultAiStatusMessage() {
  return "Add a provider and API key to enable the AI planning assistant.";
}

function getAiProviderMeta(provider) {
  return AI_PROVIDER_CATALOG[provider] ?? null;
}

function getAiProviderModels(provider) {
  return getAiProviderMeta(provider)?.models ?? [];
}

function getDefaultAiModel(provider) {
  return getAiProviderMeta(provider)?.defaultModel ?? "";
}

function ensureAiModelForProvider(provider, model = "") {
  const models = getAiProviderModels(provider);
  if (!models.length) {
    return "";
  }
  if (models.some((entry) => entry.value === model)) {
    return model;
  }
  return getDefaultAiModel(provider);
}

function getAiModelLabel(provider, model) {
  return getAiProviderModels(provider).find((entry) => entry.value === model)?.label ?? model ?? "";
}

function getAiProviderLabel(provider) {
  return getAiProviderMeta(provider)?.shortLabel ?? "No Provider";
}

function maskAiApiKey(apiKey) {
  if (!apiKey) {
    return "No key";
  }
  if (apiKey.length <= 8) {
    return `${apiKey.slice(0, 2)}...${apiKey.slice(-2)}`;
  }
  return `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;
}

function generateAiConfigId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `ai-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function sanitizeAiSavedConfig(config) {
  if (!config || typeof config !== "object") {
    return null;
  }
  const provider = typeof config.provider === "string" ? config.provider : "";
  const apiKey = typeof config.apiKey === "string" ? config.apiKey.trim() : "";
  if (!getAiProviderMeta(provider) || !apiKey) {
    return null;
  }
  return {
    id: typeof config.id === "string" && config.id ? config.id : generateAiConfigId(),
    label: typeof config.label === "string" ? config.label.trim() : "",
    provider,
    apiKey,
    model: ensureAiModelForProvider(provider, typeof config.model === "string" ? config.model : ""),
  };
}

function sameAiSavedConfig(left, right) {
  if (!left || !right) {
    return false;
  }
  return left.label === right.label
    && left.provider === right.provider
    && left.apiKey === right.apiKey
    && left.model === right.model;
}

function mergeAiSavedConfigs(primaryConfigs = [], secondaryConfigs = []) {
  const merged = [];
  [...primaryConfigs, ...secondaryConfigs].forEach((config) => {
    const sanitized = sanitizeAiSavedConfig(config);
    if (!sanitized) {
      return;
    }
    const exists = merged.some((entry) => entry.id === sanitized.id || sameAiSavedConfig(entry, sanitized));
    if (!exists) {
      merged.push(sanitized);
    }
  });
  return merged;
}

function aiSavedConfigListsEqual(leftConfigs = [], rightConfigs = []) {
  if (leftConfigs.length !== rightConfigs.length) {
    return false;
  }
  return leftConfigs.every((config, index) => {
    const other = rightConfigs[index];
    return Boolean(other)
      && config.id === other.id
      && sameAiSavedConfig(config, other);
  });
}

function getAiSavedConfigDisplayLabel(config) {
  if (!config) {
    return "";
  }
  return config.label || `${getAiProviderLabel(config.provider)} | ${maskAiApiKey(config.apiKey)}`;
}

function getSavedAiConfig(configId = state.ai.activeConfigId) {
  return state.ai.savedConfigs.find((config) => config.id === configId) ?? null;
}

function setActiveAiDraft(provider, apiKey, model, configId = "", label = "") {
  state.ai.provider = provider;
  state.ai.apiKey = apiKey;
  state.ai.model = ensureAiModelForProvider(provider, model);
  state.ai.activeConfigId = configId;
  state.ai.configLabel = label;
}

function syncActiveAiConfigFromDraft() {
  // Draft edits should not mutate a saved key until the user explicitly saves.
}

function setAiStatusFromCurrentConfig() {
  if (state.ai.provider && state.ai.apiKey) {
    state.ai.status = "pending";
    state.ai.statusMessage = "Provider configured. Testing connection...";
    return;
  }
  state.ai.status = "offline";
  state.ai.statusMessage = defaultAiStatusMessage();
}

function renderAiSavedConfigOptions() {
  if (!dom.aiSavedConfigSelect) {
    return;
  }
  const options = state.ai.savedConfigs.length
    ? [
        '<option value="">Select saved key</option>',
        ...state.ai.savedConfigs.map((config) => {
          const modelLabel = getAiModelLabel(config.provider, config.model);
          return `<option value="${escapeHtml(config.id)}">${escapeHtml(`${getAiSavedConfigDisplayLabel(config)} | ${modelLabel}`)}</option>`;
        }),
      ]
    : ['<option value="">No saved keys</option>'];
  dom.aiSavedConfigSelect.innerHTML = options.join("");
  dom.aiSavedConfigSelect.value = state.ai.savedConfigs.some((config) => config.id === state.ai.activeConfigId)
    ? state.ai.activeConfigId
    : "";
}

function renderAiModelOptions() {
  if (!dom.aiChatModelSelect) {
    return;
  }
  const models = getAiProviderModels(state.ai.provider);
  if (!models.length) {
    dom.aiChatModelSelect.innerHTML = '<option value="">No model available</option>';
    dom.aiChatModelSelect.value = "";
    return;
  }
  dom.aiChatModelSelect.innerHTML = models
    .map((model) => `<option value="${escapeHtml(model.value)}">${escapeHtml(model.label)}</option>`)
    .join("");
  dom.aiChatModelSelect.value = ensureAiModelForProvider(state.ai.provider, state.ai.model);
}

async function syncAiProviderSettingsToServer() {
  if (!state.session.token) {
    return;
  }

  await apiFetch("/user/ai-configs", {
    method: "PUT",
    body: JSON.stringify({
      configs: state.ai.savedConfigs.map((config) => ({
        id: config.id,
        label: config.label,
        provider: config.provider,
        apiKey: config.apiKey,
        model: config.model,
      })),
    }),
  });
}

async function loadServerAiProviderSettings() {
  if (!state.session.token) {
    return;
  }

  const localConfigs = state.ai.savedConfigs.map(sanitizeAiSavedConfig).filter(Boolean);
  const payload = await apiFetch("/user/ai-configs");
  const serverConfigs = Array.isArray(payload.configs)
    ? payload.configs.map(sanitizeAiSavedConfig).filter(Boolean)
    : [];
  const mergedConfigs = mergeAiSavedConfigs(serverConfigs, localConfigs);

  state.ai.savedConfigs = mergedConfigs;
  if (state.ai.activeConfigId && !mergedConfigs.some((config) => config.id === state.ai.activeConfigId)) {
    state.ai.activeConfigId = "";
  }

  persistAiProviderSettings();
  syncAiUi();

  if (!aiSavedConfigListsEqual(serverConfigs, mergedConfigs)) {
    await syncAiProviderSettingsToServer();
  }
}

function persistSessionStorage() {
  if (state.session.token) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, state.session.token);
  } else {
    window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  }

  if (state.session.activeProjectId) {
    window.localStorage.setItem(ACTIVE_PROJECT_STORAGE_KEY, state.session.activeProjectId);
  } else {
    window.localStorage.removeItem(ACTIVE_PROJECT_STORAGE_KEY);
  }
}

function clearSessionState() {
  if (state.session.autosaveTimerId) {
    window.clearTimeout(state.session.autosaveTimerId);
  }
  state.session.token = null;
  state.session.user = null;
  state.session.projects = [];
  state.session.activeProjectId = null;
  state.session.autosaveTimerId = null;
  state.session.autosavePending = false;
  persistSessionStorage();
}

async function hydrateSession() {
  if (!state.session.token) {
    syncWorkspaceUi();
    return;
  }

  try {
    const payload = await apiFetch("/auth/me");
    state.session.user = payload.user;
    await loadProjectList();
    await loadServerAiProviderSettings();
  } catch (error) {
    clearSessionState();
    setStatus(`Session reset: ${error.message}`, true);
  }
  syncWorkspaceUi();
}

async function loadProjectList() {
  if (!state.session.token) {
    state.session.projects = [];
    syncWorkspaceUi();
    return;
  }
  const payload = await apiFetch("/projects");
  state.session.projects = payload.projects ?? [];
  syncWorkspaceUi();
}

function syncWorkspaceUi() {
  if (!dom.workspaceMenuBtn || !dom.workspaceMenu) {
    return;
  }

  const signedIn = Boolean(state.session.token && state.session.user);
  dom.workspaceAuthGuest.classList.toggle("hidden", signedIn);
  dom.workspaceAuthMember.classList.toggle("hidden", !signedIn);
  dom.workspaceSignOutBtn.classList.toggle("hidden", !signedIn);

  if (!signedIn) {
    dom.workspaceMenuValue.textContent = "Sign In";
    dom.workspaceMenuHeadline.textContent = "Account & Projects";
    dom.workspaceStatus.textContent = "Sign in to save projects to the server. Local browser save remains available until then.";
    return;
  }

  const userLabel = state.session.user.fullName || state.session.user.email;
  dom.workspaceUserLabel.textContent = userLabel;
  dom.workspaceMenuValue.textContent = userLabel;
  dom.workspaceMenuHeadline.textContent = state.session.activeProjectId ? "Server Project" : "Workspace";
  dom.workspaceProjectMode.textContent = state.session.activeProjectId ? "Server" : "Local";
  dom.workspaceProjectStatus.textContent = state.session.activeProjectId
    ? state.session.autosavePending
      ? "Autosave queued for the selected server project."
      : "Autosave is active for the selected server project."
    : "No server project selected. The app is still using browser-local storage.";

  dom.workspaceProjectSelect.innerHTML = "";
  const localOption = document.createElement("option");
  localOption.value = "";
  localOption.textContent = "Local Browser State";
  dom.workspaceProjectSelect.appendChild(localOption);
  state.session.projects.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.name;
    dom.workspaceProjectSelect.appendChild(option);
  });
  dom.workspaceProjectSelect.value = state.session.activeProjectId ?? "";
}

async function onWorkspaceLogin() {
  const email = dom.workspaceEmail.value.trim();
  const password = dom.workspacePassword.value;
  if (!email || !password) {
    setStatus("Enter email and password.", true);
    return;
  }

  const payload = await apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  state.session.token = payload.token;
  state.session.user = payload.user;
  persistSessionStorage();
  await loadProjectList();
  await loadServerAiProviderSettings();
  setStatus(`Signed in as ${payload.user.email}.`);
}

async function onWorkspaceRegister() {
  const fullName = dom.workspaceFullName.value.trim();
  const email = dom.workspaceEmail.value.trim();
  const password = dom.workspacePassword.value;
  if (!fullName || !email || !password) {
    setStatus("Enter full name, email, and password to create an account.", true);
    return;
  }

  const payload = await apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify({ fullName, email, password }),
  });
  state.session.token = payload.token;
  state.session.user = payload.user;
  persistSessionStorage();
  await loadProjectList();
  await loadServerAiProviderSettings();
  setStatus(`Account created for ${payload.user.email}.`);
}

function onWorkspaceSignOut() {
  clearSessionState();
  syncWorkspaceUi();
  setStatus("Signed out. Local browser save remains available.");
}

async function onWorkspaceProjectCreate() {
  if (!state.session.token) {
    setStatus("Sign in first to create a server project.", true);
    return;
  }

  const name = dom.workspaceProjectName.value.trim();
  if (!name) {
    setStatus("Enter a project name.", true);
    return;
  }

  const payload = await apiFetch("/projects", {
    method: "POST",
    body: JSON.stringify({ name, description: "", state: serializeCurrentMapState() }),
  });
  state.session.activeProjectId = payload.project.id;
  persistSessionStorage();
  await loadProjectList();
  setStatus(`Created project ${payload.project.name}. Reloading into server-backed project.`);
  window.location.reload();
}

async function onWorkspaceProjectSelectChanged() {
  state.session.activeProjectId = dom.workspaceProjectSelect.value || null;
  persistSessionStorage();
  setStatus(state.session.activeProjectId ? "Project selected. Reloading project state..." : "Returned to local browser state.");
  window.location.reload();
}

async function saveActiveProjectNow({ silent = false } = {}) {
  if (!state.session.token || !state.session.activeProjectId) {
    return false;
  }

  await apiFetch(`/projects/${state.session.activeProjectId}`, {
    method: "PUT",
    body: JSON.stringify({ state: serializeCurrentMapState() }),
  });
  state.session.autosavePending = false;
  syncWorkspaceUi();
  if (!silent) {
    setStatus("Project saved to server.");
  }
  return true;
}

function queueActiveProjectAutosave() {
  if (!state.session.token || !state.session.activeProjectId) {
    return;
  }
  state.session.autosavePending = true;
  syncWorkspaceUi();
  if (state.session.autosaveTimerId) {
    window.clearTimeout(state.session.autosaveTimerId);
  }
  state.session.autosaveTimerId = window.setTimeout(async () => {
    state.session.autosaveTimerId = null;
    try {
      await saveActiveProjectNow({ silent: true });
    } catch (error) {
      setStatus(`Autosave failed: ${error.message}`, true);
    }
  }, 900);
}

function onWorkspaceProjectReload() {
  if (!state.session.activeProjectId) {
    setStatus("Select a server project first.", true);
    return;
  }
  setStatus("Reloading active project.");
  window.location.reload();
}

async function onWorkspaceProjectSnapshot() {
  if (!state.session.activeProjectId) {
    setStatus("Select a server project first.", true);
    return;
  }
  const label = window.prompt("Snapshot label:", `Snapshot ${new Date().toLocaleString()}`)?.trim();
  if (!label) {
    return;
  }
  await apiFetch(`/projects/${state.session.activeProjectId}/snapshots`, {
    method: "POST",
    body: JSON.stringify({ label, state: serializeCurrentMapState() }),
  });
  setStatus(`Created snapshot ${label}.`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// EMITTER MODAL
// ═══════════════════════════════════════════════════════════════════════════════

const emitterModal = {
  // Cached DOM refs set once on first open
  backdrop: null,
  radioTypeSelect: null,
  programSelect: null,
  libSummary: null,
  tabs: null,
  panels: null,
  fields: {},
  linkBudgetEls: {},

  init() {
    this.backdrop      = document.querySelector("#emitterModal");
    this.radioTypeSelect = document.querySelector("#emitterRadioType");
    this.programSelect   = document.querySelector("#emitterProgramSelect");
    this.libSummary      = document.querySelector("#emitterLibSummary");
    this.tabs    = [...document.querySelectorAll(".emitter-tab")];
    this.panels  = [...document.querySelectorAll(".emitter-tab-panel")];

    // Map all input/select field IDs
    const ids = [
      "emName","emUnit","emForce","emIcon","emColor","emNotes",
      "emFreqMHz","emBandwidthKHz","emModulation","emWaveform","emDuplex","emChannelSpacingKHz",
      "emPowerW","emPowerDbm","emDutyCycle","emPapr","emSpectralEff","emEirpDbm",
      "emRxSensDbm","emNoiseFigDb","emReqSnrDb","emAcrDb","emBdrDb",
      "emAntennaType","emAntennaGainDbi","emRadPattern","emPolarization","emAntennaHeightM","emCableLossDb","emSystemLossDb",
      "emPropModel","emClutterType","emTerrainEnabled","emDiffractionEnabled",
      "emNvisEnabled","emIonoModel","emTimeDayEffects","emSolarIndex",
      "emIsManet","emRelayCapable","emMaxHops","emLatencyMs","emAdaptiveDataRate",
      "emSatcomEnabled","emSatType","emSatUplinkMHz","emSatDownlinkMHz","emSatGainDbi",
      "emGridLocation","emColocateAsset",
    ];
    ids.forEach((id) => { this.fields[id] = document.querySelector(`#${id}`); });

    const lbIds = ["lb_txPower","lb_antennaGain","lb_cableLoss","lb_eirp","lb_fspl10","lb_rxPower10","lb_rxSens","lb_margin10","lb_maxRange"];
    lbIds.forEach((id) => { this.linkBudgetEls[id] = document.querySelector(`#${id}`); });

    // Tab switching
    this.tabs.forEach((tab) => {
      tab.addEventListener("click", () => this.switchTab(tab.dataset.tab));
    });

    // Radio type → populate programs
    this.radioTypeSelect.addEventListener("change", () => this.onRadioTypeChange());

    // Program → load profile
    this.programSelect.addEventListener("change", () => this.onProgramChange());

    // Live link budget update on any param change
    ["emFreqMHz","emPowerW","emAntennaGainDbi","emCableLossDb","emSystemLossDb","emRxSensDbm"].forEach((id) => {
      this.fields[id]?.addEventListener("input", () => this.updateLinkBudget());
    });

    // Derived dBm display
    this.fields.emPowerW?.addEventListener("input", () => this.updateDerivedFields());

    // Auto-update marker color when force affiliation changes
    this.fields.emForce?.addEventListener("change", () => {
      if (this.fields.emColor) {
        this.fields.emColor.value = FORCE_COLORS[this.fields.emForce.value] ?? FORCE_COLORS.friendly;
      }
    });

    // Close buttons
    document.querySelector("#emitterModalCloseBtn")?.addEventListener("click", () => this.close());
    document.querySelector("#emitterCancelBtn")?.addEventListener("click", () => this.close());
    this.backdrop.addEventListener("click", (e) => { if (e.target === this.backdrop) this.close(); });

    // Place on map
    document.querySelector("#emitterPlaceBtn")?.addEventListener("click", () => this.placeOnMap());

    // Save custom profile
    document.querySelector("#emitterSaveCustomBtn")?.addEventListener("click", () => this.saveCustomProfile());

    // Open via add-emitter button in map contents header
    document.querySelector("#addEmitterBtn")?.addEventListener("click", () => this.open());
  },

  open(prefill = null) {
    this.backdrop.classList.remove("hidden");
    document.body.classList.add("emitter-modal-open");
    setAssetPlacementMode(false);
    this.switchTab("rf");
    const isEditing = prefill && prefill.lat !== undefined;
    this.populateColocateOptions(prefill?.id ?? null);
    if (isEditing) {
      this.resetToDefaults();
      this.applyAsset(prefill);
    } else if (prefill) {
      this.applyProfile(prefill);
    } else {
      this.resetToDefaults();
    }
    const placeBtn = document.querySelector("#emitterPlaceBtn");
    if (placeBtn) placeBtn.textContent = isEditing ? "Save Changes" : "Place on Map";
    this.updateDerivedFields();
    this.updateLinkBudget();
    this.fields.emName?.focus();
  },

  populateColocateOptions(excludeAssetId = null) {
    const select = this.fields.emColocateAsset;
    if (!select) {
      return;
    }
    const options = ['<option value="">Do not co-locate</option>'];
    state.assets
      .filter((asset) => asset.id !== excludeAssetId)
      .forEach((asset) => {
        const label = `${asset.name}${asset.unit ? ` | ${asset.unit}` : ""} | ${toMgrs(asset.lat, asset.lon)}`;
        options.push(`<option value="${escapeHtml(asset.id)}">${escapeHtml(label)}</option>`);
      });
    if (options.length === 1) {
      options.push('<option value="" disabled>No existing emitters on map</option>');
    }
    select.innerHTML = options.join("");
    select.value = "";
  },

  close() {
    this.backdrop.classList.add("hidden");
    document.body.classList.remove("emitter-modal-open");
    document.querySelector("#emitterValidation").textContent = "";
    const placeBtn = document.querySelector("#emitterPlaceBtn");
    if (placeBtn) placeBtn.textContent = "Place on Map";
    state.editingAssetId = null;
  },

  switchTab(name) {
    this.tabs.forEach((t) => t.classList.toggle("active", t.dataset.tab === name));
    this.panels.forEach((p) => p.classList.toggle("active", p.dataset.panel === name));
    if (name === "link") this.updateLinkBudget();
  },

  onRadioTypeChange() {
    const key = this.radioTypeSelect.value;
    const radio = RADIO_LIBRARY[key];
    const sel = this.programSelect;
    sel.innerHTML = "";
    if (!radio) {
      sel.disabled = true;
      sel.innerHTML = '<option value="">— Manual —</option>';
      this.libSummary.innerHTML = "<p>Configure all parameters manually.</p>";
      return;
    }
    sel.disabled = false;
    Object.entries(radio.programs).forEach(([pKey, prog]) => {
      const opt = document.createElement("option");
      opt.value = pKey;
      opt.textContent = prog.label;
      sel.appendChild(opt);
    });
    this.onProgramChange();
  },

  onProgramChange() {
    const radioKey = this.radioTypeSelect.value;
    const progKey  = this.programSelect.value;
    const radio    = RADIO_LIBRARY[radioKey];
    const prog     = radio?.programs[progKey];
    if (!prog) return;
    this.applyProfile(prog);
    this.libSummary.innerHTML = `
      <strong>${radio.label}</strong><br>
      <em>${prog.label}</em><br>
      <span>${prog.rf.frequencyMHz} MHz · ${prog.tx.powerW} W · ${prog.antenna.gainDbi} dBi · ${prog.rf.waveform}</span>
    `;
  },

  applyProfile(prog) {
    const f = this.fields;
    const set = (id, val) => { if (f[id] && val !== undefined && val !== null) f[id].value = val; };
    const setCheck = (id, val) => { if (f[id]) f[id].checked = Boolean(val); };

    // RF
    set("emFreqMHz",          prog.rf?.frequencyMHz);
    set("emBandwidthKHz",     prog.rf?.bandwidthKHz);
    set("emModulation",       prog.rf?.modulation);
    set("emWaveform",         prog.rf?.waveform);
    set("emDuplex",           prog.rf?.duplex);
    set("emChannelSpacingKHz",prog.rf?.channelSpacingKHz);
    // TX
    set("emPowerW",           prog.tx?.powerW);
    set("emDutyCycle",        prog.tx?.dutyCycle);
    set("emPapr",             prog.tx?.papr);
    set("emSpectralEff",      prog.tx?.spectralEfficiency);
    // RX
    set("emRxSensDbm",        prog.rx?.sensitivityDbm);
    set("emNoiseFigDb",       prog.rx?.noiseFigDb);
    set("emReqSnrDb",         prog.rx?.requiredSnrDb);
    set("emAcrDb",            prog.rx?.acrDb);
    set("emBdrDb",            prog.rx?.bdrDb);
    // Antenna
    set("emAntennaType",      prog.antenna?.type);
    set("emAntennaGainDbi",   prog.antenna?.gainDbi);
    set("emRadPattern",       prog.antenna?.pattern);
    set("emPolarization",     prog.antenna?.polarization);
    set("emAntennaHeightM",   prog.antenna?.heightM);
    set("emCableLossDb",      prog.antenna?.cableLossDb);
    set("emSystemLossDb",     prog.antenna?.systemLossDb);
    // Propagation
    set("emPropModel",        prog.prop?.model);
    set("emClutterType",      prog.prop?.clutter);
    setCheck("emTerrainEnabled",    prog.prop?.terrainEnabled);
    setCheck("emDiffractionEnabled",prog.prop?.diffractionEnabled);
    setCheck("emNvisEnabled",       prog.prop?.nvisEnabled);
    set("emIonoModel",        prog.prop?.ionoModel);
    setCheck("emTimeDayEffects",    prog.prop?.timeDayEffects);
    set("emSolarIndex",       prog.prop?.solarIndex);
    // Network
    setCheck("emIsManet",           prog.net?.isManet);
    setCheck("emRelayCapable",      prog.net?.relayCapable);
    set("emMaxHops",          prog.net?.maxHops);
    set("emLatencyMs",        prog.net?.latencyMs);
    setCheck("emAdaptiveDataRate",  prog.net?.adaptiveDataRate);
    setCheck("emSatcomEnabled",     prog.net?.satcomEnabled);
    set("emSatType",          prog.net?.satType);
    set("emSatUplinkMHz",     prog.net?.satUplinkMHz);
    set("emSatDownlinkMHz",   prog.net?.satDownlinkMHz);
    set("emSatGainDbi",       prog.net?.satGainDbi);

    this.updateDerivedFields();
    this.updateLinkBudget();
    this.validateInputs();
  },

  applyAsset(asset) {
    const f = this.fields;
    const set = (id, val) => { if (f[id] && val !== undefined && val !== null) f[id].value = val; };
    set("emName",          asset.name);
    set("emUnit",          asset.unit);
    set("emForce",         asset.force);
    set("emColor",         asset.color ?? FORCE_COLORS[asset.force] ?? FORCE_COLORS.friendly);
    set("emIcon",          asset.icon);
    set("emNotes",         asset.notes);
    set("emFreqMHz",       asset.frequencyMHz);
    set("emPowerW",        asset.powerW);
    set("emAntennaGainDbi",asset.antennaGainDbi);
    set("emAntennaHeightM",asset.antennaHeightM);
    set("emRxSensDbm",     asset.receiverSensitivityDbm);
    set("emSystemLossDb",  asset.systemLossDb);
    set("emGridLocation",  toMgrs(asset.lat, asset.lon));
    set("emColocateAsset", "");
    this.updateDerivedFields();
    this.updateLinkBudget();
    this.validateInputs();
  },

  resetToDefaults() {
    this.radioTypeSelect.value = "";
    this.programSelect.disabled = true;
    this.programSelect.innerHTML = '<option value="">Select a radio type first</option>';
    this.libSummary.innerHTML = "<p>Select a radio type and program to auto-fill parameters, or configure manually below.</p>";
    // Sensible manual defaults
    this.fields.emFreqMHz && (this.fields.emFreqMHz.value = "150");
    this.fields.emPowerW && (this.fields.emPowerW.value = "5");
    this.fields.emAntennaGainDbi && (this.fields.emAntennaGainDbi.value = "2.15");
    this.fields.emAntennaHeightM && (this.fields.emAntennaHeightM.value = "2");
    this.fields.emRxSensDbm && (this.fields.emRxSensDbm.value = "-107");
    this.fields.emCableLossDb && (this.fields.emCableLossDb.value = "0.5");
    this.fields.emSystemLossDb && (this.fields.emSystemLossDb.value = "3");
    this.fields.emName && (this.fields.emName.value = "");
    this.fields.emForce && (this.fields.emForce.value = "friendly");
    this.fields.emColor && (this.fields.emColor.value = FORCE_COLORS.friendly);
    this.fields.emGridLocation && (this.fields.emGridLocation.value = "");
    this.fields.emColocateAsset && (this.fields.emColocateAsset.value = "");
  },

  updateDerivedFields() {
    const pw = parseFloat(this.fields.emPowerW?.value);
    if (Number.isFinite(pw) && pw > 0) {
      const dbm = (10 * Math.log10(pw * 1000)).toFixed(1);
      if (this.fields.emPowerDbm) this.fields.emPowerDbm.value = `${dbm} dBm`;
    }
    this.updateLinkBudget();
  },

  updateLinkBudget() {
    const el = this.linkBudgetEls;
    const freqMHz  = parseFloat(this.fields.emFreqMHz?.value);
    const powerW   = parseFloat(this.fields.emPowerW?.value);
    const gainDbi  = parseFloat(this.fields.emAntennaGainDbi?.value);
    const cableLoss= parseFloat(this.fields.emCableLossDb?.value) || 0;
    const sysLoss  = parseFloat(this.fields.emSystemLossDb?.value) || 0;
    const rxSens   = parseFloat(this.fields.emRxSensDbm?.value);
    if (!Number.isFinite(freqMHz) || !Number.isFinite(powerW) || !Number.isFinite(gainDbi) || !Number.isFinite(rxSens)) return;
    const txDbm = 10 * Math.log10(powerW * 1000);
    const totalLoss = cableLoss + (sysLoss - cableLoss);
    const eirp = txDbm + gainDbi - totalLoss;
    const fspl = 20 * Math.log10(10000) + 20 * Math.log10(freqMHz * 1e6) - 147.55;
    const rxPwr = eirp - fspl + gainDbi;
    const margin = rxPwr - rxSens;
    const maxRangeM = Math.pow(10, (eirp + gainDbi - rxSens + 147.55 - 20 * Math.log10(freqMHz * 1e6)) / 20);
    const fmt = (v, unit) => `${v.toFixed(1)} ${unit}`;
    const fmtRange = (m) => m > 1000 ? `${(m / 1000).toFixed(1)} km` : `${Math.round(m)} m`;
    if (el.lb_txPower)   el.lb_txPower.textContent   = fmt(txDbm, "dBm");
    if (el.lb_antennaGain) el.lb_antennaGain.textContent = fmt(gainDbi, "dBi");
    if (el.lb_cableLoss) el.lb_cableLoss.textContent = fmt(totalLoss, "dB");
    if (el.lb_eirp)      el.lb_eirp.textContent      = fmt(eirp, "dBm");
    if (el.lb_fspl10)    el.lb_fspl10.textContent     = fmt(fspl, "dB");
    if (el.lb_rxPower10) el.lb_rxPower10.textContent  = fmt(rxPwr, "dBm");
    if (el.lb_rxSens)    el.lb_rxSens.textContent     = fmt(rxSens, "dBm");
    if (el.lb_margin10) {
      el.lb_margin10.textContent = fmt(margin, "dB");
      el.lb_margin10.style.color = margin >= 0 ? "var(--accent)" : "var(--enemy)";
    }
    if (el.lb_maxRange)  el.lb_maxRange.textContent   = fmtRange(maxRangeM);
    if (this.fields.emEirpDbm) this.fields.emEirpDbm.value = fmt(eirp, "dBm");
  },

  validateInputs() {
    const warnings = [];
    const f = this.fields;
    const freq  = parseFloat(f.emFreqMHz?.value);
    const power = parseFloat(f.emPowerW?.value);
    const gain  = parseFloat(f.emAntennaGainDbi?.value);
    const height= parseFloat(f.emAntennaHeightM?.value);
    const sens  = parseFloat(f.emRxSensDbm?.value);
    if (Number.isFinite(power)) {
      if (power > 100) warnings.push("Power >100 W is unusual for man-portable systems.");
      if (power < 0.01) warnings.push("Power <10 mW — signal will be extremely weak.");
    }
    if (Number.isFinite(gain) && gain > 15) warnings.push("Antenna gain >15 dBi is physically implausible for a portable whip/blade.");
    if (Number.isFinite(height)) {
      if (height < 0.5) warnings.push("Antenna height <0.5 m — may be body-shadowed.");
      if (height > 30 && f.emAntennaType?.value !== "tower") warnings.push("Antenna height >30 m — requires a tower or mast.");
    }
    if (Number.isFinite(sens) && sens > -80) warnings.push("Receiver sensitivity >−80 dBm is poor — check your value.");
    const gridInput = f.emGridLocation?.value?.trim();
    if (gridInput) {
      try {
        parseMgrsReferenceInput(gridInput);
      } catch (error) {
        warnings.push(error.message);
      }
    }
    const el = document.querySelector("#emitterValidation");
    if (el) el.textContent = warnings.join(" · ");
  },

  resolveLocation() {
    const gridInput = this.fields.emGridLocation?.value?.trim();
    if (gridInput) {
      const parsed = parseMgrsReferenceInput(gridInput);
      return {
        lat: parsed.lat,
        lng: parsed.lng,
        description: parsed.normalized,
      };
    }

    const colocateAssetId = this.fields.emColocateAsset?.value;
    if (colocateAssetId) {
      const asset = state.assets.find((entry) => entry.id === colocateAssetId);
      if (!asset) {
        throw new Error("The selected co-located emitter could not be found.");
      }
      return {
        lat: asset.lat,
        lng: asset.lon,
        description: `co-located with ${asset.name}`,
      };
    }

    return null;
  },

  readFields() {
    const f = this.fields;
    const v = (id) => f[id]?.value;
    const n = (id) => parseFloat(f[id]?.value);
    const b = (id) => f[id]?.checked ?? false;
    // type must be a valid asset category ("radio","jammer","relay","receiver")
    // emitterLabel is the human-readable equipment name stored separately
    const emitterLabel = this.radioTypeSelect.value
      ? (RADIO_LIBRARY[this.radioTypeSelect.value]?.label ?? "radio")
      : "radio";
    const iconVal = v("emIcon") || "radio";
    return {
      type: EMITTER_ICONS[iconVal] ? iconVal : "radio",
      emitterLabel,
      force: v("emForce") || "friendly",
      name: v("emName") || "Emitter",
      unit: v("emUnit") || "",
      icon: iconVal,
      color: v("emColor") || FORCE_COLORS["friendly"],
      notes: v("emNotes") || "",
      frequencyMHz: n("emFreqMHz") || 150,
      powerW: n("emPowerW") || 5,
      antennaHeightM: n("emAntennaHeightM") || 2,
      antennaGainDbi: n("emAntennaGainDbi") || 2.15,
      receiverSensitivityDbm: n("emRxSensDbm") || -107,
      systemLossDb: n("emSystemLossDb") || 3,
      // Extended fields stored on asset for future use
      ext: {
        bandwidthKHz: n("emBandwidthKHz"),
        modulation: v("emModulation"),
        waveform: v("emWaveform"),
        duplex: v("emDuplex"),
        dutyCycle: n("emDutyCycle"),
        noiseFigDb: n("emNoiseFigDb"),
        requiredSnrDb: n("emReqSnrDb"),
        antennaType: v("emAntennaType"),
        cableLossDb: n("emCableLossDb"),
        propModel: v("emPropModel"),
        clutterType: v("emClutterType"),
        isManet: b("emIsManet"),
        relayCapable: b("emRelayCapable"),
        satcomEnabled: b("emSatcomEnabled"),
        locationGrid: v("emGridLocation") || "",
        colocateAssetId: v("emColocateAsset") || "",
      },
    };
  },

  placeOnMap() {
    this.validateInputs();
    const data = this.readFields();
    if (!data.name.trim()) {
      document.querySelector("#emitterValidation").textContent = "Enter an emitter name before placing.";
      this.fields.emName?.focus();
      return;
    }

    let resolvedLocation = null;
    try {
      resolvedLocation = this.resolveLocation();
    } catch (error) {
      document.querySelector("#emitterValidation").textContent = error.message;
      this.switchTab("loc");
      this.fields.emGridLocation?.focus();
      return;
    }

    // If editing an existing asset, save edits directly
    if (state.editingAssetId) {
      const asset = state.assets.find((a) => a.id === state.editingAssetId);
      if (asset) {
        Object.assign(asset, data);
        if (resolvedLocation) {
          asset.lat = resolvedLocation.lat;
          asset.lon = resolvedLocation.lng;
          const marker = state.assetMarkers.get(asset.id);
          if (marker) {
            marker.setLatLng([asset.lat, asset.lon]);
          }
        }
        asset.groundElevationM = sampleTerrainElevation(asset.lat, asset.lon);
        updateAssetMarker(asset);
        renderAssets();
        renderMapContents();
        syncCesiumEntities();
        saveMapState();
        setStatus(resolvedLocation ? `Updated ${asset.name} at ${resolvedLocation.description}.` : `Updated ${asset.name}.`);
      }
      state.editingAssetId = null;
      refreshActionButtons();
      this.close();
      return;
    }

    if (resolvedLocation) {
      state.pendingEmitterData = data;
      setAssetPlacementMode(false);
      addAsset(resolvedLocation);
      this.close();
      setStatus(`Emitter placed at ${resolvedLocation.description}.`);
      return;
    }

    // New placement
    state.pendingEmitterData = data;
    this.close();
    setAssetPlacementMode(true);
    setStatus("Click on the map to place the emitter.");
  },

  saveCustomProfile() {
    const data = this.readFields();
    const profileName = prompt("Save profile as:", data.name || "Custom Profile");
    if (!profileName) return;
    const profile = {
      id: generateId(),
      profileName,
      type: data.type,
      force: data.force,
      name: data.name,
      unit: data.unit,
      frequencyMHz: data.frequencyMHz,
      powerW: data.powerW,
      antennaHeightM: data.antennaHeightM,
      antennaGainDbi: data.antennaGainDbi,
      receiverSensitivityDbm: data.receiverSensitivityDbm,
      systemLossDb: data.systemLossDb,
      icon: data.icon,
      color: data.color,
      notes: data.notes,
    };
    state.profiles.push(profile);
    persistProfiles();
    renderProfiles();
    setStatus(`Saved profile "${profileName}".`);
  },
};

function initEmitterModal() {
  emitterModal.init();
}

// ═══════════════════════════════════════════════════════════════════════════════

function updateRangeTrack(input) {
  const min = parseFloat(input.min) || 0;
  const max = parseFloat(input.max) || 100;
  const val = parseFloat(input.value) || 0;
  const pct = ((val - min) / (max - min)) * 100;
  input.style.setProperty("--range-pct", `${pct.toFixed(1)}%`);
}

function initRangeInputs() {
  document.querySelectorAll("input[type='range']").forEach((input) => {
    updateRangeTrack(input);
    input.addEventListener("input", () => updateRangeTrack(input));
  });
}

async function init() {
  initMap();
  initTopBarDropdowns();
  initRangeInputs();
  initEmitterModal();
  loadAiProviderSettings();
  await hydrateSession();
  loadCesiumIonToken();
  loadSettings();
  loadProfiles();
  applyBasemap(dom.basemapSelect.value);
  updateImageryMenuValue();
  wireEvents();
  applyPanelMode();
  await loadMapState();
  renderAssets();
  renderTerrains();
  renderViewsheds();
  renderPlanningResults();
  renderMapContents();
  refreshActionButtons();
  updateTerrainSummary();
  updateWeatherState();
  applySettings();
  syncGpsUi();
  updateMapOverlayMetrics();
  updateClock();
  syncAiUi();
  if (state.ai.provider && state.ai.apiKey && state.ai.status === "pending") {
    testAiProviderConnection({ openPanelOnSuccess: false });
  }
  window.setInterval(updateClock, 1000);
  setStatus("Ready.");
  // Deferred render — guarantees map contents tray shows saved items after DOM settles
  requestAnimationFrame(() => renderMapContents());

  state.map.on("click", onMapClick);
  state.map.on("dblclick", onMapDblClick);
  state.map.on("mousemove", onMapMouseMove);
  state.map.on("contextmenu", onMapContextMenu);
  state.map.on("moveend zoomend resize", updateMapOverlayMetrics);
  state.map.on("moveend zoomend", saveMapState);

  // Middle-mouse click on Leaflet map: switch to 3D with a tilted perspective
  dom.map.addEventListener("mousedown", async (e) => {
    if (e.button !== 1) return;
    e.preventDefault();
    if (state.view3dEnabled) return;
    state.view3dEnabled = true;
    dom.view3dToggleBtn.textContent = "2D View";
    dom.cesiumContainer.classList.remove("hidden");
    dom.cesiumCompassBtn.classList.remove("hidden");
    dom.map.style.visibility = "hidden";
    await initCesiumIfNeeded();
    const viewer = state.cesiumViewer;
    viewer.imageryLayers.removeAll();
    viewer.imageryLayers.addImageryProvider(buildImageryProvider());
    try { viewer.terrainProvider = await buildTerrainProvider(); } catch (_) {}
    const center = state.map.getCenter();
    const alt = zoomToAltitude(state.map.getZoom());
    viewer.camera.flyTo({
      destination: window.Cesium.Cartesian3.fromDegrees(center.lng, center.lat, alt),
      orientation: {
        heading: 0,
        pitch: window.Cesium.Math.toRadians(-45),
        roll: 0,
      },
      duration: 0,
    });
    syncCesiumEntities();
    updateCesiumCompass();
  });
  state.map.on(L.Draw.Event.CREATED, onPlanningRegionCreated);
  state.worker.addEventListener("message", onWorkerMessage);
  state.planning.markersLayer.addTo(state.map);
}

function setGpsStatusMessage(message, isError = false) {
  state.gps.statusMessage = message;
  state.gps.statusIsError = isError;
  syncGpsUi();
}

function syncGpsUi() {
  const secureContext = window.isSecureContext;
  const browserGpsAvailable = secureContext && Boolean(navigator.geolocation);
  const usbGpsAvailable = secureContext && ("serial" in navigator);

  if (dom.connectGeolocationBtn) {
    dom.connectGeolocationBtn.disabled = !browserGpsAvailable;
    dom.connectGeolocationBtn.title = browserGpsAvailable
      ? "Use the browser Geolocation API"
      : secureContext
        ? "Geolocation is not available in this browser"
        : "Browser GPS requires HTTPS or localhost";
  }

  if (dom.connectUsbGpsBtn) {
    dom.connectUsbGpsBtn.disabled = !usbGpsAvailable;
    dom.connectUsbGpsBtn.title = usbGpsAvailable
      ? "Select a GPS device over Web Serial"
      : secureContext
        ? "USB GPS requires a Chromium browser with Web Serial support"
        : "USB GPS requires HTTPS or localhost";
  }

  if (!dom.gpsHelpText) {
    return;
  }

  let helpText = state.gps.statusMessage;
  if (!helpText) {
    if (!secureContext) {
      helpText = "Browser GPS and USB GPS require a secure context. Open the app on HTTPS or localhost to use either option.";
    } else if (!navigator.geolocation && !("serial" in navigator)) {
      helpText = "This browser exposes neither Geolocation nor Web Serial. Use Chrome or Edge on HTTPS for GPS features.";
    } else if (!("serial" in navigator)) {
      helpText = "Browser GPS is available. USB GPS requires Chrome or Edge with Web Serial support.";
    } else {
      helpText = "Browser mode uses the Geolocation API. USB mode reads NMEA over Web Serial when supported. Direct gpsd access requires a local bridge service outside the browser sandbox.";
    }
  }

  dom.gpsHelpText.textContent = helpText;
  dom.gpsHelpText.style.color = state.gps.statusIsError ? "#ff9f9f" : "";
}

function getTopBarDropdownConfigs() {
  return [
    { button: dom.workspaceMenuBtn, menu: dom.workspaceMenu },
    { button: dom.imageryMenuBtn, menu: dom.imageryMenu },
    { button: dom.terrainMenuBtn, menu: dom.terrainMenu },
    { button: dom.weatherMenuBtn, menu: dom.weatherMenu },
    { button: dom.gpsMenuBtn, menu: dom.gpsMenu },
  ];
}

function initTopBarDropdowns() {
  if (!dom.topBarDropdownLayer) {
    return;
  }

  getTopBarDropdownConfigs().forEach(({ menu }) => {
    if (!menu) {
      return;
    }
    dom.topBarDropdownLayer.appendChild(menu);
  });

  window.addEventListener("resize", positionOpenTopBarDropdowns);
}

function positionTopBarDropdown(menu, button) {
  if (!menu || !button) {
    return;
  }

  const buttonRect = button.getBoundingClientRect();
  const computedWidth = parseFloat(getComputedStyle(menu).width);
  const menuWidth = Number.isFinite(computedWidth) ? computedWidth : menu.offsetWidth || buttonRect.width;
  const viewportPadding = 12;
  const left = Math.min(
    Math.max(viewportPadding, buttonRect.right - menuWidth),
    Math.max(viewportPadding, window.innerWidth - menuWidth - viewportPadding),
  );
  const top = buttonRect.bottom + 8;
  const maxHeight = Math.max(160, window.innerHeight - top - viewportPadding);

  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  menu.style.maxHeight = `${maxHeight}px`;
}

function positionOpenTopBarDropdowns() {
  getTopBarDropdownConfigs().forEach(({ menu, button }) => {
    if (!menu || menu.classList.contains("hidden")) {
      return;
    }
    positionTopBarDropdown(menu, button);
  });
}

function initMap() {
  state.map = L.map("map", {
    zoomControl: true,
  }).setView([34.744, -116.151], 10);
  state.viewshedRootLayer.addTo(state.map);
}

function wireEvents() {
  dom.collapsePanelBtn.addEventListener("click", togglePanelCollapse);
  dom.panelModeBtn.addEventListener("click", togglePanelMode);
  dom.mcSelectBtn.addEventListener("click", toggleMcSelectMode);
  dom.undoBannerBtn.addEventListener("click", performUndo);
  dom.undoBannerDismiss.addEventListener("click", dismissUndoBanner);
  dom.panelDivider.addEventListener("mousedown", beginPanelResize);
  dom.controlPanelSectionDivider.addEventListener("mousedown", beginControlPanelSectionResize);
  dom.aiPanelDivider.addEventListener("mousedown", beginAiPanelResize);
  window.addEventListener("mousemove", onPanelResize);
  window.addEventListener("mousemove", onControlPanelSectionResize);
  window.addEventListener("mousemove", onAiPanelResize);
  window.addEventListener("mouseup", endPanelResize);
  window.addEventListener("mouseup", endControlPanelSectionResize);
  window.addEventListener("mouseup", endAiPanelResize);
  dom.imageryMenuBtn.addEventListener("click", toggleImageryMenu);
  dom.imageryMenu.addEventListener("click", (event) => event.stopPropagation());
  dom.terrainMenuBtn.addEventListener("click", toggleTerrainMenu);
  dom.terrainMenu.addEventListener("click", (event) => event.stopPropagation());
  dom.weatherMenuBtn.addEventListener("click", toggleWeatherMenu);
  dom.weatherMenu.addEventListener("click", (event) => event.stopPropagation());
  dom.workspaceMenuBtn?.addEventListener("click", toggleWorkspaceMenu);
  dom.workspaceMenu?.addEventListener("click", (event) => event.stopPropagation());
  dom.aiChatToggleBtn.addEventListener("click", toggleAiPanelCollapse);
  dom.gpsMenuBtn.addEventListener("click", toggleGpsMenu);
  dom.gpsMenu.addEventListener("click", (event) => event.stopPropagation());
  dom.settingsMenuBtn.addEventListener("click", toggleSettingsMenu);
  dom.settingsMenu.addEventListener("click", (event) => {
    if (event.target === dom.settingsMenu) {
      closeSettingsMenu();
      return;
    }
    event.stopPropagation();
  });
  dom.settingsModalDialog?.addEventListener("click", (event) => event.stopPropagation());
  dom.settingsMenuCloseBtn?.addEventListener("click", closeSettingsMenu);
  dom.workspaceLoginBtn?.addEventListener("click", () => onWorkspaceLogin().catch((error) => setStatus(error.message, true)));
  dom.workspaceRegisterBtn?.addEventListener("click", () => onWorkspaceRegister().catch((error) => setStatus(error.message, true)));
  dom.workspaceSignOutBtn?.addEventListener("click", onWorkspaceSignOut);
  dom.workspaceProjectCreateBtn?.addEventListener("click", () => onWorkspaceProjectCreate().catch((error) => setStatus(error.message, true)));
  dom.workspaceProjectSelect?.addEventListener("change", () => onWorkspaceProjectSelectChanged().catch((error) => setStatus(error.message, true)));
  dom.workspaceProjectSaveBtn?.addEventListener("click", () => saveActiveProjectNow().catch((error) => setStatus(error.message, true)));
  dom.workspaceProjectReloadBtn?.addEventListener("click", onWorkspaceProjectReload);
  dom.workspaceProjectSnapshotBtn?.addEventListener("click", () => onWorkspaceProjectSnapshot().catch((error) => setStatus(error.message, true)));
  document.addEventListener("click", closeTopBarMenus);
  document.addEventListener("click", closeMapContentsMenu);
  document.addEventListener("click", closeRenamePopover);
  document.addEventListener("click", (e) => {
    if (isShapeVertexEditingActive()) {
      return;
    }
    if (!dom.shapeStylePanel.contains(e.target)) closeShapeStylePanel({ stopEditing: false });
  });
  dom.addMapFolderBtn.addEventListener("click", addMapContentFolder);

  const importBtn = document.querySelector("#importBtn");
  const importFileInput = document.querySelector("#importFileInput");
  if (importBtn && importFileInput) {
    importBtn.addEventListener("click", () => importFileInput.click());
    importFileInput.addEventListener("change", async () => {
      const files = [...importFileInput.files];
      importFileInput.value = "";
      try {
        for (const file of files) await importMapFile(file);
      } catch (err) {
        setStatus(err.message, true);
      }
    });
  }

  dom.drawShapeBtn.addEventListener("click", (e) => { e.stopPropagation(); toggleDrawDropdown(); });
  dom.drawCircleBtn.addEventListener("click", () => startDrawing("circle"));
  dom.drawRectangleBtn.addEventListener("click", () => startDrawing("rectangle"));
  dom.drawPolylineBtn.addEventListener("click", () => startDrawing("polyline"));
  document.addEventListener("click", closeDrawDropdown);
  dom.shapeStylePanel.addEventListener("click", (e) => e.stopPropagation());
  dom.shapeColorInput.addEventListener("input", onShapeStyleChanged);
  dom.shapeLineStyleSelect.addEventListener("input", onShapeStyleChanged);
  dom.shapeOpacityInput.addEventListener("input", onShapeStyleChanged);
  dom.shapeWeightInput.addEventListener("input", onShapeStyleChanged);
  dom.shapeStyleEditVerticesBtn.addEventListener("click", onShapeStyleEditVertices);
  dom.shapeStyleDoneBtn.addEventListener("click", () => closeShapeStylePanel());
  dom.mapContentsMenu.addEventListener("click", onMapContentsMenuAction);
  dom.mapContentsRename.addEventListener("click", (event) => event.stopPropagation());
  dom.mapContentsRenameSave.addEventListener("click", commitRenameMapContent);
  dom.mapContentsRenameCancel.addEventListener("click", closeRenamePopover);
  dom.mapContentsRenameInput.addEventListener("keydown", onRenamePopoverKeyDown);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (state.settingsMenuOpen) closeSettingsMenu();
      else if (state.draw.mode) cancelDrawing();
      else if (state.mcSelectMode) toggleMcSelectMode();
      else closeShapeStylePanel();
    }
    if (e.key === "z" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
      const tag = document.activeElement?.tagName;
      if (tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
        e.preventDefault();
        performUndo();
      }
    }
    if (e.key === "Delete" || e.key === "Backspace") {
      const tag = document.activeElement?.tagName;
      if (tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
        if (state.mcSelectMode && state.mcSelectedIds.size > 0) {
          e.preventDefault();
          deleteSelectedMcItems();
        }
      }
    }
  });
  dom.map.addEventListener("dragover", onMapFileDragOver);
  dom.map.addEventListener("dragleave", onMapFileDragLeave);
  dom.map.addEventListener("drop", onMapFileDrop);
  dom.measurementUnitsSelect.addEventListener("change", onSettingsChanged);
  dom.themeSelect.addEventListener("change", onSettingsChanged);
  dom.coordinateSystemSelect.addEventListener("change", onSettingsChanged);
  dom.gridlinesToggle.addEventListener("change", onSettingsChanged);
  dom.centerGridToggle.addEventListener("change", onSettingsChanged);
  dom.gridlinesColor.addEventListener("input", onSettingsChanged);
  dom.view3dToggleBtn.addEventListener("click", toggle3dView);
  dom.cesiumCompassBtn.addEventListener("click", resetCesiumNorthUp);
  dom.basemapSelect.addEventListener("change", onBasemapChange);
  dom.customTileUrl.addEventListener("change", onBasemapChange);
  dom.terrainSourceSelect.addEventListener("change", onTerrainSourceSettingsChanged);
  dom.imagerySourceSelect.addEventListener("change", syncCesiumScene);
  dom.customTerrainUrl.addEventListener("change", onTerrainSourceSettingsChanged);
  dom.cesiumIonToken.addEventListener("change", onCesiumIonTokenChanged);
  dom.aiProviderSelect.addEventListener("change", onAiProviderChanged);
  dom.aiSavedConfigSelect.addEventListener("change", onAiSavedConfigChanged);
  dom.aiSavedConfigLabelInput.addEventListener("change", onAiSavedConfigLabelChanged);
  dom.aiApiKeyInput.addEventListener("change", onAiProviderChanged);
  dom.saveAiProviderBtn.addEventListener("click", saveAiProvider);
  dom.deleteAiProviderBtn?.addEventListener("click", deleteAiProvider);
  dom.testAiConnectionBtn.addEventListener("click", testAiProviderConnection);
  dom.clearAiProviderBtn.addEventListener("click", clearAiProvider);
  dom.collapseAiPanelBtn.addEventListener("click", toggleAiPanelCollapse);
  dom.aiChatForm.addEventListener("submit", onAiChatSubmit);
  dom.aiChatModelSelect.addEventListener("change", onAiModelChanged);
  dom.aiClearChatBtn.addEventListener("click", clearAiChat);
  dom.aiChatInput.addEventListener("paste", onAiChatPaste);
  dom.aiChatInput.addEventListener("keydown", onAiChatKeyDown);
  dom.aiChatInput.addEventListener("input", onAiChatInput);
  dom.aiAddAttachmentBtn.addEventListener("click", (e) => { e.stopPropagation(); toggleAiAttachmentMenu(); });
  dom.aiFileInput.addEventListener("change", onAiFileInputChange);
  dom.aiAddMapContextOption.addEventListener("click", (e) => {
    e.stopPropagation();
    dom.aiAttachmentMenu.classList.add("hidden");
    toggleAiContextPicker(true);
  });
  dom.aiAddFilesOption.addEventListener("click", (e) => {
    e.stopPropagation();
    dom.aiAttachmentMenu.classList.add("hidden");
    dom.aiFileInput.click();
  });
  dom.aiContextPicker.addEventListener("click", (e) => e.stopPropagation());
  dom.aiVoiceBtn.addEventListener("click", toggleVoiceInput);
  dom.aiMentionDropdown.addEventListener("click", (e) => e.stopPropagation());
  document.addEventListener("click", () => {
    dom.aiAttachmentMenu.classList.add("hidden");
    dom.aiContextPicker.classList.add("hidden");
    dom.aiMentionDropdown.classList.add("hidden");
  });
  dom.dtedInput.addEventListener("change", onTerrainImport);
  dom.clearTerrainBtn.addEventListener("click", clearTerrain);
  dom.fetchWeatherBtn.addEventListener("click", fetchWeather);
  dom.saveProfileBtn.addEventListener("click", saveProfile);
  dom.deleteProfileBtn.addEventListener("click", deleteProfile);
  dom.applyProfileBtn.addEventListener("click", applySelectedProfile);
  dom.profileSelect.addEventListener("change", onProfileSelectionChange);
  dom.assetForce.addEventListener("change", () => {
    dom.assetColor.value = FORCE_COLORS[dom.assetForce.value];
  });
  dom.placeAssetBtn.addEventListener("click", () => {
    if (state.editingAssetId) {
      saveAssetEdits();
      return;
    }
    setAssetPlacementMode(true);
    setStatus("Click on the map to place the emitter.");
  });
  dom.exportMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const hidden = dom.exportDropdown.classList.toggle("hidden");
    if (!hidden) positionTopBarDropdown(dom.exportDropdown, dom.exportMenuBtn);
  });
  document.addEventListener("click", () => dom.exportDropdown.classList.add("hidden"));
  dom.exportGeoJsonBtn.addEventListener("click", () => { dom.exportDropdown.classList.add("hidden"); exportAssetsGeoJson(); });
  dom.exportKmlBtn.addEventListener("click", () => { dom.exportDropdown.classList.add("hidden"); exportAssetsKml(false); });
  dom.exportKmzBtn.addEventListener("click", () => { dom.exportDropdown.classList.add("hidden"); exportAssetsKml(true); });
  dom.exportZipBtn.addEventListener("click", () => { dom.exportDropdown.classList.add("hidden"); exportAssetsZip(); });
  dom.clearViewshedsBtn.addEventListener("click", clearViewsheds);
  dom.runSimulationBtn.addEventListener("click", runSimulation);
  dom.simulationModalCloseBtn?.addEventListener("click", closeSimulationModal);
  dom.simulationModal?.addEventListener("click", (event) => {
    if (event.target === dom.simulationModal) {
      closeSimulationModal();
    }
  });
  dom.radiusUnit?.addEventListener("change", () => {
    const previousUnit = dom.radiusUnit.dataset.previousUnit || getDefaultCoverageRadiusUnit();
    const previousMeters = convertRadiusUnitToMeters(Number(dom.radiusValue?.value || 0), previousUnit);
    syncCoverageRadiusInput(dom.radiusUnit.value, previousMeters);
    dom.radiusUnit.dataset.previousUnit = dom.radiusUnit.value;
  });
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
    state.settings.theme = ["dark", "light"].includes(parsed.theme)
      ? parsed.theme
      : state.settings.theme;
    state.settings.coordinateSystem = ["mgrs", "latlon", "dms"].includes(parsed.coordinateSystem)
      ? parsed.coordinateSystem
      : state.settings.coordinateSystem;
    state.settings.gridLinesEnabled = Boolean(parsed.gridLinesEnabled);
    state.settings.centerGridEnabled = Boolean(parsed.centerGridEnabled);
    state.settings.gridColor = typeof parsed.gridColor === "string" ? parsed.gridColor : state.settings.gridColor;
  } catch {
    window.localStorage.removeItem(SETTINGS_STORAGE_KEY);
  }
}

function persistSettings() {
  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(state.settings));
}

function serializeCurrentMapState() {
  const center = state.map.getCenter();
  const serializedImported = state.importedItems.map((item) => {
    let coordinates;
    if (item.geometryType === "Point") {
      const ll = item.layer.getLatLng();
      coordinates = [ll.lat, ll.lng];
    } else if (item.geometryType === "LineString") {
      coordinates = item.layer.getLatLngs().map((p) => [p.lat, p.lng]);
    } else {
      const rings = item.layer.getLatLngs();
      const outer = Array.isArray(rings[0]) ? rings[0] : rings;
      coordinates = outer.map((p) => [p.lat, p.lng]);
    }
    return {
      id: item.id,
      name: item.name,
      subtitle: item.subtitle,
      kind: item.kind,
      geometryType: item.geometryType,
      properties: item.properties,
      drawn: item.drawn ?? false,
      shapeStyle: item.shapeStyle ?? null,
      coordinates,
    };
  });

  return {
    mapView: { lat: center.lat, lng: center.lng, zoom: state.map.getZoom() },
    assets: state.assets,
    profiles: state.profiles,
    weather: state.weather,
    settings: state.settings,
    importedItems: serializedImported,
    mapContentFolders: state.mapContentFolders,
    mapContentOrder: state.mapContentOrder,
    mapContentAssignments: Array.from(state.mapContentAssignments.entries()),
    hiddenContentIds: [...state.hiddenContentIds],
    activeTerrainId: state.activeTerrainId,
  };
}

function saveMapState() {
  const payload = serializeCurrentMapState();
  try {
    window.localStorage.setItem(MAP_STATE_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage quota exceeded — fail silently
  }

  queueActiveProjectAutosave();
}

function applySavedMapState(saved) {
  if (!saved) return;

  // Restore map view
  if (saved.mapView) {
    state.map.setView([saved.mapView.lat, saved.mapView.lng], saved.mapView.zoom, { animate: false });
  }

  // Restore folders
  if (Array.isArray(saved.mapContentFolders)) {
    state.mapContentFolders = saved.mapContentFolders;
  }

  // Restore content order and assignments (will be extended as items are restored below)
  if (Array.isArray(saved.mapContentOrder)) {
    state.mapContentOrder = saved.mapContentOrder;
  }
  if (Array.isArray(saved.mapContentAssignments)) {
    state.mapContentAssignments = new Map(saved.mapContentAssignments);
  }
  if (Array.isArray(saved.hiddenContentIds)) {
    state.hiddenContentIds = new Set(saved.hiddenContentIds);
  }
  if (Array.isArray(saved.profiles)) {
    state.profiles = saved.profiles;
  }
  if (saved.weather) {
    state.weather = { ...state.weather, ...saved.weather };
  }
  if (saved.settings) {
    state.settings = { ...state.settings, ...saved.settings };
  }

  // Restore assets
  if (Array.isArray(saved.assets)) {
    saved.assets.forEach((asset) => {
      state.assets.push(asset);
      const marker = L.marker([asset.lat, asset.lon], {
        icon: createEmitterIcon(asset),
        pane: getMapContentPaneName(`asset:${asset.id}`),
      }).addTo(state.map);
      marker.bindPopup(renderAssetPopup(asset));
      state.assetMarkers.set(asset.id, marker);
    });
  }

  // Restore imported items
  if (Array.isArray(saved.importedItems)) {
    saved.importedItems.forEach((saved) => {
      const item = {
        id: saved.id,
        name: saved.name,
        subtitle: saved.subtitle,
        kind: saved.kind,
        geometryType: saved.geometryType,
        properties: saved.properties ?? {},
        drawn: saved.drawn ?? false,
        shapeStyle: saved.shapeStyle ?? null,
        layer: null,
      };
      const contentId = `imported:${item.id}`;
      const pane = getMapContentPaneName(contentId);
      if (saved.geometryType === "Point") {
        item.layer = L.marker(saved.coordinates, { pane, draggable: false });
      } else if (saved.shapeStyle) {
        const s = saved.shapeStyle;
        if (saved.geometryType === "Polygon") {
          item.layer = L.polygon(saved.coordinates, {
            pane,
            color: s.color,
            fillColor: s.color,
            fillOpacity: s.fillOpacity,
            weight: s.weight,
            dashArray: getLeafletDashArray(s.lineStyle),
          });
        } else {
          item.layer = L.polyline(saved.coordinates, {
            pane,
            color: s.color,
            weight: s.weight,
            dashArray: getLeafletDashArray(s.lineStyle),
          });
        }
      } else if (saved.geometryType === "LineString") {
        item.layer = L.polyline(saved.coordinates, { pane, color: "#f7b955", weight: 3 });
      } else {
        item.layer = L.polygon(saved.coordinates, { pane, color: "#34d399", weight: 2, fillOpacity: 0.12 });
      }
      item.layer.addTo(state.map);
      item.layer.bindPopup(renderImportedItemPopup(item));
      item.layer.on?.("click", () => focusMapContent(contentId));
      item.layer.on?.("dragend edit", () => {
        renderMapContents();
        saveMapState();
        syncShapeVertexEditUi(item);
      });
      state.importedItems.push(item);
    });
  }

  if (saved.activeTerrainId) {
    state.activeTerrainId = saved.activeTerrainId;
  }

  // Apply hidden visibility after all layers are added
  state.hiddenContentIds.forEach((contentId) => setContentLayerVisible(contentId, false));
}

async function loadMapState() {
  if (state.session.token && state.session.activeProjectId) {
    try {
      const payload = await apiFetch(`/projects/${state.session.activeProjectId}`);
      applySavedMapState(payload.project?.latest_state_json ?? null);
      return;
    } catch (error) {
      setStatus(`Server project load failed, falling back to browser state: ${error.message}`, true);
    }
  }

  const stored = window.localStorage.getItem(MAP_STATE_STORAGE_KEY);
  if (!stored) return;
  let saved;
  try {
    saved = JSON.parse(stored);
  } catch {
    window.localStorage.removeItem(MAP_STATE_STORAGE_KEY);
    return;
  }
  applySavedMapState(saved);
}

function toggleSettingsMenu(event) {
  event.stopPropagation();
  closeWorkspaceMenu();
  closeImageryMenu();
  closeTerrainMenu();
  closeWeatherMenu();
  closeAiMenu();
  closeGpsMenu();
  state.settingsMenuOpen = !state.settingsMenuOpen;
  dom.settingsMenu.classList.toggle("hidden", !state.settingsMenuOpen);
  document.body.classList.toggle("settings-modal-open", state.settingsMenuOpen);
  dom.settingsMenuBtn.setAttribute("aria-expanded", String(state.settingsMenuOpen));
}

function toggleWorkspaceMenu(event) {
  event.stopPropagation();
  closeImageryMenu();
  closeTerrainMenu();
  closeWeatherMenu();
  closeAiMenu();
  closeGpsMenu();
  closeSettingsMenu();
  state.workspaceMenuOpen = !state.workspaceMenuOpen;
  dom.workspaceMenu.classList.toggle("hidden", !state.workspaceMenuOpen);
  dom.workspaceMenuBtn.setAttribute("aria-expanded", String(state.workspaceMenuOpen));
  if (state.workspaceMenuOpen) {
    positionTopBarDropdown(dom.workspaceMenu, dom.workspaceMenuBtn);
  }
}

function toggleImageryMenu(event) {
  event.stopPropagation();
  closeWorkspaceMenu();
  closeSettingsMenu();
  closeTerrainMenu();
  closeWeatherMenu();
  closeAiMenu();
  closeGpsMenu();
  state.imageryMenuOpen = !state.imageryMenuOpen;
  dom.imageryMenu.classList.toggle("hidden", !state.imageryMenuOpen);
  dom.imageryMenuBtn.setAttribute("aria-expanded", String(state.imageryMenuOpen));
  if (state.imageryMenuOpen) {
    positionTopBarDropdown(dom.imageryMenu, dom.imageryMenuBtn);
  }
}

function toggleTerrainMenu(event) {
  event.stopPropagation();
  closeWorkspaceMenu();
  closeImageryMenu();
  closeWeatherMenu();
  closeAiMenu();
  closeGpsMenu();
  closeSettingsMenu();
  state.terrainMenuOpen = !state.terrainMenuOpen;
  dom.terrainMenu.classList.toggle("hidden", !state.terrainMenuOpen);
  dom.terrainMenuBtn.setAttribute("aria-expanded", String(state.terrainMenuOpen));
  if (state.terrainMenuOpen) {
    positionTopBarDropdown(dom.terrainMenu, dom.terrainMenuBtn);
  }
}

function toggleWeatherMenu(event) {
  event.stopPropagation();
  closeWorkspaceMenu();
  closeImageryMenu();
  closeTerrainMenu();
  closeAiMenu();
  closeGpsMenu();
  closeSettingsMenu();
  state.weatherMenuOpen = !state.weatherMenuOpen;
  dom.weatherMenu.classList.toggle("hidden", !state.weatherMenuOpen);
  dom.weatherMenuBtn.setAttribute("aria-expanded", String(state.weatherMenuOpen));
  if (state.weatherMenuOpen) {
    positionTopBarDropdown(dom.weatherMenu, dom.weatherMenuBtn);
  }
}

function toggleAiMenu() { /* AI menu removed — settings now in gear dropdown */ }

function toggleGpsMenu(event) {
  event.stopPropagation();
  closeWorkspaceMenu();
  closeImageryMenu();
  closeTerrainMenu();
  closeWeatherMenu();
  closeAiMenu();
  closeSettingsMenu();
  state.gpsMenuOpen = !state.gpsMenuOpen;
  dom.gpsMenu.classList.toggle("hidden", !state.gpsMenuOpen);
  dom.gpsMenuBtn.setAttribute("aria-expanded", String(state.gpsMenuOpen));
  if (state.gpsMenuOpen) {
    positionTopBarDropdown(dom.gpsMenu, dom.gpsMenuBtn);
  }
}

function closeSettingsMenu() {
  if (!state.settingsMenuOpen) {
    return;
  }
  state.settingsMenuOpen = false;
  dom.settingsMenu.classList.add("hidden");
  document.body.classList.remove("settings-modal-open");
  dom.settingsMenuBtn.setAttribute("aria-expanded", "false");
}

function closeWorkspaceMenu() {
  if (!state.workspaceMenuOpen) {
    return;
  }
  state.workspaceMenuOpen = false;
  dom.workspaceMenu.classList.add("hidden");
  dom.workspaceMenuBtn.setAttribute("aria-expanded", "false");
}

function closeImageryMenu() {
  if (!state.imageryMenuOpen) {
    return;
  }
  state.imageryMenuOpen = false;
  dom.imageryMenu.classList.add("hidden");
  dom.imageryMenuBtn.setAttribute("aria-expanded", "false");
}

function closeTerrainMenu() {
  if (!state.terrainMenuOpen) {
    return;
  }
  state.terrainMenuOpen = false;
  dom.terrainMenu.classList.add("hidden");
  dom.terrainMenuBtn.setAttribute("aria-expanded", "false");
}

function closeWeatherMenu() {
  if (!state.weatherMenuOpen) {
    return;
  }
  state.weatherMenuOpen = false;
  dom.weatherMenu.classList.add("hidden");
  dom.weatherMenuBtn.setAttribute("aria-expanded", "false");
}

function closeAiMenu() { /* no-op: AI menu removed */ }

function closeGpsMenu() {
  if (!state.gpsMenuOpen) {
    return;
  }
  state.gpsMenuOpen = false;
  dom.gpsMenu.classList.add("hidden");
  dom.gpsMenuBtn.setAttribute("aria-expanded", "false");
}

function closeTopBarMenus() {
  closeWorkspaceMenu();
  closeImageryMenu();
  closeTerrainMenu();
  closeWeatherMenu();
  closeAiMenu();
  closeGpsMenu();
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
  state.settings.theme = dom.themeSelect.value;
  state.settings.coordinateSystem = dom.coordinateSystemSelect.value;
  state.settings.gridLinesEnabled = dom.gridlinesToggle.checked;
  state.settings.centerGridEnabled = dom.centerGridToggle.checked;
  state.settings.gridColor = dom.gridlinesColor.value;
  persistSettings();
  applySettings();
}

function applySettings() {
  dom.measurementUnitsSelect.value = state.settings.measurementUnits;
  dom.themeSelect.value = state.settings.theme;
  dom.coordinateSystemSelect.value = state.settings.coordinateSystem;
  dom.gridlinesToggle.checked = state.settings.gridLinesEnabled;
  dom.centerGridToggle.checked = state.settings.centerGridEnabled;
  dom.gridlinesColor.value = state.settings.gridColor;
  dom.centerGridCrosshair.classList.toggle("hidden", !state.settings.centerGridEnabled);
  document.body.classList.toggle("theme-light", state.settings.theme === "light");
  dom.coordsLabel.textContent = coordinateSystemStatusLabel(state.settings.coordinateSystem);
  updateWeatherUnitLabels();
  syncWeatherInputsFromState();
  updateCoordinateDisplays();
  updateMapOverlayMetrics();
  updateGridLayer();
  renderViewsheds();
  renderPlanningResults();
  syncCesiumEntities();
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
  updateWeatherMenuValue();
}

function updateWeatherMenuValue() {
  dom.weatherMenuValue.textContent = state.weather.source === "open-meteo" ? "Live" : "Manual";
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
  if (centerElevationM !== null) {
    dom.centerElevationValue.textContent = formatElevation(centerElevationM);
    return;
  }

  if (!usesConfiguredCesiumTerrain()) {
    dom.centerElevationValue.textContent = "No terrain";
    return;
  }

  const requestId = generateId();
  state.centerElevationRequestId = requestId;
  dom.centerElevationValue.textContent = "Loading terrain...";
  sampleTerrainElevationAsync(center.lat, center.lng)
    .then((elevationM) => {
      if (state.centerElevationRequestId !== requestId) {
        return;
      }
      dom.centerElevationValue.textContent = elevationM === null
        ? "No terrain"
        : formatElevation(elevationM);
    })
    .catch(() => {
      if (state.centerElevationRequestId !== requestId) {
        return;
      }
      dom.centerElevationValue.textContent = "No terrain";
    });
}

function sampleTerrainElevation(lat, lon) {
  return sampleTerrainElevationForTerrain(lat, lon, getActiveTerrain());
}

async function sampleTerrainElevationAsync(lat, lon) {
  const localElevation = sampleTerrainElevation(lat, lon);
  if (localElevation !== null) {
    return localElevation;
  }

  if (!usesConfiguredCesiumTerrain()) {
    return null;
  }

  return await sampleCesiumPointElevation(lat, lon);
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

function usesConfiguredCesiumTerrain() {
  return dom.terrainSourceSelect.value === "cesium-world" || dom.terrainSourceSelect.value === "custom";
}

function buildCesiumTerrainProviderKey() {
  if (dom.terrainSourceSelect.value === "cesium-world") {
    return `world:${dom.cesiumIonToken.value.trim()}`;
  }
  if (dom.terrainSourceSelect.value === "custom") {
    return `custom:${dom.customTerrainUrl.value.trim()}`;
  }
  return "ellipsoid";
}

async function sampleCesiumPointElevation(lat, lon) {
  const cacheKey = `${buildCesiumTerrainProviderKey()}:${lat.toFixed(6)},${lon.toFixed(6)}`;
  const cached = state.cesiumPointElevationCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  const provider = await getConfiguredCesiumTerrainProvider();
  if (!provider) {
    state.cesiumPointElevationCache.set(cacheKey, null);
    return null;
  }

  const [sampled] = await window.Cesium.sampleTerrainMostDetailed(provider, [
    window.Cesium.Cartographic.fromDegrees(lon, lat),
  ]);
  const elevation = Number.isFinite(sampled?.height) ? sampled.height : null;
  state.cesiumPointElevationCache.set(cacheKey, elevation);
  return elevation;
}

async function refreshAssetGroundElevation(asset) {
  const groundElevationM = await sampleTerrainElevationAsync(asset.lat, asset.lon);
  asset.groundElevationM = groundElevationM;
  updateAssetMarker(asset);
  syncCesiumEntities();
  return groundElevationM;
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
    syncCesiumEntities();
    return;
  }

  const options = {
    coordinateSystem: state.settings.coordinateSystem,
    color: state.settings.gridColor,
  };

  if (!state.gridLayer) {
    state.gridLayer = new CoordinateGridLayer(options);
    state.gridLayer.addTo(state.map);
    syncCesiumEntities();
    return;
  }

  state.gridLayer.setOptions(options);
  syncCesiumEntities();
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
    if (dom.terrainSourceSelect.value === "ellipsoid") {
      dom.terrainSourceSelect.value = "cesium-world";
    }
  }
}

function onCesiumIonTokenChanged() {
  const token = dom.cesiumIonToken.value.trim();
  if (token) {
    window.localStorage.setItem(CESIUM_ION_TOKEN_STORAGE_KEY, token);
    if (dom.terrainSourceSelect.value === "ellipsoid") {
      dom.terrainSourceSelect.value = "cesium-world";
    }
  } else {
    window.localStorage.removeItem(CESIUM_ION_TOKEN_STORAGE_KEY);
    if (dom.terrainSourceSelect.value === "cesium-world") {
      dom.terrainSourceSelect.value = "ellipsoid";
    }
  }
  state.cesiumTerrainProvider = null;
  state.cesiumTerrainProviderKey = null;
  state.ionTerrainCache.clear();
  state.cesiumPointElevationCache.clear();
  syncCesiumScene();
  updateMapOverlayMetrics();
  updateTerrainMenuValue();
}

function onTerrainSourceSettingsChanged() {
  state.cesiumTerrainProvider = null;
  state.cesiumTerrainProviderKey = null;
  state.cesiumPointElevationCache.clear();
  syncCesiumScene();
  updateMapOverlayMetrics();
}

function togglePanelCollapse() {
  document.body.classList.toggle("panel-collapsed");
  dom.collapsePanelIcon.innerHTML = document.body.classList.contains("panel-collapsed") ? "&#9654;" : "&#9664;";
  state.map.invalidateSize();
  if (state.cesiumViewer) {
    state.cesiumViewer.resize();
  }
}

function toggleAiPanelCollapse() {
  state.ai.panelOpen = !state.ai.panelOpen;
  document.body.classList.toggle("ai-panel-open", state.ai.panelOpen);
  if (state.ai.panelOpen) {
    const nextWidth = Number.isFinite(Number(state.ui.aiPanelWidth)) && state.ui.aiPanelWidth > 0
      ? state.ui.aiPanelWidth
      : 400;
    document.documentElement.style.setProperty("--ai-panel-width", `${nextWidth}px`);
  } else {
    const currentWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--ai-panel-width"));
    if (Number.isFinite(currentWidth) && currentWidth > 0) {
      state.ui.aiPanelWidth = currentWidth;
    }
    document.documentElement.style.setProperty("--ai-panel-width", "0px");
  }
  dom.collapseAiPanelIcon.innerHTML = state.ai.panelOpen ? "&#9654;" : "&#9664;";
  syncAiChatToggleBtn();
  persistAiProviderSettings();
  state.map.invalidateSize();
  if (state.cesiumViewer) {
    state.cesiumViewer.resize();
  }
}

function syncAiChatToggleBtn() {
  if (!dom.aiChatToggleBtn) return;
  const open = state.ai.panelOpen;
  dom.aiChatToggleChevron.innerHTML = open ? "&#9664;" : "&#9654;";
  dom.aiChatToggleBtn.classList.toggle("ai-chat-toggle-active", open);
  const statusLabel =
    state.ai.status === "ready" ? "Online" :
    state.ai.status === "testing" ? "Testing" :
    state.ai.status === "pending" ? "Configured" :
    state.ai.status === "error" ? "Error" : "Offline";
  dom.aiChatToggleValue.textContent = statusLabel;
}

function beginPanelResize() {
  if (window.innerWidth <= 1024 || document.body.classList.contains("panel-collapsed")) {
    return;
  }
  document.body.classList.add("is-resizing");
  state.ui.resizeActive = true;
}

function beginAiPanelResize() {
  if (window.innerWidth <= 1024 || !document.body.classList.contains("ai-panel-open")) {
    return;
  }
  document.body.classList.add("is-resizing");
  state.ui.aiResizeActive = true;
}

function beginControlPanelSectionResize() {
  if (window.innerWidth <= 1024 || document.body.classList.contains("panel-collapsed")) {
    return;
  }
  document.body.classList.add("is-resizing");
  state.ui.sectionResizeActive = true;
}

function onPanelResize(event) {
  if (!state.ui.resizeActive) {
    return;
  }
  const nextWidth = clamp(event.clientX, 280, 620);
  document.documentElement.style.setProperty("--panel-width", `${nextWidth}px`);
  state.map.invalidateSize();
}

function onAiPanelResize(event) {
  if (!state.ui.aiResizeActive) {
    return;
  }
  const nextWidth = clamp(window.innerWidth - event.clientX, 300, 620);
  state.ui.aiPanelWidth = nextWidth;
  document.documentElement.style.setProperty("--ai-panel-width", `${nextWidth}px`);
  state.map.invalidateSize();
}

function onControlPanelSectionResize(event) {
  if (!state.ui.sectionResizeActive) {
    return;
  }
  const rect = dom.controlPanel.getBoundingClientRect();
  const offsetTop = event.clientY - rect.top - 14;
  const nextHeight = clamp(offsetTop, 160, rect.height - 260);
  document.documentElement.style.setProperty("--control-panel-top-height", `${nextHeight}px`);
}

function togglePanelMode() {
  state.ui.panelMode = state.ui.panelMode === "edit" ? "plan" : "edit";
  applyPanelMode();
}

function applyPanelMode() {
  const isPlan = state.ui.panelMode === "plan";
  dom.controlPanel.classList.toggle("panel-mode-edit", !isPlan);
  dom.panelModeBtn.setAttribute("aria-checked", String(isPlan));
}

function endPanelResize() {
  state.ui.resizeActive = false;
  document.body.classList.remove("is-resizing");
}

function endControlPanelSectionResize() {
  state.ui.sectionResizeActive = false;
  document.body.classList.remove("is-resizing");
}

function endAiPanelResize() {
  state.ui.aiResizeActive = false;
  document.body.classList.remove("is-resizing");
  persistAiProviderSettings();
}

function loadAiProviderSettings() {
  const stored = window.localStorage.getItem(AI_PROVIDER_STORAGE_KEY);
  if (!stored) {
    return;
  }
  try {
    const parsed = JSON.parse(stored);
    const savedConfigs = Array.isArray(parsed.configs)
      ? parsed.configs.map(sanitizeAiSavedConfig).filter(Boolean)
      : [];
    if (!savedConfigs.length && typeof parsed.provider === "string" && typeof parsed.apiKey === "string") {
      const migratedConfig = sanitizeAiSavedConfig({
        id: generateAiConfigId(),
        provider: parsed.provider,
        apiKey: parsed.apiKey,
        model: typeof parsed.model === "string" ? parsed.model : "",
      });
      if (migratedConfig) {
        savedConfigs.push(migratedConfig);
      }
    }
    state.ai.savedConfigs = savedConfigs;
    const activeConfigId = typeof parsed.activeConfigId === "string" ? parsed.activeConfigId : "";
    const activeConfig = savedConfigs.find((config) => config.id === activeConfigId) ?? savedConfigs[0] ?? null;
    if (activeConfig) {
      setActiveAiDraft(activeConfig.provider, activeConfig.apiKey, activeConfig.model, activeConfig.id, activeConfig.label);
    } else {
      setActiveAiDraft(
        typeof parsed.provider === "string" ? parsed.provider : "",
        typeof parsed.apiKey === "string" ? parsed.apiKey.trim() : "",
        typeof parsed.model === "string" ? parsed.model : "",
        "",
        typeof parsed.configLabel === "string" ? parsed.configLabel.trim() : "",
      );
    }
    if (state.ai.provider && state.ai.apiKey) {
      state.ai.status = "pending";
      state.ai.statusMessage = "Stored provider found. Revalidating access...";
    }
    // Restore panel open state and width
    if (parsed.panelOpen && state.ai.provider && state.ai.apiKey) {
      state.ai.panelOpen = true;
      document.body.classList.add("ai-panel-open");
      const width = typeof parsed.aiPanelWidth === "number" && parsed.aiPanelWidth > 0
        ? parsed.aiPanelWidth
        : 400;
      state.ui.aiPanelWidth = width;
      document.documentElement.style.setProperty("--ai-panel-width", `${width}px`);
      document.documentElement.style.setProperty("--ai-divider-width", "7px");
    }
  } catch {
    window.localStorage.removeItem(AI_PROVIDER_STORAGE_KEY);
  }
}

function persistAiProviderSettings() {
  window.localStorage.setItem(AI_PROVIDER_STORAGE_KEY, JSON.stringify({
    configs: state.ai.savedConfigs,
    activeConfigId: state.ai.activeConfigId,
    configLabel: state.ai.configLabel,
    provider: state.ai.provider,
    apiKey: state.ai.apiKey,
    model: state.ai.model,
    panelOpen: state.ai.panelOpen,
    aiPanelWidth: state.ui.aiPanelWidth,
  }));
}

async function onAiProviderChanged() {
  state.ai.provider = dom.aiProviderSelect.value;
  state.ai.apiKey = dom.aiApiKeyInput.value.trim();
  state.ai.model = ensureAiModelForProvider(state.ai.provider, state.ai.model);
  setAiStatusFromCurrentConfig();
  persistAiProviderSettings();
  syncAiUi();
  if (state.ai.provider && state.ai.apiKey) {
    await testAiProviderConnection();
  }
}

async function onAiSavedConfigChanged() {
  const selectedId = dom.aiSavedConfigSelect.value;
  state.ai.activeConfigId = selectedId;
  if (selectedId) {
    const savedConfig = getSavedAiConfig(selectedId);
    if (savedConfig) {
      setActiveAiDraft(savedConfig.provider, savedConfig.apiKey, savedConfig.model, savedConfig.id, savedConfig.label);
      setAiStatusFromCurrentConfig();
      persistAiProviderSettings();
      syncAiUi();
      await testAiProviderConnection();
      return;
    }
  }
  state.ai.activeConfigId = "";
  persistAiProviderSettings();
  syncAiUi();
}

function onAiSavedConfigLabelChanged() {
  state.ai.configLabel = dom.aiSavedConfigLabelInput.value.trim();
  syncActiveAiConfigFromDraft();
  persistAiProviderSettings();
  syncAiUi();
}

function saveAiProvider() {
  if (!state.ai.provider || !state.ai.apiKey) {
    state.ai.status = "offline";
    state.ai.statusMessage = "Select a provider and enter an API key before saving.";
    syncAiUi();
    return;
  }

  const draftConfig = {
    label: state.ai.configLabel.trim(),
    provider: state.ai.provider,
    apiKey: state.ai.apiKey,
    model: ensureAiModelForProvider(state.ai.provider, state.ai.model),
  };
  const exactMatch = state.ai.savedConfigs.find((config) => (
    config.label === draftConfig.label
    && config.provider === draftConfig.provider
    && config.apiKey === draftConfig.apiKey
    && config.model === draftConfig.model
  ));

  if (exactMatch) {
    state.ai.activeConfigId = exactMatch.id;
    state.ai.configLabel = exactMatch.label;
    state.ai.model = exactMatch.model;
    if (state.ai.status !== "ready") {
      state.ai.statusMessage = `Saved keys: ${state.ai.savedConfigs.length}. This key is already saved.`;
    }
  } else {
    const nextConfig = {
      id: generateAiConfigId(),
      ...draftConfig,
    };
    state.ai.savedConfigs.push(nextConfig);
    state.ai.activeConfigId = nextConfig.id;
    state.ai.configLabel = nextConfig.label;
    state.ai.model = nextConfig.model;
    if (state.ai.status !== "ready") {
      state.ai.statusMessage = `Saved ${state.ai.savedConfigs.length} AI key${state.ai.savedConfigs.length === 1 ? "" : "s"}.`;
    }
  }
  persistAiProviderSettings();
  syncAiProviderSettingsToServer().catch((error) => setStatus(`AI key sync failed: ${error.message}`, true));
  syncAiUi();
}

function deleteAiProvider() {
  if (!state.ai.activeConfigId) {
    return;
  }

  const deletedConfig = getSavedAiConfig(state.ai.activeConfigId);
  state.ai.savedConfigs = state.ai.savedConfigs.filter((config) => config.id !== state.ai.activeConfigId);
  state.ai.activeConfigId = "";
  state.ai.configLabel = "";
  state.ai.provider = "";
  state.ai.apiKey = "";
  state.ai.model = "";
  state.ai.status = "offline";
  state.ai.statusMessage = deletedConfig
    ? `Deleted ${getAiSavedConfigDisplayLabel(deletedConfig)}.`
    : defaultAiStatusMessage();
  persistAiProviderSettings();
  syncAiProviderSettingsToServer().catch((error) => setStatus(`AI key sync failed: ${error.message}`, true));
  syncAiUi();
}

function onAiModelChanged() {
  state.ai.model = ensureAiModelForProvider(state.ai.provider, dom.aiChatModelSelect.value);
  syncActiveAiConfigFromDraft();
  persistAiProviderSettings();
  syncAiUi();
}

function clearAiProvider() {
  state.ai.activeConfigId = "";
  state.ai.configLabel = "";
  state.ai.provider = "";
  state.ai.apiKey = "";
  state.ai.model = "";
  state.ai.status = "offline";
  state.ai.statusMessage = defaultAiStatusMessage();
  persistAiProviderSettings();
  syncAiUi();
}

function renderAiEmptyState() {
  if (!dom.aiChatMessages || state.ai.messages.length > 0) {
    return;
  }

  if (state.ai.status === "ready") {
    dom.aiChatMessages.innerHTML = "";
    return;
  }

  dom.aiChatMessages.innerHTML = `
    <article class="ai-chat-message ai-chat-message-system">
      <strong>Assistant</strong>
      <p>Add a working AI provider in the top bar to enable chat-assisted planning.</p>
    </article>
  `;
}

function syncAiUi() {
  if (!dom.aiProviderSelect || !dom.aiApiKeyInput) {
    return;
  }

  renderAiSavedConfigOptions();
  renderAiModelOptions();
  dom.aiProviderSelect.value = state.ai.provider;
  if (dom.aiSavedConfigLabelInput) {
    dom.aiSavedConfigLabelInput.value = state.ai.configLabel;
  }
  dom.aiApiKeyInput.value = state.ai.apiKey;
  if (dom.aiProviderSummary) {
    const savedCount = state.ai.savedConfigs.length;
    const savedSummary = savedCount ? ` Saved keys: ${savedCount}.` : "";
    dom.aiProviderSummary.textContent = `${state.ai.statusMessage}${savedSummary}`;
  }

  if (dom.aiApiKeyLabelText) {
    const providerMeta = getAiProviderMeta(state.ai.provider);
    dom.aiApiKeyLabelText.textContent = providerMeta?.keyLabel ?? "API Key";
    dom.aiApiKeyInput.placeholder = providerMeta?.keyPlaceholder ?? "Paste API key";
  }

  const providerLabel = state.ai.provider ? getAiProviderLabel(state.ai.provider) : null;
  if (dom.aiMenuValue) {
    dom.aiMenuValue.textContent = providerLabel
      ? state.ai.status === "ready"
        ? "Ready"
        : state.ai.status === "testing"
          ? "Testing"
          : state.ai.status === "pending"
            ? "Configured"
            : state.ai.status === "error"
              ? "Error"
              : "Offline"
      : "No Provider";
  }
  if (dom.aiPanelStatus) {
    dom.aiPanelStatus.textContent = state.ai.status === "ready"
      ? "Connected"
      : "Offline";
  }
  renderAiEmptyState();
  const hasConfiguredProvider = Boolean(state.ai.provider && state.ai.apiKey);
  const controlsEnabled = hasConfiguredProvider && state.ai.status !== "testing";
  const actionButtonsEnabled = controlsEnabled && !state.ai.requestInFlight;
  const sendEnabled = actionButtonsEnabled;
  if (dom.aiChatModelSelect) {
    dom.aiChatModelSelect.disabled = !state.ai.provider || state.ai.status === "testing";
  }
  if (dom.saveAiProviderBtn) {
    dom.saveAiProviderBtn.disabled = !state.ai.provider || !state.ai.apiKey;
  }
  if (dom.deleteAiProviderBtn) {
    dom.deleteAiProviderBtn.disabled = !state.ai.activeConfigId;
  }
  if (dom.aiChatInput) {
    dom.aiChatInput.disabled = !controlsEnabled;
  }
  if (dom.aiSendBtn) {
    dom.aiSendBtn.disabled = !sendEnabled;
  }
  if (dom.aiAddAttachmentBtn) {
    dom.aiAddAttachmentBtn.disabled = !actionButtonsEnabled;
  }
  if (dom.aiVoiceBtn) {
    dom.aiVoiceBtn.disabled = !actionButtonsEnabled || !("webkitSpeechRecognition" in window || "SpeechRecognition" in window);
  }
  if (dom.testAiConnectionBtn) {
    dom.testAiConnectionBtn.disabled = !state.ai.provider || !state.ai.apiKey || state.ai.status === "testing";
  }
  if (dom.collapseAiPanelIcon) {
    dom.collapseAiPanelIcon.innerHTML = state.ai.panelOpen ? "&#9654;" : "&#9664;";
  }
  syncAiChatToggleBtn();
}

function openAiPanel() {
  if (!state.ai.panelOpen) {
    toggleAiPanelCollapse();
  }
}

async function onAiChatSubmit(event) {
  event.preventDefault();
  const prompt = dom.aiChatInput.value.trim();
  if (!prompt && state.ai.pendingImages.length === 0 && state.ai.pendingFiles.length === 0) return;
  if (state.ai.requestInFlight) return;
  if (state.ai.status !== "ready") {
    if (!state.ai.provider || !state.ai.apiKey) {
      return;
    }
    await testAiProviderConnection({ openPanelOnSuccess: false });
    if (state.ai.status !== "ready") {
      return;
    }
  }

  const images = [...state.ai.pendingImages];
  const files = [...state.ai.pendingFiles];
  const contextIds = getAiContextIds(state.ai.contextItemIds);

  // Render user message in chat
  appendAiMessage("user", prompt, images);

  // Clear inputs
  dom.aiChatInput.value = "";
  clearAiAttachments();

  state.ai.requestInFlight = true;
  state.ai.statusMessage = "AI assistant is processing your request.";
  syncAiUi();
  const assistantMessageController = createAiMessageController("assistant", "Thinking");
  const stopThinkingIndicator = startAiThinkingIndicator(assistantMessageController);

  try {
    const response = await callAiPlanningAssistant(prompt, images, files, contextIds, {
      onStatus: (statusText) => assistantMessageController.setStatus(statusText),
    });
    const executionSummary = await executeAiActions(response.actions ?? []);
    const reply = executionSummary.length
      ? `${response.assistantMessage}\n\nExecuted actions:\n- ${executionSummary.join("\n- ")}`
      : response.assistantMessage;
    stopThinkingIndicator();
    assistantMessageController.setStatus(executionSummary.length ? "Applied changes" : "Response ready");
    await streamAiMessageText(assistantMessageController, reply);
    state.ai.statusMessage = "AI assistant ready.";
  } catch (error) {
    stopThinkingIndicator();
    assistantMessageController.setStatus("Request failed");
    assistantMessageController.setText(`Request failed: ${error.message}`);
    state.ai.statusMessage = error.message;
  } finally {
    state.ai.requestInFlight = false;
  }
  syncAiUi();
}

function clearAiChat() {
  state.ai.messages = [];
  clearAiAttachments();
  renderAiEmptyState();
}

function renderMarkdown(text) {
  if (!text) return "";

  // Escape HTML first (work on raw text)
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // Process line by line for block elements, then inline
  const lines = text.split("\n");
  const out = [];
  let inList = false;

  const flushList = () => { if (inList) { out.push("</ul>"); inList = false; } };

  const inlineFormat = (s) => {
    return esc(s)
      // Bold **text** or __text__
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.+?)__/g, "<strong>$1</strong>")
      // Italic *text* or _text_ (single, not double)
      .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
      .replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, "<em>$1</em>")
      // Inline code `code`
      .replace(/`([^`]+)`/g, "<code>$1</code>");
  };

  lines.forEach((line) => {
    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      flushList();
      out.push("<hr>");
      return;
    }
    // Heading ## or ###
    const h3 = line.match(/^###\s+(.+)/);
    const h2 = line.match(/^##\s+(.+)/);
    const h1 = line.match(/^#\s+(.+)/);
    if (h3) { flushList(); out.push(`<h4>${inlineFormat(h3[1])}</h4>`); return; }
    if (h2) { flushList(); out.push(`<h4>${inlineFormat(h2[1])}</h4>`); return; }
    if (h1) { flushList(); out.push(`<h4>${inlineFormat(h1[1])}</h4>`); return; }
    // Bullet list - or *
    const bullet = line.match(/^[\-\*]\s+(.+)/);
    if (bullet) {
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`<li>${inlineFormat(bullet[1])}</li>`);
      return;
    }
    // Numbered list
    const numbered = line.match(/^\d+\.\s+(.+)/);
    if (numbered) {
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`<li>${inlineFormat(numbered[1])}</li>`);
      return;
    }
    flushList();
    // Blank line → paragraph break
    if (line.trim() === "") {
      out.push("<br>");
      return;
    }
    out.push(`<span>${inlineFormat(line)}</span><br>`);
  });

  flushList();
  return out.join("");
}

function createAiMessageController(role, text = "", images = []) {
  state.ai.messages.push({ role, text });
  const article = document.createElement("article");
  article.className = `ai-chat-message ${role === "user" ? "ai-chat-message-user" : role === "assistant" ? "ai-chat-message-assistant" : "ai-chat-message-system"}`;

  const header = document.createElement("div");
  header.className = "ai-chat-message-header";

  const title = document.createElement("strong");
  title.textContent = role === "user" ? "You" : "Assistant";
  header.appendChild(title);

  const status = document.createElement("span");
  status.className = "ai-chat-message-status";
  header.appendChild(status);

  article.appendChild(header);

  if (images.length) {
    const imgRow = document.createElement("div");
    imgRow.style.cssText = "display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;";
    images.forEach(({ dataUrl }) => {
      const img = document.createElement("img");
      img.src = dataUrl;
      img.className = "ai-chat-message-image";
      imgRow.appendChild(img);
    });
    article.appendChild(imgRow);
  }

  const body = document.createElement("div");
  body.className = "ai-chat-message-body";
  body.innerHTML = renderMarkdown(text);
  article.appendChild(body);

  dom.aiChatMessages.append(article);
  dom.aiChatMessages.scrollTop = dom.aiChatMessages.scrollHeight;

  return {
    article,
    body,
    status,
    setText(nextText) {
      body.innerHTML = renderMarkdown(nextText);
      dom.aiChatMessages.scrollTop = dom.aiChatMessages.scrollHeight;
    },
    setStatus(nextStatus) {
      status.textContent = nextStatus ?? "";
      article.classList.toggle("is-streaming", Boolean(nextStatus && nextStatus !== "Response ready" && nextStatus !== "Applied changes" && nextStatus !== "Request failed"));
      dom.aiChatMessages.scrollTop = dom.aiChatMessages.scrollHeight;
    },
  };
}

function startAiThinkingIndicator(controller) {
  let frame = 0;
  const frames = ["Thinking", "Thinking.", "Thinking..", "Thinking..."];
  controller.setStatus(frames[0]);
  const intervalId = window.setInterval(() => {
    frame = (frame + 1) % frames.length;
    controller.setStatus(frames[frame]);
  }, 300);
  return () => {
    window.clearInterval(intervalId);
  };
}

async function streamAiMessageText(controller, text) {
  controller.setText("");
  const chunks = splitTextIntoStreamChunks(text);
  let rendered = "";
  for (let index = 0; index < chunks.length; index += 1) {
    rendered += chunks[index];
    controller.setText(rendered);
    if (index < chunks.length - 1) {
      await wait(18);
    }
  }
}

function splitTextIntoStreamChunks(text) {
  const chunks = [];
  let cursor = 0;
  while (cursor < text.length) {
    const remaining = text.length - cursor;
    const chunkSize = Math.min(remaining, text[cursor] === "\n" ? 1 : remaining > 240 ? 10 : remaining > 120 ? 7 : 4);
    chunks.push(text.slice(cursor, cursor + chunkSize));
    cursor += chunkSize;
  }
  return chunks;
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

// ── Enter-to-send & @mention ──────────────────────────────────────────────────

function onAiChatKeyDown(event) {
  // Navigate mention dropdown with arrow keys / Escape
  if (!dom.aiMentionDropdown.classList.contains("hidden")) {
    const items = [...dom.aiMentionDropdown.querySelectorAll(".ai-mention-item")];
    const active = dom.aiMentionDropdown.querySelector(".ai-mention-item.active");
    const idx = items.indexOf(active);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      items[idx === -1 ? 0 : Math.min(idx + 1, items.length - 1)]?.classList.add("active");
      if (idx !== -1) items[idx].classList.remove("active");
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      items[idx <= 0 ? 0 : idx - 1]?.classList.add("active");
      if (idx > 0) items[idx].classList.remove("active");
      return;
    }
    if (event.key === "Tab" || event.key === "Enter") {
      const pick = active ?? items[0];
      if (pick) {
        event.preventDefault();
        pick.click();
        return;
      }
    }
    if (event.key === "Escape") {
      dom.aiMentionDropdown.classList.add("hidden");
      return;
    }
  }

  // Enter = submit; Shift+Enter = newline
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    dom.aiChatForm.requestSubmit();
  }
}

function onAiChatInput() {
  const val = dom.aiChatInput.value;
  const pos = dom.aiChatInput.selectionStart;
  // Find the most recent @ before cursor with no space after it
  const textBefore = val.slice(0, pos);
  const match = textBefore.match(/@([^@\n]*)$/);
  if (!match) {
    dom.aiMentionDropdown.classList.add("hidden");
    return;
  }
  const query = match[1].toLowerCase();
  const entries = getMapContentEntries().filter((e) => !e.id.startsWith("folder:"));
  const filtered = query.length === 0
    ? entries
    : entries.filter((e) => e.name.toLowerCase().includes(query));

  if (!filtered.length) {
    dom.aiMentionDropdown.classList.add("hidden");
    return;
  }

  dom.aiMentionDropdown.innerHTML = "";
  filtered.slice(0, 12).forEach((entry) => {
    const item = document.createElement("div");
    item.className = "ai-mention-item";
    item.innerHTML = `<span>${escapeHtml(entry.name)}</span><span class="ai-mention-item-kind">${escapeHtml(entry.kind ?? "")}</span>`;
    item.addEventListener("mousedown", (e) => {
      e.preventDefault(); // Don't blur textarea
      // Replace the @query with @"name" in the textarea
      const before = val.slice(0, pos - match[0].length);
      const after = val.slice(pos);
      const inserted = `@"${entry.name}" `;
      dom.aiChatInput.value = before + inserted + after;
      dom.aiChatInput.selectionStart = dom.aiChatInput.selectionEnd = (before + inserted).length;
      dom.aiMentionDropdown.classList.add("hidden");
      // Auto-add to context chips
      if (!state.ai.contextItemIds.includes(entry.id)) {
        toggleAiContextItem(entry.id, entry.name);
      }
    });
    dom.aiMentionDropdown.appendChild(item);
  });
  dom.aiMentionDropdown.classList.remove("hidden");
}

// ── Voice-to-text ─────────────────────────────────────────────────────────────

let _speechRecognition = null;

function toggleVoiceInput() {
  if (state.ai.voiceRecording) {
    _speechRecognition?.stop();
    return;
  }
  const SpeechRecognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    setStatus("Voice input is not supported in this browser.");
    return;
  }
  _speechRecognition = new SpeechRecognition();
  _speechRecognition.continuous = true;
  _speechRecognition.interimResults = true;
  _speechRecognition.lang = "en-US";

  let baseText = dom.aiChatInput.value;
  _speechRecognition.onstart = () => {
    state.ai.voiceRecording = true;
    dom.aiVoiceBtn.classList.add("ai-voice-recording");
    dom.aiVoiceBtn.title = "Stop recording";
    setStatus("Listening… speak your prompt.");
  };
  _speechRecognition.onresult = (event) => {
    let interim = "";
    let final = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const t = event.results[i][0].transcript;
      if (event.results[i].isFinal) final += t;
      else interim += t;
    }
    if (final) baseText += (baseText && !baseText.endsWith(" ") ? " " : "") + final;
    dom.aiChatInput.value = baseText + interim;
  };
  _speechRecognition.onend = () => {
    state.ai.voiceRecording = false;
    dom.aiVoiceBtn.classList.remove("ai-voice-recording");
    dom.aiVoiceBtn.title = "Voice to text";
    dom.aiChatInput.value = baseText;
    setStatus("Ready.");
    _speechRecognition = null;
  };
  _speechRecognition.onerror = (e) => {
    setStatus(`Voice error: ${e.error}`);
    _speechRecognition?.stop();
  };
  _speechRecognition.start();
}

// ── Map content visibility (eye icon) ────────────────────────────────────────

function toggleContentVisibility(contentId) {
  const isHidden = state.hiddenContentIds.has(contentId);
  if (isHidden) {
    state.hiddenContentIds.delete(contentId);
    setContentLayerVisible(contentId, true);
  } else {
    state.hiddenContentIds.add(contentId);
    setContentLayerVisible(contentId, false);
  }
  renderMapContents();
  syncCesiumEntities();
}

function setContentLayerVisible(contentId, visible) {
  if (contentId.startsWith("asset:")) {
    const id = contentId.slice("asset:".length);
    const marker = state.assetMarkers.get(id);
    if (marker) {
      if (visible) marker.addTo(state.map);
      else marker.remove();
    }
  } else if (contentId.startsWith("imported:")) {
    const item = state.importedItems.find((i) => `imported:${i.id}` === contentId);
    if (item?.layer) {
      if (visible) item.layer.addTo(state.map);
      else item.layer.remove();
    }
  } else if (contentId.startsWith("viewshed:")) {
    const vs = state.viewsheds.find((v) => `viewshed:${v.id}` === contentId);
    if (vs?.layer) {
      if (visible) vs.layer.addTo(state.map);
      else vs.layer.remove();
    }
  } else if (contentId.startsWith("terrain:")) {
    const t = state.terrains.find((t) => `terrain:${t.id}` === contentId);
    if (t) {
      const layer = state.terrainCoverageLayers.get(t.id);
      if (layer) {
        if (visible) layer.addTo(state.map);
        else layer.remove();
      }
    }
  }
}

// ── Chat image & context attachments ─────────────────────────────────────────

function clearAiAttachments() {
  state.ai.pendingImages = [];
  state.ai.pendingFiles = [];
  state.ai.contextItemIds = [];
  dom.aiImagePreviews.innerHTML = "";
  dom.aiFileChips.innerHTML = "";
  dom.aiContextChips.innerHTML = "";
  dom.aiAttachmentMenu.classList.add("hidden");
  dom.aiContextPicker.classList.add("hidden");
  dom.aiAttachmentBar.classList.add("hidden");
}

function syncAttachmentBar() {
  const hasContent = state.ai.pendingImages.length > 0 || state.ai.pendingFiles.length > 0 || state.ai.contextItemIds.length > 0;
  dom.aiAttachmentBar.classList.toggle("hidden", !hasContent);
}

function onAiChatPaste(event) {
  const items = event.clipboardData?.items ?? [];
  for (const item of items) {
    if (item.type.startsWith("image/")) {
      event.preventDefault();
      const blob = item.getAsFile();
      if (blob) addAiPendingImage(blob, item.type);
    }
  }
}

function onAiFileInputChange(event) {
  const files = [...(event.target.files ?? [])];
  files.forEach((file) => {
    if (file.type.startsWith("image/")) {
      addAiPendingImage(file, file.type);
      return;
    }
    void addAiPendingFile(file);
  });
  event.target.value = "";
}

function generateAiAttachmentId(prefix = "attachment") {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function isAiTextLikeFile(file) {
  const type = (file.type || "").toLowerCase();
  if (type.startsWith("text/")) {
    return true;
  }
  return /json|javascript|typescript|xml|yaml|csv|markdown/.test(type)
    || /\.(txt|md|markdown|json|geojson|csv|log|xml|yaml|yml|js|ts|html|css|kml)$/i.test(file.name || "");
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file."));
    reader.readAsText(file);
  });
}

async function addAiPendingFile(file) {
  const attachmentId = generateAiAttachmentId("file");
  let textExcerpt = "";
  let contentAvailable = false;

  if (isAiTextLikeFile(file)) {
    try {
      const text = await readFileAsText(file);
      textExcerpt = text.slice(0, 20000);
      contentAvailable = Boolean(textExcerpt.trim());
    } catch {
      contentAvailable = false;
    }
  }

  state.ai.pendingFiles.push({
    id: attachmentId,
    name: file.name,
    mediaType: file.type || "application/octet-stream",
    size: file.size,
    textExcerpt,
    contentAvailable,
  });

  addAiFileChip(attachmentId, file.name, contentAvailable);
  syncAttachmentBar();
}

function addAiPendingImage(blob, mediaType) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    const validType = ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(mediaType) ? mediaType : "image/png";
    state.ai.pendingImages.push({ dataUrl, mediaType: validType });
    const idx = state.ai.pendingImages.length - 1;

    const thumb = document.createElement("div");
    thumb.className = "ai-image-thumb";
    const img = document.createElement("img");
    img.src = dataUrl;
    img.alt = "Attached image";
    const removeBtn = document.createElement("button");
    removeBtn.className = "ai-image-thumb-remove";
    removeBtn.textContent = "×";
    removeBtn.type = "button";
    removeBtn.addEventListener("click", () => {
      state.ai.pendingImages.splice(idx, 1);
      thumb.remove();
      syncAttachmentBar();
    });
    thumb.append(img, removeBtn);
    dom.aiImagePreviews.appendChild(thumb);
    syncAttachmentBar();
  };
  reader.readAsDataURL(blob);
}

function toggleAiContextPicker(forceOpen = false) {
  return toggleAiContextPickerWithState(forceOpen);
}

function toggleAiAttachmentMenu() {
  dom.aiContextPicker.classList.add("hidden");
  dom.aiAttachmentMenu.classList.toggle("hidden");
}

function toggleAiContextPickerWithState(forceOpen = false) {
  dom.aiAttachmentMenu.classList.add("hidden");
  if (forceOpen) {
    dom.aiContextPicker.classList.remove("hidden");
    renderAiContextPicker();
    return;
  }
  const hidden = dom.aiContextPicker.classList.toggle("hidden");
  if (!hidden) renderAiContextPicker();
}

function renderAiContextPicker() {
  dom.aiContextPicker.innerHTML = "";
  const entries = getMapContentEntries().filter((e) => !e.id.startsWith("folder:"));
  if (!entries.length) {
    dom.aiContextPicker.innerHTML = `<div style="padding:10px 12px;font-size:12px;opacity:0.5;">No map contents</div>`;
    return;
  }
  entries.forEach((entry) => {
    const isSelected = state.ai.contextItemIds.includes(entry.id);
    const row = document.createElement("div");
    row.className = `ai-context-picker-item${isSelected ? " selected" : ""}`;
    row.innerHTML = `
      <span class="ai-context-picker-item-icon">${isSelected ? "✓" : "○"}</span>
      <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(entry.name)}</span>
      <span style="opacity:0.4;font-size:10px;margin-left:auto;flex-shrink:0;">${escapeHtml(entry.kind ?? "")}</span>
    `;
    row.addEventListener("click", () => toggleAiContextItem(entry.id, entry.name));
    dom.aiContextPicker.appendChild(row);
  });
}

function toggleAiContextItem(id, name) {
  const idx = state.ai.contextItemIds.indexOf(id);
  if (idx === -1) {
    state.ai.contextItemIds.push(id);
    addAiContextChip(id, name);
  } else {
    state.ai.contextItemIds.splice(idx, 1);
    dom.aiContextChips.querySelector(`[data-context-id="${CSS.escape(id)}"]`)?.remove();
  }
  syncAttachmentBar();
  renderAiContextPicker();
}

function addAiContextChip(id, name) {
  const chip = document.createElement("div");
  chip.className = "ai-context-chip";
  chip.dataset.contextId = id;
  chip.title = name;
  const label = document.createElement("span");
  label.textContent = name;
  label.style.cssText = "overflow:hidden;text-overflow:ellipsis;";
  const removeBtn = document.createElement("button");
  removeBtn.className = "ai-context-chip-remove";
  removeBtn.textContent = "×";
  removeBtn.type = "button";
  removeBtn.addEventListener("click", () => {
    const idx = state.ai.contextItemIds.indexOf(id);
    if (idx !== -1) state.ai.contextItemIds.splice(idx, 1);
    chip.remove();
    syncAttachmentBar();
  });
  chip.append(label, removeBtn);
  dom.aiContextChips.appendChild(chip);
}

function addAiFileChip(id, name, contentAvailable) {
  const chip = document.createElement("div");
  chip.className = `ai-context-chip ai-file-chip${contentAvailable ? "" : " ai-file-chip-binary"}`;
  chip.dataset.fileId = id;
  chip.title = contentAvailable ? `${name} attached as text context` : `${name} attached as file metadata only`;
  const label = document.createElement("span");
  label.textContent = name;
  label.style.cssText = "overflow:hidden;text-overflow:ellipsis;";
  const removeBtn = document.createElement("button");
  removeBtn.className = "ai-context-chip-remove";
  removeBtn.textContent = "×";
  removeBtn.type = "button";
  removeBtn.addEventListener("click", () => {
    state.ai.pendingFiles = state.ai.pendingFiles.filter((file) => file.id !== id);
    chip.remove();
    syncAttachmentBar();
  });
  chip.append(label, removeBtn);
  dom.aiFileChips.appendChild(chip);
}

function buildContextDetail(contextIds) {
  if (!contextIds.length) return "";
  const details = contextIds
    .map((contentId) => serializeMapContentForAi(contentId))
    .filter(Boolean);
  if (!details.length) {
    return "";
  }
  return JSON.stringify(details, null, 2);
}

function buildFileContextDetail(files) {
  if (!files.length) return "";
  return files.map((file) => {
    const sizeKb = Number.isFinite(file.size) ? `${(file.size / 1024).toFixed(1)} KB` : "unknown size";
    const excerpt = file.contentAvailable && file.textExcerpt
      ? `\nCONTENT EXCERPT:\n${file.textExcerpt}`
      : "\nCONTENT EXCERPT: [Binary or unsupported file type; only filename and metadata available]";
    return `FILE: ${file.name}\nTYPE: ${file.mediaType || "unknown"}\nSIZE: ${sizeKb}${excerpt}`;
  }).join("\n\n");
}

function roundAiNumber(value, digits = 6) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return null;
  }
  return Number(number.toFixed(digits));
}

function serializeLatLngForAi(latLng) {
  if (!latLng) {
    return null;
  }
  return {
    lat: roundAiNumber(latLng.lat),
    lon: roundAiNumber(latLng.lng ?? latLng.lon),
  };
}

function serializeLatLngCollectionForAi(latLngs) {
  if (!Array.isArray(latLngs)) {
    return [];
  }
  return latLngs.map((entry) => (Array.isArray(entry)
    ? serializeLatLngCollectionForAi(entry)
    : serializeLatLngForAi(entry)));
}

function serializeBoundsForAi(bounds) {
  if (!bounds?.isValid?.()) {
    return null;
  }
  return {
    southWest: serializeLatLngForAi(bounds.getSouthWest()),
    northEast: serializeLatLngForAi(bounds.getNorthEast()),
  };
}

function getImportedItemGeometryForAi(item) {
  if (!item?.layer) {
    return null;
  }

  if (item.geometryType === "Point") {
    return {
      type: "Point",
      coordinates: serializeLatLngForAi(item.layer.getLatLng()),
    };
  }

  if (item.geometryType === "LineString") {
    return {
      type: "LineString",
      coordinates: serializeLatLngCollectionForAi(item.layer.getLatLngs()),
    };
  }

  const rings = item.layer.getLatLngs();
  const polygonRings = Array.isArray(rings[0]) ? rings : [rings];
  return {
    type: item.geometryType,
    coordinates: serializeLatLngCollectionForAi(polygonRings),
  };
}

function getImportedItemMetricsForAi(item) {
  if (!item?.layer) {
    return {};
  }

  const metrics = {};
  const radiusMeters = Number(item.properties?.radiusM);
  if (Boolean(item.properties?.isCircle) && Number.isFinite(radiusMeters)) {
    metrics.radiusMeters = roundAiNumber(radiusMeters, 2);
    metrics.radiusLabel = formatDistance(radiusMeters);
  }

  if (item.geometryType === "LineString") {
    const lengthMeters = measureLatLngPath(item.layer.getLatLngs());
    if (lengthMeters > 0) {
      metrics.lengthMeters = roundAiNumber(lengthMeters, 2);
      metrics.lengthLabel = formatDistance(lengthMeters);
    }
    return metrics;
  }

  if (item.geometryType === "Polygon") {
    const rings = item.layer.getLatLngs();
    const outer = Array.isArray(rings[0]) ? rings[0] : rings;
    const perimeterMeters = measureLatLngPath(outer, true);
    const areaSqMeters = measurePolygonAreaSqMeters(outer);
    if (areaSqMeters > 0) {
      metrics.areaSqMeters = roundAiNumber(areaSqMeters, 2);
      metrics.areaLabel = formatShapeArea(areaSqMeters);
    }
    if (perimeterMeters > 0) {
      metrics.perimeterMeters = roundAiNumber(perimeterMeters, 2);
      metrics.perimeterLabel = formatDistance(perimeterMeters);
    }
  }

  return metrics;
}

function serializeAssetForAi(asset) {
  if (!asset) {
    return null;
  }
  return {
    id: asset.id,
    contentId: `asset:${asset.id}`,
    kind: "asset",
    name: asset.name,
    type: asset.type ?? "",
    force: asset.force ?? "",
    unit: asset.unit ?? "",
    icon: asset.icon ?? "",
    color: asset.color ?? "",
    notes: asset.notes ?? "",
    lat: roundAiNumber(asset.lat),
    lon: roundAiNumber(asset.lon),
    frequencyMHz: roundAiNumber(asset.frequencyMHz, 3),
    powerW: roundAiNumber(asset.powerW, 3),
    antennaHeightM: roundAiNumber(asset.antennaHeightM, 3),
    gainDBi: roundAiNumber(asset.gainDBi ?? 2.1, 3),
    receiverSensitivityDbm: roundAiNumber(asset.receiverSensitivityDbm ?? asset.receiverSensitivity, 3),
    systemLossDb: roundAiNumber(asset.systemLossDb ?? asset.systemLoss, 3),
    groundElevationM: roundAiNumber(asset.groundElevationM, 2),
    hidden: state.hiddenContentIds.has(`asset:${asset.id}`),
    folderId: getMapContentFolderId(`asset:${asset.id}`),
  };
}

function serializeViewshedForAi(viewshed) {
  if (!viewshed) {
    return null;
  }
  return {
    id: viewshed.id,
    contentId: `viewshed:${viewshed.id}`,
    kind: "viewshed",
    name: viewshed.name ?? `${viewshed.asset.name} Coverage`,
    assetId: viewshed.asset.id,
    assetName: viewshed.asset.name,
    propagationModel: viewshed.propagationModel,
    propagationModelLabel: viewshed.propagationModelLabel,
    radiusMeters: roundAiNumber(viewshed.radiusMeters, 2),
    radiusKm: roundAiNumber(viewshed.radiusMeters / 1000, 2),
    radiusUnit: viewshed.radiusUnit || getDefaultCoverageRadiusUnit(),
    radiusValue: roundAiNumber(convertMetersToRadiusUnit(viewshed.radiusMeters, viewshed.radiusUnit || getDefaultCoverageRadiusUnit()), 2),
    receiverHeight: roundAiNumber(viewshed.receiverHeight, 2),
    opacity: roundAiNumber(viewshed.opacity, 3),
    bounds: serializeBoundsForAi(viewshed.bounds),
    hidden: state.hiddenContentIds.has(`viewshed:${viewshed.id}`),
    folderId: getMapContentFolderId(`viewshed:${viewshed.id}`),
  };
}

function serializeImportedItemForAi(item) {
  if (!item) {
    return null;
  }
  const contentId = `imported:${item.id}`;
  const geometry = getImportedItemGeometryForAi(item);
  const coordinateCount = item.geometryType === "Point"
    ? 1
    : item.geometryType === "LineString"
      ? geometry?.coordinates?.length ?? 0
      : geometry?.coordinates?.[0]?.length ?? 0;
  return {
    id: item.id,
    contentId,
    kind: item.kind,
    name: item.name,
    subtitle: item.subtitle,
    geometryType: item.geometryType,
    drawn: Boolean(item.drawn),
    hidden: state.hiddenContentIds.has(contentId),
    folderId: getMapContentFolderId(contentId),
    coordinateCount,
    properties: item.properties ?? {},
    shapeStyle: item.shapeStyle ?? null,
    geometry,
    bounds: typeof item.layer?.getBounds === "function"
      ? serializeBoundsForAi(item.layer.getBounds())
      : null,
    metrics: getImportedItemMetricsForAi(item),
  };
}

function serializeTerrainForAi(terrain) {
  if (!terrain) {
    return null;
  }
  return {
    id: terrain.id,
    contentId: `terrain:${terrain.id}`,
    kind: "terrain",
    name: terrain.name,
    rows: terrain.rows,
    cols: terrain.cols,
    sourceLabel: terrain.sourceLabel ?? null,
    extentVisible: Boolean(terrain.extentVisible),
    hasCoverageLayer: state.terrainCoverageLayers.has(terrain.id),
    hidden: state.hiddenContentIds.has(`terrain:${terrain.id}`),
    folderId: getMapContentFolderId(`terrain:${terrain.id}`),
  };
}

function serializePlanningRegionForAi() {
  if (!state.planning.regionLayer) {
    return null;
  }
  const latLngs = state.planning.regionLayer.getLatLngs?.() ?? [];
  const outer = Array.isArray(latLngs[0]) ? latLngs[0] : latLngs;
  const areaSqMeters = measurePolygonAreaSqMeters(outer);
  const perimeterMeters = measureLatLngPath(outer, true);
  return {
    contentId: "planning-region",
    kind: "planning-region",
    name: state.planning.regionName,
    geometryType: "Polygon",
    hidden: state.hiddenContentIds.has("planning-region"),
    geometry: {
      type: "Polygon",
      coordinates: [serializeLatLngCollectionForAi(outer)],
    },
    bounds: serializeBoundsForAi(state.planning.regionLayer.getBounds?.()),
    metrics: {
      areaSqMeters: roundAiNumber(areaSqMeters, 2),
      areaLabel: areaSqMeters > 0 ? formatShapeArea(areaSqMeters) : null,
      perimeterMeters: roundAiNumber(perimeterMeters, 2),
      perimeterLabel: perimeterMeters > 0 ? formatDistance(perimeterMeters) : null,
    },
  };
}

function serializePlanningResultsForAi() {
  if (!state.planning.recommendations.length) {
    return null;
  }
  return {
    contentId: "planning-results",
    kind: "planning-results",
    name: state.planning.resultsName,
    hidden: state.hiddenContentIds.has("planning-results"),
    recommendations: state.planning.recommendations.map((recommendation, index) => ({
      index: index + 1,
      score: roundAiNumber(recommendation.score, 4),
      tx: recommendation.tx
        ? {
          id: recommendation.tx.id,
          name: recommendation.tx.name,
          lat: roundAiNumber(recommendation.tx.lat),
          lon: roundAiNumber(recommendation.tx.lon),
        }
        : null,
      rx: recommendation.rx
        ? {
          id: recommendation.rx.id,
          name: recommendation.rx.name,
          lat: roundAiNumber(recommendation.rx.lat),
          lon: roundAiNumber(recommendation.rx.lon),
        }
        : null,
    })),
  };
}

function serializeMapContentForAi(contentId) {
  if (!contentId || contentId.startsWith("folder:")) {
    return null;
  }

  if (contentId.startsWith("asset:")) {
    return serializeAssetForAi(state.assets.find((asset) => `asset:${asset.id}` === contentId));
  }

  if (contentId.startsWith("viewshed:")) {
    return serializeViewshedForAi(state.viewsheds.find((viewshed) => `viewshed:${viewshed.id}` === contentId));
  }

  if (contentId.startsWith("imported:")) {
    return serializeImportedItemForAi(state.importedItems.find((item) => `imported:${item.id}` === contentId));
  }

  if (contentId.startsWith("terrain:")) {
    return serializeTerrainForAi(state.terrains.find((terrain) => `terrain:${terrain.id}` === contentId));
  }

  if (contentId === "planning-region") {
    return serializePlanningRegionForAi();
  }

  if (contentId === "planning-results") {
    return serializePlanningResultsForAi();
  }

  return null;
}

function getAiContextIds(explicitContextIds = []) {
  const merged = [...explicitContextIds];
  if (state.ai.activeContextId && !merged.includes(state.ai.activeContextId)) {
    merged.unshift(state.ai.activeContextId);
  }
  return merged.filter((contentId, index) => merged.indexOf(contentId) === index && Boolean(serializeMapContentForAi(contentId)));
}

function appendAiMessage(role, text, images = []) {
  const controller = createAiMessageController(role, text, images);
  controller.setStatus(role === "assistant" ? "Response ready" : "Sent");
}

function isGenAiMilKey(key) {
  return key.startsWith("STARK_") || key.startsWith("STARK-");
}

async function testAiProviderConnection({ openPanelOnSuccess = true } = {}) {
  const { provider, apiKey } = state.ai;

  if (provider === "genai-mil") {
    if (!isGenAiMilKey(apiKey)) {
      state.ai.status = "error";
      state.ai.statusMessage = "GenAI.mil keys must start with STARK_.";
      syncAiUi();
      return;
    }
    state.ai.status = "testing";
    state.ai.statusMessage = "Testing GenAI.mil access. If direct access is blocked, the app will try the local proxy on 127.0.0.1:8787.";
    syncAiUi();
    try {
      const text = await callGenAiMil([{ role: "user", content: "Reply with READY only." }], 16, 0);
      if (!/READY/i.test(text)) throw new Error("GenAI.mil returned an unexpected validation response.");
      state.ai.status = "ready";
      state.ai.statusMessage = "GenAI.mil connected. AI chat is enabled.";
      syncAiUi();
      if (openPanelOnSuccess) {
        openAiPanel();
      }
    } catch (error) {
      state.ai.status = "error";
      state.ai.statusMessage = error.message;
      syncAiUi();
    }
    return;
  }

  if (provider === "anthropic") {
    if (!apiKey.startsWith("sk-")) {
      state.ai.status = "error";
      state.ai.statusMessage = "Anthropic API keys must start with sk-.";
      syncAiUi();
      return;
    }
    state.ai.status = "testing";
    state.ai.statusMessage = "Testing Anthropic API access...";
    syncAiUi();
    try {
      await callAnthropic([{ role: "user", content: "Reply with READY only." }], 16, 0);
      state.ai.status = "ready";
      state.ai.statusMessage = "Anthropic (Claude) connected. AI chat is enabled.";
      syncAiUi();
      if (openPanelOnSuccess) {
        openAiPanel();
      }
    } catch (error) {
      state.ai.status = "error";
      state.ai.statusMessage = error.message;
      syncAiUi();
    }
    return;
  }

  state.ai.status = "error";
  state.ai.statusMessage = "Unknown provider selected.";
  syncAiUi();
}

async function callAiPlanningAssistant(prompt, images = [], files = [], contextIds = [], { onStatus } = {}) {
  const scenarioSummary = buildAiScenarioSummary();
  const contextDetail = buildContextDetail(contextIds);
  const fileDetail = buildFileContextDetail(files);

  const systemText = [
    "You are an expert RF planning assistant and electronic warfare analyst embedded in a live terrain-aware RF propagation simulator.",
    "You have deep knowledge of military and civilian radio systems, link budget analysis, antenna theory, terrain effects on propagation, and spectrum management.",
    "",
    "You are given the full current scenario state. You can answer questions AND execute actions that manipulate the live map and simulation.",
    "Return ONLY valid JSON with this schema:",
    '{"assistantMessage":"string","actions":[{"type":"ACTION_TYPE","...":"fields"}]}',
    "If you are only answering a question with no map changes, you MAY reply with plain text instead of JSON.",
    "",
    "═══════════════════════════════════════",
    "ACTION TYPES (ONLY use these exact strings for the \"type\" field):",
    "═══════════════════════════════════════",
    "  set-map-view          → lat, lon, zoom",
    "  focus-map-content     → contentId",
    "  set-settings          → measurementUnits?, theme?, coordinateSystem?, gridLinesEnabled?",
    "  set-weather           → temperatureC?, humidity?, pressure?, windSpeed?",
    "  set-imagery           → basemap?",
    "  set-emitter-form      → (emitter fields — pre-fills the UI form only, does NOT place an asset)",
    "  add-asset             → lat, lon, emitterType, name, force?, unit?, frequencyMHz, powerW, antennaHeightM, antennaGainDbi, receiverSensitivityDbm, systemLossDb, notes?",
    "  update-asset          → assetId (exact id), lat?, lon?, emitterType?, name?, force?, unit?, frequencyMHz?, powerW?, antennaHeightM?, antennaGainDbi?, receiverSensitivityDbm?, systemLossDb?",
    "  remove-asset          → assetId (exact id)",
    "  draw-shape            → shapeType (circle|rectangle|polyline|polygon), name?, color?, fillOpacity?, weight?, coordinates [{lat,lon}], radiusM? (circle only)",
    "  update-shape          → shapeId or name, color?, fillOpacity?, weight?, coordinates?",
    "  remove-shape          → shapeId or name",
    "  set-planning-parameters → txAssetId?, rxAssetId?, gridMeters?, minSeparation?, enemyWeight?, separationWeight?, floorM?, ceilingM?",
    "  set-planning-region   → polygon [{lat,lon}], name?",
    "  run-simulation        → assetId OR placedIndex (0-based index into assets placed THIS batch), propagationModel?, radiusKm?, gridMeters?, receiverHeight?, opacity?",
    "  run-planning          → (no fields)",
    "  toggle-3d             → enabled?",
    "  check-los             → candidates: [{lat, lon, name, antennaHeightM?}] — checks terrain LOS between candidate positions BEFORE placement. Returns BLOCKED/CLEAR for each pair. Use this when you are uncertain about terrain obstruction.",
    "",
    "═══════════════════════════════════════",
    "ADD-ASSET FIELD REFERENCE:",
    "═══════════════════════════════════════",
    "  emitterType           → Equipment category string: \"radio\", \"jammer\", \"radar\", \"relay\", \"sensor\", or a model name like \"PRC-163\"",
    "                          ⚠ This is DIFFERENT from the action \"type\" field. Use \"emitterType\" for the equipment label.",
    "  force                 → \"friendly\" | \"enemy\" | \"host-nation\" | \"civilian\"  (default: \"friendly\")",
    "  name                  → Display name, e.g. \"PRC-163 Alpha\", \"Radio 1\"",
    "  unit                  → Unit/callsign, e.g. \"1-68 AR\", \"K 1\"",
    "  frequencyMHz          → Operating frequency in MHz (REQUIRED — no default)",
    "  powerW                → Transmit power in watts (REQUIRED — no default)",
    "  antennaHeightM        → Antenna height above ground in meters",
    "  antennaGainDbi        → Antenna gain in dBi",
    "  receiverSensitivityDbm → Receiver sensitivity in dBm (negative number)",
    "  systemLossDb          → Feeder/system losses in dB",
    "",
    "KNOWN RADIO PROFILES (use these exact values unless user specifies otherwise):",
    "  PRC-163 (Harris Falcon III multiband):  frequencyMHz=150, powerW=5, antennaHeightM=2, antennaGainDbi=2.15, receiverSensitivityDbm=-107, systemLossDb=3",
    "  PRC-152A (Harris Falcon III):           frequencyMHz=150, powerW=5, antennaHeightM=2, antennaGainDbi=2.15, receiverSensitivityDbm=-107, systemLossDb=3",
    "  PRC-117G (SATCOM/VHF/UHF):              frequencyMHz=300, powerW=20, antennaHeightM=2, antennaGainDbi=2.15, receiverSensitivityDbm=-107, systemLossDb=3",
    "  AN/PRC-77 (legacy VHF):                 frequencyMHz=60, powerW=4, antennaHeightM=2, antennaGainDbi=2.0, receiverSensitivityDbm=-105, systemLossDb=3",
    "  SINCGARS (AN/VRC-90):                   frequencyMHz=50, powerW=50, antennaHeightM=3, antennaGainDbi=2.15, receiverSensitivityDbm=-107, systemLossDb=2",
    "",
    "═══════════════════════════════════════",
    "MULTI-ASSET PLACEMENT + SIMULATION PATTERN:",
    "═══════════════════════════════════════",
    "When placing N assets and then simulating each:",
    "  1. Emit N add-asset actions (they execute in order). Each returns the placed asset's ID.",
    "  2. Emit N run-simulation actions. Use placedIndex to reference each new asset by its",
    "     position in the placement list: placedIndex=0 targets the 1st add-asset, placedIndex=1 the 2nd, etc.",
    "  3. NEVER use assetId for newly added assets — the ID doesn't exist yet at prompt time.",
    "  4. NEVER run-simulation without a placedIndex or assetId — it will run on the wrong asset.",
    "",
    "Example for 3 radios + 3 simulations:",
    '  {"type":"add-asset","lat":34.41,"lon":-116.57,"emitterType":"PRC-163","name":"PRC-163 Alpha",...}',
    '  {"type":"add-asset","lat":34.42,"lon":-116.55,"emitterType":"PRC-163","name":"PRC-163 Bravo",...}',
    '  {"type":"add-asset","lat":34.40,"lon":-116.55,"emitterType":"PRC-163","name":"PRC-163 Charlie",...}',
    '  {"type":"run-simulation","placedIndex":0,"radiusKm":30}',
    '  {"type":"run-simulation","placedIndex":1,"radiusKm":30}',
    '  {"type":"run-simulation","placedIndex":2,"radiusKm":30}',
    "",
    "═══════════════════════════════════════",
    "TERRAIN LINE-OF-SIGHT AWARENESS:",
    "═══════════════════════════════════════",
    "The scenario summary includes a `terrainLosMatrix` array. Each entry covers one asset pair:",
    "  { from, to, distanceKm, losBlocked, minClearanceM, obstructionFrac, obstructionLat, obstructionLon, terrainAvailable }",
    "  losBlocked=true  → terrain physically blocks the LOS path between those assets.",
    "  minClearanceM    → how many meters of clearance the LOS line has above terrain at the worst point (negative = blocked).",
    "  obstructionFrac  → where along the path (0=from, 1=to) the worst obstruction occurs.",
    "  terrainAvailable=false → no DTED loaded, LOS cannot be verified.",
    "",
    "BEFORE recommending or placing assets, CHECK the terrainLosMatrix for existing assets.",
    "WHEN PLACING NEW ASSETS, the system will compute LOS after placement and report warnings.",
    "LOS PLACEMENT RULES:",
    "  • Never place a radio on the VALLEY side of a mountain range relative to its intended peer — it will be blocked.",
    "  • Ridgelines and hilltops maximise LOS. Place assets near the highest local terrain within the polygon.",
    "  • If two assets must communicate across a valley, they both need to be on elevated terrain above the valley floor.",
    "  • Repeater/relay placement: if direct LOS is impossible, suggest a relay on an intermediate high point.",
    "  • For 3 radios requiring mutual coverage: a triangular arrangement on elevated terrain at polygon corners/ridges is ideal — NOT a cluster in one area.",
    "  • Earth curvature matters for links >30 km: a 5 W VHF radio at 2 m antenna height has radio horizon of ~7–10 km in flat terrain.",
    "  • If terrain data is NOT available (terrainAvailable=false), state this limitation clearly and place assets conservatively on estimated high ground based on polygon geometry.",
    "",
    "═══════════════════════════════════════",
    "SPATIAL REASONING:",
    "═══════════════════════════════════════",
    "- Polygon boundaries (AO Boundary, drawn polygons) are in importedItems[].geometry.coordinates[0] as [{lat,lon}].",
    "- Compute the polygon centroid and bounding box. Place assets distributed inside — NOT outside.",
    "- For 'highest elevation': examine the polygon vertex coordinates. Vertices at the extremes of the bounding box (especially corners) tend to be on ridgelines. Avoid placing in the center of a large polygon — that's often a valley or flat plain.",
    "- Separation check: compute haversine distance between all pairs. With 1 km minimum and 3 assets, use a triangle with ~1.5–3 km sides.",
    "- Always verify all placed coordinates are actually inside the polygon before including them.",
    "",
    "═══════════════════════════════════════",
    "RF PLANNING EXPERTISE — SANITY CHECKS:",
    "═══════════════════════════════════════",
    "Before executing any RF configuration, check for these issues and FLAG them to the user:",
    "  • Power out of range: <0.1 W or >100 W for handheld/manpack radios is suspicious",
    "  • Frequency mismatch: VHF radios (30–300 MHz) being configured at UHF frequencies (>300 MHz) or vice versa",
    "  • Receiver sensitivity too high (>-80 dBm) indicates poor sensitivity; too low (<-120 dBm) is unrealistic for most hardware",
    "  • Antenna gain >15 dBi on a manpack system is physically implausible",
    "  • Antenna height <0.5 m will be blocked by operator's body; >30 m without a mast/tower is unrealistic",
    "  • System loss <1 dB or >20 dB is unusual — check cable/connector assumptions",
    "  • Placing a radio on terrain that's clearly a valley floor when 'highest elevation' was requested",
    "  • Running simulation radius >>50 km for a 5 W VHF handheld — signal won't reach that far",
    "If the user requests a configuration that violates any of the above, respond with a warning in assistantMessage explaining why the configuration may not work as intended, and ask for confirmation. Include the actions anyway so the user can approve and proceed, but mark them clearly in your message.",
    "",
    "GENERAL RULES:",
    "- ONLY use action type strings from the list above. 'radio', 'jammer', 'PRC-163' etc. are NOT action types — they are emitterType values inside add-asset.",
    "- ALWAYS use the exact `id` field from the assets array for assetId — never use name as ID.",
    "- For existing assets (in the assets[] list), use their id in run-simulation directly.",
    "- For assets placed THIS batch, use placedIndex.",
    "- For draw-shape circle: put center in coordinates[0], set radiusM.",
    "- Do not reference unavailable tools or external URLs.",
    "- If no action is needed, return an empty actions array.",
    "SCENARIO SUMMARY:",
    scenarioSummary,
    contextDetail ? `SELECTED MAP CONTENT DETAIL:\n${contextDetail}` : "",
    fileDetail ? `UPLOADED FILE CONTEXT:\n${fileDetail}` : "",
    "USER REQUEST:",
    prompt || "(see attached image)",
  ].filter(Boolean).join("\n\n");

  // Build multimodal content for Anthropic; text-only fallback for GenAI.mil
  let messages;
  if (state.ai.provider === "anthropic" && images.length > 0) {
    const contentBlocks = [];
    images.forEach(({ dataUrl, mediaType }) => {
      const base64 = dataUrl.split(",")[1];
      contentBlocks.push({ type: "image", source: { type: "base64", media_type: mediaType, data: base64 } });
    });
    contentBlocks.push({ type: "text", text: systemText });
    messages = [{ role: "user", content: contentBlocks }];
  } else {
    const imageNote = images.length ? `\n[User attached ${images.length} image(s) — not supported by this provider, ignoring.]` : "";
    messages = [{ role: "user", content: systemText + imageNote }];
  }

  onStatus?.("Contacting provider");
  const raw = state.ai.provider === "anthropic"
    ? await callAnthropic(messages, 4096, 0.2)
    : await callGenAiMil(messages, 4096, 0.2);
  onStatus?.("Parsing response");
  const parsed = parseAiAssistantResponse(raw);
  return {
    assistantMessage: typeof parsed.assistantMessage === "string" && parsed.assistantMessage.trim()
      ? parsed.assistantMessage.trim()
      : "I reviewed the scenario.",
    actions: Array.isArray(parsed.actions) ? parsed.actions : [],
  };
}

async function callGenAiMil(messages, maxTokens = 256, temperature = 0) {
  const payload = {
    model: ensureAiModelForProvider("genai-mil", state.ai.model),
    messages,
    max_tokens: maxTokens,
    temperature,
  };

  let response;
  try {
    response = await callGenAiMilEndpoint(GENAI_MIL_ENDPOINT, state.ai.apiKey, payload);
  } catch (error) {
    if (error instanceof TypeError) {
      try {
        response = await callGenAiMilEndpoint(GENAI_MIL_PROXY_ENDPOINT, state.ai.apiKey, payload);
        state.ai.statusMessage = "GenAI.mil connected through the local proxy on 127.0.0.1:8787.";
        syncAiUi();
      } catch (proxyError) {
        if (proxyError instanceof TypeError) {
          throw new Error("Browser access to GenAI.mil is blocked, and the local proxy at 127.0.0.1:8787 is not reachable. Start the proxy with: node genai-proxy.js");
        }
        throw proxyError;
      }
    }
    throw error;
  }

  const bodyText = await response.text();
  if (!response.ok) {
    if (bodyText.startsWith("<!doctype") || bodyText.startsWith("<!DOCTYPE") || bodyText.startsWith("<html")) {
      if (response.status === 401 || response.status === 403) {
        throw new Error(`GenAI.mil authentication failed (HTTP ${response.status}). Check your STARK API key and network access.`);
      }
      throw new Error(`GenAI.mil may only be reachable from approved networks. HTTP ${response.status}.`);
    }
    try {
      const parsedError = JSON.parse(bodyText);
      const message = parsedError?.error?.message || parsedError?.message;
      if (message) {
        throw new Error(`GenAI.mil (${response.status}): ${message}`);
      }
    } catch (parseError) {
      if (parseError.message.startsWith("GenAI.mil")) {
        throw parseError;
      }
    }
    throw new Error(`GenAI.mil request failed (HTTP ${response.status}).`);
  }

  let parsed;
  try {
    parsed = JSON.parse(bodyText);
  } catch {
    throw new Error("GenAI.mil returned a non-JSON response.");
  }
  const content = parsed?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("GenAI.mil returned an empty completion.");
  }
  return content;
}

async function callGenAiMilEndpoint(url, apiKey, payload) {
  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify(payload),
  });
}

async function callAnthropic(messages, maxTokens = 256, temperature = 0) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": state.ai.apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: ensureAiModelForProvider("anthropic", state.ai.model),
      max_tokens: maxTokens,
      temperature,
      messages,
    }),
  });

  const bodyText = await response.text();
  if (!response.ok) {
    try {
      const err = JSON.parse(bodyText);
      const msg = err?.error?.message || err?.message;
      if (msg) throw new Error(`Anthropic (${response.status}): ${msg}`);
    } catch (e) {
      if (e.message.startsWith("Anthropic")) throw e;
    }
    throw new Error(`Anthropic request failed (HTTP ${response.status}).`);
  }

  let parsed;
  try {
    parsed = JSON.parse(bodyText);
  } catch {
    throw new Error("Anthropic returned a non-JSON response.");
  }
  const content = parsed?.content?.[0]?.text;
  if (!content) throw new Error("Anthropic returned an empty completion.");
  return content;
}

function parseAiAssistantResponse(text) {
  const normalized = typeof text === "string" ? text.trim() : "";
  if (!normalized) {
    return { assistantMessage: "", actions: [] };
  }

  try {
    return normalizeAiAssistantPayload(JSON.parse(normalized), normalized);
  } catch {
    const match = normalized.match(/\{[\s\S]*\}/);
    if (!match) {
      return { assistantMessage: normalized, actions: [] };
    }
    try {
      return normalizeAiAssistantPayload(JSON.parse(match[0]), normalized);
    } catch {
      return { assistantMessage: normalized, actions: [] };
    }
  }
}

function normalizeAiAssistantPayload(payload, rawText = "") {
  if (typeof payload === "string") {
    return { assistantMessage: payload, actions: [] };
  }
  if (!payload || typeof payload !== "object") {
    return { assistantMessage: rawText, actions: [] };
  }

  const assistantMessage = typeof payload.assistantMessage === "string"
    ? payload.assistantMessage
    : typeof payload.message === "string"
      ? payload.message
      : rawText;

  return {
    assistantMessage,
    actions: Array.isArray(payload.actions) ? payload.actions : [],
  };
}

// ─── Terrain-aware LOS check ────────────────────────────────────────────────

// Sample terrain elevation along a geodesic path between two points.
// Returns the minimum clearance (meters) between the LOS line and terrain,
// the index and coordinates of the worst obstruction, and a compact profile.
// Uses ~60 samples — fast enough to run synchronously for up to ~15 pairs.
function computeTerrainLos(lat1, lon1, h1m, lat2, lon2, h2m, terrain) {
  const SAMPLES = 60;
  const EARTH_R = 6371000;
  // k-factor for effective Earth radius (standard atmosphere)
  const K = 4 / 3;
  const Re = K * EARTH_R;

  if (!terrain) {
    return { hasTerrain: false };
  }

  const distM = state.map.distance({ lat: lat1, lng: lon1 }, { lat: lat2, lng: lon2 });
  if (distM < 10) {
    return { hasTerrain: true, blocked: false, minClearanceM: 9999, distanceM: distM };
  }

  const el1 = sampleTerrainElevationForTerrain(lat1, lon1, terrain) ?? 0;
  const el2 = sampleTerrainElevationForTerrain(lat2, lon2, terrain) ?? 0;

  // Heights above MSL at each end
  const msl1 = el1 + h1m;
  const msl2 = el2 + h2m;

  let minClearanceM = Infinity;
  let worstFrac = 0;
  let worstLat = lat1;
  let worstLon = lon1;
  let blocked = false;

  for (let i = 1; i < SAMPLES; i++) {
    const frac = i / SAMPLES;
    // Interpolate lat/lon linearly (close enough for <200 km paths)
    const lat = lat1 + (lat2 - lat1) * frac;
    const lon = lon1 + (lon2 - lon1) * frac;

    const terrainElM = sampleTerrainElevationForTerrain(lat, lon, terrain);
    if (terrainElM === null) continue;

    // LOS height at this fraction (straight line in MSL)
    const losHeightM = msl1 + (msl2 - msl1) * frac;

    // Earth bulge correction: depresses the effective LOS by d1*d2/(2*Re)
    const d = frac * distM;
    const d1 = d;
    const d2 = distM - d;
    const bulgeCorrectionM = (d1 * d2) / (2 * Re);

    // Effective clearance: how far the LOS line clears the terrain at this point
    const clearanceM = (losHeightM - bulgeCorrectionM) - terrainElM;

    if (clearanceM < minClearanceM) {
      minClearanceM = clearanceM;
      worstFrac = frac;
      worstLat = lat;
      worstLon = lon;
    }
    if (clearanceM < 0) {
      blocked = true;
    }
  }

  return {
    hasTerrain: true,
    blocked,
    minClearanceM: Math.round(minClearanceM),
    distanceM: Math.round(distM),
    obstructionFrac: blocked ? Math.round(worstFrac * 100) / 100 : null,
    obstructionLat: blocked ? Math.round(worstLat * 10000) / 10000 : null,
    obstructionLon: blocked ? Math.round(worstLon * 10000) / 10000 : null,
  };
}

// Build a compact LOS matrix for all asset pairs (capped at 10 assets = 45 pairs).
// Returns an array of link summaries the AI can use for placement decisions.
function buildLosMatrix(assetsToCheck) {
  const terrain = getActiveTerrain();
  const links = [];
  const cap = Math.min(assetsToCheck.length, 10);
  for (let i = 0; i < cap; i++) {
    for (let j = i + 1; j < cap; j++) {
      const a = assetsToCheck[i];
      const b = assetsToCheck[j];
      const h1 = Number.isFinite(a.antennaHeightM) ? a.antennaHeightM : 2;
      const h2 = Number.isFinite(b.antennaHeightM) ? b.antennaHeightM : 2;
      const result = computeTerrainLos(a.lat, a.lon, h1, b.lat, b.lon, h2, terrain);
      links.push({
        from: a.name ?? a.id,
        to: b.name ?? b.id,
        distanceKm: result.distanceM ? Math.round(result.distanceM / 100) / 10 : null,
        losBlocked: result.blocked ?? null,
        minClearanceM: result.hasTerrain ? result.minClearanceM : null,
        obstructionFrac: result.obstructionFrac ?? null,
        obstructionLat: result.obstructionLat ?? null,
        obstructionLon: result.obstructionLon ?? null,
        terrainAvailable: result.hasTerrain,
      });
    }
  }
  return links;
}

// ─── End LOS check ──────────────────────────────────────────────────────────

function buildAiScenarioSummary() {
  const center = state.map.getCenter();
  const terrain = getActiveTerrain();
  const mapContents = getMapContentEntries().map((entry) => ({
    ...entry,
    hidden: state.hiddenContentIds.has(entry.id),
    folderId: getMapContentFolderId(entry.id),
    detail: serializeMapContentForAi(entry.id),
  }));
  const assets = state.assets.map((asset) => serializeAssetForAi(asset));
  const viewsheds = state.viewsheds.map((viewshed) => serializeViewshedForAi(viewshed));
  const planning = state.planning.recommendations.map((recommendation, index) => ({
    index: index + 1,
    tx: recommendation.tx?.name ?? recommendation.tx?.id,
    rx: recommendation.rx?.name ?? recommendation.rx?.id,
    score: roundAiNumber(recommendation.score, 4),
  }));
  const importedItems = state.importedItems.map((item) => serializeImportedItemForAi(item));
  const activeAiContext = serializeMapContentForAi(state.ai.activeContextId);

  return JSON.stringify({
    map: {
      center: { lat: Number(center.lat.toFixed(6)), lon: Number(center.lng.toFixed(6)) },
      zoom: state.map.getZoom(),
      view3dEnabled: state.view3dEnabled,
      basemap: dom.basemapSelect.value,
      terrainSource: dom.terrainSourceSelect.value,
      imagerySource: dom.imagerySourceSelect.value,
    },
    settings: state.settings,
    weather: state.weather,
    gps: {
      mode: state.gps.mode,
      centerMode: dom.gpsCenterMode.value,
      location: state.gps.location,
    },
    terrain: terrain
      ? serializeTerrainForAi(terrain)
      : null,
    terrainCatalog: state.terrains.map((entry) => serializeTerrainForAi(entry)),
    emitterDraft: getEmitterFormData(),
    simulationDraft: {
      assetId: dom.assetSelect.value,
      propagationModel: dom.propagationModel.value,
      radius: Number(dom.radiusValue.value),
      radiusUnit: getSelectedCoverageRadiusUnit(),
      radiusMeters: roundAiNumber(getSimulationRadiusMeters(), 2),
      gridMeters: Number(dom.gridMeters.value),
      receiverHeight: Number(dom.receiverHeight.value),
      opacity: Number(dom.viewshedOpacity.value),
    },
    planningDraft: {
      txAssetId: dom.planningTxAsset.value,
      rxAssetId: dom.planningRxAsset.value,
      gridMeters: Number(dom.planningGridMeters.value),
      minSeparation: Number(dom.planningMinSeparation.value),
      enemyWeight: Number(dom.planningEnemyWeight.value),
      separationWeight: Number(dom.planningSeparationWeight.value),
      floorM: Number(dom.planningFloorM.value),
      ceilingM: Number(dom.planningCeilingM.value),
      hasRegion: Boolean(state.planning.regionLayer),
    },
    assets,
    viewsheds,
    importedItems,
    planning,
    planningRegion: serializePlanningRegionForAi(),
    planningResults: serializePlanningResultsForAi(),
    mapContents,
    activeAiContextId: state.ai.activeContextId,
    activeAiContext,
    explicitAiContextIds: [...state.ai.contextItemIds],
    drawnShapes: importedItems.filter((item) => item?.drawn),
    // Pre-computed terrain LOS matrix for all current asset pairs
    terrainLosMatrix: buildLosMatrix(state.assets),
    terrainLosSamplesPerLink: 60,
  }, null, 2);
}

async function executeAiActions(actions) {
  const results = [];
  // Track asset IDs placed this batch so run-simulation can target them by index
  const placedAssetIds = [];
  for (const action of actions) {
    const result = await executeAiAction(action, { placedAssetIds });
    if (result) {
      results.push(result);
    }
  }

  // After all placements, run a LOS check on newly placed assets and append warnings
  if (placedAssetIds.length >= 2) {
    const newAssets = placedAssetIds.map((id) => state.assets.find((a) => a.id === id)).filter(Boolean);
    const losLinks = buildLosMatrix(newAssets);
    const blockedLinks = losLinks.filter((l) => l.losBlocked === true);
    const marginalLinks = losLinks.filter((l) => l.losBlocked === false && l.minClearanceM !== null && l.minClearanceM < 10);
    if (blockedLinks.length > 0) {
      const warnings = blockedLinks.map((l) =>
        `⚠ LOS BLOCKED: ${l.from} ↔ ${l.to} (${l.distanceKm} km) — terrain obstruction at ~${Math.round((l.obstructionFrac ?? 0.5) * 100)}% along path`
      );
      results.push(...warnings);
    }
    if (marginalLinks.length > 0) {
      const warnings = marginalLinks.map((l) =>
        `⚠ LOS MARGINAL: ${l.from} ↔ ${l.to} — only ${l.minClearanceM} m clearance above terrain`
      );
      results.push(...warnings);
    }
    if (blockedLinks.length === 0 && marginalLinks.length === 0 && losLinks.some((l) => l.terrainAvailable)) {
      results.push(`✓ LOS clear on all ${losLinks.length} link(s) between placed assets.`);
    }
  }

  return results;
}

async function executeAiAction(action, { placedAssetIds = [] } = {}) {
  if (!action || typeof action.type !== "string") {
    return "Skipped malformed action.";
  }

  if (action.type === "set-map-view") {
    const lat = Number(action.lat ?? action.center?.lat);
    const lon = Number(action.lon ?? action.center?.lon);
    const zoom = Number.isFinite(Number(action.zoom)) ? Number(action.zoom) : state.map.getZoom();
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return "Skipped map view update with invalid coordinates.";
    }
    state.map.setView([lat, lon], clamp(zoom, 2, 18));
    return `Moved map to ${lat.toFixed(4)}, ${lon.toFixed(4)}.`;
  }

  if (action.type === "focus-map-content") {
    const contentId = resolveMapContentId(action.contentId ?? action.name);
    if (!contentId) {
      return "Skipped focus request because the map content was not found.";
    }
    focusMapContent(contentId);
    return `Focused ${contentId}.`;
  }

  if (action.type === "set-settings") {
    if (["metric", "standard"].includes(action.measurementUnits)) {
      state.settings.measurementUnits = action.measurementUnits;
    }
    if (["dark", "light"].includes(action.theme)) {
      state.settings.theme = action.theme;
    }
    if (["mgrs", "latlon", "dms"].includes(action.coordinateSystem)) {
      state.settings.coordinateSystem = action.coordinateSystem;
    }
    if (typeof action.gridLinesEnabled === "boolean") {
      state.settings.gridLinesEnabled = action.gridLinesEnabled;
    }
    if (typeof action.gridColor === "string") {
      state.settings.gridColor = action.gridColor;
    }
    persistSettings();
    applySettings();
    return "Updated map settings.";
  }

  if (action.type === "set-weather") {
    if (Number.isFinite(Number(action.temperatureC))) {
      state.weather.temperatureC = Number(action.temperatureC);
    }
    if (Number.isFinite(Number(action.humidity))) {
      state.weather.humidity = clamp(Number(action.humidity), 0, 100);
    }
    if (Number.isFinite(Number(action.pressureHpa))) {
      state.weather.pressureHpa = Number(action.pressureHpa);
    }
    if (Number.isFinite(Number(action.windSpeedMps))) {
      state.weather.windSpeedMps = Math.max(0, Number(action.windSpeedMps));
    }
    state.weather.source = "manual";
    syncWeatherInputsFromState();
    dom.weatherSummary.textContent = "Manual weather profile active.";
    updateWeatherMenuValue();
    return "Updated weather inputs.";
  }

  if (action.type === "set-imagery") {
    if (typeof action.basemap === "string") {
      dom.basemapSelect.value = action.basemap;
      applyBasemap(dom.basemapSelect.value);
    }
    if (typeof action.customTileUrl === "string") {
      dom.customTileUrl.value = action.customTileUrl;
    }
    if (typeof action.terrainSource === "string") {
      dom.terrainSourceSelect.value = action.terrainSource;
    }
    if (typeof action.imagerySource === "string") {
      dom.imagerySourceSelect.value = action.imagerySource;
    }
    if (typeof action.customTerrainUrl === "string") {
      dom.customTerrainUrl.value = action.customTerrainUrl;
    }
    updateImageryMenuValue();
    syncCesiumScene();
    return "Updated imagery and terrain source settings.";
  }

  if (action.type === "set-emitter-form") {
    applyEmitterFormData(normalizeAiEmitterData(action));
    return "Updated the emitter form draft.";
  }

  if (action.type === "add-asset") {
    const assetLat = Number(action.lat);
    const assetLon = Number(action.lon);
    if (!Number.isFinite(assetLat) || !Number.isFinite(assetLon)) {
      return "Skipped asset placement because coordinates were invalid.";
    }
    const emitterData = normalizeAiEmitterData(action.asset ?? action);
    // Build asset directly — do NOT route through the shared emitter form so we
    // don't accidentally inherit stale form state or overwrite it for subsequent placements.
    const newAsset = {
      id: generateId(),
      type: emitterData.type ?? "radio",
      force: emitterData.force ?? "friendly",
      name: emitterData.name ?? "Asset",
      unit: emitterData.unit ?? "",
      frequencyMHz: Number.isFinite(emitterData.frequencyMHz) ? emitterData.frequencyMHz : 150,
      powerW: Number.isFinite(emitterData.powerW) ? emitterData.powerW : 5,
      antennaHeightM: Number.isFinite(emitterData.antennaHeightM) ? emitterData.antennaHeightM : 2,
      antennaGainDbi: Number.isFinite(emitterData.antennaGainDbi) ? emitterData.antennaGainDbi : 2.15,
      receiverSensitivityDbm: Number.isFinite(emitterData.receiverSensitivityDbm) ? emitterData.receiverSensitivityDbm : -107,
      systemLossDb: Number.isFinite(emitterData.systemLossDb) ? emitterData.systemLossDb : 3,
      icon: emitterData.icon ?? "",
      color: emitterData.color ?? FORCE_COLORS["friendly"],
      notes: emitterData.notes ?? "",
      lat: assetLat,
      lon: assetLon,
      groundElevationM: sampleTerrainElevation(assetLat, assetLon),
    };
    const latlng = { lat: assetLat, lng: assetLon };
    const marker = L.marker(latlng, {
      icon: createEmitterIcon(newAsset),
      pane: getMapContentPaneName(`asset:${newAsset.id}`),
    }).addTo(state.map);
    marker.bindPopup(renderAssetPopup(newAsset));
    state.assetMarkers.set(newAsset.id, marker);
    state.assets.push(newAsset);
    renderAssets();
    syncCesiumEntities();
    renderMapContents();
    saveMapState();
    if (!Number.isFinite(newAsset.groundElevationM) && usesConfiguredCesiumTerrain()) {
      refreshAssetGroundElevation(newAsset).catch(() => {});
    }
    // Track so subsequent run-simulation actions in this batch can target it
    placedAssetIds.push(newAsset.id);
    return `Placed ${newAsset.name} (${newAsset.frequencyMHz} MHz, ${newAsset.powerW} W) at ${assetLat.toFixed(5)}, ${assetLon.toFixed(5)}. assetId=${newAsset.id}`;
  }

  if (action.type === "update-asset") {
    const asset = findAssetByReference(action.assetId ?? action.name);
    if (!asset) {
      return "Skipped asset update because the asset was not found.";
    }
    Object.assign(asset, normalizeAiEmitterData(action.changes ?? action));
    if (Number.isFinite(Number(action.lat))) {
      asset.lat = Number(action.lat);
    }
    if (Number.isFinite(Number(action.lon))) {
      asset.lon = Number(action.lon);
    }
    asset.groundElevationM = sampleTerrainElevation(asset.lat, asset.lon);
    const marker = state.assetMarkers.get(asset.id);
    if (marker) {
      marker.setLatLng([asset.lat, asset.lon]);
    }
    updateAssetMarker(asset);
    renderAssets();
    renderMapContents();
    syncCesiumEntities();
    if (!Number.isFinite(asset.groundElevationM) && usesConfiguredCesiumTerrain()) {
      refreshAssetGroundElevation(asset).catch(() => {});
    }
    return `Updated ${asset.name}.`;
  }

  if (action.type === "remove-asset") {
    const asset = findAssetByReference(action.assetId ?? action.name);
    if (!asset) {
      return "Skipped asset removal because the asset was not found.";
    }
    removeAsset(asset.id);
    return `Removed ${asset.name}.`;
  }

  if (action.type === "set-planning-parameters") {
    const txAsset = findAssetByReference(action.txAssetId ?? action.txAssetName);
    const rxAsset = findAssetByReference(action.rxAssetId ?? action.rxAssetName);
    if (txAsset) {
      dom.planningTxAsset.value = txAsset.id;
    }
    if (rxAsset) {
      dom.planningRxAsset.value = rxAsset.id;
    }
    if (Number.isFinite(Number(action.gridMeters))) {
      dom.planningGridMeters.value = String(Number(action.gridMeters));
    }
    if (Number.isFinite(Number(action.minSeparation))) {
      dom.planningMinSeparation.value = String(Number(action.minSeparation));
    }
    if (Number.isFinite(Number(action.enemyWeight))) {
      dom.planningEnemyWeight.value = String(Number(action.enemyWeight));
    }
    if (Number.isFinite(Number(action.separationWeight))) {
      dom.planningSeparationWeight.value = String(Number(action.separationWeight));
    }
    if (Number.isFinite(Number(action.floorM))) {
      dom.planningFloorM.value = String(Number(action.floorM));
    }
    if (Number.isFinite(Number(action.ceilingM))) {
      dom.planningCeilingM.value = String(Number(action.ceilingM));
    }
    return "Updated planning inputs.";
  }

  if (action.type === "set-planning-region") {
    const polygon = Array.isArray(action.polygon) ? action.polygon : [];
    if (polygon.length < 3) {
      return "Skipped planning region update because the polygon was invalid.";
    }
    if (state.planning.regionLayer) {
      state.map.removeLayer(state.planning.regionLayer);
    }
    state.planning.regionLayer = L.polygon(polygon.map((point) => [point.lat, point.lon]), {
      color: "#f7b955",
      weight: 2,
      fillOpacity: 0.08,
      pane: getMapContentPaneName("planning-region"),
    }).addTo(state.map);
    if (typeof action.name === "string" && action.name.trim()) {
      state.planning.regionName = action.name.trim();
    }
    renderMapContents();
    return "Updated the planning region.";
  }

  if (action.type === "run-simulation") {
    // Resolve target asset: explicit assetId > placedIndex (into this batch's placed list) > name search > current select
    let simAsset = null;
    if (action.assetId) {
      // Could be a literal ID or one returned as "assetId=<uuid>" from a prior add-asset result
      simAsset = findAssetByReference(action.assetId);
    }
    if (!simAsset && Number.isFinite(Number(action.placedIndex)) && placedAssetIds[Number(action.placedIndex)]) {
      simAsset = state.assets.find((a) => a.id === placedAssetIds[Number(action.placedIndex)]);
    }
    if (!simAsset && action.assetName) {
      simAsset = findAssetByReference(action.assetName);
    }
    if (simAsset) {
      dom.assetSelect.value = simAsset.id;
    }
    // Ensure the select has the asset we want — if not found, abort to avoid running on wrong asset
    const targetId = simAsset?.id ?? dom.assetSelect.value;
    const targetAsset = state.assets.find((a) => a.id === targetId);
    if (!targetAsset) {
      return "Skipped run-simulation: no valid asset selected.";
    }
    dom.assetSelect.value = targetAsset.id;
    if (typeof action.propagationModel === "string") {
      dom.propagationModel.value = action.propagationModel;
    }
    if (Number.isFinite(Number(action.receiverHeight))) {
      dom.receiverHeight.value = String(Number(action.receiverHeight));
    }
    if (Number.isFinite(Number(action.gridMeters))) {
      dom.gridMeters.value = String(Number(action.gridMeters));
    }
    if (typeof action.radiusUnit === "string" && ["m", "km", "mi"].includes(action.radiusUnit)) {
      syncCoverageRadiusInput(action.radiusUnit, Number.isFinite(Number(action.radiusMeters)) ? Number(action.radiusMeters) : null);
      dom.radiusUnit.dataset.previousUnit = dom.radiusUnit.value;
    }
    if (Number.isFinite(Number(action.radiusMeters))) {
      setSimulationRadiusFromMeters(Number(action.radiusMeters), typeof action.radiusUnit === "string" ? action.radiusUnit : undefined);
      dom.radiusUnit.dataset.previousUnit = dom.radiusUnit.value;
    } else if (Number.isFinite(Number(action.radiusKm))) {
      setSimulationRadiusFromMeters(Number(action.radiusKm) * 1000, typeof action.radiusUnit === "string" ? action.radiusUnit : "km");
      dom.radiusUnit.dataset.previousUnit = dom.radiusUnit.value;
    }
    if (Number.isFinite(Number(action.opacity))) {
      dom.viewshedOpacity.value = String(Number(action.opacity));
    }
    await runSimulation();
    return `Started coverage generation for ${targetAsset.name}.`;
  }

  if (action.type === "run-planning") {
    await runPlanning();
    return "Started terrain-aware site planning.";
  }

  if (action.type === "toggle-3d") {
    const nextEnabled = typeof action.enabled === "boolean" ? action.enabled : !state.view3dEnabled;
    if (nextEnabled !== state.view3dEnabled) {
      await toggle3dView();
    }
    return nextEnabled ? "Switched to 3D view." : "Switched to 2D view.";
  }

  if (action.type === "draw-shape") {
    const rawCoords = Array.isArray(action.coordinates) ? action.coordinates : [];
    if (rawCoords.length === 0) return "Skipped draw-shape: no coordinates provided.";
    const toLatLng = (c) => ({ lat: Number(c.lat ?? c[0]), lng: Number(c.lon ?? c.lng ?? c[1]) });
    const shapeStyle = {
      color: typeof action.color === "string" ? action.color : DRAW_DEFAULTS.color,
      lineStyle: ["solid", "dashed", "dotted"].includes(action.lineStyle) ? action.lineStyle : DRAW_DEFAULTS.lineStyle,
      fillOpacity: Number.isFinite(Number(action.fillOpacity)) ? Number(action.fillOpacity) : DRAW_DEFAULTS.fillOpacity,
      weight: Number.isFinite(Number(action.weight)) ? Number(action.weight) : DRAW_DEFAULTS.weight,
    };
    const shapeType = (action.shapeType ?? "polygon").toLowerCase();
    let geometryType, coords, labelPrefix;

    if (shapeType === "circle") {
      const center = toLatLng(rawCoords[0]);
      const radiusM = Number(action.radiusM) || 1000;
      coords = circleToPolygonLatLngs(center, radiusM).map((p) => [p[0], p[1]]);
      geometryType = "Polygon";
      labelPrefix = action.name ?? "Circle";
    } else if (shapeType === "rectangle") {
      const pts = rawCoords.map(toLatLng);
      const a = pts[0], b = pts[pts.length > 1 ? 1 : 0];
      coords = [[a.lat, a.lng], [a.lat, b.lng], [b.lat, b.lng], [b.lat, a.lng]];
      geometryType = "Polygon";
      labelPrefix = action.name ?? "Rectangle";
    } else if (shapeType === "polyline" || (shapeType === "line")) {
      coords = rawCoords.map((c) => { const p = toLatLng(c); return [p.lat, p.lng]; });
      geometryType = "LineString";
      labelPrefix = action.name ?? "Line";
    } else {
      coords = rawCoords.map((c) => { const p = toLatLng(c); return [p.lat, p.lng]; });
      geometryType = "Polygon";
      labelPrefix = action.name ?? "Shape";
    }

    const index = state.importedItems.filter((i) => i.drawn).length;
    addDrawnFeature({
      name: `${labelPrefix} ${index + 1}`,
      geometryType,
      coordinates: coords,
      properties: {},
      shapeStyle,
    });
    return `Drew ${geometryType.toLowerCase()} shape "${labelPrefix}".`;
  }

  if (action.type === "update-shape") {
    const ref = action.shapeId ?? action.name;
    const item = state.importedItems.find((i) => i.drawn && (i.id === ref || i.name === ref));
    if (!item) return `Skipped update-shape: shape "${ref}" not found.`;
    if (typeof action.color === "string") item.shapeStyle.color = action.color;
    if (["solid", "dashed", "dotted"].includes(action.lineStyle)) item.shapeStyle.lineStyle = action.lineStyle;
    if (Number.isFinite(Number(action.fillOpacity))) item.shapeStyle.fillOpacity = Number(action.fillOpacity);
    if (Number.isFinite(Number(action.weight))) item.shapeStyle.weight = Number(action.weight);
    applyShapeStyleToLayer(item);
    if (Array.isArray(action.coordinates) && action.coordinates.length >= 2) {
      const pts = action.coordinates.map((c) => [Number(c.lat ?? c[0]), Number(c.lon ?? c.lng ?? c[1])]);
      item.layer.setLatLngs(pts);
    }
    saveMapState();
    syncCesiumEntities();
    return `Updated shape "${item.name}".`;
  }

  if (action.type === "remove-shape") {
    const ref = action.shapeId ?? action.name;
    const item = state.importedItems.find((i) => i.drawn && (i.id === ref || i.name === ref));
    if (!item) return `Skipped remove-shape: shape "${ref}" not found.`;
    removeImportedItem(item.id);
    return `Removed shape "${ref}".`;
  }

  // Check LOS between a set of candidate coordinates before committing to placement.
  // action.candidates: [{lat, lon, name, antennaHeightM?}]
  if (action.type === "check-los") {
    const terrain = getActiveTerrain();
    if (!terrain) {
      return "LOS check skipped: no DTED terrain loaded. Cannot verify line-of-sight.";
    }
    const candidates = Array.isArray(action.candidates) ? action.candidates : [];
    if (candidates.length < 2) {
      return "LOS check skipped: need at least 2 candidate positions.";
    }
    const links = buildLosMatrix(candidates.map((c) => ({
      lat: Number(c.lat),
      lon: Number(c.lon ?? c.lng),
      name: c.name ?? `Point ${candidates.indexOf(c) + 1}`,
      antennaHeightM: Number(c.antennaHeightM) || 2,
    })));
    const lines = links.map((l) =>
      l.losBlocked
        ? `BLOCKED: ${l.from} ↔ ${l.to} (${l.distanceKm} km) — obstruction at ${Math.round((l.obstructionFrac ?? 0.5) * 100)}% along path`
        : `CLEAR: ${l.from} ↔ ${l.to} (${l.distanceKm} km, ${l.minClearanceM} m clearance)`
    );
    return `LOS check results:\n${lines.join("\n")}`;
  }

  return `Skipped unsupported action type ${action.type}.`;
}

function normalizeAiEmitterData(source) {
  if (!source || typeof source !== "object") {
    return {};
  }
  const normalized = {};
  // Accept emitterType as the unambiguous alias; also accept type but only when it
  // doesn't look like an action discriminator (action types are hyphenated).
  const rawType = source.emitterType ?? source.type;
  if (typeof rawType === "string" && !rawType.includes("-")) {
    normalized.type = rawType;
  }
  ["force", "name", "unit", "icon", "color", "notes"].forEach((key) => {
    if (typeof source[key] !== "undefined") {
      normalized[key] = source[key];
    }
  });
  if (Number.isFinite(Number(source.frequencyMHz))) {
    normalized.frequencyMHz = Number(source.frequencyMHz);
  }
  if (Number.isFinite(Number(source.powerW))) {
    normalized.powerW = Number(source.powerW);
  }
  if (Number.isFinite(Number(source.antennaHeightM))) {
    normalized.antennaHeightM = Number(source.antennaHeightM);
  }
  if (Number.isFinite(Number(source.antennaGainDbi))) {
    normalized.antennaGainDbi = Number(source.antennaGainDbi);
  }
  if (Number.isFinite(Number(source.receiverSensitivityDbm))) {
    normalized.receiverSensitivityDbm = Number(source.receiverSensitivityDbm);
  }
  if (Number.isFinite(Number(source.systemLossDb))) {
    normalized.systemLossDb = Number(source.systemLossDb);
  }
  return normalized;
}

function findAssetByReference(reference) {
  if (!reference) return null;
  const ref = String(reference).trim();
  // 1. Exact ID match
  const byId = state.assets.find((a) => a.id === ref);
  if (byId) return byId;
  // 2. Exact name match (case-insensitive)
  const refLow = ref.toLowerCase();
  const byName = state.assets.find((a) => a.name.toLowerCase() === refLow);
  if (byName) return byName;
  // 3. The model sometimes sends "name (label)" or just the label part — try contains
  const byContains = state.assets.find((a) => a.name.toLowerCase().includes(refLow) || refLow.includes(a.name.toLowerCase()));
  if (byContains) return byContains;
  // 4. Strip parens content and retry ("PRC-163 (Peak 3)" → "PRC-163")
  const stripped = refLow.replace(/\s*\(.*?\)\s*/g, "").trim();
  if (stripped && stripped !== refLow) {
    const byStripped = state.assets.find((a) => a.name.toLowerCase().includes(stripped) || stripped.includes(a.name.toLowerCase().replace(/\s*\(.*?\)\s*/g, "").trim()));
    if (byStripped) return byStripped;
  }
  // 5. Unit field match
  const byUnit = state.assets.find((a) => a.unit && a.unit.toLowerCase() === refLow);
  if (byUnit) return byUnit;
  return null;
}

function resolveMapContentId(reference) {
  if (!reference) {
    return null;
  }
  const entries = getMapContentEntries();
  const direct = entries.find((entry) => entry.id === reference);
  if (direct) {
    return direct.id;
  }
  const byName = entries.find((entry) => entry.name.toLowerCase() === String(reference).toLowerCase());
  return byName?.id ?? null;
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
  if (state.draw.mode) {
    onDrawClick(event.latlng);
    return;
  }
  if (state.placingAsset) {
    addAsset(event.latlng);
    setAssetPlacementMode(false);
    setStatus("Emitter placed.");
    return;
  }

  if (state.activeInspectionViewshedId) {
    inspectSignalPoint(event.latlng);
  }
}

function setAssetPlacementMode(enabled) {
  state.placingAsset = Boolean(enabled);
  dom.map?.classList.toggle("asset-placement-active", state.placingAsset);
  dom.cesiumContainer?.classList.toggle("asset-placement-active", state.placingAsset);
}

function onMapContextMenu(event) {
  showPointTerrainPopup(event.latlng);
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
  // Use modal data if available (preferred), else fall back to hidden form fields
  const formData = state.pendingEmitterData ?? getEmitterFormData();
  state.pendingEmitterData = null;
  const asset = {
    id: generateId(),
    ...formData,
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

  saveMapState();
  if (!Number.isFinite(asset.groundElevationM) && usesConfiguredCesiumTerrain()) {
    refreshAssetGroundElevation(asset).catch(() => {});
  }
}

const EMITTER_ICONS = {
  // Antenna mast with two signal arcs — clearly a radio transmitter
  radio:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="22"/><path d="M8 9c0-2.2 1.8-4 4-4s4 1.8 4 4"/><path d="M5 6c0-3.9 3.1-7 7-7s7 3.1 7 7"/></svg>`,
  // Lightning bolt — jammer/disruptor
  jammer:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  // Two-headed arrow — relay/repeater
  relay:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M15 8l4 4-4 4"/><path d="M9 8L5 12l4 4"/></svg>`,
  // EKG waveform — receiver/listener
  receiver: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="2 12 6 12 9 4 12 20 15 12 18 12 22 12"/></svg>`,
  // Broadcast tower with base — fixed site
  tower:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="9" x2="12" y2="22"/><path d="M7 9a7 7 0 0 1 10 0"/><path d="M4 6a12 12 0 0 1 16 0"/><line x1="9" y1="22" x2="15" y2="22"/></svg>`,
  // Radar rings + center dot — sensor
  sensor:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M8.5 8.5a5 5 0 0 0 0 7"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M5.5 5.5a9 9 0 0 0 0 13"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>`,
};

function getAssetIconSvg(type) {
  return EMITTER_ICONS[type] ?? EMITTER_ICONS.radio;
}

function createEmitterIcon(asset) {
  const markerColor = asset.color || FORCE_COLORS[asset.force] || FORCE_COLORS.friendly;
  const type = EMITTER_ICONS[asset.type] ? asset.type : "radio";
  const svg = EMITTER_ICONS[type];
  return L.divIcon({
    className: "emitter-divicon-wrapper",
    html: `<div class="emitter-marker ${type}" style="background:${escapeHtml(markerColor)}">${svg}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
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
  if (!Number.isFinite(asset.groundElevationM) && usesConfiguredCesiumTerrain()) {
    refreshAssetGroundElevation(asset).catch(() => {});
  }
  saveMapState();
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
  if (dom.assetList) dom.assetList.innerHTML = "";
  dom.assetSelect.innerHTML = "";
  dom.planningTxAsset.innerHTML = "";
  dom.planningRxAsset.innerHTML = "";

  if (!state.assets.length) {
    if (dom.assetList) dom.assetList.innerHTML = `<div class="asset-item">No systems placed yet.</div>`;
    dom.assetSelect.innerHTML = `<option value="">No emitters available</option>`;
    dom.planningTxAsset.innerHTML = `<option value="">No assets</option>`;
    dom.planningRxAsset.innerHTML = `<option value="">No assets</option>`;
    renderMapContents();
    return;
  }

  state.assets.forEach((asset, index) => {
    if (dom.assetList) {
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
    }

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
  updateTerrainMenuValue();

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

function updateTerrainMenuValue() {
  if (!state.terrains.length) {
    const hasCesiumToken = dom.cesiumIonToken.value.trim().length > 0;
    dom.terrainMenuValue.textContent = hasCesiumToken ? "Cesium Terrain" : "No DTED";
    return;
  }

  const terrain = getActiveTerrain();
  if (terrain) {
    dom.terrainMenuValue.textContent = terrain.name;
    return;
  }

  dom.terrainMenuValue.textContent = `${state.terrains.length} Loaded`;
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
        ${formatCoverageArea(viewshed) ? `<span>${formatCoverageArea(viewshed)}</span>` : ""}
        <span>Radius ${formatCoverageRadius(viewshed)}</span>
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
        <input class="coverage-opacity-slider" type="range" min="0.15" max="1" step="0.05" value="${viewshed.opacity}" data-viewshed-action="opacity" data-viewshed-id="${viewshed.id}">
      </label>
    `;
    dom.viewshedList.appendChild(row);
  });

  dom.viewshedList.querySelectorAll("[data-viewshed-action]").forEach((control) => {
    const action = control.dataset.viewshedAction;
    if (action === "opacity") {
      updateRangeTrack(control);
      control.addEventListener("input", () => updateRangeTrack(control));
      control.addEventListener("input", onViewshedAction);
      return;
    }
    control.addEventListener("click", onViewshedAction);
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
    updateRangeTrack(event.currentTarget);
    const opacity = Number(event.currentTarget.value);
    viewshed.opacity = opacity;
    viewshed.layer.setOpacity(opacity);
    renderViewsheds();
    syncCesiumEntities();
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
  syncCesiumEntities();
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
  syncCesiumEntities();
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
      fill: false,
      dashArray: "8 4",
      interactive: false,
    },
  ).addTo(state.map);
  layer.bindTooltip(`${terrain.name} terrain coverage`, { sticky: true });
  state.terrainCoverageLayers.set(terrain.id, layer);
  renderMapContents();
  syncCesiumEntities();
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
  syncCesiumEntities();
}

function updateTerrainSummary() {
  const terrain = getActiveTerrain();
  if (!terrain) {
    dom.terrainSummary.textContent = "No terrain loaded. Propagation uses free-space or terrain diffraction only.";
    updateTerrainMenuValue();
    return;
  }

  dom.terrainSummary.textContent =
    `Active terrain: ${terrain.name}. ${terrain.rows} x ${terrain.cols} posts with ` +
    `${terrain.latStepDeg.toFixed(6)} x ${terrain.lonStepDeg.toFixed(6)} degree spacing.`;
  updateTerrainMenuValue();
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
  saveMapState();
  setStatus("All emitters removed.");
}

function updateWeatherState() {
  state.weather.temperatureC = parseTemperatureInput(dom.tempC.value);
  state.weather.humidity = Number(dom.humidity.value);
  state.weather.pressureHpa = parsePressureInput(dom.pressure.value);
  state.weather.windSpeedMps = parseWindSpeedInput(dom.windSpeed.value);
  state.weather.source = "manual";
  if (state.weather.source === "manual") {
    dom.weatherSummary.textContent = "Manual weather profile active.";
  }
  updateWeatherMenuValue();
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
    updateWeatherMenuValue();
    setStatus("Weather updated.");
  } catch (error) {
    state.weather.source = "manual";
    dom.weatherSummary.textContent = "Weather fetch failed. Manual values remain active.";
    updateWeatherMenuValue();
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
    terrain.id = generateId();
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
        requestId: state.editingViewshedId ?? generateId(),
        asset: selected,
        weather: state.weather,
        terrainId,
        radiusMeters: getSimulationRadiusMeters(),
        radiusUnit: getSelectedCoverageRadiusUnit(),
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
    radiusUnit: payload.radiusUnit || getDefaultCoverageRadiusUnit(),
    receiverHeight: payload.receiverHeight,
    opacity: payload.opacity,
    propagationModel: payload.propagationModel,
    propagationModelLabel: propagationModelLabel(payload.propagationModel),
    cellCount: latitudes.length,
    gridLatStepDeg: payload.gridLatStepDeg,
    gridLonStepDeg: payload.gridLonStepDeg,
    latitudes,
    longitudes,
    rssi,
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
  syncCesiumEntities();
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
  if (!dom.statusBadge) {
    return;
  }
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
        id: generateId(),
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
    ...(existing ?? { id: generateId() }),
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

async function exportAssetsZip() {
  if (!state.assets.length) {
    setStatus("No emitters to export.", true);
    return;
  }
  const slug = timestampSlug();
  const featureCollection = {
    type: "FeatureCollection",
    features: state.assets.map((asset) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: [asset.lon, asset.lat] },
      properties: { ...asset, exportedAt: new Date().toISOString() },
    })),
  };
  const zip = new window.JSZip();
  zip.file(`emitters-${slug}.geojson`, JSON.stringify(featureCollection, null, 2));
  zip.file(`emitters-${slug}.kml`, buildKmlDocument());
  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(blob, `emitters-${slug}.zip`);
  setStatus("ZIP exported.");
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
  if (!window.isSecureContext) {
    const message = "Browser GPS requires HTTPS or localhost. This page is not in a secure context.";
    setGpsStatusMessage(message, true);
    setStatus(message, true);
    return;
  }

  if (!navigator.geolocation) {
    const message = "Geolocation API is not available in this browser.";
    setGpsStatusMessage(message, true);
    setStatus(message, true);
    return;
  }

  if (state.gps.geolocationWatchId !== null) {
    navigator.geolocation.clearWatch(state.gps.geolocationWatchId);
  }

  state.gps.geolocationWatchId = navigator.geolocation.watchPosition(
    (position) => {
      setGpsStatusMessage("Browser GPS is active.");
      applyGpsFix({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        accuracyM: position.coords.accuracy ?? null,
      }, "browser");
    },
    (error) => {
      const message = `Browser GPS failed: ${error.message}`;
      setGpsStatusMessage(message, true);
      setStatus(message, true);
    },
    { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 },
  );

  setGpsStatusMessage("Waiting for browser GPS permission or first fix...");
  setStatus("Browser GPS connected.");
}

async function connectUsbGps() {
  if (!window.isSecureContext) {
    const message = "USB GPS requires HTTPS or localhost. This page is not in a secure context.";
    setGpsStatusMessage(message, true);
    setStatus(message, true);
    return;
  }

  if (!("serial" in navigator)) {
    const message = "Web Serial is not supported in this browser. Use Chrome or Edge over HTTPS.";
    setGpsStatusMessage(message, true);
    setStatus(message, true);
    return;
  }

  try {
    setGpsStatusMessage("Waiting for USB GPS device selection...");
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });
    state.gps.serialPort = port;
    state.gps.serialReader = port.readable.getReader();
    state.gps.mode = "usb";
    dom.gpsStatusValue.textContent = "USB GPS Connected";
    setGpsStatusMessage("USB GPS connected. Waiting for NMEA sentences...");
    setStatus("USB GPS connected. Waiting for NMEA sentences...");
    readUsbGpsLoop();
  } catch (error) {
    const message = error?.name === "NotFoundError"
      ? "USB GPS device selection was canceled."
      : `USB GPS failed: ${error.message}`;
    setGpsStatusMessage(message, true);
    setStatus(message, true);
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
    const message = `USB GPS read failed: ${error.message}`;
    setGpsStatusMessage(message, true);
    setStatus(message, true);
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
  state.gps.statusIsError = false;
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

    state.pendingPlanningRequestId = generateId();
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
  if (!state.view3dEnabled) removeCesium3dTerrainPopup();

  if (state.view3dEnabled) {
    await initCesiumIfNeeded();
    await syncCesiumScene();
    syncCesiumEntities();
    updateCesiumCompass();
  } else if (state.cesiumViewer) {
    // Sync camera back to Leaflet when returning to 2D
    const carto = window.Cesium.Cartographic.fromCartesian(
      state.cesiumViewer.camera.positionWC,
    );
    if (carto) {
      const lat = window.Cesium.Math.toDegrees(carto.latitude);
      const lng = window.Cesium.Math.toDegrees(carto.longitude);
      const zoom = Math.round(Math.log2(40000000 / Math.max(carto.height, 100)));
      state.map.setView([lat, lng], Math.min(Math.max(zoom, 2), 18), { animate: false });
    }
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

  state.cesiumViewer.camera.percentageChanged = 0.05;
  state.cesiumViewer.camera.changed.addEventListener(updateCesiumCompass);

  // Redraw terrain-clamped gridlines when the 3D camera moves.
  let _gridRafId = null;
  state.cesiumViewer.camera.changed.addEventListener(() => {
    if (!state.settings?.gridLinesEnabled) return;
    if (_gridRafId) return;
    _gridRafId = requestAnimationFrame(() => { _gridRafId = null; syncCesiumEntities(); });
  });

  const handler = new window.Cesium.ScreenSpaceEventHandler(state.cesiumViewer.scene.canvas);
  handler.setInputAction((click) => {
    removeCesium3dTerrainPopup();
    if (!state.placingAsset) return;
    const ray = state.cesiumViewer.camera.getPickRay(click.position);
    const cartesian = state.cesiumViewer.scene.globe.pick(ray, state.cesiumViewer.scene);
    if (!cartesian) return;
    const carto = window.Cesium.Cartographic.fromCartesian(cartesian);
    const lat = window.Cesium.Math.toDegrees(carto.latitude);
    const lon = window.Cesium.Math.toDegrees(carto.longitude);
    addAsset({ lat, lng: lon });
    setAssetPlacementMode(false);
    setStatus("Emitter placed.");
  }, window.Cesium.ScreenSpaceEventType.LEFT_CLICK);

  handler.setInputAction((click) => {
    const ray = state.cesiumViewer.camera.getPickRay(click.position);
    const cartesian = state.cesiumViewer.scene.globe.pick(ray, state.cesiumViewer.scene);
    if (!cartesian) return;
    const carto = window.Cesium.Cartographic.fromCartesian(cartesian);
    const lat = window.Cesium.Math.toDegrees(carto.latitude);
    const lon = window.Cesium.Math.toDegrees(carto.longitude);
    showCesium3dTerrainPopup(lat, lon, click.position);
  }, window.Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

function showCesium3dTerrainPopup(lat, lon, screenPos) {
  removeCesium3dTerrainPopup();

  const canvas = state.cesiumViewer.scene.canvas;
  const canvasRect = canvas.getBoundingClientRect();

  const overlay = document.createElement("div");
  overlay.id = "cesium-terrain-popup";
  overlay.style.cssText = `
    position: fixed;
    left: ${canvasRect.left + screenPos.x}px;
    top: ${canvasRect.top + screenPos.y}px;
    transform: translate(-50%, -110%);
    background: rgba(30,30,30,0.92);
    color: #f0f0f0;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13px;
    line-height: 1.6;
    pointer-events: auto;
    z-index: 9999;
    white-space: nowrap;
    box-shadow: 0 2px 8px rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.15);
  `;
  overlay.innerHTML = buildPointTerrainPopup(lat, lon, null).replace("No terrain", "Loading terrain...");

  const closeBtn = document.createElement("span");
  closeBtn.textContent = " ×";
  closeBtn.style.cssText = "cursor:pointer;opacity:0.6;margin-left:8px;font-size:15px;";
  closeBtn.onclick = removeCesium3dTerrainPopup;
  overlay.appendChild(closeBtn);

  document.body.appendChild(overlay);

  const cachedElevation = sampleTerrainElevation(lat, lon);
  if (cachedElevation !== null) {
    overlay.innerHTML = buildPointTerrainPopup(lat, lon, cachedElevation);
    overlay.appendChild(closeBtn);
    return;
  }

  sampleTerrainElevationAsync(lat, lon)
    .then((elevationM) => {
      const el = document.getElementById("cesium-terrain-popup");
      if (!el) return;
      el.innerHTML = buildPointTerrainPopup(lat, lon, elevationM);
      el.appendChild(closeBtn);
    })
    .catch(() => {
      const el = document.getElementById("cesium-terrain-popup");
      if (!el) return;
      el.innerHTML = buildPointTerrainPopup(lat, lon, null);
      el.appendChild(closeBtn);
    });
}

function removeCesium3dTerrainPopup() {
  const el = document.getElementById("cesium-terrain-popup");
  if (el) el.remove();
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

    const mapCenter = state.map.getCenter();
    const zoom = state.map.getZoom();
    const altitudeMeters = zoomToAltitude(zoom);

    viewer.camera.flyTo({
      destination: window.Cesium.Cartesian3.fromDegrees(mapCenter.lng, mapCenter.lat, altitudeMeters),
      orientation: {
        heading: 0,
        pitch: window.Cesium.Math.toRadians(-90),
        roll: 0,
      },
      duration: 0,
    });
    updateCesiumCompass();
  } catch (error) {
    setStatus(`3D scene error: ${error.message}`, true);
  }
}

function zoomToAltitude(zoom) {
  // Approximate altitude in meters for a given Leaflet zoom level (top-down view)
  return 40000000 / Math.pow(2, zoom);
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

  if (!usesConfiguredCesiumTerrain()) {
    return null;
  }

  const radiusMeters = getSimulationRadiusMeters();
  const bounds = boundsFromCenter(asset.lat, asset.lon, radiusMeters);
  return await ensureIonTerrainGrid(bounds, Number(dom.gridMeters.value), `sim:${asset.id}:${radiusMeters}:${dom.gridMeters.value}`);
}

async function resolveTerrainIdForPlanning(polygon, gridMeters) {
  if (state.activeTerrainId) {
    await ensureTerrainReady(state.activeTerrainId);
    return state.activeTerrainId;
  }

  if (!usesConfiguredCesiumTerrain()) {
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

  setStatus("Sampling Cesium terrain for propagation...");
  const terrain = await sampleCesiumTerrainGrid(bounds, gridMeters, cacheKey);
  state.ionTerrainCache.set(cacheKey, terrain);
  await cacheTerrainInWorker(terrain);
  return terrain.id;
}

async function sampleCesiumTerrainGrid(bounds, gridMeters, cacheKey) {
  const provider = await getConfiguredCesiumTerrainProvider();
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
    name: dom.terrainSourceSelect.value === "custom" ? "Custom Cesium Terrain" : "Cesium World Terrain",
    origin: { lat: bounds.sw.lat, lon: bounds.sw.lon },
    bounds,
    rows,
    cols,
    latStepDeg,
    lonStepDeg,
    elevations,
  };
}

async function getConfiguredCesiumTerrainProvider() {
  if (!usesConfiguredCesiumTerrain()) {
    return null;
  }

  if (dom.terrainSourceSelect.value === "custom") {
    const url = dom.customTerrainUrl.value.trim();
    if (!url) {
      throw new Error("Enter a custom terrain URL first.");
    }
    const providerKey = buildCesiumTerrainProviderKey();
    if (!state.cesiumTerrainProvider || state.cesiumTerrainProviderKey !== providerKey) {
      state.cesiumTerrainProvider = await window.Cesium.CesiumTerrainProvider.fromUrl(url);
      state.cesiumTerrainProviderKey = providerKey;
    }
    return state.cesiumTerrainProvider;
  }

  return await getCesiumWorldTerrainProvider();
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

function buildPointTerrainPopup(lat, lon, elevationM) {
  const mgrsLabel = formatCoordinate(lat, lon, "mgrs");
  const activeLabel = state.settings.coordinateSystem === "mgrs"
    ? ""
    : `<br>Position: ${escapeHtml(formatCoordinate(lat, lon, state.settings.coordinateSystem))}`;
  const elevationLabel = elevationM === null ? "No terrain" : formatElevation(elevationM);
  return `
    Grid: ${escapeHtml(mgrsLabel)}${activeLabel}<br>
    Elevation: ${escapeHtml(elevationLabel)}
  `;
}

function showPointTerrainPopup(latlng) {
  const lat = latlng.lat;
  const lon = latlng.lng;
  const cachedElevationM = sampleTerrainElevation(lat, lon);
  const popup = L.popup()
    .setLatLng([lat, lon])
    .setContent(buildPointTerrainPopup(lat, lon, cachedElevationM))
    .openOn(state.map);

  if (cachedElevationM !== null || !usesConfiguredCesiumTerrain()) {
    return;
  }

  popup.setContent(buildPointTerrainPopup(lat, lon, null).replace("No terrain", "Loading terrain..."));
  sampleTerrainElevationAsync(lat, lon)
    .then((elevationM) => {
      if (state.map?._popup !== popup) {
        return;
      }
      popup.setContent(buildPointTerrainPopup(lat, lon, elevationM));
    })
    .catch(() => {
      if (state.map?._popup !== popup) {
        return;
      }
      popup.setContent(buildPointTerrainPopup(lat, lon, null));
    });
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
    // Asset markers need pointer events for popups/drag; everything else
    // (viewsheds, terrain coverage, planning overlays) must not absorb clicks.
    const isAsset = contentId.startsWith("asset:");
    pane.style.zIndex = isAsset ? "620" : "410";
    if (!isAsset) pane.style.pointerEvents = "none";
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
      assetType: asset.type,
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
      geometryType: item.geometryType,
      drawn: item.drawn ?? false,
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
      state.mapContentOrder.push(id);
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

function getMapContentTypeIcon(entry) {
  const s = (path, extra = "") => `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${path}</svg>`;

  if (entry.kind === "folder") {
    return s(`<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>`);
  }
  if (entry.kind === "asset") {
    // Reuse the same icon SVG inner content as the map marker, just resized
    const t = EMITTER_ICONS[entry.assetType] ? entry.assetType : "radio";
    const inner = EMITTER_ICONS[t].replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
    return s(inner);
  }
  if (entry.kind === "viewshed") {
    return s(`<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`);
  }
  if (entry.kind === "terrain") {
    return s(`<polygon points="3 20 9 4 15 14 19 10 23 20"/>`);
  }
  if (entry.kind === "planning-region" || entry.kind === "planning-results") {
    return s(`<polygon points="3 11 12 2 21 11 21 21 3 21"/>`);
  }
  // imported / drawn shapes
  const geo = entry.geometryType;
  if (geo === "LineString") return s(`<polyline points="3 17 9 11 13 15 21 7"/>`);
  if (geo === "Point")      return s(`<circle cx="12" cy="12" r="3"/><path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z"/>`);
  // polygon / circle / rectangle
  return s(`<polygon points="12 2 22 19 2 19"/>`);
}

function buildMapContentRow(entry, isChild = false) {
  const row = document.createElement("article");
  row.className = "asset-item map-content-item";
  row.draggable = true;
  row.dataset.contentId = entry.id;
  const isFolder = entry.kind === "folder";
  const canFocus = !isFolder;
  if (isChild) row.dataset.child = "true";
  const isHidden = state.hiddenContentIds.has(entry.id);
  if (isHidden) row.dataset.hidden = "true";
  if (state.mcSelectMode && state.mcSelectedIds.has(entry.id)) row.classList.add("mc-selected");

  const folder = isFolder ? state.mapContentFolders.find((f) => `folder:${f.id}` === entry.id) : null;
  const isCollapsed = folder?.collapsed ?? false;

  const eyeOpen = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const eyeOff = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
  const chevronDown = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;
  const chevronRight = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

  row.innerHTML = `
    <div class="map-content-row">
      <div class="map-content-grip">::</div>
      ${isFolder ? `<button class="map-content-collapse-btn" type="button" aria-label="${isCollapsed ? "Expand" : "Collapse"}">${isCollapsed ? chevronRight : chevronDown}</button>` : ""}
      <span class="map-content-type-icon">${getMapContentTypeIcon(entry)}</span>
      <div class="map-content-copy">
        <strong>${escapeHtml(entry.name)}</strong>
        <span>${escapeHtml(entry.subtitle)}</span>
      </div>
      ${canFocus ? `<button class="ghost-button small map-content-focus-button" type="button" aria-label="Center map on ${escapeHtml(entry.name)}">
        <span class="map-content-focus-icon" aria-hidden="true">
          <span class="map-content-focus-ring outer"></span>
          <span class="map-content-focus-ring inner"></span>
          <span class="map-content-focus-dot"></span>
        </span>
      </button>` : ""}
      ${canFocus ? `<button class="map-content-visibility-btn${isHidden ? " hidden-layer" : ""}" type="button" aria-label="${isHidden ? "Show" : "Hide"}" title="${isHidden ? "Show" : "Hide"}">${isHidden ? eyeOff : eyeOpen}</button>` : ""}
    </div>
  `;

  row.addEventListener("click", (event) => {
    if (state.mcSelectMode) {
      const allRows = [...dom.mapContentsList.querySelectorAll(".map-content-item")];
      const allIds = allRows.map((r) => r.dataset.contentId);
      onMcItemClick(event, entry.id, allIds);
    } else {
      focusMapContent(entry.id);
    }
  });
  row.querySelector(".map-content-collapse-btn")?.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleFolderCollapsed(entry.id);
  });
  row.querySelector(".map-content-focus-button")?.addEventListener("click", (event) => {
    event.stopPropagation();
    focusMapContent(entry.id);
  });
  row.querySelector(".map-content-visibility-btn")?.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleContentVisibility(entry.id);
  });
  row.addEventListener("contextmenu", (event) => openMapContentsMenu(event, entry.id));
  row.addEventListener("dragstart", onMapContentDragStart);
  row.addEventListener("dragover", onMapContentDragOver);
  row.addEventListener("dragleave", onMapContentDragLeave);
  row.addEventListener("drop", onMapContentDrop);
  row.addEventListener("dragend", onMapContentDragEnd);
  return row;
}

function renderMapContents() {
  if (!dom.mapContentsList) {
    console.error("[renderMapContents] dom.mapContentsList is null — element not found");
    return;
  }
  const entries = getMapContentEntries();

  // Rebuild order from scratch to guarantee it always matches current entries
  const entryIds = entries.map((e) => e.id);
  // Keep any existing order for IDs we know about, append any new ones
  const knownOrdered = state.mapContentOrder.filter((id) => entryIds.includes(id));
  const missing = entryIds.filter((id) => !knownOrdered.includes(id));
  state.mapContentOrder = [...knownOrdered, ...missing];

  dom.mapContentsList.innerHTML = "";

  if (!entries.length) {
    dom.mapContentsList.innerHTML = '<div class="map-contents-empty">Add an emitter or a shape.</div>';
    return;
  }

  const entryMap = new Map(entries.map((entry) => [entry.id, entry]));
  const folderIds = new Set(state.mapContentFolders.map((folder) => `folder:${folder.id}`));
  const rendered = new Set();

  // Render in order; fall back to entry order if mapContentOrder is empty
  const orderToUse = state.mapContentOrder.length ? state.mapContentOrder : entryIds;

  orderToUse.forEach((contentId) => {
    if (rendered.has(contentId)) {
      return;
    }

    const entry = entryMap.get(contentId);
    if (!entry) {
      return;
    }

    if (folderIds.has(contentId)) {
      const folder = state.mapContentFolders.find((f) => `folder:${f.id}` === contentId);
      const isCollapsed = folder?.collapsed ?? false;
      const folderRow = buildMapContentRow(entry);
      dom.mapContentsList.appendChild(folderRow);
      rendered.add(contentId);

      const childIds = state.mapContentOrder.filter((id) => getMapContentFolderId(id) === contentId && entryMap.has(id));
      childIds.forEach((childId) => rendered.add(childId));
      if (childIds.length && !isCollapsed) {
        const childWrap = document.createElement("div");
        childWrap.className = "map-content-folder-children";
        childIds.forEach((childId) => {
          const childEntry = entryMap.get(childId);
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

  // Safety net: render any entries that slipped through (e.g. order/ID mismatch from old saves)
  entries.forEach((entry) => {
    if (!rendered.has(entry.id)) {
      dom.mapContentsList.appendChild(buildMapContentRow(entry));
      rendered.add(entry.id);
    }
  });

  applyMapContentOrder();
  updateMcSelectToolbar();
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
  saveMapState();
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

  state.ai.activeContextId = contentId;

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
  const simulateButton = dom.mapContentsMenu.querySelector('[data-map-content-action="simulate"]');
  if (simulateButton) {
    simulateButton.classList.toggle("hidden", !contentId.startsWith("asset:"));
  }
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

  if (action === "simulate") {
    openSimulationForContent(contentId);
    return;
  }

  if (action === "delete") {
    pushUndoSnapshot([contentId], `Deleted item`);
    deleteMapContent(contentId);
    showUndoBanner("Item deleted — Undo?");
  }
}

function openSimulationModal() {
  if (dom.radiusUnit && !dom.radiusUnit.value) {
    syncCoverageRadiusInput(getDefaultCoverageRadiusUnit());
  }
  if (dom.radiusUnit) {
    dom.radiusUnit.dataset.previousUnit = dom.radiusUnit.value || getDefaultCoverageRadiusUnit();
  }
  dom.simulationModal?.classList.remove("hidden");
  document.body.classList.add("emitter-modal-open");
}

function closeSimulationModal() {
  dom.simulationModal?.classList.add("hidden");
  document.body.classList.remove("emitter-modal-open");
  state.editingViewshedId = null;
  refreshActionButtons();
}

function setSimulationModalAsset(asset) {
  if (!asset) {
    dom.assetSelect.value = "";
    if (dom.simulationAssetSummary) {
      dom.simulationAssetSummary.textContent = "No emitter selected";
    }
    return;
  }
  dom.assetSelect.value = asset.id;
  if (dom.simulationAssetSummary) {
    dom.simulationAssetSummary.textContent = `${asset.name} | ${asset.frequencyMHz} MHz | ${asset.powerW} W`;
  }
}

function openSimulationForContent(contentId) {
  if (contentId.startsWith("asset:")) {
    const asset = state.assets.find((entry) => entry.id === contentId.slice("asset:".length));
    if (!asset) {
      return;
    }
    state.editingViewshedId = null;
    setSimulationModalAsset(asset);
    refreshActionButtons();
    openSimulationModal();
    setStatus(`Configuring RF simulation for ${asset.name}.`);
    return;
  }

  if (contentId.startsWith("viewshed:")) {
    const viewshed = state.viewsheds.find((entry) => entry.id === contentId.slice("viewshed:".length));
    if (!viewshed) {
      return;
    }
    state.editingViewshedId = viewshed.id;
    setSimulationModalAsset(viewshed.asset);
    dom.propagationModel.value = viewshed.propagationModel;
    dom.receiverHeight.value = viewshed.receiverHeight;
    dom.viewshedOpacity.value = viewshed.opacity;
    updateRangeTrack(dom.viewshedOpacity);
    setSimulationRadiusFromMeters(viewshed.radiusMeters, viewshed.radiusUnit || getDefaultCoverageRadiusUnit());
    dom.radiusUnit.dataset.previousUnit = dom.radiusUnit.value;
    refreshActionButtons();
    openSimulationModal();
    setStatus(`Editing ${viewshed.name}. Adjust the simulation inputs and click Update Coverage.`);
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
  saveMapState();
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
    setAssetPlacementMode(false);
    emitterModal.open(asset);
    refreshActionButtons();
    setStatus(`Editing ${asset.name}.`);
    return;
  }

  if (contentId.startsWith("viewshed:")) {
    openSimulationForContent(contentId);
    return;
  }

  if (contentId.startsWith("terrain:")) {
    closeImageryMenu();
    closeGpsMenu();
    closeSettingsMenu();
    state.terrainMenuOpen = true;
    dom.terrainMenu.classList.remove("hidden");
    dom.terrainMenuBtn.setAttribute("aria-expanded", "true");
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
    if (!item) return;
    if (item.drawn) {
      const menuEl = dom.mapContentsMenu;
      openShapeStylePanel(item, menuEl);
    } else {
      toggleImportedItemEditing(item);
    }
  }
}

function addMapContentFolder() {
  const folder = {
    id: generateId(),
    name: `Folder ${state.mapContentFolders.length + 1}`,
    collapsed: false,
  };
  state.mapContentFolders.push(folder);
  state.mapContentOrder.push(`folder:${folder.id}`);
  renderMapContents();
  saveMapState();
}

function toggleFolderCollapsed(folderId) {
  const folder = state.mapContentFolders.find((f) => `folder:${f.id}` === folderId);
  if (!folder) return;
  folder.collapsed = !folder.collapsed;
  renderMapContents();
  saveMapState();
}

// ── Multi-select ─────────────────────────────────────────────────────────────

function toggleMcSelectMode() {
  state.mcSelectMode = !state.mcSelectMode;
  if (!state.mcSelectMode) {
    state.mcSelectedIds.clear();
    state.mcLastClickedId = null;
  }
  dom.mcSelectBtn.setAttribute("aria-pressed", String(state.mcSelectMode));
  renderMapContents();
}

function getOrCreateMcSelectToolbar() {
  const card = dom.mapContentsList.closest(".map-contents-card");
  let toolbar = card.querySelector(".mc-select-toolbar");
  if (!toolbar) {
    toolbar = document.createElement("div");
    toolbar.className = "mc-select-toolbar";
    toolbar.innerHTML = `
      <span class="mc-select-count"></span>
      <button class="mc-select-delete-btn" type="button" disabled>
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
        Delete selected
      </button>`;
    toolbar.querySelector(".mc-select-delete-btn").addEventListener("click", deleteSelectedMcItems);
    card.appendChild(toolbar);
  }
  return toolbar;
}

function updateMcSelectToolbar() {
  const card = dom.mapContentsList.closest(".map-contents-card");
  const existing = card.querySelector(".mc-select-toolbar");
  if (!state.mcSelectMode) {
    existing?.remove();
    return;
  }
  const toolbar = getOrCreateMcSelectToolbar();
  const n = state.mcSelectedIds.size;
  toolbar.querySelector(".mc-select-count").textContent =
    n === 0 ? "No items selected" : `${n} item${n === 1 ? "" : "s"} selected`;
  toolbar.querySelector(".mc-select-delete-btn").disabled = n === 0;
}

function onMcItemClick(event, contentId, allIds) {
  if (!state.mcSelectMode) return;
  event.stopPropagation();

  if (event.shiftKey && state.mcLastClickedId && allIds.includes(state.mcLastClickedId)) {
    const a = allIds.indexOf(state.mcLastClickedId);
    const b = allIds.indexOf(contentId);
    const [lo, hi] = a < b ? [a, b] : [b, a];
    allIds.slice(lo, hi + 1).forEach((id) => state.mcSelectedIds.add(id));
  } else if (event.ctrlKey || event.metaKey) {
    if (state.mcSelectedIds.has(contentId)) {
      state.mcSelectedIds.delete(contentId);
    } else {
      state.mcSelectedIds.add(contentId);
    }
    state.mcLastClickedId = contentId;
  } else {
    // Plain click: toggle this item, deselect others
    const wasSelected = state.mcSelectedIds.has(contentId);
    state.mcSelectedIds.clear();
    if (!wasSelected) state.mcSelectedIds.add(contentId);
    state.mcLastClickedId = contentId;
  }

  // Reflect selection visually without full re-render
  dom.mapContentsList.querySelectorAll(".map-content-item").forEach((row) => {
    row.classList.toggle("mc-selected", state.mcSelectedIds.has(row.dataset.contentId));
  });
  updateMcSelectToolbar();
}

function deleteSelectedMcItems() {
  if (state.mcSelectedIds.size === 0) return;
  const ids = [...state.mcSelectedIds];
  const label = `Deleted ${ids.length} item${ids.length === 1 ? "" : "s"}`;
  pushUndoSnapshot(ids, label);
  state.mcSelectedIds.clear();
  state.mcLastClickedId = null;
  ids.forEach((id) => deleteMapContent(id));
  updateMcSelectToolbar();
  showUndoBanner(`${label} — Undo?`);
}

// ── Undo ──────────────────────────────────────────────────────────────────────

function snapshotContentId(contentId) {
  // Capture enough state to restore this content item.
  if (contentId.startsWith("asset:")) {
    const id = contentId.slice("asset:".length);
    const asset = state.assets.find((a) => a.id === id);
    if (!asset) return null;
    const assignment = state.mapContentAssignments.get(contentId);
    const orderIdx = state.mapContentOrder.indexOf(contentId);
    const snap = { asset: JSON.parse(JSON.stringify(asset)), assignment, orderIdx };
    return {
      contentId,
      restore() {
        if (state.assets.find((a) => a.id === snap.asset.id)) return;
        state.assets.push(snap.asset);
        if (snap.assignment) state.mapContentAssignments.set(contentId, snap.assignment);
        if (snap.orderIdx >= 0) {
          state.mapContentOrder.splice(Math.min(snap.orderIdx, state.mapContentOrder.length), 0, contentId);
        } else {
          state.mapContentOrder.push(contentId);
        }
        renderAssets();
        renderMapContents();
        syncCesiumEntities();
        saveMapState();
      },
    };
  }

  if (contentId.startsWith("folder:")) {
    const id = contentId.slice("folder:".length);
    const folder = state.mapContentFolders.find((f) => f.id === id);
    if (!folder) return null;
    const orderIdx = state.mapContentOrder.indexOf(contentId);
    const snap = { folder: JSON.parse(JSON.stringify(folder)), orderIdx };
    return {
      contentId,
      restore() {
        if (state.mapContentFolders.find((f) => f.id === snap.folder.id)) return;
        state.mapContentFolders.push(snap.folder);
        if (snap.orderIdx >= 0) {
          state.mapContentOrder.splice(Math.min(snap.orderIdx, state.mapContentOrder.length), 0, contentId);
        } else {
          state.mapContentOrder.push(contentId);
        }
        renderMapContents();
        saveMapState();
      },
    };
  }

  if (contentId.startsWith("imported:")) {
    const id = contentId.slice("imported:".length);
    const item = state.importedItems.find((i) => i.id === id);
    if (!item) return null;
    const assignment = state.mapContentAssignments.get(contentId);
    const orderIdx = state.mapContentOrder.indexOf(contentId);
    const snap = { item, assignment, orderIdx };
    return {
      contentId,
      restore() {
        if (state.importedItems.find((i) => i.id === snap.item.id)) return;
        state.importedItems.push(snap.item);
        if (!state.map.hasLayer(snap.item.layer)) snap.item.layer.addTo(state.map);
        if (snap.assignment) state.mapContentAssignments.set(contentId, snap.assignment);
        if (snap.orderIdx >= 0) {
          state.mapContentOrder.splice(Math.min(snap.orderIdx, state.mapContentOrder.length), 0, contentId);
        } else {
          state.mapContentOrder.push(contentId);
        }
        renderMapContents();
        saveMapState();
      },
    };
  }

  // Viewsheds, terrain, planning items — not easily reversible; skip
  return null;
}

function pushUndoSnapshot(contentIds, label) {
  const snapshots = contentIds.map(snapshotContentId).filter(Boolean);
  if (!snapshots.length) return;
  state.undoStack.push({ label, snapshots });
  if (state.undoStack.length > 20) state.undoStack.shift();
}

function performUndo() {
  const entry = state.undoStack.pop();
  if (!entry) return;
  // Restore in reverse order to preserve ordering
  [...entry.snapshots].reverse().forEach((s) => s.restore());
  dismissUndoBanner();
  setStatus(`Undid: ${entry.label}`);
}

function showUndoBanner(label) {
  clearTimeout(state.undoBannerTimerId);
  dom.undoBannerMsg.textContent = label;
  dom.undoBanner.classList.remove("hidden");
  state.undoBannerTimerId = setTimeout(dismissUndoBanner, 8000);
}

function dismissUndoBanner() {
  clearTimeout(state.undoBannerTimerId);
  state.undoBannerTimerId = null;
  dom.undoBanner.classList.add("hidden");
}

// ── deleteMapContent (with undo) ──────────────────────────────────────────────

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
    saveMapState();
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
  saveMapState();
  if (asset) {
    setStatus(`Removed ${asset.name}.`);
  }
}

function renderImportedItemPopup(item) {
  const detailLines = buildImportedItemDetailLines(item);
  return `
    <strong>${escapeHtml(item.name)}</strong><br>
    ${escapeHtml(item.subtitle)}
    ${detailLines.length ? `<br>${detailLines.map((line) => escapeHtml(line)).join("<br>")}` : ""}
  `;
}

function buildImportedItemDetailLines(item) {
  if (!item?.layer) {
    return [];
  }

  const lines = [];
  const isCircle = Boolean(item.properties?.isCircle && Number.isFinite(Number(item.properties?.radiusM)));
  if (isCircle) {
    lines.push(`Radius: ${formatDistance(Number(item.properties.radiusM))}`);
  }

  if (item.geometryType === "LineString") {
    const lengthMeters = measureLatLngPath(item.layer.getLatLngs());
    if (lengthMeters > 0) {
      lines.push(`Length: ${formatDistance(lengthMeters)}`);
    }
    return lines;
  }

  if (item.geometryType === "Polygon") {
    const rings = item.layer.getLatLngs();
    const outer = Array.isArray(rings[0]) ? rings[0] : rings;
    const perimeterMeters = measureLatLngPath(outer, true);
    const areaSqMeters = measurePolygonAreaSqMeters(outer);
    if (areaSqMeters > 0) {
      lines.push(`Area: ${formatShapeArea(areaSqMeters)}`);
    }
    if (perimeterMeters > 0) {
      lines.push(`Perimeter: ${formatDistance(perimeterMeters)}`);
    }
  }

  return lines;
}

function measureLatLngPath(latLngs, closeRing = false) {
  if (!Array.isArray(latLngs) || latLngs.length < 2) {
    return 0;
  }

  let total = 0;
  for (let index = 1; index < latLngs.length; index += 1) {
    total += state.map.distance(latLngs[index - 1], latLngs[index]);
  }
  if (closeRing) {
    total += state.map.distance(latLngs[latLngs.length - 1], latLngs[0]);
  }
  return total;
}

function measurePolygonAreaSqMeters(latLngs) {
  if (!Array.isArray(latLngs) || latLngs.length < 3) {
    return 0;
  }

  const centerLat = latLngs.reduce((sum, point) => sum + point.lat, 0) / latLngs.length;
  const centerLon = latLngs.reduce((sum, point) => sum + point.lng, 0) / latLngs.length;
  const metersPerDegLat = 111320;
  const metersPerDegLon = 111320 * Math.cos((centerLat * Math.PI) / 180);

  let area = 0;
  for (let index = 0; index < latLngs.length; index += 1) {
    const current = latLngs[index];
    const next = latLngs[(index + 1) % latLngs.length];
    const currentX = (current.lng - centerLon) * metersPerDegLon;
    const currentY = (current.lat - centerLat) * metersPerDegLat;
    const nextX = (next.lng - centerLon) * metersPerDegLon;
    const nextY = (next.lat - centerLat) * metersPerDegLat;
    area += (currentX * nextY) - (nextX * currentY);
  }
  return Math.abs(area) / 2;
}

function formatShapeArea(areaSqMeters) {
  if (state.settings.measurementUnits === "standard") {
    return `${(areaSqMeters / 2589988.110336).toFixed(2)} mi²`;
  }
  return `${(areaSqMeters / 1000000).toFixed(2)} km²`;
}

// ── Draw toolbar ──────────────────────────────────────────────────────────────

function toggleDrawDropdown() {
  const hidden = dom.drawDropdown.classList.toggle("hidden");
  if (!hidden) {
    closeShapeStylePanel();
    positionTopBarDropdown(dom.drawDropdown, dom.drawShapeBtn);
  }
}

function closeDrawDropdown() {
  dom.drawDropdown.classList.add("hidden");
}

const DRAW_DEFAULTS = { color: "#3b82f6", fillOpacity: 0.25, weight: 2, lineStyle: "solid" };

function startDrawing(mode) {
  closeDrawDropdown();
  cancelDrawing();
  state.draw.mode = mode;
  dom.map.classList.add("leaflet-drawing-active");
  const hints = { circle: "Click to set center, click again to set radius.", rectangle: "Click two corners to draw a rectangle.", polyline: "Click to add points. Double-click to finish." };
  setStatus(hints[mode]);
}

function cancelDrawing() {
  if (state.draw.previewLayer) {
    state.draw.previewLayer.remove();
    state.draw.previewLayer = null;
  }
  state.draw.mode = null;
  state.draw.points = [];
  dom.map.classList.remove("leaflet-drawing-active");
}

function onDrawClick(latlng) {
  const { mode, points } = state.draw;

  if (mode === "circle") {
    if (points.length === 0) {
      state.draw.points = [latlng];
      setStatus("Circle center set. Click to set radius.");
    } else {
      const center = points[0];
      const radiusM = state.map.distance(center, latlng);
      cancelDrawing();
      commitDrawnShape("Circle", "Polygon", circleToPolygonLatLngs(center, radiusM), { isCircle: true, center, radiusM });
    }
    return;
  }

  if (mode === "rectangle") {
    if (points.length === 0) {
      state.draw.points = [latlng];
      setStatus("First corner set. Click to place opposite corner.");
    } else {
      const [a] = points;
      const b = latlng;
      const corners = [[a.lat, a.lng], [a.lat, b.lng], [b.lat, b.lng], [b.lat, a.lng]];
      cancelDrawing();
      commitDrawnShape("Rectangle", "Polygon", corners);
    }
    return;
  }

  if (mode === "polyline") {
    state.draw.points.push(latlng);
    updateDrawPreview(latlng);
    setStatus(`${state.draw.points.length} point(s). Double-click to finish.`);
  }
}

function onMapMouseMove(event) {
  if (!state.draw.mode || state.draw.points.length === 0) return;
  updateDrawPreview(event.latlng);
}

function onMapDblClick(event) {
  if (state.draw.mode !== "polyline" || state.draw.points.length < 2) return;
  // Leaflet fires click then dblclick — the last click already added a point, so remove the duplicate
  const points = state.draw.points.slice(0, -1);
  const coords = points.map((p) => [p.lat, p.lng]);
  cancelDrawing();
  commitDrawnShape("Polyline", "LineString", coords);
}

function updateDrawPreview(cursor) {
  if (state.draw.previewLayer) {
    state.draw.previewLayer.remove();
    state.draw.previewLayer = null;
  }
  const { mode, points } = state.draw;
  const opts = { color: DRAW_DEFAULTS.color, weight: DRAW_DEFAULTS.weight, dashArray: "6 4", fillOpacity: 0.12, interactive: false };

  if (mode === "circle" && points.length === 1) {
    const radiusM = state.map.distance(points[0], cursor);
    state.draw.previewLayer = L.circle(points[0], { ...opts, radius: radiusM }).addTo(state.map);
  } else if (mode === "rectangle" && points.length === 1) {
    state.draw.previewLayer = L.rectangle([points[0], cursor], opts).addTo(state.map);
  } else if (mode === "polyline" && points.length >= 1) {
    state.draw.previewLayer = L.polyline([...points, cursor], opts).addTo(state.map);
  }
}

function circleToPolygonLatLngs(center, radiusM, steps = 64) {
  const latlngs = [];
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const dLat = (radiusM * Math.cos(angle)) / 111320;
    const dLng = (radiusM * Math.sin(angle)) / (111320 * Math.cos((center.lat * Math.PI) / 180));
    latlngs.push([center.lat + dLat, center.lng + dLng]);
  }
  return latlngs;
}

function commitDrawnShape(labelPrefix, geometryType, coordinates, extra = {}) {
  const index = state.importedItems.filter((i) => i.drawn).length;
  const feature = {
    name: `${labelPrefix} ${index + 1}`,
    geometryType,
    coordinates,
    properties: {
      ...(extra.isCircle ? {
        isCircle: true,
        radiusM: extra.radiusM,
        center: extra.center ? { lat: extra.center.lat, lng: extra.center.lng } : null,
      } : {}),
    },
    sourceLabel: "Drawn",
    drawn: true,
    shapeStyle: { color: DRAW_DEFAULTS.color, fillOpacity: DRAW_DEFAULTS.fillOpacity, weight: DRAW_DEFAULTS.weight, lineStyle: DRAW_DEFAULTS.lineStyle },
    ...extra,
  };
  addDrawnFeature(feature);
  setStatus(`${feature.name} added. Right-click it in Map Contents to edit style or vertices.`);
}

function addDrawnFeature(feature, folderId = null) {
  const item = {
    id: generateId(),
    name: feature.name,
    subtitle: `Drawn | ${feature.geometryType}`,
    kind: `imported-${feature.geometryType.toLowerCase()}`,
    geometryType: feature.geometryType,
    properties: feature.properties ?? {},
    drawn: true,
    shapeStyle: feature.shapeStyle ?? { ...DRAW_DEFAULTS },
    layer: null,
  };

  const contentId = `imported:${item.id}`;
  const pane = getMapContentPaneName(contentId);
  const s = item.shapeStyle;
  const dashArray = getLeafletDashArray(s.lineStyle);

  if (feature.geometryType === "Polygon") {
    item.layer = L.polygon(feature.coordinates, { pane, color: s.color, weight: s.weight, fillOpacity: s.fillOpacity, fillColor: s.color, dashArray });
  } else {
    item.layer = L.polyline(feature.coordinates, { pane, color: s.color, weight: s.weight, dashArray });
  }

  item.layer.addTo(state.map);
  item.layer.bindPopup(renderImportedItemPopup(item));
  item.layer.on("click", () => focusMapContent(contentId));
  item.layer.on("dragend edit", () => {
    item.layer.setPopupContent(renderImportedItemPopup(item));
    renderMapContents();
    saveMapState();
    syncShapeVertexEditUi(item);
  });
  state.importedItems.push(item);
  setMapContentFolderId(contentId, folderId ?? null);
  state.mapContentOrder.push(contentId);
  renderMapContents();
  syncCesiumEntities();
  saveMapState();
}

// ── Shape style panel ─────────────────────────────────────────────────────────

function openShapeStylePanel(item, anchorEl) {
  state.draw.editingItemId = item.id;
  const s = item.shapeStyle ?? { ...DRAW_DEFAULTS };
  dom.shapeColorInput.value = s.color;
  dom.shapeLineStyleSelect.value = s.lineStyle ?? "solid";
  dom.shapeOpacityInput.value = s.fillOpacity;
  dom.shapeWeightInput.value = s.weight;
  dom.shapeOpacityValue.textContent = `${Math.round(s.fillOpacity * 100)}%`;
  dom.shapeWeightValue.textContent = s.weight;
  updateRangeTrack(dom.shapeOpacityInput);
  updateRangeTrack(dom.shapeWeightInput);

  // Hide vertex button for pure polylines
  dom.shapeStyleEditVerticesBtn.style.display = item.geometryType === "LineString" || item.layer?.editing ? "" : "";

  // Position to the right of the left panel, aligned to the item's row
  const contentId = `imported:${item.id}`;
  const rowEl = dom.mapContentsList?.querySelector(`[data-content-id="${contentId}"]`);
  const panelRect = dom.mapContentsCard?.getBoundingClientRect() ?? { right: 340, top: 80 };
  const rowRect = rowEl ? rowEl.getBoundingClientRect() : panelRect;
  const panelLeft = panelRect.right + 6;
  const panelTop = Math.min(rowRect.top, window.innerHeight - 360);
  dom.shapeStylePanel.style.left = `${panelLeft}px`;
  dom.shapeStylePanel.style.top = `${panelTop}px`;
  dom.shapeStylePanel.classList.remove("hidden");
  syncShapeVertexEditUi(item);
}

function isShapeVertexEditingActive(itemId = state.draw.editingItemId) {
  const item = state.importedItems.find((entry) => entry.id === itemId);
  return Boolean(item?.layer?.editing?.enabled?.());
}

function syncShapeVertexEditUi(item) {
  if (!item) {
    return;
  }

  const isEditing = Boolean(item.layer?.editing?.enabled?.());
  item.layer.getElement?.()?.classList.toggle("drawn-shape-editing", isEditing);
  item.layer._path?.classList.toggle("drawn-shape-editing", isEditing);

  if (item.id === state.draw.editingItemId) {
    dom.shapeStyleEditVerticesBtn.textContent = isEditing ? "Stop Editing" : "Edit Vertices";
  }
}

function closeShapeStylePanel({ stopEditing = true } = {}) {
  dom.shapeStylePanel.classList.add("hidden");
  const item = state.importedItems.find((i) => i.id === state.draw.editingItemId);
  if (item && stopEditing) {
    stopShapeVertexEdit(item);
  }
  state.draw.editingItemId = null;
}

function onShapeStyleChanged() {
  const item = state.importedItems.find((i) => i.id === state.draw.editingItemId);
  if (!item) return;
  const color = dom.shapeColorInput.value;
  const lineStyle = dom.shapeLineStyleSelect.value;
  const fillOpacity = parseFloat(dom.shapeOpacityInput.value);
  const weight = parseInt(dom.shapeWeightInput.value, 10);
  dom.shapeOpacityValue.textContent = `${Math.round(fillOpacity * 100)}%`;
  dom.shapeWeightValue.textContent = weight;
  item.shapeStyle = { color, lineStyle, fillOpacity, weight };
  applyShapeStyleToLayer(item);
  item.layer.setPopupContent(renderImportedItemPopup(item));
  saveMapState();
  syncCesiumEntities();
}

function getLeafletDashArray(lineStyle) {
  if (lineStyle === "dashed") {
    return "10 8";
  }
  if (lineStyle === "dotted") {
    return "2 8";
  }
  return null;
}

function applyShapeStyleToLayer(item) {
  if (!item?.layer || !item.shapeStyle) {
    return;
  }

  const { color, fillOpacity, weight, lineStyle } = item.shapeStyle;
  const dashArray = getLeafletDashArray(lineStyle);
  if (item.geometryType === "Polygon" || item.geometryType === "MultiPolygon") {
    item.layer.setStyle({ color, fillColor: color, fillOpacity, weight, dashArray });
  } else {
    item.layer.setStyle({ color, weight, dashArray });
  }
}

function getCesiumStrokeMaterial(C, color, lineStyle) {
  const baseColor = C.Color.fromCssColorString(color);
  if (lineStyle === "dashed") {
    return new C.PolylineDashMaterialProperty({
      color: baseColor,
      dashLength: 18,
      dashPattern: 0b1111000011110000,
    });
  }
  if (lineStyle === "dotted") {
    return new C.PolylineDashMaterialProperty({
      color: baseColor,
      dashLength: 10,
      dashPattern: 0b1010101010101010,
    });
  }
  return baseColor;
}

function onShapeStyleEditVertices() {
  const item = state.importedItems.find((i) => i.id === state.draw.editingItemId);
  if (!item) return;
  if (item.layer.editing?.enabled()) {
    stopShapeVertexEdit(item);
  } else {
    item.layer.editing?.enable();
    syncShapeVertexEditUi(item);
    setStatus("Drag vertices to reshape. Click 'Stop Editing' or Done when finished.");
  }
}

function stopShapeVertexEdit(item) {
  if (item?.layer?.editing?.enabled()) {
    item.layer.editing.disable();
  }
  syncShapeVertexEditUi(item);
  saveMapState();
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
  syncCesiumEntities();
  saveMapState();
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
    id: generateId(),
    name,
  };
  state.mapContentFolders.push(folder);
  state.mapContentOrder.push(`folder:${folder.id}`);
  return `folder:${folder.id}`;
}

function addImportedFeature(feature, folderId, index) {
  const item = {
    id: generateId(),
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
    item.layer.on("dragend edit", () => {
      item.layer.setPopupContent(renderImportedItemPopup(item));
      renderMapContents();
      syncShapeVertexEditUi(item);
    });
  }

  item.layer.on?.("click", () => focusMapContent(contentId));
  state.importedItems.push(item);
  setMapContentFolderId(contentId, folderId);
  state.mapContentOrder.push(contentId);
  syncCesiumEntities();
  saveMapState();
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
  // Strip XML namespace declarations so querySelectorAll works without namespace prefixes
  const stripped = text
    .replace(/\sxmlns(?::\w+)?="[^"]*"/g, "")
    .replace(/\sxmlns(?::\w+)?='[^']*'/g, "");

  let xml;
  try {
    xml = new DOMParser().parseFromString(stripped, "text/xml");
  } catch {
    return [];
  }

  // Check for parse errors
  if (xml.querySelector("parsererror")) {
    // Try treating as HTML-wrapped KML (some exports)
    try {
      xml = new DOMParser().parseFromString(stripped, "text/html");
    } catch {
      return [];
    }
  }

  const features = [];
  const sourceLabel = fileName.toLowerCase().endsWith(".kmz") ? "KMZ" : "KML";

  // Helper: get direct text child of element by local tag name (namespace-safe)
  const directText = (el, tag) => {
    for (const child of el.children) {
      if (child.localName === tag) return child.textContent?.trim() ?? "";
    }
    return "";
  };

  // Helper: find first child element by localName (namespace-safe)
  const findChild = (el, ...tags) => {
    for (const child of el.children) {
      if (tags.includes(child.localName)) return child;
    }
    return null;
  };

  // Helper: find all descendant elements by localName
  const findAll = (el, tag) => {
    const results = [];
    const walk = (node) => {
      for (const child of node.children) {
        if (child.localName === tag) results.push(child);
        walk(child);
      }
    };
    walk(el);
    return results;
  };

  const parsePlacemark = (placemark, folderPath) => {
    const name = directText(placemark, "name") || "Imported Placemark";

    const properties = {};
    const extData = findChild(placemark, "ExtendedData");
    if (extData) {
      findAll(extData, "Data").forEach((d) => {
        const key = d.getAttribute("name");
        const val = findChild(d, "value")?.textContent?.trim();
        if (key) properties[key] = val ?? "";
      });
      // ATAK SimpleData
      findAll(extData, "SimpleData").forEach((d) => {
        const key = d.getAttribute("name");
        if (key) properties[key] = d.textContent?.trim() ?? "";
      });
    }

    // Collect all geometry elements that are direct or near-direct children
    const geomTags = ["Point", "LineString", "LinearRing", "Polygon", "MultiGeometry"];
    const geometries = [];
    for (const child of placemark.children) {
      if (geomTags.includes(child.localName)) {
        geometries.push(child);
      }
    }
    // MultiGeometry: flatten children
    const flatGeometries = [];
    geometries.forEach((g) => {
      if (g.localName === "MultiGeometry") {
        for (const sub of g.children) {
          if (geomTags.includes(sub.localName)) flatGeometries.push(sub);
        }
      } else {
        flatGeometries.push(g);
      }
    });

    flatGeometries.forEach((geometry, index) => {
      const gName = flatGeometries.length > 1 ? `${name} ${index + 1}` : name;
      const base = { name: gName, properties, folderPath, sourceLabel };

      if (geometry.localName === "Point") {
        const coordEl = findChild(geometry, "coordinates") || findAll(geometry, "coordinates")[0];
        const coords = parseKmlCoordinateList(coordEl?.textContent ?? "");
        if (coords.length && coords[0].length === 2) {
          const [lon, lat] = coords[0];
          if (Number.isFinite(lat) && Number.isFinite(lon)) {
            features.push({ ...base, geometryType: "Point", coordinates: [lat, lon] });
          }
        }
        return;
      }

      if (geometry.localName === "LineString" || geometry.localName === "LinearRing") {
        const coordEl = findChild(geometry, "coordinates") || findAll(geometry, "coordinates")[0];
        const coords = parseKmlCoordinateList(coordEl?.textContent ?? "").map(([lon, lat]) => [lat, lon]);
        if (coords.length >= 2) {
          features.push({ ...base, geometryType: "LineString", coordinates: coords });
        }
        return;
      }

      if (geometry.localName === "Polygon") {
        // outerBoundaryIs > LinearRing > coordinates
        const outer = findChild(geometry, "outerBoundaryIs");
        const ring = outer ? (findChild(outer, "LinearRing") || outer) : findChild(geometry, "LinearRing");
        const coordEl = ring
          ? (findChild(ring, "coordinates") || findAll(ring, "coordinates")[0])
          : (findChild(geometry, "coordinates") || findAll(geometry, "coordinates")[0]);
        const coords = parseKmlCoordinateList(coordEl?.textContent ?? "").map(([lon, lat]) => [lat, lon]);
        if (coords.length >= 3) {
          features.push({ ...base, geometryType: "Polygon", coordinates: coords });
        }
      }
    });
  };

  const walk = (node, folderPath = []) => {
    for (const child of node.children) {
      const ln = child.localName;
      if (ln === "Folder" || ln === "Document") {
        const folderName = directText(child, "name");
        walk(child, folderName ? [...folderPath, folderName] : folderPath);
      } else if (ln === "Placemark") {
        parsePlacemark(child, folderPath);
      } else {
        // Some KMLs nest Placemarks inside NetworkLink responses or other wrappers
        walk(child, folderPath);
      }
    }
  };

  walk(xml.documentElement, []);
  return features;
}

function parseKmlCoordinateList(value) {
  if (!value) return [];
  // KML coordinates: space-separated tuples of "lon,lat[,alt]"
  return value
    .trim()
    .replace(/\r\n|\r/g, " ")
    .split(/\s+/)
    .map((tuple) => {
      const parts = tuple.split(",").map(Number);
      if (parts.length >= 2 && Number.isFinite(parts[0]) && Number.isFinite(parts[1])) {
        return [parts[0], parts[1]]; // [lon, lat] — altitude dropped
      }
      return null;
    })
    .filter(Boolean);
}

async function parseKmzFeatures(buffer, fileName) {
  console.log("[kmz] parseKmzFeatures called, JSZip:", typeof window.JSZip, "buffer bytes:", buffer.byteLength);
  let zip;
  try {
    zip = await window.JSZip.loadAsync(buffer);
  } catch (err) {
    console.error("[kmz] JSZip.loadAsync failed:", err);
    throw new Error(`Could not read KMZ/ZIP archive: ${err.message}`);
  }
  console.log("[kmz] zip entries:", Object.keys(zip.files));

  const files = Object.values(zip.files).filter((f) => !f.dir);

  // Find all KML files — ATAK packages can have multiple
  const kmlFiles = files
    .filter((f) => f.name.toLowerCase().endsWith(".kml"))
    .sort((a, b) => {
      // Prefer root-level doc.kml or files without subdirectories first
      const aDepth = a.name.split("/").length;
      const bDepth = b.name.split("/").length;
      if (aDepth !== bDepth) return aDepth - bDepth;
      // Prefer doc.kml
      const aIsDoc = a.name.toLowerCase().includes("doc.kml");
      const bIsDoc = b.name.toLowerCase().includes("doc.kml");
      if (aIsDoc && !bIsDoc) return -1;
      if (bIsDoc && !aIsDoc) return 1;
      return 0;
    });

  if (!kmlFiles.length) {
    throw new Error(`No KML found inside ${fileName}. The file may be a different format.`);
  }

  const allFeatures = [];
  for (const kmlFile of kmlFiles) {
    const text = await kmlFile.async("text");
    console.log("[kmz] parsing KML file:", kmlFile.name, "text length:", text.length, "preview:", text.slice(0, 200));
    const features = parseKmlFeatures(text, fileName);
    console.log("[kmz] features from", kmlFile.name, ":", features.length, features.slice(0, 3));
    allFeatures.push(...features);
  }

  // Deduplicate by name+coordinates fingerprint in case multiple KMLs reference same data
  const seen = new Set();
  return allFeatures.filter((f) => {
    const key = `${f.name}|${f.geometryType}|${JSON.stringify(f.coordinates).slice(0, 60)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function syncCesiumEntities() {
  if (!state.cesiumViewer) {
    return;
  }

  const viewer = state.cesiumViewer;
  const C = window.Cesium;
  const entities = viewer.entities;

  // Clear all managed entities
  const managedIds = [];
  entities.values.forEach((entity) => {
    if (entity.id && String(entity.id).startsWith("managed:")) {
      managedIds.push(entity.id);
    }
  });
  managedIds.forEach((id) => entities.removeById(id));

  // Clear managed primitives
  if (!viewer._managedPrimitives) viewer._managedPrimitives = [];
  viewer._managedPrimitives.forEach((p) => { try { viewer.scene.primitives.remove(p); } catch (_) {} });
  viewer._managedPrimitives = [];

  const isVisible = (contentId) => !state.hiddenContentIds.has(contentId);

  const addClampedPolygon = (id, latLngs, options = {}) => {
    const coords = latLngs.map((p) => Array.isArray(p)
      ? { lat: Number(p[0]), lng: Number(p[1]) }
      : { lat: Number(p.lat), lng: Number(p.lng) });
    if (coords.length < 3) {
      return;
    }

    const hierarchyPositions = coords.map((p) => C.Cartesian3.fromDegrees(p.lng, p.lat));
    const outlinePositions = [];
    coords.forEach((p) => {
      outlinePositions.push(p.lng, p.lat);
    });
    const first = coords[0];
    const last = coords[coords.length - 1];
    if (first.lat !== last.lat || first.lng !== last.lng) {
      outlinePositions.push(first.lng, first.lat);
    }

    const fillColor = C.Color.fromCssColorString(options.fillColor ?? options.color ?? "#34d399").withAlpha(options.fillOpacity ?? 0.12);
    const outlineColorValue = options.outlineColor ?? options.color ?? "#34d399";
    const outlineWidth = options.outlineWidth ?? options.weight ?? 2;

    entities.add({
      id,
      polygon: {
        hierarchy: new C.PolygonHierarchy(hierarchyPositions),
        material: fillColor,
        heightReference: C.HeightReference.CLAMP_TO_GROUND,
        classificationType: C.ClassificationType.BOTH,
        perPositionHeight: false,
        arcType: C.ArcType.GEODESIC,
        zIndex: options.zIndex ?? 10,
      },
    });

    entities.add({
      id: `${id}:outline`,
      polyline: {
        positions: C.Cartesian3.fromDegreesArray(outlinePositions),
        width: outlineWidth,
        material: getCesiumStrokeMaterial(C, outlineColorValue, options.lineStyle),
        clampToGround: true,
        arcType: C.ArcType.GEODESIC,
        zIndex: (options.zIndex ?? 10) + 1,
      },
    });
  };

  // --- ASSETS ---
  state.assets.filter((asset) => isVisible(`asset:${asset.id}`)).forEach((asset) => {
    const assetHeight = resolveAbsoluteHeight(asset);
    const heightRef = assetHeight.useRelativeToGround ? C.HeightReference.RELATIVE_TO_GROUND : C.HeightReference.NONE;
    entities.add({
      id: `managed:asset:${asset.id}`,
      position: C.Cartesian3.fromDegrees(asset.lon, asset.lat, assetHeight.absoluteHeightM),
      point: {
        pixelSize: 10,
        color: C.Color.fromCssColorString(asset.color || FORCE_COLORS[asset.force]),
        outlineColor: C.Color.WHITE,
        outlineWidth: 1.5,
        heightReference: heightRef,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: asset.name,
        fillColor: C.Color.WHITE,
        font: "14px Bahnschrift",
        pixelOffset: new C.Cartesian2(0, -18),
        heightReference: heightRef,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        style: C.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        outlineColor: C.Color.BLACK,
      },
    });
  });

  // --- GPS LOCATION ---
  if (state.gps.location) {
    entities.add({
      id: "managed:gps:user",
      position: C.Cartesian3.fromDegrees(state.gps.location.lon, state.gps.location.lat, 0),
      point: {
        pixelSize: 12,
        color: C.Color.fromCssColorString("#34d399"),
        outlineColor: C.Color.WHITE,
        outlineWidth: 2,
        heightReference: C.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: "User",
        font: "14px Bahnschrift",
        fillColor: C.Color.WHITE,
        pixelOffset: new C.Cartesian2(0, -18),
        heightReference: C.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        style: C.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        outlineColor: C.Color.BLACK,
      },
    });
    // GPS accuracy circle
    if (state.gps.location.accuracyM) {
      entities.add({
        id: "managed:gps:accuracy",
        position: C.Cartesian3.fromDegrees(state.gps.location.lon, state.gps.location.lat, 0),
        ellipse: {
          semiMajorAxis: state.gps.location.accuracyM,
          semiMinorAxis: state.gps.location.accuracyM,
          material: C.Color.fromCssColorString("#34d399").withAlpha(0.08),
          outline: true,
          outlineColor: C.Color.fromCssColorString("#34d399"),
          outlineWidth: 1,
          heightReference: C.HeightReference.CLAMP_TO_GROUND,
        },
      });
    }
  }

  // --- TERRAIN COVERAGE ---
  state.terrains.forEach((terrain) => {
    if (!terrain.extentVisible) return;
    entities.add({
      id: `managed:terrain-coverage:${terrain.id}`,
      rectangle: {
        coordinates: C.Rectangle.fromDegrees(
          terrain.bounds.sw.lon, terrain.bounds.sw.lat,
          terrain.bounds.ne.lon, terrain.bounds.ne.lat,
        ),
        material: C.Color.fromCssColorString("#8fb7ff").withAlpha(0),
        outline: true,
        outlineColor: C.Color.fromCssColorString("#8fb7ff"),
        outlineWidth: 2,
        height: 0,
      },
    });
  });

  // --- VIEWSHEDS ---
  state.viewsheds.filter((v) => isVisible(`viewshed:${v.id}`)).forEach((viewshed) => {
    const { latitudes, longitudes, rssi, lineOfSight, layer } = viewshed;
    if (!layer || !latitudes) return;
    const opacity = viewshed.opacity ?? 0.7;
    const gridLatStep = viewshed.layer?.options?.gridLatStepDeg ?? (latitudes[1] - latitudes[0]);
    const gridLonStep = viewshed.layer?.options?.gridLonStepDeg ?? (longitudes[1] - longitudes[0]);
    const halfLat = (gridLatStep || 0.001) / 2;
    const halfLon = (gridLonStep || 0.001) / 2;

    const instances = [];
    for (let i = 0; i < latitudes.length; i++) {
      const cssColor = rssiColor(rssi[i], Boolean(lineOfSight[i]), opacity);
      const color = C.Color.fromCssColorString(cssColor);
      instances.push(new C.GeometryInstance({
        id: `viewshed:${viewshed.id}:${i}`,
        geometry: new C.RectangleGeometry({
          rectangle: C.Rectangle.fromDegrees(
            longitudes[i] - halfLon, latitudes[i] - halfLat,
            longitudes[i] + halfLon, latitudes[i] + halfLat,
          ),
          vertexFormat: C.PerInstanceColorAppearance.VERTEX_FORMAT,
        }),
        attributes: {
          color: C.ColorGeometryInstanceAttribute.fromColor(color),
        },
      }));
    }

    if (instances.length > 0) {
      const primitive = new C.GroundPrimitive({
        geometryInstances: instances,
        appearance: new C.PerInstanceColorAppearance({
          flat: true,
          translucent: true,
        }),
        classificationType: C.ClassificationType.TERRAIN,
        asynchronous: false,
      });
      viewer.scene.primitives.add(primitive);
      viewer._managedPrimitives.push(primitive);
    }
  });

  // --- IMPORTED FEATURES ---
  state.importedItems.filter((item) => isVisible(`imported:${item.id}`)).forEach((item) => {
    if (!item.layer) return;
    const id = `managed:imported:${item.id}`;
    if (item.geometryType === "Point") {
      const latlng = item.layer.getLatLng();
      entities.add({
        id,
        position: C.Cartesian3.fromDegrees(latlng.lng, latlng.lat, 0),
        point: {
          pixelSize: 9,
          color: C.Color.fromCssColorString("#f7b955"),
          outlineColor: C.Color.WHITE,
          outlineWidth: 1.5,
          heightReference: C.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
          text: item.name,
          font: "13px Bahnschrift",
          fillColor: C.Color.WHITE,
          pixelOffset: new C.Cartesian2(0, -16),
          heightReference: C.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          style: C.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          outlineColor: C.Color.BLACK,
        },
      });
    } else if (item.geometryType === "LineString") {
      const shapeColor = item.shapeStyle?.color ?? "#f7b955";
      const weight = item.shapeStyle?.weight ?? 3;
      const lineStyle = item.shapeStyle?.lineStyle ?? "solid";
      const positions = item.layer.getLatLngs().map((p) => C.Cartesian3.fromDegrees(p.lng, p.lat, 0));
      entities.add({
        id,
        polyline: {
          positions,
          width: weight,
          material: getCesiumStrokeMaterial(C, shapeColor, lineStyle),
          clampToGround: true,
        },
      });
    } else {
      const rings = item.layer.getLatLngs();
      const outer = Array.isArray(rings[0]) ? rings[0] : rings;
      const shapeColor = item.drawn
        ? (item.shapeStyle?.color ?? DRAW_DEFAULTS.color)
        : "#34d399";
      const fillOpacity = item.drawn
        ? (item.shapeStyle?.fillOpacity ?? DRAW_DEFAULTS.fillOpacity)
        : 0.12;
      const weight = item.drawn
        ? (item.shapeStyle?.weight ?? DRAW_DEFAULTS.weight)
        : 2;
      const lineStyle = item.shapeStyle?.lineStyle ?? DRAW_DEFAULTS.lineStyle;
      addClampedPolygon(id, outer, {
        color: shapeColor,
        fillColor: shapeColor,
        fillOpacity,
        outlineColor: shapeColor,
        outlineWidth: weight,
        lineStyle,
        zIndex: 12,
      });
    }
  });

  // --- PLANNING REGION ---
  if (state.planning.regionLayer) {
    addClampedPolygon("managed:planning:region", state.planning.regionLayer.getLatLngs()[0], {
      color: "#d9e4ff",
      fillColor: "#d9e4ff",
      fillOpacity: 0.12,
      outlineColor: "#d9e4ff",
      outlineWidth: 2,
      zIndex: 8,
    });
  }

  // --- PLANNING RECOMMENDATIONS ---
  state.planning.recommendations.forEach((recommendation, index) => {
    const txHeight = resolveAbsoluteHeight(recommendation.tx, state.planning.terrainId);
    const rxHeight = resolveAbsoluteHeight(recommendation.rx, state.planning.terrainId);
    const linkColor = C.Color.fromCssColorString(recommendation.friendlyLineOfSight ? "#d9e4ff" : "#f97316");
    const linkDashLength = recommendation.friendlyLineOfSight ? 32 : 14;
    const txRef = txHeight.useRelativeToGround ? C.HeightReference.RELATIVE_TO_GROUND : C.HeightReference.NONE;
    const rxRef = rxHeight.useRelativeToGround ? C.HeightReference.RELATIVE_TO_GROUND : C.HeightReference.NONE;

    entities.add({
      id: `managed:planning:tx:${index}`,
      position: C.Cartesian3.fromDegrees(recommendation.tx.lon, recommendation.tx.lat, txHeight.absoluteHeightM),
      point: {
        pixelSize: 10,
        color: C.Color.fromCssColorString("#4ade80"),
        outlineColor: C.Color.WHITE,
        outlineWidth: 2,
        heightReference: txRef,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: `Tx ${index + 1}`,
        font: "14px Bahnschrift",
        fillColor: C.Color.WHITE,
        pixelOffset: new C.Cartesian2(0, -18),
        heightReference: txRef,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        style: C.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        outlineColor: C.Color.BLACK,
      },
    });
    entities.add({
      id: `managed:planning:rx:${index}`,
      position: C.Cartesian3.fromDegrees(recommendation.rx.lon, recommendation.rx.lat, rxHeight.absoluteHeightM),
      point: {
        pixelSize: 10,
        color: C.Color.fromCssColorString("#facc15"),
        outlineColor: C.Color.WHITE,
        outlineWidth: 2,
        heightReference: rxRef,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
      label: {
        text: `Rx ${index + 1}`,
        font: "14px Bahnschrift",
        fillColor: C.Color.WHITE,
        pixelOffset: new C.Cartesian2(0, -18),
        heightReference: rxRef,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        style: C.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        outlineColor: C.Color.BLACK,
      },
    });
    entities.add({
      id: `managed:planning:link:${index}`,
      polyline: {
        positions: C.Cartesian3.fromDegreesArrayHeights([
          recommendation.tx.lon, recommendation.tx.lat, txHeight.absoluteHeightM,
          recommendation.rx.lon, recommendation.rx.lat, rxHeight.absoluteHeightM,
        ]),
        width: 2.5,
        arcType: C.ArcType.NONE,
        material: new C.PolylineDashMaterialProperty({ color: linkColor, dashLength: linkDashLength }),
        depthFailMaterial: new C.PolylineDashMaterialProperty({ color: linkColor.withAlpha(0.95), dashLength: linkDashLength }),
      },
    });
  });

  // --- GRIDLINES ---
  if (state.settings?.gridLinesEnabled && state.map) {
    const gridColor = C.Color.fromCssColorString(state.settings.gridColor || "#8fb7ff").withAlpha(0.55);

    // Derive visible bounds. In 3D mode, use the Cesium camera's computed
    // viewport rectangle so the grid follows the 3D camera, not the frozen
    // Leaflet view. Fall back to Leaflet bounds when the rectangle isn't
    // available (e.g. looking straight down at the poles).
    let rawSouth, rawNorth, rawWest, rawEast;
    const cesiumRect = viewer.camera.computeViewRectangle?.();
    if (cesiumRect) {
      const CM = C.Math;
      rawSouth = CM.toDegrees(cesiumRect.south);
      rawNorth = CM.toDegrees(cesiumRect.north);
      rawWest  = CM.toDegrees(cesiumRect.west);
      rawEast  = CM.toDegrees(cesiumRect.east);
    } else {
      const b = state.map.getBounds();
      rawSouth = b.getSouth(); rawNorth = b.getNorth();
      rawWest  = b.getWest();  rawEast  = b.getEast();
    }

    // Choose a step size. Map a rough pixel-per-degree estimate from the
    // visible degree span to the same GEO_STEPS table used in 2D.
    const degSpan = Math.max(1, rawNorth - rawSouth);
    const estPxPerDeg = Math.max(1, 800 / degSpan); // assume ~800px viewport height
    let step = GEO_STEPS[GEO_STEPS.length - 1];
    for (const s of GEO_STEPS) {
      if (s * estPxPerDeg >= MIN_GRID_PX) { step = s; break; }
    }

    // Expand slightly so lines reach the visible edges.
    const south = Math.max(-85, alignFloor(rawSouth - step, step));
    const north = Math.min( 85, alignCeil(rawNorth  + step, step));
    const west  = alignFloor(rawWest  - step, step);
    const east  = alignCeil(rawEast   + step, step);

    // Subdivide each line into segments so it drapes over terrain correctly.
    const SEG = 32;

    let gridIdx = 0;

    // Latitude lines (horizontal bands)
    for (let lat = south; lat <= north + step * 0.01; lat = Math.round((lat + step) * 1e8) / 1e8) {
      const clampedLat = Math.max(-85, Math.min(85, lat));
      const positions = [];
      for (let i = 0; i <= SEG; i++) {
        const lon = west + (east - west) * i / SEG;
        positions.push(C.Cartesian3.fromDegrees(lon, clampedLat));
      }
      entities.add({
        id: `managed:gridlines:lat:${gridIdx++}`,
        polyline: {
          positions,
          width: 1,
          material: gridColor,
          clampToGround: true,
        },
      });
    }

    // Longitude lines (vertical)
    for (let lon = west; lon <= east + step * 0.01; lon = Math.round((lon + step) * 1e8) / 1e8) {
      const positions = [];
      for (let i = 0; i <= SEG; i++) {
        const lat = Math.max(-85, Math.min(85, south + (north - south) * i / SEG));
        positions.push(C.Cartesian3.fromDegrees(lon, lat));
      }
      entities.add({
        id: `managed:gridlines:lon:${gridIdx++}`,
        polyline: {
          positions,
          width: 1,
          material: gridColor,
          clampToGround: true,
        },
      });
    }
  }
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

function parseMgrsReferenceInput(input) {
  const raw = String(input ?? "").trim().toUpperCase();
  if (!raw) {
    return null;
  }

  const compact = raw.replace(/[^0-9A-Z]/g, "");
  const match = compact.match(/^(\d{1,2}[C-HJ-NP-X])([A-HJ-NP-Z]{2})(\d{4}|\d{6}|\d{8}|\d{10})$/i);
  if (!match) {
    throw new Error("Enter an MGRS grid like 11S NU 54 23, 11S NU 542 231, 11S NU 5423 2314, or a full 10-digit grid.");
  }

  const [, zoneBand, square, digits] = match;
  const half = digits.length / 2;
  const easting = digits.slice(0, half).padEnd(5, "0");
  const northing = digits.slice(half).padEnd(5, "0");
  const normalized = `${zoneBand}${square}${easting}${northing}`;

  let bounds;
  try {
    bounds = window.mgrs.inverse(normalized);
  } catch {
    throw new Error("The MGRS grid could not be resolved.");
  }

  if (!Array.isArray(bounds) || bounds.length < 4 || bounds.some((value) => !Number.isFinite(value))) {
    throw new Error("The MGRS grid could not be resolved.");
  }

  const [west, south, east, north] = bounds;
  return {
    normalized,
    lat: (south + north) / 2,
    lng: (west + east) / 2,
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

function getDefaultCoverageRadiusUnit() {
  return state.settings.measurementUnits === "standard" ? "mi" : "km";
}

function getRadiusUnitMeta(unit) {
  if (unit === "m") {
    return { label: "m", factor: 1, min: 100, max: 300000, step: 100, digits: 0 };
  }
  if (unit === "mi") {
    return { label: "mi", factor: 1609.344, min: 1, max: 200, step: 1, digits: 2 };
  }
  return { label: "km", factor: 1000, min: 1, max: 300, step: 1, digits: 2 };
}

function getSelectedCoverageRadiusUnit() {
  return dom.radiusUnit?.value || getDefaultCoverageRadiusUnit();
}

function convertMetersToRadiusUnit(meters, unit) {
  return meters / getRadiusUnitMeta(unit).factor;
}

function convertRadiusUnitToMeters(value, unit) {
  return value * getRadiusUnitMeta(unit).factor;
}

function syncCoverageRadiusInput(unit = getSelectedCoverageRadiusUnit(), meters = null) {
  if (!dom.radiusValue || !dom.radiusUnit) {
    return;
  }
  const meta = getRadiusUnitMeta(unit);
  dom.radiusUnit.value = unit;
  dom.radiusValue.min = String(meta.min);
  dom.radiusValue.max = String(meta.max);
  dom.radiusValue.step = String(meta.step);

  if (Number.isFinite(meters)) {
    const converted = clamp(convertMetersToRadiusUnit(meters, unit), meta.min, meta.max);
    dom.radiusValue.value = formatInputNumber(converted, meta.digits);
    return;
  }

  const current = Number(dom.radiusValue.value);
  if (!Number.isFinite(current)) {
    dom.radiusValue.value = formatInputNumber(meta.min, meta.digits);
    return;
  }
  dom.radiusValue.value = formatInputNumber(clamp(current, meta.min, meta.max), meta.digits);
}

function getSimulationRadiusMeters() {
  const unit = getSelectedCoverageRadiusUnit();
  const meta = getRadiusUnitMeta(unit);
  const value = clamp(Number(dom.radiusValue?.value), meta.min, meta.max);
  return convertRadiusUnitToMeters(value, unit);
}

function setSimulationRadiusFromMeters(meters, preferredUnit = null) {
  syncCoverageRadiusInput(preferredUnit || getSelectedCoverageRadiusUnit() || getDefaultCoverageRadiusUnit(), meters);
}

function formatDistance(meters) {
  if (state.settings.measurementUnits === "standard") {
    return `${(meters / 1609.344).toFixed(2)} mi`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
}

function formatCoverageArea(viewshed) {
  if (!viewshed.gridLatStepDeg || !viewshed.gridLonStepDeg || !viewshed.cellCount) return null;
  const latRad = (viewshed.asset?.lat ?? 0) * Math.PI / 180;
  const cellAreaKm2 =
    (viewshed.gridLatStepDeg * 111.32) *
    (viewshed.gridLonStepDeg * 111.32 * Math.cos(latRad));
  const totalKm2 = cellAreaKm2 * viewshed.cellCount;
  if ((viewshed.radiusUnit || getDefaultCoverageRadiusUnit()) === "m") {
    return `${Math.round(totalKm2 * 1000000).toLocaleString()} m²`;
  }
  if ((viewshed.radiusUnit || getDefaultCoverageRadiusUnit()) === "mi") {
    return `${(totalKm2 * 0.386102).toFixed(2)} mi²`;
  }
  return `${totalKm2.toFixed(2)} km²`;
}

function formatCoverageRadius(viewshed) {
  const unit = viewshed.radiusUnit || getDefaultCoverageRadiusUnit();
  const meta = getRadiusUnitMeta(unit);
  return `${formatInputNumber(convertMetersToRadiusUnit(viewshed.radiusMeters, unit), meta.digits)} ${meta.label}`;
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

// ── Grid utility functions ────────────────────────────────────────────────────

function metersToLatitudeDegrees(meters) {
  return meters / 111320;
}

function metersToLongitudeDegrees(meters, latitude) {
  const cosine = Math.cos((latitude * Math.PI) / 180);
  return meters / (111320 * Math.max(Math.abs(cosine), 1e-6));
}

function alignFloor(value, step) {
  return Math.floor(value / step) * step;
}

function alignCeil(value, step) {
  return Math.ceil(value / step) * step;
}

// Cohen-Sutherland clip for arbitrary line segments against [0,w]x[0,h]
function csClipLine(x0, y0, x1, y1, w, h) {
  const INSIDE = 0, LEFT = 1, RIGHT = 2, BOTTOM = 4, TOP = 8;
  const code = (x, y) => {
    let c = INSIDE;
    if (x < 0) c |= LEFT;
    else if (x > w) c |= RIGHT;
    if (y < 0) c |= TOP;
    else if (y > h) c |= BOTTOM;
    return c;
  };
  let c0 = code(x0, y0), c1 = code(x1, y1);
  for (;;) {
    if (!(c0 | c1)) return [x0, y0, x1, y1]; // both inside
    if (c0 & c1) return null;                  // trivially outside
    const c = c0 || c1;
    let x, y;
    if (c & BOTTOM) { x = x0 + (x1 - x0) * (h - y0) / (y1 - y0); y = h; }
    else if (c & TOP) { x = x0 + (x1 - x0) * (0 - y0) / (y1 - y0); y = 0; }
    else if (c & RIGHT) { y = y0 + (y1 - y0) * (w - x0) / (x1 - x0); x = w; }
    else { y = y0 + (y1 - y0) * (0 - x0) / (x1 - x0); x = 0; }
    if (c === c0) { x0 = x; y0 = y; c0 = code(x0, y0); }
    else { x1 = x; y1 = y; c1 = code(x1, y1); }
  }
}

// ── Geographic step selection ─────────────────────────────────────────────────

const GEO_STEPS = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10];
const METRIC_GRID_STEPS = [100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000];
const MIN_GRID_PX = 80; // minimum pixels between grid lines

function resolveGeoStep(map) {
  const center = map.getCenter();
  const cp = map.latLngToContainerPoint(center);
  for (const step of GEO_STEPS) {
    const np = map.latLngToContainerPoint([center.lat + step, center.lng]);
    const ep = map.latLngToContainerPoint([center.lat, center.lng + step]);
    const px = Math.min(Math.abs(cp.y - np.y), Math.abs(cp.x - ep.x));
    if (px >= MIN_GRID_PX) return step;
  }
  return GEO_STEPS[GEO_STEPS.length - 1];
}

function resolveMetricStep(map) {
  const center = map.getCenter();
  const cp = map.latLngToContainerPoint(center);
  for (const step of METRIC_GRID_STEPS) {
    const latStep = metersToLatitudeDegrees(step);
    const lonStep = metersToLongitudeDegrees(step, center.lat);
    const np = map.latLngToContainerPoint([center.lat + latStep, center.lng]);
    const ep = map.latLngToContainerPoint([center.lat, center.lng + lonStep]);
    const px = Math.min(Math.abs(cp.y - np.y), Math.abs(cp.x - ep.x));
    if (px >= MIN_GRID_PX) return step;
  }
  return METRIC_GRID_STEPS[METRIC_GRID_STEPS.length - 1];
}

// ── Label formatters ─────────────────────────────────────────────────────────

function formatDecGridLabel(value, isLat) {
  const hem = isLat ? (value >= 0 ? "N" : "S") : (value >= 0 ? "E" : "W");
  return `${Math.abs(value).toFixed(4)}° ${hem}`;
}

function formatDmsGridLabel(value, isLat, step) {
  const hem = isLat ? (value >= 0 ? "N" : "S") : (value >= 0 ? "E" : "W");
  const abs = Math.abs(value);
  const deg = Math.floor(abs);
  const mf = (abs - deg) * 60;
  const min = Math.floor(mf);
  const sec = Math.round((mf - min) * 60);
  if (step < 1 / 60) return `${deg}° ${String(min).padStart(2,"0")}' ${String(sec).padStart(2,"0")}" ${hem}`;
  if (step < 1)      return `${deg}° ${String(min).padStart(2,"0")}' ${hem}`;
  return `${deg}° ${hem}`;
}

function formatGeoLabel(value, isLat, system, step) {
  if (system === "dms") return formatDmsGridLabel(value, isLat, step);
  return formatDecGridLabel(value, isLat);
}

function padMgrsCoordinate(value) {
  return Math.max(0, Math.min(99999, value)).toString().padStart(5, "0");
}

function getMgrsLabelDigits(stepMeters) {
  if (stepMeters >= 10000) return 1;
  if (stepMeters >= 1000)  return 2;
  return 3;
}

function formatMgrsLabel(prefix, value, stepMeters) {
  if (stepMeters >= 100000) return prefix;
  const digits = getMgrsLabelDigits(stepMeters);
  const divisor = digits === 1 ? 10000 : digits === 2 ? 1000 : 100;
  return `${prefix} ${String(Math.round(value / divisor)).padStart(digits, "0")}`;
}

// ── MGRS range sampling ──────────────────────────────────────────────────────

function collectVisibleMgrsRanges(map, stepMeters) {
  const size = map.getSize();
  const spacing = stepMeters >= 100000 ? 140 : stepMeters >= 10000 ? 110 : 85;
  const cols = Math.max(3, Math.ceil(size.x / spacing) + 1);
  const rows = Math.max(3, Math.ceil(size.y / spacing) + 1);
  const ranges = new Map();

  const sample = (lat, lon) => {
    const parts = getMgrsComponents(lat, lon);
    if (!parts) return;
    const prefix = `${parts.zoneBand}${parts.square}`;
    const e = Number(parts.easting), n = Number(parts.northing);
    if (!ranges.has(prefix)) {
      ranges.set(prefix, { prefix, minE: e, maxE: e, minN: n, maxN: n });
    } else {
      const r = ranges.get(prefix);
      r.minE = Math.min(r.minE, e); r.maxE = Math.max(r.maxE, e);
      r.minN = Math.min(r.minN, n); r.maxN = Math.max(r.maxN, n);
    }
  };

  for (let r = 0; r < rows; r++) {
    const y = rows === 1 ? size.y / 2 : (size.y * r) / (rows - 1);
    for (let c = 0; c < cols; c++) {
      const x = cols === 1 ? size.x / 2 : (size.x * c) / (cols - 1);
      const ll = map.containerPointToLatLng([x, y]);
      sample(ll.lat, ll.lng);
    }
  }
  const b = map.getBounds();
  [[b.getSouth(), b.getWest()],[b.getSouth(), b.getEast()],
   [b.getNorth(), b.getWest()],[b.getNorth(), b.getEast()],
   [b.getCenter().lat, b.getCenter().lng]].forEach(([la, lo]) => sample(la, lo));

  return [...ranges.values()].sort((a, b2) => a.prefix.localeCompare(b2.prefix));
}

// ── CoordinateGridLayer ──────────────────────────────────────────────────────

const CoordinateGridLayer = L.Layer.extend({
  initialize(options) {
    this.options = options;
    this._canvas = null;
    this._rafId = null;
  },

  onAdd(map) {
    this._map = map;
    this._canvas = L.DomUtil.create("canvas", "leaflet-coordinate-grid");
    const canvas = this._canvas;
    canvas.style.position = "absolute";
    canvas.style.pointerEvents = "none";
    canvas.style.left = "0";
    canvas.style.top = "0";
    // Use the mapPane so the canvas stays in Leaflet's coordinate space and
    // automatically follows pans without needing a move event.
    map.getPane("overlayPane").appendChild(canvas);
    map.on("moveend zoomend resize viewreset", this._scheduleRedraw, this);
    // Also redraw on every move so the grid stays locked during panning.
    map.on("move", this._scheduleRedraw, this);
    this._scheduleRedraw();
  },

  onRemove(map) {
    map.off("moveend zoomend resize viewreset move", this._scheduleRedraw, this);
    if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }
    if (this._canvas?.parentNode) this._canvas.parentNode.removeChild(this._canvas);
    this._canvas = null;
  },

  setOptions(options) {
    Object.assign(this.options, options);
    this._scheduleRedraw();
  },

  _scheduleRedraw() {
    if (this._rafId) cancelAnimationFrame(this._rafId);
    this._rafId = requestAnimationFrame(() => { this._rafId = null; this._redraw(); });
  },

  _redraw() {
    if (!this._canvas || !this._map) return;

    const map = this._map;
    const size = map.getSize();
    const canvas = this._canvas;

    // Size the canvas to the full container every frame.
    if (canvas.width !== size.x || canvas.height !== size.y) {
      canvas.width = size.x;
      canvas.height = size.y;
    }

    // Align the canvas with the container origin in layer-point space so it
    // exactly covers the visible viewport regardless of pan offset.
    this._topLeft = map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(canvas, this._topLeft);

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, size.x, size.y);
    ctx.font = "bold 11px Bahnschrift, Arial";
    ctx.lineCap = "round";

    if (this.options.coordinateSystem === "mgrs") {
      this._drawMgrsGrid(ctx);
    } else {
      this._drawGeoGrid(ctx);
    }
  },

  // Convert a lat/lng to canvas pixel coords (relative to canvas top-left).
  _toCanvas(lat, lon) {
    return this._map.latLngToLayerPoint([lat, lon]).subtract(this._topLeft);
  },

  // Draw a clipped line segment between two lat/lon points.
  // Returns the clipped screen segment or null.
  _segment(ctx, lat0, lon0, lat1, lon1, alpha, width) {
    const a = this._toCanvas(lat0, lon0);
    const b = this._toCanvas(lat1, lon1);
    const w = this._canvas.width, h = this._canvas.height;
    const seg = csClipLine(a.x, a.y, b.x, b.y, w, h);
    if (!seg) return null;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.lineWidth = width;
    ctx.strokeStyle = this.options.color;
    ctx.beginPath();
    ctx.moveTo(seg[0], seg[1]);
    ctx.lineTo(seg[2], seg[3]);
    ctx.stroke();
    ctx.restore();
    return seg;
  },

  _drawLabel(ctx, text, x, y) {
    const W = this._canvas.width, H = this._canvas.height;
    const m = ctx.measureText(text);
    const tw = m.width;
    const th = 12;
    const px = clamp(x, 2, W - tw - 6);
    const py = clamp(y, th + 2, H - 4);
    ctx.save();
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = "rgba(16,18,24,0.88)";
    ctx.fillRect(px - 2, py - th, tw + 6, th + 2);
    ctx.globalAlpha = 1;
    ctx.fillStyle = this.options.color;
    ctx.fillText(text, px + 1, py);
    ctx.restore();
  },

  // ── Geographic grid (latlon / dms) ──────────────────────────────────────

  _drawGeoGrid(ctx) {
    const map = this._map;
    const bounds = map.getBounds();
    const system = this.options.coordinateSystem;
    const step = resolveGeoStep(map);

    // Expand bounds slightly to ensure lines cover full canvas edge to edge.
    const south = alignFloor(bounds.getSouth() - step, step);
    const north = alignCeil(bounds.getNorth() + step, step);
    const west  = alignFloor(bounds.getWest()  - step, step);
    const east  = alignCeil(bounds.getEast()  + step, step);

    // Determine which lines get labels (aim for ~1 label per 120px).
    const center = map.getCenter();
    const cp = map.latLngToContainerPoint(center);
    const np = map.latLngToContainerPoint([center.lat + step, center.lng]);
    const ep = map.latLngToContainerPoint([center.lat, center.lng + step]);
    const latPx = Math.max(1, Math.abs(cp.y - np.y));
    const lonPx = Math.max(1, Math.abs(cp.x - ep.x));
    const latStride = Math.max(1, Math.round(120 / latPx));
    const lonStride = Math.max(1, Math.round(120 / lonPx));

    const W = this._canvas.width, H = this._canvas.height;

    // Latitude lines (horizontal) — label pinned to left edge
    let latIdx = 0;
    for (let lat = south; lat <= north + step * 0.01; lat = Math.round((lat + step) * 1e8) / 1e8) {
      const seg = this._segment(ctx, lat, west, lat, east, 0.5, 1);
      if (seg && latIdx % latStride === 0) {
        // Pin label to left edge at the y where this line intersects x=0.
        // The clipped segment runs from (seg[0],seg[1]) to (seg[2],seg[3]).
        // Interpolate to x=0 (or use seg[1] if the line starts at x=0).
        const dx = seg[2] - seg[0];
        const labelY = dx === 0 ? seg[1] : seg[1] + (seg[3] - seg[1]) * (0 - seg[0]) / dx;
        const clampedY = Math.max(14, Math.min(H - 4, labelY));
        const label = formatGeoLabel(lat, true, system, step);
        this._drawLabel(ctx, label, 6, clampedY + 10);
      }
      latIdx++;
    }

    // Longitude lines (vertical) — label pinned to top edge
    let lonIdx = 0;
    for (let lon = west; lon <= east + step * 0.01; lon = Math.round((lon + step) * 1e8) / 1e8) {
      const seg = this._segment(ctx, south, lon, north, lon, 0.5, 1);
      if (seg && lonIdx % lonStride === 0) {
        // Pin label to top edge at the x where this line intersects y=0.
        const dy = seg[3] - seg[1];
        const labelX = dy === 0 ? seg[0] : seg[0] + (seg[2] - seg[0]) * (0 - seg[1]) / dy;
        const clampedX = Math.max(2, Math.min(W - 80, labelX));
        const label = formatGeoLabel(lon, false, system, step);
        this._drawLabel(ctx, label, clampedX, 14);
      }
      lonIdx++;
    }
  },

  // ── MGRS grid ────────────────────────────────────────────────────────────
  //
  // Strategy: scan-line approach.
  // For each screen column, sample MGRS at top and bottom → find easting
  // boundaries crossed → draw a vertical line at the exact column where the
  // easting crosses a step multiple.
  // Same for rows / northing.
  // This works at every zoom level and for any map rotation because we work
  // entirely in screen space, never trying to reconstruct geographic lines
  // from MGRS coordinates.

  _drawMgrsGrid(ctx) {
    const map = this._map;
    const stepMeters = resolveMetricStep(map);
    const W = this._canvas.width, H = this._canvas.height;

    // Scan stride: sample every N pixels. Smaller = more accurate boundaries
    // but more MGRS conversions. 4px is a good balance.
    const STRIDE = 4;

    // --- Build easting lines (vertical) by scanning columns ---
    // For each column x, get MGRS at mid-height. Track prev easting bucket.
    // When bucket changes, record the transition x.

    // We collect line segments as {x1,y1,x2,y2,label,easting,prefix}
    const vLines = []; // { screenX, label }
    const hLines = []; // { screenY, label }

    // Vertical scan: march across columns, sample at 3 rows to get a robust reading
    let prevEBucket = null, prevEPrefix = null, prevEBucketX = 0;

    for (let x = 0; x <= W; x += STRIDE) {
      // Sample at vertical center; fall back to other rows if polar
      const ll = map.containerPointToLatLng([x, H / 2]);
      const parts = getMgrsComponents(ll.lat, ll.lng);
      if (!parts) { prevEBucket = null; continue; }
      const prefix = `${parts.zoneBand}${parts.square}`;
      const e = Number(parts.easting);
      const bucket = Math.floor(e / stepMeters);

      if (prevEBucket !== null && (bucket !== prevEBucket || prefix !== prevEPrefix)) {
        // Boundary crossed: record line at midpoint between prev and current x
        const lineX = Math.round((prevEBucketX + x) / 2);
        // The easting value at the boundary is bucket * stepMeters (the new bucket's floor)
        const eastingVal = bucket * stepMeters;
        vLines.push({ screenX: lineX, label: formatMgrsLabel(prefix, eastingVal, stepMeters) });
      }
      prevEBucket = bucket;
      prevEPrefix = prefix;
      prevEBucketX = x;
    }

    // Horizontal scan: march down rows, sample at horizontal center
    let prevNBucket = null, prevNPrefix = null, prevNBucketY = 0;
    let prevNEasting = null;

    for (let y = 0; y <= H; y += STRIDE) {
      const ll = map.containerPointToLatLng([W / 2, y]);
      const parts = getMgrsComponents(ll.lat, ll.lng);
      if (!parts) { prevNBucket = null; continue; }
      const prefix = `${parts.zoneBand}${parts.square}`;
      const n = Number(parts.northing);
      const e = Number(parts.easting);
      const bucket = Math.floor(n / stepMeters);

      if (prevNBucket !== null && (bucket !== prevNBucket || prefix !== prevNPrefix)) {
        const lineY = Math.round((prevNBucketY + y) / 2);
        const northingVal = bucket * stepMeters;
        hLines.push({ screenY: lineY, label: formatMgrsLabel(prefix, northingVal, stepMeters), easting: e, prefix });
      }
      prevNBucket = bucket;
      prevNPrefix = prefix;
      prevNBucketY = y;
      prevNEasting = e;
    }

    // --- Draw ---
    ctx.save();
    ctx.strokeStyle = this.options.color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.55;

    // For label density, aim for one label per ~160px
    const vStride = Math.max(1, Math.round(vLines.length / Math.max(1, W / 160)));
    const hStride = Math.max(1, Math.round(hLines.length / Math.max(1, H / 120)));

    vLines.forEach((line, i) => {
      ctx.beginPath();
      ctx.moveTo(line.screenX + 0.5, 0);
      ctx.lineTo(line.screenX + 0.5, H);
      ctx.stroke();
      if (i % vStride === 0) {
        ctx.restore();
        this._drawLabel(ctx, line.label, line.screenX + 4, 14);
        ctx.save();
        ctx.strokeStyle = this.options.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.55;
      }
    });

    hLines.forEach((line, i) => {
      ctx.beginPath();
      ctx.moveTo(0, line.screenY + 0.5);
      ctx.lineTo(W, line.screenY + 0.5);
      ctx.stroke();
      if (i % hStride === 0) {
        ctx.restore();
        // Pin label to left edge, just below the horizontal line.
        this._drawLabel(ctx, line.label, 6, line.screenY + 12);
        ctx.save();
        ctx.strokeStyle = this.options.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.55;
      }
    });

    ctx.restore();

    // --- Draw GZD (100km cell) boundaries at low zoom as heavier lines ---
    // When stepMeters >= 100000, also draw the 100km square outlines
    if (stepMeters >= 10000) {
      this._drawMgrsGzdLines(ctx, W, H);
    }
  },

  // Draw GZD (grid zone designation) heavy boundary lines using the same
  // scan-line approach but detecting zone+square prefix changes.
  _drawMgrsGzdLines(ctx, W, H) {
    const map = this._map;
    const STRIDE = 4;

    ctx.save();
    ctx.strokeStyle = this.options.color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.75;
    ctx.setLineDash([]);

    // Vertical: detect zone boundary (zone number or square letter changes)
    let prevZone = null, prevX = 0;
    for (let x = 0; x <= W; x += STRIDE) {
      const ll = map.containerPointToLatLng([x, H / 2]);
      const parts = getMgrsComponents(ll.lat, ll.lng);
      if (!parts) { prevZone = null; continue; }
      const zone = parts.zoneBand; // e.g. "11S"
      if (prevZone !== null && zone !== prevZone) {
        const lx = Math.round((prevX + x) / 2) + 0.5;
        ctx.beginPath(); ctx.moveTo(lx, 0); ctx.lineTo(lx, H); ctx.stroke();
      }
      prevZone = zone; prevX = x;
    }

    // Horizontal: detect latitude band change
    let prevBand = null, prevY = 0;
    for (let y = 0; y <= H; y += STRIDE) {
      const ll = map.containerPointToLatLng([W / 2, y]);
      const parts = getMgrsComponents(ll.lat, ll.lng);
      if (!parts) { prevBand = null; continue; }
      const band = parts.zoneBand.replace(/\d+/, ''); // just the letter
      if (prevBand !== null && band !== prevBand) {
        const ly = Math.round((prevY + y) / 2) + 0.5;
        ctx.beginPath(); ctx.moveTo(0, ly); ctx.lineTo(W, ly); ctx.stroke();
      }
      prevBand = band; prevY = y;
    }

    ctx.restore();

    // Label GZD cells at their screen center
    this._labelMgrsGzdCells(ctx, W, H);
  },

  _labelMgrsGzdCells(ctx, W, H) {
    const map = this._map;
    // Track the topmost-then-leftmost screen point seen for each GZD cell
    // so labels are placed at the top-left corner of each visible cell.
    const cellTopLeft = new Map();
    const STRIDE = 8;
    for (let y = 0; y <= H; y += STRIDE) {
      for (let x = 0; x <= W; x += STRIDE) {
        const ll = map.containerPointToLatLng([x, y]);
        const parts = getMgrsComponents(ll.lat, ll.lng);
        if (!parts) continue;
        const key = `${parts.zoneBand}${parts.square}`;
        if (!cellTopLeft.has(key)) {
          cellTopLeft.set(key, { x, y });
        }
      }
    }
    cellTopLeft.forEach(({ x, y }, key) => {
      const lx = Math.max(4, Math.min(x + 4, W - 60));
      const ly = Math.max(14, Math.min(y + 14, H - 4));
      this._drawLabel(ctx, key, lx, ly);
    });
  },

});

const CanvasViewshedLayer = L.Layer.extend({
  initialize(options) {
    this.options = options;
    this._canvas = null;
    this._frame = null;
    this._colorCache = null;
  },

  onAdd(map) {
    this._map = map;
    this._canvas = L.DomUtil.create("canvas", "leaflet-viewshed-canvas");
    const pane = map.getPane(this.options.pane || "overlayPane");
    pane.appendChild(this._canvas);
    this._ensureColorCache();
    this._canvas.style.opacity = String(this.options.opacity ?? 0.7);
    map.on("moveend zoomend resize", this._scheduleRedraw, this);
    this._scheduleRedraw();
  },

  onRemove(map) {
    map.off("moveend zoomend resize", this._scheduleRedraw, this);
    if (this._frame !== null) {
      window.cancelAnimationFrame(this._frame);
      this._frame = null;
    }
    if (this._canvas?.parentNode) {
      this._canvas.parentNode.removeChild(this._canvas);
    }
    this._canvas = null;
  },

  setOpacity(opacity) {
    this.options.opacity = opacity;
    if (this._canvas) {
      this._canvas.style.opacity = String(opacity);
    }
  },

  _ensureColorCache() {
    if (this._colorCache?.length === this.options.rssi?.length) {
      return;
    }

    const rssi = this.options.rssi ?? [];
    const lineOfSight = this.options.lineOfSight ?? [];
    this._colorCache = new Array(rssi.length);
    for (let index = 0; index < rssi.length; index += 1) {
      this._colorCache[index] = rssiColor(rssi[index], Boolean(lineOfSight[index]), 1);
    }
  },

  _scheduleRedraw() {
    if (this._frame !== null) {
      return;
    }

    this._frame = window.requestAnimationFrame(() => {
      this._frame = null;
      this._redraw();
    });
  },

  _redraw() {
    if (!this._map || !this._canvas) {
      return;
    }

    this._ensureColorCache();

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
    const colors = this._colorCache;
    const latHalf = this.options.gridLatStepDeg / 2;
    const lonHalf = this.options.gridLonStepDeg / 2;
    const south = bounds.getSouth();
    const north = bounds.getNorth();
    const west = bounds.getWest();
    const east = bounds.getEast();
    const wrapsDateLine = west > east;

    for (let index = 0; index < latitudes.length; index += 1) {
      const lat = latitudes[index];
      const lon = longitudes[index];
      const inLongitude = wrapsDateLine
        ? lon >= west || lon <= east
        : lon >= west && lon <= east;
      if (lat < south || lat > north || !inLongitude) {
        continue;
      }

      const northWest = this._map.latLngToLayerPoint([lat + latHalf, lon - lonHalf]).subtract(topLeft);
      const southEast = this._map.latLngToLayerPoint([lat - latHalf, lon + lonHalf]).subtract(topLeft);
      const width = Math.max(1, southEast.x - northWest.x);
      const height = Math.max(1, southEast.y - northWest.y);

      context.fillStyle = colors[index];
      context.fillRect(northWest.x, northWest.y, width, height);
    }
  },
});

init().catch((error) => {
  console.error(error);
  setStatus(`Startup failed: ${error.message}`, true);
});
