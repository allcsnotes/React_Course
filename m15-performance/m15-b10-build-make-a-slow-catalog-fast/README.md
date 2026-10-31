# M15-B10 · Build: Make a Slow Catalog Fast

> Video: Module 15, Build 10. Watch it first, then follow along here.

Today a slow page becomes a fast page, and every step comes with a number. This is the course catalog of the allcsvideos site, with 10,000 courses on one page, running against a local practice API. In the video Chrome was told to run everything four times slower, like a modest phone. Asha clicks Enroll on one course and the page needs over a second to answer; she types a letter and the slowest key takes most of a second. By the end the same page answers a click in a few dozen milliseconds, and a key press in 16 ms or less, and the page goes from about 100,000 elements to a few hundred. We get there in five steps, and every step is measured.

## What you'll learn

- How to set up measuring first: the `Profiler`, the browser's event timing (the numbers behind INP), and a render counter, with a profiling build and a script that prints the middle of three runs
- Step 1, the baseline: why one click re-renders 10,000 cards
- Step 2: `memo`, `useCallback` and `useMemo`, and the trap of an arrow function inside the loop
- Step 3: `useDeferredValue` to keep typing smooth (it moves work, it does not remove it)
- Step 4: a virtual list with TanStack Virtual (it removes work)
- Step 5: `lazy` and `Suspense` for the chart nobody opens (it removes bytes), and why you measure the thing a fix is for
- Lighthouse before and after, and what a scoreboard can and cannot claim

## Before you start

- Node 24 (`node --version`; recorded with v24.16.0). Google Chrome for the measuring scripts and Lighthouse.
- You did [M15-L01](../m15-l01-measuring-performance/README.md) to [M15-L04](../m15-l04-long-lists-and-transitions/README.md), and Module 11 (TanStack Query).
- Docker is not used.
- **Your numbers will differ from the video's.** Every millisecond below comes from one run of this repo on one laptop with Chrome's CPU slowed by 4, middle of three runs. The shape holds: the baseline is slow, each step answers one number, and the last row is the smallest. Element counts and render counts do not move.
- `npm audit` reports a few moderate issues inside Lighthouse's own dev dependencies. They are dev tools on your laptop and are not in the files that ship; lesson 3 of Module 13 shows how to read such a report.

## Files in this folder

| File | What it is |
|---|---|
| `package.json` | Pinned: react-query 5.105.0, @tanstack/react-virtual 3.14.24, recharts 3.10.1, React 19.3.1, Lighthouse 13.6.0, rollup-plugin-visualizer 7.1.1, Vite 8.3.5, TypeScript 7.0.2. Scripts: `build`, and `build:profile` (the measuring build) |
| `vite.config.ts` | Proxy to the API (port 8150), dev and preview on port 5760, the visualizer (only with `ANALYZE=1`), and in `--mode profiling` the alias `react-dom/client` to `react-dom/profiling` |
| `src/Catalog.tsx` | The finished catalog (stage s4) |
| `src/CourseGrid.tsx`, `src/CourseCard.tsx`, `src/Insights.tsx` | The virtual grid, the memoized card, the recharts chart (default export, loaded lazily) |
| `src/api.ts`, `src/perf.ts`, `src/main.tsx`, `src/index.css` | `fetchCourses`; the measuring helpers (`countRender`, `onRender`, `timed`, which only write numbers to `window.__perf`); the `Profiler` and query client; styles |
| `api/server.mjs` | Practice API on port 8150: `GET /api/courses` answers 10,000 generated courses (same list on every start). A local stand-in, not the production server |
| `measure/bench.mjs` | The measuring script: three runs, middle value, a table |
| `measure/lh-summary.mjs` | Prints the middle of three Lighthouse reports |
| `use.mjs` | `node use.mjs <stage>` puts a stage's component files into `src/` (the job of the video's `setv.sh`) |
| `versions/` | `s0` baseline, `s1` memo and callback, `s1x` the trap, `s2` deferred value, `s3` virtual grid, `s4` lazy chart (same as `src/`), `s4x` lazy with a named export (mistake) |

## Run it

```bash
npm install
node api/server.mjs
```

```text
practice API on 8150, 10000 courses, 1.64 MB
```

In a second terminal:

```bash
npm run dev
```

```text
  VITE v8.3.5  ready in ... ms

  ➜  Local:   http://localhost:5760/
```

Open http://localhost:5760/. This is the finished catalog (stage s4): search, Enroll buttons, an Insights chart, and a grid that scrolls smoothly through 10,000 courses.

## Build it step by step

### Step 0. Set up the measuring

The rule from lesson 1: measure first. Three tools: the `Profiler` and event timing (lesson 1) and the render counter (Module 14, lesson 3).

The data: one request answers with all 10,000 courses.

```bash
curl -s -o /dev/null -w "%{http_code} %{size_download}\n" localhost:8150/api/courses
```

```text
200 1642293
```

The measuring helpers are in the code: the card calls `countRender('CourseCard')` on its first line, and `main.tsx` wraps the catalog in `<Profiler id="Catalog" onRender={onRender}>`. A normal production build switches the `Profiler` off, so `vite.config.ts` swaps in React's profiling build only in a mode called `profiling`:

```ts
resolve:
  mode === 'profiling'
    ? { alias: { 'react-dom/client': 'react-dom/profiling' } }
    : {},
```

`measure/bench.mjs` opens the profiling build, slows Chrome's CPU by 4 (`Emulation.setCPUThrottlingRate`), counts elements, clicks Enroll on a card, types `react` key by key, and prints the middle of the runs. Set it up once:

```bash
npm install --no-save playwright-core@1.63.0
```

and for each stage:

```bash
node use.mjs s0
npm run build:profile
npx vite preview --outDir dist-profile --port 5760
# in another terminal, with the API running:
node measure/bench.mjs s0 3
```

Set `THROTTLE=1` for no slowdown.

### Step 1. The baseline (stage s0)

The version anyone would write first: state for the search text and for the set of enrolled courses; on every render it filters and sorts the 10,000 titles and draws one card for each. Each card is about ten elements, so ten thousand cards are a hundred thousand elements. Guess: Asha clicks Enroll on one course. How many card functions run again? Real run:

```text
bench s0 - 3 runs - CPU 4x slower - median
  DOM nodes                100,017
  show the list                530 ms
  largest paint (LCP)        2,520 ms
  enroll: cards run         10,000
  enroll: click                648 ms
  type: slowest key            696 ms
  type: biggest commit         302 ms
```

Ten thousand function calls for one click. The enrolled set lives in `Catalog`, `Catalog` ran, and a parent that runs makes every child run (Module 14, lesson 3). These are the numbers to beat (the video's laptop measured 1,080 ms for the click and 880 ms for the slowest key).

### Step 2. Stop the waste: memo, useCallback, useMemo (stages s1x, s1)

Wrap the card in `memo`, and make `enroll` receive the course number, so one and the same function can serve every card:

```tsx
export const CourseCard = memo(function CourseCard({ course, enrolled, onEnroll }: Props) { ... })

const enroll = useCallback((id: number) => {
  setEnrolled((prev) => new Set(prev).add(id))     // the updater form: Module 4, lesson 4
}, [])

const shown = useMemo(() => timed('filter+sort', () => courses.filter(...).sort(...)), [courses, query])
```

The trap from lesson 2, measured on 10,000 cards (stage `s1x`): the arrow function written inside the loop, `onEnroll={() => enroll(c.id)}`. It looks harmless:

```text
bench s1x - 3 runs - CPU 4x slower - median
  enroll: cards run         10,000
  enroll: click                624 ms
```

The same as the baseline: every render makes 10,000 new functions, so `memo` has nothing to skip. Now with the frozen function, `onEnroll={enroll}` (stage `s1`):

```text
bench s1 - 3 runs - CPU 4x slower - median
  DOM nodes                100,017
  show the list                495 ms
  enroll: cards run              1
  enroll: click                176 ms
  type: slowest key            296 ms
  type: biggest commit          35 ms
```

One card ran. The click went from 648 ms to 176 ms, and typing improved too (696 to 296 ms), because most cards in the new list are unchanged and `memo` skips them. But look closer: the page still holds 100,017 elements, and React still walks through 10,000 cards to check them. We cannot `memo` our way out of a huge list.

### Step 3. Keep typing smooth: useDeferredValue (stage s2)

Every key still filters the list and then the list changes. While React does that, the input cannot even show the letter. The input keeps using `query`, which updates at once. The list uses `deferredQuery`, its lagging copy, and is dimmed while it catches up:

```tsx
const deferredQuery = useDeferredValue(query)
// filter with deferredQuery ... and on the list's container:
<div className="scroll" style={{ opacity: query === deferredQuery ? 1 : 0.6 }}>
```

```text
bench s2 - 3 runs - CPU 4x slower - median
  DOM nodes                100,017
  enroll: click                160 ms
  type: slowest key            200 ms
  type: biggest commit          39 ms
```

The slowest key went from 296 to 200 ms. Notice what did not change: the page still has 100,017 elements, and a commit still takes tens of milliseconds. We did not remove the work, we moved it out of the way of the typing. To remove it, we need fewer elements.

### Step 4. Draw only what you can see: a virtual grid (stage s3)

A long roll of paper behind a frame with a small window: draw only the rows in the window. `CourseGrid.tsx` uses TanStack Virtual. There are 2 cards in each row, so the count is 5,000 rows, and one row is 104 pixels (a 96-pixel card plus the gap):

```tsx
const virtual = useVirtualizer({
  count: Math.ceil(courses.length / COLUMNS),
  getScrollElement: () => scrollRef.current,
  estimateSize: () => ROW_HEIGHT,
  overscan: 4,
})
```

The tall box around the rows (`height: virtual.getTotalSize()`) gives the scroll bar its true length; the rows listed by `virtual.getVirtualItems()` are each moved to their place with `translateY`.

```text
bench s3 - 3 runs - CPU 4x slower - median
  DOM nodes                    248
  show the list                 27 ms
  largest paint (LCP)          252 ms
  enroll: cards run              1
  enroll: click                 40 ms
  type: slowest key     16 or less ms
  type: biggest commit          15 ms
```

The page holds 248 elements instead of 100,017. Showing the list takes 27 ms, the click 40 ms, and the slowest key 16 ms or less (the smallest thing the event timing reports). Now scroll to the middle of the catalog (in the console: `document.querySelector('.scroll').scrollTop = 2499 * 104`): the cards for row 2,500 are on screen, and the page holds only a few hundred elements (332 in this run, because the window now has rows above and below). Cards that are far away do not exist in the page. They are drawn when you scroll to them.

### Step 5. Load less code: lazy (stage s4)

The list is fast now, but the first visit still downloads one big script. Real build of stage `s3`:

```bash
node use.mjs s3
ANALYZE=1 npm run build
```

```text
dist/assets/index-BvNjeaSj.js   639.26 kB │ gzip: 190.06 kB
```

`ANALYZE=1` also writes `stats.html`, the bundle visualizer report (lesson 3). Open it: `recharts`, the chart library behind the Insights button, fills about 52 percent of the main file (745 of 1,426 kB before compression). And almost no visitor opens Insights. Lesson 3's tool: `lazy` with a dynamic import, and a `Suspense` around it. The chart file changes one word, to a default export, because `lazy` needs that:

```tsx
const Insights = lazy(() => import('./Insights.tsx'))

{showInsights && (
  <Suspense fallback={<p className="wait">Loading the chart...</p>}>
    <Insights courses={courses} />
  </Suspense>
)}
```

```bash
node use.mjs s4
npm run build
```

```text
dist/assets/index-BONVWI7u.js     291.00 kB │ gzip:  89.68 kB
dist/assets/Insights-BklYfXKW.js  349.52 kB │ gzip: 101.30 kB
```

The main file shrinks from 639 kB to 291 kB, and the chart code waits in its own file. It is downloaded the first time someone clicks Insights. To see the fallback, delay that one file in the browser's developer tools (Network, throttling) or with a script: click Insights, and you see `Loading the chart...` first, then the chart, and only now the browser fetched `Insights-....js`.

A check, not a mistake: did lazy loading change the numbers from step 4? Real run of stage `s4`:

```text
bench s4 - 3 runs - CPU 4x slower - median
  DOM nodes                    248
  show the list                 26 ms
  enroll: click                 40 ms
  type: slowest key     16 or less ms
```

The same as `s3`, within the noise. Lazy loading changed the first download, and nothing else. So always measure the thing a fix is for.

### Step 6. Lighthouse, before and after

On the production build, with the desktop settings, middle of three runs. Before is stage `s0`, after is stage `s4`. Lighthouse is installed locally (it is in `package.json`):

```bash
node use.mjs s0
npm run build
npx vite preview --port 5760          # leave it running; in another terminal:
for n in 1 2 3; do npx lighthouse http://localhost:5760 --preset=desktop --only-categories=performance --chrome-flags="--headless=new" --output=json --output-path=lh-before-$n.json --quiet; done
```

Then the same with `node use.mjs s4` and `lh-after-$n.json`, and:

```bash
node measure/lh-summary.mjs before after
```

```text
before  score  82 · speed index 0.5 s · blocking 328 ms
after   score  94 · speed index 0.2 s · blocking 0 ms
```

(The video's laptop gave 71 to 94, speed index 0.7 s to 0.3 s, and blocking 656 ms to 0 ms.) A fast desktop hides most of the problem. That is why the other numbers use a slowed processor. Delete the `lh-*.json` files when you are done.

## The scoreboard

From the real runs above, first row to last row (CPU 4x slower, middle of 3):

| Stage | Elements | Enroll click | Slowest key | Main script (zipped) |
|---|---|---|---|---|
| s0 baseline | 100,017 | 648 ms | 696 ms | 639 kB (190 kB) |
| s1 memo + useCallback | 100,017 | 176 ms | 296 ms | 639 kB (190 kB) |
| s2 useDeferredValue | 100,017 | 160 ms | 200 ms | 639 kB (190 kB) |
| s3 virtual grid | 248 | 40 ms | 16 or less | 639 kB (190 kB) |
| s4 lazy chart | 248 | 40 ms | 16 or less | 291 kB (90 kB) |

Which step gave which win? `memo` and `useCallback` fixed the click. `useDeferredValue` fixed the typing. Virtualisation fixed the size of the page, and with it almost everything else. Lazy loading fixed the first download. Each fix answered a number we had measured before.

And what we cannot claim: these numbers come from one laptop with Chrome slowed by 4, and they move from run to run. A real phone with a real network will differ. Measure on the devices your visitors use, and measure again after every step, so you know which fix paid and when to stop.

## Common mistakes

1. **The arrow function inside the loop** (stage `s1x`): 10,000 cards run, same as the baseline. See step 2.
2. **A named export for a lazy component** (stage `s4x`). `Insights` exported by name; `lazy` needs a default export. TypeScript catches it at the build:

   ```bash
   node use.mjs s4x
   npx tsc -b
   ```

   ```text
   src/Catalog.tsx(14,29): error TS2322: Type 'Promise<typeof import(".../src/Insights")>' is not assignable to type 'Promise<{ default: ComponentType<any>; }>'.
     Property 'default' is missing in type 'typeof import(".../src/Insights")' but required in type '{ default: ComponentType<any>; }'.
   ```

3. **Measuring in development, or with the Profiler switched off.** Use `npm run build:profile` and `vite preview`, not `npm run dev`.
4. **Claiming a fix helped without measuring what it was for.** The step 5 check shows the table did not move; only the first download did.

## Clean up

Press Ctrl+C in both terminals. Run `node use.mjs s4` to put the finished stage back. Delete `dist`, `dist-profile`, `stats.html`, `lh-*.json` and `node_modules` if you like (the `.gitignore` in this folder keeps the first four out of git).

## Try it yourself

Three extensions:

1. Remove the manual `memo` and `useCallback`, switch on the React Compiler from lesson 2, and compare the counters.
2. Add sorting by rating, and measure it.
3. Cache the second visit with the query cache from Module 11.

Interview tip. "A page with ten thousand rows is slow. What do you do?" I measure first, with the Profiler and event timing. Then I stop needless re-renders with `memo`, and move slow work out of the way with a deferred value. Then I virtualise the list, and split code that is not needed at the start. And I measure again after every step.

## Next

Module 16 starts with composition patterns (compound components, slots and render props): [M16-L01](../../m16-patterns-and-reusable-components/m16-l01-composition-patterns/).
