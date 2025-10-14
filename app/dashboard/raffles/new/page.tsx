export const dynamic = "force-dynamic";

import RaffleForm from "@/components/RaffleForm";

export default function NewRafflePage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Crear nueva rifa</h1>
      <RaffleForm action="/api/raffles" />
    </div>
  );
}


