'use client'
import React, { useEffect, useState } from 'react'
import { Prediction } from '@/lib/store'

export default function PredictionList() {
  const [items, setItems] = useState<Prediction[]>([])

  const load = async () => {
    const res = await fetch('/api/predictions')
    const data: Prediction[] = await res.json()
    setItems(data)
  }

  useEffect(() => {
    load()
  }, [])

  const totalPL = items.reduce((sum, p) => sum + p.profit, 0)

  return (
    <div>
      <button onClick={load}>Refresh</button>
      <h3>Total P/L: {totalPL.toFixed(2)}</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Tipster</th><th>Event</th><th>Pick</th><th>Stake</th><th>Odds</th><th>Result</th><th>Profit</th><th>Created</th>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 