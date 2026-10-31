import { Link } from 'react-router'
import { useMyCourses } from './queries.ts'
import ProgressBar from './ProgressBar.tsx'

export default function Dashboard() {
  const { data, isPending, isError, error, refetch } = useMyCourses()

  if (isPending) return <p className="note">Loading your courses...</p>
  if (isError) {
    return (
      <div className="bad">
        <p>{error.message}</p>
        <button onClick={() => refetch()}>Try again</button>
      </div>
    )
  }

  return (
    <>
      <h1>My courses</h1>
      <ul className="grid">
        {data.map((c) => (
          <li key={c.slug} className="card">
            <h2>
              <Link to={`/course/${c.slug}`}>{c.title}</Link>
            </h2>
            <p>by {c.teacher}</p>
            <ProgressBar done={c.completedCount} total={c.lessonCount} />
          </li>
        ))}
      </ul>
    </>
  )
}
