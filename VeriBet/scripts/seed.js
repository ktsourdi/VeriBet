const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

function computeProfit(stake, odds, result) {
  if (result === 'WIN') return stake * (odds - 1)
  if (result === 'LOSS') return -stake
  return 0
}

async function main() {
  const tipsters = ['AlphaPicks', 'SharpEdge', 'ValueVault']
  const tipsterMap = {}
  for (const name of tipsters) {
    const t = await prisma.tipster.upsert({ where: { name }, create: { name }, update: {} })
    tipsterMap[name] = t
  }

  const samples = [
    { tipster: 'AlphaPicks', event: 'Team A vs Team B', pick: 'Team A ML', stake: 100, odds: 1.80, result: 'WIN' },
    { tipster: 'AlphaPicks', event: 'Fighter X vs Fighter Y', pick: 'Over 2.5', stake: 75, odds: 2.10, result: 'LOSS' },
    { tipster: 'SharpEdge', event: 'Club C vs Club D', pick: 'Draw', stake: 50, odds: 3.20, result: 'PENDING' },
    { tipster: 'SharpEdge', event: 'Club E vs Club F', pick: 'Club E -1.0', stake: 120, odds: 2.00, result: 'WIN' },
    { tipster: 'ValueVault', event: 'Player G vs Player H', pick: 'Player G +1.5 sets', stake: 60, odds: 1.95, result: 'LOSS' },
    { tipster: 'ValueVault', event: 'Team I vs Team J', pick: 'BTTS', stake: 80, odds: 1.85, result: 'WIN' }
  ]

  for (const s of samples) {
    const profit = computeProfit(s.stake, s.odds, s.result)
    await prisma.prediction.create({
      data: {
        tipsterId: tipsterMap[s.tipster].id,
        event: s.event,
        pick: s.pick,
        stake: s.stake,
        odds: s.odds,
        result: s.result,
        profit
      }
    })
  }

  console.log('Seeded:', samples.length, 'predictions across', tipsters.length, 'tipsters')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })