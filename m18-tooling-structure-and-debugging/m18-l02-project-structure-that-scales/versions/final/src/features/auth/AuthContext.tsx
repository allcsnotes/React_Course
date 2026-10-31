import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import * as api from './api'
import type { User } from './types'

type AuthValue = {
  user: User | null
  logIn: (email: string, password: string) => Promise<void>
  logOut: () => void
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const value: AuthValue = {
    user,
    logIn: async (email, password) =>
      setUser(await api.login(email, password)),
    logOut: () => {
      api.logout()
      setUser(null)
    },
  }
  return <AuthContext value={value}>{children}</AuthContext>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return ctx
}
