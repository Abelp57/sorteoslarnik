#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const fg = require("fast-glob");
const ROOT = process.argv[2] || ".";
const globsArg = process.argv[3];
const defaultGlobs = ["**/*.ts","**/*.tsx","**/*.js","**/*.css","**/*.png","**/*.jpg","**/*.jpeg","**/*.svg"];
const GLOBS = globsArg ? globsArg.split(",").map(s => s.trim()) : defaultGlobs;
(async () => {
  console.log("== Buscando duplicados por hash y por nombre ==");
  const files = await fg(GLOBS, { cwd: ROOT, dot: false, onlyFiles: true });
  if (files.length === 0) { console.log("No se encontraron archivos con los patrones dados."); return; }
  const byHash = new Map();
  for (const rel of files) {
    const full = path.join(ROOT, rel);
    try {
      const buf = fs.readFileSync(full);
      const h = crypto.createHash("sha256").update(buf).digest("hex");
      if (!byHash.has(h)) byHash.set(h, []);
      byHash.get(h).push(full);
    } catch {}
  }
  console.log("\n== Duplicados exactos (mismo contenido) ==");
  let anyDup = false;
  for (const [h, arr] of byHash) {
    if (arr.length > 1) { anyDup = true; console.log(`Hash ${h}`); arr.forEach(f => console.log(`  - ${f}`)); }
  }
  if (!anyDup) console.log("Sin duplicados exactos.");
  function similarity(a, b) {
    a = path.basename(a, path.extname(a)).toLowerCase();
    b = path.basename(b, path.extname(b)).toLowerCase();
    if (a === b) return 1;
    const min = Math.min(a.length, b.length);
    let eq = 0;
    for (let i=0;i<min;i++){ if(a[i]===b[i]) eq++; else break; }
    return eq / Math.max(a.length, b.length);
  }
  console.log("\n== Posibles duplicados por nombre (>= 0.8) ==");
  const fulls = files.map(f => path.join(ROOT, f)).sort();
  let nameDup = 0;
  for (let i=0;i<fulls.length;i++){
    for(let j=i+1;j<fulls.length;j++){
      const s = similarity(fulls[i], fulls[j]);
      if (s >= 0.8) { nameDup++; console.log(`${s.toFixed(2)}  ${fulls[i]}  <->  ${fulls[j]}`); }
    }
  }
  if (!nameDup) console.log("Sin coincidencias cercanas por nombre.");
})();