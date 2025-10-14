// app/api/admin/raffles/[id]/tickets/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const raffleId = params.id;
    if (!raffleId) {
      return NextResponse.json(
        { ok: false, error: "Falta id de rifa" },
        { status: 400 }
      );
    }

    // Devuelve todos los boletos creados para esa rifa
    const tickets = await prisma.ticket.findMany({
      where: { raffleId },
      select: { number: true, status: true },
      orderBy: { number: "asc" },
    });

    return NextResponse.json({ ok: true, tickets });
  } catch (e: any) {
    console.error("[GET /api/admin/raffles/:id/tickets] error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Error interno" },
      { status: 500 }
    );
  }
}
