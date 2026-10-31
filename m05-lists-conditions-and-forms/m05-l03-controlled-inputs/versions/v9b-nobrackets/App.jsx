import { useState } from 'react'

function App() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    news: false,
  })

  function handleChange(e) {
    const { name, type, value, checked } = e.target
    setForm({
      ...form,
      name: type === 'checkbox' ? checked : value,
    })
  }

  return (
    <div className="page">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <label className="row">
        <input
          name="news"
          type="checkbox"
          checked={form.news}
          onChange={handleChange}
        />
        Send me updates
      </label>
      <p className="out">Hello, {form.name}!</p>
    </div>
  )
}

export default App
