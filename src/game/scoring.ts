import type { Candidate, Metrics, Outcome } from './types'
import { pick } from './random'
import * as T from '../data/outcomes'

// Saf fonksiyonlar: state'e dokunmaz, aday alır Outcome döner.
// Denge ayarı yapmak istediğinde tek bakılacak yer burası.

/** İşe alım kararının sonucunu hesaplar */
export function scoreHire(candidate: Candidate): Outcome {
  const h = candidate.hidden

  // Şirket performansı: gerçek yetenek + öğrenme hızı - maaş yükü
  let company = Math.round((h.realSkill - 55) / 4)
  if (h.learningSpeed >= 80) company += 3
  if (candidate.salary === 'yüksek') company -= 4
  if (candidate.salary === 'düşük') company += 2
  if (h.fakeCv) company -= 4 // foyası çıkınca kaybedilen zaman

  // Ekip morali: uyum + saygı - ego - drama - torpil kokusu
  let teamMorale = Math.round((h.teamFit - 55) / 4)
  if (h.ego >= 70) teamMorale -= 4
  if (h.dramaRisk >= 50) teamMorale -= 4
  if (h.realSkill >= 80) teamMorale += 2
  if (candidate.archetype === 'referansli') teamMorale -= 4

  // Yönetim memnuniyeti: torpil + görünür sonuç - bütçe - skandal
  let management = 0
  if (candidate.archetype === 'referansli') management += 10
  if (h.realSkill >= 75) management += 4
  if (h.realSkill < 45) management -= 5
  if (candidate.salary === 'yüksek') management -= 4
  if (h.fakeCv) management -= 3

  return {
    narrative: buildHireNarrative(candidate),
    deltas: { company, teamMorale, management },
  }
}

/** "Kimseyi alma" kararının sonucu */
export function scoreSkip(): Outcome {
  return {
    narrative: pick(T.SKIP_OUTCOMES),
    deltas: { company: -8, teamMorale: +3, management: -6 },
  }
}

/** Değişimleri metriklere uygular, 0-100 aralığına sabitler */
export function applyDeltas(m: Metrics, d: Partial<Metrics>): Metrics {
  const clamp = (n: number) => Math.max(0, Math.min(100, n))
  return {
    company: clamp(m.company + (d.company ?? 0)),
    teamMorale: clamp(m.teamMorale + (d.teamMorale ?? 0)),
    management: clamp(m.management + (d.management ?? 0)),
  }
}

/** Adayın gizli özelliklerinden 2-4 cümlelik anlatı kurar */
function buildHireNarrative(c: Candidate): string {
  const h = c.hidden
  const parts: string[] = [`${c.name} işe alındı.`]

  parts.push(
    pick(h.realSkill >= 75 ? T.SKILL_HIGH : h.realSkill >= 45 ? T.SKILL_MID : T.SKILL_LOW),
  )

  // Sosyal cephede en çarpıcı tek şeyi anlat (öncelik sırasıyla)
  if (h.fakeCv) parts.push(pick(T.FAKE_CV))
  else if (h.dramaRisk >= 50) parts.push(pick(T.DRAMA_HIGH))
  else if (h.ego >= 70) parts.push(pick(T.EGO_HIGH))
  else if (c.archetype === 'referansli') parts.push(pick(T.REFERANSLI_HIRED))
  else if (h.teamFit >= 70) parts.push(pick(T.TEAM_FIT_HIGH))
  else if (h.teamFit < 50) parts.push(pick(T.TEAM_FIT_LOW))

  if (h.learningSpeed >= 85) parts.push(pick(T.LEARNING_FAST))
  if (c.salary === 'yüksek') parts.push(pick(T.SALARY_HIGH_NOTE))

  return parts.join('\n\n')
}
