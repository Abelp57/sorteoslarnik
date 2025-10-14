import HeroSection from "@/components/HeroSection";

import HomeRifasSection from "@/components/HomeRifasSection";
import HomeGanadoresSection from "@/components/HomeGanadoresSection";
import HowItWorks from "@/components/HowItWorks";
import SponsorsStrip from "@/components/SponsorsStrip";
import FAQ from "@/components/FAQ";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return (
    <main>
      <HeroSection />

      {/* Cómo funciona */}
      <section className="py-8">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <HowItWorks />
        </div>
      </section>

      {/* Rifas activas */}
      <section className="py-8">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <HomeRifasSection />
        </div>
      </section>

      {/* Ganadores */}
      <section className="py-8">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <HomeGanadoresSection />
        </div>
      </section>

      {/* Sponsors + FAQ */}
      <section className="py-8">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <SponsorsStrip />
          <FAQ />
        </div>
      </section>
    </main>
  );
}