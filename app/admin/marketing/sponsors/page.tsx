export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import DeleteBtn from "./DeleteBtn";
import LogoImg from "./LogoImg";

export default async function SponsorsPage() {
  const rows = await prisma.sponsor.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Patrocinadores</h1>
        <div className="flex items-center gap-2">
          <a
            href="/admin/marketing/sponsors/new"
            className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm hover:bg-emerald-500/20"
          >
            Nuevo patrocinador
          </a>
          <a href="/admin" className="rounded-xl border px-3 py-2 text-sm">
            Volver
          </a>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-white/80">
          No hay patrocinadores cargados todavía.
        </div>
      ) : (
        <div className="grid gap-3">
          {rows.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <div className="flex items-center gap-3">
                <LogoImg
                  src={r.logoUrl}
                  alt={r.name || "Patrocinador"}
                  className="size-11 rounded bg-white object-contain"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {r.name || "Patrocinador"}
                  </span>
                  {r.website && (
                    <a
                      href={r.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-400 hover:underline"
                    >
                      {r.website}
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`/admin/marketing/sponsors/edit/${r.id}`}
                  className="rounded-lg border border-white/10 px-2 py-1 text-xs hover:bg-white/10"
                >
                  Editar
                </a>
                <DeleteBtn id={r.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
