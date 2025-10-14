/* app/api/admin/raffles-lite/route.ts */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Endpoint minimalista para listar rifas (id, title)
// Sirve como fallback universal del selector.
export async function GET() {
  try {
    const rows = await prisma.raffle.findMany({
      select: { id: true, title: true },
      orderBy: { createdAt: "desc" as const },
      take: 1000,
    });
    return NextResponse.json(rows, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Error" }, { status: 500 });
  }
}
