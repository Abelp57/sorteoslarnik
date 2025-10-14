import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

async function parseBody(req: Request) {
  const ct = (req.headers.get('content-type') || '').toLowerCase()

  if (ct.includes('application/json')) {
    return await req.json()
  }
  if (ct.includes('application/x-www-form-urlencoded')) {
    const text = await req.text()
    const params = new URLSearchParams(text)
    const obj: any = Object.fromEntries(params.entries())
    ;['price','digits','total','startNumber'].forEach(k => {
      if (obj[k] !== undefined) obj[k] = Number(obj[k])
    })
    return obj
  }
  if (ct.includes('multipart/form-data')) {
    const form = await req.formData()
    const obj: any = {}
    for (const [k, v] of form.entries()) {
      if (typeof v === 'string') obj[k] = v
    }
    ;['price','digits','total','startNumber'].forEach(k => {
      if (obj[k] !== undefined) obj[k] = Number(obj[k])
    })
    return obj
  }

  // Fallback: intentar JSON
  try { return await req.json() } catch { return {} }
}

export async function POST(req: Request) {
  try {
    const b = await parseBody(req)
    const {
      title,
      price,
      digits,
      total,
      startNumber = 0,
      category = 'GENERAL',
      status = 'OPEN',
      mainImage,
      shortDescription
    } = b

    if (!title || price == null || digits == null || total == null) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 })
    }

    const raffle = await prisma.raffle.create({
      data: {
        title: String(title),
        price: Number(price),
        digits: Number(digits),
        total: Number(total),
        startNumber: Number(startNumber),
        category: String(category),
        status: String(status),
        mainImage: mainImage ?? null,
        shortDescription: shortDescription ?? null,
      },
    })

    return NextResponse.json({ ok: true, raffle })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'Unexpected error' }, { status: 500 })
  }
}