import { useGame, TOTAL_MONTHS } from '../game/store'
import GameLayout from '../components/GameLayout'
import MetricDelta from '../components/MetricDelta'

function OutcomeScreen() {
  const outcome = useGame((s) => s.lastOutcome)
  const nextMonth = useGame((s) => s.nextMonth)
  const month = useGame((s) => s.month)
  const fired = useGame((s) => s.fired)

  if (!outcome) return null // güvenlik: sonuç yokken bu ekran açılmamalı

  const isOver = fired || month >= TOTAL_MONTHS

  return (
    <GameLayout>
      <div className="max-w-xl mx-auto flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-amber-400">3 ay sonra...</h2>

        <p className="text-slate-300 leading-relaxed whitespace-pre-line">
          {outcome.narrative}
        </p>

        <div className="flex flex-col gap-2">
          <MetricDelta label="Şirket Performansı" delta={outcome.deltas.company ?? 0} />
          <MetricDelta label="Ekip Morali" delta={outcome.deltas.teamMorale ?? 0} />
          <MetricDelta label="Yönetim Memnuniyeti" delta={outcome.deltas.management ?? 0} />
        </div>

        {fired && (
          <p className="text-red-400 text-sm font-semibold">
            Bir metrik dibi gördü. Genel Müdür seni "kısa bir görüşmeye" çağırıyor...
          </p>
        )}

        <button
          onClick={nextMonth}
          className="self-end bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-6 py-2.5 rounded-lg"
        >
          {isOver ? 'Raporu Gör →' : 'Sonraki Ay →'}
        </button>
      </div>
    </GameLayout>
  )
}

export default OutcomeScreen
