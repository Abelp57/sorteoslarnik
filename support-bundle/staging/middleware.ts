import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware safe:
 * - No toca assets ni archivos estáticos
 * - Deja pasar /api/*
 * - Redirige /admin a /admin/rifas (opcional, quita si no lo quieres)
 */
export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const { pathname } = url;

  // 1) Ignorar internals/static (evita recargas completas y errores raros)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/assets") ||
    /\.[a-zA-Z0-9]+$/.test(pathname) // cualquier archivo con extensión
  ) {
    return NextResponse.next();
  }

  // 2) Whitelist API completa (incluye /api/sponsors y tus endpoints admin)
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // 3) (Opcional) Evitar 404 en /admin → manda a /admin/rifas
  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/rifas", req.url));
  }

  // 4) Resto: no hacer nada
  return NextResponse.next();
}

/**
 * Matcher: ejecuta el middleware en todo menos archivos estáticos y favicon.
 * Esto reduce llamadas innecesarias del middleware.
 */
export const config = {
  matcher: ["/((?!_next|.*\\..*|favicon.ico).*)"],
};
