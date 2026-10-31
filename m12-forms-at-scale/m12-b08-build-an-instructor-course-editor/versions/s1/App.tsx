import { useQuery } from '@tanstack/react-query'
import { getCourse } from './api.ts'

export default function App() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['course'],
    queryFn: getCourse,
  })
  return (
    <>
      <header className="top">
        <span>allcsvideos · Instructor studio</span>
        <span className="who">Meera</span>
      </header>
      <main>
        {isPending && (
          <p className="note">Loading the course...</p>
        )}
        {isError && <p className="bad">{error.message}</p>}
        {data && <h1>{data.title}</h1>}
      </main>
    </>
  )
}
