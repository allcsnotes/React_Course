export type Course = {
  slug: string
  title: string
  teacher: string
  price: number
  enrolled: boolean
}

export async function getCourses(): Promise<Course[]> {
  const res = await fetch('/api/courses')
  if (!res.ok) throw new Error('Could not load courses')
  return res.json()
}

export async function enroll(slug: string): Promise<Course> {
  const res = await fetch('/api/enrollments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug }),
  })
  if (!res.ok) throw new Error((await res.json()).error)
  return res.json()
}
