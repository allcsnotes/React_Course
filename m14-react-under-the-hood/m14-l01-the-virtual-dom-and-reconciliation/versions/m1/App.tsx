import { useState } from 'react'

export default function App() {
  const [seats, setSeats] = useState(1)
  const add = () => setSeats(seats + 1)
  return (
    <main>
      <p id="seats" className="note">Seats left: {seats}</p>
      <button onClick={add}>Add a seat</button>
    </main>
  )
}
