import { useActionState } from 'react'
import { joinWaitlist } from './api'

type State = { message: string; ok: boolean; email: string }

async function join(_prev: State, formData: FormData): Promise<State> {
  const email = String(formData.get('email'))
  try {
    await joinWaitlist(email)
    return { message: `${email} is on the list`, ok: true, email: '' }
  } catch (err) {
    return { message: (err as Error).message, ok: false, email }
  }
}

export function Waitlist() {
  const [state, formAction, pending] = useActionState(join, {
    message: '',
    ok: false,
    email: '',
  })

  return (
    <form action={formAction}>
      <label>
        Email
        <input name="email" defaultValue={state.email} />
      </label>
      <button disabled={pending}>{pending ? 'Joining…' : 'Join'}</button>
      <p className={state.ok ? 'msg ok' : 'msg error'}>{state.message}</p>
    </form>
  )
}
