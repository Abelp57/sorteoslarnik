import Link from "next/link";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata = { title: "Ganadores" };

export default async function GanadoresPage() {
  const ganadores = await prisma.winner.findMany({
    orderBy: [{ date: "desc" }, { id: "desc" }],
    include: { raffle: { select: { title: true } } },
  });

  return (
    <main className="container mx-auto p-6">
      <div className="flex items-end justify-between mb-6">
        <h1 className="text-3xl font-bold">Ganadores</h1>
        <Link href="/#ganadores" className="text-sm underline">Volver al inicio</Link>
      </div>

      {ganadores.length === 0 ? (
        <p>Todavía no hay ganadores registrados.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ganadores.map((g: any) => (
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
    </main>
  );
}
