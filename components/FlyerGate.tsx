"use client";
import { usePathname } from "next/navigation";
import FloatingFlyer from "./FloatingFlyer";

export default function FlyerGate() {
  const pathname = usePathname() || "";
  if (pathname.startsWith("/admin")) return null;
  return <FloatingFlyer />;
}