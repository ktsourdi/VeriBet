import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const grouped = await prisma.prediction.groupBy({
    by: ['tipsterId'],
    _count: { _all: true },
    _sum: { stake: true, profit: true }
  })

  const ids = grouped.map(g => g.tipsterId)
  const tipsters = await prisma.tipster.findMany({ where: { id: { in: ids } } })
  const idToName = new Map(tipsters.map(t => [t.id, t.name]))

  // Count results per tipster
  const results = await prisma.prediction.findMany({
    where: { tipsterId: { in: ids } },
    select: { tipsterId: true, result: true }
  })
  const counts = new Map<number, { wins: number; losses: number; pending: number }>()
  for (const r of results) {
    const entry = counts.get(r.tipsterId) ?? { wins: 0, losses: 0, pending: 0 }
    if (r.result === 'WIN') entry.wins += 1
    else if (r.result === 'LOSS') entry.losses += 1
    else entry.pending += 1
    counts.set(r.tipsterId, entry)
  }

  const data = grouped.map(g => {
    const name = idToName.get(g.tipsterId) ?? `Tipster ${g.tipsterId}`
    const totalBets = g._count._all
    const totalStake = g._sum.stake ?? 0
    const totalProfit = g._sum.profit ?? 0
    const c = counts.get(g.tipsterId) ?? { wins: 0, losses: 0, pending: 0 }
    const roi = totalStake > 0 ? totalProfit / totalStake : 0
    const hitRate = totalBets > 0 ? c.wins / (c.wins + c.losses) : 0
    return {
      tipster: name,
      totalBets,
      wins: c.wins,
      losses: c.losses,
      pending: c.pending,
      totalStake,
      totalProfit,
      roi,
      hitRate
    }
  })

  // Sort by ROI desc by default
  data.sort((a, b) => b.roi - a.roi)

  return NextResponse.json(data)
}