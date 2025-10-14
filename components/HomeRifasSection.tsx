import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PublicRaffleCard from "@/components/PublicRaffleCard";

export default async function HomeRifasSection() {
  const [items, total] = await Promise.all([
    prisma.raffle.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, title: true, shortDescription: true, mainImage: true, price: true },
    }),
    prisma.raffle.count({ where: { status: "PUBLISHED" } }),
  ]);

  return (
    <section id="rifas" className="container mx-auto p-6">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Rifas activas</h2>
          <p className="opacity-70 text-sm">Participa y gana. Envío de evidencia pública del ganador.</p>
        </div>
        {total > 6 ? (
          <Link
            href="/rifas"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm hover:bg-white/10 transition"
          >Ver todas las rifas<span aria-hidden>→</span>
          </Link>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className="opacity-80">No hay rifas publicadas todavía.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((r) => (
            <PublicRaffleCard key={r.id} raffle={r as any} />
          ))}
        </div>
      )}

      {total > 6 && (
        <div className="mt-8">
          <Link
            href="/rifas"
            className="block rounded-2xl border border-white/10 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 p-6 ring-1 ring-inset ring-white/10 hover:from-pink-500/25 hover:to-blue-500/25 transition"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xl font-semibold">Aún hay más rifas</div>
                <div className="opacity-80 text-sm">Explora todas y encuentra tu próxima suerte.</div>
              </div>
              <div className="shrink-0 rounded-full bg-white/10 px-4 py-2 text-sm">Ver más →</div>
            </div>
          </Link>
        </div>
      )}
    </section>
  );
}