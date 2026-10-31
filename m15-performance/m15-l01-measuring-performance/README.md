# M15-L01 · Measuring Performance

> Video: Module 15, Lesson 1. Watch it first, then follow along here.

Priya is testing the allcsvideos catalog, which now lists 8,000 courses on one page. She types the letter `r` in the search box and the list shrinks, but it feels sticky. Is that slow? Is it fine? And if it is slow, which part is slow? The cure for guessing is measuring. In this lesson you use three tools: React's `Profiler` (how long React takes), the web vitals (what a visitor feels) and Lighthouse (a test of the whole page).

## What you'll learn

- A frame lasts about 16 milliseconds; longer than that and the screen skips a picture
- The `Profiler` component: `id`, `onRender`, `phase`, `actualDuration` and `baseDuration`; using two profilers to find where the time goes
- The three web vitals and their "good" limits: LCP under 2.5 s, INP under 200 ms, CLS under 0.1, read with the `web-vitals` library
- How to fix a layout shift (CLS) by always drawing the banner's box
- Lighthouse from the terminal, from a local `npm` install, and how to read its numbers
- Three mistakes: measuring in development mode, a silent profiler in a production build (and the profiling build that fixes it), and trusting one run

## Before you start

- Node 24 (`node --version`; recorded with v24.16.0). Google Chrome for the browser scripts and Lighthouse.
- You know why components re-render ([M14-L03](../../m14-react-under-the-hood/m14-l03-why-a-component-re-renders/README.md)).
- Docker is not used.
- **Your numbers will differ from the video's.** The video measured on a busy laptop; every number below was measured on one run of this repo and moves from run to run. What matters is the shape: the first letter costs the most, the catalog costs far more than the header, and production is faster than development.

## Files in this folder

| File | What it is |
|---|---|
| `package.json` | Pinned: React 19.3.1, web-vitals 6.2.3, Vite 8.3.5, TypeScript 7.0.2 |
| `vite.config.ts` | Dev and preview on port 5151. With `PROFILING=1` it maps `react-dom/client` to `react-dom/profiling` (the profiling build) |
| `src/App.tsx` | The catalog (stage v1-slow): search text in state, a `Profiler` around the grid |
| `src/CourseCard.tsx`, `src/data.ts`, `src/report.ts` | The card, 8,000 generated courses, and the `report` function that prints Profiler numbers |
| `src/main.tsx`, `src/index.css` | Entry point and styles |
| `use.mjs` | `node use.mjs <stage>` puts `versions/common` and the stage into `src/` (the job of the video's `setver.sh`) |
| `versions/` | `common`, `v1-slow`, `v2-two` (two profilers), `v3-vitals` (web-vitals logging), `v4-banner` (a late banner), `v5-fixedbanner` |
| `measure/bench.mjs`, `measure/vitals.mjs` | Browser scripts that type `react` and print Profiler lines, event timings and web vitals |
| `lh/` | A separate mini project with Lighthouse 13.6.0 pinned, and `summary.mjs` that prints the numbers of a report file |

## Follow along

### 1. Install and start

```bash
npm install
npm run dev
```

```text
  VITE v8.3.5  ready in ... ms

  ➜  Local:   http://localhost:5151/
```

For the browser scripts (optional) add Playwright without saving it:

```bash
npm install --no-save playwright-core@1.63.0
```

### 2. The Profiler (stage v1-slow)

`src/report.ts` is the function React calls after every update of the wrapped part:

```ts
export function report(id: string, phase: string, ms: number, base: number) {
  console.log(`${id} ${phase}: ${ms.toFixed(1)} ms (base ${base.toFixed(1)})`)
}
```

`src/App.tsx` wraps the grid:

```tsx
<Profiler id="catalog" onRender={report}>
  <div className="grid">
    {shown.map((c) => (
      <CourseCard key={c.id} course={c} />
    ))}
  </div>
</Profiler>
```

React calls `report` with the name, the phase (`mount` the first time, `update` after that), `actualDuration` (the milliseconds React really spent this time) and `baseDuration` (an estimate of drawing everything again with nothing skipped). Open http://localhost:5151/, open the browser console, click the search box and type `react`, one letter at a time. Guess: which letter costs the most? Real result in development mode, from one run of this repo (the video's laptop was slower, so its numbers were bigger):

```text
catalog mount: 139.5 ms (base 113.7)
catalog update: 127.3 ms (base 122.8)     <- r
catalog update: 51.0 ms (base 50.2)       <- e
catalog update: 15.4 ms (base 15.0)       <- a
catalog update: 19.5 ms (base 19.2)       <- c
catalog update: 20.4 ms (base 20.5)       <- t
```

The first letter costs the most, and then the cost falls fast. The count above the grid tells why: after `r` thousands of courses are left, after `re` fewer, and at the end a few hundred. The cost follows the number of cards React has to run. And it runs all of them for a single letter because the search text lives in `App`, and when a parent renders everything inside runs again (Module 14, lesson 3). A frame has 16 ms; a first letter of 127 ms is about eight frames, in development mode. A number like that can be improved, checked and compared. A feeling cannot. The React Developer Tools extension has a Profiler tab that shows the same information as a graph.

### 3. Where is the time? Two profilers (stage v2-two)

```bash
node use.mjs v2-two
```

One profiler around the header (with the search box) and one around the catalog, each with its own name. Type `r` again:

```text
header update: 0.1 ms (base 0.0)
catalog update: 110.0 ms (base 107.7)
```

The header costs less than one millisecond; the catalog costs over a hundred. Making the header faster would gain nothing. The profiler shows where the time goes.

But the profiler measures React's part only: running the components. After that, the browser must still create thousands of boxes, find their places and paint them. To see what a visitor waits for, use the browser's own event timing. `measure/bench.mjs` types `react` and prints the Profiler lines and, for each key, the event durations `[event, total ms, handler ms]`. With the dev server running and `node use.mjs v1-slow`:

```bash
node measure/bench.mjs 3
```

```text
{"logs":["catalog mount: 139.5 ms (base 113.7)", ...],"ev":[["keydown",304,1],["input",304,219],["keydown",96,0],["input",96,75], ...]}
```

For the first letter the page took 304 ms from key press to the next paint in the first run, while the Profiler said 127 ms: the Profiler sees only React's share. (Run it several times; the numbers move.)

### 4. Web vitals (stages v3-vitals, v4-banner, v5-fixedbanner)

Three numbers that say what a visitor feels:

| Vital | Meaning | Good |
|---|---|---|
| LCP, Largest Contentful Paint | Time until the biggest thing on the screen has appeared (the main dish) | under 2.5 s |
| INP, Interaction to Next Paint | The slowest wait between a click or key press and the page reacting (knocking on a door) | under 200 ms |
| CLS, Cumulative Layout Shift | How much the page jumps while someone uses it (somebody slides the table). A score, no unit | under 0.1 |

The `web-vitals` library has one function for each. `versions/v3-vitals/main.tsx` hands each a function that logs the name, value and rating:

```tsx
for (const watch of [onLCP, onINP, onCLS]) {
  watch(
    (m) => {
      const v = m.value.toFixed(m.name === 'CLS' ? 3 : 0)
      console.log(`${m.name} ${v} ${m.rating}`)
    },
    { reportAllChanges: true },
  )
}
```

Always measure a production build. Build it and serve it on port 5151:

```bash
node use.mjs v3-vitals
npx vite build --outDir dist-vit
npx vite preview --outDir dist-vit --port 5151
```

Open the page, type `react`, and watch the console (or run `node measure/vitals.mjs 2` in another terminal). Real result from this repo (LCP and INP depend on the machine):

```text
LCP 232 good
CLS 0.000 good
INP 120 good
```

Now a page that breaks the third number. In `v4-banner`, a sale banner arrives 0.7 seconds after the page, above the header, and everything slides down:

```tsx
const [sale, setSale] = useState(false)
useEffect(() => {
  const id = setTimeout(() => setSale(true), 700)
  return () => clearTimeout(id)
}, [])
// {sale && <div className="banner">Summer sale: 30% off every course</div>}
```

Build it with `node use.mjs v4-banner && npx vite build --outDir dist-ban`, serve `dist-ban` the same way, and measure:

```text
LCP 1068 good
CLS 0.120 needs-improvement
INP 136 good
```

The page jumped, and nobody touched it. The cure is cheap (`v5-fixedbanner`): always draw the banner's box, with the same height, empty until the text arrives, so nothing moves when the text appears:

```tsx
<div className="banner">
  {sale ? 'Summer sale: 30% off every course' : ''}
</div>
```

```text
LCP 1040 good
CLS 0.000 good
INP 112 good
```

### 5. Lighthouse

Lighthouse opens your page in a fresh browser, pretends to be a mid-range phone with a slower processor, and scores it from 0 to 100. It lives in its own folder with a local install (nothing global):

```bash
cd lh
npm install
cd ..
node use.mjs v1-slow
npm run build
npx vite preview --port 5151        # leave this running, then in another terminal:
cd lh
npx lighthouse http://localhost:5151 --only-categories=performance --chrome-flags="--headless=new" --output=json --output-path=report1.json --quiet
node summary.mjs report1.json
```

`lh/summary.mjs` reads the saved report and prints one number per line. Real result from one run here (three runs gave 93, 93 and 93; the video's laptop gave 83, 84 and 80, so "yours will differ"; take the middle of three):

```text
Performance score 93
First Contentful Paint       0.8 s
Largest Contentful Paint     0.8 s
Total Blocking Time          320 ms
Cumulative Layout Shift      0
Speed Index                  0.8 s
```

First Contentful Paint is the first moment anything is drawn. Total Blocking Time is the time the page was frozen, unable to answer a click, while it loaded. Notice what Lighthouse did not find: it loads the page but never types in the search box, and typing is the slow part of this page. Total blocking time is the only hint. Each tool sees one side of the page, and none sees all of it. Lighthouse is a lab test (the same pretend phone every time, no real visitors). Numbers from real visitors are called field data: use the lab before a release, and real data after. Delete `report*.json` when you are done.

## Common mistakes

1. **Measuring in development mode.** Development mode adds extra checks on purpose, so it is slower than the real site. The same first letter, from this repo: Profiler about 127 ms in development, about 75 ms in the production profiling build. Build, then preview, and never trust the development server for numbers.
2. **A silent Profiler.** In a normal production build React switches the Profiler off to stay fast. Serve `npm run build` output (`npx vite preview --port 5151`), type `react`:

   ```bash
   node measure/bench.mjs 1
   ```

   ```text
   {"logs":[],"ev":[["keydown",112,0],["input",112,74],["keydown",40,0],["input",40,32],["keydown",16,0],["input",16,12]]}
   ```

   The console prints nothing from the Profiler. The fix is a profiling build. `vite.config.ts` points `react-dom/client` at `react-dom/profiling` when you ask for it with an environment variable; nothing changes in your own code:

   ```ts
   resolve: {
     alias: process.env.PROFILING
       ? { 'react-dom/client': 'react-dom/profiling' }
       : {},
   },
   ```

   ```bash
   PROFILING=1 npx vite build --outDir dist-prof
   npx vite preview --outDir dist-prof --port 5151
   ```

   ```text
   catalog mount: 104.0 ms (base 89.8)
   catalog update: 75.5 ms (base 73.8)
   catalog update: 21.9 ms (base 21.1)
   catalog update: 9.5 ms (base 8.8)
   ```

   The numbers are back. This build is a little slower than the normal one because it also keeps time. Use it to find where, and use the web vitals to judge how much. (On Windows set the variable with `set PROFILING=1` or use `cross-env`.)
3. **Believing one run.** Here are the Profiler's lines for the second letter from three development runs of this repo: 51.0, 24.6 and 25.3 ms. The video's five runs ranged from 64 to 116 ms. The worst is often twice the best. Run it five times and take the middle value.

## Clean up

Press Ctrl+C in every terminal. Delete `dist*`, `lh/report*.json`, `lh/node_modules`, `node_modules` if you like, and run `node use.mjs v1-slow` to put the first stage back.

## Try it yourself

Wrap the header and the grid of your own project in two profilers, type a word, and find the most expensive letter. Then open the Profiler tab of the React Developer Tools in your browser and look at the same information as a graph. Finally build for profiling (`PROFILING=1`) and compare the numbers.

Interview tip. "A page feels slow. What do you do first?" Do not guess. Reproduce it in a production build, measure with the Profiler and the web vitals, change one thing, and measure again.

## Next

[M15-L02 · memo, useMemo, useCallback and the React Compiler](../m15-l02-memo-usememo-usecallback-and-the-react-compiler/README.md)
