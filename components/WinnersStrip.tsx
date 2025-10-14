import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default async function WinnersStrip() {
  const winners = await prisma.winner.findMany({
    include: {
      raffle: { select: { title: true, mainImage: true, id: true } },
    },
    orderBy: [{ date: "desc" }, { id: "desc" }],
    take: 12,
  });

  if (!winners.length) return null;

  return (
    <section className="py-10">
      <h2 className="text-2xl font-semibold mb-6">Ganadores recientes</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {winners.map((w) => (
          <article
            key={w.id}
            className="rounded-2xl border border-white/10 overflow-hidden bg-white/5"
            title={w.raffle?.title ?? ""}
          >
            {w.raffle?.mainImage ? (
              <img
                src={w.raffle.mainImage}
                alt={w.raffle.title}
                className="h-40 w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="h-40 w-full bg-white/10" />
            )}
            <div className="p-4">
              <p className="text-sm opacity-80">Rifa</p>
              <h3 className="font-semibold">{w.raffle?.title ?? "�?""}</h3>
              <div className="mt-2 text-sm">
                <p><span className="opacity-80">Ganador:</span> {w.name}</p>
                {w.number != null && (
                  <p><span className="opacity-80">Boleto:</span> {w.number}</p>
                )}
              </div>
              <p className="mt-2 text-xs opacity-70">
                {w.date ? new Date(w.date as unknown as string).toLocaleDateString("es-MX") : ""}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}