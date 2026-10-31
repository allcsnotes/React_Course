# M04-L03 · How Rendering Works

> Video: Module 4, Lesson 3. Watch it first, then follow along here.

## What you'll learn

- The three steps of every update: trigger, render, commit
- Why "render" means React calls your function, and does not mean painting the screen
- How to watch the commit change only one piece of the page
- State is a snapshot: `setCount` never changes the `count` you are holding in this render
- Why `setCount(count + 1)` three times adds only one, and how the updater form `setCount(c => c + 1)` fixes it
- Why an alert one second later still shows the old value

## Before you start

- Node 24 (`node --version`). [M04-L02](../m04-l02-usestate-giving-a-component-memory/) first.
- The project of this lesson is `allcsvideos-web/` here (`npm install` inside it). It ends on the "add three" counter with the updater form.
- You use the browser console (right-click, **Inspect**, **Console**).
- No Docker needed.

## Files in this folder

| File or folder | What it is |
|----------------|------------|
| `allcsvideos-web/` | The Vite project. `src/Counter.jsx` is the fixed add-three counter; `Heading.jsx` and `App.jsx` support the render demo |
| `versions/00-blank-counter/` to `06-alert-after-one-second/` | One `Counter.jsx` per step of the video (`01-render-logs/` also has `Heading.jsx`) |
| `console/spy.js` | A "spy" to paste into the browser console: it prints one line for every change on the page |
| `console/before.js`, `console/after.js` | Save three things from the page, then check that they are still the same objects |

To follow a step, copy the files of that folder over `allcsvideos-web/src/`. Start the project with `npm run dev` inside `allcsvideos-web/` (port 5173 unless Vite says another).

## Follow along

### 1. The mystery of "add three"

Asha tries a button called Add 3 on the allcsvideos counter (`versions/03-add-three-plain/Counter.jsx`). Three lines, and each adds one, so one click should add three:

```jsx
function addThree() {
  setCount(count + 1)
  setCount(count + 1)
  setCount(count + 1)
}
```

Guess: count is 0, she clicks once. What does the page show? Click: `Count: 1`. Not 3. She clicks again: `Count: 2`. Not 6. Is React broken? No. The code does exactly what it was told. To see why, you need to know what React does every time something changes, and what state really is.

### 2. Trigger, render, commit

A restaurant, in three steps, always in the same order. **One:** you place the order; the waiter writes a ticket (nothing is cooked yet). **Two:** the kitchen; the cook reads the ticket and prepares the dish (ready, but still in the kitchen). **Three:** the waiter serves, and a good waiter does not rebuild your whole table: if you only ordered a new drink, only the drink arrives.

In Lesson 2 the loop was click, `setCount`, draw again. Inside that loop React does three steps every time the screen needs to change:

1. **Trigger.** Something asks for a new screen: the first time the page loads, or a state change like a click that calls `setCount`.
2. **Render.** React calls your component function and your function returns JSX, a description of what the screen should look like. That is the cook. Nothing on the page has changed yet.
3. **Commit.** React compares the new description with the old one and changes only the parts of the real page that are different. That is the waiter.

### 3. Watching the render

`versions/01-render-logs/Counter.jsx` has one new line that prints a message every time the function runs:

```jsx
import { useState } from 'react'
import Heading from './Heading.jsx'

function Counter() {
  const [count, setCount] = useState(0)
  console.log('Counter render', count)

  function add() {
    setCount(count + 1)
  }

  return (
    <div className="box">
      <Heading />
      <p className="num">Count: {count}</p>
      <button onClick={add}>Add 1</button>
    </div>
  )
}

export default Counter
```

`Heading.jsx` also logs, with `console.log('Heading render')`, and returns `<h2>Counter</h2>`. Copy `Counter.jsx` and `Heading.jsx` from that folder. Save. The page loads for the first time: that is the trigger. The console:

```text
Counter render 0
Heading render
```

The first message is the render step: React called `Counter`. Then `Heading` ran too, because when React renders a component it renders every component inside it. (Each message appears twice in the real console. That is strict mode from `main.jsx` in M01-L04: in development React calls every component twice on purpose, to catch mistakes. Module 7 explains it. From now on each message is shown once.) Click Add 1, a new trigger:

```text
Counter render 1
Heading render
```

React called `Counter` again, and this time `useState` gave back 1. `Heading` rendered again even though it never changes. So "render" only means React called your function. It says nothing yet about the page.

### 4. Watching the commit

To see the commit you need a spy. In the browser console paste `console/spy.js` (a mutation observer: you do not need every word; it prints one line every time something on the page changes):

```js
const spy = new MutationObserver(list => {
  for (const m of list) {
    console.log(m.type, m.target.nodeName)
  }
})
const options = { subtree: true,
  childList: true, characterData: true,
  attributes: true }
spy.observe(document.body, options)
```

Before the next click, paste `console/before.js` to save three things from the page in variables: the heading, the paragraph, and the small piece of text that holds the number (the text of a page is an object too, in the DOM from M01-L02):

```js
const h = document.querySelector('h2')
const p = document.querySelector('p')
const digits = p.lastChild
```

Click Add 1 again (the count goes from 1 to 2). The console prints the render messages first, because React called both functions, and then the spy prints exactly one line:

```text
Counter render 2
Heading render
characterData #text
```

One change, on a text node: the text of the number. Is it the same heading as before? Paste `console/after.js`:

```js
h === document.querySelector('h2')
p === document.querySelector('p')
digits === p.lastChild
digits.data
```

```text
true
true
true
'2'
```

The very same objects; only the data inside the last one changed. That is the commit. React did not rebuild the page: it compared the new description with the old one, found one difference, and changed that one piece of text (the idea from M01-L01; how React finds the difference is Module 14). Render can run again and again; it is only function calls. The commit is the step that touches the page, and it touches as little as possible.

### 5. State is a snapshot

Think of a photograph. React keeps the sticky note (Lesson 2) outside your function. Every time React renders it reads the note and takes a photo of your component. In this photo `count` is 0, and so is the text on the screen, the handler, everything in this render. It stays 0 for as long as this render exists. A click does not edit the old photo; it asks for a new one. In the next render `useState` gives back 1 and a new photo is taken.

Test it with real code (`versions/02-state-is-a-snapshot/Counter.jsx`):

```jsx
function handleClick() {
  setCount(count + 1)
  console.log('count is', count)
}
```

Guess: click once, at count 0. What does the console print on the second line? The page shows 1, but the console says:

```text
count is 0
Counter render 1
```

`setCount` did not change the variable `count`: this photo is finished. It only asked React for a new render. Look at the order: the handler ran first and printed 0 from the old photo; only after that came `Counter render 1` from the new photo.

**Rule one: calling `setCount` never changes the `count` you are holding in this render. It asks for the next render.**

### 6. Solving the mystery

`count` is 0 in this photo, and all three lines of the handler live in this photo. Line one: `setCount(count + 1)` is 0 + 1, so 1. Line two: `count` is still 0, so again 1. Line three: 1 again. Think of each call as writing a note and dropping it in a box. Each says "make the count 1". React waits until the handler has finished, reads the notes in order ("make it 1", "make it 1", "make it 1"), and renders once with `count` equal to 1. React did not ignore two of your lines: three copies of the same note are no better than one note.

### 7. The updater function

We need a different kind of note: not "make the count 1" but "take whatever the count is at that moment and add one". In code, that note is a **function**. Give `setCount` a function instead of a value (`versions/04-add-three-updater/Counter.jsx`, also `allcsvideos-web/src/Counter.jsx`):

```jsx
function addThree() {
  setCount(c => c + 1)
  setCount(c => c + 1)
  setCount(c => c + 1)
}
```

`c` is a name you choose for the number the function receives. It reads "give me the current count and I give back the next one". This is an **updater function**. React keeps the functions in the box, and when the handler has finished it runs them in order, handing each the result of the one before: 0 becomes 1, then 2, then 3. Click, and the page shows `Count: 3`. Click again, `Count: 6`. The console:

```text
Counter render 3
Counter render 6
```

Only one render for each click, not three: React waits until the handler is finished and then renders once. You can mix both kinds of notes (`versions/05-mixed-notes/Counter.jsx`):

```jsx
function addSix() {
  setCount(count + 5)
  setCount(c => c + 1)
}
```

The first is a plain note: replace the count with 5. The second is a function note: take 5 and add one. Click: `Count: 6`. **A plain value means "replace". A function means "take what you have and change it".**

### 8. The photo and timers

Asha wants a message one second after the click (`versions/06-alert-after-one-second/Counter.jsx`):

```jsx
function handleClick() {
  setCount(count + 1)
  setTimeout(() => {
    alert('count was ' + count)
  }, 1000)
}
```

Guess: count is 0, she clicks. One second later, what number does the alert say? The page shows 1 right away, and one second later the alert says:

```text
count was 0
```

The timer function was created in the render where `count` was 0, so it carries that photo with it. The screen moved on to 1, but that timer is still looking at the old picture. Every render has its own `count`, its own handlers and its own timers. Nothing in a render ever changes after the render. A new state means a new render with all-new things.

### 9. When to use the updater form

- If the new value is built from the old value (a counter, the number of likes), write the function: `setCount(c => c + 1)`.
- If the new value does not depend on the old one, pass the value itself: `setCount(0)` to reset, or the text the user typed.
- If you set the state only once in a handler, `count + 1` works too (you saw it in Lesson 2). But the function form is never wrong, so many developers use it every time the new value is built from the old one.

## Common mistakes

- Expecting `console.log(count)` right after `setCount(count + 1)` to print the new value: it prints the old one (the snapshot).
- Calling `setCount(count + 1)` several times in a row and expecting the count to go up by the number of calls.
- Thinking "render" means React paints the screen. Render is only React calling your function; the commit touches the page.

Interview tip. If Rahul, an interviewer, asks "why does calling `setCount(count + 1)` three times only add one?": because state is a snapshot. All three calls read the same `count` from the current render, so they all ask for the same new value. Use the updater form, and each call builds on the result of the one before.

## Try it yourself

Add a button to your counter that adds five, with five `setCount` calls. First with `count + 1`, then with `c => c + 1`. Put a `console.log` in the component body and count the renders. (Answer: `count + 1` adds 1; `c => c + 1` adds 5; either way there is one render per click, shown twice in development.)

## Clean up

Press `Ctrl+C` to stop the dev server. If you ran `npm install` in this repo's `allcsvideos-web`, delete its `node_modules` and `dist` folders when you are done.

## Next

[M04-L04 · Updating Objects and Arrays in State](../m04-l04-updating-objects-and-arrays-in-state/): why you must never change them in place, and the spread pattern from Module 2 to give React a new copy.
