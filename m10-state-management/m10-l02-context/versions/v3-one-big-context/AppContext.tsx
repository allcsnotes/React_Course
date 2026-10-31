import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type Theme = 'light' | 'dark'
export type User = { name: string }
type AppValue = {
  theme: Theme
  toggle: () => void
  user: User | null
  login: () => void
  logout: () => void
}

const AppContext = createContext<AppValue | null>(null)

type Props = { children: ReactNode }

export function AppProvider({ children }: Props) {
  const [theme, setTheme] = useState<Theme>('light')
  const [user, setUser] = useState<User | null>(null)
  const toggle = () =>
    setTheme(theme === 'light' ? 'dark' : 'light')
  const login = () => setUser({ name: 'Lukas' })
  const logout = () => setUser(null)
  return (
    <AppContext
      value={{ theme, toggle, user, login, logout }}
    >
      <div className="app" data-theme={theme}>
        {children}
      </div>
    </AppContext>
  )
}

export function useApp() {
  const value = useContext(AppContext)
  if (value === null) {
    throw new Error(
      'useApp must be used inside <AppProvider>',
    )
  }
  return value
}
