"use client";

import { useState } from "react";

export default function NewSponsorPage() {
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [website, setWebsite] = useState("");
  const [sortOrder, setSortOrder] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function onUpload(file: File) {
    try {
      setUploading(true);
      setErr(null);
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/uploads/sponsor-logo", { method: "POST", body: form });
      const ct = res.headers.get("content-type") || "";
      const payload = ct.includes("application/json") ? await res.json() : null;
      if (!res.ok || !payload?.ok) throw new Error(payload?.error || `HTTP ${res.status}`);
      setLogoUrl(payload.url);
      setMsg("Logo subido.");
    } catch (e: any) {
      setErr(e?.message || "No se pudo subir el logo.");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setMsg(null);

    try {
      const res = await fetch("/api/sponsors", {
        method: "POST",
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

      setMsg("Patrocinador creado.");
      setTimeout(() => (window.location.href = "/admin/marketing/sponsors"), 500);
    } catch (e: any) {
      setErr(e?.message || "Error inesperado");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Nuevo patrocinador</h1>
        <a href="/admin/marketing/sponsors" className="rounded-xl border px-3 py-2 text-sm">
          Volver
        </a>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-white/70">Nombre *</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-lg border border-white/10 bg-transparent px-3 py-2 outline-none"
              placeholder="https://.../logo.png o /uploads/sponsors/archivo.jpg"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-white/70">Orden (número)</span>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value === "" ? "" : Number(e.target.value))}
              className="rounded-lg border border-white/10 bg-transparent px-3 py-2 outline-none"
              placeholder="0"
              min={0}
            />
          </label>

          <div className="flex flex-col gap-2 sm:col-span-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-white/70">Logo URL *</span>
              <input
                type="text"
                value={logoUrl}
                onChange={(e) = placeholder="https://.../logo.png o /uploads/sponsors/archivo.jpg">
                required
                className="rounded-lg border border-white/10 bg-transparent px-3 py-2 outline-none"
                placeholder="https://.../logo.png"
              />
            </label>

            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-xs">
                <span className="text-white/70">o subir archivo:</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                  onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
                  disabled={uploading}
                />
              </label>
              {uploading && <span className="text-xs text-white/60">Subiendo...</span>}
            </div>

            {!!logoUrl && (
              <div className="flex items-center gap-3">
                <img src={logoUrl} alt="Preview" className="h-12 w-12 rounded bg-white object-contain" />
                <code className="text-xs text-white/70">{logoUrl}</code>
              </div>
            )}
          </div>

          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className="text-xs text-white/70">Sitio web (opcional)</span>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="rounded-lg border border-white/10 bg-transparent px-3 py-2 outline-none"
              placeholder="https://acme.com"
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
          <a href="/admin/marketing/sponsors" className="rounded-xl border px-4 py-2 text-sm">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}
