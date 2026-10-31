async function main() {
  const res = await fetch('http://localhost:5125/api/course')
  console.log(res.status, res.ok)
  const courses = await res.json()
  console.log(courses)
  courses.map((c) => c.title)
}
main()
