import { useQuery } from '@tanstack/react-query'
import { getCourse } from './api'

type Props = { slug: string }

export default function CourseDetail({ slug }: Props) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['course'],
    queryFn: () => getCourse(slug),
  })

  if (isPending) return <p className="note">Loading...</p>
  if (isError) return <p className="bad">{error.message}</p>
  return (
    <section className="detail">
      <h2>{data.title}</h2>
      <p>by {data.teacher} · {data.lessons.length} lessons</p>
      <ol>
        {data.lessons.map(l => <li key={l.id}>{l.title}</li>)}
      </ol>
    </section>
  )
}
