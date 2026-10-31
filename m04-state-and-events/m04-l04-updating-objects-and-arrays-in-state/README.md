# M04-L04 · Updating Objects and Arrays in State

> Video: Module 4, Lesson 4. Watch it first, then follow along here.

## What you'll learn

- Why changing state in place (mutation) does not update the screen: React checks whether it got a new object or the same one
- Updating an object with spread, and copying every level you change
- The list moves: add with spread, remove with `filter`, change one item with `map` and a ternary
- Why to avoid `push`, `splice`, `sort` and `reverse` on state, and to use `toSorted` instead
- A cheat sheet to keep

## Before you start

- Node 24 (`node --version`). [M04-L02](../m04-l02-usestate-giving-a-component-memory/) and [M04-L03](../m04-l03-how-rendering-works/) first. You also use spread (M02-L02) and `map`, `filter`, `some`, `toSorted` (M02-L03).
- The project of this lesson is `allcsvideos-web/` here (`npm install` inside it). Its `App.jsx` is the last step (the sort button).
- No Docker needed.

## Files in this folder

| File or folder | What it is |
|----------------|------------|
| `allcsvideos-web/` | The Vite project. `src/App.jsx` is the enroll page with `toSorted`; `src/courses.js` is the course data |
| `versions/01-mutation-trap/` to `08-toSorted/` | One `App.jsx` per step of the video |

To follow a step, copy the `App.jsx` of that folder over `allcsvideos-web/src/App.jsx`. Steps 06 to 08 need `src/courses.js` (already there). Start the project with `npm run dev` inside `allcsvideos-web/` (port 5173 unless Vite says another).

## Follow along

### 1. The button that does nothing

A tiny page: one course card and a button that says Add a lesson. Click once, twice, three times and the card still says 12 lessons. The code looks right, and inside the program the number really goes up, but the screen refuses to show it. This is the most common beginner bug in React state, and one simple rule is behind it.

### 2. Same box or new box?

Remember the sticky notes from M02-L02: an object sits in a box in the computer's memory, and a name like `course` is a sticky note stuck on that box. In Lesson 3 a state change was the trigger for a new render. But before React starts it asks one small question: is this a new value, or the same one I already have? For an object that means: is this a new box, or the same box? React does not open the box and compare every field (that would be slow). It only looks at which box it is.

If you scribble a new number on the same box and hand the same box back, React says "same box, nothing to do". If you make a copy, a new box with the new number, and hand that over, React says "a new box, time to draw". Think of a guard at a gate who only checks the ticket number: you can write anything you like on the ticket, but it is still the same ticket.

**The rule: never change state in place. Make a new copy with your change and give React the copy.** Programmers say: treat state as read only.

### 3. The trap: mutation

`versions/01-mutation-trap/App.jsx`:

```jsx
import { useState } from 'react'

export default function App() {
  const [course, setCourse] = useState({
    title: 'React for Beginners',
    lessons: 12,
  })

  function addLesson() {
    course.lessons++
    console.log(course.lessons)
    setCourse(course)
  }

  return (
    <div className="page one">
      <div className="card">
        <h2>{course.title}</h2>
        <p className="body">{course.lessons} lessons</p>
        <button onClick={addLesson}>Add a lesson</button>
      </div>
    </div>
  )
}
```

`course.lessons++` adds one in place (the two plus signs mean "plus one"). Guess: Asha clicks once. Twelve lessons or thirteen? The card still says `12 lessons`, and the console says:

```text
13
```

The object inside really changed; the screen did not. Click twice more: the console says `14`, then `15`, and the card is stuck on 12. Why? The last line is `setCourse(course)`: we handed React the very same box it already had. Same box, nothing to do. We scribbled on the box and never showed React a new one. This is called **mutation**: changing something in place, where it sits. Mutating state is the trap of this lesson.

### 4. The fix: a new box with spread

Stop editing the box and build a new one. Three dots copy every field of the old object into a new object, then you replace the fields you want (`versions/02-spread-fix/App.jsx`):

```jsx
function addLesson() {
  setCourse({
    ...course,
    lessons: course.lessons + 1,
  })
}
```

Copy everything, replace `lessons` (the line previewed in M02-L02). Put both versions side by side: with the mutation the card stays at `12 lessons`; with the copy it goes `13`, `14`, `15`. The only difference is one line: the same box, or a new box.

**A second slip** (`versions/03-forgot-the-spread/`): `setCourse({ lessons: course.lessons + 1 })` without the spread. Guess what happens to the card: `13 lessons`, but the title is gone. The new object only has `lessons`, because nothing copied the other fields. The spread carries the rest along. The pattern is always the same: **spread first, then the fields you want to change** (later keys win, M02-L02).

### 5. Objects inside objects

Now a card with a teacher, an object inside the course object: a box inside a box. The warning at the end of M02-L02 was: spread copies only one level. The outer box is new, but the teacher box inside is shared by the old object and the copy.

A shortcut many beginners try (`versions/04-nested-mutation-bug/App.jsx`):

```jsx
function changeTeacher() {
  const next = { ...course }
  next.teacher.name = 'Asha'
  console.log(course.teacher.name)
  setCourse(next)
}
```

Guess: the screen will say `by Asha`. What does the console print for the old course's teacher? The card does say `by Asha`, so it looks fine. But the console says:

```text
Asha
```

The old course was changed too, because both courses share one teacher box. We damaged the old state, and that causes bugs later that are very hard to find. The fix is to copy at every level you change (`versions/05-nested-fix/App.jsx`):

```jsx
function changeTeacher() {
  const next = {
    ...course,
    teacher: {
      ...course.teacher,
      name: 'Asha',
    },
  }
  console.log(course.teacher.name)
  setCourse(next)
}
```

```text
Meera
```

The old object kept Meera, and the screen shows Asha. **To change something deep inside, copy every level on the way to it.**

### 6. Lists: push is the same trap

Lists in state follow the same rule. Lukas wants to enroll in courses. On the left is the catalog with Enroll buttons; on the right, Lukas's courses with a count in the heading. His courses live in state as an array. The first idea that comes to mind is `push` (`versions/06-push-trap/App.jsx`):

```jsx
const [enrolled, setEnrolled] = useState([])

function enroll(course) {
  enrolled.push(course)
  console.log('enrolled has', enrolled.length)
  setEnrolled(enrolled)
}
```

Guess: Lukas clicks Enroll on React for Beginners. What does his list show? Zero! The console says `enrolled has 1`, so `push` really added it. Click another course: the console says `enrolled has 2` and the screen still says `Lukas's courses (0)` and `nothing yet`. `push` changes the list in place: the same trap, with an array.

### 7. The three list moves

`versions/07-add-remove-change/App.jsx` shows all three moves.

**Add: spread inside square brackets.** A new list: everything old, plus the new one at the end. We also copy the course with spread and add `done: false` for later:

```jsx
function enroll(course) {
  setEnrolled([
    ...enrolled,
    { ...course, done: false },
  ])
}
```

Click Enroll on React for Beginners: the list shows it and the count says 1. Python from Zero: 2. System Design: 3. Every click makes a new list, and the heading counts it with `enrolled.length`. The Enroll buttons turn grey once a course is in the list: that is `some` (M02-L03) asking "is this course already enrolled?" with `disabled={enrolled.some(e => e.id === c.id)}`.

**Remove: `filter`.** Keep every course whose id is not that id:

```jsx
function remove(id) {
  setEnrolled(
    enrolled.filter(c => c.id !== id)
  )
}
```

Click Remove on Python from Zero: the list shows two courses and the count says 2. The others did not move. Look at the line that draws each row: `key={c.id}` (M03-L03). Because the key is the id, React knows exactly which row left. Keys are covered in depth in Module 5.

**Change one item: `map` with a ternary and a spread.** Lukas finishes React for Beginners and clicks Done. That one course gets `done: true` and the others stay as they are:

```jsx
function toggleDone(id) {
  setEnrolled(enrolled.map(c =>
    c.id === id ? { ...c, done: !c.done } : c
  ))
}
```

`map` visits every item and builds a new list. For each course: if its id matches, return a copy with `done` flipped, otherwise return the course as it is. The "if/otherwise" is one ternary (M02-L06), and the changed course is built with spread, so we never edit the old course object. Click Done on React for Beginners: the title turns green and a `done` tag appears. Only that one changed. From a real run:

```text
Lukas's courses (3)   React for Beginners, Python from Zero, System Design
after Remove on Python: Lukas's courses (2)
after Done on React:    title class "t done", 1 tag
```

### 8. The cheat sheet

For every job there is a method that changes the list in place (avoid it) and a way that gives you a new list (use it).

| Job | Avoid | Use |
|-----|-------|-----|
| Add | `push`, `unshift` | `[...list, item]` |
| Remove | `splice`, `pop` | `filter` |
| Change one item | `list[i] = ...`, editing the item's fields | `map` with a ternary and a spread of the item |
| Sort, reverse | `sort`, `reverse` on state | `toSorted`, `toReversed`, or copy first with spread |

`toSorted` in action (`versions/08-toSorted/App.jsx`):

```jsx
function sortByLessons() {
  setEnrolled(
    enrolled.toSorted(
      (a, b) => a.lessons - b.lessons
    )
  )
}
```

Lukas enrolled in System Design, React, then Python. Click Sort by lessons:

```text
before:  System Design (25 lessons), React for Beginners (12), Python from Zero (20)
after:   React for Beginners (12), Python from Zero (20), System Design (25)
```

The list is new, and the screen follows.

### 9. One last tip

If you click, the console shows the right value, but the screen does not move, look at the line before `set...`. Is there a `++`, a `push`, a `splice`, or an `=` changing something? That is the mutation.

## Common mistakes

- Changing the object (`course.lessons++`) and then passing the same object to `setCourse`.
- Forgetting the spread: the new object has only the fields you listed.
- Copying only the outer level (`{ ...course }`) and then editing a nested object: the old state is damaged too.
- `push`, `splice`, `sort`, `reverse` on a list in state.

Interview tip. If Rahul, an interviewer, asks "why can't you change state directly in React?": React decides whether to re-render by comparing the old and new state by reference. If you mutate in place and pass the same object, the comparison says nothing changed, so the screen does not update. So you create a new object or array.

## Try it yourself

Add a button called "Remove all done" that uses `filter` to drop every course whose `done` is `true`. (A possible answer: `setEnrolled(enrolled.filter(c => !c.done))`.)

## Clean up

Press `Ctrl+C` to stop the dev server. If you ran `npm install` in this repo's `allcsvideos-web`, delete its `node_modules` and `dist` folders when you are done.

## Next

[M04-L05 · Lifting State Up](../m04-l05-lifting-state-up/): two components need the same data, and the answer is to move it up.
