'use client'

import { useState } from 'react'

export default function DeleteRaffleButton(
  { id, title, compact }: { id: string, title?: string, compact?: boolean }
) {
  const [loading, setLoading] = useState(false)

  async function onDel() {
    if (!confirm(`¿Eliminar la rifa "${title ?? id}"? Esta acción es permanente.`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/raffles/${id}/delete`, { method: 'DELETE' })
      const data = await res.json().catch(() => ({} as any))
      if (!res.ok || !data?.ok) {
        alert(data?.error ?? 'No se pudo eliminar')
      } else {
        location.reload()
      }
    } catch (e: any) {
      alert(e?.message ?? 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={onDel}
      disabled={loading}
      className={(compact ? 'px-2 py-1' : 'px-3 py-2') + ' rounded bg-red-600 hover:bg-red-700 text-white disabled:opacity-60'}
      title="Eliminar rifa"
    >
      {loading ? 'Eliminando…' : (compact ? 'Eliminar' : 'Eliminar rifa')}
    </button>
  )
}