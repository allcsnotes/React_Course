import { useRef, useState, type ChangeEvent } from 'react'

type Box = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export default function CourseForm() {
  const renders = useRef(0)
  renders.current += 1
  const [form, setForm] = useState({
    title: '',
    price: '',
    level: 'beginner',
    description: '',
  })

  function handleChange(e: ChangeEvent<Box>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <main>
      <div className="top"><h1>New course</h1><span className="count">renders: {renders.current}</span></div>
      <form onSubmit={(e) => { e.preventDefault(); console.log(form) }}>
        <label className="wide">
          Title
          <input name="title" value={form.title} onChange={handleChange} />
        </label>
        <label>
          Price
          <input name="price" type="number" value={form.price} onChange={handleChange} />
        </label>
        <label>
          Level
          <select name="level" value={form.level} onChange={handleChange}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
        <label className="wide">
          Description
          <textarea name="description" value={form.description} onChange={handleChange} />
        </label>
        <div className="row"><button className="go">Create course</button></div>
      </form>
    </main>
  )
}
