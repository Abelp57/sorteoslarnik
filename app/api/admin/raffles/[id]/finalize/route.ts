import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const raffle = await prisma.raffle.update({
      where: { id },
      data: { status: "CLOSED", closeDate: new Date() },
    });
    
{
  const __acceptsJSON = req.headers.get("accept")?.includes("application/json");
  if (__acceptsJSON) {
    return NextResponse.json({ ok: true, raffle });
  }
  return NextResponse.redirect(new URL("/admin/rifas", req.url), 303);
}
  } catch (err: any) {
    console.error(err);
    
{
  const __acceptsJSON = req.headers.get("accept")?.includes("application/json");
  if (__acceptsJSON) {
    return NextResponse.json({ ok: false, error: err?.message ?? "Error" }, { status: 500 });
  }
  return NextResponse.redirect(new URL("/admin/rifas", req.url), 303);
}
  }
}