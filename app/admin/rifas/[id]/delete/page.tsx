import DeleteRaffleButton from '@/app/components/DeleteRaffleButton'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id
  const raffle = await prisma.raffle.findUnique({
    where: { id },
    select: { id: true, title: true }
  })

  if (!raffle) {
    return <div className="p-6">Rifa no encontrada</div>
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Eliminar rifa</h1>
      <div className="space-y-1">
        <div><span className="font-medium">ID:</span> {raffle.id}</div>
        <div><span className="font-medium">Título:</span> {raffle.title}</div>
      </div>
      <div className="pt-2">
        <DeleteRaffleButton id={raffle.id} title={raffle.title} />
      </div>
      <Link href="/admin/rifas" className="inline-block text-sm underline">Volver</Link>
    </div>
  )
}