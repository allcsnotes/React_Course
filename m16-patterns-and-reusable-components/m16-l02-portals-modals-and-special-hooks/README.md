# M16-L02 · Portals, Modals and Special Hooks

> Video: Module 16, Lesson 2. Watch it first, then follow along here.

## What you'll learn

- Why a "Are you sure?" box gets clipped inside a card, and how `createPortal` draws it on top of the whole page
- That events still bubble through the React tree after a portal, and how to stop that
- The three habits of a good modal: Escape closes it, a click outside closes it, `role="dialog"` tells a screen reader what it is
- `useId` for ids that are unique in each place (labels and `aria-labelledby`)
- `useLayoutEffect` for measuring before the browser paints, and `useSyncExternalStore` for reading things outside React (online status)
- Three real mistakes: no cleanup, a missing portal target, a snapshot that is a new object every time

## Before you start

- Node 24 (`node --version`). No earlier lesson folder and no Docker are needed: this folder is a complete Vite + React 19.3.1 + TypeScript 7.0.2 project (Vite 8.3.5).
- The project is the My courses page of allcsvideos.com. Everything is local; the emails you type are demo values.

## Files in this folder

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | Pinned project (React 19.3.1, TypeScript 7.0.2, Vite 8.3.5) |
| `index.html`, `vite.config.ts`, `tsconfig*.json` | Setup (dev server on port 5162) |
| `src/` | What the dev server runs. It starts as version `v1-inside` |
| `versions/` | One folder per stage of the video; `versions/common` (Shell and styles) is copied with every version |
| `use-version.sh` | Copies one version into `src/` |
| `flicker-check.mjs` | Optional: the measurement behind the `useLayoutEffect` section |

Versions: `v1-inside`, `v2-portal`, `b3-stop`, `v3-modal`, `v4-useid` (portals and the modal), `d1-hardcoded`, `d2-useid` (`useId`), `e1-effect`, `e2-layout` (`useLayoutEffect`), `f1-online` (`useSyncExternalStore`), and the mistakes `m1-nocleanup`, `m2-nocontainer`, `m3-badsnapshot`.

## Follow along

### 1. Install and start

```bash
npm install
npm run dev
```

Open http://localhost:5162. To change version: stop the server, run `./use-version.sh <name>`, start it again (or just leave Vite running, it reloads).

### 2. The problem: a box stuck inside the card

`versions/v1-inside` (already in `src/`). Each course card has a Cancel enrollment button and a `Modal` placed inside the card:

```tsx
import type { ReactNode } from 'react'

export function Modal({ children }: { children: ReactNode }) {
  return (
    <div className="backdrop">
      <div className="dialog">{children}</div>
    </div>
  )
}
```

The CSS for `.backdrop` is `position: fixed; inset: 0`, which should cover the window. But `.card` has `overflow: hidden` and `backdrop-filter: blur(6px)`. Both are normal for a card, and together they trap the box. Click Cancel enrollment: the box is squeezed inside the card and the page is not dimmed. In the browser you can confirm the box is a child of the card:

```text
backdrop position: fixed, parent element class: card
```

### 3. A portal

`createPortal(what, where)` comes from `react-dom`. `versions/v2-portal/Modal.tsx` wraps the same markup and puts it in `document.body`:

```bash
./use-version.sh v2-portal
```

```tsx
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

export function Modal({ children }: { children: ReactNode }) {
  return createPortal(
    <div className="backdrop">
      <div className="dialog">{children}</div>
    </div>,
    document.body,
  )
}
```

Guess first: where does the box appear, and does the card's click handler still run when you press Keep? Then try it. The box floats over the whole page and the page behind it is dimmed. The card has `onClick={... console.log('card heard:', ...)}`, so the console prints:

```text
card heard: Cancel enrollment
card heard: Keep
```

In the page tree the backdrop is now a child of `body`. In the React tree the box is still a child of the card, and events travel up the React tree. A portal changes only where things are drawn; props, state and context still flow down and events still bubble up.

To stop that, call `e.stopPropagation()` on the backdrop. `versions/b3-stop`:

```bash
./use-version.sh b3-stop
```

```tsx
<div className="backdrop" onClick={(e) => e.stopPropagation()}>
```

Now pressing Keep prints only `card heard: Cancel enrollment` (the click that opened the box). Nothing is heard for Keep.

### 4. A real modal: Escape, outside click, a role

```bash
./use-version.sh v3-modal
```

```tsx
import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type Props = { onClose: () => void; children: ReactNode }

export function Modal({ onClose, children }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div
      className="backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="dialog" role="dialog" aria-modal="true">
        {children}
      </div>
    </div>,
    document.body,
  )
}
```

- `useEffect` adds a keydown listener to the document. The cleanup function removes it again (Module 7, Lesson 2).
- A click on the backdrop closes the box only when `e.target === e.currentTarget`, so a click inside the box does not close it.
- `role="dialog"` and `aria-modal="true"` tell a screen reader this is a dialog.

Guess: which of Escape, a click on the dim area and a click on the question inside the box close it? Real result: Escape closes it, the dim area closes it, the question inside keeps it open.

One habit is missing: moving keyboard focus into the box and keeping it there (a focus trap). That comes in the next lesson and in the component library at the end of this module.

### 5. `useId`: the same id twice

`versions/d1-hardcoded`: an `EmailField` writes `id="email"` and the page uses it twice (Join the waitlist, Gift a course).

```bash
./use-version.sh d1-hardcoded
```

Click the words "Friend's email" and type `hello@demo.test`. The letters land in the first box, the wrong one. Both inputs have the id `email`:

```text
email=hello@demo.test
email=
```

Nothing warned us. `versions/d2-useid` fixes it:

```bash
./use-version.sh d2-useid
```

```tsx
import { useId } from 'react'

type Props = { label: string }

export function EmailField({ label }: Props) {
  const id = useId()
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="email" />
    </>
  )
}
```

Now the ids are unique and the letters go to the second box (yours are shown in the same shape):

```text
_r_0_=
_r_1_=hello@demo.test
```

You never type these ids. `versions/v4-useid` uses the same hook in the modal: the heading gets `id={titleId}` and the dialog has `aria-labelledby={titleId}`, so a screen reader can say "dialog, Cancel enrollment". In the browser: `dialog true _r_0_` and the heading's id is `_r_0_`.

Two rules: use `useId` to connect things on the page (label and input, box and title), and never use it as a list key. Keys come from your data (Module 5, Lesson 2).

### 6. `useLayoutEffect`: measure before the paint

The tooltip needs its own height to sit above its button, which is known only after it is drawn. `versions/e1-effect/Tip.tsx` measures with a ref in `useEffect`; `slowDown(30)` pretends the component is heavy (30 ms of work).

```bash
./use-version.sh e1-effect
```

```tsx
  useEffect(() => {
    if (shown && tipRef.current) {
      setTop(-tipRef.current.offsetHeight - 8)
    }
  }, [shown])
```

`useEffect` runs after React changes the page, and the browser may already have painted. The change in `versions/e2-layout` is one word: `useLayoutEffect`.

```bash
./use-version.sh e2-layout
```

To measure it, hover the button 40 times and record the tooltip's top before each paint. This uses Playwright (Module 17 teaches it), so install it first, with the dev server running in another terminal:

```bash
npm install --no-save playwright
npx playwright install chromium
node flicker-check.mjs 40
```

Run it once with `e1-effect` in `src/` and once with `e2-layout`. Real output from my runs (exact numbers depend on your screen; the pattern holds):

```text
first frame wrong: 40 out of 40  (first-frame tops seen: 276.4)   <- e1-effect
first frame wrong: 0 out of 40  (first-frame tops seen: 172.7)    <- e2-layout
```

With `useEffect` the first frames show the tooltip sitting on the button (276), and a later frame moves it to 173. With `useLayoutEffect` the first frame is already right. Use it only to measure something and fix the page before anyone sees it; the browser waits while it runs. For everything else, `useEffect` is right.

### 7. `useSyncExternalStore`: is the computer online?

```bash
./use-version.sh f1-online
```

```ts
import { useSyncExternalStore } from 'react'

function subscribe(callback: () => void) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  )
}
```

The hook takes subscribe (add listeners, return the function that removes them), get snapshot (`navigator.onLine`), and a value for server rendering (`true`, you meet it later). Now `const online = useOnlineStatus()` is one line, with no `useState`, no `useEffect` and no listener to forget. Zustand's own hook calls `useSyncExternalStore` inside.

Guess what the banner says when the internet drops, and when it comes back. In Chrome DevTools, Network tab, choose Offline, then No throttling. The banner reads `You are online`, then turns red with `You are offline: check your connection`, then goes green again with no reload.

## Common mistakes

### 1. No cleanup

```bash
./use-version.sh m1-nocleanup
```

This `Modal` adds `document.addEventListener('keydown', ...)` and never removes it. Open and close the box three times, open it a fourth time and press Escape. The console prints `Escape heard` eight times, and eight more with no box on screen. Strict Mode runs every effect twice in development, so every opening left two listeners behind. The fix is the cleanup function from step 4.

### 2. A portal target that does not exist

```bash
./use-version.sh m2-nocontainer
```

`document.getElementById('modal-root')!` returns `null`, because the page has no such element. Click Cancel enrollment and the page goes blank. Console:

```text
Target container is not a DOM element.
```

Use `document.body`, or add the element to `index.html` first.

### 3. A snapshot that is a new object every time

```bash
./use-version.sh m3-badsnapshot
```

`getSnapshot` returns `({ online: navigator.onLine })`, a new object on every call. React compares two answers and two new objects are never equal. The page is blank and the console shows:

```text
The result of getSnapshot should be cached to avoid an infinite loop
Maximum update depth exceeded.
```

Return a plain value like `true` or `false`, or the same object each time.

## Clean up

Stop the dev server (Ctrl+C). Run `./use-version.sh v1-inside` to go back to the start. `node_modules/` can be deleted any time.

## Key points

- A portal draws a piece of the screen elsewhere in the page (usually `document.body`) so a modal escapes clipping; events still bubble through the React tree.
- A good modal closes on Escape and on a click outside, and cleans up its listener.
- `useId` makes ids that are unique in each place. `useLayoutEffect` measures and fixes the page before the paint. `useSyncExternalStore` reads something outside React; its snapshot must not be a new object every time.

Interview tip. If Rahul, the interviewer, asks "what is a portal, and why does a modal need one?": a portal renders children into a different DOM node, usually body, so the modal is not clipped by overflow, transform or stacking rules of its parents. It still behaves as a child in the React tree, so context and events work as before.

## Try it yourself

1. Make the tooltip text in `versions/e2-layout/App.tsx` longer and check that it still sits above the button.
2. Add a "Delete account" modal to the page that also closes with Escape.

## Next

[M16-L03 · Accessibility in Depth](../m16-l03-accessibility-in-depth/README.md)
