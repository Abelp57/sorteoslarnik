// app/admin/marketing/sponsors/edit/[id]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditForm from "./EditForm";

export default async function EditSponsorPage({ params }: { params: { id: string } }) {
  const row = await prisma.sponsor.findUnique({ where: { id: params.id } });
  if (!row) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Editar patrocinador</h1>
        <a href="/admin/marketing/sponsors" className="rounded-xl border px-3 py-2 text-sm">
          Volver
        </a>
      </div>
      <EditForm row={row} />
    </div>
  );
}
