import { useState } from 'react'
import { Switch } from './Switch.tsx'

export default function App() {
  const [on, setOn] = useState(false)
  return (
    <main>
      <Switch label="Dark mode" checked={on} onChange={setOn} defaultChecked />
      <Switch label="Dark mode" checked={on} />
    </main>
  )
}
