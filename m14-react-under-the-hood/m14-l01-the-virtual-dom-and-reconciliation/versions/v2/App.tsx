import { useState } from 'react'
import { Shelf } from './Shelf'

export default function App() {
  const [sale, setSale] = useState(false)
  const [hot, setHot] = useState(false)
  const [big, setBig] = useState(false)
  const [, setTick] = useState(0)
  const redraw = () => setTick(t => t + 1)
  return (
    <main>
      <h1>Course shelf</h1>
      <nav>
        <button onClick={() => setSale(!sale)}>Sale</button>
        <button onClick={() => setHot(!hot)}>Hot</button>
        <button onClick={() => setBig(!big)}>Big</button>
        <button onClick={redraw}>Redraw</button>
      </nav>
      <Shelf sale={sale} hot={hot} big={big} />
    </main>
  )
}
