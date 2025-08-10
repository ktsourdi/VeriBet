import { NextResponse } from 'next/server'

export async function GET() {
  const body = `User-agent: *\nAllow: /\n` 
  return new NextResponse(body, { headers: { 'Content-Type': 'text/plain' } })
}