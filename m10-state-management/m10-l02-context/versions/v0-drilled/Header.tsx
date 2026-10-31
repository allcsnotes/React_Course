import type { Theme, User } from './App.tsx'

type Props = {
  theme: Theme
  setTheme: (t: Theme) => void
  user: User | null
  setUser: (u: User | null) => void
}

export default function Header(p: Props) {
  const { theme, user } = p
  const next = theme === 'light' ? 'dark' : 'light'
  return (
    <div className="header">
      <span className="logo">allcsvideos</span>
      <div className="bar">
        {user ? (
          <>
            <span className="hello">Hello, {user.name}</span>
            <button className="ghost" onClick={() => p.setUser(null)}>
              Log out
            </button>
          </>
        ) : (
          <button onClick={() => p.setUser({ name: 'Lukas' })}>
            Log in
          </button>
        )}
        <button className="ghost" onClick={() => p.setTheme(next)}>
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </button>
      </div>
    </div>
  )
}
