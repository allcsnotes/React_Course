import { useState } from 'react'
import { loadTasks, saveTasks } from '../storage'
import AddTask from './AddTask'
import Filters from './Filters'
import TaskItem from './TaskItem'

export default function Planner() {
  const [tasks, setTasks] = useState(loadTasks)
  const [filter, setFilter] = useState('all')

  function commit(next) {
    setTasks(next)
    saveTasks(next)
  }

  function addTask(text) {
    const task = {
      id: crypto.randomUUID(),
      text,
      done: false,
    }
    commit([...tasks, task])
  }

  function toggleTask(id) {
    commit(
      tasks.map(t =>
        t.id === id ? { ...t, done: !t.done } : t,
      ),
    )
  }

  function renameTask(id, text) {
    commit(
      tasks.map(t =>
        t.id === id ? { ...t, text } : t,
      ),
    )
  }

  function deleteTask(id) {
    commit(tasks.filter(t => t.id !== id))
  }

  function clearDone() {
    commit(tasks.filter(t => !t.done))
  }

  function show(task) {
    if (filter === 'done') return task.done
    if (filter === 'active') return !task.done
    return true
  }

  const visible = tasks.filter(show)
  const left = tasks.filter(t => !t.done).length
  const word = left === 1 ? 'task' : 'tasks'

  return (
    <main className="planner">
      <h1>Study planner</h1>
      <AddTask onAdd={addTask} />
      <Filters
        current={filter}
        onChange={setFilter}
      />
      <ul>
        {visible.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleTask}
            onRename={renameTask}
            onDelete={deleteTask}
          />
        ))}
      </ul>
      {visible.length === 0 && (
        <p className="empty">Nothing here.</p>
      )}
      <footer className="foot">
        <span>{left} {word} left</span>
        <button
          className="plain"
          onClick={clearDone}
        >
          Clear done
        </button>
      </footer>
    </main>
  )
}
