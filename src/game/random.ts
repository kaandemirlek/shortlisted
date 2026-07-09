/** Diziden rastgele tek eleman seçer */
export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** Diziyi kopyalayıp karıştırır (orijinale dokunmaz) */
export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** Diziden tekrarsız n eleman seçer */
export function pickMany<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n)
}

/** p olasılıkla true döner (0-1 arası) */
export function chance(p: number): boolean {
  return Math.random() < p
}
