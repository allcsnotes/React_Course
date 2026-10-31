import { useState } from 'react'
import cards from '../data/cards'
import Flashcard from './Flashcard'

function Quiz() {
  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  return (
    <div className="quiz">
      <Flashcard
        card={cards[index]}
        showAnswer={showAnswer}
        onFlip={() => setShowAnswer(true)}
      />
    </div>
  )
}

export default Quiz
