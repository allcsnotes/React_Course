import type { Theme } from './types.ts'
import Renders from './Renders.tsx'

type Props = { theme: Theme; onToggle: () => void }

export default function ThemeSwitch({ theme, onToggle }: Props) {
  return (
    <button className="switch" onClick={onToggle}>
      {theme === 'light' ? 'Dark mode' : 'Light mode'}
      <Renders name="ThemeSwitch" />
    </button>
  )
}
