"use client";

import { useMemo, useState } from "react";
import FancyModal from "@/app/components/FancyModal";

type T = { number: number; status: string };

export default function PublicTicketGrid({
  tickets,
  raffleTitle,
  raffleId,
  digits,
}: {
  tickets: T[];
  raffleTitle: string;
  raffleId: string;
  digits: number;
}) {
  const [all, setAll] = useState<T[]>(tickets);
  const [sel, setSel] = useState<number[]>([]);
  const [mode, setMode] = useState<"COMPRAR" | "COMPRAR" | null>(null);
  const [agree, setAgree] = useState(false);
  const [open, setOpen] = useState(false);

  const byStatus = useMemo(() => {
    const acc: Record<string, number> = {};
    all.forEach(t => (acc[t.status] = (acc[t.status] ?? 0) + 1));
    return acc;
  }, [all]);

  function pad(n: number) {
    return n.toString().padStart(digits, "0");
  }

  function toggle(n: number, s: string) {
    if (s !== "AVAILABLE") return;
    setSel(prev => (prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n]));
  }

  function clearSel() {
    setSel([]);
  }

  function openModal(m: "COMPRAR" | "COMPRAR") {
    if (!sel.length) return;
    setMode(m);
    setAgree(false);
    setOpen(true);
  }

  async function confirmAction() {
    if (!mode || !sel.length || !agree) return;

    const res = await fetch("/api/tickets/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ raffleId, numbers: sel, mode }),
    }).then(r => r.json());

    if (!res?.ok) {
      alert("No se pudo reservar. IntÃ¯¿Â½ntalo de nuevo.");
      return;
    }

    const reservedSet = new Set<number>(res.reserved ?? []);
    setAll(prev => prev.map(t => (reservedSet.has(t.number) ? { ...t, status: "RESERVED" } : t)));

    const ordered = [...sel].sort((a, b) => a - b);
    const numbersTxt = ordered.map(pad).join(", ");
    const untilTxt = res.reservedUntil ? new Date(res.reservedUntil).toLocaleString() : "30 min";
    const kind = mode === "COMPRAR" ? "RESERVA/APARTADO" : "COMPRA";

    const lines = [
      `Ã¯¿Â½Hola! Me interesan boletos en *${raffleTitle}*.`,
      `${kind}: ${numbersTxt}`,
      `Quedaron reservados por 30 min (hasta ${untilTxt}). Ã¯¿Â½Me ayudas a finalizar?`,
    ];
    const text = lines.join("\n");

    const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    const base = num ? `https://wa.me/${num}` : `https://wa.me/`;
    const link = `${base}?text=${encodeURIComponent(text)}`;

    setOpen(false);
    clearSel();
    window.open(link, "_blank");
  }

  const pill = (s: string) =>
    s === "AVAILABLE" ? "border-emerald-500 text-emerald-400" :
    s === "RESERVED"  ? "border-amber-500 text-amber-400"   :
    s === "SOLD"      ? "border-rose-500 text-rose-400"     :
                        "border-zinc-500 text-zinc-400";

  const bg = (s: string, active: boolean) =>
    s !== "AVAILABLE" ? "bg-black/20 cursor-not-allowed" :
    active ? "bg-emerald-600/20 ring-2 ring-emerald-500" : "hover:bg-emerald-600/10";

  const actionBtn = (label: string, color: string, m: "COMPRAR" | "COMPRAR") => (
    <button
      type="button"
      onClick={() => openModal(m)}
      disabled={!sel.length}
      className={`px-4 py-2 rounded-xl ${sel.length ? color : "bg-zinc-700 text-zinc-300 cursor-not-allowed"}`}
    >
      {label}
    </button>
  );

  const niceList = (
    <ul className="text-sm space-y-1 lx-specs2">
      <li>? <b>Sin presiÃ¯¿Â½n:</b> primero aseguras tus boletos.</li>
      <li>?? <b>Reserva por 30 min</b> mientras te atiende un asesor.</li>
      <li>?? <b>Pago seguro:</b> los boletos se marcan como vendidos al confirmar tu pago.</li>
      <li>?? <b>AcompaÃ¯¿Â½amiento 1 a 1</b> por WhatsApp.</li>
    </ul>
  );

  return (
    <div className="space-y-4 lx-specs2" id="tickets">
      <div className="flex flex-wrap gap-3 text-xs lx-specs2">
        <span className={`px-2 py-1 rounded-full border ${pill("AVAILABLE")}`}>Disponibles: {byStatus.AVAILABLE ?? 0}</span>
        <span className={`px-2 py-1 rounded-full border ${pill("RESERVED")}`}>Reservados: {byStatus.RESERVED ?? 0}</span>
        <span className={`px-2 py-1 rounded-full border ${pill("SOLD")}`}>Vendidos: {byStatus.SOLD ?? 0}</span>
        <span className={`px-2 py-1 rounded-full border ${pill("BLOCKED")}`}>Bloqueados: {byStatus.BLOCKED ?? 0}</span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 lx-specs2">
        {all.map(t => {
          const active = sel.includes(t.number);
          return (
            <button
              key={t.number}
              type="button"
              onClick={() => toggle(t.number, t.status)}
              className={`text-sm rounded-lg border px-2 py-2 text-center ${pill(t.status)} ${bg(t.status, active)}`}
              aria-pressed={active}
              title={t.status !== "AVAILABLE" ? "No disponible" : "Seleccionar"}
            >
              {pad(t.number)}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 lx-specs2">
        <div data-lx="summary" className="text-s<div data-lx="bar" className="flex items-center justify-between gap-3 lx-specs2">pecs2">
          Seleccionados: <b>{sel.length}</b>{" "}
          {sel.length ? `(${[...sel].sort((a,b)=>a-b).map(pad).join(", ")})` : ""}
        </div>
        <div className="flex items-center gap-2 lx-specs2">
          <button type="button" onClick={clearSel} className="px-3 py-2 rounded-xl border lx-btn lx-btn-ghost lx-specs2 lx-spec-pill2">Limpiar</button>
          {actionBtn("Reservar/COMPRAR", "bg-amber-600 text-white", "COMPRAR")}
          {actionBtn("Comprar ahora", "bg-emerald-600 text-white", "COMPRAR")}
        </div>
      </div>

      <FancyModal
        open={open}
        onClose={() => setOpen(false)}
        title={mode === "COMPRAR" ? "Ã¯¿Â½Reservemos tus boletos!" : "Ã¯¿Â½Listo para comprar!"}
        footer={
          <>
            <button onClick={() => setOpen(false)} className="px-4 py-2 rounded-xl border lx-specs2 lx-spec-pill2">Volver</button>
            <button
              onClick={confirmAction}
              disabled={!agree}
              className={`px-4 py-2 rounded-xl ${agree ? "bg-emerald-600 text-white" : "bg-zinc-700 text-zinc-300 cursor-not-allowed"}`}
            >
              Contactar por WhatsApp
            </button>
          </>
        }
      >
        <div className="space-y-4 lx-specs2">
          {/* NUEVO: muestra la rifa */}
          <div data-lx="pill" className="rounded-xl border border-white/10 p-3 bg-black/30 lx-specs2 lx-spec-pill2">
            <div className="text-xs uppercase opacity-60 lx-specs2">Rifa</div>
            <div className="text-sm font-medium lx-specs2">{raffleTitle}</div>
          </div>

          <div data-lx="pill" className="rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-4 border border-white/10 lx-specs2 lx-spec-pill2">
            <p className="text-sm lx-specs2">
              Ã¯¿Â½Gracias por elegirnos! EstÃ¯¿Â½s por {mode === "COMPRAR" ? <b>reservar/COMPRAR</b> : <b>comprar</b>} los boletos:{" "}
              <b>{[...sel].sort((a,b)=>a-b).map(p => pad(p)).join(", ")}</b>.
            </p>
            <p className="text-sm opacity-80 mt-1 lx-specs2">
              Un asesor te atenderÃ¯¿Â½ al instante para confirmar tus datos y finalizar el proceso.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 lx-specs2">
            <div data-lx="pill" className="rounded-xl border border-white/10 p-3 bg-black/30 lx-specs2 lx-spec-pill2">{niceList}</div>
            <div data-lx="pill" className="rounded-xl border border-white/10 p-3 bg-black/30 text-sm space-y-2 lx-specs2 lx-spec-pill2">
              <p className="font-medium lx-specs2">Detalles rÃ¯¿Â½pidos</p>
              <p>Ã¯¿Â½ La reserva dura <b>30 minutos</b>. Si algo se complica, puedes repetir sin problema.</p>
              <p>Ã¯¿Â½ Si ya hiciste el pago, nuestro equipo lo valida y marca tus boletos como <b>VENDIDOS</b>.</p>
            </div>
          </div>

          <label className="flex items-start gap-2 text-sm lx-specs2">
            <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="mt-0.5 lx-specs2" />
            <span>Estoy de acuerdo y deseo continuar por WhatsApp con un asesor de ventas.</span>
          </label>
        </div>
      </FancyModal>
    </div>
  );
}






