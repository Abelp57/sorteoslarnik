export default function Footer() {
  return (
    <footer id="contacto" className="footer">
      <div className="footer-top">
        <div className="container footer-cta">
          <div>
            <h3 className="text-xl font-extrabold">¿Listo para ganar?</h3>
            <p className="text-white/70">
              Únete a miles de jugadores. Transparencia total y premios de lujo.
            </p>
          </div>
          <a href="#rifas" className="btn btn-primary">Comprar boletos</a>
        </div>
      </div>

      <div className="container footer-grid">
        <div>
          <div className="logo-pill mb-2">
            <img src="/brand/logo.png" alt="Logo de Sorteos Larnik" />
            <span className="text-black">Sorteos Larnik</span>
          </div>
          <p className="text-white/70">
            Rifas transparentes y seguras. Resultados públicos y atención real por WhatsApp.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="text-xs px-2 py-1 rounded-full border border-white/20 bg-white/10">
              Garantía de reembolso
            </span>
            <span className="text-xs px-2 py-1 rounded-full border border-white/20 bg-white/10">
              Pagos protegidos
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-extrabold mb-2">Contacto</h3>
          <ul className="text-sm space-y-1 text-white/80">
            <li>Tel: <a href="tel:+525512345678" className="footer-link">+52 55 1234 5678</a></li>
            <li>
              WhatsApp:{" "}
              <a
                href="https://wa.me/525512345678"
                className="footer-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                +52 55 1234 5678
              </a>
            </li>
            <li>Correo: <a href="mailto:hola@larnik.mx" className="footer-link">hola@larnik.mx</a></li>
            <li>Dirección: Av. Siempre Viva 123, Centro, CDMX</li>
            <li>Horario: Lun–Sáb 10:00–20:00 · Dom 11:00–17:00</li>
          </ul>
        </div>

        <div>
          <h3 className="font-extrabold mb-2">Métodos de pago</h3>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <span className="border border-white/20 rounded px-2 py-1 text-center">VISA</span>
            <span className="border border-white/20 rounded px-2 py-1 text-center">MASTERCARD</span>
            <span className="border border-white/20 rounded px-2 py-1 text-center">AMEX</span>
            <span className="border border-white/20 rounded px-2 py-1 text-center">OXXO</span>
            <span className="border border-white/20 rounded px-2 py-1 text-center">SPEI</span>
            <span className="border border-white/20 rounded px-2 py-1 text-center">PayPal</span>
          </div>
          <p className="text-white/60 text-xs mt-2">
            Pagos procesados por proveedor certificado PCI DSS.
          </p>
        </div>

        <div>
          <h3 className="font-extrabold mb-2">Boletín</h3>
          <form className="flex gap-2">
            <input
              className="flex-1 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm"
              placeholder="tucorreo@ejemplo.com"
              aria-label="Correo electrónico"
            />
            <button className="btn btn-dark" type="button">Suscribirme</button>
          </form>
          <div className="flex gap-2 mt-3 flex-wrap">
            <a href="#" className="footer-link">Términos</a>
            <a href="#" className="footer-link">Privacidad</a>
            <a href="#" className="footer-link">Reglas del sorteo</a>
          </div>
        </div>
      </div>

      <div className="container flex items-center justify-between py-4 border-t border-white/10 text-sm text-white/70">
        <span>Este sitio es un demo de diseño. Datos de ejemplo.</span>
        <span>© 2025 Larnik MX · Hecho con ❤ en México</span>
      </div>
    </footer>
  )
}