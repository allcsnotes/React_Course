# M17-L03 · Mocking the API with MSW

> Video: Module 17, Lesson 3. Watch it first, then follow along here.

## What you'll learn

- Why a test that depends on a real server goes red when the server is away
- How MSW (Mock Service Worker) catches `fetch` before it leaves the computer and answers with rules you wrote
- How to write handlers, build a test server and switch it on in the setup file
- How to make the server fail for one test with `server.use`, and why you reset after each test
- Testing a hook alone (`renderHook`), a component that needs context (`wrapper`) and a route (`MemoryRouter`)
- Five mistakes: no reset, `getBy` right after render, a typo in a rule's address, an old option name, handlers that copy the whole server

## Before you start

- Node 24 (`node --version`). No Docker.
- Earlier: M17-L01 (Vitest, jsdom) and M17-L02 (queries, `findBy`, user-event). This folder is complete on its own.
- Versions (from `package-lock.json`): msw 3.0.3, Vitest 5.0.5, jsdom 30.1.3, @testing-library/react 16.3.3, user-event 14.6.8, react-router 8.5.1, React 19.3.1, TypeScript 7.0.2, Vite 8.3.5.
- The practice API is `api/server.mjs`, a small Node stand-in for the allcsvideos API that runs only on your laptop (port 8173). It is not a real server and it uses only demo data.

## Files in this folder

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig*.json`, `index.html` | Project setup. `npm test` runs `vitest run --reporter=verbose`. In `vite.config.ts` I added `include: ['src/**/*.test.{ts,tsx}']` so Vitest ignores the copies in `versions/` |
| `api/server.mjs` | The practice API: `GET /api/courses` and `GET /api/courses/:slug`, 600 ms per answer |
| `src/` | The app and the finished tests (the `final` state) |
| `src/mocks/handlers.ts`, `src/mocks/server.ts`, `src/setupTests.ts` | The MSW rules, the test server, and the switch-on |
| `src/CourseList.tsx`, `CourseDetail.tsx`, `useCourses.ts`, `CartBar.tsx`, `CartContext.tsx`, `App.tsx`, `api.ts` | The app files the tests exercise |
| `versions/` | The stages of the lesson: `common` (the app files), then test layers `v0`, `v1`, `v2a`, `v2`, `m1`, `m2`, `m3`, `oldname`, `v3`, `v4`, `v4x`, `v5`, `v5x`, `final` |
| `use-version.sh` | `./use-version.sh final v4x` puts `common` into `src/`, then applies the layers in order |

## Follow along

```bash
npm install
```

### 1. The problem: a test that needs a real server

```bash
./use-version.sh v0
```

`src/CourseList.test.tsx` renders the list and waits for "React for Beginners" to arrive from the practice API:

```tsx
import { render, screen } from '@testing-library/react'
import { CourseList } from './CourseList.tsx'

test('shows the courses from the API', async () => {
  render(<CourseList />)
  expect(await screen.findByText('React for Beginners')).toBeInTheDocument()
})
```

In one terminal start the practice API, in another run the test:

```bash
node api/server.mjs
```

```text
API on http://localhost:8173
```

```bash
npm test
```

```text
 ✓ src/CourseList.test.tsx > shows the courses from the API 636ms
      Tests  1 passed (1)
```

Green, and it took a while, because the practice API really pauses before it answers. Now stop the API (Ctrl+C) and run the same test again, with not one letter changed:

```text
 × src/CourseList.test.tsx > shows the courses from the API 1015ms
   → Unable to find an element with the text: React for Beginners. This could be because the text is broken up by multiple elements. In this case, you ...
      Tests  1 failed (1)
```

The page is fine. The test simply depended on a server that was not there.

### 2. How MSW works

A test is a rehearsal and the real server is the lead actor: slow, sometimes away, and it will never fail on purpose. A mock server is the stand-in. It is fast, always there, can fail on purpose, and its data never changes under you, so you can check exact numbers.

Follow one request. The component calls `fetch`. `fetch` sends the request towards the network. MSW waits right there, catches it, and answers before it leaves the computer. The real server is never called, and the component code does not change at all.

MSW is a development dependency (only tests need it): `npm install -D msw`. `npm ls msw` shows `msw@3.0.3`.

### 3. Handlers, server, setup

First the answers: three courses typed by hand as plain data (so you know the exact answer to every question a test can ask). A handler is one rule with three parts: the method, the address and the answer. The second rule has a colon placeholder in the address (`:slug`) that matches any course name:

```ts
import { http, HttpResponse } from 'msw'
import { API } from '../api.ts'

const courses = [
  { slug: 'react', title: 'React for Beginners', teacher: 'Meera', lessonCount: 4 },
  { slug: 'python', title: 'Python from Zero', teacher: 'Meera', lessonCount: 3 },
  { slug: 'devops', title: 'DevOps Basics', teacher: 'Asha', lessonCount: 3 },
]

const lessons = [
  { id: 1, title: 'What React is' },
  { id: 2, title: 'Components as bricks' },
]

export const handlers = [
  http.get(`${API}/api/courses`, () => HttpResponse.json(courses)),

  http.get(`${API}/api/courses/:slug`, ({ params }) => {
    if (params.slug !== 'react') {
      return HttpResponse.json({ error: 'not found' }, { status: 404 })
    }
    return HttpResponse.json({ title: 'React for Beginners', lessons })
  }),
]
```

`src/mocks/server.ts` builds the stand-in from the rules with `setupServer`:

```ts
import { setupServer } from 'msw/node'
import { handlers } from './handlers.ts'

export const server = setupServer(...handlers)
```

`src/setupTests.ts` switches it on: start before all tests, reset after each test, close after all tests. `onUnhandledFrame: 'error'` means: if the code asks for an address that has no rule, the test fails loudly instead of quietly calling the real server. (Older guides call the option `onUnhandledRequest`; in MSW 3 it has a new name and the old name is ignored, see mistake four.)

```ts
import '@testing-library/jest-dom/vitest'
import { server } from './mocks/server.ts'

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### 4. The same test, with the server off

```bash
./use-version.sh v1
npm test
```

The practice API is still stopped. Guess: what does the very same test do now?

```text
 ✓ src/CourseList.test.tsx > shows the courses from the API 33ms
      Tests  1 passed (1)
```

Green, and much faster. The test did not change by a single letter; `v1` only added two small files and three lines in the setup file.

Because the stand-in always sends exactly three courses, you can check an exact number (`v2a`): the test first sees "Loading courses...", then waits for the list items.

```bash
./use-version.sh v2a
npm test
```

```text
 ✓ src/CourseList.test.tsx > shows the courses from the API 34ms
 ✓ src/CourseList.test.tsx > shows exactly the three mock courses 42ms
      Tests  2 passed (2)
```

### 5. Making the server fail

A real server will never fail when you ask. For this one test only, put a different rule on top with `server.use`, answering status 500:

```bash
./use-version.sh v2
npm test
```

```tsx

test('shows a message when the server fails', async () => {
  server.use(http.get(`${API}/api/courses`, () => new HttpResponse(null, { status: 500 })))
  render(<CourseList />)
  expect(await screen.findByText('Could not load courses.')).toBeInTheDocument()
```

Guess what the page shows. Real result:

```text
 ✓ src/CourseList.test.tsx > shows the courses from the API 34ms
 ✓ src/CourseList.test.tsx > shows exactly the three mock courses 48ms
 ✓ src/CourseList.test.tsx > shows a message when the server fails 5ms
      Tests  3 passed (3)
```

"Could not load courses." The error message works, and you saw it without breaking anything real. What keeps that rule from spoiling the tests after it? One line in the setup file: `afterEach(() => server.resetHandlers())`. It throws away the one-test rules and goes back to the original list.

### 6. Testing a hook alone

`useCourses` is a custom hook (Module 7, Lesson 6) that gives back a status and the list. A hook can only run inside a component, so use `renderHook`: it renders a tiny invisible component that calls your hook and gives you the latest answer in `result.current`. `waitFor` checks again and again until the check passes (like `findBy` does for text).

```bash
./use-version.sh final
npm test useCourses
```

```tsx
import { renderHook, waitFor } from '@testing-library/react'
import { useCourses } from './useCourses.ts'

test('useCourses goes from loading to success', async () => {
  const { result } = renderHook(() => useCourses())
  expect(result.current.status).toBe('loading')
  await waitFor(() => expect(result.current.status).toBe('success'))
  expect(result.current.courses).toHaveLength(3)
})
```

```text
 ✓ src/useCourses.test.tsx > useCourses goes from loading to success 65ms
      Tests  1 passed (1)
```

Same stand-in, same rules, no page and no component. Testing the hook alone tells you whether the hook is broken or only the component around it.

### 7. Testing context with a wrapper

`CartBar` reads the cart with `useCart()`, which throws if there is no `CartProvider` above it. Rendered alone, it fails:

```bash
./use-version.sh final v4x
npm test CartBar
```

```text
 × src/CartBar.test.tsx > adding a course changes the cart count 7ms
   → useCart must be used inside CartProvider
      Tests  1 failed (1)
```

That is the message Asha wrote herself to catch exactly this mistake. In a test there is nothing above, so give `render` a `wrapper`: a component that Testing Library puts around yours. If a component needs more than one provider, put them all in the wrapper, one inside the other.

```bash
./use-version.sh final v4
npm test CartBar
```

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartBar } from './CartBar.tsx'
import { CartProvider } from './CartContext.tsx'

test('adding a course changes the cart count', async () => {
  const user = userEvent.setup()
  render(<CartBar />, { wrapper: CartProvider })
  expect(screen.getByText('Cart: 0')).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /enrol/i }))
  expect(screen.getByText('Cart: 1')).toBeInTheDocument()
})
```

```text
 ✓ src/CartBar.test.tsx > adding a course changes the cart count 60ms
      Tests  1 passed (1)
```

### 8. Testing a route

`CourseDetail` reads the course name from the address with `useParams`. A test has no address bar, so rendered alone the name is `undefined`, the request goes to `/api/courses/undefined`, the stand-in answers 404 and the page says there is no such course:

```bash
./use-version.sh final v5x
npm test CourseDetail
```

```text
 × src/CourseDetail.test.tsx > shows the course named in the address 1014ms
   → Unable to find role="heading"
      Tests  1 failed (1)
```

The `Unable to find role="heading"` line is the failing test; the printed page shows "No course with that name." The fix is a `MemoryRouter`: a router that keeps the address in memory. Give it `initialEntries` with the address you want, and inside it the same routes as the real app:

```bash
./use-version.sh final v5
npm test CourseDetail
```

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import { CourseDetail } from './CourseDetail.tsx'
import { CourseList } from './CourseList.tsx'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<CourseList />} />
        <Route path="/courses/:slug" element={<CourseDetail />} />
      </Routes>
    </MemoryRouter>,
  )
}

```

```text
 ✓ src/CourseDetail.test.tsx > shows the course named in the address 85ms
 ✓ src/CourseDetail.test.tsx > says so when the course does not exist 15ms
 ✓ src/CourseDetail.test.tsx > the back link goes to the course list 33ms
      Tests  3 passed (3)
```

One rule with a colon slug served both the `react` page and the 404 for `nope`: two behaviours from one rule.

Finally the whole suite, in its finished state:

```bash
./use-version.sh final
npm test
```

```text
 ✓ src/useCourses.test.tsx > useCourses goes from loading to success 69ms
 ✓ src/CartBar.test.tsx > adding a course changes the cart count 64ms
 ✓ src/CourseList.test.tsx > shows the courses from the API 41ms
 ✓ src/CourseList.test.tsx > shows exactly the three mock courses 52ms
 ✓ src/CourseList.test.tsx > shows a message when the server fails 7ms
 ✓ src/CourseDetail.test.tsx > shows the course named in the address 86ms
 ✓ src/CourseDetail.test.tsx > says so when the course does not exist 9ms
 ✓ src/CourseDetail.test.tsx > the back link goes to the course list 21ms
      Tests  8 passed (8)
```

## Common mistakes

1. **Forgetting the reset line** (`./use-version.sh m1`). Without `afterEach(() => server.resetHandlers())`, the 500 rule from the error test stays alive and the next test gets an error instead of the courses:

```text
 ✓ src/CourseList.test.tsx > shows a message when the server fails 34ms
 × src/CourseList.test.tsx > shows the courses from the API 1003ms
   → Unable to find an element with the text: React for Beginners. This could be because the text is broken up by multiple elements. In this case, you ...
      Tests  1 failed | 1 passed (2)
```

2. **`getBy` right after render** (`m2`). The courses have not arrived yet, so `getBy` looks once and fails; the printed page shows `Loading courses...`. Use `findBy`, which waits.
3. **A typo in the address of a rule** (`m3`: the rule says `/api/course`). Because of the error setting, MSW prints the exact request it could not match and refuses to let it through:

```text
stderr | src/CourseList.test.tsx > shows the courses from the API
[MSW] Error: intercepted a request without a matching request handler:

  • GET http://localhost:8173/api/courses

If you still wish to intercept this unhandled request, please create a request handler for it.
Read more: https://mswjs.io/docs/http/intercepting-requests

 × src/CourseList.test.tsx > shows the courses from the API 1015ms
   → Unable to find an element with the text: React for Beginners. This could be because the text is broken up by multiple elements. In this case, you ...
      Tests  1 failed (1)
```

4. **The old option name** (`oldname`: `onUnhandledRequest: 'error'`). MSW 3 ignores it and only prints a warning, `[MSW] Warning: intercepted a request without a matching request handler`, instead of failing the request loudly. Use `onUnhandledFrame`.
5. **Handlers that copy the whole server, and only the happy path.** Keep handlers small and write only the answers your tests need. A stand-in that always succeeds hides the day the real server fails, so add the 500 test.

## Clean up

Stop `node api/server.mjs` and `npm run dev` with Ctrl+C. End with `./use-version.sh final` so `src/` holds the finished project. `node_modules/` and `dist/` can be deleted any time.

## Key points

- MSW catches the request before it leaves the computer and answers with rules you wrote: a method, an address and an answer. The component code does not change.
- `server.use` changes one rule for one test; the reset after each test cleans up.
- To test a hook, use `renderHook` and `waitFor`. To test context, use the `wrapper` option. To test a route, wrap it in a `MemoryRouter` that starts at the address you want.

Interview tip. If Rahul, the interviewer, asks "why mock the network instead of mocking `fetch` itself?": the component still calls `fetch` exactly as in production, so the test checks the real code path, and the same rules work for every component.

## Try it yourself

Add a rule that answers with an empty list. Decide what the page should say when there are no courses, and write the test for it.

## Next

[M17-L04 · End-to-End Tests with Playwright](../m17-l04-end-to-end-tests-with-playwright/README.md)
