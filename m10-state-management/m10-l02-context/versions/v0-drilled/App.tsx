import { useState } from 'react'
import Page from './Page.tsx'

export type Theme = 'light' | 'dark'
export type User = { name: string }

export default function App() {
  const [theme, setTheme] = useState<Theme>('light')
  const [user, setUser] = useState<User | null>(null)
  return (
    <div className="app" data-theme={theme}>
      <Page
        theme={theme}
        setTheme={setTheme}
        user={user}
        setUser={setUser}
      />
    </div>
  )
}
