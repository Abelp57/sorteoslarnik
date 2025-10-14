export type RaffleStatus =
  | 'DRAFT' | 'PUBLISHED' | 'ACTIVE' | 'PAUSED'
  | 'CLOSED' | 'DRAW_PENDING' | 'FINISHED' | 'CANCELED'

export type TicketStatus =
  | 'AVAILABLE' | 'ON_HOLD' | 'SOLD' | 'BLOCKED' | 'REFUNDED'

export type PaymentStatus =
  | 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'REFUNDED'

export type DrawMethod =
  | 'MANUAL' | 'LIVE_WHEEL' | 'RANDOM_API' | 'PSEUDO_RANDOM' | 'EXTERNAL_NOTARY'

export type Role =
  | 'OWNER' | 'ADMIN' | 'EDITOR' | 'OPERATOR' | 'AUDITOR'
