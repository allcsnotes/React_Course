import { createContext, useContext, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'
type ThemeValue = { theme: Theme; toggle: () => void }

// BROKEN on purpose: the default value is a real-looking theme, so a forgotten provider is silent.
const ThemeContext = createContext<ThemeValue>({ theme: 'light', toggle: () => {} })

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  return <ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>
}

function Switch() {
  const { theme, toggle } = useContext(ThemeContext)
  return <button onClick={toggle}>Theme is {theme}. Switch</button>
}

function Footer() {
  const { theme } = useContext(ThemeContext)
  return <p>Footer: theme {theme}</p>
}

export default function B07Default() {
  return (
    <div className="card">
      <ThemeProvider>
        <Switch />
      </ThemeProvider>
      {/* The footer was put outside the provider. No error anywhere. */}
      <Footer />
    </div>
  )
}
