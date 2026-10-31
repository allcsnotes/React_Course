import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { useAuth } from './AuthContext.tsx'
import { ApiError } from './api.ts'

export default function LoginPage() {
  const { logIn } = useAuth()
  const navigate = useNavigate()
  const asked = useSearchParams()[0].get('next') ?? '/'
  const next = asked.startsWith('/') && !asked.startsWith('//') ? asked : '/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await logIn({ email, password })
      navigate(next, { replace: true })
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Something went wrong',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="panel" onSubmit={onSubmit}>
      <h1>Log in</h1>
      <label>
        Email
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {error && <p className="bad">{error}</p>}
      <button disabled={busy}>
        {busy ? 'Logging in...' : 'Log in'}
      </button>
      <Link to="/signup">New here? Sign up</Link>
    </form>
  )
}
