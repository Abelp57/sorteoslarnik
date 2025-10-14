export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
type Props = { limit?: number };

export default async function SponsorsStrip({ limit = 24 }: Props) {
  const sponsors = await prisma.sponsor.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    take: limit,
    select: { id: true, name: true, logoUrl: true, website: true },
  });

  if (!sponsors.length) return null;

  return (
    <section aria-label="Patrocinadores" className="mx-auto w-full max-w-7xl px-4 py-14">
      <h2 className="text-xl font-semibold mb-4">Patrocinadores</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {sponsors.map((s) => (
          <a
            key={s.id}
            href={s.website || "#"}
            target={s.website ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="group rounded-xl bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition"
          >
            <div className="relative aspect-[3/2]">
              <img
                src={s.logoUrl || "/brand/favicon.png"}
                alt={s.name}
                loading="lazy"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="mt-3 text-sm opacity-90 line-clamp-2">{s.name}</p>
          </a>
        ))}
      </div>
    </section>
  );
}