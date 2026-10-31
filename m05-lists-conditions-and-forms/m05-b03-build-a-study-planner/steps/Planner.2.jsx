import { useState } from 'react'
import AddTask from './AddTask'
import TaskItem from './TaskItem'

export default function Planner() {
  const [tasks, setTasks] = useState([])

  function addTask(text) {
    const task = {
      id: crypto.randomUUID(),
      text,
      done: false,
    }
    setTasks([...tasks, task])
  }

  function toggleTask(id) {
    setTasks(
      tasks.map(t =>
        t.id === id ? { ...t, done: !t.done } : t,
      ),
    )
  }

  return (
    <main className="planner">
      <h1>Study planner</h1>
      <AddTask onAdd={addTask} />
      <ul>
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleTask}
          />
        ))}
      </ul>
    </main>
  )
}
