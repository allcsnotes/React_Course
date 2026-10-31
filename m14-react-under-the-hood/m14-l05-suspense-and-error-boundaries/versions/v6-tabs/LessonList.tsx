import { use } from 'react'
import { load } from './api.ts'
import type { Lesson } from './api.ts'

type Props = { slug: string }

export function LessonList({ slug }: Props) {
  const path = `/api/courses/${slug}/lessons`
  const lessons = use(load<Lesson[]>(path))
  return (
    <ul style={{ marginTop: 12 }}>
      {lessons.map(l => (
        <li key={l.id}>
          <span>{l.title}</span>
          <span>{l.minutes} min</span>
        </li>
      ))}
    </ul>
  )
}
