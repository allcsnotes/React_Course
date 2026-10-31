import { useQuery } from '@tanstack/react-query'
import { getCourse } from './api.ts'
import CourseForm from './CourseForm.tsx'

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
        {data && <CourseForm initial={data} />}
      </main>
    </>
  )
}
