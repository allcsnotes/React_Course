# M11-L02 · Queries with useQuery

> Video: Module 11, Lesson 2. Watch it first, then follow along here.

## What you'll learn

- Install TanStack Query, create a `QueryClient` and wrap the app in `QueryClientProvider`
- Ask for data with `useQuery`: a query key and a query function, and read `data`, `isPending`, `isError`, `error`
- Why the key must hold everything the query function uses, and how keys are compared
- Share one request between components, and what stale time and `gcTime` do
- Retry, `refetch`, refetch on window focus, the devtools, and why you must never change data from a query

## Before you start

- Node 24. Check with `node --version`.
- No Docker needed. The data comes from `api/server.mjs`, a small local Node stand-in for the allcsvideos API with a request log (port 8112). It is not the production server. `api/mode.txt` switches it between `ok` and `fail` (every answer a 500).
- Best after M11-L01 in `../m11-l01-why-server-state-is-different/` and M09-L04 (Zod, the `api.ts` and `schema.ts` here are from that lesson).
- Work in `web/` (Vite 8.3.5, React 19.3.1, TypeScript 7.0.2, TanStack Query 5.105.0 and its devtools, Zod 4.6.7). Swap versions with `sh ../use-version.sh NAME`.

## Files in this folder

| File | What it is |
|------|------------|
| `web/` | The project; `src/` holds `e2-hook-stale0` (the finished list with the `useCourses` hook) |
| `web/src/queries.ts` | The `useCourses` hook: key and function in one place |
| `web/src/api.ts`, `schema.ts` | `getJson`, `getCourses`, `getCourse` and the Zod schemas |
| `web/demos/keys.mjs` | Shows that keys are compared by value (`hashKey`) |
| `api/server.mjs`, `api/mode.txt` | The practice API: courses, one course with lessons, `/__log`, `/__reset` |
| `probes/p-type.tsx`, `p-type0.tsx` | Two small files that show the type of `data` |
| `versions/` | 15 complete snapshots of `web/src` (see the steps below) |
| `use-version.sh` | Replaces everything in `web/src` with one version |

The versions: `v0-effect` and `v1-query` (the list before and after), `m1-no-provider`, `d1-key-bug` and `d2-key-fixed` (the key bug), `e1-two-components`, `e2-hook-stale0`, `e2-hook-stale60`, `e2-hook-gc1`, `f1-retry-default`, `f2-retry-false`, `g-no-focus-refetch`, `h-devtools`, `i1-sort-bug` and `i2-sort-fixed`. `v0-effect`, `v1-query` and `m1-no-provider` use a one-line `App.tsx` with the heading `All courses` (the page in the video shows that heading above the list).

## Follow along

```bash
cd web
npm install
```

Start the API in its own terminal, from this lesson folder (port 8112), and keep `api/mode.txt` on `ok`:

```bash
node api/server.mjs
```
```bash
API on http://localhost:8112
```

Then the page:

```bash
sh ../use-version.sh v0-effect
npm run dev
```

Open the address Vite prints (this project asks for http://localhost:5112). Reset the server log any time with `curl http://localhost:8112/__reset`; read it with `curl http://localhost:8112/__log`.

### 1. The page written by hand

This is the courses page the way Asha wrote it in module 7, lesson 5:

`CourseList.tsx`:
```tsx
import { useEffect, useState } from 'react'
import { getCourses } from './api'
import CourseCards from './CourseCards'
import type { Course } from './schema'

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    getCourses()
      .then(c => { setCourses(c); setStatus('ready') })
      .catch(e => { setMessage(e.message); setStatus('error') })
  }, [])

  if (status === 'loading') return <p className="note">Loading...</p>
  if (status === 'error') return <p className="bad">{message}</p>
  return <CourseCards courses={courses} />
}
```

It works. But it took three pieces of state, an effect, and a status word we keep in step by hand. And it has the quiet problems of lesson 1. Open the page with the log reset: with strict mode on, the server sees two requests.

```bash
(what the server saw, hand-written effect)
GET /api/courses
GET /api/courses
```

### 2. The same page with useQuery

The library is called TanStack Query. Last lesson's pin board is called the query client here: it holds the cache, one box for every copy, and every box has its name tag, the key.

```bash
npm install @tanstack/react-query
```

(It is already in this project's `package.json`, as `5.105.0`.) Then one change in `main.tsx`: create the query client once, and wrap the app in `QueryClientProvider`.

```bash
sh ../use-version.sh v1-query
```
`main.tsx` (changes marked with + and -):
```diff
@@ -2,2 +2,3 @@
 import { createRoot } from 'react-dom/client'
+import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
 import './index.css'
@@ -5,5 +6,9 @@
 
+const queryClient = new QueryClient()
+
 createRoot(document.getElementById('root')!).render(
   <StrictMode>
-    <App />
+    <QueryClientProvider client={queryClient}>
+      <App />
+    </QueryClientProvider>
   </StrictMode>,
```

Real mistake number one: forget the provider (`versions/m1-no-provider`, which has the page but not the provider). The page is blank, and the console says:

```bash
sh ../use-version.sh m1-no-provider
```
```bash
(browser console; the page is blank)
No QueryClient set, use QueryClientProvider to set one
```

Now the page itself. Delete the three states and the effect, and call `useQuery` with one object: a query key (a list with a name for the data) and a query function (the function that gets it).

```bash
sh ../use-version.sh v1-query
```
`CourseList.tsx`:
```tsx
import { useQuery } from '@tanstack/react-query'
import { getCourses } from './api'
import CourseCards from './CourseCards'

export default function CourseList() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  })

  if (isPending) return <p className="note">Loading...</p>
  if (isError) return <p className="bad">{error.message}</p>
  return <CourseCards courses={data} />
}
```

`useQuery` gives back an object, and we take four things: `data` (the courses, once they are here), `isPending` (true while there is no data yet), `isError`, and `error`. The page is three short lines: if pending, loading; if error, show the message; otherwise draw the cards. And notice what we never wrote: a status word, an effect, or a cleanup.

Guess: the server needs 0.6 seconds to answer. What does the page show while it waits, and how many requests does the server see? Open the page with the log reset. It shows `Loading...`, then the courses, and the server counted one request. The hand-written page made two:

```bash
(what the server saw, useQuery)
GET /api/courses
```

Strict mode still ran everything twice, but the cache knew that a request for this key was already on its way.

The type of `data` is known: after the `isPending` and `isError` checks it is `Course[]`, from the Zod schema. `probes/p-type.tsx` tries to put it in a `number`:

```bash
cp ../probes/p-type.tsx src/Probe.tsx
npx tsc -b
```
```bash
npx tsc -b
src/Probe.tsx(12,9): error TS2322: Type '{ slug: string; title: string; teacher: string; level: "advanced" | "beginner" | "intermediate"; price: number; free: boolean; lessonCount: number; }[]' is not assignable to type 'number'.
```

Before the checks `data` can also be `undefined` (`probes/p-type0.tsx`):

```bash
npx tsc -b
src/Probe.tsx(10,9): error TS2322: Type '{ slug: string; title: string; teacher: string; level: "advanced" | "beginner" | "intermediate"; price: number; free: boolean; lessonCount: number; }[] | undefined' is not assignable to type 'number'.
  Type 'undefined' is not assignable to type 'number'.
```

Remove the probe with `rm src/Probe.tsx`.

### 3. The key is the most important idea

The cache is a set of boxes, and the key is the name on the box. Same key, same box. Different key, different box. Here is a page for one course, with three tabs. The query function uses the slug, but Asha writes the key as only `'course'`:

```bash
sh ../use-version.sh d1-key-bug
```
`CourseDetail.tsx`:
```tsx
import { useQuery } from '@tanstack/react-query'
import { getCourse } from './api'

type Props = { slug: string }

export default function CourseDetail({ slug }: Props) {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['course'],
    queryFn: () => getCourse(slug),
  })

  if (isPending) return <p className="note">Loading...</p>
  if (isError) return <p className="bad">{error.message}</p>
  return (
    <section className="detail">
      <h2>{data.title}</h2>
      <p>by {data.teacher} · {data.lessons.length} lessons</p>
      <ol>
        {data.lessons.map(l => <li key={l.id}>{l.title}</li>)}
      </ol>
    </section>
  )
}
```

Guess: the page shows React for Beginners. Click the Python tab. What does the page show, and how many requests for Python does the server see?

```bash
(read the page and the server log)
React for Beginners   (the page, after clicking the Python tab)
GET /api/courses/react-for-beginners   (the only request the server saw)
```

The Python tab is lit, but the page still says React for Beginners. No loading, and the server never saw a request for Python. The key is the same, so it is the same box. The library cannot read the inside of your function; it only looks at the key. The rule: **everything the query function uses goes into the key.** The fix is one change: `['course', slug]`.

```bash
sh ../use-version.sh d2-key-fixed
```
`CourseDetail.tsx` (changes marked with + and -):
```diff
@@ -7,3 +7,3 @@
   const { data, isPending, isError, error } = useQuery({
-    queryKey: ['course'],
+    queryKey: ['course', slug],
     queryFn: () => getCourse(slug),
```

```bash
(read the page and the server log)
Loading...            (right after clicking Python: a new box)
Python from Zero      (after about 0.6 s)
React for Beginners   (clicking React again: at once, from the cache)
GET /api/courses/react-for-beginners
GET /api/courses/python-from-zero
```

Remember the race condition of module 7, lesson 5? Real test: click React, which takes nearly two seconds, and half a second later click Design, which is quick. With one box per key, each answer goes to its own box:

```bash
(click React, then Design half a second later)
System Design   (the heading at the end; the slow React answer arrived later and did not overwrite it)
```

A key can have more parts, like a name and then an object with a filter. Keys are compared by value, not by order (`web/demos/keys.mjs`):

`web/demos/keys.mjs`:
```js
import { hashKey } from '@tanstack/query-core'

const a = ['courses', { level: 'beginner', free: true }]
const b = ['courses', { free: true, level: 'beginner' }]
const c = ['courses', { level: 'advanced', free: true }]

console.log(hashKey(a))
console.log('a and b, same box?', hashKey(a) === hashKey(b))
console.log('a and c, same box?', hashKey(a) === hashKey(c))
```

```bash
node demos/keys.mjs
```
```bash
node demos/keys.mjs
["courses",{"free":true,"level":"beginner"}]
a and b, same box? true
a and c, same box? false
```

### 4. The cache at work

Two components on one page want the courses: the list, and a badge in the menu that says `8 courses`. Both call `useQuery` with the same key.

```bash
sh ../use-version.sh e1-two-components
```
`CourseCount.tsx`:
```tsx
import { useQuery } from '@tanstack/react-query'
import { getCourses } from './api'

export default function CourseCount() {
  const { data, isFetching } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  })
  return (
    <span className="badge">
      {data ? `${data.length} courses` : '...'}
      {isFetching && <span className="pill">updating</span>}
    </span>
  )
}
```

Both show loading, and both fill at the same moment. The server counted one request: two components, one key, one request.

```bash
(server log with the badge and the list on one page)
GET /api/courses   (one request for two components)
```

Writing the key twice invites a typo. Put the key and the function in one place, in a small custom hook (module 7, lesson 6):

```bash
sh ../use-version.sh e2-hook-stale0
```
`queries.ts`:
```ts
import { useQuery } from '@tanstack/react-query'
import { getCourses } from './api'

export const useCourses = () =>
  useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  })
```

`CourseCount.tsx`:
```tsx
import { useCourses } from './queries'

export default function CourseCount() {
  const { data, isFetching } = useCourses()
  return (
    <span className="badge">
      {data ? `${data.length} courses` : '...'}
      {isFetching && <span className="pill">updating</span>}
    </span>
  )
}
```

Check the types and the build:

```bash
npx tsc -b
```
```bash
npx tsc -b
```

```bash
npm run build
> allcsvideos-web@0.0.0 build
> tsc -b && vite build

vite v8.3.5 building client environment for production...
transforming...
✓ 162 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.46 kB │ gzip:   0.29 kB
dist/assets/index-B-v7fmE6.css    1.19 kB │ gzip:   0.51 kB
dist/assets/index-TTbEsxf4.js   338.80 kB │ gzip: 102.46 kB

✓ built in 406ms
```

(The file hashes can differ on your machine.)

### 5. Fresh and stale

Guess: click About, which removes the list from the screen, and then Courses again. Does the list appear at once, or does the page show loading again? The list is there at once, no loading. And a small word appears in the menu: `updating`. The server did see a second request. The old answer was shown first, and a new one was fetched in the background:

```bash
(Courses, About, Courses again; stale time 0)
8 courses  updating   (the list is on screen at once, a small word shows a check in the background)
GET /api/courses  at about 0.1 s
GET /api/courses  at about 1.9 s (the background refresh)
```

Data in the cache has an age. Fresh means: trusted, nobody asks again. Stale means: old enough to check again, when a reason comes (a component appears, the window gets focus). By default data is stale at once: **stale time** is 0.

Two words that look alike: `isPending` means there is no data at all yet; `isFetching` means a request is in flight, even if we already have data. The badge uses `isFetching` for the word `updating`.

The fresh time of lesson 1 is called `staleTime` here, in milliseconds. Set 60,000 (one minute):

```bash
sh ../use-version.sh e2-hook-stale60
```
`queries.ts`:
```ts
import { useQuery } from '@tanstack/react-query'
import { getCourses } from './api'

export const useCourses = () =>
  useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
    staleTime: 60_000,
  })
```

Same clicks: the list at once, no `updating`, and no second request:

```bash
(the same clicks; stale time 60 seconds)
8 courses   (no "updating")
GET /api/courses  at about 0.1 s   (only one request)
```

A second timer, easy to mix up: when no component uses a box any more, it is called inactive, and the library keeps it for a while, in case someone comes back. That time is `gcTime` (garbage collection time), five minutes by default. With `gcTime: 1000`:

```bash
sh ../use-version.sh e2-hook-gc1
```
`queries.ts`:
```ts
import { useQuery } from '@tanstack/react-query'
import { getCourses } from './api'

export const useCourses = () =>
  useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
    gcTime: 1000,
  })
```

Stay on About for 2.6 seconds and go back: the box was thrown away, so the page shows loading again and the server sees a new request.

```bash
(About for 2.6 seconds, then Courses again; gcTime 1 second)
...updating  Loading...   (the copy was thrown away after 1 second without a user)
GET /api/courses  at about 0.2 s
GET /api/courses  at about 4.0 s
```

So: **stale time** answers "how long do I trust this data?". **gcTime** answers "how long do I keep it after nobody looks at it?". Read the real defaults from the live cache:

```bash
(window.qc.getQueryCache().find({ queryKey: ["courses"] }))
queryClient defaults, read from the live cache:
  gcTime 300000 (5 minutes)
  isStale true
  isStaleByTime(60000) false
  observers 2
  keys in the cache: ["courses"]
```

### 6. When the server breaks

Switch the practice API so that every answer is a 500:

```bash
echo fail > ../api/mode.txt
```

Guess: how long does the page say loading before it shows an error? With the default, the error appears after about ten seconds, and the server sees four requests: the first at 0, then after about 1.5, 4 and 9 seconds. The library tries a failed query three more times, with waits that grow.

```bash
sh ../use-version.sh f1-retry-default
```
`CourseList.tsx`:
```tsx
import { useCourses } from './queries'
import CourseCards from './CourseCards'

export default function CourseList() {
  const { data, isPending, isError, error, refetch } = useCourses()

  if (isPending) return <p className="note">Loading...</p>
  if (isError) return (
    <>
      <p className="bad">{error.message}</p>
      <p><button onClick={() => refetch()}>Try again</button></p>
    </>
  )
  return <CourseCards courses={data} />
}
```

```bash
(server in fail mode, default retry)
Server answered 500   (shown after about 10 seconds)
GET /api/courses -> 500  at 0.1 s
GET /api/courses -> 500  at 1.7 s
GET /api/courses -> 500  at 4.3 s
GET /api/courses -> 500  at 8.9 s
```

(Your times will differ a little.) That is kind to a flaky network, and unkind when the server is clearly down. You choose: `retry: false` means fail at once; a number means that many extra tries.

```bash
sh ../use-version.sh f2-retry-false
```
`queries.ts`:
```ts
import { useQuery } from '@tanstack/react-query'
import { getCourses } from './api'

export const useCourses = () =>
  useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
    retry: false,
  })
```

```bash
(server in fail mode, retry: false)
Server answered 500   (shown after about 1 second)
GET /api/courses -> 500  at 0.1 s   (one request)
```

An error box needs a way out. The result has a function called `refetch`; a button calls it (see `CourseList.tsx` above). Fix the server and click `Try again`: loading, and then the courses.

```bash
echo ok > ../api/mode.txt
```

### 7. Refetch on window focus

Priya leaves the tab to read an email, then comes back. By default the library checks stale data again when the window gets focus. Real test, three times: the page is switched away and back again (the page visibility signal that the library listens to):

```bash
(hide the page for 0.6 s, show it again)
default (stale 0):   2 requests  (the second one when the page comes back)
stale time 60 s:     1 request
refetchOnWindowFocus: false:  1 request
```

```bash
sh ../use-version.sh g-no-focus-refetch
```
`queries.ts`:
```ts
import { useQuery } from '@tanstack/react-query'
import { getCourses } from './api'

export const useCourses = () =>
  useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
    refetchOnWindowFocus: false,
  })
```

You can switch it off per query with `refetchOnWindowFocus: false`, or keep the data fresh with a stale time.

### 8. The devtools

The library has a small panel inside your app, installed as a dev dependency, with one line in `main.tsx`. It lists every key and its state.

```bash
npm install -D @tanstack/react-query-devtools
sh ../use-version.sh h-devtools
```
`main.tsx` (changes marked with + and -):
```diff
@@ -3,2 +3,3 @@
 import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
+import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
 import './index.css'
@@ -12,2 +13,3 @@
       <App />
+      <ReactQueryDevtools initialIsOpen={false} />
     </QueryClientProvider>
```

Open http://localhost:5112, click Python, Design and React, then open the panel (the small flower button). One key is stale, because it is on screen and the stale time is zero. Two are inactive, because no tab shows them. Click a key to see its data:

```bash
(open the devtools panel after clicking Python, Design and back; text read from the panel)
TANSTACK  React Query v5
Queries: Fresh 0, Fetching 0, Paused 0, Stale 1, Inactive 2
  ["course","system-design"]       (stale: on screen, stale time 0)
  ["course","python-from-zero"]    (inactive)
  ["course","react-for-beginners"] (inactive)
```

### 9. Mistake two: sorting the cache

The list gets a checkbox, "cheapest first". Asha writes `data.sort(...)` with a callback that compares prices. It worked in module 5.

```bash
sh ../use-version.sh i1-sort-bug
```
`CourseList.tsx` (changes marked with + and -):
```diff
@@ -11,3 +11,3 @@
 
-  const shown = cheap ? data.sort((a, b) => a.price - b.price) : data
+  const shown = cheap ? data.toSorted((a, b) => a.price - b.price) : data
   return (
```

(The `-` line is the bug, the `+` line the fix.) Real clicks:

```bash
(i1-sort-bug, stale time 0)
Cheapest first ticked:      Python from Zero | DevOps Basics | SQL in Two Weeks | React for Beginners | ...
Unticked (the bug):         still sorted: Python from Zero | DevOps Basics | SQL in Two Weeks | React for Beginners | ...
About, then Courses again:  React for Beginners | Python from Zero | DevOps Basics | SQL in Two Weeks | ... (with stale time 0 the background refresh puts the original order back)
(with a stale time of 60 seconds the list would stay sorted for a minute)
```

Why? `sort` rearranges the array in place, and that array is the one in the cache. The library hands you the very same array it keeps. You changed the cache. The rule from module 4, lesson 4: never change data you did not make. Data from a query is read only, like props and state. Use `toSorted`, which returns a new array:

```bash
sh ../use-version.sh i2-sort-fixed
```
```bash
(i2-sort-fixed)
Unticked (fixed, toSorted): React for Beginners | Python from Zero | DevOps Basics | SQL in Two Weeks | ... (the original order)
```

## Common mistakes

- Forgetting the `QueryClientProvider`: `No QueryClient set, use QueryClientProvider to set one`.
- A key that does not hold what the function uses (`['course']` instead of `['course', slug]`): the wrong data after a change.
- Writing the key and the function in every component. Put them in one hook.
- Mixing up `staleTime` (how long I trust it) and `gcTime` (how long I keep it unused).
- Using the default retry when the server is clearly down: ten seconds before the error.
- Mutating `data` from a query (`data.sort(...)`). Copy it first (`toSorted`, `[...data]`).

## Clean up

Stop the API and the dev server with Ctrl+C. Put `ok` back in `api/mode.txt`. Delete `web/node_modules` and `web/dist` if you want. Run `sh ../use-version.sh e2-hook-stale0` so `src/` holds the finished version, and remove `src/Probe.tsx` if it is still there.

## Key ideas (recap)

1. The query client is the cache, and the provider hands it to the app. `useQuery` takes a key and a function, and gives `data`, `isPending`, `isError`.
2. The same key means one box and one request. Stale time is how long data is trusted (zero by default). `gcTime` is how long unused data is kept (five minutes by default).
3. A failed query is tried three times with growing waits: choose your own `retry`. And never change data from a query: copy it first.

Interview question (Rahul): what is the difference between stale time and gcTime? A good answer: stale time is how long data counts as fresh, so the library does not refetch it; after that it is stale and gets refetched when a component mounts or the window regains focus. `gcTime` is how long inactive data (no component uses it) stays in the cache before it is removed. One is about trusting the data, the other about keeping it.

## Try it yourself

Open the devtools, set the stale time of the courses to ten seconds, and watch the key change from fresh to stale. Then add a level filter to the key and see a new box appear. (Answer below.)

Answer: in `queries.ts` use `staleTime: 10_000`. In the devtools the `["courses"]` key shows as fresh for ten seconds, then turns stale. For the filter, accept a `level` argument: `useCourses = (level?: string) => useQuery({ queryKey: ['courses', { level }], queryFn: () => getCourses() })`. Each different level is its own key and its own box in the panel (the query function here ignores the level; a real API would take it as a parameter, which is exactly why it belongs in the key).

## Next

Module 11, Lesson 3: [Mutations and Optimistic Updates](../m11-l03-mutations-and-optimistic-updates/README.md).
