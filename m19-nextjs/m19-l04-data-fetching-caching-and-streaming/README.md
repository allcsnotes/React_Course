# M19-L04 · Data Fetching, Caching and Streaming

> Video: Module 19, Lesson 4. Watch it first, then follow along here.

## What you'll learn

- Fetching data inside an async server component, and proving the browser never calls the API
- Why a plain `fetch` is not remembered, and what `cacheComponents: true` means
- The three ways out of the "uncached data" error: **cache**, **stream**, **block**
- `"use cache"` with `cacheLife` and `cacheTag`, and `revalidateTag`
- Streaming the slow part with `<Suspense>`, and what `loading.tsx` does
- Static, dynamic and partial prerender in the build table
- Three mistakes: old `revalidate`, `cookies()` inside `"use cache"`, awaiting in a line instead of `Promise.all`

## Before you start

- Node 24 (`node --version`). No Docker.
- Versions (from `package-lock.json`): Next.js 16.4.3 (Turbopack), React 19.3.0. Lesson 1 (the "bad" page error), Lesson 2 (`params` is a promise) and Lesson 3 (server components) help.
- The practice API is `api/server.mjs`, a local Node stand-in on port 8194: `GET /api/courses` (300 ms), `GET /api/offer` (300 ms, with a serial number that counts every call), `GET /api/courses/:slug/reviews` (2 s), plus `GET /api/_hits` and `POST /api/_reset` (a call counter for this lesson). It is not a real server. The site uses port 5194.

## Files in this folder

| File | What it is |
|------|------------|
| `lib/api.ts` | `getCourses()` (with `"use cache"` and `cacheLife('minutes')`), `getReviews(slug)` (no cache), `slow(part)` |
| `app/page.tsx` | The home page: awaits `getCourses()` and lists the courses (the finished version) |
| `app/courses/[slug]/page.tsx` | The course page: title and author at once, reviews inside `<Suspense>` |
| `app/blocked/[slug]/page.tsx` | The same page without Suspense and with `instant = false` (blocks) |
| `app/loading-demo/` | A page with only a `loading.tsx` |
| `app/offer/page.tsx` | A cached offer that lives 5 seconds (`cacheLife({ revalidate: 5 })`) |
| `app/deal/page.tsx`, `app/api/revalidate/route.ts` | A cached offer with `cacheTag('offer')` and the route that calls `revalidateTag` |
| `app/sequential/page.tsx`, `app/parallel/page.tsx` | Two awaits in a line, and `Promise.all` |
| `variants/` | `page.v1.tsx` (the plain `fetch` home page), `t3-revalidate.tsx` and `m_cookies.tsx` (the old-tutorial mistakes), and the final files |
| `tools/stream.mjs`, `tools/ttl.mjs` | Small timing scripts used in the steps below |
| `api/server.mjs` | The practice API |

## Follow along

```bash
npm install
node api/server.mjs        # in a second terminal (port 8194)
```

### 1. Asha's page, and a red message

Asha knows from Lesson 3 that a server component may be async, so she fetches the four courses in the page itself. `variants/page.v1.tsx`:

```tsx
import Link from 'next/link'

type Course = { slug: string; title: string; teacher: string }

export default async function Home() {
  const res = await fetch('http://localhost:8194/api/courses')
  const courses: Course[] = await res.json()
  return (
    <main>
      <h1>allcsvideos</h1>
      <ul>
        {courses.map((c) => (
```

Use it, run the dev server and open the page:

```bash
cp variants/page.v1.tsx app/page.tsx
npm run dev -- -p 5194
```

Four courses, answered in about 337 ms (319 ms in my run). But the dev terminal shows a red message:

```text
 GET / 200 in 319ms (next.js: 0.4ms, application-code: 319ms)
Error: Route "/": Next.js encountered uncached data during prerendering.
`fetch(...)` or `connection()` accessed outside of `<Suspense>` prevents the route from being prerendered, blocking the page load and leading to a slower user experience.
Ways to fix this:
  - [stream] Provide a placeholder with `<Suspense fallback={...}>` around the data access
  - [cache] Cache the data access with `"use cache"` (does not apply to `connection()`)
  - [block] Set `export const instant = false` to allow a blocking route
Learn more: https://nextjs.org/docs/messages/blocking-prerender-dynamic
    at Home (app/page.tsx:6:21)
  4 |
  5 | export default async function Home() {
> 6 |   const res = await fetch('http://localhost:8194/api/courses')
    |                     ^
  7 |   const courses: Course[] = await res.json()
```

The page is on the screen, and still something is wrong. Guess: what does `npm run build` do?

```bash
npm run build
```

```text
Error: Route "/": Next.js encountered uncached or runtime data during prerendering.
`fetch(...)`, `cookies()`, `headers()`, `params`, `searchParams`, or `connection()` accessed outside of `<Suspense>` prevents the route from being prerendered, blocking the page load and leading to a slower user experience.
Ways to fix this:
  - [stream] Provide a placeholder with `<Suspense fallback={...}>` around the data access
  - [cache] For uncached data (`fetch`, database calls): cache the access with `"use cache"` (does not apply to `connection()`)
  - [block] Set `export const instant = false` to allow a blocking route
Learn more: https://nextjs.org/docs/messages/blocking-prerender-dynamic
    at body (<anonymous>)
    at html (<anonymous>)
```

The build fails with the same message and lists three ways out: stream, cache, or block. You met it as a trap in Lesson 1. Today we learn what the three mean.

### 2. What Asha did right, and the price

The fetch runs on the server. The browser never calls the API (open the Network tab: requests to this site, none to port 8194), and the four titles are already in the HTML, so a command that only downloads the page finds them without running any JavaScript. In Module 7 you fetched in the browser and the first page was empty; here nobody sees an empty list.

Now the price: if the server asks the API at every visit, a thousand visitors make a thousand calls. In the dev server, three visits made **three** calls (`{"courses":3}`). In this version a plain `fetch` is not saved, not even for a second.

Where does the red message come from? `next.config.ts`, written by `create-next-app`, says `cacheComponents: true`. It means: every page is prepared ahead of time, and any data that must be fresh has to say what happens while it is fetched. Next.js will not guess for you.

A restaurant picture: guests keep coming and every guest wants the soup of the day. The cook has three choices. **Cache**: cook a big pot in the morning and serve everybody from it (fast, but the soup may be a few hours old). **Stream**: put the bread and the water on the table at once and bring the soup when it is ready. **Block**: nobody gets anything until the whole meal is ready. We try all three, starting with the cache.

### 3. Choice one: cache

Move the fetch into its own function and make `"use cache"` its first line (a directive, like `"use client"`). `cacheLife` says how long a copy stays fresh (a time to live, System Design Module 5). The ready-made profiles are `seconds` (1 s), `minutes` (60 s), `hours`, `days`, `weeks` and `max`; the default is 15 minutes.

```ts
import { cacheLife } from 'next/cache'

export type Course = { slug: string; title: string; teacher: string; price: number }
export type Review = { who: string; stars: number; text: string }

const API = 'http://localhost:8194/api'

export async function getCourses(): Promise<Course[]> {
  'use cache'
  cacheLife('minutes')
  const res = await fetch(`${API}/courses`)
  return res.json()
}
```

The home page shrinks back to almost what Asha wrote (`app/page.tsx`: await `getCourses()` and draw the list):

```bash
cp variants/page.final.tsx app/page.tsx
npm run build
```

It passes, and in the route table `/` has a circle: static, with `Revalidate 1m` and `Expire 1h`:

```text
Route (app)                         Revalidate  Expire
┌ ○ /                                       1m      1h
├ ○ /_not-found
├ ƒ /api/revalidate
├   /blocked/[slug]
│ └ ◐ /blocked/[slug]
├   /courses/[slug]
│ ├ ◐ /courses/[slug]
│ ├ ◐ /courses/react-for-beginners          1m      1h
│ ├ ◐ /courses/python-from-zero             1m      1h
│ └ ◐ [+2 more paths]
├ ○ /deal                                   1h      1d
├ ◐ /loading-demo
├ ○ /offer                                  5s      1y
├ ƒ /parallel
└ ƒ /sequential
○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
ƒ  (Dynamic)            server-rendered on demand
```

During the build the API was called twice for the courses (`API calls during the build: {"courses":2,"offer":1}`). Start the site and visit the page five times:

```bash
npm start -- -p 5194
for i in 1 2 3 4 5; do curl -s -o /dev/null -w "visit $i: %{http_code} in %{time_total}s\n" localhost:5194/; done
curl -s localhost:8194/api/_hits
```

```text
visit 1: 200 in 0.021782s
visit 2: 200 in 0.002660s
visit 3: 200 in 0.001421s
visit 4: 200 in 0.002269s
visit 5: 200 in 0.002902s
{"courses":2,"offer":1}
```

(Yours will differ.) The API counter did not move: five visitors, zero new trips.

**A copy must not live forever.** `/offer` has `cacheLife({ revalidate: 5 })`, and the API counts every call and sends the count as the offer number. Visit it once a second for 14 seconds. How many API calls? 14? 1? Something in between?

```bash
node tools/ttl.mjs /offer 14 1000
```

```text
+ 0.0 s   page: offer 1   API calls: 1
+ 1.0 s   page: offer 1   API calls: 1
+ 2.1 s   page: offer 1   API calls: 1
+ 3.1 s   page: offer 1   API calls: 1
+ 4.1 s   page: offer 1   API calls: 1
+ 5.1 s   page: offer 1   API calls: 1
+ 6.1 s   page: offer 2   API calls: 2
+ 7.1 s   page: offer 2   API calls: 2
+ 8.1 s   page: offer 2   API calls: 2
+ 9.1 s   page: offer 2   API calls: 2
+10.1 s   page: offer 2   API calls: 2
+11.1 s   page: offer 2   API calls: 2
+12.1 s   page: offer 3   API calls: 3
+13.1 s   page: offer 3   API calls: 3
```

Offer 1 for the first five seconds, then offer 2, then offer 3: **fourteen visits, three calls**. When a copy gets too old, the next visit gets the old copy at once and starts a refresh in the background; the visits after that get the new copy. In Module 11 you gave TanStack Query a `staleTime`: this is the same idea, on the server.

You can also throw a copy away on purpose. `/deal` has a one-hour copy with `cacheTag('offer')`, and `app/api/revalidate/route.ts` calls `revalidateTag('offer', 'max')`:

```bash
node tools/ttl.mjs /deal 1 100; curl -s -X POST localhost:5194/api/revalidate; echo; node tools/ttl.mjs /deal 3 1000
```

```text
+ 0.0 s   page: offer 1   API calls: 3
{"revalidated":true}
+ 0.0 s   page: offer 1   API calls: 4
+ 1.0 s   page: offer 4   API calls: 4
+ 2.0 s   page: offer 4   API calls: 4
```

The first visit after the call still shows the old copy and starts the new one; the next visit shows it. In Lesson 5 a form will make this call for you.

### 4. Choice two: stream

The course page has a header that is known, and reviews that are slow (the API needs 2 seconds). The courses come from the cache; the reviews must be fresh, so they are not cached. Wrap only the slow part in `<Suspense>` with a fallback sentence:

```tsx
export default async function CoursePage({ params }: PageProps<'/courses/[slug]'>) {
  const { slug } = await params
  const course = (await getCourses()).find((c) => c.slug === slug)
  if (!course) notFound()
  return (
    <main>
      <h1>{course.title}</h1>
      <p>by {course.teacher}</p>
      <h2>Reviews</h2>
      <Suspense fallback={<p>Loading reviews…</p>}>
        <Reviews slug={slug} />
      </Suspense>
    </main>
  )
```

`tools/stream.mjs` notes when each piece of the HTML arrives (with the site running):

```bash
node tools/stream.mjs http://localhost:5194/courses/react-for-beginners full
```

```text
chunk 1 at    84 ms,   1704 bytes
chunk 2 at   103 ms,   5926 bytes
chunk 3 at  2123 ms,    290 bytes
chunk 4 at  2124 ms,     73 bytes
chunk 5 at  2124 ms,   1040 bytes
chunk 6 at  2131 ms,   5313 bytes
chunk 7 at  2131 ms,     14 bytes
{"url":"/courses/react-for-beginners","status":200,"chunks":7,"firstMs":84,"lastMs":2131,"hasFallback":true,"hasReviews":true}
```

The first piece arrives after about 84 ms (28 ms in the video; yours depends on your machine) with the title, the author and "Loading reviews…". The rest arrives at about 2.1 seconds, on the same connection, when the reviews are ready. In the browser, after half a second the visitor already reads the title and the author; after three seconds the two reviews take the place of the sentence. Nothing in our code moves them; the server simply keeps sending.

### 5. Choice three: block

Same page, no Suspense, and one line, `export const instant = false`, to allow a blocking page (`app/blocked/[slug]/page.tsx`):

```text
chunk 1 at  2402 ms,   1708 bytes
chunk 2 at  2403 ms,   6038 bytes
chunk 3 at  2403 ms,   4989 bytes
chunk 4 at  2405 ms,     14 bytes
{"url":"/blocked/react-for-beginners","status":200,"chunks":4,"firstMs":2402,"lastMs":2405,"hasFallback":false,"hasReviews":true}
```

Now the first piece arrives after about 2.4 seconds. For almost two and a half seconds the visitor sees a white page. In Lesson 2 you saw `loading.tsx`: it puts a Suspense around the whole page. A page with only that file (`/loading-demo`) starts arriving after 90 ms and its content comes at 2,069 ms. Use Suspense when only a part is slow.

### 6. Static and dynamic

A static page is made once, at build time, and the same file goes to everyone. A dynamic page is made again at every visit. The build prints which is which:

```text
Route (app)                         Revalidate  Expire
┌ ○ /                                       1m      1h
├ ○ /_not-found
├ ƒ /api/revalidate
├   /blocked/[slug]
│ └ ◐ /blocked/[slug]
├   /courses/[slug]
│ ├ ◐ /courses/[slug]
│ ├ ◐ /courses/react-for-beginners          1m      1h
│ ├ ◐ /courses/python-from-zero             1m      1h
│ └ ◐ [+2 more paths]
├ ○ /deal                                   1h      1d
├ ◐ /loading-demo
├ ○ /offer                                  5s      1y
├ ƒ /parallel
└ ƒ /sequential
○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
ƒ  (Dynamic)            server-rendered on demand
```

The circle (`○`) is static: the home page, `/offer` and `/deal`. The half circle (`◐`) is partial prerender: the header is made at build time and the slow parts stream in at every visit. Our course pages are like that. The `ƒ` is dynamic: made at every visit, like the two pages we use for the timing test. The course page has `generateStaticParams` which lists the slugs at build time, and Next.js builds one header for each; the list shows two and says "plus 2 more paths".

## Common mistakes

1. **`export const revalidate = 5` at the top of a page** (older tutorials; `variants/t3-revalidate.tsx`). The build refuses:

```text
Error: Route segment config "revalidate" is not compatible with `nextConfig.cacheComponents`. Please remove it.
```

   The new way is `cacheLife` inside `"use cache"`.
2. **Reading `cookies()` inside a cached function** (`variants/m_cookies.tsx`). Cookies belong to one visitor, and a cache is shared by all visitors; without this rule Lukas could see the name of Priya. The build stops:

```text
Error: Route "/ck": `cookies()` can't be read inside `"use cache"`. Read it outside the cached function and pass what you need as an argument.
```

3. **A line of waiting.** `app/sequential/page.tsx` awaits two 500 ms calls one after the other; `app/parallel/page.tsx` starts both together with `Promise.all`:

```tsx
import { slow } from '@/lib/api'

export const instant = false

export default async function Page() {
  const [a, b] = await Promise.all([slow('menu'), slow('footer')])
  return <p>{a.length + b.length} courses</p>
}
```

```bash
node tools/stream.mjs http://localhost:5194/sequential full
node tools/stream.mjs http://localhost:5194/parallel full
```

   Real result: sequential, the page arrived after **1,073 ms**; parallel, after **553 ms** (the video measured 1,120 and 553). The API did the same work; only the waiting changed. One more fact: identical fetches inside one render are shared, so two awaits of the same address make only one call; that is why these two calls use different addresses.

(To try mistakes 1 and 2, copy the variant into a new folder such as `app/m3/page.tsx` and run `npm run build`; delete the folder afterwards.)

## Clean up

Stop the API and the site. `curl -s -X POST localhost:8194/api/_reset` resets the call counter. Make sure `app/page.tsx` is the finished one (`cp variants/page.final.tsx app/page.tsx`). Delete `.next/` and `node_modules/`.

## Key points

- An async server component fetches on the server; the browser never calls the API. A plain `fetch` is not saved, and with `cacheComponents` you choose: cache, stream, or block.
- `"use cache"` with `cacheLife` keeps a copy. An old copy is served once while a new one is made, and a tag throws a copy away on purpose. Never read cookies inside it.
- `<Suspense>` streams the slow part: the first piece came after tens of milliseconds, not two seconds. And start calls together, never in a line.

Interview tip. If Rahul, the interviewer, asks "what is the difference between static and dynamic rendering in Next.js?": static is made once at build time and shared, dynamic is made at every visit, and the middle way is a static shell with dynamic parts streamed in.

## Try it yourself

Add a second cached function, for the offer, with a `cacheLife` of 10 seconds, and watch the practice API counter (`curl -s localhost:8194/api/_hits`).

## Next

[M19-L05 · Server Actions](../m19-l05-server-actions/README.md)
