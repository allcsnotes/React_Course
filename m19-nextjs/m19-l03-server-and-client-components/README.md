# M19-L03 · Server and Client Components

> Video: Module 19, Lesson 3. Watch it first, then follow along here.

## What you'll learn

- The two kinds of component in the App Router: server components (the default) and client components (`"use client"`)
- Where each runs, and how to prove it with `console.log` lines, the network list and a search of the bundle
- That a client component is also rendered once on the server, then hydrated
- What crosses from server to client: the RSC payload, and why props must be plain text parcels (never functions)
- Putting `"use client"` as low in the tree as possible, and passing server content as `children`
- Four real mistakes: `useState` on the server, a function prop, a data file imported into a client file, `window` on the server

## Before you start

- Node 24 (`node --version`) and Google Chrome for the browser checks. No Docker.
- Versions (from `package-lock.json`): Next.js 16.4.3 (Turbopack), React 19.3.0, `marked` (turns Markdown into HTML on the server).
- The practice API is `api/server.mjs`, a local Node stand-in on port 8193 that only answers when the key header is sent. The key `allcs-secret-7421` is a **demo value** for this practice API only. Copy the example settings file once:

```bash
cp .env.example .env.local
```

## Files in this folder

| File | What it is |
|------|------------|
| `app/page.tsx` | The page (server component) with a `<Suspense>` "Loading courses..." |
| `app/course-list.tsx` | Server component: `await getCourses()` and one card per course |
| `app/course-card.tsx` | Server component: turns the Markdown text into bold and italic with `marked` |
| `app/enroll-button.tsx` | The only client component (`"use client"`, one `useState`) |
| `lib/courses.ts` | `getCourses()` with the secret key; starts with `import "server-only"` |
| `.env.example` | `API_KEY` and `API_URL` (demo values) |
| `api/server.mjs` | The practice API |
| `variants/` | `B` (use client on the card), `C` (a client `Details` wrapper with `children`), `P` (props as parcels), and the mistakes `M1` to `M4` |

## Follow along

```bash
npm install
node api/server.mjs        # in a second terminal (port 8193)
npm run build
npm start -- -p 5193       # http://localhost:5193
```

### 1. One line moves a whole library

A course catalog: three cards, each with a title, a teacher, a short Markdown text (bold and italic words turned into HTML by `marked`) and an Enroll button. Build the page twice: once as it is, once with one line, `"use client"`, added at the top of `app/course-card.tsx` (that is `variants/B`). The page looks the same. But the script files the browser has to download are not the same: the script of our own page is **388 bytes** in the first copy and about **47,000** in the second. One line moved a whole library from our server onto the phone of every visitor.

### 2. The restaurant

The server is the kitchen: a computer of ours, with the data, the secrets and the heavy libraries. The browser is the table: it gets a finished dish (the page) and only the code that must live there, to react to a touch. Each component is cooked in one of two places:

- A **server component** runs only on the server. It can read data, use secrets and heavy libraries, and none of its code is sent to the browser; only its result is.
- A **client component** also runs in the browser. It can keep state and react to a click, but its code must be downloaded. All the script files the browser downloads together are called the bundle.

**The rule:** every component is a server component unless its file starts with the line `"use client"`. Nothing else. (In Lesson 2 the error file needed this line because its retry button reacts to a click.)

### 3. The pieces of the page

The page and the course list are server components; the card turns the text into HTML with `marked`; inside every card sits the enroll button, the only client component.

```tsx
import { Suspense } from "react";
import CourseList from "./course-list";

export default function Home() {
  return (
    <main>
      <h1>allcsvideos</h1>
      <Suspense fallback={<p>Loading courses…</p>}>
        <CourseList />
      </Suspense>
    </main>
  );
}
```

The list is an async function: the fetch happens in the kitchen, before the page is sent. `getCourses` calls the practice API with the secret key from the server's settings. No `useEffect`, no loading flag.

```tsx
import { getCourses } from "@/lib/courses";
import CourseCard from "./course-card";

export default async function CourseList() {
  const courses = await getCourses();
  console.log("[server] CourseList renders");
  return (
    <div className="grid">
      {courses.map((c) => (
        <CourseCard key={c.id} course={c} />
      ))}
    </div>
  );
}
```

```ts
import "server-only";

export type Course = { id: string; title: string; teacher: string; about: string };

export async function getCourses(): Promise<Course[]> {
  const res = await fetch(`${process.env.API_URL}/api/courses`, {
    headers: { "x-api-key": process.env.API_KEY! },
    cache: "no-store",
  });
  return res.json();
}
```

The button's first line is the boundary. From this file on, the browser needs the code:

```tsx
"use client";

import { useState } from "react";

export default function EnrollButton({ title }: { title: string }) {
  const [enrolled, setEnrolled] = useState(false);
  console.log("[client] EnrollButton renders:", title);
  return (
    <button
      className={enrolled ? "done" : ""}
      onClick={() => setEnrolled(true)}
    >
      {enrolled ? "Enrolled ✓" : "Enroll"}
    </button>
  );
}
```

### 4. Prove what runs where

There is a `console.log` in every component: server lines start with `[server]`, client lines with `[client]`. Build for production, start it, and open the page in a real browser. There are two places where console lines can appear: the terminal where the server runs, and the console of the browser. Guess which of the four different lines show up where. Real run:

- **Browser console**: only the client lines, one per button. The server line never reached the phone.

```text
[client] EnrollButton renders: React for Beginners
[client] EnrollButton renders: SQL in Two Weeks
[client] EnrollButton renders: Docker for Developers
```

- **Terminal of the server**: the `[server] CourseList renders` line, **and** the client lines too:

```text
[server] CourseList renders
[client] EnrollButton renders: React for Beginners
[client] EnrollButton renders: SQL in Two Weeks
[client] EnrollButton renders: Docker for Developers
```

A client component also runs on the server, once, to cook the first version of the page as plain HTML so the visitor sees something at once. Then the browser downloads its code and runs it again to attach the clicks. That second step is hydration (Lesson 1). So "client" means "also in the browser", not "only in the browser".

### 5. The network list

I recorded every request the browser made for the page with Playwright. In my run (production build): 9 requests, **all to this site, none to port 8193**, and 6 script files, 457,887 bytes after unpacking. Five of them are the framework (React and Next.js, about 457 kB together); the sixth is ours: **388 bytes**, the whole enroll button.

```text
  16898  /_next/static/chunks/3cfn99dbrcvvp.js
  14090  /_next/static/chunks/1tq6ppe__m8m-.js
  10030  /_next/static/chunks/turbopack-3-ry682tkyiqk.js
    388  /_next/static/chunks/3jat3zems7r06.js     <- our enroll button
 186631  /_next/static/chunks/1j_b1xq_woyiy.js
 229850  /_next/static/chunks/2ki52vdnbo2ft.js
```

(File names and sizes can differ a little on your machine.) The browser never called the practice API and never saw the key. The server called it: the API's own log shows `GET /api/courses key sent`.

Now search for the library. Our page uses `marked`. How many files that the browser can download contain the word `marked`, and how many files of the server side?

```bash
grep -rl marked .next/static | wc -l      # files the browser can download
grep -rl marked .next/server | wc -l      # files that stay on the server
```

```text
0
6
```

The library lives only in the kitchen, and the words of the enroll button are in exactly one browser file. The cost of `marked` for the visitor is zero bytes; the same is true for the secret key and for the code that asks for the data.

### 6. How the page gets from the kitchen to the table

The server sends the HTML, and also a second package, the **RSC payload** (React Server Components payload). In the page source the cards are finished HTML, with the `<strong>` and `<em>` tags that `marked` made (for example `<strong>real pages</strong>` and `<em>type every line</em>`). The payload's line for the button is not code, it is a note: "put component 1b here and give it these props". Those props travel as plain text (serialisation: packing a value into text so it can be sent over the network). `variants/P` passes a string, a number, `true` and `false`, a list, an object and a date; the real payload carries all of them:

```text
["$","$L1b",null,{"title":"React for Beginners","price":499,"free":false,"tags":["react","beginner"],"meta":{"level":"beginner"},"since":"$D2026-10-30T00:00:00.000Z"}]
```

A function cannot go: it carries code, and you cannot put an oven in an envelope.

**Try it (mistake 2):** copy `variants/M2/app/*` over `app/` (the card passes `onEnroll={() => console.log("enrolled")}` to the button) and run `npm run dev`. The server stops with an error on every request:

```text
Error: Event handlers cannot be passed to Client Component props.
```

It even points at the function. The fix is the way our button already works: the client component owns its click handler.

### 7. `"use client"` as low as you can

Put `"use client"` at the top of `app/course-card.tsx` (`variants/B`). Now the card is a client component and **everything it imports travels with it**, so `marked` has to be downloaded. In my run the scripts grew from 457,887 to 504,861 bytes in total, and `grep -rl marked .next/static | wc -l` printed `1`. Same page, same look, more to download.

So put `"use client"` on small leaves that really need a click or a state, like the enroll button, not on a whole page because one button needs it.

But what if a client component must wrap server content? Say every card gets a link "Hide about" that hides the text, which needs state. The answer is `children` (Module 16, Lesson 1). `variants/C` has `Details`, a client component with state, and the card stays a server component that puts the text, made by `marked`, inside it as its children:

```tsx
"use client";

import { useState } from "react";

type Props = { label: string; children: React.ReactNode };

export default function Details({ label, children }: Props) {
  const [open, setOpen] = useState(true);
  console.log("[client] Details renders:", label);
  return (
    <div className="details">
      <button className="link" onClick={() => setOpen(!open)}>
        {open ? "Hide" : "Show"} {label}
      </button>
      {open && children}
    </div>
  );
}
```

Real result: the page works, the link hides and shows the text, the new script is **715 bytes**, all scripts together are 458,214 bytes (only 327 bytes more) and `grep -rl marked .next/static | wc -l` prints `0`. The server cooked the text and handed it to the client component as a finished dish to put in its box.

## Common mistakes

1. **`useState` in a component without `"use client"`** (`variants/M1`). The build stops:

```text
Error: You're importing a module that depends on `useState` into a React Server Component module. This API is only available in Client Components. To fix, mark the file (or its parent) with the `"use client"` directive.
```

   The message names the file and the import trace shows which page uses it. Fix: move the state into a small client component, like our button.
2. **A function passed to a client component** (`variants/M2`), see step 6. Development mode shows `Event handlers cannot be passed to Client Component props.`
3. **A client component imports the data file** (`variants/M3`: the enroll button imports `getCourses`). The data file starts with `import "server-only"`, and the build fails. The first line talks about the Pages Router, which is a quirk of this version; the useful part is the import trace, which names the enroll button as the client file that pulled the data code in:

```text
Error: You're importing a module that depends on "server-only". This API is only available in Server Components in the App Router, but you are using it in the Pages Router.
Import traces:
  Server Component:
    ./lib/courses.ts
    ./app/course-list.tsx
    ./app/page.tsx
```

   That guard stops server code, and any secret written inside it, from being shipped to every visitor by accident.
4. **A browser word on the server** (`variants/M4`: the card reads `window.innerWidth`). The build passes but the page fails when served: `ReferenceError: window is not defined`. The kitchen has no window. Do it in a client component, in an effect or in a click handler, which run only in the browser.

To try a variant: copy its `app/` files over `app/` (for example `cp -R variants/M1/app/. app/`), build, and then restore the original files from this folder's start (`app/course-card.tsx`, `app/enroll-button.tsx`).

## Clean up

Stop the API and the site. Delete `.next/` and `node_modules/`. Remove `.env.local` (it is git-ignored). Restore the original files in `app/` if you tried variants.

## Key points

- In the App Router every component is a server component. It runs only on the server, and its code, libraries and secrets never reach the browser; only its result does.
- A file that starts with `"use client"` is a client component: it can use state and clicks, its code is downloaded, and it is also drawn once on the server and then hydrated. Put the line on small leaves. Props must be plain text parcels, never functions. Server content can come in as `children`.
- Do not believe, check: the console lines, the network list and a search of the bundle.

Interview tip. If Rahul, the interviewer, asks "does `use client` mean the component runs only in the browser?": no. It is also rendered once on the server as HTML, then hydrated in the browser. A server component never ships its code, and it cannot use state, effects or browser APIs.

## Try it yourself

Add a like button, as a client component with a counter, to every card. Build the site, start it, and search the browser files (`.next/static`) for its text.

## Next

[M19-L04 · Data Fetching, Caching and Streaming](../m19-l04-data-fetching-caching-and-streaming/README.md)
