# M09-L02 · Typing Props, State and Events

> Video: Module 9, Lesson 2. Watch it first, then follow along here.

## What you'll learn

- Type the props of a component with an `interface`: required, optional (`?`), exact words (a union), `children` and callbacks
- Read the three most common prop errors: wrong type, missing prop, typo in a prop name
- Type state with `useState`: when inference is enough and when you write `useState<number[]>([])` or `useState<string | null>(null)`
- Type events (`ChangeEvent`, `FormEvent`, `MouseEvent`) and refs (`useRef<HTMLInputElement>(null)`)
- Run `npx tsc -b` after every change and read the real error

## Before you start

- Node 24. Check with `node --version`.
- No Docker needed. Best after M09-L01 in the folder `../m09-l01-typescript-in-one-video/` (the labels and the checker).
- This lesson works in the `web/` project, a Vite + React + TypeScript app with the allcsvideos course cards.

## Files in this folder

| File | What it is |
|------|------------|
| `web/` | The finished project (Vite 8.3.5, React 19.3.1, TypeScript 7.0.2) |
| `web/src/App.tsx` | Search box, coupon form, enrolled counter, the course grid |
| `web/src/CourseCard.tsx` | The card, with a typed props interface |
| `web/src/Panel.tsx` | A wrapper that takes `children` |
| `web/src/types.ts`, `web/src/courses.ts` | The `Course` interface and four sample courses |
| `versions/` | One folder per experiment in the video (see the table in step 1) |
| `use-version.sh` | Copies a version into `web/src` so you can run the checker on it |

The video swaps files in and out of the project to show each error. `use-version.sh` does the same swap for you: it removes the code files in `src/` and copies in the files of one version folder (the two CSS files stay). Every version folder holds a complete set of code files, so each one is a working starting point.

## Follow along

Open a terminal in `web/`.

```bash
cd web
npm install
```

### 1. The plain JavaScript card and its silent bug

Asha wrote a course card in plain JavaScript. The price comes from a form, so it arrives as text: `"499"`.

```bash
sh ../use-version.sh v0-js
npm run dev
```

`versions/v0-js/CourseCard.jsx`:
```
export default function CourseCard({
  title,
  price,
}) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>Price with fee: Rs {price + 50}</p>
    </div>
  )
}
```

`versions/v0-js/App.jsx`:
```
import CourseCard from './CourseCard'

export default function App() {
  return (
    <main className="page">
      <CourseCard
        title="React for Beginners"
        price="499"
      />
    </main>
  )
}
```

The page shows `Price with fee: Rs 49950`. With text, the plus sign does not add; it sticks the two pieces together, so `"499" + 50` becomes `"49950"`. No error, no red text. Plain JavaScript finds out only when a line runs, and this line ran fine.

### 2. A printed form: the props interface

An `interface` is the printed form. The function says which form it takes, after the curly braces of the props: a colon and the interface name.

```bash
sh ../use-version.sh v1-bad
```

`CourseCard.tsx`:
```tsx
interface CourseCardProps {
  title: string
  price: number
}

export default function CourseCard({
  title,
  price,
}: CourseCardProps) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>Price with fee: Rs {price + 50}</p>
    </div>
  )
}
```

`App.tsx` still passes `price="499"`:

`App.tsx`:
```tsx
import CourseCard from './CourseCard'

export default function App() {
  return (
    <main className="page">
      <CourseCard
        title="React for Beginners"
        price="499"
      />
    </main>
  )
}
```

```bash
npx tsc -b
src/App.tsx:8:9 - error TS2322: Type 'string' is not assignable to type 'number'.

8         price="499"
          ~~~~~

  src/CourseCard.tsx:3:3 - The expected type comes from property 'price' which is declared here on type 'IntrinsicAttributes & CourseCardProps'
    3   price: number
        ~~~~~

Found 1 error in src/App.tsx:8
```

Read it in three parts: the place (`App.tsx`, line 8, column 9), then the code line with a squiggle under exactly the wrong word, then the sentence. The page still shows the wrong number, because Vite only removes the types and runs the rest. Checking is the job of `tsc`.

The fix is to match the label, `price={499}` (a number, no quotes):

```bash
sh ../use-version.sh v1-ok
```
`App.tsx` (changes marked with + and -):
```diff
@@ -7,3 +7,3 @@
         title="React for Beginners"
-        price="499"
+        price={499}
       />
```

```bash
npx tsc -b
```

No output means no mistakes. Two more mistakes you will make this week: forget a prop, and make a typo in a prop name.

```bash
sh ../use-version.sh v1-missing
```
`App.tsx` (changes marked with + and -):
```diff
@@ -7,3 +7,2 @@
         title="React for Beginners"
-        price={499}
       />
```

```bash
npx tsc -b
src/App.tsx:6:8 - error TS2741: Property 'price' is missing in type '{ title: string; }' but required in type 'CourseCardProps'.

6       <CourseCard
         ~~~~~~~~~~

  src/CourseCard.tsx:3:3 - 'price' is declared here.
    3   price: number
        ~~~~~

Found 1 error in src/App.tsx:6
```

```bash
sh ../use-version.sh v1-typo
```
`App.tsx` (changes marked with + and -):
```diff
@@ -7,3 +7,3 @@
         title="React for Beginners"
-        price={499}
+        prise={499}
       />
```

```bash
npx tsc -b
src/App.tsx:8:9 - error TS2322: Type '{ title: string; prise: number; }' is not assignable to type 'IntrinsicAttributes & CourseCardProps'.
  Property 'prise' does not exist on type 'IntrinsicAttributes & CourseCardProps'. Did you mean 'price'?

8         prise={499}
          ~~~~~

Found 1 error in src/App.tsx:8
```

TypeScript even suggests the fix: `Did you mean 'price'?`

### 3. The real card: course, level, badge, callback

Back to the full project:

```bash
sh ../use-version.sh final
```

`types.ts`:
```ts
export interface Course {
  id: number
  title: string
  teacher: string
  lessons: number
  price: number
  free: boolean
}
```

`CourseCard.tsx`:
```tsx
import type { Course } from './types'

interface CourseCardProps {
  course: Course
  level: 'beginner' | 'advanced'
  badge?: string
  onEnroll: (id: number) => void
}

export default function CourseCard({
  course,
  level,
  badge,
  onEnroll,
}: CourseCardProps) {
  return (
    <div className="card">
      <h3>{course.title}</h3>
      {badge && <span className="badge">{badge}</span>}
      <p>{course.lessons} lessons, Rs {course.price}</p>
      <span className="level">{level}</span>
      <button onClick={() => onEnroll(course.id)}>
        Enroll
      </button>
    </div>
  )
}
```

What each box says:

- `course: Course` takes the whole course object (an interface too).
- `level: 'beginner' | 'advanced'` is a union of two exact words, not just any string.
- `badge?: string` has a question mark: optional.
- `onEnroll: (id: number) => void` is a function type: the parameters in brackets, an arrow, and what it gives back.

Try to cheat on the level:

```bash
sh ../use-version.sh p-level
```
`App.tsx` (changes marked with + and -):
```diff
@@ -64,3 +64,3 @@
               course={c}
-              level={c.lessons > 15 ? 'advanced' : 'beginner'}
+              level="expert"
               badge={c.free ? 'Free' : undefined}
```

```bash
npx tsc -b
src/App.tsx:65:15 - error TS2322: Type '"expert"' is not assignable to type '"advanced" | "beginner"'.

65               level="expert"
                 ~~~~~

  src/CourseCard.tsx:5:3 - The expected type comes from property 'level' which is declared here on type 'IntrinsicAttributes & CourseCardProps'
    5   level: 'beginner' | 'advanced'
        ~~~~~

Found 1 error in src/App.tsx:65
```

TypeScript lists the allowed words. A capital letter slip is caught the same way.

An optional prop may be `undefined`, so calling a method on it without a check is an error:

```bash
sh ../use-version.sh p-optional
```
`CourseCard.tsx` (changes marked with + and -):
```diff
@@ -18,3 +18,3 @@
       <h3>{course.title}</h3>
-      {badge && <span className="badge">{badge}</span>}
+      <span className="badge">{badge.toUpperCase()}</span>
       <p>{course.lessons} lessons, Rs {course.price}</p>
```

```bash
npx tsc -b
src/CourseCard.tsx:19:32 - error TS18048: 'badge' is possibly 'undefined'.

19       <span className="badge">{badge.toUpperCase()}</span>
                                  ~~~~~

Found 1 error in src/CourseCard.tsx:19
```

The fix is the `&&` from module 5, lesson 1 (it is already in `final`): `{badge && <span className="badge">{badge}</span>}`. Inside the span, TypeScript knows `badge` is a string.

### 4. children and callbacks

`Panel` wraps whatever sits between its tags, so `children` is a prop and needs a type. The type for anything React can draw is `ReactNode` (from the `@types/react` package):

`Panel.tsx`:
```tsx
import type { ReactNode } from 'react'

interface PanelProps {
  title: string
  children: ReactNode
}

export default function Panel({
  title,
  children,
}: PanelProps) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  )
}
```

Forget the `children` line and the checker complains:

```bash
sh ../use-version.sh p-children
```
`Panel.tsx` (changes marked with + and -):
```diff
@@ -1,6 +1,3 @@
-import type { ReactNode } from 'react'
-
 interface PanelProps {
   title: string
-  children: ReactNode
 }
```

```bash
npx tsc -b
src/App.tsx:59:8 - error TS2322: Type '{ title: string; children: Element; }' is not assignable to type 'IntrinsicAttributes & PanelProps'.
  Property 'children' does not exist on type 'IntrinsicAttributes & PanelProps'.

59       <Panel title="Courses">
          ~~~~~

src/Panel.tsx:7:3 - error TS2339: Property 'children' does not exist on type 'PanelProps'.

7   children,
    ~~~~~~~~

Found 2 errors in 2 files.

Errors  Files
     1  src/App.tsx:59
     1  src/Panel.tsx:7
```

A callback must match its type. If `App` hands over a function that expects text where the card promises a number:

```bash
sh ../use-version.sh p-cb
```
`App.tsx` (changes marked with + and -):
```diff
@@ -17,4 +17,4 @@
 
-  function handleEnroll(id: number) {
-    setEnrolled([...enrolled, id])
+  function handleEnroll(id: string) {
+    setEnrolled([...enrolled, Number(id)])
   }
```

```bash
npx tsc -b
src/App.tsx:67:15 - error TS2322: Type '(id: string) => void' is not assignable to type '(id: number) => void'.
  Types of parameters 'id' and 'id' are incompatible.
    Type 'number' is not assignable to type 'string'.

67               onEnroll={handleEnroll}
                 ~~~~~~~~

  src/CourseCard.tsx:7:3 - The expected type comes from property 'onEnroll' which is declared here on type 'IntrinsicAttributes & CourseCardProps'
    7   onEnroll: (id: number) => void
        ~~~~~~~~

Found 1 error in src/App.tsx:67
```

And in the other direction, the card forgets to pass the id:

```bash
sh ../use-version.sh p-cb2
```
`CourseCard.tsx` (changes marked with + and -):
```diff
@@ -21,3 +21,3 @@
       <span className="level">{level}</span>
-      <button onClick={() => onEnroll(course.id)}>
+      <button onClick={() => onEnroll()}>
         Enroll
```

```bash
npx tsc -b
src/CourseCard.tsx:22:30 - error TS2554: Expected 1 arguments, but got 0.

22       <button onClick={() => onEnroll()}>
                                ~~~~~~~~

  src/CourseCard.tsx:7:14 - An argument for 'id' was not provided.
    7   onEnroll: (id: number) => void
                   ~~~~~~~~~~

Found 1 error in src/CourseCard.tsx:22
```

Four things to remember about props: one interface per component, a question mark for optional, `children` is `ReactNode`, and a callback is a function type (parameters, arrow, result).

### 5. Typing state

Every sticky note has a type. Most of the time you write nothing: `useState('')` infers a string.

```bash
sh ../use-version.sh s-num
```
Prove it: someone sets the search text to its length, a number.

`App.tsx` (changes marked with + and -):
```diff
@@ -14,3 +14,3 @@
   function handleSearch(e: ChangeEvent<HTMLInputElement>) {
-    setQuery(e.target.value)
+    setQuery(e.target.value.length)
   }
```

```bash
npx tsc -b
src/App.tsx:15:14 - error TS2345: Argument of type 'number' is not assignable to parameter of type 'SetStateAction<string>'.

15     setQuery(e.target.value.length)
                ~~~~~~~~~~~~~~~~~~~~~

Found 1 error in src/App.tsx:15
```

Inference has one blind spot: a state that starts empty. `useState([])` is a list of `never`, so nothing can go in:

```bash
sh ../use-version.sh s-never
```
`App.tsx` (changes marked with + and -):
```diff
@@ -7,3 +7,3 @@
 export default function App() {
-  const [enrolled, setEnrolled] = useState<number[]>([])
+  const [enrolled, setEnrolled] = useState([])
   const [query, setQuery] = useState('')
```

```bash
npx tsc -b
src/App.tsx:19:18 - error TS2322: Type 'number' is not assignable to type 'never'.

19     setEnrolled([...enrolled, id])
                    ~~~~~~~~~~~

src/App.tsx:19:31 - error TS2322: Type 'number' is not assignable to type 'never'.

19     setEnrolled([...enrolled, id])
                                 ~~

Found 2 errors in the same file, starting at: src/App.tsx:19
```

The fix is to say the other half of the story in angle brackets: `useState<number[]>([])`.

Same with `null`. A message that starts as `null` can only ever hold `null`:

```bash
sh ../use-version.sh s-null
```
`App.tsx` (changes marked with + and -):
```diff
@@ -10,3 +10,3 @@
   const [coupon, setCoupon] = useState('')
-  const [message, setMessage] = useState<string | null>(null)
+  const [message, setMessage] = useState(null)
   const couponRef = useRef<HTMLInputElement>(null)
```

```bash
npx tsc -b
src/App.tsx:25:18 - error TS2345: Argument of type '"Type a code first"' is not assignable to parameter of type 'SetStateAction<null>'.

25       setMessage('Type a code first')
                    ~~~~~~~~~~~~~~~~~~~

src/App.tsx:29:16 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'SetStateAction<null>'.

29     setMessage(`Code ${coupon} applied`)
                  ~~~~~~~~~~~~~~~~~~~~~~~~

Found 2 errors in the same file, starting at: src/App.tsx:25
```

The fix is `useState<string | null>(null)`. A type that includes `null` has one more rule: reading it needs a check.

```bash
sh ../use-version.sh s-nullread
```
`App.tsx` (changes marked with + and -):
```diff
@@ -57,3 +57,3 @@
       </div>
-      {message && <p className="msg">{message}</p>}
+      <p className="msg">{message.toUpperCase()}</p>
       <Panel title="Courses">
```

```bash
npx tsc -b
src/App.tsx:58:27 - error TS18047: 'message' is possibly 'null'.

58       <p className="msg">{message.toUpperCase()}</p>
                             ~~~~~~~

Found 1 error in src/App.tsx:58
```

### 6. Typing events

An event is a parcel the browser hands to your function. When you write the function right inside the tag, TypeScript reads the parcel type for you (the coupon box: `onChange={(e) => setCoupon(e.target.value)}`). It really knows. Pass the whole parcel instead of its text:

```bash
sh ../use-version.sh e-trick
```
`App.tsx` (changes marked with + and -):
```diff
@@ -51,3 +51,3 @@
             value={coupon}
-            onChange={(e) => setCoupon(e.target.value)}
+            onChange={(e) => setCoupon(e)}
             placeholder="Coupon code"
```

```bash
npx tsc -b
src/App.tsx:52:40 - error TS2345: Argument of type 'ChangeEvent<HTMLInputElement, HTMLInputElement>' is not assignable to parameter of type 'SetStateAction<string>'.

52             onChange={(e) => setCoupon(e)}
                                          ~

Found 1 error in src/App.tsx:52
```

Move the function out, into a name of its own (`handleSearch`), and TypeScript no longer knows who will call it:

```bash
sh ../use-version.sh e-noany
```
`App.tsx` (changes marked with + and -):
```diff
@@ -1,3 +1,3 @@
 import { useRef, useState } from 'react'
-import type { ChangeEvent, FormEvent } from 'react'
+import type { FormEvent } from 'react'
 import CourseCard from './CourseCard'
@@ -13,3 +13,3 @@
 
-  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
+  function handleSearch(e) {
     setQuery(e.target.value)
```

```bash
npx tsc -b
src/App.tsx:14:25 - error TS7006: Parameter 'e' implicitly has an 'any' type.

14   function handleSearch(e) {
                           ~

Found 1 error in src/App.tsx:14
```

So you write the label yourself: `e: ChangeEvent<HTMLInputElement>` (see `final`). Now `e.target` is an input and `e.target.value` is text.

Why the element? A parcel from another box is another kind of parcel. A `<select>` using the same handler:

```bash
sh ../use-version.sh e-select
```
`App.tsx` (changes marked with + and -):
```diff
@@ -57,2 +57,5 @@
       </div>
+      <select onChange={handleSearch}>
+        <option>All</option>
+      </select>
       {message && <p className="msg">{message}</p>}
```

```bash
npx tsc -b
src/App.tsx:58:15 - error TS2322: Type '(e: ChangeEvent<HTMLInputElement, Element>) => void' is not assignable to type 'ChangeEventHandler<HTMLSelectElement, HTMLSelectElement>'.
  Types of parameters 'e' and 'event' are incompatible.
    Type 'ChangeEvent<HTMLSelectElement, HTMLSelectElement>' is not assignable to type 'ChangeEvent<HTMLInputElement, Element>'.
      Type 'HTMLSelectElement' is missing the following properties from type 'HTMLInputElement': accept, align, alt, capture, and 38 more.

58       <select onChange={handleSearch}>
                 ~~~~~~~~

  node_modules/@types/react/index.d.ts:3578:9 - The expected type comes from property 'onChange' which is declared here on type 'DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>'
    3578         onChange?: ChangeEventHandler<T, HTMLSelectElement> | undefined;
                 ~~~~~~~~

Found 1 error in src/App.tsx:58
```

A form has its own parcel, `FormEvent<HTMLFormElement>` (used by `handleCoupon`), and a button click is `MouseEvent<HTMLButtonElement>`. This version adds a Clear button and checks cleanly:

```bash
sh ../use-version.sh e-click
```
`App.tsx` (changes marked with + and -):
```diff
@@ -1,3 +1,3 @@
 import { useRef, useState } from 'react'
-import type { ChangeEvent, FormEvent } from 'react'
+import type { ChangeEvent, FormEvent, MouseEvent } from 'react'
 import CourseCard from './CourseCard'
@@ -17,2 +17,7 @@
 
+  function handleClear(e: MouseEvent<HTMLButtonElement>) {
+    e.preventDefault()
+    setQuery('')
+  }
+
   function handleEnroll(id: number) {
@@ -47,2 +52,3 @@
         />
+        <button onClick={handleClear}>Clear</button>
         <form onSubmit={handleCoupon}>
```

```bash
npx tsc -b
```

Three parcels to remember: typing in a box is `ChangeEvent<HTMLInputElement>`, submitting a form is `FormEvent<HTMLFormElement>`, clicking a button is `MouseEvent<HTMLButtonElement>`.

### 7. Typing refs

A ref points at a real element. Before the page is drawn it points at nothing, so you start with `null` and give the element type: `useRef<HTMLInputElement>(null)`. The box inside is `HTMLInputElement | null`. Calling `.focus()` directly is an error:

```bash
sh ../use-version.sh r-null
```
`App.tsx` (changes marked with + and -):
```diff
@@ -25,3 +25,3 @@
       setMessage('Type a code first')
-      couponRef.current?.focus()
+      couponRef.current.focus()
       return
```

```bash
npx tsc -b
src/App.tsx:26:7 - error TS18047: 'couponRef.current' is possibly 'null'.

26       couponRef.current.focus()
         ~~~~~~~~~~~~~~~~~

Found 1 error in src/App.tsx:26
```

The fix is `?.` from module 2, lesson 6: `couponRef.current?.focus()` (already in `final`). One more mistake: the wrong element. The ref was made for a `div` but hangs on an `input`:

```bash
sh ../use-version.sh r-wrong
```
`App.tsx` (changes marked with + and -):
```diff
@@ -11,3 +11,3 @@
   const [message, setMessage] = useState<string | null>(null)
-  const couponRef = useRef<HTMLInputElement>(null)
+  const couponRef = useRef<HTMLDivElement>(null)
 
```

```bash
npx tsc -b
src/App.tsx:50:13 - error TS2322: Type 'RefObject<HTMLDivElement | null>' is not assignable to type 'Ref<HTMLInputElement> | undefined'.
  Type 'RefObject<HTMLDivElement | null>' is not assignable to type 'RefObject<HTMLInputElement | null>'.
    Type 'HTMLDivElement | null' is not assignable to type 'HTMLInputElement | null'.
      Type 'HTMLDivElement' is missing the following properties from type 'HTMLInputElement': accept, alt, autocomplete, capture, and 54 more.

50             ref={couponRef}
               ~~~

  node_modules/@types/react/index.d.ts:301:9 - The expected type comes from property 'ref' which is declared here on type 'DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>'
    301         ref?: Ref<T> | undefined;
                ~~~

Found 1 error in src/App.tsx:50
```

### 8. The whole page, typed

```bash
sh ../use-version.sh final
```

`App.tsx`:
```tsx
import { useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import CourseCard from './CourseCard'
import Panel from './Panel'
import courses from './courses'

export default function App() {
  const [enrolled, setEnrolled] = useState<number[]>([])
  const [query, setQuery] = useState('')
  const [coupon, setCoupon] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const couponRef = useRef<HTMLInputElement>(null)

  function handleSearch(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
  }

  function handleEnroll(id: number) {
    setEnrolled([...enrolled, id])
  }

  function handleCoupon(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (coupon === '') {
      setMessage('Type a code first')
      couponRef.current?.focus()
      return
    }
    setMessage(`Code ${coupon} applied`)
  }

  const shown = courses.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <main className="page">
      <header>
        <b className="logo">allcsvideos</b>
        <span>Enrolled: {enrolled.length}</span>
      </header>
      <div className="tools">
        <input
          value={query}
          onChange={handleSearch}
          placeholder="Search courses"
        />
        <form onSubmit={handleCoupon}>
          <input
            ref={couponRef}
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Coupon code"
          />
          <button>Apply</button>
        </form>
      </div>
      {message && <p className="msg">{message}</p>}
      <Panel title="Courses">
        <div className="grid">
          {shown.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              level={c.lessons > 15 ? 'advanced' : 'beginner'}
              badge={c.free ? 'Free' : undefined}
              onEnroll={handleEnroll}
            />
          ))}
        </div>
      </Panel>
    </main>
  )
}
```

```bash
npx tsc -b
```

The build starts with `tsc` and then builds the app:

```bash
npm run build
> web@0.0.0 build
> tsc -b && vite build

vite v8.3.5 building client environment for production...
transforming...
✓ 20 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.46 kB │ gzip:  0.29 kB
dist/assets/index-Dy5prGEb.css    1.91 kB │ gzip:  0.71 kB
dist/assets/index-a1gPiucV.js   221.40 kB │ gzip: 69.30 kB

✓ built in 376ms
```

(The file hashes in the file names can differ on your machine.)

Run `npm run dev` and open the address Vite prints (http://localhost:5173). Type `react` in the search box: one card is left. Clear the box and click Enroll on two courses: `Enrolled: 2`. Click Apply with an empty coupon box: the message `Type a code first` appears and the cursor jumps into the box. Type `SAVE20` and press Apply: `Code SAVE20 applied`.

The page behaves exactly like the plain JavaScript version would. Remember type erasure from lesson 1: the browser only gets plain JavaScript.

## Common mistakes

- Passing text where a number is expected (`price="499"`). Use `price={499}`.
- Forgetting a required prop, or misspelling one (`prise`).
- `useState([])` or `useState(null)` and then wondering why nothing fits. Say the type: `useState<number[]>([])`, `useState<string | null>(null)`.
- A handler outside the tag with no parameter type. Write `ChangeEvent<HTMLInputElement>`.
- Calling `ref.current.focus()` without `?.` because the ref can be `null`.
- Using one handler for a `<select>` and an `<input>`: the two parcels are different types.
- Believing the page working means the code is right. Vite does not check types; run `npx tsc -b`.

## Clean up

Stop the dev server with Ctrl+C. Delete `web/node_modules` and `web/dist` if you want the folder small again. Run `sh ../use-version.sh final` so `src/` holds the finished app.

## Key ideas (recap)

1. Props: an interface is the printed form. `?` makes a box optional, a union allows only exact words, `children` is `ReactNode`, a callback is a function type.
2. State: let inference work when the starting value tells the whole story. When it starts empty or `null`, say the type in angle brackets.
3. Events and refs: once the function lives outside the tag, give the parcel a type. A ref is the element type or `null`, so use `?.`.

Interview question (Rahul): how do you type a React component? A good answer: an interface for the props, with `?` for optional ones, `children` as `ReactNode`, callbacks as function types, and generics for state that starts empty, like `useState<number[]>([])`.

## Try it yourself

Add an optional prop `rating` (a number) to the course card and show it only when it exists. Then pass the rating as text and read the error. (Answer below.)

Answer: add `rating?: number` to `CourseCardProps` and `{rating !== undefined && <span>{rating} stars</span>}` in the card. In `App.tsx` writing `rating="4.5"` gives `Type 'string' is not assignable to type 'number'`.

## Next

Module 9, Lesson 3: [Generic Components and UI States](../m09-l03-generic-components-and-ui-states/README.md).
