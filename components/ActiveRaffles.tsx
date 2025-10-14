import PublicRaffleCard from "./PublicRaffleCard"
import Link from "next/link";
import { prisma } from "@/lib/prisma";
export default async function ActiveRaffles() {
  let raffles = await prisma.raffle.findMany({
    where: { status: { in: ["ACTIVE","PUBLISHED","OPEN"] as any } },
    orderBy: { closeDate: "asc" },
    take: 12,
    select: { id: true, title: true, price: true, mainImage: true, shortDescription: true },
  });

  if (!raffles.length) {
    raffles = await prisma.raffle.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      select: { id: true, title: true, price: true, mainImage: true, shortDescription: true },
    });
  }

  return (
    <section id="rifas" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Rifas activas</h2>
        <Link href="/rifas" className="text-sm opacity-80 hover:opacity-100 transition">Ver todas las rifas</Link>
      </div>

      {!raffles.length ? (
        <p className="opacity-70">No hay rifas para mostrar.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {raffles.map((r) => (
            <li key={r.id}>
              <PublicRaffleCard raffle={r} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}