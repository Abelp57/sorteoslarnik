// quick-secure.js — setup inmediato del admin (sin arguments)
const fs = require("node:fs");
const path = require("node:path");

// === EDITA SOLO ESTAS 3 CONSTANTES ===
const BASE  = "/panel"; // URL pública del admin
const HASH  = "a6338ec6867c5013c25c62f212b6cc4b31bd06169f4a200438e64d96c4b8b879"; // SHA-256 de "usuario:contraseña"
const REALM = "Sorteos Larnik Admin";

// === utilidades ===
const root = process.cwd();
const backup = (file) => {
  if (fs.existsSync(file)) {
    const bak = file + "." + new Date().toISOString().replace(/[:.]/g, "-") + ".bak";
    fs.copyFileSync(file, bak);
    console.log("✓ Backup →", bak);
  }
};
const ensureDir = (d) => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); };

// ---------- next.config.js ----------
const nextConfigJs = `/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const base = process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || "${BASE}";
    return [
      { source: \`\${base}/:path*\`, destination: \`/admin/:path*\` },
      // { source: \`/api/panel/:path*\`, destination: \`/api/admin/:path*\` }, // opcional
    ];
  },
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "no-referrer" },
        { key: "Permissions-Policy", value: "geolocation=()" },
        { key: "Content-Security-Policy",
          value:"default-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https:;" },
      ],
    }];
  },
};
export default nextConfig;
`;
const nextConfigPathJs = path.join(root, "next.config.js");
if (fs.existsSync(path.join(root, "next.config.mjs"))) {
  console.warn("⚠️ Existe next.config.mjs (Next prioriza .mjs). Integra rewrites/headers ahí o renómbralo a .js.");
} else {
  backup(nextConfigPathJs);
  fs.writeFileSync(nextConfigPathJs, nextConfigJs, "utf8");
  console.log("✓ Escribí next.config.js");
}

// ---------- middleware.js ----------
const middlewareJs = `import { NextResponse } from "next/server";
const PUBLIC_BASE = process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || "${BASE}";
const PROTECTED_PREFIXES = [PUBLIC_BASE, "/api/admin"];
const BLOCK_OLD_PREFIX = "/admin";

function pathStartsWith(pathname, base){return pathname===base||pathname.startsWith(base+"/");}
function parseAllowlist(){return (process.env.ADMIN_ALLOWLIST||"").split(",").map(s=>s.trim()).filter(Boolean);}
// Decodifica Basic → bytes "user:pass" (Edge-compatible)
function basicHeaderToBytes(h){if(!h||!h.startsWith("Basic "))return null;try{const b64=h.slice(6),bin=atob(b64),bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);return bytes;}catch{return null;}}
function toHex(ab){const a=new Uint8Array(ab);let o="";for(let i=0;i<a.length;i++)o+=a[i].toString(16).padStart(2,"0");return o;}
function constantTimeEqual(a,b){if(a.length!==b.length)return false;let o=0;for(let i=0;i<a.length;i++)o|=a.charCodeAt(i)^b.charCodeAt(i);return o===0;}
async function basicAuthOk(req){
  const want=(process.env.ADMIN_BASIC_SHA256||"").toLowerCase(); if(!want) return false;
  const bytes=basicHeaderToBytes(req.headers.get("authorization")||""); if(!bytes) return false;
  const dig=await crypto.subtle.digest("SHA-256", bytes.buffer);
  const got=toHex(dig).toLowerCase();
  return constantTimeEqual(got,want);
}
function ipAllowed(req){
  const allow=parseAllowlist(); if(!allow.length) return true;
  const ip=req.headers.get("cf-connecting-ip")||(req.headers.get("x-forwarded-for")||"").split(",")[0].trim()||req.ip||"";
  return allow.includes(ip);
}
// (opcional) Upstash rate-limit
async function rateLimitOk(req){
  const url=process.env.UPSTASH_REDIS_REST_URL, token=process.env.UPSTASH_REDIS_REST_TOKEN;
  if(!url||!token) return true;
  const ip=req.headers.get("cf-connecting-ip")||(req.headers.get("x-forwarded-for")||"").split(",")[0].trim()||req.ip||"unknown";
  const key=\`rl:\${ip}:\${new URL(req.url).pathname}\`;
  const body=[["INCR",key],["EXPIRE",key,60],["GET",key]];
  const res=await fetch(\`\${url}/pipeline\`,{method:"POST",headers:{Authorization:\`Bearer \${token}\`,"Content-Type":"application/json"},body:JSON.stringify(body)});
  if(!res.ok) return true; const data=await res.json(); const current=parseInt(data?.[2]?.[1]||"0",10); return current<=20;
}
export async function middleware(req){
  const { pathname } = new URL(req.url);
  if (pathStartsWith(pathname, BLOCK_OLD_PREFIX)) return new NextResponse("Not Found", { status: 404 });
  const protectedPath = PROTECTED_PREFIXES.some(px=>pathStartsWith(pathname,px));
  if (!protectedPath) return NextResponse.next();
  if (!ipAllowed(req)) return new NextResponse("Forbidden", { status: 403 });
  if (!(await rateLimitOk(req))) return new NextResponse("Too Many Requests", { status: 429 });
  if (!(await basicAuthOk(req))) return new NextResponse("Auth required", { status: 401, headers: { "WWW-Authenticate": \`Basic realm="\${process.env.ADMIN_BASIC_REALM||"Restricted"}"\` }});
  const res = NextResponse.next(); res.headers.set("X-Robots-Tag","noindex, nofollow, noarchive"); return res;
}
export const config = { matcher: ["/:path*"] };
`;
const middlewarePath = path.join(root, "middleware.js");
backup(middlewarePath);
fs.writeFileSync(middlewarePath, middlewareJs, "utf8");
console.log("✓ Escribí middleware.js");

// ---------- lib/adminPath.js ----------
ensureDir(path.join(root, "lib"));
const adminPathJs = `export const ADMIN_BASE = process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || "${BASE}";
export const adminPath = (p = "") => (ADMIN_BASE + (p.startsWith("/") ? p : \`/\${p}\`)).replace(/\\/+$/, "");
`;
const adminPathFile = path.join(root, "lib", "adminPath.js");
backup(adminPathFile);
fs.writeFileSync(adminPathFile, adminPathJs, "utf8");
console.log("✓ Escribí lib/adminPath.js");

// ---------- public/robots.txt ----------
ensureDir(path.join(root, "public"));
const robotsPath = path.join(root, "public", "robots.txt");
let robots = fs.existsSync(robotsPath) ? fs.readFileSync(robotsPath, "utf8") : "User-agent: *\n";
function ensureDisallow(slug){
  if(!slug.startsWith("/")) slug="/"+slug;
  const pattern = new RegExp("^\\s*Disallow:\\s*"+slug.replace(/\//g,"\\/")+"\\s*$","m");
  if(!pattern.test(robots)){ if(!robots.endsWith("\n")) robots+="\n"; robots+="Disallow: "+slug+"\n"; }
}
backup(robotsPath);
ensureDisallow("/admin");
ensureDisallow(BASE);
fs.writeFileSync(robotsPath, robots, "utf8");
console.log("✓ Actualicé public/robots.txt");

// ---------- .env.local ----------
const envPath = path.join(root, ".env.local");
let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
function setEnv(key, value){
  const re = new RegExp("^"+key.replace(/[.*+?^${}()|[\\]\\\\]/g,"\\\\$&")+"=.*$","m");
  if (re.test(env)) env = env.replace(re, key+"="+value);
  else env += (env.endsWith("\n")?"":"\n") + key+"="+value+"\n";
}
setEnv("NEXT_PUBLIC_ADMIN_BASE_PATH", BASE);
setEnv("ADMIN_BASIC_SHA256", HASH);
setEnv("ADMIN_BASIC_REALM", JSON.stringify(REALM));
// Sin ADMIN_ALLOWLIST → acceso desde cualquier IP (solo Basic Auth)
backup(envPath);
fs.writeFileSync(envPath, env, "utf8");
console.log("✓ Actualicé .env.local");

console.log("\n✅ Listo. Reinicia el server y prueba:");
console.log("   • /admin  → 404");
console.log("   • "+BASE+" → 401 (Basic) → entra con tu usuario/contraseña originales.");
