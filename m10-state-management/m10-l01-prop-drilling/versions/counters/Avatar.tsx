import Renders from './Renders.tsx'
import type { User } from './types.ts'

export default function Avatar({ user }: { user: User }) {
  return <span className={`avatar ${user.plan}`}>{user.name[0]}<Renders name="Avatar" /></span>
}
