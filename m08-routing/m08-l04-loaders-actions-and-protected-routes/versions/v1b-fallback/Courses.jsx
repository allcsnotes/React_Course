import { useLoaderData } from 'react-router'

export async function loader() {
  const res = await fetch('/api/courses')
  return res.json()
}

export default function Courses() {
  const courses = useLoaderData()

  return (
    <div>
      <h2>Courses</h2>
      <ul>
        {courses.map(c => (
          <li key={c.id}>{c.title}</li>
        ))}
      </ul>
    </div>
  )
}
