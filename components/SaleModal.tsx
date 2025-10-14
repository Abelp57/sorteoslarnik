"use client"

import React from "react"

type Mode = "buy" | "reserve"

function sanitizePhone(p?: string) {
  if (!p) return ""
  return (p || "").replace(/[^\d]/g, "")
}

function copyToClipboard(text: string) {
  try {
    navigator.clipboard.writeText(text)
  } catch {}
}

export default function SaleModal(props: {
  open: boolean
  onClose: () => void
  mode: Mode
  raffleTitle: string
  raffleId: string
  selectedNumbers?: number[]
  price?: number
  whatsappNumber?: string
  linkToRaffle?: string
}) {
  const {
    open,
    onClose,
    mode,
    raffleTitle,
    raffleId,
    selectedNumbers = [],
    price = 0,
    whatsappNumber,
    linkToRaffle
  } = props

  const phone = sanitizePhone(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || whatsappNumber || "")
  const isBuy = mode === "buy"
  const title = isBuy ? "Comprar ahora" : "Apartar boletos"
  const accentBtn =
    (isBuy ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-yellow-400 hover:bg-yellow-500 text-black")
  const altBtn =
    (isBuy ? "bg-yellow-400 hover:bg-yellow-500 text-black" : "bg-purple-600 hover:bg-purple-700 text-white")

  const nums = [...selectedNumbers].sort((a,b)=>a-b)
  const totalPrice = nums.length * (price || 0)

  const msg = nums.length > 0
    ? ( (isBuy ? "Hola, quiero comprar ahora estos boletos de " : "Hola, quiero apartar boletos para ") +
        '"' + raffleTitle + '".\n' +
        "Números: " + nums.join(", ") + "\n" +
        "Total: $" + totalPrice + " MXN\n" +
        "ID de rifa: " + raffleId )
    : ( (isBuy ? "Hola, me interesa comprar boletos de " : "Hola, me interesa apartar boletos de ") +
        '"' + raffleTitle + '".\n' +
        "¿Me ayudas con disponibilidad y formas de pago?\n" +
        "ID de rifa: " + raffleId )

  function goWhatsApp() {
    if (!phone) return
    const url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(msg)
    window.open(url, "_blank")
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 shadow-2xl text-neutral-900 dark:text-neutral-100 lx-modal-panel">
          <div className="p-4 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} aria-label="Cerrar" className="px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/10 lx-btn lx-btn-wa lx-btn-ghost">&times;</button>
          </div>

          <div className="p-5 space-y-4 text-sm leading-relaxed">
            <div className="space-y-1">
              <div className="font-medium">Rifa: <span className="opacity-90">{raffleTitle}</span></div>
              {nums.length > 0 ? (
                <div>Boletos: <span className="font-semibold">{nums.join(", ")}</span> — Total: <span className="font-semibold">{"$"}{totalPrice} MXN</span></div>
              ) : (
                <div className="opacity-80">Aún no seleccionas boletos. Puedes continuar y un asesor te ayuda a elegir.</div>
              )}
            </div>

            <div className="rounded-xl bg-black/5 dark:bg-white/5 p-3 lx-modal-panel">
              <p className="font-medium mb-1">¿Por qué con nosotros?</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Atención personalizada por WhatsApp.</li>
                <li>Comprobante inmediato de tus boletos.</li>
                <li>Sorteo público y transparente.</li>
                <li>Soporte antes y después de la compra.</li>
              </ul>
            </div>

            <div className="rounded-xl bg-black/5 dark:bg-white/5 p-3 lx-modal-panel">
              <p className="text-xs opacity-90 whitespace-pre-line">{msg}</p>
              <div className="mt-2">
                <button onClick={() => copyToClipboard(msg)} className="px-3 py-1 rounded border border-black/10 dark:border-white/10 text-xs hover:bg-black/5 dark:hover:bg-white/10">Copiar mensaje</button>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            {linkToRaffle ? (
              <a href={linkToRaffle} className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 text-sm hover:bg-black/5 dark:hover:bg-white/10 text-center w-full sm:w-auto">
                Elegir números
              </a>
            ) : null}
            <div className="sm:ml-auto flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button onClick={goWhatsApp} disabled={!phone} className={"px-4 py-2 rounded-xl text-sm font-semibold shadow " + accentBtn + (phone ? "" : " opacity-60 cursor-not-allowed")}>
                Contactar por WhatsApp
              </button>
              <button onClick={onClose} className={"px-4 py-2 rounded-xl text-sm font-semibold shadow " + altBtn}>
                Seguir viendo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
