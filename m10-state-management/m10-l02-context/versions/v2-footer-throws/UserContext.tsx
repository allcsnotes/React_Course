import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type User = { name: string }
type UserValue = {
  user: User | null
  login: () => void
  logout: () => void
}

const UserContext = createContext<UserValue | null>(null)

type Props = { children: ReactNode }

export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const login = () => setUser({ name: 'Lukas' })
  const logout = () => setUser(null)
  return (
    <UserContext value={{ user, login, logout }}>
      {children}
    </UserContext>
  )
}

export function useUser() {
  const value = useContext(UserContext)
  if (value === null) {
    throw new Error(
      'useUser must be used inside <UserProvider>',
    )
  }
  return value
}
