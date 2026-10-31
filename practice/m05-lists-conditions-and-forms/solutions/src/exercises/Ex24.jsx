import { useState } from 'react'
import { courses as startCourses } from '../courses'

const emptyForm = { title: '', teacher: 'Asha', lessons: '', price: '' }

export default function Ex24() {
  const [courses, setCourses] = useState(startCourses)
  const [search, setSearch] = useState('')
  const [freeOnly, setFreeOnly] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (form.title.trim() === '') return setError('Title is required')
    if (form.lessons === '' || form.lessons <= 0) return setError('Lessons must be more than 0')
    if (form.price === '' || form.price < 0) return setError('Price cannot be negative')
    const price = Number(form.price)
    const course = {
      id: courses.length + 1,
      title: form.title.trim(),
      teacher: form.teacher,
      lessons: Number(form.lessons),
      price,
      free: price === 0,
    }
    setCourses([...courses, course])
    setForm(emptyForm)
    setError('')
  }

  const visible = courses.filter(
    (c) => c.title.toLowerCase().includes(search.toLowerCase()) && (!freeOnly || c.free),
  )

  return (
    <div>
      <div className="card">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses" />
        <label>
          <input type="checkbox" checked={freeOnly} onChange={(e) => setFreeOnly(e.target.checked)} /> Free only
        </label>
        <p>
          Showing {visible.length} of {courses.length} courses
        </p>
        {visible.length === 0 && <p>No courses match</p>}
        {visible.map((c) => (
          <div key={c.id}>
            {c.title} · {c.teacher} · {c.lessons} lessons · {c.free ? 'Free' : 'Rs ' + c.price}
          </div>
        ))}
      </div>
      <form className="card" onSubmit={handleSubmit}>
        <h3>Add a course</h3>
        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title" />
        <select name="teacher" value={form.teacher} onChange={handleChange}>
          <option>Asha</option>
          <option>Meera</option>
          <option>Rahul</option>
        </select>
        <input type="number" name="lessons" value={form.lessons} onChange={handleChange} placeholder="Lessons" />
        <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price (Rs)" />
        <button type="submit">Add course</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  )
}
