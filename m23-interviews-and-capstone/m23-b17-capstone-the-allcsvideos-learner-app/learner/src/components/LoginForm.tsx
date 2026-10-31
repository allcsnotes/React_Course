'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions'

export default function LoginForm() {
  const [error, action, pending] = useActionState(login, '')
  return (
    <form action={action} className="form">
      <label>
        Email
        <input name="email" type="email" required />
      </label>
      <label>
        Password
        <input name="password" type="password" required />
      </label>
      <button className="btn" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
      {error && <p className="error" role="alert">{error}</p>}
      <p className="muted">Demo: lukas@example.test, password fake-demo-pass</p>
    </form>
  )
}
