import { createContext, useContext, useState, type ReactNode } from 'react'
import { ErrorBoundary } from '../ErrorBoundary.tsx'

type Theme = 'light' | 'dark'
type ThemeValue = { theme: Theme; toggle: () => void }

// Default is null, so a forgotten provider cannot hide.
const ThemeContext = createContext<ThemeValue | null>(null)

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  return <ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>
}

// The only way to listen. Without a provider it throws a clear sentence.
function useTheme(): ThemeValue {
  const value = useContext(ThemeContext)
  if (value === null) {
    throw new Error('useTheme must be used inside ThemeProvider')
  }
  return value
}

function Switch() {
  const { theme, toggle } = useTheme()
  return <button onClick={toggle}>Theme is {theme}. Switch</button>
}

function Footer({ label }: { label: string }) {
  const { theme } = useTheme()
  return (
    <p>
      {label}: theme {theme}
    </p>
  )
}

export default function Ex07() {
  return (
    <div className="card">
      <ThemeProvider>
        <Switch />
        <Footer label="Footer inside" />
      </ThemeProvider>
      {/* This footer is outside every provider. */}
      <ErrorBoundary>
        <Footer label="Footer outside" />
      </ErrorBoundary>
    </div>
  )
}
