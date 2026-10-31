# M07-B04 · Build a Live Course Search

> Video: Module 7, Build 4. Watch it first, then follow along here.

## What you'll build

A live course search for allcsvideos: a heading, a search box with a Clear button, one status line, and the matching courses with the typed letters highlighted. It waits for a pause in typing (debounce), cancels old requests so answers never arrive in the wrong order, shows every screen (idle, loading, error, empty, results), remembers the word after a refresh, and puts the cursor back in the box on Clear. It uses everything from Module 7: effects and cleanup, fetch in an effect, a ref, and custom hooks.

## Before you start

- Node 24 (`node --version`).
- Best after M07-L01 to [M07-L06](../m07-l06-custom-hooks/).
- No Docker needed. `api/server.mjs` is a small stand-in for the allcsvideos catalog API on port 8174 on your own computer. It is not the production server, and it never calls the internet.

## Files in this folder

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | React 19.3.1, Vite 8.3.5 |
| `vite.config.js` | Proxies `/api` to the stand-in server on port 8174 |
| `api/server.mjs` | `GET /api/courses?q=...` with a real delay, and a switch for server trouble (`/__admin/fail?on=1`) |
| `src/main.jsx`, `src/index.css` | Entry file and the pasted style |
| `src/App.jsx` | The search page |
| `src/components/Highlight.jsx` | Draws a title with the matching letters marked |
| `src/hooks/useDebounce.js`, `src/hooks/useLocalStorage.js` | The two custom hooks from lesson 6 |
| `steps/` | The files at each stage: `App.0.jsx` to `App.5.jsx`, `App.2slow.jsx` (slow first answer), `App.5bad.jsx` (the Clear bug), and the hook files |

## Run it

You need two terminals. In the first:

```bash
node api/server.mjs
```

```text
API on http://localhost:8174
```

In the second:

```bash
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`). Real page text at the start:

```text
Find a course | Type to search.
```

## Build it step by step

### 1. The goal and a sketch

At the top a heading and one row (a text box and a Clear button). Under it one line of status. Then the courses, one per row, with the typed letters highlighted. Before any code, look at what the server answers: a GET request with `q=react` returns JSON with a list called `items`, each with an `id` and a `title`.

Bricks: one page component `App`, and one small brick `Highlight`. State: the typed `query` is a fact, and it should survive a refresh, so it lives in `localStorage` through `useLocalStorage`. The reply `items`, a `status` (one word: `idle`, `loading`, `error` or `done`, from M05-L05) and an `error` message are the other notes. The searched word (`term`) is derived: the debounced, trimmed query.

Start from a fresh Vite React project, paste `steps/index.css` and use `steps/vite.config.js` (it has the proxy). `steps/App.0.jsx` is the empty page.

### 2. Step one: type, and ask (`steps/App.1.jsx`)

The first note is `query`, a controlled input (M05-L03). An effect asks the server whenever the word changes, with an inner `async` function and a dependency list of `[query]`.

### 3. Step two: wait for a pause (`steps/App.2.jsx`, `steps/useDebounce.js`)

A friend telling you a phone number: you do not call after every digit, you wait until they stop. `useDebounce` returns the value, but late.

`src/hooks/useDebounce.js`:
```js
import { useEffect, useState } from 'react'

export default function useDebounce(value, delay) {
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

Use it for the search term, with a 300 ms delay, so one word is one request (`steps/App.2slow.jsx` uses 1500 ms so you can watch the wait):

```jsx
const term = useDebounce(query.trim(), 300)
```

### 4. Step three: answers in the wrong order (`steps/App.2.jsx` has the bug, `steps/App.3.jsx` the fix)

Debounce sends fewer requests, but it does not fix the race for a slow typist. Lukas types `p`, thinks for half a second, then types `y`. The request for `p` is slower (more results) and arrives after the one for `py`, so the box says `py` but the page shows the nine courses for `p`. The fix is the cleanup from M07-L05, an `AbortController`:

`src/App.jsx`:
```jsx
useEffect(() => {
  if (term === '') {
    setStatus('idle')
    return
  }
  const controller = new AbortController()
  setStatus('loading')
  fetch(searchUrl(term), {
    signal: controller.signal,
  })
    .then(res => {
      if (!res.ok) {
        throw new Error('Server said ' + res.status)
      }
      return res.json()
    })
    .then(data => {
      setItems(data.items)
      setStatus('done')
    })
    .catch(err => {
      if (err.name === 'AbortError') return
      setError(err.message)
      setStatus('error')
    })
  return () => controller.abort()
}, [term])

function clear() {
  setQuery('')
  inputRef.current.focus()
}

const count = items.length
const word = count === 1 ? 'course' : 'courses'

```

Each new term aborts the previous request, so only the latest answer is ever used. An `AbortError` is ignored in the `catch`.

### 5. Step four: every screen (`steps/App.4.jsx`)

Two screens were missing: the error and the empty result. In the chain, before `res.json()`, check `res.ok` and throw an error with the status (`fetch` only fails by itself when the network is down, not on a 500). Then the page asks the `status`, one question per screen:

`src/App.jsx`:
```jsx
{status === 'idle' && (
  <p className="status">Type to search.</p>
)}
{status === 'loading' && (
  <p className="status">Searching...</p>
)}
{status === 'error' && (
  <p className="status bad">Error: {error}</p>
)}
{status === 'done' && count === 0 && (
  <p className="status">
    No course matches "{term}".
  </p>
)}
{status === 'done' && count > 0 && (
  <>
    <p className="status">
      {count} {word} for "{term}"
    </p>
    <ul>
      {items.map(c => (
        <li key={c.id}>
          <Highlight text={c.title} find={term} />
        </li>
      ))}
    </ul>
  </>
)}
```

The real results with the stand-in server (a real Playwright run on this project):

```text
Type to search.
4 courses for "pyth": Python from Zero | Python Basics | Async Python | Python Performance
No course matches "zzz".
Error: Server said 500
```

To get the error screen, switch the stand-in server into trouble mode, then back:

```bash
curl "http://localhost:8174/__admin/fail?on=1"
curl "http://localhost:8174/__admin/fail?on=0"
```

### 6. Step five: Clear, and remember (`steps/App.5bad.jsx` has the bug, `steps/App.5.jsx` the fix)

The Clear button shows only when the box has text; its handler sets `query` to an empty string. Guess: search `python`, press Clear, then type `react` without clicking the box. In the first version (`steps/App.5bad.jsx`) the box is empty but has no cursor, so the letters go nowhere (the active element is the page, not the box). The fix is a ref and `focus()`, as in M07-L04:

`src/App.jsx`:
```jsx
function clear() {
  setQuery('')
  inputRef.current.focus()
}

```

Remembering is `useLocalStorage('course-search', '')`:

`src/hooks/useLocalStorage.js`:
```js
import { useEffect, useState } from 'react'

export default function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      if (saved === null) return initial
      return JSON.parse(saved)
    } catch {
      return initial
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
```

After typing `pyth`, refresh the page: the word is still in the box and the results come back on their own:

```text
Find a course | Clear | 4 courses for "pyth" | Python from Zero | Python Basics | Async Python | Python Performance
```

After Clear the cursor is back in the box (the real active element is the `Search courses` input).

### 7. The highlight (`src/components/Highlight.jsx`)

`src/components/Highlight.jsx`:
```jsx
export default function Highlight({ text, find }) {
  const lower = text.toLowerCase()
  const at = lower.indexOf(find.toLowerCase())
  if (find === '' || at === -1) return text

  const end = at + find.length
  return (
    <>
      {text.slice(0, at)}
      <mark>{text.slice(at, end)}</mark>
      {text.slice(end)}
    </>
  )
}
```

### 8. Test it like a user

In the video: type `python` (4 courses), Clear, `react` (3 courses), Clear, `zzz` (nothing found), Clear, switch the server into trouble mode and type `git` (the error), switch it back. Twenty-three keys typed, five requests: one for each word. Every time the right screen showed, and after each Clear the cursor was back in the box.

### 9. What breaks in real life

- Nothing is remembered. Search `react`, `python`, `react`, `react` again: the same word costs a request every time and the answer is exactly the same. A cache (a library such as TanStack Query, Module 11) would remember the answers and show them at once, retry failed requests, and share one request between two components.

## Your turn

1. Arrow keys: Down and Up move a highlighted row through the results, and Enter opens it. Hint: one more note, the position of the active row, and an `onKeyDown` handler.
2. Search history: keep the last five words in local storage with `useLocalStorage` and show them as small buttons when the box is empty.

## Common mistakes

- No debounce: every key is a request.
- No abort cleanup: a slow old answer overwrites a newer one.
- Treating a 500 as success: check `res.ok`.
- Forgetting the ref, so Clear leaves no cursor in the box.
- Reading `localStorage` in the body instead of the lazy `useState` function.

## Clean up

Stop the dev server and the API server with `Ctrl+C`. Then:

```bash
rm -rf node_modules dist
```

In the browser console, `localStorage.removeItem('course-search')` forgets the saved word.

## Next

Module 8 starts with [M08-L01 · Single-Page Apps and React Router](../../m08-routing/m08-l01-single-page-apps-and-react-router/).
