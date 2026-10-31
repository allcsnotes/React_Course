import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import { ApiError } from '../api'

export default function LoginPage() {
  const { logIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await logIn(email, password)
      navigate('/my-courses')
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Something went wrong',
      )
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Log in</h1>
      <label>
        Email
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>{' '}
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>{' '}
      <button>Log in</button>
      {error && (
        <p role="alert" className="err">
          {error}
        </p>
      )}
    </form>
  )
}
