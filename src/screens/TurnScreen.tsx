import { useState } from 'react'
import { useGame } from '../game/store'
import { ACTIONS } from '../data/actions'
import GameLayout from '../components/GameLayout'
import CandidateCard from '../components/CandidateCard'
import ActionButton from '../components/ActionButton'

function TurnScreen() {
  const position = useGame((s) => s.position)
  const candidates = useGame((s) => s.candidates)
  const reveals = useGame((s) => s.reveals)
  const actionsLeft = useGame((s) => s.actionsLeft)
  const useAction = useGame((s) => s.useAction)
  const hire = useGame((s) => s.hire)
  const skip = useGame((s) => s.skip)

  // Sadece bu ekranın derdi: hangi kart seçili? (store'a koymuyoruz)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Seçili adaya hangi aksiyonlar zaten uygulandı?
  const usedOnSelected = selectedId
    ? (reveals[selectedId] ?? []).map((r) => r.actionId)
    : []

  const selectedCandidate = candidates.find((c) => c.id === selectedId)

  return (
    <GameLayout>
      <div className="flex flex-col gap-6">
        {/* Pozisyon ve senaryo */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
          <h2 className="font-bold text-amber-400 text-lg">{position?.title}</h2>
          <p className="text-sm text-slate-400 mt-1">{position?.scenario}</p>
        </div>

        {/* Aday kartları */}
        <div className="grid gap-4 md:grid-cols-3">
          {candidates.map((c) => (
            <CandidateCard
              key={c.id}
              candidate={c}
              selected={selectedId === c.id}
              onSelect={() => setSelectedId(c.id)}
              reveals={reveals[c.id] ?? []}
            />
          ))}
        </div>

        {/* Aksiyon paneli */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-300">
              Araştırma Aksiyonları
            </span>
            <span className="text-slate-400">
              Kalan hak: <b className="text-amber-400">{actionsLeft}</b>
            </span>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {ACTIONS.map((a) => (
              <ActionButton
                key={a.id}
                label={a.label}
                description={a.description}
                disabled={
                  selectedId === null ||
                  actionsLeft <= 0 ||
                  usedOnSelected.includes(a.id)
                }
                onClick={() => selectedId && useAction(a.id, selectedId)}
              />
            ))}
          </div>

          <p className="text-xs text-slate-500">
            {selectedId === null
              ? 'Önce bir aday kartı seç, sonra aksiyon kullan.'
              : actionsLeft <= 0
                ? 'Aksiyon hakkın bitti. Artık karar vakti.'
                : 'Aksiyonlar seçili adaya uygulanır.'}
          </p>
        </div>

        {/* Karar */}
        <div className="flex justify-end gap-3">
          <button
            onClick={skip}
            className="px-5 py-2.5 rounded-lg border border-slate-600 text-slate-300
                       hover:bg-slate-800 transition-colors"
          >
            Kimseyi Alma
          </button>
          <button
            onClick={() => selectedId && hire(selectedId)}
            disabled={selectedId === null}
            className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400
                       text-slate-900 font-bold transition-colors
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {selectedCandidate ? `İşe Al: ${selectedCandidate.name}` : 'İşe Al'}
          </button>
        </div>
      </div>
    </GameLayout>
  )
}

export default TurnScreen
