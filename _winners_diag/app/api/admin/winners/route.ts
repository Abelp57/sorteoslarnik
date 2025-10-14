?import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

// GET: lista de ganadores normalizada para Home/Admin
export async function GET(request: Request) {
  const url = new URL(request.url);
  const take = Math.min(parseInt(url.searchParams.get("take") || "12", 10), 50);
  const winners = await prisma.winner.findMany({
    orderBy: { createdAt: "desc" },
    take,
    include: {
      raffle: { select: { title: true, mainImage: true } },
    },
  });

  const data = winners.map((w: any) => ({
    id: w.id,
    name: w.name ?? null,
    phone: w.phone ?? null,
    photoUrl: w.photoUrl ?? w.raffle?.mainImage ?? null,
    prize: (typeof w.prize === "string" && w.prize.trim().length > 0)
      ? w.prize.trim()
      : (w.raffle?.title ?? null),
    raffleId: w.raffleId ?? null,
    createdAt: w.createdAt,
  }));

  return NextResponse.json({ ok: true, winners: data });
}

// POST: crea ganador respetando "prize" si viene; si va vacío, usa título de la rifa
export async function POST(request: Request) {
  const body = await request.json();
  const { raffleId, name, phone, photoUrl, prize } = body || {};

  if (!raffleId) {
    return NextResponse.json({ ok: false, error: "raffleId requerido" }, { status: 400 });
  }

  const raffle = await prisma.raffle.findUnique({
    where: { id: raffleId },
    select: { title: true },
  });

  if (!raffle) {
    return NextResponse.json({ ok: false, error: "Rifa no encontrada" }, { status: 404 });
  }

  const finalPrize =
    typeof prize === "string" && prize.trim().length > 0
      ? prize.trim()
      : raffle.title;

  const created = await prisma.winner.create({
    data: {
      raffleId,
      name: name ?? null,
      phone: phone ?? null,
      photoUrl: photoUrl ?? null, // tu UI debe guardar aquí la URL final del upload
      prize: finalPrize,
    },
  });

  return NextResponse.json({ ok: true, winner: created });
}
