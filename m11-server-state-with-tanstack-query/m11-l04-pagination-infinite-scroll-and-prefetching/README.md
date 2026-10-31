# M11-L04 · Pagination, Infinite Scroll and Prefetching

> Video: Module 11, Lesson 4. Watch it first, then follow along here.

## What you'll learn

- Why you never send a thousand courses at once, and how the server cooperates (`page` and `pageSize`)
- Page numbers with `useQuery`: put the page in the query key, and use `keepPreviousData` so the list does not jump
- Keep the page in the address (`useSearchParams`), so Back works and a link opens page five
- Prefetch the next page on hover, and why you need a `staleTime` for it to count
- Endless scrolling with `useInfiniteQuery`: a Load more button, then an `IntersectionObserver` sentinel
- Avoid three mistakes: the page missing from the key, no fallback for the page number, and a missing cleanup

## Before you start

- Node 24. Check with `node --version`.
- No Docker needed. The data comes from `api/server.mjs`, a small local Node stand-in for the allcsvideos API with 48 courses (port 8114). It is not the production server. It writes every request to `api/api.log`.
- Best after M11-L03 in `../m11-l03-mutations-and-optimistic-updates/`, M09-L04 (Zod, in `api.ts`) and M08 (`useSearchParams`).
- Work in `web/` (Vite 8.3.5, React 19.3.1, React Router 8.5.1, TypeScript 7.0.2, TanStack Query 5.105.0, Zod 4.6.7). Swap versions with `sh ../use-version.sh NAME`.

## Files in this folder

| File | What it is |
|------|------------|
| `web/` | The project; `src/` holds `v4-prefetch-stale-time` |
| `web/src/api.ts` | `getAllCourses`, `getCoursePage` with Zod schemas |
| `web/src/Pager.tsx`, `CourseList.tsx` | The pager (Previous, label, Next) and the list |
| `web/src/queries.ts` | `coursesQuery(page)`: key, function and `staleTime` (only in the prefetch versions) |
| `web/src/useSentinel.ts` | The `IntersectionObserver` hook (only in the endless-scroll versions) |
| `api/server.mjs` | The practice API: all courses, or one page with `?page=2&pageSize=6` |
| `versions/` | 12 complete snapshots of `web/src` (see the steps below) |
| `use-version.sh` | Replaces everything in `web/src` with one version |

## Follow along

```bash
cd web
npm install
```

Start the practice API in its own terminal, from this lesson folder (port 8114):

```bash
node api/server.mjs
```
```bash
API on http://localhost:8114
```

Then the page:

```bash
sh ../use-version.sh all-courses
npm run dev
```

Open the address Vite prints (this project asks for http://localhost:5214).

### 1. The page that loads everything

This is the courses page with TanStack Query, as in lesson 2, asking for all courses at once.

`Courses.tsx`:
```tsx
import { useQuery } from '@tanstack/react-query'
import { getAllCourses } from './api'
import CourseList from './CourseList'

export default function Courses() {
  const { data, isPending, isError } = useQuery({
    queryKey: ['courses'],
    queryFn: getAllCourses,
  })

  if (isPending) return <p className="note">Loading...</p>
  if (isError) return <p className="bad">Could not load the courses.</p>
  return (
    <main>
      <h1>All courses ({data.length})</h1>
      <CourseList items={data} />
    </main>
  )
}
```

Real numbers from the practice API:

```bash
(bytes of the answers, and the height of the page; yours may differ a little)
all courses: 6391 bytes (one request); the page is 2139 pixels tall
one page of six: 841 bytes
```

One request, 6,391 bytes, and a page that scrolls for more than two thousand pixels. Fine for 48 courses. Lesson 3 ended with a question: what to do when the list has a thousand courses. The answer: never send them all. Send one slice, called a page, and ask for the next one when it is needed. Think of a big library: nobody carries all the shelves home; you take one shelf, and when you finish it, you ask for the next.

### 2. The server cooperates: page and pageSize

The practice API understands two notes in the address, `page` and `pageSize`. Here is the real answer for page 2:

```bash
curl "http://localhost:8114/api/courses?page=2&pageSize=6"
```
```json
{"items":[ ...six courses: System Design, Async Python, Git and GitHub, Linux Basics, HTML and CSS, JavaScript Essentials ],"page":2,"pageSize":6,"total":48,"totalPages":8,"nextPage":3}
```

(Shortened here; the real answer lists the courses as objects.) The answer says how many pages there are and which one comes next (`nextPage` is `null` on the last page). In the app, `api.ts` gets one new function, `getCoursePage`, with a Zod schema for this shape (lesson M09-L04):

`api.ts`:
```ts
import { z } from 'zod'

const CourseSchema = z.object({
  slug: z.string(),
  title: z.string(),
  teacher: z.string(),
  level: z.string(),
  price: z.number(),
  free: z.boolean(),
  lessonCount: z.number(),
})

const PageSchema = z.object({
  items: z.array(CourseSchema),
  page: z.number(),
  pageSize: z.number(),
  total: z.number(),
  totalPages: z.number(),
  nextPage: z.number().nullable(),
})

export type Course = z.infer<typeof CourseSchema>
export type CoursePage = z.infer<typeof PageSchema>

async function getJson<T>(url: string, schema: z.ZodType<T>) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Server answered ${res.status}`)
  return schema.parse(await res.json())
}

export const getAllCourses = () =>
  getJson('/api/courses', z.array(CourseSchema))
export const getCoursePage = (page: number) =>
  getJson(`/api/courses?page=${page}&pageSize=6`, PageSchema)
```

### 3. Page numbers with useQuery

The simplest version first: a piece of state called `page`, and a query whose key is a list, `['courses', page]`. That is the rule from lesson 2: everything the function uses goes into the key, so every page gets its own box.

```bash
sh ../use-version.sh v1-page-state
```
`Courses.tsx`:
```tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCoursePage } from './api'
import CourseList from './CourseList'
import Pager from './Pager'

export default function Courses() {
  const [page, setPage] = useState(1)
  const { data, isPending, isError } = useQuery({
    queryKey: ['courses', page],
    queryFn: () => getCoursePage(page),
  })

  if (isPending) return <p className="note">Loading...</p>
  if (isError) return <p className="bad">Something failed</p>
  return (
    <main>
      <h1>All courses</h1>
      <CourseList items={data.items} />
      <Pager page={page} total={data.totalPages} onGo={setPage} />
    </main>
  )
}
```

`Pager.tsx`:
```tsx
type Props = {
  page: number
  total: number
  onGo: (page: number) => void
  busy?: boolean
  onPeek?: () => void
}

export default function Pager({
  page, total, onGo, busy, onPeek,
}: Props) {
  return (
    <div className="pager">
      <button
        onClick={() => onGo(page - 1)}
        disabled={page === 1}
      >Previous</button>
      <span>Page {page} of {total}</span>
      <button
        onClick={() => onGo(page + 1)}
        onMouseEnter={onPeek}
        disabled={busy || page === total}
      >Next</button>
    </div>
  )
}
```

Guess: Lukas is on page 1 and clicks Next. While page 2 travels from the server, what does the screen show? Then he clicks Previous. Does page 1 wait too?

```bash
(v1-page-state)
start:                 page 1 (React for Beginners, Python from Zero, ...)
150 ms after Next:    Loading...        (the list is gone)
later:                 page 2 (System Design, Async Python, Git and GitHub, ...)
Previous (120 ms):     page 1 again, at once, from the cache
server saw: page=1, page=2, page=1   (the last one is the quiet refresh, stale time 0)
```

Click Next: the list is gone and the page says `Loading...`. Half a second later, page 2. Then Previous: page 1 is back at once, from the cache. It works, but it feels bad: at every click the list disappears and the whole page jumps.

### 4. Placeholder data: keep the old page while the new one loads

Turning a page should feel like turning a page. The fix is one option: `placeholderData`. A placeholder is a stand-in, shown while the real thing is on its way. The library has a ready-made helper, `keepPreviousData`, which uses the previous result as the stand-in.

```bash
sh ../use-version.sh v2-keep-previous
```
`Courses.tsx` (changes marked with + and -):
```diff
@@ -1,3 +1,3 @@
 import { useState } from 'react'
-import { useQuery } from '@tanstack/react-query'
+import { keepPreviousData, useQuery } from '@tanstack/react-query'
 import { getCoursePage } from './api'
@@ -8,5 +8,8 @@
   const [page, setPage] = useState(1)
-  const { data, isPending, isError } = useQuery({
+  const {
+    data, isPending, isError, isPlaceholderData,
+  } = useQuery({
     queryKey: ['courses', page],
     queryFn: () => getCoursePage(page),
+    placeholderData: keepPreviousData,
   })
@@ -18,4 +21,11 @@
       <h1>All courses</h1>
-      <CourseList items={data.items} />
-      <Pager page={page} total={data.totalPages} onGo={setPage} />
+      <div className={isPlaceholderData ? 'dim' : ''}>
+        <CourseList items={data.items} />
+      </div>
+      <Pager
+        page={page}
+        total={data.totalPages}
+        onGo={setPage}
+        busy={isPlaceholderData}
+      />
     </main>
```

The result also gets a new flag, `isPlaceholderData`: true while the screen shows the old page. We use it twice: we dim the list with a class, and we disable the Next button (`busy`) so nobody clicks past the end while the real answer is unknown.

```bash
(v2-keep-previous)
150 ms after Next:  the rows of page 1 are still there, dimmed (class "dim"); the label already says page 2
later:              page 2 (System Design, Async Python, ...), no longer dimmed
server saw: page=1, page=2
```

Click Next: the rows stay, dimmed, and the label already says page 2. Half a second later the new rows appear. No `Loading...`, no jump. One honest detail: the placeholder is not in the cache. It is only a stand-in on the screen. The cache gets a box for page 2 when the real answer arrives.

### 5. The page belongs in the address

A problem you will meet within a minute: Lukas reaches page 5 and sends the link to Priya. Priya opens it and sees page 1. Module 8 gave us the rule: state that a link should recreate belongs in the address. So the page moves into the search parameters with `useSearchParams`.

```bash
sh ../use-version.sh v3-page-in-address
```
`Courses.tsx` (changes marked with + and -):
```diff
@@ -1,2 +1,2 @@
-import { useState } from 'react'
+import { useSearchParams } from 'react-router'
 import { keepPreviousData, useQuery } from '@tanstack/react-query'
@@ -7,3 +7,5 @@
 export default function Courses() {
-  const [page, setPage] = useState(1)
+  const [params, setParams] = useSearchParams()
+  const page = Math.max(1, Number(params.get('page')) || 1)
+  const goTo = (p: number) => setParams({ page: String(p) })
   const {
@@ -27,3 +29,3 @@
         total={data.totalPages}
-        onGo={setPage}
+        onGo={goTo}
         busy={isPlaceholderData}
```

`goTo` writes the search parameter `page`, as text, and the buttons call `goTo`. The query and its key are the same as before; only the source of `page` changed. Guess: Lukas clicks Next twice, and then the Back button of the browser. What does the page show, and what does the address say?

```bash
(v3-page-in-address)
after Next, Next:  address /?page=3, rows of page 3 (TypeScript in Practice, Node.js APIs, ...)
after Back:        address /?page=2, rows of page 2 (System Design, Async Python, ...)
opening /?page=5:  rows of page 5 (Machine Learning 101, Pandas and NumPy, ...)
server saw: page=1, page=2, page=3, page=2, page=5
```

Next, next: the address says `page=3`. Back: page 2, and the address says `page=2`. Back works, because every page is an entry in the browser history. A link works too: opening `/?page=5` goes straight to page 5. The server log shows one request, for page 5, and nothing for pages 1 to 4.

### 6. Prefetching: ask before the click

The click still waits half a second. Can we make it instant? We know what Lukas will probably do next, so ask for page 3 before he clicks. When do we ask? When the mouse moves onto the Next button: a hint that a click is coming in a moment. The `Pager` takes a function `onPeek` (called on mouse enter), and the page gives it `prefetchQuery`.

First version: the courses query with only the key and the function (`queries.ts` without a stale time).

```bash
sh ../use-version.sh v4a-prefetch-no-stale-time
```
`queries.ts`:
```ts
import { getCoursePage } from './api'

export const coursesQuery = (page: number) => ({
  queryKey: ['courses', page],
  queryFn: () => getCoursePage(page),
})
```

Guess: Lukas puts the mouse on Next, waits one second, and clicks. Does the page need another request?

```bash
(hover Next, wait 0.9 s, click; no stale time)
page 2 appears at once, 100 ms after the click
server saw: page=2, page=2   (two requests: the hover and the click)
```

Page 2 appears at once: no `Loading`, no dim. But the log has two requests for page 2: one when the mouse arrived, and one when he clicked. Why? Stale time is zero. The prefetched answer is already stale when the page asks for it, so the library shows it, and checks again. The fix is a stale time on the query:

```bash
sh ../use-version.sh v4-prefetch-stale-time
```
`queries.ts` (changes marked with + and -):
```diff
@@ -5,2 +5,3 @@
   queryFn: () => getCoursePage(page),
+  staleTime: 30_000,
 })
```

`Courses.tsx`:
```tsx
import { useSearchParams } from 'react-router'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { coursesQuery } from './queries'
import CourseList from './CourseList'
import Pager from './Pager'

export default function Courses() {
  const [params, setParams] = useSearchParams()
  const queryClient = useQueryClient()
  const page = Math.max(1, Number(params.get('page')) || 1)
  const goTo = (p: number) => setParams({ page: String(p) })
  const prefetchNext = () =>
    queryClient.prefetchQuery(coursesQuery(page + 1))
  const {
    data, isPending, isError, isPlaceholderData,
  } = useQuery({
    ...coursesQuery(page),
    placeholderData: keepPreviousData,
  })

  if (isPending) return <p className="note">Loading...</p>
  if (isError) return <p className="bad">Something failed</p>
  return (
    <main>
      <h1>All courses</h1>
      <div className={isPlaceholderData ? 'dim' : ''}>
        <CourseList items={data.items} />
      </div>
      <Pager
        page={page}
        total={data.totalPages}
        onGo={goTo}
        busy={isPlaceholderData}
        onPeek={prefetchNext}
      />
    </main>
  )
}
```

Now the same hover-and-click gives one request:

```bash
(hover Next, wait 0.9 s, click; stale time 30 s)
page 2 appears at once, 100 ms after the click
server saw: page=2   (one request: the hover)
```

Prefetching spends a request that may never be used. So use it where the guess is good: the next page, or a link under the mouse. Not for everything.

### 7. Endless scrolling with useInfiniteQuery

Now the other style: a feed. No page numbers. You read, you reach the end, and more arrives. The library has a second hook for it: `useInfiniteQuery`.

```bash
sh ../use-version.sh i1-load-more
```
`Courses.tsx`:
```tsx
import { useInfiniteQuery } from '@tanstack/react-query'
import { getCoursePage } from './api'
import CourseList from './CourseList'

export default function Courses() {
  const {
    data, isPending, isError,
    fetchNextPage, hasNextPage, isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['courses', 'infinite'],
    queryFn: ({ pageParam }) => getCoursePage(pageParam),
    initialPageParam: 1,
    getNextPageParam: last => last.nextPage,
  })

  if (isPending) return <p className="note">Loading...</p>
  if (isError) return <p className="bad">Something failed</p>
  const items = data.pages.flatMap(p => p.items)
  return (
    <main>
      <h1>All courses ({items.length} of {data.pages[0].total})</h1>
      <CourseList items={items} />
      <div className="more">
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...'
            : hasNextPage ? 'Load more' : 'That is all'}
        </button>
      </div>
    </main>
  )
}
```

It looks like `useQuery`, with three new things. `initialPageParam`: where to start, page 1. The query function receives the `pageParam` and asks for that page. `getNextPageParam` looks at the last page and says what comes next; `null` means the end. The result has a list called `pages`, one entry for each page; `flatMap` (module 2, lesson 3) joins their items into one list. `fetchNextPage`, `hasNextPage` and `isFetchingNextPage` drive a Load more button.

Real output from a console log added in `versions/i1d-debug-log` (the line `console.log('pageParams', ...)`):

```bash
sh ../use-version.sh i1d-debug-log
```
```bash
(browser console, after the first page and two clicks; React draws a few times between, so each line repeats)
pageParams 1 | items per page 6
pageParams 1,2 | items per page 6,6
pageParams 1,2,3 | items per page 6,6,6
```

After the first page, `pageParams` is 1 and one page with six courses. After the second: 1,2 and two pages of six. Then three. The same box holds every page, in order.

```bash
sh ../use-version.sh i1-load-more
```
```bash
(i1-load-more, in the browser)
start:           All courses (6 of 48), button "Load more"
after 1 click:   All courses (12 of 48)
after 7 clicks:  All courses (48 of 48), button "That is all"
server saw: page=1 ... page=8   (eight requests, one per page)
```

Six rows and a button. Click: the button says `Loading...` and the rows stay. Then twelve rows. After seven clicks: forty-eight of forty-eight, and the button says `That is all`.

### 8. Load by itself: a sentinel

Clicking is fine, but a feed should load by itself when the reader reaches the bottom. The browser can tell us when an element comes into view: `IntersectionObserver`. We wrap it in a custom hook (module 7, lesson 6).

```bash
sh ../use-version.sh i2-sentinel
```
`useSentinel.ts`:
```ts
import { useEffect, useRef } from 'react'

export function useSentinel(
  onVisible: () => void,
  enabled: boolean,
) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onVisible()
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [enabled, onVisible])

  return ref
}
```

A ref (module 7, lesson 4) points at the strip at the bottom; an effect creates the observer, which calls `onVisible` whenever the strip is in view; and the effect returns a cleanup that disconnects it. The page has a `div` with the ref (outlined in blue in the video):

`Courses.tsx` (changes marked with + and -):
```diff
@@ -3,2 +3,3 @@
 import CourseList from './CourseList'
+import { useSentinel } from './useSentinel'
 
@@ -14,2 +15,6 @@
   })
+  const sentinel = useSentinel(
+    fetchNextPage,
+    hasNextPage && !isFetchingNextPage,
+  )
 
@@ -22,10 +27,5 @@
       <CourseList items={items} />
-      <div className="more">
-        <button
-          onClick={() => fetchNextPage()}
-          disabled={!hasNextPage || isFetchingNextPage}
-        >
-          {isFetchingNextPage ? 'Loading...'
-            : hasNextPage ? 'Load more' : 'That is all'}
-        </button>
+      <div ref={sentinel} className="sentinel">
+        {isFetchingNextPage ? 'Loading more...'
+          : hasNextPage ? 'scroll for more' : 'That is all'}
       </div>
```

Guess: the page opens with six courses. Six rows are shorter than a tall window, so the strip is in view at once, and the library loads page 2 by itself. Twelve rows push the strip below the window, and it waits until you scroll. In a window 500 pixels tall:

```bash
(i2-sentinel)
after waiting 4.5 s in a window 500 pixels tall:  All courses (12 of 48)
server saw: page=1, page=2   (page 3 waits until you scroll the strip into view)
```

(In a very short window the strip stays in view after every page, so it keeps loading until all pages are in.) Honest limits of endless scrolling: the footer of the page can never be reached, and the Back button cannot remember how far you scrolled. Keep page numbers where people need to return to a place or share a link.

### 9. Three mistakes

**One: the page is missing from the key.** The key is only `['courses']`.

```bash
sh ../use-version.sh m1-page-not-in-key
```
`Courses.tsx` (changes marked with + and -):
```diff
@@ -11,3 +11,3 @@
   } = useQuery({
-    queryKey: ['courses', page],
+    queryKey: ['courses'],
     queryFn: () => getCoursePage(page),
```

Click Next: the label says page 2, but the rows are still the rows of page 1, because the key (the name of the box) never changed:

```bash
(m1-page-not-in-key)
after Next: the rows are still the rows of page 1 (React for Beginners, Python from Zero, ...)
server saw: page=1   (the second page was never asked for, the key never changed)
```

**Two: reading the page without a fallback.** The code is only `Number(params.get('page'))`. On the plain address `get` gives `null`, and `Number(null)` is 0:

```bash
sh ../use-version.sh m2-no-fallback
```
`Courses.tsx` (changes marked with + and -):
```diff
@@ -8,3 +8,3 @@
   const [params, setParams] = useSearchParams()
-  const page = Math.max(1, Number(params.get('page')) || 1)
+  const page = Number(params.get('page'))
   const goTo = (p: number) => setParams({ page: String(p) })
```

```bash
(m2-no-fallback; the practice server turns page 0 into page 1, a real one might answer with an error)
plain address / :  the request is page=0   (Number(null) is 0)
server saw: ?page=0&pageSize=6
```

Use `Math.max(1, Number(params.get('page')) || 1)` as the lesson does: a number below 1, or text, becomes page 1.

**Three: forgetting the cleanup.** The hook has no `return () => observer.disconnect()` at the end of the effect. Every time the effect runs again, an old observer is left behind, and a page can be requested twice:

```bash
sh ../use-version.sh m3-no-cleanup
```
`useSentinel.ts` (changes marked with + and -):
```diff
@@ -15,3 +15,2 @@
     observer.observe(el)
-    return () => observer.disconnect()
   }, [enabled, onVisible])
```

In the video the log showed page 3 asked for twice (two requests at about half a second apart). Always return the cleanup from an effect that subscribes to something.

Check the types and the build of the finished version:

```bash
sh ../use-version.sh v4-prefetch-stale-time
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
✓ 238 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.43 kB │ gzip:   0.28 kB
dist/assets/index-SUbLQ5Pn.css    1.17 kB │ gzip:   0.51 kB
dist/assets/index-DdTM9hhB.js   374.55 kB │ gzip: 114.85 kB

✓ built in 398ms
```

(The file hashes can differ on your machine.)

## Common mistakes

- Sending every row to the browser. Use `page` and `pageSize`.
- Leaving the page out of the query key, so every page shares one box.
- Keeping the page in `useState` when a link should recreate it. Put it in the address.
- `Number(params.get('page'))` with no fallback: page 0 or `NaN` goes to the server.
- Prefetching with a stale time of 0: the prefetched data is stale at once and is fetched twice.
- A subscribing effect (`IntersectionObserver`, event listener) with no cleanup.
- Using endless scroll where people need the footer, a link or the Back button.

## Clean up

Stop the API and the dev server with Ctrl+C. The API writes `api/api.log`; delete it if you want. Delete `web/node_modules` and `web/dist` if you want. Run `sh ../use-version.sh v4-prefetch-stale-time` so `src/` holds the finished version.

## Key ideas (recap)

1. A page is a slice, and the page goes into the key, so each page has its own box. `keepPreviousData` keeps the old page on the screen while the next one loads. Keep the page in the address, with a fallback.
2. `prefetchQuery` asks before the click, for example on hover. Give the data a stale time, or it is fetched twice.
3. `useInfiniteQuery` keeps one box with many pages. `getNextPageParam` says what comes next, and `null` means the end. A Load more button or an `IntersectionObserver` calls `fetchNextPage`.

Interview question (Rahul): what is the problem with page numbers, and what is the alternative? A good answer: when items are added or removed while you page (offset pagination), rows can be skipped or repeated, and large offsets get slow on the server. The alternative is cursor-based pagination, where the server returns a cursor for the next slice; in TanStack Query that is the `pageParam` of `useInfiniteQuery`.

## Try it yourself

Make the page size a search parameter too, with a small select box, and put it in the key. Then prefetch the previous page as well. (Answer below.)

Answer: read `const size = Number(params.get('size')) || 6`, change `getCoursePage` to take `(page, size)` and use `pageSize=${size}`, and use the key `['courses', page, size]` (the size must be in the key, because the function uses it). The select calls `setParams({ page: '1', size: e.target.value })` (go back to page 1 when the size changes). For the previous page, add a second `onPeek` on the Previous button that calls `queryClient.prefetchQuery(coursesQuery(page - 1, size))`, only when `page > 1`.

## Next

Module 11, Build 7: [Build a Student Dashboard](../m11-b07-build-a-student-dashboard/README.md).
