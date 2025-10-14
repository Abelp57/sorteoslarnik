import { redis, holdKey, HOLD_TTL } from './redis'

export async function holdNumbers(raffleId: string, numbers: number[], buyerRef: string, ttl = HOLD_TTL) {
  const acquired: number[] = []
  const failed: number[] = []

  await Promise.all(numbers.map(async (n) => {
    const ok = await redis.set(holdKey(raffleId, n), buyerRef, { nx: true, ex: ttl })
    if (ok === 'OK') acquired.push(n)
    else failed.push(n)
  }))

  return { acquired, failed, ttl }
}

export async function verifyOwnership(raffleId: string, numbers: number[], buyerRef: string) {
  const vals = await Promise.all(numbers.map((n) => redis.get<string>(holdKey(raffleId, n))))
  return vals.every((v) => v === buyerRef)
}

export async function releaseNumbers(raffleId: string, numbers: number[]) {
  if (!numbers.length) return 0
  const keys = numbers.map((n) => holdKey(raffleId, n))
  return await redis.del(...keys)
}