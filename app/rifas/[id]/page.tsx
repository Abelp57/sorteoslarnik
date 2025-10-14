import RaffleDescription from "@/app/components/RaffleDescription";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TicketGrid from "@/components/TicketGrid";
import RealPhotos from "@/components/RealPhotos";
import RaffleCTA from "@/components/RaffleCTA";

type PageProps = { params: { id: string } };

function parseGallery(input?: string | null): string[] {
  if (!input) return [];
  const raw = (input || "").trim();
  try {
    const j = JSON.parse(raw);
    if (Array.isArray(j)) return j.map((x) => String(x || "")).filter(Boolean);
  } catch {}
  return raw.split(/[\n,]+/g).map((s) => s.trim()).filter((s) => s.length > 0);
}

export default async function RafflePage({ params }: PageProps) {
  const raffle = await prisma.raffle.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      title: true,
      price: true,
      digits: true,
      total: true,
      startNumber: true,
      status: true,
      mainImage: true,
      shortDescription: true,
      galleryImages: true,
      description: true, // usamos descripción
    },
  });
  if (!raffle) return notFound();

  const gallery = parseGallery(raffle.galleryImages);

  const tickets = await prisma.ticket.findMany({
    where: { raffleId: raffle.id },
    select: { number: true, status: true },
    orderBy: { number: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 space-y-8">
      <header className="flex flex-col md:flex-row gap-6">
        {raffle.mainImage ? (
          <img
            src={raffle.mainImage}
            alt={raffle.title}
            className="w-full md:w-1/2 h-64 object-cover rounded-2xl border border-black/10 dark:border-white/10"
          />
        ) : null}

        <div className="flex-1 space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold">{raffle.title}</h1>
          {raffle.shortDescription ? (
            <p className="text-sm opacity-80 whitespace-pre-line">
              {raffle.shortDescription}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-black/5 dark:bg-white/10 px-3 py-1 text-sm">
              Dígitos: <strong>{raffle.digits}</strong>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-black/5 dark:bg-white/10 px-3 py-1 text-sm">
              Total boletos: <strong>{raffle.total}</strong>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-black/5 dark:bg-white/10 px-3 py-1 text-sm">
              Inicio: <strong>{raffle.startNumber}</strong>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-green-500/15 text-green-700 px-3 py-1 text-sm">
              Precio: <strong>{"$"}{raffle.price} MXN</strong>
            </span>
          </div>

          <div className="pt-2">
            <RaffleCTA
              raffleId={raffle.id}
              title={raffle.title}
              price={raffle.price}
              gallery={gallery}
            />
          </div>
        </div>
      </header>

      {/* Descripción en texto plano elegante */}
      <RaffleDescription description={raffle.description} />

      <section id="boletos">
        <TicketGrid
          raffleId={raffle.id}
          title={raffle.title}
          price={raffle.price}
          startNumber={raffle.startNumber}
          total={raffle.total}
          tickets={tickets as any}
        />
      </section>

      {gallery.length > 0 ? <RealPhotos images={gallery} /> : null}
    </div>
  );
}
