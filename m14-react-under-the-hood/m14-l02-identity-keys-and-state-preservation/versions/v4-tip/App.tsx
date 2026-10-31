import { useState } from 'react'
import { ChatBox } from './ChatBox.tsx'
import { Tabs } from './Tabs.tsx'
import { contacts } from './contacts.ts'

export default function App() {
  const [to, setTo] = useState(contacts[0])
  const [showTip, setShowTip] = useState(false)

  return (
    <main>
      <header>
        <h1>Message a teammate</h1>
        <button onClick={() => setShowTip(!showTip)}>
          {showTip ? 'Hide tip' : 'Show tip'}
        </button>
      </header>
      <Tabs to={to} onPick={setTo} />
      {showTip && <p className="tip">Tip: name the person.</p>}
      <ChatBox contact={to} />
    </main>
  )
}
