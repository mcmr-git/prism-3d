#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const lines = [];
let fail = 0;
function check(cond, msg) {
  lines.push((cond ? "PASS" : "FAIL") + "  " + msg);
  if (!cond) fail++;
}
check(/COUNT\s*=\s*(\d+)/.test(html), "COUNT constant present");
const cm = html.match(/COUNT\s*=\s*(\d+)/);
const count = cm ? parseInt(cm[1], 10) : 0;
check(count >= 100000 && count <= 200000, "COUNT in [100000,200000] got " + count);
check(/webgl2/i.test(html) && /getContext\(\s*["']webgl2["']/.test(html), "WebGL2 context");
check(/#version 300 es/.test(html), "GLSL ES 3.00");
check(/transformFeedback/i.test(html) && /TRANSFORM_FEEDBACK/.test(html), "Transform Feedback path");
check(/cos\(n \* PI \* px\) \* Math\.cos\(m \* PI \* py\)/.test(html)
  || /cos\(n \* PI \* px\)/.test(html), "JS cosine-difference field");
check(/cnx \* cmy - cmx \* cny/.test(html), "GLSL cosine-difference formula");
check(/#050505/.test(html), "background #050505");
check(/blendFunc\(\s*gl\.ONE\s*,\s*gl\.ONE\s*\)/.test(html), "additive blend");
check(/wheel/.test(html), "wheel frequency");
check(/pointerdown/.test(html) && /pointermove/.test(html), "pointer-drag orbit");
check(/touchmove/.test(html) && /pinch/.test(html), "touch/pinch");
check(/AudioContext/.test(html) && /createOscillator/.test(html), "Web Audio oscillator");
check(/type:\s*"sine"/.test(html) || /o\.type = "sine"/.test(html) || /type: "sine"/.test(html), "sine oscillator");
check(/toggleAudio/.test(html), "click toggle audio");
check(/>Hz</.test(html) && /id="hz"/.test(html), "HUD Hz");
check(/Modal Mode/.test(html) && /id="mode"/.test(html), "HUD Modal Mode");
check(/id="count"/.test(html), "HUD particle count");
check(!/\bTHREE\b/.test(html) && !/three\.js/i.test(html), "no Three.js");
check(!/type=["']module["']/.test(html), "no type=module");
check(!/importmap/i.test(html), "no import maps");
check(!/fonts\.googleapis/.test(html), "no Google Fonts");
check(!/<script\s+src=/.test(html), "no extra runtime script src");
check(!/EffectComposer|bloom|UnrealBloom/i.test(html), "no post-processing sludge");
console.log(lines.join("\n"));
if (fail) process.exit(1);
process.exit(0);
