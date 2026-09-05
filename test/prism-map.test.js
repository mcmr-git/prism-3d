#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const m = html.match(/<script id="prism-core">([\s\S]*?)<\/script>/);
if (!m) {
  console.error("FAIL: prism-core script missing from index.html");
  process.exit(1);
}
const ctx = { module: { exports: {} }, window: {} };
vm.createContext(ctx);
vm.runInContext(m[1], ctx);
const PRISM = ctx.PRISM || ctx.module.exports;
if (!PRISM || typeof PRISM.mapDescent !== "function") {
  console.error("FAIL: PRISM.mapDescent not exported from shipped source");
  process.exit(1);
}

const NAMES = [
  "3D Chladni Nodal Surfaces",
  "Acoustic Levitation Manifold",
  "Fluid Faraday Wave Turbulence",
  "Sonoluminescence Plasma Core",
  "Quantum Acoustic Phonon Lattice",
  "Non-Euclidean 4D Cymatic Hypersphere",
  "Gravitational Wave Quadrupole Ripple",
  "The Infinite Sonic Singularity"
];
const BANNED = [
  "Organic Cellular Membrane & Cytoplasm",
  "DNA Double Helix & Ribosome Motors",
  "Terrestrial Biosphere Planet"
];

const lines = [];
function ok(cond, msg) {
  lines.push((cond ? "PASS" : "FAIL") + "  " + msg);
  if (!cond) throw new Error(msg);
}

ok(PRISM.DOMAINS.length === 8, "8 domain records");
const seen = new Set();
for (let i = 1; i <= 8; i++) {
  const r = PRISM.mapDescent(i);
  ok(r.domainIndex === i || r.tierIndex === i, "integer " + i + " → index " + r.domainIndex);
  ok(r.name === NAMES[i - 1], "integer " + i + " → " + r.name);
  ok(r.blend === 0 || r.blend < 1e-12, "integer " + i + " blend ~0 got " + r.blend);
  ok(!seen.has(r.name), "unique " + r.name);
  seen.add(r.name);
}
ok(seen.size === 8, "all 8 names unique");
BANNED.forEach((n) => ok(!seen.has(n), "banned organic label absent: " + n));

const frac = PRISM.mapDescent(2.4);
ok(frac.domainIndex === 2, "2.4 stays on domain 2");
ok(frac.blend > 0 && frac.blend < 1, "fractional blend in (0,1) got " + frac.blend);

const wrap = PRISM.mapDescent(9);
ok(wrap.domainIndex === 1 && wrap.name === NAMES[0], "9 wraps to Chladni, not clamp");
ok(PRISM.mapDescent(17).name === NAMES[0], "17 wraps to domain 1");

ok(typeof PRISM.analyzeAudio === "function", "analyzeAudio exported");
const sr = 44100, fft = 4096, nBins = fft / 2;
function spec(fill) {
  const a = new Float32Array(nBins);
  for (let i = 0; i < nBins; i++) a[i] = fill(i, i * sr / fft);
  return a;
}
const low = spec((i, hz) => (hz >= 20 && hz < 60 ? 0.9 : 0.02));
const high = spec((i, hz) => (hz >= 6000 && hz < 20000 ? 0.9 : 0.02));
const zeros = new Float32Array(nBins);
const timeQuiet = new Float32Array(512);
const timeImpulse = new Float32Array(512);
timeImpulse[10] = 1;
const A = PRISM.analyzeAudio(low, timeQuiet, { sampleRate: sr, fftSize: fft, prevSpectrum: zeros });
const B = PRISM.analyzeAudio(high, timeQuiet, { sampleRate: sr, fftSize: fft, prevSpectrum: zeros });
ok(A.SubBass > A.Air, "low-frequency spectrum raises SubBass over Air " + A.SubBass + " vs " + A.Air);
ok(B.Air > B.SubBass, "high-frequency spectrum raises Air over SubBass " + B.Air + " vs " + B.SubBass);
const C = PRISM.analyzeAudio(low, timeImpulse, { sampleRate: sr, fftSize: fft, prevSpectrum: zeros });
ok(C.transient > A.transient, "impulse raises transient");
ok(C.flux > 0, "spectrum vs prev zeros raises flux " + C.flux);
ok(A.rms >= 0 && "pascals" in A, "RMS and pascals present");

const d1 = PRISM.droneForDomain(1);
const d8 = PRISM.droneForDomain(8);
ok(d1.subHz !== d8.subHz || d1.noiseGain !== d8.noiseGain, "drone params change Chladni vs Singularity");
ok(d8.noiseGain > d1.noiseGain, "singularity noiseGain > chladni");

lines.push("OK  8 domains, wrap, blend, FFT bands, drone");
console.log(lines.join("\n"));
process.exit(0);
