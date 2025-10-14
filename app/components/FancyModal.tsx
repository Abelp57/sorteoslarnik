"use client";
import React, { useEffect } from "react";

export default function FancyModal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    function esc(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    if (open) document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Fondo */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      {/* Contenedor */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        {/* Marco con degradado */}
        <div className="w-full max-w-lg rounded-2xl p-[1px] bg-gradient-to-br from-emerald-500/30 via-cyan-400/20 to-amber-400/30 shadow-2xl">
          <div className="rounded-2xl bg-zinc-900/95 ring-1 ring-white/10 overflow-hidden">
            {/* Header con logo */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-9 w-9 rounded-lg border border-white/10 object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
              <div className="flex-1">
                <h3 className="text-base font-semibold leading-tight">{title}</h3>
                <p className="text-xs opacity-70">Atención personalizada por WhatsApp</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full w-8 h-8 text-sm bg-white/10 hover:bg-white/20"
                aria-label="Cerrar"
              >
                �o.
              </button>
            </div>
            {/* Cuerpo */}
            <div className="px-5 py-4">{children}</div>
            {/* Footer */}
            <div className="px-5 py-4 border-t border-white/10 flex justify-end gap-2 bg-zinc-900/70">
              {footer}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


