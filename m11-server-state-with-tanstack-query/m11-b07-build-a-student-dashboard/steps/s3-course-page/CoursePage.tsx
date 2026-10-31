import { Link, useParams } from 'react-router'
import { useCourse } from './queries.ts'
import ProgressBar from './ProgressBar.tsx'

export default function CoursePage() {
  const { slug = '' } = useParams()
  const { data, isPending, isError, error } = useCourse(slug)

  if (isPending) return <p className="note">Loading the course...</p>
  if (isError) return <p className="bad">{error.message}</p>

  const done = data.lessons.filter((l) => l.done).length
  return (
    <>
      <Link to="/">All my courses</Link>
      <h1>{data.title}</h1>
      <ProgressBar done={done} total={data.lessons.length} />
      <ul className="lessons">
        {data.lessons.map((l) => (
          <li key={l.id}>
            <span className="t">{l.title}</span>
            <span className="meta">{l.minutes} min</span>
            <span className={l.done ? 'tag done' : 'tag'}>
              {l.done ? 'Done' : 'To do'}
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}
