'use client'

import { useMemo, useState } from 'react'
import RaffleCard from './RaffleCard'
import DeleteRaffleButton from './DeleteRaffleButton'
import StatusBadge from './StatusBadge'

type Raffle = {
  id: string
  title: string
  price: number
  status?: string
  createdAt?: string
  mainImage?: string
  digits?: number
  total?: number
}

export default function RaffleListClient({ raffles }: { raffles: Raffle[] }) {
  const [q, setQ] = useState('')
  const [view, setView] = useState<'cards'|'table'>('cards')
  const [status, setStatus] = useState<'ALL'|'DRAFT'|'PUBLISHED'|'ARCHIVED'>('ALL')
  const [sort, setSort] = useState<'newest'|'oldest'|'price_asc'|'price_desc'>('newest')

  const rows = useMemo(() => {
    let r = [...(raffles ?? [])]
    const needle = q.trim().toLowerCase()
    if (needle) {
      r = r.filter(x => x.title?.toLowerCase().includes(needle) || x.id?.includes(needle))
    }
    if (status !== 'ALL') {
      r = r.filter(x => (x.status ?? '').toUpperCase() === status)
    }
    r.sort((a, b) => {
      if (sort === 'price_asc')  return (a.price ?? 0) - (b.price ?? 0)
      if (sort === 'price_desc') return (b.price ?? 0) - (a.price ?? 0)
      const da = new Date(a.createdAt ?? 0).getTime()
      const db = new Date(b.createdAt ?? 0).getTime()
      return sort === 'oldest' ? da - db : db - da
    })
    return r
  }, [raffles, q, status, sort])

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por título o ID"
          className="px-3 py-2 rounded-md bg-white/5 border border-white/10 w-64"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="px-3 py-2 rounded-md bg-white/5 border border-white/10"
        >
          <option value="ALL">Todas</option>
          <option value="DRAFT">Borrador</option>
          <option value="PUBLISHED">Publicada</option>
          <option value="ARCHIVED">Archivada</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="px-3 py-2 rounded-md bg-white/5 border border-white/10"
        >
          <option value="newest">Más nuevas</option>
          <option value="oldest">Más antiguas</option>
          <option value="price_asc">Precio �?'</option>
          <option value="price_desc">Precio �?"</option>
        </select>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setView('cards')}
            className={"px-3 py-2 rounded-md border border-white/10 " + (view==='cards' ? 'bg-white/10' : 'bg-white/5')}
          >
            Tarjetas
          </button>
          <button
            onClick={() => setView('table')}
            className={"px-3 py-2 rounded-md border border-white/10 " + (view==='table' ? 'bg-white/10' : 'bg-white/5')}
          >
            Tabla
          </button>
        </div>
      </div>

      {view === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map(r => (<RaffleCard key={r.id} raffle={r} />))}
          {rows.length === 0 && <p className="text-white/70">Sin resultados.</p>}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-white/70">
              <tr>
                <th className="py-2 pr-4">Título</th>
                <th className="py-2 pr-4">Precio</th>
                <th className="py-2 pr-4">Estado</th>
                <th className="py-2 pr-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-t border-white/10">
                  <td className="py-2 pr-4">{r.title}</td>
                  <td className="py-2 pr-4">${r.price}</td>
                  <td className="py-2 pr-4"><StatusBadge status={r.status ?? ''} /></td>
                  <td className="py-2 pr-4">
                    <div className="flex flex-wrap gap-2">
                      <a href={`/admin/rifas/${r.id}/tickets`} className="px-2 py-1 rounded bg-white/5 border border-white/10">Gestionar boletos</a>
                      <a href={`/admin/rifas/${r.id}/edit`} className="px-2 py-1 rounded bg-white/5 border border-white/10">Editar</a>
                      <a href={`/rifas/${r.id}`} className="px-2 py-1 rounded bg-white/5 border border-white/10">Ver pública</a>
                      <DeleteRaffleButton id={r.id} title={r.title} compact />
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td className="py-4 text-white/70" colSpan={4}>Sin resultados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}