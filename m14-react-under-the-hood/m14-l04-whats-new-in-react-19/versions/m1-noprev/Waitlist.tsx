import { useActionState } from 'react'
import { joinWaitlist } from './api'

type State = { message: string; ok: boolean }

async function join(formData: FormData): Promise<State> {
  try {
    const email = await joinWaitlist(String(formData.get('email')))
    return { message: `${email} is on the list`, ok: true }
  } catch (err) {
    return { message: (err as Error).message, ok: false }
  }
}

export function Waitlist() {
  const [state, formAction, pending] = useActionState(join, {
    message: '',
    ok: false,
  })

  return (
    <form action={formAction}>
      <label>
        Email
        <input name="email" />
      </label>
      <button disabled={pending}>{pending ? 'Joining…' : 'Join'}</button>
      <p className={state.ok ? 'msg ok' : 'msg error'}>{state.message}</p>
    </form>
  )
}
