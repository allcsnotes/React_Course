import { useLoaderData } from 'react-router'

export async function loader() {
  const res = await fetch('/api/my-courses')
  return res.json()
}

export default function MyCourses() {
  const courses = useLoaderData()

  return (
    <div>
      <h2>My courses</h2>
      <ul>
        {courses.map(c => (
          <li key={c.id}>{c.title}</li>
        ))}
      </ul>
    </div>
  )
}
