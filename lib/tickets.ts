import { prisma } from '@/lib/db'

export function pad(num: number, size: number) {
  let s = String(num)
  while (s.length < size) s = '0' + s
  return s
}

export async function releaseExpiredReservations(raffleId: string) {
  const now = new Date()
  await prisma.ticket.updateMany({
    where: { raffleId, status: 'RESERVED', reservedUntil: { lt: now } },
    data: {
      status: 'AVAILABLE',
      reservedUntil: null,
      holderName: null,
      holderPhone: null,
      holderEmail: null,
    },
  })
}

// --- MONGO-SAFE: sin skipDuplicates ---
export async function ensureTicketsGenerated(raffleId: string) {
  const raffle = await prisma.raffle.findUnique({
    where: { id: raffleId },
    select: { startNumber: true, total: true, id: true },
  })
  if (!raffle) throw new Error('Rifa no encontrada')

  const start = raffle.startNumber ?? 1
  const total = raffle.total ?? 0
  if (total <= 0) return
  const end = start + total - 1

  // N�fºmeros ya existentes
  const existing = await prisma.ticket.findMany({
    where: { raffleId },
    select: { number: true },
  })
  const have = new Set(existing.map((t: any) => t.number))

  // Calcular faltantes
  const missing: { raffleId: string; number: number }[] = []
  for (let n = start; n <= end; n++) {
    if (!have.has(n)) missing.push({ raffleId, number: n })
  }
  if (!missing.length) return

  // Insertar por lotes y tolerar carreras (ignore P2002)
  for (let i = 0; i < missing.length; i += 500) {
    const chunk = missing.slice(i, i + 500)
    try {
      await prisma.ticket.createMany({ data: chunk })
    } catch (e: any) {
      // Si otro proceso cre�f³ algunos en paralelo, lo ignoramos
      if (e?.code !== 'P2002') throw e
    }
  }
}

export async function reserveNumbers(params: {
  raffleId: string
  numbers: number[]
  holdMinutes?: number
  holder?: { name?: string; phone?: string; email?: string }
}) {
  const { raffleId, numbers, holdMinutes = 15, holder } = params
  const nums = (numbers ?? []).map(n => Number(n)).filter(n => Number.isInteger(n))
  if (!nums.length) return { ok: false, conflicts: [], error: 'No se enviaron n�fºmeros v�f¡lidos' }

  await releaseExpiredReservations(raffleId)
  await ensureTicketsGenerated(raffleId)

  const reservedUntil = new Date(Date.now() + holdMinutes * 60 * 1000)

  const res = await prisma.ticket.updateMany({
    where: { raffleId, number: { in: nums }, status: 'AVAILABLE' },
    data: {
      status: 'RESERVED',
      reservedUntil,
      holderName: holder?.name ?? null,
      holderPhone: holder?.phone ?? null,
      holderEmail: holder?.email ?? null,
    },
  })

  if (res.count !== nums.length) {
    const tickets = await prisma.ticket.findMany({
      where: { raffleId, number: { in: nums } },
      select: { number: true, status: true },
    })
    const conflicts = tickets.filter((t: any) => t.status !== 'AVAILABLE').map((t: any) => t.number)
    return { ok: false, conflicts }
  }
  return { ok: true }
}

export async function sellNumbers(params: {
  raffleId: string
  numbers: number[]
  buyer?: { name?: string; phone?: string; email?: string }
}) {
  const { raffleId, numbers, buyer } = params
  const nums = (numbers ?? []).map(n => Number(n)).filter(n => Number.isInteger(n))
  if (!nums.length) return { ok: false, conflicts: [], error: 'No se enviaron n�fºmeros v�f¡lidos' }

  await releaseExpiredReservations(raffleId)
  await ensureTicketsGenerated(raffleId)

  const res = await prisma.ticket.updateMany({
    where: { raffleId, number: { in: nums }, status: { in: ['AVAILABLE', 'RESERVED'] } },
    data: {
      status: 'SOLD',
      reservedUntil: null,
      holderName: buyer?.name ?? null,
      holderPhone: buyer?.phone ?? null,
      holderEmail: buyer?.email ?? null,
    },
  })

  if (res.count !== nums.length) {
    const tickets = await prisma.ticket.findMany({
      where: { raffleId, number: { in: nums } },
      select: { number: true, status: true },
    })
    const conflicts = tickets.filter((t: any) => t.status === 'SOLD' || t.status === 'BLOCKED').map((t: any) => t.number)
    return { ok: false, conflicts }
  }

  // Recalcular vendidos
  const soldCount = await prisma.ticket.count({ where: { raffleId, status: 'SOLD' } })
  await prisma.raffle.update({ where: { id: raffleId }, data: { sold: soldCount } })

  return { ok: true }
}

export async function unreserveNumbers(raffleId: string, numbers: number[]) {
  const nums = (numbers ?? []).map(n => Number(n)).filter(n => Number.isInteger(n))
  if (!nums.length) return
  await prisma.ticket.updateMany({
    where: { raffleId, number: { in: nums }, status: 'RESERVED' },
    data: {
      status: 'AVAILABLE',
      reservedUntil: null,
      holderName: null,
      holderPhone: null,
      holderEmail: null,
    },
  })
}


