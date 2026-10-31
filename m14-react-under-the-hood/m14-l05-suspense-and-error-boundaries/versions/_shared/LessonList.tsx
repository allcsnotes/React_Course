import { use } from 'react'
import { LESSONS, load } from './api.ts'
import type { Lesson } from './api.ts'

export function LessonList() {
  const lessons = use(load<Lesson[]>(LESSONS))
  return (
    <ul>
      {lessons.map(l => (
        <li key={l.id}>
          <span>{l.title}</span>
          <span>{l.minutes} min</span>
        </li>
      ))}
    </ul>
  )
}
