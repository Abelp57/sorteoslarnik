export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import RaffleForm from "@/components/RaffleForm";
import { notFound } from "next/navigation";

type Props = { params: { id: string } };

export default async function EditRafflePage({ params }: Props) {
  const raffle = await prisma.raffle.findUnique({ where: { id: params.id } });
  if (!raffle) return notFound();

  const parseArr = (v: any): string[] => {
    try {
      if (Array.isArray(v)) return v as string[];
      if (typeof v === "string") return JSON.parse(v);
      return [];
    } catch { return []; }
  };

  const parseFeatures = (v: any): string[] => {
    const arr = parseArr(v);
    return Array.isArray(arr) ? arr.map(String) : [];
  };

  const values = {
    title: raffle.title ?? "",
    category: (raffle as any).category ?? "GENERAL",
    price: Number(raffle.price),
    digits: Number(raffle.digits),
    total: Number(raffle.total),
    startNumber: Number((raffle as any).startNumber ?? 1),
    status: (raffle as any).status ?? "DRAFT",
    drawAt: (raffle as any).drawAt as any,
    drawMethod: (raffle as any).drawMethod ?? "LIVE_STREAM",
    drawPlatform: (raffle as any).drawPlatform ?? "",
    mainImage: (raffle as any).mainImage ?? null,
    galleryImages: parseArr((raffle as any).galleryImages),
    shortDescription: (raffle as any).shortDescription ?? "",
    features: parseFeatures((raffle as any).features),
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Editar rifa</h1>
      <RaffleForm action={`/api/raffles/${params.id}`} values={values} />
    </div>
  );
}
