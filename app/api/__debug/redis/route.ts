import { NextResponse } from "next/server"
import { redis } from "../../../../lib/redis"

export async function GET() {
  try {
    const pong = await redis.ping()
    return NextResponse.json({ ok: true, pong })
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "redis-fail" }, { status: 500 })
  }
}
