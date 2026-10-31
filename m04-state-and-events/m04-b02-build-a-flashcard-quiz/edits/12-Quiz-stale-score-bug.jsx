import { useState } from 'react'
import cards from '../data/cards'
import ScoreBar from './ScoreBar'
import Flashcard from './Flashcard'
import Controls from './Controls'

function Quiz() {
  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState({
    points: 0,
    missed: 0,
  })

  const card = cards[index]

  function goNext() {
    setIndex(i => i + 1)
    setShowAnswer(false)
  }

  function handleKnew() {
    setScore({ ...score, points: score.points + 1 })
    if (card.hard) {
      setScore({ ...score, points: score.points + 1 })
    }
    goNext()
  }

  function handleNotYet() {
    setScore({ ...score, missed: score.missed + 1 })
    goNext()
  }

  return (
    <div className="quiz">
      <ScoreBar
        index={index}
        total={cards.length}
        score={score}
      />
      <Flashcard
        card={card}
        showAnswer={showAnswer}
        onFlip={() => setShowAnswer(true)}
      />
      <Controls
        showAnswer={showAnswer}
        onKnew={handleKnew}
        onNotYet={handleNotYet}
        onNext={goNext}
      />
    </div>
  )
}

export default Quiz
