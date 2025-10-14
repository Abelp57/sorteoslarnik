import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const items = await prisma.raffle.findMany({
    select: { id: true, title: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })
  return NextResponse.json({ ok: true, items })
}