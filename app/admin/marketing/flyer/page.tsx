"use client";
/* eslint-disable */
export const dynamic = "force-dynamic";
import { useState, useRef, useTransition, useEffect } from "react";

async function getCfg() {
  const r = await fetch("/api/marketing/flyer", { cache: "no-store" });
  const ct = r.headers.get("content-type") || "";
  if (!ct.includes("application/json")) throw new Error("GET /api/marketing/flyer no devolvió JSON");
  const j = await r.json();
  return j?.flyer ?? { enabled:false, imageUrl:null, delaySeconds:3, autoCloseSeconds:10 };
}

export default function FlyerAdminPage() {
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [delay, setDelay] = useState(3);
  const [autoClose, setAutoClose] = useState(10);
  const [saving, startSaving] = useTransition();
  const fileRef = useRef(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const cfg = await getCfg();
        if (!alive) return;
        setEnabled(!!cfg.enabled);
        setImageUrl(cfg.imageUrl || "");
        setDelay(Number(cfg.delaySeconds || 3));
        setAutoClose(Number(cfg.autoCloseSeconds || 10));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  async function uploadFile(f) {
    const fd = new FormData();
    fd.append("file", f);
    const r = await fetch("/api/upload", { method: "POST", body: fd });
    const ct = r.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      const t = await r.text();
      throw new Error("Upload no devolvió JSON: " + t.slice(0,200));
    }
    const j = await r.json();
    if (!j?.ok || !j?.url) throw new Error(j?.error || "Upload failed");
    return j.url;
  }

  async function onSelectFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = await uploadFile(f);
    setImageUrl(url);
  }

  async function onSave() {
    startSaving(async () => {
      const r = await fetch("/api/marketing/flyer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled,
          imageUrl: imageUrl || null,
          delaySeconds: Number(delay),
          autoCloseSeconds: Number(autoClose),
        }),
      });
      const ct = r.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const t = await r.text();
        alert("Guardar no devolvió JSON: " + t.slice(0,160));
        return;
      }
      const j = await r.json();
      if (!j?.ok) {
        alert("Error: " + (j?.error || "No se pudo guardar"));
      } else {
        alert("Guardado ✅");
      }
    });
  }

  if (loading) {
    return <div className="p-6">Cargando…</div>;
  }

  return (
    <div className="space-y-6 p-6 max-w-3xl">
      <h1 className="text-xl font-semibold">Flyer flotante</h1>

      <div className="space-y-3 rounded-xl border p-4">
        <label className="block text-sm font-medium">Imagen (subir)</label>
        <input ref={fileRef} onChange={onSelectFile} type="file" accept="image/*" className="block" />
        <p className="text-xs text-gray-500">Se guarda en /uploads/marketing/ (público).</p>
        {imageUrl ? (
          <div className="mt-2">
            <img src={imageUrl} alt="flyer" style={{ maxWidth: 320, borderRadius: 12 }} />
            <div className="text-xs text-gray-600 mt-1 break-all">{imageUrl}</div>
          </div>
        ) : null}
      </div>

      <div className="space-y-3 rounded-xl border p-4">
        <label className="block text-sm font-medium">o URL directa</label>
        <input value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)} placeholder="/uploads/marketing/xxx.png o https://…" className="w-full rounded-md border px-3 py-2" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border p-4">
          <label className="block text-sm font-medium">Aparece después de (segundos)</label>
          <input value={delay} onChange={(e)=>setDelay(e.target.value)} className="w-full rounded-md border px-3 py-2" />
        </div>
        <div className="rounded-xl border p-4">
          <label className="block text-sm font-medium">Se cierra a los (segundos)</label>
          <input value={autoClose} onChange={(e)=>setAutoClose(e.target.value)} className="w-full rounded-md border px-3 py-2" />
        </div>
      </div>

      <label className="inline-flex items-center space-x-2">
        <input type="checkbox" checked={enabled} onChange={(e)=>setEnabled(e.target.checked)} />
        <span>Activar flyer</span>
      </label>

      <div>
        <button onClick={onSave} disabled={saving} className="rounded-xl border px-4 py-2">
          {saving ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </div>
  );
}
