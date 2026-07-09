import { useGame, TOTAL_MONTHS } from '../game/store'
import { pickEnding } from '../data/endings'
import MetricBar from '../components/MetricBar'

function FinalReport() {
  const metrics = useGame((s) => s.metrics)
  const fired = useGame((s) => s.fired)
  const hireHistory = useGame((s) => s.hireHistory)
  const startGame = useGame((s) => s.startGame)
  const toMenu = useGame((s) => s.toMenu)

  const ending = pickEnding({
    metrics,
    fired,
    hires: hireHistory.map((h) => h.archetype),
    skips: hireHistory.filter((h) => h.candidateName === null).length,
  })

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8 flex justify-center">
      <div className="max-w-xl w-full flex flex-col gap-8">
        {/* Unvan */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            — Kariyer Raporu —
          </p>
          <h1 className="text-4xl font-bold text-amber-400 mt-3">{ending.title}</h1>
          <p className="text-slate-400 mt-4 leading-relaxed">{ending.description}</p>
          <p className="text-sm text-slate-500 mt-3">
            {fired
              ? `${hireHistory.length}. ayda gönderildin.`
              : `${TOTAL_MONTHS} ayı tamamladın. Bu sektörde buna emeklilik denir.`}
          </p>
        </div>

        {/* Son metrikler */}
        <div className="flex justify-center gap-6 flex-wrap">
          <MetricBar label="Şirket" value={metrics.company} />
          <MetricBar label="Ekip Morali" value={metrics.teamMorale} />
          <MetricBar label="Yönetim" value={metrics.management} />
        </div>

        {/* İşe alım geçmişi */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-slate-300 mb-2">
            İşe Alım Geçmişin
          </h2>
          <ul className="flex flex-col gap-1">
            {hireHistory.map((h) => (
              <li key={h.month} className="text-sm text-slate-400">
                Ay {h.month}:{' '}
                {h.candidateName ?? (
                  <span className="italic">kimse alınmadı</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Butonlar */}
        <div className="flex justify-center gap-3">
          <button
            onClick={toMenu}
            className="px-5 py-2.5 rounded-lg border border-slate-600 text-slate-300
                       hover:bg-slate-800 transition-colors"
          >
            Ana Menü
          </button>
          <button
            onClick={startGame}
            className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400
                       text-slate-900 font-bold transition-colors"
          >
            Tekrar Oyna
          </button>
        </div>
      </div>
    </div>
  )
}

export default FinalReport
