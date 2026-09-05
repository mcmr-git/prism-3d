#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const names = [
  "3D Chladni Nodal Surfaces",
  "Acoustic Levitation Manifold",
  "Fluid Faraday Wave Turbulence",
  "Sonoluminescence Plasma Core",
  "Quantum Acoustic Phonon Lattice",
  "Non-Euclidean 4D Cymatic Hypersphere",
  "Gravitational Wave Quadrupole Ripple",
  "The Infinite Sonic Singularity"
];
const banned = [
  "Organic Cellular Membrane & Cytoplasm",
  "DNA Double Helix & Ribosome Motors",
  "Terrestrial Biosphere Planet"
];
const lines = [];
let fail = 0;
function check(cond, msg) {
  lines.push((cond ? "PASS" : "FAIL") + "  " + msg);
  if (!cond) fail++;
}
names.forEach((n) => check(html.indexOf(n) !== -1, "name present: " + n));
banned.forEach((n) => check(html.indexOf(n) === -1, "organic label stripped: " + n));
check(/webgl2/i.test(html), "webgl2 context");
check(/#version 300 es/.test(html), "GLSL ES 3.00");
check(!/\bTHREE\b/.test(html) && !/three\.js/i.test(html), "no Three.js");
check(/<script id="prism-core">/.test(html), "inline prism-core");
check(!/type=["']module["']/.test(html), "no type=module");
check(!/importmap/i.test(html), "no import maps");
check(/createAnalyser|AnalyserNode/.test(html), "Web Audio analyser");
check(/fftSize\s*=\s*4096/.test(html), "64-band-capable FFT (4096)");
check(/getByteFrequencyData/.test(html), "frequency data");
[
  "deChladni", "deLevitate", "deFaraday", "deSono",
  "dePhonon", "deHypersphere", "deQuadrupole", "deSingularity"
].forEach((fn) => check(html.indexOf("float " + fn) !== -1, "DE " + fn));
check(/float j0\s*\(/.test(html) && /float jn\s*\(/.test(html), "spherical Bessel j_n");
check(/float legendP\s*\(/.test(html) && /float assocP\s*\(/.test(html), "Legendre P_n^m");
check(/pointerdown/.test(html) && /wheel/.test(html) && /click/.test(html), "pointer orbit/zoom/shockwave");
check(/touchmove/.test(html), "pinch zoom");
check(/fonts\.googleapis/.test(html) === false, "no Google Fonts CDN");
console.log(lines.join("\n"));
if (fail) process.exit(1);
process.exit(0);
