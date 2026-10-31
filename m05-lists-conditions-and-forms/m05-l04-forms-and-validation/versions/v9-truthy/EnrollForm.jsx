import { useState } from 'react'
import courses from './data/courses.js'

const empty = {
  name: '',
  email: '',
  course: '',
  agree: false,
}

function validate(form) {
  const errors = {}

  if (form.name.trim() === '') {
    errors.name = 'Name is required'
  } else if (form.name.trim().length < 2) {
    errors.name = 'Enter at least 2 letters'
  }

  if (form.email === '') {
    errors.email = 'Email is required'
  } else if (!form.email.includes('@')) {
    errors.email = 'Email needs an @'
  }

  if (form.course === '') {
    errors.course = 'Please choose a course'
  }

  if (!form.agree) {
    errors.agree = 'Please accept the terms'
  }

  return errors
}

export default function EnrollForm() {
  const [form, setForm] = useState(empty)
  const [sent, setSent] = useState(null)
  const errors = validate(form)
  const isValid = Object.keys(errors).length === 0

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    console.log('errors is', errors)
    if (errors) return
    console.log('submitted', form)
    setSent(form)
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
      {sent && (
        <p className="thanks">
          Thanks, {sent.name}! We sent a
          confirmation to {sent.email}.
        </p>
      )}
    </>
  )
}
