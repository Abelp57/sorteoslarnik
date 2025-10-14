import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const revalidate = 0;

export async function GET() {
  const sponsors = await prisma.sponsor.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ sponsors });
}