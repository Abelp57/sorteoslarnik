import Link from "next/link";
import { prisma } from "@/lib/prisma";
export default async function FeaturedStrip() {
  const primary = await prisma.raffle.findMany({
    where: { status: { in: ["ACTIVE","PUBLISHED","OPEN"] as any } },
    orderBy: { closeDate: "asc" },
    take: 12,
    select: { id: true, title: true, mainImage: true },
  });

  const items = primary.length
    ? primary
    : await prisma.raffle.findMany({
        orderBy: { createdAt: "desc" },
        take: 12,
        select: { id: true, title: true, mainImage: true },
      });

  if (!items.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-4">
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
        {items.map((r) => (
          <Link
            key={r.id}
            href={`/rifas/${r.id}`}
            className="snap-start shrink-0 w-36 rounded-xl bg-white/5 hover:bg-white/10 transition p-2"
            title={r.title}
          >
            <div className="aspect-video rounded-lg overflow-hidden bg-white/10">
              {r.mainImage ? (
                <img src={r.mainImage} alt={r.title} className="h-full w-full object-cover" loading="lazy" />
              ) : null}
            </div>
            <div className="mt-1 text-xs line-clamp-2 opacity-90">{r.title}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}