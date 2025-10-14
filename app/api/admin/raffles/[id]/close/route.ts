/* app/api/admin/raffles/[id]/close/route.ts */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// POST /api/admin/raffles/:id/close → cierra manualmente una rifa
export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    try {
      const r = await prisma.raffle.update({
        where: { id: params.id },
        data: { status: "CLOSED" as any, closeDate: new Date() },
      });
      return NextResponse.json({ ok: true, raffle: r }, { status: 200 });
    } catch {
      const r = await prisma.raffle.update({
        where: { id: params.id },
        data: { status: "FINISHED" as any, closeDate: new Date() },
      });
      return NextResponse.json({ ok: true, raffle: r }, { status: 200 });
    }
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "No se pudo cerrar la rifa" }, { status: 400 });
  }
}
