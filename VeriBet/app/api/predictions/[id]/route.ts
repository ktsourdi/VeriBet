import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest) {
  const url = new URL(req.url)
  const segments = url.pathname.split('/')
  const idStr = segments[segments.length - 1]
  const idNum = Number(idStr)
  if (isNaN(idNum)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const body = await req.json()
  const { result } = body as { result: 'WIN' | 'LOSS' | 'PENDING' }
  if (!result) return NextResponse.json({ error: 'Missing result' }, { status: 400 })

  const existing = await prisma.prediction.findUnique({ where: { id: idNum }, include: { tipster: true } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const profit = result === 'WIN' ? existing.stake * (existing.odds - 1) : result === 'LOSS' ? -existing.stake : 0

  const updated = await prisma.prediction.update({
    where: { id: idNum },
    data: { result, profit },
    include: { tipster: true }
  })

  return NextResponse.json({
    id: updated.id,
    tipster: updated.tipster.name,
    event: updated.event,
    pick: updated.pick,
    stake: updated.stake,
    odds: updated.odds,
    result: updated.result,
    profit: updated.profit,
    createdAt: updated.createdAt.toISOString()
  })
} 