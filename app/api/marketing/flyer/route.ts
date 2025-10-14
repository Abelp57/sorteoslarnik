/* eslint-disable */
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "marketing-flyer.json");

type FlyerCfg = {
  enabled: boolean;
  imageUrl: string | null;
  delaySeconds: number;
  autoCloseSeconds: number;
};

async function readCfg(): Promise<FlyerCfg> {
  try {
    const b = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(b);
  } catch {
    return { enabled: false, imageUrl: null, delaySeconds: 3, autoCloseSeconds: 10 };
  }
}

async function writeCfg(cfg: FlyerCfg) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(cfg, null, 2), "utf8");
}

export async function GET() {
  const cfg = await readCfg();
  return NextResponse.json({ ok: true, flyer: cfg });
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const cfg = await readCfg();
    const nextCfg: FlyerCfg = {
      enabled: !!body?.enabled,
      imageUrl: body?.imageUrl ?? cfg.imageUrl ?? null,
      delaySeconds: Number(body?.delaySeconds ?? cfg.delaySeconds ?? 3),
      autoCloseSeconds: Number(body?.autoCloseSeconds ?? cfg.autoCloseSeconds ?? 10),
    };
    await writeCfg(nextCfg);
    return NextResponse.json({ ok: true, flyer: nextCfg });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Bad request" }, { status: 400 });
  }
}
