import { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    console.log('effect: start a timer')
    setInterval(
      () => setSeconds(s => s + 1),
      1000
    )
  }, [])

  return (
    <div className="card">
      <h2>allcsvideos</h2>
      <p>Seconds on this page: {seconds}</p>
    </div>
  )
}
