import { useState } from 'react'

export default function TaskItem({
  task,
  onToggle,
  onRename,
  onDelete,
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(task.text)
  const cls = task.done ? 'text done' : 'text'

  function startEdit() {
    setDraft(task.text)
    setEditing(true)
  }

  function save(e) {
    e.preventDefault()
    const clean = draft.trim()
    if (clean !== '') onRename(task.id, clean)
    setEditing(false)
  }

  function handleChange(e) {
    setDraft(e.target.value)
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') setEditing(false)
  }

  if (editing) {
    return (
      <li className="task">
        <form className="editing" onSubmit={save}>
          <input
            autoFocus
            value={draft}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
        </form>
      </li>
    )
  }

  return (
    <li className="task">
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
      />
      <span
        className={cls}
        onDoubleClick={startEdit}
      >
        {task.text}
      </span>
      <button onClick={startEdit}>Edit</button>
      <button onClick={() => onDelete(task.id)}>
        Delete
      </button>
    </li>
  )
}
