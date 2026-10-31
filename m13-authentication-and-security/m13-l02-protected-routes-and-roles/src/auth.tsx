import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Role } from './roles'

export type User = { name: string; role: Role }

type Props = { children: ReactNode }

type Auth = {
  user: User | null
  token: string | null
  signIn: (email: string) => Promise<void>
  signOut: () => void
}
const AuthContext = createContext<Auth | null>(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth needs an AuthProvider')
  return value
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  async function signIn(email: string) {
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    setUser(data.user)
    setToken(data.token)
  }

  function signOut() {
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext value={{ user, token, signIn, signOut }}>
      {children}
    </AuthContext>
  )
}
