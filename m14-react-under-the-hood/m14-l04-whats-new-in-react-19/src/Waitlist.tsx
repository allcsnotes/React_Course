import { startTransition, useOptimistic, useState } from 'react'
import { joinWaitlist } from './api'

export function Waitlist({ initial }: { initial: string[] }) {
  const [emails, setEmails] = useState(initial)
  const [error, setError] = useState('')
  const [shown, addShown] = useOptimistic(
    emails,
    (list, email: string) => [...list, email],
  )

  async function join(formData: FormData) {
    const email = String(formData.get('email'))
    setError('')
    addShown(email)
    try {
      const saved = await joinWaitlist(email)
      startTransition(() =>
        setEmails((list) => [...list, saved]),
      )
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <>
      <form action={join}>
        <label>
          Email
          <input name="email" />
        </label>
        <button>Join</button>
      </form>
      <p className="msg error">{error}</p>
      <ul className="list">
        {shown.map((e) => (
          <li key={e} className={emails.includes(e) ? '' : 'sending'}>
            {e}
            {emails.includes(e) ? '' : ' · sending…'}
          </li>
        ))}
      </ul>
    </>
  )
}
