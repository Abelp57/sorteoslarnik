import React from "react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page(){
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Marketing</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <Link href="/admin/marketing/hero" className="block rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
          <div className="font-semibold text-lg">Hero de Home</div>
          <div className="text-sm opacity-70">Gestiona el hero administrable (título, subtítulo, CTAs, imagen, etc.).</div>
        </Link>
        <Link href="/admin/marketing/flyer" className="block rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
          <div className="font-semibold text-lg">Flyer emergente</div>
          <div className="text-sm opacity-70">Configura el flyer promocional que aparece en la Home.</div>
        </Link>
      </div>
    </main>
  );
}