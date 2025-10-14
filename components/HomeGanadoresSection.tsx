import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
type Winner = {
  id: string;
  name?: string | null;
  number?: number | null;
  phone?: string | null;
  prize?: string | null;
  photoUrl?: string | null;
  date?: string | Date | null;
};

function formatDate(d: any) {
  try {
    const date = new Date(d);
    return date.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch {
    return "";
  }
}

async function fetchAdminWinners(): Promise<Winner[]> {
  try {
    const h = headers();
    const host = h.get("host");
    const proto = h.get("x-forwarded-proto") ?? "http";
    const base = `${proto}://${host}`;
    const res = await fetch(`${base}/api/admin/winners?take=6`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json?.winners) ? json.winners : [];
  } catch {
    return [];
  }
}

async function fetchPrismaFallback(): Promise<Winner[]> {
  // usa 'any' para tolerar esquemas sin algunos campos
  const rows = (await prisma.winner.findMany({
    orderBy: [{ date: "desc" }, { id: "desc" }],
    take: 6,
    include: { raffle: { select: { title: true, mainImage: true } } },
  })) as any[];

  return rows.map((w: any) => ({
    id: w.id,
    name: w.name ?? null,
    number: typeof w.number === "number" ? w.number : (typeof w.number === "string" ? parseInt(w.number, 10) || null : null),
    phone: w.phone ?? null,
    prize: (typeof w.prize === "string" && w.prize.trim().length > 0) ? w.prize.trim() : (w?.raffle?.title ?? null),
    photoUrl: w.photoUrl ?? w.imageUrl ?? w.proofImage ?? w?.raffle?.mainImage ?? null,
    date: w.date ?? w.createdAt ?? w.updatedAt ?? null,
  }));
}

export default async function HomeGanadoresSection() {
  let winners = await fetchAdminWinners();
  if (!winners || winners.length === 0) {
    winners = await fetchPrismaFallback();
  }

  return (
    <section id="ganadores" className="max-w-6xl mx-auto px-4 py-10 md:py-14">
      <div className="flex items-end justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold">Ganadores</h2>
      </div>

      {(!winners || winners.length === 0) ? (
        <p className="opacity-80">Aún no hay ganadores registrados.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {winners.map((g) => {
            const img = g.photoUrl || "/placeholder-avatar.svg";
            const niceDate = formatDate(g.date);

            return (
              <article
                key={g.id}
                className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-sm"
              >
                {/* Imagen grande con overlay */}
                <div className="relative aspect-[16/10]">
                  <img
                    src={img}
                    alt={g.name || "Ganador"}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-white font-semibold text-base md:text-lg leading-tight">
                        <span className="whitespace-normal break-words">{g.name || "Ganador(a)"}</span>
                      </h3>
                      {typeof g.number === "number" ? (
                        <span className="inline-flex items-center rounded-full border border-white/30 bg-black/40 px-2 py-0.5 text-xs text-white">
                          Boleto {g.number}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  {g.phone ? (
                    <div className="text-sm opacity-90">
                      Teléfono: <a href={`tel:${g.phone}`} className="underline underline-offset-2">{g.phone}</a>
                    </div>
                  ) : null}

                  {g.prize ? (
                    <div className="text-sm">
                      Premio: <span className="font-medium">{g.prize}</span>
                    </div>
                  ) : null}

                  {niceDate ? (
                    <div className="text-xs opacity-70">Fecha: {niceDate}</div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
