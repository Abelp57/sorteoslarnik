import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: { id: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const row = await prisma.sponsor.findUnique({ where: { id: params.id } });
    if (!row) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    return NextResponse.json({ ok: true, sponsor: row });
  } catch (e) {
    console.error("[GET /api/sponsors/[id]]", e);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json();
    const data: any = {};

    if (body.name !== undefined) data.name = String(body.name).trim();
    if (body.logoUrl !== undefined) data.logoUrl = String(body.logoUrl).trim();
    if (body.website !== undefined) data.website = body.website ? String(body.website).trim() : null;
    if (body.sortOrder !== undefined) {
      const so = Number(body.sortOrder);
      data.sortOrder = isNaN(so) ? 0 : so;
    }

    if (data.name === "") return NextResponse.json({ ok: false, error: "name_required" }, { status: 400 });
    if (data.logoUrl === "") return NextResponse.json({ ok: false, error: "logo_required" }, { status: 400 });

    const updated = await prisma.sponsor.update({ where: { id: params.id }, data });
    return NextResponse.json({ ok: true, sponsor: updated });
  } catch (e) {
    console.error("[PUT /api/sponsors/[id]]", e);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await prisma.sponsor.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[DELETE /api/sponsors/[id]]", e);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
}
