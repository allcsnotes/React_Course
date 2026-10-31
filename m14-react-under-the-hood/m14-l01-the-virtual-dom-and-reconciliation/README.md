# M14-L01 · The Virtual DOM and Reconciliation

> Video: Module 14, Lesson 1. Watch it first, then follow along here.

Asha has a small page for the allcsvideos shelf: a note box, an Add course button and a list of courses. She built it two ways: plain JavaScript that draws the whole page again on every change, and React. Lukas types a note, `Python next`, and clicks Add course. On the plain page the note is gone. On the React page it is still there. Why? Because React compares two drawings and only touches what changed. That is this lesson.

## What you'll learn

- What the virtual DOM is: a tree of plain objects that describes the screen (a blueprint), not the real page
- What reconciliation (diffing) is, and how commit follows the work order
- React's two bets: same type in the same place means keep the node, a different type means throw it away
- Why keys are the second half of the compare: index keys do six changes, ID keys do one
- Why the virtual DOM is not a speed trick, and three mistakes: editing the real page behind React's back, `key={Math.random()}`, and believing every render touches the page

## Before you start

- Node 24 (`node --version`; recorded with v24.16.0). A browser (the measurements below were taken in Google Chrome).
- You know the three steps trigger, render, commit (Module 4, lesson 3) and keys in lists (Module 5, lesson 2).
- Docker is not used.

## Key ideas

- **The real page (the DOM) has living things in it:** the text a visitor is typing, which box has the cursor, the scroll position. Replace a box and they are lost.
- **The virtual DOM is a blueprint:** a tree of plain objects. It is cheap, because drawing it changes nothing in the building.
- **Render, reconcile, commit.** Render calls your components and draws a new blueprint. Reconciliation lays the old blueprint next to the new one and writes the list of differences (the work order). Commit follows the work order and touches only those parts of the real page.
- **Bet one:** same type in the same place means the same thing: keep the real node and update only what changed. **Bet two:** a different type means a different thing: throw the old one away with everything inside it, and build the new one.
- **Keys tell React which child is which.** With index keys, row 1 of the old list is compared with row 1 of the new list, so adding a row at the top rewrites every row. With ID keys React matches by key and inserts one row.
- **The virtual DOM is not a speed trick.** One hand-written patch is faster than any compare. The gain is that you write simple code (describe the screen) and still get small, correct changes.

## Files in this folder

| File | What it is |
|---|---|
| `package.json` | Pinned: React 19.3.1, react-dom 19.3.1, Vite 8.3.5, TypeScript 7.0.2 |
| `board/elements.mjs`, `board/card.mjs` | Two tiny Node scripts that print a React element (the blueprint) |
| `public/plain.html`, `public/plain.js` | The plain JavaScript page that redraws everything with `innerHTML` |
| `public/spy.js` | "The spy": logs every change to the real page and flashes the changed part |
| `public/page.css` | Styles for the plain page |
| `index.html` | Loads the spy before the app, so React pages are spied on too |
| `src/App.tsx`, `src/main.tsx`, `src/index.css` | The React shelf (stage v1) |
| `versions/` | `v1` (shelf, same as `src/`), `v2` (the `Shelf` with three switches), `v3a` (index keys), `v3b` (ID keys), `m1` (editing the real page), `m2` (random keys) |

Switch stage by replacing `src/` (Vite reloads):

```bash
find src -type f -delete && cp versions/v2/* src/
```

## Follow along

### 1. Install and start

```bash
npm install
npm run dev
```

```text
  VITE v8.3.5  ready in ... ms

  ➜  Local:   http://localhost:5141/
```

### 2. The note that disappears (stage v1)

Open http://localhost:5141/plain.html (plain JavaScript) and http://localhost:5141/ (React). In each page type `Python next` in the note box, then click Add course. Guess: is the note still there?

The plain page (`public/plain.js`) rebuilds everything:

```js
function draw() {
  let html = '<h1>Course shelf</h1>'
  html += '<input placeholder="note">'
  html += '<button onclick="add()">Add course</button>'
  html += '<ul>' + courses.map(li).join('') + '</ul>'
  app.innerHTML = html
}
```

Real result: on the plain page the note is gone, because the old box was thrown away and a new, empty one was built. On the React page the note is still there. The spy (the yellow flash, and `window.__spy` in the console) tells why:

```text
plain page:  childList in <div> +<h1> +<input> +<button> +<ul> -<h1> -<input> -<button> -<ul>
React page:  childList in <ul> +<li>
```

React never touched the box. It added one new line to the list.

### 3. Look at a blueprint

JSX is a shortcut for `createElement`. `board/elements.mjs` makes an `h1` with a class and prints it:

```js
import { createElement } from 'react'

const hello = createElement('h1', { className: 'title' }, 'Hello')
console.log(hello)
```

```bash
node board/elements.mjs
```

```text
{
  '$$typeof': Symbol(react.transitional.element),
  type: 'h1',
  key: null,
  props: { className: 'title', children: 'Hello' },
  _owner: null,
  _store: {}
}
```

Guess first: HTML, a real part of a page, or something else? A plain object. Its `type` is the text `h1`, and nothing here is on any page. When the type is a component, the type is the function itself, not called yet (`board/card.mjs`):

```bash
node board/card.mjs
```

```text
{
  '$$typeof': Symbol(react.transitional.element),
  type: [Function: Card],
  key: null,
  props: { title: 'React' },
  _owner: null,
  _store: {}
}
```

The weight: in the browser console, count the properties of one real `h1`:

```js
let c = 0; for (const k in document.createElement('h1')) c++; c
```

```text
347
```

In Chrome that was 347 properties. The element object above has six keys. Making a few of those is cheap. Touching the real page is where the browser has to work.

### 4. Two bets: the `Shelf` (stage v2)

```bash
find src -type f -delete && cp versions/v2/* src/
```

`Shelf` has three switches, and a console line so you can see each render:

```tsx
export function Shelf({ sale, hot, big }: Props) {
  console.log('Shelf render')
  const cls = hot ? 'hot' : ''
  return (
    <section>
      {big ? <h2>React</h2> : <p>React</p>}
      <p className={cls}>Rs {sale ? 299 : 499}</p>
    </section>
  )
}
```

Open http://localhost:5141/. After each click, read the console and the spy (`window.__spy`; call `window.__spyQuiet()` first to empty it):

| Click | Console | The spy (the real page) |
|---|---|---|
| Sale | `Shelf render` | `characterData "499" -> "299"` |
| Hot | `Shelf render` | `attributes class on <p>: "" -> "hot"` |
| Big | `Shelf render` | `childList in <section> -<p>` and `childList in <section> +<h2>` |
| Redraw | `Shelf render` | nothing |

- **Sale:** the whole component rendered, and one text changed. Only the price flashes.
- **Hot:** one class name added. The text did not change, so React did not touch it.
- **Big:** `p` became `h2` in the same place, a different type (bet two). If you kept the old paragraph in a variable before the click, `document.contains(old)` is `false` afterwards. React threw it away and built a new one. What happens to the memory inside is the next lesson.
- **Redraw** asks for a render and changes nothing on screen. The function ran, the compare found no difference, and the work order was empty.

### 5. Keys: six changes or one (stages v3a, v3b)

Asha adds `Git` at the top of a list of four courses (React, Python, DevOps, SQL). A smart compare would say: one new row.

```bash
find src -type f -delete && cp versions/v3a/* src/    # key={i}
```

Click "Add Git at the top". With index keys the spy sees six changes:

```text
characterData "React" -> "Git"
characterData "Python" -> "React"
characterData "DevOps" -> "Python"
characterData "Asha" -> "Meera"
characterData "SQL" -> "DevOps"
childList in <ul> +<li>
```

React cannot know row 1 moved to row 2 unless the key says so. Row 1 is compared with row 1 (rewrite the text), and so on, then one new row at the end.

```bash
find src -type f -delete && cp versions/v3b/* src/    # key={c.id}
```

With ID keys:

```text
childList in <ul> +<li>
```

One change: one new row, at the top. A key is not only there to silence a warning. It is the second half of the compare.

### 6. Why this is not a speed trick

Drawing a blueprint and comparing it is extra work that plain JavaScript does not do. A single hand-written patch to one price is faster than any compare. Three ways to keep a page up to date:

| Way | Good | Bad |
|---|---|---|
| Rebuild everything (our plain page) | Simple to write | Loses what the visitor was doing, does the most work |
| Patch by hand | The fastest | You must find every place; one forgotten place is a bug |
| Describe the screen, let React patch | Simple to write; small, correct patch every time | Extra compare work |

Some newer tools skip the blueprint and work out the changes another way. The goal is the same: touch the real page as little as possible, and never lose what the visitor is doing.

## Common mistakes

1. **Editing the real page behind React's back** (stage `m1`). A script sets `seats.textContent = 'Sold out'`, then Lukas clicks Add a seat. The page still says `Sold out`:

   ```js
   document.getElementById('seats').textContent = 'Sold out'
   ```

   React keeps a pointer to its own piece of text, and we replaced that piece. React updates the old one, which is no longer on the page, so the screen does not change. The nodes React made belong to React. Change the data, and let React change the page.
2. **A key that changes on every render** (stage `m2`, `key={Math.random()}`). One click on Refresh and the spy reports eight changes: four `<li>` removed and four added. No tag matched, so the compare found nothing to keep. The list was rebuilt like the plain page. After the click, none of the old `li` elements survive.
3. **Thinking every render touches the page.** Redraw asks for a render and the spy prints nothing. A render is not page work. Do not panic at many render lines. Lesson 3 asks why they happen and Module 15 shows how to measure them.

## Clean up

Press Ctrl+C in the terminal. Put `versions/v1` back into `src/` if you tried other stages. Delete `node_modules` and `dist` if you like.

## Try it yourself

1. Add a text box inside each list row (stage `v3a` or `v3b`) and type something in one row. Then add a course at the top: once with index keys, once with ID keys, once with `Math.random()` keys. Watch where your typed text goes. (Answer: with index keys the text stays in the same position, so it now sits next to a different course; with ID keys it moves down with its course; with random keys it is lost.)
2. In the console, print `window.__spy` after each click on the `Shelf` and match every line to a bet.

Interview tip. "What is the virtual DOM, and why does React use it?" A good answer: it is a lightweight tree of objects that describes the UI. On every update React builds a new tree, compares it with the old one, and applies only the differences to the real DOM. It does not make React faster than hand-written DOM code. It lets you describe the screen simply and still get small, correct updates.

## Next

[M14-L02 · Identity, Keys and State Preservation](../m14-l02-identity-keys-and-state-preservation/README.md)
