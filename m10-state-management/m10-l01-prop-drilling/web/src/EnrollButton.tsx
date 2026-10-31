import type { Lang, Theme, User } from './types.ts'

type Props = { theme: Theme; user: User; lang: Lang }

const LABELS: Record<Lang, string> = {
  en: 'Enroll as',
  de: 'Einschreiben als',
}

export default function EnrollButton({ theme, user, lang }: Props) {
  const color = theme === 'dark' ? '#8ab4ff' : '#1a56db'
  return (
    <button className="enroll">
      <svg width="14" height="14" viewBox="0 0 14 14">
        <path d="M2 1 L13 7 L2 13 Z" fill={color} />
      </svg>
      {LABELS[lang]} {user.name}
    </button>
  )
}
