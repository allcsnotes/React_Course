# M15-L02 · memo, useMemo, useCallback and the React Compiler

> Video: Module 15, Lesson 2. Watch it first, then follow along here.

This is Asha's catalog page from Module 14, lesson 3, with the same gold counters (each counts how many times a component's function has run). Everything says 1. Asha clicks Add to cart and every number goes to 2. You already know two fixes: move the state down, or pass children. Today you get three small tools that skip work on purpose, and one big tool that writes them for you.

## What you'll learn

- `memo`: skip a component when every prop is the same as last time
- Why a function, object or array written inside a component breaks `memo` (a new one on every run)
- `useCallback`: keep a function the same between runs, with a dependency list
- `useMemo`: keep a slow result (sorting 200,000 courses) the same until a dependency changes
- The React Compiler: it does all of this at build time from plain code. How to set it up with Vite, how to see what it writes, and how to turn it off for one component (`'use no memo'`) or opt in per component (`annotation` mode)
- Four mistakes: a wrong dependency list, hooks without `memo`, a component that breaks the rules (silently skipped), and adding tools before measuring

## Before you start

- Node 24 (`node --version`; recorded with v24.16.0).
- You did [M14-L03](../../m14-react-under-the-hood/m14-l03-why-a-component-re-renders/README.md), [M15-L01](../m15-l01-measuring-performance/README.md) (the Profiler), and know that two objects with the same contents are different boxes (Module 7, lesson 2).
- Docker is not used.
- Timings below were measured on one run of this repo in development mode. Yours will differ and will move from run to run.

## Files in this folder

| File | What it is |
|---|---|
| `package.json` | Pinned: React 19.3.1, babel-plugin-react-compiler 1.0.0, @rolldown/plugin-babel 0.2.4, @babel/core 8.0.10, Vite 8.3.5, TypeScript 7.0.2 |
| `vite.config.ts` | The plain Vite config (no compiler), port 5152. `use.mjs` swaps it when you ask for the compiler |
| `src/` | The catalog at stage v5-usememo: `App.tsx`, `Header.tsx`, `CourseList.tsx`, `CourseCard.tsx`, `LikeButton.tsx`, `Footer.tsx`, `useRenderCount.ts`, `data.ts`, `main.tsx` (with a `Profiler`), styles |
| `use.mjs` | `node use.mjs <stage> [compiler\|panic]` puts `versions/_base` and the stage into `src/`, and the matching Vite config (the job of the video's `use.sh`) |
| `versions/` | `_base`, `c-config` (the two compiler configs), `v0-plain`, `v1-memo`, `v2-inline`, `v3-callback`, `v4-sort`, `v5-usememo`, `pl-plain`, and the mistakes `m1-stale` (with the fix `m1-fix`), `m2-nomemo`, `x-skip` |
| `compile/` | Small scripts that run the compiler on one file and print the result: `run.mjs`, `all.mjs`, `opts.mjs`, `skip.mjs`, and the sample files `Badge.jsx`, `BadgeOff.jsx`, `BadgeUse.jsx`, `Glob.jsx`, `Hookif.jsx`, `Mutate.jsx`, `Time.jsx` |

Switch stage with `node use.mjs v1-memo` (restart `npm run dev` if the config changed). `node use.mjs` with no stage lists them.

## Follow along

### 1. Install and start

```bash
npm install
npm run dev
```

```text
  VITE v8.3.5  ready in ... ms

  ➜  Local:   http://localhost:5152/
```

Open the page and the browser console. Click Add to cart and read the gold numbers (and the console).

### 2. `memo` (stage v1-memo)

```bash
node use.mjs v0-plain      # the baseline: every number goes to 2
node use.mjs v1-memo
```

Before running a component again, React compares each prop with the last time. If every prop is the same, React skips the component and reuses its last result. The footer has no props, and the course list gets the same `courses` array every time, so we wrap both on their last line:

```tsx
export default memo(CourseList)
export default memo(Footer)
```

Guess: click Add to cart. Which numbers change? Real result:

```text
app 2, header 2, list 1, card 1, like 1, card 1, like 1, card 1, like 1, footer 1
```

Only `app` (its state changed) and the header (its prop, the cart, changed). We never wrapped the cards, but a card only runs when its parent runs, and the list was skipped: wrapping the list skipped seven components.

### 3. A function written inside breaks it (stage v2-inline)

A new feature: clicking a course title should open that course, so `App` gives the list a function, `onOpen`, written right inside `App`:

```tsx
<CourseList courses={courses} onOpen={(slug) => console.log('open', slug)} />
```

The list is still wrapped in `memo` and gets exactly the same courses. Click Add to cart:

```text
app 2, header 2, list 2, card 2, like 2, card 2, like 2, card 2, like 2, footer 1
```

The memo on the list did nothing. Two functions with the same code are two different boxes, and `===` says false:

```bash
node -e "console.log((() => 1) === (() => 1))"
```

```text
false
```

Every time `App` runs, the arrow function is built again, so to React the prop changed. An object or array written inside a component does the same.

### 4. `useCallback` (stage v3-callback)

`useCallback` keeps the same function between runs. You give it the function and a list of dependencies (what it uses from the component). Think of a locker: the first run puts the function in, later runs hand back the very same one, until something in the list changes. `open` uses nothing from the component, so the list is empty:

```tsx
const open = useCallback((slug: string) => {
  console.log('open', slug)
}, [])
```

Same click:

```text
app 2, header 2, list 1, card 1, like 1, card 1, like 1, card 1, like 1, footer 1
```

### 5. `useMemo` (stages v4-sort, v5-usememo)

For slow work, not functions. The catalog now has 200,000 courses and the page shows the three cheapest. `cheapest` sorts them all, and `App` calls it on every run, even a run caused by Add to cart:

```tsx
function cheapest(list: Course[]) {
  console.log('sorting', list.length, 'courses')
  return [...list].sort((a, b) => a.price - b.price).slice(0, 3)
}
const top = cheapest(allCourses)          // stage v4-sort
```

Stage `v4-sort` has a `Profiler` in `main.tsx` that prints how long each update takes. Click Add to cart four times. Real result (your milliseconds will differ):

```text
sorting 200000 courses
page update: 22.5 ms
sorting 200000 courses
page update: 24.4 ms
...
```

A frame lasts about 16 ms, so that is more than one frame per click. And the list is back to 5 (the sorted array is a new array every time, so the memo on the list lost again). `useMemo` runs the function once and hands back the same answer until something in the list changes. `allCourses` never changes, so the list is empty:

```tsx
const top = useMemo(() => cheapest(allCourses), [])      // stage v5-usememo
```

```bash
node use.mjs v5-usememo
```

Real result: `sorting 200000 courses` is printed once, at the start, and never again. The profiler says a fraction of a millisecond:

```text
page update: 0.3 ms
page update: 0.2 ms
page update: 0.1 ms
page update: 0.2 ms
```

And the list stays at 1, because the array is the very same one every time.

### 6. The React Compiler

Three tools, and a dependency list for each. One forgotten item causes a bug. The React team built a tool that does it for you. It is not a library you call: it is a step in your build, the same step where Vite turns your files into code for the browser. It reads each component, works out which value depends on which, and rewrites the code to remember them and skip the work. The files you wrote do not change.

Setup with Vite takes one command (this folder already has them in `package.json`; the video's real run added 43 packages):

```bash
npm install --save-exact -D babel-plugin-react-compiler@1.0.0 @rolldown/plugin-babel@0.2.4 @babel/core@8.0.10
```

That adds the compiler, Babel (the tool that does the rewriting), and a small plugin that connects Babel to Vite. Then two changes in the Vite config (`versions/c-config/vite.config.ts`): import the compiler preset and add it to the plugins:

```ts
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  server: { port: 5152 },
})
```

To test it, `pl-plain` is the app written plainly: no `memo`, no `useCallback`, no `useMemo`, anywhere. First without the compiler:

```bash
node use.mjs pl-plain
npm run dev
```

Click Add to cart three times. Real result: every counter is 4, sorting is printed on each click, and the profiler says about 20 to 30 ms:

```text
app 4, header 4, list 4, card 4, like 4, card 4, like 4, card 4, like 4, footer 4
sorting 200000 courses
page update: 27.5 ms
```

Now the compiler on, and not one line of the file changed:

```bash
node use.mjs pl-plain compiler
npm run dev
```

```text
app 4, header 4, list 1, card 1, like 1, card 1, like 1, card 1, like 1, footer 1
page update: 0.3 ms
```

`App` and the header ran; the list, the cards, the like buttons and the footer stayed at 1. Sorting was not printed after the first time. The compiler did all three jobs by itself.

What did it write? `compile/Badge.jsx` is one tiny component. Run the real compiler on it:

```bash
node compile/run.mjs Badge.jsx
```

```text
import { c as _c } from "react/compiler-runtime";
export default function Badge(t0) {
  const $ = _c(2);
  const { count } = t0;
  const text = count + " in cart";
  let t1;
  if ($[0] !== text) {
    t1 = <b className="badge">{text}</b>;
    $[0] = text;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}
--- events
CompileSuccess Badge
```

At the top it makes a cache, a row of slots (`$`). For the result it asks: is the input the same as last time? If yes, it takes the saved result. If not, it builds and saves it. That is `useMemo`, written by a machine, for every value.

You stay in control. `'use no memo'` at the top of a component makes the compiler leave it alone (`compile/BadgeOff.jsx`):

```bash
node compile/run.mjs BadgeOff.jsx
```

```text
export default function Badge({ count }) {
  'use no memo';
  ...
--- events
CompileSkip
```

And `compilationMode: 'annotation'` compiles only the components that say `'use memo'`:

```bash
node compile/opts.mjs
```

```text
Badge.jsx annotation -> compiled: false
BadgeUse.jsx annotation -> compiled: true
```

Is `memo` obsolete? Not the ones you already wrote, and many projects do not have the compiler yet, so these tools are how you do it there. In a new project, turn the compiler on, write plain code, and reach for the hooks only when you have measured a real problem.

## Common mistakes

1. **A wrong dependency list** (stage `m1-stale`). Asha wraps the add function and leaves the list empty, but the function uses `cart`:

   ```tsx
   const add = useCallback(() => setCart(cart + 1), [])
   ```

   Click Add to cart three times: the cart says `Cart: 1`. The function was built once, when the cart was 0, and remembers that 0. Every click says "set cart to 0 plus 1"; React sees 1 again and does nothing. The fix (stage `m1-fix`) is the updater form from Module 4, lesson 3:

   ```tsx
   const add = useCallback(() => setCart((c) => c + 1), [])
   ```

   Three clicks now give `Cart: 3`.
2. **The hooks without `memo`** (stage `m2-nomemo`). `useCallback` and `useMemo` are used, but nothing is wrapped in `memo`. Click Add to cart: the list and the cards still run (2). A component skips only when it is wrapped in `memo` or compiled. The hooks only keep values the same.
3. **A component that breaks the rules is skipped, quietly** (stage `x-skip`). `App` counts visits in a variable outside the component (`let visits = 0` ... `visits = visits + 1`). With the compiler on, the page works, but the list, the cards and the footer are back to 2 and nothing tells you why:

   ```bash
   node use.mjs x-skip compiler
   ```

   To hear the reason, ask the compiler (`compile/skip.mjs`):

   ```bash
   node compile/skip.mjs
   ```

   ```text
   "kind": "CompileError",
   "reason": "Cannot reassign variables declared outside of the component/hook",
   "description": "Variable `visits` is declared outside of the component/hook. Reassigning this value during render is a form of side effect ..."
   ```

   Or make the build stop: `reactCompilerPreset({ panicThreshold: 'all_errors' })` (`versions/c-config/vite.panic.config.ts`):

   ```bash
   node use.mjs x-skip panic
   npx vite build
   ```

   ```text
   error during build:
   RolldownError: [BabelError] Found 1 error:
   Error: Cannot reassign variables declared outside of the component/hook
   Variable `visits` is declared outside of the component/hook. ...
   > 19 |   visits = visits + 1
        |   ^^^^^^ `visits` cannot be reassigned
   ```

   `node compile/all.mjs` lists every file: our own counter hook was skipped too (`useRenderCount.ts`: `Cannot access refs during render`), because it changes a ref while rendering. That is fine for a debugging tool. In real code, keep components pure (Module 7, lesson 1) and the compiler can help. The other samples show more reasons: `Glob.jsx` (a changing outside variable) and `Hookif.jsx` (a hook inside an `if`) are errors; `Mutate.jsx` and `Time.jsx` compile.
4. **Adding these tools everywhere, before measuring.** Each one is more code to read and a dependency list to get right. Measure first (lesson 1), then add one tool at a time. Or let the compiler do it.

## Clean up

Press Ctrl+C in the terminal. Run `node use.mjs v5-usememo` to put the plain Vite config and the stage back, and delete `dist`, `node_modules` if you like.

## Try it yourself

Wrap one component in `memo`, and pass it a function written inside its parent. Watch the counter. Then fix it with `useCallback`. Then turn the compiler on, and delete them all.

Interview tip. "When would you use `memo`, `useMemo` and `useCallback`?" Only after measuring a real slowdown. `memo` skips a component whose props did not change. `useCallback` keeps a function the same so that `memo` works. `useMemo` keeps an expensive result. Then add: the React Compiler can do this automatically, so in a new project I would turn it on and write plain code.

## Next

[M15-L03 · Code Splitting](../m15-l03-code-splitting/README.md)
