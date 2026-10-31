import { useEffect, useState } from 'react'

function Room({ room }: { room: string }) {
  useEffect(() => {
    console.log('connect', room)
    return () => console.log('disconnect', room)
  }, [room])
  return <h1>Room: {room}</h1>
}

export default function D4() {
  const [room, setRoom] = useState('general')
  return (
    <main>
      <Room room={room} />
      <button onClick={() => setRoom('music')}>go to music</button>
    </main>
  )
}
