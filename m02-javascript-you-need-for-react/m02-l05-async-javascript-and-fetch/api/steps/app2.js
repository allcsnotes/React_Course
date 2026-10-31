const button = document.querySelector('#load')
const message = document.querySelector('#message')
const list = document.querySelector('#list')

async function loadCourses() {
  message.textContent = 'Loading...'
  const res = await fetch('/api/course')
  const courses = await res.json()
  message.textContent = `${courses.length} courses`
  const rows = courses.map((c) => `<li>${c.title}</li>`)
  list.innerHTML = rows.join('')
}

button.addEventListener('click', loadCourses)
