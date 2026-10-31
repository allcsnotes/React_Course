import { useContext } from 'react'
import { ThemeContext } from './ThemeContext.tsx'

export default function Footer() {
  const { theme } = useContext(ThemeContext)
  return (
    <div className="footer">
      allcsvideos · theme: {theme}
    </div>
  )
}
