# M08-L04 · Loaders, Actions and Protected Routes

> Video: Module 8, Lesson 4. Watch it first, then follow along here.

## What you'll learn

- The empty "Loading" flash of fetching in an effect, and the loader that fixes it (data first, then the page)
- A route `loader`, `useLoaderData`, and `useNavigation` to show that something is happening
- Why `fetch` does not throw on a 500, and how a loader throws a `Response` for an `errorElement`
- A `<Form method="post">` and a route `action`, with `redirect` after it
- A guard at the door: a loader that redirects people who are not signed in
- Three mistakes: a form with no method, a loader that does not throw, and a handler where the action should be

## Before you start

- Node 24 (`node --version`).
- Best after [M08-L03](../m08-l03-nested-routes-and-layouts/) and M07-L05 (fetching in an effect).
- No Docker needed. `api/server.mjs` is a tiny local stand-in for the allcsvideos API on port 8184. It is not a real server and never calls the internet. The sign-in is a pretend file (`auth.js`); real sign-in is Module 13.

## Files in this folder

`src/` is the finished app (`versions/v6-protected`). Every `versions/` folder is a complete copy of `src` at that step (the video builds each step on top of the previous one), so `cp -R versions/<name>/. src/` gives exactly that step.

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json`, `vite.config.js` | React 19.3.1, Vite 8.3.5, `react-router` 8.5.1; `/api` is proxied to port 8184 |
| `api/server.mjs` | The stand-in API: `GET /api/courses`, `GET /api/my-courses`, `POST /api/enrollments`, with deliberate delays and a switch for errors |
| `src/main.jsx`, `src/router.jsx` | Entry and the route table |
| `src/Layout.jsx` | The frame with the menu and a Loading / Ready indicator |
| `src/Home.jsx`, `Courses.jsx`, `MyCourses.jsx`, `Login.jsx`, `ErrorPage.jsx` | The pages |
| `src/auth.js` | The pretend sign-in (a flag in `localStorage`) |
| `versions/v0-effect` | The Courses page fetching in an effect |
| `versions/v1-loader`, `v1b-fallback` | A loader, then with a `HydrateFallback` |
| `versions/v2-pending`, `v2b-statelog` | `useNavigation` in the layout |
| `versions/v3-error`, `v3b-noerror` | A loader that throws a `Response`, and one that does not |
| `versions/v4-action`, `v4b-statelog` | `<Form method="post">` and an `action` |
| `versions/v5-redirect` | `redirect('/my-courses')` after the action |
| `versions/v6-protected` | The guard in `MyCourses` and the sign-in page |
| `versions/m1-nomethod`, `m2-nothrow`, `m3-handler` | The three mistakes |
| `versions/v0w-effect-wf`, `v1w-loader-wf` | Two "waterfall" versions (a parent that loads first) |

## Follow along

### 1. Start the stand-in server and the app

Two terminals. In the first:

```bash
node api/server.mjs
```

```text
api on 8184
```

In the second:

```bash
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`). Check the API with curl (this is the real answer for one course of the list; the full list has four):

```bash
curl http://localhost:5173/api/courses
```

```text
[{"id":1,"title":"React for Beginners","teacher":"Meera","lessons":12,"price":499,"free":false}, ...]
```

### 2. The flash of empty (`v0-effect`)

Written the Module 7 way, an effect fetches the list and the page says `Loading…` until the answer arrives. Click Courses: the address changes at once and the page opens empty with one word. The real timing: the click pushed the new page at about 99 ms, `Courses | Loading…` was on screen at 114 ms, and the four courses appeared at about 1066 ms. Every visit starts with this empty flash.

```text
Courses | Loading…
Courses | React for Beginners | Python from Zero | System Design | DevOps Basics
```

### 3. A loader (`v1-loader`)

In the first kind of restaurant the waiter brings an empty plate and the kitchen cooks while you watch. In the second the kitchen cooks first and the plate comes when the dish is ready. A loader is a plain function you attach to a route. The router calls it first, waits until it finishes, and only then draws the page.

`versions/v1-loader/Courses.jsx`:
```jsx
import { useLoaderData } from 'react-router'

export async function loader() {
  const res = await fetch('/api/courses')
  return res.json()
}

export default function Courses() {
  const courses = useLoaderData()

  return (
    <div>
      <h2>Courses</h2>
      <ul>
        {courses.map(c => (
          <li key={c.id}>{c.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

and in the route table: `{ path: 'courses', element: <Courses />, loader: coursesLoader }`. The page has no state, no effect and no `Loading…`: `useLoaderData()` hands back exactly what the loader returned. Clicking Courses now waits, then shows the four courses at once. On a hard reload of `/courses` React Router logs `No `HydrateFallback` element provided to render during initial hydration`, because there is nothing to draw while the first loader runs. `v1b-fallback` adds a `hydrateFallbackElement` that shows `Loading…`.

### 4. Show that something is happening (`v2-pending`, `v2b-statelog`)

Waiting with no sign of life feels broken. `useNavigation()` returns an object whose `state` is `idle`, `loading` or `submitting`. It goes in the layout, because the layout stays on the screen during the wait:

`versions/v2-pending/Layout.jsx`:
```jsx
import { NavLink, Outlet, useNavigation } from 'react-router'

export default function Layout() {
  const navigation = useNavigation()
  const busy = navigation.state !== 'idle'

  return (
    <>
      <nav>
        <span className="brand">allcsvideos</span>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/courses">Courses</NavLink>
        <NavLink to="/my-courses">My courses</NavLink>
        <span className="state" data-busy={busy}>
          {busy ? 'Loading…' : 'Ready'}
        </span>
      </nav>
      <main className={busy ? 'busy' : ''}>
        <Outlet />
      </main>
    </>
  )
}
```

The menu shows `Ready` normally and `Loading…` while the loader runs; the log in `v2b-statelog` prints `state: idle`, then `state: loading`, then `state: idle` again.

### 5. When the server is broken (`v3-error`, `v3b-noerror`)

With the API answering 500, `fetch` does not throw: it hands back a response with `ok` set to false. If the loader does not check, the page tries to draw it. The loader must throw on purpose, and a thrown `Response` goes to the route's `errorElement`:

```diff
@@ -2,4 +2,5 @@
 import Layout from './Layout.jsx'
 import Home from './Home.jsx'
+import ErrorPage from './ErrorPage.jsx'
 import Courses, { loader as coursesLoader } from './Courses.jsx'
 import MyCourses, { loader as myCoursesLoader } from './MyCourses.jsx'
@@ -18,4 +19,5 @@
         element: <Courses />,
         loader: coursesLoader,
+        errorElement: <ErrorPage />,
       },
       { path: 'my-courses', element: <MyCourses />, loader: myCoursesLoader },
```

`versions/v3-error/Courses.jsx`:
```jsx
export async function loader() {
  const res = await fetch('/api/courses')
  const { ok, status } = res
  if (!ok) {
    const msg = 'Server answered ' + status
    throw new Response(msg, { status })
  }
  return res.json()
}
```

Real results with the server switched to errors:

```text
v3-error:    ... Ready | Something went wrong | 500 Server answered 500 ...   (the menu stays)
v3b-noerror: Unexpected Application Error! | 500 | Hey developer ...          (the default screen)
```

The console also shows `Failed to load resource: the server responded with a status of 500 (Internal Server Error)`.

### 6. Sending data: `Form` and `action` (`v4-action`)

In lesson 2 enrolling was a click handler that saved and then called `navigate`. A router `<Form method="post">` is better: when it is submitted, the router stops the reload, collects the answers, and calls the route's `action`. The action sends the change to the server, and afterwards the router runs the loaders again, so the page is fresh.

`versions/v4-action/Courses.jsx`:
```jsx
export async function action({ request }) {
  const form = await request.formData()
  const courseId = Number(form.get('courseId'))
  await fetch('/api/enrollments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ courseId }),
  })
  return null
}
```

Press Enroll on React for Beginners. The navigation state goes `idle`, `idle`, `submitting` (the log in `v4b-statelog`), the menu shows `Loading…`, and then the button becomes `Enrolled` without any extra code.

### 7. Redirect after the action (`v5-redirect`)

An action can end with `return redirect('/my-courses')`. The real run: press Enroll on Python from Zero and you land on `My courses | Python from Zero`.

### 8. A guard at the door (`v6-protected`)

Lukas, who was not signed in, typed `/my-courses` and saw the page. A guard has to stand in front of the page, and a loader runs before the page is drawn. If the person is not signed in, the loader redirects. `auth.js` is a pretend sign-in:

`versions/v6-protected/auth.js`:
```js
// a FAKE sign-in flag, kept in this browser only (real login: module 13)
export const isSignedIn = () => localStorage.getItem('signedIn') === 'yes'
export const signIn = () => localStorage.setItem('signedIn', 'yes')
export const signOut = () => localStorage.removeItem('signedIn')
```

`versions/v6-protected/MyCourses.jsx`:
```jsx
export async function loader({ request }) {
  if (!isSignedIn()) {
    const next = new URL(request.url).pathname
    throw redirect('/login?next=' + next)
  }
  const res = await fetch('/api/my-courses')
  return res.json()
}

export default function MyCourses() {
  const courses = useLoaderData()

  return (
    <div>
      <h2>My courses</h2>
      <ul>
        {courses.map(c => (
          <li key={c.id}>{c.title}</li>
```

The real run: opening `/my-courses` while signed out sends you to `/login?next=/my-courses`, the page `Sign in | A pretend sign-in: one click.`; one click and you come back to `My courses | React for Beginners`. Be aware that this only guards the screen: anyone can change a flag in `localStorage` from the browser console (the video shows it), so the server must check again. Real authentication is Module 13.

### 9. Three mistakes

**A form with no method (`m1-nomethod`).** Press Enroll and nothing is saved. The address changes to `/courses?courseId=1`: a form without a method is a GET form, so the router treats it like a link. The fix is two words: `method="post"`.

**A loader that does not throw (`m2-nothrow`).** In `MyCourses` the guard calls `redirect(...)` but neither throws nor returns it, so nothing happens and the page is still drawn for a signed-out person (the real page: `Sign in | My courses | React for Beginners`). Write `throw redirect(...)` (as in `v6-protected`) or `return redirect(...)`.

**A click handler instead of an action (`m3-handler`).** `m3-handler` handles Enroll in an `onClick` that calls `fetch` itself. The server is updated, but the router never runs the loader again, so the button still says `Enroll` until you navigate away and back, when it finally says `Enrolled`.

## Common mistakes

- Fetching in an effect on a page that always needs the data: use a loader.
- Forgetting that `fetch` does not throw on 500. Check `res.ok` and throw a `Response`.
- `<Form>` without `method="post"`.
- Putting the guard inside the page instead of the loader.
- Trusting a `localStorage` flag as real security.

## Clean up

Stop the dev server and the API server with `Ctrl+C`. Then:

```bash
rm -rf node_modules dist
```

In the browser console, `localStorage.clear()` removes the pretend sign-in.

## Next

Continue with [M08-B05 · Build the allcsvideos Frontend v1](../m08-b05-build-the-allcsvideos-frontend-v1/).
