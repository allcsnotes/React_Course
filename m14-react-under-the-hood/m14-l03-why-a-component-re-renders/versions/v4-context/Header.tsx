import { useTheme } from './ThemeContext.tsx'
import { useRenderCount } from './useRenderCount.ts'

function ThemeSwitch() {
  const n = useRenderCount()
  const { theme, toggle } = useTheme()
  return (
    <div className="bar">
      <button className="ghost" onClick={toggle}>
        {theme === 'light' ? 'Dark mode' : 'Light mode'}
      </button>
      <span className="cnt">switch {n}</span>
    </div>
  )
}

export default function Header() {
  const n = useRenderCount()
  return (
    <div className="header">
      <span className="logo">
        allcsvideos
        <span className="cnt">header {n}</span>
      </span>
      <ThemeSwitch />
    </div>
  )
}
