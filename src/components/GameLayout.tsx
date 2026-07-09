import type { ReactNode } from 'react'
import { useGame, TOTAL_MONTHS } from '../game/store'
import MetricBar from './MetricBar'

interface Props {
  children: ReactNode
}

function GameLayout({ children }: Props) {
  const month = useGame((s) => s.month)
  const metrics = useGame((s) => s.metrics)

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/60 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-bold text-amber-400">KüpAI</span>
          <span className="text-slate-500 text-sm"> · İşe Alım Uzmanı</span>
          <span className="ml-3 text-sm text-slate-300">
            Ay {month} / {TOTAL_MONTHS}
          </span>
        </div>
        <div className="flex flex-wrap gap-5">
          <MetricBar label="Şirket" value={metrics.company} />
          <MetricBar label="Ekip Morali" value={metrics.teamMorale} />
          <MetricBar label="Yönetim" value={metrics.management} />
        </div>
      </header>
      <main className="p-6 max-w-5xl mx-auto">{children}</main>
    </div>
  )
}

export default GameLayout
