# M05-B03 · Build a Study Planner

> Video: Module 5, Build 3. Watch it first, then follow along here.

## What you'll build

A study planner: add a task in a form, tick it off, filter by All / Active / Done, see how many tasks are left, edit a task in place (double click or Edit, Enter saves, Escape cancels), delete a task, clear all finished tasks, and keep everything saved in the browser so a refresh brings it back. It uses everything from Module 5: lists and keys, controlled inputs, forms, conditional rendering and the state shape.

## Before you start

- Node 24 (`node --version`).
- Best after M05-L01 to [M05-L05](../m05-l05-choosing-the-state-shape/).
- No Docker needed. The planner never calls a server: it saves to the browser's `localStorage`.

## Files in this folder

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | React 19.3.1, Vite 8.3.5 |
| `index.html`, `vite.config.js`, `.oxlintrc.json` | Vite page, config and lint config |
| `src/main.jsx` | Starts React |
| `src/App.jsx` | Renders `Planner` |
| `src/components/Planner.jsx` | The boss: owns the tasks and the filter |
| `src/components/AddTask.jsx` | The add form |
| `src/components/Filters.jsx` | The three filter buttons |
| `src/components/TaskItem.jsx` | One task row: tick, text, edit in place, delete |
| `src/storage.js` | `loadTasks` and `saveTasks` (localStorage) |
| `src/index.css` | The pasted style (styling is Module 6) |
| `steps/` | The files as they were at each stage of the video, including the two "bad" versions |

## Run it

```bash
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`). Real page text at the very start (no tasks yet):

```text
Study planner | Add | All | Active | Done | Nothing here. | 0 tasks left | Clear done
```

## Build it step by step

### 1. Sketch and components

The mockup has a heading, a text box with Add, three filter buttons, the task rows (check box, text, Edit, Delete) and a footer with "N tasks left" and Clear done. A task is a small object: `{ id, text, done }`, with the id from `crypto.randomUUID()`.

As a tree: `App` holds `Planner`; `Planner` holds `AddTask`, `Filters` and a `TaskItem` per task. One component, one job, one file: `AddTask` collects text, `Filters` shows three buttons, `TaskItem` shows one task and knows how to edit itself, `Planner` is the boss and owns the list.

### 2. Who owns what (the four questions from M05-L05)

- The tasks: a fact, so state. The filter (`all`, `active`, `done`): a fact, so state. Two notes, both in `Planner`.
- The visible tasks and the "left" count: derived, never stored.
- The text in the add box: only `AddTask` needs it, so it keeps it itself. Each `TaskItem` keeps two small notes of its own: `editing` and `draft`.
- Props go down, events go up: `Planner` passes each task and handlers such as `onToggle` and `onDelete`.

Start from a fresh Vite React project (as in Module 1), clean the starter, paste `steps/index.0.css`, and use `steps/App.0.jsx`, an App that only says "nothing here yet".

### 3. Step one: add a task

`AddTask` is a form with a controlled input. `trim()` cuts the spaces, and an empty result is refused.

`src/components/AddTask.jsx`:
```jsx
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
```

In `Planner` the first version (`steps/Planner.1.jsx`) holds `tasks` and builds the new task with the spread. Typing `watch the props lesson` and pressing Enter adds it, and the Add button works too, because both send the form. Three spaces and Enter does nothing.

### 4. Step two: the list and the check box

`TaskItem` gets two props, `task` and `onToggle`. The check box does not own its tick: the task does. A ternary picks the class `text done` (a line through the text). `toggleTask` in `Planner` builds a new array with `map` and flips `done` on the matching id (`steps/Planner.2.jsx`, `steps/TaskItem.2.jsx`).

### 5. Step three: filters and the counter

`src/components/Filters.jsx`:
```jsx
const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'done', label: 'Done' },
]

export default function Filters({
  current,
  onChange,
}) {
  return (
    <div className="filters">
      {FILTERS.map(f => (
        <button
          key={f.id}
          className={f.id === current ? 'on' : ''}
          onClick={() => onChange(f.id)}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
```

The first version (`steps/Planner.3bad.jsx`) cut the list down inside the filter click. That is trap one from M05-L05: click Done, then All, and two tasks are gone for good. The fix keeps the filter as only a word and works the list out while drawing:

`src/components/Planner.jsx`:
```jsx
function show(task) {
  if (filter === 'done') return task.done
  if (filter === 'active') return !task.done
  return true
}

const visible = tasks.filter(show)
const left = tasks.filter(t => !t.done).length
const word = left === 1 ? 'task' : 'tasks'
```

`show`, `visible`, `left`, and the footer word `task` / `tasks` are all derived. `visible.length === 0` is a real yes or no on the left of `&&`, so no stray zero.

### 6. Step four: edit in place and delete

`TaskItem` has `editing` and `draft`. Both hooks sit at the top, before the early return.

`src/components/TaskItem.jsx`:
```jsx
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
```

Enter needs no code: the edit box is inside a form, so Enter submits it. Escape is handled by `handleKeyDown`.

The key must be the task id. With `key={index}` (`steps/Planner.4bad.jsx`), pressing Edit on the second task and then deleting the first leaves the edit box on the wrong row, because the memory (`editing`, `draft`) belongs to position one. With `key={task.id}` the box stays on its own task.

### 7. Step five: save in the browser

`localStorage` holds only text, so use `JSON.stringify` to save and `JSON.parse` to load, with `try` and `catch`.

`src/storage.js`:
```js
const KEY = 'planner-tasks'

export function loadTasks() {
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
```

In `Planner`, `useState(loadTasks)` is a lazy initial value: pass the function itself, not `loadTasks()`. React calls it once. Every handler ends with `commit(newList)`, which sets the state and saves. (With `loadTasks()` in brackets the video counted 10 reads instead of 2.)

The mistake is saving without `JSON.stringify` (`steps/storage.bad.js`). The shelf then holds the text `[object Object]`, and after a refresh the page is blank with `Uncaught SyntaxError: ... is not valid JSON`. The fix is `JSON.stringify`, plus `try` and `catch` so bad old text only warns and the planner starts empty.

### 8. Test it like a user

A real Playwright run against this exact project (4 tasks added, one empty attempt of three spaces ignored):

```text
4 added: watch the props lesson | read chapter 3 | practice arrays | write notes | 4 tasks left
ticked 1 and 3: ... | 2 tasks left
filter Active: read chapter 3 | write notes | 2 tasks left
filter Done: watch the props lesson | practice arrays | 2 tasks left
filter All: all four tasks | 2 tasks left
double click "read chapter 3", add " again", Enter: read chapter 3 again
Clear done: read chapter 3 again | write notes | 2 tasks left
```

What `localStorage` holds (the ids are random, yours will differ):

```json
[{"id":"47667456-d9e2-4618-a190-bd1a583759e5","text":"read chapter 3 again","done":false},{"id":"9165905c-c60c-4dee-b719-7135607f0aa8","text":"write notes","done":false}]
```

After a page refresh both tasks are back with their ticks and the counter still says `2 tasks left`.

### 9. The limits of localStorage

- It belongs to one browser on one computer. A fresh browser (Lukas's phone) shows zero tasks.
- No sync between tabs or devices, and anyone with the browser tools can read or change it. Never keep a password or anything private in it.
- It is small: in the video four blocks of about one million characters fit and the fifth failed with `quota exceeded` (about 5 million characters).

## Your turn

1. Due dates: give every task a date with a controlled date input and show it in the row. Hint: tasks already saved have no date, so your code must cope with `undefined`.
2. Drag to reorder: the order of the array is the order on screen, so reordering means making a new array with one task moved. Hint: start with two buttons, Up and Down.

## Common mistakes

- Keeping a filtered copy of the list in state. Keep the filter word only.
- `key={index}`: edit and draft memory moves to the wrong task.
- Saving without `JSON.stringify`, or loading without `try` and `catch`.
- `useState(loadTasks())` instead of `useState(loadTasks)`: reads storage on every draw.

## Clean up

```bash
rm -rf node_modules dist
```

In the browser you can remove the saved list with `localStorage.removeItem('planner-tasks')` in the console. Press `Ctrl+C` to stop the dev server.

## Next

Continue with [M05 Practice Sheet](../../practice/m05-lists-conditions-and-forms/), then Module 6, [M06-L01 · Plain CSS and CSS Modules](../../m06-styling-react-apps/m06-l01-plain-css-and-css-modules/).
