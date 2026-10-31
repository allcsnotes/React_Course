import { useState } from 'react'

const names = ['React for Beginners', 'Python from Zero', 'DevOps Basics', 'SQL in Two Weeks']

export default function App() {
  const [, setTick] = useState(0)
  const refresh = () => setTick(t => t + 1)
  return (
    <main>
      <button onClick={refresh}>Refresh</button>
      <ul>
        {names.map(n => (
          <li key={Math.random()}>{n}</li>
        ))}
      </ul>
    </main>
  )
}
