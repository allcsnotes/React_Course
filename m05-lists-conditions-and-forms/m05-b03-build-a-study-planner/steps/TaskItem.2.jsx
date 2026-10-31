export default function TaskItem({
  task,
  onToggle,
}) {
  const cls = task.done ? 'text done' : 'text'

  return (
    <li className="task">
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
      />
      <span className={cls}>
        {task.text}
      </span>
    </li>
  )
}
