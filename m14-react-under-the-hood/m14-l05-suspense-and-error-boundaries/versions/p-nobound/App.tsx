import { Header } from './Header.tsx'
import { LessonList } from './LessonList.tsx'
import { Reviews } from './Reviews.tsx'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <section>
          <h2>Lessons</h2>
          <LessonList />
        </section>
        <section>
          <h2>Reviews</h2>
          <Reviews />
        </section>
      </main>
    </>
  )
}
