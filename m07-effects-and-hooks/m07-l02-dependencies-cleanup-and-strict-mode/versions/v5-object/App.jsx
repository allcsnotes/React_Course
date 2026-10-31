import { useState, useEffect } from 'react'
import './App.css'

function Room({ roomId }) {
  const options = { roomId: roomId }

  useEffect(() => {
    console.log('connect ' + options.roomId)
    return () => {
      console.log('disconnect ' + options.roomId)
    }
  }, [options])

  return <h2 className="big">Room: {roomId}</h2>
}

export default function App() {
  const [message, setMessage] = useState('')

  return (
    <div className="card">
      <Room roomId="python" />
      <label>Message
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </div>
  )
}
