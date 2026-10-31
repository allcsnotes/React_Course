# M07-L01 · useEffect: Syncing with the Outside World

> Video: Module 7, Lesson 1. Watch it first, then follow along here.

## What you'll learn

- What a side effect is, and why render must stay pure
- `useEffect(() => { ... })`: code that runs after React has drawn the screen
- Changing the browser tab title from a component
- The three shapes of the second argument: no array, `[]`, and `[count]`
- Why a timer started on every render races, and how `[]` fixes it
- To think "keep something outside React in step with my state", not "component life cycle"

## Before you start

- Node 24 (`node --version`).
- Best after [M06-L04](../../m06-styling-react-apps/m06-l04-component-libraries-and-accessibility-basics/) and Module 4 (`useState`, rendering).
- No Docker needed.

## Files in this folder

`src/App.jsx` starts as `versions/v2-title/App.jsx` (the tab title effect). To try another step, copy its `App.jsx` over `src/App.jsx`.

To see each console line only once, the video turned StrictMode off with `versions/main-nostrict.jsx`. `src/main.jsx` is the normal Vite file with StrictMode on (lesson 2 explains it), so by default you will see every line twice.

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | React 19.3.1, Vite 8.3.5 |
| `src/App.jsx`, `src/App.css`, `src/index.css`, `src/main.jsx` | The app (cart page) and its styles |
| `versions/v1-nohook` | The cart without any effect: the tab never changes |
| `versions/v2-title` | An effect that sets `document.title` |
| `versions/v2b-order` | Console lines in render and in the effect |
| `versions/v2c-strict` | The same with StrictMode on |
| `versions/v3-clock-bug`, `v3b-clock-fix` | A clock with no array (races), then with `[]` |
| `versions/v4-deps` | Three effects side by side: no array, `[]`, `[count]` |
| `versions/v5-title-count`, `v5b-title-empty` | The title effect with `[count]`, and with `[]` (frozen) |
| `versions/v6-noimport` | Forgot to import `useEffect` |
| `versions/main-nostrict.jsx` | A `main.jsx` without StrictMode |

## Follow along

### 1. Set up

```bash
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`). Switch steps with `cp versions/<name>/App.jsx src/App.jsx`. For single console lines copy `versions/main-nostrict.jsx` over `src/main.jsx`.

### 2. The problem: the tab title (`v1-nohook`)

The cart has an Add to cart button and a line "Items in cart". Click it three times: the line goes up, but the browser tab still says `allcsvideos-web`. The tab belongs to the browser, outside React's world. The JSX describes what is inside the page, so the title needs a new hook.

### 3. Side effects

React calls your component function only to work out what the screen should look like (render, a pure function: same input, same answer, no changes outside). Anything else a function does, such as changing the tab title, starting a timer or phoning a server, is a side effect. Event handlers are one place for side effects. But some jobs are not triggered by a click: "keep the title right whatever the count is". That is what `useEffect` is for.

### 4. Your first effect (`v2-title`)

`versions/v2-title/App.jsx`:
```jsx
useEffect(() => {
  document.title = `Cart (${count})`
})
```

React runs the function after it has drawn the screen. The JSX never mentions the title; it is a side effect and lives in its own place. The real tab title after load and after each of three clicks:

```text
Cart (0)
Cart (1)
Cart (2)
Cart (3)
```

### 5. The order of things (`v2b-order`)

Two console lines: one in the body of the component (render) and one inside the effect.

`versions/v2b-order/App.jsx`:
```jsx
useEffect(() => {
  document.title = `Cart (${count})`
  const p = document.getElementById('cart')
  console.log('effect: page says', p.textContent)
})

```

The real console (StrictMode off). Load, then two clicks:

```text
render: count is 0
effect: page says Items in cart: 0
render: count is 1
effect: page says Items in cart: 1
render: count is 2
effect: page says Items in cart: 2
```

The order is always: render, React updates the screen, then your effect. The effect never runs on a blank page, and it is never part of working out the screen. With StrictMode on (`v2c-strict`) each line appears twice on the first draw:

```text
render: count is 0
render: count is 0
effect: page says Items in cart: 0
effect: page says Items in cart: 0
render: count is 1
render: count is 1
effect: page says Items in cart: 1
```

### 6. A clock, and the race (`v3-clock-bug`)

A timer is a side effect too. `setInterval` runs a function again and again. Without a second argument the effect runs after every render, and each render starts one more timer:

`versions/v3-clock-bug/App.jsx`:
```jsx
useEffect(() => {
  console.log('effect: start a timer')
  setInterval(
    () => setSeconds(s => s + 1),
    1000
  )
})

```

Open the page and wait. The real clock after 0, 1, 2, 3, 4 and 5 seconds:

```text
Seconds on this page: 0
Seconds on this page: 1
Seconds on this page: 3
Seconds on this page: 7
Seconds on this page: 14
Seconds on this page: 26
```

The clock is racing, and the console shows `effect: start a timer` again and again.

### 7. The dependency array (`v3b-clock-fix`, `v4-deps`)

The second argument is the dependency array: the list of values your effect looks at. Three shapes:

- No array: run after every render.
- `[]`: run once, after the first render.
- `[count]`: run after the first render and again whenever `count` changes.

The clock needs to start once, so add `[]` after the arrow function (`v3b-clock-fix`). The real clock: 0, 1, 2, 3, 4, and the console shows one `effect: start a timer`.

Side by side (`v4-deps`):

`versions/v4-deps/App.jsx`:
```jsx
useEffect(() => console.log('A'))
useEffect(() => console.log('B'), [])
useEffect(() => console.log('C'), [count])
```

Click Add to cart, then type `hi` in the note box, then click Add to cart again. The real console:

```text
render: 0
A
B
C
render: 1
A
C
render: 1 h
A
render: 1 hi
A
render: 2 hi
A
C
```

On the first draw all three run. A runs every time. B ran only once. C ran when `count` changed (and not while typing).

This timer is never switched off. When the page closes the browser clears it. In a bigger app that is not enough, and lesson 2 shows how to clean up.

### 8. Sync, not life cycle (`v5-title-count`, `v5b-title-empty`)

Think of an effect as the wire between inside React (the count) and outside (the tab title). The body says what outside thing must stay in step. The array lists the values it depends on. With `[count]` the title follows the count: `Cart (0)`, `Cart (1)`, `Cart (2)`. With an empty array but an effect that uses `count` (`v5b-title-empty`) the title freezes:

```text
Cart (0)
Cart (0)
Cart (0)
Cart (0)
```

Do not overuse effects. If something is only about what the screen shows, work it out in the body (Module 5, lesson 5).

### 9. Mistake: forgetting the import (`v6-noimport`)

Write `useEffect` but forget to import it, and the page goes blank. The console says:

```text
ReferenceError: useEffect is not defined
```

Add `useEffect` to the import line from `react`.

## Common mistakes

- Forgetting to import `useEffect` (blank page, `ReferenceError`).
- No array on a timer: it starts again on every render and the clock races.
- `[]` when the effect uses a value: the title freezes at the first value.
- Using an effect for something you can compute while drawing.

## Clean up

```bash
rm -rf node_modules dist
```

Press `Ctrl+C` to stop the dev server.

## Next

Continue with [M07-L02 · Dependencies, Cleanup and Strict Mode](../m07-l02-dependencies-cleanup-and-strict-mode/).
