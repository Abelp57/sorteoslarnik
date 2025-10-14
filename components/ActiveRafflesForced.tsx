import PublicRaffleCard from "./PublicRaffleCard"
import { prisma } from "@/lib/prisma"

export default async function ActiveRafflesForced() {
  const raffles = await prisma.raffle.findMany({
    orderBy: { createdAt: "desc" },
    take: 12,
    select: {
      id: true, title: true, price: true,
      mainImage: true, shortDescription: true, status: true
    }
  })

  // Si ya filtras por status en la BD, perfecto; si no, mostramos todas.
  const list = raffles

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Rifas activas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(r => (
          <PublicRaffleCard
            key={r.id}
            raffle={{
              id: r.id,
              title: r.title,
              price: (r as any).price ?? undefined,
              mainImage: (r as any).mainImage ?? null,
              shortDescription: (r as any).shortDescription ?? null
            }}
          />
        ))}
      </div>
    </section>
  )
}