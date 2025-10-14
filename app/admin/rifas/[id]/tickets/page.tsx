// app/admin/rifas/[id]/tickets/page.tsx
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import NextDynamic from "next/dynamic";

const AdminTicketEditor = NextDynamic(
  () => import("@/app/components/AdminTicketEditor"),
  { ssr: false }
);

export default async function Page({ params }: { params: { id: string } }) {
  const raffle = await prisma.raffle.findUnique({
    where: { id: params.id },
    select: { id: true, title: true, total: true, digits: true, startNumber: true },
  });
  if (!raffle) return notFound();

  return (
    <AdminTicketEditor
      raffleId={raffle.id}
      title={raffle.title}
      total={raffle.total}
      digits={raffle.digits}
      startNumber={raffle.startNumber}
    />
  );
}
