#!/usr/bin/env node
// restore-from-trash.js — restaura desde manifest.json
const fs = require("node:fs");
const path = require("node:path");
const minimist = require("minimist");
const micromatch = require("micromatch");

const args = minimist(process.argv.slice(2));
const manifestPath = args._[0];
if (!manifestPath) {
  console.error("Uso: node scripts/restore-from-trash.js __trash__/YYYYMMDD-HHMMSS/manifest.json [--overwrite] [--only "glob"]");
  process.exit(1);
}
const OVERWRITE = !!args.overwrite;
const ONLY = args.only ? String(args.only) : null;

const ROOT = process.cwd();

function ts(){
  const d = new Date();
  const pad = n => String(n).padStart(2,"0");
  return d.getFullYear().toString()+pad(d.getMonth()+1)+pad(d.getDate())+"-"+pad(d.getHours())+pad(d.getMinutes())+pad(d.getSeconds());
}

function loadManifest(p){
  try { return JSON.parse(fs.readFileSync(p, "utf8")); }
  catch(e){ console.error("No se pudo leer manifest:", e.message); process.exit(1); }
}

(function main(){
  const mf = loadManifest(manifestPath);
  const items = mf.items || [];
  const filter = ONLY ? (rel => micromatch.isMatch(rel, ONLY)) : (()=>true);
  const stamp = ts();

  for (const it of items) {
    if (!filter(it.from)) continue;
    const dest = path.join(ROOT, it.from);
    const src = path.join(ROOT, it.to);

    if (!fs.existsSync(src)) { console.warn("[SKIP] No existe en trash:", it.to); continue; }
    fs.mkdirSync(path.dirname(dest), { recursive: true });

    if (fs.existsSync(dest)) {
      if (!OVERWRITE) { console.warn("[SKIP] Ya existe:", it.from, "(usa --overwrite)"); continue; }
      const bak = dest + `.bak-${stamp}`;
      fs.renameSync(dest, bak);
      console.log("[BACKUP]", it.from, "->", path.relative(ROOT, bak));
    }

    fs.renameSync(src, dest);
    console.log("[RESTORED]", it.to, "->", it.from);
  }

  console.log("\nListo. Revisa conflictos marcados como BACKUP/ SKIP.");
})();