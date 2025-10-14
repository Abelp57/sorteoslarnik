export default function FAQ() {
  const items = [
    { q: "¿Cómo participo?", a: "Elige tu rifa, selecciona números y completa el pago." },
    { q: "¿Cómo se elige al ganador?", a: "Usamos sorteos verificables y publicamos el resultado." },
    { q: "¿Qué métodos de pago aceptan?", a: "Se muestran al confirmar tu compra." },
    { q: "¿Recibo comprobante?", a: "Sí, te enviamos confirmación con tus números." },
    { q: "¿Puedo pedir reembolso?", a: "Consulta las políticas de cada rifa." },
    { q: "¿Dónde veo mis tickets?", a: "En tu correo o en tu cuenta si iniciaste sesión." },
  ];
  return (
    <section id="faq" className="mx-auto w-full max-w-7xl px-4 py-14">
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">Preguntas frecuentes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((x, i) => (
          <details key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <summary className="cursor-pointer text-white font-medium">{x.q}</summary>
            <p className="mt-2 text-white/80 text-sm">{x.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}