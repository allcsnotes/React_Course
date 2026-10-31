# M19-L02 · The App Router

> Video: Module 19, Lesson 2. Watch it first, then follow along here.

## What you'll learn

- File-based routing: the folders of `app/` are the routes of the site, and only a file named `page.tsx` makes a folder public
- Layouts (the root layout and nested layouts) and why a layout keeps its state while you move between pages
- `Link` (prefetching, no reload) versus a plain `<a>`
- Dynamic routes with `[slug]` and `params` as a promise
- `loading.tsx`, `error.tsx` (with `retry`), and `not-found.tsx`
- Route groups with round brackets, such as `(marketing)`, that do not show in the address
- Four real mistakes

## Before you start

- Node 24 (`node --version`). Google Chrome is only needed for the browser checks in this README (any browser works by hand). No Docker.
- Versions (from `package-lock.json`): Next.js 16.4.3 (Turbopack), React 19.3.0, TypeScript 5.x. Module 8 (React Router) and Module 14, Lesson 5 (Suspense and error boundaries) help.
- The practice API is `api/server.mjs`, a local Node stand-in on port 8192 (4 demo courses; the list answers after 1.2 s, one course after 0.8 s; `POST /api/break` makes the course answers fail and `POST /api/fix` repairs them). It is not a real server.
- The site uses port 5192 (`next start -p 5192`).

## Files in this folder

| File | What it is |
|------|------------|
| `app/layout.tsx` | The root layout: the menu, a search box, and the `html` and `body` tags |
| `app/page.tsx` | The home page (`/`) |
| `app/(marketing)/layout.tsx`, `about/page.tsx`, `about/Team.tsx`, `pricing/page.tsx` | The grouped pages `/about` and `/pricing` with a yellow banner |
| `app/courses/layout.tsx`, `page.tsx`, `loading.tsx` | The course list, its blue bar, and its loading screen |
| `app/courses/[slug]/page.tsx`, `error.tsx`, `not-found.tsx` | One course page, its error screen and its "No such course" |
| `app/not-found.tsx` | The 404 page of the whole site |
| `lib/courses.ts` | `getCourses` and `getCourse` (calls the practice API) |
| `variants/` | The files of the examples and mistakes (`teachers.page.tsx`, `layout.atag.tsx`, `slug.noawait.tsx`, `error.noclient.tsx`, `error.reset.tsx`, `contact.index.tsx`, ...) |
| `api/server.mjs` | The practice API |
| `next.config.ts` | `cacheComponents` and `partialPrefetching` turned on (as the starter wrote it) |

## Follow along

```bash
npm install
node api/server.mjs        # in a second terminal (port 8192)
npm run build
npm start -- -p 5192       # http://localhost:5192
```

### 1. The map

In Module 8 Asha wrote a route table: a list that says "this address shows that component". Every new page was a new line and a new import. In Next.js the folders are the routes. The folder is named `app`, so this part is called the App Router.

- `app/page.tsx` is the address `/`.
- `app/courses/page.tsx` is `/courses`. The folder name is the address.
- A page file is just a component exported as default; nothing in it mentions a route:

```tsx
import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>Learn by building</h1>
      <p>Short courses from Meera, Asha and Rahul.</p>
      <Link href="/courses" className="cta">See the courses</Link>
    </main>
  )
}
```

- **Only a file named `page` makes a folder public.** Next to the About page sits `Team.tsx`, a component the About page imports. `/about` shows the team, and `/about/Team` is a 404. Other files in a folder are safe, so keep helpers next to the page that uses them.

Real status codes from the production server (`curl -s -o /dev/null -w '%{http_code}'`):

```text
/ 200            /about 200          /pricing 200       /courses 200
/about/Team 404  /nothing 404        /courses/react-for-beginners 200
/courses/python-from-zero 200        /courses/rust 200
```

(`/courses/rust` answers 200 on the first request; the "No such course" screen is drawn by the page, see step 6.)

To add a page, make a folder and put one file in it. Copy `variants/teachers.page.tsx` to `app/teachers/page.tsx`, rebuild, and `/teachers` answers 200 with:

```text
<h1>Our teachers</h1><p>Meera, Asha and Rahul.</p>
```

No list, no import, no router code. (Delete `app/teachers` afterwards.)

### 2. Layouts

Every site has a part that never changes: the menu. In Module 8, Lesson 3 you built that with a layout route and an outlet. In Next.js it is `layout.tsx`. It receives `children`, whatever page is shown. The root layout must exist and must contain the `html` and `body` tags (there is no `index.html`):

```tsx
import Link from 'next/link'
import './globals.css'

export const metadata = { title: 'allcsvideos' }

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>
        <header>
          <strong>allcsvideos</strong>
          <Link href="/">Home</Link>
          <Link href="/courses">Courses</Link>
          <Link href="/about">About</Link>
          <input placeholder="Search courses" />
        </header>
        {children}
      </body>
    </html>
  )
}
```

Layouts nest. `app/courses/layout.tsx` draws a blue bar "All courses" and puts its children under it, so every page below `/courses` sits inside two layouts, like boxes inside boxes.

A layout is **not drawn again** when you move between the pages inside it, so it keeps what the visitor typed. Test: type `react` in the search box (it lives in the root layout), then click About. The page changes, the yellow banner appears, and the search box still says `react`:

```text
EVAL>> "react"        (value of the search box after clicking About)
```

### 3. `Link` and prefetching

Move between pages with `Link` from `next/link`; it takes `href` instead of `to`. When a link is on screen, Next.js quietly downloads the page behind it in the background. In the video's network list the first visit made one page, one style file and six script files (472 kB), then five small requests (6.5 kB together) for the pages behind the links, and pressing About made no new requests.

Now the same click with a plain `<a href="/about">` (`variants/layout.atag.tsx` is the layout with `<a>` for About). The browser throws the page away and asks the server for a new one with all its scripts, and the search box is empty again. Use `Link` for every address inside your own site, and `<a>` only for other sites.

### 4. Dynamic routes

There are many courses and nobody wants a folder for each. The folder name goes in square brackets: `app/courses/[slug]`. It matches any single piece of the address. In this version `params` arrives as a **promise**, so you `await` it:

```tsx
import { notFound } from 'next/navigation'
import { getCourse } from '@/lib/courses'

export default async function CoursePage({
  params,
}: PageProps<'/courses/[slug]'>) {
  const { slug } = await params
  const course = await getCourse(slug)
  if (!course) notFound()
  return (
    <article>
      <h1>{course.title}</h1>
      <p>By {course.teacher} · {course.lessonCount} lessons</p>
      <p className="price">
        {course.price === 0 ? 'Free' : `Rs ${course.price}`}
      </p>
    </article>
  )
}
```

One file, two addresses: `/courses/react-for-beginners` shows React for Beginners (`By Meera · 4 lessons`, `Rs 499`); `/courses/python-from-zero` shows the free course. In Module 8 you read the slug with a hook; here it simply arrives in the page's props.

### 5. `loading.tsx`

`app/courses/page.tsx` asks the practice API for the list, and the API takes 1.2 seconds. Press Courses. What does the browser show? A blank page, the old page, or something else? Real run:

```text
after 150 ms:  allcsvideos | Home | Courses | About | All courses | Loading…
after 1.7 s:   allcsvideos | Home | Courses | About | All courses | React for Beginners | Meera | Python from Zero | Meera | SQL in Two Weeks | Asha | Docker for Developers | Rahul
```

The menu and the blue bar stay; only the page below shows "Loading…". That screen is a file, `app/courses/loading.tsx`:

```tsx
export default function Loading() {
  return <p className="skeleton">Loading…</p>
}
```

Next.js shows it at once while the page waits for its data. Behind the scenes it wraps the page in a `<Suspense>` boundary (Module 14, Lesson 5) with your loading file as the fallback. One loading file covers the whole folder, including every course page below it: click a course and the same "Loading…" shows for about 0.8 seconds, then the course appears.

### 6. `error.tsx` and `not-found.tsx`

Switch the practice API into its broken mode and open a course:

```bash
curl -s -X POST localhost:8192/api/break
```

Without help the visitor would get a broken page. With `error.tsx` in the folder, Next.js shows that instead:

```tsx
'use client'

export default function Error({ retry }: { retry: () => void }) {
  return (
    <div className="oops">
      <h2>This course could not load</h2>
      <button onClick={() => retry()}>Try again</button>
    </div>
  )
}
```

The first line is `'use client'` because the button reacts to a click (Lesson 3). The component receives a function called `retry`, and the button runs it. Behind the scenes `error.tsx` is an error boundary (Module 14). The menu and the blue bar are still there: the error replaced only the page below them. Real run:

```text
broken:               allcsvideos | Home | Courses | About | All courses | This course could not load | Try again
after fix + Try again: allcsvideos | Home | Courses | About | All courses | React for Beginners | By Meera · 4 lessons | Rs 499
```

(between the two lines: `curl -s -X POST localhost:8192/api/fix`, then press Try again).

An address with no page, such as `/nothing`, shows `app/not-found.tsx`: `404 | This page does not exist. | Go home`. A course that does not exist is a different kind of missing: `/courses/rust` matches the `[slug]` folder, so the page runs, asks the practice API, hears 404, and calls `notFound()` (from `next/navigation`). Next.js shows the nearest `not-found.tsx`, here the one inside the course folder:

```tsx
import Link from 'next/link'

export default function CourseNotFound() {
  return (
    <div className="oops">
      <h2>No such course</h2>
      <Link href="/courses">Back to all courses</Link>
    </div>
  )
}
```

```text
allcsvideos | Home | Courses | About | All courses | No such course | Back to all courses
```

### 7. Route groups

Asha wants a yellow banner on About and Pricing, but not on the courses, and she does not want the address to change (`/about`, not `/marketing/about`). A folder with its name in round brackets groups pages, and its name is not part of the address. `app/(marketing)/layout.tsx` has the banner:

```tsx
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <p className="banner">New: Docker for Developers is live</p>
      {children}
    </div>
  )
}
```

The build table lists `/about` and `/pricing`; the word `marketing` is nowhere:

```text
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /about
├ ◐ /courses
├   /courses/[slug]
│ └ ◐ /courses/[slug]
└ ○ /pricing
```

`/about` shows `New: Docker for Developers is live | About allcsvideos | ...`; `/courses` has no banner.

## Common mistakes

1. **A page file with the wrong name.** `variants/contact.index.tsx` copied to `app/contact/index.tsx`: Next.js ignores it. The build passes and the route table has no `/contact` (it is a 404). Only a file named `page` makes a route.
2. **Forgetting `await` on `params`.** `variants/slug.noawait.tsx` writes `params.slug`. The build stops with a type error:

```text
app/courses/[slug]/page.tsx(7,23): error TS2339: Property 'slug' does not exist on type 'Promise<{ slug: string; }>'.
Failed to type check.
```

   When you see that, add `await`.
3. **`error.tsx` without `'use client'`** (`variants/error.noclient.tsx`). The build fails and says so plainly:

```text
Error: app/courses/[slug]/error.tsx must be a Client Component. Add the "use client" directive the top of the file to resolve this issue.
```

4. **`reset` instead of `retry`** (`variants/error.reset.tsx`, older tutorials). Break the API, open a course, repair the API, press Try again. In this version the page still says "This course could not load" because `reset` only clears the error and shows the same data again; the function that asks the server again is `retry`:

```text
broken:                allcsvideos | Home | Courses | About | All courses | This course could not load | Try again
after fix + Try again: allcsvideos | Home | Courses | About | All courses | This course could not load | Try again
```

## Clean up

Stop the API and the site. Delete `.next/` and `node_modules/`. Put `app/courses/[slug]/error.tsx` back from `variants/error.good.tsx` if you tried the mistakes.

## Key points

- Folders are routes. A folder becomes an address when it holds a file called `page`. Square brackets make a dynamic address; round brackets make a group that does not show in the address.
- A layout wraps pages and stays on screen between them. Loading, error and not-found are files too, and each covers the folder it sits in.
- Use `Link` between your own pages: it prefetches, and it never reloads the page.

Interview tip. If Rahul, the interviewer, asks "how is routing in the App Router different from React Router?": the routes are the folders, not a list in code, and special files in each folder (layout, loading, error and not-found) give every part of the address its own frame.

## Try it yourself

Add `app/courses/[slug]/lessons/[lesson]/page.tsx` with a page that shows both pieces of the address.

## Next

[M19-L03 · Server and Client Components](../m19-l03-server-and-client-components/README.md)
