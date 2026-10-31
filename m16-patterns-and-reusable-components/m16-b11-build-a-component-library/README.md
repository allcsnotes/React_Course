# M16-B11 · Build a Component Library

> Video: Module 16, Build 11. Watch it first, then follow along here.

Asha builds a small component library: a Modal, Tabs, a Dropdown and a Toast. Each one works with the keyboard alone, is typed, and is tested with real key presses in a real browser.

## What you'll learn

- A contract of keys for each component, written before the code
- How to test a component with real key presses (Playwright) and read the accessibility tree
- Roving focus (Tabs, Dropdown), a focus-keeping Modal that gives focus back, and a live region for the Toast
- How to ship a library: one `index.ts` door, typed props (so wrong use fails early), doc comments that become hover docs, an axe-core check, and a build

## Before you start

- Node 24 (`node --version`) and Google Chrome installed (the key tests use `channel: 'chrome'`). No earlier folder and no Docker needed.
- You should have done Lessons 1 to 4 of this module (compound components, portals, accessibility, component APIs).
- This folder is the finished project: Vite 8.3.5, React 19.3.1, TypeScript 7.0.2, axe-core 4.14.0.

## Files in this folder

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | Pinned project |
| `index.html`, `vite.config.ts`, `tsconfig*.json`, `.oxlintrc.json` | Setup (dev server on port 5771). In `.oxlintrc.json` I added an ignore list so `npm run lint` skips `versions/` |
| `src/ui/` | The library: `Tabs.tsx`, `Modal.tsx`, `Dropdown.tsx`, `Toast.tsx`, `useControllable.ts` and the single door `index.ts` |
| `src/App.tsx`, `src/main.tsx`, `src/index.css` | The gallery page that shows each component (outside the library, which must never depend on its own demo) |
| `versions/` | The stages: `s2a` (Tabs, no keys), `s2` (Tabs with keys), `s3a`, `s3` (Modal), `s4` (Dropdown), `s5a`, `s5` (Toast), `s6a`, `s6` (shipped) |
| `use-version.sh` | Puts one version into `src/` |
| `tests/` | The real keyboard tests: `kb-tabs.mjs`, `kb-modal.mjs`, `kb-dropdown.mjs`, `kb-toast.mjs`, plus `keys.mjs` (runs all four), `axe.mjs` and `aria.mjs` |
| `misuse-example.tsx.txt` | Three wrong calls, used in step 6 |

In the version names, "a" is the first draft that the test shows is not good enough, and the version without "a" is the fix.

## Follow along

### 1. Install, and the rules we hold ourselves to

```bash
npm install
```

```text
added 30 packages, and audited 31 packages
found 0 vulnerabilities
```

(The video's install printed 28 packages for the Vite template, then added axe-core, which is already in this `package.json`. Yours may differ by a package.) The key tests need Playwright's core library once:

```bash
npm install --no-save playwright-core@1.63.0
npm run dev
```

The rules: every action has a key; the browser can describe every part with a role, a name and a state; focus is never lost; wrong use fails early.

The contract, written before any code:

- Tabs: arrow keys, Home and End, and one single stop for the Tab key.
- Modal: Escape closes, Tab stays inside, focus comes back.
- Dropdown: arrows to move, Enter to pick, Escape to leave.
- Toast: announced, without taking the focus.

The method for each part: write the component, run a real keyboard test, read what fails, fix it, run again. Open http://localhost:5771 and use the links (`#tabs`, `#modal`, `#dropdown`, `#toast`). Run the tests in a second terminal; to point them at another port set `BASE_URL=http://localhost:PORT/`.

Two small pieces of setup. `src/ui/useControllable.ts` lets a component keep its own value or let the parent own it:

```ts
import { useState } from 'react'

export function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
) {
  const [inner, setInner] = useState(defaultValue)
  const controlled = value !== undefined
  const current = controlled ? value : inner
  function set(next: T) {
    if (!controlled) setInner(next)
    onChange?.(next)
  }
  return [current, set] as const
}
```

And one line of CSS matters more than any other, in `src/index.css`: `:focus-visible { outline: 3px solid var(--blue); outline-offset: 2px; }`. Without a ring a keyboard user cannot see where they are.

### 2. Tabs

```bash
./use-version.sh s2a
```

`Tabs` is the compound component from Lesson 1: `Tabs`, `Tabs.List`, `Tabs.Tab`, `Tabs.Panel`, sharing the open tab through context. The root gets its value from `useControllable` and a base name from `useId`, so two Tabs on one page never mix up their ids. Each Tab is a `button` with `role="tab"`, `aria-selected` and `aria-controls`; the Panel has `role="tabpanel"` and `aria-labelledby`. This version has no keys at all.

Test it before writing any key code:

```bash
node tests/kb-tabs.mjs
```

```text
PASS A click opens a tab: "97 lessons and 17 builds."
FAIL ArrowRight moves to the next tab: tab "Lessons"
FAIL ...and opens its panel: "97 lessons and 17 builds."
FAIL ArrowRight on the last tab wraps to the first: tab "Reviews"
FAIL ArrowLeft on the first tab wraps to the last: tab "Overview"
FAIL Home jumps to the first tab: tab "Lessons"
FAIL End jumps to the last tab: tab "Lessons"
FAIL Tab from outside lands on the open tab: tab "Overview"
FAIL Tab again leaves the list, into the panel: tab "Lessons"
1 passed, 8 failed
```

Only the click works. The arrows do nothing because nothing listens for them, and Tab from outside lands on Overview, not on the open tab (every tab is a stop). The fix is the roving tabIndex from Lesson 3: only the open tab has `tabIndex={0}`, the others `-1`. The arrows live on the list:

```bash
./use-version.sh s2
```

```tsx
function List({ label, children }: ListProps) {
  const { select } = useTabs()
  const ref = useRef<HTMLDivElement>(null)

  function onKeyDown(e: KeyboardEvent) {
    const list = ref.current!
    const tabs = [...list.querySelectorAll<HTMLElement>('[role=tab]')]
    const at = tabs.indexOf(e.target as HTMLElement)
    const go: Record<string, number> = {
      ArrowRight: at + 1,
      ArrowLeft: at - 1,
      Home: 0,
      End: tabs.length - 1,
    }
    if (!(e.key in go)) return
    e.preventDefault()
    const tab = tabs[(go[e.key] + tabs.length) % tabs.length]
    tab.focus()
    select(tab.dataset.value!)
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      ref={ref}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  )
}
```

Run the test again:

```bash
node tests/kb-tabs.mjs
```

```text
PASS A click opens a tab: "97 lessons and 17 builds."
PASS ArrowRight moves to the next tab: tab "Reviews"
PASS ...and opens its panel: "Rated 4.9 by students."
PASS ArrowRight on the last tab wraps to the first: tab "Overview"
PASS ArrowLeft on the first tab wraps to the last: tab "Reviews"
PASS Home jumps to the first tab: tab "Overview"
PASS End jumps to the last tab: tab "Reviews"
PASS Tab from outside lands on the open tab: tab "Lessons"
PASS Tab again leaves the list, into the panel: tabpanel "Lessons"
9 passed, 0 failed
```

Tab lands on the open tab, the arrows wrap, Home and End jump, and the panel can take focus too (so a keyboard user can reach its text). The real accessibility tree (`node tests/aria.mjs '#tabs' '.tabs'`):

```text
- tablist "Course sections":
  - tab "Overview" [selected]
  - tab "Lessons"
  - tab "Reviews"
- tabpanel "Overview": Learn React from zero.
```

This is exactly what a screen reader is given.

### 3. Modal

`Modal` only decides: if `open`, it draws a `Dialog` through a portal into `document.body`; if not, nothing. `title` is required because every dialog needs a name. Inside `Dialog`, an effect moves focus to the first thing that can be pressed, Escape asks to close, and Tab on the last button jumps to the first (Shift+Tab the reverse). The box has `role="dialog"`, `aria-modal="true"` and `aria-labelledby` pointing at the heading; the Close button has an `aria-label` because a cross is not a name.

```bash
./use-version.sh s3a
node tests/kb-modal.mjs
```

```text
PASS Tab reaches the opener: button "Delete course"
PASS Enter opens a dialog: dialog "Delete this course?"
PASS focus moves into the dialog: button "Close"
PASS 7 Tab presses never leave the dialog: last focus: button "Cancel"
PASS Shift+Tab goes backwards: button "Close"
PASS Escape closes it: no dialog left
FAIL focus returns to the opener: body
6 passed, 1 failed
```

Guess first: after Escape, where is the focus? On the body, not on Delete course. The dialog is gone, the element that had the focus is gone with it, and the browser has nowhere to put it. The fix is to remember the opener while drawing (state), and give focus back in the effect's cleanup:

```bash
./use-version.sh s3
```

```tsx
function Dialog({ onClose, title, children }: DialogProps) {
  const titleId = useId()
  const box = useRef<HTMLDivElement>(null)
  const [opener] = useState(() => document.activeElement)

  useEffect(() => {
    box.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
    return () => (opener as HTMLElement | null)?.focus()
  }, [opener])
```

```bash
node tests/kb-modal.mjs
```

```text
PASS Tab reaches the opener: button "Delete course"
PASS Enter opens a dialog: dialog "Delete this course?"
PASS focus moves into the dialog: button "Close"
PASS 7 Tab presses never leave the dialog: last focus: button "Cancel"
PASS Shift+Tab goes backwards: button "Close"
PASS Escape closes it: no dialog left
PASS focus returns to the opener: button "Delete course"
7 passed, 0 failed
```

The tree of the open dialog (`node tests/aria.mjs '#modal' '[role=dialog]' 'click:button|Delete course'`). The name comes from the heading, so a screen reader says "dialog, Delete this course?":

```text
- dialog "Delete this course?":
  - button "Close": ×
  - heading "Delete this course?" [level=2]
  - paragraph: Its 97 lessons will be removed. This cannot be undone.
  - button "Cancel"
  - button "Delete"
```

### 4. Dropdown

A short menu of actions. The button says `aria-haspopup="menu"` and `aria-expanded`. The list has `role="menu"` and every item `role="menuitem"` with `tabIndex={-1}` (roving focus again). A number `active` says which item holds the focus, and an effect moves the focus there. Arrows wrap, Home and End jump, Escape closes and gives focus back to the button, Tab just closes, and ArrowDown on the closed button opens it. A click outside closes it with a listener that the effect removes again.

```bash
./use-version.sh s4
node tests/kb-dropdown.mjs
```

```text
PASS Tab reaches the button: button "Actions ▾"
PASS Enter opens the menu, focus on item 1: expanded=true · menuitem "Rename"
PASS ArrowDown moves down: menuitem "Duplicate"
PASS End jumps to the last item: menuitem "Archive"
PASS ArrowDown at the end wraps to the top: menuitem "Rename"
PASS ArrowUp at the top wraps to the bottom: menuitem "Archive"
PASS Enter picks the item: "Picked: duplicate"
PASS ...closes the menu, returns focus: expanded=false · button "Actions ▾"
PASS ArrowUp on the button opens at the end: menuitem "Archive"
PASS Escape closes, focus back: expanded=false · button "Actions ▾"
PASS Tab closes an open menu: expanded=false
11 passed, 0 failed
```

Eleven claims, all passing at the first try, because the lessons from Tabs and the Modal were already in the code. The tree (`node tests/aria.mjs '#dropdown' '.dd' 'click:button|Actions'`):

```text
- button "Actions" [expanded]
- menu "Actions":
  - menuitem "Rename"
  - menuitem "Duplicate"
  - menuitem "Archive"
```

### 5. Toast

A toast is a small message that pops up, says one thing, and leaves. `ToastProvider` keeps the list. A hook `useToast()` gives any component a `show` function through context. `show` adds a message with a new number and starts a timer that removes it after four seconds (`seconds` prop). `dismiss` removes one by its number. Each toast has a Dismiss button so the keyboard works.

```bash
./use-version.sh s5a
node tests/kb-toast.mjs
```

```text
PASS Tab reaches the Save button: button "Save"
PASS Enter shows a toast: "Saved your changes ×"
PASS focus stays on the button: button "Save"
FAIL the toast sits in a status region: 0 found
PASS a second toast stacks under the first: 2 toasts
PASS Tab reaches a Dismiss button: button "Dismiss"
PASS Enter dismisses that toast: 1 toast left
PASS the rest leave by themselves after 4 s: 0 toasts left
7 passed, 1 failed
```

The toast does not sit in a status region. The tree shows why: just text, with nothing to tell a screen reader that something new appeared.

```text
- text: Saved your changes
- button "Dismiss": ×
```

The fix is one attribute, `role="status"`, which makes a live region. The region must be on the page before the message arrives, so it is always drawn, empty.

```bash
./use-version.sh s5
node tests/kb-toast.mjs
```

```text
PASS Tab reaches the Save button: button "Save"
PASS Enter shows a toast: "Saved your changes ×"
PASS focus stays on the button: button "Save"
PASS the toast sits in a status region: 1 found
PASS a second toast stacks under the first: 2 toasts
PASS Tab reaches a Dismiss button: button "Dismiss"
PASS Enter dismisses that toast: 1 toast left
PASS the rest leave by themselves after 4 s: 0 toasts left
8 passed, 0 failed
```

And the tree now holds the text inside a `status`:

```text
- status:
  - text: Saved your changes
  - button "Dismiss": ×
```

### 6. Ship it

```bash
./use-version.sh s6a
```

**One door.** All four components leave through `src/ui/index.ts`. Users write one import line and never reach into the files. Anything not listed (like `useControllable`) is private.

```ts
export { Dropdown } from './Dropdown'
export type { DropdownItem, DropdownProps } from './Dropdown'
export { Modal } from './Modal'
export type { ModalProps } from './Modal'
export { Tabs } from './Tabs'
export type { TabsProps } from './Tabs'
export { ToastProvider, useToast } from './Toast'
export type { ToastProviderProps } from './Toast'
```

**Typed, so wrong use fails early.** The Tabs props are a union (Lesson 4): either `value` together with `onValueChange`, or `defaultValue`. Never `value` alone, because then the tab could never change. Copy the three wrong calls into `src` and check:

```bash
cp misuse-example.tsx.txt src/misuse.tsx
npx tsc -b
rm src/misuse.tsx
```

```text
src/misuse.tsx(3,19): error TS2741: Property 'title' is missing in type '{ open: true; onClose: () => void; children: string; }' but required in type 'ModalProps'.
src/misuse.tsx(5,4): error TS2322: Type '{ value: string; children: Element; }' is not assignable to type 'IntrinsicAttributes & TabsProps'.
  Property 'onValueChange' is missing in type '{ value: string; children: Element; }' but required in type '{ value: string; onValueChange: (value: string) => void; defaultValue?: undefined; }'.
src/misuse.tsx(11,15): error TS2322: Type 'number' is not assignable to type 'string'.
```

A Modal without a title, Tabs with a `value` and no `onValueChange`, and a Dropdown item whose `id` is a number: three errors before the page ever runs.

**Documented.** The `/** ... */` comments above each prop are not thrown away. The type checker copies them into the declaration file, and an editor shows them when someone hovers over a prop:

```bash
npm run types
cat dist-types/ui/Modal.d.ts
```

```ts
import type { ReactNode } from 'react';
export type ModalProps = {
    open: boolean;
    onClose: () => void;
    /** The heading, and the dialog's name. */
    title: string;
    children: ReactNode;
};
export declare function Modal({ open, ...rest }: ModalProps): import("react").ReactPortal | null;
```

The gallery page also shows a table of each component's props in the same words.

**A checker.** `tests/axe.mjs` runs axe-core on each demo in its open state. On the draft, `s6a`, the gallery page has no main area:

```bash
node tests/axe.mjs
```

```text
#tabs      axe 2 violation(s)
  landmark-one-main (moderate): Document should have one main landmark
    <html lang="en">
  region (moderate): All page content should be contained by landmarks
    <h1>Tiny UI</h1>
    <div class="tabs">
#modal     axe 1 violation(s)
  region (moderate): All page content should be contained by landmarks
    <h1>Tiny UI</h1>
    <table>
#dropdown  axe 2 violation(s)
  landmark-one-main (moderate): Document should have one main landmark
    <html lang="en">
  region (moderate): All page content should be contained by landmarks
    <h1>Tiny UI</h1>
    <div class="menu" id="_r_0_" role="menu" aria-label="Actions"><button role="menuitem" tabi
#toast     axe 2 violation(s)
  landmark-one-main (moderate): Document should have one main landmark
    <html lang="en">
  region (moderate): All page content should be contained by landmarks
    <h1>Tiny UI</h1>
    <table><thead><tr><th>Prop</th><th>Type</th><th>What it does</th></tr></thead><tbody><tr><
axe found 7 problem(s)
```

The finding is about the gallery page, not our components. Change one tag in `src/App.tsx`: the outer `<div className="page">` becomes `<main className="page">` (that is `./use-version.sh s6`) and run again:

```bash
./use-version.sh s6
node tests/axe.mjs
```

```text
#tabs      axe 0 violations
#modal     axe 0 violations
#dropdown  axe 0 violations
#toast     axe 0 violations
axe found 0 problems
```

A checker finds only part of the problems, so the key tests, and a real screen reader, still matter (no screen reader was recorded for this video).

**Everything together.** One command runs all four test files:

```bash
node tests/keys.mjs
```

```text
tabs      9 passed, 0 failed
modal     7 passed, 0 failed
dropdown  11 passed, 0 failed
toast     8 passed, 0 failed
total 35 passed, 0 failed
```

And the build:

```bash
npm run build
```

```text
vite v8.3.5 building client environment for production...
✓ 22 modules transformed.
dist/index.html                   0.39 kB │ gzip:  0.26 kB
dist/assets/index-G0S0INoQ.css    2.01 kB │ gzip:  0.80 kB
dist/assets/index-D2bKk-44.js   226.72 kB │ gzip: 70.97 kB
✓ built in 376ms
```

The type checker and the bundler both pass: 22 modules, one JS file of about 227 kB (the file hash and times differ on your machine).

## What breaks in production

1. We tested one browser only. Run the same key tests in more browsers; Playwright can do that.
2. A toast that leaves after four seconds can be missed. Never put the only copy of important news in a toast.
3. We did not lock the page scroll behind the Modal, and we did not test two modals at once.
4. A library like this needs years of testing with real screen readers. For a real product look at a mature one, such as Radix or React Aria. Build your own to learn how they work, or for a small design system of your own.

## Common mistakes

- Writing a role without writing the keys. A role is only a label.
- Forgetting to remember the opener while drawing: Escape then leaves the focus on the body.
- Drawing the live region only when a message arrives: a screen reader needs it on the page first.
- Letting the library import its own demo page.

## Clean up

Stop the dev server (Ctrl+C). `rm -rf dist dist-types` and delete `node_modules/` when you are done. `./use-version.sh s6` restores the finished library.

## Key points

- Every part has a contract of keys and a real test that presses them: write the component, run the test, read the failures, fix.
- Tabs and the Dropdown use roving focus. The Modal moves focus in, keeps it in and gives it back. The Toast uses a live region (`role="status"`) that is always on the page.
- Ship through one door, type the props so wrong use fails early, write the comments that become docs, and run a checker like axe-core.

Interview tip. If Rahul, the interviewer, asks "how would you build an accessible dropdown from scratch?": a button with `aria-haspopup` and `aria-expanded`; a list with `role="menu"` and menu items; focus moves into the list on open, the arrow keys move it, and Escape closes it and returns the focus to the button; test it with real key presses, the accessibility tree and axe-core.

## Try it yourself

1. Type to search in the Dropdown: pressing R jumps to Rename.
2. Pause the Toast timer while the mouse is over it or the focus is inside it.
3. Run the key tests in Firefox and WebKit too.

## Next

[M17-L01 · Your First Test](../../m17-testing/m17-l01-your-first-test/README.md)
