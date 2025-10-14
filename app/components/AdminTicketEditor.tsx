// app/components/AdminTicketEditor.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type Ticket = {
  number: number;
  status: "AVAILABLE" | "RESERVED" | "SOLD";
};

type Props = {
  raffleId: string;
  title: string;
  total: number;
  digits: number;
  startNumber: number;
};

export default function AdminTicketEditor({ raffleId, title, total, digits, startNumber }: Props) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<"ALL" | "AVAILABLE" | "RESERVED" | "SOLD">("ALL");
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const endNumber = startNumber + total - 1;

  const pad = (n: number) => String(n).padStart(digits, "0");

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/raffles/${raffleId}/tickets`);
      const json = await res.json();
      setTickets(json.tickets ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raffleId]);

  const filtered = useMemo(() => {
    const base =
      filter === "ALL" ? tickets : tickets.filter((t) => t.status === filter);
    if (!query.trim()) return base;
    const qn = Number(query);
    if (Number.isFinite(qn)) return base.filter((t) => t.number === qn);
    return base;
  }, [tickets, filter, query]);

  const counters = useMemo(() => {
    const sel = new Set(selected);
    const all = tickets.length;
    const available = tickets.filter((t) => t.status === "AVAILABLE").length;
    const reserved = tickets.filter((t) => t.status === "RESERVED").length;
    const sold = tickets.filter((t) => t.status === "SOLD").length;
    return { all, available, reserved, sold, sel: sel.size };
  }, [tickets, selected]);

  const toggle = (n: number) => {
    setSelected((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]
    );
  };

  const selectNone = () => setSelected([]);
  const selectByFilter = (kind: "ALL" | "AVAILABLE" | "RESERVED" | "SOLD") => {
    const list =
      kind === "ALL"
        ? tickets.map((t) => t.number)
        : tickets.filter((t) => t.status === kind).map((t) => t.number);
    setSelected(list);
  };

  const bulk = async (status: "AVAILABLE" | "RESERVED" | "SOLD") => {
    if (!selected.length) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tickets", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "updateStatus",
          raffleId,
          numbers: selected,
          status,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        await fetchTickets();
        setSelected([]);
      } else {
        alert(json.error ?? "Error");
      }
    } finally {
      setLoading(false);
    }
  };

  const generateMissing = async () => {
    if (!confirm(`Generar boletos faltantes ${startNumber}–${endNumber}?`)) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tickets", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "generateMissing",
          raffleId,
          start: startNumber,
          end: endNumber,
        }),
      });
      const json = await res.json();
      if (json.ok) {
        await fetchTickets();
        setSelected([]);
      } else {
        alert(json.error ?? "Error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Boletos · {title}</h1>
      <div className="text-sm opacity-70">
        Rifa: {title} — Total: {total} · Dígitos: {digits} · Inicio: {startNumber}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={fetchTickets} className="rounded-lg border px-3 py-1.5">Refrescar</button>
        <button onClick={generateMissing} className="rounded-lg border px-3 py-1.5">
          Generar faltantes
        </button>
        <input
          className="ml-auto rounded-lg border px-3 py-1.5"
          placeholder="Buscar # boleto…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          inputMode="numeric"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button onClick={() => setFilter("ALL")} className={`rounded-lg border px-3 py-1.5 ${filter==="ALL"?"bg-white/10":""}`}>Todos</button>
        <button onClick={() => setFilter("AVAILABLE")} className={`rounded-lg border px-3 py-1.5 ${filter==="AVAILABLE"?"bg-white/10":""}`}>Disponibles</button>
        <button onClick={() => setFilter("RESERVED")} className={`rounded-lg border px-3 py-1.5 ${filter==="RESERVED"?"bg-white/10":""}`}>Reservados</button>
        <button onClick={() => setFilter("SOLD")} className={`rounded-lg border px-3 py-1.5 ${filter==="SOLD"?"bg-white/10":""}`}>Vendidos</button>

        <div className="ml-auto">Sel: {counters.sel} · DISP {counters.available} · RES {counters.reserved} · VEND {counters.sold}</div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => selectByFilter("ALL")} className="rounded-lg border px-3 py-1.5">Seleccionar todos</button>
        <button onClick={selectNone} className="rounded-lg border px-3 py-1.5">Deseleccionar todos</button>

        <div className="ml-auto flex gap-2">
          <button onClick={() => bulk("RESERVED")} disabled={!selected.length} className="rounded-lg border px-3 py-1.5">Marcar reservado</button>
          <button onClick={() => bulk("SOLD")} disabled={!selected.length} className="rounded-lg border px-3 py-1.5">Marcar vendido</button>
          <button onClick={() => bulk("AVAILABLE")} disabled={!selected.length} className="rounded-lg border px-3 py-1.5">Liberar</button>
        </div>
      </div>

      {/* Grid de boletos */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
        {filtered.map((t) => {
          const isSel = selected.includes(t.number);
          return (
            <button
              key={t.number}
              onClick={() => toggle(t.number)}
              className={[
                "rounded-lg border px-2 py-2 text-sm",
                isSel ? "ring-2 ring-blue-500" : "",
                t.status === "AVAILABLE" ? "bg-emerald-900/20 border-emerald-700" :
                t.status === "RESERVED"  ? "bg-amber-900/20 border-amber-700" :
                                           "bg-rose-900/20 border-rose-700"
              ].join(" ")}
              title={t.status}
            >
              {pad(t.number)}
            </button>
          );
        })}
      </div>

      {loading && <div className="text-sm opacity-70">Procesando…</div>}
    </div>
  );
}
