import { useState } from 'react'
import Renders from './Renders.tsx'
import Page from './Page.tsx'
import type { Theme, User } from './types.ts'

export default function App() {
  const [theme, setTheme] = useState<Theme>('light')
  const [user] = useState<User>({ name: 'Lukas', plan: 'free' })

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  return (
    <div className={`app ${theme}`}>
      <Renders name="App" />
      <Page theme={theme} user={user} onToggleTheme={toggleTheme} />
    </div>
  )
}
