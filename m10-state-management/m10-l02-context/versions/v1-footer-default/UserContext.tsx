import { createContext, useState } from 'react'
import type { ReactNode } from 'react'

export type User = { name: string }
type UserValue = {
  user: User | null
  login: () => void
  logout: () => void
}

export const UserContext = createContext<UserValue>({
  user: null,
  login: () => {},
  logout: () => {},
})

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
