import { CourseCard, type Course } from './CourseCard'

const courses: Course[] = [
  { id: 1, title: 'React from Zero', priceCents: 4990, percentOff: 20, seatsLeft: 12 },
  { id: 2, title: 'Python for APIs', priceCents: 3900, percentOff: 0, seatsLeft: 0 },
]

export default function App() {
  return (
    <>
      <header>allcsvideos · Courses</header>
      <main>
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </main>
    </>
  )
}
