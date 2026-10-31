# M16-L03 · Accessibility in Depth

> Video: Module 16, Lesson 3. Watch it first, then follow along here.

## What you'll learn

- Why a page that looks finished can still be wrong in the accessibility tree
- Keyboard use: real buttons, one tab stop per group (roving `tabIndex`) and arrow keys inside it
- A dialog's three keyboard jobs: move focus in, keep Tab inside (a focus trap), Escape closes and focus goes back
- ARIA for the four gaps: a name, a state, a role and a live message (`role="status"`)
- Three ways to test: by hand, with axe-core, and with a real screen reader
- Four real mistakes (a role without keys, `aria-hidden` on a focusable thing, positive `tabIndex`, remembering the opener too late)

## Before you start

- Node 24 (`node --version`) and Google Chrome installed (the checks use `channel: 'chrome'`). No earlier lesson folder and no Docker needed.
- This is a complete Vite + React 19.3.1 + TypeScript 7.0.2 project (Vite 8.3.5, axe-core 4.x, playwright-core 1.63). One app, several pages chosen by the address.
- Honest note from the video: no real screen reader was recorded. The accessibility tree and axe-core give the same facts.

## Files in this folder

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | Pinned project |
| `src/App.tsx` | Chooses the page from the address: `?v=bad`, `?v=good`, `?v=late`, `?d=m1`, `?d=m2`, `?d=m3` |
| `src/bad/` | Asha's first page: div tabs, a heart with no name, a dialog with no trap |
| `src/good/` | The fixed page: `Tabs.tsx`, `Dialog.tsx`, `Wish.tsx`, `CoursePage.tsx` |
| `src/late/` | Mistake four: a dialog that remembers its opener inside the effect |
| `src/mistakes/Mistakes.tsx` | Mistakes one, two and three (`?d=m1`, `?d=m2`, `?d=m3`) |
| `keytest.mjs` | The Playwright keyboard test from the video |
| `a11y-check.mjs` | Prints the accessibility tree and the axe-core result of one page |

## Follow along

### 1. Install and start

```bash
npm install
npm run dev
```

Open http://localhost:5163/?v=bad. Python from Zero has a title, an Enroll button, a heart, three tabs and a line of text. To the eye it is finished.

### 2. Read the tree of the bad page

A screen reader reads the accessibility tree, not the screen. In a second terminal:

```bash
node a11y-check.mjs "?v=bad"
```

```text
--- accessibility tree ---
- heading "Python from Zero" [level=1]
- paragraph: by Meera · 40 lessons
- button "Enroll"
- button:
  - img
- text: Overview Lessons Reviews
- paragraph: 40 lessons, one project.
--- axe-core ---
violations: 3  checks passed: 13
  button-name (critical): Buttons must have discernible text
  landmark-one-main (moderate): Document should have one main landmark
  region (moderate): All page content should be contained by landmarks
```

The heart is a button with only a picture. The tabs are plain text. Your eyes know the heart is a heart and the words are tabs; the list says neither.

### 3. The keyboard

On `?v=bad` press Tab three times and the right arrow twice. Tab one: Enroll. Tab two: the heart. Tab three: the focus has left the page. The tabs are plain `div` tags and a `div` cannot take focus. The arrow keys do nothing.

The fix is a roving tabIndex: `tabIndex={0}` means "in the Tab order", `-1` means "skipped by Tab, but code can focus it". Only the selected tab has 0, so the whole group is one tab stop. Open `?v=good`. `src/good/Tabs.tsx`:

```tsx
import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

const names = ['Overview', 'Lessons', 'Reviews']
const text = [
  '40 lessons, one project.',
  'Variables, loops, functions, files.',
  '4.8 stars from 312 students.',
]

export function Tabs() {
  const [on, setOn] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  function onKey(e: KeyboardEvent) {
    const last = names.length - 1
    let to = -1
    if (e.key === 'ArrowRight') to = on === last ? 0 : on + 1
    if (e.key === 'ArrowLeft') to = on === 0 ? last : on - 1
    if (e.key === 'Home') to = 0
    if (e.key === 'End') to = last
    if (to < 0) return
    e.preventDefault()
    setOn(to)
    refs.current[to]?.focus()
  }

  return (
    <div>
      <div role="tablist" aria-label="Course" onKeyDown={onKey}>
        {names.map((n, i) => (
          <button
            key={n}
            id={`tab-${i}`}
            role="tab"
            aria-selected={i === on}
            tabIndex={i === on ? 0 : -1}
            ref={el => { refs.current[i] = el }}
            onClick={() => setOn(i)}
          >
            {n}
          </button>
        ))}
      </div>
      <p role="tabpanel" aria-labelledby={`tab-${on}`} className="panel">
        {text[on]}
      </p>
    </div>
  )
}
```

Key points: real `button` tags with `role="tab"`, one `ref` each so code can call `focus()`, and one key handler on the group (arrows wrap around, Home and End jump, `preventDefault()` stops page scrolling).

Real keys on `?v=good`: Tab, Tab, Tab lands on Overview. Arrow right gives Lessons (the text changes), arrow right gives Reviews, Home gives Overview, End gives Reviews, and one more Tab leaves the whole group. The focus after each key (from my run): `Overview`, `Lessons`, `Reviews`, `Overview`, `Reviews`, then `BODY`.

This is the pattern for every group of related controls: tabs, menus, radio buttons.

### 4. Focus traps

Open `?v=bad`, press Tab to reach Enroll and Enter to open the dialog (`src/bad/Dialog.tsx`, no trap). The focus is still on Enroll, behind the dark layer. Tab goes to the heart, Yes, enroll, Cancel, and then out of the page. Escape does nothing.

A dialog has three keyboard jobs: when it opens, move the focus inside; keep Tab inside (last button round to first); Escape closes it and the focus goes back to the button that opened it. `src/good/Dialog.tsx`:

```tsx
import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

export function Dialog({ onClose }: { onClose: (yes: boolean) => void }) {
  const box = useRef<HTMLDivElement>(null)
  const [opener] = useState(() => document.activeElement as HTMLElement | null)

  useEffect(() => {
    box.current?.querySelector('button')?.focus()
    return () => opener?.focus()
  }, [opener])

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose(false)
    if (e.key !== 'Tab') return
    const items = box.current!.querySelectorAll('button')
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <div className="overlay">
      <div
        ref={box}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dlg-title"
        className="box"
        onKeyDown={onKey}
      >
        <h2 id="dlg-title">Enroll in Python from Zero?</h2>
        <div className="btns">
          <button onClick={() => onClose(true)}>Yes, enroll</button>
          <button className="plain" onClick={() => onClose(false)}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
```

- `useState(() => document.activeElement)` remembers the opener **while drawing**. The effect moves the focus to the first button, and its cleanup gives the focus back to the opener.
- The key handler on the box handles Escape and Tab. With Shift on the first button it jumps to the last; on the last button it jumps to the first.
- `role="dialog"`, `aria-modal="true"` and `aria-labelledby` point at the title. In `CoursePage.tsx` the page behind gets `inert={open}`, a plain attribute that makes the browser ignore that part for mouse, keyboard and assistive tools.

Real keys on `?v=good`: Tab to Enroll, Enter (the focus is already on Yes, enroll), Tab (Cancel), Tab (back to Yes, enroll), Shift+Tab (Cancel). More Tabs go round and round and never out. Escape: the dialog is gone and the focus is back on Enroll.

### 5. ARIA: the four gaps

ARIA changes nothing on screen, only the tree. The first rule: do not use it if a real element already does the job. The gaps:

1. A name. The heart has only a picture. `src/good/Wish.tsx`: `aria-label="Save to wishlist"` on the button and `aria-hidden="true"` on the svg.
2. A state. `aria-pressed={on}` says saved or not saved.
3. A role. `role="tablist"`, `role="tab"` with `aria-selected`, and a `role="tabpanel"` named by its tab with `aria-labelledby` (see `Tabs.tsx` above). ARIA attributes keep their dashes in JSX.
4. A message. `<div role="status">` in `CoursePage.tsx` is a live region. It must already be on the page before the text arrives, so the page always draws the empty div and only fills it.

```tsx
import { useState } from 'react'

export function Wish({ say }: { say: (m: string) => void }) {
  const [on, setOn] = useState(false)
  function toggle() {
    setOn(!on)
    say(on ? 'Removed from wishlist' : 'Saved to wishlist')
  }
  return (
    <button
      className="heart"
      aria-label="Save to wishlist"
      aria-pressed={on}
      onClick={toggle}
    >
      <svg
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 21l-8-8a5 5 0 0 1 8-7 5 5 0 0 1 8 7z" />
      </svg>
    </button>
  )
}
```

Check the tree of the fixed page:

```bash
node a11y-check.mjs "?v=good"
```

```text
--- accessibility tree ---
- main:
  - heading "Python from Zero" [level=1]
  - paragraph: by Meera · 40 lessons
  - button "Enroll"
  - button "Save to wishlist"
  - tablist "Course":
    - tab "Overview" [selected]
    - tab "Lessons"
    - tab "Reviews"
  - tabpanel "Overview": 40 lessons, one project.
  - status
--- axe-core ---
violations: 0  checks passed: 31
```

Click the heart on `?v=good`: the tree says `button "Save to wishlist" [pressed]` and the status region holds `Saved to wishlist`. The same click on the old page: still a button with no name, and the message is a loose line of text that no one is told about.

### 6. Testing

1. **By hand.** Put the mouse away and use the page with the keyboard for a minute.
2. **axe-core.** It checks the rules a machine can check. Old page: 3 violations (the critical `button-name` for the heart, and two moderate: one `main`, and `region`). Fixed page: 0 violations, 31 checks passed. axe-core did not mention the tabs that no keyboard can reach, because a machine cannot know that a group should have arrow keys.
3. **A real screen reader.** VoiceOver on a Mac, NVDA on Windows. Listen to your own page for five minutes before a big release.

The keyboard test as code, `keytest.mjs` (Playwright is the browser robot; Module 17, Lesson 4 teaches it):

```js
const tab = name => page.getByRole('tab', { name })
const press = key => page.keyboard.press(key)
for (let i = 0; i < 3; i++) await press('Tab')
assert(await tab('Overview').evaluate(e => e === document.activeElement))
await press('ArrowRight')
assert.equal(await tab('Lessons').getAttribute('aria-selected'), 'true')
await press('Tab')
const left = await page.evaluate(() => document.activeElement.tagName)
assert.equal(left, 'BODY')

console.log('keyboard test passed')
```

Run it with the dev server on:

```bash
node keytest.mjs "http://localhost:5163/?v=good"
```

```text
keyboard test passed
```

And on the old page, the robot cannot find a tab. It waits three seconds, then:

```bash
node keytest.mjs "http://localhost:5163/?v=bad"
```

```text
locator.evaluate: Timeout 3000ms exceeded.
Call log:
  - waiting for getByRole('tab', { name: 'Overview' })
```

## Common mistakes

All four are real. Open the pages and try them.

### 1. A role without the keys (`?d=m1`)

A `div` with `role="button"` and `tabIndex={0}`. The tree says `button "Enroll"` and axe-core finds nothing wrong with it (only the two landmark notes). Press Tab: the ring lands. Press Enter or Space: nothing. Only the mouse works. A role is only a label; the keys are still yours to write. Use a real `button`.

### 2. `aria-hidden` on something focusable (`?d=m2`)

The tree shows only the heading and the text. But Tab still lands on Enroll, a button the screen reader says does not exist. axe-core flags it: `aria-hidden-focus (serious)`.

### 3. A positive tabIndex (`?d=m3`)

Wishlist has `tabIndex={1}`. On screen the order is Enroll, Preview, Wishlist. The real Tab order is Wishlist first, then Enroll, then Preview. axe-core: `tabindex (serious)`. Use 0 or -1 and let the page decide the order.

### 4. Remembering the opener too late (`?v=late`)

`src/late/Dialog.tsx` reads `document.activeElement` inside the effect. Run the Enroll, Enter, Tab ... Escape keys: Escape closes the dialog and the focus lands on `BODY`. The page behind was already `inert`, which probably took the focus away from Enroll before the effect looked. The good file remembers the opener while drawing.

## Clean up

Stop the dev server (Ctrl+C). `node_modules/` and `dist/` can be deleted any time.

## Key points

- Keyboard: real buttons, one tab stop for each group, arrow keys inside it, `tabIndex` 0 or -1.
- A dialog: focus moves in, Tab stays inside, Escape closes and focus goes back.
- ARIA fills the gaps: a name, a state, a role and a live region. Use the real element first.
- Test three ways: keyboard, axe-core, a real screen reader. A tool finds only part of the problems.

Interview tip. If Rahul, the interviewer, asks "how do you make a custom component accessible?": start with the right element; then the keyboard (focus order, arrow keys in groups, focus in and back out of dialogs); then names, roles and states with ARIA only where needed; then test with axe-core, by hand and with a screen reader for the key flows.

## Try it yourself

Add a fourth tab, "Q and A", to `src/good/Tabs.tsx` (add a name and a text). Check that the arrow keys wrap around, then run `node a11y-check.mjs "?v=good"` again.

## Next

[M16-L04 · Designing a Component API](../m16-l04-designing-a-component-api/README.md)
