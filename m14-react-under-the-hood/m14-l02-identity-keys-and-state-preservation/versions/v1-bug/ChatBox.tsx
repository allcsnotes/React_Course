import { useEffect, useState } from 'react'
import type { Contact } from './contacts.ts'

export function ChatBox({ contact }: { contact: Contact }) {
  const [draft, setDraft] = useState('')
  const [sent, setSent] = useState(0)

  useEffect(() => {
    console.log('ChatBox mounted')
    return () => console.log('ChatBox unmounted')
  }, [])

  function send() {
    setSent(s => s + 1)
    setDraft('')
  }

  return (
    <section>
      <h2>To: {contact.name}</h2>
      <input
        value={draft}
        onChange={e => setDraft(e.target.value)}
        placeholder="Write a message"
      />
      <button onClick={send}>Send</button>
      <p className="sent">Sent: {sent}</p>
    </section>
  )
}
