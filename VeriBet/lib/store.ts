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

let currentId = 1
export const predictions: Prediction[] = []

export function addPrediction(p: Omit<Prediction, 'id' | 'profit' | 'createdAt' | 'result'> & { result?: Result }) {
  const result: Result = p.result ?? 'PENDING'
  const profit = result === 'WIN' ? p.stake * (p.odds - 1) : result === 'LOSS' ? -p.stake : 0
  const newPred: Prediction = {
    id: currentId++,
    ...p,
    result,
    profit,
    createdAt: new Date().toISOString()
  }
  predictions.push(newPred)
  return newPred
}

export function updatePrediction(id: number, data: Partial<Pick<Prediction, 'result'>>) {
  const pred = predictions.find(pr => pr.id === id)
  if (!pred) return null
  if (data.result && pred.result === 'PENDING') {
    pred.result = data.result
    pred.profit = data.result === 'WIN' ? pred.stake * (pred.odds - 1) : data.result === 'LOSS' ? -pred.stake : 0
  }
  return pred
} 