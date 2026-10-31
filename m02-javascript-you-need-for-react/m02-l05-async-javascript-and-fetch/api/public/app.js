const button = document.querySelector('#load')
const message = document.querySelector('#message')
const list = document.querySelector('#list')

async function loadCourses() {
  message.textContent = 'Loading...'
  list.innerHTML = ''
  try {
    const res = await fetch('/api/courses')
    if (!res.ok) {
      throw new Error(`the server said ${res.status}`)
    }
    const courses = await res.json()
    message.textContent = `${courses.length} courses`
    const rows = courses.map((c) => `<li>${c.title}</li>`)
    list.innerHTML = rows.join('')
  } catch (error) {
    const text = `Could not load courses: ${error.message}`
    message.textContent = text
  }
}

button.addEventListener('click', loadCourses)
