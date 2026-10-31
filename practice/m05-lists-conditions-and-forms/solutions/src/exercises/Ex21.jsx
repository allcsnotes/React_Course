import { useState } from 'react'

export default function Ex21() {
  const [form, setForm] = useState({ name: '', email: '', agree: false })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(null)

  function handleChange(e) {
    const { name, type, value, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const found = {}
    if (form.name.trim() === '') found.name = 'Please enter your name'
    if (!form.email.includes('@')) found.email = 'Email must contain @'
    if (!form.agree) found.agree = 'Please accept the terms'
    setErrors(found)
    if (Object.keys(found).length === 0) setDone(form.name.trim())
  }

  if (done) {
    return <p className="ok">Thanks, {done}! You are enrolled.</p>
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Enrol in React for Beginners</h3>
      <div>
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>
      <div>
        <input type="text" name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      <div>
        <label>
          <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} /> I accept the terms
        </label>
        {errors.agree && <span className="error"> {errors.agree}</span>}
      </div>
      <button type="submit">Enrol</button>
    </form>
  )
}
