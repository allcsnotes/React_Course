import { useState } from 'react'

export default function Ex10() {
  const [wrong, setWrong] = useState(0)
  const [right, setRight] = useState(0)

  function addThreeWrong() {
    setWrong(wrong + 1)
    setWrong(wrong + 1)
    setWrong(wrong + 1)
  }

  function addThreeRight() {
    setRight((n) => n + 1)
    setRight((n) => n + 1)
    setRight((n) => n + 1)
  }

  return (
    <div className="card">
      <p>Wrong way: {wrong}</p>
      <button onClick={addThreeWrong}>Add 3 (wrong way)</button>
      <p>Updater way: {right}</p>
      <button onClick={addThreeRight}>Add 3 (updater way)</button>
    </div>
  )
}
