import Link from 'next/link'

type Course = { slug: string; title: string; teacher: string }

export default async function Home() {
  const res = await fetch('http://localhost:8194/api/courses')
  const courses: Course[] = await res.json()
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
