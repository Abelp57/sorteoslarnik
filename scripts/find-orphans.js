#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");
const fg = require("fast-glob");
const ROOT = process.argv[2] || ".";
const SRC_GLOBS = ["app/**/*.{ts,tsx,js}","components/**/*.{ts,tsx,js}","lib/**/*.{ts,tsx,js}","types/**/*.{ts,tsx,js,d.ts}"];
const ASSET_GLOBS = ["public/**/*.{png,jpg,jpeg,svg,webp}","IMAGENES LARNIK/**/*.{png,jpg,jpeg,svg,webp}"];
function baseWithoutExt(p){ return p.replace(/\.(tsx?|jsx?)$/, ""); }
(async ()=>{
  const codeFiles = new Set();
  for(const g of SRC_GLOBS){ for(const f of await fg(g,{cwd:ROOT,onlyFiles:true})) codeFiles.add(path.join(ROOT,f)); }
  const importRe=/from\s+['"]([^'"]+)['"]|import\(['"]([^'"]+)['"]\)/g;
  const imports=new Set();
  for(const file of codeFiles){
    const src=fs.readFileSync(file,"utf8");
    let m; while((m=importRe.exec(src))){
      const spec=m[1]||m[2]; if(!spec) continue;
      if(spec.startsWith("http")) continue;
      if(spec.startsWith("@/")){ imports.add(spec.replace("@/","")); }
      else if(spec.startsWith("./")||spec.startsWith("../")){
        const resolved=path.normalize(path.join(path.dirname(file),spec));
        imports.add(path.relative(ROOT,resolved));
      }
    }
  }
  const allBases=new Set([...codeFiles].map(f=>baseWithoutExt(path.relative(ROOT,f))));
  const usedBases=new Set();
  for(const imp of imports){
    const candidates=[imp,imp+".ts",imp+".tsx",imp+".js",imp+"/index.tsx",imp+"/index.ts"];
    for(const c of candidates){ const b=baseWithoutExt(c); if(allBases.has(b)) usedBases.add(b); }
  }
  const orphans=[...allBases].filter(b=>!usedBases.has(b)&&!b.includes("tests/"));
  console.log("== Posibles huérfanos =="); orphans.forEach(o=>console.log(o));
  const allCodeText=[...codeFiles].map(f=>fs.readFileSync(f,"utf8")).join("\n");
  const assets=await fg(ASSET_GLOBS,{cwd:ROOT,onlyFiles:true});
  const assetHits=new Set();
  for(const a of assets){
    const norm=a.replace(/\\/g,"/").replace(/^public\//,"/");
    if(allCodeText.includes(norm)||allCodeText.includes(a)) assetHits.add(a);
  }
  const orphanAssets=assets.filter(a=>!assetHits.has(a));
  console.log("\n== Posibles assets no usados =="); orphanAssets.forEach(a=>console.log(a));
})();