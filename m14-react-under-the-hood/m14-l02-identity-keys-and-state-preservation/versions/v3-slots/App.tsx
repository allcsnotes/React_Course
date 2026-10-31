import { useState } from 'react'
import { ChatBox } from './ChatBox.tsx'
import { Tabs } from './Tabs.tsx'
import { contacts } from './contacts.ts'

export default function App() {
  const [to, setTo] = useState(contacts[0])

  return (
    <main>
      <h1>Message a teammate</h1>
      <Tabs to={to} onPick={setTo} />
      {to.id === 'lukas' && <ChatBox contact={to} />}
      {to.id === 'priya' && <ChatBox contact={to} />}
    </main>
  )
}
