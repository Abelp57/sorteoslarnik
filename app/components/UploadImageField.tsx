/* app/components/UploadImageField.tsx */
"use client";
import * as React from "react";

export default function UploadImageField({
  value, onChange
}: {
  value?: string | null;
  onChange: (url: string) => void;
}) {
  const [drag, setDrag] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    setPreview(value || null);
  }, [value]);

  async function upload(file: File) {
    if (!file) return;
    const okTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!okTypes.includes(file.type)) {
      setMsg("Formato no permitido. Usa JPG/PNG/WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMsg("Máximo 5MB.");
      return;
    }
    setMsg(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch("/api/admin/upload/winners", { method: "POST", body: fd });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || "Error al subir");
      onChange(j.url);
      setPreview(j.url);
      setMsg("Imagen subida.");
    } catch (e: any) {
      setMsg(e?.message || "Fallo al subir");
    } finally {
      setBusy(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) upload(f);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) upload(f);
  }

  // Permite pegar una URL manualmente si el usuario prefiere
  function onManual(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
    setPreview(e.target.value || null);
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e)=>{e.preventDefault(); setDrag(true);}}
        onDragLeave={()=>setDrag(false)}
        onDrop={onDrop}
        className={"rounded-xl border p-3 " + (drag ? "border-primary ring-2 ring-primary/40" : "")}
      >
        <div className="flex items-center gap-3">
          <input type="file" accept="image/*" onChange={onInputChange} disabled={busy} />
          <button
            type="button"
            onClick={()=>{const i=document.createElement("input"); i.type="file"; i.accept="image/*"; i.onchange=(e)=>onInputChange(e as any); i.click();}}
            className="rounded-lg border px-3 py-1"
            disabled={busy}
          >
            {busy ? "Subiendo…" : "Elegir archivo"}
          </button>
          <span className="text-xs text-foreground/60">JPG/PNG/WebP · máx 5MB · también puedes arrastrar/soltar</span>
        </div>
        {preview ? (
          <div className="mt-3">
            <img src={preview} alt="Evidencia" className="h-32 w-auto rounded-lg border object-contain bg-foreground/[0.03]" />
          </div>
        ) : null}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-foreground/90">O pegar URL manual</label>
        <input
          value={value || ""}
          onChange={onManual}
          placeholder="/uploads/winners/mi_evidencia.jpg"
          className="w-full rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 ring-primary/40"
        />
      </div>

      {msg ? <p className="text-xs text-foreground/60">{msg}</p> : null}
    </div>
  );
}
