import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
// Si tu helper exporta default:   import prisma from '@/lib/prisma'
// Si exporta nombrado:            import { prisma } from '@/lib/prisma'
import prisma from '@/lib/prisma';

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const id = params?.id;
  if (!id) return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 });

  try {
    await prisma.$transaction(async (tx) => {
      await tx.winner.deleteMany({ where: { raffleId: id } });
      await tx.ticket.deleteMany({ where: { raffleId: id } });
      await tx.raffle.delete({ where: { id } });
    });

    try { revalidateTag('raffles'); } catch {}
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? 'Delete failed' },
      { status: 500 }
    );
  }
}
