const KEY = 'planner-tasks'

export function loadTasks() {
  const saved = localStorage.getItem(KEY)
  return saved ? JSON.parse(saved) : []
}

export function saveTasks(tasks) {
  localStorage.setItem(KEY, tasks)
}
