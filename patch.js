// scripts/fix-admin-access.js
// Uso: node scripts/fix-admin-access.js
// Requisitos: Node 20+ / 22+

const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const log = (m) => console.log("✓", m);
const warn = (m) => console.warn("⚠", m);
const info = (m) => console.log("•", m);

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}
function backup(file) {
  if (fs.existsSync(file)) {
    const bak =
      file +
      "." +
      new Date().toISOString().replace(/[:.]/g, "-") +
      ".bak";
    fs.copyFileSync(file, bak);
    log(`Backup → ${bak}`);
  }
}
function writeFileSafe(file, content) {
  backup(file);
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content, "utf8");
  log(`Escribí ${path.relative(root, file)}`);
}

// 1) Parchar middleware.js con rateLimitOk "a prueba de fallos"
(function patchMiddleware() {
  const mwPath = path.join(root, "middleware.js");
  if (!fs.existsSync(mwPath)) {
    warn("No encontré middleware.js en la raíz. Me lo llevo completo (seguro).");
  } else {
    backup(mwPath);
  }

  const BASE =
    process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || "/panel";

  const middlewareJs = `import { NextResponse } from "next/server";

const PUBLIC_BASE = process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || "${BASE}";
const PROTECTED_PREFIXES = [PUBLIC_BASE, "/api/admin"];
const BLOCK_OLD_PREFIX = "/admin";

function pathStartsWith(pathname, base) {
  return pathname === base || pathname.startsWith(base + "/");
}
function parseAllowlist() {
  const raw = process.env.ADMIN_ALLOWLIST || "";
  return raw.split(",").map(s => s.trim()).filter(Boolean);
}
// Decodifica Basic → bytes "user:pass" (Edge-compatible)
function basicHeaderToBytes(authHeader) {
  if (!authHeader || !authHeader.startsWith("Basic ")) return null;
  try {
    const b64 = authHeader.slice(6);
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  } catch { return null; }
}
function toHex(ab) {
  const arr = new Uint8Array(ab);
  let out = "";
  for (let i = 0; i < arr.length; i++) out += arr[i].toString(16).padStart(2, "0");
  return out;
}
function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}
async function basicAuthOk(req) {
  const wantHex = (process.env.ADMIN_BASIC_SHA256 || "").toLowerCase();
  if (!wantHex) return false;
  const auth = req.headers.get("authorization") || "";
  const bytes = basicHeaderToBytes(auth);
  if (!bytes) return false;
  const digest = await crypto.subtle.digest("SHA-256", bytes.buffer);
  const gotHex = toHex(digest).toLowerCase();
  return constantTimeEqual(gotHex, wantHex);
}
// Rate-limit con try/catch (si Upstash está mal, no truena)
async function rateLimitOk(req) {
  const url = (process.env.UPSTASH_REDIS_REST_URL || "").trim();
  const token = (process.env.UPSTASH_REDIS_REST_TOKEN || "").trim();
  if (!url || !token) return true; // sin config → no limita

  try {
    const ip =
      req.headers.get("cf-connecting-ip") ||
      (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
      req.ip ||
      "unknown";
    const key = \`rl:\${ip}:\${new URL(req.url).pathname}\`;
    const body = [
      ["INCR", key],
      ["EXPIRE", key, 60],
      ["GET", key],
    ];
    const res = await fetch(\`\${url}/pipeline\`, {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${token}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) return true; // no romper si falla
    const data = await res.json();
    const current = parseInt(data?.[2]?.[1] || "0", 10);
    return current <= 20; // 20 req/min
  } catch {
    return true; // ante error de red/parámetros
  }
}

export async function middleware(req) {
  const { pathname } = new URL(req.url);

  // 0) 404 para /admin (ocultar)
  if (pathStartsWith(pathname, BLOCK_OLD_PREFIX)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // 1) ¿Ruta protegida?
  const protectedPath = PROTECTED_PREFIXES.some(px => pathStartsWith(pathname, px));
  if (!protectedPath) return NextResponse.next();

  // 2) Allowlist IP (si aplica)
  const allow = parseAllowlist();
  if (allow.length) {
    const ip =
      req.headers.get("cf-connecting-ip") ||
      (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
      req.ip ||
      "";
    if (!allow.includes(ip)) return new NextResponse("Forbidden", { status: 403 });
  }

  // 3) Rate limit (tolerante)
  if (!(await rateLimitOk(req))) return new NextResponse("Too Many Requests", { status: 429 });

  // 4) Basic Auth
  if (!(await basicAuthOk(req))) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": \`Basic realm="\${process.env.ADMIN_BASIC_REALM || "Restricted"}"\` }
    });
  }

  // 5) No indexar
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return res;
}
export const config = { matcher: ["/:path*"] };
`;
  writeFileSafe(mwPath, middlewareJs);
})();

// 2) Eliminar duplicados de middleware
(function removeDuplicateMiddlewares() {
  const candidates = [
    path.join(root, "middleware.ts"),
    path.join(root, "pages", "middleware.ts"),
    path.join(root, "pages", "middleware.js"),
    path.join(root, "src", "pages", "middleware.ts"),
    path.join(root, "src", "pages", "middleware.js"),
  ];
  let removed = 0;
  for (const f of candidates) {
    if (fs.existsSync(f)) {
      backup(f);
      fs.rmSync(f, { force: true });
      removed++;
      log(`Removido ${path.relative(root, f)}`);
    }
  }
  if (!removed) info("No había middlewares duplicados en pages/ o raíz .ts");
})();

// 3) Crear endpoint público app/api/winners/route.js
(function createPublicWinnersRoute() {
  const winnersRoute = path.join(root, "app", "api", "winners", "route.js");
  const routeJs = `import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const winners = await prisma.winner.findMany({
      // ajusta campo de orden si tienes 'createdAt'
      orderBy: { id: "desc" },
      take: 6,
      where: { published: true }, // si no existe 'published', quita esta línea
      select: {
        id: true, name: true, prize: true, imageUrl: true,
        // agrega aquí los campos que muestres en Home
      },
    });
    return NextResponse.json(winners);
  } catch (e) {
    return NextResponse.json({ error: "Failed to load winners" }, { status: 500 });
  }
}
`;
  writeFileSafe(winnersRoute, routeJs);
})();

// 4) Reemplazar todas las referencias a /api/admin/winners → /api/winners
(function replaceAdminWinnersCalls() {
  const exts = [".ts", ".tsx", ".js", ".jsx"];
  const changed = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // ignora node_modules y .next y .git
        if (/(^|[\\/])(node_modules|\.next|\.git)([\\/]|$)/.test(p)) continue;
        walk(p);
      } else {
        if (exts.includes(path.extname(p))) {
          const txt = fs.readFileSync(p, "utf8");
          if (txt.includes("/api/admin/winners")) {
            backup(p);
            const out = txt.split("/api/admin/winners").join("/api/winners");
            fs.writeFileSync(p, out, "utf8");
            changed.push(p);
          }
        }
      }
    }
  }
  walk(root);
  if (changed.length) {
    log(`Actualicé referencias en ${changed.length} archivo(s):`);
    changed.forEach((p) => console.log("  -", path.relative(root, p)));
  } else {
    info("No encontré referencias a /api/admin/winners (tal vez ya estaba cambiado).");
  }
})();

// 5) Vaciar variables de Upstash (desactivar rate-limit si estaban)
(function patchEnv() {
  const envPath = path.join(root, ".env.local");
  let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
  const setEnv = (k, v) => {
    const re = new RegExp("^" + k.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&") + "=.*$", "m");
    if (re.test(env)) env = env.replace(re, `${k}=${v}`);
    else env += (env.endsWith("\n") ? "" : "\n") + `${k}=${v}\n`;
  };
  setEnv("UPSTASH_REDIS_REST_URL", "");
  setEnv("UPSTASH_REDIS_REST_TOKEN", "");
  writeFileSafe(envPath, env);
})();

// 6) Limpiar .next
(function cleanNextCache() {
  const nextDir = path.join(root, ".next");
  if (fs.existsSync(nextDir)) {
    fs.rmSync(nextDir, { recursive: true, force: true });
    log("Limpié caché .next");
  } else {
    info("No había .next para limpiar");
  }
})();

console.log("\n✅ Listo. Ahora:\n  pnpm dev\n\nComprueba:\n  • /admin  → 404\n  • /panel  → 401 (Basic) → entra con tu usuario/contraseña\n  • Home → carga ganadores desde /api/winners\n");
