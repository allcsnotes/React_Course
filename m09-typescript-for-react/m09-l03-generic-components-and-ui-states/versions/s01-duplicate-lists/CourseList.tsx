import type { Course } from './types'

interface Props {
  items: Course[]
}

export function CourseList({ items }: Props) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.title} <small>{item.teacher}</small>
        </li>
      ))}
    </ul>
  )
}
