import { NextResponse } from 'next/server'
import { verifyOwnership, releaseNumbers } from '@/lib/holds'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { raffleId, numbers, buyerRef, buyerName, buyerTel} = await req.json()
    if (!raffleId || !Array.isArray(numbers) || numbers.length === 0 || !buyerRef) {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 })
    }

    const owned = await verifyOwnership(raffleId, numbers, buyerRef)
    if (!owned) {
      return NextResponse.json({ ok: false, error: 'Numbers not held by this buyer' }, { status: 409 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.ticket.updateMany({
        where: { raffleId, number: { in: numbers }, status: { in: ['AVAILABLE', 'ON_HOLD'] } },
        data: { status: 'SOLD', buyerName, buyerTel, reservedUntil: null },
      })
      // TODO: crear/actualizar Order/Payment si aplica
    })

    await releaseNumbers(raffleId, numbers)
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Unexpected error' }, { status: 500 })
  }
}