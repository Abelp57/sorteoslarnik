"use client";
import { usePathname } from "next/navigation";
import FloatingFlyer from "@/components/marketing/FloatingFlyer";

/**
 * Rutas donde NO debe mostrarse el flyer.
 * Agrega más prefijos si lo necesitas (ej. "/auth", "/dashboard", etc.)
 */
const BLOCKED_PREFIXES = ["/admin"];

export default function FlyerProvider() {
  const pathname = usePathname() || "/";
  const blocked = BLOCKED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
  if (blocked) return null;
  return <FloatingFlyer />;
}
