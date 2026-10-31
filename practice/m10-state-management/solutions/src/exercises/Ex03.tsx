import { useState } from 'react'
import { Renders } from '../Renders.tsx'

type Theme = 'light' | 'dark'

function Header({ theme }: { theme: Theme }) {
  return (
    <div className="row">
      <strong>Header</strong> <span>theme: {theme}</span>
      <Renders />
    </div>
  )
}

// Footer takes no props at all.
function Footer() {
  return (
    <div className="row">
      <strong>Footer</strong> <span>no props</span>
      <Renders />
    </div>
  )
}

export default function Ex03() {
  const [theme, setTheme] = useState<Theme>('light')

  return (
    <div className="card">
      <Header theme={theme} />
      <Footer />
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Switch theme</button>
    </div>
  )
}
