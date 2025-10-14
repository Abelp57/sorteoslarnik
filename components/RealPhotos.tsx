"use client"

import React from "react"

type Props = { images: string[]; title?: string }

function normalize(urls: string[]) {
  const out: string[] = []
  const seen = new Set<string>()
  for (const u of urls) {
    const s = (u || "").trim()
    if (!s) continue
    if (seen.has(s)) continue
    seen.add(s)
    out.push(s)
  }
  return out
}

export default function RealPhotos({ images, title }: Props) {
  const imgs = normalize(images)
  const [open, setOpen] = React.useState(false)
  const [idx, setIdx] = React.useState(0)

  function openModal(start: number) { setIdx(start); setOpen(true) }
  function closeModal() { setOpen(false) }
  function next() { if (imgs.length) setIdx((idx + 1) % imgs.length) }
  function prev() { if (imgs.length) setIdx((idx - 1 + imgs.length) % imgs.length) }

  React.useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
      else if (e.key === "ArrowRight") next()
      else if (e.key === "ArrowLeft") prev()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, idx, imgs.length])

  if (imgs.length === 0) return null

  // Botón vistoso (morado degradado)
  const btn = "group inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold text-white shadow " +
              "bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:to-fuchsia-600 hover:shadow-lg transition"

  return (
    <div className="w-full">
      <button type="button" onClick={() => openModal(0)} className={btn} aria-haspopup="dialog">
        <span className="opacity-90">📷</span>
        <span>Ver fotos reales</span>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal} />

          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-neutral-900 to-black text-white shadow-2xl">
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                <div className="text-sm opacity-80">{title ? title : "Galería"}</div>
                <div className="flex items-center gap-4">
                  <div className="text-xs opacity-70">{idx + 1} / {imgs.length}</div>
                  <button onClick={closeModal} aria-label="Cerrar" className="px-2 py-1 rounded hover:bg-white/10">✕</button>
                </div>
              </div>

              <div className="relative">
                {/* imagen principal */}
                <div className="aspect-video w-full flex items-center justify-center bg-black">
                  <img
                    src={imgs[idx]}
                    alt={(title || "Foto") + " " + (idx + 1)}
                    className="max-h-[72vh] w-auto object-contain"
                  />
                </div>

                {/* flechas */}
                {imgs.length > 1 ? (
                  <>
                    <button
                      onClick={prev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/15 hover:bg-white/25 ring-1 ring-white/25 flex items-center justify-center"
                      aria-label="Anterior"
                    >‹</button>
                    <button
                      onClick={next}
                      className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/15 hover:bg-white/25 ring-1 ring-white/25 flex items-center justify-center"
                      aria-label="Siguiente"
                    >›</button>
                  </>
                ) : null}
              </div>

              {/* miniaturas */}
              {imgs.length > 1 ? (
                <div className="p-4 border-t border-white/10">
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {imgs.map((src, i) => (
                      <button
                        key={src + "_" + i}
                        className={"relative h-18 w-28 shrink-0 rounded-xl overflow-hidden ring-1 " + (i === idx ? "ring-fuchsia-400" : "ring-white/15")}
                        onClick={() => setIdx(i)}
                        aria-label={"Ir a foto " + (i + 1)}
                      >
                        <img src={src} alt={"Miniatura " + (i + 1)} className="h-full w-full object-cover" />
                        {i === idx ? <span className="absolute inset-0 ring-2 ring-fuchsia-400 rounded-xl pointer-events-none"></span> : null}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}