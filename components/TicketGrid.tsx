"use client"

import React from "react"
import SaleModal from "./SaleModal"

type TicketStatus = "AVAILABLE" | "RESERVED" | "SOLD" | string

type Ticket = {
  number: number
  status: TicketStatus
}

type Props = {
  raffleId: string
  title: string
  price: number
  startNumber: number
  total: number
  tickets: Ticket[]
  whatsappNumber?: string
}

function sanitizePhone(p?: string) {
  if (!p) return ""
  return (p || "").replace(/[^\d]/g, "")
}

export default function TicketGrid({
  raffleId,
  title,
  price,
  startNumber,
  total,
  tickets,
  whatsappNumber
}: Props) {
  const [selected, setSelected] = React.useState<Set<number>>(new Set())
  const [modalOpen, setModalOpen] = React.useState(false)
  const [mode, setMode] = React.useState<"buy" | "reserve">("reserve")

  const statusByNumber = React.useMemo(() => {
    const map = new Map<number, TicketStatus>()
    for (const t of tickets) map.set(t.number, t.status)
    for (let n = startNumber; n < startNumber + total; n++) {
      if (!map.has(n)) map.set(n, "AVAILABLE")
    }
    return map
  }, [tickets, startNumber, total])

  const counts = React.useMemo(() => {
    let avail = 0, reserved = 0, sold = 0
    for (let n = startNumber; n < startNumber + total; n++) {
      const st = statusByNumber.get(n) || "AVAILABLE"
      if (st === "AVAILABLE") avail++
      else if (st === "RESERVED") reserved++
      else if (st === "SOLD") sold++
    }
    return { avail, reserved, sold }
  }, [statusByNumber, startNumber, total])

  const phone = sanitizePhone(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || whatsappNumber || "")
  const canCheckout = selected.size > 0 && phone.length > 8

  function toggleSelect(n: number) {
    const st = statusByNumber.get(n) || "AVAILABLE"
    if (st !== "AVAILABLE") return
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(n)) next.delete(n)
      else next.add(n)
      return next
    })
  }

  function openModalReserve() {
    setMode("reserve")
    setModalOpen(true)
  }
  function openModalBuy() {
    setMode("buy")
    setModalOpen(true)
  }

  const selectedArray = Array.from(selected).sort((a,b)=>a-b)

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="inline-flex items-center gap-2 rounded-full bg-green-500/15 text-green-600 px-3 py-1">
          <span className="h-3 w-3 rounded-full bg-green-500 inline-block" />
          Disponibles: <strong>{counts.avail}</strong>
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-yellow-500/20 text-yellow-700 px-3 py-1">
          <span className="h-3 w-3 rounded-full bg-yellow-500 inline-block" />
          Apartados: <strong>{counts.reserved}</strong>
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-red-500/15 text-red-600 px-3 py-1">
          <span className="h-3 w-3 rounded-full bg-red-500 inline-block" />
          Vendidos: <strong>{counts.sold}</strong>
        </span>
        <span className="ml-auto text-base">Precio: <strong>{"$"}{price} MXN</strong></span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
        {Array.from({ length: total }).map((_, idx) => {
          const num = startNumber + idx
          const st = statusByNumber.get(num) || "AVAILABLE"
          const isSelected = selected.has(num)

          const base = "h-10 rounded-md text-sm font-medium border transition select-none flex items-center justify-center lx-ticket lx-ticket-base duration-150 transform shadow-sm hover:shadow-md rounded-xl"
          let style = ""
          if (st === "AVAILABLE") {
            style = isSelected ? "bg-blue-600 text-white border-blue-600 ring-2 ring-blue-300 lx-ticket-selected"
              : "bg-white/80 dark:bg-white/10 hover:bg-blue-50 dark:hover:bg-white/20 border-gray-200 dark:border-white/10 cursor-pointer"
          } else if (st === "RESERVED") {
            style = "bg-yellow-200/60 text-yellow-900 border-yellow-300 cursor-not-allowed"
          } else {
            style = "bg-red-300/60 text-red-900 border-red-300 cursor-not-allowed line-through"
          }

          return (
            <button
              key={num}
              type="button"
              aria-label={"Boleto " + num + " (" + st + ")"}
              className={base + " " + style}
              onClick={() => toggleSelect(num)}
              disabled={st !== "AVAILABLE"}
            >
              {num}
            </button>
          )
        })}
      </div>

      {/* Barra de acción */}
      <div className="sticky bottom-4 inset-x-0 flex justify-center">
        <div className="w-full max-w-3xl rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/40 backdrop-blur p-4 flex items-center gap-3 sm:gap-4 shadow-lg">
          <div className="text-sm sm:text-base">
            Seleccionados: <strong>{selected.size}</strong> — Total: <strong>{"$"}{selected.size * price} MXN</strong>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-white/20 text-sm hover:bg-gray-50 dark:hover:bg-white/10"
            >
              Limpiar
            </button>
            <button
              type="button"
              onClick={openModalBuy}
              disabled={phone.length <= 8}
              className={"px-4 py-2 rounded-xl text-sm font-semibold shadow " + (phone.length > 8 ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-300 text-white/80 cursor-not-allowed")}
              title={phone ? "Comprar ahora" : "Configura NEXT_PUBLIC_WHATSAPP_NUMBER en .env.local"}
            >
              Comprar ahora
            </button>
            <button
              type="button"
              onClick={openModalReserve}
              disabled={phone.length <= 8}
              className={"px-4 py-2 rounded-xl text-sm font-semibold shadow " + (phone.length > 8 ? "bg-yellow-400 hover:bg-yellow-500 text-black" : "bg-yellow-200 text-gray-500 cursor-not-allowed")}
              title={phone ? "Apartar por WhatsApp" : "Configura NEXT_PUBLIC_WHATSAPP_NUMBER en .env.local"}
            >
              Apartar por WhatsApp
            </button>
          </div>
        </div>
      </div>

      <SaleModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={mode}
        raffleTitle={title}
        raffleId={raffleId}
        selectedNumbers={selectedArray}
        price={price}
        whatsappNumber={whatsappNumber}
      />
    </div>
  )
}

