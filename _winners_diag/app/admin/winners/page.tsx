"use client";
import { useEffect, useState } from "react";

async function safe(url: string){
  try{
    const r = await fetch(url);
    if(!r.ok) return [];
    const ct = r.headers.get("content-type") || "";
    if(!ct.includes("application/json")) return [];
    return await r.json();
  }catch{ return []; }
}

type RaffleMin = { id: string; title: string; status?: string };
type Winner = {
  id?: string;
  raffleId: string;
  ticket?: number;
  name: string;
  phone?: string;
  prize?: string;
  proofImage?: string;
  published: boolean;
};

export default function WinnersPage() {
  const [raffles, setRaffles] = useState<RaffleMin[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState<Winner>({
    raffleId: "",
    ticket: undefined,
    name: "",
    phone: "",
    prize: "",
    proofImage: "",
    published: true,
  });

  async function load() {
    const [r1, r2] = await Promise.all([
      safe("/api/rifas/min"),
      safe("/api/winners"),
    ]);
    setRaffles(r1 as RaffleMin[]);
    setRows(r2 as any[]);
    if (!form.raffleId && (r1 as RaffleMin[]).length) {
      setForm(f => ({ ...f, raffleId: (r1 as RaffleMin[])[0].id }));
    }
  }
  useEffect(()=>{ load(); },[]);

  async function uploadProof(): Promise<string|undefined> {
    if (!file) return form.proofImage;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", "winners");
    const r = await fetch("/api/upload", { method: "POST", body: fd });
    const j = await r.json();
    return j.url as string;
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const proofImage = await uploadProof();
    const body = { ...form, proofImage };
    if (form.id) {
      await fetch(`/api/winners/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
    } else {
      await fetch(`/api/winners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
    }
    setForm({
      raffleId: raffles[0]?.id ?? "",
      ticket: undefined,
      name: "",
      phone: "",
      prize: "",
      proofImage: "",
      published: true
    });
    setFile(null);
    await load();
  }

  async function del(id: string) {
    if (!confirm("¿Eliminar ganador?")) return;
    await fetch(`/api/winners/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Ganadores</h1>

      <form onSubmit={save} className="grid md:grid-cols-3 gap-4 max-w-5xl">
        <select className="border rounded p-2" value={form.raffleId} onChange={e=>setForm({...form, raffleId:e.target.value})}>
          {raffles.map(r=><option key={r.id} value={r.id}>{r.title}</option>)}
        </select>
        <input type="number" className="border rounded p-2" placeholder="Ticket (opcional)" value={form.ticket ?? ""} onChange={e=>setForm({...form, ticket: e.target.value ? Number(e.target.value): undefined})}/>
        <input className="border rounded p-2" placeholder="Nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
        <input className="border rounded p-2" placeholder="Teléfono" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
        <input className="border rounded p-2" placeholder="Premio" value={form.prize} onChange={e=>setForm({...form, prize:e.target.value})}/>

        <div>
          <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]??null)}/>
          <input className="border rounded p-2 w-full mt-2" placeholder="o URL de evidencia" value={form.proofImage} onChange={e=>setForm({...form, proofImage:e.target.value})}/>
        </div>

        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={form.published} onChange={e=>setForm({...form, published:e.target.checked})}/>
          <span>Publicar en el sitio</span>
        </label>

        <div className="col-span-full">
          <button className="px-4 py-2 rounded bg-black text-white">{form.id ? "Actualizar" : "Agregar ganador"}</button>
          {form.id && <button type="button" className="ml-2 px-4 py-2 rounded border" onClick={()=>setForm({ raffleId: raffles[0]?.id ?? "", ticket: undefined, name: "", phone: "", prize: "", proofImage: "", published: true })}>Cancelar edición</button>}
        </div>
      </form>

      <div className="grid md:grid-cols-2 gap-4">
        {rows.map((r:any)=>(
          <div key={r.id} className="border rounded p-3 flex gap-3">
            {r.proofImage ? <img src={r.proofImage} alt="" className="w-24 h-24 object-cover rounded"/> : null}
            <div className="flex-1">
              <div className="font-semibold">{r.name} {r.ticket ? `(Ticket ${r.ticket})` : ""}</div>
              <div className="text-sm text-gray-600">{r.raffle?.title}</div>
              {r.prize ? <div className="text-sm">{r.prize}</div> : null}
              {r.phone ? <div className="text-xs text-gray-500">{r.phone}</div> : null}
              <div className="text-xs mt-1">{r.published ? "Publicado" : "Oculto"}</div>
            </div>
            <div className="flex flex-col gap-2">
              <button className="text-sm underline" onClick={()=>setForm({
                id:r.id, raffleId:r.raffleId, ticket:r.ticket ?? undefined, name:r.name, phone:r.phone ?? "", prize:r.prize ?? "", proofImage:r.proofImage ?? "", published: r.published
              })}>Editar</button>
              <button className="text-sm text-red-600 underline" onClick={()=>del(r.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}