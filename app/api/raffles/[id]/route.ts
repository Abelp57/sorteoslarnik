// app/api/raffles/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  // admitir POST desde <form method="POST"> aunque conceptualmente sea PUT
  return PUT(req, { params });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const form = await req.formData();
    const data = Object.fromEntries(form.entries());

    await prisma.raffle.update({
      where: { id: params.id },
      data: {
        title: String(data.title || ""),
        category: String(data.category || "OTROS"),
        price: Number(data.price ?? 0),
        digits: Number(data.digits ?? 3),
        total: Number(data.total ?? 100),
        startNumber: Number(data.startNumber ?? 1),
        status: String(data.status || "DRAFT") as any,
        drawAt: data.drawAt ? new Date(String(data.drawAt)) : null,
        drawMethod: (data.drawMethod as string) || null,
        drawPlatform: (data.drawPlatform as string) || null,
        mainImage: (data.mainImage as string) || "",
        galleryImages: data.galleryImages ? JSON.stringify((data.galleryImages as string).split("|").filter(Boolean)) : null,
        shortDescription: (data.shortDescription as string) || "",
        description: (data.description as string) || null,
      },
    });

    return NextResponse.redirect(new URL("/admin/rifas", req.url), { status: 303 });
  } catch (e: any) {
    console.error("[PUT /api/raffles/:id] error", e);
    return NextResponse.json({ ok: false, error: e.message ?? "Error" }, { status: 500 });
  }
}
