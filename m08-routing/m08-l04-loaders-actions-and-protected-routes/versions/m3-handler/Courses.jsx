import { useLoaderData } from 'react-router'

export async function loader() {
  const res = await fetch('/api/courses')
  const { ok, status } = res
  if (!ok) {
    const msg = 'Server answered ' + status
    throw new Response(msg, { status })
  }
  return res.json()
}

export default function Courses() {
  const courses = useLoaderData()

  async function enroll(id) {
    await fetch('/api/enrollments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ courseId: id }),
    })
  }

  return (
    <div>
      <h2>Courses</h2>
      <ul>
        {courses.map(c => (
          <li key={c.id}>
            <span>{c.title}</span>
            {c.enrolled ? (
              <span className="ok">Enrolled</span>
            ) : (
              <button onClick={() => enroll(c.id)}>Enroll</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
