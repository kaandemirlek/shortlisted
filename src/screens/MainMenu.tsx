import { useGame } from '../game/store'

function MainMenu() {
  const startGame = useGame((s) => s.startGame)

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-5xl font-bold text-slate-100">Mülakat Odası</h1>
      <p className="text-slate-400 italic text-center max-w-md">
        "İnsan kaynakları, insandan ve kaynaktan tasarruf sanatıdır."
      </p>
      <p className="text-slate-500 text-sm text-center max-w-md">
        KüpAI'de İşe Alım Uzmanısın. 6 ay boyunca doğru (ya da politik olarak
        doğru) insanları işe al. Şirketi batırma, ekibi kaçırma, yönetimi kızdırma.
        Kolaysa.
      </p>
      <button
        onClick={startGame}
        className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-3 rounded-lg text-lg"
      >
        Kariyere Başla
      </button>
    </div>
  )
}

export default MainMenu
