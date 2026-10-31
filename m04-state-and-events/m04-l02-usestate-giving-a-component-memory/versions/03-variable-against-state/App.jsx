import { useState } from 'react'

export default function App() {
  let plain = 0
  const [saved, setSaved] = useState(0)

  function handleClick() {
    plain = plain + 1
    setSaved(saved + 1)
  }

  return (
    <div className="counter">
      <p>Normal variable: {plain}</p>
      <p>State: {saved}</p>
      <button onClick={handleClick}>
        Add one
      </button>
    </div>
  )
}
