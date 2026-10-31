import Avatar from './Avatar.tsx'
import Renders from './Renders.tsx'
import type { User } from './types.ts'

export default function UserMenu({ user }: { user: User }) {
  return (
    <div className="menu">
      <Renders name="UserMenu" />
      <Avatar user={user} />
      <span>{user.name} · {user.plan}</span>
    </div>
  )
}
