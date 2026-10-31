import { useActionState } from 'react'
import { joinWaitlist } from './api'

type State = { message: string; ok: boolean; attempts: number }

async function join(prev: State, formData: FormData): Promise<State> {
  const attempts = prev.attempts + 1
  try {
    const email = await joinWaitlist(String(formData.get('email')))
    return { message: `${email} is on the list`, ok: true, attempts }
  } catch (err) {
    return { message: (err as Error).message, ok: false, attempts }
  }
}

export function Waitlist() {
  const [state, formAction, pending] = useActionState(join, {
    message: '',
    ok: false,
    attempts: 0,
  })

  return (
    <form action={formAction}>
      <label>
        Email
        <input name="email" />
      </label>
      <button disabled={pending}>{pending ? 'Joining…' : 'Join'}</button>
      <p className={state.ok ? 'msg ok' : 'msg error'}>{state.message}</p>
      <p className="small">Attempts: {state.attempts}</p>
    </form>
  )
}
