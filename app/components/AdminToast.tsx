"use client";
import { useEffect, useState } from "react";

export default function AdminToast({ ok, text = "Cambios guardados" }: { ok?: boolean; text?: string }) {
  const [show, setShow] = useState(!!ok);
  useEffect(() => {
    if (!ok) return;
    const t = setTimeout(() => setShow(false), 2500);
    return () => clearTimeout(t);
  }, [ok]);
  if (!show) return null;
  return (
    <div className="fixed top-4 right-4 z-50 rounded-xl bg-emerald-600 text-white px-4 py-2 shadow-lg">
      ✅ {text}
    </div>
  );
}


