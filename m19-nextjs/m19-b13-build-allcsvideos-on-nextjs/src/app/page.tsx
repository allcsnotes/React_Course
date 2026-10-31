import Link from 'next/link'
import { getCourses } from '@/lib/api'
import CourseCard from '@/components/CourseCard'

export default async function Home() {
  const courses = await getCourses()
  return (
    <>
      <section className="hero">
        <h1>Learn to build the web</h1>
        <p>Short, calm video courses for total beginners.</p>
        <Link className="btn" href="/courses">
          Browse all courses
        </Link>
      </section>
      <h2>Popular right now</h2>
      <div className="grid">
        {courses.slice(0, 3).map((c) => (
          <CourseCard key={c.slug} course={c} />
        ))}
      </div>
    </>
  )
}
