'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions'

export default function LoginForm() {
  const [error, action, pending] = useActionState(login, '')
  return (
    <form action={action} className="form">
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button className="btn" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  )
}
