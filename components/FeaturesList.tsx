"use client"

import React from "react"

type Props = {
  features: string[]
  initial?: number
}

// Icono automático por palabra clave (emoji)
function featureIcon(text: string): string {
  const s = text.toLowerCase()
  if (/(garant[ií]a|warranty)/.test(s)) return "🛡️"
  if (/(entrega|env[ií]o|mismo d[ií]a|inmediata)/.test(s)) return "🚚"
  if (/(gratis|sin costo)/.test(s)) return "🆓"
  if (/(factura|facturable|cfdi)/.test(s)) return "🧾"
  if (/(msi|meses sin intereses|tarjeta|pago)/.test(s)) return "💳"
  if (/(soporte|ayuda|atenci[oó]n|asesor)/.test(s)) return "🤝"
  if (/(devoluci[oó]n|reembolso)/.test(s)) return "↩️"
  if (/(stock|disponible|existencia)/.test(s)) return "📦"
  if (/(incluye|accesorios|regalo|bono)/.test(s)) return "🎁"
  if (/(instalaci[oó]n|reparaci[oó]n|servicio t[eé]cnico)/.test(s)) return "🛠️"
  if (/(original|autent|leg[ií]timo)/.test(s)) return "✅"
  if (/(nuevo|estreno)/.test(s)) return "🆕"
  if (/(oferta|promoci[oó]n|descuento)/.test(s)) return "🎉"
  if (/(demo|prueba|test)/.test(s)) return "🧪"
  if (/(seguro|seguridad|protecci[oó]n)/.test(s)) return "🔒"
  return "✅"
}

// Check SVG para el pill
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="currentColor" d="M9 16.17l-3.88-3.88-1.41 1.41L9 19 20.3 7.71l-1.41-1.41z"/>
    </svg>
  )
}

export default function FeaturesList({ features, initial = 8 }: Props) {
  const [expanded, setExpanded] = React.useState(false)
  const total = features.length
  const showToggle = total > initial
  const visible = expanded ? features : features.slice(0, initial)

  return (
    <div className="space-y-4">
      <ul className="grid sm:grid-cols-2 gap-3">
        {visible.map((f, i) => (
          <li key={i} className="group">
            <div className="flex items-start gap-3 rounded-2xl px-3 py-3 border border-white/10 bg-white/60 dark:bg-white/[0.06] backdrop-blur-sm hover:border-white/20 transition">
              <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <CheckIcon />
              </span>
              <div className="text-sm leading-relaxed">
                <div className="font-medium">{featureIcon(f)} <span className="opacity-90">{f}</span></div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {showToggle ? (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 shadow"
          >
            {expanded ? "Ver menos" : "Ver más"}
          </button>
          {!expanded ? (
            <span className="ml-2 text-xs opacity-70">({total - initial} más)</span>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}