import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { revalidateTag } from 'next/cache'

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = params?.id
  if (!id) return NextResponse.json({ ok: false, error: 'Missing id' }, { status: 400 })

  try {
    await prisma.$transaction(async (tx) => {
      try { await tx.winner.deleteMany({ where: { raffleId: id } }) } catch {}
      try { await tx.ticket.deleteMany({ where: { raffleId: id } }) } catch {}
      await tx.raffle.delete({ where: { id } })
    })
    try { revalidateTag('raffles'); revalidateTag(`raffle:${id}`) } catch {}
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Delete failed' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'