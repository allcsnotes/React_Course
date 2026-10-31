export async function peek() {
  const res = await fetch('/api/courses')
  const data = await res.json()
  return data.nothing.here.at.all
}
