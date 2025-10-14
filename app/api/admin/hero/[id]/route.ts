import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * PUT /api/admin/hero/[id]
 * Actualiza campos del hero por id.
 */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await req.json();

    const payload: any = {
      title: data.title,
      subtitle: data.subtitle ?? null,
      highlight: data.highlight ?? null,
      ribbonText: data.ribbonText ?? null,

      ctaPrimaryText: data.ctaPrimaryText ?? null,
      ctaPrimaryUrl: data.ctaPrimaryUrl ?? null,
      ctaSecondaryText: data.ctaSecondaryText ?? null,
      ctaSecondaryUrl: data.ctaSecondaryUrl ?? null,
      ctaThirdText: data.ctaThirdText ?? null,
      ctaThirdUrl: data.ctaThirdUrl ?? null,

      desktopImageUrl: data.desktopImageUrl ?? null,
      mobileImageUrl: data.mobileImageUrl ?? null,
      bullets: Array.isArray(data.bullets) ? JSON.stringify(data.bullets) :
               typeof data.bullets === "string" ? data.bullets : "",
      theme: data.theme ?? "DARK",
      sortOrder: Number.isFinite(data.sortOrder) ? data.sortOrder : 1,
    };

    if (typeof data.isActive === "boolean") {
      payload.isActive = data.isActive;
      if (data.isActive) {
        await prisma.homeHero.updateMany({ data: { isActive: false }, where: { isActive: true } });
      }
    }

    const updated = await prisma.homeHero.update({ where: { id }, data: payload });
    return NextResponse.json({ ok: true, hero: updated }, { status: 200 });
  } catch (e: any) {
    console.error("[PUT /api/admin/hero/[id]]", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "unexpected error" }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/hero/[id]
 * Activa este hero y desactiva los demás (1 solo activo).
 */
export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.homeHero.updateMany({ data: { isActive: false }, where: { isActive: true } });
    const updated = await prisma.homeHero.update({ where: { id }, data: { isActive: true } });
    return NextResponse.json({ ok: true, hero: updated }, { status: 200 });
  } catch (e: any) {
    console.error("[PATCH /api/admin/hero/[id]]", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "unexpected error" }, { status: 500 });
  }
}
