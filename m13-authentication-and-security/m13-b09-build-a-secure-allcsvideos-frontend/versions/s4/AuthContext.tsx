import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import * as api from './api.ts'
import type { User } from './schema.ts'

type AuthValue = {
  user: User | null
  checking: boolean
  logIn: (body: api.Credentials) => Promise<void>
  signUp: (body: api.Credentials & { name: string }) => Promise<void>
  logOut: () => Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    api
      .refresh()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setChecking(false))
  }, [])

  useEffect(() => {
    api.onSessionEnded(() => {
      queryClient.clear()
      setUser(null)
    })
  }, [queryClient])

  const value: AuthValue = {
    user,
    checking,
    logIn: async (body) => setUser(await api.login(body)),
    signUp: async (body) => setUser(await api.signup(body)),
    logOut: async () => {
      await api.logout()
      queryClient.clear()
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
