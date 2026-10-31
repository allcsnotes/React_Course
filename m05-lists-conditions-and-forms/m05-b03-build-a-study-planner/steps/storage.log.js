const KEY = 'planner-tasks'

export function loadTasks() {
  console.log('loadTasks ran')
  try {
    const saved = localStorage.getItem(KEY)
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.warn(
      'Could not read saved tasks:',
      error.message,
    )
    return []
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(KEY, JSON.stringify(tasks))
}
