import { createContext, useContext, useState, type ReactNode } from 'react'
import { Renders } from '../Renders.tsx'

type Theme = 'light' | 'dark'
type User = { name: string }

// ---------- Version A: ONE big context ----------
type BigValue = {
  theme: Theme
  toggleTheme: () => void
  user: User | null
  login: () => void
  logout: () => void
}
const BigContext = createContext<BigValue | null>(null)

function BigProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [user, setUser] = useState<User | null>(null)
  const value: BigValue = {
    theme,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    user,
    login: () => setUser({ name: 'Lukas' }),
    logout: () => setUser(null),
  }
  return <BigContext value={value}>{children}</BigContext>
}
function useBig(): BigValue {
  const v = useContext(BigContext)
  if (v === null) throw new Error('useBig must be used inside BigProvider')
  return v
}

// ---------- Version B: TWO small contexts ----------
type ThemeValue = { theme: Theme; toggle: () => void }
type UserValue = { user: User | null; login: () => void; logout: () => void }
const ThemeContext = createContext<ThemeValue | null>(null)
const UserContext = createContext<UserValue | null>(null)

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  return <ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>
}
function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const login = () => setUser({ name: 'Lukas' })
  const logout = () => setUser(null)
  return <UserContext value={{ user, login, logout }}>{children}</UserContext>
}
function useThemeOnly(): ThemeValue {
  const v = useContext(ThemeContext)
  if (v === null) throw new Error('useThemeOnly must be used inside ThemeProvider')
  return v
}
function useUserOnly(): UserValue {
  const v = useContext(UserContext)
  if (v === null) throw new Error('useUserOnly must be used inside UserProvider')
  return v
}

// ---------- The same page for both versions ----------
type Hooks = {
  useTheme: () => { theme: Theme; toggle: () => void }
  useUser: () => UserValue
}

function makePage({ useTheme, useUser }: Hooks) {
  function ThemeSwitch() {
    const { theme, toggle } = useTheme()
    return (
      <div className="row">
        <button onClick={toggle}>Theme ({theme})</button> switch
        <Renders />
      </div>
    )
  }
  function UserMenu() {
    const { user, login } = useUser()
    return (
      <div className="row">
        <button onClick={login}>Log in</button> menu: {user === null ? 'nobody' : user.name}
        <Renders />
      </div>
    )
  }
  function EnrollButton() {
    const { user } = useUser()
    return (
      <span className="row">
        enroll: {user === null ? 'log in' : 'ready'}
        <Renders />
      </span>
    )
  }
  function Card({ n }: { n: number }) {
    const { theme } = useTheme()
    return (
      <div className="row">
        card {n} ({theme}) <EnrollButton />
        <Renders />
      </div>
    )
  }
  function Page() {
    return (
      <div>
        <div className="row">
          page <Renders />
        </div>
        <ThemeSwitch />
        <UserMenu />
        <Card n={1} />
        <Card n={2} />
        <div className="row">
          footer <Renders />
        </div>
      </div>
    )
  }
  return Page
}

const BigPage = makePage({
  useTheme: () => {
    const v = useBig()
    return { theme: v.theme, toggle: v.toggleTheme }
  },
  useUser: useBig,
})
const SmallPage = makePage({ useTheme: useThemeOnly, useUser: useUserOnly })

export default function Ex09() {
  return (
    <div className="cols">
      <div className="card" data-testid="big">
        <h3>A · one big context</h3>
        <BigProvider>
          <BigPage />
        </BigProvider>
      </div>
      <div className="card" data-testid="small">
        <h3>B · two small contexts</h3>
        <ThemeProvider>
          <UserProvider>
            <SmallPage />
          </UserProvider>
        </ThemeProvider>
      </div>
    </div>
  )
}
