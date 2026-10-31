import { useContext } from 'react'
import { ThemeContext } from './ThemeContext.tsx'

export default function Probe() {
  const { theme } = useContext(ThemeContext)
  return <span>{theme}</span>
}
