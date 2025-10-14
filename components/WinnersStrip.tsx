'use client';

type Winner = { id: string; name: string; prize: string; photoUrl?: string };

export default function WinnersStrip({ winners = [] as Winner[] }) {
  if (!winners.length) {
    return null;
  }
  return (
    <div className="w-full overflow-x-auto py-2">
      <div className="flex gap-4 min-w-max">
        {winners.map((w) => (
          <div key={w.id} className="flex items-center gap-3 rounded-xl border px-3 py-2 bg-white/70 shadow-sm">
            {w.photoUrl ? (
              // puedes migrar a next/image cuando quieras
              <img src={w.photoUrl} alt={w.name} className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200" />
            )}
            <div className="text-sm">
              <div className="font-semibold">{w.name}</div>
              <div className="text-gray-600">Ganó: {w.prize}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
