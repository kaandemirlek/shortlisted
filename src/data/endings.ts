import type { Archetype, Metrics } from '../game/types'

// Final unvanları. Liste ÖNCELİK SIRALIDIR: yukarıdan aşağı taranır,
// ilk eşleşen kazanır. En alttaki her zaman eşleşir (varsayılan).
// Yeni unvan eklemek = doğru önceliğe bir kayıt eklemek.

export interface EndingContext {
  metrics: Metrics
  fired: boolean
  /** işe alınanların arketipleri (null = o ay kimse alınmadı) */
  hires: (Archetype | null)[]
  skips: number
}

export interface Ending {
  id: string
  title: string
  description: string
  matches: (ctx: EndingContext) => boolean
}

const torpilCount = (ctx: EndingContext) =>
  ctx.hires.filter((a) => a === 'referansli').length

export const ENDINGS: Ending[] = [
  // --- Kovulma sonları ---
  {
    id: 'yonetim-sevdi',
    title: 'Yönetim Sevdi, Ekip Nefret Etti',
    description:
      'Üst kat seni alkışlarken alt kat toplu istifa dilekçesi hazırladı. Çıkarken kimse asansörü tutmadı.',
    matches: (ctx) => ctx.fired && ctx.metrics.teamMorale <= 0,
  },
  {
    id: 'sessizce-kovuldun',
    title: 'Sessizce Kovuldun',
    description:
      'Bir sabah kartın turnikede çalışmadı. İK\'cıyı İK\'ya çağırdılar; toplantı odasında sadece sen vardın.',
    matches: (ctx) => ctx.fired && ctx.metrics.management <= 0,
  },
  {
    id: 'kucultme-kurbani',
    title: 'Küçülmenin İlk Kurbanı',
    description:
      'İşe alımların şirketi "yeniden yapılanmaya" götürdü. İlk yeniden yapılanan sen oldun.',
    matches: (ctx) => ctx.fired,
  },

  // --- Hayatta kalma sonları ---
  {
    id: 'torpil-imparatorlugu',
    title: 'Torpil İmparatorluğu',
    description:
      'Organizasyon şeması artık bir soy ağacına benziyor. CEO seni düğünlere davet ediyor.',
    matches: (ctx) => torpilCount(ctx) >= 2,
  },
  {
    id: 'ceonun-prensi',
    title: "CEO'nun Prensi",
    description:
      'Doğru insanları değil, doğru kişilerin insanlarını işe aldın. Terfi yakın, saygı uzak.',
    matches: (ctx) => torpilCount(ctx) >= 1 && ctx.metrics.management >= 70,
  },
  {
    id: 'kurumsal-denge',
    title: 'Kurumsal Denge Ustası',
    description:
      'Herkes az mutlu, kimse çok mutsuz. Kurumsal hayatta buna "başarı" denir.',
    matches: (ctx) =>
      ctx.metrics.company >= 65 &&
      ctx.metrics.teamMorale >= 65 &&
      ctx.metrics.management >= 65,
  },
  {
    id: 'butce-celladi',
    title: 'Bütçe Celladı',
    description:
      '6 ayda neredeyse kimseyi işe almadın. CFO seni çok seviyor. Başka kimse sevmiyor.',
    matches: (ctx) => ctx.skips >= 3,
  },
  {
    id: 'herkesi-memnun',
    title: 'Herkesi Memnun Ettin, Kendini Bitirdin',
    description:
      'Ekip mutlu, yönetim mutlu. Şirket mi? O da bir gün düzelir. Sen önce bir uyu.',
    matches: (ctx) =>
      ctx.metrics.teamMorale >= 70 &&
      ctx.metrics.management >= 65 &&
      ctx.metrics.company < 50,
  },
  {
    id: 'sirket-buyudu',
    title: 'Şirket Büyüdü, Ruhun Küçüldü',
    description:
      'Metrikler harika. Uyku düzenin ve vicdanın için aynı şey söylenemez.',
    matches: (ctx) => ctx.metrics.company >= 72 && ctx.metrics.teamMorale < 45,
  },
  {
    id: 'torpil-savar',
    title: 'Torpil Savar',
    description:
      'Bütün referanslı adayları eledin. Etik puanın tavan; telefonun artık hiç çalmıyor.',
    matches: (ctx) => torpilCount(ctx) === 0 && ctx.metrics.management < 50,
  },
  {
    id: 'vicdanli-terfisiz',
    title: 'Vicdanlı Ama Terfisiz',
    description:
      'Doğru şeyleri yaptın. Kimse fark etmedi. LinkedIn\'e "yeni maceralara açığım" yazmanın vakti gelmiş olabilir.',
    matches: () => true, // varsayılan — her zaman en sonda kalmalı
  },
]

export function pickEnding(ctx: EndingContext): Ending {
  return ENDINGS.find((e) => e.matches(ctx)) ?? ENDINGS[ENDINGS.length - 1]
}
