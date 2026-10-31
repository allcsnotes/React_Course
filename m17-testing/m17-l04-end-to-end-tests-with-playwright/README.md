# M17-L04 · End-to-End Tests with Playwright

> Video: Module 17, Lesson 4. Watch it first, then follow along here.

## What you'll learn

- Why green component tests can still hide a page that is broken for a real person
- What an end-to-end (E2E) test is, and how Playwright drives a real browser
- Setup: the Playwright config, a `webServer` list that starts your API and site for you
- Locators by role, label and text, auto-waiting, and `expect` checks that keep trying
- How to debug a failure: the error and call log, the HTML report, the trace
- The testing trophy: the cheapest test that can see the problem
- Four mistakes: a locator that matches many things, a CSS-class locator, reading once and sleeping, a missing `await`

## Before you start

- Node 24 (`node --version`). No Docker.
- Earlier: M17-L01 to L03 (component tests). This folder is complete on its own.
- Versions (from `package-lock.json`): @playwright/test 1.64.1, Vitest 5.0.5, React 19.3.1, react-router 8.5.1, TypeScript 7.0.2, Vite 8.3.5. The browser is Chromium; if you have never used Playwright, download it once with `npx playwright install chromium` (about 150 MB).
- The practice API is `api/server.mjs`, a small Node stand-in on port 8174 that answers after 600 ms. It is not a real server, and every course and coupon is demo data. The site runs on port 5174.

## Files in this folder

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig*.json`, `index.html` | Project setup (scripts: `dev`, `test` for Vitest, `e2e` for Playwright) |
| `playwright.config.ts` | Playwright settings and the `webServer` list |
| `tests/shop.spec.ts`, `tests/checkout.spec.ts` | The E2E tests: add to cart, and buy two courses with a coupon (4 tests) |
| `src/` | The shop: `Catalog`, `CourseCard`, `Cart`, `CartContext`, `totals.ts` and the component tests (`CourseCard.test.tsx`, `totals.test.ts`) |
| `api/server.mjs` | The practice API (courses, coupons, orders) |
| `variants/app/App.bug.tsx`, `App.fixed.tsx` | Asha's page with the invisible layer, and the page without it |
| `variants/tests/m*.spec.ts` | The four mistakes of the lesson |

`src/App.tsx` starts as the fixed version.

## Follow along

```bash
npm install
npx playwright install chromium
```

### 1. The problem: green tests, a broken page

Asha's component tests are green:

```bash
npm test
```

```text
 Test Files  2 passed (2)
      Tests  3 passed (3)
```

(Vitest, as in lessons 1 to 3: two files, three tests.) But Lukas presses Add to cart on React for Beginners and nothing happens. Each of her tests draws one piece of the page inside a pretend browser. No test ever opened the whole site in a real browser and pressed a button with a real mouse. An E2E test does that. Think of a new car: bench tests of each part (unit tests), then checks that parts work together (component tests), then someone drives it on a real road (E2E).

### 2. Setup

```bash
npm install -D @playwright/test@1.64.1
npx playwright install chromium
```

`playwright.config.ts` is the one settings file:

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 15_000,
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5174',
    trace: 'retain-on-failure',
    actionTimeout: 4_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'node api/server.mjs',
      url: 'http://localhost:8174/api/orders',
      reuseExistingServer: true,
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:5174',
      reuseExistingServer: true,
    },
  ],
})
```

- `testDir` says where tests live; `timeout` is how long one test may take (15 s); `actionTimeout` is how long the robot may try one click or typing (4 s).
- `baseURL` lets tests say just `/`.
- `trace: 'retain-on-failure'` records every test and keeps the recording only when the test fails.
- `webServer` starts the practice API and the site (`npm run dev`) before the tests, waits until both answer, and stops them afterwards. If they are already running it reuses them.

### 3. The first test

The story of Lukas, as a recipe: open the home page, find the card of React for Beginners, press its Add to cart button, then check that the button now says In cart and cannot be pressed again, and that the cart link says Cart (1).

```ts
import { test, expect } from '@playwright/test'

test('a student adds a course to the cart', async ({ page }) => {
  await page.goto('/')
  const card = page.getByRole('listitem').filter({ hasText: 'React for Beginners' })
  await card.getByRole('button', { name: 'Add to cart' }).click()
  await expect(card.getByRole('button', { name: 'In cart' })).toBeDisabled()
  await expect(page.getByRole('link', { name: 'Cart (1)' })).toBeVisible()
})
```

`page` is one fresh browser tab. A locator is a description of a thing in words a person would use; roles and names are the same list a screen reader uses (Module 16, Lesson 3). There is no waiting code: the courses arrive after 600 ms, but Playwright waits before every action until the element is there, visible, enabled and standing still (auto-waiting). The two `expect` lines keep checking for up to 5 seconds.

Guess first. Use Asha's page, the one Lukas found:

```bash
cp variants/app/App.bug.tsx src/App.tsx
npx playwright test tests/shop.spec.ts
```

Real result (shortened):

```text
  ✘  1 [chromium] › tests/shop.spec.ts:3:1 › a student adds a course to the cart (4.3s)

    TimeoutError: locator.click: Timeout 4000ms exceeded.
    Call log:
      - waiting for getByRole('listitem').filter({ hasText: 'React for Beginners' }).getByRole('button', { name: 'Add to cart' })
        - locator resolved to <button>Add to cart</button>
      - attempting click action
        2 × waiting for element to be visible, enabled and stable
          - element is visible, enabled and stable
          - scrolling into view if needed
          - done scrolling
          - <div class="backdrop"></div> intercepts pointer events
        - retrying click action
```

The robot found the button, tried to press it, and says why it could not: a `div` with the class `backdrop` intercepts pointer events. A welcome pop-up was removed but its backdrop stayed: a full-screen `div` with no colour. Eyes cannot see it, and a component test cannot see it either because it draws the card alone. Only the robot, pressing like a real hand, felt it. Delete the line `<div className="backdrop" />` (that is `variants/app/App.fixed.tsx`) and run again:

```bash
cp variants/app/App.fixed.tsx src/App.tsx
npx playwright test tests/shop.spec.ts
```

```text
  ✓  1 [chromium] › tests/shop.spec.ts:3:1 › a student adds a course to the cart (1.3s)

  1 passed (2.1s)
```

### 4. Seeing what the robot saw

1. **The error.** Its call log lists every step in order, like a diary (above).
2. **The HTML report.** `npx playwright show-report` opens a page with every test of the run; a failed test has a red cross, its time, the same error and screenshots. The config writes the report after every run and never opens it by itself.
3. **The trace.** `npx playwright show-trace test-results/<test folder>/trace.zip` opens a viewer: the steps on the left (Navigate, then Click in red), the page as it was at each step in the middle, the call log underneath, plus console and network. Use the trace first, before you guess.

Two more helpers that the video only names: `npx playwright test --ui` (run tests one by one in a window) and `npx playwright codegen` (click through the site and Playwright writes test lines). Use codegen to start, then tidy the code.

### 5. The whole story: checkout

`tests/checkout.spec.ts` has four tests. The first buys two courses with a coupon, using a small helper `addCourse` (tests are code too, repeated lines deserve a helper):

```ts
import { test, expect, type Page } from '@playwright/test'

async function addCourse(page: Page, title: string) {
  const card = page.getByRole('listitem').filter({ hasText: title })
  await card.getByRole('button', { name: 'Add to cart' }).click()
}

test('a student buys two courses with a coupon', async ({ page }) => {
  await page.goto('/')
  await addCourse(page, 'React for Beginners')
  await addCourse(page, 'SQL in Two Weeks')
  await page.getByRole('link', { name: 'Cart (2)' }).click()
  await page.getByLabel('Coupon code').fill('SAVE10')
  await page.getByRole('button', { name: 'Apply' }).click()
  await expect(page.getByText('Total: Rs 808')).toBeVisible()
  await page.getByRole('button', { name: 'Pay now' }).click()
  await expect(page.getByText('Order confirmed')).toBeVisible()
})
```

`getByLabel('Coupon code')` finds the box by the label a person reads. 499 + 399 = 898, minus 10 percent = 808. The order really goes to the practice API and comes back. Two more small tests: an unknown coupon shows "That code does not exist" (found by role `alert`), and a visit to the empty cart.

```bash
npx playwright test
```

```text
Running 4 tests using 4 workers

  ✓  1 [chromium] › tests/checkout.spec.ts:29:1 › the cart starts empty (656ms)
  ✓  4 [chromium] › tests/shop.spec.ts:3:1 › a student adds a course to the cart (1.4s)
  ✓  2 [chromium] › tests/checkout.spec.ts:20:1 › an unknown coupon shows a message (1.5s)
  ✓  3 [chromium] › tests/checkout.spec.ts:8:1 › a student buys two courses with a coupon (2.4s)

  4 passed (3.4s)
```

(Your times will differ.) The tests ran at the same time in four tabs because the config says `fullyParallel`, and they did not disturb each other because every test gets its own brand-new browser context: an empty cart, nothing left from the test before. Tests that depend on each other are the first thing to avoid.

### 6. Which test, at which level?

The three component and unit tests ran in about 1.25 seconds (mostly start-up); the four robot tests in about 3.4. A robot test is the first to break when anything around it changes: the network, or a slow machine. So choose the cheapest test that can see the problem. People draw it as a trophy: static checks (TypeScript, a linter) at the base, unit tests for plain logic above, the widest part is integration (component tests with a pretend server), and a small number of E2E tests on top.

- Ten percent off 898: a unit test (`totals.test.ts`), in milliseconds.
- The red message for an unknown coupon: a component test, or one robot test.
- The invisible layer: only the robot can see it.
- The whole purchase: one journey.

What deserves a robot? The journeys that must never break, because money or trust depends on them: sign up, log in, find a course, enroll and pay. A good first suite has three to five. Robot tests can be flaky (pass today, fail tomorrow with no change in the code); most flakiness is about timing, and the cure is the waiting checks above.

## Common mistakes

Copy each variant into `tests/` and run it (fixed page in `src/App.tsx`); delete the file afterwards.

### 1. A locator that matches many things

```bash
cp variants/tests/m1-strict.spec.ts tests/ && npx playwright test tests/m1-strict.spec.ts
```

```text
Error: locator.click: Error: strict mode violation: getByRole('button', { name: 'Add to cart' }) resolved to 4 elements:
    1) <button>Add to cart</button> aka getByRole('listitem').filter({ hasText: 'React for BeginnersMeera · Rs' }).getByRole('button')
    2) <button>Add to cart</button> aka getByRole('listitem').filter({ hasText: 'Python from ZeroMeera ·' }).getByRole('button')
    ...
```

Playwright refuses to guess and lists all four. Make the locator more precise: pick the card first, as `shop.spec.ts` does.

### 2. A locator built from a style class

```bash
cp variants/tests/m2-css.spec.ts tests/ && npx playwright test tests/m2-css.spec.ts
```

`page.locator('.add-btn')`: the page has no such class (this is what happens the day somebody renames one). After 4 seconds the robot says only `waiting for locator('.add-btn').first()`. Roles and visible text change much less often, because they are what the user sees.

### 3. Reading the page once, and sleeping

`m3-snapshot.spec.ts` counts the cards right after `goto`:

```text
Error: expect(received).toBe(expected) // Object.is equality
Expected: 4
Received: 0
```

`count()` looks once and answers at once; the courses have not arrived. The usual cure is a sleep (`m3-sleep.spec.ts`, `waitForTimeout(3000)`): it passes, in 3.3 seconds, and on a slow day 3 seconds is still not enough. The real cure is a waiting check (`m3-expect.spec.ts`): `await expect(page.getByRole('listitem')).toHaveCount(4)` passes in 1.0 second and waits only as long as needed.

### 4. Forgetting `await`

`m4-noawait.spec.ts` writes `expect(page.getByRole('link', { name: 'Cart (9)' })).toBeVisible()` with no `await`. Actions and checks return promises (Module 2, Lesson 5). The check starts, the test moves on and ends, and Playwright complains. In my run the message was:

```text
Error: expect(locator).toBeVisible() failed
Locator:  getByRole('link', { name: 'Cart (9)' })
Expected: visible
Received: undefined
```

(The video showed the wording "test ended, while the check was still waiting"; the exact message depends on timing.) When you see an odd failure like this, look for a missing `await`.

## Clean up

Playwright stops the API and the site it started. Remove the specs you copied into `tests/`, and delete the `playwright-report/` and `test-results/` folders (the `.gitignore` here keeps them out of git). `cp variants/app/App.fixed.tsx src/App.tsx` restores the fixed page.

## Key points

- An E2E test drives a real browser like a user. It finds what component tests cannot, such as an invisible layer on top of a button.
- Find things by role, label and text. Never sleep: Playwright waits before actions and `expect` checks keep trying. When a test fails, read the call log, then open the report and the trace.
- Use the cheapest test that can see the problem: static checks, unit tests, component tests, and a few journeys end to end.

Interview tip. If Rahul, the interviewer, asks "what do you test at which level?": logic and components at the cheap levels, and only the few journeys that must never break end to end, because those tests are slow and the first to turn flaky.

## Try it yourself

Write a Playwright test that adds a course to the cart, then presses Remove, and checks that the cart is empty.

## Next

[M17-B12 · Build a Test Suite in CI](../m17-b12-build-a-test-suite-in-ci/README.md)
