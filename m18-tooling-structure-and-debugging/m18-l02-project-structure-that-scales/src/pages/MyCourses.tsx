import { useQuery } from '@tanstack/react-query'
import { Navigate } from 'react-router'
import { getMyCourses } from '../api'
import { useAuth } from '../context/AuthContext'

export default function MyCourses() {
  const { user } = useAuth()
  const { data, isPending } = useQuery({
    queryKey: ['my-courses'],
    queryFn: getMyCourses,
    enabled: user !== null,
  })

  if (!user) return <Navigate to="/login" replace />

  return (
    <>
      <h1>Welcome, {user.name}</h1>
      {isPending ? (
        <p>Loading...</p>
      ) : (
        <ul className="lines">
          {data?.map((c) => (
            <li key={c.slug}>
              <span>{c.title}</span>
              <span>
                {c.completedCount} of {c.lessonCount} done
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
