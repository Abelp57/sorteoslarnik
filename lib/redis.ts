import { Redis } from '@upstash/redis'

export const redis = Redis.fromEnv()
export const HOLD_TTL = parseInt(process.env.HOLD_TTL_SECONDS ?? '900', 10)
export const holdKey = (raffleId: string, n: number) => `raffle:${raffleId}:ticket:${n}`