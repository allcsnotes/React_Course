import { Form, useLoaderData } from 'react-router'

export async function loader() {
  const res = await fetch('/api/courses')
  const { ok, status } = res
  if (!ok) {
    const msg = 'Server answered ' + status
    throw new Response(msg, { status })
  }
  return res.json()
}

export async function action({ request }) {
  const form = await request.formData()
  const courseId = Number(form.get('courseId'))
  await fetch('/api/enrollments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ courseId }),
  })
  return null
}

export default function Courses() {
  const courses = useLoaderData()

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
              <Form method="post">
                <input
                  type="hidden"
                  name="courseId"
                  value={c.id}
                />
                <button>Enroll</button>
              </Form>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
