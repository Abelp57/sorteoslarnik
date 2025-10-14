"use client"

import React from "react"

function sanitizePhone(p?: string){ if(!p) return ""; return (p||"").replace(/[^\d]/g,"") }

export default function HowItWorks(){
  const wa = sanitizePhone(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "")
  const badge = "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium bg-white/10 ring-1 ring-white/10"

  function goWhats(){
    if(!wa) return
    const url = "https://wa.me/"+wa+"?text="+encodeURIComponent("Hola, quiero ayuda para comprar boletos.")
    window.open(url,"_blank")
  }

  return (
    <section id="como-funciona" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0b1220] via-[#111827] to-[#0b1220] text-white p-6 md:p-8 shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Cómo funciona</h2>
          <div className="flex items-center gap-2">
            <span className={badge}>🔒 Pagos seguros</span>
            <span className={badge}>🧾 Factura disponible</span>
            <span className={badge}>🎥 Sorteos públicos</span>
          </div>
        </div>

        {/* 3 pasos simples */}
        <ol className="grid md:grid-cols-3 gap-4">
          <li className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="h-8 w-8 rounded-full bg-violet-600/20 text-violet-300 flex items-center justify-center font-bold">1</span>
              <p className="font-semibold">Elige tu rifa</p>
            </div>
            <p className="text-sm opacity-80">Explora premios reales y verificados. Revisa detalles, galería y características.</p>
          </li>
          <li className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="h-8 w-8 rounded-full bg-violet-600/20 text-violet-300 flex items-center justify-center font-bold">2</span>
              <p className="font-semibold">Selecciona tus boletos</p>
            </div>
            <p className="text-sm opacity-80">Elige números disponibles en el grid. Puedes apartarlos o comprar al instante.</p>
          </li>
          <li className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="h-8 w-8 rounded-full bg-violet-600/20 text-violet-300 flex items-center justify-center font-bold">3</span>
              <p className="font-semibold">Paga y recibe comprobante</p>
            </div>
            <p className="text-sm opacity-80">Te guiamos por WhatsApp. Comprobante inmediato y participación confirmada.</p>
          </li>
        </ol>

        <p className="mt-6 text-xs md:text-sm opacity-70">
          Transparencia total: resultados públicos y notificaciones al ganador en tiempo real.
        </p>

        <div className="mt-4">
          <button onClick={goWhats} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-white/15 bg-white/5 hover:bg-white/10 transition" title={wa ? "Hablar por WhatsApp" : "Configura NEXT_PUBLIC_WHATSAPP_NUMBER"} disabled={!wa}>
            🙋 Hablar con un asesor
          </button>
        </div>
      </div>
    </section>
  )
}