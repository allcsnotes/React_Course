import type { Theme } from './types.ts'

type Props = { theme: Theme; onToggle: () => void }

export default function ThemeSwitch({ theme, onToggle }: Props) {
  return (
    <button className="switch" onClick={onToggle}>
      {theme === 'light' ? 'Dark mode' : 'Light mode'}
    </button>
  )
}
