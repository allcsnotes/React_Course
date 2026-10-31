function Controls({
  showAnswer,
  onKnew,
  onNotYet,
  onNext,
}) {
  return (
    <div className="controls">
      <button disabled={!showAnswer} onClick={onKnew}>
        I knew it
      </button>
      <button disabled={!showAnswer} onClick={onNotYet}>
        Not yet
      </button>
      <button className="plain" onClick={onNext}>
        Next card
      </button>
    </div>
  )
}

export default Controls
