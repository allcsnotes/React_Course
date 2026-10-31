function Flashcard({ card, showAnswer, onFlip }) {
  return (
    <div className="flash">
      <small>
        {showAnswer ? 'ANSWER' : 'QUESTION'}
      </small>
      <h2>
        {showAnswer ? card.answer : card.question}
      </h2>
      {!showAnswer && (
        <button onClick={onFlip}>
          Show answer
        </button>
      )}
    </div>
  )
}

export default Flashcard
