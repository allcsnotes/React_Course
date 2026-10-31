import type { Theme, User } from './types.ts'

type Props = { theme: Theme; user: User }

export default function EnrollButton({ theme, user }: Props) {
  const color = theme === 'dark' ? '#8ab4ff' : '#1a56db'
  return (
    <button className="enroll">
      <svg width="14" height="14" viewBox="0 0 14 14">
        <path d="M2 1 L13 7 L2 13 Z" fill={color} />
      </svg>
      Enroll as {user.name}
    </button>
  )
}
