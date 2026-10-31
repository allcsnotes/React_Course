# M07-L05 · Fetching Data in an Effect

> Video: Module 7, Lesson 5. Watch it first, then follow along here.

## What you'll learn

- Why the page must ask a server for its courses (`fetch` from M02-L05), and why never to do it in the body
- `useEffect` with an inner `async function load()` and `[]`
- One `status` string (`loading`, `error`, `empty`, `ready`) from M05-L05
- A race condition: a slow answer arrives last and wins
- Two fixes: an `ignore` flag in the cleanup, and `AbortController` to cancel the request
- A live search box that refetches whenever `query` changes
- Two mistakes: `async` on the effect function itself, and forgetting the dependency list

## Before you start

- Node 24 (`node --version`).
- Best after [M07-L04](../m07-l04-useref/) and M02-L05 (async JavaScript and `fetch`).
- No Docker needed. The "server" is a tiny local Node script in `api/server.mjs`. It listens on port 8175 on your own computer and never calls the internet.

## Files in this folder

`src/App.jsx` starts as `versions/v1-effect/App.jsx`. Copy any other version's `App.jsx` over `src/App.jsx`.

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | React 19.3.1, Vite 8.3.5 |
| `vite.config.js` | Sends requests for `/api` to the local stand-in server on port 8175 |
| `api/server.mjs` | The local stand-in API: `/api/courses`, `/api/courses/<id>`, `?q=`, and `/api/_control` switches |
| `src/App.jsx`, `src/App.css`, `src/index.css`, `src/main.jsx` | The app |
| `versions/v0-body` | `fetch` in the body (loops forever) |
| `versions/v1-effect` | `fetch` in `useEffect` with `[]` |
| `versions/v2-status` | One `status` string: loading, error, empty, ready |
| `versions/v3-race`, `v3b-ignore`, `v3c-abortlog`, `v3d-abort` | A detail page with a race, then the `ignore` flag, then `AbortController` |
| `versions/v4-search` | A search box that refetches on every change of `query` |
| `versions/v5-asyncbug`, `v5b-nodeps` | `async` on the effect, and no dependency list |

## Follow along

### 1. Start the local server and the app

You need two terminals. In the first:

```bash
node api/server.mjs
```

```text
api on 8175
```

In the second:

```bash
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`). The server answers after a short, deliberate delay so you can see the loading message. It has switches: `/api/_control?mode=ok`, `mode=fail` (every request answers 500) and `mode=empty`, for example `curl "http://localhost:8175/api/_control?mode=fail"`. Switch app versions with `cp versions/<name>/App.jsx src/App.jsx`.

### 2. Never fetch in the body (`v0-body`)

A component function runs again after every change, so a `fetch` in the body fetches, sets state, redraws, fetches again, forever. A waiter walks to the kitchen once, not every time you move your fork. In the video, 3 seconds on this page made 124 requests to `/api/courses`.

### 3. Fetch in an effect (`v1-effect`)

`useState` holds `courses`, starting as an empty list. `useEffect` runs after the first draw. Inside, a function `load` marked `async` (`await` only works inside an async function), which does `await fetch(...)` and then `setCourses(await res.json())`. The last line of the effect calls `load()`, and the list is `[]`.

`versions/v1-effect/App.jsx`:
```jsx
useEffect(() => {
  async function load() {
    const res = await fetch('/api/courses')
    setCourses(await res.json())
  }
  load()
}, [])

return (
  <div className="card">
    <h2>Courses</h2>
    <ul>
      {courses.map(c => <li key={c.id}>{c.title}</li>)}
    </ul>
  </div>
)
```

The real page: for a moment just the title, then the four courses.

```text
Courses
Courses | React for Beginners | Python from Zero | System Design | DevOps Basics
```

### 4. Loading, error, empty, ready (`v2-status`)

The blank second needs a status string (M05-L05): `loading`, `error`, `empty`, `ready`. After the `fetch`, if `res.ok` is false, throw an error; `try`/`catch` sets the `error` status; an empty list sets `empty`.

`versions/v2-status/App.jsx`:
```jsx
useEffect(() => {
  async function load() {
    try {
      const res = await fetch('/api/courses')
      if (!res.ok) throw new Error('Not ok')
      setCourses(await res.json())
      setStatus('ready')
    } catch (err) {
      setStatus('error')
    }
  }
  load()
}, [])

return (
  <div className="card">
    <h2>Courses</h2>
    {status === 'loading' && (
      <p className="note">Loading courses...</p>
    )}
    {status === 'error' && (
      <p className="err">Could not load courses.</p>
    )}
    {status === 'ready' && courses.length === 0 && (
      <p className="note">No courses yet.</p>
    )}
    <ul>
      {courses.map(c => <li key={c.id}>{c.title}</li>)}
    </ul>
  </div>
```

The real results with the server in each mode:

```text
mode=ok     Courses | Loading courses...   ->   Courses | React for Beginners | Python from Zero | System Design | DevOps Basics
mode=fail   Courses | Loading courses...   ->   Courses | Could not load courses.
mode=empty  Courses | Loading courses...   ->   Courses | No courses yet.
```

(In `fail` mode the browser console also prints `Failed to load resource: the server responded with a status of 500 (Internal Server Error)`.) Set the mode back with `curl "http://localhost:8175/api/_control?mode=ok"`.

### 5. The race (`v3-race`)

A page for one course with four tabs. The effect clears the old course, then fetches the one for `id`. The server is slow for React on purpose (2 seconds; the others under half a second). Click React, then quickly Design. The real page and the server log:

```text
after Python:  Python from Zero | Meera · 20 lessons
after Design:  System Design | Rahul · 25 lessons
then ...       React for Beginners | Meera · 12 lessons     <- the WRONG course, arrived last
```

```text
course 1: started at 1753 ms, answered at 3756 ms
course 3: started at 2351 ms, answered at 2752 ms
```

The slow answer (React) arrives last and wins, so the page shows the wrong course. This is a race condition.

### 6. Fix one: the `ignore` flag (`v3b-ignore`)

When the page moves on to a new id, the old answer is out of date and must be ignored. React gives you the moment: the cleanup. At the top of the effect `let ignore = false`, after the `await` only `setCourse` if `!ignore`, and return `() => { ignore = true }`.

`versions/v3b-ignore/App.jsx`:
```jsx
  useEffect(() => {
    setCourse(null)
    let ignore = false
    async function load() {
      const res = await fetch('/api/courses/' + id)
      const data = await res.json()
      if (!ignore) setCourse(data)
    }
    load()
    return () => { ignore = true }
  }, [id])

  if (!course) return <p className="note">Loading...</p>
  return (
    <div>
      <h2>{course.title}</h2>
      <p className="small">{course.teacher} · {course.lessons} lessons</p>
    </div>
  )
}
```

The real result after React then Design: the page stays on `System Design | Rahul · 25 lessons`. The React answer still arrives, but it is thrown away.

### 7. Fix two: cancel the request (`v3c-abortlog`, `v3d-abort`)

`AbortController` is a remote control with one button: cancel. Make `const controller = new AbortController()`, give `fetch` the object `{ signal: controller.signal }`, and in the cleanup call `controller.abort()`. A cancelled `fetch` throws `AbortError`, and your `catch` receives it; ignore it there. The real server log with the abort in place: the React request was cancelled (`cancelled: true`) after 2236 ms and never finished, while Design answered normally.

```text
course 2: status 200, done
course 1: cancelled
course 3: status 200, done
```

`v3c-abortlog` logs the error: `AbortError: signal is aborted without reason`.

### 8. A search box (`v4-search`)

The text typed is state, `query`, and the dependency list says `[query]`, so each change cancels the old request and starts a new one. `encodeURIComponent(query)` makes the text safe for an address.

`versions/v4-search/App.jsx`:
```jsx
useEffect(() => {
  const controller = new AbortController()
  async function load() {
    try {
      const q = encodeURIComponent(query)
      const url = '/api/courses?q=' + q
      const res = await fetch(url, {
        signal: controller.signal,
      })
      setCourses(await res.json())
    } catch (err) {
      if (err.name === 'AbortError') return
      console.error(err)
    }
  }
  load()
  return () => controller.abort()
}, [query])

return (
  <div className="card">
    <input value={query} placeholder="Search"
      onChange={e => setQuery(e.target.value)} />
    <ul>
      {courses.map(c => <li key={c.id}>{c.title}</li>)}
    </ul>
  </div>
)
```

Type `p` then `y`. The real page and server log:

```text
[ ]    React for Beginners | Python from Zero | System Design | DevOps Basics
[p]    (waiting)
[py]   Python from Zero
```

```text
search p:  cancelled
search py: status 200
```

### 9. Two mistakes (`v5-asyncbug`, `v5b-nodeps`)

**`async` on the effect itself.** The page goes blank. The console says:

```text
useEffect must not return anything besides a function, which is used for clean-up.

It looks like you wrote useEffect(async () => ...) or returned a Promise.
```

followed by `TypeError: destroy is not a function`. An `async` function always returns a promise, but React expects nothing or a cleanup function. Keep the effect plain and put the `async function load()` inside it, as in step 3.

**No dependency list (`v5b-nodeps`).** The effect runs after every draw, sets state, redraws, and fetches again, forever, like fetching in the body.

## Common mistakes

- `fetch` in the body of the component: an endless loop of requests.
- `useEffect(async () => ...)`. Put an `async` function inside the effect instead.
- No dependency list, or `[]` when the request uses `id` or `query`.
- No cleanup, so a slow old answer overwrites a newer one.
- Treating a 500 as success: check `res.ok` and throw.

## Clean up

Stop the dev server and the API server with `Ctrl+C` in each terminal. Then:

```bash
rm -rf node_modules dist
```

## Next

Continue with [M07-L06 · Custom Hooks](../m07-l06-custom-hooks/).
