export const metadata = { title: "FAQ" };

export default function FAQPage() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Preguntas frecuentes</h1>
      <ul className="list-disc pl-6 space-y-2">
        <li>¿Cómo aparto un boleto?</li>
        <li>¿Cómo se realiza el sorteo?</li>
        <li>¿Cómo me contactan si gano?</li>
      </ul>
    </main>
  );
}
