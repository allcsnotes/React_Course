import Link from 'next/link'
import { courses } from '@/lib/courses'

export default function CoursesPage() {
  return (
    <main>
      <h1>All courses</h1>
      <ul>
        {courses.map((c) => (
          <li key={c.slug}>
            <Link href={`/courses/${c.slug}`}>{c.title}</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
