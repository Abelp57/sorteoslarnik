"use client"

import React from "react"
import RealPhotos from "./RealPhotos"
import SaleModal from "./SaleModal"

type Props = {
  raffleId: string
  title: string
  price: number
  gallery: string[]
  whatsappNumber?: string
}

export default function RaffleCTA({ raffleId, title, price, gallery, whatsappNumber }: Props) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Botón: Ver fotos reales (renderiza su propio modal) */}
      <RealPhotos images={gallery} title={title} />

      {/* Botón: Comprar boletos ¡YA! (morado grande) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group inline-flex items-center justify-center gap-3 px-5 py-3 rounded-2xl text-base font-extrabold text-white shadow-lg
                   bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:to-fuchsia-600
                   ring-1 ring-white/10 hover:ring-white/20 transition"
        aria-haspopup="dialog"
      >
        <span>⚡</span>
        <span>Comprar boletos ¡YA!</span>
      </button>

      {/* Modal en modo compra */}
      <SaleModal
        open={open}
        onClose={() => setOpen(false)}
        mode="buy"
        raffleTitle={title}
        raffleId={raffleId}
        selectedNumbers={[]}
        price={price}
        whatsappNumber={whatsappNumber}
        linkToRaffle="#boletos"
      />
    </div>
  )
}