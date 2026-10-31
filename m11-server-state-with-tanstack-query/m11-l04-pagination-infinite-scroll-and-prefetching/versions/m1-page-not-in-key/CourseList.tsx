import type { Course } from './api'

export default function CourseList({ items }: { items: Course[] }) {
  return (
    <ul className="list">
      {items.map(c => (
        <li key={c.slug}>
          <strong>{c.title}</strong>
          <span>by {c.teacher} · {c.level}</span>
          <span>{c.free ? 'Free' : `Rs ${c.price}`}</span>
        </li>
      ))}
    </ul>
  )
}
