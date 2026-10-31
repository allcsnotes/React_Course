import { useRef } from 'react'

const lessons = [
  'What React is', 'How a web page works', 'Setting up',
  'Your first app', 'let and const', 'Arrow functions',
  'Objects and arrays', 'map and filter', 'Components',
  'JSX rules', 'Props', 'Children',
]
const current = 8

function App() {
  const nowRef = useRef(null)

  function goNow() {
    nowRef.current.scrollIntoView({
      block: 'center',
    })
  }

  return (
    <div className="page">
      <ul className="lessons">
        {lessons.map((title, i) => (
          <li
            key={title}
            className={i === current ? 'now' : ''}
            ref={i === current ? nowRef : null}
          >
            {i + 1}. {title}
          </li>
        ))}
      </ul>
      <button onClick={goNow}>Go to current lesson</button>
    </div>
  )
}

export default App
