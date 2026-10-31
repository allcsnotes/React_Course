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
  const done = index >= cards.length

  function goNext() {
    setIndex(i => i + 1)
    setShowAnswer(false)
  }

  function handleKnew() {
    setScore(s => ({ ...s, points: s.points + 1 }))
    if (card.hard) {
      setScore(s => ({ ...s, points: s.points + 1 }))
    }
    goNext()
  }

  function handleNotYet() {
    setScore(s => ({ ...s, missed: s.missed + 1 }))
    goNext()
  }

  function restart() {
    setIndex(0)
    setShowAnswer(false)
    setScore({ points: 0, missed: 0 })
  }

  return (
    <div className="quiz">
      {done ? (
        <div className="done">
          <h2>All done!</h2>
          <p>Points: {score.points}</p>
          <p>To review: {score.missed}</p>
          <button onClick={restart}>Start again</button>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  )
}

export default Quiz
