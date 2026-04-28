// Generates og-image.png — run once with: node generate-og-image.mjs
// Uses only Node built-ins (no canvas/puppeteer needed).
// Writes a 1200×630 PNG by encoding raw RGBA pixels.

import { writeFileSync } from "fs";
import { createHash } from "crypto";

const W = 1200, H = 630;
const pixels = new Uint8Array(W * H * 4);

function setPixel(x, y, r, g, b, a) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * W + x) * 4;
  // Alpha blend over existing
  const sa = a / 255;
  const da = pixels[i + 3] / 255;
  const oa = sa + da * (1 - sa);
  if (oa === 0) return;
  pixels[i]     = Math.round((r * sa + pixels[i]     * da * (1 - sa)) / oa);
  pixels[i + 1] = Math.round((g * sa + pixels[i + 1] * da * (1 - sa)) / oa);
  pixels[i + 2] = Math.round((b * sa + pixels[i + 2] * da * (1 - sa)) / oa);
  pixels[i + 3] = Math.round(oa * 255);
}

function gaussianBlurColumn(cx, width, r, g, b) {
  const sigma = width * 1.8;
  for (let x = cx - width * 5; x <= cx + width * 5; x++) {
    const dist = Math.abs(x - cx);
    const falloff = Math.exp(-(dist * dist) / (2 * sigma * sigma));
    const alpha = Math.round(falloff * 230);
    if (alpha < 2) continue;
    for (let y = 0; y < H; y++) {
      setPixel(x, y, r, g, b, alpha);
    }
  }
}

function drawSignalColumn(cx, intensity = 1.0) {
  // Purple outer halo
  gaussianBlurColumn(cx, 18, 130, 40, 200);
  // Orange mid glow
  gaussianBlurColumn(cx, 7, 240, 120, 20);
  // Yellow-white hot core
  gaussianBlurColumn(cx, 2, 253, 224, 100);
  // Intensity variation along Y (simulate the hotspots)
  for (let y = 0; y < H; y++) {
    const phase = (y / H) * Math.PI * 4 + cx * 0.03;
    const hot = 0.5 + 0.5 * Math.sin(phase) * intensity;
    const extra = Math.round(hot * 180);
    for (let dx = -1; dx <= 1; dx++) {
      setPixel(cx + dx, y, 253, 230, 140, extra);
    }
  }
}

// ── Background ──────────────────────────────────────────────────────────────
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const gy = y / H;
    const r = Math.round(10 + gy * 2);
    const g = Math.round(3 + gy * 1);
    const b = Math.round(20 + gy * 5);
    setPixel(x, y, r, g, b, 255);
  }
}

// ── Signal columns (matching SVG layout) ────────────────────────────────────
drawSignalColumn(20,  0.9);
drawSignalColumn(250, 0.55);
drawSignalColumn(466, 1.0);
drawSignalColumn(701, 0.65);
drawSignalColumn(889, 0.85);
drawSignalColumn(1176, 0.7);

// ── Faint horizontal noise streaks ──────────────────────────────────────────
const streaks = [
  [160, 280, 165], [430, 590, 282], [30, 120, 462],
  [490, 570, 528], [155, 310, 612],
];
for (const [x1, x2, sy] of streaks) {
  for (let x = x1; x <= x2; x++) {
    setPixel(x, sy, 249, 115, 22, 55);
  }
}

// ── Center vignette darkening ────────────────────────────────────────────────
const cx = W / 2, cy = H / 2;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const dx = (x - cx) / (W * 0.55);
    const dy = (y - cy) / (H * 0.55);
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0.5) {
      const v = Math.min(1, (dist - 0.5) / 0.5);
      setPixel(x, y, 0, 0, 0, Math.round(v * 140));
    }
    // Center glow — dark blue-purple behind text area
    const cdx = (x - cx) / (W * 0.3);
    const cdy = (y - cy) / (H * 0.3);
    const cd = Math.sqrt(cdx * cdx + cdy * cdy);
    if (cd < 1) {
      const v = Math.max(0, 1 - cd);
      setPixel(x, y, 20, 5, 45, Math.round(v * v * 180));
    }
  }
}

// ── Text: "RF SIM" rendered as pixel font using bitmap glyphs ────────────────
// Each glyph is 7 wide × 9 tall, drawn at 8x scale = 56×72px per char
// Spacing: 6px between chars at scale
const SCALE = 10;
const KERN = 8; // extra kerning between chars

// Minimal 7×9 bitmap glyphs (0=off, 1=on)
const glyphs = {
  R: [
    [1,1,1,1,1,0,0],
    [1,0,0,0,0,1,0],
    [1,0,0,0,0,1,0],
    [1,1,1,1,1,0,0],
    [1,0,0,1,0,0,0],
    [1,0,0,0,1,0,0],
    [1,0,0,0,0,1,0],
    [1,0,0,0,0,1,0],
    [0,0,0,0,0,0,0],
  ],
  F: [
    [1,1,1,1,1,1,0],
    [1,0,0,0,0,0,0],
    [1,0,0,0,0,0,0],
    [1,1,1,1,1,0,0],
    [1,0,0,0,0,0,0],
    [1,0,0,0,0,0,0],
    [1,0,0,0,0,0,0],
    [1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
  ],
  " ": Array(9).fill([0,0,0,0,0]),
  S: [
    [0,1,1,1,1,1,0],
    [1,0,0,0,0,0,0],
    [1,0,0,0,0,0,0],
    [0,1,1,1,1,0,0],
    [0,0,0,0,0,1,0],
    [0,0,0,0,0,1,0],
    [0,0,0,0,0,1,0],
    [1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0],
  ],
  I: [
    [1,1,1,1,1,0,0],
    [0,0,1,0,0,0,0],
    [0,0,1,0,0,0,0],
    [0,0,1,0,0,0,0],
    [0,0,1,0,0,0,0],
    [0,0,1,0,0,0,0],
    [0,0,1,0,0,0,0],
    [1,1,1,1,1,0,0],
    [0,0,0,0,0,0,0],
  ],
  M: [
    [1,0,0,0,0,0,1],
    [1,1,0,0,0,1,1],
    [1,0,1,0,1,0,1],
    [1,0,0,1,0,0,1],
    [1,0,0,0,0,0,1],
    [1,0,0,0,0,0,1],
    [1,0,0,0,0,0,1],
    [1,0,0,0,0,0,1],
    [0,0,0,0,0,0,0],
  ],
};

const chars = ["R","F"," ","S","I","M"];
const glyphW = 7, glyphH = 9;
const totalW = chars.reduce((sum, c) => sum + (c === " " ? 3 : glyphW) * SCALE + KERN, -KERN);
let startX = Math.round((W - totalW) / 2);
const startY = Math.round((H - glyphH * SCALE) / 2);

for (const ch of chars) {
  const glyph = glyphs[ch];
  const gw = ch === " " ? 3 : glyphW;
  if (ch !== " ") {
    // Glow pass
    for (let gy = 0; gy < glyphH; gy++) {
      for (let gx = 0; gx < gw; gx++) {
        if (glyph[gy][gx]) {
          const px = startX + gx * SCALE;
          const py = startY + gy * SCALE;
          for (let dy = -SCALE; dy < SCALE * 2; dy++) {
            for (let dx = -SCALE; dx < SCALE * 2; dx++) {
              const dist = Math.sqrt(dx * dx + dy * dy);
              const a = Math.round(Math.max(0, 1 - dist / (SCALE * 1.6)) * 90);
              setPixel(px + dx, py + dy, 125, 211, 252, a);
            }
          }
        }
      }
    }
    // Solid pixel pass
    for (let gy = 0; gy < glyphH; gy++) {
      for (let gx = 0; gx < gw; gx++) {
        if (glyph[gy][gx]) {
          for (let py = 0; py < SCALE; py++) {
            for (let px = 0; px < SCALE; px++) {
              setPixel(startX + gx * SCALE + px, startY + gy * SCALE + py, 240, 249, 255, 255);
            }
          }
        }
      }
    }
  }
  startX += gw * SCALE + KERN;
}

// ── Encode as PNG ─────────────────────────────────────────────────────────────
// Minimal PNG encoder (no deps)
function adler32(buf) {
  let a = 1, b = 0;
  for (const byte of buf) { a = (a + byte) % 65521; b = (b + a) % 65521; }
  return (b << 16) | a;
}
function crc32(buf) {
  const table = crc32.table ??= (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[i] = c;
    }
    return t;
  })();
  let c = 0xffffffff;
  for (const byte of buf) c = table[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function u32be(n) { return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff]; }
function chunk(type, data) {
  const t = [...type].map(c => c.charCodeAt(0));
  const d = [...data];
  const crc = crc32([...t, ...d]);
  return [...u32be(d.length), ...t, ...d, ...u32be(crc)];
}

// Deflate raw (uncompressed, split into 65535-byte blocks)
function deflateRaw(data) {
  const out = [0x78, 0x01]; // zlib header
  let pos = 0;
  while (pos < data.length) {
    const block = data.slice(pos, pos + 65535);
    const last = pos + block.length >= data.length ? 1 : 0;
    out.push(last, block.length & 0xff, (block.length >> 8) & 0xff,
             (~block.length) & 0xff, ((~block.length) >> 8) & 0xff);
    out.push(...block);
    pos += block.length;
  }
  const a = adler32(data);
  out.push(...u32be(a));
  return out;
}

// Build filtered scanlines (filter type 0 = None for each row)
const scanlines = [];
for (let y = 0; y < H; y++) {
  scanlines.push(0); // filter byte
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    scanlines.push(pixels[i], pixels[i+1], pixels[i+2], pixels[i+3]);
  }
}

const pngBytes = [
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, // PNG signature
  ...chunk("IHDR", [...u32be(W), ...u32be(H), 8, 6, 0, 0, 0]), // 8-bit RGBA
  ...chunk("IDAT", deflateRaw(scanlines)),
  ...chunk("IEND", []),
];

writeFileSync("og-image.png", Buffer.from(pngBytes));
console.log("✓ og-image.png written (1200×630)");
