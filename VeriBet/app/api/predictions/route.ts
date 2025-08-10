import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const items = await prisma.prediction.findMany({
    orderBy: { id: 'asc' },
    include: { tipster: true }
  })
  const data = items.map(p => ({
    id: p.id,
    tipster: p.tipster.name,
    event: p.event,
    pick: p.pick,
    stake: p.stake,
    odds: p.odds,
    result: p.result,
    profit: p.profit,
    createdAt: p.createdAt.toISOString()
  }))
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tipster, event, pick, stake, odds } = body as {
      tipster: string
      event: string
      pick: string
      stake: number
      odds: number
    }
    if (!tipster || !event || !pick || typeof stake !== 'number' || typeof odds !== 'number') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    }

    const normalizedTipster = tipster.trim()
    const tipsterRecord = await prisma.tipster.upsert({
      where: { name: normalizedTipster },
      create: { name: normalizedTipster },
      update: {}
    })

    const profit = 0 // starts pending

    const created = await prisma.prediction.create({
      data: {
        tipsterId: tipsterRecord.id,
        event,
        pick,
        stake,
        odds,
        result: 'PENDING',
        profit
      },
      include: { tipster: true }
    })

    const response = {
      id: created.id,
      tipster: created.tipster.name,
      event: created.event,
      pick: created.pick,
      stake: created.stake,
      odds: created.odds,
      result: created.result,
      profit: created.profit,
      createdAt: created.createdAt.toISOString()
    }

    return NextResponse.json(response, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
} 