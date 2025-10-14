import type { Metadata } from "next";
import "./globals.css";
import GlobalBg from "@/components/GlobalBg";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import FlyerGate from "@/components/FlyerGate";
import FlyerProvider from "@/app/flyer-provider";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Sorteos Larnik",
  description: "Rifas verificables con evidencia pública del ganador.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="min-h-dvh bg-[#0b1220] text-white antialiased">
        <GlobalBg />
        <SiteHeader />
        {children}
        <FlyerProvider />
          <FlyerGate />

        <SiteFooter />
      </body>
    </html>
  );
}