export default function AppHeader() {
  return (
    <header className="w-full border-b border-white/10 bg-black/20 backdrop-blur supports-[backdrop-filter]:bg-black/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <a href="/" className="font-semibold tracking-tight">Sorteos Larnik</a>
        <nav className="text-sm opacity-90 space-x-4 hidden sm:block">
          <a href="/rifas" className="hover:opacity-100">Rifas</a>
          <a href="/ganadores" className="hover:opacity-100">Ganadores</a>
          <a href="/faq" className="hover:opacity-100">FAQ</a>
          <a href="/contacto" className="hover:opacity-100">Contacto</a>
        </nav>
      </div>
    </header>
  );
}