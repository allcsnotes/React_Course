import { redirect, useLoaderData } from 'react-router'
import { isSignedIn } from './auth.js'

export async function loader({ request }) {
  if (!isSignedIn()) {
    const next = new URL(request.url).pathname
    redirect('/login?next=' + next)
  }
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
