import DeleteRaffleButton from "./_components/DeleteRaffleButton"
import { prisma } from '@/lib/db'
import RaffleListClient from '@/components/RaffleListClient'

export const dynamic = 'force-dynamic'

export default async function AdminRifasListPage() {
  const raffles: any[] = await prisma.raffle.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="space-y-6">
      <div className="admin-card">
        <h1 className="text-2xl font-semibold">Lista de rifas</h1>
        <p className="text-white/80">Busca, filtra y alterna entre tarjetas o tabla.</p>
        </div>
      <RaffleListClient raffles={JSON.parse(JSON.stringify(raffles))} />
    </div>
  )
}



