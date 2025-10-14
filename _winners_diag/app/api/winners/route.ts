import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Nota: Winner no tiene createdAt. Ordenamos por date y luego id.
export async function GET() {
  const winners = await prisma.winner.findMany({
    orderBy: [{ date: "desc" }, { id: "desc" }],
    take: 50,
    include: { raffle: { select: { id: true, title: true, mainImage: true } } },
  });
  return NextResponse.json(winners);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const raffleId = String(body.raffleId ?? "").trim();
    const name = String(body.name ?? "").trim();
    const numberRaw = body.number ?? body.ticket ?? body.numberRaw ?? null;

    if (!raffleId || !name) {
      return NextResponse.json({ ok: false, error: "raffleId and name are required" }, { status: 400 });
    }

    const number =
      numberRaw === null || numberRaw === "" || typeof numberRaw === "undefined"
        ? null
        : Number(numberRaw);

    // Aseguramos date porque el schema Winner usa "date"
    const created = await prisma.winner.create({
      data: { raffleId, name, number, date: new Date() },
    });

    // Cerramos la rifa para que salga como finalizada en la UI
    await prisma.raffle.update({
      where: { id: raffleId },
      data: { status: "CLOSED", closeDate: new Date() },
    });

    return NextResponse.json({ ok: true, winner: created });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "unexpected error" }, { status: 500 });
  }
}
