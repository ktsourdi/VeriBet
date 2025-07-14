import { NextRequest, NextResponse } from 'next/server'
import { updatePrediction } from '@/lib/store'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const idNum = Number(params.id)
  if (isNaN(idNum)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  const body = await req.json()
  const { result } = body as { result: 'WIN' | 'LOSS' | 'PENDING' }
  if (!result) return NextResponse.json({ error: 'Missing result' }, { status: 400 })
  const updated = updatePrediction(idNum, { result })
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
} 