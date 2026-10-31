import { useState, useRef } from 'react'

function App() {
  const [secs, setSecs] = useState(0)
  const timerRef = useRef(null)

  function start() {
    timerRef.current = setInterval(() => {
      setSecs(s => s + 1)
    }, 1000)
    console.log('timer id', timerRef.current)
  }

  function stop() {
    clearInterval(timerRef.current)
  }

  return (
    <div className="page">
      <p className="big">{secs} s</p>
      <div className="btns">
        <button onClick={start}>Start</button>
        <button onClick={stop}>Stop</button>
      </div>
    </div>
  )
}

export default App
