import PublicRaffleCard from "@/components/PublicRaffleCard";
import { PrismaClient } from "@prisma/client";
export const dynamic = "force-dynamic";
const prisma = new PrismaClient();

export default async function RafflesPage() {
  const rifas = await prisma.raffle.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      shortDescription: true,
      description: true,
      mainImage: true,
      price: true,
      category: true,
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {rifas.map((r) => (
        <PublicRaffleCard key={r.id} raffle={r as any} />
      ))}
    </div>
  );
}