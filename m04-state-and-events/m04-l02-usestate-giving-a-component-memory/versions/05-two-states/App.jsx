import { useState } from 'react'

export default function App() {
  const [watched, setWatched] = useState(0)
  const [saved, setSaved] = useState(false)

  function watchOne() {
    setWatched(watched + 1)
  }

  function toggleSave() {
    setSaved(!saved)
  }

  return (
    <div className="counter">
      <h2>React for Beginners</h2>
      <p>Lessons watched: {watched}</p>
      <p>{saved ? 'Saved for later' : 'Not saved'}</p>
      <div className="row">
        <button onClick={watchOne}>Watched one</button>
        <button onClick={toggleSave}>
          {saved ? 'Unsave' : 'Save'}
        </button>
      </div>
    </div>
  )
}
