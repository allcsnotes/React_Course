import { useState } from 'react'

const levels = ['Beginner', 'Medium', 'Advanced']

function App() {
  const [level, setLevel] = useState('Beginner')

  return (
    <div className="page">
      {levels.map(l => (
        <label className="row" key={l}>
          <input
            type="radio"
            name="level"
            value={l}
            checked={level === l}
            onChange={e => setLevel(e.target.value)}
          />
          {l}
        </label>
      ))}
      <p className="out">Your level: {level}</p>
    </div>
  )
}

export default App
