import { useTheme } from './ThemeContext.tsx'

export default function Footer() {
  const { theme } = useTheme()
  return (
    <div className="footer">
      allcsvideos · theme: {theme}
    </div>
  )
}
