import Link from "next/link";
import { prisma } from "@/lib/prisma";
export default async function HomeGanadoresSection() {
  const [items, total] = await Promise.all([
    prisma.winner.findMany({
      orderBy: [{ date: "desc" }, { id: "desc" }],
      take: 6,
      include: { raffle: { select: { title: true } } },
    }),
    prisma.winner.count(),
  ]);

  return (
    <section id="ganadores" className="container mx-auto p-6">
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-2xl font-bold">Ganadores</h2>
        {total > 6 && (
          <Link href="/ganadores" className="text-sm underline">Ver todos</Link>
        )}
      </div>

      {items.length === 0 ? (
        <p className="opacity-80">Aún no hay ganadores registrados.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((g: any) => (
            <article key={g.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="font-semibold text-lg">
                {g.name ?? "Ganador"}{typeof g.number !== "undefined" && g.number !== null ? ` �?" Boleto ${g.number}` : ""}
              </h3>
              {g.imageUrl && (
                <img src={g.imageUrl} alt={g.name ?? "Ganador"} className="w-full h-48 object-cover rounded-xl mt-2" />
              )}
              <div className="mt-2 text-sm opacity-80">
                {g.raffle?.title ? `Rifa: ${g.raffle.title}` : ""}
              </div>
              {g.date && (
                <div className="mt-1 text-xs opacity-60">Fecha: {new Date(g.date).toLocaleDateString()}</div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
