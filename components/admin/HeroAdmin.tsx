"use client";
import React from "react";

type Hero = {
  id: string;
  title: string;
  subtitle?: string | null;
  highlight?: string | null;
  ribbonText?: string | null;

  ctaPrimaryText?: string | null;
  ctaPrimaryUrl?: string | null;
  ctaSecondaryText?: string | null;
  ctaSecondaryUrl?: string | null;
  ctaThirdText?: string | null;
  ctaThirdUrl?: string | null;

  desktopImageUrl?: string | null;
  mobileImageUrl?: string | null;
  bullets?: string | null; // en DB: string (una por línea)
  theme: "DARK" | "LIGHT";
  isActive: boolean;
  sortOrder: number;
};

export default function HeroAdmin() {
  const [items, setItems] = React.useState<Hero[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [form, setForm] = React.useState<Partial<Hero>>({ theme: "DARK", bullets: "" });
  const [editingId, setEditingId] = React.useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/hero", { cache: "no-store" });
    const json = await res.json();
    setItems(json.items ?? []);
    setLoading(false);
  }
  React.useEffect(() => { load(); }, []);

  function updateField<K extends keyof Hero>(k: K, v: any){
    setForm(prev => ({ ...prev, [k]: v }));
  }

  async function save(e: React.FormEvent){
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/admin/hero/${editingId}` : "/api/admin/hero";
    const payload = { ...form };
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if(res.ok){
      setForm({ theme: "DARK", bullets: "" });
      setEditingId(null);
      await load();
    }
  }

  async function edit(id: string){
    const hero = items.find(x => x.id === id);
    if(hero){
      setEditingId(id);
      setForm({
        title: hero.title,
        subtitle: hero.subtitle ?? "",
        highlight: hero.highlight ?? "",
        ribbonText: hero.ribbonText ?? "",

        ctaPrimaryText: hero.ctaPrimaryText ?? "",
        ctaPrimaryUrl: hero.ctaPrimaryUrl ?? "",
        ctaSecondaryText: hero.ctaSecondaryText ?? "",
        ctaSecondaryUrl: hero.ctaSecondaryUrl ?? "",
        ctaThirdText: hero.ctaThirdText ?? "",
        ctaThirdUrl: hero.ctaThirdUrl ?? "",

        desktopImageUrl: hero.desktopImageUrl ?? "",
        mobileImageUrl: hero.mobileImageUrl ?? "",
        bullets: hero.bullets ?? "",
        theme: hero.theme,
        sortOrder: hero.sortOrder ?? 1
      });
    }
  }

  async function del(id: string){
    if(!confirm("¿Eliminar este hero?")) return;
    await fetch(`/api/admin/hero/${id}`, { method: "DELETE" });
    await load();
  }

  async function activate(id: string){
    await fetch(`/api/admin/hero/${id}`, { method: "PATCH" });
    await load();
  }

  const bulletsText = typeof form.bullets === "string" ? form.bullets : "";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Hero (Marketing)</h1>
        <p className="text-sm opacity-70">Crea, edita y activa el Hero principal de la página.</p>
      </div>

      <form onSubmit={save} className="grid md:grid-cols-2 gap-4 p-4 rounded-xl border border-white/10 bg-white/5">
        <input className="px-3 py-2 rounded-lg bg-black/20" placeholder="Título *"
          value={form.title ?? ""} onChange={e=>updateField("title", e.target.value)} required />
        <input className="px-3 py-2 rounded-lg bg-black/20" placeholder="Subtítulo"
          value={form.subtitle ?? ""} onChange={e=>updateField("subtitle", e.target.value)} />
        <input className="px-3 py-2 rounded-lg bg-black/20" placeholder="Palabra destacada (highlight)"
          value={form.highlight ?? ""} onChange={e=>updateField("highlight", e.target.value)} />
        <input className="px-3 py-2 rounded-lg bg-black/20" placeholder="Ribbon (texto pequeño arriba)"
          value={form.ribbonText ?? ""} onChange={e=>updateField("ribbonText", e.target.value)} />

        <input className="px-3 py-2 rounded-lg bg-black/20" placeholder="CTA primario - texto"
          value={form.ctaPrimaryText ?? ""} onChange={e=>updateField("ctaPrimaryText", e.target.value)} />
        <input className="px-3 py-2 rounded-lg bg-black/20" placeholder="CTA primario - URL"
          value={form.ctaPrimaryUrl ?? ""} onChange={e=>updateField("ctaPrimaryUrl", e.target.value)} />
        <input className="px-3 py-2 rounded-lg bg-black/20" placeholder="CTA secundario - texto"
          value={form.ctaSecondaryText ?? ""} onChange={e=>updateField("ctaSecondaryText", e.target.value)} />
        <input className="px-3 py-2 rounded-lg bg-black/20" placeholder="CTA secundario - URL"
          value={form.ctaSecondaryUrl ?? ""} onChange={e=>updateField("ctaSecondaryUrl", e.target.value)} />
        <input className="px-3 py-2 rounded-lg bg-black/20" placeholder="CTA tercero - texto"
          value={form.ctaThirdText ?? ""} onChange={e=>updateField("ctaThirdText", e.target.value)} />
        <input className="px-3 py-2 rounded-lg bg-black/20" placeholder="CTA tercero - URL"
          value={form.ctaThirdUrl ?? ""} onChange={e=>updateField("ctaThirdUrl", e.target.value)} />

        <input className="px-3 py-2 rounded-lg bg-black/20 md:col-span-2" placeholder="Imagen desktop URL"
          value={form.desktopImageUrl ?? ""} onChange={e=>updateField("desktopImageUrl", e.target.value)} />
        <input className="px-3 py-2 rounded-lg bg-black/20 md:col-span-2" placeholder="Imagen mobile URL"
          value={form.mobileImageUrl ?? ""} onChange={e=>updateField("mobileImageUrl", e.target.value)} />

        <textarea className="px-3 py-2 rounded-lg bg-black/20 md:col-span-2" placeholder="Bullets (uno por línea)"
          value={bulletsText}
          onChange={e=>updateField("bullets", e.target.value)} />

        <div className="flex items-center gap-3">
          <label className="text-sm">Tema:</label>
          <select className="px-3 py-2 rounded-lg bg-black/20"
            value={form.theme ?? "DARK"}
            onChange={e=>updateField("theme", e.target.value as any)}>
            <option value="DARK">DARK</option>
            <option value="LIGHT">LIGHT</option>
          </select>
        </div>
        <input type="number" className="px-3 py-2 rounded-lg bg-black/20" placeholder="Orden"
          value={form.sortOrder ?? 1}
          onChange={e=>updateField("sortOrder", Number(e.target.value))} />

        <div className="md:col-span-2 flex gap-3">
          <button className="px-5 py-2 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 font-semibold">
            {editingId ? "Guardar cambios" : "Crear Hero"}
          </button>
          {editingId ? (
            <button type="button" onClick={()=>{ setEditingId(null); setForm({ theme:"DARK", bullets: "" }) }}
              className="px-5 py-2 rounded-lg border border-white/20">Cancelar</button>
          ) : null}
        </div>
      </form>

      <div className="grid gap-4">
        {loading ? <div>Cargando...</div> : null}
        {items.map(it => (
          <div key={it.id} className={`p-4 rounded-xl border ${it.isActive ? "border-fuchsia-400" : "border-white/10"} bg-white/5`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm opacity-60">#{it.sortOrder} {it.theme} {it.isActive ? "• ACTIVO" : ""}</div>
                <div className="font-bold truncate">{it.title}{it.highlight ? <span className="text-fuchsia-300"> {it.highlight}</span> : null}</div>
                <div className="text-sm opacity-80 truncate">{it.subtitle}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>activate(it.id)} className="px-3 py-2 rounded-lg border border-white/20 hover:bg-white/10">Activar</button>
                <button onClick={()=>edit(it.id)} className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500">Editar</button>
                <button onClick={()=>del(it.id)} className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}