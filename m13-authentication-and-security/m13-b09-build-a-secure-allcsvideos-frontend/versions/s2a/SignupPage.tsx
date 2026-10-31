import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from './AuthContext.tsx'
import { ApiError } from './api.ts'

export default function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fields, setFields] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setFields({})
    try {
      await signUp({ name, email, password })
      navigate('/', { replace: true })
    } catch (err) {
      if (err instanceof ApiError && err.fields) setFields(err.fields)
      else setFields({ form: 'Something went wrong' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="panel" onSubmit={onSubmit}>
      <h1>Sign up</h1>
      <label>
        Name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <span className="fieldbad">{fields.name}</span>
      </label>
      <label>
        Email
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <span className="fieldbad">{fields.email}</span>
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <span className="fieldbad">{fields.password}</span>
      </label>
      {fields.form && <p className="bad">{fields.form}</p>}
      <button disabled={busy}>
        {busy ? 'Creating...' : 'Create account'}
      </button>
      <Link to="/login">Have an account? Log in</Link>
    </form>
  )
}
