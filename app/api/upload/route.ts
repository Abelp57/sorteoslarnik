/* eslint-disable */
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function ensureFileFrom(form: FormData): File | null {
  // Acepta varias llaves comunes
  const keys = ["file", "image", "imagen", "img", "archivo", "upload"];
  for (const k of keys) {
    const v = form.get(k);
    if (v && typeof v === "object" && "arrayBuffer" in v) {
      return v as File;
    }
  }
  // fallback: primer File que encontremos
  for (const [key, v] of (form as any).entries?.() ?? []) {
    if (v && typeof v === "object" && "arrayBuffer" in v) {
      return v as File;
    }
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = ensureFileFrom(form);
    if (!file) {
      return NextResponse.json({ ok: false, error: "No file uploaded (use 'file' or 'image')." }, { status: 400 });
    }

    const arrayBuf = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    const dirRel = "/uploads/marketing";
    const dirAbs = path.join(process.cwd(), "public", dirRel);
    await fs.mkdir(dirAbs, { recursive: true });

    const ext = (file.name?.includes(".") ? "." + file.name.split(".").pop() : "");
    const safeBase = (file.name?.replace(/[^a-zA-Z0-9._-]/g, "_") || "upload");
    const ts = Date.now();
    const filename = `${ts}-${safeBase}`;
    const finalName = filename.endsWith(ext) ? filename : filename + ext;

    const destAbs = path.join(dirAbs, finalName);
    await fs.writeFile(destAbs, buffer);

    const url = `${dirRel}/${finalName}`;
    return NextResponse.json({ ok: true, url, filename: finalName });
  } catch (err: any) {
    console.error("[/api/upload] Error:", err);
    return NextResponse.json({ ok: false, error: err?.message || "Upload failed" }, { status: 500 });
  }
}

// Opcional: bloquear métodos no permitidos
export async function GET() {
  return NextResponse.json({ ok: false, error: "Use POST with multipart/form-data" }, { status: 405 });
}
