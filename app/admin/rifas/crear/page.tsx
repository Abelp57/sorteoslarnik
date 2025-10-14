export const dynamic = "force-dynamic";

import RaffleForm from "@/components/RaffleForm";

export default function NewRafflePage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Crear rifa</h1>
      <p className="opacity-70 mb-6">Configura los datos iniciales.</p>
      <RaffleForm action="/api/raffles" />
    </div>
  );
}


