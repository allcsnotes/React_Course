import { useState } from 'react'
import AddTask from './AddTask'

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

  return (
    <main className="planner">
      <h1>Study planner</h1>
      <AddTask onAdd={addTask} />
      <ul>
        {tasks.map(task => (
          <li key={task.id}>{task.text}</li>
        ))}
      </ul>
    </main>
  )
}
