# M03-L04 · Props

> Video: Module 3, Lesson 4. Watch it first, then follow along here.

## What you'll learn

- Props as an order slip: the details you hand to a component so it knows what to make
- How to pass props (fixed text in quotes, everything else in curly braces) and how to receive them (`props.title`, or unpacked in the round brackets)
- Passing separate props, one whole object, or spreading an object
- Default values for missing props
- Props are read-only: a component is a pure function of its props
- Props flow one way, from parent to child, and a prop can even be a function

## Before you start

- Node 24 (`node --version`). [M03-L01](../m03-l01-components-as-lego-bricks/) to [M03-L03](../m03-l03-javascript-inside-jsx/) first. You also use destructuring and spread from [M02-L02](../../m02-javascript-you-need-for-react/m02-l02-objects-arrays-destructuring-and-spread/).
- The finished project is `allcsvideos-web/` here (`npm install` inside it).
- No Docker needed.

## Files in this folder

| File or folder | What it is |
|----------------|------------|
| `allcsvideos-web/` | The Vite project at the end of the video (the last step: a prop that is a function) |
| `allcsvideos-web/src/components/` | `Header.jsx`, `CourseCard.jsx`, `Footer.jsx` |
| `allcsvideos-web/src/data/courses.js` | The four courses |
| `versions/00-same-card/` to `13-function-prop/` | One folder per step of the video. Each has the two files that change: `App.jsx` and `CourseCard.jsx` |

To follow a step, copy `App.jsx` from that folder over `src/App.jsx`, and `CourseCard.jsx` over `src/components/CourseCard.jsx`. Run the project with `npm run dev` inside `allcsvideos-web/` (port 5173 unless Vite says another).

## Follow along

### 1. The problem

Asha's page has four cards, one for each course in her data, but all four show React for Beginners with 12 lessons (`versions/00-same-card/`). In Lesson 1 the words were typed inside the card, and we said Lesson 4 makes each card different. One brick, one function, written once. How does it know which course to show? The answer is **props**.

### 2. The order slip

A pizza kitchen is always the same: the same oven, the same cook, the same recipe. But it does not make the same pizza every time, because every order comes with a paper slip: large with extra cheese, small with mushrooms. The kitchen does not decide what to cook; the slip does.

A component is the kitchen. **Props** (short for properties) are the order slip: the small bundle of details you hand to a component so that it knows what to make. A slip has labelled boxes with a value written in each. Three slips, three different cards, from the very same brick.

### 3. Handing over a slip

You already know how to give a tag extra information: an attribute, like the `id` on a button (M01-L02). Props use exactly the same shape (`versions/01-pass-props/App.jsx`):

```jsx
<CourseCard title="React for Beginners" lessons={12} />
<CourseCard title="Python from Zero" lessons={20} />
<CourseCard title="System Design" lessons={25} />
<CourseCard title="DevOps Basics" lessons={15} />
```

The rule between quotes and curly braces is the one from Lesson 3: fixed text goes in quotes. Anything that is not fixed text (a number, `true` or `false`, a list) goes in curly braces, the window into JavaScript.

Guess: I save the file. What does the page show now? Nothing changed: still React for Beginners, four times. The slips were delivered, but the card never opened them: it still has the title typed inside.

### 4. Reading the slip

A component is a function, and a function receives its inputs in its round brackets. React calls the function for you and hands it the whole slip as one single object. Give it a name, `props`, and print it (`versions/02-log-props/CourseCard.jsx`):

```jsx
function CourseCard(props) {
  console.log(props)
  return (
    <div className="card">
      <h2>React for Beginners</h2>
      <p>12 lessons</p>
    </div>
  )
}
```

The browser console shows four objects:

```text
{title: React for Beginners, lessons: 12}
{title: React for Beginners, lessons: 12}
{title: Python from Zero, lessons: 20}
{title: Python from Zero, lessons: 20}
...
```

Each one appears twice because in development React calls every component two times, on purpose, to catch mistakes (Module 7, Lesson 2 explains why). On the finished website it is only once.

So `props` is a normal object, and you know how to read an object: a dot and the key (`versions/03-props-dot/CourseCard.jsx`):

```jsx
function CourseCard(props) {
  return (
    <div className="card">
      <h2>{props.title}</h2>
      <p>{props.lessons} lessons</p>
    </div>
  )
}
```

Four different cards:

```text
React for Beginners | 12 lessons
Python from Zero | 20 lessons
System Design | 25 lessons
DevOps Basics | 15 lessons
```

One brick, four slips, four cards: the promise from Lesson 1 is kept. Now an experiment: change the first slip to `lessons={13}` (`versions/03b-first-card-13/`). Only the first card changes, to `13 lessons`. Each card reads only its own slip.

### 5. Unpack the slip in the round brackets

Writing `props.` again and again gets tiring. In M02-L02 you saw a function with curly braces inside its round brackets. Now you know how those inputs get in (`versions/04-destructure/CourseCard.jsx`):

```jsx
function CourseCard({ title, lessons }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{lessons} lessons</p>
    </div>
  )
}
```

Read it as: from the slip, take out `title` and `lessons`. The page is exactly the same. This is how almost every React component is written. **The names in the curly braces must match the names on the slip, with the same spelling.**

### 6. Three ways to pass more data

A real card needs more details: add the teacher. Now every slip has three boxes (`versions/05-teacher-typed/`):

```jsx
<CourseCard
  title="React for Beginners"
  teacher="Meera"
  lessons={12}
/>
```

and the card unpacks three names and shows `by {teacher}` under the title. But twenty lines of props typed by hand, when the data already exists in `courses.js`, is the copy-and-paste problem again. So pass the data itself.

**Way 1: the whole object** (`versions/06-whole-course/`). `courses.map` (Lesson 3) gives one course at a time, and we hand over the whole course as a single prop named `course`. The `key` is React's own name tag:

```jsx
{courses.map(course => (
  <CourseCard key={course.id} course={course} />
))}
```

The slip now has one box with the whole object in it, so inside the card you write `course.title`, `course.teacher`, `course.lessons`:

```jsx
function CourseCard({ course }) {
  return (
    <div className="card">
      <h2>{course.title}</h2>
      <p>by {course.teacher}</p>
      <p>{course.lessons} lessons</p>
    </div>
  )
}
```

**Way 2: spread** (`versions/07-spread/`). The three dots from M02-L02 take every key of the object and pass each as its own prop:

```jsx
{courses.map(course => (
  <CourseCard key={course.id} {...course} />
))}
```

Now the card unpacks `{ title, teacher, lessons }` directly. The card simply ignores the other keys it receives: `id`, `price` and `free`. The page is the same in all three ways:

```text
React for Beginners | by Meera | 12 lessons
Python from Zero | by Meera | 20 lessons
System Design | by Rahul | 25 lessons
DevOps Basics | by Asha | 15 lessons
```

Which is better? Passing the whole object has a short call and it is always clear where the data comes from (`course.title`), but the card repeats `course.` and works only for a course object. Spread gives the card clean names and works with any props, even typed by hand, but the call hides what is passed and it passes everything, even what the card never uses. Both are common. A good start: pass the whole object when the card is about one course; use plain props or spread when the card should work with any values.

### 7. Default values

Sometimes a slip is incomplete. In `versions/08a-level-missing/` the card shows a level line, and only the System Design card gets a level, `Advanced`:

```jsx
<CourseCard title="React for Beginners" lessons={12} />
<CourseCard title="System Design" lessons={25} level="Advanced" />
```

```jsx
function CourseCard({ title, lessons, level }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{lessons} lessons</p>
      <p>Level: {level}</p>
    </div>
  )
}
```

Guess: what does the first card show after `Level:`? Nothing:

```text
React for Beginners | 12 lessons | Level:
System Design | 25 lessons | Level: Advanced
```

A prop nobody passed is not an error: it is `undefined`, and React draws nothing for `undefined`. A card that says `Level:` with an empty space looks broken. The fix is a **default value** (`versions/08b-level-default/CourseCard.jsx`):

```jsx
function CourseCard({ title, lessons, level = 'Beginner' }) {
```

```text
React for Beginners | 12 lessons | Level: Beginner
System Design | 25 lessons | Level: Advanced
```

A default is only used when the prop is missing.

### 8. Props are read-only

The most important rule: a component may read its props, but it must never change them. The waiter writes the slip; the cook can read it but must not cross out the customer's order and write another. If the slip needs to change, the person who wrote it writes a new one.

Break the rule (`versions/09-change-prop-error/CourseCard.jsx`):

```jsx
function CourseCard(props) {
  props.lessons = 99
  return (
```

Guess what the page shows. A blank page, and in the console a red error:

```text
Cannot assign to read only property 'lessons' of object '#<Object>'
```

In development React locks the props object, so any attempt to write into it fails. The card cannot rewrite its slip, but it can make new values from it (`versions/10-bonus-new-variable/CourseCard.jsx`):

```jsx
function CourseCard({ title, lessons }) {
  const withBonus = lessons + 1
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{withBonus} lessons</p>
    </div>
  )
}
```

The slip is untouched and the page shows `13`, `21`, `26` and `16` lessons.

There is a name for this idea: a **pure function**. It only reads what it is given, never changes it, and gives the same answer for the same input. A component should be a pure function of its props: the same slip always gives the same card. That is also a hint about the double call you saw earlier: React can call a component twice because both calls must give the same card. And if something really has to change while the user clicks? That is not a prop's job. It needs another tool called **state**, in Module 4.

### 9. A prop can be a function

A prop can hold any value: text, a number, `true` or `false`, a list, a whole object, and even a function. In `versions/13-function-prop/` (and `allcsvideos-web/`) the card receives a prop called `onEnroll`, and the value is a function, `handleEnroll`:

```jsx
function handleEnroll() {
  console.log('enrolled')
}

function App() {
  return (
    <main className="page">
      <Header />
      <CourseCard title="React for Beginners" lessons={12} onEnroll={handleEnroll} />
      <Footer />
    </main>
  )
}
```

```jsx
function CourseCard({ title, lessons, onEnroll }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{lessons} lessons</p>
      <button className="enroll" onClick={onEnroll}>Enroll</button>
    </div>
  )
}
```

This is how a card can tell its parent "somebody pressed Enroll". Do not worry about how it works yet: Module 4, Lesson 1 teaches it. Just remember that a prop can be a function too.

### 10. The whole journey

`App` is the parent. It owns the data and creates four course cards, its children. Each slip leaves `App`, goes down the wire and arrives in exactly one card:

```text
App (owns the data)
├── CourseCard  <- { title: 'React for Beginners', lessons: 12 }
├── CourseCard  <- { title: 'Python from Zero',    lessons: 20 }
├── CourseCard  <- { title: 'System Design',       lessons: 25 }
└── CourseCard  <- { title: 'DevOps Basics',       lessons: 15 }
```

Props flow in one direction only: from a parent down to its children. A card cannot send anything up through its props, and one card cannot change the slip of the card next to it. That keeps a page easy to follow. If a card shows something wrong, look at the slip it was given, one level up. How a child talks back to its parent comes in Module 4.

## Common mistakes

**1. Forgetting the curly braces when you unpack** (`versions/12-no-curly-braces/CourseCard.jsx`: `function CourseCard(title, lessons)`). React still hands over the whole slip as the first thing, so `title` is the entire props object. The page is blank and the console says:

```text
Objects are not valid as a React child (found: object with keys {title, lessons}). If you meant to render a collection of children, use an array instead.
```

The same error as in Lesson 3. When you see it, check the curly braces in the round brackets.

**2. Numbers in quotes** (`versions/11-number-in-quotes/App.jsx`: `lessons="12"`). By Lesson 3's rule quotes mean fixed text, and the card shows `lessons + 1`. Guess what the first card shows: `121 lessons`. Twelve as text, plus one, glues the characters together instead of adding. No error, only a wrong number:

```text
React for Beginners | 121 lessons
Python from Zero | 201 lessons
System Design | 251 lessons
DevOps Basics | 151 lessons
```

The fix: numbers go in curly braces.

**3. Changing a prop.** Props are read-only. Make a new variable instead.

Interview tip. If Rahul, an interviewer, asks "can a component change its own props?": no. Props are read-only. They belong to the parent, and a component should be a pure function of its props. Anything that must change over time is state.

## Try it yourself

Add a prop called `level` to your own course cards, with a default value, and give a different level to one of the cards.

## Clean up

Press `Ctrl+C` to stop the dev server. If you ran `npm install` in this repo's `allcsvideos-web`, delete its `node_modules` and `dist` folders when you are done.

## Next

[M03-L05 · Children and Composition](../m03-l05-children-and-composition/): how to hand a whole piece of the page to a component, not only a small value.
