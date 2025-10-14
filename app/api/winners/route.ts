import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.winner.findMany({
    include: { raffle: { select: { title: true } } },
    orderBy: [{ date: "desc" }, { id: "desc" }],
  });

  const winners = rows.map((w) => ({
    id: w.id,
    name: w.name ?? null,
    phone: w.phone ?? null,
    prize: w.prize ?? null,
    number: w.number ?? null,
    date: w.date ? w.date.toISOString() : null,
    proofImage: (w as any).proofImage ?? (w as any).imageUrl ?? null,
    published: w.published ?? false,
    raffleId: w.raffleId ?? null,
    raffleTitle: (w as any).raffle?.title ?? null,
  }));

  return NextResponse.json({ winners });
}

export async function POST(req: Request) {
  const body = await req.json();

  // Normaliza campos de imagen
  const proofImage = body.proofImage ?? body.imageUrl ?? null;

  // Si no viene date, usa ahora
  const date: Date | null = body.date ? new Date(body.date) : new Date();

  const w = await prisma.winner.create({
    data: {
      name: body.name ?? null,
      phone: body.phone ?? null,
      prize: body.prize ?? null,
      number: body.number ?? null,
      date,
      // Guarda en ambos si tienes ambos en el schema; de lo contrario deja sólo el que exista.
      // @ts-ignore
      proofImage: "proofImage" in prisma.winner.fields ? proofImage : undefined,
      // @ts-ignore
      imageUrl: "imageUrl" in prisma.winner.fields ? proofImage : undefined,
      published: body.published ?? false,
      raffleId: body.raffleId ?? null,
    } as any,
  });

  return NextResponse.json({ ok: true, winner: w });
}
