import type { Lesson } from './types'

interface Props {
  items: Lesson[]
}

export function LessonList({ items }: Props) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.title} <small>{item.minutes} min</small>
        </li>
      ))}
    </ul>
  )
}
