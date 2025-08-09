"use client"
import React from 'react'

interface TipsterStats {
  tipster: string
  totalBets: number
  wins: number
  losses: number
  pending: number
  totalStake: number
  totalProfit: number
  roi: number
  hitRate: number
}

export default function AnalyticsPage() {
  const [rows, setRows] = React.useState<TipsterStats[]>([])
  const [loading, setLoading] = React.useState(false)
  const [sortKey, setSortKey] = React.useState<keyof TipsterStats>('roi')
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc')

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/analytics/tipsters', { cache: 'no-store' })
    const data: TipsterStats[] = await res.json()
    setRows(data)
    setLoading(false)
  }

  React.useEffect(() => { load() }, [])

  const sorted = [...rows].sort((a, b) => {
    const va = a[sortKey]
    const vb = b[sortKey]
    const dir = sortDir === 'asc' ? 1 : -1
    if (typeof va === 'number' && typeof vb === 'number') return dir * (va - vb)
    return dir * String(va).localeCompare(String(vb))
  })

  const setSort = (key: keyof TipsterStats) => {
    if (key === sortKey) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('desc') }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Tipster Analytics</h1>
      <button onClick={load} disabled={loading}>{loading ? 'Loading...' : 'Refresh'}</button>
      <table>
        <thead>
          <tr>
            <Th label="Tipster" onClick={() => setSort('tipster')} />
            <Th label="Bets" onClick={() => setSort('totalBets')} />
            <Th label="Wins" onClick={() => setSort('wins')} />
            <Th label="Losses" onClick={() => setSort('losses')} />
            <Th label="Pending" onClick={() => setSort('pending')} />
            <Th label="Stake" onClick={() => setSort('totalStake')} />
            <Th label="Profit" onClick={() => setSort('totalProfit')} />
            <Th label="ROI" onClick={() => setSort('roi')} />
            <Th label="Hit Rate" onClick={() => setSort('hitRate')} />
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.tipster}>
              <td>{r.tipster}</td>
              <td>{r.totalBets}</td>
              <td>{r.wins}</td>
              <td>{r.losses}</td>
              <td>{r.pending}</td>
              <td>{r.totalStake.toFixed(2)}</td>
              <td>{r.totalProfit.toFixed(2)}</td>
              <td>{(r.roi * 100).toFixed(1)}%</td>
              <td>{(r.hitRate * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}

function Th({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <th style={{ cursor: 'pointer', userSelect: 'none' }} onClick={onClick}>
      {label}
    </th>
  )
}