"use client";import { useEffect, useState } from 'react'

type TStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'BLOCKED'

export default function AdminTicketEditor({ raffleId, digits }: { raffleId: string; digits: number }) {
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<TStatus>('SOLD')
  const [message, setMessage] = useState('')
  const [list, setList] = useState<{ number: number; status: TStatus }[]>([])

  async function load() {
    const res = await fetch(`/api/rifas/${raffleId}/tickets`, { cache: 'no-store' })
    const data = await res.json()
    setList(data.tickets)
  }
  useEffect(() => { load() }, [])

  function parseNumbers(txt: string): number[] {
    return txt.split(/[,\s]+/).map(s => s.trim()).filter(Boolean).map(Number).filter(Number.isInteger)
  }

  async function apply() {
    setMessage('')
    const numbers = parseNumbers(input)
    if (!numbers.length) return setMessage('Ingresa números separados por coma o espacio.')

    let endpoint = ''
    if (status === 'SOLD') endpoint = 'sell'
    else if (status === 'RESERVED') endpoint = 'reserve'
    else if (status === 'AVAILABLE') endpoint = 'unreserve'
    else return setMessage('Status BLOCKED no implementado aquí.')

    try {
      const res = await fetch(`/api/rifas/${raffleId}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numbers }),
      })
      const txt = await res.text()
      let data: any = {}
      try { data = txt ? JSON.parse(txt) : {} } catch { data = { error: txt } }
      if (!res.ok || data?.ok === false) {
        const conflicts = data?.conflicts?.join(', ')
        setMessage(data?.error || (conflicts ? `Conflictos: ${conflicts}` : `Error ${res.status}`))
      } else {
        setMessage('Cambios aplicados.')
        setInput('')
        load()
      }
    } catch (e: any) {
      setMessage(e?.message || 'Error al aplicar la acción')
    }
  }

  function pad(n: number) {
    let s = String(n)
    while (s.length < digits) s = '0' + s
    return s
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <h2 className="text-lg font-medium text-white mb-3">Edición por lista</h2>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ej. 1, 99, 299, 1234"
          className="input input-bordered w-full text-white"
        />
        <select value={status} onChange={e => setStatus(e.target.value as TStatus)} className="select select-bordered text-white">
          <option value="SOLD">Marcar VENDIDO</option>
          <option value="RESERVED">Marcar APARTADO</option>
          <option value="AVAILABLE">Liberar (DISPONIBLE)</option>
        </select>
        <button className="btn btn-primary" onClick={apply}>Aplicar</button>
      </div>

      {message && <div className="mt-2 text-sm text-white">{message}</div>}

      <div className="mt-6">
        <h3 className="font-medium text-white mb-2">Estado actual <span className="text-white/60 text-xs">(primeros 400)</span></h3>
        <div className="flex flex-wrap gap-2">
          {list.slice(0, 400).map(t => (
            <span
              key={t.number}
              className={
                'px-2 py-1 rounded text-xs ' +
                (t.status === 'SOLD' ? 'bg-red-600 text-white' :
                 t.status === 'RESERVED' ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white')
              }
              title={t.status}
            >
              {pad(t.number)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}


