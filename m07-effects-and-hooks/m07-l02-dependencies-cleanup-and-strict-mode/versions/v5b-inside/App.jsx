import { useState, useEffect } from 'react'
import './App.css'

function Room({ roomId }) {
  useEffect(() => {
    const options = { roomId: roomId }
    console.log('connect ' + options.roomId)
    return () => {
      console.log('disconnect ' + options.roomId)
    }
  }, [roomId])

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
