import { AsyncView } from './AsyncView'
import { List } from './List'
import { useFetch } from './useFetch'
import type { Course, Lesson } from './types'

export default function App() {
  const courses = useFetch<Course[]>('/api/courses')
  const lessons = useFetch<Lesson[]>('/api/lessons')
  return (
    <main>
      <section>
        <h2>Courses</h2>
        <AsyncView state={courses}>
          {items => (
            <List
              items={items}
              renderItem={c => (
                <>
                  {c.title} <small>{c.teacher}</small>
                </>
              )}
            />
          )}
        </AsyncView>
      </section>
      <section>
        <h2>Lessons</h2>
        <AsyncView state={lessons}>
          {items => (
            <List
              items={items}
              renderItem={l => (
                <>
                  {l.title} <small>{l.minutes} min</small>
                </>
              )}
            />
          )}
        </AsyncView>
      </section>
    </main>
  )
}
