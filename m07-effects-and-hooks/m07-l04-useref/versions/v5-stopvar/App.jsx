import { useState } from 'react'

function App() {
  const [secs, setSecs] = useState(0)
  let timerId = null

  function start() {
    timerId = setInterval(() => {
      setSecs(s => s + 1)
    }, 1000)
    console.log('timer id', timerId)
  }

  function stop() {
    clearInterval(timerId)
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
