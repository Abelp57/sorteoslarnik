import { prisma } from '@/lib/prisma';

export default async function RifaPublicPage({ params }: { params: { id: string } }) {
  const id = params?.id;
  const raffle = id
    ? await prisma.raffle.findUnique({ where: { id } })
    : null;

  if (!raffle) {
    return <div className="p-6">Rifa no encontrada.</div>;
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{raffle.title ?? `Rifa ${raffle.id}`}</h1>
      <p className="text-gray-700">{raffle.description ?? 'Sin descripción'}</p>
    </main>
  );
}
