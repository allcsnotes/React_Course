async function main() {
  const res = await fetch('http://localhost:5125/api/courses')
  const courses = res.json()
  console.log(courses.length)
  console.log(courses)
}
main()
