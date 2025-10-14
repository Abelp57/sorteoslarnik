"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

type Sponsor = {
  id: string;
  name: string;
  logoUrl: string;
  website: string | null;
  sortOrder: number;
};

export default function EditForm({ row }: { row: Sponsor }) {
  const router = useRouter();

  const [name, setName] = useState(row.name ?? "");
  const [logoUrl, setLogoUrl] = useState(row.logoUrl ?? "");
  const [website, setWebsite] = useState(row.website ?? "");
  const [sortOrder, setSortOrder] = useState<number | "">(row.sortOrder ?? 0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setMsg(null);

    try {
      const res = await fetch(`/api/sponsors/${row.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          logoUrl: logoUrl.trim(),
          website: website.trim() || null,
          sortOrder: sortOrder === "" ? 0 : Number(sortOrder),
        }),
      });

      const ct = res.headers.get("content-type") || "";
      const payload = ct.includes("application/json") ? await res.json() : null;

      if (!res.ok || (payload && payload.ok === false)) {
        const serverMsg =
          (payload && (payload.error || payload.message)) ||
          `HTTP ${res.status} ${res.statusText}`;
        setErr(serverMsg);
        setLoading(false);
        return;
      }

      setMsg("Guardado.");
      setTimeout(() => {
        router.push("/admin/marketing/sponsors");
        router.refresh();
      }, 400);
    } catch (e: any) {
      setErr(e?.message || "Error inesperado");
      setLoading(false);
    }
  }

  async function onDelete() {
    if (!confirm("¿Eliminar patrocinador?")) return;
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch(`/api/sponsors/${row.id}`, { method: "DELETE" });

      const ct = res.headers.get("content-type") || "";
      const payload = ct.includes("application/json") ? await res.json() : null;

      if (!res.ok || (payload && payload.ok === false)) {
        const serverMsg =
          (payload && (payload.error || payload.message)) ||
          `HTTP ${res.status} ${res.statusText}`;
        throw new Error(serverMsg);
      }

      setMsg("Eliminado.");
      setTimeout(() => {
        router.push("/admin/marketing/sponsors");
        router.refresh();
      }, 300);
    } catch (e: any) {
      setErr(e?.message || "No se pudo eliminar");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSave} className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-white/70">Nombre *</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-lg border border-white/10 bg-transparent px-3 py-2 outline-none"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-xs text-white/70">Orden</span>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value === "" ? "" : Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-transparent px-3 py-2 outline-none"
            min={0}
          />
        </label>

        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-xs text-white/70">Logo URL *</span>
          <input
            type="url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            required
            className="rounded-lg border border-white/10 bg-transparent px-3 py-2 outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="text-xs text-white/70">Sitio web</span>
          <input
            type="url"
            value={website ?? ""}
            onChange={(e) => setWebsite(e.target.value)}
            className="rounded-lg border border-white/10 bg-transparent px-3 py-2 outline-none"
          />
        </label>
      </div>

      {err && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {err}
        </div>
      )}
      {msg && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          {msg}
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm hover:bg-emerald-500/20 disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={loading}
          className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm hover:bg-red-500/20 disabled:opacity-50"
        >
          Eliminar
        </button>
        <a href="/admin/marketing/sponsors" className="rounded-xl border px-4 py-2 text-sm">
          Cancelar
        </a>
      </div>
    </form>
  );
}
