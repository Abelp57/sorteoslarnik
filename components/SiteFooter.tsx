import Link from "next/link"

function sanitizePhone(p?: string){ return (p||"").replace(/[^\d]/g,"") }

export default function SiteFooter(){
  const phone = sanitizePhone(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+528721074766")
  const waUrl = phone ? `https://wa.me/${phone}?text=${encodeURIComponent("Hola, quiero comprar boletos / resolver dudas.")}` : "#"

  return (
    <footer className="mt-12 border-t border-white/10 bg-gradient-to-b from-transparent to-black/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-lg font-semibold">Sorteos Larnik</div>
            <p className="mt-2 text-sm opacity-75">
              Operado por <strong>César Gómez</strong> y <strong>Eduardo Minik López</strong> en <strong>San Pedro, Coahuila</strong>.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-white/10 ring-1 ring-white/10">🔒 Pagos confiables</span>
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-white/10 ring-1 ring-white/10">🎥 Sorteos públicos</span>
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-white/10 ring-1 ring-white/10">🧾 Factura disponible</span>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold mb-2">Contacto</div>
            <div className="space-y-2">
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-black bg-green-400 hover:bg-green-300 transition">
                👋 WhatsApp: +52 872 107 4766
              </a>
              <div className="text-xs opacity-70">Atención por WhatsApp.</div>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold mb-2">Operado por</div>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.facebook.com/share/14HzCwUmwz5/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="hover:underline">🧑‍💼 César Gómez — Facebook</a></li>
              <li><a href="https://www.facebook.com/share/1CYjxLmQVb/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="hover:underline">🧑‍💼 Eduardo Minik López — Facebook</a></li>
            </ul>
            <div className="mt-3 text-xs opacity-60">Próximamente: Instagram, X/Twitter, YouTube.</div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4 justify-between border-t border-white/10 pt-4 text-xs opacity-70">
          <div>© {new Date().getFullYear()} Sorteos Larnik. Todos los derechos reservados.</div>
          <nav className="flex items-center gap-4">
            <Link href="/faq" className="hover:underline">Preguntas frecuentes</Link>
            <Link href="/terminos" className="hover:underline">Términos</Link>
            <Link href="/privacidad" className="hover:underline">Aviso de privacidad</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}