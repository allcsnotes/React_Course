import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type Theme = 'light' | 'dark'
type ThemeValue = {
  theme: Theme
  toggle: () => void
}

export const ThemeContext = createContext<ThemeValue | null>(null)

type Props = { children: ReactNode }

export function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState<Theme>('light')
  const toggle = () =>
    setTheme(theme === 'light' ? 'dark' : 'light')
  return (
    <ThemeContext value={{ theme, toggle }}>
      <div className="app" data-theme={theme}>
        {children}
      </div>
    </ThemeContext>
  )
}

export function useTheme() {
  const value = useContext(ThemeContext)
  if (value === null) {
    throw new Error(
      'useTheme must be used inside <ThemeProvider>',
    )
  }
  return value
}
