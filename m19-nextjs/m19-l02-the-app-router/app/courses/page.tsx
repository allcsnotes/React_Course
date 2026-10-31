import Link from 'next/link'
import { getCourses } from '@/lib/courses'

export default async function CoursesPage() {
  const courses = await getCourses()
  return (
    <ul className="list">
      {courses.map((c) => (
        <li key={c.slug}>
          <Link href={`/courses/${c.slug}`}>{c.title}</Link>
          <span>{c.teacher}</span>
        </li>
      ))}
    </ul>
  )
}
