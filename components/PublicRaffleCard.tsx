"use client";

import React from "react";
import Link from "next/link";
import SaleModal from "@/components/SaleModal";

type Raffle = {
  id: string;
  title: string | null;
  shortDescription?: string | null;
  description?: string | null;
  mainImage?: string | null;
  price?: number | null;
};

function mxn(n: number) {
  try {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
  } catch {
    return "$" + n + " MXN";
  }
}

export default function PublicRaffleCard({ raffle }: { raffle: Raffle }) {
  const title = raffle.title ?? "Rifa";
  const desc = raffle.shortDescription ?? raffle.description ?? "";
  const price = typeof raffle.price === "number" ? raffle.price : null;

  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<"buy" | "reserve">("buy");

  const openBuy = () => { setMode("buy"); setOpen(true); };
  const openReserve = () => { setMode("reserve"); setOpen(true); };

  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      {raffle.mainImage ? (
        <img src={raffle.mainImage} alt={title} className="w-full h-48 object-cover" loading="lazy" />
      ) : (
        <div className="w-full h-48 bg-white/5" />
      )}

      <div className="p-4">
        <h3 className="font-semibold">{title}</h3>
        {desc && <p className="text-sm opacity-80 mt-1 line-clamp-2">{desc}</p>}

        <div className="mt-4 flex items-center gap-2 flex-wrap">
          {price !== null && (
            <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-800/80 text-emerald-50">
              {mxn(price)}
            </span>
          )}

          <div className="ml-auto flex items-center gap-2">
            <Link
              href={`/rifas/${raffle.id}`}
              className="px-3 py-1.5 rounded-lg text-sm border border-white/10 bg-white/5 hover:bg-white/10 transition"
            >
              Más detalles
            </Link>
            <button
              onClick={openBuy}
              className="px-3 py-1.5 rounded-lg text-sm bg-emerald-500/90 hover:bg-emerald-400 text-black transition"
            >
              Comprar
            </button>
            <button
              onClick={openReserve}
              className="px-3 py-1.5 rounded-lg text-sm bg-amber-400/90 hover:bg-amber-400 text-black transition"
            >
              Apartar
            </button>
          </div>
        </div>
      </div>

      <SaleModal
        open={open}
        onClose={() => setOpen(false)}
        mode={mode}
        raffleTitle={title}
        raffleId={raffle.id}
        selectedNumbers={[]}
        price={price ?? 0}
        whatsappNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
        linkToRaffle={`/rifas/${raffle.id}#boletos`}
      />
    </article>
  );
}