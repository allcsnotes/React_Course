async function getJson(path) {
  const res = await fetch(path)
  if (!res.ok) throw new Response('Not found', { status: res.status })
  return res.json()
}

export const getCourses = () => getJson('/api/courses')
export const getCourse = slug => getJson(`/api/courses/${slug}`)
