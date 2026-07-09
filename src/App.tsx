import { useGame } from './game/store'
import MainMenu from './screens/MainMenu'
import TurnScreen from './screens/TurnScreen'
import OutcomeScreen from './screens/OutcomeScreen'
import FinalReport from './screens/FinalReport'

function App() {
  const screen = useGame((s) => s.screen)

  switch (screen) {
    case 'menu':
      return <MainMenu />
    case 'turn':
      return <TurnScreen />
    case 'outcome':
      return <OutcomeScreen />
    case 'final':
      return <FinalReport />
  }
}

export default App
