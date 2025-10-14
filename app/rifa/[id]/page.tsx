export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PublicTicketGrid from "@/app/components/PublicTicketGrid";

type Props = { params: { id: string } };

export default async function RifaDetallePage({ params }: Props) {
  const raffle = await prisma.raffle.findUnique({ where: { id: params.id } });
  if (!raffle) notFound();

  // limpia reservas vencidas
  await prisma.$executeRaw`
  UPDATE Ticket
  SET status = 'AVAILABLE', reservedUntil = NULL
  WHERE raffleId = ${raffle.id}
    AND status = 'RESERVED'
    AND reservedUntil < ${new Date()}`;

  const tickets = await prisma.$queryRaw<
  { id: string; number: number; status: string | null; reservedUntil: string | null; buyerName: string | null; buyerTel: string | null; }[]
>`
  SELECT id, number, status, reservedUntil, buyerName, buyerTel
  FROM Ticket
  WHERE raffleId = ${raffle.id}
  ORDER BY number ASC
`;

  const gallery: string[] = raffle.galleryImages ? (() => { try { const v = JSON.parse(raffle.galleryImages); return Array.isArray(v) ? v : []; } catch { return []; } })() : [];
  const features: string[] = raffle.features ? (() => { try { const v = JSON.parse(raffle.features); return Array.isArray(v) ? v : []; } catch { return []; } })() : [];
  const portada = raffle.mainImage ||  "/placeholder.png";

  const drawDate = raffle.drawAt ? new Date(raffle.drawAt).toLocaleString() : "Por definir";
  const drawMethod = raffle.drawMethod ?? "Por definir";
  const drawPlatform = raffle.drawPlatform ?? "ï¿½";

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <img src={portada} alt={raffle.title} className="w-full rounded-xl border object-cover" />
          {!!gallery.length && (
            <div className="grid grid-cols-4 gap-2">
              {gallery.map((g) => (
                <img key={g} src={g} alt="foto" className="h-24 w-full object-cover rounded-lg border" />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">{raffle.title}</h1>
          {raffle.shortDescription && <p className="text-sm opacity-80">{raffle.shortDescription}</p>}

          <div className="rounded-xl border p-4 space-y-2">
            <div className="text-sm"><b>Fecha y hora:</b> {drawDate}</div>
            <div className="text-sm"><b>Mï¿½todo:</b> {drawMethod}</div>
            <div className="text-sm"><b>Plataforma / Medio:</b> {drawPlatform}</div>
          </div>

          {!!features.length && (
            <div>
              <h2 className="font-medium mb-2">Caracterï¿½sticas</h2>
              <ul className="list-disc pl-5 text-sm space-y-1">
                {features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Boletos</h2>
          <div className="text-sm opacity-70">Dï¿½gitos: {raffle.digits} · Total: {raffle.total}</div>
        </div>
        <PublicTicketGrid
          tickets={tickets.map(t => ({ ...t, status: t.status ?? 'AVAILABLE' }))}
          raffleTitle={raffle.title}
          raffleId={raffle.id}
          digits={raffle.digits}
        />
      </div>
    </div>
  );
}

