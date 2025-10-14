import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function normBullets(x: any): string[] {
  try {
    if (!x) return [];
    if (Array.isArray(x)) return x.filter(Boolean).map(String);
    if (typeof x === "string") {
      if (x.trim().startsWith("[")) return JSON.parse(x);
      return x.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * GET /api/admin/hero
 * Devuelve todos y el activo.
 * ?onlyActive=true → solo activos
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const onlyActive = url.searchParams.get("onlyActive") === "true";

    const items = await prisma.homeHero.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      orderBy: [{ isActive: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    });

    const active = items.find(h => h.isActive) ?? null;

    return NextResponse.json({ ok: true, items, active }, { status: 200 });
  } catch (e: any) {
    console.error("[GET /api/admin/hero]", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "unexpected error" }, { status: 500 });
  }
}

/**
 * POST /api/admin/hero
 * Crea un nuevo hero. Si isActive=true, desactiva los demás primero (1 activo).
 */
export async function POST(request: Request) {
  try {
    const data = await request.json();

    const payload = {
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
      bullets: Array.isArray(data.bullets) ? JSON.stringify(normBullets(data.bullets)) :
               typeof data.bullets === "string" ? data.bullets : "",
      theme: data.theme ?? "DARK",
      isActive: !!data.isActive,
      sortOrder: Number.isFinite(data.sortOrder) ? data.sortOrder : 1,
    };

    const tx = [];
    if (payload.isActive) {
      tx.push(prisma.homeHero.updateMany({ data: { isActive: false }, where: { isActive: true } }));
    }
    tx.push(prisma.homeHero.create({ data: payload }));

    const [, created] = await prisma.$transaction(tx as any);

    return NextResponse.json({ ok: true, hero: created }, { status: 201 });
  } catch (e: any) {
    console.error("[POST /api/admin/hero]", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "unexpected error" }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/hero?id=XYZ
 * Borra por id.
 */
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ ok: false, error: "Falta 'id'" }, { status: 400 });

    const deleted = await prisma.homeHero.delete({ where: { id } });
    return NextResponse.json({ ok: true, hero: deleted }, { status: 200 });
  } catch (e: any) {
    console.error("[DELETE /api/admin/hero]", e);
    return NextResponse.json({ ok: false, error: e?.message ?? "unexpected error" }, { status: 500 });
  }
}
