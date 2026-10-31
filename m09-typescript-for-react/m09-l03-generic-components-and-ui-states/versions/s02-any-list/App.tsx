import { List } from './List'
import { courses, lessons } from './data'

export default function App() {
  return (
    <main>
      <section>
        <h2>Courses</h2>
        <List items={courses} renderItem={c => c.titel} />
      </section>
      <section>
        <h2>Lessons</h2>
        <List items={lessons} renderItem={l => l.title} />
      </section>
    </main>
  )
}
