import Avatar from './Avatar.tsx'
import type { User } from './types.ts'

export default function UserMenu({ user }: { user: User }) {
  return (
    <div className="menu">
      <Avatar user={user} />
      <span>{user.name} · {user.plan}</span>
    </div>
  )
}
