# M17-L01 · Your First Test

> Video: Module 17, Lesson 1. Watch it first, then follow along here.

## What you'll learn

- What a test is: set up, act, assert (an assertion is a sentence that says "this must be true")
- How to set up Vitest, jsdom and React Testing Library in a Vite project
- How to write and run your first tests, and how to read a failure from the top
- How to test a component: `render`, `screen`, `getByText`, `toBeInTheDocument`, `toBeDisabled`
- What to test (what a person sees and does) and how to name tests
- Three real mistakes: a typo in the text, no pretend browser, a test that checks nothing

## Before you start

- Node 24 (`node --version`). No Docker needed.
- This folder is the finished project of the lesson: a Vite + React 19.3.1 + TypeScript 7.0.2 course page for allcsvideos.com with two courses. If you took the Python course, the idea is the same as pytest in Module 13, Lesson 1.
- Versions used: Vitest 5.0.5, jsdom 30.1.3, @testing-library/react 16.3.3, @testing-library/dom 10.4.2, @testing-library/jest-dom 7.0.1, Vite 8.3.5.

## Files in this folder

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | Pinned project, with a `test` script that runs `vitest run` |
| `vite.config.ts` | Vite config with the `test` section (jsdom, setup file, verbose reporter) |
| `src/setup.ts` | One line: imports the jest-dom helpers |
| `src/format.ts` | `formatPrice(cents)`, the function Asha tidied |
| `src/format.test.ts` | Two tests for `formatPrice` |
| `src/CourseCard.tsx`, `src/CourseCard.test.tsx` | The course card and its two tests |
| `src/App.tsx`, `src/main.tsx`, `src/index.css` | The course page (two cards) |
| `versions/` | `format.bug.ts` and `format.good.ts` (the broken and the right function), the mistake files (`enrol.test.tsx.txt`, `price.test.tsx.txt`, `badge.test.tsx.txt`) and the two Vite configs |

## Follow along

### 1. The problem: a price that looks almost right

```bash
npm install
npm run dev
```

With the right function the page shows `$49.90` and `$39.00`. Now copy the tidied (broken) function over `src/format.ts`:

```bash
cp versions/format.bug.ts src/format.ts
```

The page now shows (real text from my run):

```text
allcsvideos · Courses | React from Zero | $49.9 | 12 seats left | 20% off | Enroll | Python for APIs | $39 | 0 seats left | Sold out
```

$49.90 shows as `$49.9`, and $39 has no cents at all. Nobody noticed, until a student asked if the price was a typo. Put the right function back:

```bash
cp versions/format.good.ts src/format.ts
```

### 2. What a test is

A test is a small piece of code that runs a piece of your app, looks at the result, and says pass or fail. Every test has three steps: set the thing up, do something with it, check the result against what you expected (the assertion). Vitest is the test runner (finds test files, runs every test, prints the result). React Testing Library draws a component the way a browser would, so a test can look at what came out.

### 3. Setup

In a fresh project you install five small packages as development tools (`-D` means tools for you, never shipped to students):

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom
```

This folder already has them. jsdom is a pretend browser: a program inside Node that has a page with elements and text. A test has no screen, so it needs a pretend page to draw in. The jest-dom helper adds sentences like `toBeInTheDocument`.

`vite.config.ts` has a `test` section. The environment is jsdom, the setup file runs before every test file, and `reporters: ['verbose']` prints one line per test:

```ts
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setup.ts',
    reporters: ['verbose'],
  },
})
```

`src/setup.ts` only imports the helper:

```ts
import '@testing-library/jest-dom/vitest'
```

And `package.json` has one script, `"test": "vitest run"` (run once, then stop).

### 4. The first test: a function

`src/format.ts`:

```ts
export function formatPrice(cents: number): string {
  return '$' + (cents / 100).toFixed(2)
}
```

`src/format.test.ts` sits beside it, and its name ends in `.test.ts`. Read it line by line: import `test` and `expect` from Vitest; `test` takes a sentence that says what should be true and a function with the steps; `expect` takes the real result and `toBe` says what it must equal.

```ts
import { expect, test } from 'vitest'
import { formatPrice } from './format'

test('formats cents as dollars with two decimals', () => {
  expect(formatPrice(4990)).toBe('$49.90')
})

test('a whole-dollar price keeps its two decimals', () => {
  expect(formatPrice(3900)).toBe('$39.00')
})
```

A guess first: the function is correct right now. What will the terminal show? Run it:

```bash
npm test format
```

```text
> web@0.0.0 test
> vitest run format


 RUN  v5.0.5 /path/to/your-project

 ✓ src/format.test.ts > formats cents as dollars with two decimals 1ms
 ✓ src/format.test.ts > a whole-dollar price keeps its two decimals 0ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  14:39:36
   Duration  329ms (environment 86%, setup 11%, transform 1%, worker 1%, import 1%)
```

Two ticks, then the summary. A green tick is nice, but a test is only useful if it can fail. Break the function on purpose (take away the two decimals):

```bash
cp versions/format.bug.ts src/format.ts
npm test format
```

```text
> web@0.0.0 test
> vitest run format


 RUN  v5.0.5 /path/to/your-project

 × src/format.test.ts > formats cents as dollars with two decimals 3ms
   → expected '$49.9' to be '$49.90' // Object.is equality
 × src/format.test.ts > a whole-dollar price keeps its two decimals 0ms
   → expected '$39' to be '$39.00' // Object.is equality

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/format.test.ts > formats cents as dollars with two decimals
AssertionError: expected '$49.9' to be '$49.90' // Object.is equality

Expected: "$49.90"
Received: "$49.9"

 ❯ src/format.test.ts:5:29
      3|
      4| test('formats cents as dollars with two decimals', () => {
      5|   expect(formatPrice(4990)).toBe('$49.90')
       |                             ^
      6| })
      7|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  src/format.test.ts > a whole-dollar price keeps its two decimals
AssertionError: expected '$39' to be '$39.00' // Object.is equality

Expected: "$39.00"
Received: "$39"

 ❯ src/format.test.ts:9:29
      7|
      8| test('a whole-dollar price keeps its two decimals', () => {
      9|   expect(formatPrice(3900)).toBe('$39.00')
       |                             ^
     10| })
     11|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯
```

Read a failure from the top: a cross marks each failed test with its sentence; then the line that matters, `expected '$49.9' to be '$49.90'`; then Expected and Received, what the test asked for and what the code gave; and an arrow points at the exact line of the test.

Put the two decimals back (`cp versions/format.good.ts src/format.ts`) and run again: green. This is the whole loop: write a check and watch it pass, break the code and watch it fail, fix the code and watch it pass. A test you have seen fail is a test you can trust.

### 5. Testing a component

The card takes a `course` and draws a title, a price, a seat count, a badge and a button:

```tsx
import { formatPrice } from './format'

export type Course = {
  id: number
  title: string
  priceCents: number
  percentOff: number
  seatsLeft: number
}

export function CourseCard({ course }: { course: Course }) {
  const soldOut = course.seatsLeft === 0
  return (
    <article className="card">
      <h2>{course.title}</h2>
      <p className="price">{formatPrice(course.priceCents)}</p>
      <p className="seats">{course.seatsLeft} seats left</p>
      {course.percentOff > 0 && <span className="badge">{course.percentOff}% off</span>}
      <button disabled={soldOut}>{soldOut ? 'Sold out' : 'Enroll'}</button>
    </article>
  )
}
```

The test file has two parts. At the top, the imports and the course data (exactly what the card receives as props). Then the tests: `render` draws the card into the pretend page, `screen` is that whole page, `getByText` looks for an element holding exactly that text (if there is none it throws, and the test fails), and `toBeInTheDocument` says it is really there. The second test copies the course with `{ ...course, seatsLeft: 0 }`, and the button should say Sold out and be disabled.

```tsx
test('shows the title, the price and an Enroll button', () => {
  render(<CourseCard course={course} />)
  expect(screen.getByText('React from Zero')).toBeInTheDocument()
  expect(screen.getByText('$49.90')).toBeInTheDocument()
  expect(screen.getByText('Enroll')).toBeInTheDocument()
})

test('a sold-out course has a disabled button', () => {
  render(<CourseCard course={{ ...course, seatsLeft: 0 }} />)
  expect(screen.getByText('Sold out')).toBeDisabled()
})
```

Run everything:

```bash
npm test
```

```text
> web@0.0.0 test
> vitest run


 RUN  v5.0.5 /path/to/your-project

 ✓ src/format.test.ts > formats cents as dollars with two decimals 1ms
 ✓ src/format.test.ts > a whole-dollar price keeps its two decimals 0ms
 ✓ src/CourseCard.test.tsx > shows the title, the price and an Enroll button 11ms
 ✓ src/CourseCard.test.tsx > a sold-out course has a disabled button 1ms

 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  14:36:29
   Duration  398ms (environment 84%, setup 10%, import 2%, tests 2%, transform 1%, worker 1%)
```

Four ticks: two tests for the function, two for the card.

Now put the bug back (`cp versions/format.bug.ts src/format.ts`) and run `npm test`. Which card test fails? Guess. Real result: the first card test fails and the sold-out test still passes. Look at the message: `Unable to find an element with the text: $49.90`. It also prints the whole page it drew, so you can see what was really there. The price element holds:

```text
 × src/CourseCard.test.tsx > shows the title, the price and an Enroll button 14ms
   → Unable to find an element with the text: $49.90. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.
```



(the part of the printed page that matters; the rest of the card is printed too.)

The sold-out test never looks at the price, so it has nothing to complain about. Each test protects one promise. And a bug in a small helper was caught by a test of the card, because the card is what a student sees. Fix the function again with `cp versions/format.good.ts src/format.ts`.

### 6. What to test and how to name it

Test what a person sees and does, not how the code is built inside. If Asha renames a variable or moves a line, no test should break. If a price shows wrong, one test should. Name every test as a sentence that describes the page ("shows the title and the price", "a sold-out course has a disabled button"), so the name tells you what broke before you read any code.

## Common mistakes

### 1. A typo in the text

```bash
cp versions/enrol.test.tsx.txt src/enrol.test.tsx
npm test enrol
```

The test looks for `Enrol` with one L. The error says `Unable to find an element with the text: Enrol` and, right under it, prints the page that was drawn. There you can see the real word is `Enroll`. Read the printed page first, because the answer is usually there. Delete the file when you are done (`rm src/enrol.test.tsx`).

### 2. Forgetting the pretend browser

```bash
cp vite.config.ts versions/vite.config.good.ts
cp versions/vite.config.nojsdom.ts vite.config.ts
npm test CourseCard
```

With no `environment: 'jsdom'`, every card test stops with:

```text
 × src/CourseCard.test.tsx > shows the title, the price and an Enroll button 2ms
   → document is not defined
 × src/CourseCard.test.tsx > a sold-out course has a disabled button 0ms
   → document is not defined
```

A plain Node program has no page at all. Put the config back (`cp versions/vite.config.good.ts vite.config.ts`) and the tests run.

### 3. A test that checks nothing

```bash
cp versions/price.test.tsx.txt src/price.test.tsx
npm test price
```

This test draws the card and never calls `expect`:

```text

test('shows the price', () => {
  render(<CourseCard course={course} />)
})
```

It passes (`1 passed`), even while the price is broken. A test that cannot fail is worse than no test, because it makes you feel safe. Always see a new test fail once. Delete it afterwards (`rm src/price.test.tsx`).

## Clean up

Remove any test file you copied into `src/` (`enrol.test.tsx`, `price.test.tsx`, `badge.test.tsx`), make sure `src/format.ts` is the good version and `vite.config.ts` has `environment: 'jsdom'`. Stop `npm run dev` with Ctrl+C. `node_modules/` can be deleted any time.

## Key points

- A test is a small program that checks one promise and says pass or fail: set up, act, assert.
- Vitest runs the tests, jsdom is the pretend browser, React Testing Library draws the component.
- Write a test and watch it fail, then make it pass. Read a failure from the top: expected, received, which line.
- Test what a person sees, and name each test as a sentence.

Interview tip. If Rahul, the interviewer, asks "why do we write tests?": so we can change code without fear. A test is a safety net that checks the promises of the app in seconds, every time, and a good test checks what the user sees, not how the code is built.

## Try it yourself

Add a third card test: a course with 20 percent off shows the text `20% off`. Write it, then break the badge on purpose in `CourseCard.tsx` and watch the test fail. (A finished version is in `versions/badge.test.tsx.txt`; try first.)

## Next

[M17-L02 · Testing Like a User](../m17-l02-testing-like-a-user/README.md)
