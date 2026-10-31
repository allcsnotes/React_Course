import { Suspense } from 'react'
import { connection } from 'next/server'

type Course = { slug: string; title: string; teacher: string; price: number }

async function Courses() {
  await connection()
  const res = await fetch(`${process.env.API_URL}/api/courses`)
  const courses: Course[] = await res.json()
  return (
    <div className="grid">
      {courses.map((c) => (
        <div key={c.slug} className="card">
          <div className="cover" />
          <div className="card-body">
            <h3>{c.title}</h3>
            <p>{c.teacher}</p>
            <span className="price">{c.price === 0 ? 'Free' : `₹${c.price}`}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <>
      <h1>All courses</h1>
      <Suspense fallback={<p className="muted">Loading…</p>}>
        <Courses />
      </Suspense>
    </>
  )
}
