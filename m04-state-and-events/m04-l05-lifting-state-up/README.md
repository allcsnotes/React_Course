# M04-L05 · Lifting State Up

> Video: Module 4, Lesson 5. Watch it first, then follow along here.

## What you'll learn

- Why two sibling components cannot share state directly (the badge that says zero)
- How to lift state up to the closest common parent, and pass the value and a change function down as props
- Data goes down, events go up; one source of truth
- Controlled and uncontrolled components
- When NOT to lift: keep state local when only one component needs it
- The quiet mistake of forgetting to pass the function

## Before you start

- Node 24 (`node --version`). Lessons [M04-L01](../m04-l01-handling-events/) to [M04-L04](../m04-l04-updating-objects-and-arrays-in-state/) first.
- The project of this lesson is `allcsvideos-web/` here (`npm install` inside it). It ends on the lifted-state version (step 2).
- No Docker needed.

## Files in this folder

| File or folder | What it is |
|----------------|------------|
| `allcsvideos-web/` | The Vite project: `App.jsx` holds the state, `Header.jsx` shows the badge, `CourseCard.jsx` is controlled by its parent |
| `allcsvideos-web/src/courses.js` | The four courses |
| `versions/01-each-card-has-its-own-memory/` to `05-lifted-with-log/` | One folder per step of the video, each with the files it needs |

To follow a step, copy every file of that folder over `allcsvideos-web/src/`. Start the project with `npm run dev` inside `allcsvideos-web/` (port 5173 unless Vite says another).

## Follow along

### 1. The badge that says zero

Lukas opens the allcsvideos page and clicks Enroll on the first card and then on the second. Both buttons say Enrolled. But the badge in the top corner says `My courses: 0`. It is the badge that stayed on 3 from M01-L01, back again, but this time there is no forgotten line to blame: every card did its job. The real problem is where the memory lives. Each card keeps its own memory (Lesson 2), and the badge sits somewhere else with no way to look inside a card.

### 2. The code with the problem

`versions/01-each-card-has-its-own-memory/CourseCard.jsx` is the card from Lesson 2. It keeps one fact in its own memory, `enrolled`:

```jsx
import { useState } from 'react'

function CourseCard({ course }) {
  const [enrolled, setEnrolled] = useState(false)

  return (
    <div className="card">
      <h2>{course.title}</h2>
      <p>by {course.teacher}</p>
      <button
        disabled={enrolled}
        onClick={() => setEnrolled(true)}
      >
        {enrolled ? 'Enrolled' : 'Enroll'}
      </button>
    </div>
  )
}

export default CourseCard
```

Every card has its own `enrolled`: four cards, four separate memories. And the header, `Header.jsx`, has the words and a zero typed straight into the code, with no `useState` and no way to ask the cards anything:

```jsx
function Header() {
  return (
    <header>
      <span className="logo">allcsvideos</span>
      <span className="badge">My courses: 0</span>
    </header>
  )
}
```

`App.jsx` puts the page together: the `Header`, then one `CourseCard` per course with `courses.map` (Module 3). Guess: Lukas clicks Enroll on the first card, then on the second. What does the badge show? Real result:

```text
after both clicks:
My courses: 0
React for Beginners   Enrolled
Python from Zero      Enrolled
System Design         Enroll
DevOps Basics         Enroll
```

Nothing is broken. Each card changed its own memory and drew itself again. The badge was never told anything.

### 3. The tree, and siblings

Draw the component tree (M01-L01). `App` is on top. Under it sit the `Header` and the cards. Components that share the same parent are **siblings**: the `Header` and the cards are siblings, and their parent is `App`.

```text
App
├── Header          (owns nothing: a zero typed in the code)
├── CourseCard      (own box: enrolled = false)
├── CourseCard      (own box: enrolled = false)
├── CourseCard
└── CourseCard
```

Lukas clicks Enroll on the first card: only that card's box changes, to `true`. The other boxes and the `Header` stay as they were. Can the `Header` find out? Props (M03-L04) travel down a tree, from a parent to its children. A card's memory belongs to that card. It cannot be handed sideways to a sibling, and it cannot be pulled out from above. **Two siblings cannot share state directly. If two components need the same fact, the fact cannot live in either of them.**

### 4. Lift the state up

An office: every student keeps a private notebook. The manager wants one number, how many students have joined. Reading every notebook is not possible. The simple fix is one whiteboard in the manager's room. A student who joins tells the manager; the manager writes it on the whiteboard; everybody who needs the number looks at the whiteboard, not at the notebooks.

In React the whiteboard is state, and the manager is the closest parent that holds everyone who needs it. Here that is `App`. Moving state out of a child and up into that parent is called **lifting state up**. The `enrolled` boxes leave the cards. `App` gets one box: `enrolledIds`, a list starting empty, holding the id of every course that was joined. One list is enough for the badge and for every card.

`versions/02-state-lifted-to-App/App.jsx`, also `allcsvideos-web/src/App.jsx`:

```jsx
import { useState } from 'react'
import Header from './Header.jsx'
import CourseCard from './CourseCard.jsx'
import { courses } from './courses.js'

export default function App() {
  const [enrolledIds, setEnrolledIds] = useState([])

  function handleEnroll(id) {
    setEnrolledIds([...enrolledIds, id])
  }

  return (
    <div className="page">
      <Header count={enrolledIds.length} />
      <main>
        {courses.map(c => (
          <CourseCard
            key={c.id}
            course={c}
            enrolled={enrolledIds.includes(c.id)}
            onEnroll={() => handleEnroll(c.id)}
          />
        ))}
      </main>
    </div>
  )
}
```

`handleEnroll` takes the id of a course and sets the list to a new list: every old id (spread) and the new id at the end (never change the old array, Lesson 4). Now `App` hands things down: the `Header` gets a prop `count` (the length of the list); each `CourseCard` gets `course`, `enrolled` (true when the list includes this course's id) and `onEnroll` (an arrow function that calls `handleEnroll` with this course's id). A prop can be a function (M03-L04, M04-L01): this is what it is for. It is how a card talks back to its parent.

`CourseCard.jsx` gets simpler. It has no `useState` at all:

```jsx
function CourseCard({ course, enrolled, onEnroll }) {
  return (
    <div className="card">
      <h2>{course.title}</h2>
      <p>by {course.teacher}</p>
      <button disabled={enrolled} onClick={onEnroll}>
        {enrolled ? 'Enrolled' : 'Enroll'}
      </button>
    </div>
  )
}

export default CourseCard
```

And `Header.jsx` takes `count` and shows it next to the words `My courses`:

```jsx
function Header({ count }) {
  return (
    <header>
      <span className="logo">allcsvideos</span>
      <span className="badge">My courses: {count}</span>
    </header>
  )
}
```

Run it and click:

```text
start:               My courses: 0
after the 1st card:  My courses: 1   (React for Beginners: Enrolled)
after the 2nd card:  My courses: 2   (Python from Zero: Enrolled)
```

The badge and the cards agree because they all read from the same list. That is also why, in Lesson 2, the state behind the badge lived in `App` and not inside the card.

### 5. Two roads: data down, events up

The first road goes down: `App` hands props to its children (`count` to the `Header`, `enrolled` and `onEnroll` to every card). The second road goes up: a card cannot change the list, because the list is not its own. But it was handed a function, so it can call it. That is an event travelling up: "somebody pressed Enroll, for this course".

One click, on the Python card:

1. The card calls `onEnroll`.
2. `App` runs `handleEnroll`, and the list gets a new id.
3. `App` renders again (Lesson 3) with the new list.
4. The new props flow down. The badge says 1 and the Python card says Enrolled.

**Data goes down, as props. Events go up, as function calls.** You will use this pattern in every React app you write. To watch it, copy `versions/05-lifted-with-log/` (it adds `console.log('enrolledIds', enrolledIds)` under the `useState` line). After two clicks the console shows (each line appears twice in development, as in earlier lessons):

```text
enrolledIds [1]
enrolledIds [1, 2]
```

### 6. One source of truth

Before, the same fact lived in many places: every card had its own `enrolled`, and the badge had its own number. Five places that could disagree. That is how the badge got stuck on 3 in Module 1. Now the fact lives in one place, the list of enrolled ids in `App`. The badge does not store a number: it works the number out from the list (its length). A card does not store `enrolled`: it asks the list "do you include my id?". This is called **one source of truth**. One place owns the fact and everything else is worked out from it. Two things worked out from the same list can never disagree. The old bug, a button that changes while a badge is forgotten, is now impossible: nobody can forget the badge, it is not told anything, it just reads. (Module 5, Lesson 5 goes deeper into this.)

### 7. Controlled and uncontrolled

Before, the card kept its own memory and decided for itself whether it was enrolled. A component like that is called **uncontrolled**: it controls itself. After, the card has no memory. It shows what its parent gives it and asks the parent to make changes. A component like that is **controlled**: it is controlled by its parent. Think of a TV that only works from the remote, and the parent holds the remote. Neither word means good or bad. They only tell you who holds the value. You will meet the same two words for text boxes in Module 5, Lesson 3.

### 8. When NOT to lift

Should every piece of state go up to `App`? No. Lifting has a cost: `App` grows and more props travel down. The rule of thumb is one question: who needs this value?

- If only one component needs it, keep the state there.
- If two or more components need it, lift it up to the closest parent they share. Not higher: the closest.

Test it: Asha adds a Details button to each card to show the number of lessons (`versions/03-details-stays-local/CourseCard.jsx`). Does anyone besides that card care whether its details are open? The header does not; the other cards do not. So this memory stays in the card, right inside the card next to the props:

```jsx
import { useState } from 'react'

function CourseCard({ course, enrolled, onEnroll }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="card">
      <h2>{course.title}</h2>
      <p>by {course.teacher}</p>
      {open && <p>{course.lessons} lessons</p>}
      <div className="row">
        <button disabled={enrolled} onClick={onEnroll}>
          {enrolled ? 'Enrolled' : 'Enroll'}
        </button>
        <button
          className="ghost"
          onClick={() => setOpen(!open)}
        >
          {open ? 'Hide' : 'Details'}
        </button>
      </div>
    </div>
  )
}
```

The card is controlled for `enrolled` and has its own memory for `open`. That is fine: state belongs to the components that need it, and no higher. Click Details on System Design: `25 lessons` appears on that card only (the button becomes Hide). The badge, the other cards and `App` never noticed. And if tomorrow another component needs it? Then you lift it, that day. Moving state up later is easy.

## Common mistakes

**Forgetting to pass the function** (`versions/04-forgot-to-pass-onEnroll/App.jsx`). Asha lifts the state and the card takes `onEnroll`, but in `App.jsx` she forgets to pass it: the card gets `course` and `enrolled` and no `onEnroll` line. Click Enroll: nothing happens. The button does not change, the badge says 0, and the console is empty, with no error and no warning. The card's `onClick` is `undefined`, and React does nothing for an undefined handler. The fix: pass it, `onEnroll={() => handleEnroll(c.id)}`. If a click does nothing and there is no error, check that the parent passes the function and that the names match on both sides.

Interview tip. If Rahul, an interviewer, asks what lifting state up means: when several components need the same state, you move it to their closest common parent, pass the value down as props, and pass a callback down so children can ask for changes. It gives you one source of truth.

## Try it yourself

Add a footer to the page that shows how many courses are left to enroll in: 4 minus the length of the list. Do you need any new state? (No: it is worked out from `enrolledIds`, like the badge: `courses.length - enrolledIds.length`.)

## Clean up

Press `Ctrl+C` to stop the dev server. If you ran `npm install` in this repo's `allcsvideos-web`, delete its `node_modules` and `dist` folders when you are done.

## Next

[M04-B02 · Build a Flashcard Quiz](../m04-b02-build-a-flashcard-quiz/): the second build of Module 4. You make a flashcard quiz with a next card button, a score and a restart, and decide where each piece of state lives.
