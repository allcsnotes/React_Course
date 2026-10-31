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
      <ChatBox contact={to} />
    </main>
  )
}
