/* app/api/admin/upload/winners/route.ts */
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs"; // necesario para usar fs

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ ok: false, error: "file requerido" }, { status: 400 });

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ ok: false, error: "Archivo > 5MB" }, { status: 400 });
    }

    const orig = file.name || "evidencia";
    const ext = path.extname(orig).toLowerCase() || ".jpg";
    if (!ALLOWED.has(ext)) {
      return NextResponse.json({ ok: false, error: "Extensión no permitida (jpg, jpeg, png, webp)" }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const dir = path.join(process.cwd(), "public", "uploads", "winners");
    await fs.mkdir(dir, { recursive: true });

    const base = crypto.randomUUID().replace(/-/g, "");
    const filename = `${base}${ext}`;
    const abs = path.join(dir, filename);
    await fs.writeFile(abs, bytes);

    const url = `/uploads/winners/${filename}`;
    return NextResponse.json({ ok: true, url, bytes: file.size, name: filename });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Error al subir" }, { status: 500 });
  }
}
