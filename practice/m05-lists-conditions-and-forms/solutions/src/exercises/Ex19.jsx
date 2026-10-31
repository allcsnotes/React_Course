import { useState } from 'react'

const LIMIT = 20

export default function Ex19() {
  const [name, setName] = useState('')

  return (
    <div className="card">
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      <button onClick={() => setName('')}>Clear</button>
      <p>{name === '' ? 'Hello, stranger!' : 'Hello, ' + name + '!'}</p>
      <p className={name.length > LIMIT ? 'error' : ''}>
        Characters: {name.length} / {LIMIT}
      </p>
      {name.length > LIMIT && <p className="error">Too long</p>}
    </div>
  )
}
