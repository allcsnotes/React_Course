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
  const [touched, setTouched] = useState({})
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

  function handleBlur(e) {
    setTouched({
      ...touched,
      [e.target.name]: true,
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setTouched({
      name: true,
      email: true,
      course: true,
      agree: true,
    })
    if (!isValid) return
    console.log('submitted', form)
    setSent(form)
  }

  return (
    <>
      <form
        className="card"
        onSubmit={handleSubmit}
        noValidate
      >
        <h2>Enroll in a course</h2>
        <div className="grid">
          <label>
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {touched.name && errors.name && (
              <p className="error">{errors.name}</p>
            )}
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {touched.email && errors.email && (
              <p className="error">{errors.email}</p>
            )}
          </label>
          <label>
            Course
            <select
              name="course"
              value={form.course}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            >
              <option value="">Choose a course</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            {touched.course && errors.course && (
              <p className="error">{errors.course}</p>
            )}
          </label>
          <label className="check">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            I accept the terms
            {touched.agree && errors.agree && (
              <p className="error">{errors.agree}</p>
            )}
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
