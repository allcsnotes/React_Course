# M14-L05 · Suspense and Error Boundaries

> Video: Module 14, Lesson 5. Watch it first, then follow along here.

Asha is building the course page of allcsvideos: a header, a list of lessons, and a list of reviews. She writes it the old way, with one effect and one loading flag for the whole page. The lessons arrive after 1.2 seconds, the reviews after 3, and for those 3 seconds the page shows one sentence, `Loading the page…`. Worse, one review has no author, and after 3 seconds the whole page goes blank, header included. One idea fixes both: for every part of the page, decide what it shows while it waits, and what it shows when it breaks.

## What you'll learn

- `Suspense` and its `fallback` (a sign on a shop door), and how the nearest one above wins
- Why a component paused by `use(promise)` needs the promise to live outside it (a small cache)
- Error boundaries (a fuse per shop): the class you write once, and `react-error-boundary` with a `Try again` button
- Where to place them: one `Suspense` around each part that can wait, one error boundary around each part that can break, and one at the very top
- What boundaries do not catch, and the honest limit of suspense when you switch tabs

## Before you start

- Node 24 (`node --version`; recorded with v24.16.0).
- You did [M14-L04](../m14-l04-whats-new-in-react-19/README.md) (the `use` function) and know effects (Module 7, lesson 5) and loading/error/success states (Module 9, lesson 3).
- Docker is not used.

## Files in this folder

| File | What it is |
|---|---|
| `package.json` | Pinned: React 19.3.1, react-error-boundary 6.1.6, Vite 8.3.5, TypeScript 7.0.2 |
| `src/App.tsx` | The finished page (stage v5-library): a `Suspense` and an `ErrorBoundary` per shop |
| `src/api.ts` | `getJson`, and `load(path)` / `forget(path)`: one promise per address, kept outside the components |
| `src/LessonList.tsx`, `src/Reviews.tsx`, `src/Header.tsx` | The parts of the page. `LessonList` and `Reviews` read their data with `use(load(...))` |
| `src/main.tsx`, `src/index.css` | Entry point and styles |
| `api/server.mjs` | Practice API on port 8145 (a local stand-in with real delays): course 600 ms, lessons 1200 ms, reviews 3000 ms. `GET /_mode?reviews=ok`, `broken`, `fail` or `failonce` switches how reviews answer |
| `use.mjs` | `node use.mjs <stage>` puts `versions/_shared` and the stage into `src/` (the job of the video's `use.sh`) |
| `versions/` | `_shared`, `v0-oldway`, `v1-suspense`, `v2-nested`, `v4-class`, `v5-library`, `v6-tabs`, and the mistakes `p-nobound`, `p-uncached`, `p-handler` |

## Follow along

### 1. Install and start

```bash
npm install
node api/server.mjs
```

```text
API on http://localhost:8145
```

In a second terminal:

```bash
npm run dev
```

```text
  VITE v8.3.5  ready in ... ms

  ➜  Local:   http://localhost:5245/
```

Switch stage with `node use.mjs v0-oldway` (Vite reloads), and make the reviews answer differently with `curl "localhost:8145/_mode?reviews=broken"`. Remember to reload the page after changing the mode.

### 2. The old way (stage v0-oldway)

```bash
node use.mjs v0-oldway
```

One effect fetches both lists and one flag guards the page:

```tsx
useEffect(() => {
  Promise.all([getJson<Lesson[]>(LESSONS), getJson<Review[]>(REVIEWS)]).then(([l, r]) => {
    setLessons(l)
    setReviews(r)
  })
}, [])

if (lessons === null || reviews === null) { /* <Header /> and "Loading the page…" */ }
```

Real run (times from the page load): at 0.7 s and at 2 s, `Loading the page…`. The lessons were ready long ago, and nobody can see them. At 3.6 s everything shows.

Now one review has no author:

```bash
curl "localhost:8145/_mode?reviews=broken"
```

Reload. After 3 seconds the whole page goes blank, the header too. The console says:

```text
Cannot read properties of undefined (reading 'name')
... An error occurred in the <App> component. Consider adding an error boundary to your tree ...
```

In React, if any component throws while it is being drawn, React throws away the whole tree. Put the mode back: `curl "localhost:8145/_mode?reviews=ok"`.

### 3. Suspense: a sign on every shop (stage v1-suspense)

A component can say "I am not ready". React pauses it, climbs up to the nearest `Suspense`, and draws that `Suspense`'s `fallback` instead. When the data arrives, React tries again. A component says it by calling `use(promise)` (lesson 4). The promise must live outside the component, so `src/api.ts` keeps a small cache:

```ts
const cache = new Map<string, Promise<unknown>>()

export function load<T>(path: string): Promise<T> {
  if (!cache.has(path)) cache.set(path, getJson<T>(path))
  return cache.get(path) as Promise<T>
}
```

```tsx
export function LessonList() {
  const lessons = use(load<Lesson[]>(LESSONS))
  return <ul>{lessons.map(l => <li key={l.id}>...</li>)}</ul>
}
```

Reading this component, you would think the data is always there. That is the point: no loading flag, no error flag, no effect. The page wraps each part:

```tsx
<Header />
<main>
  <section>
    <h2>Lessons</h2>
    <Suspense fallback={<p className="wait">Loading lessons…</p>}>
      <LessonList />
    </Suspense>
  </section>
  <section>
    <h2>Reviews</h2>
    <Suspense fallback={<p className="wait">Loading reviews…</p>}>
      <Reviews />
    </Suspense>
  </section>
</main>
```

Guess: what does the page show at half a second, at two seconds, and at three and a half? Real run:

```text
0.7 s: allcsvideos | Lessons | Loading lessons… | Reviews | Loading reviews…
2 s:   allcsvideos | Lessons | What React is, Components as bricks, Props, State | Reviews | Loading reviews…
3.6 s: allcsvideos | Lessons | (the four lessons) | Reviews | Lukas, Priya, Asha ...
```

Each shop opens when its own stock arrives. Same data, same server, same speed: the lessons now appear after about 1 second instead of 3. Only the place where we wait has changed.

### 4. Nested boundaries (stage v2-nested)

The nearest `Suspense` above wins. Say the course title also comes from the server (600 ms). `CoursePage` reads it with `use`, inside a third `Suspense` with the sign `Loading the course…`, and the two shops keep their own signs:

```text
0.3 s: allcsvideos | Loading the course…
0.9 s: allcsvideos | React for Beginners · by Meera | Lessons | Loading lessons… | Reviews | Loading reviews…
2.2 s: ... | Lessons | (the four lessons) | Reviews | Loading reviews…
3.9 s: ... | Reviews | Lukas, Priya, Asha
```

The page builds itself from the outside in. Notice the time: the lessons now arrive at about 1.8 seconds, not 1.2, because the inner components only start asking after the title has arrived. Waiting inside waiting is a chain, so ask for data as early as you can.

### 5. The fuse: error boundaries (stage v4-class)

With no boundary, a throw while drawing removes the whole tree. Try stage `v1-suspense` with `curl "localhost:8145/_mode?reviews=broken"`: the lessons appear after about a second, then at 3 seconds everything disappears. A blank page. The good half of the page was lost because of one bad review.

An error boundary catches the errors thrown below it and draws a fallback instead of the broken part. React has no hook for this: it is the one job that still needs a class. You write it once (`src/ErrorBoundary.tsx` in `versions/v4-class`):

```tsx
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const where = info.componentStack?.split('\n')[1]
    console.log('reported:', error.message, where)   // here you would call a monitoring service
  }

  render() {
    if (this.state.error) return this.props.fallback
    return this.props.children
  }
}
```

`getDerivedStateFromError` receives the thrown error, and what it returns becomes the new state. `componentDidCatch` is for reporting. Use it like a fuse, around the reviews only. The order matters: the error boundary is outside, `Suspense` inside, so a failure shows the error and a wait shows the sign:

```tsx
<ErrorBoundary fallback={down}>
  <Suspense fallback={<p className="wait">Loading reviews…</p>}>
    <Reviews />
  </Suspense>
</ErrorBoundary>
```

Real run with the same broken review: the lessons arrive; at 3 seconds the reviews shop shows `Reviews could not be shown.` The header and the lessons stay. The console prints React's explanation and our line:

```text
reported: Cannot read properties of undefined (reading 'name')   at Reviews (...)
```

### 6. A failed request, and `react-error-boundary` (stage v5-library)

A second way to break is a failed request. When the reviews service answers 500 the promise is rejected, and `use` throws that rejection while drawing, so the nearest error boundary catches it. Suspense for waiting, error boundary for failing. These are the loading, error and success states of Module 9, but the place in the tree says it, so there is no `if` in every component.

Most projects install a tiny package instead of the class (`react-error-boundary@6.1.6`, already in `package.json`). Its fallback is a component that receives the error and a reset function:

```tsx
function ReviewsError({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="oops">
      <p>Reviews could not be shown: {getErrorMessage(error)}</p>
      <button className="try" onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

<ErrorBoundary FallbackComponent={ReviewsError} onReset={() => forget(REVIEWS)}>
  <Suspense fallback={<p className="wait">Loading reviews…</p>}>
    <Reviews />
  </Suspense>
</ErrorBoundary>
```

`onReset` forgets the cached promise, because a rejected promise stays rejected. Make the server fail the first time and reload:

```bash
node use.mjs v5-library
curl "localhost:8145/_mode?reviews=failonce"
```

After 3 seconds the reviews shop says:

```text
Reviews could not be shown: Request failed: 500
```

Click Try again: the sign `Loading reviews…` comes back, and 3 seconds later the reviews are there. The header and the lessons never moved. (This is the same idea as the router's `errorElement` in Module 8, lesson 3: an error boundary per route.)

Where to place them? Ask of each part of the page two questions. Can it wait on its own? Give it a `Suspense`. Can it break on its own? Give it an error boundary. And keep one boundary at the very top, as the last fuse, so a surprise never gives a blank page.

### 7. Build

```bash
npm run build
```

```text
✓ built in 259ms
```

## Common mistakes

1. **No `Suspense` at all** (stage `p-nobound`). Both wrappers removed. No error, no warning. For three seconds the screen is blank, and even the header is missing. With no sign anywhere above, React has nowhere to show a fallback, so it shows nothing until everything is ready.
2. **A promise made inside the component** (stage `p-uncached`): `use(getJson(LESSONS))` directly in `LessonList`. It looks fine. Real run: the reviews appear, but the lessons stay on `Loading lessons…` forever, and a new lessons request goes out every 1.2 seconds (7 requests in 4.5 seconds). Each time React tries again, the component makes a new promise, and the one that arrived is never the one it asks for. That is why the cache keeps the promise outside.
3. **Expecting a boundary to catch an event handler** (stage `p-handler`). A Report button on each review throws in its click handler. Click it: nothing happens on the page, the fallback does not appear, and the console shows `Uncaught Error: Report failed`. Error boundaries catch only errors thrown while drawing. Errors in click handlers, timers and fetch callbacks are not drawing. Catch those yourself with `try` and `catch`, and keep the result in state.

## An honest limit: tabs (stage v6-tabs)

Two tabs, React and Python. Click Python: the lessons that were on screen are replaced by the sign again (`Loading lessons…`), and then the Python lessons arrive. For content already on screen, a sign feels like a flicker. React can keep the old content on screen while the new one loads. That is called a transition and it is Module 15, lesson 4. First, in lesson 1 of that module, we learn to measure.

## Clean up

Press Ctrl+C in both terminals. Reset the reviews mode (`curl "localhost:8145/_mode?reviews=ok"`, or just stop the server) and run `node use.mjs v5-library` to put the finished page back. Delete `node_modules` and `dist` if you like.

## Try it yourself

Add a third shop, a list of similar courses, with its own `Suspense` and its own error boundary. Make it fail (add a route to `api/server.mjs` that answers 500, or point the call at a wrong address), and check that the other two shops stay on screen.

Interview tip. "What does an error boundary not catch?" Errors in event handlers, errors in asynchronous code like timers and `fetch` callbacks, and errors in the boundary itself. It catches only errors thrown while drawing the tree below it.

## Next

[M15-L01 · Measuring Performance](../../m15-performance/m15-l01-measuring-performance/README.md)
