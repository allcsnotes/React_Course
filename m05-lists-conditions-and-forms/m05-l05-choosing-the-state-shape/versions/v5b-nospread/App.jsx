import { useState } from 'react'
import './App.css'

export default function App() {
  const [form, setForm] = useState({
    title: '', teacher: ''
  })

  function handleTitle(e) {
    setForm({ ...form, title: e.target.value })
  }

  function handleTeacher(e) {
    setForm({ teacher: e.target.value })
  }

  return (
    <div className="card">
      <h2>New course</h2>
      <label>Title
        <input value={form.title} onChange={handleTitle} />
      </label>
      <label>Teacher
        <input value={form.teacher} onChange={handleTeacher} />
      </label>
      <p className="big">{form.title} by {form.teacher}</p>
    </div>
  )
}
