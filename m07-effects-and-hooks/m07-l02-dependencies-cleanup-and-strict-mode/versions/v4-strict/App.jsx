import { useState, useEffect } from 'react'
import './App.css'

function Room({ roomId }) {
  console.log('render ' + roomId)

  useEffect(() => {
    console.log('connect ' + roomId)
    return () => {
      console.log('disconnect ' + roomId)
    }
  }, [roomId])

  return <h2 className="big">Room: {roomId}</h2>
}

export default function App() {
  const [roomId, setRoomId] = useState('python')
  const [show, setShow] = useState(false)

  return (
    <div className="card">
      <div className="bar">
        <button onClick={() => setRoomId('python')}>Python</button>
        <button onClick={() => setRoomId('react')}>React</button>
        <button onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button>
      </div>
      {show && <Room roomId={roomId} />}
    </div>
  )
}
