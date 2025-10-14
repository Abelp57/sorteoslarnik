"use client"

import Link from "next/link"
import StatusBadge from "./StatusBadge"
import DeleteRaffleButton from "./DeleteRaffleButton"

type Raffle = {
  id: string
  title: string
  price?: number
  mainImage?: string | null
  status?: string | null
}

export default function RaffleCard({ raffle }: { raffle: Raffle }) {
  return (
    <div className="rounded-2xl border border-white/10 p-4 bg-white/5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{raffle.title}</h3>
          {raffle.status ? <StatusBadge status={raffle.status as any} /> : null}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/rifas/${raffle.id}/tickets`}
            className="px-3 py-2 rounded bg-amber-400 hover:bg-amber-300 text-black font-medium"
          >
            Gestionar boletos
          </Link>
          <Link
            href={`/admin/rifas/${raffle.id}/edit`}
            className="px-3 py-2 rounded bg-zinc-700 hover:bg-zinc-600 text-white"
          >
            Editar
          </Link>
          <DeleteRaffleButton id={raffle.id} title={raffle.title ?? ''} compact />
        </div>
      </div>
    </div>
  )
}
