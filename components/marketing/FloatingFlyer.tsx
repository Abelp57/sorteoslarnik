"use client";
import { useEffect, useState } from "react";

type FlyerCfg = {
  enabled: boolean;
  imageUrl: string | null;
  delaySeconds: number;
  autoCloseSeconds: number;
};

export default function FloatingFlyer() {
  const [cfg, setCfg] = useState<FlyerCfg | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/api/marketing/flyer", { cache: "no-store" });
        const ct = r.headers.get("content-type") || "";
        if (!ct.includes("application/json")) return;
        const j = await r.json();
        const flyer: FlyerCfg = j?.flyer ?? { enabled:false, imageUrl:null, delaySeconds:3, autoCloseSeconds:10 };
        if (!alive) return;
        setCfg(flyer);

        if (flyer.enabled && flyer.imageUrl) {
          const delay = Math.max(0, Number(flyer.delaySeconds || 0)) * 1000;
          const auto  = Math.max(0, Number(flyer.autoCloseSeconds || 0)) * 1000;

          const tt = setTimeout(() => {
            setVisible(true);
            if (auto > 0) {
              const cc = setTimeout(() => setVisible(false), auto);
              // cleanup auto
              return () => clearTimeout(cc);
            }
          }, delay);

          // cleanup delay
          return () => clearTimeout(tt);
        }
      } catch {}
    })();
    return () => { alive = false; };
  }, []);

  if (!cfg || !cfg.enabled || !cfg.imageUrl) return null;
  if (!visible) return null;

  function close() { setVisible(false); }

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={close}
        aria-label="Cerrar flyer"
      />
      {/* card */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative max-w-[90vw] max-h-[85vh] rounded-2xl shadow-xl overflow-hidden bg-white">
          <button
            onClick={close}
            className="absolute top-2 right-2 rounded-full border px-3 py-1 text-sm bg-white/80"
            aria-label="Cerrar"
          >
            ✕
          </button>
          <img
            src={cfg.imageUrl}
            alt="Flyer"
            style={{ display: "block", maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
  );
}
