export type Result = 'WIN' | 'LOSS' | 'PENDING'

export interface Prediction {
  id: number
  tipster: string
  event: string
  pick: string
  stake: number
  odds: number
  result: Result
  profit: number
  createdAt: string
} 