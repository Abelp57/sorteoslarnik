import React from "react";

type Props = { description?: string | null };

export default function RaffleDescription({ description }: Props) {
  if (!description || !description.trim()) return null;
  const parts = description.split("\n").map(s => s.trim()).filter(Boolean);

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-lg font-semibold tracking-tight">Descripción</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-white/90">
        {parts.map((p, i) => (<p key={i}>{p}</p>))}
      </div>
    </section>
  );
}
