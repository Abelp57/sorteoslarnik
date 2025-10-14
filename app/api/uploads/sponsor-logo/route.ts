import { NextRequest, NextResponse } from "next/server";
import { promises as fsp } from "fs";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
]);
const MAX_BYTES = 2 * 1024 * 1024; // 2MB

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const f = form.get("file");
    if (!f || !(f instanceof File)) {
      return NextResponse.json({ ok: false, error: "file_required" }, { status: 400 });
    }
    if (!ALLOWED.has(f.type)) {
      return NextResponse.json({ ok: false, error: "invalid_type" }, { status: 400 });
    }
    if (f.size > MAX_BYTES) {
      return NextResponse.json({ ok: false, error: "too_big" }, { status: 400 });
    }

    const bytes = Buffer.from(await f.arrayBuffer());
    const ext = ((): string => {
      if (f.type === "image/png") return ".png";
      if (f.type === "image/jpeg" || f.type === "image/jpg") return ".jpg";
      if (f.type === "image/webp") return ".webp";
      if (f.type === "image/svg+xml") return ".svg";
      return "";
    })();

    const random = crypto.randomBytes(6).toString("hex");
    const filename = `${Date.now()}-${random}${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads", "sponsors");
    await fsp.mkdir(dir, { recursive: true });
    const fp = path.join(dir, filename);
    await fsp.writeFile(fp, bytes);

    const url = `/uploads/sponsors/${filename}`;
    return NextResponse.json({ ok: true, url, name: f.name, size: f.size, type: f.type });
  } catch (e) {
    console.error("[POST /api/uploads/sponsor-logo]", e);
    return NextResponse.json({ ok: false, error: "upload_failed" }, { status: 500 });
  }
}
