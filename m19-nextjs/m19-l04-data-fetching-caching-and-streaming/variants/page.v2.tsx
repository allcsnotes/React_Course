import Link from 'next/link'
import { getCourses } from '@/lib/api'

export default async function Home() {
  const courses = await getCourses()
  return (
    <main>
      <h1>allcsvideos</h1>
      <ul>
        {courses.map((c) => (
          <li key={c.slug}>
            <Link href={`/courses/${c.slug}`}>{c.title}</Link> by {c.teacher}
          </li>
        ))}
      </ul>
    </main>
  )
}
