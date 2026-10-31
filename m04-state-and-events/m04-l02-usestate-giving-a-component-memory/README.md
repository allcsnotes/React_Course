# M04-L02 · useState: Giving a Component Memory

> Video: Module 4, Lesson 2. Watch it first, then follow along here.

## What you'll learn

- Why a normal variable cannot update the page (React does not watch variables, and the function starts from its first line every time)
- State as a sticky note React keeps for a component between draws
- Reading `const [count, setCount] = useState(0)` like a sentence
- The click, set, draw-again loop
- One `useState` line per piece of memory, and every copy of a component has its own state
- The two rules of hooks, and the mistakes you will make once

## Before you start

- Node 24 (`node --version`). [M04-L01 · Handling Events](../m04-l01-handling-events/) first, especially the "honest moment" at the end. You also use array destructuring (M02-L02).
- The project of this lesson is `allcsvideos-web/` here (`npm install` inside it). Its `App.jsx` is the counter with state (step 4).
- No Docker needed.

## Files in this folder

| File or folder | What it is |
|----------------|------------|
| `allcsvideos-web/` | The Vite project. `src/App.jsx` is the counter with `useState`; `App.css` and `index.css` hold the styles |
| `versions/00-variable-does-not-redraw/` to `10-missing-import/` | One folder per step of the video, each with the files that change (`App.jsx`, sometimes `CourseCard.jsx` and `courses.js`) |

To follow a step, copy every file of that folder over `allcsvideos-web/src/`. Start the project with `npm run dev` inside `allcsvideos-web/` (port 5173 unless Vite says another).

## Follow along

### 1. The card that does not change

Last lesson ended with a card whose click changed a variable and not the page. `versions/00-variable-does-not-redraw/CourseCard.jsx`:

```jsx
function CourseCard({ course }) {
  let enrolled = false

  function handleEnroll() {
    enrolled = true
    console.log('enrolled is', enrolled)
  }

  return (
    <div className="card">
      <h2>{course.title}</h2>
      <button onClick={handleEnroll}>
        {enrolled ? 'Enrolled' : 'Enroll'}
      </button>
    </div>
  )
}

export default CourseCard
```

Guess: after one click, what does the console show and what does the button say? The console prints `enrolled is true` and the button still says `Enroll`. Nothing is broken. The variable really changed, but **React does not watch your variables**. And there is a second reason, even more important: to draw the page React calls your function, and a function always starts from its first line every single time it runs. Even if React drew the card again, `let enrolled = false` would run again and put the `false` back. A normal variable cannot remember anything from one run to the next.

We need a place to keep the value, outside the function, that React knows about. We learn it with a simple counter first, then come back and fix this very card.

### 2. The sticky note

Picture a component as a brick, and next to it a sticky note that React keeps for it. The note holds one value: `count` is 0. The note is not inside the function; React keeps it outside, between one run and the next.

1. When the component runs, React hands it the note: "here is `count`, it says 0". The component uses it to draw the page.
2. When something changes, the component does not scribble on the note itself. It asks React: "please change the note to 1".
3. React writes the new value on the note and calls the component again. This time the component is handed 1, and the page shows 1.

That note is called **state**: a value that a component remembers between draws. The tool that gives a component a note is **`useState`**. `useState` is a **hook**: a function from React whose name starts with `use`. `useState` is the first.

### 3. A plain counter that does not work

`versions/01-plain-counter/App.jsx` uses a normal variable:

```jsx
export default function App() {
  let count = 0

  function handleClick() {
    count = count + 1
    console.log('count is', count)
  }

  return (
    <div className="counter">
      <h2>Counter</h2>
      <p>Count: {count}</p>
      <button onClick={handleClick}>
        Add one
      </button>
    </div>
  )
}
```

Click three times: the console prints `count is 1`, `count is 2`, `count is 3`, and the page still says `Count: 0`.

### 4. The counter with useState

`versions/02-counter-with-state/App.jsx`, also `allcsvideos-web/src/App.jsx`. Two changes: a new line at the very top, and the first line of `App`:

```jsx
import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1)
  }

  return (
    <div className="counter">
      <h2>Counter</h2>
      <p>Count: {count}</p>
      <button onClick={handleClick}>
        Add one
      </button>
    </div>
  )
}
```

The `import` is a named import (M02-L04): `useState` sits on React's shelf and we take it by its exact name. Now read `const [count, setCount] = useState(0)` slowly, starting on the right.

- `useState(0)` means "please make me a note and start it at 0". That 0 is only the **starting value**: it is used the first time, never again.
- `useState` gives back an array with exactly two items: the value on the note right now, and a function that changes the note.
- The square brackets on the left are array destructuring (M02-L02). They unpack the two items into two names: `count` is what the note says now, `setCount` is how we ask React to change it.

The click calls `setCount(count + 1)`. We never write `count = ...`. We ask React, through `setCount`, to write `count + 1` on the note. Click once, twice, three times: the page says `Count: 1`, `Count: 2`, `Count: 3`. The page follows the note. `setCount` did two jobs: it changed the note, and it told React "draw this component again". The second job is the magic.

Watch React call `App` again (`versions/02b-log-each-draw/`, which adds `console.log('drawing, count is', count)` under the `useState` line). First draw, then one line per click:

```text
drawing, count is 0
drawing, count is 1
drawing, count is 2
drawing, count is 3
```

(Each line prints twice in development, as you saw in M03-L05; this shows each once.) So the function really does run again from the top. But this time `useState` does not hand back the 0: React says "you already have a note, and here is its current value".

The loop: **1.** the user clicks. **2.** our function calls `setCount`. **3.** React changes the note. **4.** React calls `App` again and it gets the new value. **5.** the page shows the new count. How React does steps 4 and 5 is the next lesson.

### 5. A normal variable against state

`versions/03-variable-against-state/App.jsx` has a normal variable `plain` and a state `saved`, and both go up by one on every click:

```jsx
let plain = 0
const [saved, setSaved] = useState(0)

function handleClick() {
  plain = plain + 1
  setSaved(saved + 1)
}
```

Guess what the two lines show after three clicks:

```text
Normal variable: 0
State: 3
```

On every click `plain` went to 1. Then React drew the component again, the first line ran, and `let plain = 0` put the zero back. The state is on the note, so it survived. A normal variable lives inside one run of the function and dies with it. State lives on the note, between runs. **Rule of thumb:** if a value changes and the screen must change with it, it is state. If a value is only needed inside one run, a normal variable is fine.

### 6. The card from the start, fixed

`versions/00b-card-with-state/CourseCard.jsx`: the same card with three small changes, the import, the first line and the handler:

```jsx
import { useState } from 'react'

function CourseCard({ course }) {
  const [enrolled, setEnrolled] = useState(false)

  function handleEnroll() {
    setEnrolled(true)
  }

  return (
    <div className="card">
      <h2>{course.title}</h2>
      <button onClick={handleEnroll}>
        {enrolled ? 'Enrolled' : 'Enroll'}
      </button>
    </div>
  )
}
```

Click Enroll: the button says `Enrolled`. The same card, the same click, and this time the page changed.

### 7. The promise from the very first lesson

In M01-L01 you saw an `App.jsx` and were told you did not need to understand every line yet. Now you do (`versions/04-enroll-page-from-lesson-1/App.jsx`):

```jsx
export default function App() {
  const [enrolled, setEnrolled] = useState(false)
  return (
    <>
      <Header myCourses={enrolled ? 4 : 3} />
      <CourseCard
        enrolled={enrolled}
        onEnroll={() => setEnrolled(true)}
      />
    </>
  )
}
```

The same shape as the counter, but this note holds a yes or no: `enrolled` is `false`, nobody has enrolled yet. The badge is the ternary from M02-L06 (if enrolled, 4, otherwise 3). The card receives two props (M03-L04): `enrolled`, and `onEnroll`, a function that calls `setEnrolled(true)`. Click Enroll:

```text
before: Enroll    1204 students   badge 3
after:  Enrolled  1205 students   badge 4
```

The click calls `setEnrolled(true)`. React changes the note from `false` to `true` and calls `App` again. This time `useState` hands back `true`, every ternary picks its other answer, and all three places change together. The click does one thing, it sets the data, and the screen follows. Nobody updates the badge by hand. Why does the state live in `App` and not inside the card? Because the badge, up in the header, needs it too. Sharing state between components is Lesson 5.

### 8. More than one note

A component can have as many notes as it needs: one `useState` line for each (`versions/05-two-states/App.jsx`):

```jsx
const [watched, setWatched] = useState(0)
const [saved, setSaved] = useState(false)

function watchOne() {
  setWatched(watched + 1)
}

function toggleSave() {
  setSaved(!saved)
}
```

`!saved` is "not saved" (M02-L06): if `saved` is `false`, `!saved` is `true`, and the other way round. Two sticky notes side by side; changing one never touches the other. Click Watched one twice, then Save:

```text
React for Beginners
Lessons watched: 2
Saved for later
[Watched one] [Unsave]
```

One piece of memory, one `useState` line. Do not squeeze unrelated things into one. Lesson 4 shows when a group of values belongs together in one object.

### 9. Every copy has its own state

A like button with its own `useState` (`versions/06-two-like-buttons/App.jsx`):

```jsx
function LikeButton({ course }) {
  const [likes, setLikes] = useState(0)

  return (
    <button onClick={() => setLikes(likes + 1)}>
      {course}: {likes} likes
    </button>
  )
}

export default function App() {
  return (
    <div className="counter">
      <LikeButton course="React" />
      <LikeButton course="Python" />
    </div>
  )
}
```

Guess: click the React button twice and the Python button once.

```text
React: 2 likes
Python: 1 likes
```

They are independent. Each use of the component gets its own note, found by place: the first `LikeButton`, and the second. So state belongs to one copy of a component, not to the function. The function is a recipe; every place where you use it is a separate copy with its own memory.

### 10. The two rules of hooks

React finds your notes by counting, not by name. Think of a row of lockers: the first `useState` call opens locker 1, the second opens locker 2. If one draw skips a call, every locker after it is the wrong one.

**Rule 1: call hooks at the top level of your component.** Never inside an `if`, never inside a loop, never after a `return`. Every draw must call the same hooks in the same order. A real mistake (`versions/07-hook-in-an-if-mistake/App.jsx`):

```jsx
const [count, setCount] = useState(0)

if (count > 0) {
  const [note, setNote] = useState('hello')
}
```

The page loads fine because `count` is 0 and the `if` is skipped. Click Add one: now `count` is 1, the `if` runs, and there is a second `useState` that did not exist on the first draw. The page goes blank, and the console says in red:

```text
React has detected a change in the order of Hooks called by App.
Rendered more hooks than during the previous render.
```

You can catch this before you run anything with a **linter**, a tool that reads your code and warns you. The Vite starter comes with one, `oxlint`. To be sure this rule is on, add a flag. Run it in the project folder:

```bash
npx oxlint -D react-hooks/rules-of-hooks
```

```text
src/App.jsx:7:29: error react-hooks(rules-of-hooks): React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render. help: Move the Hook call before the condition, or call it unconditionally and branch inside the Hook/effect instead.
```

(It also prints some unused-variable warnings for `note` and `setNote`.) The fix (`versions/07b-hook-at-top-level/App.jsx`): move the hook to the top, outside the `if`, and use the value inside the `if` as often as you like:

```jsx
const [count, setCount] = useState(0)
const [note, setNote] = useState('hello')
...
{count > 0 && <p>{note}</p>}
```

**Rule 2:** call hooks only inside a component or inside your own hooks (much later in the course), never inside a normal function.

### 11. Names

The pattern is `thing` and `setThing`: `count`/`setCount`, `enrolled`/`setEnrolled`, `watched`/`setWatched`. Everybody reads code this way, so follow it. The names are your choice. The order is not: the first item is always the value, the second is always the changer.

## Common mistakes

**1. Swapping the names** (`versions/08-swapped-names/App.jsx`: `const [setCount, count] = useState(0)`). The page loads, but the line reads `Count:` and nothing after it, and the console warns about a function being used as a child. The value is now in the wrong name. Click, and:

```text
setCount is not a function
```

The name `setCount` holds the number 0, and the code tried to call it.

**2. Changing the state variable directly** (`versions/09-changing-state-directly/App.jsx`: `count = count + 1`). Remember the sealed lid of `const` (M02-L01)?

```text
Assignment to constant variable.
```

The page stays at 0. Always use the changer.

**3. Forgetting the import** (`versions/10-missing-import/App.jsx`). A blank page, and the console says:

```text
useState is not defined
```

The fix is the first line: `import { useState } from 'react'`.

One last pointer: what if you call `setCount(count + 1)` three times in a row? The answer is a surprise, and it comes in the next lesson.

Interview tip. If Rahul, an interviewer, asks "what is `useState`?": a hook that gives a function component a piece of memory that survives between renders. It returns the current value and a setter, and calling the setter makes React render the component again. Each copy of a component has its own state.

## Try it yourself

Make a thumbs-up counter with a button that adds one. Then add a second state, a yes or no, that changes the text on the button.

## Clean up

Press `Ctrl+C` to stop the dev server. If you ran `npm install` in this repo's `allcsvideos-web`, delete its `node_modules` and `dist` folders when you are done.

## Next

[M04-L03 · How Rendering Works](../m04-l03-how-rendering-works/): what does React really do between the click and the new page? And why does adding one, three times in a row, only add one?
