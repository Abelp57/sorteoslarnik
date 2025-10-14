/* components/WinnersSection.tsx */
import { headers } from "next/headers";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Winner = {
  id: string;
  name?: string | null;
  phone?: string | null;
  photoUrl?: string | null;
  prize?: string | null;
  raffleId?: string | null;
  createdAt?: string | Date | null;
  raffle?: { title?: string | null; mainImage?: string | null } | null;
};

async function getWinners(): Promise<Winner[]> {
  try {
    const h = headers();
    const host = h.get("host");
    const proto = h.get("x-forwarded-proto") ?? "http";
    const base = `${proto}://${host}`;
    const res = await fetch(`${base}/api/admin/winners?take=12`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.winners) ? json.winners : [];
  } catch {
    return [];
  }
}

export default async function WinnersSection() {
  const winners = await getWinners();

  return (
    <section id="ganadores" className="py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Ganadores recientes</h2>

        {winners.length === 0 ? (
          <div className="text-sm opacity-75">Aún no hay ganadores publicados.</div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {winners.map((w) => {
              const img =
                w.photoUrl ||
                w?.raffle?.mainImage ||
                "/placeholder-avatar.svg";
              const prize =
                (typeof w.prize === "string" && w.prize.trim().length > 0)
                  ? w.prize.trim()
                  : (w?.raffle?.title ?? "Premio");

              return (
                <li key={w.id} className="rounded-2xl border border-white/10 bg-white/5 p-3 flex items-center gap-3">
                  <img
                    src={img}
                    alt={`Foto de ${w.name || "ganador"}`}
                    className="size-14 rounded-xl object-cover"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">
                      {w.name || "Ganador(a)"}
                    </div>
                    {w.phone ? (
                      <div className="text-xs opacity-80 truncate">
                        Tel: <a href={`tel:${w.phone}`} className="underline underline-offset-2">{w.phone}</a>
                      </div>
                    ) : null}
                    <div className="text-xs opacity-90">
                      Premio: {prize}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
