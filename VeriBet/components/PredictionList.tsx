'use client'
import React, { useEffect, useState } from 'react'
import { Prediction } from '@/lib/store'

export default function PredictionList({ refreshSignal = 0 }: { refreshSignal?: number }) {
  const [items, setItems] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/predictions', { cache: 'no-store' })
    const data: Prediction[] = await res.json()
    setItems(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [refreshSignal])

  const updateResult = async (id: number, result: 'WIN' | 'LOSS' | 'PENDING') => {
    await fetch(`/api/predictions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ result })
    })
    await load()
  }

  const totalPL = items.reduce((sum, p) => sum + p.profit, 0)

  return (
    <div>
      <button onClick={load} disabled={loading}>{loading ? 'Loading...' : 'Refresh'}</button>
      <h3>Total P/L: {totalPL.toFixed(2)}</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Tipster</th><th>Event</th><th>Pick</th><th>Stake</th><th>Odds</th><th>Result</th><th>Profit</th><th>Created</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.tipster}</td>
              <td>{p.event}</td>
              <td>{p.pick}</td>
              <td>{p.stake}</td>
              <td>{p.odds}</td>
              <td>{p.result}</td>
              <td>{p.profit.toFixed(2)}</td>
              <td>{new Date(p.createdAt).toLocaleString()}</td>
              <td>
                <select value={p.result} onChange={e => updateResult(p.id, e.target.value as any)}>
                  <option value="PENDING">PENDING</option>
                  <option value="WIN">WIN</option>
                  <option value="LOSS">LOSS</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 