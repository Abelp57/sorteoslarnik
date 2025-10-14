#!/usr/bin/env node
const { spawnSync } = require("node:child_process");
const path = require("node:path");
function run(bin,args,title){ console.log(`\n[Run] ${title}`); const r=spawnSync(bin,args,{stdio:"inherit",shell:process.platform==="win32"}); if(r.error) console.error(r.error); }
run("node",[path.join("scripts","audit-larnik.js")],"audit-larnik");
run("node",[path.join("scripts","find-orphans.js"),"."],"find-orphans");
run("node",[path.join("scripts","find-duplicates.js"),".","**/*.ts,**/*.tsx,**/*.js,**/*.png,**/*.jpg,**/*.svg"],"find-duplicates");
console.log("\nTerminado.");