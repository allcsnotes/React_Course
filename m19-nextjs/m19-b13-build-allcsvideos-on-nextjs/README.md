# M19-B13 · Build allcsvideos on Next.js

> Video: Module 19, Build 13. Watch it first, then follow along here.

Today we build the public website of allcsvideos on Next.js: a catalog with a filter, a page for every course, and a site that search engines can read. The finished project is in this folder (it is the `site` of the video).

## What you'll learn

- Why a single-page app is a poor fit for a public course site, and what the Next.js answer is
- Setting up with `create-next-app`, a layout, and one file that talks to the API (with `"use cache"` for courses, no cache for reviews)
- A server-rendered catalog with one small client component (the filter), and a course page with `generateStaticParams`
- Streaming the slow reviews with `<Suspense>` and the build error you get without it
- SEO as data in the page: `metadata`, `generateMetadata`, canonical and Open Graph tags, JSON-LD, `sitemap.ts`, `robots.ts`, `next/image` with `alt` text
- Measuring with Lighthouse on a production build, and why a score is not the goal

## Before you start

- Node 24 (`node --version`) and Google Chrome (for Lighthouse). No Docker.
- Earlier: Lessons 1 to 6 of this module. Versions (from `package-lock.json`): Next.js 16.4.3 (Turbopack), React 19.3.0, TypeScript 5.9.3; Lighthouse 13.x in `lighthouse/`.
- The practice API is `api/server.mjs`, a local Node stand-in on port 8190 (8 demo courses; reviews answer after 1.2 s). It is not a real server. The site runs on port 5803. Copy the demo settings once: `cp .env.example .env.local` (the defaults already match).
- **Fonts:** `src/app/layout.tsx` uses `next/font/google` (Geist), which downloads the font from Google at build time. That needs internet access. For this write-up I built the site with the font lines removed, so the numbers below come from that build (the video's build had the font). Your numbers will differ a little.

## Files in this folder

| File | What it is |
|------|------------|
| `src/lib/api.ts` | The only file that talks to the API: `getCourses` and `getCourse` (`"use cache"`, `cacheLife('hours')`), `getReviews` (no cache) |
| `src/lib/site.ts` | `SITE`, the site address from `SITE_URL` (default `http://localhost:5803`) |
| `src/app/layout.tsx` | Root layout: font, header with links, `metadata` with `metadataBase`, title template |
| `src/app/page.tsx` | Home page: hero and the first three courses |
| `src/app/courses/page.tsx` | Catalog (server component) |
| `src/components/CourseList.tsx` | The filter (`"use client"`, one `useState`) |
| `src/components/CourseCard.tsx`, `EnrollButton.tsx`, `Reviews.tsx` | Card with `next/image`; the second client component; the slow reviews |
| `src/app/courses/[slug]/page.tsx`, `not-found.tsx` | One course: `generateStaticParams`, `generateMetadata`, JSON-LD, `<Suspense>` |
| `src/app/sitemap.ts`, `src/app/robots.ts` | The site map and the robots file |
| `public/covers/*.png` | The eight cover pictures (large PNG files, about 1.1 MB each, on purpose) |
| `variants/course-page.no-suspense.tsx` | The course page with the reviews outside `<Suspense>` (step 5) |
| `lighthouse/` | A small project that installs Lighthouse locally and prints the four scores |
| `api/server.mjs`, `.env.example` | The practice API and the demo settings |

## Follow along

```bash
npm install
node api/server.mjs          # in a second terminal (port 8190)
```

### 1. Who must this site serve?

A student wants to browse, filter, open a course and press enroll. A search robot wants the real text in the first answer, a clear title and description for every page, a sitemap, and pictures that load fast. The frontend of Module 8 is a single-page app: a robot's first answer is an almost empty page, and the courses only appear after the JavaScript has run (Lesson 1 compares the two on a real page). Today we use the answer: Next.js. We use what lessons 1 to 6 taught: file routes, server and client components, caching and streaming, and metadata. The plan has seven steps: setup, layout and data, catalog, course page, reviews, SEO, measure.

### 2. Setup

The real command was `create-next-app` with TypeScript, the App Router, no Tailwind and a `src` folder (the video's install printed `added 345 packages`). It installs `next`, `react` and `react-dom`:

```bash
npm ls next react react-dom typescript --depth=0
```

```text
site@0.1.0 .
+-- next@16.4.3
+-- react-dom@19.3.0
+-- react@19.3.0
`-- typescript@5.9.3
```

`next.config.ts` has two lines the starter wrote, `cacheComponents` and `partialPrefetching`, both `true`. `cacheComponents` (Lesson 4) means every page is built ahead of time, and fresh data must either be cached or wait behind `<Suspense>`. Step 5 shows it for real.

One file talks to the practice API. The courses use `"use cache"` with `cacheLife('hours')`: the answer is remembered. The reviews have no cache, because reviews should be fresh:

```ts

export async function getCourses(): Promise<Course[]> {
  'use cache'
  cacheLife('hours')
  const res = await fetch(`${API}/api/courses`)
  return res.json()
}

export async function getCourse(slug: string): Promise<CourseDetail | null> {
  'use cache'
  cacheLife('hours')
  const res = await fetch(`${API}/api/courses/${slug}`)
  return res.ok ? res.json() : null
}

export async function getReviews(slug: string): Promise<Review[]> {
  const res = await fetch(`${API}/api/courses/${slug}/reviews`)
  return res.json()
}
```

### 3. The layout

One file wraps every page: the `html` tag with its language, the font from `next/font`, a header with `Link`s (so a click moves to the next page without a full reload), and the page itself in the middle. The site address comes from `SITE_URL` (a setting outside the code, so the same code runs on localhost today and on the real address tomorrow):

```tsx
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Link from 'next/link'
import { SITE } from '@/lib/site'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'allcsvideos · Learn to build the web',
    template: '%s · allcsvideos',
  },
  description: 'Calm video courses for total beginners.',
  openGraph: { siteName: 'allcsvideos', type: 'website' },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={geist.className}>
      <body>
        <header className="top">
          <Link href="/" className="brand">
            allcsvideos
          </Link>
          <nav>
            <Link href="/courses">Courses</Link>
          </nav>
        </header>
        <main>{children}</main>
        <footer>allcsvideos · made in Mumbai</footer>
      </body>
    </html>
  )
}
```

### 4. The catalog and the course page

The catalog page is an async server component: it waits for the courses, then draws them. No effect, no loading state, no fetch in the browser; the courses are already in the HTML that arrives (`curl -s http://localhost:5803/courses` finds all eight "Cover of ..." texts).

```tsx
export default async function CoursesPage() {
  const courses = await getCourses()
  return (
    <>
      <h1>All courses</h1>
      <CourseList courses={courses} />
    </>
  )
}
```

The filter needs a click, so it needs memory. That part alone is a client component (`"use client"`, one piece of state, a button for each level). Lesson 3's boundary: keep the client pieces small.

```tsx
'use client'

import { useState } from 'react'
import type { Course } from '@/lib/api'
import CourseCard from './CourseCard'

const LEVELS = ['all', 'beginner', 'intermediate', 'advanced']

export default function CourseList({ courses }: { courses: Course[] }) {
  const [level, setLevel] = useState('all')
  const shown = courses.filter((c) => level === 'all' || c.level === level)
  return (
```

Run it (a real browser against `npm start`): the catalog shows **8** cards; press Beginner and **5** stay. Each card is a link to its course page.

The course page lives in `src/app/courses/[slug]/page.tsx` (square brackets: a dynamic segment). `params` arrives as a promise; we `await` it, look for the course, and call `notFound()` if there is none. `generateStaticParams` runs at build time, asks the API for the courses and returns the slugs, so every course page is built once, before any student arrives. The page shows a picture on one side and the title, teacher, level, summary and enroll button on the other, with the lessons as a list below. The enroll button is the second client component (it needs a click and a small memory): press it and it says "You are in!" (real run: `after Enroll: You are in!`). Only that button needs JS code from us; the rest of the page is plain HTML.

A course that does not exist is answered by `not-found.tsx`, which also sends a `noindex` robots tag so search engines skip it (`<meta name="robots" content="noindex"/>` in the real output). One detail from my run, which may change in other versions: both `/courses/nope` and `/courses/nope-b` answered status 200 (the page is streamed, so the status is sent before the course is looked up).

### 5. The reviews are slow

The reviews come from a slow API (1.2 seconds). A student must not stare at a blank page for that long, so we write a `Reviews` component that fetches its own data. Guess: we run `npm run build` with the reviews placed straight in the page, outside `<Suspense>` (`variants/course-page.no-suspense.tsx` copied over `src/app/courses/[slug]/page.tsx`). What happens? Real run:

```text
Error: Route "/courses/[slug]": Next.js encountered uncached or runtime data during prerendering.

`fetch(...)`, `cookies()`, `headers()`, `params`, `searchParams`, or `connection()` accessed outside of `<Suspense>` prevents the route from being prerendered, blocking the page load and leading to a slower user experience.

Ways to fix this:
  - [stream] Provide a placeholder with `<Suspense fallback={...}>` around the data access
  - [cache] For uncached data (`fetch`, database calls): cache the access with `"use cache"` (does not apply to `connection()`)
  - [block] Set `export const instant = false` to allow a blocking route

Learn more: https://nextjs.org/docs/messages/blocking-prerender-dynamic
```

The build stops with the red message of Lesson 4 and names three ways out: stream it with `<Suspense>`, cache it with `"use cache"`, or allow a blocking route. The reviews must be fresh, so we stream. The finished page wraps them:

```tsx
import { getReviews } from '@/lib/api'

export default async function Reviews({ slug }: { slug: string }) {
  const reviews = await getReviews(slug)
  return (
    <div className="reviews">
      {reviews.map((r) => (
        <blockquote key={r.name} className="review">
          <p>“{r.text}”</p>
          <footer>
            {r.name} · {'★'.repeat(r.stars)}
          </footer>
        </blockquote>
      ))}
    </div>
  )
}
```

```tsx
<h2>Reviews</h2>
<Suspense fallback={<p className="muted">Loading reviews…</p>}>
  <Reviews slug={slug} />
</Suspense>
```

Build again and it passes. The route table now shows a half circle (`◐`, partial prerender) for every course page: the page is built ahead of time with a hole where the reviews go.

```text
Route (app)                         Revalidate  Expire
┌ ○ /                                       1h      1d
├ ○ /_not-found
├ ○ /courses                                1h      1d
├   /courses/[slug]
│ ├ ◐ /courses/[slug]
│ ├ ◐ /courses/react-for-beginners          1h      1d
│ ├ ◐ /courses/python-from-zero             1h      1d
│ └ ◐ [+6 more paths]
├ ○ /robots.txt
└ ○ /sitemap.xml                            1h      1d
```

Real timing with `curl` (the page is streamed, so the first byte comes long before the end):

```text
first byte 0.010534s   whole page 1.255632s
```

In the browser: first the sentence "Loading reviews…", and a moment later the reviews themselves.

### 6. SEO

First look at what a robot sees: the head of the page. With the starter's files every title is "Create Next App" and the description says "Generated by create next app". Three fixes, all from Lesson 6.

**Fix one, the layout** (above): a `metadata` object with a default title and a template (`%s · allcsvideos`), a description, and `metadataBase`.

**Fix two, the course page: `generateMetadata`.** It gets the same parameters, asks for the course (the call is cached, so no second trip), and returns its own title, description, a **canonical** link (the one official address of the page, so copies do not compete) and an Open Graph picture, here the cover we already have:

```tsx
  const courses = await getCourses()
  return courses.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<'/courses/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourse(slug)
  if (!course) return { title: 'Course not found' }
  return {
    title: course.title,
    description: course.summary,
    alternates: { canonical: `/courses/${slug}` },
    openGraph: {
      title: course.title,
      description: course.summary,
      images: [`/covers/${slug}.png`],
    },
```

The page also writes a block of JSON-LD in the body: a small piece of data that tells a search engine "this page is a course", with its name and who offers it. Real result, in the head again:

```text
<title>React for Beginners · allcsvideos</title>
<meta name="description" content="Build your first screens with components, props and state, step by step."/>
<link rel="canonical" href="http://localhost:5803/courses/react-for-beginners"/>
<meta property="og:title" content="React for Beginners"/>
<meta property="og:description" content="Build your first screens with components, props and state, step by step."/>
<meta property="og:image" content="http://localhost:5803/covers/react-for-beginners.png"/>
<meta name="twitter:card" content="summary_large_image"/>
```

and the JSON-LD:

```json
{"@context":"https://schema.org","@type":"Course","name":"React for Beginners","description":"Build your first screens with components, props and state, step by step.","provider":{"@type":"Organization","name":"allcsvideos"}}
```

**Two special files.** `sitemap.ts` lists every address (the home page, the catalog and the eight course pages), built from the same `getCourses()` call. `robots.ts` says robots may visit everything, and where the sitemap is:

```ts
import type { MetadataRoute } from 'next'
import { getCourses } from '@/lib/api'
import { SITE } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await getCourses()
  return [
    { url: SITE },
    { url: `${SITE}/courses` },
    ...courses.map((c) => ({ url: `${SITE}/courses/${c.slug}` })),
  ]
}
```

```text
<loc>http://localhost:5803</loc>
<loc>http://localhost:5803/courses</loc>
<loc>http://localhost:5803/courses/react-for-beginners</loc>
<loc>http://localhost:5803/courses/python-from-zero</loc>
```

```text
User-Agent: *
Allow: /

Sitemap: http://localhost:5803/sitemap.xml
```

**Fix three, the images.** The plain `<img>` becomes the `Image` component (see `CourseCard.tsx` and the course page). It needs `alt` text (the words a screen reader says out loud), `width` and `height`, a `sizes` hint so the browser asks for the right width, and `priority` for the big picture at the top so it loads first. Real download of the cover:

```text
plain PNG:                   1096024 bytes
optimised, WebP (w=1080):      35724 bytes
```

(The video measured 1,096,024 bytes against 9,978 bytes at the 750-pixel width the page needed.)

### 7. Measure with Lighthouse

Lighthouse is Google's own checker, and it installs locally with npm: one package, nothing global. It must run on a **production build**, because the development server is slower and not the same. So build, start, and run it on a course page:

```bash
npm run build
npm start -- -p 5803          # leave it running
cd lighthouse
npm install
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  npx lighthouse http://localhost:5803/courses/react-for-beginners \
  --chrome-flags="--headless=new" --output=json --output-path=report.json --quiet
node lh-summary.mjs report.json
```

(The build's route table now has two new lines, `/robots.txt` and `/sitemap.xml`.) The summary script prints the four scores and two numbers. Real result from my run on the finished site:

```text
Performance    99
Accessibility  100
Best practices 100
SEO            100
Largest paint  2.2 s
Page weight    190 KiB
```

The video measured the site before the SEO fixes, with plain images: Performance 76, Accessibility 90, Best practices 100, SEO 91, largest paint 7.5 s, page weight 3,395 KiB. After the fixes: Performance 98 and 100 for each of the other three, largest paint 2.3 s, page weight 220 KiB.

Look at SEO 91 in the "before" report: nearly full, and yet the title said "Create Next App". Lighthouse checks that a title exists, not that it is a good one. **A green score is a floor, not the finish.** What it did catch: images without alternative text (hurts SEO and accessibility), a blue with too little contrast (the fix was one colour, a darker blue) and the huge pictures. Lighthouse tests one page on a simulated phone and the numbers move a few points from run to run. It also cannot judge your words: true titles, headings in a sensible order and content people want are still your job.

## Common mistakes

- Putting slow, fresh data in the page with no `<Suspense>`: the build stops (step 5).
- Forgetting `metadataBase`: link-preview images get a `localhost` address.
- A plain `<img>` or an `Image` with no `alt`: Lighthouse flags it for accessibility and SEO.
- Believing a green score means a good page.

## Clean up

Stop the API and the site (Ctrl+C). Delete `.next/`, `node_modules/` and `lighthouse/node_modules/` and the `report.json`.

## Key points

- Build the pages ahead of time with `generateStaticParams`, remember data with `"use cache"`, and stream with `<Suspense>` what must stay fresh.
- Keep the client pieces small: here, a filter and a button. Everything else is server components and arrives as HTML.
- SEO is data in the page: a title and description for every page, canonical and Open Graph tags, JSON-LD, a sitemap and robots. Measure with Lighthouse on a production build, and remember that a score is not the goal.

Interview tip. If Rahul, the interviewer, asks "how do you make a React site show up in search?": render on the server, so the first answer already has the content; a unique title and description per page; a sitemap; fast images; and measure with Lighthouse.

## Try it yourself

1. A search box that uses the search parameters of the page, inside `<Suspense>`.
2. A rating on every course, refreshed with revalidation.
3. A picture for link previews, generated by code (`opengraph-image.tsx`, Lesson 6).

## Next

[M20-L01 · A Database from Next.js](../../m20-full-stack-with-nextjs/m20-l01-a-database-from-nextjs/README.md)
