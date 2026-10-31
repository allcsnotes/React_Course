# M08-L03 · Nested Routes and Layouts

> Video: Module 8, Lesson 3. Watch it first, then follow along here.

## What you'll learn

- A layout route: a frame (header, footer) drawn once, with an `<Outlet />` where the child page goes
- Why the cart in the header keeps its value when you change page
- Nested routes (`courses/:slug` with `lessons/:lessonId` inside), index routes, and why child paths have no leading slash
- Route errors: the default error screen, an `errorElement` for the whole page, and one inside the layout so the frame survives
- A `*` route for pages that do not exist
- Two mistakes: a layout without an `Outlet`, and an absolute child path

## Before you start

- Node 24 (`node --version`).
- Best after [M08-L02](../m08-l02-routes-links-and-url-parameters/) (route table, `useParams`) and M03-L05 (a `Layout` component with children).
- No Docker needed.

## Files in this folder

`src/` is the finished app (`versions/v4-final`). Each `versions/` folder holds every changed file of that step: copy it with `cp -R versions/<name>/. src/`.

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | React 19.3.1, Vite 8.3.5, `react-router` 8.5.1 |
| `src/main.jsx` | Renders `RouterProvider` |
| `src/router.jsx` | The nested route table |
| `src/RootLayout.jsx`, `Header.jsx`, `Footer.jsx` | The frame: top bar with the cart, `Outlet`, bottom bar |
| `src/Home.jsx`, `Catalog.jsx`, `About.jsx`, `NotFound.jsx`, `ErrorPage.jsx` | The pages |
| `src/CourseLayout.jsx`, `CourseIntro.jsx`, `Lesson.jsx` | The course frame (lesson list on the left), its default page and a lesson |
| `src/data/courses.js`, `src/App.css`, `src/index.css` | Data and styles |
| `versions/v0-repeat` | Every page repeats the header (the cart resets) |
| `versions/v1-layout`, `v1b-nooutlet` | The root layout, and the same without `Outlet` |
| `versions/v2-nested`, `v2b-index` | Nested course routes, then with index routes |
| `versions/v3-errdef`, `v3b-errroot`, `v3c-errinside` | The default error page, an error page for everything, an error page inside the frame |
| `versions/v4-final` | Error page plus a `*` route (the finished app) |
| `versions/v5-slash` | An absolute child path (mistake) |

## Follow along

### 1. Set up

```bash
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`).

### 2. The problem (`v0-repeat`)

The site has a home page, a catalog and an about page, each with its own copy of the header. Click the cart button three times: `Cart: 3`. Click Catalog. The real page text:

```text
at start:   allcsvideos | Home | Catalog | About | Cart: 0 | Learn by building ...
3 clicks:   ... Cart: 3 ...
Catalog:    allcsvideos | Home | Catalog | About | Cart: 0 | All courses | React for Beginners | Open ...
```

The cart is back to 0. Every page drew its own header, so the header was thrown away and built again.

### 3. A layout route (`v1-layout`)

A website is a picture frame in a shop: the top bar and bottom bar are the frame, the page in the middle is the painting. You wrote a `Layout` component with `children` in M03-L05. Here `Outlet` takes the place of `children`.

`versions/v4-final/RootLayout.jsx`:
```jsx
import { Outlet } from 'react-router'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

export default function RootLayout() {
  return (
    <div className="shell">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
```

In the router, one route is for the frame: its path is `/`, its element is `RootLayout`, and the page routes are its `children`:

`versions/v1-layout/router.jsx`:
```jsx
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'catalog', element: <Catalog /> },
      { path: 'about', element: <About /> },
    ],
  },
])
```

The header state (the cart) now lives in the frame, which stays on the screen while only the middle changes. The same clicks:

```text
3 clicks:   ... Cart: 3 ...
Catalog:    ... Cart: 3 | All courses | React for Beginners | Open ...
About:      ... Cart: 3 | About us | We teach by building real apps. ...
```

### 4. Mistake: no `Outlet` (`v1b-nooutlet`)

Build the layout, save, and the middle is empty: no page and no error message. The header and footer are there, and between them nothing. The router matched the right page, but the layout never said where to draw it:

```text
allcsvideos | Home | Catalog | About | Cart: 0 | allcsvideos.com
```

Put `<Outlet />` inside `main` and the pages come back. Every layout needs exactly one `Outlet`.

### 5. Nested routes and index routes (`v2-nested`, `v2b-index`)

Open a course and you want the list of lessons on the left, always, and the lesson on the right. The address reads like folders: `/courses/react/lessons/2`. Each part belongs to one level: the root frame owns `/`; the course frame owns `courses/:slug` (it draws the lesson list and its own `Outlet`); the lesson page owns `lessons/:lessonId`. An index route is the default child, the page shown when the address ends at the parent (the course intro at `/courses/react`).

`versions/v2b-index/router.jsx`:
```jsx
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'catalog', element: <Catalog /> },
      {
        path: 'courses/:slug',
        element: <CourseLayout />,
        children: [
          { index: true, element: <CourseIntro /> },
          {
            path: 'lessons/:lessonId',
            element: <Lesson />,
          },
        ],
      },
      { path: 'about', element: <About /> },
    ],
  },
])
```

Notice that child paths have no leading slash: they continue the parent's path. The real clicks: Catalog, `/courses/react` (`React for Beginners | 1. What React is | 2. Components | 3. P...`), `/courses/react/lessons/2`, `/courses/react/lessons/3`. The lesson list stays while only the right side changes.

### 6. Mistake: an absolute child path (`v5-slash`)

A child path that starts with a slash is absolute. Writing `path: '/lessons/:lessonId'` inside `courses/:slug` throws this error in the console:

```text
Absolute route path "/lessons/:lessonId" nested under path "/courses/:slug" is not valid. An absolute child route path must start with the combined path of all its parent routes.
```

Drop the slash (`lessons/:lessonId`).

### 7. When something breaks (`v3-errdef`, `v3b-errroot`, `v3c-errinside`)

Lukas reaches lesson 4, the last, and clicks Next lesson, which always goes to the next number. `Lesson.jsx` is honest: if the title is missing, it throws `Lesson 5 does not exist`. With nothing else set, the router shows its own screen (cart was 2):

```text
Unexpected Application Error!
Lesson 5 does not exist
Error: Lesson 5 does not exist ...
```

and a URL that matches nothing (`/pricing`) shows `404 Not Found` on the same developer screen. Both are fine for you, not for visitors.

An `errorElement` replaces the page with your own `ErrorPage`. On the root route (`v3b-errroot`) it replaces everything, frame included:

```text
Oops, something went wrong | Lesson 5 does not exist | Back to the catalog
```

On a route inside the frame (`v3c-errinside`) only the middle is replaced, and the header keeps its cart:

```text
allcsvideos | Home | Catalog | About | Cart: 2 | Oops, something went wrong | Lesson 5 does not exist | ...
```

### 8. The finished router (`v4-final`)

An `errorElement` on a pathless child route (so the frame survives) and a `*` route for pages that do not exist:

`versions/v4-final/router.jsx`:
```jsx
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Home /> },
          { path: 'catalog', element: <Catalog /> },
          {
            path: 'courses/:slug',
            element: <CourseLayout />,
            children: [
              { index: true, element: <CourseIntro /> },
              {
                path: 'lessons/:lessonId',
                element: <Lesson />,
              },
            ],
          },
          { path: 'about', element: <About /> },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
])
```

The real result of the whole story: lesson 5 shows `Oops, something went wrong | Lesson 5 does not exist` with the header and `Cart: 2` still there, and `/pricing` shows `Page not found | There is nothing at this address.` with a link home. (Typing the address into the bar loads the page again, so the cart restarts at 0.)

## Common mistakes

- Repeating the header in every page: it is thrown away on each change. Use a layout route.
- A layout without `<Outlet />`: an empty middle and no error.
- A leading slash on a nested child path.
- `errorElement` only on the root route: the frame disappears too.
- No `*` route: visitors see the developer error page.

## Clean up

```bash
rm -rf node_modules dist
```

Press `Ctrl+C` to stop the dev server.

## Next

Continue with [M08-L04 · Loaders, Actions and Protected Routes](../m08-l04-loaders-actions-and-protected-routes/).
