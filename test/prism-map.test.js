#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const m = html.match(/<script id="prism-core">([\s\S]*?)<\/script>/);
if (!m) {
  console.error("FAIL: prism-core missing");
  process.exit(1);
}
const ctx = { module: { exports: {} }, window: {} };
vm.createContext(ctx);
vm.runInContext(m[1], ctx);
const P = ctx.PRISM || ctx.module.exports;
if (!P || typeof P.chladniField !== "function") {
  console.error("FAIL: shipped chladniField not exported");
  process.exit(1);
}

const lines = [];
function ok(cond, msg) {
  lines.push((cond ? "PASS" : "FAIL") + "  " + msg);
  if (!cond) throw new Error(msg);
}

ok(P.COUNT >= 100000 && P.COUNT <= 200000, "particle count in [1e5,2e5] got " + P.COUNT);

const f0 = P.chladniField(0, 0, 0, 1, 2, 1, 2);
ok(Math.abs(f0) < 1e-10, "origin is a node for (1,2) got " + f0);
const fOff = P.chladniField(0.35, 0.12, 0, 1, 2, 1, 2);
ok(Math.abs(fOff) > 1e-4, "off-node sample nonzero got " + fOff);
const trivial = P.chladniField(0.4, -0.25, 0.1, 3, 3, 1, 2);
ok(Math.abs(trivial) < 1e-10, "m=n is identically zero (trivial) got " + trivial);

const h0 = P.hzFromT(0), h1 = P.hzFromT(1), hMid = P.hzFromT(0.5);
ok(h0 === 20, "hzFromT(0)=20 got " + h0);
ok(h1 === 20000, "hzFromT(1)=20000 got " + h1);
ok(hMid > h0 && hMid < h1, "mid frequency between bounds");
ok(P.hzFromT(0.2) < P.hzFromT(0.8), "frequency map monotonic");
ok(P.hzFromT(-1) === 20 && P.hzFromT(2) === 20000, "frequency clamped to [20,20000]");

const lo = P.modesFromHz(20);
const hi = P.modesFromHz(20000);
ok(lo.m !== lo.n, "low mode m≠n");
ok(hi.m !== hi.n, "high mode m≠n");
ok(lo.m !== hi.m || lo.n !== hi.n || lo.l !== hi.l, "modes change across frequency sweep");
let changed = false;
let prev = P.modesFromHz(20);
for (let t = 0; t <= 1; t += 0.05) {
  const md = P.modesFromHz(P.hzFromT(t));
  ok(md.m !== md.n, "sweep m≠n at t=" + t.toFixed(2));
  if (md.m !== prev.m || md.n !== prev.n || md.l !== prev.l) changed = true;
  prev = md;
}
ok(changed, "modal (m,n,l) change as frequency sweeps");

const p = { x: 0.4, y: 0.25, z: 0.05, vx: 0, vy: 0, vz: 0 };
const settleParams = { m: 1, n: 2, l: 1, L: 2, dt: 0.016, attract: 3, damp: 0.92, jitter: 0, scatter: 0, zPull: 1 };
let fStart = Math.abs(P.chladniField(p.x, p.y, p.z, 1, 2, 1, 2));
for (let i = 0; i < 80; i++) P.stepParticle(p, settleParams);
const fEnd = Math.abs(P.chladniField(p.x, p.y, p.z, 1, 2, 1, 2));
ok(fEnd < fStart, "settle: |field| drops " + fStart.toFixed(4) + " → " + fEnd.toFixed(4));

const swarm = [];
for (let i = 0; i < 40; i++) {
  swarm.push({
    x: (Math.random() - 0.5) * 1.6,
    y: (Math.random() - 0.5) * 1.6,
    z: (Math.random() - 0.5) * 0.4,
    vx: 0, vy: 0, vz: 0
  });
}
const hold = { m: 1, n: 2, l: 1, L: 2, dt: 0.016, attract: 2.4, damp: 0.94, jitter: 0.001, scatter: 0, zPull: 1 };
for (let s = 0; s < 30; s++) swarm.forEach((q) => P.stepParticle(q, hold));
function meanSpeed(arr) {
  let a = 0;
  arr.forEach((q) => { a += Math.hypot(q.vx, q.vy, q.vz); });
  return a / arr.length;
}
const speedBefore = meanSpeed(swarm);
const jump = { m: 2, n: 5, l: 3, L: 2, dt: 0.016, attract: 2.4, damp: 0.94, jitter: 0.002, scatter: 1, zPull: 1 };
for (let s = 0; s < 4; s++) swarm.forEach((q) => P.stepParticle(q, jump));
const speedAfter = meanSpeed(swarm);
ok(speedAfter > speedBefore, "scatter: mean speed rises " + speedBefore.toFixed(4) + " → " + speedAfter.toFixed(4));

lines.push("OK  field, Hz map, modes, settle/scatter");
console.log(lines.join("\n"));
process.exit(0);
