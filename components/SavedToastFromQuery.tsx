// components/SavedToastFromQuery.tsx
"use client";
import { useEffect, useState } from "react";

export default function SavedToastFromQuery() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("saved") === "1") {
        setShow(true);
        const t = setTimeout(() => setShow(false), 2200);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 rounded-xl border border-emerald-500/30 bg-emerald-600/10 px-4 py-3 backdrop-blur">
      <span className="text-sm font-medium">✓ Guardado</span>
    </div>
  );
}