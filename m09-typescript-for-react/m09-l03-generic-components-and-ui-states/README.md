# M09-L03 · Generic Components and UI States

> Video: Module 9, Lesson 3. Watch it first, then follow along here.

## What you'll learn

- Why two copies of the same list component are a problem, and why `any` is the wrong fix
- Write one reusable list with a generic `List<T>` and a constraint `T extends { id: number }`
- Model loading, error and success as a discriminated union, so impossible states cannot be written
- Narrow the union with `if` or `switch`, and catch a forgotten case with `assertNever`
- Put both halves together in a typed `useFetch<T>` hook and an `AsyncView<T>` component

## Before you start

- Node 24. Check with `node --version`.
- No Docker needed. The final page talks to a small local Node stand-in for the allcsvideos API (`api/server.mjs`); it is not the production server.
- Best after M09-L02 in `../m09-l02-typing-props-state-and-events/`.

## Files in this folder

| File | What it is |
|------|------------|
| `web/` | The finished project (Vite 8.3.5, React 19.3.1, TypeScript 7.0.2) |
| `web/src/List.tsx` | The generic list `List<T extends { id: number }>` |
| `web/src/states.ts` | `AsyncState<T>`, the discriminated union |
| `web/src/useFetch.ts` | `useFetch<T>(url)` returns an `AsyncState<T>` |
| `web/src/AsyncView.tsx` | `AsyncView<T>` renders loading, error or success |
| `web/src/App.tsx`, `types.ts`, `data.ts` | The page, `Course` and `Lesson` types, sample data |
| `api/server.mjs` | The local API stand-in (port 8193) with `fail` and `empty` switches |
| `versions/` | 21 complete snapshots of `web/src`, one per experiment (named s01 to s20, plus `final`) |
| `use-version.sh` | Copies one snapshot into `web/src` |

Like the video, each experiment swaps files in the project. Run `sh ../use-version.sh NAME` from inside `web/`; it removes the code files in `src/` and copies the snapshot `versions/NAME/` in (the CSS stays). Then run `npx tsc -b` and compare with the output below.

## Follow along

```bash
cd web
npm install
```

### 1. Two lists that are the same, line for line

A course list and a lesson list. Read them side by side: only the type and the text inside differ.

```bash
sh ../use-version.sh s01-duplicate-lists
```

`CourseList.tsx`:
```tsx
import type { Course } from './types'

interface Props {
  items: Course[]
}

export function CourseList({ items }: Props) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.title} <small>{item.teacher}</small>
        </li>
      ))}
    </ul>
  )
}
```

`LessonList.tsx`:
```tsx
import type { Lesson } from './types'

interface Props {
  items: Lesson[]
}

export function LessonList({ items }: Props) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.title} <small>{item.minutes} min</small>
        </li>
      ))}
    </ul>
  )
}
```

```bash
npx tsc -b
```

TypeScript accepts it, and the page works. In plain JavaScript you would write one list and use it for anything. Here the question is: how do you write one list and still have the types checked?

### 2. The easy way: any

A reusable list whose items are `any`. The app has a typo on purpose: `c.titel`.

```bash
sh ../use-version.sh s02-any-list
```

`List.tsx`:
```tsx
import type { ReactNode } from 'react'

interface ListProps {
  items: any[]
  renderItem: (item: any) => ReactNode
}

export function List({ items, renderItem }: ListProps) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}
```

`App.tsx` (changes marked with + and -):
```diff
@@ -8,10 +8,3 @@
         <h2>Courses</h2>
-        <List
-          items={courses}
-          renderItem={c => (
-            <>
-              {c.title} <small>{c.teacher}</small>
-            </>
-          )}
-        />
+        <List items={courses} renderItem={c => c.titel} />
       </section>
@@ -19,10 +12,3 @@
         <h2>Lessons</h2>
-        <List
-          items={lessons}
-          renderItem={l => (
-            <>
-              {l.title} <small>{l.minutes} min</small>
-            </>
-          )}
-        />
+        <List items={lessons} renderItem={l => l.title} />
       </section>
```

```bash
npx tsc -b
```

The checker prints nothing. On the page you get four bullets, all empty. `any` switched the checking off, so the typo walked straight through.

### 3. Generics: a blank for a type

A generic has a blank for a type, written in angle brackets: `ListProps<T>`. Items is an array of `T`, and `renderItem` takes one `T`. Like a moving box with a label on the outside saying what is inside.

```bash
sh ../use-version.sh s03-generic-no-constraint
```

`List.tsx`:
```tsx
import type { ReactNode } from 'react'

interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => ReactNode
}

export function List<T>({
  items,
  renderItem,
}: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}
```

```bash
npx tsc -b
src/List.tsx:15:23 - error TS2339: Property 'id' does not exist on type 'T'.

15         <li key={item.id}>{renderItem(item)}</li>
                         ~~

Found 1 error in src/List.tsx:15
```

Of course: `T` could be anything, so TypeScript cannot promise every `T` has an `id`. Tell it what you need, with a constraint: `T extends { id: number }`. Think of a bouncer: any person may come in, as long as they have a ticket. (`extends` here just means "is at least this"; it has nothing to do with classes.)

```bash
sh ../use-version.sh s04-generic-constraint
```

`List.tsx`:
```tsx
import type { ReactNode } from 'react'

interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => ReactNode
}

export function List<T extends { id: number }>({
  items,
  renderItem,
}: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}
```

`App.tsx`:
```tsx
import { List } from './List'
import { courses, lessons } from './data'

export default function App() {
  return (
    <main>
      <section>
        <h2>Courses</h2>
        <List
          items={courses}
          renderItem={c => (
            <>
              {c.title} <small>{c.teacher}</small>
            </>
          )}
        />
      </section>
      <section>
        <h2>Lessons</h2>
        <List
          items={lessons}
          renderItem={l => (
            <>
              {l.title} <small>{l.minutes} min</small>
            </>
          )}
        />
      </section>
    </main>
  )
}
```

```bash
npx tsc -b
```

Nobody writes the `T` when using the list. TypeScript looks at `items` (an array of `Course`) and fills the blank by itself. This is called inference.

### 4. The same typo, now caught

```bash
sh ../use-version.sh s05-typo-caught
```
`App.tsx` (changes marked with + and -):
```diff
@@ -8,10 +8,3 @@
         <h2>Courses</h2>
-        <List
-          items={courses}
-          renderItem={c => (
-            <>
-              {c.title} <small>{c.teacher}</small>
-            </>
-          )}
-        />
+        <List items={courses} renderItem={c => c.titel} />
       </section>
@@ -19,10 +12,3 @@
         <h2>Lessons</h2>
-        <List
-          items={lessons}
-          renderItem={l => (
-            <>
-              {l.title} <small>{l.minutes} min</small>
-            </>
-          )}
-        />
+        <List items={lessons} renderItem={l => l.title} />
       </section>
```

```bash
npx tsc -b
src/App.tsx:9:50 - error TS2551: Property 'titel' does not exist on type 'Course'. Did you mean 'title'?

9         <List items={courses} renderItem={c => c.titel} />
                                                   ~~~~~

  src/types.ts:3:3 - 'title' is declared here.
    3   title: string
        ~~~~~

Found 1 error in src/App.tsx:9
```

And with lessons, the blank is filled with `Lesson`. Showing `minutes` on a course fails:

```bash
sh ../use-version.sh s06-wrong-field
```
`App.tsx` (changes marked with + and -):
```diff
@@ -8,10 +8,3 @@
         <h2>Courses</h2>
-        <List
-          items={courses}
-          renderItem={c => (
-            <>
-              {c.title} <small>{c.teacher}</small>
-            </>
-          )}
-        />
+        <List items={courses} renderItem={c => c.minutes} />
       </section>
@@ -19,10 +12,3 @@
         <h2>Lessons</h2>
-        <List
-          items={lessons}
-          renderItem={l => (
-            <>
-              {l.title} <small>{l.minutes} min</small>
-            </>
-          )}
-        />
+        <List items={lessons} renderItem={l => l.minutes} />
       </section>
```

```bash
npx tsc -b
src/App.tsx:9:50 - error TS2339: Property 'minutes' does not exist on type 'Course'.

9         <List items={courses} renderItem={c => c.minutes} />
                                                   ~~~~~~~

Found 1 error in src/App.tsx:9
```

### 5. Items that break the constraint

Objects with no `id`:

```bash
sh ../use-version.sh s07-no-id
```
`App.tsx`:
```tsx
import { List } from './List'

const tags = [{ name: 'new' }, { name: 'free' }]

export default function App() {
  return (
    <main>
      <section>
        <h2>Tags</h2>
        <List items={tags} renderItem={t => <>{t.name}</>} />
      </section>
    </main>
  )
}
```

```bash
npx tsc -b
src/App.tsx:10:15 - error TS2322: Type '{ name: string; }[]' is not assignable to type '{ id: number; }[]'.
  Property 'id' is missing in type '{ name: string; }' but required in type '{ id: number; }'.

10         <List items={tags} renderItem={t => <>{t.name}</>} />
                 ~~~~~

  src/List.tsx:8:34 - 'id' is declared here.
    8 export function List<T extends { id: number }>({
                                       ~~

  src/List.tsx:4:3 - The expected type comes from property 'items' which is declared here on type 'IntrinsicAttributes & ListProps<{ id: number; }>'
    4   items: T[]
        ~~~~~

src/App.tsx:10:50 - error TS2339: Property 'name' does not exist on type '{ id: number; }'.

10         <List items={tags} renderItem={t => <>{t.name}</>} />
                                                    ~~~~

Found 2 errors in the same file, starting at: src/App.tsx:10
```

A list of plain strings:

```bash
sh ../use-version.sh s08-strings
```
`App.tsx`:
```tsx
import { List } from './List'

const tags = ['new', 'free', 'popular']

export default function App() {
  return (
    <main>
      <section>
        <h2>Tags</h2>
        <List items={tags} renderItem={t => <>{t}</>} />
      </section>
    </main>
  )
}
```

```bash
npx tsc -b
src/App.tsx:10:15 - error TS2322: Type 'string[]' is not assignable to type '{ id: number; }[]'.
  Type 'string' is not assignable to type '{ id: number; }'.

10         <List items={tags} renderItem={t => <>{t}</>} />
                 ~~~~~

  src/List.tsx:4:3 - The expected type comes from property 'items' which is declared here on type 'IntrinsicAttributes & ListProps<{ id: number; }>'
    4   items: T[]
        ~~~~~

Found 1 error in src/App.tsx:10
```

The label on the door said: must have an `id`.

### 6. Part two: loading, error and success

First try: one type with optional fields.

```bash
sh ../use-version.sh s09-loose-state
```

`states.ts`:
```ts
import type { Course } from './types'

export type State = {
  status: 'loading' | 'error' | 'success'
  message?: string
  courses?: Course[]
}
```

`CoursesView.tsx`:
```tsx
import { List } from './List'
import type { State } from './states'

export function CoursesView({ state }: { state: State }) {
  if (state.status === 'loading') {
    return <p className="muted">Loading courses...</p>
  }
  if (state.status === 'error') {
    return <p className="err">{state.message}</p>
  }
  return <List items={state.courses} renderItem={c => c.title} />
}
```

```bash
npx tsc -b
src/CoursesView.tsx:11:16 - error TS2322: Type 'Course[] | undefined' is not assignable to type 'Course[]'.
  Type 'undefined' is not assignable to type 'Course[]'.

11   return <List items={state.courses} renderItem={c => c.title} />
                  ~~~~~

  src/List.tsx:4:3 - The expected type comes from property 'items' which is declared here on type 'IntrinsicAttributes & ListProps<Course>'
    4   items: T[]
        ~~~~~

Found 1 error in src/CoursesView.tsx:11
```

TypeScript is right: `courses` may be missing. And there is a worse problem. Nothing ties the optional fields to the status, so this impossible object is accepted:

```bash
sh ../use-version.sh s10-loose-impossible-object
```
`App.tsx`:
```tsx
import { courses } from './data'
import type { State } from './states'

const weird: State = {
  status: 'loading',
  message: 'boom',
  courses,
}

export default function App() {
  return <main className="one">{weird.status}</main>
}
```

```bash
npx tsc -b
```

No output: status `loading` with an error message and a list of courses is allowed.

### 7. The fix: a discriminated union

A union is "this shape, or that shape". Discriminated means every shape has the same property, here `status`, with a different exact word. Like a parcel tracking page: "in transit" has an arrival date, "delivered" has a signature.

```bash
sh ../use-version.sh s11-union
```

`states.ts`:
```ts
import type { Course } from './types'

export type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; courses: Course[] }
```

`CoursesView.tsx`:
```tsx
import { List } from './List'
import type { State } from './states'

export function CoursesView({ state }: { state: State }) {
  if (state.status === 'loading') {
    return <p className="muted">Loading courses...</p>
  }
  if (state.status === 'error') {
    return <p className="err">{state.message}</p>
  }
  return <List items={state.courses} renderItem={c => c.title} />
}
```

```bash
npx tsc -b
```

Checking the tag narrows the type: after `if (state.status === 'loading') return`, the rest is `error` or `success`. Using `message` in the loading branch is an error:

```bash
sh ../use-version.sh s12-union-wrong-field
```
`CoursesView.tsx` (changes marked with + and -):
```diff
@@ -5,3 +5,3 @@
   if (state.status === 'loading') {
-    return <p className="muted">Loading courses...</p>
+    return <p className="muted">{state.message}</p>
   }
```

```bash
npx tsc -b
src/CoursesView.tsx:6:40 - error TS2339: Property 'message' does not exist on type '{ status: "loading"; }'.

6     return <p className="muted">{state.message}</p>
                                         ~~~~~~~

Found 1 error in src/CoursesView.tsx:6
```

And the impossible object is refused now:

```bash
sh ../use-version.sh s13-union-impossible-object
```
```bash
npx tsc -b
src/App.tsx:6:3 - error TS2353: Object literal may only specify known properties, and 'message' does not exist in type '{ status: "loading"; }'.

6   message: 'boom',
    ~~~~~~~

Found 1 error in src/App.tsx:6
```

Run `npm run dev` on `s11-union` to see the page with three buttons that set the state by hand: loading shows the loading message, error shows the red message `Server is down`, success shows the list.

### 8. A switch reads better

```bash
sh ../use-version.sh s14-switch
```
`CoursesView.tsx`:
```tsx
import { List } from './List'
import type { State } from './states'

export function CoursesView({ state }: { state: State }) {
  switch (state.status) {
    case 'loading':
      return <p className="muted">Loading courses...</p>
    case 'error':
      return <p className="err">{state.message}</p>
    case 'success':
      return <List items={state.courses} renderItem={c => c.title} />
  }
}
```

```bash
npx tsc -b
```

### 9. A new state, and the exhaustive check

The requirement changes: a status can also be `idle` (nothing asked yet). Asha adds a fourth shape to `states.ts` but forgets the view.

```bash
sh ../use-version.sh s15-idle-forgotten
```
`states.ts` (changes marked with + and -):
```diff
@@ -3,2 +3,3 @@
 export type State =
+  | { status: 'idle' }
   | { status: 'loading' }
```

```bash
npx tsc -b
```

The checker is silent. A switch that misses a case simply returns nothing, and on the page the idle button gives an empty card. The safety net is an exhaustive check: a small function whose parameter is `never` (the type with no possible values), called from a `default` branch.

```bash
sh ../use-version.sh s16-assert-never
```

`assertNever.ts`:
```ts
export function assertNever(x: never): never {
  throw new Error('Unhandled state: ' + JSON.stringify(x))
}
```

`CoursesView.tsx`:
```tsx
import { assertNever } from './assertNever'
import { List } from './List'
import type { State } from './states'

export function CoursesView({ state }: { state: State }) {
  switch (state.status) {
    case 'loading':
      return <p className="muted">Loading courses...</p>
    case 'error':
      return <p className="err">{state.message}</p>
    case 'success':
      return <List items={state.courses} renderItem={c => c.title} />
    default:
      return assertNever(state)
  }
}
```

```bash
npx tsc -b
src/CoursesView.tsx:14:26 - error TS2345: Argument of type '{ status: "idle"; }' is not assignable to parameter of type 'never'.

14       return assertNever(state)
                            ~~~~~

Found 1 error in src/CoursesView.tsx:14
```

Inside `default`, TypeScript removes every case already handled. If a case is forgotten, `state` is not `never`, and the error names it: `{ status: "idle" }`. Add the idle case and the checker is clean again:

```bash
sh ../use-version.sh s17-idle-handled
```
`CoursesView.tsx` (changes marked with + and -):
```diff
@@ -6,2 +6,4 @@
   switch (state.status) {
+    case 'idle':
+      return <p className="muted">Press a button to start.</p>
     case 'loading':
```

```bash
npx tsc -b
```

This is the big win: add a state to the type, and TypeScript shows you every place that must handle it.

### 10. Both halves together: useFetch<T> and AsyncView<T>

The `AsyncState<T>` union is the same as before, only `success` carries `data: T`.

```bash
sh ../use-version.sh final
```

`states.ts`:
```ts
export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T }
```

`useFetch.ts`:
```ts
import { useEffect, useState } from 'react'
import type { AsyncState } from './states'

export function useFetch<T>(url: string): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    status: 'loading',
  })

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      setState({ status: 'loading' })
      try {
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error(`Server answered ${res.status}`)
        const data: T = await res.json()
        setState({ status: 'success', data })
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }
        const message =
          err instanceof Error ? err.message : 'Unknown error'
        setState({ status: 'error', message })
      }
    }
    load()
    return () => controller.abort()
  }, [url])

  return state
}
```

Note `const data: T = await res.json()`: `json()` gives back `any`, so you are making a promise TypeScript cannot check. Lesson 4 fixes this with Zod.

`AsyncView.tsx`:
```tsx
import type { ReactNode } from 'react'
import type { AsyncState } from './states'

interface AsyncViewProps<T> {
  state: AsyncState<T>
  children: (data: T) => ReactNode
}

export function AsyncView<T>({
  state,
  children,
}: AsyncViewProps<T>) {
  switch (state.status) {
    case 'loading':
      return <p className="muted">Loading...</p>
    case 'error':
      return <p className="err">{state.message}</p>
    case 'success':
      return <>{children(state.data)}</>
  }
}
```

`App.tsx`:
```tsx
import { AsyncView } from './AsyncView'
import { List } from './List'
import { useFetch } from './useFetch'
import type { Course, Lesson } from './types'

export default function App() {
  const courses = useFetch<Course[]>('/api/courses')
  const lessons = useFetch<Lesson[]>('/api/lessons')
  return (
    <main>
      <section>
        <h2>Courses</h2>
        <AsyncView state={courses}>
          {items => (
            <List
              items={items}
              renderItem={c => (
                <>
                  {c.title} <small>{c.teacher}</small>
                </>
              )}
            />
          )}
        </AsyncView>
      </section>
      <section>
        <h2>Lessons</h2>
        <AsyncView state={lessons}>
          {items => (
            <List
              items={items}
              renderItem={l => (
                <>
                  {l.title} <small>{l.minutes} min</small>
                </>
              )}
            />
          )}
        </AsyncView>
      </section>
    </main>
  )
}
```

```bash
npx tsc -b
```

```bash
npm run build
> web@0.0.0 build
> tsc -b && vite build

vite v8.3.5 building client environment for production...
transforming...
✓ 19 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.45 kB │ gzip:  0.29 kB
dist/assets/index-BlJwa5wN.css    1.08 kB │ gzip:  0.50 kB
dist/assets/index-Z8C6YmN0.js   220.95 kB │ gzip: 69.06 kB

✓ built in 370ms
```

(The file hashes can differ on your machine.)

### 11. Run the real page against the local API

In one terminal start the stand-in API (port 8193), in another start Vite (its proxy sends `/api` to port 8193):

```bash
node ../api/server.mjs
```
```bash
npm run dev
```

Open the address Vite prints (http://localhost:5173). Both cards start with `Loading...`. The lessons arrive first (about 0.7 seconds), and a moment later the courses (about 1.2 seconds).

Now make the server fail, and reload the page. Both cards show `Server answered 500`. No new code was needed:

```bash
curl "http://localhost:8193/api/_control?mode=fail"
```
```bash
{"mode":"fail","listDelay":1200}
```

Only the lessons failing:

```bash
curl "http://localhost:8193/api/_control?mode=faillessons"
```
```bash
{"mode":"faillessons","listDelay":1200}
```

The courses card stays fine and only the lessons card shows the error: each `useFetch` call has its own state. Back to normal:

```bash
curl "http://localhost:8193/api/_control?mode=ok"
```
```bash
{"mode":"ok","listDelay":1200}
```

### 12. Two mistakes you will meet

One: writing the generic list as an arrow function in a `.tsx` file. A `<T>` followed by a bracket looks like a JSX tag:

```bash
sh ../use-version.sh s18-arrow-generic
```
`List.tsx`:
```tsx
import type { ReactNode } from 'react'

interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => ReactNode
}

export const List = <T>({
  items,
  renderItem,
}: ListProps<T>) => (
  <ul>
    {items.map((item, i) => (
      <li key={i}>{renderItem(item)}</li>
    ))}
  </ul>
)
```

```bash
npx tsc -b
src/List.tsx:8:22 - error TS17008: JSX element 'T' has no corresponding closing tag.

8 export const List = <T>({
                       ~

src/List.tsx:11:1 - error TS1109: Expression expected.

11 }: ListProps<T>) => (
   ~

src/List.tsx:11:14 - error TS17008: JSX element 'T' has no corresponding closing tag.

11 }: ListProps<T>) => (
                ~

src/List.tsx:11:19 - error TS1382: Unexpected token. Did you mean `{'>'}` or `&gt;`?

11 }: ListProps<T>) => (
                     ~

src/List.tsx:18:1 - error TS1005: '</' expected.

18 
   ~

Found 5 errors in the same file, starting at: src/List.tsx:8
```

Fixes: write it as a function (as in this lesson), or add a comma (`<T,>`), or give `T` a constraint (`<T extends { id: number }>`):

```bash
sh ../use-version.sh s19-arrow-fixed
```
`List.tsx` (changes marked with + and -):
```diff
@@ -7,3 +7,3 @@
 
-export const List = <T>({
+export const List = <T extends { id: number }>({
   items,
@@ -12,4 +12,4 @@
   <ul>
-    {items.map((item, i) => (
-      <li key={i}>{renderItem(item)}</li>
+    {items.map(item => (
+      <li key={item.id}>{renderItem(item)}</li>
     ))}
```

```bash
npx tsc -b
```

Two: forgetting the angle brackets on `useState`. TypeScript guesses the type from the first value, so `status` is just a `string`, and setting `courses` fails:

```bash
sh ../use-version.sh s20-usestate-no-generic
```
`App.tsx`:
```tsx
import { useState } from 'react'
import { courses } from './data'

export default function App() {
  const [state, setState] = useState({ status: 'loading' })
  const loaded = () => setState({ status: 'success', courses })
  return (
    <main className="one">
      <button onClick={loaded}>success</button>
      <p>{state.status}</p>
    </main>
  )
}
```

```bash
npx tsc -b
src/App.tsx:6:54 - error TS2353: Object literal may only specify known properties, and 'courses' does not exist in type 'SetStateAction<{ status: string; }>'.

6   const loaded = () => setState({ status: 'success', courses })
                                                       ~~~~~~~

Found 1 error in src/App.tsx:6
```

The cure: `useState<State>(...)`. TypeScript only infers from the first value, and the first value cannot show the other shapes.

## Common mistakes

- Using `any` to share a component. The checker goes quiet and the typo reaches the page.
- Using `item.id` inside a generic without a constraint (`T extends { id: number }`).
- Optional fields (`message?`, `courses?`) to model loading, error and success. Use a discriminated union with one tag word.
- A `switch` without a `default` that calls `assertNever`. A forgotten state then shows a blank screen.
- A generic arrow function `<T>(...) =>` in a `.tsx` file. Use a `function`, or `<T,>`, or a constraint.
- `useState` with an initial value that shows only one shape. Say the type: `useState<State>(...)`.

## Clean up

Stop the API and the dev server with Ctrl+C. Run `curl "http://localhost:8193/api/_control?mode=ok"` if you stopped in a failed mode (restarting the API also resets it). Delete `web/node_modules` and `web/dist` if you want, and run `sh ../use-version.sh final` so `src/` holds the finished app.

## Key ideas (recap)

1. A generic is a blank for a type: `List<T>`. One list works for courses and lessons, and every use is checked. A constraint (`T extends { id: number }`) says what the blank must have.
2. A discriminated union gives every state its own shape and a tag word, so impossible states cannot be written. Checking the tag narrows the type.
3. An exhaustive check (`default` with `never`) turns a forgotten case into an error. `AsyncState<T>` and `AsyncView<T>` give you typed loading, error and success screens for any data.

Interview question (Rahul): how do you model loading and error states in TypeScript? A good answer: a discriminated union with a tag field like `status`, so each state carries only its own data, narrow it with `switch`, and add an exhaustive `default` with `never` so new states cannot be forgotten.

## Try it yourself

Add a fifth state `empty` (no fields) to `states.ts`. Run `npx tsc -b`, see every place that complains, then handle it. (Answer below.)

Answer: add `| { status: 'empty' }` to `AsyncState<T>`. The checker is silent, because the `switch` in `AsyncView.tsx` has no `default` branch (the same silent problem as step 9). Add the safety net from step 9: `import { assertNever } from './assertNever'` (copy `assertNever.ts` from `versions/s16-assert-never/`) and a `default: return assertNever(state)`. Now `npx tsc -b` reports `Argument of type '{ status: "empty"; }' is not assignable to parameter of type 'never'`. Add `case 'empty': return <p className="muted">No data yet.</p>` and it is clean again.

## Next

Module 9, Lesson 4: [Typing API Data with Zod](../m09-l04-typing-api-data-with-zod/README.md).
