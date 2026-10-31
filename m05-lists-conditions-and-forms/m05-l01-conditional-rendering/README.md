# M05-L01 · Conditional Rendering

> Video: Module 5, Lesson 1. Watch it first, then follow along here.

## What you'll learn

- A component is a function, so it decides what to show with plain JavaScript
- `if` with an early return for whole screens (guest, empty, loading, error)
- The ternary for either-or, `&&` for show-or-nothing, and why `count && ...` can draw a stray `0`
- Returning `null` to draw nothing (the component still runs)
- Changing the look with a conditional class name
- Two classic mistakes: `if` inside the curly braces, and an early return above a hook

## Before you start

- Node 24. Check with `node --version`.
- Best after [M04-L05](../../m04-state-and-events/) (state) and M03 (JSX basics).
- No Docker needed.

## Files in this folder

This is the Vite + React project from the video. `src/App.jsx` starts as the first version (the stray zero). The `versions/` folder holds every version of `App.jsx` the video shows, so you can switch between them.

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | React 19.3.1, Vite 8.3.5 (exact versions from the video) |
| `index.html`, `vite.config.js` | Vite entry page and config |
| `src/main.jsx` | Starts React in StrictMode |
| `src/App.jsx` | The component you edit (starts as `v0-zero`) |
| `src/App.css`, `src/index.css` | The styles used by every version |
| `src/data/courses.js` | The shared list of four courses |
| `public/` | Favicon and the four course thumbnails |
| `versions/v0-zero` | The header badge that shows a stray `0` |
| `versions/v1-guest` | `if` with an early return: Sign in / Hi, Lukas |
| `versions/v2-empty` | The empty state: No courses yet |
| `versions/v3-ternary` | Enroll button or "You are enrolled" |
| `versions/v4-and` | Show details with `&&` |
| `versions/v5-zero-fix` | The zero fixed with `count > 0 &&` |
| `versions/v6-null` | A Badge that returns `null` |
| `versions/v7-status-if`, `v7b-status-map`, `v7c-nested` | Four states: ifs, an object, nested ternaries |
| `versions/v8-class` | A Like button with a conditional class |
| `versions/v9-hook-order`, `v9b-hook-fix` | The hook-order mistake and its fix |
| `versions/v10-if-braces`, `v10a-if-ok` | `if` inside braces (broken) and a working version |

## Follow along

### 1. Set up and run

Open a terminal in this folder.

```bash
npm install
npm run dev
```

Vite prints a local address (normally `http://localhost:5173`). Open it. To try any version from the video, copy its file over `src/App.jsx`, for example:

```bash
cp versions/v1-guest/App.jsx src/App.jsx
```

The page reloads by itself every time you save.

### 2. The stray zero (`v0-zero`)

The header shows a badge with how many courses you have. The rule we want: with no courses the badge disappears. This is the code in the header:

`versions/v0-zero/App.jsx`:
```jsx
My courses {count && <b>{count}</b>}
```

Click Leave a course twice. The real page text (lines joined with `|`):

```text
at start: allcsvideos | My courses 2 | My courses | React for Beginners | Python from Zero | Courses joined: 2 | Leave a course
after click 1: allcsvideos | My courses 1 | My courses | React for Beginners | Courses joined: 1 | Leave a course
after click 2: allcsvideos | My courses 0 | My courses | Courses joined: 0 | Leave a course
```

At zero courses the badge shows a bare `0`. Why? That is fixed in step 6.

### 3. Tool one: `if` with an early return (`v1-guest`)

A component is a function that returns a picture, so it can decide with plain JavaScript. `Welcome` asks one question: is the user `null` (nobody signed in)? If yes it returns the Sign in button and stops right there. The word `return` ends the function, so nothing below it runs.

`versions/v1-guest/App.jsx`:
```jsx
function Welcome({ user, onSignIn, onSignOut }) {
  if (user === null) {
    return (
      <button onClick={onSignIn}>Sign in</button>
    )
```

The second `return` is `Hi, {user}` with a Sign out button.

`App` keeps the user in state, starting at `null`. Sign in sets it to Lukas, Sign out sets it back to `null`. Click Sign in, then Sign out. The page text each time:

```text
at start: allcsvideos | Sign in | React for Beginners | by Meera · 12 lessons
after Sign in: allcsvideos | Hi, Lukas | Sign out | React for Beginners | by Meera · 12 lessons
after Sign out: allcsvideos | Sign in | React for Beginners | by Meera · 12 lessons
```

The state changed, React called `Welcome` again, the question got a new answer, and the other `return` ran.

The same tool handles the empty state (`v2-empty`). `CourseList` asks: is the list empty? If yes, return a friendly message and stop.

```bash
cp versions/v2-empty/App.jsx src/App.jsx
```

Click Clear list:

```text
at start: My courses | React for Beginners | Python from Zero | System Design | DevOps Basics | Clear list
after Clear list: My courses | No courses yet | Clear list
```

Early returns read like a checklist: special cases first, the normal picture last.

### 4. Tool two: the ternary (`v3-ternary`)

Sometimes only one piece of the page changes. Curly braces hold expressions, and `if` is not an expression, but a ternary is: a question, `?`, one answer, `:`, another answer. Both answers are whole pieces of JSX.

`versions/v3-ternary/App.jsx`:
```jsx

return (
  <div className="card">
    <h2>React for Beginners</h2>
    <p>by Meera · 12 lessons</p>
    {enrolled ? (
      <p className="done">You are enrolled</p>
    ) : (
      <button onClick={() => setEnrolled(true)}>
        Enroll
      </button>
    )}
```

```bash
cp versions/v3-ternary/App.jsx src/App.jsx
```

Click Enroll:

```text
at start: React for Beginners | by Meera · 12 lessons | Enroll
after Enroll: React for Beginners | by Meera · 12 lessons | You are enrolled
```

Use a ternary when there are exactly two choices.

### 5. Tool three: `&&` (`v4-and`)

Often there is no second choice: show a thing, or show nothing. `open && <p>...</p>` means: if `open` is true you get the paragraph, if it is false you get `false`, and React draws nothing for `false`.

`versions/v4-and/App.jsx`:
```jsx
const [open, setOpen] = useState(false)

return (
  <div className="card">
    <h2>React for Beginners</h2>
    <p>by Meera</p>
    {open && (
      <p className="more">12 lessons · Rs 499</p>
    )}
    <button onClick={() => setOpen(!open)}>
      {open ? 'Hide details' : 'Show details'}
    </button>
```

```bash
cp versions/v4-and/App.jsx src/App.jsx
```

Click Show details, then Hide details:

```text
at start: React for Beginners | by Meera | Show details
after Show details: React for Beginners | by Meera | 12 lessons · Rs 499 | Hide details
after Hide details: React for Beginners | by Meera | Show details
```

### 6. Fix the zero (`v5-zero-fix`)

With `count = 0`, `count && <b>{count}</b>` stops at the left side and hands back the number `0`. React draws nothing for `false`, `null` and `undefined`, but `0` is a real number, so React draws it. The fix: put a real yes-or-no question on the left, `count > 0`.

`versions/v5-zero-fix/App.jsx`:
```jsx
My courses {count > 0 && <b>{count}</b>}
```

```bash
cp versions/v5-zero-fix/App.jsx src/App.jsx
```

Click Leave a course twice. At zero the badge is gone:

```text
at start: allcsvideos | My courses 2 | My courses | React for Beginners | Python from Zero | Courses joined: 2 | Leave a course
after click 1: allcsvideos | My courses 1 | My courses | React for Beginners | Courses joined: 1 | Leave a course
after click 2: allcsvideos | My courses | My courses | Courses joined: 0 | Leave a course
```

Rule: on the left of `&&` put something that is truly `true` or `false`. For a list, write `list.length > 0`, never `list.length` alone.

### 7. Tool four: return `null` (`v6-null`)

A component can answer "I have nothing to show" by returning `null`. The `console.log` on the first line proves something:

`versions/v6-null/App.jsx`:
```jsx
function Badge({ count }) {
  console.log('Badge ran, count is', count)
  if (count === 0) return null
  return <b>{count}</b>
}
```

```bash
cp versions/v6-null/App.jsx src/App.jsx
```

Click Leave a course twice and open the browser console (F12). In development each line prints twice because of StrictMode (you saw this in M03-L05), so here is each one once:

```text
Badge ran, count is 2
Badge ran, count is 1
Badge ran, count is 0
```

The Badge did run with count `0`. It answered `null`, and React drew nothing. `null` means "draw nothing", not "do not run".

### 8. Four states: loading, error, empty, ready (`v7-status-if`)

Real pages have more than two states. Four early returns, like tool one, with the normal case last. Four buttons switch the state by hand (in Module 7 you will load real data).

`versions/v7-status-if/App.jsx`:
```jsx
function Courses({ status }) {
  if (status === 'loading') {
    return <p className="msg">Loading…</p>
  }
  if (status === 'error') {
    return <p className="bad">Could not load</p>
  }
  if (status === 'empty') {
    return <p className="msg">No courses yet</p>
  }
  return (
    <ul>
```

```bash
cp versions/v7-status-if/App.jsx src/App.jsx
```

Click error, empty, ready. The page text after load and after each click:

```text
at start: loading | error | empty | ready | Courses | Loading…
after error: loading | error | empty | ready | Courses | Could not load
after empty: loading | error | empty | ready | Courses | No courses yet
after ready: loading | error | empty | ready | Courses | React for Beginners | Python from Zero | System Design | DevOps Basics
```

A shorter style when each case is just a picture: keep the pictures in an object with the status as the key (`v7b-status-map`). It gives the same four pages.

Use the chain of `if`s when each case needs its own code. Use the object when each case is just a picture.

### 9. Conditional class names (`v8-class`)

Sometimes you pick how to dress the element, not what to show. State picks the class, and CSS does the painting.

`versions/v8-class/App.jsx`:
```jsx
const [liked, setLiked] = useState(false)

return (
  <div className="card">
    <h2>React for Beginners</h2>
    <p>by Meera · 12 lessons</p>
    <button
      className={liked ? 'like on' : 'like'}
      onClick={() => setLiked(!liked)}
    >
      {liked ? 'Liked' : 'Like'}
    </button>
```

```bash
cp versions/v8-class/App.jsx src/App.jsx
```

Click Like twice:

```text
at start: React for Beginners | by Meera · 12 lessons | Like
after Like: React for Beginners | by Meera · 12 lessons | Liked
after Like again: React for Beginners | by Meera · 12 lessons | Like
```

### 10. Do not nest ternaries (`v7c-nested`)

The same four states as nested ternaries also work, but you cannot tell which colon belongs to which question mark.

The cure is not a cleverer ternary. Extract: move the decision into its own component with early returns, or into an object, and give it a name. One ternary is fine. A ternary inside a ternary is a sign to split. If one branch has more than a few lines of JSX, give that branch its own component.

### 11. Mistake one: `if` inside the braces (`v10-if-braces`)

```bash
cp versions/v10-if-braces/App.jsx src/App.jsx
```

`versions/v10-if-braces/App.jsx`:
```jsx
export default function App() {
  const user = 'Lukas'

  return (
    <div className="card">
      {if (user) <h2>Hi, {user}</h2>}
    </div>
  )
```

The page turns into the Vite error screen:

```text
[plugin:vite:oxc] Transform failed with 1 error:

[PARSE_ERROR] Unexpected token
   ╭─[ src/App.jsx:8:8 ]
   │
 8 │       {if (user) <h2>Hi, {user}</h2>}
   │        ─┬
   │         ╰──
───╯
```

Braces take expressions, and `if` is not one. Use a ternary or `&&`, or put an `if` above the `return` (`versions/v10a-if-ok` shows the working version; the page then says `Hi, Lukas`).

### 12. Mistake two: an early return above a hook (`v9-hook-order`)

```bash
cp versions/v9-hook-order/App.jsx src/App.jsx
```

`versions/v9-hook-order/App.jsx`:
```jsx
export default function App() {
  const [user, setUser] = useState(null)
  const login = () => setUser('Lukas')

  if (user === null) {
    return <button onClick={login}>Sign in</button>
  }

  const [open, setOpen] = useState(false)
```

At first the page works: Sign in. Click it, and the page goes blank. The console says:

```text
React has detected a change in the order of Hooks called by App. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://react.dev/link/rules-of-hooks

   Previous render            Next render
   ------------------------------------------------------
1. useState                   useState
2. undefined                  useState
   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Error: Rendered more hooks than during the previous render.
```

React finds each hook by its order. The first draw ran one `useState`, the second ran two, so the order changed. The fix (`v9b-hook-fix`): every hook goes first, at the very top. Early returns come after all the hooks.

```bash
cp versions/v9b-hook-fix/App.jsx src/App.jsx
```

After Sign in the page shows `Hi, Lukas` and the Details button.

## Common mistakes

- `count && <Badge />` with a number on the left draws a stray `0`. Write `count > 0 && ...`.
- `{ if (...) ... }` inside JSX is a syntax error. Use a ternary, `&&`, or an `if` above the `return`.
- An early `return` above a hook breaks the order of hooks. Hooks first, early returns after.
- Nested ternaries are hard to read. Extract a component or use an object.
- Thinking `null` means "do not run": the component runs, React just draws nothing.

## Clean up

```bash
rm -rf node_modules dist
```

Press `Ctrl+C` in the terminal to stop the dev server. Nothing else was created.

## Next

Continue with [M05-L02 · Rendering Lists and Keys](../m05-l02-rendering-lists-and-keys/).
