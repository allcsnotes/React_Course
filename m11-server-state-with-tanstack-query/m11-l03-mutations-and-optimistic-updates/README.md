# M11-L03 · Mutations and Optimistic Updates

> Video: Module 11, Lesson 3. Watch it first, then follow along here.

## What you'll learn

- The difference between a query (reading) and a mutation (writing), and why `useMutation` waits for `mutate`
- Write with `useMutation`: pending state, error message, and the button that is disabled while it works
- Tell the cache its copy is old with `invalidateQueries` (and return the promise so the button waits)
- Make the page feel instant with an optimistic update: `onMutate`, `onError` rollback and `onSettled`
- Avoid three mistakes: changing the cache in place, forgetting to wrap the saved copy, and invalidating the wrong key

## Before you start

- Node 24. Check with `node --version`.
- No Docker needed. The data comes from `api/server.mjs`, a small local Node stand-in for the allcsvideos API (port 8113). It is not the production server. `api/mode.txt` switches enrolling between `ok` and `fail` (the payment service is down).
- Best after M11-L02 in `../m11-l02-queries-with-usequery/`.
- Work in `allcsvideos-web/` (Vite 8.3.5, React 19.3.1, TypeScript 7.0.2, TanStack Query 5.105.0). Swap versions with `sh ../use-version.sh NAME`.

## Files in this folder

| File | What it is |
|------|------------|
| `allcsvideos-web/` | The project; `src/` holds `v3-optimistic` (the lesson's result) |
| `allcsvideos-web/src/useEnroll.ts` | The `useEnroll` hook with the optimistic update |
| `allcsvideos-web/src/EnrollButton.tsx` | The Enroll button |
| `allcsvideos-web/src/api.ts` | `getCourses` and `enroll` |
| `api/server.mjs`, `api/mode.txt` | The practice API: `GET /api/courses` (300 ms), `POST /api/enrollments` (1.5 s), `POST /api/reset` |
| `versions/v0-plain/` | The button calls `enroll` with no mutation |
| `versions/v1-mutation/` | `useMutation` with a pending flag and an error |
| `versions/v2-invalidate/` | `invalidateQueries` after success |
| `versions/v3-optimistic/` | The optimistic update in `useEnroll` |
| `versions/m1-inplace/`, `m2-noreturn/`, `m3-wrongkey/` | The three mistakes |
| `use-version.sh` | Replaces everything in `allcsvideos-web/src` with one version |

## Follow along

```bash
cd allcsvideos-web
npm install
```

Start the practice API in its own terminal, from this lesson folder (it prints one log line per request):

```bash
node api/server.mjs
```
```bash
practice API on http://localhost:8113
```

Reset the enrollments any time with `curl -X POST http://localhost:8113/api/reset`. Switch the failure mode with `echo fail > api/mode.txt` (and `echo ok > api/mode.txt` to switch back). Then the page:

```bash
sh ../use-version.sh v0-plain
npm run dev
```

Open the address Vite prints (this project asks for http://localhost:5213).

### 1. The button that seems to do nothing

Lukas opens the courses page and clicks `Enroll` on React for Beginners. The button calls the `enroll` function directly:

`EnrollButton.tsx`:
```tsx
import { enroll, type Course } from './api'

export function EnrollButton({ course }: { course: Course }) {
  if (course.enrolled) {
    return <span className="done">Enrolled</span>
  }

  return <button onClick={() => enroll(course.slug)}>Enroll</button>
}
```

Nothing happens. No spinner, no message. Two seconds later the card still says `Enroll`. So Lukas clicks again. Now the console shows a red error: you are already enrolled. The first click had worked all along. The server knew; the page did not.

```bash
(click Enroll, wait 2 seconds, click again; the browser console)
after 2 s:             card 1 still says "Enroll", My courses: 0
after clicking again:  console: Failed to load resource: ... 409 (Conflict)
                       console: Uncaught Error: You are already enrolled
```

Two problems: the page never showed that something was happening, and the list on the screen is a copy kept in the cache, and nobody told it to change.

### 2. Reading and writing

Think of a library. Looking a book up in the catalogue is reading: you can do it a hundred times and nothing changes. In TanStack Query that is a query. Borrowing a book is writing: you fill in a form, the librarian changes the shelf, and the world is different afterwards. A request that changes something on the server is a mutation. Two differences: a query runs by itself when the component appears, while a mutation waits until you say go; and a query is safe to repeat, so it can be retried and refetched, while a mutation is not repeated for you.

The pin board from lesson 1 is the cache: a copy of the catalogue. After the librarian changes the shelf, our copy is out of date, and we must say so.

### 3. useMutation

First the function that does the writing, in `api.ts`: `enroll` takes a slug and sends a `POST` to `/api/enrollments`, and throws an error with the server's message when the answer is not ok.

`versions/v1-mutation/api.ts`:
```ts
export type Course = {
  slug: string
  title: string
  teacher: string
  price: number
  enrolled: boolean
}

export async function getCourses(): Promise<Course[]> {
  const res = await fetch('/api/courses')
  if (!res.ok) throw new Error('Could not load courses')
  return res.json()
}

export async function enroll(slug: string): Promise<Course> {
  const res = await fetch('/api/enrollments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug }),
  })
  if (!res.ok) throw new Error((await res.json()).error)
  return res.json()
}
```

Now the hook. `useMutation` takes `mutationFn`: our `enroll`. It gives back an object, here called `enrollment`, with `mutate`, `isPending` and `error`.

```bash
sh ../use-version.sh v1-mutation
```
`EnrollButton.tsx` (changes marked with + and -):
```diff
@@ -1 +1,2 @@
+import { useMutation } from '@tanstack/react-query'
 import { enroll, type Course } from './api'
@@ -3,2 +4,4 @@
 export function EnrollButton({ course }: { course: Course }) {
+  const enrollment = useMutation({ mutationFn: enroll })
+
   if (course.enrolled) {
@@ -7,3 +10,13 @@
 
-  return <button onClick={() => enroll(course.slug)}>Enroll</button>
+  return (
+    <div>
+      <button
+        disabled={enrollment.isPending}
+        onClick={() => enrollment.mutate(course.slug)}
+      >
+        {enrollment.isPending ? 'Enrolling…' : 'Enroll'}
+      </button>
+      <p className="error">{enrollment.error?.message}</p>
+    </div>
+  )
 }
```

Pressing the button calls `mutate` with the slug. While the request waits for an answer the button is disabled and says `Enrolling…`. Underneath, a paragraph shows the error message if there is one. Guess: Lukas clicks Enroll. What does the card show half a second later, and what does the page show after two seconds?

```bash
(v1-mutation, server ok)
0.5 s:  card 1: Enrolling...  (grey button)   My courses: 0
1.4 s:  card 1: Enrolling...
2.8 s:  card 1: Enroll               My courses: 0   (the write worked; the list is old)
```

The button goes grey and says `Enrolling…`. After about two seconds, the button says `Enroll` again, and `My courses` still says 0: the write worked, but the list on the screen is the old copy. Now the failure. Switch the server to `fail`:

```bash
echo fail > ../api/mode.txt
```

The click ends with a red message:

```bash
(v1-mutation, server in fail mode)
0.5 s:  card 1: Enrolling...
2.8 s:  card 1: Enroll  + red text "The payment service is down"   My courses: 0
```

(Put it back with `echo ok > ../api/mode.txt` and reset with `curl -X POST http://localhost:8113/api/reset`.)

### 4. Tell the cache its copy is old

We need the query client, the object that holds the cache (`useQueryClient`). On success we call `invalidateQueries` with the key `['courses']`: the same key the list used in lesson 2. It marks every query that starts with that key as stale, and every component that shows it fetches again.

```bash
sh ../use-version.sh v2-invalidate
```
`EnrollButton.tsx` (changes marked with + and -):
```diff
@@ -1,2 +1,2 @@
-import { useMutation } from '@tanstack/react-query'
+import { useMutation, useQueryClient } from '@tanstack/react-query'
 import { enroll, type Course } from './api'
@@ -4,3 +4,8 @@
 export function EnrollButton({ course }: { course: Course }) {
-  const enrollment = useMutation({ mutationFn: enroll })
+  const queryClient = useQueryClient()
+  const enrollment = useMutation({
+    mutationFn: enroll,
+    onSuccess: () =>
+      queryClient.invalidateQueries({ queryKey: ['courses'] }),
+  })
 
```

Notice that the arrow function returns the promise, so TanStack Query waits for it: the button stays on `Enrolling…` until the fresh list has arrived.

```bash
(v2-invalidate, server ok)
0.5 s:  card 1: Enrolling...   My courses: 0
1.4 s:  card 1: Enrolling...   My courses: 0
2.8 s:  card 1: Enrolled      My courses: 1   (after the fresh list arrived)
```

Click: `Enrolling…`. After about 1.5 seconds the POST is done, and then a GET starts at once. The button is still on `Enrolling…` until the fresh list arrives; then the card says `Enrolled` and `My courses` says 1. In the server log (the terminal where the API runs):

```text
POST /api/enrollments 201 1502ms
GET /api/courses 200 303ms
```

(Yours will differ a little.) This is the safe way: the server decides, and the page follows. The price is the wait: one and a half seconds for the write, and a third of a second for the new list. With the server in `fail` mode:

```bash
(v2-invalidate, server in fail mode)
0.5 s:  card 1: Enrolling...   My courses: 0
2.8 s:  card 1: Enroll + "The payment service is down"   My courses: 0
```

### 5. Optimistic updates

Think of a waiter. You order a coffee. A slow waiter stands still until the kitchen says yes. A good waiter writes it down, says "coming right up", and tells you later if the kitchen could not do it. An optimistic update does the same, in three steps: before the request leaves, keep a copy of the current list and change the cache. If the request fails, put the copy back. When the request is done either way, refetch the list so the cache matches the server.

The code is growing, so it moves into its own custom hook, `useEnroll`:

```bash
sh ../use-version.sh v3-optimistic
```

`useEnroll.ts`:
```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { enroll, type Course } from './api'

const key = ['courses']

function markEnrolled(list: Course[], slug: string) {
  return list.map((c) =>
    c.slug === slug ? { ...c, enrolled: true } : c,
  )
}

export function useEnroll() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: enroll,
    onMutate: async (slug: string) => {
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<Course[]>(key)
      queryClient.setQueryData<Course[]>(key, (old = []) =>
        markEnrolled(old, slug),
      )
      return { previous }
    },
    onError: (_error, _slug, context) => {
      queryClient.setQueryData(key, context?.previous)
    },
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: key })
    },
  })
}
```

- `onMutate` runs before the request leaves. First `cancelQueries`: if a fetch of the list is in flight, its old answer would arrive later and overwrite our change. Then save the current list with `getQueryData`, change the cache with `setQueryData` using a helper that makes a new list (never change the old one), and return an object holding `previous`, which becomes the `context`.
- `onError` receives the error, the slug we sent and that `context`. We put the saved list back with `setQueryData`.
- `onSettled` runs after success or failure: invalidate the key, so the list is refetched from the server.

The component changes by one line: it calls `useEnroll` instead of `useMutation`.

`EnrollButton.tsx` (changes marked with + and -):
```diff
@@ -1,11 +1,6 @@
-import { useMutation, useQueryClient } from '@tanstack/react-query'
-import { enroll, type Course } from './api'
+import { useEnroll } from './useEnroll'
+import type { Course } from './api'
 
 export function EnrollButton({ course }: { course: Course }) {
-  const queryClient = useQueryClient()
-  const enrollment = useMutation({
-    mutationFn: enroll,
-    onSuccess: () =>
-      queryClient.invalidateQueries({ queryKey: ['courses'] }),
-  })
+  const enrollment = useEnroll()
 
```

Guess: the practice API is set to fail. Lukas clicks Enroll. What does the card show after a fifth of a second, and after two seconds?

```bash
echo fail > ../api/mode.txt
```
```bash
(v3-optimistic, server in fail mode)
0.5 s:  card 1: Enrolled     My courses: 1   (the write is still on its way)
1.4 s:  card 1: Enrolled     My courses: 1
2.8 s:  card 1: Enroll + "The payment service is down"   My courses: 0   (rolled back)
```

After a fifth of a second the card says `Enrolled` and `My courses` says 1; the POST is still on its way. Then, at about 1.5 seconds, the server answers with the error: the card goes back to `Enroll`, the counter to 0, and the red message appears. And when the server says yes:

```bash
echo ok > ../api/mode.txt
```
```bash
(v3-optimistic, server ok)
0.5 s:  card 1: Enrolled     My courses: 1
1.4 s:  card 1: Enrolled     My courses: 1
2.8 s:  card 1: Enrolled     My courses: 1   (confirmed by the server and the fresh list)
```

The card says `Enrolled` at once, the POST is confirmed 1.5 seconds later, and the GET brings back the server's version. Check the types and the build:

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
✓ 64 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-DG8DKgO5.css    1.09 kB │ gzip:  0.50 kB
dist/assets/index-DQ1jV573.js   256.76 kB │ gzip: 79.30 kB

✓ built in 416ms
```

(The file hashes can differ on your machine.)

When is this a good idea? When failures are rare, and a wrong guess is harmless for a moment: a like button, a checkbox, enrolling. For a payment, or anything where the user must be sure the server accepted, use the careful version from step 4.

### 6. Three mistakes

**One: changing the cache in place.** The helper sets `enrolled` on the course itself and returns the same list:

```bash
sh ../use-version.sh m1-inplace
```
`useEnroll.ts` (changes marked with + and -):
```diff
@@ -6,5 +6,5 @@
 function markEnrolled(list: Course[], slug: string) {
-  return list.map((c) =>
-    c.slug === slug ? { ...c, enrolled: true } : c,
-  )
+  const course = list.find((c) => c.slug === slug)
+  if (course) course.enrolled = true
+  return list
 }
```

With the server in `fail` mode, the card changes to `Enrolled` but `My courses` stays at 0. The cache still holds the very same array, so the cache tells nobody that the list changed. The card re-draws only because its own mutation state changed, and it reads the course we changed in place; `App`, which counts the courses, never re-ran. The saved `previous` is also that same list, so on failure there is nothing different to put back:

```bash
(m1-inplace, server in fail mode)
0.5 s:  card 1: Enrolled     My courses: 0   (the card changed but the counter did not)
2.8 s:  card 1: Enroll + "The payment service is down"   My courses: 0
```

Always copy, never change in place.

**Two: forgetting to wrap the saved copy.** `onMutate` returns `previous` instead of an object that holds `previous`. TypeScript stops us:

```bash
sh ../use-version.sh m2-noreturn
```
`useEnroll.ts` (changes marked with + and -):
```diff
@@ -22,3 +22,3 @@
       )
-      return { previous }
+      return previous
     },
```

```bash
npx tsc -b
src/useEnroll.ts:26:46 - error TS2339: Property 'previous' does not exist on type 'Course[]'.

26       queryClient.setQueryData(key, context?.previous)
                                                ~~~~~~~~

Found 1 error in src/useEnroll.ts:26
```

**Three: the wrong key.** Here we invalidate `['catalog']`, but the list is called `courses`. No error, no warning:

```bash
sh ../use-version.sh m3-wrongkey
```
`EnrollButton.tsx` (changes marked with + and -):
```diff
@@ -8,3 +8,3 @@
     onSuccess: () =>
-      queryClient.invalidateQueries({ queryKey: ['courses'] }),
+      queryClient.invalidateQueries({ queryKey: ['catalog'] }),
   })
```

The POST works, the button changes back to `Enroll`, and `My courses` stays at 0, because nothing told the real list it was old. Only a refresh shows the truth. It is the quietest of the three. Check that the key you invalidate is the key the list uses.

## Common mistakes

- Calling the write function straight from `onClick` with no mutation: no pending state, no error, no refresh.
- Forgetting to invalidate (or invalidating the wrong key) after a write: the page keeps showing the old copy.
- Not returning the promise from `invalidateQueries`, so the button stops waiting too early.
- Changing the cached array in place in an optimistic update. Copy it.
- Returning `previous` directly from `onMutate` instead of `{ previous }`.
- Using an optimistic update for something that must be certain (a payment).

## Clean up

Stop the API and the dev server with Ctrl+C. Put `ok` back in `api/mode.txt`. Delete `allcsvideos-web/node_modules` and `allcsvideos-web/dist` if you want. Run `sh ../use-version.sh v3-optimistic` so `src/` holds the finished version.

## Key ideas (recap)

1. A query reads, a mutation writes. `useMutation` waits for `mutate`, gives a pending flag and an error, and never tries again by itself.
2. After a write, `invalidateQueries` tells the cache its copy is old, and the list is fetched again. Return the promise, and the button waits for the fresh list.
3. An optimistic update keeps a copy in `onMutate`, puts it back in `onError`, and refetches in `onSettled`. Always copy, never change in place.

Interview question (Rahul): what is an optimistic update, and when would you not use it? A good answer: we update the screen as if the server had already said yes, keep a copy of the old data, and roll back if the request fails; on settle we refetch so the cache matches the server. Do not use it where a failure is costly or the user needs certainty, like payments.

## Try it yourself

Add a `Drop course` button with its own mutation that removes the enrollment, with an optimistic update and a rollback. Switch the server to fail and watch the card flip back. (Answer below.)

Answer: the practice API in this folder has no "drop" endpoint, so add one first: in `api/server.mjs`, handle `DELETE /api/enrollments/:slug` by calling `enrolled.delete(slug)` (and answer 500 when the mode is `fail`). Then write `useDrop` like `useEnroll`: in `onMutate` cancel the queries, save `previous`, and set `enrolled: false` on a copy of that course with `.map`; in `onError` put `previous` back; in `onSettled` return `invalidateQueries({ queryKey: ['courses'] })`. In `EnrollButton`, when `course.enrolled` is true show a `Drop course` button that calls `useDrop().mutate(course.slug)`.

## Next

Module 11, Lesson 4: [Pagination, Infinite Scroll and Prefetching](../m11-l04-pagination-infinite-scroll-and-prefetching/README.md).
