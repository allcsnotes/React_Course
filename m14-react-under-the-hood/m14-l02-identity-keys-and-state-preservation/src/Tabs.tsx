import { contacts, type Contact } from './contacts.ts'

type Props = { to: Contact; onPick: (c: Contact) => void }

export function Tabs({ to, onPick }: Props) {
  return (
    <nav>
      {contacts.map(c => (
        <button key={c.id} className={c.id === to.id ? 'on' : ''} onClick={() => onPick(c)}>
          {c.name}
        </button>
      ))}
    </nav>
  )
}
