# M19-L01 · Why a Framework

> Video: Module 19, Lesson 1. Watch it first, then follow along here.

## What you'll learn

- What a single-page app really sends to the browser (an empty `div`) and the three trips it needs before the first course appears
- Client-side rendering, server-side rendering and static generation, and how a framework lets you choose per page
- The same catalog built as a Vite single-page app and as a Next.js app, and how to compare them
- How to measure with a slow-phone profile, and why you must always measure a production build
- What hydration is, and why Next.js can send more JavaScript and still show the first course sooner
- Two beginner traps: uncached data with no waiting place, and `useState` in a server component

## Before you start

- Node 24 (`node --version`) and Google Chrome (for the measuring script). No Docker.
- This folder holds two small, separate projects and a helper: `spa/` (Vite + React 19.3.1 + React Router 8.5.1) and `next-app/` (Next.js 16.4.3 with React 19.3.0). Both call the practice API in `api/` (a local stand-in on port 8191 with demo courses, not a real server; it answers after 300 ms).
- To see the framework in a fresh project you would run `npx create-next-app@latest`; `next-app/` is the result, trimmed to what the video uses.

## Files in this folder

| File | What it is |
|------|------------|
| `api/server.mjs` | The practice API: `GET /api/courses` (12 courses, 300 ms delay), port 8191 |
| `spa/` | The single-page app: `src/Catalog.tsx` fetches in `useEffect`, `src/Course.tsx`, router in `main.tsx` |
| `next-app/` | The Next.js app: `app/page.tsx` (catalog), `app/live/page.tsx`, `app/courses/[slug]/page.tsx`, `lib.ts`, `next.config.ts` |
| `tools/measure.mjs` | The measuring script (Playwright with your Chrome) |
| `variants/bad.page.tsx`, `variants/oops.page.tsx` | The two mistake pages of step 8 |

## Follow along

```bash
cd spa && npm install && cd ..
cd next-app && npm install && cd ..
cd tools && npm install && cd ..
node api/server.mjs          # leave it running in its own terminal (port 8191)
```

### 1. The problem: almost a second of nothing

Asha opens the catalog on a phone, on a mobile connection. The video recorded it with a real browser slowed on purpose: about 4 megabits per second, a delay of 100 ms and a processor four times slower. At 0.2 s: white. At 0.4 s: a grey page. At 0.6 s: the header and the title, but no courses. Only at 844 ms: the first course. Almost a second of nothing, for a page whose content is twelve course names.

### 2. What did the browser receive?

Build the single-page app and look at the first HTML (what "view source" shows):

```bash
cd spa
npm run build
npx vite preview --port 5191 &      # or in another terminal
curl -s http://localhost:5191/
```

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>allcsvideos</title>
    <script type="module" crossorigin src="/assets/index-BQcBJM_g.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-DKSvJSEv.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

One empty `div` with the id `root` is the whole page (Module 8, Lesson 1). React fills it after the script runs. Build output:

```text
dist/index.html                   0.39 kB │ gzip:  0.26 kB
dist/assets/index-DKSvJSEv.css    0.79 kB │ gzip:  0.43 kB
dist/assets/index-BQcBJM_g.js   315.21 kB │ gzip: 99.34 kB

✓ built in 369ms
```

The steps (measured in the video): the browser asks for the page (112 ms), then fetches the script (309 ms more); only then does React run, and `useEffect` asks the API for the courses (a third trip, another 309 ms); at 844 ms the first course is drawn. Three trips, one after another. The courses were always on the server, but the browser had to ask for them itself. A second problem is for readers that are not people: a search engine or a chat app link preview often reads only the first HTML, which here is an empty `div`.

### 3. Three ways to serve a dish

- A meal kit: **client-side rendering**. The browser does the cooking; a slow kitchen means waiting.
- A normal restaurant: **server-side rendering**. The server turns components and data into HTML for every visit.
- Dishes cooked in the morning and put on a shelf: **static generation**. The HTML is made once at build time and is then just a file, which can be copied to servers around the world, like the CDN of system design.

React is a library: it draws components and nothing more (no router, no way to build HTML on the server). A **framework** brings those pieces together and lets you choose per page. The framework of this course is Next.js, built on React.

### 4. The same catalog in Next.js

```bash
cd next-app
npm ls next react react-dom
```

```text
next-app@0.1.0 /path/to/your-project/next-app
+-- next@16.4.3
| +-- react-dom@19.3.0 deduped
| +-- react@19.3.0 deduped
| `-- styled-jsx@5.1.6
|   `-- react@19.3.0 deduped
+-- react-dom@19.3.0
| `-- react@19.3.0 deduped
`-- react@19.3.0
```

`app/page.tsx` is one async function; the list below it is the same JSX as before:

```tsx
import Link from "next/link";
import { getCourses } from "@/lib";

export default async function Catalog() {
  const courses = await getCourses();

```

In the single-page app the component starts with `useState([])`, then `useEffect` fetches and sets the courses: three steps and one empty first picture. In Next.js `const courses = await getCourses()` runs on the server, so it can wait for the data before it returns the HTML. No state, no effect, no empty first picture.

Two small settings decide when a page is built. `lib.ts` has `"use cache"` at the top of `getCourses` (keep the answer, so the page can be made once at build time: the shelf), and `/live` uses `getCoursesNow` (no cache) and says `export const instant = false` (build this page for every visit: the kitchen). `next.config.ts` turns on `cacheComponents`. Lesson 4 explains both properly.

```ts
export async function getCourses(): Promise<CourseData[]> {
  "use cache";
  const res = await fetch("http://localhost:8191/api/courses");
  return res.json();
}

export async function getCoursesNow(): Promise<CourseData[]> {
  const res = await fetch("http://localhost:8191/api/courses");
  return res.json();
}
```

```bash
npm run build
```

```text
Route (app)                         Revalidate  Expire
┌ ○ /                                      15m      1y
├ ○ /_not-found
├   /courses/[slug]
│ ├ ◐ /courses/[slug]
│ ├ ○ /courses/react-for-beginners         15m      1y
│ ├ ○ /courses/python-from-zero            15m      1y
│ └ ◐ [+10 more paths]
└ ƒ /live


○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

`/` is `○` (static, prerendered at build time) and `/live` is `ƒ` (dynamic, server-rendered on demand). One project, both ways, chosen by the page. View source of the Next page (it starts the server first: `npx next start -p 5191`):

```bash
curl -s http://localhost:5191/ | grep -o 'React for Beginners' | head -1
```

```text
React for Beginners
```

The header, the title and the first course are already inside the first HTML, with no empty `div`. The page arrives finished.

### 5. Measure it

The video loaded each version ten times, threw away the first load, and kept the middle value. `tools/measure.mjs` does the same with a CDP profile: `phone` = 4 Mbit/s, 100 ms delay, CPU 4x slower; `fast` = nothing throttled. Run it against each version (single-page app preview, then `next start`; I used 5 runs per row, the video used 10):

```bash
cd tools
node measure.mjs spa-csr http://localhost:5191/ 5 phone      # with the SPA preview running
node measure.mjs next-ssg http://localhost:5191/ 5 phone      # with: cd ../next-app && npx next start -p 5191
node measure.mjs next-ssr http://localhost:5191/live 5 phone
```

Guess before you look: which page shows its first course soonest, and which sends the most JavaScript? Real result from my run (yours will differ a little; the video's numbers were 844 / 352 / 256 ms for the LCP on the phone profile):

```text
Version                        phone: first course | LCP | JS bytes (wire) | JS files   fast: first course
Single-page app (Vite)           829 ms |   840 ms |   98678 |  1   345 ms (LCP 352)
Next, server rendered (/live)    337 ms |   352 ms |  141051 |  6   315 ms (LCP 332)
Next, static (/)                 153 ms |   256 ms |  141051 |  6   14 ms (LCP 36)
Next, development mode           397 ms |   492 ms |  797156 | 15   -
```

- LCP (largest contentful paint, Module 15) on the phone profile: single-page app 840 ms, server rendering 352 ms, static 256 ms. The static page is more than three times faster.
- JavaScript, compressed as it travels: the single-page app sends 98,678 bytes in one file; Next.js sends 141,051 bytes in six files. Next sends **more** JavaScript, yet its first picture comes sooner, because the courses are already inside the HTML: the page does not wait for the script or for a second trip to the API.
- Then what is the JavaScript for? The browser draws the finished page first. After that the script wakes it up (attaches click handlers and the router to HTML that is already on screen). That step is called **hydration**, like watering a dry plant. A framework page has two moments: the first picture, and then the page that reacts.
- Without the slow phone the gaps shrink, and server rendering is only a little faster than the single-page app, because the practice API itself needs 300 ms either way. The big wins are the static page, where nobody waits for the API at all, and slow connections.

The response headers show the difference too (`curl -D - -o /dev/null`): `/` has `x-nextjs-cache: HIT` and `Cache-Control: s-maxage=900, stale-while-revalidate=31535100`; `/live` has `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`.

### 6. The folder is the route

In Module 8 Asha installed React Router and wrote a list of routes in `main.tsx`. In Next.js a file called `page.tsx` inside `app` is the home page, and `app/courses/[slug]/page.tsx` is the page of every course. There is no list to keep in sync (Lesson 2 shows this fully). So a framework is routing, rendering and data fetching in one place, with one set of rules; the build, server, caching, images and fonts come with it. You still write the same React components.

### 7. Is the single-page app then wrong?

No. A dashboard behind a login, where no search engine looks and no first picture needs to rush, is fine as a single-page app, and simpler to host. A public site where the first picture and search matter, like this course catalog, wants a framework.

## Common mistakes

### 1. Data with no waiting place

Copy `variants/bad.page.tsx` to `next-app/app/bad/page.tsx` (it is the `/live` page without `instant = false`) and run `npm run build`. The build stops:

```text
Error: Route "/bad": Next.js encountered uncached or runtime data during prerendering.

`fetch(...)`, `cookies()`, `headers()`, `params`, `searchParams`, or `connection()` accessed outside of `<Suspense>` prevents the route from being prerendered, blocking the page load and leading to a slower user experience.

Ways to fix this:
  - [stream] Provide a placeholder with `<Suspense fallback={...}>` around the data access
  - [cache] For uncached data (`fetch`, database calls): cache the access with `"use cache"` (does not apply to `connection()`)
  - [block] Set `export const instant = false` to allow a blocking route

Learn more: https://nextjs.org/docs/messages/blocking-prerender-dynamic
    at main (<anonymous>)
```

Next lists three ways out: **stream** (a `<Suspense>` placeholder, Module 14, Lesson 5), **cache** (`"use cache"`), or **block** (`instant = false`). Lesson 4 goes through all three. Delete `app/bad` afterwards.

### 2. `useState` in a page that runs on the server

Copy `variants/oops.page.tsx` to `next-app/app/oops/page.tsx` and run `npm run build`:

```text
  Creating an optimized production build ...

> Build error occurred
Error: Turbopack build failed with 1 error:
./app/oops/page.tsx:1:10
Error: You're importing a module that depends on `useState` into a React Server Component module. This API is only available in Client Components. To fix, mark the file (or its parent) with the `"use client"` directive.
    Learn more: https://nextjs.org/docs/app/api-reference/directives/use-client
> 1 | import { useState } from "react";
    |          ^^^^^^^^
  2 |
  3 | export default function Oops() {
  4 |   const [likes, setLikes] = useState(0);

```

Next even gives the fix: mark the file with the directive `"use client"`. What that means is Lesson 3. Delete `app/oops` afterwards.

### 3. Measuring in development mode

The same catalog page under `next dev` took 516 ms in the video and shipped 797 kilobytes of JavaScript, nearly six times the real one. In my run, `node measure.mjs next-dev http://localhost:5191/ 3 phone` against `npx next dev -p 5191` gave an LCP of 492 ms and 797,156 bytes in 15 script files. Development mode adds helpers for you on purpose (Module 15, Lesson 1). Always measure a production build: build it, then start it.

## Clean up

Stop the API, the preview and `next start` (Ctrl+C or `kill`). Delete `spa/dist`, `next-app/.next`, `tools/out` and the three `node_modules/` folders when you are done.

## Key points

- A single-page app sends an empty page and builds it in the browser: the page, the script, the data, then the picture.
- The HTML can be built in the browser, on the server for every visit, or once at build time, and a framework lets you choose for each page. Next.js can send more JavaScript and still show the first picture sooner, because the courses are already in the HTML.
- A framework puts routing, rendering and data in one place: folders are routes and async components fetch data.

Interview tip. If Rahul, the interviewer, asks "why Next.js instead of plain React?": not for less JavaScript, because it does not give that. For the first picture and for search engines, because the HTML arrives with the content, and for routing, rendering and data in one structure. And I would measure both.

## Try it yourself

Make a Next.js project with `npx create-next-app@latest`, copy the catalog page into it, and compare "view source" of your single-page app and of your Next.js page.

## Next

[M19-L02 · The App Router](../m19-l02-the-app-router/README.md)
