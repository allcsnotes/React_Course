const button = document.querySelector('#load')

async function loadCourses() {
  const res = await fetch('/api/courses')
  console.log(res.status)
  console.log(res.ok)
  console.log(res.headers.get('content-type'))
  const courses = await res.json()
  console.log(courses)
}

button.addEventListener('click', loadCourses)
