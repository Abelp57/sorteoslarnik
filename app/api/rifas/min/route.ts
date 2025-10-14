import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.raffle.findMany({
    select: { id: true, title: true, status: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(rows);
}