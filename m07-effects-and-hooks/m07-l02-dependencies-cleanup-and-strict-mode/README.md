# M07-L02 · Dependencies, Cleanup and Strict Mode

> Video: Module 7, Lesson 2. Watch it first, then follow along here.

## What you'll learn

- The dependency array is a watch list: list every value the effect reads, or it keeps the old value (a stale effect)
- Let the linter (`npm run lint`) tell you what is missing
- Cleanup: the function you return from an effect, and when React calls it
- What StrictMode does in development (it runs effects twice on purpose), and why that is a gift
- Why an object or function in the array makes the effect run on every render, and how to fix it

## Before you start

- Node 24 (`node --version`).
- Best after [M07-L01](../m07-l01-useeffect-syncing-with-the-outside-world/).
- No Docker needed.

## Files in this folder

`src/App.jsx` starts as `versions/v1-stale/App.jsx`. `src/main.jsx` has StrictMode on, as Vite creates it (`versions/main/main-strict.jsx`); `versions/main/main-plain.jsx` is the same file without it.

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json`, `.oxlintrc.json` | React 19.3.1, Vite 8.3.5, oxlint with the hooks rules |
| `src/App.jsx`, `src/courses.js`, `src/App.css`, `src/index.css`, `src/main.jsx` | The app and its data |
| `versions/v1-stale`, `v1b-fixed` | A title effect with `[]` that reads props (stale), then fixed |
| `versions/v2-leak`, `v2b-clean` | A clock with no cleanup, then with `clearInterval` |
| `versions/v3-room` | A `Room` that prints `connect` and `disconnect` |
| `versions/v4-strict` | The Room under StrictMode |
| `versions/v4b-leak-strict`, `v4c-clean-strict` | The clock leak and its fix, shown by StrictMode |
| `versions/v5-object`, `v5b-inside` | An object in the dependency list, and moved inside the effect |
| `versions/main/` | `main-plain.jsx` and `main-strict.jsx` |

## Follow along

### 1. Set up

```bash
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`). Switch steps with `cp versions/<name>/App.jsx src/App.jsx`.

### 2. A stale effect (`v1-stale`)

The course page has three buttons: Python, React, DevOps. The page gets the course id as a prop, finds the course with `find`, and sets the tab title. The effect ends with `[]`: "run once, after the first draw, and never again".

`versions/v1-stale/App.jsx`:
```jsx
useEffect(() => {
  document.title =
    course.title + ' | allcsvideos'
}, [])

return <h2 className="big">{course.title}</h2>
```

The tab title starts at `Python from Zero | allcsvideos`. Click React, then DevOps: the page changes but the title stays on Python (stale). The real titles after load and two clicks:

```text
Python from Zero | allcsvideos
Python from Zero | allcsvideos
Python from Zero | allcsvideos
```

The array is the assistant's watch list: if travel time is not on the list, nobody redoes the job. The linter says so:

```bash
npm run lint
```

```text
  ! react-hooks(exhaustive-deps): React Hook useEffect has a missing dependency: 'course.title'
    ,-[src/App.jsx:13:6]
 11 |     document.title =
 12 |       course.title + ' | allcsvideos'
    :       ^^^|^^
    :          `-- useEffect uses `course.title` here
 13 |   }, [])
    :      ^^
  help: Either include it or remove the dependency array.
```

### 3. The fix (`v1b-fixed`)

The dependencies are every reactive value the effect reads (props, state, and anything worked out from them). Put `course.title` in the array:

`versions/v1b-fixed/App.jsx`:
```jsx
useEffect(() => {
  document.title =
    course.title + ' | allcsvideos'
}, [course.title])

return <h2 className="big">{course.title}</h2>
```

The real titles now follow the buttons:

```text
Python from Zero | allcsvideos
React for Beginners | allcsvideos
DevOps Basics | allcsvideos
```

Never silence the linter by deleting the array or the rule. Fix the list.

### 4. Cleanup (`v2-leak`, `v2b-clean`)

Some effects start something that keeps going: a timer, a listener, a connection. A tap left running keeps the water flowing. A Clock with a Show and Hide button starts a timer but never stops it:

`versions/v2-leak/App.jsx`:
```jsx
useEffect(() => {
  setInterval(() => {
    console.log('tick')
    setSeconds(s => s + 1)
  }, 1000)
}, [])

return <p className="big">Clock: {seconds} s</p>
```

Show the clock, then hide it: the console keeps printing `tick` even though the clock is gone, and in the video the ticks continued every second (about 1039 ms, 2038 ms, 3040 ms and so on). Fix it by returning a cleanup function from the effect (`v2b-clean`):

`versions/v2b-clean/App.jsx`:
```jsx
function Clock() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      console.log('tick')
      setSeconds(s => s + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return <p className="big">Clock: {seconds} s</p>
}
```

React calls the cleanup before running the effect again and when the component leaves the screen.

### 5. When exactly is cleanup called? (`v3-room`)

A small room, like joining a live class: the effect connects to the room and the cleanup disconnects.

`versions/v3-room/App.jsx`:
```jsx
function Room({ roomId }) {
  useEffect(() => {
    console.log('connect ' + roomId)
    return () => {
      console.log('disconnect ' + roomId)
    }
  }, [roomId])

  return <h2 className="big">Room: {roomId}</h2>
}
```

Switch from Python to React (StrictMode off, `main-plain.jsx`). The real console:

```text
connect python
disconnect python
connect react
disconnect react
```

The cleanup of the old room runs first, then the effect for the new one. `disconnect react` is the last line because the component left.

### 6. StrictMode (`v4-strict`)

`src/main.jsx` wraps the app in `<StrictMode>`. It only works while you develop: it draws twice, and it also runs every effect, cleanup and effect again once, on purpose, to check your cleanup. The real console of the Room under StrictMode (load, switch to React, hide):

```text
render python
render python
connect python
disconnect python
connect python
render react
render react
disconnect python
connect react
disconnect react
```

The doubled `connect python` / `disconnect python` / `connect python` is the test: if a connect/disconnect pair works twice in a row, your cleanup is right. The same applies to a leak: `v4b-leak-strict` (no cleanup) prints six `tick` lines where `v4c-clean-strict` (with cleanup) prints three. The double run is a gift: it shows a missing cleanup on day one. Production does not do it: a production build printed `render python, connect python, render react, disconnect python, connect react, disconnect react`, each once.

### 7. Objects in the list (`v5-object`, `v5b-inside`)

The watch list compares each value with its value from the last draw. Text and numbers are easy (`'python' === 'python'`). But two objects with the same contents are still two different boxes (Module 2). This `Room` builds `options` in the body and lists it:

`versions/v5-object/App.jsx`:
```jsx
function Room({ roomId }) {
  const options = { roomId: roomId }

  useEffect(() => {
    console.log('connect ' + options.roomId)
    return () => {
      console.log('disconnect ' + options.roomId)
    }
  }, [options])

  return <h2 className="big">Room: {roomId}</h2>
}

export default function App() {
  const [message, setMessage] = useState('')

  return (
    <div className="card">
      <Room roomId="python" />
      <label>Message
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
```

A new object is made on every draw, so the effect disconnects and reconnects on every render:

```text
connect python
disconnect python
connect python
disconnect python
connect python
```

The linter warns: `React hook useEffect depends on `options`, which changes every render`. The fix (`v5b-inside`) is to make the object inside the effect and depend on the primitive `roomId`. The console then prints a single `connect python`.

## Common mistakes

- `[]` while the effect reads props or state: it keeps the old values.
- Silencing the linter instead of fixing the list.
- Starting a timer, listener or connection and forgetting the cleanup (StrictMode shows it twice).
- An object or function declared in the component body, in the dependency array.

## Clean up

```bash
rm -rf node_modules dist
```

Press `Ctrl+C` to stop the dev server.

## Next

Continue with [M07-L03 · You Might Not Need an Effect](../m07-l03-you-might-not-need-an-effect/).
