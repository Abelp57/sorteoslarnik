"use client"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

export default function DeleteRaffleButton({ id, title }: { id: string, title?: string }) {
  const router = useRouter()
  const [msg, setMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const doDelete = () => {
    if (!id) return
    if (!confirm(`¿Eliminar la rifa "${title ?? id}"? Esta acción es permanente.`)) return
    setMsg(null)
    startTransition(async () => {
      try {
        const res = await fetch(`/api/raffles/${id}/delete`, { method: "DELETE" })
        const data = await res.json().catch(() => ({}))
        if (res.ok && data?.ok) {
          setMsg("Eliminada ✅")
          router.push("/admin/rifas")
          router.refresh()
        } else {
          setMsg(data?.error ?? "No se pudo eliminar")
        }
      } catch (e: any) {
        setMsg(e?.message ?? "Error de red")
      }
    })
  }

  return (
    <button
      type="button"
      onClick={doDelete}
      disabled={isPending || !id}
      className="px-3 py-1 rounded-md bg-red-600 text-white disabled:opacity-50"
      title="Eliminar rifa"
    >
      {isPending ? "Eliminando…" : "Eliminar"}
    </button>
  )
}