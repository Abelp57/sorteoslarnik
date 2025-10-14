/* app/components/RaffleSelect.tsx (patched) */
"use client";
import * as React from "react";

type RaffleLite = { id: string; title: string };

function normalize(data: any): RaffleLite[] {
  if (!data) return [];
  const pick = (arr: any[]) =>
    (arr || []).map((x: any) => ({
      id: String(x.id ?? x._id ?? x.slug ?? ""),
      title: String(x.title ?? x.name ?? x.titulo ?? x.label ?? "—"),
    })).filter(x => x.id && x.title);

  if (Array.isArray(data)) return pick(data);
  if (Array.isArray(data.items)) return pick(data.items);
  if (Array.isArray(data.rafas)) return pick(data.rafas);
  if (Array.isArray(data.raffles)) return pick(data.raffles);
  if (Array.isArray(data.rifas)) return pick(data.rifas);
  if (Array.isArray(data.data)) return pick(data.data);
  if (Array.isArray(data.results)) return pick(data.results);
  // Algunos endpoints devuelven {ok:true, raffles:[...]}
  const keys = Object.keys(data).filter(k => Array.isArray(data[k]));
  for (const k of keys) {
    const arr = data[k];
    const sample = (arr && arr[0]) || {};
    if ("id" in sample && ("title" in sample || "name" in sample || "titulo" in sample)) {
      return pick(arr);
    }
  }
  return [];
}

async function tryFetch(url: string): Promise<RaffleLite[]> {
  const u = url.includes("?") ? url + "&take=1000" : url + "?take=1000";
  const res = await fetch(u, { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json().catch(() => null);
  return normalize(json);
}

async function fetchRaffles(): Promise<RaffleLite[]> {
  const candidates = [
    "/api/admin/raffles",
    "/api/admin/rifas",
    "/api/raffles",
    "/api/rifas",
    "/api/admin/raffles-lite", // nuestro fallback
  ];
  for (const c of candidates) {
    try {
      const list = await tryFetch(c);
      if (list.length) return list;
    } catch (_) {}
  }
  return [];
}

export default function RaffleSelect({
  value, onChange, onTitlePicked, placeholder = "Buscar rifa por título..."
}: {
  value?: string | null;
  onChange: (raffleId: string | null) => void;
  onTitlePicked?: (title: string) => void;
  placeholder?: string;
}) {
  const [all, setAll] = React.useState<RaffleLite[]>([]);
  const [q, setQ] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const list = await fetchRaffles();
        if (!alive) return;
        setAll(list);
        if (!list.length) setErr("No se encontraron rifas desde los endpoints conocidos.");
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message || "Error al cargar rifas.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const filtered = React.useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return all.slice(0, 20);
    return all.filter(r => r.title.toLowerCase().includes(term)).slice(0, 30);
  }, [q, all]);

  return (
    <div className="space-y-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 ring-primary/40"
      />
      <div className="max-h-56 overflow-auto rounded-xl border">
        {loading ? (
          <div className="p-3 text-sm text-foreground/60">Cargando rifas…</div>
        ) : filtered.length === 0 ? (
          <div className="p-3 text-sm text-foreground/60">
            No hay resultados.
            {err ? <div className="mt-1 text-[11px] text-foreground/50">{err}</div> : null}
            <button
              type="button"
              onClick={() => {
                // refresco manual
                (async () => {
                  setLoading(true);
                  const list = await fetchRaffles();
                  setAll(list);
                  setLoading(false);
                })();
              }}
              className="mt-2 rounded-lg border px-2 py-1 text-xs"
            >
              Reintentar carga
            </button>
          </div>
        ) : (
          filtered.map((r) => (
            <button
              type="button"
              key={r.id}
              onClick={() => { onChange(r.id); onTitlePicked?.(r.title); }}
              className={`block w-full text-left px-3 py-2 hover:bg-primary/5 ${r.id === value ? "bg-primary/10" : ""}`}
            >
              <div className="text-sm font-medium">{r.title}</div>
              <div className="text-[11px] text-foreground/60">{r.id}</div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
