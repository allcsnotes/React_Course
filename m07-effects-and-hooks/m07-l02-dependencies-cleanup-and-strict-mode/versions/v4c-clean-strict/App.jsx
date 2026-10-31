import { useState, useEffect } from 'react'
import './App.css'

function Clock() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      console.log('tick')
      setSeconds(s => s + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return <p className="big">Clock: {seconds} s</p>
}

export default function App() {
  const [show, setShow] = useState(false)

  return (
    <div className="card">
      <button onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button>
      {show && <Clock />}
    </div>
  )
}
