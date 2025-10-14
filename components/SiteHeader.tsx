"use client"

import Link from "next/link"
import React from "react"

function sanitizePhone(p?: string){ return (p||"").replace(/[^\d]/g,"") }

export default function SiteHeader(){
  const [open, setOpen] = React.useState(false)
  const phone = sanitizePhone(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+528721074766")
  const waUrl = phone ? `https://wa.me/${phone}?text=${encodeURIComponent("Hola, quiero información para participar en las rifas.")}` : "#"

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Sorteos Larnik" className="h-8 w-auto" />
          <span className="sr-only">Sorteos Larnik</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="opacity-90 hover:opacity-100">Inicio</Link>
          <Link href="/#rifas" className="opacity-90 hover:opacity-100">Rifas</Link>
          <Link href="/#ganadores" className="opacity-90 hover:opacity-100">Ganadores</Link>
          <Link href="/#faq" className="opacity-90 hover:opacity-100">FAQ</Link>
          <a href={waUrl} target="_blank" rel="noopener noreferrer"
             className="ml-2 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-black bg-green-400 hover:bg-green-300 transition">
            💬 WhatsApp
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 hover:bg-white/10"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Abrir menú"
        >
          ☰
        </button>
      </div>

      {/* Mobile */}
      {open ? (
        <div id="mobile-nav" className="md:hidden border-t border-white/10 bg-black/80 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-2 text-sm">
            <Link href="/" onClick={()=>setOpen(false)} className="opacity-90 hover:opacity-100">Inicio</Link>
            <Link href="/#rifas" onClick={()=>setOpen(false)} className="opacity-90 hover:opacity-100">Rifas</Link>
            <Link href="/#ganadores" onClick={()=>setOpen(false)} className="opacity-90 hover:opacity-100">Ganadores</Link>
            <Link href="/#faq" onClick={()=>setOpen(false)} className="opacity-90 hover:opacity-100">FAQ</Link>
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
               className="mt-2 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-black bg-green-400 hover:bg-green-300 transition"
               onClick={()=>setOpen(false)}>
              💬 WhatsApp
            </a>
          </div>
        </div>
      ) : null}
    </header>
  )
}