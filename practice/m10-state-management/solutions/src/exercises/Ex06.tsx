import { createContext, useContext, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'
type ThemeValue = { theme: Theme; toggle: () => void }

const ThemeContext = createContext<ThemeValue>({ theme: 'light', toggle: () => {} })

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  return <ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>
}

// A second, inner station that broadcasts the OPPOSITE of the outer one.
function Opposite({ children }: { children: ReactNode }) {
  const outer = useContext(ThemeContext)
  const flipped: Theme = outer.theme === 'light' ? 'dark' : 'light'
  return <ThemeContext value={{ theme: flipped, toggle: outer.toggle }}>{children}</ThemeContext>
}

function Card({ name }: { name: string }) {
  const { theme } = useContext(ThemeContext)
  return (
    <div className={theme === 'light' ? 'themed-light' : 'themed-dark'}>
      {name}: hears {theme}
    </div>
  )
}

function Switch() {
  const { toggle } = useContext(ThemeContext)
  return <button onClick={toggle}>Switch page theme</button>
}

export default function Ex06() {
  return (
    <ThemeProvider>
      <Switch />
      <Card name="Card 1" />
      <Opposite>
        <Card name="Card 2" />
      </Opposite>
      <Card name="Card 3" />
    </ThemeProvider>
  )
}
