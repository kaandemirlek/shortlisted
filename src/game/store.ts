import { create } from 'zustand'
import type { GameState, Position, Candidate, ActionId } from './types'
import { pick, pickMany } from './random'
import { CANDIDATES } from '../data/candidates'
import { POSITIONS } from '../data/positions'
import { ACTIONS } from '../data/actions'
import { scoreHire, scoreSkip, applyDeltas } from './scoring'

export const TOTAL_MONTHS = 6
export const ACTIONS_PER_TURN = 2

const START_METRICS = { company: 60, teamMorale: 60, management: 60 }

/**
 * Yeni bir tur kurar: rastgele pozisyon + 3 aday.
 * Daha önce gösterilmemiş adaylara öncelik verir; havuz biterse eskiler döner.
 */
function newTurn(
  usedIds: string[],
): Pick<GameState, 'position' | 'candidates' | 'actionsLeft' | 'reveals'> {
  const position: Position = pick(POSITIONS)
  const inPosition = CANDIDATES.filter((c) => c.positionId === position.id)
  const fresh: Candidate[] = inPosition.filter((c) => !usedIds.includes(c.id))
  const seen: Candidate[] = inPosition.filter((c) => usedIds.includes(c.id))

  const candidates = [
    ...pickMany(fresh, 3),
    ...pickMany(seen, Math.max(0, 3 - fresh.length)),
  ]

  return { position, candidates, actionsLeft: ACTIONS_PER_TURN, reveals: {} }
}

/** GameState (veri) + oyuncu eylemleri (fonksiyonlar) */
interface GameStore extends GameState {
  startGame: () => void
  useAction: (actionId: ActionId, candidateId: string) => void
  hire: (candidateId: string) => void
  skip: () => void
  nextMonth: () => void
  toMenu: () => void
}

/** Metriklerden biri dibi gördü mü? */
function isFired(m: GameState['metrics']): boolean {
  return m.company <= 0 || m.teamMorale <= 0 || m.management <= 0
}

export const useGame = create<GameStore>((set) => ({
  // --- başlangıç durumu ---
  screen: 'menu',
  month: 0,
  metrics: START_METRICS,
  position: null,
  candidates: [],
  actionsLeft: 0,
  reveals: {},
  lastOutcome: null,
  hireHistory: [],
  usedCandidateIds: [],
  fired: false,

  // --- eylemler ---
  startGame: () => {
    const turn = newTurn([])
    set({
      screen: 'turn',
      month: 1,
      metrics: START_METRICS,
      lastOutcome: null,
      hireHistory: [],
      fired: false,
      ...turn,
      usedCandidateIds: turn.candidates.map((c) => c.id),
    })
  },

  useAction: (actionId, candidateId) =>
    set((state) => {
      const action = ACTIONS.find((a) => a.id === actionId)
      const candidate = state.candidates.find((c) => c.id === candidateId)
      if (!action || !candidate || state.actionsLeft <= 0) return state

      const existing = state.reveals[candidateId] ?? []
      // Aynı aksiyon aynı adaya ikinci kez uygulanamaz (puan çöpe gitmesin)
      if (existing.some((r) => r.actionId === actionId)) return state

      return {
        actionsLeft: state.actionsLeft - 1,
        reveals: {
          ...state.reveals,
          [candidateId]: [...existing, { actionId, text: action.reveal(candidate) }],
        },
      }
    }),

  hire: (candidateId) =>
    set((state) => {
      const candidate = state.candidates.find((c) => c.id === candidateId)
      if (!candidate) return state
      const outcome = scoreHire(candidate)
      const metrics = applyDeltas(state.metrics, outcome.deltas)
      return {
        screen: 'outcome',
        lastOutcome: outcome,
        metrics,
        fired: isFired(metrics),
        hireHistory: [
          ...state.hireHistory,
          {
            month: state.month,
            candidateName: candidate.name,
            archetype: candidate.archetype,
          },
        ],
      }
    }),

  skip: () =>
    set((state) => {
      const outcome = scoreSkip()
      const metrics = applyDeltas(state.metrics, outcome.deltas)
      return {
        screen: 'outcome',
        lastOutcome: outcome,
        metrics,
        fired: isFired(metrics),
        hireHistory: [
          ...state.hireHistory,
          { month: state.month, candidateName: null, archetype: null },
        ],
      }
    }),

  nextMonth: () =>
    set((state) => {
      if (state.fired || state.month >= TOTAL_MONTHS) return { screen: 'final' }
      const turn = newTurn(state.usedCandidateIds)
      return {
        screen: 'turn',
        month: state.month + 1,
        ...turn,
        usedCandidateIds: [
          ...state.usedCandidateIds,
          ...turn.candidates.map((c) => c.id),
        ],
      }
    }),

  toMenu: () => set({ screen: 'menu' }),
}))
