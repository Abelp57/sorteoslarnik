import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bad(msg: string, status = 400) {
  return NextResponse.json({ ok: false, error: msg }, { status });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";
    const take = Number(searchParams.get("take") ?? 100);
    const skip = Number(searchParams.get("skip") ?? 0);

    const where = q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { website: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined;

    const [items, total] = await Promise.all([
      prisma.sponsor.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        take: isNaN(take) ? 100 : take,
        skip: isNaN(skip) ? 0 : skip,
      }),
      prisma.sponsor.count({ where }),
    ]);

    return NextResponse.json({ ok: true, total, sponsors: items });
  } catch (err) {
    console.error("[GET /api/sponsors]", err);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const logoUrl = String(body?.logoUrl ?? "").trim();
    const website = body?.website ? String(body.website).trim() : null;
    const sortOrderRaw = body?.sortOrder;
    const sortOrder =
      sortOrderRaw === undefined || sortOrderRaw === null || sortOrderRaw === ""
        ? 0
        : Number(sortOrderRaw);

    if (!name) return bad("Falta 'name'");
    if (!logoUrl) return bad("Falta 'logoUrl'");

    const created = await prisma.sponsor.create({
      data: { name, logoUrl, website, sortOrder: isNaN(sortOrder) ? 0 : sortOrder },
    });

    return NextResponse.json({ ok: true, sponsor: created }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/sponsors]", err);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
}
