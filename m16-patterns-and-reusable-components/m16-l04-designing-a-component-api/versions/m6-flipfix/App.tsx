import { useState } from 'react'
import { TextField } from './TextField.tsx'

export default function App() {
  const [name, setName] = useState<string>()
  return (
    <>
      <header><strong>allcsvideos · components</strong><span className="tag">demo</span></header>
      <main>
        <div className="panel">
          <TextField label="Your name" value={name} onChange={setName} />
          <p className="small">Hello, {name ?? 'stranger'}</p>
        </div>
      </main>
    </>
  )
}
