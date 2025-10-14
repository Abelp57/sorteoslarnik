?import SponsorsStrip from "@/components/SponsorsStrip";
import Link from "next/link";
import HomeRifasSection from "@/components/HomeRifasSection";
import HomeGanadoresSection from "@/components/HomeGanadoresSection";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import WinnersSection from '@/components/WinnersSection';

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  const heroUrl = "/assets/hero.webp";

  return (
    <main>
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium bg-white/10 ring-1 ring-white/10">
              �YZ? Rifas verificables �?� Premios reales
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-3">
              Sorteos <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">Larnik</span>
            </h1>
            <p className="opacity-80 mt-3 text-lg">Participa, gana y presume tu premio. Atención por WhatsApp y evidencia pública del ganador.</p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link href="/#rifas" className="rounded-xl px-5 py-3 bg-emerald-500/90 text-black font-medium hover:bg-emerald-400">Ver rifas</Link>
              <Link href="/#como-funciona" className="rounded-xl px-5 py-3 border border-white/10 hover:bg-white/10">Cómo funciona</Link>
              <a href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||"").replace(/[^\\d]/g,"")}?text=${encodeURIComponent("Hola, quiero info de las rifas")}`}
                 target="_blank" rel="noopener noreferrer"
                 className="rounded-xl px-5 py-3 bg-green-500/90 text-black font-medium hover:bg-green-400">WhatsApp</a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-white/10">
            <img src={heroUrl} alt="Premios y ganadores" className="w-full h-full object-cover" />
            <div className="absolute inset-0 ring-1 ring-black/10" />
          </div>
        </div>
      </section>

      {/* C�"MO FUNCIONA */}
      <section className="py-6">
        <HowItWorks />
      </section>

      {/* LISTADOS (máx 6 + Ver todas las rifas) */}
      <HomeRifasSection />
      <HomeGanadoresSection />

      {/* FAQ */}
      <section className="py-6">
        <SponsorsStrip />

        <FAQ />
      </section>
      <WinnersSection />
  <WinnersSection />
</main>
  );
}

