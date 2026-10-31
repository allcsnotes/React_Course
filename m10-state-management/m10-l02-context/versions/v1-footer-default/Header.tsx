import { useContext } from 'react'
import { ThemeContext } from './ThemeContext.tsx'
import { UserContext } from './UserContext.tsx'

function ThemeSwitch() {
  const { theme, toggle } = useContext(ThemeContext)
  return (
    <button className="ghost" onClick={toggle}>
      {theme === 'light' ? 'Dark mode' : 'Light mode'}
    </button>
  )
}

function UserMenu() {
  const { user, login, logout } = useContext(UserContext)
  if (!user) return <button onClick={login}>Log in</button>
  return (
    <>
      <span className="hello">Hello, {user.name}</span>
      <button className="ghost" onClick={logout}>
        Log out
      </button>
    </>
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
