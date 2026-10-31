import { useState } from 'react'
import Page from './Page.tsx'
import type { Lang, Theme, User } from './types.ts'

export default function App() {
  const [theme, setTheme] = useState<Theme>('light')
  const [user] = useState<User>({ name: 'Lukas', plan: 'free' })
  const [lang] = useState<Lang>('de')

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  return (
    <div className={`app ${theme}`}>
      <Page theme={theme} user={user} lang={lang} onToggleTheme={toggleTheme} />
    </div>
  )
}
