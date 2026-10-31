# M17-B12 · Build a Test Suite in CI

> Video: Module 17, Build 12. Watch it first, then follow along here.

Asha builds a test suite for the cart and the login of the allcsvideos.com shop, then lets a robot (CI) run it on every change. The finished project has 12 tests in 5 files (Vitest), 3 tests in a real browser (Playwright) and one GitHub Actions workflow file.

## What you'll learn

- What must never break (cart totals, coupon, one copy of each course, an empty-cart message, login) and which kind of test fits each promise
- Unit tests for `getTotals`, a component test of the cart page, and why a missing label is a real accessibility bug
- Why tests must not leak into each other (store, local storage, query client)
- MSW handlers for the catalog and the login, and a `renderApp` helper with a new query client per test
- Three real-browser tests with Playwright and a `webServer` list
- A GitHub Actions workflow, and running the same commands in a clean copy; why a non-zero exit code turns CI red

## Before you start

- Node 24 (`node --version`). No Docker. Nothing here pushes anywhere or talks to GitHub.
- Earlier lessons of this module (M17-L01 to L04). If you have not installed Playwright's browser: `npx playwright install chromium`.
- Versions (from `package-lock.json`): Vitest 5.0.5, @testing-library/react 16.3.3, user-event 14.6.8, MSW 3.0.3, @playwright/test 1.64.1, TanStack Query 5.x, Zustand 5.x, React Router 8.5.1, React 19.3.1, TypeScript 7.0.2, Vite 8.3.5.
- The practice API is `api/server.mjs` (port 8170). The login `lukas@example.com` / `learn-fast-42` is a demo value for this practice API only.

## Files in this folder

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json`, `vite.config.ts`, `playwright.config.ts`, `tsconfig*.json`, `index.html` | Project setup. Scripts: `test`, `typecheck`, `build`, `e2e`, `workflow:check` |
| `src/cart/` | `totals.ts` (the maths), `cartStore.ts` (Zustand), tests for both |
| `src/pages/` | `Catalog.tsx`, `Cart.tsx`, `LoginPage.tsx`, `MyCourses.tsx` and their component tests (`Cart.test.tsx`, `Catalog.test.tsx`, `Login.test.tsx`) |
| `src/test/` | `setup.ts` (runs around every test), `server.ts` (MSW handlers), `renderApp.tsx` (the render helper) |
| `src/auth/`, `src/components/`, `src/layouts/`, `src/App.tsx`, ... | The shop itself |
| `e2e/shop.spec.ts` | The three browser tests |
| `.github/workflows/ci.yml` | The workflow (GitHub only reads this file at the root of a repo; here it is for study) |
| `scripts/check-workflow.mjs` | Reads the workflow with a YAML parser and lists the steps |
| `api/server.mjs` | The practice API |
| `versions/` | The stages of the build: `setup1.ts`, `setup3.ts`, `setup4.ts`, `totals.floor.ts`, `totals.final.ts`, `Cart.noLabel.tsx`, `Cart.final.tsx`, `Cart.test.t1.tsx`, `Cart.test.final.tsx`, `Catalog.test.t1.tsx`, `Catalog.test.final.tsx`, `renderApp.v4.tsx`, `renderApp.final.tsx` |

`src/` holds the finished state. To replay the build, follow the steps below; each step says which file from `versions/` to copy where. The video moved some files away; do that outside the project folder (`../stash`), because Vitest would find test files inside the project.

## Follow along

### 1. What must never break, and the plan

Cart: the totals, the coupon, one copy of each course, a message when the cart is empty. Login: a wrong password shows the server's sentence, a right one opens My courses, and a visitor who is not signed in is sent to the login page. Use the cheapest test that can still catch the bug (the testing trophy of M17-L04). Six steps: setup, unit tests, component tests, a pretend API, a real browser, the robot (CI).

### 2. Setup

```bash
npm install
```

Two changes make the project testable. `vite.config.ts` has a `test` block: the jsdom pretend browser, one setup file, and a rule to leave the `e2e` folder alone (Playwright runs those). `package.json` has the scripts `test` (`vitest run --reporter=verbose`), `e2e` (`playwright test`), `typecheck` (`tsc -b`) and `workflow:check`.

```ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://localhost:8170' } },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    exclude: ['e2e/**', 'node_modules/**'],
  },
})
```

Prepare the replay: move the page tests and the MSW files out of the way, and use the first (small) setup file and the Cart page without its label:

```bash
mkdir -p ../stash
mv src/pages/Cart.test.tsx src/pages/Catalog.test.tsx src/pages/Login.test.tsx ../stash/
mv src/test/server.ts src/test/renderApp.tsx ../stash/
cp versions/Cart.noLabel.tsx src/pages/Cart.tsx
cp versions/setup1.ts src/test/setup.ts
```

`src/test/setup.ts` (version 1) adds the extra checks like `toBeInTheDocument` and, after each test, cleans the screen (M17-L02):

```ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(cleanup)
```

### 3. Unit tests

`getTotals` takes the items and a coupon and gives back three numbers. It never touches the screen, so its test needs no browser. `src/cart/totals.test.ts` has three promises: 499 + 399 add up to 898 with no discount; `SAVE10` takes 10 percent (89.8, rounded to 90) so the total is 808; a flat `FLAT200` coupon on a course that costs 150 takes only 150 (the total never goes below zero). `src/cart/cartStore.test.ts` adds the same course twice and expects one copy.

```bash
npm test
```

```text
 ✓ src/cart/totals.test.ts > getTotals > adds up the prices 1ms
 ✓ src/cart/totals.test.ts > getTotals > takes ten percent off with SAVE10 0ms
 ✓ src/cart/totals.test.ts > getTotals > never goes below zero 0ms
 ✓ src/cart/cartStore.test.ts > keeps one copy of a course 1ms
      Tests  4 passed (4)
```

Guess: someone changes `Math.round` to `Math.floor` in the totals. Which tests fail?

```bash
cp versions/totals.floor.ts src/cart/totals.ts
npm test
```

```text
 ✓ src/cart/totals.test.ts > getTotals > adds up the prices 1ms
 × src/cart/totals.test.ts > getTotals > takes ten percent off with SAVE10 2ms
   → expected { subtotal: 898, discount: 89, …(1) } to deeply equal { subtotal: 898, discount: 90, …(1) }
 ✓ src/cart/totals.test.ts > getTotals > never goes below zero 0ms
 ✓ src/cart/cartStore.test.ts > keeps one copy of a course 1ms
      Tests  1 failed | 3 passed (4)
```

Exactly one: the `SAVE10` test. The discount should be 90 and it is 89, so the total is 809, not 808. The other two are happy because their numbers have no fractions. Put `round` back:

```bash
cp versions/totals.final.ts src/cart/totals.ts
```

### 4. Component tests

Render the real cart page in the pretend browser and act like a student (M17-L02): two courses in the store, type `save10` into the box named coupon, press Apply, and expect `- Rs 90` and `Rs 808`.

```bash
cp versions/Cart.test.t1.tsx src/pages/Cart.test.tsx
npm test
```

```text
 ✓ src/cart/totals.test.ts > getTotals > adds up the prices 1ms
 ✓ src/cart/totals.test.ts > getTotals > takes ten percent off with SAVE10 0ms
 ✓ src/cart/totals.test.ts > getTotals > never goes below zero 0ms
 ✓ src/cart/cartStore.test.ts > keeps one copy of a course 1ms
 × src/pages/Cart.test.tsx > applies a coupon typed in small letters 52ms
   → Unable to find an accessible element with the role "textbox" and name `/coupon/i`

Here are the accessible roles:

  heading:

  Name "Your cart":
  [36m<h1 />[39m

  --------------------------------------------------
  list:

  Name "":
  [36m<ul[39m
    [33mclass[39m=[32m"lines"[39m
  [36m/>[39m

  --------------------------------------------------
  listitem:

  Name "":
  [36m<li />[39m

  Name "":
  [36m<li />[39m

  --------------------------------------------------
  button:

  Name "Remove":
  [36m<button[39m
    [33mclass[39m=[32m"ghost"[39m
  [36m/>[39m

  Name "Remove":
  [36m<button[39m
    [33mclass[39m=[32m"ghost"[39m
  [36m/>[39m

  Name "Apply":
  [36m<button />[39m

  --------------------------------------------------
  textbox:

  Name "":
  [36m<input[39m
    [33mplaceholder[39m=[32m"Coupon code"[39m
    [33mvalue[39m=[32m""[39m
  [36m/>[39m

  --------------------------------------------------
  paragraph:

  Name "":
  [36m<p[39m
    [33mclass[39m=[32m"err"[39m
  [36m/>[39m

  --------------------------------------------------
  term:

  Name "":
  [36m<dt />[39m

  Name "":
  [36m<dt />[39m

  Name "":
  [36m<dt />[39m

  --------------------------------------------------
  definition:

  Name "":
  [36m<dd />[39m

  Name "":
  [36m<dd />[39m

  Name "":
  [36m<dd />[39m

  --------------------------------------------------
      Tests  1 failed | 4 passed (5)
```

The box has only a placeholder, and a placeholder is not a label. A person with a screen reader would not know what this box is for either: the test just found an accessibility bug (M16, Lesson 3). The fix is one attribute in `Cart.tsx`: `aria-label="Coupon code"` (that is `versions/Cart.final.tsx`):

```bash
cp versions/Cart.final.tsx src/pages/Cart.tsx
npm test
```

```text
      Tests  5 passed (5)
```

Now a mistake almost every beginner meets. Add the second test, an empty cart says "Your cart is empty.":

```bash
cp versions/Cart.test.final.tsx src/pages/Cart.test.tsx
npm test
```

```text
 ✓ src/cart/totals.test.ts > getTotals > adds up the prices 1ms
 ✓ src/cart/totals.test.ts > getTotals > takes ten percent off with SAVE10 0ms
 ✓ src/cart/totals.test.ts > getTotals > never goes below zero 0ms
 ✓ src/cart/cartStore.test.ts > keeps one copy of a course 1ms
 ✓ src/pages/Cart.test.tsx > applies a coupon typed in small letters 75ms
 × src/pages/Cart.test.tsx > says so when the cart is empty 3ms
   → Unable to find an element with the text: Your cart is empty.. This could be because the text is broken up by multiple elements. In this case, you ...
      Tests  1 failed | 5 passed (6)
```

The first test passes and the second fails. Why? The cart store (M10) is one object for the whole file. The first test filled it and the second started with those courses still inside. Tests must never leak into each other. The fix goes in the setup file: after each test, empty the store and clear the local storage (`versions/setup3.ts`).

```bash
cp versions/setup3.ts src/test/setup.ts
npm test
```

```text
 ✓ src/cart/cartStore.test.ts > keeps one copy of a course 1ms
 ✓ src/cart/totals.test.ts > getTotals > adds up the prices 1ms
 ✓ src/cart/totals.test.ts > getTotals > takes ten percent off with SAVE10 0ms
 ✓ src/cart/totals.test.ts > getTotals > never goes below zero 0ms
 ✓ src/pages/Cart.test.tsx > applies a coupon typed in small letters 81ms
 ✓ src/pages/Cart.test.tsx > says so when the cart is empty 2ms
      Tests  6 passed (6)
```

### 5. A pretend API (MSW)

The catalog and the login call the practice API, and in a test we do not want a real server: it is slow, it can be down, and its data can change. MSW answers the request inside the test (M17-L03). `src/test/server.ts` is one file of handlers: a `GET` for the courses (two courses), and a `POST` for the login that sends a token and the name when the email and password are the demo ones, and otherwise `401` with `Wrong email or password`:

```ts
export const handlers = [
  http.get('*/api/courses', () =>
    HttpResponse.json([
      course('react', 'React for Beginners', 499),
      course('sql', 'SQL in Two Weeks', 399),
    ]),
  ),
  http.get('*/api/me/courses', () =>
    HttpResponse.json([
      {
        slug: 'react',
        title: 'React for Beginners',
        teacher: 'Meera',
        lessonCount: 4,
        completedCount: 2,
      },
    ]),
  ),
  http.post('*/api/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as typeof GOOD
    if (email === GOOD.email && password === GOOD.password) {
      const user = { id: 1, name: 'Lukas', email, role: 'student' }
      return HttpResponse.json({ accessToken: 'test-token', user })
    }
    return HttpResponse.json(
      { error: 'Wrong email or password' },
      { status: 401 },
    )
  }),
]

export const server = setupServer(...handlers)
```

The setup file grows by four lines (`versions/setup4.ts`): start the server before all tests with `onUnhandledFrame: 'error'`, reset handlers after each test, close at the end. `renderApp` shows the whole app at any address (router, auth context and a query client):

```bash
mv ../stash/server.ts src/test/server.ts
cp versions/setup4.ts src/test/setup.ts
cp versions/renderApp.v4.tsx src/test/renderApp.tsx
mv ../stash/Login.test.tsx src/pages/Login.test.tsx
cp versions/Catalog.test.t1.tsx src/pages/Catalog.test.tsx
```

`Login.test.tsx` has four tests. A wrong password waits with `findByRole('alert')` for the server's sentence. The right password waits for the heading "Welcome, Lukas" and his course: one test walks the whole path (form, request, answer, context, new route, query for the courses). A visitor who opens My courses without logging in lands on the login page (no server needed). And with `server.use(http.post('*/api/auth/login', () => HttpResponse.error()))` the page must say "Something went wrong" instead of crashing; the reset in the setup file drops that override for the next test.

```bash
npm test
```

```text
 ✓ src/cart/cartStore.test.ts > keeps one copy of a course 1ms
 ✓ src/cart/totals.test.ts > getTotals > adds up the prices 1ms
 ✓ src/cart/totals.test.ts > getTotals > takes ten percent off with SAVE10 0ms
 ✓ src/cart/totals.test.ts > getTotals > never goes below zero 0ms
 ✓ src/pages/Catalog.test.tsx > lists the courses and adds one to the cart 100ms
 ✓ src/pages/Cart.test.tsx > applies a coupon typed in small letters 85ms
 ✓ src/pages/Cart.test.tsx > says so when the cart is empty 2ms
 ✓ src/pages/Login.test.tsx > shows the message for a wrong password 141ms
 ✓ src/pages/Login.test.tsx > shows the courses of the student 75ms
 ✓ src/pages/Login.test.tsx > sends a visitor to the login page 3ms
 ✓ src/pages/Login.test.tsx > says so when the network fails 70ms
      Tests  11 passed (11)
```

The same idea for the catalog: the courses request fails and the page must say "Could not load the courses." (`Catalog.test.final.tsx`, with an extra test):

```bash
cp versions/Catalog.test.final.tsx src/pages/Catalog.test.tsx
npm test
```

```text
 ✓ src/cart/totals.test.ts > getTotals > adds up the prices 1ms
 ✓ src/cart/totals.test.ts > getTotals > takes ten percent off with SAVE10 0ms
 ✓ src/cart/totals.test.ts > getTotals > never goes below zero 0ms
 ✓ src/cart/cartStore.test.ts > keeps one copy of a course 1ms
 ✓ src/pages/Cart.test.tsx > applies a coupon typed in small letters 78ms
 ✓ src/pages/Cart.test.tsx > says so when the cart is empty 2ms
 ✓ src/pages/Catalog.test.tsx > lists the courses and adds one to the cart 93ms
 ✓ src/pages/Login.test.tsx > shows the message for a wrong password 126ms
 ✓ src/pages/Login.test.tsx > shows the courses of the student 74ms
 ✓ src/pages/Login.test.tsx > sends a visitor to the login page 3ms
 ✓ src/pages/Login.test.tsx > says so when the network fails 70ms
 × src/pages/Catalog.test.tsx > shows a message when the server is down 1006ms
   → Unable to find role="alert"
      Tests  1 failed | 11 passed (12)
```

Why? TanStack Query (M11) retries a failed request three times, waiting longer each time, before it gives up. The test waited one second. In tests the first failure must count, so `renderApp` makes a new query client for every test with `retry: false` (`versions/renderApp.final.tsx`). A new client per test also means the cache of one test never leaks into the next.

```bash
cp versions/renderApp.final.tsx src/test/renderApp.tsx
npm test
```

```text
 ✓ src/cart/cartStore.test.ts > keeps one copy of a course 1ms
 ✓ src/cart/totals.test.ts > getTotals > adds up the prices 1ms
 ✓ src/cart/totals.test.ts > getTotals > takes ten percent off with SAVE10 0ms
 ✓ src/cart/totals.test.ts > getTotals > never goes below zero 0ms
 ✓ src/pages/Cart.test.tsx > applies a coupon typed in small letters 75ms
 ✓ src/pages/Cart.test.tsx > says so when the cart is empty 2ms
 ✓ src/pages/Catalog.test.tsx > lists the courses and adds one to the cart 85ms
 ✓ src/pages/Catalog.test.tsx > shows a message when the server is down 8ms
 ✓ src/pages/Login.test.tsx > shows the message for a wrong password 129ms
 ✓ src/pages/Login.test.tsx > shows the courses of the student 77ms
 ✓ src/pages/Login.test.tsx > sends a visitor to the login page 4ms
 ✓ src/pages/Login.test.tsx > says so when the network fails 67ms
      Tests  12 passed (12)
```

All twelve pass. `src/` is now the finished project again.

### 6. A real browser

Everything so far ran in a pretend browser with a pretend API. `playwright.config.ts` has a `webServer` list that starts the practice API (port 8170) and the dev server (port 5782), waits until both answer, and sets the base address. `e2e/shop.spec.ts` has three tests: the whole shopping trip (add two courses from their cards, open the Cart link, type `save10`, Apply, expect `- Rs 90` and `Rs 808`), a login with the right password (heading "Welcome, Lukas" and his course) and a login with a wrong password (the alert with the sentence of the real practice API, not our handler: if our pretend answer and the real server ever disagree, this test tells us).

```bash
npx playwright install chromium
npm run e2e
```

```text
Running 3 tests using 1 worker
  ✓  1 e2e/shop.spec.ts:3:1 › shopping trip with a coupon (648ms)
  ✓  2 e2e/shop.spec.ts:24:1 › login shows the courses (647ms)
  ✓  3 e2e/shop.spec.ts:36:1 › wrong password shows the message (367ms)
  3 passed (2.7s)
```

Unit tests take milliseconds, a component test a few milliseconds up to about a second, a browser test about half a second here, but the browser command also has to start two servers and a browser first. In a big app that adds up, so keep browser tests few: one for the shopping trip and two for the login.

### 7. The robot: CI

CI needs a provider. GitHub Actions is a common one: a YAML file in `.github/workflows/`. On every push or pull request GitHub starts a clean machine and does what the file says, top to bottom; if a step fails, the run turns red. We do not push anything: we write the real workflow file, check that it is valid YAML, and run the same commands in a clean copy on this machine.

```yaml
name: CI

on:
  push:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
      - run: npx playwright install --with-deps chromium
      - run: npm run e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report
```

`npm ci` installs exactly what the lock file says. The last step runs only when something failed and keeps the Playwright report. Check the file with a small script:

```bash
npm run workflow:check
```

```text
.github/workflows/ci.yml: valid YAML, 9 steps
 - actions/checkout@v4
 - actions/setup-node@v4
 - npm ci
 - npm run typecheck
 - npm test
 - npm run build
 - npx playwright install --with-deps chromium
 - npm run e2e
 - actions/upload-artifact@v4
```

A typo like a wrong indent would stop here, before any robot sees it. Now the clean copy: copy the project to a new folder without `node_modules` and run the commands of the file in order:

```bash
npm ci
npm run typecheck
npm test
npm run build
npm run e2e
```

Real results from my clean copy: `npm ci` added 161 packages, `typecheck` printed nothing (exit code 0), `npm test` ended with `Test Files  5 passed (5)` and `Tests  12 passed (12)`, `npm run build` printed `✓ built in` about half a second, and `npm run e2e` ended with `3 passed`.

Now make it fail on purpose. In the clean copy change `Math.round` back to `Math.floor` in `src/cart/totals.ts` and run `npm test`:

```text
 ✓ src/cart/cartStore.test.ts > keeps one copy of a course 1ms
 ✓ src/cart/totals.test.ts > getTotals > adds up the prices 2ms
 × src/cart/totals.test.ts > getTotals > takes ten percent off with SAVE10 4ms
   → expected { subtotal: 898, discount: 89, …(1) } to deeply equal { subtotal: 898, discount: 90, …(1) }
 ✓ src/cart/totals.test.ts > getTotals > never goes below zero 0ms
 × src/pages/Cart.test.tsx > applies a coupon typed in small letters 121ms
   → Unable to find an element with the text: - Rs 90. This could be because the text is broken up by multiple elements. In this case, you can provide ...

 ✓ src/pages/Cart.test.tsx > says so when the cart is empty 3ms
 ✓ src/pages/Catalog.test.tsx > lists the courses and adds one to the cart 133ms
 ✓ src/pages/Catalog.test.tsx > shows a message when the server is down 10ms
 ✓ src/pages/Login.test.tsx > shows the message for a wrong password 188ms
 ✓ src/pages/Login.test.tsx > shows the courses of the student 83ms
 ✓ src/pages/Login.test.tsx > sends a visitor to the login page 4ms
 ✓ src/pages/Login.test.tsx > says so when the network fails 73ms
      Tests  2 failed | 10 passed (12)
```

Two tests fail (the unit test about `SAVE10` and the component test of the cart page, which now shows 89) and the exit code of `npm test` is 1. A robot reads only that number: not zero means red, the later steps never run, and the change cannot be merged. Put `round` back.

## What goes wrong in real CI

1. Tests that pass and fail at random. Never wait with a fixed sleep; wait for something on the page, as `findBy` and `expect` do.
2. Secrets. Never put a real password in a workflow file; ours is a practice password for a practice API.
3. Slow runs. Cache the packages and keep the browser tests few.
4. Make the check required, so a red run really blocks the merge.

## Common mistakes

- A coupon box with only a placeholder: no label, and the test cannot find it by name.
- A shared store or local storage that one test fills and the next one inherits.
- A query client shared between tests, or one that retries failed requests, so error tests time out.
- Keeping stashed test files inside the project folder: Vitest runs them.

## Clean up

Move the stashed files back (they are all restored by the steps above). Delete the clean copy, `dist/`, `playwright-report/`, `test-results/` and `node_modules/` when you are done; the `.gitignore` here keeps them out of git.

## Key points

- Pick the cheapest test that can catch the bug: unit tests for the maths, component tests with a pretend API for a page, a real browser for the whole trip.
- Tests must not leak: empty the store after each test, drop one-off answers, give each test a new query client. Find things by role and name; a missing label is a real bug.
- CI runs the same commands on a clean machine: clean install, type check, tests, build, browser tests. An exit code that is not zero turns the run red.

Interview tip. If Rahul, the interviewer, asks "what do you test in a React app, and where?": logic in unit tests, screens in component tests with a mocked network, a few key journeys in a real browser, and all of it in CI on every pull request.

## Try it yourself

1. A coverage report, to see which lines no test touches (`vitest run --coverage`).
2. Run the browser tests in three browsers.
3. Add a lint step next to type check (the next module builds it).

## Next

[M18-L01 · Linting, Formatting and Strict Mode](../../m18-tooling-structure-and-debugging/m18-l01-linting-formatting-and-strict-mode/README.md)
