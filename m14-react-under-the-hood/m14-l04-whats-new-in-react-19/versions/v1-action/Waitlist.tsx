import { useState } from 'react'
import { joinWaitlist } from './api'

export function Waitlist() {
  const [done, setDone] = useState('')

  async function join(formData: FormData) {
    console.log(Object.fromEntries(formData))
    setDone(await joinWaitlist(String(formData.get('email'))))
  }

  return (
    <form action={join}>
      <label>
        Email
        <input name="email" />
      </label>
      <button>Join</button>
      {done && <p className="msg ok">{done} is on the list</p>}
    </form>
  )
}
