import { NextResponse } from 'next/server'
import { holdNumbers } from '@/lib/holds'

export async function POST(req: Request) {
  try {
    const { raffleId, numbers, buyerRef } = await req.json()
    if (!raffleId || !Array.isArray(numbers) || numbers.length === 0 || !buyerRef) {
      return NextResponse.json({ ok: false, error: 'Invalid payload' }, { status: 400 })
    }
    const { acquired, failed, ttl } = await holdNumbers(raffleId, numbers.map(Number), String(buyerRef))
    return NextResponse.json({ ok: true, acquired, failed, ttl })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Unexpected error' }, { status: 500 })
  }
}