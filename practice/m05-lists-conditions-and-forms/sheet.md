# Module 05 · Practice Sheet: 25 Component and State Exercises

Write each exercise yourself before you open the hint or the solution. Every exercise is one small React component, and nothing here needs more than Modules 1 to 5 of this course: components, JSX, props, children, events, `useState`, updater functions, immutable updates, lifting state up, conditional rendering, lists and keys, controlled inputs, forms and the state shape. There is **no `useEffect`, no `ref` and no context** here (those come later).

**How to work:**
- Use **Node 24** (check with `node --version`) and make one practice project. In a terminal, run `npm create vite@latest practice`, choose **React** and **JavaScript**, then `cd practice`, `npm install` and `npm run dev`.
- Put each exercise in its own file, `src/exercises/Ex01.jsx` to `Ex25.jsx`. Every file does `export default function Ex01() { ... }`. To look at one, import it in `src/App.jsx` and render it, exactly like the lessons did.
- The exercises use the allcsvideos platform and its cast: Asha, Lukas, Priya, Meera and Rahul. Money is written as **Rs**.
- They go in the order the lessons teach them: **Module 3** (exercises 1 to 6), **Module 4** (7 to 15), **Module 5** (16 to 22), and then three bigger **combine** exercises (23, 24, 25) that use everything. Some are **fix the broken code**, some are **predict what you will see**, and some build a small piece of the site.
- Every exercise has: a goal in plain words, starter code if it helps, **what you should see** (described, plus the **real text** copied from a browser run of the finished solution), a hint, the solution, and a "where this shows up" line.
- All 25 solutions are in the folder **`solutions/`** next to this sheet. It is a real Vite + React project with a menu: run `npm install` and `npm run dev` inside it, then click an exercise. Each exercise is `src/exercises/ExNN.jsx`.
- The "real text" is what the page showed after Playwright clicked and typed exactly the steps written under each exercise. Where an exercise has several steps, each block starts with a line like `--- after 3 likes ---`.

**The data.** Some exercises say "use the courses array". Make `src/courses.js` and import it where needed:

```js
export const courses = [
  { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: 'Meera', lessons: 20, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: 'Rahul', lessons: 25, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: 'Asha', lessons: 15, price: 0, free: true },
]
```

---

## M03 · JSX and Components

### 1 · Three small components
**Goal.** Build three tiny components, `Header`, `Greeting` and `Footer`, and put them together in `Ex01`. Header shows the site name `allcsvideos`, Greeting says hello to Lukas, Footer says who made it (Asha). Use each as a tag, with a capital letter.

**Starter code:**

```jsx
function Header() {
  // return a heading with allcsvideos
}

export default function Ex01() {
  return (
    <div className="card">
      {/* use <Header />, <Greeting />, <Footer /> */}
    </div>
  )
}
```

**What you should see.** One card with a heading and two lines under it, nothing to click. Real text from the browser:

```text
--- start ---
allcsvideos
Hello, Lukas! Pick a course and start learning.
Made by Asha
```


<details><summary>Hint</summary>

Each component is a function whose name starts with a capital letter and that **returns** JSX. Use it as a self-closing tag: `<Header />`. If your tag shows up as lowercase text on the page, the name is not capitalised.

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex01.jsx</code>)</summary>

```jsx
function Header() {
  return <h2>allcsvideos</h2>
}

function Greeting() {
  return <p>Hello, Lukas! Pick a course and start learning.</p>
}

function Footer() {
  return <p>Made by Asha</p>
}

export default function Ex01() {
  return (
    <div className="card">
      <Header />
      <Greeting />
      <Footer />
    </div>
  )
}
```

</details>

**Where this shows up.** Every React page you will ever read is a tree of small components like these: Header, Footer, Sidebar. The first thing you do on a new screen is cut it into bricks.

### 2 · Fix the broken JSX
**Goal.** This component has three JSX mistakes. The page is blank and the terminal shows a red error. Find the three rules that were broken and fix them, so it shows a title, a small logo and a teacher line.

**Starter code (broken):**

```jsx
function CourseBanner() {
  return (
    <h3 class="title">React for Beginners</h3>
    <img src="/favicon.svg" alt="React for Beginners logo" width="40">
    <p>by Meera
  )
}
```

**What you should see.** After the fix: the title and the teacher line, with the small logo between them. Real text:

```text
--- start ---
React for Beginners
by Meera
```


<details><summary>Hint</summary>

Three rules from "The Rules of JSX": one parent only (wrap in a fragment `<>...</>`), `class` is spelled `className`, and every tag must be closed (`<img ... />`, `</p>`).

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex02.jsx</code>)</summary>

```jsx
function CourseBanner() {
  return (
    <>
      <h3 className="title">React for Beginners</h3>
      <img src="/favicon.svg" alt="React for Beginners logo" width="40" />
      <p>by Meera</p>
    </>
  )
}

export default function Ex02() {
  return (
    <div className="card">
      <CourseBanner />
    </div>
  )
}
```

</details>

**Where this shows up.** These three are the most common JSX errors for every beginner, and the red error screen from Vite is how you will meet them for real.

### 3 · Expressions in curly braces
**Goal.** Show one course using only an object and curly braces: the title in capitals, the lessons with a line like "12 lessons, about 240 minutes of video" (20 minutes each), the price, the price with 20% off (rounded) and the word `Paid course` or `Free course`. No hard-coded numbers except the 20 and the 0.8.

**Starter code:**

```jsx
const course = { title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499 }

export default function Ex03() {
  return (
    <div className="card">
      {/* write the five lines here with { } */}
    </div>
  )
}
```

**What you should see.** One card, five lines, nothing to click. Real text:

```text
--- start ---
REACT FOR BEGINNERS
12 lessons, about 240 minutes of video
Price: Rs 499
With 20% off: Rs 399
Paid course
```


<details><summary>Hint</summary>

Curly braces take any JavaScript **expression**: a variable, a calculation, a method call like `.toUpperCase()`, or a ternary. Not a statement like `if`. For the discount use `Math.round(course.price * 0.8)`.

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex03.jsx</code>)</summary>

```jsx
const course = { title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499 }

export default function Ex03() {
  return (
    <div className="card">
      <h3>{course.title.toUpperCase()}</h3>
      <p>
        {course.lessons} lessons, about {course.lessons * 20} minutes of video
      </p>
      <p>Price: Rs {course.price}</p>
      <p>With 20% off: Rs {Math.round(course.price * 0.8)}</p>
      <p>{course.price === 0 ? 'Free course' : 'Paid course'}</p>
    </div>
  )
}
```

</details>

**Where this shows up.** Prices, counts and formatted names on every product page are expressions in braces.

### 4 · Course cards from props
**Goal.** Write a `CourseCard` component that receives `title`, `teacher`, `lessons` and `price` as props (destructured in the parentheses) and shows a title plus one line. Then render one card for every course in the `courses` array with `map`, with a `key`.

**Starter code:**

```jsx
import { courses } from '../courses'

function CourseCard(/* destructure the props here */) {
  return (
    <div className="card">
      {/* title, then: teacher · lessons lessons · Rs price */}
    </div>
  )
}

export default function Ex04() {
  return <div>{/* one CourseCard per course */}</div>
}
```

**What you should see.** Four cards, one per course. Real text:

```text
--- start ---
React for Beginners
Meera · 12 lessons · Rs 499
Python from Zero
Meera · 20 lessons · Rs 0
System Design
Rahul · 25 lessons · Rs 999
DevOps Basics
Asha · 15 lessons · Rs 0
```


<details><summary>Hint</summary>

`courses.map((c) => <CourseCard key={c.id} title={c.title} ... />)`. The `key` goes on the element that `map` returns, and it comes from the data (`c.id`).

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex04.jsx</code>)</summary>

```jsx
import { courses } from '../courses'

function CourseCard({ title, teacher, lessons, price }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>
        {teacher} · {lessons} lessons · Rs {price}
      </p>
    </div>
  )
}

export default function Ex04() {
  return (
    <div>
      {courses.map((c) => (
        <CourseCard key={c.id} title={c.title} teacher={c.teacher} lessons={c.lessons} price={c.price} />
      ))}
    </div>
  )
}
```

</details>

**Where this shows up.** The course grid on the allcsvideos home page is exactly this: one data array, one card component, one `map`.

### 5 · Default props and a PriceTag
**Goal.** Two small upgrades to the card. A `PriceTag` component that shows `Free` in green when the price is `0`, `Rs 499` for a paid course, and `Price soon` when no price is given. And `CourseCard` shows `Teacher: To be announced` when no teacher is passed (a default value in the destructuring). Render three cards: React for Beginners (Meera, 499), Python from Zero (Meera, 0) and Git Basics with only a title.

**What you should see.** Three cards. The last one has the two fallbacks. Real text:

```text
--- start ---
React for Beginners
Teacher: Meera
Rs 499
Python from Zero
Teacher: Meera
Free
Git Basics
Teacher: To be announced
Price soon
```


<details><summary>Hint</summary>

A missing prop is `undefined`. Compare with `price === undefined` first, then `price === 0`. For the teacher, write `teacher = 'To be announced'` inside the destructuring braces.

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex05.jsx</code>)</summary>

```jsx
function PriceTag({ price }) {
  if (price === undefined) return <span>Price soon</span>
  if (price === 0) return <span className="free">Free</span>
  return <span>Rs {price}</span>
}

function CourseCard({ title, teacher = 'To be announced', price }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>Teacher: {teacher}</p>
      <p>
        <PriceTag price={price} />
      </p>
    </div>
  )
}

export default function Ex05() {
  return (
    <div>
      <CourseCard title="React for Beginners" teacher="Meera" price={499} />
      <CourseCard title="Python from Zero" teacher="Meera" price={0} />
      <CourseCard title="Git Basics" />
    </div>
  )
}
```

</details>

**Where this shows up.** Real data is never complete: a course with no teacher yet, a user with no photo. A safe default keeps the page from showing `undefined`.

### 6 · Children: a Panel wrapper
**Goal.** Write a `Panel` component with a `title` prop that wraps **whatever you put between its tags** (`children`) in a card. Use it three times: one with a paragraph that has a highlighted word (write a second component `Highlight` that wraps `children` in `<strong className="free">`), one with a list, and one with no children at all.

**Starter code:**

```jsx
function Panel({ title /* and ... */ }) {
  return (
    <section className="card">
      <h3>{title}</h3>
      {/* the content goes here */}
    </section>
  )
}
```

**What you should see.** Three cards: Today, Free this week and Empty panel. The third has only its title. Real text:

```text
--- start ---
Today
Priya starts System Design with Rahul.
Free this week
Python from Zero
DevOps Basics
Empty panel
```


<details><summary>Hint</summary>

Destructure `children` next to `title` and write `{children}` where the content belongs. A panel used without children simply renders nothing there, no error.

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex06.jsx</code>)</summary>

```jsx
function Panel({ title, children }) {
  return (
    <section className="card">
      <h3>{title}</h3>
      {children}
    </section>
  )
}

function Highlight({ children }) {
  return <strong className="free">{children}</strong>
}

export default function Ex06() {
  return (
    <div>
      <Panel title="Today">
        <p>
          Priya starts <Highlight>System Design</Highlight> with Rahul.
        </p>
      </Panel>
      <Panel title="Free this week">
        <ul>
          <li>Python from Zero</li>
          <li>DevOps Basics</li>
        </ul>
      </Panel>
      <Panel title="Empty panel" />
    </div>
  )
}
```

</details>

**Where this shows up.** Layout components such as `Card`, `Modal`, `Page` and `Section` are all "a frame with `{children}`".

---

## M04 · State and Events

### 7 · A Like button
**Goal.** A card for React for Beginners with a line `Likes: 0`, a **Like** button that adds one, and a **Reset** button that sets it back to 0. The number must live in state.

**Starter code:**

```jsx
import { useState } from 'react'

export default function Ex07() {
  // const [likes, setLikes] = useState(...)
  return (
    <div className="card">
      <h3>React for Beginners</h3>
      <p>Likes: {/* ? */}</p>
      {/* two buttons */}
    </div>
  )
}
```

**What you should see.** Click Like three times and the line says `Likes: 3`. Reset brings it back to 0. Steps in the browser: Like, Like, Like, Reset. Real text:

```text
--- start ---
React for Beginners
Likes: 0
LikeReset
--- after 3 likes ---
React for Beginners
Likes: 3
LikeReset
--- after Reset ---
React for Beginners
Likes: 0
LikeReset
```


<details><summary>Hint</summary>

`const [likes, setLikes] = useState(0)`, and `onClick={() => setLikes(likes + 1)}`. Pass a function to `onClick`, do not call one.

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex07.jsx</code>)</summary>

```jsx
import { useState } from 'react'

export default function Ex07() {
  const [likes, setLikes] = useState(0)

  return (
    <div className="card">
      <h3>React for Beginners</h3>
      <p>Likes: {likes}</p>
      <button onClick={() => setLikes(likes + 1)}>Like</button>
      <button onClick={() => setLikes(0)}>Reset</button>
    </div>
  )
}
```

</details>

**Where this shows up.** Likes, upvotes, "add one" counters and the quantity box in every shop.

### 8 · Handlers with an argument
**Goal.** Show `Hello, nobody!` first. Add three buttons, Asha, Lukas and Priya. Clicking a button changes the greeting to that name. One state value, three buttons.

**Starter code (the classic trap):**

```jsx
<button onClick={setName('Asha')}>Asha</button>
```

This one **calls** `setName` while the page is drawing, and React stops with "Too many re-renders". Fix it and finish the exercise.

**What you should see.** After clicking Lukas: `Hello, Lukas!`. Real text:

```text
--- start ---
Hello, nobody!
AshaLukasPriya
--- after Lukas ---
Hello, Lukas!
AshaLukasPriya
```


<details><summary>Hint</summary>

You need to hand React a **function** to call later: `onClick={() => setName('Asha')}`. The arrow function is the thing React calls when the click happens.

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex08.jsx</code>)</summary>

```jsx
import { useState } from 'react'

export default function Ex08() {
  const [name, setName] = useState('nobody')

  return (
    <div className="card">
      <p>Hello, {name}!</p>
      <button onClick={() => setName('Asha')}>Asha</button>
      <button onClick={() => setName('Lukas')}>Lukas</button>
      <button onClick={() => setName('Priya')}>Priya</button>
    </div>
  )
}
```

</details>

**Where this shows up.** Any list of buttons that each do the same thing with a different value: tabs, size pickers, language switches.

### 9 · Seats left
**Goal.** A live class with 3 seats. Show `Seats left: 3 of 3`. **Enrol** takes a seat, **Cancel** gives one back. Enrol is disabled when there are no seats left (and a red `Class full` appears), and Cancel is disabled when nobody has enrolled. Keep only the number of taken seats in state.

**What you should see.** After 1 enrol: `Seats left: 2 of 3`. After 3 enrols: `Seats left: 0 of 3`, the message and a greyed-out Enrol button. Real text:

```text
--- start ---
System Design live class
Seats left: 3 of 3
EnrolCancel
--- after 1 enrol ---
System Design live class
Seats left: 2 of 3
EnrolCancel
--- after 3 enrols ---
System Design live class
Seats left: 0 of 3
EnrolCancel
Class full
```


<details><summary>Hint</summary>

Seats left is **worked out** from the total and the taken count, so it is not a second state. Use `disabled={taken === TOTAL}` on the button, and `{taken === TOTAL && <p>...</p>}` for the message.

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex09.jsx</code>)</summary>

```jsx
import { useState } from 'react'

const TOTAL = 3

export default function Ex09() {
  const [taken, setTaken] = useState(0)

  return (
    <div className="card">
      <h3>System Design live class</h3>
      <p>
        Seats left: {TOTAL - taken} of {TOTAL}
      </p>
      <button disabled={taken === TOTAL} onClick={() => setTaken(taken + 1)}>
        Enrol
      </button>
      <button disabled={taken === 0} onClick={() => setTaken(taken - 1)}>
        Cancel
      </button>
      {taken === TOTAL && <p className="error">Class full</p>}
    </div>
  )
}
```

</details>

**Where this shows up.** Ticket sales, webinar sign-ups and any limit (3 tries left, 10 items maximum).

### 10 · Add 3: the updater function
**Goal.** Two counters. Each has a button that tries to add 3 by calling its setter three times in one click. The first uses `setWrong(wrong + 1)` three times, the second uses the updater form `setRight((n) => n + 1)` three times. **Predict** the two numbers before you click, then check.

**Starter code (first button):**

```jsx
function addThreeWrong() {
  setWrong(wrong + 1)
  setWrong(wrong + 1)
  setWrong(wrong + 1)
}
```

**What you should see.** Click each button once. The first counter says 1, the second says 3. Real text:

```text
--- start ---
Wrong way: 0
Add 3 (wrong way)
Updater way: 0
Add 3 (updater way)
--- after both buttons ---
Wrong way: 1
Add 3 (wrong way)
Updater way: 3
Add 3 (updater way)
```


<details><summary>Hint</summary>

State is a snapshot. In one click, `wrong` is the same old number on all three lines, so you ask for "old + 1" three times. `(n) => n + 1` asks React for "whatever the latest value is, plus one".

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex10.jsx</code>)</summary>

```jsx
import { useState } from 'react'

export default function Ex10() {
  const [wrong, setWrong] = useState(0)
  const [right, setRight] = useState(0)

  function addThreeWrong() {
    setWrong(wrong + 1)
    setWrong(wrong + 1)
    setWrong(wrong + 1)
  }

  function addThreeRight() {
    setRight((n) => n + 1)
    setRight((n) => n + 1)
    setRight((n) => n + 1)
  }

  return (
    <div className="card">
      <p>Wrong way: {wrong}</p>
      <button onClick={addThreeWrong}>Add 3 (wrong way)</button>
      <p>Updater way: {right}</p>
      <button onClick={addThreeRight}>Add 3 (updater way)</button>
    </div>
  )
}
```

</details>

**Where this shows up.** "Add 5 seats", batch actions, and any handler that updates the same state more than once.

### 11 · Predict the snapshot
**Goal.** One click handler does two things: `setCount(count + 1)` and then `setMessage('The count was ' + count + ' when you clicked')`. **Before you run it**, write down what the message says after the first click and after the second click. Then build it and compare.

**What you should see.** After click 1 the count is 1 but the message says the count was **0**. After click 2: `Count: 2` and `The count was 1 when you clicked`. Real text:

```text
--- start ---
Count: 0
Nothing yet
Click me
--- after click 1 ---
Count: 1
The count was 0 when you clicked
Click me
--- after click 2 ---
Count: 2
The count was 1 when you clicked
Click me
```


<details><summary>Hint</summary>

Inside one render, `count` never changes. It is a photo of the state taken when React called your component. The next photo comes with the next render.

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex11.jsx</code>)</summary>

```jsx
import { useState } from 'react'

export default function Ex11() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('Nothing yet')

  function handleClick() {
    setCount(count + 1)
    setMessage('The count was ' + count + ' when you clicked')
  }

  return (
    <div className="card">
      <p>Count: {count}</p>
      <p>{message}</p>
      <button onClick={handleClick}>Click me</button>
    </div>
  )
}
```

</details>

**Where this shows up.** The number-one confusion about React: "I set the state and then logged it, and it still shows the old value." Now you know why.

### 12 · An object in state
**Goal.** Keep a student as one object in state: `{ name: 'Lukas', city: 'Pune', points: 0 }`. Three buttons: **+10 points**, **Move to Delhi** and **Add surname** (the name becomes `Lukas Rao`). Never change the old object, always make a **new** one with spread.

**What you should see.** After +10 twice and Move to Delhi: `City: Delhi · Points: 20`. After Add surname the heading says `Lukas Rao`. Real text:

```text
--- start ---
Lukas
City: Pune · Points: 0
+10 pointsMove to DelhiAdd surname
--- after +10 twice and Delhi ---
Lukas
City: Delhi · Points: 20
+10 pointsMove to DelhiAdd surname
--- after surname ---
Lukas Rao
City: Delhi · Points: 20
+10 pointsMove to DelhiAdd surname
```


<details><summary>Hint</summary>

`setStudent({ ...student, points: student.points + 10 })`. The spread copies the fields you are not changing, and the last key wins. `student.points += 10` would change the old object, and React would not notice.

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex12.jsx</code>)</summary>

```jsx
import { useState } from 'react'

export default function Ex12() {
  const [student, setStudent] = useState({ name: 'Lukas', city: 'Pune', points: 0 })

  return (
    <div className="card">
      <h3>{student.name}</h3>
      <p>
        City: {student.city} · Points: {student.points}
      </p>
      <button onClick={() => setStudent({ ...student, points: student.points + 10 })}>+10 points</button>
      <button onClick={() => setStudent({ ...student, city: 'Delhi' })}>Move to Delhi</button>
      <button onClick={() => setStudent({ ...student, name: 'Lukas Rao' })}>Add surname</button>
    </div>
  )
}
```

</details>

**Where this shows up.** A profile, a settings page, a form: one object with several fields, updated one field at a time.

### 13 · An array in state: add and remove
**Goal.** Priya's wishlist. One button per course (`Add React for Beginners`, ...) adds it to the wishlist, but the **same course cannot be added twice**. Every wishlist row has a **Remove** button. The heading shows the count, and an empty wishlist says `Nothing saved yet`.

**What you should see.** Steps: Add React, Add Python, Add React again (ignored), then Remove on the Python row. Real text:

```text
--- start ---
Courses
Add React for BeginnersAdd Python from ZeroAdd System DesignAdd DevOps Basics
Priya's wishlist (0)
Nothing saved yet
--- after adding React, Python, React again ---
Courses
Add React for BeginnersAdd Python from ZeroAdd System DesignAdd DevOps Basics
Priya's wishlist (2)
React for Beginners Remove
Python from Zero Remove
--- after removing Python ---
Courses
Add React for BeginnersAdd Python from ZeroAdd System DesignAdd DevOps Basics
Priya's wishlist (1)
React for Beginners Remove
```


<details><summary>Hint</summary>

Add with `[...wishlist, course]`, remove with `wishlist.filter((w) => w.id !== id)`. Never `push` or `splice`. To refuse a duplicate, check `wishlist.some((w) => w.id === course.id)` first and `return`.

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex13.jsx</code>)</summary>

```jsx
import { useState } from 'react'
import { courses } from '../courses'

export default function Ex13() {
  const [wishlist, setWishlist] = useState([])

  function add(course) {
    if (wishlist.some((w) => w.id === course.id)) return
    setWishlist([...wishlist, course])
  }

  function remove(id) {
    setWishlist(wishlist.filter((w) => w.id !== id))
  }

  return (
    <div>
      <div className="card">
        <h3>Courses</h3>
        {courses.map((c) => (
          <button key={c.id} onClick={() => add(c)}>
            Add {c.title}
          </button>
        ))}
      </div>
      <div className="card">
        <h3>Priya's wishlist ({wishlist.length})</h3>
        {wishlist.length === 0 && <p>Nothing saved yet</p>}
        <ul>
          {wishlist.map((w) => (
            <li key={w.id}>
              {w.title} <button onClick={() => remove(w.id)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
```

</details>

**Where this shows up.** Wishlists, favourites, a to-do list, selected tags: every list the user can add to and delete from.

### 14 · Update one item in an array
**Goal.** Rahul's checklist of four lessons, each with a `done` flag. The first starts as done. Every row shows `[x]` or `[ ]`, the title, and a button that says **Done** or **Undo**. A line at the top says `1 of 4 done`, worked out from the array.

**What you should see.** Click Done on lessons 2 and 3: `3 of 4 done`. Then Undo on lesson 1: `2 of 4 done`. Real text:

```text
--- start ---
Rahul's checklist
1 of 4 done
[x] What React is
Undo
[ ] Setting up your tools
Done
[ ] Components
Done
[ ] Props
Done
--- after finishing two more ---
Rahul's checklist
3 of 4 done
[x] What React is
Undo
[x] Setting up your tools
Undo
[x] Components
Undo
[ ] Props
Done
--- after Undo on the first ---
Rahul's checklist
2 of 4 done
[ ] What React is
Done
[x] Setting up your tools
Undo
[x] Components
Undo
[ ] Props
Done
```


<details><summary>Hint</summary>

Change one item with `map`: `lessons.map((l) => (l.id === id ? { ...l, done: !l.done } : l))`. Every other item is returned untouched. The "done" count is `lessons.filter((l) => l.done).length`, computed while rendering.

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex14.jsx</code>)</summary>

```jsx
import { useState } from 'react'

export default function Ex14() {
  const [lessons, setLessons] = useState([
    { id: 1, title: 'What React is', done: true },
    { id: 2, title: 'Setting up your tools', done: false },
    { id: 3, title: 'Components', done: false },
    { id: 4, title: 'Props', done: false },
  ])

  function toggle(id) {
    setLessons(lessons.map((l) => (l.id === id ? { ...l, done: !l.done } : l)))
  }

  const doneCount = lessons.filter((l) => l.done).length

  return (
    <div className="card">
      <h3>Rahul's checklist</h3>
      <p>
        {doneCount} of {lessons.length} done
      </p>
      {lessons.map((l) => (
        <div key={l.id} className="row">
          <span>
            {l.done ? '[x]' : '[ ]'} {l.title}
          </span>
          <button onClick={() => toggle(l.id)}>{l.done ? 'Undo' : 'Done'}</button>
        </div>
      ))}
    </div>
  )
}
```

</details>

**Where this shows up.** Marking an email as read, completing a to-do, liking one post in a feed.

### 15 · Lift the state up
**Goal.** Two sibling components need to share one fact: which course is selected. `CourseList` shows one button per course (the selected one is highlighted) and `CourseDetail` shows the details of the selected one (`Pick a course on the left` if none). Neither owns the state: the parent `Ex15` holds `selectedId` and passes it down, plus a function to change it.

**What you should see.** After clicking System Design, the detail card shows the title and `Rahul · 25 lessons · Rs 999`. Real text:

```text
--- start ---
React for BeginnersPython from ZeroSystem DesignDevOps Basics
Pick a course on the left
--- after System Design ---
React for BeginnersPython from ZeroSystem DesignDevOps Basics
System Design
Rahul · 25 lessons · Rs 999
```


<details><summary>Hint</summary>

Put `const [selectedId, setSelectedId] = useState(null)` in the **parent**. Pass `selectedId` to both children and `onSelect={setSelectedId}` to the list. The child calls `onSelect(c.id)` in its click handler. One source of truth, no copies.

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex15.jsx</code>)</summary>

```jsx
import { useState } from 'react'
import { courses } from '../courses'

function CourseList({ selectedId, onSelect }) {
  return (
    <div className="card">
      {courses.map((c) => (
        <button key={c.id} className={c.id === selectedId ? 'on' : ''} onClick={() => onSelect(c.id)}>
          {c.title}
        </button>
      ))}
    </div>
  )
}

function CourseDetail({ selectedId }) {
  const course = courses.find((c) => c.id === selectedId)
  if (!course) return <div className="card">Pick a course on the left</div>
  return (
    <div className="card">
      <h3>{course.title}</h3>
      <p>
        {course.teacher} · {course.lessons} lessons · {course.price === 0 ? 'Free' : 'Rs ' + course.price}
      </p>
    </div>
  )
}

export default function Ex15() {
  const [selectedId, setSelectedId] = useState(null)

  return (
    <div>
      <CourseList selectedId={selectedId} onSelect={setSelectedId} />
      <CourseDetail selectedId={selectedId} />
    </div>
  )
}
```

</details>

**Where this shows up.** A search box plus a results list, a filter bar plus a table, a tab bar plus its panel: any two parts that must agree.

---

## M05 · Lists, Conditions and Forms

### 16 · if, ternary and null
**Goal.** A small dashboard. When nobody is signed in it shows `Please sign in` and a button **Sign in as Lukas**, and nothing else (use an early `return`). When signed in it shows `Welcome back, Lukas`, a `Notifications` component (`You have 3 new notifications`, which returns `null` when the count is 0), buttons **Clear notifications** and **Sign out**, and a line chosen with a ternary: `Check your inbox` or `All caught up`.

**What you should see.** The steps are: Sign in, then Clear notifications, then Sign out. Real text:

```text
--- start ---
Please sign in
Sign in as Lukas
--- after sign in ---
Welcome back, Lukas
You have 3 new notifications
Clear notificationsSign out
Check your inbox
--- after clear ---
Welcome back, Lukas
Clear notificationsSign out
All caught up
--- after sign out ---
Please sign in
Sign in as Lukas
```


<details><summary>Hint</summary>

`if (!signedIn) { return (...) }` before the main `return`. In `Notifications`, `if (count === 0) return null`. A component that returns `null` draws nothing, and that is allowed.

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex16.jsx</code>)</summary>

```jsx
import { useState } from 'react'

function Notifications({ count }) {
  if (count === 0) return null
  return <p>You have {count} new notifications</p>
}

export default function Ex16() {
  const [signedIn, setSignedIn] = useState(false)
  const [notices, setNotices] = useState(3)

  if (!signedIn) {
    return (
      <div className="card">
        <p>Please sign in</p>
        <button onClick={() => setSignedIn(true)}>Sign in as Lukas</button>
      </div>
    )
  }

  return (
    <div className="card">
      <h3>Welcome back, Lukas</h3>
      <Notifications count={notices} />
      <button onClick={() => setNotices(0)}>Clear notifications</button>
      <button onClick={() => setSignedIn(false)}>Sign out</button>
      <p>{notices === 0 ? 'All caught up' : 'Check your inbox'}</p>
    </div>
  )
}
```

</details>

**Where this shows up.** Logged in or out, loading or loaded, empty or full: every screen asks one of these questions.

### 17 · The && and the 0 trap
**Goal.** A shop heading with a cart badge. Show `Cart: N` in a badge only when `N` is more than 0. Buttons **Add to cart** and **Remove one** (disabled at 0). From 3 items, `Bundle discount unlocked` appears. First try writing the badge as `{count && <span>...</span>}` and watch what the page shows at 0. Then fix it.

**What you should see.** At the start, only the heading and the buttons, and no `0` anywhere. After 3 adds the badge and the bundle message. Real text:

```text
--- start ---
Meera's shop
Add to cartRemove one
--- after 1 add ---
Meera's shop Cart: 1
Add to cartRemove one
--- after 3 adds ---
Meera's shop Cart: 3
Add to cartRemove one
Bundle discount unlocked
--- after removing all ---
Meera's shop
Add to cartRemove one
```


<details><summary>Hint</summary>

`0 && something` gives `0`, and React draws the number 0 on the page. Make the left side a real true or false: `count > 0 && <span>...</span>`.

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex17.jsx</code>)</summary>

```jsx
import { useState } from 'react'

export default function Ex17() {
  const [count, setCount] = useState(0)

  return (
    <div className="card">
      <h3>Meera's shop {count > 0 && <span className="badge">Cart: {count}</span>}</h3>
      <button onClick={() => setCount(count + 1)}>Add to cart</button>
      <button onClick={() => setCount(count - 1)} disabled={count === 0}>
        Remove one
      </button>
      {count >= 3 && <p className="ok">Bundle discount unlocked</p>}
    </div>
  )
}
```

</details>

**Where this shows up.** The famous bug where a stray `0` appears under a list that is empty. You will now spot it from across the room.

### 18 · Lists, keys and filtering
**Goal.** Show the four courses as cards, with three filter buttons: **All**, **Free** and **Paid** (the active one is highlighted). A line says how many courses are shown. The filter lives in state as one word (`'all'`, `'free'` or `'paid'`), and the shown list is **worked out** with `filter` while rendering.

**What you should see.** Steps: Free, then Paid. Real text:

```text
--- start ---
AllFreePaid
4 courses shown
React for Beginners
Meera · Rs 499
Python from Zero
Meera · Free
System Design
Rahul · Rs 999
DevOps Basics
Asha · Free
--- Free filter ---
AllFreePaid
2 courses shown
Python from Zero
Meera · Free
DevOps Basics
Asha · Free
--- Paid filter ---
AllFreePaid
2 courses shown
React for Beginners
Meera · Rs 499
System Design
Rahul · Rs 999
```


<details><summary>Hint</summary>

Do not keep a second array of "shown courses" in state. Compute `let shown = courses`, then `if (filter === 'free') shown = courses.filter((c) => c.free)`. The `key` is `c.id`, never the index.

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex18.jsx</code>)</summary>

```jsx
import { useState } from 'react'
import { courses } from '../courses'

export default function Ex18() {
  const [filter, setFilter] = useState('all')

  let shown = courses
  if (filter === 'free') shown = courses.filter((c) => c.free)
  if (filter === 'paid') shown = courses.filter((c) => !c.free)

  return (
    <div>
      <button className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>
        All
      </button>
      <button className={filter === 'free' ? 'on' : ''} onClick={() => setFilter('free')}>
        Free
      </button>
      <button className={filter === 'paid' ? 'on' : ''} onClick={() => setFilter('paid')}>
        Paid
      </button>
      <p>{shown.length} courses shown</p>
      {shown.map((c) => (
        <div key={c.id} className="card">
          <h3>{c.title}</h3>
          <p>
            {c.teacher} · {c.free ? 'Free' : 'Rs ' + c.price}
          </p>
        </div>
      ))}
    </div>
  )
}
```

</details>

**Where this shows up.** Every category tab, status filter and "show only unread" toggle.

### 19 · A controlled text input
**Goal.** A name box, a **Clear** button and a greeting that updates on every key press (`Hello, stranger!` while the box is empty). Add a line `Characters: 5 / 20` that turns red, with a message `Too long`, above 20 characters. The box must show what state holds, so the **Clear** button works by changing state.

**What you should see.** Typing `Lukas` gives `Hello, Lukas!` and `Characters: 5 / 20`. Typing a longer sentence shows the red warning. Real text:

```text
--- start ---
Clear
Hello, stranger!
Characters: 0 / 20
--- typed Lukas ---
Clear
Hello, Lukas!
Characters: 5 / 20
--- typed too many characters ---
Clear
Hello, Lukas from the allcsvideos class!
Characters: 32 / 20
Too long
```


<details><summary>Hint</summary>

`<input value={name} onChange={(e) => setName(e.target.value)} />`. If you write `value` without `onChange`, the box is frozen. The counter is `name.length`, worked out while rendering.

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex19.jsx</code>)</summary>

```jsx
import { useState } from 'react'

const LIMIT = 20

export default function Ex19() {
  const [name, setName] = useState('')

  return (
    <div className="card">
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
      <button onClick={() => setName('')}>Clear</button>
      <p>{name === '' ? 'Hello, stranger!' : 'Hello, ' + name + '!'}</p>
      <p className={name.length > LIMIT ? 'error' : ''}>
        Characters: {name.length} / {LIMIT}
      </p>
      {name.length > LIMIT && <p className="error">Too long</p>}
    </div>
  )
}
```

</details>

**Where this shows up.** Search-as-you-type, character limits on a bio, any field that must react to every letter.

### 20 · Checkbox, select and textarea
**Goal.** A review form with three controlled inputs: a **select** with the four courses, a **checkbox** `I finished this course`, and a **textarea** for a comment. Underneath, a **Preview** shows the chosen course title, `Finished` or `Still learning`, and the comment (`(none)` when empty). All of it updates live.

**What you should see.** Steps: choose System Design, tick the box, type `Great course, thank you Rahul`. Real text (the typed words sit in the textarea, so only the preview shows them):

```text
--- start ---
Write a review
React for Beginners
Python from Zero
System Design
DevOps Basics
 I finished this course
Preview
Course: React for Beginners
Status: Still learning
Comment: (none)
--- after filling all three ---
Write a review
React for Beginners
Python from Zero
System Design
DevOps Basics
 I finished this course
Preview
Course: System Design
Status: Finished
Comment: Great course, thank you Rahul
```


<details><summary>Hint</summary>

A checkbox uses `checked` and `e.target.checked`. The select and the textarea use `value` and `e.target.value`, just like a text box. A select hands back a **string**, so compare with `String(c.id) === courseId` when you look the course up.

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex20.jsx</code>)</summary>

```jsx
import { useState } from 'react'
import { courses } from '../courses'

export default function Ex20() {
  const [courseId, setCourseId] = useState('1')
  const [finished, setFinished] = useState(false)
  const [comment, setComment] = useState('')

  const course = courses.find((c) => String(c.id) === courseId)

  return (
    <div className="card">
      <h3>Write a review</h3>
      <select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>
      <div>
        <label>
          <input type="checkbox" checked={finished} onChange={(e) => setFinished(e.target.checked)} /> I finished this course
        </label>
      </div>
      <textarea rows="3" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Your comment" />
      <h3>Preview</h3>
      <p>Course: {course.title}</p>
      <p>Status: {finished ? 'Finished' : 'Still learning'}</p>
      <p>Comment: {comment === '' ? '(none)' : comment}</p>
    </div>
  )
}
```

</details>

**Where this shows up.** Settings pages, filters, surveys: the whole zoo of form controls, all fed by state.

### 21 · A form with validation
**Goal.** An enrol form with Name, Email and a checkbox `I accept the terms`. On **Submit** (the button and the Enter key, one `onSubmit` on the form, with `e.preventDefault()`) check three rules and show a red message next to the box that failed: name not empty, email contains `@`, terms ticked. When everything is fine, replace the form with `Thanks, Priya! You are enrolled.` Keep all three values in **one** state object with **one** `handleChange` that uses `[name]`.

**What you should see.** Steps: submit the empty form (three errors), type `Priya` and `priya.example.com` and submit (the email and terms errors remain, the name error is gone), then fix the email, tick the box and submit. Real text:

```text
--- start ---
Enrol in React for Beginners
 I accept the terms
Enrol
--- empty submit ---
Enrol in React for Beginners
Please enter your name
Email must contain @
 I accept the terms Please accept the terms
Enrol
--- missing @ and not agreed ---
Enrol in React for Beginners
Email must contain @
 I accept the terms Please accept the terms
Enrol
--- valid submit ---
Thanks, Priya! You are enrolled.
```


<details><summary>Hint</summary>

`setForm({ ...form, [name]: type === 'checkbox' ? checked : value })` with `const { name, type, value, checked } = e.target`. In `handleSubmit`, build a `found` object of messages, `setErrors(found)`, and only finish if `Object.keys(found).length === 0`. Without `preventDefault()` the page reloads and everything vanishes.

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex21.jsx</code>)</summary>

```jsx
import { useState } from 'react'

export default function Ex21() {
  const [form, setForm] = useState({ name: '', email: '', agree: false })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(null)

  function handleChange(e) {
    const { name, type, value, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const found = {}
    if (form.name.trim() === '') found.name = 'Please enter your name'
    if (!form.email.includes('@')) found.email = 'Email must contain @'
    if (!form.agree) found.agree = 'Please accept the terms'
    setErrors(found)
    if (Object.keys(found).length === 0) setDone(form.name.trim())
  }

  if (done) {
    return <p className="ok">Thanks, {done}! You are enrolled.</p>
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h3>Enrol in React for Beginners</h3>
      <div>
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>
      <div>
        <input type="text" name="email" value={form.email} onChange={handleChange} placeholder="Email" />
        {errors.email && <span className="error">{errors.email}</span>}
      </div>
      <div>
        <label>
          <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} /> I accept the terms
        </label>
        {errors.agree && <span className="error"> {errors.agree}</span>}
      </div>
      <button type="submit">Enrol</button>
    </form>
  )
}
```

</details>

**Where this shows up.** Sign-up, checkout, contact forms: every form on every site.

### 22 · Derived values, not extra state
**Goal.** A receipt with two lines (React for Beginners Rs 499, System Design Rs 999), each with **+** and **-** buttons for the quantity (the minus is disabled at 0). Show the line totals, `Seats: N` and `Total: Rs N`. The classic bug is to keep `total` in its own `useState` and forget to update it. Here, **only the items array is state**, and both totals are worked out while rendering.

**Starter code (the version that lies):**

```jsx
const [items, setItems] = useState([...])
const [total, setTotal] = useState(1498)   // a copy that goes stale
```

**What you should see.** Steps: + on React twice (quantity 3), then - on System Design (quantity 0). Real text:

```text
--- start ---
Receipt
React for Beginners x 1 = Rs 499
+
-
System Design x 1 = Rs 999
+
-
Seats: 2
Total: Rs 1498
--- React x3, System Design x0 ---
Receipt
React for Beginners x 3 = Rs 1497
+
-
System Design x 0 = Rs 0
+
-
Seats: 3
Total: Rs 1497
```


<details><summary>Hint</summary>

Ask before every `useState`: can I work this out from something I already have? Yes: `items.reduce((sum, i) => sum + i.price * i.qty, 0)`. The page can then never disagree with itself.

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex22.jsx</code>)</summary>

```jsx
import { useState } from 'react'

export default function Ex22() {
  const [items, setItems] = useState([
    { id: 1, title: 'React for Beginners', price: 499, qty: 1 },
    { id: 2, title: 'System Design', price: 999, qty: 1 },
  ])

  function change(id, diff) {
    setItems(items.map((i) => (i.id === id ? { ...i, qty: i.qty + diff } : i)))
  }

  // derived while rendering: no extra state
  const totalSeats = items.reduce((sum, i) => sum + i.qty, 0)
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <div className="card">
      <h3>Receipt</h3>
      {items.map((i) => (
        <div key={i.id} className="row">
          <span>
            {i.title} x {i.qty} = Rs {i.price * i.qty}
          </span>
          <button onClick={() => change(i.id, 1)}>+</button>
          <button onClick={() => change(i.id, -1)} disabled={i.qty === 0}>
            -
          </button>
        </div>
      ))}
      <p>Seats: {totalSeats}</p>
      <p>Total: Rs {total}</p>
    </div>
  )
}
```

</details>

**Where this shows up.** Totals, counts, "3 items left", filtered lists: derived values appear in every app, and stale copies are the source of many bugs.

---

## Combine: build a real piece of the site

### 23 · Mini cart (harder)
**Goal.** The allcsvideos shop. Four courses each with an **Add to cart** button. The cart shows one line per course (title, quantity, line price) with **+**, **-** (a line that reaches 0 disappears) and **Remove**, the **Total**, a **Clear cart** button, and `Your cart is empty` when it is empty. The heading shows a badge with the **number of seats** in the cart, only when it is more than 0. Adding a course that is already in the cart adds one to its quantity, it does not add a second line. Total and badge are derived.

**What you should see.** Steps: add React twice, System Design and Python, then `+` on System Design and Remove on Python, then `-` twice on React, then Clear cart. (The four shop rows are the same every time, so only the heading and the cart are shown below.) Real text:

```text
--- after 4 adds ---
Shop 4
Cart
React for Beginners x 2 = Rs 998
+
-
Remove
System Design x 1 = Rs 999
+
-
Remove
Python from Zero x 1 = Rs 0
+
-
Remove
Total: Rs 1997
Clear cart
--- after + on System Design and Remove on Python ---
Shop 4
Cart
React for Beginners x 2 = Rs 998
+
-
Remove
System Design x 2 = Rs 1998
+
-
Remove
Total: Rs 2996
Clear cart
--- after two - on React (line disappears) ---
Shop 2
Cart
System Design x 2 = Rs 1998
+
-
Remove
Total: Rs 1998
Clear cart
--- after Clear cart ---
Shop
Cart
Your cart is empty
```


<details><summary>Hint</summary>

Cart line = `{ id, title, price, qty }`. Add: `find` the line, then `map` to `qty + 1`, otherwise `[...cart, newLine]`. Minus: `map` and then `.filter((l) => l.qty > 0)`. Badge and total: `reduce`. Use `cart.length === 0 ? ... : ...` for the empty message, with a fragment `<>...</>` around the full cart.

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex23.jsx</code>)</summary>

```jsx
import { useState } from 'react'
import { courses } from '../courses'

export default function Ex23() {
  const [cart, setCart] = useState([])

  function add(course) {
    const found = cart.find((line) => line.id === course.id)
    if (found) {
      setCart(cart.map((line) => (line.id === course.id ? { ...line, qty: line.qty + 1 } : line)))
    } else {
      setCart([...cart, { id: course.id, title: course.title, price: course.price, qty: 1 }])
    }
  }

  function change(id, diff) {
    setCart(
      cart
        .map((line) => (line.id === id ? { ...line, qty: line.qty + diff } : line))
        .filter((line) => line.qty > 0),
    )
  }

  function remove(id) {
    setCart(cart.filter((line) => line.id !== id))
  }

  const seats = cart.reduce((sum, line) => sum + line.qty, 0)
  const total = cart.reduce((sum, line) => sum + line.price * line.qty, 0)

  return (
    <div>
      <h2>
        Shop {seats > 0 && <span className="badge">{seats}</span>}
      </h2>
      {courses.map((c) => (
        <div key={c.id} className="card row">
          <span>
            {c.title} · {c.price === 0 ? 'Free' : 'Rs ' + c.price}
          </span>
          <button onClick={() => add(c)}>Add to cart</button>
        </div>
      ))}
      <div className="card">
        <h3>Cart</h3>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <>
            {cart.map((line) => (
              <div key={line.id} className="row">
                <span>
                  {line.title} x {line.qty} = Rs {line.price * line.qty}
                </span>
                <button onClick={() => change(line.id, 1)}>+</button>
                <button onClick={() => change(line.id, -1)}>-</button>
                <button onClick={() => remove(line.id)}>Remove</button>
              </div>
            ))}
            <p>Total: Rs {total}</p>
            <button onClick={() => setCart([])}>Clear cart</button>
          </>
        )}
      </div>
    </div>
  )
}
```

</details>

**Where this shows up.** Literally the cart on every shop, including allcsvideos checkout.

### 24 · Filterable course list with an add-course form (harder)
**Goal.** A page with two cards. The first has a **search box** (matches the title, ignoring capitals), a **Free only** checkbox, the line `Showing N of M courses`, the list and `No courses match` when nothing is left. The second is a **form to add a course**: title, teacher (select with Asha, Meera, Rahul), lessons and price (number inputs). Validate: title not empty (`Title is required`), lessons more than 0, price not negative. A good course is added to the list and the form is cleared. The visible list is **derived** from the course list, the search and the checkbox.

**What you should see.** Steps: press Add course on the empty form (error), add `Git Basics` by Rahul with 8 lessons at Rs 299, search `git`, search `python` with Free only ticked, then `git` with Free only ticked. (The form and the list part are the same every time, so the long middle is shortened below.) Real text:

```text
--- empty form ---
Showing 4 of 4 courses
React for Beginners · Meera · 12 lessons · Rs 499
Python from Zero · Meera · 20 lessons · Free
System Design · Rahul · 25 lessons · Rs 999
DevOps Basics · Asha · 15 lessons · Free
Title is required
--- after adding Git Basics ---
Showing 5 of 5 courses
React for Beginners · Meera · 12 lessons · Rs 499
Python from Zero · Meera · 20 lessons · Free
System Design · Rahul · 25 lessons · Rs 999
DevOps Basics · Asha · 15 lessons · Free
Git Basics · Rahul · 8 lessons · Rs 299
--- search git ---
Showing 1 of 5 courses
Git Basics · Rahul · 8 lessons · Rs 299
--- search python + free only ---
Showing 1 of 5 courses
Python from Zero · Meera · 20 lessons · Free
--- search git + free only (no match) ---
Showing 0 of 5 courses
No courses match
```


<details><summary>Hint</summary>

State: `courses`, `search`, `freeOnly`, `form` (one object) and `error`. Not state: the visible list, the counts. `visible = courses.filter((c) => c.title.toLowerCase().includes(search.toLowerCase()) && (!freeOnly || c.free))`. Convert the form strings with `Number(...)` before adding. Inputs hand back strings, even `type="number"`.

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex24.jsx</code>)</summary>

```jsx
import { useState } from 'react'
import { courses as startCourses } from '../courses'

const emptyForm = { title: '', teacher: 'Asha', lessons: '', price: '' }

export default function Ex24() {
  const [courses, setCourses] = useState(startCourses)
  const [search, setSearch] = useState('')
  const [freeOnly, setFreeOnly] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (form.title.trim() === '') return setError('Title is required')
    if (form.lessons === '' || form.lessons <= 0) return setError('Lessons must be more than 0')
    if (form.price === '' || form.price < 0) return setError('Price cannot be negative')
    const price = Number(form.price)
    const course = {
      id: courses.length + 1,
      title: form.title.trim(),
      teacher: form.teacher,
      lessons: Number(form.lessons),
      price,
      free: price === 0,
    }
    setCourses([...courses, course])
    setForm(emptyForm)
    setError('')
  }

  const visible = courses.filter(
    (c) => c.title.toLowerCase().includes(search.toLowerCase()) && (!freeOnly || c.free),
  )

  return (
    <div>
      <div className="card">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search courses" />
        <label>
          <input type="checkbox" checked={freeOnly} onChange={(e) => setFreeOnly(e.target.checked)} /> Free only
        </label>
        <p>
          Showing {visible.length} of {courses.length} courses
        </p>
        {visible.length === 0 && <p>No courses match</p>}
        {visible.map((c) => (
          <div key={c.id}>
            {c.title} · {c.teacher} · {c.lessons} lessons · {c.free ? 'Free' : 'Rs ' + c.price}
          </div>
        ))}
      </div>
      <form className="card" onSubmit={handleSubmit}>
        <h3>Add a course</h3>
        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Title" />
        <select name="teacher" value={form.teacher} onChange={handleChange}>
          <option>Asha</option>
          <option>Meera</option>
          <option>Rahul</option>
        </select>
        <input type="number" name="lessons" value={form.lessons} onChange={handleChange} placeholder="Lessons" />
        <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price (Rs)" />
        <button type="submit">Add course</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  )
}
```

</details>

**Where this shows up.** Any admin page: a searchable table on top, a "create new" form below.

### 25 · Quiz (harder)
**Goal.** A three-question quiz for Priya. One question at a time with `Question 1 of 3`, three answer buttons, and after an answer: all answers are disabled, `Correct!` in green or `Not quite. The answer is: ...` in red, and a **Next question** button (the last one says **See result**). A `Score:` line counts the right answers. The end screen says `Priya scored 2 of 3` with a **Restart** button that goes back to question 1 and resets everything. State: the question index, the picked answer and the score.

**What you should see.** Steps: answer question 1 right, Next, answer question 2 wrong, Next, answer question 3 right, See result, Restart. Real text (the three answer buttons run together in the page text, which is only how the browser prints neighbouring buttons):

```text
--- start ---
Question 1 of 3
What does useState give you?
A memory for the componentA new HTML tagA CSS file
Score: 0
--- Q1 right ---
Question 1 of 3
What does useState give you?
A memory for the componentA new HTML tagA CSS file
Correct!
Next question
Score: 1
--- Q2 wrong ---
Question 2 of 3
Which prop does React need on every list row?
idkeyname
Not quite. The answer is: key
Next question
Score: 1
--- result ---
Priya scored 2 of 3
Restart
--- after Restart ---
Question 1 of 3
What does useState give you?
A memory for the componentA new HTML tagA CSS file
Score: 0
```


<details><summary>Hint</summary>

`picked` is `null` before an answer, so `picked !== null` means "answered". The finished screen is an early return when `index === questions.length`. Use the updater `setScore((s) => s + 1)` and reset **all three** states in Restart.

</details>

<details><summary>Solution (<code>solutions/src/exercises/Ex25.jsx</code>)</summary>

```jsx
import { useState } from 'react'

const questions = [
  { id: 1, text: 'What does useState give you?', options: ['A memory for the component', 'A new HTML tag', 'A CSS file'], answer: 0 },
  { id: 2, text: 'Which prop does React need on every list row?', options: ['id', 'key', 'name'], answer: 1 },
  { id: 3, text: 'What must onSubmit call to stop the page reloading?', options: ['e.preventDefault()', 'setState()', 'map()'], answer: 0 },
]

export default function Ex25() {
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState(null)
  const [score, setScore] = useState(0)

  if (index === questions.length) {
    return (
      <div className="card">
        <h2>
          Priya scored {score} of {questions.length}
        </h2>
        <button
          onClick={() => {
            setIndex(0)
            setPicked(null)
            setScore(0)
          }}
        >
          Restart
        </button>
      </div>
    )
  }

  const q = questions[index]

  function pick(i) {
    if (picked !== null) return
    setPicked(i)
    if (i === q.answer) setScore((s) => s + 1)
  }

  function next() {
    setIndex(index + 1)
    setPicked(null)
  }

  return (
    <div className="card">
      <p>
        Question {index + 1} of {questions.length}
      </p>
      <h3>{q.text}</h3>
      {q.options.map((o, i) => (
        <button key={o} disabled={picked !== null} className={picked === i ? 'on' : ''} onClick={() => pick(i)}>
          {o}
        </button>
      ))}
      {picked !== null && (
        <div>
          <p className={picked === q.answer ? 'ok' : 'error'}>
            {picked === q.answer ? 'Correct!' : 'Not quite. The answer is: ' + q.options[q.answer]}
          </p>
          <button onClick={next}>{index === questions.length - 1 ? 'See result' : 'Next question'}</button>
        </div>
      )}
      <p>Score: {score}</p>
    </div>
  )
}
```

</details>

**Where this shows up.** Quizzes, onboarding wizards, multi-step checkouts: one step index plus the answers collected so far. You built the Flashcard Quiz and the Study Planner this way too.

---

**Score yourself:** 20 to 25 working solutions means you are ready for Module 06. Under 15, rewatch the lessons named above the exercises you missed. Exercises 8, 11, 17 and 21 (the classic traps) are the best practice for everything that follows.

## What next

In **Module 06 · Plain CSS and CSS Modules** you stop using the plain styles in these exercises and learn to make your components look the way you want, without changing any of the logic you have just practised.
