// middleware.js — pide Basic Auth al menos 1 vez por arranque de server
import { NextResponse } from "next/server";

const PUBLIC_BASE = process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || "/panel";
const PROTECTED_PREFIXES = [PUBLIC_BASE, "/api/admin"];
const BLOCK_OLD_PREFIX = "/admin";

// === BOOT ID (cambia en cada arranque) ===
globalThis.__ADMIN_BOOT_ID__ = globalThis.__ADMIN_BOOT_ID__ || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
const BOOT_ID = globalThis.__ADMIN_BOOT_ID__;

function starts(pathname, base) {
  return pathname === base || pathname.startsWith(base + "/");
}
function parseAllowlist() {
  const raw = process.env.ADMIN_ALLOWLIST || "";
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}
function getClientIp(req) {
  return (
    req.headers.get("cf-connecting-ip") ||
    (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() ||
    req.ip ||
    ""
  );
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
  const bytes = basicHeaderToBytes(req.headers.get("authorization") || "");
  if (!bytes) return false;
  const digest = await crypto.subtle.digest("SHA-256", bytes.buffer);
  const gotHex = toHex(digest).toLowerCase();
  return constantTimeEqual(gotHex, wantHex);
}

// Rate-limit completamente apagado (evita errores si no usas Upstash)
async function rateLimitOk(_req) { return true; }

export async function middleware(req) {
  const url = new URL(req.url);
  const { pathname } = url;

  // 0) Oculta el path real de admin
  if (starts(pathname, BLOCK_OLD_PREFIX)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  // 1) Solo protegemos PUBLIC_BASE (/panel) y /api/admin/*
  const protectedPath = PROTECTED_PREFIXES.some((px) => starts(pathname, px));
  if (!protectedPath) return NextResponse.next();

  // 2) Allowlist por IP (si configuraste)
  const allow = parseAllowlist();
  if (allow.length) {
    const ip = getClientIp(req);
    if (!ip || !allow.includes(ip)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  // 3) Forzar reto 401 una vez por arranque
  const cookies = req.headers.get("cookie") || "";
  const hasBootCookie = cookies.split(/;\s*/).some(c => c.startsWith("admin_boot=") && c.split("=")[1] === BOOT_ID);
  if (!hasBootCookie) {
    // Lanzamos 401 con Set-Cookie para este BOOT_ID; el navegador mostrará el prompt
    return new NextResponse("Auth required", {
      status: 401,
      headers: {
        "WWW-Authenticate": `Basic realm="${(process.env.ADMIN_BASIC_REALM || "Restricted")} / ${BOOT_ID}"`,
        "Set-Cookie": `admin_boot=${BOOT_ID}; Path=/; HttpOnly; SameSite=Strict; Secure`
      }
    });
  }

  // 4) (No-op) rate limit
  if (!(await rateLimitOk(req))) {
    return new NextResponse("Too Many Requests", { status: 429 });
  }

  // 5) Basic Auth
  if (!(await basicAuthOk(req))) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": `Basic realm="${process.env.ADMIN_BASIC_REALM || "Restricted"}"` },
    });
  }

  // 6) No indexar
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return res;
}

export const config = { matcher: ["/:path*"] };
