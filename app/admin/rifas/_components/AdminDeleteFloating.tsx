"use client"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useState, useTransition } from "react"

export default function AdminDeleteFloating() {
  const params = useParams() as Record<string, string | string[] | undefined>
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [msg, setMsg] = useState<string | null>(null)

  // Detecta id desde cualquier ruta /admin/rifas/[id]/...
  const raw = params?.id
  const id = typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : ""

  if (!id) return null

  const onDelete = () => {
    if (!confirm(`¿Eliminar la rifa "${id}"? Esta acción es permanente.`)) return
    setMsg(null)
    startTransition(async () => {
      try {
        const res = await fetch(`/api/raffles/${id}/delete`, { method: "DELETE" })
        const data = await res.json().catch(() => ({}))
        if (res.ok && data?.ok) {
          setMsg("Eliminada �o.")
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
    <div className="fixed z-50 bottom-4 right-4 flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={onDelete}
        disabled={isPending}
        className="px-4 py-2 rounded-xl bg-red-600 text-white shadow-lg disabled:opacity-50"
      >
        {isPending ? "Eliminando�?�" : "Eliminar rifa"}
      </button>
      {msg && <span className="text-xs bg-black/70 text-white px-2 py-1 rounded">{msg}</span>}
    </div>
  )
}