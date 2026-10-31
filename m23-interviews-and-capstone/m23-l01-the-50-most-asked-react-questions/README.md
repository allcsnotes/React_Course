# M23-L01 · The 50 Most-Asked React Questions

> Video: Module 23, Lesson 1. Watch it first, then use this page to practise.

## What you'll learn

- The fifty questions interviewers really ask about React, in eight themes, each with a short model answer
- Where in the course each answer was taught (module and lesson), so you can go back
- Six real runs that prove an answer in a few lines of code: render counts, state snapshots, a key that resets state, `0 &&`, a stale closure, a `memo` trap, and what a server component ships
- How to answer: one idea, in your own words, in about thirty seconds

## Before you start

- Node 24 (`node --version`) to run the demos. Nothing else is needed to read the answers.
- Rahul is the interviewer. The numbered questions are the same fifty, in the same order, as in the video, and as in the final practice sheet (`../../practice/m23-interviews-and-capstone/sheet.md`).
- Try this: cover the answers, read each question out loud, and answer it in thirty seconds. Then check yourself.

## Key ideas

- Each answer is short: one idea, then the reason. If an answer feels shaky, go back to the lesson named on its line.
- If Rahul asks something you only half know: say what you do know, say how you would check the rest, and name the trade-off. A short honest answer beats a long wrong one.

## Files in this folder

| File | What it is |
|------|------------|
| `web/` | A small Vite + React 19 project with the demo pages `?d=d1` to `?d=d6b` (the real runs below) |
| `web/zero.mjs` | The `0 &&` check, rendered to HTML in Node |
| `nx/` | A Next.js 16.4.3 project: a server page and a client counter, for the "what ships to the browser" proof |

## Run the demos

```bash
cd web
npm install
npm run dev
```
Open http://localhost:5231/?d=d1 (change `d1` to the demo you want; add `&strict=1` to turn Strict Mode on) and the browser console (F12). The demos are explained in the answers below (D1 to D6).

## Theme 1 · Rendering (questions 1 to 7)

1. **Is JSX just HTML?** No. JSX is syntax that is translated into function calls that create elements. It looks like HTML with stricter rules: one parent, closed tags, `className`, camelCase. (M3-L2)
2. **Can a component change its own props?** No. Props are read only; they belong to the parent. Anything that changes over time is state. (M3-L4)
3. **What is the virtual DOM, and is it why React is fast?** A light tree of objects that describes the screen. On every update React builds a new tree, compares it with the old one, and changes only the differences in the real DOM. It is not magic speed: it lets you describe the screen simply and still get small, correct updates. (M14)
4. **`onClick={handler}` or `onClick={handler()}`?** Without brackets you pass the function and React calls it on the click. With brackets you call it now, while rendering, and pass its result (usually `undefined`). (M4-L1)
5. **When does a component render again?** Three things: its own state changes, its parent renders, or a context it reads changes. (M14-L3)
6. **Why does `setCount(count + 1)` three times add only one?** State is a snapshot: all three calls read the same `count` from this render. Pass an updater, `setCount(c => c + 1)`, and each call builds on the one before. (M4-L3)
7. **Why can't you change state directly?** React compares old and new state by reference. If you change an object in place it is still the same object, so React sees no change. Make a copy with spread, `map` or `filter`. (M4-L4)

**Demo D1, render counts** (`?d=d1`). The parent keeps a number in state and draws a child that has no props or state. Real console:
```text
load:        Parent render 0 / Child render      (child drawn 1 times)
add one:     Parent render 1 / Child render      (child drawn 2 times)
set to 0 #1: Parent render 0 / Child render
set to 0 #2: Parent render 0                     (React called the parent once more, then stopped)
set to 0 #3: (nothing)
```
The child ran again only because its parent did. Not every render changes the page.

**Demo D1b, the same count three times** (`?d=d1b`). Guess: two buttons each call their setter three times, the first with `count + 1`, the second with the updater. After one click on each:
```text
plain 1 · updater 3
```
**Recap.** JSX turns into function calls. Props are read only. The virtual DOM is a tree to compare. Pass the function, do not call it. Re-renders come from state, parent, context. State is a snapshot, so use the updater. Never change state in place.

## Theme 2 · State and hooks (questions 8 to 14)

8. **What are hooks, and the rules of hooks?** Functions whose names start with `use`; they give a component memory and other abilities. Call them at the top level, never inside an `if`, a loop, or after an early return, and only inside components or custom hooks. (M7-L6)
9. **What does lifting state up mean?** When several components need the same state, move it to their closest common parent; pass the value down as props and a callback down so children can ask for a change. One source of truth. (M4-L5)
10. **Controlled or uncontrolled input?** Controlled: React state is the truth, the input shows the state value, every change goes through `onChange`. Uncontrolled: the browser keeps the value and you read it when needed, for example with a ref. (M5-L3)
11. **`useRef` or `useState`?** Both keep a value between renders. Changing state draws the component again; changing a ref does not. State for what the screen shows; refs for DOM elements and values like timer ids. (M7-L4)
12. **What is derived state, and why avoid storing it?** A value you can calculate from props or other state. Storing it gives two sources of truth that can disagree. Keep the smallest state and calculate the rest during render. (M5-L5)
13. **What is context, and its drawback?** A component reads a value from the closest provider above it, without passing props through every level. Every reader is drawn again when the value changes. Split contexts by topic and keep fast-changing state local. (M10-L2)
14. **`useReducer` over `useState`, when?** When state has several parts that change together, or many events change it. The rules live in one pure function that is easy to test, and every change is a named action. (M10-L3)

**Recap.** Hooks: top level only. Lift state to the closest common parent. Controlled means state is the truth. A ref changes without drawing again. Never store what you can calculate. Context draws every reader again. A reducer gives every change a name.

## Theme 3 · Keys and lists (questions 15 to 20)

15. **Why does React need keys, and why is the index a bad key?** Keys let React match items between renders so each keeps its identity and state. An index changes when items are inserted, removed or moved, so typed text and state stick to the wrong item. Use a stable id from the data. (M5-L2)
16. **What happens when a component's key changes?** React throws the old component away and builds a new one, so all its state starts fresh. That is how you reset state on purpose. (M14-L2)
17. **How does React decide whether to keep a component's state?** It compares old and new trees by position: the same type, at the same place, with the same key, keeps its state; a different type or key unmounts the old one and mounts a new one. (M14-L2)
18. **Why does `{count && <Badge />}` sometimes show a `0`?** `&&` returns the left side when it is falsy, and `0` is falsy; React does draw the number `0`. Compare first (`count > 0 && ...`) or use a ternary. (M5-L1)
19. **How do you handle loading, error and empty states?** Keep one status (loading, error, success), draw each case on its own, and do not forget the empty list. In TypeScript a discriminated union makes each state carry only its own data. (M9-L3)
20. **How do you sort a list in state without changing the original?** `sort` changes the array in place. Use `toSorted`, or copy first with spread. `map` and `filter` always return a new array. (M2-L3)

**Demo D3, a draft that sticks** (`?d=d3a`). Asha types "the notes are ready" for Lukas, then clicks Priya. Guess: is the message still in the box? Yes:
```text
d3a -> To Priya | input value: "the notes are ready"
```
Priya would get a message written for Lukas. The fix is one prop, `<Draft key={who} />` (`?d=d3b`):
```text
d3b -> To Priya | input value: ""
```
**Demo D6, the zero** (`?d=d6a` and `d6b`). The count is 0, so nothing should show. `{count && <b>on sale</b>}` draws a `0`; `{count > 0 && ...}` draws nothing. Without a browser:
```bash
node zero.mjs
```
```text
<div>0</div>
<div></div>
```
**Sorting** (Node 24):
```bash
node -e "const a=[3,1,2]; const b=a.sort(); console.log(a===b, a)"
node -e "const a=[3,1,2]; const b=a.toSorted(); console.log(a, b)"
node -e "const a=[3,1,2]; console.log(a.map(n=>n*2), a.filter(n=>n>1)); console.log(a)"
```
```text
true [ 1, 2, 3 ]
[ 3, 1, 2 ] [ 1, 2, 3 ]
[ 6, 2, 4 ] [ 3, 2 ]
[ 3, 1, 2 ]
```
`sort` changed `a` and returned the same array; `toSorted`, `map` and `filter` left `a` alone.

**Recap.** A key is a stable id, never the index. A new key means a fresh component. Same type, place and key keeps the state. `0 &&` shows a zero: compare first. Loading, error, empty: separate cases. `sort` changes in place: copy first.

## Theme 4 · Effects (questions 21 to 27)

21. **What is a side effect, and where do you put it?** Anything a component does besides working out what to show: the page title, a timer, a server call. Render must stay pure. If a user action causes it, use an event handler; if it must stay in sync with props or state, use an effect. (M7-L1)
22. **What does the dependency array do?** Empty list: run once after the first render. A list: run again whenever one of the values changes. No list: run after every render. It must hold everything the effect reads. (M7-L2)
23. **What is the cleanup function?** The function you return from the effect. It runs before the effect runs again and when the component leaves the screen. Use it to stop what you started: timers, listeners, connections. (M7-L2)
24. **Why does my effect run twice in development?** Strict Mode mounts, cleans up and mounts again on purpose, to check that your cleanup works. Production does not do it. Write the cleanup; do not remove Strict Mode. (M7-L2)
25. **What is a stale closure?** A function that remembers old values from the render where it was made. An effect with a missing dependency keeps using the first snapshot. Put the value in the list; the linter finds it. (M7-L2)
26. **When should you not use `useEffect`?** Not for values you can calculate while rendering, not for answering a user event (use the handler), and not for resetting state when a prop changes (a key does that). (M7-L3)
27. **How do you avoid a race condition when fetching in an effect?** Return a cleanup: set an ignore flag so a stale answer never updates state, or abort the request with an `AbortController`. The dependency list reruns the effect and the cleanup handles the old request. (M7-L5)

**Demo D4, cleanup first** (`?d=d4`). The effect prints `connect`, the cleanup prints `disconnect`. Click "go to music":
```text
load:         connect general
go to music:  disconnect general / connect music        (the old run's cleanup comes first)
```
With Strict Mode on (`?d=d4&strict=1`) the same load prints three lines from one load:
```text
load:         connect general / disconnect general / connect general
go to music:  disconnect general / connect music
```
**Demo D2, the stale closure** (`?d=d2`). A counter and an effect with an interval that prints the count every second, with an empty dependency list. Click "add one" three times. Guess what the console prints. The page says "Clicked 3 times", but:
```text
count is 0        (again, and again)
```
The effect ran once, so the timer still holds the first snapshot. With `[count]` in the list (`?d=d2b`) the effect reruns after each click with a new timer, and the old one is cleaned up:
```text
count is 3
```
**Recap.** Handlers first, effects to stay in sync. The list holds everything the effect reads. Cleanup stops what the effect started. Twice in development: Strict Mode checks the cleanup. A stale closure is a missing dependency. You might not need an effect at all. Fetching needs an ignore flag or an abort.

## Theme 5 · Performance (questions 28 to 33)

28. **A page feels slow. What do you do first?** Do not guess. Reproduce the slowness in a production build, measure with the profiler and the web vitals, change one thing, and measure again. (M15-L1)
29. **How can you reduce re-renders without `memo`?** Move the state down into the small component that uses it. Pass the slow part as `children` so it comes from a parent that does not render again. Measure before reaching for tools. (M14-L3)
30. **What do `memo`, `useMemo` and `useCallback` do, and when do they help?** `memo` skips a component whose props did not change; `useMemo` keeps an expensive result; `useCallback` keeps a function the same. Use them only after measuring a real slowdown. (M15-L2)
31. **What is the React Compiler?** A build step that adds memoization (remembering results) for you automatically. In a new project: turn it on, write plain code, and still measure. (M15-L2)
32. **How do you reduce the size of the bundle?** Measure first with a bundle analyser. Split by route with `lazy` and `Suspense`, load heavy parts on demand, prefetch what the visitor will open next, and use an error boundary for chunks that fail to load. (M15-L3)
33. **How do you keep a list of ten thousand items fast?** Make the list virtual, so only the visible rows are in the page. If a state change is slow to draw, use a transition or a deferred value so the input stays responsive. Then measure again. (M15-L4)

**Demo D5, the `memo` trap** (`?d=d5a`). `Row` is wrapped in `memo`, but the parent passes `tags={['a', 'b']}`, written inline. Click "add one" three times. Guess how many times `Row` renders:
```text
d5a: Row render x3
```
Every draw of the parent makes a new list, so the prop is never the same and `memo` can never skip. Move the list outside the component (`const TAGS = ['a', 'b']`, `?d=d5b`) and the same three clicks print nothing:
```text
d5b: Row render x0
```
**Recap.** Measure first. Change one thing. Move state down and pass children. `memo` breaks when a prop is a new object every time. The compiler adds memoization for you. Split code by route. Virtualise long lists.

## Theme 6 · Next.js and server components (questions 34 to 40)

34. **Why Next.js instead of plain React?** Not for less JavaScript. For the first picture and for search engines, because the HTML arrives with the content, and for routing, rendering and data in one structure. (M19-L1)
35. **How is routing in the App Router different from React Router?** The routes are the folders, not a list in code. Special files in each folder (`layout`, `loading`, `error`, `not-found`) give every part of the address its own frame. (M19-L2)
36. **Server component or client component?** Server components run on the server, their code is never sent to the browser, and they cannot use state, effects or browser APIs. Client components can, so they are the interactive parts. (M19-L3)
37. **Does `"use client"` mean the component runs only in the browser?** No. A client component is also rendered once on the server, as HTML, then hydrated in the browser, which means its handlers are attached. (M19-L3)
38. **Static or dynamic rendering?** Static pages are made once at build time and shared; dynamic pages are made at every visit. The middle way: a static shell with the dynamic parts streamed in. (M19-L4)
39. **Are server actions safe?** They run on the server and you call them from a form or button, but they are public POST endpoints. Every action must check who is calling, whether they may, and the input, like an API route. (M19-L5)
40. **Which environment variables reach the browser?** Only names starting with `NEXT_PUBLIC_`, pasted in at build time, so changing the file later changes nothing. Everything else stays on the server. Never put a secret in a public name. (M21-L1)

**Demo D7, what ships to the browser** (`nx/`). `Counter.tsx` is a client component (`"use client"` and some state); `page.tsx` is a server component with its own label, `SERVER-LABEL`. Guess: build for production and search the files that go to the browser for each label.
```bash
cd ../nx
npm install
npm run build
grep -rl "CLIENT-LABEL" .next/static
grep -rl "SERVER-LABEL" .next/static
echo "(rc=$?)"
```
```text
.next/static/chunks/0jv8_aliqlhb8.js
(rc=1)
```
(The chunk name is different for you.) The client label is in one file; the server label is in none (`grep` found nothing, exit code 1). The code of the server component never left the server. And a client component is also rendered on the server (question 37):
```bash
npm run start -- -p 8231 &
curl -s localhost:8231 | grep -o "<h1>[^<]*</h1>\|<button>[^/]*</button>"
```
```text
<h1>SERVER-LABEL</h1>
<button>CLIENT-LABEL <!-- -->0</button>
```
The HTML already has the server label, and the button text with its zero. (Stop the server with `kill %1`.)

**Recap.** Next gives HTML, not less JavaScript. Folders are routes. Server code never ships. `use client` still renders on the server. Static, dynamic, or a streamed shell. Server actions are public endpoints. Only public names reach the browser.

## Theme 7 · Forms, data and security (questions 41 to 46)

41. **Why not keep API data in `useState` or context?** It is not your data; it is a cached copy of someone else's. You would have to build keys, freshness, refreshing, shared requests and cancelling yourself. A server-state library such as TanStack Query does it for you. (M11-L1)
42. **What is an optimistic update, and when would you not use it?** Update the screen before the server answers, and roll back if it fails. Avoid it when failure is costly (a payment), and always fetch again at the end so the server has the last word. (M11-L3)
43. **Why is React Hook Form faster than a controlled form?** It uses uncontrolled inputs and refs, so typing does not change React state and the form is not drawn again on every key press. (M12-L1)
44. **TypeScript already checks types, so why zod?** TypeScript types exist only while compiling; they are erased. Data from a network can be anything. Zod checks the real data while the app runs, and gives the type too. (M9-L4)
45. **Where would you store a JWT in a single-page app?** Not in `localStorage`, because any script on the page can read it. The short access token lives in memory; the refresh token goes in an HttpOnly, SameSite cookie with a CSRF defence. (M13-L1)
46. **What does an error boundary not catch?** Errors in event handlers, errors in asynchronous code (timers, fetch callbacks) and errors in the boundary itself. It catches only errors thrown while drawing the tree below it. (M14-L5)

**Recap.** Server data is a cached copy. Optimistic updates roll back and fetch again. Hook Form does not draw on every key. Zod checks the real data at run time. Token in memory, refresh in a cookie. Error boundaries do not see handlers or async code.

## Theme 8 · Testing and tooling (questions 47 to 50)

47. **How do you decide what to query in a React test?** The way a user finds it: by role and name. Then the test also protects accessibility and does not break when the markup changes. A test id is the last resort. (M17-L2)
48. **Why mock the network with MSW instead of mocking `fetch`?** The component still calls `fetch` exactly as in production, so the test checks the real code path, and the same rules work for every component. (M17-L3)
49. **What do you test at which level?** Logic and components at the cheap levels; end-to-end only for the few journeys that must never break, because those tests are slow and the first to turn flaky. (M17-L4)
50. **Linter or formatter?** A linter finds mistakes and risky patterns (a missing dependency in an effect). A formatter only changes layout, never meaning. Teams use both and run both on every commit. (M18-L1)

**Recap.** Query by role, as a user would. Mock the network, not `fetch`. Few end-to-end journeys. The linter finds mistakes; the formatter fixes layout.

## Try it yourself

1. Cover the answers, read all fifty questions out loud, and answer each in thirty seconds. Mark the ones you missed and go back to the lesson on their line.
2. In `web/src/d1b.tsx`, change the plain button to call `setPlain(c => c + 1)` three times. Predict what the heading shows after one click on it, then check.
3. In `web/src/d5a.tsx`, keep `tags={['a', 'b']}` inline but wrap `Row` in nothing (remove `memo`). How many `Row render` lines after three clicks? Check in the console.
4. In `web/src/d3b.tsx`, replace `key={who}` with `key="x"`. Does the draft reset when you click Priya?

**Answers.** (2) `plain 3 · updater 0`: the updater form adds three. (3) 3 (a render for every parent render; memo does not change that here). (4) No: the key stays the same, so the state stays, like `d3a`.

## Clean up

```bash
# stop any server (Ctrl+C)
find nx/.next -delete
```
Delete `web/node_modules` and `nx/node_modules` when you are finished.

## Next

[M23-L02 · The Machine-Coding Round](../m23-l02-the-machine-coding-round/)
