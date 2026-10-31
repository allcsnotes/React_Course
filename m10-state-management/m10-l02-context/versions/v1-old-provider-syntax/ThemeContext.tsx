import { createContext, useState } from 'react'
import type { ReactNode } from 'react'

export type Theme = 'light' | 'dark'
type ThemeValue = {
  theme: Theme
  toggle: () => void
}

export const ThemeContext = createContext<ThemeValue>({
  theme: 'light',
  toggle: () => {},
})

type Props = { children: ReactNode }

export function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState<Theme>('light')
  const toggle = () =>
    setTheme(theme === 'light' ? 'dark' : 'light')
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <div className="app" data-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
