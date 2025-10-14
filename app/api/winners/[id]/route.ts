import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

export async function PUT(req: Request, { params }: Params) {
  const body = await req.json();
  const proofImage = body.proofImage ?? body.imageUrl ?? null;
  const date: Date | null = body.date ? new Date(body.date) : null;

  const w = await prisma.winner.update({
    where: { id: params.id },
    data: {
      name: body.name ?? undefined,
      phone: body.phone ?? undefined,
      prize: body.prize ?? undefined,
      number: body.number ?? undefined,
      date: date ?? undefined,
      // @ts-ignore
      proofImage: "proofImage" in prisma.winner.fields ? proofImage : undefined,
      // @ts-ignore
      imageUrl: "imageUrl" in prisma.winner.fields ? proofImage : undefined,
      published: typeof body.published === "boolean" ? body.published : undefined,
      raffleId: body.raffleId ?? undefined,
    } as any,
  });

  return NextResponse.json({ ok: true, winner: w });
}

export async function DELETE(_req: Request, { params }: Params) {
  await prisma.winner.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
