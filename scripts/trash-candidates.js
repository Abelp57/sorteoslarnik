#!/usr/bin/env node
// trash-candidates.js — mueve candidatos a __trash__/YYYYMMDD-HHMMSS con manifest.json
const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const fg = require("fast-glob");

const args = require("minimist")(process.argv.slice(2));
const ROOT = process.cwd();
const listFile = args.list;
const rawPaths = args.paths ? String(args.paths).split(",").map(s => s.trim()).filter(Boolean) : [];
if (!listFile && rawPaths.length === 0) {
  console.error("Uso: node scripts/trash-candidates.js --list candidatos.txt  (o)  --paths "file1,file2,..."");
  process.exit(1);
}

function ts(){
  const d = new Date();
  const pad = n => String(n).padStart(2,"0");
  return d.getFullYear().toString()+pad(d.getMonth()+1)+pad(d.getDate())+"-"+pad(d.getHours())+pad(d.getMinutes())+pad(d.getSeconds());
}

function readList(file){
  try {
    const txt = fs.readFileSync(file, "utf8");
    return txt.split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith("#"));
  } catch (e) {
    console.error("No se pudo leer la lista:", e.message);
    process.exit(1);
  }
}

(async () => {
  const candidates = new Set(rawPaths);
  if (listFile) for (const p of readList(listFile)) candidates.add(p);

  const stamp = ts();
  const trashRoot = path.join(ROOT, "__trash__", stamp);
  fs.mkdirSync(trashRoot, { recursive: true });

  const manifest = { movedAt: new Date().toISOString(), root: ROOT, items: [] };

  for (const rel of candidates) {
    const src = path.join(ROOT, rel);
    if (!fs.existsSync(src)) { console.warn("[SKIP] No existe:", rel); continue; }
    if (!fs.statSync(src).isFile()) { console.warn("[SKIP] No es archivo:", rel); continue; }

    const dest = path.join(trashRoot, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });

    try {
      fs.renameSync(src, dest);
      const size = fs.statSync(dest).size;
      manifest.items.push({ from: rel, to: path.relative(ROOT, dest), size });
      console.log("[MOVED]", rel, "->", path.relative(ROOT, dest));
    } catch (e) {
      console.error("[ERROR] Al mover", rel, e.message);
    }
  }

  const mfPath = path.join(trashRoot, "manifest.json");
  fs.writeFileSync(mfPath, JSON.stringify(manifest, null, 2));
  console.log("\nManifest:", path.relative(ROOT, mfPath));

  // Actualiza índice global
  const indexPath = path.join(ROOT, "__trash__", "index.json");
  let index = [];
  if (fs.existsSync(indexPath)) {
    try { index = JSON.parse(fs.readFileSync(indexPath, "utf8")); } catch {}
  }
  index.push({ stamp, manifest: path.relative(ROOT, mfPath), count: manifest.items.length, movedAt: manifest.movedAt });
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log("Index actualizado:", path.relative(ROOT, indexPath));
})();