// Oyunun "sözlüğü": tüm veri şekilleri burada tanımlı.
// Veri dosyaları (src/data/*) ve oyun mantığı bu tiplere uymak zorunda.

export type SalaryLevel = 'düşük' | 'orta' | 'yüksek'

export type Archetype =
  | 'sessiz-dahi'
  | 'cv-sisiren'
  | 'referansli'
  | 'jargoncu'
  | 'pahali-ama-iyi'
  | 'ogrenmeye-acik'
  | 'mulakatta-parlayan-bos'
  | 'linkedin-fenomeni'

export const ARCHETYPE_LABELS: Record<Archetype, string> = {
  'sessiz-dahi': 'Sessiz Dahi',
  'cv-sisiren': 'CV Şişiren',
  'referansli': 'Referanslı Aday',
  'jargoncu': 'Kurumsal Jargoncu',
  'pahali-ama-iyi': 'Pahalı Ama İyi',
  'ogrenmeye-acik': 'Öğrenmeye Açık',
  'mulakatta-parlayan-bos': 'Mülakatta Parlayan',
  'linkedin-fenomeni': 'LinkedIn Fenomeni',
}

/** Oyuncunun kart üzerinde her zaman gördüğü bilgiler */
export interface CandidateVisible {
  id: string
  name: string
  positionId: string
  archetype: Archetype
  cvStrength: number // 0-100
  salary: SalaryLevel
  firstImpression: string
  apparentSkill: number // 0-100, mülakatta göründüğü kadarı
}

/** Sadece aksiyonlarla açığa çıkan gerçekler */
export interface CandidateHidden {
  realSkill: number // apparentSkill'den çok farklı olabilir
  teamFit: number
  learningSpeed: number
  ego: number
  dramaRisk: number
  fakeCv: boolean
  leaveRisk: number
  quirk?: string // gizli trait cümlesi
}

export interface Candidate extends CandidateVisible {
  hidden: CandidateHidden
}

export type ActionId = 'teknik-test' | 'referans' | 'ekip-lideri' | 'tekrar-mulakat'

/** Bir aksiyonun bir aday hakkında açığa çıkardığı tek bilgi */
export interface RevealEntry {
  actionId: ActionId
  text: string
}

/** Aksiyon = data: hangi gizli bilgiden nasıl bir cümle üreteceği */
export interface GameActionDef {
  id: ActionId
  label: string
  description: string
  reveal: (c: Candidate) => string
}

export interface Metrics {
  company: number // Şirket Performansı 0-100
  teamMorale: number // Ekip Morali 0-100
  management: number // Yönetim Memnuniyeti 0-100
}

export interface Position {
  id: string
  title: string
  scenario: string
}

export interface Outcome {
  narrative: string
  deltas: Partial<Metrics>
}

export type Screen = 'menu' | 'turn' | 'outcome' | 'final'

export interface GameState {
  screen: Screen
  month: number // 1'den başlar
  metrics: Metrics
  position: Position | null
  candidates: Candidate[]
  actionsLeft: number
  /** aday id -> o aday için açığa çıkan bilgiler */
  reveals: Record<string, RevealEntry[]>
  lastOutcome: Outcome | null
  hireHistory: HireRecord[]
  /** şimdiye kadar aday havuzundan gösterilen adaylar (tekrar önleme) */
  usedCandidateIds: string[]
  /** bir metrik 0'a düştü, oyuncu kovuldu */
  fired: boolean
}

export interface HireRecord {
  month: number
  candidateName: string | null // null = kimse alınmadı
  archetype: Archetype | null
}
