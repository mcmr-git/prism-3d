#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const names = [
  "Laniakea Filament Web",
  "Galaxy Cluster & Dark Matter Halo",
  "Spiral Galaxy Core & Stellar Arms",
  "Nebular Stellar Nursery",
  "Star System & Oort Cloud",
  "Gas Giant with Ring System & Aurora",
  "Terrestrial Biosphere Planet",
  "Megacity / Geodesic Architectural Sprawl",
  "Crystalline Monolith / Surface Micro-geometry",
  "Organic Cellular Membrane & Cytoplasm",
  "DNA Double Helix & Ribosome Motors",
  "Molecular Lattice & Electron Density Clouds",
  "Atomic Shell & Probability Orbitals (s, p, d, f)",
  "Nucleon Core (Protons / Neutrons)",
  "Quark-Gluon Plasma & Color Charge Flux",
  "Electroweak Symmetry Breaking Lattice",
  "Grand Unified Theory String Vibrations",
  "Quantum Foam / Spacetime Topology Fluctuations",
  "Event Horizon Throat & Wormhole Bridge",
  "Genesis Bang / New Multiverse Rebirth"
];
const lines = [];
let fail = 0;
function check(cond, msg) {
  lines.push((cond ? "PASS" : "FAIL") + "  " + msg);
  if (!cond) fail++;
}
names.forEach((n) => check(html.indexOf(n) !== -1, "name present: " + n));
check(/webgl2/i.test(html), "webgl2 context");
check(/#version 300 es/.test(html), "GLSL ES 3.00");
check(!/\bTHREE\b/.test(html) && !/three\.js/i.test(html) && !/from ['"]three['"]/.test(html), "no Three.js");
check(/<script id="prism-core">/.test(html), "inline prism-core (not a module import)");
check(!/type=["']module["']/.test(html), "no type=module");
check(!/importmap/i.test(html), "no import maps");
check(/getContext\(\s*["']webgl2["']/.test(html), "creates webgl2 context");
console.log(lines.join("\n"));
if (fail) process.exit(1);
process.exit(0);
