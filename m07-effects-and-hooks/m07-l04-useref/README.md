# M07-L04 · useRef

> Video: Module 7, Lesson 4. Watch it first, then follow along here.

## What you'll learn

- What a ref is: a box React keeps between draws, which does not redraw the component when you change it
- The difference between `useRef` and `useState` (the whiteboard in the shop window and the drawer under the counter)
- Put a ref on an element with the `ref` attribute, and call `focus()` and `scrollIntoView()`
- Read an uncontrolled input with a ref, and keep a timer id in a ref
- The two rules: never read or write a ref in the body, and use state when the screen must change
- In React 19 `ref` is a normal prop (no `forwardRef` needed)

## Before you start

- Node 24 (`node --version`).
- Best after [M07-L03](../m07-l03-you-might-not-need-an-effect/) and M05-L03 (controlled and uncontrolled inputs).
- No Docker needed.

## Files in this folder

`src/App.jsx` starts as `versions/v0-nofocus/App.jsx`. Copy any other version's `App.jsx` over `src/App.jsx`; `versions/index.css` is the shared style (already in `src/index.css`).

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | React 19.3.1, Vite 8.3.5 |
| `src/App.jsx`, `src/index.css`, `src/main.jsx`, `src/data/courses.js` | The app |
| `versions/v0-nofocus`, `v1-focus` | A search box with Clear, then Clear that puts the cursor back |
| `versions/v2-count` | A ref counter next to a state counter |
| `versions/v3-scroll` | Scroll a long list to the current lesson |
| `versions/v4-form` | Read an uncontrolled input with a ref |
| `versions/v5-stopvar`, `v6-stopref` | A stopwatch with a plain variable (broken), then a ref |
| `versions/v7-render` | Counting draws in a ref in the body (do not do this) |
| `versions/v8-prop`, `v8b-forward`, `v8c-noref` | `ref` as a prop (React 19), the old `forwardRef`, and a missing ref |
| `versions/v9-noattr` | Forgot the `ref` attribute |
| `versions/v10-body` | Focusing in the body |

## Follow along

### 1. Set up

```bash
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`). Switch with `cp versions/<name>/App.jsx src/App.jsx`.

### 2. The problem (`v0-nofocus`)

A search box and a Clear button. Type `py`, press Clear: the box is empty again, but the cursor is not in it. We want the cursor back, and React state cannot do that: focusing a box is something you do to the element on the page.

### 3. A ref versus state (`v2-count`)

A shop has a whiteboard in the window: whenever the owner writes on it, everyone on the street sees (that is state). It also has a drawer under the counter, where things are kept but nobody outside sees changes (that is a ref). A ref is an object with one key, `current`.

`versions/v2-count/App.jsx`:
```jsx
const clicks = useRef(0)
const [count, setCount] = useState(0)
console.log('drawing')

function addRef() {
  clicks.current += 1
  console.log('ref is', clicks.current)
}

return (
  <div className="page">
    <p className="out">Ref: {clicks.current}</p>
    <button onClick={addRef}>Add to ref</button>
    <p className="out">State: {count}</p>
    <button onClick={() => setCount(count + 1)}>
      Add to state
    </button>
  </div>
)
```

Click Add to ref three times: the screen still says `Ref: 0` and no new draw happens. Click Add to state once: the screen jumps to `Ref: 3` and `State: 1`, because now the component is drawn again and reads the box. The real console:

```text
drawing
drawing
ref is 1
ref is 2
ref is 3
drawing
drawing
```

(Each `drawing` is printed twice because of StrictMode.)

### 4. Focus an element (`v1-focus`)

Three small steps. One: `const boxRef = useRef(null)`. Two: put `ref={boxRef}` on the input, which tells React to store that element in `boxRef.current` when it draws it. Three: in the Clear handler, clear the state, then call `boxRef.current.focus()`.

`versions/v1-focus/App.jsx`:
```jsx
function App() {
  const [query, setQuery] = useState('')
  const boxRef = useRef(null)

  function clear() {
    setQuery('')
    boxRef.current.focus()
  }

  return (
    <div className="page">
      <input
        ref={boxRef}
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search courses"
      />
      <button onClick={clear}>Clear</button>
    </div>
  )
}
```

Type `py`, press Clear: the box is empty and the cursor is back in it.

### 5. Scroll to the current lesson (`v3-scroll`)

A lesson page has a scrolling box of twelve lessons and the student is on lesson nine. Inside `map`, a ternary gives the ref to the current lesson only, and a button calls `scrollIntoView()`. The real list after clicking Go to current lesson:

```text
9. Components | 10. JSX rules | 11. Props | 12. Children | Go to current lesson
```

### 6. Read an uncontrolled input (`v4-form`)

The promise from M05-L03: an input with `defaultValue` keeps its own text, and you read it with a ref only when the form is submitted. The input does not draw on each key (the console shows `drawing` only on load and on submit).

`versions/v4-form/App.jsx`:
```jsx
function App() {
  const nameRef = useRef(null)
  const [sent, setSent] = useState('')
  console.log('drawing')

  function handleSubmit(e) {
    e.preventDefault()
    setSent(nameRef.current.value)
  }

  return (
    <form className="page" onSubmit={handleSubmit}>
      <input ref={nameRef} defaultValue="Lukas" />
      <button>Send</button>
      <p className="out">
        {sent ? `Hello, ${sent}` : 'Not sent yet'}
      </p>
    </form>
  )
}
```

### 7. A timer id (`v5-stopvar`, `v6-stopref`)

A stopwatch calls `setInterval` on Start and `clearInterval` on Stop. The timer id must live somewhere between draws. A plain variable `let timerId = null` is thrown away on every draw, so Stop clears nothing. A ref keeps it:

```diff
@@ -1,17 +1,17 @@
-import { useState } from 'react'
+import { useState, useRef } from 'react'
 
 function App() {
   const [secs, setSecs] = useState(0)
-  let timerId = null
+  const timerRef = useRef(null)
 
   function start() {
-    timerId = setInterval(() => {
+    timerRef.current = setInterval(() => {
       setSecs(s => s + 1)
     }, 1000)
-    console.log('timer id', timerId)
+    console.log('timer id', timerRef.current)
   }
 
   function stop() {
-    clearInterval(timerId)
+    clearInterval(timerRef.current)
   }
```

The real stopwatch: Start, wait, press Stop at 2 seconds. With the variable the clock keeps going (`3 s` a moment after Stop); with the ref it stays at `2 s`. The console prints `timer id 3` in both cases.

### 8. The rules (`v7-render`)

Do not write `ref.current` while the component is drawing (in the body), and do not read it there either. `v7-render` counts the draws in a ref in the body and shows it:

`versions/v7-render/App.jsx`:
```jsx
const draws = useRef(0)
const [count, setCount] = useState(0)
draws.current += 1

return (
  <div className="page">
    <p className="out">Draws: {draws.current}</p>
    <p className="out">Clicks: {count}</p>
    <button onClick={() => setCount(count + 1)}>
      Click
    </button>
  </div>
)
```

The real page says `Draws: 2` at load (StrictMode draws twice) and `Draws: 4` after one click, and what you see is always one step behind. Use handlers and effects for refs. If the screen must change, use state.

### 9. `ref` is a normal prop in React 19 (`v8-prop`, `v8b-forward`)

For your own text field component with a label and an input inside, the parent wants to focus the input. In React 19 the field just takes `ref` as a normal prop (Module 3, lesson 4). The old way (`v8b-forward`) wrapped the component in `forwardRef`.

```diff
@@ -1,12 +1,14 @@
-import { useRef } from 'react'
+import { useRef, forwardRef } from 'react'
 
-function TextField({ label, ref }) {
-  return (
-    <label>
-      {label}
-      <input ref={ref} />
-    </label>
-  )
-}
+const TextField = forwardRef(
+  function TextField({ label }, ref) {
+    return (
+      <label>
+        {label}
+        <input ref={ref} />
+      </label>
+    )
+  }
+)
 
 function App() {
```

Both work: click Focus email and the cursor goes into the email box. The new way needs no wrapper. In `v8c-noref` the field does not hand `ref` to its input, so `emailRef.current` stays `null` and Focus email throws the `TypeError` from step 10.

### 10. Mistakes (`v9-noattr`, `v10-body`)

Forgetting the `ref` attribute: the code calls `boxRef.current.focus()` but the input never got `ref={boxRef}`, so `current` is still `null`:

```text
TypeError: Cannot read properties of null (reading 'focus')
```

Read it as "you asked null to focus". The same error appears in `v10-body`, where `boxRef.current.focus()` is called in the body: the element is not on the page yet during the first draw, so the page goes blank.

### 11. State or ref?

One question decides: does the screen need to change when this value changes? If yes, use state. If no (an element to reach, a timer id, a value to remember silently), use a ref.

## Common mistakes

- Forgetting `ref={boxRef}` on the element (`current` is `null`).
- Reading or writing `ref.current` in the body.
- Using a ref for something the screen shows. The screen will not update.
- Using a plain `let` variable for a timer id.

## Try it yourself

A form with a name box and a Reset button. When Reset is pressed, clear the box and put the cursor back in it.

## Clean up

```bash
rm -rf node_modules dist
```

Press `Ctrl+C` to stop the dev server.

## Next

Continue with [M07-L05 · Fetching Data in an Effect](../m07-l05-fetching-data-in-an-effect/).
