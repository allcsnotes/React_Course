import { useState } from 'react'

const questions = [
  { id: 1, text: 'What does useState give you?', options: ['A memory for the component', 'A new HTML tag', 'A CSS file'], answer: 0 },
  { id: 2, text: 'Which prop does React need on every list row?', options: ['id', 'key', 'name'], answer: 1 },
  { id: 3, text: 'What must onSubmit call to stop the page reloading?', options: ['e.preventDefault()', 'setState()', 'map()'], answer: 0 },
]

export default function Ex25() {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)

  if (index === questions.length) {
    return (
      <div className="card">
        <h2>
          Priya scored {score} of {questions.length}
        </h2>
        <button
          onClick={() => {
            setIndex(0)
            setPicked(null)
            setScore(0)
          }}
        >
          Restart
        </button>
      </div>
    )
  }

  const q = questions[index]

  function pick(i) {
    if (picked !== null) return
    setPicked(i)
    if (i === q.answer) setScore((s) => s + 1)
  }

  function next() {
    setIndex(index + 1)
    setPicked(null)
  }

  return (
    <div className="card">
      <p>
        Question {index + 1} of {questions.length}
      </p>
      <h3>{q.text}</h3>
      {q.options.map((o, i) => (
        <button key={o} disabled={picked !== null} className={picked === i ? 'on' : ''} onClick={() => pick(i)}>
          {o}
        </button>
      ))}
      {picked !== null && (
        <div>
          <p className={picked === q.answer ? 'ok' : 'error'}>
            {picked === q.answer ? 'Correct!' : 'Not quite. The answer is: ' + q.options[q.answer]}
          </p>
          <button onClick={next}>{index === questions.length - 1 ? 'See result' : 'Next question'}</button>
        </div>
      )}
      <p>Score: {score}</p>
    </div>
  )
}
