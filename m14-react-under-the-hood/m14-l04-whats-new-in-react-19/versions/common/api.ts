export type Course = {
  slug: string
  title: string
  teacher: string
  price: number
}

export async function getCourses(): Promise<Course[]> {
  const res = await fetch('/api/courses')
  if (!res.ok) throw new Error('Could not load courses')
  return res.json()
}

export async function joinWaitlist(email: string): Promise<string> {
  const res = await fetch('/api/waitlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) throw new Error((await res.json()).error)
  return (await res.json()).email
}
