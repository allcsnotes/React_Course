# M07-L06 · Custom Hooks

> Video: Module 7, Lesson 6. Watch it first, then follow along here.

## What you'll learn

- A custom hook is a recipe card: a function whose name starts with `use` and that calls other hooks
- `useLocalStorage(key, initial)`: state that survives a refresh
- `useDebounce(value, delay)`: wait until typing pauses before searching
- `useFetch(url)`: `{ data, status, error }` with the abort cleanup from lesson 5
- Hooks share logic, not data: every call gets its own state
- The two rules of hooks, and why the name must start with `use`
- When a plain function is enough (`formatPrice`)

## Before you start

- Node 24 (`node --version`).
- Best after [M07-L05](../m07-l05-fetching-data-in-an-effect/) (the fetch effect) and M07-L01 to M07-L04.
- No Docker needed. `api/server.mjs` is a tiny local Node script on port 8176 for the `useFetch` steps; it never calls the internet.

## Files in this folder

`src/` holds `versions/v2-hook` (the settings page with `useLocalStorage`). For any other step copy that version folder's files into `src/`: `cp -R versions/<name>/. src/`.

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | React 19.3.1, Vite 8.3.5 |
| `api/server.mjs` | The local stand-in API on port 8176 (`/api/courses?q=&delay=&fail=`) |
| `src/App.jsx`, `src/useLocalStorage.js`, `src/App.css`, `src/index.css`, `src/main.jsx` | The settings page and its hook |
| `versions/v1-dup` | Three boxes that each repeat the storage code |
| `versions/v2-hook` | The same page with `useLocalStorage` |
| `versions/v3-samekey` | Two boxes sharing one key |
| `versions/v4a-nodebounce`, `v4-debounce` | A search with no debounce, then with `useDebounce` |
| `versions/v5-fetch`, `v5b-fail` | `useFetch`, and a failing request |
| `versions/v6-race`, `v7-search` | `useFetch` with the abort cleanup, and the search page using all three hooks |
| `versions/v8-ifbug`, `v8b-iffix` | A hook inside `if` (broken), then fixed |
| `versions/v9-handler` | A hook inside an event handler (broken) |
| `versions/v10-format` | `formatPrice`, a plain function that needs no hook |

## Follow along

### 1. Set up

```bash
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`). For the fetch steps run the stand-in server in a second terminal:

```bash
node api/server.mjs
```

```text
api on 8176
```

### 2. The repeated code (`v1-dup`)

The settings page has three boxes: a name, a study note and a goal. Type `Asha`, `Hooks`, `three lessons`, then refresh the browser: everything is still there. It works, but each box repeats the same storage code, like three bakers each keeping their own copy of the dough recipe. A custom hook is the recipe card: write it once, every component follows it.

### 3. `useLocalStorage` (`v2-hook`)

Look at what the copies share. `useState` starts with a function that reads the saved text from `localStorage` and, if something is there, turns it back into a value with `JSON.parse`. Then an effect saves the value with `JSON.stringify` whenever it changes.

`src/useLocalStorage.js`:
```js
import { useState, useEffect } from 'react'

export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : initial
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
```

The page now has one line per box:

`src/App.jsx`:
```jsx
export default function App() {
  return (
    <div className="card">
      <h2>Settings</h2>
      <NameBox />
      <NoteBox />
      <GoalBox />
    </div>
  )
}
```

The real values saved in the browser after typing (`name: "Asha"`) survive the refresh.

### 4. Hooks share logic, not data (`v3-samekey`)

If three components call `useLocalStorage`, do they share one value? No: every call is separate, because every copy of a component has its own notes (M04-L02). A custom hook adds nothing new. In `v3-samekey` two boxes call the hook with the same key: typing in the first box does not change the second box on the page, because each call has its own state.

### 5. `useDebounce` (`v4a-nodebounce`, `v4-debounce`)

A search box that searches on every key: type `react` and the console shows five searches, four of them thrown away a moment later (a real server pays for every one).

```text
search for r
search for re
search for rea
search for reac
search for react
```

The elevator door waits a few seconds in case another person comes; each new person restarts the wait. `useDebounce` returns the value only after it has stopped changing for `delay` milliseconds:

`versions/v4-debounce/useDebounce.js`:
```js
import { useState, useEffect } from 'react'

export function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounced(value)
    }, delay)
    return () => clearTimeout(id)
  }, [value, delay])

  return debounced
}
```

The cleanup clears the old timer on every new keystroke. Typing `react` (keys at 0, 300, 600, 900 and 1200 ms) now prints a single line, about 400 ms after the last key:

```text
search for react
```

### 6. `useFetch` (`v5-fetch`, `v5b-fail`, `v6-race`)

The effect from lesson 5, with its loading, error and data states, becomes `useFetch(url)`. It returns an object with `data`, `status` (one word: `loading`, `success` or `error`) and `error`.

`versions/v6-race/useFetch.js`:
```js
import { useState, useEffect } from 'react'

export function useFetch(url) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) {
          throw new Error(
            'Server answered ' + res.status
          )
        }
        return res.json()
      })
      .then(json => {
        setData(json)
        setStatus('success')
      })
      .catch(err => {
        if (err.name === 'AbortError') return
        setError(err.message)
        setStatus('error')
      })

    return () => controller.abort()
  }, [url])

  return { data, status, error }
}
```

With the failing address `http://localhost:8176/api/courses?fail=500` (`v5b-fail`) the page shows the error and the console prints `Failed to load resource: the server responded with a status of 500 (Internal Server Error)`. The abort cleanup (`v6-race`) stops an old slow request from overwriting a newer one.

### 7. All three together (`v7-search`)

`versions/v7-search/App.jsx`:
```jsx
export default function App() {
  const [text, setText] = useState('')
  const debounced = useDebounce(text, 400)
  const api = 'http://localhost:8176/api/courses'
  const { data, status, error } = useFetch(
    `${api}?q=${debounced}&delay=600`
  )

  return (
    <div className="card">
      <h2>Search courses</h2>
      <input
        placeholder="Search"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      {status === 'loading' && <p className="note">Searching...</p>}
      {status === 'error' && <p className="err">{error}</p>}
```

Type in the box: the text updates at once, `useDebounce` waits 400 ms, and only then does `useFetch` ask the server for `?q=...&delay=600`.

### 8. The rules of hooks (`v8-ifbug`, `v8b-iffix`, `v9-handler`)

Custom hooks follow the same two rules as every hook: call hooks at the top level (never in a loop, a condition or a nested function), and only from a component or another hook.

**A hook inside `if` (`v8-ifbug`).** To keep a note only when a box is ticked, Asha calls `useLocalStorage` inside an `if`. Tick the box and the page goes blank:

```text
React has detected a change in the order of Hooks called by App. This will lead to bugs and errors if not fixed. ...
Error: Rendered more hooks than during the previous render.
```

The linter finds it before you run the page (`npm run lint`):

```text
src/App.jsx:9:29: error react-hooks(rules-of-hooks): React Hook "useLocalStorage" is called conditionally. React Hooks must be called in the exact same order in every component render. help: Move the Hook call before the condition, or call it unconditionally and branch inside the Hook/effect instead.
```

The fix (`v8b-iffix`): call the hook at the top, branch in the JSX.

```diff
@@ -5,9 +5,6 @@
 export default function App() {
   const [keep, setKeep] = useState(false)
+  const [note, setNote] = useLocalStorage('note', '')
 
-  if (keep) {
-    const [note, setNote] = useLocalStorage('note', '')
-  }
-
   return (
     <div className="card">
@@ -21,4 +18,10 @@
         Keep a note
       </label>
+      {keep && (
+        <input
+          value={note}
+          onChange={e => setNote(e.target.value)}
+        />
+      )}
     </div>
   )
```

**A hook inside an event handler (`v9-handler`).** Calling `useLocalStorage` inside `save()` and clicking the button gives:

```text
Error: Invalid hook call. Hooks can only be called inside of the body of a function component.
```

### 9. Naming, and when you do not need a hook

The name must start with `use` for two reasons: it tells every reader that the function calls hooks so the rules apply, and the linter checks the rules only for functions named that way. Name it after what it gives you, in camel case: `useDebounce`, `useLocalStorage`, `useFetch`, not `useStuff`.

Not everything needs a hook. A function that calls no hooks is just a function. `formatPrice` takes a number and returns text (`versions/v10-format`):

`versions/v10-format/formatPrice.js`:
```js
export function formatPrice(price) {
  return price === 0 ? 'Free' : 'Rs ' + price
}
```

```bash
node versions/v10-format/run.mjs
```

```text
Rs 499
Free
```

## Common mistakes

- Calling a hook inside `if`, a loop, or a handler.
- A custom hook name that does not start with `use`.
- Expecting two components that call the same hook to share state.
- No `clearTimeout` in `useDebounce`, or no abort cleanup in `useFetch`.
- Writing a hook for something that is just a plain function.

## Try it yourself

Write `useToggle(initial)` that returns `[on, toggle]`. Use it for the Show/Hide clock from lesson 2.

## Clean up

Stop the dev server and the API server with `Ctrl+C`. Then:

```bash
rm -rf node_modules dist
```

In the browser console, remove the saved values with `localStorage.clear()`.

## Next

Continue with [M07-B04 · Build a Live Course Search](../m07-b04-build-a-live-course-search/).
