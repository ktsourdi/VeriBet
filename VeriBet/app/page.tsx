"use client"

import React from 'react'
import PredictionForm from '@/components/PredictionForm'
import PredictionList from '@/components/PredictionList'

export default function Home() {
  const [refreshSignal, setRefreshSignal] = React.useState(0)
  return (
    <main style={{ padding: 20 }}>
      <h1>VeriBet</h1>
      <PredictionForm onCreated={() => setRefreshSignal(s => s + 1)} />
      <hr />
      <PredictionList refreshSignal={refreshSignal} />
    </main>
  )
} 