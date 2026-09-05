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
function ok(cond, msg) {
  lines.push((cond ? "PASS" : "FAIL") + "  " + msg);
  if (!cond) throw new Error(msg);
}

ok(PRISM.TIERS.length === 20, "20 tier records");
const seen = new Set();
for (let i = 1; i <= 20; i++) {
  const r = PRISM.mapDescent(i);
  ok(r.tierIndex === i, "integer " + i + " → tierIndex " + r.tierIndex);
  ok(r.name === NAMES[i - 1], "integer " + i + " → " + r.name);
  ok(r.blend === 0 || r.blend < 1e-12, "integer " + i + " blend ~0 got " + r.blend);
  ok(!seen.has(r.name), "unique name " + r.name);
  seen.add(r.name);
}
ok(seen.size === 20, "all 20 names unique");

const frac = PRISM.mapDescent(3.4);
ok(frac.tierIndex === 3, "3.4 stays on tier 3");
ok(frac.blend > 0 && frac.blend < 1, "fractional blend in (0,1) got " + frac.blend);
ok(frac.nextIndex === 4, "3.4 next is 4");

const wrapA = PRISM.mapDescent(21);
ok(wrapA.tierIndex === 1, "21 wraps to tier 1 got " + wrapA.tierIndex);
ok(wrapA.name === NAMES[0], "21 wraps to Laniakea Filament Web");
const wrapB = PRISM.mapDescent(20.0001);
ok(wrapB.tierIndex === 20 || wrapB.tierIndex === 1, "just past 20 is 20-blend or 1");
const wrapC = PRISM.mapDescent(40);
ok(wrapC.tierIndex === 20, "40 ≡ 20 Genesis, got " + wrapC.tierIndex + " " + wrapC.name);
const wrapD = PRISM.mapDescent(41);
ok(wrapD.tierIndex === 1 && wrapD.name === NAMES[0], "41 wraps to Laniakea, not clamp");

const cosmic = PRISM.audioForDescent(3);
ok(cosmic.band === "cosmic", "tier 3 audio band cosmic");
ok(cosmic.subHz < 50, "cosmic sub-bass < 50Hz got " + cosmic.subHz);
ok(cosmic.droneGain > cosmic.noiseGain, "cosmic drone dominates noise");

const crystal = PRISM.audioForDescent(12);
ok(crystal.band === "crystalline", "tier 12 audio band crystalline");
ok(crystal.fmHz > 300, "crystalline FM > 300Hz got " + crystal.fmHz);
ok(crystal.fmGain > cosmic.fmGain, "crystalline FM gain above cosmic");

const planck = PRISM.audioForDescent(18);
ok(planck.band === "planck", "tier 18 audio band planck");
ok(planck.noiseGain > planck.droneGain, "planck noise dominates drone " + planck.noiseGain + " vs " + planck.droneGain);

lines.push("OK  " + seen.size + " tiers, wrap, blend, audio curves");
console.log(lines.join("\n"));
process.exit(0);
