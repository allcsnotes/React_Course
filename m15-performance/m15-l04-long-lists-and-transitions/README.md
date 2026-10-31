# M15-L04 · Long Lists and Transitions

> Video: Module 15, Lesson 4. Watch it first, then follow along here.

Asha's catalog page lists every course, ten thousand of them, in one long list. It works, but the page feels heavy. Nobody can read ten thousand courses at once, and on this screen you see six. So why does the page build all ten thousand? In this lesson you learn the cure, a window over the list (a virtual list), and two more tools for a smooth page: `useTransition` and `useDeferredValue`.

## What you'll learn

- Why a page with 50,018 elements is slow, and how a virtual list (windowing) with TanStack Virtual keeps only the rows in the window (74 elements for the whole page)
- `useVirtualizer` and its four options: `count`, `getScrollElement`, `estimateSize`, `overscan`
- Why the scroll box must have a height, and what a virtual list cannot do (the browser's find)
- `useTransition` (`startTransition`, `isPending`): mark an update as "can wait" so typing stays quick
- `useDeferredValue` when you do not own the setter
- Why `memo` on the slow child is needed, and why you never put the input's own text in a transition

## Before you start

- Node 24 (`node --version`; recorded with v24.16.0).
- You did [M15-L01](../m15-l01-measuring-performance/README.md) and [M15-L02](../m15-l02-memo-usememo-usecallback-and-the-react-compiler/README.md) (`memo`), and know refs (Module 7, lesson 4).
- Google Chrome only for the optional `measure/probe.mjs`. Docker is not used.
- **Your numbers will differ from the video's.** Millisecond values below come from one run of this repo in the development server and move from run to run. Element counts do not move: they are the same on every machine.

## Files in this folder

| File | What it is |
|---|---|
| `package.json` | Pinned: @tanstack/react-virtual 3.14.24, React 19.3.1, Vite 8.3.5, TypeScript 7.0.2 |
| `src/App.tsx` | The virtual list (stage n1-virtual) |
| `src/CourseRow.tsx`, `src/SearchBar.tsx`, `src/GalleryCard.tsx` | One row, the search box with a count, one gallery card |
| `src/data.ts` | 10,000 generated courses (`COURSES`) |
| `src/stopwatch.ts`, `src/main.tsx` | Two tiny helpers of ours (not React) that log `page painted after N ms` and `key painted after N ms` |
| `src/index.css` | Styles (`.list` has the fixed height) |
| `use.mjs` | `node use.mjs <stage>` puts `versions/_base` and the stage into `src/` (the job of the video's `use.sh`) |
| `measure/probe.mjs` | Counts the page's elements and prints the paint times for the letters you type |
| `versions/` | `_base`, `n0-naive`, `n1-virtual`, `n2-noheight`, `t0-slow`, `t1-nomemo`, `t2-transition`, `t3-deferred`, `t4-inputlag` |

## Follow along

### 1. Install and start

```bash
npm install
npm run dev
```

```text
  VITE v8.3.5  ready in ... ms

  ➜  Local:   http://localhost:5154/
```

Switch stage with `node use.mjs n0-naive` (Vite reloads). With the browser console open you will see the helper lines, for example `page painted after 328 ms` when the page opens and `key painted after 201 ms` after each letter you type. For element counts, run in the console: `document.querySelectorAll('*').length`.

For the optional script: `npm install --no-save playwright-core@1.63.0`, then `node measure/probe.mjs py` types the letters `p` and `y` and prints the numbers.

### 2. The heavy page (stage n0-naive)

```bash
node use.mjs n0-naive
```

The search text is in `useState`, the 10,000 courses are filtered, and a row is drawn for every one:

```tsx
const shown = COURSES.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()))
// ...
<ul className="list">
  {shown.map((c) => <CourseRow key={c.id} course={c} />)}
</ul>
```

Real numbers from this repo's run:

```text
elements: 50018
page painted after 328 ms
key painted after 201 ms   (letter p)
key painted after 69 ms    (letter y)
```

The video's laptop reported 412 ms and 249 ms. Either way: 50,018 elements, and a letter that waits a fifth of a second.

### 3. The window: a virtual list (stage n1-virtual)

Picture a roll of paper with ten thousand courses printed on it, behind a cardboard frame with a small window. You print only the rows in the window. When you scroll, you rub out the rows that left and print the rows that arrived. The scroll bar still has the full height, but only a handful of rows really exist. This is virtualisation (windowing). You could write it by hand with scroll positions and arithmetic, but it is a solved problem. TanStack Virtual's React hook is `useVirtualizer` (already in `package.json`; to add it yourself: `npm install @tanstack/react-virtual@3.14.24`).

```bash
node use.mjs n1-virtual
```

```tsx
const parentRef = useRef<HTMLDivElement>(null)
const virtualizer = useVirtualizer({
  count: shown.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 56,
  overscan: 5,
})

<div className="list" ref={parentRef}>
  <ul className="virtual" style={{ height: virtualizer.getTotalSize() }}>
    {virtualizer.getVirtualItems().map((item) => (
      <CourseRow key={item.key} course={shown[item.index]} y={item.start} />
    ))}
  </ul>
</div>
```

The four options: `count` (how many items the whole list has), `getScrollElement` (returns the scroll box so the library can watch it), `estimateSize` (how tall one row is: 56 px) and `overscan` (extra rows kept ready above and below the window so fast scrolling never shows a blank). `getTotalSize()` is the full height of the roll; `getVirtualItems()` returns only the rows in the window, each with an `index` (which course to draw) and a `start` (how far from the top it belongs). The row moves itself there with a `transform`.

Guess: how many elements does the page have now? Real result:

```text
elements: 74
page painted after 16 ms
key painted after 23 ms   (letter p)
key painted after 14 ms   (letter y)
```

Seventy-four elements, not fifty thousand: 11 rows in the list (the six you see plus five of overscan). Typing is smooth. (If you see a one-time `Cannot read properties of null (reading 'useReducer')` in the console the first time you open this stage, Vite was optimizing the new library and reloading; reload the page and it is gone.)

Is it really ten thousand rows? Scroll to the end: in the console, `document.querySelector('.list').scrollTop = 8999 * 56`. The rows `#8995`, `#8996`, `#8997`... appear, and the page has 99 elements (a few more than at the top, because the window now has overscan above it as well). The list did not stop at eleven rows. It changed which eleven rows exist.

### 4. Two mistakes with virtual lists

1. **The scroll box has no height** (stage `n2-noheight`). Same code, one style rule changed (`className="list-free"` has no fixed height). The library asks the box how tall the window is; without a height the box grows to fit all of its content, so the window is as tall as the whole roll and the library thinks all 10,000 rows are in view:

   ```text
   elements: 50019
   page painted after 499 ms
   key painted after 419 ms   (letter p)
   ```

   Slower than the naive list, because now there is extra work too. If a virtual list is slow, check the height first.
2. **Rows that are not in the page cannot be found by the browser's find.** Before scrolling, the text `#5000` is not in the page: `document.body.innerText.includes('#5000')` is `false`. Scroll to row 5,000 (`scrollTop = 4999 * 56`) and it is `true`. Search inside a virtual list has to be done by your own search box, like ours. And for a short list, with a hundred rows, do not bother: make a list virtual only when it is long, in the thousands.

### 5. A different problem: too much to draw on every key (stage t0-slow)

Virtualisation helps when there is too much to draw. A gallery of cards in a grid (up to 1,500 cards, each with a picture box, a title, hours and five stars) does not fit a virtual list well, because cards wrap, so here we keep it plain:

```bash
node use.mjs t0-slow
```

The gallery filters the courses, keeps the first 1,500, and draws a card for each. The page keeps the search text in `useState`, as always.

```text
elements: 16518
key painted after 112 ms   (letter p)
key painted after 81 ms    (letter y)
```

More than a tenth of a second for a single letter. Typing a letter changes the state, and the state changes the whole page, input and gallery together, in one go. The letter has to wait for the cards. The wait from key press to screen is what the interaction number (INP) from lesson 1 measures. But think about what matters: the person typing wants the letter right now. The gallery can be a moment late.

### 6. `useTransition` (stage t2-transition)

A baker serves the coffee customer first and goes back to the wedding cake after. If a new coffee order comes in, the baker stops the cake again. That is a transition.

```bash
node use.mjs t2-transition
```

```tsx
const [text, setText] = useState('')
const [query, setQuery] = useState('')
const [isPending, startTransition] = useTransition()

<SearchBar
  value={text}
  onChange={(v) => {
    setText(v)                              // urgent: the box
    startTransition(() => setQuery(v))      // can wait: the gallery
  }}
/>
<div className={isPending ? 'dim' : ''}>
  <Gallery query={query} />
</div>
```

`isPending` is true while the cake is still being baked, and we use it to dim the gallery: this is the old list, the new one is coming. The slow child is wrapped in `memo` (`export default memo(Gallery)`). Real result:

```text
elements: 16519
key painted after 42 ms    (letter p)   <- before: 112
key painted after 19 ms    (letter y)   <- before: 81
```

The box shows `py` at once, and the gallery is dimmed, still showing the old cards. A moment later the new ones arrive. Be honest about what happened: the cards did not get cheaper. About the same work, but typing is no longer stuck behind it. And if Lukas types another letter in the middle, React drops the old gallery work and starts the new one.

### 7. `useDeferredValue` (stage t3-deferred)

Sometimes you do not own the state: the value arrives as a prop, or from someone else's hook, and you cannot wrap its setter. `useDeferredValue` gives you a copy that lags a little behind:

```bash
node use.mjs t3-deferred
```

```tsx
const [query, setQuery] = useState('')
const deferredQuery = useDeferredValue(query)

<SearchBar value={query} onChange={setQuery} />
<div className={query !== deferredQuery ? 'dim' : ''}>
  <Gallery query={deferredQuery} />
</div>
```

When the text changes, React first draws the page with the new text and the old copy (quick). Then, in the background, it draws again with the new copy. If the two differ, the gallery is stale, so we dim it. Real result:

```text
key painted after 38 ms   (letter p)
key painted after 12 ms   (letter y)
```

The same idea as `useTransition`, in another shape. Use `useTransition` when you own the set function, `useDeferredValue` when you only have the value.

## Common mistakes

1. **Putting the box itself in the transition** (stage `t4-inputlag`): `onChange={(v) => startTransition(() => setQuery(v))}`. Now the text of the box is the cake, and a transition can wait. Type `p`, `y`, `t` quickly: the box shows only `t`. The `p` and the `y` are gone. Never put the text of an input in a transition. The box must be urgent.
2. **No `memo` on the slow child** (stage `t1-nomemo`). With `useTransition`, the parent renders first with the old query, and the gallery runs again for nothing (Module 14, lesson 3). Without `memo`, the letters in the same run took 106 ms and 85 ms: only a small gain over `t0-slow` (112 and 81). With `memo`, `t2-transition` gives 42 and 19. `useTransition` and `useDeferredValue` need `memo` on the slow child.
3. **Expecting these tools to make work cheaper.** If something can be drawn less, draw less first, with a virtual list. And measure before and after, as in lesson 1.

## Clean up

Press Ctrl+C in the terminal. Run `node use.mjs n1-virtual` to put the virtual list back. Delete `dist` and `node_modules` if you like.

## Try it yourself

Make a list of 2,000 items and measure the elements in the page (`document.querySelectorAll('*').length`). Then make it virtual and measure again.

Interview tip. "How do you handle a list with ten thousand items?" Make it virtual, so that only the visible rows are in the page, with a library like TanStack Virtual. And if a state change is slow to draw, use a transition or a deferred value so the input stays responsive. Then measure before and after.

## Next

[M15-B10 · Build: Make a Slow Catalog Fast](../m15-b10-build-make-a-slow-catalog-fast/README.md)
