# M11-L01 · Why Server State Is Different

> Video: Module 11, Lesson 1. Watch it first, then follow along here.

## What you'll learn

- What server state is, and how it differs from client state
- Three quiet bugs of fetching in every component: the same request twice, a loading flash when you come back, and stale copies (even two prices on one page)
- The idea that fixes all three: a cache of copies, each with a key and an age, and a fresh time
- A 20-line cache you can run with Node, to see that it is not magic
- What TanStack Query adds, and three mistakes beginners make (polling, copying into your own store, trusting a stale copy)

## Before you start

- Node 24. Check with `node --version`.
- No Docker needed. The data comes from `api/server.mjs`, a small local Node stand-in for the allcsvideos API with a request log (port 8111). It is not the production server.
- Best after M10-B06 in `../../m10-state-management/m10-b06-build-an-enrollment-cart/` and the `useFetch` lesson of module 7.
- Work in `web/` (Vite 8.3.5, React 19.3.1, TypeScript 7.0.2, TanStack Query 5.105.0). Swap versions with `sh ../use-version.sh NAME`.

## Files in this folder

| File | What it is |
|------|------------|
| `web/` | The project; `src/` holds `v3-tanstack-query` |
| `api/server.mjs` | The practice API: `/api/courses`, `/api/teachers/:name`, `/api/checkout`, plus `/sale`, `/reset` and `/log` |
| `board/cache.ts`, `board/run.ts` | The 20-line "pin board" cache and a script that uses it |
| `versions/v1-fetch-everywhere/` | The catalog from module 7: `useFetch` in the banner and the list |
| `versions/v2-teacher-lines/` | Every card also fetches its teacher |
| `versions/v3-tanstack-query/` | The same page with `useQuery` (a preview; lesson 2 teaches it) |
| `versions/m1-polling/` | Mistake one: fetch again every second |
| `versions/m3-context-copy/` | Mistake two: copy the courses into a context |
| `use-version.sh` | Replaces everything in `web/src` with one version |

## Follow along

```bash
cd web
npm install
```

Start the practice API in its own terminal, from this lesson folder (port 8111):

```bash
node api/server.mjs
```
```bash
API on http://localhost:8111
```

Reset its log and prices at any time with `curl -X POST http://localhost:8111/reset`. Then start the page:

```bash
sh ../use-version.sh v1-fetch-everywhere
npm run dev
```

Open the address Vite prints (this project asks for http://localhost:5211). A tip: Vite's first load after an install may reload the page once while it prepares the packages, which adds one extra request to the log. Reload and run `curl -X POST http://localhost:8111/reset` before you count requests. (The video counts on a production build; the numbers below match it.)

### 1. Asha's catalog and its three quiet problems

The banner loads, the list loads, eight courses. No error message anywhere. The page works. And yet it has three quiet problems: it asks the server for the same list more than once; it forgets the list the moment you leave; and it can show a price that is no longer true. All three come from one habit: every component fetches for itself.

### 2. Server state

Think of a notice board in a school corridor. The office owns it, and they can change it at any moment. When you need the timetable you take a photo with your phone. The photo is useful, because you can look at it again without walking back. But the office can change the board while your photo stays the same; and if ten people photograph the board, that is ten trips.

That is server state: data that lives on a server, that someone else owns, and that your page holds only a copy of. Compare it with client state (module 4): a counter, a text box, an open menu. It lives inside your page, only your code changes it, so it can never be out of date. Server state is the opposite, in five ways: it lives far away, so it takes time to arrive; it is shared, so other people can change it; your copy can go stale; many parts of your page may want the same copy; and a request can fail.

### 3. Problem one: the same request twice

The banner calls `useFetch('/api/courses')`, and the list calls `useFetch('/api/courses')`: the very same address.

`useFetch.ts`:
```ts
import { useEffect, useState } from 'react'

type Status = 'loading' | 'success' | 'error'

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')
    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error('Server answered ' + res.status)
        return res.json()
      })
      .then(json => { setData(json); setStatus('success') })
      .catch(err => {
        if (err.name === 'AbortError') return
        setError(err.message)
        setStatus('error')
      })
    return () => controller.abort()
  }, [url])

  return { data, status, error }
}
```

`DealBanner.tsx`:
```tsx
import { useFetch } from './useFetch'
import type { Course } from './types'

export function DealBanner() {
  const { data } = useFetch<Course[]>('/api/courses')
  if (!data) return <p className="deal">Loading the deal...</p>
  const first = data[0]
  return (
    <p className="deal">
      Deal of the day: {first.title}, Rs {first.price}
    </p>
  )
}
```

(In development, strict mode runs every effect twice, from module 7. It is off in `main.tsx` here so that every request is counted once.) Guess: when the page opens, how many requests reach the server? Reset the log, reload the page, then read it:

```bash
curl -X POST http://localhost:8111/reset
```
Reload the page in the browser, then:
```bash
curl -s http://localhost:8111/log
```
```bash
curl http://localhost:8111/log
GET /api/courses
GET /api/courses
```

Two requests, the same address, a moment apart. The server sent the same eight courses twice. Nothing is wrong with the code; it is the habit.

Two is a small number. Now picture each card also showing how many courses its teacher has.

```bash
sh ../use-version.sh v2-teacher-lines
```
`TeacherLine.tsx`:
```tsx
import { useFetch } from './useFetch'
import type { Teacher } from './types'

export function TeacherLine({ name }: { name: string }) {
  const url = '/api/teachers/' + name
  const { data } = useFetch<Teacher>(url)
  const text = data ? data.courses + ' courses' : '...'
  return <span>{name} · {text}</span>
}
```

Eight cards, eight fetches. Reset, reload, and count the log by address:

```bash
curl -s http://localhost:8111/log | sort | uniq -c
```
```bash
curl -s http://localhost:8111/log | sort | uniq -c
   2 GET /api/courses
   2 GET /api/teachers/Asha
   3 GET /api/teachers/Meera
   3 GET /api/teachers/Rahul
```

Ten lines: two for the course list and eight for teachers; Meera three times, Rahul three times, Asha twice. And the `useFetch` hook is about twenty lines (three `useState`, an effect, an abort, an error check). Every new kind of data repeats it.

Remember System Design (module 5, lesson 1): a cache keeps a copy, so the next lookup is a hit and the slow trip is skipped. Our page has no cache at all.

### 4. Problem two: throwing the list away

Lukas is on the catalog. He taps Cart, and a second later taps Catalog again.

```bash
sh ../use-version.sh v1-fetch-everywhere
```

While he is on the cart, the list component is removed from the page, and its state disappears with it (module 4, lesson 3). When he comes back, `Loading courses...` is shown again, and the log shows a third request:

```bash
curl http://localhost:8111/log | sort | uniq -c   (after Cart, Catalog)
3 GET /api/courses
```

The data was on this very computer a second ago. We threw it away and asked again. On a slow phone connection, that is a blank wait on every return.

### 5. Problem three: a stale price

Meera, the teacher, drops the price of React for Beginners from 499 to 299. It is a real change on the server:

```bash
curl -X POST "http://localhost:8111/sale?slug=react-for-beginners&price=299"
```
```bash
curl -X "http://localhost:8111/sale?slug=react-for-beginners&price=299"
{"slug":"react-for-beginners","price":299}
```

Now look at Lukas's page. Nothing happened. The banner says `Rs 499`, and so does the list. The page cannot know: a server only answers when it is asked. Guess: Lukas taps Cart, then Catalog again, so the list fetches fresh data. What do the banner and the list show now?

The list says `Rs 299`. The banner still says `Rs 499`, because it was never removed from the page, so it never asked again. One page, two prices for the same course.

And the risk is money. Lukas trusts the banner and presses buy at 499. The server checks and answers with status 409: the price changed.

```bash
curl -X POST "http://localhost:8111/api/checkout?slug=react-for-beginners&price=499"
```
```bash
curl -X POST "http://localhost:8111/api/checkout?slug=react-for-beginners&price=499"
{"status":409,"error":"The price changed. It is now 299."}
```

### 6. The cure: a pin board of copies

Photos taken twice, photos thrown away, photos that are out of date. One idea solves all three, and you know it from System Design: a cache. A cache is a pin board of copies. Here the same pin board sits inside the browser, between your components and the server.

- Every copy has a label, a **key**: which data it is (`courses`, or `teacher Meera`). Two components that ask for the same key get the same copy.
- Every copy has a **time stamp**, so the board knows how old it is. And we choose one rule: how long a copy counts as **fresh** (the fresh time).

The rules: no copy on the board is a miss, so go to the server and show loading, once. A copy that is fresh is a hit: hand it over, no trip at all. A copy that is old: hand it over now, and fetch a new one in the background. If two components ask for a key while a trip is already on its way, they share that trip.

### 7. The pin board in plain script

This is a real cache in about twenty lines (`board/cache.ts`): a map for the board, with the address as the key; a second map for requests that are on their way; `load` makes the trip; `fromServer` shares a trip that is already under way; `getCached` is the door: no copy, make the trip; a young copy, return it; an old copy, return it and refresh in the background.

`board/cache.ts`:
```ts
export const API = 'http://localhost:8111'
const board = new Map()
const asking = new Map()
const FRESH_MS = 2000

async function load(key: string) {
  console.log('  trip to the server:', key)
  const res = await fetch(API + key)
  const data = await res.json()
  board.set(key, { data, at: Date.now() })
  asking.delete(key)
  return data
}

function fromServer(key: string) {
  if (!asking.has(key)) asking.set(key, load(key))
  return asking.get(key)
}

export async function getCached(key: string) {
  const copy = board.get(key)
  if (!copy) return fromServer(key)
  if (Date.now() - copy.at < FRESH_MS) return copy.data
  fromServer(key)
  return copy.data
}
```

A script that uses it: two asks at the same moment, then one more, then Meera drops the price and we ask again, then wait 2.5 seconds, ask, wait half a second, ask:

`board/run.ts`:
```ts
import { API, getCached } from './cache.ts'

const get = () => getCached('/api/courses')
const price = async () => (await get())[0].price
const wait = (ms: number) => new Promise(r => setTimeout(r, ms))
const sale = '/sale?slug=react-for-beginners&price=299'

console.log('two at once :', await Promise.all([price(), price()]))
console.log('again       :', await price())
await fetch(API + sale, { method: 'POST' })
console.log('after sale  :', await price())
await wait(2500)
console.log('copy is old :', await price())
await wait(500)
console.log('a moment on :', await price())
```

Run it against the API (the API must be running; the address is in `cache.ts`):

```bash
cd ../board
node run.ts
```
```bash
node run.ts
  trip to the server: /api/courses
two at once : [ 499, 499 ]
again       : 499
after sale  : 499
  trip to the server: /api/courses
copy is old : 499
a moment on : 299
```

Two asks at once: one trip, shared, and both get 499. Again: no trip. Meera drops the price and we ask: still 499, no trip, because the copy is fresh. After 2.5 seconds the copy is old: we get the old answer at once, and a trip happens in the background. A moment later: 299. Two trips in the whole run.

A cache has two knobs. The key says which data. The fresh time says how long we trust a copy. Short, and the data stays close to the truth, but there are more trips. Long, and fewer trips, but older copies. Change `FRESH_MS` to 10000 and then to 0 and predict how many trips each run makes before you run it (see Try it yourself).

### 8. Should Asha write this herself?

She could. But list what is still missing: trying again when the network fails, refreshing when the visitor comes back to the tab, cleaning up copies nobody uses, loading and error states, and writing to the server. Someone wrote it once, well, and shared it: TanStack Query, the subject of this module. Same pin board, same keys, same fresh time, plus all those.

```bash
cd ../web
sh ../use-version.sh v3-tanstack-query
```

`useCourses.ts`:
```ts
import { useQuery } from '@tanstack/react-query'
import type { Course } from './types'

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async (): Promise<Course[]> => (await fetch('/api/courses')).json(),
  })
}
```

`main.tsx`:
```tsx
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
)
```

`CourseList.tsx`:
```tsx
import { useCourses } from './useCourses'

export function CourseList() {
  const { data, status, error } = useCourses()
  if (status === 'pending') return <p className="note">Loading courses...</p>
  if (status === 'error') return <p className="bad">{error.message}</p>
  return (
    <ul className="grid">
      {data.map(c => (
        <li key={c.slug} className="card">
          <h2>{c.title}</h2>
          <p>{c.teacher} · Rs {c.price}</p>
        </li>
      ))}
    </ul>
  )
}
```

Reset the log and open the page: the log shows one request, not two, because the banner and the list asked for the same key. Tap Cart and then Catalog: the list is on screen at once, with the copy from the board, and a refresh happens quietly behind it. Now Meera changes the price and the page is switched away and back again (the page visibility signal that the library listens to): the page refreshes itself, and the banner and the list both say `Rs 299`.

All three problems are gone, and Asha wrote no loading flags. In lesson 2 you will write it yourself. Check the types and the build:

```bash
npx tsc -b
```

```bash
npm run build
> allcsvideos-web@0.0.0 build
> tsc -b && vite build

vite v8.3.5 building client environment for production...
transforming...
✓ 64 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-NNDZyUAC.css    0.91 kB │ gzip:  0.41 kB
dist/assets/index-CRTsWZyy.js   253.92 kB │ gzip: 78.56 kB

✓ built in 426ms
```

(The file hashes can differ on your machine.)

### 9. Three mistakes beginners make

One: hammering for freshness. Lukas complains about old prices, so Asha adds a timer: fetch again every second (`versions/m1-polling`).

```bash
sh ../use-version.sh m1-polling
```
`useFetch.ts` (changes marked with + and -):
```diff
@@ -8,4 +8,11 @@
   const [error, setError] = useState<string | null>(null)
+  const [tick, setTick] = useState(0)
 
   useEffect(() => {
+    const bump = () => setTick(t => t + 1)
+    const id = setInterval(bump, 1000)
+    return () => clearInterval(id)
+  }, [])
+
+  useEffect(() => {
     const controller = new AbortController()
@@ -24,3 +31,3 @@
     return () => controller.abort()
-  }, [url])
+  }, [url, tick])
 
```

The list flashes `Loading courses...` again and again, and the server is hit constantly. After about 10 seconds:

```bash
curl -s http://localhost:8111/log | wc -l   (about 10 seconds after loading the page)
21   (yours will differ a little)
```

Two: copying server data into your own store. Asha loads the courses once into a context (module 10, lesson 2) and every component reads them (`versions/m3-context-copy`):

```bash
sh ../use-version.sh m3-context-copy
```
`CoursesProvider.tsx`:
```tsx
import { createContext, useContext } from 'react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Course } from './types'

const Ctx = createContext<Course[]>([])
type Props = { children: ReactNode }

export function CoursesProvider(props: Props) {
  const [list, setList] = useState<Course[]>([])
  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(setList)
  }, [])
  return <Ctx value={list}>{props.children}</Ctx>
}

export const useCourses = () => useContext(Ctx)
```

One request, no flashing, it looks perfect. But now the copy never refreshes: no key, no age, no retry, no sharing rules. You have written a cache with none of the features. Let the cache library own server data.

Three: trusting a copy where the truth is needed. Remember System Design (module 5, lesson 1): a stale balance can let someone spend money they do not have. Show the copy to look at, but let the server decide at the moment that matters. Our checkout call answered 409 when the price had changed; the page must handle that answer.

## Common mistakes

- Fetching in every component with a hook like `useFetch`: duplicate requests, a loading flash on every return, and stale copies.
- Refreshing by polling every second. It floods the server and flashes the page.
- Copying server data into `useState`, context or Zustand. It is a cache without the rules.
- Trusting a copy at the moment of payment. The server must have the last word.
- Counting requests in a dev server with strict mode on: effects run twice. Turn strict mode off (or count on a build) when you compare.

## Clean up

Stop the API and the dev server with Ctrl+C. Run `curl -X POST http://localhost:8111/reset` (or restart the API) if you left a sale in place. Delete `web/node_modules` and `web/dist` if you want. Run `sh ../use-version.sh v3-tanstack-query` so `src/` holds the finished version.

## Key ideas (recap)

1. Server state is a copy of data that someone else owns. It is far away, shared, and can change without telling you. Client state is different: only your code changes it.
2. Fetching in every component gives three quiet bugs: the same request twice, a loading flash on every return, and stale copies, even two prices on one page.
3. The cure is a cache: copies on a pin board, each with a key and an age. Fresh, use it. Old, use it and refresh in the background. Same key, one trip. The fresh time is the knob. TanStack Query is that cache, written once, well.

Interview question (Rahul): why not keep the API data in `useState` or context? A good answer: because it is not your data, it is a cached copy of something the server owns. State and context have no keys, no age, no refetching, no sharing of requests and no retries, so you end up rebuilding a cache badly. A server-state library gives you those, and keeps client state for things only your code changes.

## Try it yourself

In `board/cache.ts`, change the fresh time to 10 seconds, and then to 0. Predict how many trips each run of `node run.ts` makes before you run it. (Answer below.)

Answer (real runs): with `10000` the copy stays fresh for the whole run, so there is exactly one trip (the first), and even the last line still says `499`. With `0` no copy is ever fresh: there are four trips (the first one; one in the background for `again`, which `after sale` shares because it is still on its way; one for `copy is old`; one for `a moment on`), and the last two lines say `299`.

## Next

Module 11, Lesson 2: [Queries with useQuery](../m11-l02-queries-with-usequery/README.md).
