import { createContext, useContext } from 'react'

type Theme = 'light' | 'dark'
type ThemeValue = { theme: Theme; toggle: () => void }

// Step 2 of the exercise: default null, but components still call useContext directly.
const ThemeContext = createContext<ThemeValue | null>(null)

export function Footer() {
  const { theme } = useContext(ThemeContext)
  return <p>theme: {theme}</p>
}
