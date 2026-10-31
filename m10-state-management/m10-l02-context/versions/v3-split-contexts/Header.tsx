import { useTheme } from './ThemeContext.tsx'
import { useUser } from './UserContext.tsx'
import { useRenderCount } from './useRenderCount.ts'

function ThemeSwitch() {
  const n = useRenderCount()
  const { theme, toggle } = useTheme()
  return (
    <span className="cw">
      <button className="ghost" onClick={toggle}>
        {theme === 'light' ? 'Dark mode' : 'Light mode'}
      </button>
      <span className="cnt">switch {n}</span>
    </span>
  )
}

function UserMenu() {
  const n = useRenderCount()
  const { user, login, logout } = useUser()
  return (
    <span className="cw">
      {user ? (
        <button className="ghost" onClick={logout}>
          Log out
        </button>
      ) : (
        <button onClick={login}>Log in</button>
      )}
      <span className="cnt">menu {n}</span>
    </span>
  )
}

export default function Header() {
  return (
    <div className="header">
      <span className="logo">allcsvideos</span>
      <div className="bar">
        <UserMenu />
        <ThemeSwitch />
      </div>
    </div>
  )
}
