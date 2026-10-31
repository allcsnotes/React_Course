# M08-B05 · Build the allcsvideos Frontend v1

> Video: Module 8, Build 5. Watch it first, then follow along here.

## What you'll build

The first real many-page allcsvideos website: a home page with a hero and featured courses, a catalog whose filters live in the address, a page for every course and for every lesson (with a sidebar), a header with the My courses badge, a Loading indicator while pages load, and a 404 page. It uses everything from Module 8: the route tree, layouts and `Outlet`, `useParams`, `useSearchParams`, loaders, `useNavigation`, and an error page. Version 1 has no login yet (see the end).

## Before you start

- Node 24 (`node --version`).
- Best after M08-L01 to [M08-L04](../m08-l04-loaders-actions-and-protected-routes/).
- No Docker needed. `api/server.mjs` is a tiny local stand-in for the allcsvideos API on port 8185, on your own computer. It is not the real production server.

## Files in this folder

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | React 19.3.1, Vite 8.3.5, `react-router` 8.5.1 |
| `vite.config.js` | Proxies `/api` to the stand-in server on port 8185 |
| `api/server.mjs` | The stand-in API for courses and lessons |
| `src/main.jsx` | Renders `RouterProvider` (from `react-router/dom`) |
| `src/router.jsx` | The whole route tree with the loaders |
| `src/api.js` | `getCourses` and `getCourse(slug)` |
| `src/layouts/RootLayout.jsx` | Header, `Outlet`, footer, the badge and the Loading pill |
| `src/layouts/CourseLayout.jsx` | The course frame: sidebar and an `Outlet` that shares the course |
| `src/pages/Home.jsx`, `Catalog.jsx`, `CourseDetail.jsx`, `Lesson.jsx`, `NotFound.jsx`, `ErrorPage.jsx` | The pages |
| `src/components/CourseCard.jsx` | The course card from Module 3 |
| `src/utils/formatPrice.js` | `Rs 499` or `Free` |
| `*.module.css`, `src/index.css` | The styles (CSS Modules, Module 6) |
| `steps/` | The files at each stage of the video (numbered: `router.1.jsx` to `router.5b.jsx`, `CourseLayout.3.jsx`, `Lesson.4.jsx`, ...), with the "bad" versions `CourseLayout.3bad.jsx` and `Lesson.4bad.jsx` |

## Run it

You need two terminals. In the first:

```bash
node api/server.mjs
```

```text
API on http://localhost:8185
```

In the second:

```bash
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`). Real text of the home page:

```text
allcsvideos | Home | Catalog | My courses 0 | Learn computer science, one lesson at a time | Browse the catalog | Featured courses | React for Beginners | Meera · 4 lessons | Rs 499 | Python from Zero | Meera · 3 lessons | Free | DevOps Basics | Asha · 3 lessons | Free
```

## Build it step by step

### 1. The map of pages

`/` is the home page (a hero and three featured courses). `/catalog` is the catalog with filters for the level and for free courses. `/courses/:slug` is a course, and `/courses/:slug/lessons/:id` a lesson; both sit inside a course frame with a sidebar. Every page shares a header (links and the My courses badge from M04-L05) and a footer. We reuse the course card (M03) and a layout, which now becomes an `Outlet` (M08-L03). Styling is CSS Modules (M06).

### 2. The route tree, on paper

Remember M08-L03: routes nest and every level has an outlet. The root route owns `/` with `RootLayout` (header, `Outlet`, footer). Home is an index route. Catalog is `catalog`. The course is `courses/:slug` and is a frame too (`CourseLayout`, with its own `Outlet`), with an index child (the course page) and `lessons/:id`. Read an address from left to right: `courses / react-for-beginners / lessons / 2` is RootLayout, then CourseLayout, then Lesson: two frames, two outlets, one page.

### 3. Who owns what

The courses and their lessons are data from the server: the loader fetches them before the page shows, so we do not copy them into state (M05-L05). The one real piece of state is which courses the student enrolled in, because both the badge in the header and the Enroll button on a course page need it, so it lives in `RootLayout` (the closest parent they share) and travels down through the outlet.

### 4. Step one: the router (`steps/router.1.jsx`, `steps/RootLayout.1.jsx`)

Start from a fresh Vite React project with `react-router` installed (8.5.1). In `main.jsx` the `RouterProvider` from `react-router/dom` gets one prop, `router`. Everything else lives in `router.jsx`. The root route has `RootLayout` and an index child for Home.

### 5. Step two: the catalog (`steps/router.2.jsx`)

A new route `catalog` with the same loader (`getCourses`) and the `Catalog` element, and a second `NavLink` in the header. The page reads all courses with `useLoaderData()` and the filters with `useSearchParams()` (M08-L02): level is `get('level')` or `all`. One function copies the search params, sets the key (or deletes it when the value is empty) and calls `setSearchParams`. The loader would run again on every filter click, so the route has `shouldRevalidate` that only reloads when the path changes (`router.2b.jsx`).

### 6. Step three: the course page (`steps/router.3.jsx`, `steps/CourseLayout.3.jsx`)

The route `courses/:slug` has a loader that gets an object with `params`, so `params.slug` goes to `getCourse`. `CourseLayout` reads the course with `useLoaderData`, shows the sidebar (a `NavLink` to the overview with `end`, and one for every lesson), and hands the course to its child through the outlet:

`src/layouts/CourseLayout.jsx`:
```jsx
  return (
    <div className={styles.wrap}>
      <aside className={styles.side}>
        <h2>{course.title}</h2>
        <NavLink
          to={`/courses/${course.slug}`}
          end
          className={link}
        >
          Overview
        </NavLink>
        {course.lessons.map(l => (
          <NavLink
            key={l.id}
            to={`/courses/${course.slug}/lessons/${l.id}`}
            className={link}
          >
            {l.id}. {l.title}
          </NavLink>
        ))}
      </aside>
      <section className={styles.content}>
        <Outlet context={{ ...shared, course }} />
      </section>
    </div>
  )
}
```

Guess: click the course card, React for Beginners. The sidebar is ready and the page is written, but in the first version (`steps/CourseLayout.3bad.jsx`) the middle only has a comment where the `Outlet` should be, so the card on the right shows nothing. The fix is `<Outlet context={{ course }} />`, and the child reads it with `useOutletContext()`. The real course page:

```text
React for Beginners | Overview | 1. What React is | 2. Components as bricks | 3. Props | 4. State | React for Beginners | by Meera · beginner · 4 lessons | Rs 499 | Enroll  Start lesson 1
```

### 7. Step four: the lesson page (`steps/Lesson.4bad.jsx`, `steps/Lesson.4.jsx`)

One more child of the course route, `lessons/:id`. `Lesson` takes the course from the outlet context and the id from `useParams`, and looks the lesson up with `find`. Guess: lesson 2 exists and its link is in the sidebar; click it. In the bad version the page says "lesson not found": the address, the sidebar, everything is right, but `useParams` gives the id as text, and the lessons have numbers.

```diff
@@ -5,5 +5,5 @@
   const { course } = useOutletContext()
   const { id } = useParams()
-  const lesson = course.lessons.find(l => l.id === id)
+  const lesson = course.lessons.find(l => l.id === Number(id))
 
   if (!lesson) return <p>Lesson not found.</p>
```

The fix is `Number(id)`. The real lesson page:

```text
What React is | Lesson 1 of 4 · 8 min | ▶ video | What React is. Watch the video, then try the practice task. | Next lesson: Components as bricks
```

### 8. Step five: polish (`steps/router.5.jsx`, `steps/RootLayout.5.jsx`)

Three things: a loading indicator, a 404 page and an error page, and the badge.

- **Loading.** `useNavigation()` (M08-L04) tells us what the router is doing. In `RootLayout`, when the state is `loading` a pill says `Loading`: the old page stays on screen while the loader runs and the new page then appears.
- **The first load** had nothing to show, so the root route gets `hydrateFallbackElement` (see the router below).
- **404 and errors.** A `*` route with `NotFound` (`router.5a.jsx` to `router.5b.jsx`), and an `errorElement` on the course route.
- **The badge.** `enrolled` is state in `RootLayout`; `toggleEnroll(slug)` adds or removes a slug. `CourseLayout` forwards the shared context (`{ ...shared, course }`) one level further, using `useOutletContext` (`CourseLayout.5.jsx`, which fixes `CourseLayout.5bad.jsx`: an outlet passes context only one level down).

The finished router:

`src/router.jsx`:
```jsx
export default createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    hydrateFallbackElement: (
      <p className="splash">Loading...</p>
    ),
    children: [
      {
        index: true,
        element: <Home />,
        loader: getCourses,
      },
      {
        path: 'catalog',
        element: <Catalog />,
        loader: getCourses,
        shouldRevalidate: ({
          currentUrl,
          nextUrl,
        }) =>
          currentUrl.pathname !==
          nextUrl.pathname,
      },
      {
        path: 'courses/:slug',
        element: <CourseLayout />,
        errorElement: <ErrorPage />,
        loader: ({ params }) =>
          getCourse(params.slug),
        children: [
          {
            index: true,
            element: <CourseDetail />,
          },
          {
            path: 'lessons/:id',
            element: <Lesson />,
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])
```

### 9. Test it like a user

A real Playwright run against this exact project:

```text
Catalog:              Catalog 8 of 8 | All | Beginner | Intermediate | Advanced | Free only | React for Beginners | Python from Zero | DevOps Basics | SQL in Two Weeks | ...
Beginner:             /catalog?level=beginner               Catalog 3 of 8
Beginner + Free only: /catalog?level=beginner&free=1        Catalog 2 of 8 | Python from Zero | DevOps Basics
Course page:          /courses/react-for-beginners          My courses 0 ... Rs 499 | Enroll  Start lesson 1
After Enroll:         /courses/react-for-beginners          My courses 1 ... Rs 499 | Enrolled  Start lesson 1
Start lesson 1:       /courses/react-for-beginners/lessons/1   Lesson 1 of 4 · 8 min
Back button:          /courses/react-for-beginners          the same course page, Enrolled, My courses 1
Unknown address:      /nope                                 404 | No page lives at /nope | Go to the home page
Deep link, reloaded:  /courses/react-for-beginners/lessons/2   Components as bricks | Lesson 2 of 4 · 11 min | ...
```

The badge restarts at `My courses 0` after a full page load, because the enrolled list lives in React state (see the end).

## What breaks in real life

1. **Deep links on a real host.** `npm run build` makes a `dist` folder with one HTML file, one CSS file and one script. Served by the simplest static server, `/catalog` works only when you click, because that is the router; a refresh asks the server for a file called `catalog`, which does not exist. The fix is a rewrite rule: if there is no file for an address, send `index.html` with a 200, and then the router reads the address and shows the right page. (Deployment is Module 21.)
2. **No login.** System Design is a paid course, but type the address of its lesson 2 with nobody signed in and the lesson opens. Hiding a link is not security: the server must check, and real authentication comes in Module 13 (a loader guard like M08-L04 only guards the screen).
3. **The badge is forgotten on refresh.** The enrolled list is state in React, so it lives only until the page is reloaded.

## Your turn

1. A breadcrumb on the lesson page: `Home / the course title / the lesson title`, each part a link except the last. Hint: the course is already in the outlet context, and the lesson is found from `useParams`.
2. Continue where you left off: remember the last lesson the student opened and show a link to it on the home page. Hint: the address already says everything; you only need to store it.

## Common mistakes

- An `Outlet` without `context`, or a child that does not forward it.
- `useParams` values are text: use `Number(id)` before comparing with numbers.
- A catalog loader that reruns on every filter click: add `shouldRevalidate`.
- No `*` route and no `errorElement`: visitors see the developer error screen.
- Treating a hidden link as security.

## Clean up

Stop the dev server and the API server with `Ctrl+C`. Then:

```bash
rm -rf node_modules dist
```

## Next

Continue with Module 9, TypeScript with React, starting at [M09-L01](../../m09-typescript-for-react/m09-l01-typescript-in-one-video/).
