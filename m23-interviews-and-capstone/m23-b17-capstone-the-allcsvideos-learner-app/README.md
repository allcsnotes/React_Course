# M23-B17 · Capstone: The allcsvideos Learner App

> Video: Module 23, Build 17. Watch it first, then follow along here.

## What you'll learn

- How a capstone is not new theory but an order: setup, data, sign in, pages, a form, tests, a budget, a real run
- A Next.js 16 app with sign in (Auth.js, hashed fake password), a searchable catalog, a course page with optimistic progress, and a feedback form checked in the browser and on the server
- Data checked at the border with Zod, and a server that checks the session on every page and every action
- Unit, component and end-to-end tests, a performance budget (JavaScript size and LCP), and an automatic accessibility check with axe-core
- A real production run in a Docker container, and the real mistakes that only the container showed

## Before you start

- Node 24 (`node --version`), Docker Desktop running, and Chrome (the Playwright config and the budget script start `/Applications/Google Chrome.app/...`; on another system, change the `executablePath` in `learner/playwright.config.ts` and `learner/scripts/budget.mjs`, or remove it and run `npx playwright install chromium`).
- Everything from the course comes back here and no theory is taught again. Each step names its lesson.
- Everything is local. The passwords and secrets are fake and say so: the demo password is `fake-demo-pass` (only its bcrypt hash is stored), and `AUTH_SECRET` is a fake demo value. The practice API (`learner/api/server.mjs`, port 8247) keeps its data in memory, so a restart forgets it. Nothing is sent to the internet or deployed.
- The `package-lock.json` is kept on purpose (the Docker file runs `npm ci`).

## Files in this folder

All inside `learner/` unless noted.

| File | What it is |
|------|------------|
| `api/server.mjs` | The practice API: 8 courses with lessons, progress per person, feedback |
| `src/lib/schemas.ts` | Zod: the course shape, and the feedback rules (email, rating 1 to 5, message of at least 10 characters) |
| `src/lib/api.ts` | The fetch calls (`getCourse` is remembered with `use cache`) |
| `src/lib/users.ts`, `src/auth.ts` | Demo users with a bcrypt hash and no password; Auth.js with the credentials provider |
| `src/lib/session.ts` | `getSession()` (calls `connection()` first, then `auth()`) and `requireUser()` |
| `src/app/page.tsx`, `courses/[slug]/page.tsx`, `my/page.tsx`, `login/page.tsx` | Catalog with search, course page, my learning, sign in |
| `src/app/actions.ts` | Server actions: `login`, `logout`, `markDone`, `sendFeedback` |
| `src/components/` | `CourseList`, `Lessons` (optimistic), `Progress`, `FeedbackForm`, `LoginForm`, `UserMenu` |
| `src/lib/progress.ts` | `percent(done, total)` |
| `src/**/*.test.ts(x)`, `vitest.config.mts`, `vitest.setup.ts` | 8 tests |
| `e2e/learner.spec.ts`, `e2e/a11y.spec.ts`, `e2e/axe-proof.spec.ts`, `playwright.config.ts` | The browser journey and the accessibility checks |
| `scripts/budget.mjs` | The budget check: JS size and LCP for three pages |
| `Dockerfile`, `.dockerignore`, `next.config.ts` | Three stages, user `app`, `output: "standalone"` |
| `.env.example` | Fake settings. Copy to `.env.local` |
| `public/.gitkeep` | Keeps the `public` folder the Dockerfile copies (the starter's sample images were left out) |
| `../versions/` | The first version of two files, before a fix (reading only) |

## Run it

Terminal 1 (the practice API):
```bash
cd learner
node api/server.mjs
```
Terminal 2:
```bash
cd learner
npm install
cp .env.example .env.local
npm run build
npm run start -- -p 5847
```
Open http://localhost:5847. Sign in as `lukas@example.test` with `fake-demo-pass` (or `priya@example.test`).

## Build it step by step

### 1. The setup (M19-L2)

```bash
npx create-next-app@latest learner --ts --app --no-tailwind --eslint --src-dir --import-alias "@/*" --use-npm --yes
```
It chose Next.js 16.4.3 and React 19.3.0. The starter turns on `cacheComponents` and `partialPrefetching` (M19-L4: personal data waits behind Suspense). Then the packages, all local: `next-auth@beta` (version 5 beta, M20-L2), `bcryptjs`, `zod`, `react-hook-form` and `@hookform/resolvers` (M12), and the test tools: `vitest` with Testing Library, `@playwright/test` and `axe-core`. The real versions:
```text
+-- @hookform/resolvers@6.0.2
+-- @playwright/test@1.64.1
+-- axe-core@4.14.0
+-- bcryptjs@3.0.3
+-- next-auth@5.0.0-beta.32
+-- react-hook-form@7.91.0
+-- vitest@5.0.5
`-- zod@4.6.7
```
A real mistake while installing the test tools: `npm install` stops with `ERESOLVE`, a conflict about `@types/node`. The starter had version 20 and `vitest` 5 needs 22 or newer. The fix: put the types for Node at `^24` (this folder's `package.json` already has `@types/node` 24).

### 2. The practice API and checked data (M9-L4)

`api/server.mjs` is one file of plain Node on port 8247: 8 courses with their lessons, a list of who finished which lesson, and a place for feedback. Progress lives in memory.
```bash
curl -s "localhost:8247/api/courses?q=docker"
```
```text
[{"slug":"docker-for-developers","title":"Docker for Developers","teacher":"Rahul","level":"intermediate","price":599,"free":false,"summary":"Package an app so it runs the same on every machine.","lessonCount":3}]
```
The page must not trust that answer blindly: `src/lib/schemas.ts` describes the shape with Zod and `Course.array().parse(...)` in `src/lib/api.ts`. If the API ever sends something else, the page stops at the border with a clear error. In `api.ts`, `getCourse` starts with `'use cache'` and `cacheLife('minutes')` because course texts change rarely (M19-L4); the catalog with a search word and the progress of a person are never remembered.

### 3. Sign in (M20-L2)

The users are a list in one file with a bcrypt hash and no password (`src/lib/users.ts`; the demo password is fake). `src/auth.ts`: the credentials provider with one function `authorize` (find the user, compare with the hash, return the user or nothing) and two callbacks that carry the user's id into the token and the session. The secret is in `.env.local` (fake). Guess: Lukas types the right email and a wrong password. The page says `Wrong email or password` (it does not say which one was wrong). React clears both fields after the action, so he types them again; with the right password he lands on his own page: `Welcome, Lukas`. The three doors of M20-L2: here every page asks for the session before it shows anything, and every action asks again. A hidden button is a picture; the check is the lock.

### 4. The catalog and its search (M19-L2, M19-L3)

`src/app/page.tsx` is a server component. It reads the search word from the address (`searchParams`, a promise), so it waits behind Suspense (the rule of cache components). The search is a plain `<form method="get">`: press Search and the browser puts the word in the address. No client code, no state, and the Back button just works. The list asks the practice API with that word. Type `docker` and press Search: the address ends with `?q=docker` and one course is left.

### 5. The course page and progress (M19-L3, M14-L4)

Two kinds of data meet here. The course itself comes from the server and is remembered (`use cache`). The progress is personal, so it waits behind Suspense and first asks who is signed in (`src/components/Progress.tsx`, a server component). It hands the list of finished lessons to a client component as a plain list. `Lessons.tsx` uses `useOptimistic` (M14-L4): when Lukas presses "Mark done" the bar moves at once and the server action saves it in the background. The percent comes from one tiny function in `src/lib/progress.ts`: finished divided by total. The action asks for the user first, then saves, then `refresh()`:
```ts
export async function markDone(slug: string, lesson: number) {
  const user = await requireUser()
  await saveProgress(user.id, slug, lesson)
  refresh()
}
```
Open Docker for Developers: `0 of 3 lessons`. Press Mark done on the first lesson: `1 of 3 lessons · 33%`. Reload: still 33, because the server has it. On "My learning" the course shows 33% done.

### 6. The feedback form (M12-L1, M12-L2)

One Zod schema says what a good message is (`feedbackSchema`: a real email, a rating from 1 to 5, a message of at least 10 characters). The same schema runs in the browser (React Hook Form with the resolver) and again on the server in `sendFeedback`, because a script can skip the browser completely (M20-L2). Errors show under their field with `role="alert"`. Type an email and the message `Nice`, press Send: the form refuses with `Write at least 10 characters` and nothing is sent. Write a real sentence and send it: the page says thank you.

### 7. Tests (M17-L1, M17-L2, M17-L4)

Unit tests with Vitest (`percent`, the feedback rules), then a component test: type into the form like a user and check what the screen says.
```bash
npm test -- --reporter=verbose
```
```text
 ✓ src/lib/progress.test.ts > percent > rounds to a whole number 1ms
 ✓ src/lib/progress.test.ts > percent > is 0 for a course with no lessons 0ms
 ✓ src/lib/progress.test.ts > percent > is 100 when everything is done 0ms
 ✓ src/lib/schemas.test.ts > feedbackSchema > accepts a good message 1ms
 ✓ src/lib/schemas.test.ts > feedbackSchema > rejects a short message with our text 0ms
 ✓ src/lib/schemas.test.ts > feedbackSchema > rejects a rating of 6 0ms
 ✓ src/components/FeedbackForm.test.tsx > FeedbackForm > shows our message for a short text and does not send 105ms
 ✓ src/components/FeedbackForm.test.tsx > FeedbackForm > sends a good message 73ms

 Test Files  3 passed (3)
      Tests  8 passed (8)
```
A real mistake: the first run in the video had 7 passing and 1 failing with `Found multiple elements with the text: email`. The first test left its form on the page and the second found two. Testing Library cleans up by itself only when the globals are switched on; the fix is one line in `vitest.setup.ts`: `afterEach(cleanup)`.

The second kind is one Playwright test in a real browser (`e2e/learner.spec.ts`): it signs in, searches for Docker, opens the course, presses Mark done, checks the bar says 33, reloads, and checks again. That is the whole product in a few lines. It needs the app and the API running (start them as in "Run it"):
```bash
npx playwright test e2e/learner.spec.ts
```
```text
  ✓  1 e2e/learner.spec.ts:3:5 › sign in, search, open a course, mark done (2.8s)
  1 passed
```
One honest limit: the practice API remembers progress. Run it a second time without restarting the API and the test fails (the button `Mark done: Images` is gone, because that lesson is already done: `Test timeout ... waiting for getByRole('button', { name: /Mark done: Images/ })`). Restart `node api/server.mjs` before each run.

### 8. The budget and the accessibility check (M15-L1, M16-L3)

A budget is a number you promise before you measure: at most 200 kB of JavaScript (compressed) sent to the browser for any page, and an LCP of at most 2.5 seconds (the good limit). `scripts/budget.mjs` opens a real browser, loads each page five times with the cache off, and adds up the bytes of every script. (A real mistake: the first version did not switch the cache off, and the course page said 46 kB, because after the sign in the scripts came from the cache.) Real result against the production server:
```bash
node scripts/budget.mjs
```
```text
budget: JS <= 200 kB compressed, LCP <= 2500 ms
/                                JS 188.9 kB · LCP 328 ms · ok
/login                           JS 142.7 kB · LCP  36 ms · ok
/courses/docker-for-developers   JS 187.9 kB · LCP 328 ms · ok
all pages within budget
```
All inside 200, but with only 11 kB to spare. The LCP is far below the limit (it differs from run to run; this is one laptop). Accessibility: axe-core is a rule checker, and the Playwright tests inject it into the page. First a proof that it works, on a deliberately broken page:
```text
broken page: button-name (critical), document-title (serious), image-alt (critical), label (critical)
```
Four problems: a button with no name, a missing title, an image with no alt text, and an input with no label. Now our own pages, signed in as Lukas:
```text
/                                no violations
/courses/docker-for-developers   no violations
/my                              no violations
/login                           no violations
```
That is why every field has a label, the progress bar has a name and a value, and every error has `role="alert"`. An honest limit: a machine checks rules. It cannot judge whether the page is easy to understand, or whether the keyboard order makes sense.

### 9. A real production run (M21-L2)

`next.config.ts` has `output: "standalone"`. The `Dockerfile` has three stages (install, build, run); the run stage uses a user with no special powers. No secret is baked in: the secret and the address of the API arrive when the container starts.
```bash
docker build -t m23b17-learner .
docker images m23b17-learner
```
```text
IMAGE                      ID             DISK USAGE   CONTENT SIZE
m23b17-learner:latest      ...                295MB
```
The build prints the route table with a half circle (partial prerender) for each page, and no warning about secrets. Run it (stop the local `npm run start` first, because the container uses the same port 5847):
```bash
docker run -d --name m23b17-run -p 5847:3000 \
  -e AUTH_SECRET=fake-secret-for-local-demo-only-0123456789abcdef \
  -e AUTH_URL=http://localhost:5847 \
  -e API_URL=http://host.docker.internal:8247 \
  m23b17-learner
docker logs m23b17-run
```
```text
▲ Next.js 16.4.3
- Local:         http://localhost:3000
- Network:       http://0.0.0.0:3000
✓ Ready in 0ms
```
**The last real mistake.** In the first version of `src/lib/session.ts`, `getSession()` was only `return auth()` (see `versions/session.v1.ts`). Visit the home page, and the log fills with errors:
```text
Error: Route "/": Next.js encountered the unstable value `crypto.getRandomValues()` while prerendering.
```
The cause is Auth.js: it makes a random check value, and cache components wants anything random to wait for the request. The fix is one helper, `getSession`, that first calls `connection()` and then `auth()`. The menu, the page of a course and the actions all use it (this folder has the fixed version). We rebuilt and ran again: the log has no errors. (You can see the error without Docker: remove the `await connection()` line from `getSession`, run `npm run build` and `npm run start`, and open the home page. Put the line back afterwards.)

Now everything again, against the container (restart the practice API first so progress starts empty): `npx playwright test` runs the journey and the accessibility checks, and `node scripts/budget.mjs` the budget:
```text
  ✓  2 e2e/axe-proof.spec.ts:3:5 › axe does catch a broken page (proof the check works)
  ✓  1 e2e/learner.spec.ts:3:5 › sign in, search, open a course, mark done
  ✓  3 e2e/a11y.spec.ts:12:5 › no axe violations on the main pages
  3 passed
/                                JS 188.9 kB · LCP ... ok
/login                           JS 142.7 kB · LCP ... ok
/courses/docker-for-developers   JS 187.9 kB · LCP ... ok
all pages within budget
```
Any machine with Docker can run this same image.

## What you built

Sign in, with a hashed fake password, checked by a test. A catalog with search, from the practice API, checked with Zod. A course page with progress, with server data and a client component. A form with React Hook Form and Zod, checked in the browser and on the server. Eight tests and an end-to-end journey. A budget and an accessibility check. A production container.

The honest limits, once more: the users and the secret are fake; the practice API forgets its data when it restarts; the budget numbers come from one laptop; the accessibility check finds only what a machine can find; and nothing was deployed to a real host. Each one has a next step that you already know (a database, a real sign-in, a CI pipeline, a manual accessibility review, a host).

## Common mistakes

1. `ERESOLVE` on `@types/node` when installing Vitest (step 1).
2. Testing Library not cleaning up between tests (step 7).
3. A budget check that leaves the browser cache on (step 8).
4. Auth.js called without `connection()` first, with cache components on (step 9).
5. Trusting the practice API's answer without Zod, or checking only in the browser.
6. Running the end-to-end test twice against an API that remembers the first run.

## Clean up

```bash
docker rm -f m23b17-run
docker rmi m23b17-learner
# stop the practice API (Ctrl+C), then:
find learner/.next -delete
```
Delete `learner/node_modules` and `learner/.env.local` when you are finished.

## Next

Interview tip: if Rahul asks "walk me through a project you built from start to finish", answer with the problem, the tools and why you chose them, one hard bug and how you found it, one number that you measured, and what you would do next. Now you have exactly such a project.

This is the end of the course. Take the final practice sheet: [Module 23 final practice sheet](../../practice/m23-interviews-and-capstone/README.md). You can already read the official documents and keep learning by yourself. Build something small this week.
