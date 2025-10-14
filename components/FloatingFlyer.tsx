"use client";
import { useEffect, useState } from "react";

type Flyer = {
  id: string;
  imageUrl: string | null;
  isEnabled: boolean;
  delaySeconds: number;
  autoCloseSeconds: number;
};

export default function FloatingFlyer() {
  const [flyer, setFlyer] = useState<Flyer | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let t1: any, t2: any;
    (async () => {
      try {
        const r = await fetch("/api/marketing/flyer", { cache: "no-store" });
        if (!r.ok) return;
        const j: Flyer = await r.json();
        setFlyer(j);
        if (j.isEnabled && j.imageUrl) {
          t1 = setTimeout(() => {
            setVisible(true);
            if (j.autoCloseSeconds > 0) {
              t2 = setTimeout(() => setVisible(false), j.autoCloseSeconds * 1000);
            }
          }, Math.max(0, j.delaySeconds) * 1000);
        }
      } catch {}
    })();
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!visible || !flyer?.imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => setVisible(false)}
    >
      <div
        className="relative w-[92vw] max-w-md rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/15"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={flyer.imageUrl}
          alt="Promoción"
          className="w-full h-auto object-contain bg-white"
          loading="eager"
        />
        <button
          onClick={() => setVisible(false)}
          className="absolute top-2 right-2 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs px-2 py-1"
        >
          Cerrar ✕
        </button>
      </div>
    </div>
  );
}