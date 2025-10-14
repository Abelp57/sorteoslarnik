"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteBtn({ id }: { id: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  const onDelete = () => {
    if (!confirm("¿Eliminar patrocinador?")) return;
    start(async () => {
      const res = await fetch(`/api/sponsors/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data?.error || "No se pudo eliminar");
      }
    });
  };

  return (
    <button
      onClick={onDelete}
      disabled={pending}
      className="rounded-lg border border-red-500/40 bg-red-500/10 px-2 py-1 text-xs hover:bg-red-500/20 disabled:opacity-50"
    >
      {pending ? "Eliminando..." : "Eliminar"}
    </button>
  );
}
