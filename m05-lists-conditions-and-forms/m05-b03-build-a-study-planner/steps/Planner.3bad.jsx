import { useState } from 'react'
import AddTask from './AddTask'
import Filters from './Filters'
import TaskItem from './TaskItem'

export default function Planner() {
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')

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

  function changeFilter(id) {
    setFilter(id)
    if (id === 'done') {
      setTasks(tasks.filter(t => t.done))
    }
    if (id === 'active') {
      setTasks(tasks.filter(t => !t.done))
    }
  }

  return (
    <main className="planner">
      <h1>Study planner</h1>
      <AddTask onAdd={addTask} />
      <Filters
        current={filter}
        onChange={changeFilter}
      />
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
