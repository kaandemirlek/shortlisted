import type { Candidate, RevealEntry } from '../game/types'
import { ARCHETYPE_LABELS } from '../game/types'

const SALARY_LABELS = { düşük: '₺', orta: '₺₺', yüksek: '₺₺₺' } as const

interface Props {
  candidate: Candidate
  selected: boolean
  onSelect: () => void
  /** aksiyonlarla açığa çıkan bilgiler */
  reveals: RevealEntry[]
}

function CandidateCard({ candidate, selected, onSelect, reveals }: Props) {
  return (
    <button
      onClick={onSelect}
      className={`text-left bg-slate-800 rounded-xl p-4 border-2 transition-colors flex flex-col gap-2 ${
        selected
          ? 'border-amber-400 bg-slate-800'
          : 'border-transparent hover:border-slate-600'
      }`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-bold text-lg">{candidate.name}</span>
        <span className="text-amber-400/90 font-semibold text-sm shrink-0">
          {SALARY_LABELS[candidate.salary]}
        </span>
      </div>

      <span className="text-xs uppercase tracking-wide text-slate-400">
        {ARCHETYPE_LABELS[candidate.archetype]}
      </span>

      <div className="flex gap-4 text-sm text-slate-300">
        <span>
          CV <b>{candidate.cvStrength}</b>
        </span>
        <span>
          Mülakat izlenimi <b>{candidate.apparentSkill}</b>
        </span>
      </div>

      <p className="text-sm text-slate-400 italic">"{candidate.firstImpression}"</p>

      {reveals.length > 0 && (
        <ul className="mt-1 border-t border-slate-700 pt-2 flex flex-col gap-1">
          {reveals.map((r) => (
            <li key={r.actionId} className="text-sm text-sky-300">
              🔍 {r.text}
            </li>
          ))}
        </ul>
      )}
    </button>
  )
}

export default CandidateCard
