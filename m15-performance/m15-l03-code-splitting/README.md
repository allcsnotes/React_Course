# M15-L03 · Code Splitting

> Video: Module 15, Lesson 3. Watch it first, then follow along here.

Asha's allcsvideos site has a courses page and a new dashboard page with a chart of watch minutes, drawn by a library called recharts. She runs the production build and gets one JavaScript file of 578 kilobytes, and Vite warns that some chunks are larger than 500 kB. A visitor who opens the home page, which shows four course names, must download and read all of it first, including the whole chart library for a dashboard page they have not opened. In this lesson you cut the big file into smaller pieces and load each piece only when the visitor needs it.

## What you'll learn

- What a bundle and a chunk are, and why splitting does not make the code smaller (it changes when the browser pays for each piece)
- How to read the build output and a bundle report (`rollup-plugin-visualizer`) before you split
- Dynamic `import()`, `React.lazy` and `Suspense`: two small edits
- Prefetching a chunk when the mouse enters a button
- Three mistakes: `lazy` needs a default export, `lazy` inside a component, and a chunk that fails to download (an error boundary)
- What to split and what not to split

## Before you start

- Node 24 (`node --version`; recorded with v24.16.0).
- You know `Suspense` and error boundaries ([M14-L05](../../m14-react-under-the-hood/m14-l05-suspense-and-error-boundaries/README.md)) and measuring ([M15-L01](../m15-l01-measuring-performance/README.md)).
- Docker is not used.

## Files in this folder

| File | What it is |
|---|---|
| `package.json` | Pinned: React 19.3.1, recharts 3.10.1, react-error-boundary 6.1.6, rollup-plugin-visualizer 7.1.1, Vite 8.3.5, TypeScript 7.0.2 |
| `vite.config.ts` | Adds the `visualizer` plugin, which writes `stats.html` next to the build. Dev and preview on port 5153 |
| `src/App.tsx` | The page switcher (stage v1-lazy: `lazy` + `Suspense`) |
| `src/CoursesPage.tsx`, `src/DashboardPage.tsx` | Two pages; the dashboard has the recharts bar chart |
| `src/main.tsx`, `src/index.css` | Entry point and styles |
| `use.mjs` | `node use.mjs <stage>` puts `versions/_shared` and the stage into `src/` (the job of the video's `use.sh`) |
| `versions/` | `_shared`, `v0-eager` (static import), `v1-lazy`, `v2-prefetch`, `v3-boundary`, and the mistakes `p-named`, `p-inside` (with the fix `p-outside`) |

## Follow along

### 1. Install, and the build that hurts (stage v0-eager)

```bash
npm install
node use.mjs v0-eager
npm run build
```

```text
vite v8.3.5 building client environment for production...
✓ 593 modules transformed.
dist/index.html                   0.43 kB │ gzip:   0.28 kB
dist/assets/index-ScIWBmMk.css    1.35 kB │ gzip:   0.54 kB
dist/assets/index-CHqdG1Y4.js   578.45 kB │ gzip: 171.99 kB

(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
...
✓ built in 472ms
```

One JavaScript file of 578 kB (172 kB zipped), and a warning that even suggests the fix. (Minification means the code was squeezed small: no spaces, short names. Your timings and hashes may differ a little.) With a static `import DashboardPage from './DashboardPage.tsx'` at the top of `App.tsx`, the bundler must put that file in the same bundle.

### 2. Measure first: the bundle report

`vite.config.ts` already has the plugin (installed with `npm install -D rollup-plugin-visualizer@7.1.1`):

```ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({ filename: 'stats.html', gzipSize: true }),
  ],
  ...
})
```

The same build also wrote `stats.html`. Open it in a browser: every rectangle is a file and its area is its size. Two blocks fill almost the whole map: `react-dom` (about 40 percent) and `recharts`, the chart library (also about 40 percent, with the small libraries it brings along). Asha's own files add up to under 1 percent. So the plan: the chart library is needed on the dashboard page only, so the dashboard page goes into its own chunk.

### 3. `lazy` and `Suspense` (stage v1-lazy)

A static `import` is decided before the program runs. A dynamic `import('./File.tsx')`, used like a function, loads nothing at the start; it starts loading when the line runs and gives back a promise of the file's exports. The bundler sees the line and puts that file, and everything only that file needs, into its own chunk. React wraps this in `lazy`, and waiting for a promise while drawing is `Suspense` (Module 14, lesson 5). Two small edits in `App.tsx`:

```tsx
import { lazy, Suspense, useState } from 'react'
import CoursesPage from './CoursesPage.tsx'

const DashboardPage = lazy(() => import('./DashboardPage.tsx'))

// ... where the page is drawn:
{page === 'courses' ? (
  <CoursesPage />
) : (
  <Suspense fallback={<p className="wait">Loading the dashboard…</p>}>
    <DashboardPage />
  </Suspense>
)}
```

```bash
node use.mjs v1-lazy
npm run build
```

Guess: how many JS files, and how big? Real output:

```text
✓ 594 modules transformed.
dist/index.html                          0.43 kB │ gzip:   0.28 kB
dist/assets/index-ScIWBmMk.css           1.35 kB │ gzip:   0.54 kB
dist/assets/index-BNjMEOlo.js          222.73 kB │ gzip:  69.87 kB
dist/assets/DashboardPage-C3lkuW-z.js  357.01 kB │ gzip: 103.29 kB
✓ built in 148ms
```

Two files. The main one is 222.7 kB (down from 578), the new one is named after the dashboard page (357 kB), and the warning is gone. Add them up: about 580 kB, the same as before. Nothing got smaller. But the first load went from 172 kB zipped to 70 kB, and the new `stats.html` shows `react-dom` in the first file and the dashboard with recharts in the second.

### 4. See it in the browser

Serve the production build and open it with the browser's Network tab:

```bash
npx vite preview
```

```text
  ➜  Local:   http://localhost:5153/
```

On the home page the requests are the page, the style file and one JS file (`index-BNjMEOlo.js`, 222.7 kB). The dashboard chunk is not on the list: nobody asked for it yet. Click the Dashboard button and, only now, the browser asks for `DashboardPage-C3lkuW-z.js`. On a fast laptop it arrives in a blink; to see the wait, throttle the network in the browser's developer tools (or delay that one file). During the wait `Suspense` shows `Loading the dashboard…`, then the chart appears.

Compare the old single file: from the click the chart appeared after about 85 ms in a real run here, because everything was already downloaded. That is the trade. The first visit is lighter. The first click on the dashboard pays for its own piece.

### 5. Prefetch on hover (stage v2-prefetch)

Can we have both? Yes: prefetching means downloading a chunk early. A good moment is when the mouse moves onto the Dashboard button, because a click usually follows. Move the dynamic import into its own function, give `lazy` that function, and call the same function on mouse enter:

```tsx
const loadDashboard = () => import('./DashboardPage.tsx')
const DashboardPage = lazy(loadDashboard)

<button onClick={() => setPage('dashboard')} onMouseEnter={loadDashboard}>
  Dashboard
</button>
```

Build it (`node use.mjs v2-prefetch && npm run build`), serve it and delay the chunk file by 1.5 seconds. The request starts the moment the mouse is over the button (the requests list shows `DashboardPage-DyhvrJsN.js` right after the hover). If you click later, the sign shows only briefly, not the whole wait. React keeps a sign it has started to show for a short moment before swapping it. Lesson 4, about transitions, shows how to avoid even that.

## Common mistakes

1. **`lazy` needs a default export** (stage `p-named`). The dashboard file exports its component by name (`export function DashboardPage`). TypeScript catches it at the build:

   ```bash
   node use.mjs p-named
   npx tsc -b
   ```

   ```text
   src/App.tsx(4,34): error TS2322: Type 'Promise<typeof import(".../src/DashboardNamed")>' is not assignable to type 'Promise<{ default: ComponentType<any>; }>'.
     Property 'default' is missing in type 'typeof import(".../src/DashboardNamed")' but required in type '{ default: ComponentType<any>; }'.
   ```

   If it slips past, say in development where Vite does not check types, clicking Dashboard makes the page go blank and the console says `Cannot convert object to primitive value`. The fix is one word: `export default`.
2. **`lazy` inside the component** (stage `p-inside`). `const DashboardPage = lazy(...)` moved into `App`, and a Sign in button added. It looks fine, but every time `App` draws again, `lazy` runs again and makes a brand new component. Real run (with the chunk delayed): open the dashboard, click Sign in, and the dashboard hides behind the sign `Loading the dashboard…` again, for a moment. Declare `lazy` once, at the top of the file, outside any component, like the cache in Module 14, lesson 5. Same click in stage `p-outside`: no flicker.
3. **A chunk can fail to download.** The visitor loses the network, or you release a new version and the old file name is gone. Then `lazy` throws, like the rejected promise in Module 14, lesson 5. Stage `v3-boundary` puts an error boundary (`react-error-boundary`) around the `Suspense`, with a small fallback component:

   ```tsx
   function Oops() {
     return (
       <div className="oops" role="alert">
         <p>The dashboard could not be loaded.</p>
         <button className="try" onClick={() => window.location.reload()}>Reload the page</button>
       </div>
     )
   }
   // <ErrorBoundary FallbackComponent={Oops}><Suspense ...><DashboardPage /></Suspense></ErrorBoundary>
   ```

   Block that chunk file in the browser's Network tab (right-click the request, Block request URL) and click Dashboard. With no boundary (stage `v1-lazy`) the page goes blank. With the boundary the visitor sees the message and the button. The console says:

   ```text
   TypeError: Failed to fetch dynamically imported module: http://localhost:5153/assets/DashboardPage-....js
   ```

## What to split, and what not to

Start with routes: each page is its own chunk, because a visitor sees one page at a time. Then heavy parts behind a click or a tab: a chart, a text editor, a map, a video player. Then screens that only a few people use, like an admin page. Do not split tiny files. Every chunk is one more request, and a chunk of a few kilobytes usually costs more in waiting than it saves. After every split, build again, read the sizes, and open the report.

## Clean up

Press Ctrl+C in the terminal. Run `node use.mjs v1-lazy` to put the finished stage back. Delete `dist`, `stats.html` and `node_modules` if you like (`stats.html` is not meant to be committed).

## Try it yourself

Add a third page, settings, with its own `lazy` import. Build, and read the output: the list of files grows by one.

Interview tip. "How do you reduce the bundle size of a React app?" Measure it first with a bundle analyser. Then split by route with `lazy` and `Suspense`, load heavy parts on demand, prefetch what the visitor will probably open next, and handle failed chunks with an error boundary.

## Next

[M15-L04 · Long Lists and Transitions](../m15-l04-long-lists-and-transitions/README.md)
