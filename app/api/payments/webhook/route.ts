import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function extractEventId(req: Request, body: any) {
  return body?.id ?? body?.event?.id ?? req.headers.get('x-event-id') ?? ''
}

export async function POST(req: Request) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const eventId = extractEventId(req, body)
  const provider = String(req.headers.get('x-provider') ?? 'unknown')
  if (!eventId) return NextResponse.json({ ok: false, error: 'Missing eventId' }, { status: 400 })

  try {
    // Nota: payload es String en la DB, guardamos JSON serializado
    await prisma.paymentWebhook.create({ data: { eventId, provider, payload: JSON.stringify(body) } })
  } catch (e: any) {
    if (String((e as any)?.code) === 'P2002' || /Unique constraint/i.test(String((e as any)?.message))) {
      return NextResponse.json({ ok: true, duplicate: true })
    }
    throw e
  }

  try {
    await prisma.$transaction(async (tx) => {
      // TODO: mapear datos reales del PSP y aplicar efectos de negocio
      // p.ej. confirmar pago y marcar tickets como SOLD
    })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Processing failed' }, { status: 500 })
  }
}