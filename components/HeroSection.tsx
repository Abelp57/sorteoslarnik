import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function HeroSection(){ console.log("[HERO_RENDER] start");
  const hero = await prisma.homeHero.findFirst({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  if (!hero) return null;

  let bullets: string[] = [];
  if (hero.bullets) {
    const raw = String(hero.bullets);
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) bullets = parsed.filter(Boolean);
      else bullets = raw.split("\n").map(s => s.trim()).filter(Boolean);
    } catch {
      bullets = raw.split("\n").map(s => s.trim()).filter(Boolean);
    }
  }

  return (
    <section   data-hero="home-hero-admin" className="py-8 !block">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Texto */}
          <div className="text-white">
            {hero.ribbonText ? (
              <div className="inline-block mb-4 text-xs px-3 py-1 rounded-full bg-white/10 backdrop-blur">
                {hero.ribbonText}
              </div>
            ) : null}

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {hero.title}{" "}
              {hero.highlight ? <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">{hero.highlight}</span> : null}
            </h1>

            {hero.subtitle ? (
              <p className="mt-3 text-base md:text-lg text-white/80">{hero.subtitle}</p>
            ) : null}

            {bullets.length ? (
              <ul className="mt-4 space-y-2 text-sm text-white/80">
                {bullets.map((b, i) => (
                  <li key={i} className="flex gap-2 items-start">
                    <span className="mt-[6px] inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap gap-3">{hero.ctaPrimaryText && hero.ctaPrimaryUrl ? (
  <a href={hero.ctaPrimaryUrl}
     className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-500 text-white font-semibold shadow hover:bg-blue-400 transition">
    {hero.ctaPrimaryText}
  </a>
) : null}
{hero.ctaSecondaryText && hero.ctaSecondaryUrl ? (
  <a href={hero.ctaSecondaryUrl}
     className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-400 text-black font-semibold shadow hover:bg-amber-300 transition">
    {hero.ctaSecondaryText}
  </a>
) : null}
{hero.ctaThirdText && hero.ctaThirdUrl ? (
  <a href={hero.ctaThirdUrl}
     className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#25D366] text-black font-semibold shadow hover:bg-[#1ebe57] transition">
    {hero.ctaThirdText}
  </a>
) : null}</div>
          </div>

          {/* Imagen */}
          <div className="relative overflow-hidden rounded-2xl">
            <Image
              src={hero.desktopImageUrl || hero.mobileImageUrl || "/assets/hero.webp"}
              alt={hero.title || "Hero"}
              width={1280}
              height={720}
              priority
              className="w-full h-auto object-cover" unoptimized />
          </div>
        </div>
      </div>
    </section>
  );
}