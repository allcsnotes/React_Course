import { useState } from 'react'
import courses from './data/courses.js'

const empty = {
  name: '',
  email: '',
  course: '',
  agree: false,
}

export default function EnrollForm() {
  const [form, setForm] = useState(empty)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  function handleSubmit(e) {
    console.log('submitted', form)
  }

  return (
    <>
      <form
        className="card"
        onSubmit={handleSubmit}
      >
        <h2>Enroll in a course</h2>
        <div className="grid">
          <label>
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </label>
          <label>
            Email
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </label>
          <label>
            Course
            <select
              name="course"
              value={form.course}
              onChange={handleChange}
            >
              <option value="">Choose a course</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>
          <label className="check">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
            />
            I accept the terms
          </label>
        </div>
        <button>Enroll</button>
      </form>
    </>
  )
}
