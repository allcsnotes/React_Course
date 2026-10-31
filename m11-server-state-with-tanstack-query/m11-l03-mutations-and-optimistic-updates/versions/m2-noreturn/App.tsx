import { useQuery } from '@tanstack/react-query'
import { getCourses } from './api'
import { EnrollButton } from './EnrollButton'

export default function App() {
  const { data: courses, isPending, isError } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  })

  if (isPending) return <p className="note">Loading courses…</p>
  if (isError) return <p className="note">Could not load courses</p>

  const mine = courses.filter((c) => c.enrolled).length

  return (
    <>
      <header>
        <strong>allcsvideos</strong>
        <span className="mine">My courses: {mine}</span>
      </header>
      <main>
        <ul className="grid">
          {courses.map((c) => (
            <li className="card" key={c.slug}>
              <h2>{c.title}</h2>
              <p>by {c.teacher} · {c.price ? `Rs ${c.price}` : 'Free'}</p>
              <EnrollButton course={c} />
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
