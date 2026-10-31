import { useState } from 'react'

export default function AddTask({ onAdd }) {
  const [text, setText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const clean = text.trim()
    if (clean === '') return
    onAdd(clean)
    setText('')
  }

  return (
    <form className="add" onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="What will you study?"
      />
      <button type="submit">Add</button>
    </form>
  )
}
