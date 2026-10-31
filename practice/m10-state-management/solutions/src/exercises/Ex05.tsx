import { createContext, useContext, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'
type ThemeValue = { theme: Theme; toggle: () => void }

// The channel. The argument is the default value: what a component hears
// when there is no provider above it.
const ThemeContext = createContext<ThemeValue>({ theme: 'light', toggle: () => {} })

// The station.
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  return (
    <ThemeContext value={{ theme, toggle }}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext>
  )
}

// A radio: it listens with useContext, nothing is passed to it.
function ThemeSwitch() {
  const { theme, toggle } = useContext(ThemeContext)
  return <button onClick={toggle}>{theme === 'light' ? 'Dark mode' : 'Light mode'}</button>
}

function CourseCard({ title }: { title: string }) {
  const { theme } = useContext(ThemeContext)
  return (
    <div className={theme === 'light' ? 'themed-light' : 'themed-dark'}>
      {title} · card is {theme}
    </div>
  )
}

// CourseList has no props about the theme at all.
function CourseList() {
  return (
    <>
      <CourseCard title="React for Beginners" />
      <CourseCard title="SQL in Two Weeks" />
    </>
  )
}

export default function Ex05() {
  return (
    <ThemeProvider>
      <ThemeSwitch />
      <CourseList />
    </ThemeProvider>
  )
}
