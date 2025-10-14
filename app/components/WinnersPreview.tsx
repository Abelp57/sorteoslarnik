export default function WinnersPreview() {
  const winners = [
    { name: "Próximo ganador", prize: "Por anunciar", ticket: "###" },
    { name: "Próximo ganador", prize: "Por anunciar", ticket: "###" },
    { name: "Próximo ganador", prize: "Por anunciar", ticket: "###" },
  ];
  return (
    <section id="ganadores" className="mx-auto w-full max-w-7xl px-4 py-14">
      <div className="flex items-end justify-between">
        <h2 className="text-2xl md:text-3xl font-semibold text-white">Ganadores</h2>
        <a href="/ganadores" className="text-sm text-white/80 hover:text-white underline">Ver todos</a>
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {winners.map((w, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="h-28 rounded-xl bg-white/10 mb-4 flex items-center justify-center text-white/60 text-sm">
              Foto/Comprobante
            </div>
            <p className="text-white font-semibold">{w.name}</p>
            <p className="text-white/80 text-sm">Premio: {w.prize}</p>
            <p className="text-white/60 text-xs">Ticket: {w.ticket}</p>
          </div>
        ))}
      </div>
    </section>
  );
}