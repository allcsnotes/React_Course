function ScoreBar({ index, total, score }) {
  return (
    <div>
      <div className="bar">
        <span>{index + 1} of {total}</span>
        <span>{score.points} points</span>
        <span>{score.missed} to review</span>
      </div>
      <progress value={index + 1} max={total} />
    </div>
  )
}

export default ScoreBar
