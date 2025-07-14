import React from 'react'
import PredictionForm from '@/components/PredictionForm'
import PredictionList from '@/components/PredictionList'

export default function Home() {
  return (
    <main style={{ padding: 20 }}>
      <h1>VeriBet</h1>
      <PredictionForm onCreated={() => {}}
      />
      <hr />
      <PredictionList />
    </main>
  )
} 