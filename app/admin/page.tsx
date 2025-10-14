export const dynamic = "force-dynamic";

import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function AdminHomePage() {
  // Resumen básico
  const [raffles, tickets] = await Promise.all([
    prisma.raffle.count().catch(()=>0),
    prisma.ticket.groupBy({ by: ['status'], _count: { status: true } }).catch(()=>[] as any[]),
  ])

  const t = (s: string) => tickets.find((x:any)=>String(x.status||'').toUpperCase()===s)?. _count?.status ?? 0
  const sold = t('SOLD')
  const reserved = t('RESERVED')
  const available = t('AVAILABLE')

  return (
    <div className="space-y-6">
      <div className="admin-card">
        <h1 className="text-2xl font-semibold">Panel principal</h1>
        <p className="text-white/80">Resumen rápido de tus rifas y boletos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="admin-card">
          <div className="text-white/70">Rifas activas</div>
          <div className="text-3xl font-semibold">{raffles}</div>
          <Link href="/admin/rifas" className="btn btn-ghost btn-sm mt-2">Ver rifas</Link>
        </div>
        <div className="admin-card">
          <div className="text-white/70">Boletos vendidos</div>
          <div className="text-3xl font-semibold">{sold}</div>
        </div>
        <div className="admin-card">
          <div className="text-white/70">Boletos reservados</div>
          <div className="text-3xl font-semibold">{reserved}</div>
        </div>
      </div>

      <div className="admin-card">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">Acciones rápidas</div>
            <div className="text-white/70">Crea una rifa o gestiona boletos de una existente.</div>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/rifas/new" className="btn btn-success">+ Nueva rifa</Link>
            <Link href="/admin/rifas" className="btn btn-outline">Ver todas las rifas</Link>
          </div>
        </div>
      </div>
    </div>
  )
}



