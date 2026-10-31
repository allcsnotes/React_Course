# M17-L02 · Testing Like a User

> Video: Module 17, Lesson 2. Watch it first, then follow along here.

## What you'll learn

- Why a test that looks for a class name can stay green while a real person cannot enroll
- Queries by role (`getByRole`) and the order: role, label, text, test id
- `user-event` to act like a person (click, type, tab, keyboard), and why it beats `fireEvent`
- Async tests: `findBy...` and `waitForElementToBeRemoved` instead of a fixed wait
- The three families of queries (`getBy`, `queryBy`, `findBy`) and the `All` forms
- Four real mistakes and how to read the list that every failed query prints

## Before you start

- Node 24 (`node --version`). No Docker. You need the testing basics from M17-L01 (Vitest, jsdom, `render`, `screen`), but this folder is complete on its own.
- Versions: Vitest 5.0.5, jsdom 30.1.3, @testing-library/react 16.3.3, @testing-library/dom 10.4.2, @testing-library/user-event 14.6.8, @testing-library/jest-dom 7.0.1, React 19.3.1, Vite 8.3.5, TypeScript 7.0.2.
- Every test file in `src/` is one small experiment named after the video step (`a1-...`, `b2-...`). Some are meant to fail. Run one at a time with `npx vitest run <name>` (the plain `npm test` starts watch mode and runs all of them, so the failing ones show red).

## Files in this folder

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig*.json`, `index.html` | Project setup (jsdom environment; dev server port 5172) |
| `src/CoursePage.tsx` | Asha's page: heading, Save course, Email, Enroll now, a status line, and a lesson list that loads late |
| `src/CoursePageDiv.tsx` | Priya's version where Enroll now is a plain `div` |
| `src/api.ts` | Fakes the waits with timers: lessons load after 300 ms, enroll takes 400 ms (no server) |
| `src/setup.ts` | jest-dom helpers plus `afterEach(cleanup)` |
| `src/setup-l01.ts` | The older setup without cleanup (used for mistake four) |
| `src/*.test.tsx` | The experiments, see the table in each step |
| `src/main.tsx`, `src/index.css` | Entry file and styles for `npm run dev` |

## Follow along

```bash
npm install
npm run dev
```

Open http://localhost:5172 to see the page. Run the tests in a second terminal.

### 1. The problem: a test that looks at how the page is built

Asha's one test (`src/a1-selector.test.tsx`) looks for the class name `btn`:

```tsx
const { container } = render(<CoursePageDiv />)
expect(container.querySelector('.btn')).toBeInTheDocument()
```

```bash
npx vitest run a1-selector
```

```text
 ✓ src/a1-selector.test.tsx > the page has an enroll button 24ms
      Tests  1 passed (1)
```

Then Priya swaps the Enroll button for a `div` with a click handler (`CoursePageDiv.tsx`). The page looks the same and a mouse click still works, and this test is still green. But Lukas uses a screen reader, and for him the button is gone (Module 16, Lesson 3: a `div` is not a button). The test looked at how the page is built. It should look at what a person can find and do.

### 2. Queries by role

The browser keeps a list of roles and names for the page (the accessibility tree). `src/b1-roles.test.tsx` asks for things from that list:

```tsx
test('the page has a heading and an enroll button', () => {
  render(<CoursePage />)
  expect(screen.getByRole('heading', { name: 'Python from Zero' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /enroll now/i })).toBeInTheDocument()
})
```

The name `/enroll now/i` is a pattern; the `i` means capital letters do not matter.

```bash
npx vitest run b1-roles
```

```text
 ✓ src/b1-roles.test.tsx > the page has a heading and an enroll button 97ms
      Tests  1 passed (1)
```

Guess: the same kind of test on Priya's page (`a2-role-div`). Does it pass?

```bash
npx vitest run a2-role-div
```

```text
 × src/a2-role-div.test.tsx > the page has an enroll button 105ms
   → Unable to find an accessible element with the role "button" and name `/enroll now/i`
```

The message does not just say no. It prints the list of everything it found: a main area, headings (Python from Zero, Lessons), a button called Save course, a text box called Email, a list with three items, but no button called Enroll now. That is the same list Lukas's screen reader reads, so the test now fails for the same reason Lukas does. Priya changes the `div` back into a real button and it is green. Asha can rename every class and no test breaks.

Other queries. For a box with a label use `getByLabelText` (`b3-label`). For plain text use `getByText`. Only as a last resort use a test id (a tag you write by hand that no user ever sees). The order: role, label, text, test id.

```tsx
test('the email box has a label', () => {
  render(<CoursePage />)
  expect(screen.getByLabelText('Email')).toBeInTheDocument()
  expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument()
})
```

Every query comes in three families:

| Family | Meaning |
|--------|---------|
| `getBy...` | The thing must be there, or the test stops with an error |
| `queryBy...` | The thing may be missing; you get `null` instead of an error |
| `findBy...` | The thing arrives later, so wait for it |

Add `All` (`getAllByRole`) and you get a list instead of one thing.

A typo (`b2-typo`) asks for `/enrol now/i`:

```text
 × src/b2-typo.test.tsx > the page has an enroll button 78ms
   → Unable to find an accessible element with the role "button" and name `/enrol now/i`
```

The printed list contains a button named `Enroll now` with two Ls. When a query fails, read the list. The answer is usually in it.

### 3. user-event: act like a person

`userEvent.setup()` once at the start of the test, then `await` every action. `src/c1-user.test.tsx` clicks Save course and checks for a button called Saved with `pressed: true` (the `aria-pressed` from Module 16), then types an email into the box found by its label:

```tsx
test('a student saves the course', async () => {
  const user = userEvent.setup()
  render(<CoursePage />)
  await user.click(screen.getByRole('button', { name: 'Save course' }))
  expect(screen.getByRole('button', { name: 'Saved', pressed: true })).toBeInTheDocument()
})

test('a student types an email', async () => {
  const user = userEvent.setup()
  render(<CoursePage />)
  await user.type(screen.getByLabelText('Email'), 'lukas@example.com')
  expect(screen.getByLabelText('Email')).toHaveValue('lukas@example.com')
})
```

```bash
npx vitest run c1-user
```

```text
 ✓ src/c1-user.test.tsx > a student saves the course 67ms
 ✓ src/c1-user.test.tsx > a student types an email 38ms
      Tests  2 passed (2)
```

On the real page the same click turns the button green and it says Saved.

**Why not `fireEvent`?** `fireEvent` sends one single event and nothing else. `src/c2-pointer.test.tsx` has a button with `pointerEvents: 'none'`, so no mouse can click it:

```bash
npx vitest run c2-pointer
```

```text
 ✓ src/c2-pointer.test.tsx > fireEvent clicks it anyway 57ms
 × src/c2-pointer.test.tsx > userEvent refuses 11ms
   → Unable to perform pointer interaction as the element has `pointer-events: none`:
```

`fireEvent` passes a click that no person could make. `userEvent` fails exactly where a real person would fail.

`user.tab()` moves focus like the Tab key and `user.keyboard('{Enter}')` presses keys. `src/c3-keyboard.test.tsx` checks that the keyboard alone can save the course:

```tsx
test('the keyboard can save the course', async () => {
  const user = userEvent.setup()
  render(<CoursePage />)
  await user.tab()
  expect(screen.getByRole('button', { name: 'Save course' })).toHaveFocus()
  await user.keyboard('{Enter}')
  expect(screen.getByRole('button', { name: 'Saved', pressed: true })).toBeInTheDocument()
})
```

```text
 ✓ src/c3-keyboard.test.tsx > the keyboard can save the course 65ms
      Tests  1 passed (1)
```

### 4. Async: wait for things that arrive late

Press Enroll now on the page: the button turns grey and says Enrolling, and 0.4 s later a green line says "You are enrolled". `d1-sync` types the email, clicks Enroll now and checks for the green line right away:

```bash
npx vitest run d1-sync
```

```text
 × src/d1-sync.test.tsx > a student enrolls 129ms
   → Unable to find an accessible element with the role "status"
```

In the printed list the button is called `Enrolling…`. That is the page at the very instant of the check; the green line arrives 0.4 s later and the test did not wait. The fix is `findBy...` (`getBy` plus waiting; it gives up after one second by default), with `await` in front. Before it, a normal `getBy` still checks the in-between state. `src/d2-find.test.tsx`:

```tsx
test('a student enrolls', async () => {
  const user = userEvent.setup()
  render(<CoursePage />)
  await user.type(screen.getByLabelText('Email'), 'lukas@example.com')
  await user.click(screen.getByRole('button', { name: /enroll now/i }))
  expect(screen.getByRole('button', { name: 'Enrolling…' })).toBeDisabled()
  expect(await screen.findByRole('status')).toHaveTextContent('You are enrolled')
})
```

```text
 ✓ src/d2-find.test.tsx > a student enrolls 514ms
      Tests  1 passed (1)
```

It waited exactly as long as the page needed. If the green line never came, `findBy` would give up after one second and fail (`f1-timeout`: `Unable to find role="status"`, after about 1030 ms).

Lists work the same way. The lessons start as "Loading lessons…" and arrive 0.3 s later. `src/d3-lessons.test.tsx`:

```tsx
test('the lessons load', async () => {
  render(<CoursePage />)
  expect(screen.getByText('Loading lessons…')).toBeInTheDocument()
  await waitForElementToBeRemoved(() => screen.queryByText('Loading lessons…'))
  expect(screen.getAllByRole('listitem')).toHaveLength(3)
  expect(screen.getByText('Variables')).toBeInTheDocument()
})
```

```text
 ✓ src/d3-lessons.test.tsx > the lessons load 400ms
      Tests  1 passed (1)
```

Never write a test that waits a fixed number of seconds. A fixed wait is either too slow or too short.

## Common mistakes

1. **`getBy` finds two things** (`e1-multiple`: `getByRole('button')`). Real message: `Found multiple elements with the role "button"`, and it prints both. Fix: ask for the button by name (`e1b-named`, passes).
2. **Checking that something is not there with `getBy`** (`e2-absent`). `getBy` throws when it finds nothing (`Unable to find an accessible element with the role "status"`) before the check can run. Use `queryBy` (`e2b-query`: `expect(screen.queryByRole('status')).not.toBeInTheDocument()` passes).
3. **Forgetting `await`** (`e3-noawait`: `user.click(...)` without `await`). The next line runs before the click finishes. Real message: `Unable to find an accessible element with the role "button" and name "Saved"`, and the printed list shows the button still called `Save course`. Every `user` call needs `await`. (Same family: `e4-findnoawait` forgets `await` on `findByText`, and fails with `expect(received).toBeInTheDocument()`.)
4. **The page from the last test is still on screen** (`e5-leak`). With the old setup file (no cleanup) the second test fails with `Found multiple elements with the text of: Email` and shows two input boxes:

```bash
SETUP=./src/setup-l01.ts npx vitest run e5-leak
```

```text
 ✓ src/e5-leak.test.tsx > the page has an email box 13ms
 × src/e5-leak.test.tsx > the email box starts empty 5ms
   → Found multiple elements with the text of: Email
```

The fix is three lines in the setup file, which is why `src/setup.ts` now has them:

```ts
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => cleanup())
```

```bash
npx vitest run e5-leak
```

```text
 ✓ src/e5-leak.test.tsx > the page has an email box 14ms
 ✓ src/e5-leak.test.tsx > the email box starts empty 2ms
      Tests  2 passed (2)
```

## Clean up

Stop `npm run dev` (Ctrl+C) and any watching `vitest` (press `q`). Nothing else was created; `node_modules/` can be deleted any time.

## Key points

- Find things the way a person does: role and name first, then label, then text, a test id last. When a query fails, read the list in the message.
- `getBy` must be there, `queryBy` may be missing, `findBy` waits. Add `All` for a list.
- `user-event` acts like a person: set it up once and `await` every action. It refuses what a real person could not do; `fireEvent` does not.
- For anything that arrives late use `findBy...` or `waitForElementToBeRemoved`. Never a fixed wait.

Interview tip. If Rahul, the interviewer, asks "how do you decide what to query in a React test?": the way a user finds it, by role and name. Then the test also protects accessibility and does not break when the markup changes. A test id is the last resort.

## Try it yourself

Write a test that clicks Save course twice and checks that the button is called Save course again, with `pressed: false`.

## Next

[M17-L03 · Mocking the API with MSW](../m17-l03-mocking-the-api-with-msw/README.md)
