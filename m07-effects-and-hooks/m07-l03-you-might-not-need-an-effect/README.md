# M07-L03 · You Might Not Need an Effect

> Video: Module 7, Lesson 3. Watch it first, then follow along here.

## What you'll learn

- An effect is a phone call to the outside world (tab title, timer, server, browser). It runs after the screen is drawn
- Five slips where an effect is the wrong tool, and the cure for each
- Derive values while drawing, reset state with a `key`, do work in the event handler, and update everything in one place
- A short chart of questions to ask before you reach for `useEffect`

## Before you start

- Node 24 (`node --version`).
- Best after [M07-L02](../m07-l02-dependencies-cleanup-and-strict-mode/) and M05-L05 (derived state).
- No Docker needed.

## Files in this folder

`src/App.jsx` starts as `versions/v0-title/App.jsx`, the one good effect: the tab title. Each other version is a bug and its fix. Copy a version's `App.jsx` over `src/App.jsx` to try it.

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | React 19.3.1, Vite 8.3.5 |
| `src/App.jsx`, `src/courses.js`, `src/App.css`, `src/index.css`, `src/main.jsx` | The app and its data |
| `versions/v0-title` | A correct effect: the tab title for the chosen course |
| `versions/v1x-flash` | An empty first picture, then the right one |
| `versions/v1-name-bug`, `v1b-name-fix` | Full name kept in state by an effect, then derived |
| `versions/v2-list-bug`, `v2b-list-fix` | A filtered list set by an effect, then derived |
| `versions/v3-reset-bug`, `v3b-reset-key` | Resetting a note in an effect, then with `key` |
| `versions/v4-event-bug`, `v4b-event-fix` | Sending because of a flag in an effect, then in the handler |
| `versions/v5-chain-bug`, `v5b-chain-fix` | Two effects in a chain, then one handler |
| `versions/v6-parent-bug`, `v6b-parent-fix` | An effect telling the parent about a like, then in the handler |

## Follow along

### 1. Set up

```bash
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`). Switch with `cp versions/<name>/App.jsx src/App.jsx`.

Think of your component as a house: the notes, the props and the click that just happened are all right there. An effect is a phone call to the outside world, the part React does not control: the tab title, a timer, a server. Use the phone only for the outside. For things inside the house you do not need it. A good use (`v0-title`) is the tab title; click DevOps Basics and the real tab title goes from `Python from Zero | allcsvideos` to `DevOps Basics | allcsvideos`.

### 2. The flash (`v1x-flash`)

An effect runs after the screen is drawn. Paused at the very first picture, the page says `Hello, ` with no name, and a moment later `Hello, Asha Rao!`. The real text and the render log:

```text
Welcome back | Hello, !
Welcome back | Hello, Asha Rao!

render 1 ""
render 2 "Asha Rao"
```

Every wrong slip below has this extra, wasted draw.

### 3. Slip one: a value you can work out (`v1-name-bug`)

An effect watches `first` and `last` and sets `full`. Instead, calculate it while drawing:

```diff
@@ -1,3 +1,3 @@
-import { useState, useEffect } from 'react'
+import { useState } from 'react'
 import './App.css'
 
@@ -7,10 +7,6 @@
   const [first, setFirst] = useState('')
   const [last, setLast] = useState('')
-  const [full, setFull] = useState('')
+  const full = first + ' ' + last
 
-  useEffect(() => {
-    setFull(first + ' ' + last)
-  }, [first, last])
-
   console.log('render', ++renders, first, '->', full)
```

The bug renders twice for every key (the real log shows `render 3 A ->  ` then `render 4 A -> A`: the full name is one render behind). The fix renders once per key (`render 2 A -> A`, `render 3 As -> As`).

### 4. Slip two: a filtered list (`v2-list-bug`)

```diff
@@ -1,3 +1,3 @@
-import { useState, useEffect } from 'react'
+import { useState } from 'react'
 import { courses } from './courses.js'
 import './App.css'
@@ -8,10 +8,6 @@
 export default function App() {
   const [query, setQuery] = useState('')
-  const [shown, setShown] = useState(courses)
+  const shown = courses.filter(c => matches(c, query))
 
-  useEffect(() => {
-    setShown(courses.filter(c => matches(c, query)))
-  }, [query])
-
   console.log('render', ++renders, query, shown.length)
```

Type `py` in the search box. The bug draws the list after the typing, a draw late (log `render 3 p 4` then `render 4 p 2`: the box says `p` while the list still has 4). The fix gives the right list at once (`render 2 p 2`, `render 3 py 1`).

### 5. Slip three: starting fresh when something changes (`v3-reset-bug`)

A notes panel has a note box and a Finished tick. When the student picks another course, the notes must start empty. An effect watching `course.id` sets the note back to empty, but only the note: the tick stays. The cure is a `key`: when the key changes React throws the old component away and builds a new one with fresh state.

```diff
@@ -1,3 +1,3 @@
-import { useState, useEffect } from 'react'
+import { useState } from 'react'
 import { courses } from './courses.js'
 import './App.css'
@@ -9,8 +9,4 @@
   const [done, setDone] = useState(false)
 
-  useEffect(() => {
-    setNote('')
-  }, [course.id])
-
   console.log('render', ++renders, course.title, note)
 
@@ -40,5 +36,5 @@
         ))}
       </div>
-      <Notes course={course} />
+      <Notes key={course.id} course={course} />
     </div>
   )
```

### 6. Slip four: doing something because the user clicked (`v4-event-bug`)

An enroll form. The submit handler only sets a flag, and an effect watching the flag and `email` does the sending. Because `email` is in the list, the effect sends again for every key typed after the first submit. The real console of the bug after typing `asha@example.com`, pressing Enroll, then typing more:

```text
send asha@example.com
send asha@example.com.
send asha@example.com.i
send asha@example.com.in
```

The fix does the work where it happened, in the event handler:

```diff
@@ -1,20 +1,13 @@
-import { useState, useEffect } from 'react'
+import { useState } from 'react'
 import './App.css'
 
 export default function App() {
   const [email, setEmail] = useState('')
-  const [submitted, setSubmitted] = useState(false)
   const [sent, setSent] = useState(0)
 
-  useEffect(() => {
-    if (submitted) {
-      console.log('send', email)
-      setSent(n => n + 1)
-    }
-  }, [submitted, email])
-
   function handleSubmit(e) {
     e.preventDefault()
-    setSubmitted(true)
+    console.log('send', email)
+    setSent(n => n + 1)
   }
```

The fixed version prints a single `send asha@example.com`.

### 7. Slip five: a chain of effects (`v5-chain-bug`)

A quiz score has points, a level and a message. One effect watches points and sets the level, a second watches the level and sets the message. Each link is another draw. The bug takes four renders for two clicks (`render 3 10 1`, then `render 4 10 2`, then the message). The fix updates everything in one place:

```diff
@@ -1,3 +1,3 @@
-import { useState, useEffect } from 'react'
+import { useState } from 'react'
 import './App.css'
 
@@ -9,12 +9,13 @@
   const [message, setMessage] = useState('')
 
-  useEffect(() => {
-    if (points >= 10) setLevel(2)
-  }, [points])
+  function addPoints() {
+    const next = points + 5
+    setPoints(next)
+    if (next >= 10) {
+      setLevel(2)
+      setMessage('Level 2 unlocked!')
+    }
+  }
 
-  useEffect(() => {
-    if (level === 2) setMessage('Level 2 unlocked!')
-  }, [level])
-
   console.log('render', ++renders, points, level, message)
 
@@ -24,5 +25,5 @@
       <p className="stat">Points <b>{points}</b> · Level <b>{level}</b></p>
       <p className="note">{message}</p>
-      <button onClick={() => setPoints(points + 5)}>+5 points</button>
+      <button onClick={addPoints}>+5 points</button>
     </div>
   )
```

The fix shows `render 3 10 2 Level 2 unlocked!` in a single draw. Real page after two clicks: `Points 10 · Level 2`, `Level 2 unlocked!`.

### 8. Slip six: telling the parent (`v6-parent-bug`)

A Like button keeps `liked`. The parent shows the total number of likes. An effect calls `onLike(liked)` whenever `liked` changes. That also runs on the very first draw, so the total goes wrong. The real texts:

```text
bug:  Likes: -1  (on load)   Likes: 0 (Liked)   Likes: -1 (Like again)
fix:  Likes: 0   (on load)   Likes: 1 (Liked)   Likes: 0 (Like again)
```

```diff
@@ -1,3 +1,3 @@
-import { useState, useEffect } from 'react'
+import { useState } from 'react'
 import './App.css'
 
@@ -7,10 +7,12 @@
   const [liked, setLiked] = useState(false)
 
-  useEffect(() => {
-    onLike(liked)
-  }, [liked])
+  function handleClick() {
+    const next = !liked
+    setLiked(next)
+    onLike(next)
+  }
 
   return (
-    <button onClick={() => setLiked(!liked)}>
+    <button onClick={handleClick}>
       {liked ? 'Liked' : 'Like'}
     </button>
```

### 9. A chart of questions

Ask these in order every time you reach for an effect:

1. Did the user do something (a click, a key, a submit)? Then it goes in the event handler.
2. Can I work it out from state or props? Then compute it while drawing.
3. Do I want fresh state when something changes? Use a `key`.
4. Is it really the outside world (tab title, timer, server, browser)? Then an effect is right, with a cleanup if something keeps running.

## Common mistakes

- An effect that copies one state into another (a derived value).
- An effect that resets state when a prop changes. Use `key`.
- A flag and an effect to do what a click handler can do directly.
- Chains of effects that set state for each other.
- An effect that calls a parent callback. Call it in the same handler that changes the state.

## Clean up

```bash
rm -rf node_modules dist
```

Press `Ctrl+C` to stop the dev server.

## Next

Continue with [M07-L04 · useRef](../m07-l04-useref/).
