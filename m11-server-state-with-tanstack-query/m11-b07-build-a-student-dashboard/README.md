# M11-B07 · Build a Student Dashboard

> Video: Module 11, Build 7. Watch it first, then follow along here.

## What you'll learn

- Plan a data-driven app by asking where each piece of state lives, and which cache boxes (keys) it needs
- Set up TanStack Query, React Router and a typed, Zod-checked `getJson` helper
- Build the dashboard (`useMyCourses`) and the course page (`useCourse`) with loading and error states
- Mark a lesson complete with a mutation: first the safe way (`invalidateQueries`), then an optimistic update with rollback
- Update and restore both cache boxes when one fact lives in two places (the lesson and the course count)
- Check the whole thing like a user with a real browser (the end-to-end script) and know what is still not production

## Before you start

- Node 24. Check with `node --version`.
- No Docker needed. The data comes from `api/server.mjs`, a small local Node stand-in for the allcsvideos API (port 8217). It is not the production server. Lukas is "signed in"; there is no login yet (module 13).
- Best after M11-L04 (`../m11-l04-pagination-infinite-scroll-and-prefetching/`) and the whole of module 11.
- The project is `dashboard-web/` (Vite 8.3.5, React 19.3.1, React Router 8.5.1, TypeScript 7.0.2, TanStack Query 5.105.0, Zod 4.6.7).

## Files in this folder

| File | What it is |
|------|------------|
| `dashboard-web/` | The finished dashboard (same as `steps/s5-optimistic-both-boxes`) |
| `dashboard-web/src/queries.ts` | `useMyCourses`, `useCourse`, `useCompleteLesson` |
| `dashboard-web/src/progress.ts` | `markDone` and `addOne`: small functions that make new objects |
| `dashboard-web/src/api.ts`, `schema.ts` | `getJson` and the Zod schemas |
| `dashboard-web/src/Dashboard.tsx`, `CoursePage.tsx`, `ProgressBar.tsx` | The two pages and the bar |
| `api/server.mjs`, `api/mode.txt` | The practice API; `mode.txt` is `ok`, `fail` (saving fails with 500) or `down` (reading fails with 503) |
| `steps/` | Complete `src/` snapshots: `s1-setup`, `s2-dashboard`, `s3-course-page`, `s4a-wrong-key`, `s4-mark-complete`, `s5a-optimistic-one-box`, `s5-optimistic-both-boxes` |
| `e2e/` | The Playwright end-to-end check from the video (`node e2e.mjs`) |
| `probes/p-params.ts` | The type error from using `useParams` directly |
| `use-step.sh` | Replaces `dashboard-web/src` with one snapshot |

## Run it

```bash
cd dashboard-web
npm install
```

In one terminal, start the practice API from this lesson folder:

```bash
node api/server.mjs
```
```bash
practice API on http://localhost:8217
```

In another, the dev server:

```bash
npm run dev
```

Open the address Vite prints (this project asks for http://localhost:5717). You see the dashboard with four courses and a progress bar each: React for Beginners 2 of 4 (50%), Python from Zero 3 of 3 (100%), SQL in Two Weeks 1 of 3 (33%), System Design 0 of 4 (0%). Open React for Beginners and click `Mark complete` on the lesson called Props: it says `Done` at once, and the bar jumps to 75%. Go back to the dashboard: 3 of 4, no flash. Reset the practice data any time with `curl -X POST http://localhost:8217/api/reset`. To see the bad day, `echo fail > ../api/mode.txt` and click again: Done, 75%, and a second later the server says 500 and the page puts the lesson back, with a message.

## Build it step by step

Every step has a snapshot in `steps/`. From inside `dashboard-web/`: `sh ../use-step.sh s2-dashboard` replaces `src/`. To build along, start from `s1-setup` and make the edits shown.

### The plan

Two pages: the dashboard at `/` lists my courses, each with a progress bar; the course page at `/course/:slug` lists the lessons, each with a `Mark complete` button. Three addresses on the practice API:

- `GET /api/me/courses`: the list of my courses, with a count of completed lessons.
- `GET /api/me/courses/:slug`: one course with every lesson and a `done` flag.
- `POST /api/me/courses/:slug/lessons/:id/complete`: mark a lesson complete (it takes 1.2 seconds, reading takes 0.4).

Where does each piece of state live (M10-L05)? The courses, the lessons and the progress come from a server: server state, so TanStack Query. The page you are on is in the address (the router). The only local state is the loading and error states, which the library gives us. The numbers (percent, counts on the bar) are derived; we do not store them.

The cache holds two boxes for this app. The box `['my-courses']` holds the list for the dashboard. The box `['course', slug]` holds one course with its lessons. And here is the catch: marking a lesson complete changes a fact that lives in both boxes, the lesson inside the course box, and the count in the list box. The plan has five steps: setup; the dashboard; the course page; mark complete with a plain mutation; mark complete optimistic, in both boxes.

### Step 1: setup

A fresh Vite project with TypeScript (as in module 9), and three packages: React Router (module 8), TanStack Query (this module) and Zod (module 9).

```bash
npm create vite@latest dashboard-web -- --template react-ts
cd dashboard-web
npm install react-router @tanstack/react-query zod
```

In `main.tsx`, the same two moves as lesson 2: create one query client and wrap the app in `QueryClientProvider`, with the router provider inside. The query client gets a default for the whole app: `staleTime: 30_000` (data stays fresh for 30 seconds).

```bash
sh ../use-step.sh s1-setup
```
`steps/s1-setup/main.tsx`:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { router } from './router.tsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000 } },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
```

The shape of the data comes first, as a Zod schema (M09-L04): a course in the list has a slug, a title, a teacher, a lesson count and a completed count.

`steps/s1-setup/schema.ts`:
```ts
import { z } from 'zod'

export const MyCourseSchema = z.object({
  slug: z.string(),
  title: z.string(),
  teacher: z.string(),
  lessonCount: z.number(),
  completedCount: z.number(),
})
export const MyCoursesSchema = z.array(MyCourseSchema)

export type MyCourse = z.infer<typeof MyCourseSchema>
```

And the helper from that lesson: `getJson` takes an address, a schema and optional request settings, calls `fetch`, throws when the server answers with an error, and checks the answer with `safeParse`:

`steps/s1-setup/api.ts`:
```ts
import { z } from 'zod'
import { MyCoursesSchema } from './schema.ts'

async function getJson<T>(
  url: string,
  schema: z.ZodType<T>,
  init?: RequestInit,
) {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`Server answered ${res.status}`)
  const result = schema.safeParse(await res.json())
  if (!result.success) {
    const { path, message } = result.error.issues[0]
    throw new Error(`Bad data at ${path.join('.')}: ${message}`)
  }
  return result.data
}

export const getMyCourses = () =>
  getJson('/api/me/courses', MyCoursesSchema)
```

The router is the one from module 8: a root layout with a header and an outlet, and one child route, the dashboard. For now the page is only a heading.

`steps/s1-setup/router.tsx`:
```tsx
import { createBrowserRouter } from 'react-router'
import RootLayout from './RootLayout.tsx'
import Dashboard from './Dashboard.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [{ index: true, element: <Dashboard /> }],
  },
])
```

`steps/s1-setup/Dashboard.tsx`:
```tsx
export default function Dashboard() {
  return <h1>My courses</h1>
}
```

```bash
npx tsc -b
```
```bash
npx tsc -b
```

### Step 2: the dashboard

A new file, `queries.ts`, with a custom hook (module 7, lesson 6). `useMyCourses` calls `useQuery` with the key `['my-courses']` and the function `getMyCourses`.

```bash
sh ../use-step.sh s2-dashboard
```
`steps/s2-dashboard/queries.ts`:
```ts
import { useQuery } from '@tanstack/react-query'
import { getMyCourses } from './api.ts'

export function useMyCourses() {
  return useQuery({
    queryKey: ['my-courses'],
    queryFn: getMyCourses,
  })
}
```

The page calls the hook and takes five things: `data`, `isPending`, `isError`, `error` and `refetch`. If it is pending we say loading; if it is an error we show the message and a `Try again` button; otherwise a list: one card for each course, with the title as a link to the course page, the teacher, and a progress bar. The bar is a small component that works out the percent from two numbers:

`Dashboard.tsx` (changes marked with + and -):
```diff
@@ -1,3 +1,34 @@
+import { Link } from 'react-router'
+import { useMyCourses } from './queries.ts'
+import ProgressBar from './ProgressBar.tsx'
+
 export default function Dashboard() {
-  return <h1>My courses</h1>
+  const { data, isPending, isError, error, refetch } = useMyCourses()
+
+  if (isPending) return <p className="note">Loading your courses...</p>
+  if (isError) {
+    return (
+      <div className="bad">
+        <p>{error.message}</p>
+        <button onClick={() => refetch()}>Try again</button>
+      </div>
+    )
+  }
+
+  return (
+    <>
+      <h1>My courses</h1>
+      <ul className="grid">
+        {data.map((c) => (
+          <li key={c.slug} className="card">
+            <h2>
+              <Link to={`/course/${c.slug}`}>{c.title}</Link>
+            </h2>
+            <p>by {c.teacher}</p>
+            <ProgressBar done={c.completedCount} total={c.lessonCount} />
+          </li>
+        ))}
+      </ul>
+    </>
+  )
 }
```

`steps/s2-dashboard/ProgressBar.tsx`:
```tsx
type Props = { done: number; total: number }

export default function ProgressBar({ done, total }: Props) {
  const percent = Math.round((done / total) * 100)
  return (
    <div>
      <div className="track">
        <div
          className={percent === 100 ? 'fill full' : 'fill'}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p>
        {done} of {total} lessons · {percent}%
      </p>
    </div>
  )
}
```

Guess: SQL in Two Weeks has one lesson done, out of three. What percent does its card say? `Math.round(1 / 3 * 100)` is 33. Real run: first the loading line, then four cards. React for Beginners: 2 of 4 lessons, 50%. Python from Zero: 3 of 3, a full bar (100%). SQL in Two Weeks: 1 of 3, 33%. System Design: 0 of 4, 0%.

Now the server breaks. Lesson 2 measured it: by default a failed query is tried three more times, and the error shows after about ten seconds. For this app one retry is enough, so the query client gets `retry: 1` in `main.tsx`:

`main.tsx` (changes marked with + and -):
```diff
@@ -8,3 +8,3 @@
 const queryClient = new QueryClient({
-  defaultOptions: { queries: { staleTime: 30_000 } },
+  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
 })
```

With the API in `down` mode (`echo down > ../api/mode.txt`), the dashboard shows `Server answered 503` and a `Try again` button after a little over a second. Put the mode back to `ok` and click `Try again`: the courses appear.

```bash
npx tsc -b
```
```bash
npx tsc -b
```

### Step 3: the course page

A second schema: a lesson has an id, a title, minutes and a `done` flag; a course has its lessons inside, with `z.array`.

```bash
sh ../use-step.sh s3-course-page
```
`schema.ts` (changes marked with + and -):
```diff
@@ -11,2 +11,16 @@
 
+export const LessonSchema = z.object({
+  id: z.number(),
+  title: z.string(),
+  minutes: z.number(),
+  done: z.boolean(),
+})
+export const CourseDetailSchema = z.object({
+  slug: z.string(),
+  title: z.string(),
+  teacher: z.string(),
+  lessons: z.array(LessonSchema),
+})
+
 export type MyCourse = z.infer<typeof MyCourseSchema>
+export type CourseDetail = z.infer<typeof CourseDetailSchema>
```

The hook `useCourse` takes a slug, and the key is `['course', slug]`: the function uses the slug, so the slug goes in the key (lesson 2):

`queries.ts` (changes marked with + and -):
```diff
@@ -1,3 +1,3 @@
 import { useQuery } from '@tanstack/react-query'
-import { getMyCourses } from './api.ts'
+import { getCourse, getMyCourses } from './api.ts'
 
@@ -9 +9,8 @@
 }
+
+export function useCourse(slug: string) {
+  return useQuery({
+    queryKey: ['course', slug],
+    queryFn: () => getCourse(slug),
+  })
+}
```

The page reads the slug from the address with `useParams` (module 8), then the same pattern: loading, error, and the page. The title, a progress bar made of the lessons that are done, and the list of lessons:

`steps/s3-course-page/CoursePage.tsx`:
```tsx
import { Link, useParams } from 'react-router'
import { useCourse } from './queries.ts'
import ProgressBar from './ProgressBar.tsx'

export default function CoursePage() {
  const { slug = '' } = useParams()
  const { data, isPending, isError, error } = useCourse(slug)

  if (isPending) return <p className="note">Loading the course...</p>
  if (isError) return <p className="bad">{error.message}</p>

  const done = data.lessons.filter((l) => l.done).length
  return (
    <>
      <Link to="/">All my courses</Link>
      <h1>{data.title}</h1>
      <ProgressBar done={done} total={data.lessons.length} />
      <ul className="lessons">
        {data.lessons.map((l) => (
          <li key={l.id}>
            <span className="t">{l.title}</span>
            <span className="meta">{l.minutes} min</span>
            <span className={l.done ? 'tag done' : 'tag'}>
              {l.done ? 'Done' : 'To do'}
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}
```

My first draft took the slug straight from `useParams` and handed it to `useCourse`. The type checker stops me. `probes/p-params.ts` is that draft:

`probes/p-params.ts`:
```ts
import { useParams } from 'react-router'
import { useCourse } from './queries.ts'

export function usePage() {
  const { slug } = useParams()
  return useCourse(slug)
}
```

```bash
cp ../probes/p-params.ts src/probe.ts
npx tsc -b
```
```bash
npx tsc -b
src/probe.ts:6:20 - error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
  Type 'undefined' is not assignable to type 'string'.

6   return useCourse(slug)
                     ~~~~

Found 1 error in src/probe.ts:6
```

The fix: a default value in the destructuring, an empty string (module 2, lesson 2): `const { slug = '' } = useParams()`. This route always has a slug, so the default never fires; it only satisfies the types. Remove the probe (`rm src/probe.ts`).

Real run: click React for Beginners: a loading line, and then the lessons. Props and State are not done. Now the proof of the cache: open the course, go back to the dashboard (no request, the list is fresh for 30 seconds), and open the course again. The end-to-end check below measures this.

```bash
npx tsc -b
```
```bash
npx tsc -b
```

### Step 4: mark complete, the safe way

First the writing function, like lesson 3: `completeLesson` takes a slug and a lesson id and sends a `POST` (with the `getJson` helper and a `DoneSchema`):

```bash
sh ../use-step.sh s4-mark-complete
```
`api.ts` (changes marked with + and -):
```diff
@@ -1,3 +1,7 @@
 import { z } from 'zod'
-import { CourseDetailSchema, MyCoursesSchema } from './schema.ts'
+import {
+  CourseDetailSchema,
+  DoneSchema,
+  MyCoursesSchema,
+} from './schema.ts'
 
@@ -23 +27,6 @@
   getJson(`/api/me/courses/${slug}`, CourseDetailSchema)
+
+export const completeLesson = (slug: string, id: number) =>
+  getJson(`/api/me/courses/${slug}/lessons/${id}/complete`, DoneSchema, {
+    method: 'POST',
+  })
```

Then the hook, `useCompleteLesson`: `useMutation` gets the mutation function, and on success we invalidate both boxes: the course and `my-courses`.

`queries.ts` (changes marked with + and -):
```diff
@@ -1,3 +1,7 @@
-import { useQuery } from '@tanstack/react-query'
-import { getCourse, getMyCourses } from './api.ts'
+import {
+  useMutation,
+  useQuery,
+  useQueryClient,
+} from '@tanstack/react-query'
+import { completeLesson, getCourse, getMyCourses } from './api.ts'
 
@@ -16 +20,12 @@
 }
+
+export function useCompleteLesson(slug: string) {
+  const queryClient = useQueryClient()
+  return useMutation({
+    mutationFn: (id: number) => completeLesson(slug, id),
+    onSuccess: () => {
+      queryClient.invalidateQueries({ queryKey: ['course', slug] })
+      queryClient.invalidateQueries({ queryKey: ['my-courses'] })
+    },
+  })
+}
```

The page calls the hook, and every lesson that is not done gets a button. A click calls `mutate` with the lesson id. While the save runs the buttons are disabled and the clicked one says `Saving...`; an error message shows if the save failed.

`CoursePage.tsx` (changes marked with + and -):
```diff
@@ -1,3 +1,3 @@
 import { Link, useParams } from 'react-router'
-import { useCourse } from './queries.ts'
+import { useCompleteLesson, useCourse } from './queries.ts'
 import ProgressBar from './ProgressBar.tsx'
@@ -7,2 +7,3 @@
   const { data, isPending, isError, error } = useCourse(slug)
+  const complete = useCompleteLesson(slug)
 
@@ -22,5 +23,14 @@
             <span className="meta">{l.minutes} min</span>
-            <span className={l.done ? 'tag done' : 'tag'}>
-              {l.done ? 'Done' : 'To do'}
-            </span>
+            {l.done ? (
+              <span className="tag done">Done</span>
+            ) : (
+              <button
+                disabled={complete.isPending}
+                onClick={() => complete.mutate(l.id)}
+              >
+                {complete.variables === l.id && complete.isPending
+                  ? 'Saving...'
+                  : 'Mark complete'}
+              </button>
+            )}
           </li>
```

Guess: Lukas clicks `Mark complete` on Props. When Props says `Done`, he goes back to the dashboard. What does the React for Beginners card say at once? The click shows `Saving...` for 1.2 seconds. In the server log you see the POST and then a GET for the course. Only then does Props say `Done`, with 75%. And back on the dashboard the card is already right, because the same success invalidated `my-courses` too. This is the safe way: the server decides and the page follows. But look at the price: more than two seconds of waiting. A typo in the key makes it worse; `steps/s4a-wrong-key` invalidates `['my-course']` (missing the `s`) instead of `['my-courses']`:

`queries.ts` (changes marked with + and -):
```diff
@@ -27,3 +27,3 @@
       queryClient.invalidateQueries({ queryKey: ['course', slug] })
-      queryClient.invalidateQueries({ queryKey: ['my-courses'] })
+      queryClient.invalidateQueries({ queryKey: ['my-course'] })
     },
```

No error, no warning. The dashboard keeps showing the old count until the 30 second stale time ends and something asks again. Check the key you invalidate is the key you use.

```bash
npx tsc -b
```
```bash
npx tsc -b
```

### Step 5: optimistic, in both boxes

The idea from lesson 3: the waiter writes the order down and says "coming right up". We show the result at once, keep a copy, and put it back if the kitchen says no. A new file, `progress.ts`, with two small functions that make new objects (never change the old one): `markDone` for a course and a lesson id, and `addOne` for the list and a slug.

`steps/s5-optimistic-both-boxes/progress.ts`:
```ts
import type { CourseDetail, MyCourse } from './schema.ts'

export const markDone = (course: CourseDetail, id: number): CourseDetail => ({
  ...course,
  lessons: course.lessons.map((l) => (l.id === id ? { ...l, done: true } : l)),
})

export const addOne = (courses: MyCourse[], slug: string): MyCourse[] =>
  courses.map((c) =>
    c.slug === slug ? { ...c, completedCount: c.completedCount + 1 } : c,
  )
```

Now the hook grows (`qc` is short for query client). First the version that updates only the course box:

```bash
sh ../use-step.sh s5a-optimistic-one-box
```
`steps/s5a-optimistic-one-box/queries.ts`:
```ts
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { completeLesson, getCourse, getMyCourses } from './api.ts'
import { markDone } from './progress.ts'
import type { CourseDetail } from './schema.ts'

export function useMyCourses() {
  return useQuery({
    queryKey: ['my-courses'],
    queryFn: getMyCourses,
  })
}

export function useCourse(slug: string) {
  return useQuery({
    queryKey: ['course', slug],
    queryFn: () => getCourse(slug),
  })
}

export function useCompleteLesson(slug: string) {
  const qc = useQueryClient()
  const courseKey = ['course', slug]
  return useMutation({
    mutationFn: (id: number) => completeLesson(slug, id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: courseKey })
      const course = qc.getQueryData<CourseDetail>(courseKey)
      if (course) qc.setQueryData(courseKey, markDone(course, id))
      return { course }
    },
    onError: (_error, _id, saved) => {
      qc.setQueryData(courseKey, saved?.course)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: courseKey })
      qc.invalidateQueries({ queryKey: ['my-courses'] })
    },
  })
}
```

`onMutate` cancels the queries of this course (so an old answer cannot arrive late and wipe our change), reads the course, writes the changed copy with `setQueryData`, and returns the saved object. `onError` puts the old course back. `onSettled` runs either way and invalidates both keys, so the cache always ends with the truth.

Guess: click `Mark complete` on Props and at once go back to the dashboard, while the save is still running. The course page already changed. What does the dashboard say? On the course page it is perfect: Props says `Done`, 75%, no waiting. But the dashboard says 2 of 4, 50%, and after a moment it jumps to 3 of 4. It is the catch from the plan: we changed one box and forgot the other. The fix is the same moves for the second box: cancel its queries, read the list, write the changed copy (`addOne`), save both copies, and restore both on error.

```bash
sh ../use-step.sh s5-optimistic-both-boxes
```
`queries.ts` (changes marked with + and -):
```diff
@@ -6,4 +6,4 @@
 import { completeLesson, getCourse, getMyCourses } from './api.ts'
-import { markDone } from './progress.ts'
-import type { CourseDetail } from './schema.ts'
+import { addOne, markDone } from './progress.ts'
+import type { CourseDetail, MyCourse } from './schema.ts'
 
@@ -30,5 +30,8 @@
       await qc.cancelQueries({ queryKey: courseKey })
+      await qc.cancelQueries({ queryKey: ['my-courses'] })
       const course = qc.getQueryData<CourseDetail>(courseKey)
+      const courses = qc.getQueryData<MyCourse[]>(['my-courses'])
       if (course) qc.setQueryData(courseKey, markDone(course, id))
-      return { course }
+      if (courses) qc.setQueryData(['my-courses'], addOne(courses, slug))
+      return { course, courses }
     },
@@ -36,2 +39,3 @@
       qc.setQueryData(courseKey, saved?.course)
+      qc.setQueryData(['my-courses'], saved?.courses)
     },
```

A normal day: click and `Done`, 75% at once. Back to the dashboard: 3 of 4 at once, no flash. In the log: one POST, and the GETs that bring back the server's version. A bad day: set the API to `fail`; click: `Done`, 75%. About 1.2 seconds later the server says 500: the lesson goes back to not done, the bar returns to 50%, the message `Could not save: Server answered 500` appears, and the dashboard is rolled back too.

```bash
npx tsc -b
```
```bash
npx tsc -b
```

### Test it like a user

A Playwright script drives the page the way Lukas does and prints one line per check, with the measured value. It lives in `e2e/` and needs the dev server and the practice API running. Install once, and point `CHROME` at a Chrome or Chromium (or run `npx playwright-core install chromium` and leave `CHROME` unset):

```bash
cd ../e2e
npm install
CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' node e2e.mjs
```
```bash
node e2e.mjs
PASS  dashboard lists 4 courses  (React for Beginners 2 of 4)
PASS  opening a course sends 1 request  (courses/react-for-beginners)
PASS  back to the dashboard sends 0 requests  (fresh for 30 s)
PASS  lesson turns Done before the server answers  (52 ms)
PASS  course page shows 3 of 4 lessons, 75%
PASS  dashboard shows 3 of 4 at once, no flash of the old number
PASS  exactly 1 save request  (POST then GET)
PASS  after the click: 3 of 4 at once (the guess)
PASS  server said 500: back to 2 of 4, message shown
PASS  dashboard rolled back too: 2 of 4
PASS  server down: error message and a Try again button
11 passed, 0 failed
```

(The millisecond value will differ on your machine.) It checks: four cards; opening a course sends one request; going back sends none; the lesson turns `Done` before the server answers; the dashboard shows 3 of 4 at once; exactly one save request; on the bad day, back to 2 of 4 with the message, and the dashboard rolled back too; and with the server down an error and a `Try again` button. It switches the practice API with `api/mode.txt` and resets it itself.

Then the production build, which runs the type checker first:

```bash
cd ../dashboard-web
npm run build
```
```bash
npm run build
> dashboard-web@0.0.0 build
> tsc -b && vite build

vite v8.3.5 building client environment for production...
transforming...
✓ 241 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.46 kB │ gzip:   0.29 kB
dist/assets/index-CS7S7Y1c.css    1.75 kB │ gzip:   0.69 kB
dist/assets/index-CB9wj5SN.js   437.11 kB │ gzip: 133.71 kB

✓ built in 384ms
```

(The file hashes can differ on your machine.)

## What is still not production

A dashboard that works on your laptop is not finished. Three things to know:

1. **Two quick clicks.** Remove the `disabled` attribute for a minute, switch the server to `fail`, and click two lessons quickly. Each click kept its own saved copy, and the rollbacks can restore each other's state in the wrong order. That is why this build saves one lesson at a time (the buttons are disabled while saving), unless you are ready for the overlap problem.
2. **An optimistic page is a promise, not a proof.** The server must check every POST: is this student enrolled in this course, and does this lesson belong to it? Never trust the page.
3. **The words.** `Server answered 500` is for us. Lukas needs: "We could not save your progress, please try again." Show friendly text, and keep the technical message for the logs.

## Your turn: two extensions

**Task one: undo.** Lessons that are done get a button, `Mark as not complete`, with its own mutation, an optimistic update and a rollback. The practice API has no undo endpoint yet, so first add one to `api/server.mjs` (a request that sets the lesson back to not done; it should answer 500 when the mode is `fail`). Then write `useUncompleteLesson` like `useCompleteLesson`, with the helpers `markUndone` and `subtractOne`.

**Task two: prefetch.** When the mouse moves over a course card on the dashboard, prefetch that course (lesson 4), so the course page opens without waiting:

```tsx
onMouseEnter={() => queryClient.prefetchQuery({
  queryKey: ['course', c.slug],
  queryFn: () => getCourse(c.slug),
})}
```

Because the query client has a 30 second `staleTime`, the prefetched course counts as fresh, and the page opens with no new request.

## The folder

```text
dashboard-web/src/
  main.tsx  router.tsx  RootLayout.tsx
  api.ts  schema.ts  queries.ts  progress.ts
  Dashboard.tsx  CoursePage.tsx  ProgressBar.tsx
  index.css
```

## Common mistakes

- Forgetting `QueryClientProvider`, or putting the router outside it.
- Leaving the slug out of the key `['course', slug]`.
- Invalidating a key that nobody uses (`['my-course']`): no error, no refresh.
- An optimistic update that changes only one of the boxes a fact lives in.
- Changing the cached object in place instead of making a new one (`markDone`, `addOne`).
- Showing the raw server message (`Server answered 500`) to a student.

## Clean up

Stop the API and the dev server with Ctrl+C. Put `ok` back in `api/mode.txt` and run `curl -X POST http://localhost:8217/api/reset`. Delete `dashboard-web/node_modules`, `dashboard-web/dist` and `e2e/node_modules` if you want. Run `sh ../use-step.sh s5-optimistic-both-boxes` so `src/` holds the finished dashboard, and remove `src/probe.ts` if it is still there.

## Key ideas (recap)

1. Server data goes into the cache. Every box has a key: `['my-courses']` for the list, `['course', slug]` for one course. The query client keeps the boxes, and the hooks in `queries.ts` are the only place that knows the keys.
2. A mutation writes. Invalidating is safe but slow: the page waits for the server. An optimistic update shows the result at once. `onMutate` saves the old data and writes the new, `onError` puts it back, `onSettled` refetches either way.
3. If one fact lives in two boxes, update both, and restore both. Never change data in place. One save at a time, unless you are ready for the overlap problem. And the server must check every write.

## Next

Module 12, Lesson 1: [React Hook Form](../../m12-forms-at-scale/m12-l01-react-hook-form/).
