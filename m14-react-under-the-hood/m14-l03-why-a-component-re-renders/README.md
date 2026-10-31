# M14-L03 · Why a Component Re-renders

> Video: Module 14, Lesson 3. Watch it first, then follow along here.

This is Asha's catalog page with a small gold number beside every component. Each number counts how many times that component's function has run. Everything says 1. Asha clicks Add to cart and every number goes to 2, even the footer, which has nothing to do with a cart. Is something broken? No. Today you learn why a component runs again, and whether it matters.

## What you'll learn

- The three reasons a component re-renders: its own state changed, its parent ran, or a context it listens to changed (a changed prop is not a reason of its own)
- How to count renders with a tiny hook, `useRenderCount`, built on a ref
- Three ways to run less: move state down, pass `children`, split contexts
- Why re-rendering is usually cheap: it is a function call, and the page changes only where the output differs. How to check with a spy and with React's `Profiler`
- Three mistakes: `onClick={setCart(cart + 1)}` (too many re-renders), counting with Strict Mode on, and chasing renders that are not a problem

## Before you start

- Node 24 (`node --version`; recorded with v24.16.0).
- You did [M14-L01](../m14-l01-the-virtual-dom-and-reconciliation/README.md) and [M14-L02](../m14-l02-identity-keys-and-state-preservation/README.md), and know context (Module 10, lesson 2) and refs (Module 7, lesson 4).
- Docker is not used.

## Files in this folder

| File | What it is |
|---|---|
| `package.json` | Pinned: React 19.3.1, Vite 8.3.5, TypeScript 7.0.2 |
| `src/useRenderCount.ts` | The counter hook: a number in a ref, plus one on every run. Changing a ref does not cause a render |
| `src/App.tsx`, `Header.tsx`, `CourseList.tsx`, `CourseCard.tsx`, `LikeButton.tsx`, `Footer.tsx` | The catalog page (stage v1-parent: the cart state lives in `App`) |
| `src/data.ts`, `src/index.css`, `src/counters.css`, `src/main.tsx` | Course data, styles, entry point (Strict Mode is off, so each number is shown once) |
| `public/spy.js` | The spy: a `MutationObserver` that logs every change to the real page and ignores the gold counters |
| `use.mjs` | `node use.mjs <stage>` puts `versions/_base` and the stage into `src/` (the job of the video's `use.sh`) |
| `versions/` | `_base` (shared), `v1-parent`, `v2-down`, `v3-children`, `v4-context`, `b-small`, `b-big` (Profiler), `m1-loop`, `m2-strict` |

## Follow along

### 1. Install and start

```bash
npm install
npm run dev
```

```text
  VITE v8.3.5  ready in ... ms

  ➜  Local:   http://localhost:5243/
```

To try another stage: `node use.mjs v2-down` (Vite reloads). `node use.mjs` with no stage lists them. Run `node use.mjs v1-parent` to go back.

### 2. The counter (`src/useRenderCount.ts`)

```ts
import { useRef } from 'react'

export function useRenderCount() {
  const n = useRef(0)
  n.current += 1
  return n.current
}
```

A ref can change without drawing the screen, so counting does not cause a render. Each component calls it on its first line, for example `const n = useRenderCount()` and `<span className="cnt">card {n}</span>`.

### 3. Reason one: the component's own state (stage v1-parent)

The `LikeButton` keeps `liked` with `useState`. On first load every counter says 1:

```text
app 1, header 1, list 1, card 1, like 1, card 1, like 1, card 1, like 1, footer 1
```

Guess: click Like on the first course. Which counters change? Real result: exactly one, the like button of the first card.

```text
app 1, header 1, list 1, card 1, like 2, card 1, like 1, card 1, like 1, footer 1
```

The state lives inside the like button, so React runs the like button and everything inside it, and nothing else. Rule one: when a component's own state changes, React runs that component and everything below it. Nothing above it, nothing beside it.

### 4. Reason two: the parent ran (stage v1-parent)

`App` keeps the cart count and passes it, with a function that adds one, to `Header`. The footer and the list get nothing:

```tsx
export default function App() {
  const n = useRenderCount()
  const [cart, setCart] = useState(0)
  return (
    <div className="app">
      <span className="cnt pg">app {n}</span>
      <Header cart={cart} onAdd={() => setCart(cart + 1)} />
      <CourseList />
      <Footer />
    </div>
  )
}
```

Guess: click Add to cart. Which numbers change? Everything:

```text
app 2, header 2, list 2, card 2, like 3, card 2, like 2, card 2, like 2, footer 2
```

(The first like says 3 because we clicked it before.) `App` ran because its state changed, then React ran every component inside it. The footer has no props and the cards got the same course as before, and they still ran. React does not ask "did my props change?" It runs everything below a component that ran. Checking costs something too, and running a component function is usually very cheap.

Rule two: how many components run depends on where the state lives, not on what the components show.

**Fix 1: move state down** (stage `v2-down`). Only the cart button needs the cart count, so it becomes its own component with the state inside:

```bash
node use.mjs v2-down
```

```tsx
export default function CartButton() {
  const n = useRenderCount()
  const [cart, setCart] = useState(0)
  return (
    <div className="bar">
      <span className="cart">Cart: {cart}</span>
      <button onClick={() => setCart(cart + 1)}>Add to cart</button>
      <span className="cnt">cart {n}</span>
    </div>
  )
}
```

Same click, real result: only one number changes.

```text
app 1, header 1, cart 2, list 1, card 1, like 1, card 1, like 1, card 1, like 1, footer 1
```

Rule of thumb: put state as low in the tree as you can. Lift it up only when two components need it (Module 4, lesson 5).

**Fix 2: pass `children`** (stage `v3-children`). Sometimes the state must live in a wrapper. `Layout` keeps `compact` and draws the page as `children`; `App` writes the list and the footer inside `<Layout>`:

```tsx
export default function Layout({ children }: Props) {
  const n = useRenderCount()
  const [compact, setCompact] = useState(false)
  return (
    <div className={compact ? 'app compact' : 'app'}>
      ...
      {children}
    </div>
  )
}
```

Guess: click Compact view. Do the list, the cards and the footer run again? Real result: no.

```text
layout 2, list 1, card 1, like 1, card 1, like 1, card 1, like 1, footer 1
```

`App` wrote the list and the footer as ready-made descriptions before `Layout` ever ran. When `Layout` runs again it hands back the very same descriptions, so React sees nothing new and skips them. So reason two has a more exact form: a component runs again when the component whose code contains its tag runs again. Components that arrive as children, from above, are not new work.

### 5. Reason three: context (stage v4-context)

```bash
node use.mjs v4-context
```

The `ThemeProvider` (Module 10, lesson 2) keeps the theme in state and draws `children` inside the page `div`. Two kinds of component listen with `useTheme`: the switch in the header and the course cards. Guess: click Dark mode. Which numbers go up? Real result:

```text
header 1, switch 2, list 1, card 2, like 2, card 2, like 2, card 2, like 2, footer 1
```

The switch and the three cards ran because they listen. The three like buttons ran too, but not because of context: they sit inside the cards, and the cards ran (reason two). The header, the list and the footer stayed at 1. The provider ran because its state changed, but its children were written in `App`, so they were skipped, like in `Layout`. Then React went straight to the listeners. A radio only reaches the ones that tuned in. That is why Module 10 said to split contexts by topic: every listener runs when the value changes.

### 6. Does it matter? Three checks (stages v1-parent, b-small, b-big)

**First,** running a component is only calling a function. It builds a description of the screen (the blueprint from lesson 1) and nothing on the page is touched yet.

**Second,** the page changes only where the new description differs. Go back to `v1-parent`, open the browser console, paste the contents of `public/spy.js`, and click Add to cart. Ten components run. The spy prints one line:

```text
characterData 1
```

One piece of text changed (the cart). That is the whole cost on screen.

**Third,** numbers. React has a built-in `Profiler` component. `versions/b-small/main.tsx` wraps the app in it:

```tsx
function report(id: string, phase: string, ms: number) {
  console.log(`${id} ${phase}: ${ms.toFixed(1)} ms`)
}

createRoot(document.getElementById('root')!).render(
  <Profiler id="page" onRender={report}>
    <App />
  </Profiler>,
)
```

```bash
node use.mjs b-small
```

Click Add to cart several times and read the console. Real numbers from this lesson's check (yours will differ, and they move from run to run):

```text
page mount: 2.4 ms
page update: 0.9 ms
page update: 0.5 ms
page update: 0.3 ms
```

Ten components run and it takes about half a millisecond. A screen frame lasts about 16 milliseconds, and this is development mode, which is slower than the real site. Now `b-big` adds a list of 10,000 course rows under the footer (`BigList.tsx`) and you click the same button:

```bash
node use.mjs b-big
```

```text
page update: 14.9 ms
page update: 57.6 ms
page update: 9.1 ms
page update: 50.9 ms
```

On this machine, in development mode, the slow clicks cost more than three frames. The page would stutter. That is when re-renders matter: many components, or a slow one, and a state change high above. Not three cards. Measure first (Module 15, lesson 1), then fix with what you learned today: move state down, or pass children. Module 15, lesson 2 shows tools that skip renders on purpose.

## Common mistakes

1. **Calling the setter instead of passing a function** (stage `m1-loop`). The cart button's click is written:

   ```tsx
   <button onClick={setCart(cart + 1)}>Add to cart</button>
   ```

   The page is blank and the console shows, in red:

   ```text
   Too many re-renders. React limits the number of renders to prevent an infinite loop.
   ```

   The type checker had underlined it already:

   ```bash
   node use.mjs m1-loop
   npx tsc -b
   ```

   ```text
   src/CartButton.tsx(10,15): error TS2322: Type 'void' is not assignable to type 'MouseEventHandler<HTMLButtonElement> | undefined'.
   ```

   Without the arrow, the code does not wait for a click: it calls `setCart` while the component is rendering, `setCart` asks for a new render, the new render calls it again, and so on until React stops it. Pass the function, never call it (Module 4, lesson 1). The fix is `() => setCart(cart + 1)`.
2. **Trusting the numbers when Strict Mode is on** (stage `m2-strict`). In development, Strict Mode runs every component twice on purpose. The page loads and every counter already says 2; one click on Add to cart and they say 4:

   ```text
   app 2, header 2, list 2, card 2, like 2, card 2, like 2, card 2, like 2, footer 2
   app 4, header 4, list 4, card 4, like 4, card 4, like 4, card 4, like 4, footer 4
   ```

   Nothing is wrong. Turn Strict Mode off to count, and on again afterwards.
3. **Chasing re-renders that are not a problem.** Wrapping everything in tools that stop renders makes code harder to read and often gains nothing. A re-render is normal. Measure first.

## Clean up

Press Ctrl+C in the terminal. Run `node use.mjs v1-parent` to put the first stage back. Delete `node_modules` and `dist` if you like.

## Try it yourself

Add `useRenderCount` to your own components, and a button that sets state in your top component. Predict every number first. Then move the state into a child, and predict again.

Interview tip. "What makes a React component re-render, and does it always change the page?" Three things: its own state changing, its parent rendering, or a context it uses changing. A re-render only means React called the function again. The page changes only where the new output is different. To reduce re-renders: move state down, pass children, and measure before reaching for tools.

## Next

[M14-L04 · What's New in React 19](../m14-l04-whats-new-in-react-19/README.md)
