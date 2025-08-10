import type { Metadata } from 'next'
import React from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'VeriBet',
  description: 'Generated with Next.js'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav style={{ padding: 12, borderBottom: '1px solid #eee', display: 'flex', gap: 12 }}>
          <a href="/">Home</a>
          <a href="/analytics">Analytics</a>
        </nav>
        {children}
      </body>
    </html>
  )
} 