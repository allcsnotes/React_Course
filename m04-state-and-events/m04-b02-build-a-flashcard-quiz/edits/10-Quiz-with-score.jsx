import { useState } from 'react'
import cards from '../data/cards'
import ScoreBar from './ScoreBar'
import Flashcard from './Flashcard'

function Quiz() {
  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState({
    points: 0,
    missed: 0,
  })

  return (
    <div className="quiz">
      <ScoreBar
        index={index}
        total={cards.length}
        score={score}
      />
      <Flashcard
        card={cards[index]}
        showAnswer={showAnswer}
        onFlip={() => setShowAnswer(true)}
      />
    </div>
  )
}

export default Quiz
