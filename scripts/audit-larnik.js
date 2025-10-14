#!/usr/bin/env node
const { spawnSync } = require("node:child_process");
const steps = [
  { name: "TypeScript — tsc --noEmit", cmd: ["npx", ["tsc", "--noEmit"]] },
  { name: "ESLint — next lint", cmd: ["npx", ["next", "lint"]] },
  { name: "Depcheck — dependencias no usadas", cmd: ["npx", ["depcheck"]] },
  { name: "ts-prune — exports no usados", cmd: ["npx", ["ts-prune", "--ignore", "app/*,**/*.d.ts"]] },
  { name: "unimported — archivos no importados", cmd: ["npx", ["unimported"]] },
  { name: "madge — orphans", cmd: ["npx", ["madge", ".", "--extensions", "ts,tsx,js", "--orphans"]] },
  { name: "knip — análisis integral", cmd: ["npx", ["knip"]] },
];
function run(name, bin, args) {
  console.log(`\n[Audit] ${name}`);
  const res = spawnSync(bin, args, { stdio: "inherit", shell: process.platform === "win32" });
  if (res.error) console.error(res.error);
}
for (const s of steps) run(s.name, s.cmd[0], s.cmd[1]);
console.log("\nListo. Revisa WARN/ERROR en cada bloque.");