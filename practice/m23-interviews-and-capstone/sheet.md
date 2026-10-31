# Module 23 · Final Practice Sheet: 50 Interview Questions and 10 Machine-Coding Tasks

This is the last sheet of the course. It has two parts, and both come straight from Module 23:

- **Part 1 · the 50 most-asked React questions** (the same 50, in the same order and with the same numbers, as module 23, lesson 1). Say the answer out loud in your own words first. Then open the hint (it tells you where the course taught it), and last the model answer.
- **Part 2 · 10 machine-coding tasks.** The first four are the ones from module 23, lesson 2 (the search box, the endless list, the star rating and the nested comments). Six more follow in the same style: tabs, a toast stack, a modal with a focus trap, a debounced filter table, a reorder list with buttons, and a multi-step form.

**How to work:**
- Use **Node 24** (check with `node --version`). For Part 2 make one practice project: `npm create vite@latest practice`, choose **React** and **TypeScript**, then `cd practice` and `npm run dev`. Put each task in its own file, `src/tasks/T01.tsx` to `T10.tsx`, each with `export default function T01() { ... }`, and show it from `src/App.tsx` exactly like the lessons did. **Take `StrictMode` out of `src/main.tsx`** while you do tasks 1, 2 and 8: they count real runs and real requests, and `StrictMode` runs effects twice in development (module 7, lesson 2).
- **Set a timer.** Every task has a time budget. In a real round nobody wants a clever trick: the interviewer watches the questions you ask, the order you work in, and whether it runs (module 23, lesson 2).
- **Ask the requirement questions first, out loud**, even when you work alone. Write the answers at the top of the file as comments.
- Every task has: a goal, requirement questions to ask first, starter notes, **what you should see** (the **real text** copied from a Playwright run of the finished solution), an acceptance checklist (keyboard, empty case, slow case, error case), and the solution file.
- All 10 solutions are in the folder **`solutions/`** next to this sheet. It is a real Vite + React 19 + TypeScript project with a menu: run `npm install` and `npm run dev` inside it, then click a task. Each task is `src/tasks/TNN.tsx`. Pure helpers that need no browser are in `src/lib/`.
- **The practice A P I.** Tasks 1 and 2 talk to a tiny local server, `solutions/api/server.mjs`. Start it in a second terminal with `node api/server.mjs` (port 8239; `SEED=1 node api/server.mjs` makes its random answer times repeat). Every answer takes a random time, 150 to 1200 ms. Add `&delay=2500` to a request to make it slow, and `&fail=1` to make it answer with a 500. The two tick boxes at the top of tasks 1 and 2 do this for you, and `?fail=1` or `?slow=1` in the page address switches a mode on from the start.
- The "real text" is what the page showed after Playwright did exactly the steps written in the `solutions/scripts/drive.mjs` script. Each block starts with a line like `--- after 3 likes ---`. Run it yourself: start the dev server (`npm run dev`, port 5239) and the API, then `node scripts/drive.mjs` (or `node scripts/drive.mjs 7` for one task). It needs `playwright-core` and a Chrome; set `PW` and `CHROME` if yours are in other places. The real screenshots are not copied into this repository; the text of each run is in `solutions/shots/tNN.txt`.
- Four tasks also have a check that needs **no browser**: `node scripts/check04.ts`, `check08.ts`, `check09.ts` and `check10.ts` inside `solutions/` (Node 24 runs `.ts` files directly). Their raw output is in `solutions/shots/checkNN.txt`.
- Check types and the build with `npm run build` (it runs `tsc -b` and then `vite build`).

---

# Part 1 · The 50 most-asked React questions

## Rendering · 7 questions

*what React does when it draws the screen*

### 1 · Is JSX just HTML?

<details><summary>Hint: where the course taught it</summary>

See **module 3, lesson 2** (The Rules of JSX). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- No: JSX is syntax that turns into **function calls** that create elements
- It looks like HTML, with **stricter rules**: one parent, closed tags, `className`

Taught in module 3, lesson 2: The Rules of JSX.

</details>

### 2 · Can a component change its own props?

<details><summary>Hint: where the course taught it</summary>

See **module 3, lesson 4** (Props). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- No: props are **read-only**. They belong to the parent
- What must change over time is **state**: the memory of the component

Taught in module 3, lesson 4: Props.

</details>

### 3 · What is the virtual DOM? Is it why React is fast?

<details><summary>Hint: where the course taught it</summary>

See **module 14, lesson 1** (The Virtual DOM and Reconciliation). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- A light **tree of objects** that describes the screen. React compares the new tree with the old one
- Only the **differences** go to the real DOM
- Not magic speed: simple code, and **small, correct updates**

Taught in module 14, lesson 1: The Virtual DOM and Reconciliation.

</details>

### 4 · What is the difference between onClick={handler} and onClick={handler()}?

<details><summary>Hint: where the course taught it</summary>

See **module 4, lesson 1** (Handling Events). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- `onClick={handler}` passes the function: React calls it **when the click happens**
- `onClick={handler()}` calls it **right now, while rendering**, and passes the result

Taught in module 4, lesson 1: Handling Events.

</details>

### 5 · When does a component render again?

<details><summary>Hint: where the course taught it</summary>

See **module 14, lesson 3** (Why a Component Re-renders). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- Its own **state** changes
- Its **parent** renders
- A **context** it reads changes

Taught in module 14, lesson 3: Why a Component Re-renders.

</details>

### 6 · Why does setCount(count + 1) three times add only one?

<details><summary>Hint: where the course taught it</summary>

See **module 4, lesson 3** (How Rendering Works). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- State is a **snapshot**: all three calls read the same `count` from this render
- Pass an **updater**: `setCount(c => c + 1)` builds on the result before it

Taught in module 4, lesson 3: How Rendering Works.

</details>

### 7 · Why can't you change state directly?

<details><summary>Hint: where the course taught it</summary>

See **module 4, lesson 4** (Updating Objects and Arrays in State). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- React decides whether to draw again by comparing old and new state **by reference**
- Change an object in place and it is the **same object**: no change seen
- Make a **new copy**: spread, `map`, `filter`

Taught in module 4, lesson 4: Updating Objects and Arrays in State.

</details>

## State and hooks · 7 questions

*memory inside a component, and sharing it*

### 8 · What are hooks, and what are the rules of hooks?

<details><summary>Hint: where the course taught it</summary>

See **module 7, lesson 6** (Custom Hooks). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- Functions whose names start with `use`: they give a component **memory** and abilities
- Call them only at the **top level**: never inside `if`, loops, or after a return
- And only inside **components** or other **hooks**

Taught in module 7, lesson 6: Custom Hooks.

</details>

### 9 · What does "lifting state up" mean?

<details><summary>Hint: where the course taught it</summary>

See **module 4, lesson 5** (Lifting State Up). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- Several components need the same state: move it to their **closest common parent**
- Pass the value **down as props**, and a **callback** so children can ask for changes. One **source of truth**

Taught in module 4, lesson 5: Lifting State Up.

</details>

### 10 · Controlled or uncontrolled input?

<details><summary>Hint: where the course taught it</summary>

See **module 5, lesson 3** (Controlled Inputs). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- **Controlled**: React state is the truth. The input shows `value`; `onChange` updates it
- **Uncontrolled**: the browser keeps the value, and you read it when needed, for example with a ref

Taught in module 5, lesson 3: Controlled Inputs.

</details>

### 11 · What is the difference between useRef and useState?

<details><summary>Hint: where the course taught it</summary>

See **module 7, lesson 4** (useRef). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- Both keep a value **between renders**
- Changing state **draws again**. Changing a ref does not
- State for what the screen shows. A ref for **DOM elements** and **timer ids**

Taught in module 7, lesson 4: useRef.

</details>

### 12 · What is derived state, and why avoid storing it?

<details><summary>Hint: where the course taught it</summary>

See **module 5, lesson 5** (Choosing the State Shape). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- A value you can **calculate** from props or other state
- Store it, and you get **two sources of truth** that can disagree
- Keep the **smallest state**. Calculate the rest while rendering

Taught in module 5, lesson 5: Choosing the State Shape.

</details>

### 13 · What is context, and what is its drawback?

<details><summary>Hint: where the course taught it</summary>

See **module 10, lesson 2** (Context). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- A value read from the **closest provider above**, without passing props through every level
- Drawback: **every reader is drawn again** when the value changes
- Split contexts by topic. Keep **fast-changing** state local

Taught in module 10, lesson 2: Context.

</details>

### 14 · When would you choose useReducer over useState?

<details><summary>Hint: where the course taught it</summary>

See **module 10, lesson 3** (useReducer). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- State with **several parts** that change together, or many events
- The rules live in **one pure function**: easy to test
- Every change is a **named action**

Taught in module 10, lesson 3: useReducer.

</details>

## Keys, lists and conditions · 6 questions

*identity, lists and what to show when*

### 15 · Why does React need keys? Why is the index a bad key?

<details><summary>Hint: where the course taught it</summary>

See **module 5, lesson 2** (Rendering Lists and Keys). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- Keys let React **match items** between renders: each keeps its identity and state
- An index **changes** when items are inserted, removed or moved
- Then typed text sticks to the **wrong item**. Use a **stable id**

Taught in module 5, lesson 2: Rendering Lists and Keys.

</details>

### 16 · What happens when a component's key changes?

<details><summary>Hint: where the course taught it</summary>

See **module 14, lesson 2** (Identity, Keys and State Preservation). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- React throws the old one away: **unmount**, then **mount** a new one
- All its state **starts fresh**: a key resets a whole branch

Taught in module 14, lesson 2: Identity, Keys and State Preservation.

</details>

### 17 · How does React decide to keep or reset a component's state?

<details><summary>Hint: where the course taught it</summary>

See **module 14, lesson 2** (Identity, Keys and State Preservation). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- It compares the old and new tree **by position**
- **Same type, same place, same key**: the state is kept
- A different type or key: the old one is **unmounted**, a new one mounted

Taught in module 14, lesson 2: Identity, Keys and State Preservation.

</details>

### 18 · Why does {count && <Badge />} sometimes show a 0?

<details><summary>Hint: where the course taught it</summary>

See **module 5, lesson 1** (Conditional Rendering). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- `&&` gives back the **left side** when it is falsy, and `0` is falsy
- And React **does draw** the number 0
- Compare first: `count > 0 && ...`, or use a ternary

Taught in module 5, lesson 1: Conditional Rendering.

</details>

### 19 · How do you handle loading, error and empty states?

<details><summary>Hint: where the course taught it</summary>

See **module 9, lesson 3** (Generic Components and UI States). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- Keep **one status**: loading, error or success
- Draw **each case** on its own, and do not forget the **empty list**
- In TypeScript, a **union** makes each state carry only its own data

Taught in module 9, lesson 3: Generic Components and UI States.

</details>

### 20 · How do you sort a list without changing the original?

<details><summary>Hint: where the course taught it</summary>

See **module 2, lesson 3** (map, filter and Friends). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- `sort` changes the array **in place**
- Use `toSorted`, or copy first with **spread**
- `map` and `filter` always return a **new array**

Taught in module 2, lesson 3: map, filter and Friends.

</details>

## Effects · 7 questions

*keeping the page in sync with the outside world*

### 21 · What is a side effect, and where do you put it?

<details><summary>Hint: where the course taught it</summary>

See **module 7, lesson 1** (useEffect: Syncing with the Outside World). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- Anything a component does besides working out what to show: **title, timer, server call**
- Render stays **pure**
- Caused by a click: **event handler**. Must stay in sync: **`useEffect`**

Taught in module 7, lesson 1: useEffect: Syncing with the Outside World.

</details>

### 22 · What does the dependency array do?

<details><summary>Hint: where the course taught it</summary>

See **module 7, lesson 2** (Dependencies, Cleanup and Strict Mode). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- `[]`: run **once**, after the first render
- `[a, b]`: run again when **a or b changed**
- No array: run after **every** render. List everything the effect reads

Taught in module 7, lesson 2: Dependencies, Cleanup and Strict Mode.

</details>

### 23 · What is the cleanup function?

<details><summary>Hint: where the course taught it</summary>

See **module 7, lesson 2** (Dependencies, Cleanup and Strict Mode). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- The function you **return** from the effect
- It runs **before the next run**, and when the component **leaves**
- Stop what you started: timers, listeners, connections

Taught in module 7, lesson 2: Dependencies, Cleanup and Strict Mode.

</details>

### 24 · Why does my effect run twice?

<details><summary>Hint: where the course taught it</summary>

See **module 7, lesson 2** (Dependencies, Cleanup and Strict Mode). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- **Strict Mode** mounts, cleans up and mounts again, on purpose
- It checks that your **cleanup works**. Production does not do it
- The fix: **write the cleanup**, never remove Strict Mode

Taught in module 7, lesson 2: Dependencies, Cleanup and Strict Mode.

</details>

### 25 · What is a stale closure?

<details><summary>Hint: where the course taught it</summary>

See **module 7, lesson 2** (Dependencies, Cleanup and Strict Mode). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- A function that remembers **old values** from the render where it was made
- An effect with a **missing dependency** keeps using the first snapshot
- Fix: put the value in the list. The **linter rule** finds it

Taught in module 7, lesson 2: Dependencies, Cleanup and Strict Mode.

</details>

### 26 · When should you not use useEffect?

<details><summary>Hint: where the course taught it</summary>

See **module 7, lesson 3** (You Might Not Need an Effect). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- Not for values you can **calculate** while rendering
- Not for answering a **user event**: use the handler
- Not for **resetting state** when a prop changes: use a `key`

Taught in module 7, lesson 3: You Might Not Need an Effect.

</details>

### 27 · How do you avoid a race condition when fetching in an effect?

<details><summary>Hint: where the course taught it</summary>

See **module 7, lesson 5** (Fetching Data in an Effect). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- **Return a cleanup** from the effect
- Set an **ignore flag**, so stale answers never update state
- Or **abort** the request with an `AbortController`

Taught in module 7, lesson 5: Fetching Data in an Effect.

</details>

## Performance · 6 questions

*measure first, and one trap*

### 28 · A page feels slow. What do you do first?

<details><summary>Hint: where the course taught it</summary>

See **module 15, lesson 1** (Measuring Performance). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- **Do not guess**: reproduce it in a production build
- **Measure** with the Profiler and the web vitals
- Change **one thing**, then measure again

Taught in module 15, lesson 1: Measuring Performance.

</details>

### 29 · How do you reduce re-renders without memo?

<details><summary>Hint: where the course taught it</summary>

See **module 14, lesson 3** (Why a Component Re-renders). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- **Move state down**, into the small part that uses it
- Pass the slow part as **children**: its parent does not draw again
- And **measure** before reaching for tools

Taught in module 14, lesson 3: Why a Component Re-renders.

</details>

### 30 · What do memo, useMemo and useCallback do?

<details><summary>Hint: where the course taught it</summary>

See **module 15, lesson 2** (memo, useMemo, useCallback and the React Compiler). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- `memo` skips a component whose **props did not change**
- `useMemo` keeps a **result**. `useCallback` keeps a **function** the same
- Use them only after **measuring** a real slowdown

Taught in module 15, lesson 2: memo, useMemo, useCallback and the React Compiler.

</details>

### 31 · What is the React Compiler?

<details><summary>Hint: where the course taught it</summary>

See **module 15, lesson 2** (memo, useMemo, useCallback and the React Compiler). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- A build step that adds **memoization** for you, automatically
- In a new project: turn it on and **write plain code**

Taught in module 15, lesson 2: memo, useMemo, useCallback and the React Compiler.

</details>

### 32 · How do you reduce the size of the bundle?

<details><summary>Hint: where the course taught it</summary>

See **module 15, lesson 3** (Code Splitting). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- **Measure** first with a bundle analyser
- Split by route with **`lazy` and `Suspense`**
- **Prefetch** the next page. An **error boundary** for chunks that fail

Taught in module 15, lesson 3: Code Splitting.

</details>

### 33 · How do you keep a list of ten thousand items fast?

<details><summary>Hint: where the course taught it</summary>

See **module 15, lesson 4** (Long Lists and Transitions). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- **Virtualise** it: only the visible rows are in the page
- `useTransition` or `useDeferredValue` keep **typing responsive**
- Then **measure** again

Taught in module 15, lesson 4: Long Lists and Transitions.

</details>

## Next.js and server components · 7 questions

*what runs where*

### 34 · Why Next.js instead of plain React?

<details><summary>Hint: where the course taught it</summary>

See **module 19, lesson 1** (Why a Framework). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- Not for **less JavaScript**: it does not give you that
- The first answer has the **HTML with content**: first paint, and search engines
- Routing, rendering and data in **one structure**. Measure both

Taught in module 19, lesson 1: Why a Framework.

</details>

### 35 · How is the App Router different from React Router?

<details><summary>Hint: where the course taught it</summary>

See **module 19, lesson 2** (The App Router). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- The routes are **folders**, not a list in code
- Special files in each folder: **`layout`, `loading`, `error`, `not-found`**

Taught in module 19, lesson 2: The App Router.

</details>

### 36 · Server components or client components?

<details><summary>Hint: where the course taught it</summary>

See **module 19, lesson 3** (Server and Client Components). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- **Server** components run on the server. Their code is **never sent** to the browser
- They cannot use **state, effects or browser APIs**
- **Client** components (`"use client"`) can: they are the interactive parts

Taught in module 19, lesson 3: Server and Client Components.

</details>

### 37 · Does "use client" mean the component runs only in the browser?

<details><summary>Hint: where the course taught it</summary>

See **module 19, lesson 3** (Server and Client Components). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- **No**: a client component is also rendered once on the server, as **HTML**
- Then it is **hydrated** in the browser: the handlers are attached

Taught in module 19, lesson 3: Server and Client Components.

</details>

### 38 · Static or dynamic rendering?

<details><summary>Hint: where the course taught it</summary>

See **module 19, lesson 4** (Data Fetching, Caching and Streaming). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- **Static**: made once, at build time, and shared
- **Dynamic**: made at every visit
- The middle way: a **static shell** with dynamic parts **streamed** in

Taught in module 19, lesson 4: Data Fetching, Caching and Streaming.

</details>

### 39 · Are Server Actions safe?

<details><summary>Hint: where the course taught it</summary>

See **module 19, lesson 5** (Server Actions). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- Functions that run on the server, called from a **form** or a click
- But they are **public POST endpoints**
- Check **who, whether allowed, and the input** in every action

Taught in module 19, lesson 5: Server Actions.

</details>

### 40 · Which environment variables reach the browser in Next.js?

<details><summary>Hint: where the course taught it</summary>

See **module 21, lesson 1** (Building for Production). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- Only names that start with **`NEXT_PUBLIC_`**
- They are **pasted in at build time**: editing the file later changes nothing
- Every other name stays on the server. **Never put a secret in a public name**

Taught in module 21, lesson 1: Building for Production.

</details>

## Forms, data and security · 6 questions

*the server, and who to trust*

### 41 · Why not keep API data in useState or context?

<details><summary>Hint: where the course taught it</summary>

See **module 11, lesson 1** (Why Server State Is Different). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- It is not your data: it is a **cached copy** of someone else's
- You would build **keys, freshness, refreshing, shared requests** yourself
- A **server-state library** such as TanStack Query does it

Taught in module 11, lesson 1: Why Server State Is Different.

</details>

### 42 · What is an optimistic update?

<details><summary>Hint: where the course taught it</summary>

See **module 11, lesson 3** (Mutations and Optimistic Updates). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- Update the screen **before the server answers**
- **Roll back** if it fails
- Skip it when failure is costly, like **payments**. Always **refetch** at the end

Taught in module 11, lesson 3: Mutations and Optimistic Updates.

</details>

### 43 · Why is React Hook Form faster than a controlled form?

<details><summary>Hint: where the course taught it</summary>

See **module 12, lesson 1** (React Hook Form). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- **Uncontrolled inputs and refs**: typing does not change React state
- The form is **not drawn again** on every key

Taught in module 12, lesson 1: React Hook Form.

</details>

### 44 · TypeScript checks types, so why do you need Zod?

<details><summary>Hint: where the course taught it</summary>

See **module 9, lesson 4** (Typing API Data with Zod). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- TypeScript types **exist only while compiling**: they are erased
- Data from a network can be **anything**
- Zod checks the **real data at run time**. `z.infer` gives the type

Taught in module 9, lesson 4: Typing API Data with Zod.

</details>

### 45 · Where do you store a JWT in a single-page app?

<details><summary>Hint: where the course taught it</summary>

See **module 13, lesson 1** (Login Flows: Sessions vs JWT). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- **Not in localStorage**: any script on the page can read it
- The short access token lives **in memory**
- The refresh token goes in an **HttpOnly, same-site cookie**

Taught in module 13, lesson 1: Login Flows: Sessions vs JWT.

</details>

### 46 · What does an error boundary not catch?

<details><summary>Hint: where the course taught it</summary>

See **module 14, lesson 5** (Suspense and Error Boundaries). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- Errors in **event handlers**
- Errors in **async code**: timers, fetch callbacks
- Errors in the **boundary itself**

Taught in module 14, lesson 5: Suspense and Error Boundaries.

</details>

## Testing and tooling · 4 questions

*tests, and the tools around them*

### 47 · How do you decide what to query in a React test?

<details><summary>Hint: where the course taught it</summary>

See **module 17, lesson 2** (Testing Like a User). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- The way a user finds it: **by role and name**
- Then the test also protects **accessibility**
- A **test id** is the last resort

Taught in module 17, lesson 2: Testing Like a User.

</details>

### 48 · Why mock the network instead of fetch?

<details><summary>Hint: where the course taught it</summary>

See **module 17, lesson 3** (Mocking the API with MSW). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- The component still calls `fetch` **exactly as in production**
- So the test checks the **real code path**
- And the same rules work for **every component**

Taught in module 17, lesson 3: Mocking the API with MSW.

</details>

### 49 · What do you test at which level?

<details><summary>Hint: where the course taught it</summary>

See **module 17, lesson 4** (End-to-End Tests with Playwright). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- **Logic** and **components**: the cheap levels
- Only the few **key journeys** end to end
- Slow tests are the **first to turn flaky**

Taught in module 17, lesson 4: End-to-End Tests with Playwright.

</details>

### 50 · Linter or formatter?

<details><summary>Hint: where the course taught it</summary>

See **module 18, lesson 1** (Linting, Formatting and Strict Mode). Try the answer in two or three short sentences before you open the model answer.

</details>

<details><summary>Model answer</summary>

- **Linter**: finds mistakes and risky patterns, like a missing dependency
- **Formatter**: changes only the layout, never the meaning
- Teams use both, on **every commit**

Taught in module 18, lesson 1: Linting, Formatting and Strict Mode.

</details>

---

# Part 2 · 10 machine-coding tasks

## Task 1 · Search box with suggestions

**Time budget.** 45 minutes: about 8 for questions and plan, 22 for code, 15 for the keyboard and the edge cases.

**Goal.** Build a search box for course names. While the user types, show up to six suggestions from the practice A P I (`GET /search?q=...`). Arrow keys move through the suggestions, Enter picks one, Escape closes the list.

**Ask these first** (say them out loud, answer them yourself):

- How many keystrokes may become requests? (Wait 250 ms of silence: **debounce**.)
- What happens to an answer that arrives late, after the user typed more? (It must never overwrite a newer one: **cancel** it.)
- What does the list say while loading, when nothing matches, and when the server fails?
- Mouse and keyboard both? Is this a screen-reader control? (Then it is a `combobox` with a `listbox`.)

**Starter notes.** State: `text` (what the input shows), `query` (what we search for), `items`, `status` (`idle`, `loading`, `done`, `error`), `active` (the highlighted row). One `useEffect` on `query`: start a timer, and in its cleanup clear the timer **and** abort the `fetch` with an `AbortController` (module 7, lesson 5). Use `aria-activedescendant` so focus stays in the input.

**What you should see.** Real text from the Playwright run of the finished solution (`scripts/drive.mjs`, task 1):

```text
--- start ---
Slow API (2.5 s)Failing API (500)
--- after typing "rea" fast (3 keys, 80 ms apart) ---
Slow API (2.5 s)Failing API (500)
React for Beginners
React Hooks in Practice
Testing React Apps
--- practice API log: how many searches were sent? ---
search q=rea (done)
--- keyboard: ArrowDown, ArrowDown, then Enter ---
highlighted: React Hooks in Practice
input now: React Hooks in Practice
list open: false
--- empty case: "zzz" ---
Slow API (2.5 s)Failing API (500)
No courses found
--- slow case: typed "py", then "pyt" while the first answer was still on its way ---
Slow API (2.5 s)Failing API (500)
Python from Zero
Python Basics
Async Python
Python Performance
--- practice API log (the first request must be closed by the browser) ---
search q=py (closed by the browser)
search q=pyt (done)
--- error case: API answers 500 ---
Slow API (2.5 s)Failing API (500)
Something went wrong
--- console errors ---
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
```

**Acceptance checklist.**

- [ ] Typing three letters fast sends **one** request.
- [ ] Typing again while a request is on its way **closes** the old one (look at the log of the practice A P I).
- [ ] ArrowDown, ArrowUp, Enter and Escape work with the mouse put away; the list wraps at both ends.
- [ ] Empty case: the list says `No courses found`.
- [ ] Slow case (tick Slow API): `Loading...` shows, and an old answer never replaces a newer one.
- [ ] Error case (tick Failing API): `Something went wrong`, and the page does not crash.
- [ ] The input has a label, `role="combobox"`, `aria-expanded` and `aria-controls`.

**Real text of the run:** `solutions/shots/t01.txt` (the screenshot is not copied into this repository)

**Solution file:** `solutions/src/tasks/T01.tsx`

**If you finish early.** Highlight the matching letters. Remember the last five searches.

---

## Task 2 · Endless list

**Time budget.** 35 minutes.

**Goal.** Show the lessons of the practice A P I (`GET /feed?page=N`, ten per page, 50 in all) as a list that loads the next page by itself when the user scrolls near the bottom. Show a counter at the top.

**Ask these first** (say them out loud, answer them yourself):

- Scroll event or `IntersectionObserver`? (Observer: no work on every scroll.)
- What if the user scrolls fast: can one scroll start two requests of the same page? (Use a lock.)
- What shows at the end of the data, and when a page fails to load?
- Do the rows have a fixed height? (It keeps the layout from jumping.) Is the list so long that it needs virtualising? (module 15, lesson 4)

**Starter notes.** A `sentinel` div after the last row. An `IntersectionObserver` with `rootMargin: '200px'` calls `loadMore` when the sentinel is near the screen. A `loading` **ref** (not state) is the lock. `status` is `idle`, `loading`, `end` or `error`; `error` shows a Retry button. Put `console.log('load page', page)` in `loadMore` so you can see every request.

**What you should see.** Real text from the Playwright run of the finished solution (`scripts/drive.mjs`, task 2):

```text
--- after the first load (no scrolling yet, the window is tall) ---
10 lessons loaded
last row: Lesson 10: Short-hand Logic
bottom: Loading...
--- after scrolling to the bottom ---
50 lessons loaded
last row: Lesson 50: useQuery
bottom: That is all
--- console log of the page ---
load page 1
load page 2
load page 3
load page 4
load page 5
--- error case: API answers 500 on page 1 (opened with ?fail=1) ---
0 lessons loaded
last row: (none)
bottom: Could not load more.Retry
--- after the API is fixed and Retry was clicked ---
10 lessons loaded
last row: Lesson 10: Short-hand Logic
bottom: (empty)
--- console errors ---
Failed to load resource: the server responded with a status of 500 (Internal Server Error)
```

**Acceptance checklist.**

- [ ] The first page loads without any scrolling.
- [ ] Scrolling to the bottom loads pages 2 to 5 **once each** (the console log shows each page one time).
- [ ] At the end the sentinel says `That is all` and no more requests are made.
- [ ] Error case (open the page with `?fail=1`): `Could not load more.` and a **Retry** button; Retry works once the A P I is fixed.
- [ ] Slow case: `Loading...` shows and a second scroll does not start a second request.
- [ ] The observer is disconnected in the effect cleanup.

**Real text of the run:** `solutions/shots/t02.txt` (the screenshot is not copied into this repository)

**Solution file:** `solutions/src/tasks/T02.tsx`

**If you finish early.** Keep the scroll position when the user comes back. Add a `Load more` button as a fallback for keyboard users.

---

## Task 3 · Star rating

**Time budget.** 30 minutes.

**Goal.** Build a five-star rating. Hover shows a preview, click sets the value, clicking the same star again clears it. Below it, a line says what the user rated.

**Ask these first** (say them out loud, answer them yourself):

- How many stars? Half stars? (Make `max` a prop.)
- Can the rating be cleared?
- Keyboard: which keys? (Arrow keys, Home and End, like a radio group.)
- What does a screen reader announce? (A radio group with a label, and `1 star`, `2 stars`.)

**Starter notes.** `value` and `hover` in state; `hover || value` decides how many stars are lit. Each star is a `button` with `role="radio"` and `aria-checked`. Use a **roving tab index**: only the checked star (or the first, when nothing is chosen) has `tabIndex={0}`, so the whole group is one tab stop. Keep the buttons in a `ref` array so the arrow keys can move focus.

**What you should see.** Real text from the Playwright run of the finished solution (`scripts/drive.mjs`, task 3):

```text
--- start ---
★
★
★
★
★
No rating yet
--- after clicking the 4th star ---
★
★
★
★
★
You rated this course 4 of 5
--- after clicking the 4th star again (clears it) ---
★
★
★
★
★
No rating yet
--- keyboard: ArrowRight x2 ---
You rated this course 3 of 5
focused: 3 stars
checked: 3 stars
--- keyboard: End x1 ---
You rated this course 5 of 5
focused: 5 stars
checked: 5 stars
--- keyboard: ArrowLeft x1 ---
You rated this course 4 of 5
focused: 4 stars
checked: 4 stars
--- keyboard: Home x1 ---
You rated this course 1 of 5
focused: 1 star
checked: 1 star
--- keyboard: ArrowLeft x1 ---
You rated this course 1 of 5
focused: 1 star
checked: 1 star
--- Tab order: stars in the tab order ---
1
```

**Acceptance checklist.**

- [ ] Mouse: hover previews, click sets, a second click on the same star clears.
- [ ] Keyboard only: Tab enters the group **once**; Arrow keys change and focus together; Home goes to 1, End goes to 5; the ends do not wrap past 1 and 5.
- [ ] Empty case: with no rating the line says `No rating yet`.
- [ ] A visible focus ring on the focused star.
- [ ] The group has an `aria-label` and each star an `aria-label`.
- [ ] Nothing to load, so no slow or error case: say that out loud in the interview.

**Real text of the run:** `solutions/shots/t03.txt` (the screenshot is not copied into this repository)

**Solution file:** `solutions/src/tasks/T03.tsx`

**If you finish early.** Half stars. A read-only version for showing an average.

---

## Task 4 · Nested comments

**Time budget.** 45 minutes.

**Goal.** Show a tree of comments (replies to replies, any depth). Each comment can be collapsed, and can be replied to; a new reply shows up in the right place.

**Ask these first** (say them out loud, answer them yourself):

- How deep can it go? (Any depth: the component calls itself.)
- Collapsed: hide the replies, and say how many are hidden.
- Where does the new reply go, and who is the author? Empty reply?
- What is the data shape: a nested tree, or a flat list with `parentId`?

**Starter notes.** The data is a nested tree `{ id, author, text, replies }`. A `Comment` component renders its own `replies` with `Comment` again (recursion). Each comment keeps its own `open`, `replying` and `text` state. Adding a reply is a **pure function** that returns a new tree and keeps the branches that did not change (module 4, lesson 4). Use `crypto.randomUUID()` for ids.

**What you should see.** Real text from the Playwright run of the finished solution (`scripts/drive.mjs`, task 4):

```text
--- start ---
Clear all comments
Lukas The keys lesson helped.
CollapseReply
Meera Thank you, Lukas!
CollapseReply
Lukas Loved the demo.
Reply
Priya Same here.
Reply
Asha Can we get the code?
Reply
--- after Collapse on Lukas ---
Clear all comments
Lukas The keys lesson helped.
Show 3 repliesReply
Asha Can we get the code?
Reply
--- after Show 3 replies ---
Clear all comments
Lukas The keys lesson helped.
CollapseReply
Meera Thank you, Lukas!
CollapseReply
Lukas Loved the demo.
Reply
Priya Same here.
Reply
Asha Can we get the code?
Reply
--- after Reply on Priya: "Welcome, Priya" ---
Clear all comments
Lukas The keys lesson helped.
CollapseReply
Meera Thank you, Lukas!
CollapseReply
Lukas Loved the demo.
Reply
Priya Same here.
CollapseReply
Asha Welcome, Priya
Reply
Asha Can we get the code?
Reply
--- empty reply on Asha: Enter with nothing typed ---
Clear all comments
Lukas The keys lesson helped.
CollapseReply
Meera Thank you, Lukas!
CollapseReply
Lukas Loved the demo.
Reply
Priya Same here.
CollapseReply
Asha Welcome, Priya
Reply
Send
Asha Can we get the code?
Reply
--- after Clear all comments ---
Clear all comments
No comments yet
```

**No-browser check.** `node scripts/check04.ts` printed:

```text
replies under Lukas: 3
after adding a reply to c3: 4
comments: all checks passed
```

**Acceptance checklist.**

- [ ] Collapse hides every reply below, and the button says `Show 3 replies` (all depths, not only the children).
- [ ] Reply opens a field with focus; Enter sends; the new comment appears under the right parent and the parent opens.
- [ ] Empty case: an empty reply sends nothing. A list with no comments says `No comments yet`.
- [ ] The collapse button has `aria-expanded`; every button is reachable with Tab.
- [ ] The pure function `addReply` does not change the old tree: run `node scripts/check04.ts`.
- [ ] Slow and error case: say what you would do (a saving state, and a message when the post fails).

**Real text of the run:** `solutions/shots/t04.txt` (the screenshot is not copied into this repository)

**Solution file:** `solutions/src/tasks/T04.tsx` (and `src/lib/comments.ts`)

**If you finish early.** Edit and delete. Load replies on demand.

---

## Task 5 · Tabs

**Time budget.** 25 minutes.

**Goal.** Build a `Tabs` component that takes a list of `{ id, label, content }` and shows one panel at a time.

**Ask these first** (say them out loud, answer them yourself):

- Do the panels switch when focus moves, or only on Enter? (Here: they switch with focus.)
- Is the first tab open at the start? What if the list is empty?
- Keyboard keys: Left and Right (wrapping), Home, End.
- Should hidden panels keep their state? (`hidden` keeps them mounted.)

**Starter notes.** `selected` index in state. A `tablist` of `button role="tab"` with `aria-selected`, `aria-controls` and a **roving tab index** (only the selected tab has `tabIndex={0}`). Panels are `role="tabpanel"` with `aria-labelledby` and the `hidden` attribute. Keep the tab buttons in a `ref` array to move focus.

**What you should see.** Real text from the Playwright run of the finished solution (`scripts/drive.mjs`, task 5):

```text
--- start ---
Overview
Lessons
Reviews
Overview: 12 lessons, 3 hours.
--- after Tab (first stop is the Back to menu button above) ---
selected tab: Overview | focused: Back to menu | visible panel: Overview: 12 lessons, 3 hours.
--- after a second Tab (focus enters the tab list) ---
selected tab: Overview | focused: Overview | visible panel: Overview: 12 lessons, 3 hours.
--- after ArrowRight ---
selected tab: Lessons | focused: Lessons | visible panel: Lessons: start with What React Is.
--- after End ---
selected tab: Reviews | focused: Reviews | visible panel: Reviews: 4.8 out of 5.
--- after ArrowRight ---
selected tab: Overview | focused: Overview | visible panel: Overview: 12 lessons, 3 hours.
--- after Home ---
selected tab: Overview | focused: Overview | visible panel: Overview: 12 lessons, 3 hours.
--- after ArrowLeft ---
selected tab: Reviews | focused: Reviews | visible panel: Reviews: 4.8 out of 5.
--- tab stops in the list ---
1
```

**Acceptance checklist.**

- [ ] Tab goes to the selected tab **once**; the arrows move between tabs; the list wraps at both ends.
- [ ] Home and End jump to the first and last tab.
- [ ] Clicking a tab opens its panel; only one panel is visible.
- [ ] Empty case: an empty list renders `Nothing to show`, no crash.
- [ ] Every tab has an `id` linked to its panel by `aria-controls` and `aria-labelledby`.
- [ ] Nothing is loaded, so no slow or error case.

**Real text of the run:** `solutions/shots/t05.txt` (the screenshot is not copied into this repository)

**Solution file:** `solutions/src/tasks/T05.tsx`

**If you finish early.** Tabs that load their panel the first time they open (with a loading state).

---

## Task 6 · Toast stack

**Time budget.** 30 minutes.

**Goal.** Show short messages in a stack in a corner. Each goes away by itself, can be closed with a button, and only the newest three show at once.

**Ask these first** (say them out loud, answer them yourself):

- How long do they stay? (Configurable: 1.5 s or 4 s here.)
- Maximum on screen? What happens to the oldest?
- Pause when the mouse is over a toast?
- Is an error different from a success? (For a screen reader: `alert` against `status`.)

**Starter notes.** `toasts` array in state; push with `[...t, new].slice(-3)`. A `ToastItem` owns its own timer in a `useEffect` with cleanup (module 7, lesson 2); `paused` state (set by `onMouseEnter` and `onMouseLeave`) stops the clock. Pass a **stable** close function (`useCallback`) so the effect does not restart for no reason.

**What you should see.** Real text from the Playwright run of the finished solution (`scripts/drive.mjs`, task 6):

```text
--- start ---
Time on screen 
1.5 s
4 s
Add success toastAdd error toast
No toasts
--- after 4 success toasts (only the newest 3 stay) ---
Time on screen 
1.5 s
4 s
Add success toastAdd error toast
3 toasts on screen
Saved (2)
×
Saved (3)
×
Saved (4)
×
--- error toast role ---
alert
--- after 2.2 s (1.5 s time on screen) ---
Time on screen 
1.5 s
4 s
Add success toastAdd error toast
No toasts
--- hovering the toast for 2.2 s (the clock is paused) ---
Time on screen 
1.5 s
4 s
Add success toastAdd error toast
1 toast on screen
Saved (6)
×
--- mouse moved away, 2.2 s later ---
Time on screen 
1.5 s
4 s
Add success toastAdd error toast
No toasts
--- after clicking × on a toast ---
Time on screen 
1.5 s
4 s
Add success toastAdd error toast
No toasts
```

**Acceptance checklist.**

- [ ] Four quick toasts: only the newest three stay.
- [ ] Each toast goes away by itself after the chosen time.
- [ ] Hover pauses the clock; moving away starts it again.
- [ ] The × button closes one toast and has a name that says which.
- [ ] Empty case: with no toasts the page says `No toasts`.
- [ ] Error toasts use `role="alert"`; success toasts use `role="status"`.
- [ ] Timers are cleared when a toast goes away (no state update on a removed toast).

**Real text of the run:** `solutions/shots/t06.txt` (the screenshot is not copied into this repository)

**Solution file:** `solutions/src/tasks/T06.tsx`

**If you finish early.** Keep a toast open when the tab is hidden. An `Undo` button inside a toast.

---

## Task 7 · Modal with a focus trap

**Time budget.** 30 minutes.

**Goal.** Open a confirm dialog from a button. While it is open, keyboard focus cannot leave it; Escape and a click on the dark backdrop close it; focus goes back to the button that opened it.

**Ask these first** (say them out loud, answer them yourself):

- What gets focus when it opens? (The first field or button inside.)
- Escape closes? Backdrop click closes?
- Does the page behind keep scrolling or accept clicks? (No: `inert` or a trap.)
- Native `<dialog>` or hand-made? (Hand-made here, so the trap is visible.)

**Starter notes.** A `Dialog` component with `role="dialog"`, `aria-modal="true"` and `aria-labelledby`. On mount, remember `document.activeElement`, focus the first focusable element inside, and focus the remembered element in the effect **cleanup** (module 16, lesson 2). On `Tab` at the last element go to the first, on `Shift+Tab` at the first go to the last, with `preventDefault`. Put `inert` on the page behind.

**What you should see.** Real text from the Playwright run of the finished solution (`scripts/drive.mjs`, task 7):

```text
--- start ---
Open unenroll dialogAnother page button
Focus is on: nothing
--- dialog opened ---
Focus is on: Reason
--- after Tab ---
Focus is on: Keep my place
--- after Tab ---
Focus is on: Unenroll
--- after Tab ---
Focus is on: Reason
--- after Shift+Tab ---
Focus is on: Unenroll
--- page behind the dialog is inert ---
true
--- after Escape ---
Focus is on: Open unenroll dialog
--- after clicking the dark backdrop ---
Focus is on: Open unenroll dialog
```

**Acceptance checklist.**

- [ ] Open: focus is inside the dialog (on the first field).
- [ ] Tab and Shift+Tab cycle inside the dialog and never reach the page behind.
- [ ] Escape closes it, and focus is back on `Open unenroll dialog`.
- [ ] A click on the dark backdrop closes it; a click inside does not.
- [ ] The dialog has a name (`aria-labelledby`) and the page behind is `inert`.
- [ ] Empty, slow and error cases do not apply: say so, and say what you would add (a busy state on the Unenroll button).

**Real text of the run:** `solutions/shots/t07.txt` (the screenshot is not copied into this repository)

**Solution file:** `solutions/src/tasks/T07.tsx`

**If you finish early.** Stop the page behind from scrolling. Use the native `<dialog>` and compare.

---

## Task 8 · Debounced filter table

**Time budget.** 30 minutes.

**Goal.** Show a table of eight courses with a filter box. Filtering waits until the user stops typing for 300 ms. The Price column sorts up, down, and back to the original order.

**Ask these first** (say them out loud, answer them yourself):

- Which columns can be filtered, and is it case-sensitive? (Title, any case, spaces trimmed.)
- How long to wait after the last key?
- What does an empty result say? Can the user clear the filter in one click?
- Where does the filter logic live? (A pure function: easy to test.)

**Starter notes.** Keep the text the user types in state, and a `useDebounced(text, 300)` hook (a `setTimeout` in an effect with cleanup; module 7, lesson 6). The table shows `filterCourses(COURSES, debounced, dir)`, a pure function that never changes the original array (`toSorted`, module 2, lesson 3). `aria-sort` on the sorted column.

**What you should see.** Real text from the Playwright run of the finished solution (`scripts/drive.mjs`, task 8):

```text
--- start ---
Showing 8 of 8 · filter applied 0 times
Title	Level	Price
React for Beginners	Beginner	Rs 499
SQL in Two Weeks	Beginner	Rs 399
Docker for Developers	Intermediate	Rs 599
System Design	Intermediate	Rs 999
Python from Zero	Beginner	Rs 349
Testing React Apps	Intermediate	Rs 549
Git and GitHub	Beginner	Rs 299
FastAPI in Practice	Intermediate	Rs 649
--- right after typing "react" (5 keys, debounce still waiting) ---
Showing 8 of 8 · filter applied 0 times
Title	Level	Price
React for Beginners	Beginner	Rs 499
SQL in Two Weeks	Beginner	Rs 399
Docker for Developers	Intermediate	Rs 599
System Design	Intermediate	Rs 999
Python from Zero	Beginner	Rs 349
Testing React Apps	Intermediate	Rs 549
Git and GitHub	Beginner	Rs 299
FastAPI in Practice	Intermediate	Rs 649
--- 500 ms later ---
Showing 2 of 8 · filter applied 1 times
Title	Level	Price
React for Beginners	Beginner	Rs 499
Testing React Apps	Intermediate	Rs 549
--- after clicking Price (ascending) ---
Showing 2 of 8 · filter applied 1 times
Title	Level	Price ▲
React for Beginners	Beginner	Rs 499
Testing React Apps	Intermediate	Rs 549
--- after clicking Price again (descending) ---
Showing 2 of 8 · filter applied 1 times
Title	Level	Price ▼
Testing React Apps	Intermediate	Rs 549
React for Beginners	Beginner	Rs 499
--- empty case: "zzz" ---
Showing 0 of 8 · filter applied 2 times
No courses match "zzz". Clear filter
--- after Clear filter ---
Showing 8 of 8 · filter applied 3 times
Title	Level	Price ▼
System Design	Intermediate	Rs 999
FastAPI in Practice	Intermediate	Rs 649
Docker for Developers	Intermediate	Rs 599
Testing React Apps	Intermediate	Rs 549
React for Beginners	Beginner	Rs 499
SQL in Two Weeks	Beginner	Rs 399
Python from Zero	Beginner	Rs 349
Git and GitHub	Beginner	Rs 299
```

**No-browser check.** `node scripts/check08.ts` printed:

```text
"react": [ 'React for Beginners', 'Testing React Apps' ]
price asc: [
  299, 349, 399,
  499, 549, 599,
  649, 999
]
filter: all checks passed
```

**Acceptance checklist.**

- [ ] Typing five letters fast filters **once**, after the pause (the status line counts the runs).
- [ ] Sorting works in three steps: ascending, descending, original order.
- [ ] Empty case: `No courses match "zzz"` with a **Clear filter** button.
- [ ] The input has a label; the sort button is reachable by keyboard and `aria-sort` changes.
- [ ] The original data array is never reordered: run `node scripts/check08.ts`.
- [ ] The status line says `Showing X of 8`.
- [ ] Slow and error case: local data, so none; say what changes when the data comes from a server.

**Real text of the run:** `solutions/shots/t08.txt` (the screenshot is not copied into this repository)

**Solution file:** `solutions/src/tasks/T08.tsx` (and `src/lib/courses.ts`)

**If you finish early.** Filter by level too. Keep the filter in the address bar (module 8, lesson 2).

---

## Task 9 · Reorder list with buttons

**Time budget.** 25 minutes.

**Goal.** Show five lessons in a list. Each row has an Up and a Down button, so a user without a mouse can reorder it. A reset button restores the first order.

**Ask these first** (say them out loud, answer them yourself):

- Why buttons and not drag and drop? (Dragging is hard for keyboard and screen-reader users; buttons are the accessible base.)
- What happens at the top and bottom? (The button is disabled.)
- Where does focus go after a move? Does the user hear what happened?
- Does the first order come back with Reset?

**Starter notes.** A **pure** `move(list, from, to)` that returns a new array and the **same** array when the move is impossible (module 4, lesson 4). Keys are the lesson names, so each row keeps its identity (module 5, lesson 2). Each button has a name that says its row: `Move Props up`. After a move, put focus back on the same button (on the other button when the pressed one is now disabled). A `role="status"` line says `Moved Props to position 1 of 5`.

**What you should see.** Real text from the Playwright run of the finished solution (`scripts/drive.mjs`, task 9):

```text
--- start ---
1. What React Is
Up
Down
2. Props
Up
Down
3. useState
Up
Down
4. useEffect
Up
Down
5. Context
Up
Down
Reset order
Order: What React Is, Props, useState, useEffect, Context
--- after Move Props up ---
1. Props
Up
Down
2. What React Is
Up
Down
3. useState
Up
Down
4. useEffect
Up
Down
5. Context
Up
Down
Reset order
Moved Props to position 1 of 5
Order: Props, What React Is, useState, useEffect, Context
--- Enter pressed 4 times on Move Context up ---
1. Context
Up
Down
2. Props
Up
Down
3. What React Is
Up
Down
4. useState
Up
Down
5. useEffect
Up
Down
Reset order
Moved Context to position 1 of 5
Order: Context, Props, What React Is, useState, useEffect
focused: Move Context down
--- buttons that are disabled ---
Move Context up
Move useEffect down
--- after Reset order ---
1. What React Is
Up
Down
2. Props
Up
Down
3. useState
Up
Down
4. useEffect
Up
Down
5. Context
Up
Down
Reset order
Order reset
Order: What React Is, Props, useState, useEffect, Context
```

**No-browser check.** `node scripts/check09.ts` printed:

```text
move C up: [ 'A', 'C', 'B', 'D' ]
reorder: all checks passed
```

**Acceptance checklist.**

- [ ] Up and Down move one row; the first row's Up and the last row's Down are disabled.
- [ ] Focus stays on the button after the move, so Enter pressed again keeps moving the same row.
- [ ] The status line announces every move.
- [ ] Reset order restores the first order.
- [ ] `move` does not change the input and returns the same array when impossible: run `node scripts/check09.ts`.
- [ ] Slow and error case: none for local data; say what you would do for a save to a server (undo on failure).

**Real text of the run:** `solutions/shots/t09.txt` (the screenshot is not copied into this repository)

**Solution file:** `solutions/src/tasks/T09.tsx` (and `src/lib/reorder.ts`)

**If you finish early.** Add real drag and drop on top, keep the buttons. Save the order in `localStorage` with a safe fallback.

---

## Task 10 · Multi-step form

**Time budget.** 45 minutes.

**Goal.** Enrolment in three steps: (1) name and email, (2) plan and accept the terms, (3) review and send. Next validates the step; Back keeps what was typed; the last step sends to a fake server.

**Ask these first** (say them out loud, answer them yourself):

- Which fields are required and what are the rules? (Name 2 letters or more; a valid email; a plan; terms.)
- When do errors show: while typing, or on Next? (On Next, and focus goes to the first problem.)
- What does Back do with the values? What happens after a failed send?
- Where do the rules live? (Pure functions, away from the component.)

**Starter notes.** One `form` state object for all steps, a `step` number, an `errors` object. `validate(step, form)` is a pure function that returns the errors of one step (module 5, lesson 4). On Next with errors, show them with `role="alert"`, `aria-invalid`, `aria-describedby`, and focus the first bad field. The fake server `submit(form)` is a promise that waits 800 ms and rejects for an email ending in `@fail.test`. Disable the buttons while sending.

**What you should see.** Real text from the Playwright run of the finished solution (`scripts/drive.mjs`, task 10):

```text
--- start ---
Step 1 of 3
Name
Email
Next
--- Next with empty step 1 ---
Step 1 of 3
Name
Name must be at least 2 letters
Email
Enter a valid email
Next
focused: name
--- name "A", email "nope" ---
Step 1 of 3
Name
Name must be at least 2 letters
Email
Enter a valid email
Next
--- step 1 fixed, moved on ---
Step 2 of 3
Plan
Choose...
Free
Pro
 I accept the terms
BackNext
--- Next with empty step 2 ---
Step 2 of 3
Plan
Choose...
Free
Pro
Choose a plan
 I accept the terms
You must accept the terms
BackNext
--- step 2 done, review ---
Step 3 of 3
Name: Asha
Email: asha@example.com
Plan: pro
BackEnroll
--- after Back: the plan is still ---
pro
--- right after Enroll ---
Step 3 of 3
Name: Asha
Email: asha@example.com
Plan: pro
BackSending...
--- after the fake server answered ---
Welcome, Asha! Enrolled on the pro plan.
--- error case: the server refuses @fail.test ---
Step 3 of 3
Name: Rahul
Email: rahul@fail.test
Plan: free
Could not enroll. Check the email and try again.
BackEnroll
--- values kept after the error: name, email ---
Rahul, rahul@fail.test
```

**No-browser check.** `node scripts/check10.ts` printed:

```text
empty step 1: {
  name: 'Name must be at least 2 letters',
  email: 'Enter a valid email'
}
empty step 2: { plan: 'Choose a plan', terms: 'You must accept the terms' }
submit ok: Welcome, Asha! Enrolled on the pro plan.
wizard: all checks passed
```

**Acceptance checklist.**

- [ ] Next on an empty step shows the messages and focuses the first bad field.
- [ ] Back keeps the values typed so far.
- [ ] The review step shows the values; Enroll shows `Sending...` and then the welcome line.
- [ ] Error case: the fake server refuses `@fail.test`: the message shows and **nothing typed is lost**.
- [ ] Double click on Enroll does not send twice (the button is disabled).
- [ ] Every field has a `label`; the error text is linked with `aria-describedby`.
- [ ] `validate` and `submit` work with no browser: run `node scripts/check10.ts`.

**Real text of the run:** `solutions/shots/t10.txt` (the screenshot is not copied into this repository)

**Solution file:** `solutions/src/tasks/T10.tsx` (and `src/lib/wizard.ts`)

**If you finish early.** Save the draft in `localStorage`. Show a progress bar. Rebuild it with React Hook Form and Zod (module 12).

---

# After the sheet

If you finished the 50 questions and the ten tasks, do one more thing: run a mock interview with a friend (module 23, lesson 4) and pick the next step from the roadmap there. Good luck.
