import { useQuery } from '@tanstack/react-query'
import { getMyCourses } from './api.ts'

export default function Dashboard() {
  const { data, error, isPending } = useQuery({
    queryKey: ['my-courses'],
    queryFn: getMyCourses,
  })
  if (isPending) return <p className="note">Loading your courses...</p>
  if (error) return <p className="bad">{error.message}</p>
  return (
    <>
      <h1>My courses</h1>
      <ul className="grid">
        {data.map((c) => (
          <li className="card" key={c.slug}>
            <h2>{c.title}</h2>
            <p>{c.completedCount} of {c.lessonCount} lessons</p>
          </li>
        ))}
      </ul>
    </>
  )
}
