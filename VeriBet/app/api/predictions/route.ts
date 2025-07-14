import { NextRequest, NextResponse } from 'next/server'
import { addPrediction, predictions, Result } from '@/lib/store'

export async function GET() {
  return NextResponse.json(predictions)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { tipster, event, pick, stake, odds } = body as {
    tipster: string
    event: string
    pick: string
    stake: number
    odds: number
    result?: Result
  }
  if (!tipster || !event || !pick || !stake || !odds) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }
  const pred = addPrediction({ tipster, event, pick, stake, odds })
  return NextResponse.json(pred, { status: 201 })
} 