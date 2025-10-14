export const dynamic = "force-dynamic";
import { prisma } from "@/lib/db";

type Props = { limit?: number };

export default async function SponsorsStrip({ limit = 24 }: Props) {
  const sponsors = await prisma.sponsor.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    take: limit,
  });

  if (!sponsors?.length) return null;

  return (
    <section aria-label="Patrocinadores" className="mx-auto w-full max-w-7xl px-4 py-14">
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Patrocinadores</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {sponsors.map((s: any) => (
          <a
            key={s.id}
            href={s.website ?? "#"}
            target={s.website ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition"
            title={s.name}
          >
            <div className="relative aspect-square">
              <img
                src={s.logoUrl}
                alt={s.name}
                loading="lazy"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="mt-3 text-sm text-white/90 line-clamp-2">{s.name}</p>
          </a>
        ))}
      </div>
    </section>
  );
}