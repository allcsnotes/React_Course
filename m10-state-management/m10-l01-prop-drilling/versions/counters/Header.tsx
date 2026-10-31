import Logo from './Logo.tsx'
import Renders from './Renders.tsx'
import UserMenu from './UserMenu.tsx'
import ThemeSwitch from './ThemeSwitch.tsx'
import type { Theme, User } from './types.ts'

type Props = { theme: Theme; user: User; onToggleTheme: () => void }

export default function Header({ theme, user, onToggleTheme }: Props) {
  return (
    <header>
      <Renders name="Header" />
      <Logo theme={theme} />
      <UserMenu user={user} />
      <ThemeSwitch theme={theme} onToggle={onToggleTheme} />
    </header>
  )
}
