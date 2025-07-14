'use client'
import React, { useState } from 'react'

export default function PredictionForm({ onCreated }: { onCreated: () => void }) {
  const [tipster, setTipster] = useState('')
  const [event, setEvent] = useState('')
  const [pick, setPick] = useState('')
  const [stake, setStake] = useState('')
  const [odds, setOdds] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/predictions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipster,
        event,
        pick,
        stake: Number(stake),
        odds: Number(odds)
      })
    })
    setLoading(false)
    setTipster('')
    setEvent('')
    setPick('')
    setStake('')
    setOdds('')
    onCreated()
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <input placeholder="tipster" value={tipster} onChange={e => setTipster(e.target.value)} required />
      <input placeholder="event" value={event} onChange={e => setEvent(e.target.value)} required />
      <input placeholder="pick" value={pick} onChange={e => setPick(e.target.value)} required />
      <input placeholder="stake" type="number" step="0.01" value={stake} onChange={e => setStake(e.target.value)} required />
      <input placeholder="odds" type="number" step="0.01" value={odds} onChange={e => setOdds(e.target.value)} required />
      <button type="submit" disabled={loading}>Add</button>
    </form>
  )
} 