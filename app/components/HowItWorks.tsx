export default function HowItWorks() {
  const steps = [
    {
      title: "Elige tus números",
      desc: "Explora la rifa y selecciona tus números favoritos.",
      icon: "🔢",
    },
    {
      title: "Paga seguro",
      desc: "Confirma tu compra con métodos de pago confiables.",
      icon: "💳",
    },
    {
      title: "Participa y gana",
      desc: "Publicamos al ganador y te contactamos.",
      icon: "🏆",
    },
  ];

  return (
    <section aria-labelledby="como-funciona" className="mx-auto max-w-6xl px-4">
      <h2 id="como-funciona" className="mb-6 text-2xl font-semibold">
        ¿Cómo funciona?
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <div className="text-2xl" aria-hidden="true">{s.icon}</div>
            <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
            <p className="text-white/80">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}