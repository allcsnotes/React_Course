# M08-L02 · Routes, Links and URL Parameters

> Video: Module 8, Lesson 2. Watch it first, then follow along here.

## What you'll learn

- The route table: an array of `{ path, element }` objects, like a mall directory board
- A URL parameter with a colon (`/courses/:slug`), read with `useParams`, always as text
- Guarding a missing course (`find` can return `undefined`)
- `NavLink`, which adds the class `active` (and `aria-current`) to the link of the page you are on
- Query strings (`?level=beginner&free=true`) with `useSearchParams`, so a filter survives a refresh and can be shared
- Absolute (`/courses/...`) and relative (`python-from-zero`) link paths
- `useNavigate` to move the person after something happened, and why it must not be called in the body

## Before you start

- Node 24 (`node --version`).
- Best after [M08-L01](../m08-l01-single-page-apps-and-react-router/). React Router 8.5.1 is already in `package.json`.
- No Docker needed.

## Files in this folder

`src/` is the finished app (`versions/v9-enroll`). Every `versions/` folder is a complete copy of the changed `src` files at one step: copy it with `cp -R versions/<name>/. src/`.

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | React 19.3.1, Vite 8.3.5, `react-router` 8.5.1 |
| `src/main.jsx` | The route table and `RouterProvider` |
| `src/Header.jsx` | The menu with `NavLink` |
| `src/pages/Home.jsx`, `Catalog.jsx`, `Course.jsx`, `MyCourses.jsx` | The four pages |
| `src/enrolled.js` | A tiny helper that keeps the enrolled slugs in `localStorage` |
| `src/data/courses.js` | The courses (each has a `slug`, a `level` and a price) |
| `src/App.css`, `src/index.css` | Styles |
| `versions/v0-state` | The filter kept in `useState` (lost on refresh) |
| `versions/v1-routes` | The route table with `:slug` |
| `versions/v2-find`, `v3-guard` | Reading the slug with `find`, then guarding the missing course |
| `versions/v4-navlink`, `v5-navfn` | `NavLink`, and the function form of `className` |
| `versions/v6-get`, `v7-search` | Reading and setting the query string |
| `versions/v8-rel` | A relative link that gives a 404 |
| `versions/v9-enroll` | `useNavigate` after Enroll (the finished app) |
| `versions/v10-navcall` | `navigate()` called while drawing (mistake) |

## Follow along

### 1. Set up

```bash
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`).

### 2. The problem: a filter that disappears (`v0-state`)

On the catalog page Lukas picks the level Beginner and ticks Free only. The list shrinks to one course, Python from Zero. He copies the address and sends it to Priya. He presses refresh and his own filter is gone: all four courses are back. Priya opens the link and also sees all four. The filter lives in `useState`, and state is not part of the address. This lesson puts it in the address.

### 3. The route table (`v1-routes`)

A router is the mall's directory board: it holds no shops, it only says "this address leads to that shop". You write the table once: an array with one object for each page, each with a `path` and an `element`.

`versions/v1-routes/main.jsx`:
```jsx
const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/catalog', element: <Catalog /> },
  { path: '/courses/:slug', element: <Course /> },
  { path: '/my-courses', element: <MyCourses /> },
])
```

The path `/courses/:slug` has a blank. The colon says "this part is a blank, and its name is `slug`". A slug is a short, URL-safe name of a course. The real pages: `/` shows `Learn to build real software`, `/catalog` shows the four courses, and `/courses/python-from-zero` shows `The slug is: python-from-zero`. The same route also matches `/courses/anything-at-all`, and the page shows `The slug is: anything-at-all`. `useParams()` gives the blank as an object, and it is always text (the console prints `python-from-zero string`).

### 4. Find the course (`v2-find`, `v3-guard`)

The page looks the course up with `find` on the slug. For a real slug the page shows `Python from Zero`, `by Meera · 20 lessons`. For `/courses/nope`, `find` returns `undefined` and the page crashes with React Router's error screen:

```text
Unexpected Application Error!
Cannot read properties of undefined (reading 'title')
```

The guard (`v3-guard`) shows your own message:

```diff
@@ -1,3 +1,3 @@
-import { useParams } from 'react-router'
+import { Link, useParams } from 'react-router'
 import courses from '../data/courses.js'
 import Header from '../Header.jsx'
@@ -7,4 +7,19 @@
   const course = courses.find(c => c.slug === slug)
 
+  if (!course) {
+    return (
+      <>
+        <Header />
+        <main>
+          <h2>Course not found</h2>
+          <p>There is no course called "{slug}".</p>
+          <Link to="/catalog">
+            Back to the catalog
+          </Link>
+        </main>
+      </>
+    )
+  }
+
   return (
     <>
```

(Lines starting with `+` are in `v3-guard`.) The real page at `/courses/nope`: `Course not found`, `There is no course called "nope".` and a link back to the catalog.

### 5. The menu with `NavLink` (`v4-navlink`, `v5-navfn`)

A good menu shows where you are, like the red dot on a mall map. `NavLink` takes the same `to` prop as `Link`, and when its address matches the page it adds the class `active` to the `a` tag. One CSS rule does the lighting (`nav a.active`: blue text, a light blue background, a blue line underneath).

`versions/v4-navlink/Header.jsx`:
```jsx
import { NavLink } from 'react-router'

export default function Header() {
  return (
    <header>
      <b className="logo">allcsvideos</b>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/catalog">Catalog</NavLink>
        <NavLink to="/my-courses">My courses</NavLink>
      </nav>
    </header>
  )
}
```

Guess: Lukas is on the home page and presses the Catalog tab. The address becomes `/catalog`. Every address starts with a slash and the Home link is only a slash, so is Home lit too? Real result: only Catalog is lit. The router is careful with the home link: it counts only when the address is exactly `/`. Press My courses and the lit tab moves with you. The real HTML of the catalog link on the catalog page has the class `active` and also `aria-current="page"`, which tells screen readers which page you are on, for free.

For full control `className` can be a function. React Router calls it with an object, you take `isActive`, and you return the class names you like (`v5-navfn`):

```jsx
<NavLink
  to="/catalog"
  className={({ isActive }) =>
    isActive ? 'tab on' : 'tab'
  }
>
  Catalog
</NavLink>
```

On the catalog page the link now has the class `tab on`: the same result with your own class names. Use `Link` for anything that just goes somewhere, and `NavLink` for menus that show where you are.

### 6. Query strings (`v6-get`, `v7-search`)

An address has two parts, like a table number and a slip of notes at a restaurant. The path (`/catalog`) says which page. After a question mark come the notes: `?level=beginner&free=true`. `useSearchParams` reads them. `v6-get` logs what it reads:

```text
level: null free: null
level: null free: null
level: beginner free: true
```

The first two lines are `/catalog` with no query (the missing keys give `null`), the third is `/catalog?level=beginner&free=true`. In `v7-search` the filter reads from the address and writes back to it:

`versions/v8-rel/pages/Catalog.jsx`:
```jsx
const [searchParams, setSearchParams] =
  useSearchParams()
const level = searchParams.get('level') ?? ''
const freeOnly = searchParams.get('free') === 'true'

const shown = courses.filter(c =>
  (level === '' || c.level === level) &&
  (!freeOnly || c.free),
)

function setParam(key, value) {
  const next = new URLSearchParams(searchParams)
  if (value) next.set(key, value)
  else next.delete(key)
  setSearchParams(next)
}

return (
  <>
    <Header />
    <main>
      <h2>Catalog</h2>
      <div className="filters">
        <select
          value={level}
          onChange={e =>
            setParam('level', e.target.value)
          }
        >
          <option value="">All levels</option>
```

Choose Beginner, tick Free only: the address becomes `/catalog?level=beginner&free=true`, the list shrinks, and a refresh or a copied link shows the same list. Un-ticking removes `free` from the address.

### 7. Absolute and relative links (`v8-rel`)

A path that starts with a slash is absolute, like a full street address: it begins at the root of the site and means the same on every page. A path without a slash is relative to the current page. In `v8-rel` the catalog card links with `to={c.slug}`. From `/catalog` that goes to `/catalog/python-from-zero`, which no route matches:

```text
Unexpected Application Error!
404 Not Found
```

The fix is an absolute path, written with a template string: `` to={`/courses/${c.slug}`} `` (this is how the finished `v9-enroll` does it).

### 8. Move the person with `useNavigate` (`v9-enroll`, `v10-navcall`)

A link is a door the person walks through. `navigate` is a guide who walks the person through a door at the right moment. After Enroll the app saves the course and takes the person to My courses.

`versions/v9-enroll/pages/Course.jsx`:
```jsx
function handleEnroll() {
  enroll(course.slug)
  navigate('/my-courses')
}
```

The real run: open `python-from-zero`, press Enroll, the page becomes `My courses` with `Python from Zero` in the list, and `localStorage` holds `["python-from-zero"]`. Press Back and you are on the course page again.

The mistake (`v10-navcall`) is to call `navigate` while drawing, or to pass the result of calling it to `onClick`:

```diff
@@ -24,9 +24,4 @@
   }
 
-  function handleEnroll() {
-    enroll(course.slug)
-    navigate('/my-courses')
-  }
-
   return (
     <>
@@ -40,5 +35,9 @@
           {course.free ? 'Free' : `Rs ${course.price}`}
         </p>
-        <button onClick={handleEnroll}>Enroll</button>
+        <button
+          onClick={navigate('/my-courses')}
+        >
+          Enroll
+        </button>
       </main>
     </>
```

React logs:

```text
You should call navigate() in a React.useEffect(), not when your component is first rendered.
Expected `onClick` listener to be a function, instead got a value of `object` type.
```

`navigate('/my-courses')` runs immediately and returns nothing. Pass a function (`onClick={handleEnroll}`), and call `navigate` inside it.

## Common mistakes

- Keeping a filter in `useState` when it should be shareable. Put it in the query string.
- `useParams` values are always text. Look up with `find` and guard the result.
- A relative `to` like `python-from-zero` from a nested address.
- Calling `navigate(...)` in the body or directly inside `onClick`.

## Clean up

```bash
rm -rf node_modules dist
```

In the browser console, `localStorage.clear()` removes the enrolled slugs. Press `Ctrl+C` to stop the dev server.

## Next

Continue with [M08-L03 · Nested Routes and Layouts](../m08-l03-nested-routes-and-layouts/).
