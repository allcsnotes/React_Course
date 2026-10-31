import cards from './data/cards'
import Flashcard from './components/Flashcard'

function App() {
  return (
    <Flashcard
      card={cards[0]}
      showAnswer={true}
      onFlip={() => {}}
    />
  )
}

export default App
