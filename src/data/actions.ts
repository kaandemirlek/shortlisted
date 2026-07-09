import type { GameActionDef } from '../game/types'

// Her aksiyon farklı gizli bilgiye bakar ve sayı değil, yoruma açık
// (ve mümkünse komik) bir cümle döndürür. Yeni aksiyon eklemek = buraya
// bir kayıt eklemek; engine'e ve UI'a dokunmak gerekmez.

export const ACTIONS: GameActionDef[] = [
  {
    id: 'teknik-test',
    label: 'Teknik Test',
    description: 'Gerçek yetenek seviyesini ölçer. CV ile çelişirse anlarsın.',
    reveal: (c) => {
      const s = c.hidden.realSkill
      const base =
        s >= 80
          ? 'Test sonucu: beklenenin çok üstünde. Ekipteki bazı kişilerden bile iyi.'
          : s >= 60
            ? 'Test sonucu: sağlam. İşini yapar, kimseyi şaşırtmaz.'
            : s >= 40
              ? 'Test sonucu: idare eder. Başında biri olursa çalışır.'
              : 'Test sonucu: felaket. Soruların yarısı boş, birinde "bunu ChatGPT bilir" yazıyor.'
      return c.hidden.fakeCv && s < 60
        ? `${base} CV'deki deneyimle bu sonuç pek örtüşmüyor...`
        : base
    },
  },
  {
    id: 'referans',
    label: 'Referans Kontrolü',
    description: 'Eski şirketini arar. Bazen çok şey öğrenirsin, bazen sessizlik.',
    reveal: (c) => {
      if (c.hidden.fakeCv)
        return 'Eski şirketi arandı: "O proje mi? Öyle bir projede hiç çalışmadı ki." CV\'de ciddi şişirme var.'
      if (c.hidden.dramaRisk >= 50)
        return 'Referansı önce övdü, sonra "ama biraz... olaylı biriydi" deyip sustu. Sessizlik uzundu.'
      if (c.hidden.dramaRisk >= 25)
        return 'Referanslar olumlu ama araya "bazen ortamı gerebiliyor" notu sıkıştırıldı.'
      return 'Referanslar tertemiz. "Keşke gitmeseydi" diyen bile oldu.'
    },
  },
  {
    id: 'ekip-lideri',
    label: 'Ekip Liderine Danış',
    description: 'Ekip uyumu ve ego hakkında birinci elden fikir.',
    reveal: (c) => {
      const fit = c.hidden.teamFit
      const ego = c.hidden.ego
      if (fit >= 70 && ego < 50)
        return 'Ekip lideri: "Bu insanla çalışırım. Hatta dünden razıyım."'
      if (fit >= 70)
        return 'Ekip lideri: "Uyum sağlar ama egosunu resepsiyonda bırakması şartıyla."'
      if (ego >= 70)
        return 'Ekip lideri: "Mülakatta bana yöneticiliği anlattı. Endişeliyim."'
      if (fit >= 50)
        return 'Ekip lideri: "Fena değil ama ekibe karışır mı bilemedim." Omuz silkti.'
      return 'Ekip lideri: "İçime sinmedi ama sen bilirsin." (Bu cümleyi sana daha sonra hatırlatacak.)'
    },
  },
  {
    id: 'tekrar-mulakat',
    label: 'Tekrar Mülakata Çağır',
    description: 'İkinci görüşmede maskeler düşer. Genelde.',
    reveal: (c) => {
      if (c.hidden.quirk) return `İkinci görüşmede ağzından kaçtı: ${c.hidden.quirk}`
      const l = c.hidden.leaveRisk
      if (l >= 40)
        return 'İkinci görüşmede iki kez "diğer süreçlerim de var" dedi. Mesaj alındı.'
      return 'İkinci görüşme sakin geçti. İlk izlenim neyse aşağı yukarı o.'
    },
  },
]
