import Link from 'next/link'
import { getCourses } from '@/lib/api'

export default async function CourseList({ q }: { q: string }) {
  const courses = await getCourses(q)
  if (courses.length === 0) return <p className="muted">No course matches “{q}”.</p>
  return (
    <ul className="grid">
      {courses.map((c) => (
        <li key={c.slug} className="card">
          <h3><Link href={`/courses/${c.slug}`}>{c.title}</Link></h3>
          <p>{c.summary}</p>
          <p className="price">
            {c.free ? 'Free' : `₹${c.price}`} · {c.level} · {c.lessonCount} lessons
          </p>
        </li>
      ))}
    </ul>
  )
}
