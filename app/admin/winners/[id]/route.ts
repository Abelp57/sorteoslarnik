import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

export async function PUT(req: Request, { params }: Params) {
  const body = await req.json();
  const w = await prisma.winner.update({
    where: { id: params.id },
    data: {
      name: body.name ?? null,
      phone: body.phone ?? null,
      prize: body.prize ?? null,
      raffleTitle: body.raffleTitle ?? null,
      proofImage: body.proofImage ?? null,
    },
  });
  return NextResponse.json({ ok: true, winner: w });
}

export async function DELETE(_req: Request, { params }: Params) {
  await prisma.winner.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
