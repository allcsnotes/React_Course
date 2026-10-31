# M04-L01 · Handling Events

> Video: Module 4, Lesson 1. Watch it first, then follow along here.

## What you'll learn

- What an event is and what a handler is (`onClick`, `onChange`, `onMouseEnter`, `onSubmit`)
- Pass the function, never call it: `onClick={enroll}`, not `onClick={enroll()}`
- How to pass an argument with an arrow function, and what the event object `e` gives you
- `e.preventDefault()` for forms
- Handler names (`handleEnroll`) and function props (`onEnroll`): how a child talks to its parent
- Why a handler that changes a plain variable does not redraw the page (state comes next)

## Before you start

- Node 24 (`node --version`). Module 3 first, especially [M03-L04 · Props](../../m03-jsx-and-components/m03-l04-props/) and the project from [M03-B01](../../m03-jsx-and-components/m03-b01-build-a-course-card-gallery/).
- The project of this lesson is `allcsvideos-web/` here (`npm install` inside it). It ends on the good version of the last teaching step (step 8), not on the mistakes that follow it.
- You use the browser console a lot in this lesson (right-click, **Inspect**, **Console**).
- No Docker needed.

## Files in this folder

| File or folder | What it is |
|----------------|------------|
| `allcsvideos-web/` | The Vite project. `src/App.jsx` makes one card per course and passes a handler; `src/CourseCard.jsx` announces the click |
| `allcsvideos-web/src/data/courses.js` | The four courses |
| `versions/01-nothing-happens/` to `12-string-handler/` | One folder per step of the video. Each has `App.jsx` and, where it changes, `CourseCard.jsx` |

To follow a step, copy every file of that folder over the files in `allcsvideos-web/src/`, save, and watch the browser and its console. Run the project with `npm run dev` inside `allcsvideos-web/` (port 5173 unless Vite says another).

## Follow along

### 1. The silent button

Two course cards, an Enroll button on each. Lukas clicks Enroll. Nothing happens. He clicks again. Still nothing. The button looks like a button but it is only a drawing (`versions/01-nothing-happens/`). At the end of Module 3 we promised the cards would react to clicks. Today we keep that promise.

### 2. What is an event?

A doorbell: a visitor presses the button, a bell rings inside the house, and a person walks to the door. A web page works the same way. The user presses a button and the browser rings a bell. That bell is an **event**: something that happens on the page, like a click. The function that answers it is a **handler**: it waits quietly and runs only when the bell rings.

Events come in many kinds: a click, typing in a box, the mouse moving onto something, sending a form. In React each kind has a name that starts with `on`: `onClick`, `onChange`, `onMouseEnter`, `onSubmit`. Notice the capital letter in the middle: the same camelCase as `className` (M03-L02). The recipe is always the same: pick the event, write the handler, and give the handler to the element as an attribute, like a prop.

### 3. Your first handler

`versions/02-handler/CourseCard.jsx`: a function `enroll` inside the card, and one new attribute on the button.

```jsx
function CourseCard({ course }) {
  function enroll() {
    console.log('Enroll clicked')
  }

  return (
    <div className="card">
      <h2>{course.title}</h2>
      <p>{course.lessons} lessons</p>
      <button onClick={enroll}>Enroll</button>
    </div>
  )
}

export default CourseCard
```

`onClick={enroll}`: only the name of the function, no brackets. Guess: Lukas clicks the first Enroll. What does the page show and what does the console print? Real result: the console prints

```text
Enroll clicked
```

and the page looks exactly the same as before (more on that in step 9). Click again and a second line appears. Every click runs the function once. It did not run when the page loaded; it waited, like the person behind the door, until the bell rang.

### 4. The trap: calling the function

Look carefully at `versions/03-calling-the-function/CourseCard.jsx`:

```jsx
<button onClick={enroll()}>Enroll</button>
```

It looks harmless, even more correct, because round brackets are how you run a function (Module 2). Passing the function is like handing the doorman a card with instructions: when the bell rings, do this. Calling the function is like cooking the meal right now, before anyone has rung anything. **Round brackets mean "run it now".** So React does not receive the function; it receives whatever the function gives back, and the function has already run while the page was being drawn.

Guess: what does the console show when the page loads, before anyone clicks? Real result:

```text
Enroll clicked
Enroll clicked
Enroll clicked
Enroll clicked
```

Four times, with nobody clicking: there are two cards, and in development each card is drawn twice (M03-L04). Now Lukas clicks the button: nothing new appears. The button never got a handler; it got what `enroll` gave back, which is nothing. So the message came at the wrong time and the real click is silent. The fix: remove the brackets. **In an event attribute, write the name of the function, never a call.** It is the quietest mistake of all: there is no error and no warning.

### 5. Passing an argument

Which course did Lukas click? The card knows its course. `enroll` now takes a `title` (`versions/04-arrow-function-argument/CourseCard.jsx`):

```jsx
function enroll(title) {
  console.log('Enrolling in ' + title)
}
...
<button
  onClick={() => enroll(course.title)}
>
  Enroll
</button>
```

The tempting line is `onClick={enroll(course.title)}`, but that is the same trap: brackets mean "run it now". The cure is a tiny function that waits: an arrow function with no parameters that calls `enroll` later. Read it as "when the click comes, run this little function". Click the first card, then the second:

```text
Enrolling in React for Beginners
Enrolling in Python from Zero
```

One handler, a different title each time, because every button got its own little arrow function. The console stayed empty until the first click: the call waited.

### 6. The event object

React always hands a handler one thing for free: the **event object**, a small note describing what just happened. It arrives as the first parameter, usually named `e`. `versions/05-event-object/` prints it:

```jsx
function enroll(e) {
  console.log(e)
}
```

```text
SyntheticBaseEvent {...}
```

That is React's wrapper around the browser's own click, with a lot inside it. Do not worry about the long name. Two things matter most (`versions/05b-type-and-target/`): `e.type` is the kind of event, and `e.target` is the element that was clicked.

```jsx
function enroll(e) {
  console.log(e.type)
  console.log(e.target.textContent)
}
```

```text
click
Enroll
```

### 7. Other events: typing and hovering

Every other event works the same way. In a search box, `onChange` fires every time the content changes, so it fires on every key (`versions/06-onchange-typing/App.jsx`):

```jsx
function handleChange(e) {
  console.log(e.target.value)
}

function App() {
  return (
    <div className="page">
      <input
        className="search"
        placeholder="Search courses"
        onChange={handleChange}
      />
    </div>
  )
}
```

`e.target.value` is the text in the box right now. Lukas types his name, one letter at a time:

```text
L
Lu
Luk
Luka
Lukas
```

Five keys, five lines. Another event, `onMouseEnter` (`versions/07-mouse-enter/App.jsx`), fires once when the pointer arrives:

```jsx
<div
  className="card"
  onMouseEnter={handleEnter}
>
```

Move the mouse onto the card:

```text
mouse entered the card
```

One line, printed the moment the pointer arrived. No click needed.

### 8. Forms: preventDefault

A form is a box with fields and a Send button, and `onSubmit` happens when the form is sent. Forms get a whole lesson in Module 5; today we need one small fact. `versions/08-submit-reloads/App.jsx`:

```jsx
function handleSubmit() {
  console.log('submitted')
}

function App() {
  return (
    <div className="page">
      <form onSubmit={handleSubmit}>
        <input name="name" />
        <button>Send</button>
      </form>
    </div>
  )
}
```

Type a name and press Send. The console prints `submitted`, and then the whole page reloads. Look at the address: `?name=Lukas` has appeared, and the box is empty again:

```text
http://localhost:5173/?name=Lukas
```

That is how browsers used to send a form: they leave the page, and the console is cleared. React apps do not want to leave the page. The event object has a method for this, `preventDefault`: it tells the browser "do not do your usual thing, I will take care of it". One line at the top of the handler (`versions/08b-prevent-default/App.jsx`):

```jsx
function handleSubmit(e) {
  e.preventDefault()
  console.log('submitted')
}
```

Type the name and press Send. The console prints `submitted`, and this time the page stays, with the name still in the box. You will use this line in every form in Module 5.

### 9. The handler lives in the parent

So far each card handled its own click. In a bigger app, the page decides what enrolling means: save it, send it to a server, count it. The card should only say "somebody pressed Enroll". So the handler lives in `App` and travels down to the card as a prop that holds a function (the preview from M03-L04). `versions/09-handler-as-prop/App.jsx`, also `allcsvideos-web/src/App.jsx`:

```jsx
import courses from './data/courses.js'
import CourseCard from './CourseCard.jsx'

function handleEnroll(title) {
  console.log('Enrolling in ' + title)
}

function App() {
  return (
    <div className="page">
      {courses.map(course => (
        <CourseCard
          key={course.id}
          course={course}
          onEnroll={handleEnroll}
        />
      ))}
    </div>
  )
}

export default App
```

Look at the two names. `handleEnroll` is what we do. `onEnroll` is the moment the card announces. **The convention: handlers are named `handleSomething`, and function props are named `onSomething`**, just like `onClick`. And the card (`CourseCard.jsx`):

```jsx
function CourseCard({ course, onEnroll }) {
  return (
    <div className="card">
      <h2>{course.title}</h2>
      <button
        onClick={() => onEnroll(course.title)}
      >
        Enroll
      </button>
    </div>
  )
}
```

The card does not know what enrolling means; it only announces it. Click the first card and then the last:

```text
Enrolling in React for Beginners
Enrolling in DevOps Basics
```

One handler, in one place, used by every card. That is how a child talks to its parent: **data flows down as props, events flow up through function props.**

### 10. An honest moment: the page does not change

We can handle clicks. But a handler still cannot change the page. The card gets a variable `enrolled` that starts as `false`; the handler sets it to `true` and prints it; the button says `Enrolled` if `enrolled` is true, otherwise `Enroll` (`versions/10-variable-does-not-redraw/CourseCard.jsx`):

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
```

Guess: Lukas clicks Enroll. What does the console print and what does the button say? The console says `enrolled is true`; the variable really changed. But the button still says `Enroll`. The page did not change at all.

Why? React draws the screen when it runs the component function. A handler that changes a variable does not run the function again, so nothing is drawn again and the old picture stays. The page needs a memory that React watches, so that when it changes React draws the component again. That memory is called **state**. Giving a component memory is the next lesson, [M04-L02](../m04-l02-usestate-giving-a-component-memory/).

## Common mistakes

**1. A small letter** (`versions/11-lowercase-onclick/`). In plain HTML it is `onclick`, all lowercase. In JSX that is not an event name. React tells you in the console and even suggests the fix:

```text
Invalid event handler property `onclick`. Did you mean `onClick`?
```

**2. Quotes** (`versions/12-string-handler/`, `onClick="enroll"`). In HTML you write a string after `onclick`. In JSX a string is not a function. React complains twice when the page loads, and when someone clicks it throws:

```text
Expected `onClick` listener to be a function, instead got a value of `string` type.
```

Both fixes are the same: a capital C, and curly braces with a function inside. And remember the trap with the brackets (`onClick={enroll()}`): the quietest of all, with no error and no warning.

Interview tip. If Rahul, an interviewer, asks the difference between `onClick={handler}` and `onClick={handler()}`: the first passes the function, so React calls it when the click happens. The second calls it right away, while rendering, and passes its return value instead, which is usually `undefined`.

## Try it yourself

Add a Details button to the card with a handler that prints the course title. Then add a text box that prints every letter you type.

## Clean up

Press `Ctrl+C` to stop the dev server. If you ran `npm install` in this repo's `allcsvideos-web`, delete its `node_modules` and `dist` folders when you are done.

## Next

[M04-L02 · useState: Giving a Component Memory](../m04-l02-usestate-giving-a-component-memory/): a function called `useState`. The screen will finally change when you click.
