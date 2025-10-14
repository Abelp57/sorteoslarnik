export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-black/30 border-b border-white/10">
      <div className="container flex items-center gap-4 py-3">
        <a href="/" className="logo-pill flex items-center gap-2">
          <picture>
            <source media="(prefers-color-scheme: dark)" srcSet="/brand/logo-dark.png" />
            <img src="/brand/logo-light.png" alt="Sorteos Larnik" width={36} height={36} className="rounded-full" />
          </picture>
          {/* Título visible (antes estaba negro o sr-only) */}
          <span className="font-extrabold text-white text-base leading-none">
            Sorteos Larnik
          </span>
        </a>

        <nav className="ml-auto flex items-center gap-4">
          <a href="#rifas" className="nav-link">Rifas</a>
          <a href="#ganadores" className="nav-link">Ganadores</a>
          <a href="#faq" className="nav-link">Preguntas frecuentes</a>
          <a href="#contacto" className="nav-link">Contacto</a>
          <a href="/admin" className="nav-link">Admin</a>
        </nav>

        <a className="btn btn-ghost" href="#rifas">Comprar boletos</a>
      </div>
    </header>
  );
}



