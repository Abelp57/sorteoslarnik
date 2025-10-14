export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma"; // ← named import, no default
import RaffleForm, { RaffleValues } from "@/app/components/RaffleForm";
import { notFound } from "next/navigation";

type Props = { params: { id: string } };

export default async function EditRifaPage({ params }: Props) {
  const raffle = await prisma.raffle.findUnique({ where: { id: params.id } });
  if (!raffle) return notFound();

  const gallery = raffle.galleryImages ? JSON.parse(raffle.galleryImages) : [];

  const values: RaffleValues = {
    title: raffle.title,
    category: raffle.category ?? "GENERAL",
    price: raffle.price,
    digits: raffle.digits,
    total: raffle.total,
    startNumber: raffle.startNumber ?? 1,
    status: raffle.status,
    drawAt: raffle.drawAt ? raffle.drawAt.toISOString() : null,
    drawMethod: raffle.drawMethod ?? "LIVE_STREAM",
    drawPlatform: raffle.drawPlatform ?? "",
    mainImage: raffle.mainImage ?? "",
    galleryImages: Array.isArray(gallery) ? gallery : [],
    shortDescription: raffle.shortDescription ?? "",
    description: raffle.description ?? "", // ← usamos descripción
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Editar rifa</h1>
        <div className="flex gap-2">
          <a href={`/admin/rifas/${raffle.id}/tickets`} className="rounded-xl border px-3 py-2">Gestionar boletos</a>
          <a href="/admin/rifas" className="rounded-xl border px-3 py-2">← Volver</a>
        </div>
      </div>

      {/* envía al endpoint que redirige con 303 */}
      <RaffleForm action={`/api/raffles/${raffle.id}`} values={values} />
    </div>
  );
}
