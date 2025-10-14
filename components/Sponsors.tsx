import { prisma } from "@/lib/prisma";
export default async function Sponsors() {
  const sponsors = await prisma.sponsor.findMany({ orderBy: { id: "asc" } });
  if (!sponsors?.length) return null;

  return (
    <section id="patrocinadores" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Patrocinadores</h2>
        <p className="text-sm opacity-70">Gracias a quienes impulsan nuestros sorteos.</p>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {sponsors.map((s: any) => {
          const name = s.name ?? "Patrocinador";
          const site = s.site ?? s.website ?? s.url ?? null;
          const logo = s.logoUrl ?? s.logo ?? s.image ?? "";
          return (
            <li key={s.id} className="group rounded-2xl bg-white/5 p-4 hover:bg-white/10 transition">
              <a href={site || "#"} target={site ? "_blank" : undefined} rel={site ? "noopener noreferrer" : undefined} className="flex items-center gap-4">
                {logo ? <img src={logo} alt={name} className="h-12 w-12 rounded-xl object-cover" loading="lazy" /> : <div className="h-12 w-12 rounded-xl bg-white/10" />}
                <div className="min-w-0">
                  <div className="truncate font-medium">{name}</div>
                  {site ? <div className="truncate text-sm opacity-70">{String(site).replace(/^https?:\/\//, "")}</div> : null}
                </div>
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}