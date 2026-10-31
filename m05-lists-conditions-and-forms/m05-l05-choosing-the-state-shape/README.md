# M05-L05 · Choosing the State Shape

> Video: Module 5, Lesson 5. Watch it first, then follow along here.

## What you'll learn

- Derived values: anything you can work out from state or props should be computed while drawing, not stored
- Why a stored copy goes stale (a filtered list, a selected object)
- Store an id, not a copy of the object
- Use one `status` string instead of several yes-or-no flags that can contradict each other
- When to use one object in state and when to use separate `useState` lines
- Four questions to ask before every `useState`

## Before you start

- Node 24 (`node --version`).
- Best after [M05-L04](../m05-l04-forms-and-validation/) and Module 4 (updating objects and arrays in state, lifting state up).
- No Docker needed.

## Files in this folder

`src/App.jsx` starts as `versions/v1-name-bug/App.jsx`. Copy any other version's `App.jsx` over `src/App.jsx` to try it. `src/api.js` is a pretend server used only by the status versions.

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | React 19.3.1, Vite 8.3.5 |
| `src/App.jsx`, `src/App.css`, `src/index.css`, `src/main.jsx` | The app and its styles |
| `src/courses.js` | The four shared courses, plus Python Pro for the Add button |
| `src/api.js` | A fake server: the first call fails, the second works. It never touches the network |
| `versions/v1-name-bug`, `v1b-name-fix` | Full name stored in state, then derived |
| `versions/v2-list-bug`, `v2b-list-fix` | A stored `filtered` list, then derived |
| `versions/v3-sel-bug`, `v3b-sel-fix` | A whole selected course, then a selected id |
| `versions/v4-status-bug`, `v4b-status-fix` | Three flags, then one `status` |
| `versions/v5-form`, `v5b-nospread` | One object for a form, and the missing spread |
| `versions/v6-planner` | The four questions applied to the study planner |

## Follow along

### 1. Set up

```bash
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`). Switch versions with `cp versions/<name>/App.jsx src/App.jsx`.

A derived value is worked out from something else, like the total on a receipt. If the shop writes the total on its own sticky note and a customer returns an item, the total no longer matches. State should hold only facts that cannot be worked out. Is it slow to recompute? No: React calls your function after every change and a small sum or filter takes no time.

### 2. Trap one: a stored full name (`v1-name-bug`)

Three `useState` lines: first name, last name and full name. `handleFirst` sets two states, `handleLast` forgets the second one.

`versions/v1-name-bug/App.jsx`:
```jsx
function handleFirst(e) {
  setFirstName(e.target.value)
  setFullName(e.target.value + ' ' + lastName)
}

function handleLast(e) {
  setLastName(e.target.value)
}

return (
  <div className="card">
    <h2>Sign up</h2>
    <label>First name
      <input value={firstName} onChange={handleFirst} />
    </label>
    <label>Last name
      <input value={lastName} onChange={handleLast} />
    </label>
    <p className="big">Hello, {fullName}!</p>
  </div>
```

Type `Asha` in the first box, then `Rao` in the last box. The real page text (the `[ ]` show the two boxes):

```text
start: Sign up | First name | Last name | Hello, ! [][]
click first: Sign up | First name | Last name | Hello, ! [][]
As: Sign up | First name | Last name | Hello, As ! [As][]
Asha: Sign up | First name | Last name | Hello, Asha ! [Asha][]
click last: Sign up | First name | Last name | Hello, Asha ! [Asha][]
R: Sign up | First name | Last name | Hello, Asha ! [Asha][R]
Rao: Sign up | First name | Last name | Hello, Asha ! [Asha][Rao]
```

The greeting says `Hello, Asha` and ignores the last name. Nothing crashed; the page just disagrees with itself.

### 3. Fix: derive it (`v1b-name-fix`)

Delete the `fullName` state and compute it in the body. A normal variable starts again on every draw, which is exactly what we want here.

`versions/v1b-name-fix/App.jsx`:
```jsx
const fullName = firstName + ' ' + lastName
```

```text
start: Sign up | First name | Last name | Hello, ! [][]
click first: Sign up | First name | Last name | Hello, ! [][]
As: Sign up | First name | Last name | Hello, As ! [As][]
Asha: Sign up | First name | Last name | Hello, Asha ! [Asha][]
click last: Sign up | First name | Last name | Hello, Asha ! [Asha][]
R: Sign up | First name | Last name | Hello, Asha R! [Asha][R]
Rao: Sign up | First name | Last name | Hello, Asha Rao! [Asha][Rao]
```

The greeting cannot be wrong now because it is never stored. Rule one: if you can work it out from state or props, do not store it.

### 4. Trap two: a stored filtered list (`v2-list-bug`)

The state holds `courses`, `query` and a third note, `filtered`. The search handler updates `filtered`, but the Add Python Pro button only updates `courses`. Type `py`, then press Add Python Pro:

```text
start: Add Python Pro | React for Beginners | Python from Zero | System Design | DevOps Basics | 4 courses in total []
click Search: Add Python Pro | React for Beginners | Python from Zero | System Design | DevOps Basics | 4 courses in total []
p: Add Python Pro | Python from Zero | DevOps Basics | 4 courses in total [p]
py: Add Python Pro | Python from Zero | 4 courses in total [py]
after Add Python Pro: Add Python Pro | Python from Zero | 5 courses in total [py]
```

The total went to 5 but the list did not change: `filtered` is a stale copy. The fix (`v2b-list-fix`) deletes it and filters in the body:

`versions/v2b-list-fix/App.jsx`:
```jsx
const text = query.toLowerCase()
const filteredCourses = courses.filter(c =>
  c.title.toLowerCase().includes(text)
)
```

```text
start: Add Python Pro | React for Beginners | Python from Zero | System Design | DevOps Basics | 4 courses in total []
click Search: Add Python Pro | React for Beginners | Python from Zero | System Design | DevOps Basics | 4 courses in total []
p: Add Python Pro | Python from Zero | DevOps Basics | 4 courses in total [p]
py: Add Python Pro | Python from Zero | 4 courses in total [py]
after Add Python Pro: Add Python Pro | Python from Zero | Python Pro | 5 courses in total [py]
```

State holds the raw facts (courses, query). Every list on screen is a view of them: a filter, a sort, a count.

### 5. Trap three: the same fact in two places (`v3-sel-bug`)

The whole picked course is stored as `selected`. Rename changes the list but not the stored copy. Click DevOps Basics, then Rename:

```text
start: React for Beginners | Python from Zero | System Design | DevOps Basics | Pick a course 
after DevOps Basics: React for Beginners | Python from Zero | System Design | DevOps Basics | DevOps Basics | by Asha | Rename 
after Rename: React for Beginners | Python from Zero | System Design | DevOps Basics Pro | DevOps Basics | by Asha | Rename 
```

The panel still says `DevOps Basics`. The fix (`v3b-sel-fix`): store only the id, and look the object up (a name tag, not a copy).

`versions/v3b-sel-fix/App.jsx`:
```jsx
const selectedCourse = courses.find(
  c => c.id === selectedId
)
```

```text
start: React for Beginners | Python from Zero | System Design | DevOps Basics | Pick a course 
after DevOps Basics: React for Beginners | Python from Zero | System Design | DevOps Basics | DevOps Basics | by Asha | Rename 
after Rename: React for Beginners | Python from Zero | System Design | DevOps Basics Pro | DevOps Basics Pro | by Asha | Rename 
```

If nothing is picked, `find` gives `undefined` and the ternary shows the `Pick a course` message.

### 6. Trap four: flags that contradict each other (`v4-status-bug`)

Three yes-or-no notes (`isLoading`, `isError`, `isSuccess`) can be combined in eight ways, but only four make sense. The fake server in `src/api.js` fails on the first call and works on the second. Press Load courses, wait, press it again:

```text
start: Load courses 
first press: Load courses | Loading... 
error: Load courses | Could not load. 
second press: Load courses | Loading... | Could not load. 
success: Load courses | Could not load. | React for Beginners | Python from Zero | System Design 
```

On the second press the page says `Loading...` and `Could not load.` at the same time: the code never switched the error off. The fix (`v4b-status-fix`) is one note with exactly one of four words, `idle`, `loading`, `error`, `done`:

`versions/v4b-status-fix/App.jsx`:
```jsx
async function load() {
  setStatus('loading')
  try {
    setItems(await fakeFetch())
    setStatus('done')
  } catch (err) {
    setStatus('error')
  }
}

```

```text
start: Load courses 
first press: Load courses | Loading... 
error: Load courses | Could not load. 
second press: Load courses | Loading... 
success: Load courses | React for Beginners | Python from Zero | System Design 
```

Make impossible states impossible to write. (Later, TypeScript can even refuse a fifth, mistyped word.)

### 7. One object or many `useState` lines? (`v5-form`, `v5b-nospread`)

Values that change on their own (watched, saved) get separate lines. Values that describe one thing and change together (a form, an x and y position) can share one object, updated with the spread.

`versions/v5-form/App.jsx`:
```jsx
const [form, setForm] = useState({
  title: '', teacher: ''
})
```

```text
start: New course | Title | Teacher | by [][]
click Title: New course | Title | Teacher | by [][]
Docker: New course | Title | Teacher | Docker by [Docker][]
click Teacher: New course | Title | Teacher | Docker by [Docker][]
As: New course | Title | Teacher | Docker by As [Docker][As]
Asha: New course | Title | Teacher | Docker by Asha [Docker][Asha]
```

Forget the spread (`v5b-nospread`) and typing the teacher loses the title:

```text
start: New course | Title | Teacher | by [][]
click Title: New course | Title | Teacher | by [][]
Docker: New course | Title | Teacher | Docker by [Docker][]
click Teacher: New course | Title | Teacher | Docker by [Docker][]
As: New course | Title | Teacher | by As [Docker][As]
Asha: New course | Title | Teacher | by Asha [Docker][Asha]
```

The console shows the same warning as in lesson three:

```text
A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components
```

### 8. The four questions (`v6-planner`)

Ask these in order every time you reach for `useState`:

1. Can I work it out from state or props I already have? Then it is not state.
2. Is the same fact stored in two places? Keep one: store the id.
3. Can two notes contradict each other? Merge them into one `status`.
4. Does a component beside it need the same value? Lift it to the closest shared parent, no higher.

The study planner (the next video) has tasks and a filter as facts; the visible tasks and the "left" count are derived.

`versions/v6-planner/App.jsx`:
```jsx
export default function App() {
  const [tasks, setTasks] = useState(start)
  const [filter, setFilter] = useState('all')

  function show(t) {
    if (filter === 'done') return t.done
    if (filter === 'open') return !t.done
    return true
  }
  const visible = tasks.filter(show)
  const left = tasks.filter(t => !t.done).length

  function toggle(id) {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  return (
    <div className="card">
      <h2>Study planner</h2>
      <div className="filters">
        {['all', 'open', 'done'].map(f => (
          <button key={f} className={filter === f ? 'on' : ''}
            onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <ul>
        {visible.map(t => (
          <li key={t.id} className={t.done ? 'done' : ''}>
            <span>{t.title}</span>
            <button onClick={() => toggle(t.id)}>{t.done ? 'Undo' : 'Check'}</button>
          </li>
        ))}
      </ul>
      <p className="small">{left} left</p>
    </div>
  )
}
```

Click Check on Practice arrays, then Open, then Done:

```text
start: Study planner | All | Open | Done | Read chapter 3 | Undo | Practice arrays | Check | Watch lesson 5 | Check | 2 left 
after Check: Study planner | All | Open | Done | Read chapter 3 | Undo | Practice arrays | Undo | Watch lesson 5 | Check | 1 left 
after Open: Study planner | All | Open | Done | Watch lesson 5 | Check | 1 left 
after Done: Study planner | All | Open | Done | Read chapter 3 | Undo | Practice arrays | Undo | 1 left 
```

Notice that the click handler only flips `done` on one task. Change the facts and let the screen follow.

Warning signs: a handler that sets two states just to keep them equal; a state whose name starts with `filtered`, `selected` or `total`; an effect that copies one state into another (Module 7, lesson three).

## Common mistakes

- Storing something you can compute (`fullName`, `filtered`, `total`).
- Keeping a copy of an object in state. Store its id.
- Several yes-or-no flags for one situation. Use one `status` string.
- Forgetting `...form` when updating one field of an object.

## Try it yourself

A shopping cart with a list of items, each with a price and a quantity. Which values need state? The items do. The total price and the number of items should not: compute them while drawing.

## Clean up

```bash
rm -rf node_modules dist
```

Press `Ctrl+C` to stop the dev server.

## Next

Continue with [M05-B03 · Build a Study Planner](../m05-b03-build-a-study-planner/).
