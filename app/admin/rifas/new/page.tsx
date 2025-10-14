export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import RaffleForm, { RaffleValues } from "@/app/components/RaffleForm";

export default async function NuevaRifaPage() {
  const defaults: RaffleValues = {
    title: "",
    category: "GENERAL",
    price: 0,
    digits: 4,
    total: 1000,
    startNumber: 1,
    status: "DRAFT",
    drawAt: null,
    drawMethod: "LIVE_STREAM",
    drawPlatform: "",
    mainImage: "",
    galleryImages: [],
    shortDescription: "",
    description: "",

    
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Crear rifa</h1>
        <a href="/admin/rifas" className="rounded-xl border px-3 py-2">Volver</a>
      </div>
      <RaffleForm action="/api/raffles" values={defaults} />
    </div>
  );
}



