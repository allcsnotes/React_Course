import { useState } from 'react'
import { courses } from './data'

export default function App() {
  const [state, setState] = useState({ status: 'loading' })
  const loaded = () => setState({ status: 'success', courses })
  return (
    <main className="one">
      <button onClick={loaded}>success</button>
      <p>{state.status}</p>
    </main>
  )
}
