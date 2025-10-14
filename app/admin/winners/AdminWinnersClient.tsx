/* app/admin/winners/AdminWinnersClient.tsx */
"use client";
import * as React from "react";
import RaffleSelect from "@/app/components/RaffleSelect";
import { Field } from "@/app/components/Field";
import UploadImageField from "@/app/components/UploadImageField";

type Winner = {
  id: string;
  name: string;
  phone?: string | null;
  prize: string;
  ticketNumber?: number | null;
  proofImage?: string | null;
  published: boolean;
  raffleId?: string | null;
  occurredAt?: string | null;
};

type ApiList<T> = { items?: T[] } | T[];

async function fetchJSON(url: string, init?: RequestInit) {
  const r = await fetch(url, { cache: "no-store", ...init });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

async function listWinners(): Promise<Winner[]> {
  const data: ApiList<Winner> = await fetchJSON("/api/admin/winners");
  if (Array.isArray(data)) return data as Winner[];
  return (data.items || []) as Winner[];
}

async function saveWinner(body: Partial<Winner> & { id?: string }) {
  const method = body.id ? "PUT" : "POST";
  const url = body.id ? `/api/admin/winners/${body.id}` : "/api/admin/winners";
  return fetchJSON(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function removeWinner(id: string) {
  await fetchJSON(`/api/admin/winners/${id}`, { method: "DELETE" });
}

function useWinners() {
  const [items, setItems] = React.useState<Winner[]>([]);
  const [loading, setLoading] = React.useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const rows = await listWinners();
      setItems(rows);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => { refresh(); }, []);
  return { items, loading, refresh, setItems };
}

export default function AdminWinnersClient() {
  const { items, loading, refresh } = useWinners();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Partial<Winner> | null>(null);
  const [saving, setSaving] = React.useState(false);

  function newWinner() {
    setEditing({
      name: "",
      phone: "",
      prize: "",
      ticketNumber: null,
      proofImage: "",
      published: true,
      raffleId: null,
      occurredAt: "",
    });
    setOpen(true);
  }

  function editWinner(w: Winner) {
    setEditing({ ...w, occurredAt: (w.occurredAt || "").slice(0, 16) });
    setOpen(true);
  }

  async function submit() {
    if (!editing) return;
    setSaving(true);
    try {
      const payload = { ...editing };
      // Normaliza occurredAt: <input type="datetime-local"> da "YYYY-MM-DDTHH:mm"
      if (payload.occurredAt && payload.occurredAt.length === 16) {
        payload.occurredAt = payload.occurredAt + ":00";
      }
      await saveWinner(payload);
      setOpen(false);
      setEditing(null);
      await refresh();
    } catch (e) {
      console.error(e);
      alert("No se pudo guardar el ganador.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Ganadores</h1>
        <button
          onClick={newWinner}
          className="rounded-xl bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
        >
          Nuevo ganador
        </button>
      </div>

      <div className="rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-foreground/[0.03]">
            <tr>
              <th className="px-3 py-2 text-left">Nombre</th>
              <th className="px-3 py-2 text-left">Premio</th>
              <th className="px-3 py-2 text-left"># Boleto</th>
              <th className="px-3 py-2 text-left">Publicado</th>
              <th className="px-3 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-3 py-6" colSpan={5}>Cargando…</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="px-3 py-6" colSpan={5}>Sin registros.</td></tr>
            ) : items.map(w => (
              <tr key={w.id} className="border-t">
                <td className="px-3 py-2">{w.name}</td>
                <td className="px-3 py-2">{w.prize}</td>
                <td className="px-3 py-2">{w.ticketNumber ?? "—"}</td>
                <td className="px-3 py-2">{w.published ? "Sí" : "No"}</td>
                <td className="px-3 py-2 space-x-2">
                  <button onClick={()=>editWinner(w)} className="rounded-lg border px-3 py-1">Editar</button>
                  <button
                    onClick={async()=>{
                      if (confirm("¿Eliminar ganador?")) {
                        await removeWinner(w.id);
                        await refresh();
                      }
                    }}
                    className="rounded-lg border px-3 py-1 text-red-600 border-red-600/40"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && editing ? (
        <div className="fixed inset-0 z-50 grid place-items-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={()=>setOpen(false)} />
          <div className="relative w-full max-w-3xl rounded-2xl border bg-background p-4 sm:p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editing.id ? "Editar ganador" : "Nuevo ganador"}</h2>
              <button onClick={()=>setOpen(false)} className="rounded-lg border px-3 py-1">Cerrar</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nombre" required>
                <input
                  value={editing.name || ""}
                  onChange={e=>setEditing(s=>({ ...s!, name: e.target.value }))}
                  className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 ring-primary/40"
                />
              </Field>

              <Field label="Teléfono">
                <input
                  value={editing.phone || ""}
                  onChange={e=>setEditing(s=>({ ...s!, phone: e.target.value }))}
                  className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 ring-primary/40"
                />
              </Field>

              <Field label="Rifa (selección con búsqueda)" hint="Al elegir una rifa se autocompleta el campo Premio y se fija el ID de rifa.">
                <RaffleSelect
                  value={editing.raffleId ?? null}
                  onChange={(raffleId)=>setEditing(s=>({ ...s!, raffleId }))}
                  onTitlePicked={(title)=>setEditing(s=>({ ...s!, prize: s?.prize?.trim() ? s!.prize! : title }))}
                />
              </Field>

              <Field label="Premio" hint="Se rellena con el título de la rifa seleccionada; puedes personalizarlo.">
                <input
                  value={editing.prize || ""}
                  onChange={e=>setEditing(s=>({ ...s!, prize: e.target.value }))}
                  className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 ring-primary/40"
                />
              </Field>

              <Field label="# de boleto">
                <input
                  type="number"
                  value={editing.ticketNumber ?? ""}
                  onChange={e=>setEditing(s=>({ ...s!, ticketNumber: e.target.value ? Number(e.target.value) : null }))}
                  className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 ring-primary/40"
                />
              </Field>

              <Field label="Fecha y hora">
                <input
                  type="datetime-local"
                  value={editing.occurredAt || ""}
                  onChange={e=>setEditing(s=>({ ...s!, occurredAt: e.target.value }))}
                  className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 ring-primary/40"
                />
              </Field>

              
      <Field label="Evidencia (subir imagen o URL)">
        <UploadImageField
          value={editing.proofImage || ""}
          onChange={(url)=>setEditing(s=>({ ...s!, proofImage: url }))}
        />
      </Field>
    

              <Field label="Publicado">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!editing.published}
                    onChange={e=>setEditing(s=>({ ...s!, published: e.target.checked }))}
                  />
                  <span className="text-sm">Mostrar públicamente</span>
                </label>
              </Field>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={()=>setOpen(false)}
                className="rounded-xl border px-4 py-2"
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                onClick={submit}
                className="rounded-xl bg-primary px-5 py-2 text-primary-foreground hover:opacity-90 disabled:opacity-60"
                disabled={saving}
              >
                {saving ? "Guardando…" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
