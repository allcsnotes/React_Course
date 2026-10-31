import Link from 'next/link'
import { allCourses } from '@/lib/learn'

export default async function CourseList() {
  'use cache'
  const courses = await allCourses()
  return (
    <div className="grid">
      {courses.map((c) => (
        <Link key={c.id} href={`/courses/${c.slug}`} className="card">
          <div className="card-body">
            <h3>{c.title}</h3>
            <p>{c.level}</p>
            <p>{c.summary}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
