import { useState } from 'react'

function Draft() {
  const [text, setText] = useState('')
  return <input value={text} onChange={e => setText(e.target.value)} />
}

export default function D3b() {
  const [who, setWho] = useState('Lukas')
  return (
    <main>
      <h1>To {who}</h1>
      <button onClick={() => setWho('Lukas')}>Lukas</button>
      <button onClick={() => setWho('Priya')}>Priya</button>
      <div><Draft key={who} /></div>
    </main>
  )
}
