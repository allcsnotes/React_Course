# M08-L01 · Single-Page Apps and React Router

> Video: Module 8, Lesson 1. Watch it first, then follow along here.

## What you'll learn

- How a classic multi-page site works (a new page from the server on every click) and how a single-page app (SPA) works (one page, loaded once)
- Why a plain `<a href>` throws away everything the page remembers
- Installing React Router 8.5.1 and the smallest router: `createBrowserRouter`, `RouterProvider`, `Link`
- A custom 404 page with the `*` route
- Three beginner mistakes: a `Link` outside the router, `href` instead of `to`, and the old `react-router-dom` import

## Before you start

- Node 24 (`node --version`).
- Best after [M07-B04](../../m07-effects-and-hooks/m07-b04-build-a-live-course-search/).
- No Docker needed.

## Files in this folder

`src/` is the finished router (`versions/v2-notfound` plus the data). The `versions/` folders hold each step and each mistake: copy a version's files into `src/` with `cp -R versions/<name>/. src/`. (`versions/App.css` and `versions/courses.js` are the shared style and data, already in `src/`.)

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | React 19.3.1, Vite 8.3.5, `react-router` 8.5.1 |
| `src/main.jsx`, `src/App.jsx`, `src/Home.jsx`, `src/Catalog.jsx` | The app and its two pages |
| `src/data/courses.js`, `src/App.css`, `src/index.css` | Data and styles |
| `versions/v0-anchor` | Pages linked with a plain `<a href>` |
| `versions/v1-link` | The same pages linked with `Link` |
| `versions/v2-notfound` | A `*` route with a `NotFound` page |
| `versions/m1-outside` | A `Link` placed outside the router (mistake) |
| `versions/m2-hrefprop` | `Link` with `href` instead of `to` (mistake) |
| `versions/m3-dom` | The old `react-router-dom` import (mistake; does not build) |

## Follow along

### 1. Set up

```bash
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`). In the header there is a counter, `Saved: 0`, and a `+ Save` button. A counter in the header is a good test: it lives in `App`, and the question is whether it survives when you change page.

### 2. How websites worked, and the SPA

A classic website is a pile of HTML files on a server: one for the home page, one for the catalog, one for every other page. Every click asks the server for a new file, the browser throws the old page away, builds a new one, and everything the old page remembered is gone (like a theatre that tears down the whole building for every new play). A single-page app is a theatre with one stage: the server sends one HTML file once, together with your JavaScript. From then on a click on a link does not go to the server. The JavaScript in the browser removes the home page component, shows the catalog component, and changes the address with the browser's history. That is the whole idea of routing.

React itself has no router. React Router is a separate package. Ask npm for its version:

```bash
npm view react-router version
```

```text
8.5.1
```

Install it into the project:

```bash
npm install react-router
```

```text
added 3 packages, and audited 29 packages in 1s

9 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

### 3. The problem with a plain `<a>` (`v0-anchor`)

With `<a href="/catalog">` in `Home.jsx`: click `+ Save` three times, then click the Catalog link. A tool that clicks like a person (Playwright) recorded this:

```text
start:      Saved: 0   address /          document requests: 2
+ Save x3:  Saved: 3   address /          document requests: 0
click link: Saved: 0   address /catalog   document requests: 1   <- a whole new page was loaded
```

The three saved courses are gone: the page was thrown away and loaded again.

### 4. The smallest router (`v1-link`)

A page is a component. `createBrowserRouter` takes a list of routes (a `path` and an `element`), and `RouterProvider` draws the one that matches. Notice the imports: `RouterProvider` comes from `react-router/dom`.

`versions/v1-link/App.jsx`:
```jsx
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import Home from './Home.jsx'
import Catalog from './Catalog.jsx'
import './App.css'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/catalog', element: <Catalog /> },
])

export default function App() {
  const [saved, setSaved] = useState(0)

  return (
    <>
      <header>
        <b className="logo">allcsvideos</b>
        <span className="saved">Saved: {saved}</span>
        <button onClick={() => setSaved(saved + 1)}>
```

The link is not an `a` tag. It is a component called `Link` with a `to` prop:

`versions/v1-link/Home.jsx`:
```jsx
import { Link } from 'react-router'

export default function Home() {
  return (
    <main className="page">
      <h1>Welcome to allcsvideos</h1>
      <p>Learn by building.</p>
      <Link to="/catalog">Catalog</Link>
    </main>
  )
}
```

In the finished page `Link` still becomes a real `a` tag with `href="/catalog"`. The difference is what a click does. The same test:

```text
start:      Saved: 0   address /          document requests: 1
+ Save x3:  Saved: 3   address /          document requests: 0
click link: Saved: 3   address /catalog   document requests: 0   <- no page was loaded
```

The counter still says 3: the header lives in `App`, outside the router, and was never thrown away. Back, forward and the address bar still work, because the router uses the browser history. With a Link, click Catalog, Back home, then press the browser's Back, Back and Forward: the address goes `/catalog`, `/`, `/catalog`, and `Saved` stays `2`. Only a real reload (F5) starts again from `Saved: 0`.

### 5. A page for every address (`v2-notfound`)

Type `/nothing` into the address bar. Here is what React Router shows by default:

```text
Unexpected Application Error!
404 Not Found
```

and the console says `Error handled by React Router default ErrorBoundary: {status: 404, statusText: 'Not Found', data: 'Error: No route matches URL "/nothing"', ...}`. Fine for you, not for a visitor. Add a route with `path: '*'` (it matches anything else) and your own page:

`versions/v2-notfound/NotFound.jsx`:
```jsx
import { Link } from 'react-router'

export default function NotFound() {
  return (
    <main className="page">
      <h1>Page not found</h1>
      <p>There is nothing at this address.</p>
      <Link to="/">Go home</Link>
    </main>
  )
}
```

The real page now says `Page not found` and `There is nothing at this address.`, with a link home that works without a reload.

### 6. Three beginner mistakes

**Mistake one: a `Link` outside the router (`m1-outside`).** Asha adds a Home `Link` to the header in `App`, which sits above `RouterProvider`:

```diff
@@ -2,4 +2,5 @@
 import { createBrowserRouter } from 'react-router'
 import { RouterProvider } from 'react-router/dom'
+import { Link } from 'react-router'
 import Home from './Home.jsx'
 import Catalog from './Catalog.jsx'
@@ -18,4 +19,5 @@
       <header>
         <b className="logo">allcsvideos</b>
+        <Link to="/">Home</Link>
         <span className="saved">Saved: {saved}</span>
         <button onClick={() => setSaved(saved + 1)}>
```

The whole screen goes blank, not only the page, the header too. The console says:

```text
TypeError: Cannot destructure property 'basename' of 'import_react.useContext(...)' as it is null.
```

`Link` asks the router what to do, but the router only exists inside `RouterProvider`. Put the link inside a page (lesson 3 gives the layout for that).

**Mistake two: `href` instead of `to` (`m2-hrefprop`).** `<Link href="/catalog">` renders, but clicking it does nothing: no error, no warning, the address stays. The link was given no destination, so it points to the page you are already on. The prop is `to`.

**Mistake three: the old tutorial import (`m3-dom`).** Old tutorials import from `react-router-dom`:

```diff
@@ -1,5 +1,5 @@
 import { useState } from 'react'
-import { createBrowserRouter } from 'react-router'
-import { RouterProvider } from 'react-router/dom'
+import { createBrowserRouter } from 'react-router-dom'
+import { RouterProvider } from 'react-router-dom'
 import Home from './Home.jsx'
 import Catalog from './Catalog.jsx'
```

Vite shows its red overlay: `Failed to resolve import "react-router-dom" from "src/App.jsx". Does the file exist?` We never installed that name. Import from `react-router` instead (and `RouterProvider` from `react-router/dom`).

## Common mistakes

- A plain `<a href>` between pages of your app: it reloads everything.
- A `Link` above or outside `RouterProvider`.
- `<Link href=...>`: the prop is `to`.
- Importing from `react-router-dom` (version 8 uses `react-router`).
- No `*` route, so visitors see the developer error page.

## Clean up

```bash
rm -rf node_modules dist
```

Press `Ctrl+C` to stop the dev server.

## Next

Continue with [M08-L02 · Routes, Links and URL Parameters](../m08-l02-routes-links-and-url-parameters/).
