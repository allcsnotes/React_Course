# Module 10 · Practice Sheet: 20 State-Management Exercises

Write each exercise yourself before you open the hint or the solution. Every exercise is one small piece of React, and nothing here needs more than Modules 1 to 10 of this course: props, state, lifting state up, composition, **TypeScript** (Module 9), and everything Module 10 taught: **prop drilling and composition, context, `useReducer`, context and a reducer together, Zustand, and choosing where state lives.** There is no server, no router and no data fetching here (those are Modules 8 and 11).

**How to work:**
- Use **Node 24** (check with `node --version`) and make one practice project. In a terminal, run `npm create vite@latest practice`, choose **React** and **TypeScript**, then `cd practice`, `npm install zustand zod` and `npm run dev`. Delete the `StrictMode` wrapper in `src/main.tsx` (see the note about counters below).
- Put each exercise in its own file, `src/exercises/Ex01.tsx` to `Ex20.tsx`. Every file does `export default function Ex01() { ... }`. To look at one, import it in `src/App.tsx` and render it, exactly like the lessons did.
- The exercises use the allcsvideos platform and its cast: Asha, Lukas, Priya, Meera and Rahul. Money is written as **Rs**.
- They go in the order the lessons teach them: **Lesson 1, prop drilling** (exercises 1 to 4), **Lesson 2, context** (5 to 9), **Lesson 3, useReducer** (10 to 14), **Lesson 4, context and reducer together** (15), **Lesson 5, Zustand and choosing where state lives** (16 to 18), and then two **cart pieces** (19 and 20) that build small parts of the Enrollment Cart from the build video. Some are **fix the broken code**, some are **predict what you will see**, and some build a small piece of the site. They go from easy to hard.
- Every exercise has: a goal in plain words, starter code if it helps, **what you should see** (described, plus the **real text** copied from a browser run of the finished solution), a hint, the solution, and a "where this shows up" line.
- All 20 solutions are in the folder **`solutions/`** next to this sheet. It is a real Vite + React + TypeScript project with a menu: run `npm install` and `npm run dev` inside it, then click an exercise. Each exercise is `src/exercises/ExNN.tsx`. Small helpers shared by several exercises are in `src/lib/` and `src/reducers/`.
- The "real text" is what the page showed after Playwright clicked and typed exactly the steps written in the block (recorded with a Playwright script that is not part of this repository). Each block starts with a line like `--- after 3 likes ---`. Where the page has a **render counter**, the little `times 2` after a name means "this component has run twice".
- Three exercises are checked with plain `node` and no browser (11, 18 and 19): run `node scripts/ex11.ts`, `node scripts/ex18.ts` and `node scripts/ex19.ts` inside `solutions/`. Node 24 runs `.ts` files directly. Three exercises have a type error to read (2, 7 and 14): their broken files are in `solutions/broken/`, and you check them with `npx tsc -p tsconfig.broken.json`.
- **About render counters.** Exercises 3, 9, 15 and 16 use a tiny `Renders` component from the lessons (a `ref` that adds one each time its parent runs). `StrictMode` runs every component twice in development, which doubles the numbers, so **take `StrictMode` out of `src/main.tsx`** for these. Exercise 13 needs it back, and puts it around itself.

**The shared pieces.** Make these once.

`src/data.ts`:

```ts
export type Course = { id: number; title: string; price: number }

export const courses: Course[] = [
  { id: 1, title: 'React for Beginners', price: 499 },
  { id: 2, title: 'SQL in Two Weeks', price: 399 },
  { id: 3, title: 'Docker for Developers', price: 599 },
  { id: 4, title: 'System Design', price: 999 },
]
```

`src/Renders.tsx` (the counter from Lesson 1):

```tsx
import { useRef } from 'react'

export function Renders() {
  const count = useRef(0)
  count.current += 1
  return <span className="renders">times {count.current}</span>
}
```

Exercises 12, 13 and 15 reuse the cart reducer you write in exercise 11 (`src/reducers/cartReducer.ts`), and exercise 20 reuses the `getTotals` function you write in exercise 19 (`src/lib/totals.ts`). So do 11 before 12, 13 and 15, and 19 before 20.

---

## Lesson 1 · Prop Drilling

### 1 · Drill a user down three levels
**Goal.** The `Ex01` component keeps the current user in state. Show the user's name and plan in a `UserCard` that sits **two components below** it: `Ex01` renders `Page`, `Page` renders `Sidebar`, `Sidebar` renders `UserCard`. `Page` and `Sidebar` do not use the user, they only hand it on. Add a button "Switch to Priya" in `Ex01` that changes the user to Priya on the pro plan. Type the props.

**Starter code:**

```tsx
type User = { name: string; plan: 'free' | 'pro' }

function UserCard(/* props */) {
  // show: Signed in: Lukas (free plan)
}

// function Sidebar(...)  function Page(...)

export default function Ex01() {
  // const [user, setUser] = useState<User>(...)
}
```

**What you should see.** One card with a "Page" heading, a "Sidebar" heading and the signed-in line. One button. After the click, the same line says Priya and the pro plan. Real text from the browser:

```text
--- start ---
Page
Sidebar
Signed in: Lukas (free plan)
Switch to Priya
--- after Switch to Priya ---
Page
Sidebar
Signed in: Priya (pro plan)
Switch to Priya
```

<details><summary>Hint</summary>

Every component on the road has a props type with `user: User`, and passes it on with `user={user}`. `useState<User>({ name: 'Lukas', plan: 'free' })` gives the user its type. Count the files that mention `user` and ask yourself: how many of them really read it?

</details>

<details><summary>Solution file (<code>solutions/src/exercises/Ex01.tsx</code>)</summary>

```tsx
import { useState } from 'react'

type User = { name: string; plan: 'free' | 'pro' }

function UserCard({ user }: { user: User }) {
  return (
    <p>
      Signed in: {user.name} ({user.plan} plan)
    </p>
  )
}

// Sidebar does not use the user. It only hands it on.
function Sidebar({ user }: { user: User }) {
  return (
    <aside>
      <h3>Sidebar</h3>
      <UserCard user={user} />
    </aside>
  )
}

// Page does not use the user either. It only hands it on.
function Page({ user }: { user: User }) {
  return (
    <section>
      <h3>Page</h3>
      <Sidebar user={user} />
    </section>
  )
}

export default function Ex01() {
  const [user, setUser] = useState<User>({ name: 'Lukas', plan: 'free' })

  return (
    <div className="card">
      <Page user={user} />
      <button onClick={() => setUser({ name: 'Priya', plan: 'pro' })}>Switch to Priya</button>
    </div>
  )
}
```

</details>

**Where this shows up.** This is the exact shape of the page in the lesson: `App` to `Page` to `CourseList` to `CourseCard` to `EnrollButton`. You will meet it in every app that grows past five components. Drilling is not wrong. Two levels like this is the clearest code there is.

### 2 · Fix the forgotten prop
**Goal.** This `Sidebar` forgets to hand the user down to `UserCard`. In the browser this would crash with "Cannot read properties of undefined" far from the mistake. Do not run it. Ask TypeScript instead: run the checker, read the error, find the line, and fix it.

**Starter code:**

```tsx
function Sidebar({ user }: { user: User }) {
  return (
    <aside>
      <UserCard /> {/* BUG: the user is not handed down */}
      <small>Sidebar for {user.name}</small>
    </aside>
  )
}
```

**What you should see.** Before the fix, the checker (`npx tsc -p tsconfig.broken.json`, the broken file is `solutions/broken/Ex02Broken.tsx`) prints one error that names the file, the line and the missing prop. The real message:

```text
broken/Ex02Broken.tsx(16,8): error TS2741: Property 'user' is missing in type '{}' but required in type '{ user: User; }'.
```

After the fix the page shows the user card and the small line under it. Real text from the browser:

```text
--- start ---
Signed in: Lukas (free plan)
Sidebar for Lukas
```

<details><summary>Hint</summary>

The error says `Property 'user' is missing`. `UserCard` needs a `user`, so give it one: `<UserCard user={user} />`. This is why drilling is only safe when the props are **typed**: without types the same mistake is a crash, or a silent bug when the missing value is only a label.

</details>

<details><summary>Solution file (<code>solutions/src/exercises/Ex02.tsx</code>)</summary>

```tsx
import { useState } from 'react'

type User = { name: string; plan: 'free' | 'pro' }

function UserCard({ user }: { user: User }) {
  return (
    <p>
      Signed in: {user.name} ({user.plan} plan)
    </p>
  )
}

function Sidebar({ user }: { user: User }) {
  return (
    <aside>
      <UserCard user={user} />
      <small>Sidebar for {user.name}</small>
    </aside>
  )
}

export default function Ex02() {
  const [user] = useState<User>({ name: 'Lukas', plan: 'free' })
  return (
    <div className="card">
      <Sidebar user={user} />
    </div>
  )
}
```

</details>

**Where this shows up.** Lesson 1 showed two versions of this mistake: a crash (the user is missing) and a silent bug (the language is missing, so the button just shows the name). Typed props plus `npx tsc -b` catch both before a student ever sees them.

### 3 · Predict the render counters
**Goal.** This page keeps the theme in `Ex03`. `Header` takes the theme. `Footer` takes **no props at all**. Both have a `Renders` counter. **Before you run it, write down** what each counter says after one click on "Switch theme". Then run it and compare.

**Starter code:**

```tsx
function Header({ theme }: { theme: Theme }) {
  return <div><strong>Header</strong> theme: {theme} <Renders /></div>
}
function Footer() {
  return <div><strong>Footer</strong> no props <Renders /></div>
}
// Ex03 holds: const [theme, setTheme] = useState<Theme>('light')
```

**What you should see.** Both counters start at `times 1`. After the click, the Header goes to 2 (its prop changed). The surprise is the Footer: it also goes to 2, although it takes no props. Real text:

```text
--- start ---
Header
theme: light
times 1
Footer
no props
times 1
Switch theme
--- after one click on Switch theme ---
Header
theme: dark
times 2
Footer
no props
times 2
Switch theme
```

<details><summary>Hint</summary>

Remember the rule from Module 4, lesson 3: when React draws a component, it draws **everything inside it** again. The state lives in `Ex03`, so `Ex03` runs again, and its whole result (Header and Footer) runs again. React is fast, so this is fine here. The number is only a way to see it.

</details>

<details><summary>Solution file (<code>solutions/src/exercises/Ex03.tsx</code>)</summary>

```tsx
import { useState } from 'react'
import { Renders } from '../Renders.tsx'

type Theme = 'light' | 'dark'

function Header({ theme }: { theme: Theme }) {
  return (
    <div className="row">
      <strong>Header</strong> <span>theme: {theme}</span>
      <Renders />
    </div>
  )
}

// Footer takes no props at all.
function Footer() {
  return (
    <div className="row">
      <strong>Footer</strong> <span>no props</span>
      <Renders />
    </div>
  )
}

export default function Ex03() {
  const [theme, setTheme] = useState<Theme>('light')

  return (
    <div className="card">
      <Header theme={theme} />
      <Footer />
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Switch theme</button>
    </div>
  )
}
```

</details>

**Where this shows up.** Render counters are how you stop guessing about performance. You will use them in exercises 9, 15 and 16 to see what a context or a store really costs, and again in Module 15.

### 4 · Remove a floor with composition
**Goal.** `Page` currently needs a theme and a user only to give them to its `Header` and `CourseList`. Change it so `Page` takes **two ReactNode props, `header` and `list`**, and `Ex04` builds the `Header` and the `CourseList` itself, right where the state lives. `Page` must not mention theme or user any more. Keep a footer line inside `Page` and a "Switch theme" button in `Ex04`.

**Starter code:**

```tsx
// Before: <Page theme={theme} user={user} />
// After:
function Page({ header, list }: { header: ReactNode; list: ReactNode }) {
  // main with {header} {list} and a footer
}
```

**What you should see.** Exactly the same page as before the change: a header with the user and theme, two courses, a footer. After one click on the button, the theme word changes in the header and in both course lines. Real text:

```text
--- start ---
allcsvideos · Lukas · light
React for Beginners (light)
SQL in Two Weeks (light)
Footer: allcsvideos
Switch theme
--- after Switch theme ---
allcsvideos · Lukas · dark
React for Beginners (dark)
SQL in Two Weeks (dark)
Footer: allcsvideos
Switch theme
```

<details><summary>Hint</summary>

Type: `import type { ReactNode } from 'react'` (or inline `type ReactNode`). In `Ex04`: `<Page header={<Header theme={theme} user={user} />} list={<CourseList theme={theme} />} />`. This is children from Module 3, lesson 5, with names. Notice what is **left**: `Header` and `CourseList` still get the theme as a prop. Composition removes the floor in the middle, not the need for the value.

</details>

<details><summary>Solution file (<code>solutions/src/exercises/Ex04.tsx</code>)</summary>

```tsx
import { useState, type ReactNode } from 'react'
import { courses } from '../data.ts'

type Theme = 'light' | 'dark'
type User = { name: string }

// Page knows nothing about theme or user. It only has two slots and a footer.
function Page({ header, list }: { header: ReactNode; list: ReactNode }) {
  return (
    <main>
      {header}
      {list}
      <p className="muted">Footer: allcsvideos</p>
    </main>
  )
}

function Header({ theme, user }: { theme: Theme; user: User }) {
  return (
    <h3>
      allcsvideos · {user.name} · {theme}
    </h3>
  )
}

function CourseList({ theme }: { theme: Theme }) {
  return (
    <ul>
      {courses.slice(0, 2).map((c) => (
        <li key={c.id}>
          {c.title} ({theme})
        </li>
      ))}
    </ul>
  )
}

export default function Ex04() {
  const [theme, setTheme] = useState<Theme>('light')
  const user: User = { name: 'Lukas' }

  return (
    <div className="card">
      <Page header={<Header theme={theme} user={user} />} list={<CourseList theme={theme} />} />
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Switch theme</button>
    </div>
  )
}
```

</details>

**Where this shows up.** Layouts, dashboards and page shells are often written like this: `<Layout sidebar={<Sidebar />} content={<Main />} />`. It is the first thing to try before you reach for context.

---

## Lesson 2 · Context

### 5 · Theme context
**Goal.** Build the three parts of context for the theme. (1) A channel with `createContext<ThemeValue>` whose **default** is `{ theme: 'light', toggle: () => {} }`. (2) A `ThemeProvider` that keeps the theme in `useState`, and wraps its `children`. (3) A `ThemeSwitch` button and a `CourseCard` that each listen with `useContext`. The `CourseList` between the provider and the cards must have **no props about the theme**. The card uses the class `themed-light` or `themed-dark`.

**Starter code:**

```tsx
type Theme = 'light' | 'dark'
type ThemeValue = { theme: Theme; toggle: () => void }

const ThemeContext = createContext<ThemeValue>(/* the default */)

function ThemeProvider({ children }: { children: ReactNode }) {
  // useState, a toggle function, and <ThemeContext value={{ theme, toggle }}>
}
```

**What you should see.** A button that says "Dark mode" and two cards that say "card is light". After one click the cards are dark, the card text says dark, and the button now says "Light mode". Real text:

```text
--- start ---
Dark mode
React for Beginners · card is light
SQL in Two Weeks · card is light
--- after Dark mode ---
Light mode
React for Beginners · card is dark
SQL in Two Weeks · card is dark
```

<details><summary>Hint</summary>

`<ThemeContext value={...}>` is the provider tag in React 19. In older code you will see `<ThemeContext.Provider value={...}>`, which does the same job. A component listens with `const { theme, toggle } = useContext(ThemeContext)`. Use `setTheme((t) => (t === 'light' ? 'dark' : 'light'))` so the toggle never reads a stale value.

</details>

<details><summary>Solution file (<code>solutions/src/exercises/Ex05.tsx</code>)</summary>

```tsx
import { createContext, useContext, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'
type ThemeValue = { theme: Theme; toggle: () => void }

// The channel. The argument is the default value: what a component hears
// when there is no provider above it.
const ThemeContext = createContext<ThemeValue>({ theme: 'light', toggle: () => {} })

// The station.
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  return (
    <ThemeContext value={{ theme, toggle }}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext>
  )
}

// A radio: it listens with useContext, nothing is passed to it.
function ThemeSwitch() {
  const { theme, toggle } = useContext(ThemeContext)
  return <button onClick={toggle}>{theme === 'light' ? 'Dark mode' : 'Light mode'}</button>
}

function CourseCard({ title }: { title: string }) {
  const { theme } = useContext(ThemeContext)
  return (
    <div className={theme === 'light' ? 'themed-light' : 'themed-dark'}>
      {title} · card is {theme}
    </div>
  )
}

// CourseList has no props about the theme at all.
function CourseList() {
  return (
    <>
      <CourseCard title="React for Beginners" />
      <CourseCard title="SQL in Two Weeks" />
    </>
  )
}

export default function Ex05() {
  return (
    <ThemeProvider>
      <ThemeSwitch />
      <CourseList />
    </ThemeProvider>
  )
}
```

</details>

**Where this shows up.** Dark mode, language, the current user: these are the textbook uses of context. Many sites you use every day have a `ThemeProvider` near the top of the tree.

### 6 · The closest provider wins
**Goal.** Take exercise 5 and put a **second provider inside the first** around only the middle of three cards. The inner provider should broadcast the **opposite** of the outer theme (so it needs to read the outer one first). Predict what each card says before and after a click on the page switch.

**Starter code:**

```tsx
function Opposite({ children }: { children: ReactNode }) {
  const outer = useContext(ThemeContext)
  // flip outer.theme and provide it again
}
// <ThemeProvider> <Switch /> <Card name="Card 1" /> <Opposite><Card name="Card 2" /></Opposite> <Card name="Card 3" /> </ThemeProvider>
```

**What you should see.** At the start Card 1 and Card 3 hear light and Card 2 hears dark. After one click they swap: Card 1 and Card 3 hear dark and Card 2 hears light. Real text:

```text
--- start ---
Switch page theme
Card 1: hears light
Card 2: hears dark
Card 3: hears light
--- after Switch page theme ---
Switch page theme
Card 1: hears dark
Card 2: hears light
Card 3: hears dark
```

<details><summary>Hint</summary>

Rule one from the lesson: a radio hears the **closest station above it**. Card 2 has two stations above it, the outer and the inner, and it hears the inner one. The inner component reads the outer value with `useContext` and then provides a new value: a component can be a radio and a station at the same time.

</details>

<details><summary>Solution file (<code>solutions/src/exercises/Ex06.tsx</code>)</summary>

```tsx
import { createContext, useContext, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'
type ThemeValue = { theme: Theme; toggle: () => void }

const ThemeContext = createContext<ThemeValue>({ theme: 'light', toggle: () => {} })

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  return <ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>
}

// A second, inner station that broadcasts the OPPOSITE of the outer one.
function Opposite({ children }: { children: ReactNode }) {
  const outer = useContext(ThemeContext)
  const flipped: Theme = outer.theme === 'light' ? 'dark' : 'light'
  return <ThemeContext value={{ theme: flipped, toggle: outer.toggle }}>{children}</ThemeContext>
}

function Card({ name }: { name: string }) {
  const { theme } = useContext(ThemeContext)
  return (
    <div className={theme === 'light' ? 'themed-light' : 'themed-dark'}>
      {name}: hears {theme}
    </div>
  )
}

function Switch() {
  const { toggle } = useContext(ThemeContext)
  return <button onClick={toggle}>Switch page theme</button>
}

export default function Ex06() {
  return (
    <ThemeProvider>
      <Switch />
      <Card name="Card 1" />
      <Opposite>
        <Card name="Card 2" />
      </Opposite>
      <Card name="Card 3" />
    </ThemeProvider>
  )
}
```

</details>

**Where this shows up.** Nested providers are how one part of a page can have its own theme (a dark preview card on a light page, a modal that forces light colours). The router and form libraries use the same idea.

### 7 · A safe hook instead of a silent default
**Goal.** A footer is placed **outside** every `ThemeProvider`. With a normal default (`light`) it silently shows `light` forever. Make that loud. (1) Change the default to `null` and the type to `ThemeValue | null`. (2) Read the TypeScript error you get when a component calls `useContext` directly. (3) Write a hook `useTheme()` that throws `useTheme must be used inside ThemeProvider` when the value is `null`, and returns a non-null `ThemeValue` otherwise. (4) Catch the error with the `ErrorBoundary` helper and show the message on the page.

**Starter code:**

```tsx
const ThemeContext = createContext<ThemeValue | null>(null)

function useTheme(): ThemeValue {
  // if null: throw new Error(...)
}
```

**What you should see.** Two things. First, the **silent bug** you are fixing (the broken version is in the menu of the solutions project as "Broken 7"): after clicking dark, the footer outside the provider still says light and nothing complains. Real text of that broken page:

```text
--- start ---
Theme is light. Switch
Footer: theme light
--- after Switch (footer is outside the provider) ---
Theme is dark. Switch
Footer: theme light
```

Second, the type error from step 2 (file `solutions/broken/Ex07Broken.tsx`):

```text
broken/Ex07Broken.tsx(10,11): error TS2339: Property 'theme' does not exist on type 'ThemeValue | null'.
```

And the finished page: the footer inside the provider works, the one outside shows the clear sentence (the console also shows the same error in red). Real text:

```text
--- start ---
Theme is light. Switch
Footer inside: theme light
Caught: useTheme must be used inside ThemeProvider
--- after Switch (inside provider) ---
Theme is dark. Switch
Footer inside: theme dark
Caught: useTheme must be used inside ThemeProvider
--- console errors ---
 Error: useTheme must be used inside ThemeProvider
```

<details><summary>Hint</summary>

`null` has a price: `useContext` may now return `null`, and TypeScript stops you from reading `.theme` on it. That is good. The hook is the place where you deal with `null` **once**: `const value = useContext(ThemeContext); if (value === null) throw new Error('...'); return value`. After the `if`, TypeScript knows the value is not `null`. Do not export the context itself, only the provider and the hook.

</details>

<details><summary>Solution file (<code>solutions/src/exercises/Ex07.tsx</code>)</summary>

```tsx
import { createContext, useContext, useState, type ReactNode } from 'react'
import { ErrorBoundary } from '../ErrorBoundary.tsx'

type Theme = 'light' | 'dark'
type ThemeValue = { theme: Theme; toggle: () => void }

// Default is null, so a forgotten provider cannot hide.
const ThemeContext = createContext<ThemeValue | null>(null)

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  return <ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>
}

// The only way to listen. Without a provider it throws a clear sentence.
function useTheme(): ThemeValue {
  const value = useContext(ThemeContext)
  if (value === null) {
    throw new Error('useTheme must be used inside ThemeProvider')
  }
  return value
}

function Switch() {
  const { theme, toggle } = useTheme()
  return <button onClick={toggle}>Theme is {theme}. Switch</button>
}

function Footer({ label }: { label: string }) {
  const { theme } = useTheme()
  return (
    <p>
      {label}: theme {theme}
    </p>
  )
}

export default function Ex07() {
  return (
    <div className="card">
      <ThemeProvider>
        <Switch />
        <Footer label="Footer inside" />
      </ThemeProvider>
      {/* This footer is outside every provider. */}
      <ErrorBoundary>
        <Footer label="Footer outside" />
      </ErrorBoundary>
    </div>
  )
}
```

</details>

<details><summary>Solution file (<code>solutions/broken/Ex07Broken.tsx</code>)</summary>

```tsx
import { createContext, useContext } from 'react'

type Theme = 'light' | 'dark'
type ThemeValue = { theme: Theme; toggle: () => void }

// Step 2 of the exercise: default null, but components still call useContext directly.
const ThemeContext = createContext<ThemeValue | null>(null)

export function Footer() {
  const { theme } = useContext(ThemeContext)
  return <p>theme: {theme}</p>
}
```

</details>

<details><summary>Solution file (<code>solutions/src/broken/B07Default.tsx</code>)</summary>

```tsx
import { createContext, useContext, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'
type ThemeValue = { theme: Theme; toggle: () => void }

// BROKEN on purpose: the default value is a real-looking theme, so a forgotten provider is silent.
const ThemeContext = createContext<ThemeValue>({ theme: 'light', toggle: () => {} })

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  return <ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>
}

function Switch() {
  const { theme, toggle } = useContext(ThemeContext)
  return <button onClick={toggle}>Theme is {theme}. Switch</button>
}

function Footer() {
  const { theme } = useContext(ThemeContext)
  return <p>Footer: theme {theme}</p>
}

export default function B07Default() {
  return (
    <div className="card">
      <ThemeProvider>
        <Switch />
      </ThemeProvider>
      {/* The footer was put outside the provider. No error anywhere. */}
      <Footer />
    </div>
  )
}
```

</details>

<details><summary>Solution file (<code>solutions/src/ErrorBoundary.tsx</code>)</summary>

```tsx
import { Component, type ReactNode } from 'react'

// React still needs a class to catch errors while drawing.
export class ErrorBoundary extends Component<{ children: ReactNode }, { message: string | null }> {
  state: { message: string | null } = { message: null }

  static getDerivedStateFromError(error: Error) {
    return { message: error.message }
  }

  render() {
    if (this.state.message !== null) {
      return <p className="error">Caught: {this.state.message}</p>
    }
    return this.props.children
  }
}
```

</details>

**Where this shows up.** Every serious context file has this hook. In Module 8 you saw the same crash from a link used outside the router: the router is a provider, and that link was a radio outside the station.

### 8 · User context: log in and enroll
**Goal.** Build a `UserContext` whose value is `{ user: User | null; login; logout }` (null means nobody is logged in), with a `UserProvider`, a `useUser()` hook (same pattern as exercise 7), a `UserMenu` and an `EnrollButton`. Put three `EnrollButton`s in three `CourseCard`s inside a `CourseList`. Logged out, each button is **disabled** and says "Log in to enroll". Logged in as Lukas, the menu says "Hello, Lukas" and the buttons say "Enroll". `CourseList` and `CourseCard` must have no user props.

**Starter code:**

```tsx
type User = { name: string }
type UserValue = { user: User | null; login: () => void; logout: () => void }
// UserProvider: useState<User | null>(null); login sets { name: 'Lukas' }; logout sets null
```

**What you should see.** First a "Log in" button and three disabled buttons that say "Log in to enroll" with a course title. After login, "Hello, Lukas" and a Log out button, and the three buttons say "Enroll". After logout, back to the start. Real text:

```text
--- start ---
Log in
Log in to enroll · React for Beginners
Log in to enroll · SQL in Two Weeks
Log in to enroll · Docker for Developers
--- after Log in ---
Hello, Lukas Log out
Enroll · React for Beginners
Enroll · SQL in Two Weeks
Enroll · Docker for Developers
--- after Log out ---
Log in
Log in to enroll · React for Beginners
Log in to enroll · SQL in Two Weeks
Log in to enroll · Docker for Developers
```

<details><summary>Hint</summary>

Only two kinds of component touch the user: the menu (reads user and both functions) and the enroll button (reads only the user). Check `user === null` for the label and for `disabled`. This practice login asks for no password, because the point is sharing a value. Real login comes in Module 13.

</details>

<details><summary>Solution file (<code>solutions/src/exercises/Ex08.tsx</code>)</summary>

```tsx
import { createContext, useContext, useState, type ReactNode } from 'react'
import { courses } from '../data.ts'

type User = { name: string }
type UserValue = { user: User | null; login: () => void; logout: () => void }

const UserContext = createContext<UserValue | null>(null)

function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const login = () => setUser({ name: 'Lukas' })
  const logout = () => setUser(null)
  return <UserContext value={{ user, login, logout }}>{children}</UserContext>
}

function useUser(): UserValue {
  const value = useContext(UserContext)
  if (value === null) throw new Error('useUser must be used inside UserProvider')
  return value
}

function UserMenu() {
  const { user, login, logout } = useUser()
  return user === null ? (
    <button onClick={login}>Log in</button>
  ) : (
    <span>
      Hello, {user.name} <button onClick={logout}>Log out</button>
    </span>
  )
}

// Four levels below the provider, and nobody passes it a prop.
function EnrollButton({ title }: { title: string }) {
  const { user } = useUser()
  return (
    <button disabled={user === null}>
      {user === null ? 'Log in to enroll' : 'Enroll'} · {title}
    </button>
  )
}

function CourseCard({ title }: { title: string }) {
  return (
    <div className="card">
      <EnrollButton title={title} />
    </div>
  )
}

function CourseList() {
  return (
    <>
      {courses.slice(0, 3).map((c) => (
        <CourseCard key={c.id} title={c.title} />
      ))}
    </>
  )
}

export default function Ex08() {
  return (
    <UserProvider>
      <UserMenu />
      <CourseList />
    </UserProvider>
  )
}
```

</details>

**Where this shows up.** Menus, avatars, "is this a pro user?" checks and protected buttons all read the current user from somewhere. Context is the simplest place to keep it, and the same pattern will hold the real signed-in user later.

### 9 · One big context or two small ones
**Goal.** Build the **same page twice**: once with **one** context holding the theme and the user together, and once with **two** contexts (one for each topic). The page has a `ThemeSwitch`, a `UserMenu`, two cards (each card reads the theme and contains an `EnrollButton` that reads the user), and a footer that reads nothing. Put a `Renders` counter on each. Click "Log in" in both versions. **Predict**: which counters move in the big version, and which in the small one?

**Starter code:**

```tsx
// A: const BigContext = createContext<{ theme; toggleTheme; user; login; logout } | null>(null)
// B: const ThemeContext = createContext<ThemeValue | null>(null)
//    const UserContext = createContext<UserValue | null>(null)
```

**What you should see.** Two panels side by side. After Log in: in the big panel the switch, the menu, both cards and both enroll buttons all go to 2, because they all listen to the one big value. In the small panel only the menu and the two enroll buttons go to 2: the switch and the cards stay at 1. The page and the footer stay at 1 in both. After the theme switch the switch and the cards go up in the small panel too, and the enroll buttons go up with them because they sit inside the cards. In each counter line, the first `times` after "enroll" belongs to the enroll button and the next one to its card. Real text:

```text
--- start (A = big, B = small) ---
A · one big context
page
times 1
Theme (light)
switch
times 1
Log in
menu: nobody
times 1
card 1 (light)
enroll: log in
times 1
times 1
card 2 (light)
enroll: log in
times 1
times 1
footer
times 1
B · two small contexts
page
times 1
Theme (light)
switch
times 1
Log in
menu: nobody
times 1
card 1 (light)
enroll: log in
times 1
times 1
card 2 (light)
enroll: log in
times 1
times 1
footer
times 1
--- after Log in (both) ---
A · one big context
page
times 1
Theme (light)
switch
times 2
Log in
menu: Lukas
times 2
card 1 (light)
enroll: ready
times 2
times 2
card 2 (light)
enroll: ready
times 2
times 2
footer
times 1
B · two small contexts
page
times 1
Theme (light)
switch
times 1
Log in
menu: Lukas
times 2
card 1 (light)
enroll: ready
times 2
times 1
card 2 (light)
enroll: ready
times 2
times 1
footer
times 1
--- after Theme switch (both) ---
A · one big context
page
times 1
Theme (dark)
switch
times 3
Log in
menu: Lukas
times 3
card 1 (dark)
enroll: ready
times 3
times 3
card 2 (dark)
enroll: ready
times 3
times 3
footer
times 1
B · two small contexts
page
times 1
Theme (dark)
switch
times 2
Log in
menu: Lukas
times 2
card 1 (dark)
enroll: ready
times 3
times 2
card 2 (dark)
enroll: ready
times 3
times 2
footer
times 1
```

<details><summary>Hint</summary>

When the value of a provider changes, React draws every component that listens again. It cannot tell which **part** of the object you read. So split the contexts by what changes **together**: theme in one, user in the other. The page and footer listen to nothing, so they never move.

</details>

<details><summary>Solution file (<code>solutions/src/exercises/Ex09.tsx</code>)</summary>

```tsx
import { createContext, useContext, useState, type ReactNode } from 'react'
import { Renders } from '../Renders.tsx'

type Theme = 'light' | 'dark'
type User = { name: string }

// ---------- Version A: ONE big context ----------
type BigValue = {
  theme: Theme
  toggleTheme: () => void
  user: User | null
  login: () => void
  logout: () => void
}
const BigContext = createContext<BigValue | null>(null)

function BigProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [user, setUser] = useState<User | null>(null)
  const value: BigValue = {
    theme,
    toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    user,
    login: () => setUser({ name: 'Lukas' }),
    logout: () => setUser(null),
  }
  return <BigContext value={value}>{children}</BigContext>
}
function useBig(): BigValue {
  const v = useContext(BigContext)
  if (v === null) throw new Error('useBig must be used inside BigProvider')
  return v
}

// ---------- Version B: TWO small contexts ----------
type ThemeValue = { theme: Theme; toggle: () => void }
type UserValue = { user: User | null; login: () => void; logout: () => void }
const ThemeContext = createContext<ThemeValue | null>(null)
const UserContext = createContext<UserValue | null>(null)

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  return <ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>
}
function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const login = () => setUser({ name: 'Lukas' })
  const logout = () => setUser(null)
  return <UserContext value={{ user, login, logout }}>{children}</UserContext>
}
function useThemeOnly(): ThemeValue {
  const v = useContext(ThemeContext)
  if (v === null) throw new Error('useThemeOnly must be used inside ThemeProvider')
  return v
}
function useUserOnly(): UserValue {
  const v = useContext(UserContext)
  if (v === null) throw new Error('useUserOnly must be used inside UserProvider')
  return v
}

// ---------- The same page for both versions ----------
type Hooks = {
  useTheme: () => { theme: Theme; toggle: () => void }
  useUser: () => UserValue
}

function makePage({ useTheme, useUser }: Hooks) {
  function ThemeSwitch() {
    const { theme, toggle } = useTheme()
    return (
      <div className="row">
        <button onClick={toggle}>Theme ({theme})</button> switch
        <Renders />
      </div>
    )
  }
  function UserMenu() {
    const { user, login } = useUser()
    return (
      <div className="row">
        <button onClick={login}>Log in</button> menu: {user === null ? 'nobody' : user.name}
        <Renders />
      </div>
    )
  }
  function EnrollButton() {
    const { user } = useUser()
    return (
      <span className="row">
        enroll: {user === null ? 'log in' : 'ready'}
        <Renders />
      </span>
    )
  }
  function Card({ n }: { n: number }) {
    const { theme } = useTheme()
    return (
      <div className="row">
        card {n} ({theme}) <EnrollButton />
        <Renders />
      </div>
    )
  }
  function Page() {
    return (
      <div>
        <div className="row">
          page <Renders />
        </div>
        <ThemeSwitch />
        <UserMenu />
        <Card n={1} />
        <Card n={2} />
        <div className="row">
          footer <Renders />
        </div>
      </div>
    )
  }
  return Page
}

const BigPage = makePage({
  useTheme: () => {
    const v = useBig()
    return { theme: v.theme, toggle: v.toggleTheme }
  },
  useUser: useBig,
})
const SmallPage = makePage({ useTheme: useThemeOnly, useUser: useUserOnly })

export default function Ex09() {
  return (
    <div className="cols">
      <div className="card" data-testid="big">
        <h3>A · one big context</h3>
        <BigProvider>
          <BigPage />
        </BigProvider>
      </div>
      <div className="card" data-testid="small">
        <h3>B · two small contexts</h3>
        <ThemeProvider>
          <UserProvider>
            <SmallPage />
          </UserProvider>
        </ThemeProvider>
      </div>
    </div>
  )
}
```

</details>

**Where this shows up.** This is the most common context performance mistake: one giant `AppContext` with everything in it. Splitting by topic is free, and it is the first fix to reach for.

---

## Lesson 3 · useReducer

### 10 · A counter with useReducer
**Goal.** Build "Seats booked" with `useReducer`. The state is a number. The actions are a **discriminated union** with the tag `type`: `increment`, `decrement` (never below 0), `add` (with an `amount`) and `reset`. End the `switch` with an `assertNever` default. Four buttons: +1, -1, +5 and Reset.

**Starter code:**

```tsx
type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'add'; amount: number }
  | { type: 'reset' }

function seatsReducer(seats: number, action: Action): number {
  // switch (action.type) { ... }
}
```

**What you should see.** "Seats booked: 0" and four buttons. After +1, +1, +5 it says 7. -1 gives 6. After Reset and one more -1 it stays at 0. Real text:

```text
--- start ---
Seats booked: 0
+1-1+5Reset
--- after +1 +1 +5 ---
Seats booked: 7
+1-1+5Reset
--- after -1 ---
Seats booked: 6
+1-1+5Reset
--- after Reset then -1 ---
Seats booked: 0
+1-1+5Reset
```

<details><summary>Hint</summary>

`useReducer(seatsReducer, 0)` gives `[seats, dispatch]`. A button calls `dispatch({ type: 'add', amount: 5 })`. Inside the reducer, a `case 'add':` can read `action.amount` because TypeScript has narrowed the action by its tag. For the lower limit use `Math.max(0, seats - 1)`.

</details>

<details><summary>Solution file (<code>solutions/src/exercises/Ex10.tsx</code>)</summary>

```tsx
import { useReducer } from 'react'

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'add'; amount: number }
  | { type: 'reset' }

function assertNever(value: never): never {
  throw new Error('Unhandled action: ' + JSON.stringify(value))
}

// The rule book: current seats + one slip in, next seats out.
function seatsReducer(seats: number, action: Action): number {
  switch (action.type) {
    case 'increment':
      return seats + 1
    case 'decrement':
      return Math.max(0, seats - 1)
    case 'add':
      return seats + action.amount
    case 'reset':
      return 0
    default:
      return assertNever(action)
  }
}

export default function Ex10() {
  const [seats, dispatch] = useReducer(seatsReducer, 0)

  return (
    <div className="card">
      <h3>Seats booked: {seats}</h3>
      <button onClick={() => dispatch({ type: 'increment' })}>+1</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-1</button>
      <button onClick={() => dispatch({ type: 'add', amount: 5 })}>+5</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  )
}
```

</details>

**Where this shows up.** The reducer is the "rule book" and dispatch is the slip. Even this tiny example already has all the shape of a real one: a type for actions, one pure function, and one place where the rules live.

### 11 · A pure cart reducer (node test)
**Goal.** Write the cart reducer as a **plain TypeScript file with no React in it**: `src/reducers/cartReducer.ts`. State: `{ items: { course; quantity }[]; coupon: string | null }`. Actions: `add` (same course twice makes quantity 2), `remove` (by id), `applyCoupon` (only `SAVE10`, and only on a non-empty cart) and `clear`. **Rule:** removing the last course also clears the coupon. Export `cartReducer`, `initialCart`, `cartCount` and `cartTotal` (SAVE10 takes 10 percent off, rounded). Then write `scripts/ex11.ts` and prove with `node` that it works and that it **never changes its input**.

**Starter code:**

```tsx
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    // ... one case per action, a default with assertNever
  }
}
// node scripts/ex11.ts   <- your own test, using node:assert
```

**What you should see.** No browser for this one. The check is the terminal: `node scripts/ex11.ts`. Real output:

```text
after two adds: items 1 quantity 2
coupon: SAVE10
count 2 total 898
after remove: items 0 coupon null
frozen input untouched: quantity still 1 | initialCart items 0
all checks passed
```

<details><summary>Hint</summary>

Never write `state.items.push(...)`: build a new list with spread, `map` or `filter` (Module 4, lesson 4). For "same course twice", `map` over the items and return `{ ...i, quantity: i.quantity + 1 }` for the matching one. To prove purity, freeze the state with `Object.freeze` (a small `deepFreeze` helper), call the reducer on it, and check that the old object still has the old numbers. A frozen object throws if anyone changes it.

</details>

<details><summary>Solution file (<code>solutions/src/reducers/cartReducer.ts</code>)</summary>

```ts
import type { Course } from '../data.ts'

export type CartItem = { course: Course; quantity: number }
export type CartState = { items: CartItem[]; coupon: string | null }

export type CartAction =
  | { type: 'add'; course: Course }
  | { type: 'remove'; id: number }
  | { type: 'applyCoupon'; code: string }
  | { type: 'clear' }

export const initialCart: CartState = { items: [], coupon: null }

function assertNever(value: never): never {
  throw new Error('Unhandled action: ' + JSON.stringify(value))
}

// Returns a NEW list: one more of this course.
function addItem(items: CartItem[], course: Course): CartItem[] {
  const found = items.some((i) => i.course.id === course.id)
  if (!found) return [...items, { course, quantity: 1 }]
  return items.map((i) => (i.course.id === course.id ? { ...i, quantity: i.quantity + 1 } : i))
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add':
      return { ...state, items: addItem(state.items, action.course) }
    case 'remove': {
      const items = state.items.filter((i) => i.course.id !== action.id)
      // The rule we used to forget: an empty cart has no coupon.
      if (items.length === 0) return initialCart
      return { ...state, items }
    }
    case 'applyCoupon':
      if (state.items.length === 0 || action.code !== 'SAVE10') return state
      return { ...state, coupon: action.code }
    case 'clear':
      return initialCart
    default:
      return assertNever(action)
  }
}

export function cartCount(state: CartState): number {
  return state.items.reduce((sum, i) => sum + i.quantity, 0)
}

export function cartTotal(state: CartState): number {
  const subtotal = state.items.reduce((sum, i) => sum + i.course.price * i.quantity, 0)
  return state.coupon === 'SAVE10' ? subtotal - Math.round(subtotal * 0.1) : subtotal
}
```

</details>

<details><summary>Solution file (<code>solutions/scripts/ex11.ts</code>)</summary>

```ts
// Run with: node scripts/ex11.ts   (Node 24 runs TypeScript files directly)
import assert from 'node:assert/strict'
import { cartReducer, initialCart, cartCount, cartTotal } from '../src/reducers/cartReducer.ts'
import { courses } from '../src/data.ts'

const react = courses[0]
const sql = courses[1]

// 1. add the same course twice: quantity two
let state = cartReducer(initialCart, { type: 'add', course: react })
state = cartReducer(state, { type: 'add', course: react })
console.log('after two adds:', 'items', state.items.length, 'quantity', state.items[0].quantity)
assert.equal(state.items.length, 1)
assert.equal(state.items[0].quantity, 2)

// 2. coupon only works on a non-empty cart, and only the right code
assert.equal(cartReducer(initialCart, { type: 'applyCoupon', code: 'SAVE10' }), initialCart)
assert.equal(cartReducer(state, { type: 'applyCoupon', code: 'WRONG' }), state)
state = cartReducer(state, { type: 'applyCoupon', code: 'SAVE10' })
console.log('coupon:', state.coupon)
assert.equal(state.coupon, 'SAVE10')

// 3. totals: 2 x 499 = 998, minus 10 percent (100, rounded) = 898
console.log('count', cartCount(state), 'total', cartTotal(state))
assert.equal(cartTotal(state), 898)

// 4. removing the last course also removes the coupon
const removed = cartReducer(state, { type: 'remove', id: react.id })
console.log('after remove:', 'items', removed.items.length, 'coupon', removed.coupon)
assert.equal(removed.items.length, 0)
assert.equal(removed.coupon, null)

// 5. clear
assert.equal(cartReducer(state, { type: 'clear' }).items.length, 0)

// 6. PURE: the old state must be untouched (deep-frozen objects throw if anyone mutates them)
function deepFreeze<T>(value: T): T {
  if (typeof value === 'object' && value !== null) {
    Object.values(value).forEach(deepFreeze)
    Object.freeze(value)
  }
  return value
}
const frozen = deepFreeze(cartReducer(cartReducer(initialCart, { type: 'add', course: react }), { type: 'add', course: sql }))
const next = cartReducer(frozen, { type: 'add', course: react })
assert.equal(frozen.items[0].quantity, 1)
assert.equal(next.items[0].quantity, 2)
assert.equal(initialCart.items.length, 0)
console.log('frozen input untouched: quantity still', frozen.items[0].quantity, '| initialCart items', initialCart.items.length)

console.log('all checks passed')
```

</details>

<details><summary>Solution file (<code>solutions/src/exercises/Ex11.tsx</code>)</summary>

```tsx
import { cartReducer, initialCart } from '../reducers/cartReducer.ts'
import { courses } from '../data.ts'

// Exercise 11 is a node exercise: the real answer is src/reducers/cartReducer.ts
// and the check is `node scripts/ex11.ts`. This page just shows the reducer working
// without any React hook at all, calling it by hand.
export default function Ex11() {
  let state = cartReducer(initialCart, { type: 'add', course: courses[0] })
  state = cartReducer(state, { type: 'add', course: courses[0] })
  state = cartReducer(state, { type: 'applyCoupon', code: 'SAVE10' })
  const cleared = cartReducer(state, { type: 'clear' })

  return (
    <div className="card">
      <p>No hook here, only function calls:</p>
      <p>
        quantity {state.items[0].quantity} · coupon {state.coupon}
      </p>
      <p>
        after clear: {cleared.items.length} items · coupon {String(cleared.coupon)}
      </p>
      <p className="muted">The real check: run node scripts/ex11.ts</p>
    </div>
  )
}
```

</details>

The page for this exercise (`Ex11.tsx`) only shows the reducer being called by hand. Real text from the browser shows that no hook is involved:

```text
--- start ---
No hook here, only function calls:
quantity 2 · coupon SAVE10
after clear: 0 items · coupon null
The real check: run node scripts/ex11.ts
```

**Where this shows up.** A reducer with no React in it is the easiest code in the whole app to test. This is exactly why teams like it: no browser, no rendering, no mocking.

### 12 · From useState to useReducer
**Goal.** A cart page has two `useState`s (the items and the coupon) and four handlers. The rule "an empty cart has no coupon" was written in the **Clear** handler only, so after you remove both courses a green "coupon applied" chip is still there on an empty cart. Rebuild the page with `useReducer` and **your reducer from exercise 11**, so every handler becomes one `dispatch`. Show the courses, the cart with Remove buttons, a coupon button or chip, the total, and Clear.

**Starter code:**

```tsx
// before: const [items, setItems] = useState([]); const [coupon, setCoupon] = useState(null)
// after:
const [cart, dispatch] = useReducer(cartReducer, initialCart)
```

**What you should see.** Add React for Beginners and SQL in Two Weeks: total Rs 898. Apply SAVE10: Rs 808 and a green chip. Remove one: Rs 359. Remove the other: the cart is empty, **the chip is gone** and the Apply button is back. Real text:

```text
--- start ---
Courses
Add React for Beginners
Add SQL in Two Weeks
Add Docker for Developers
Cart (0)
Apply SAVE10
Total: Rs 0
Clear
--- after Add React, Add SQL ---
Courses
Add React for Beginners
Add SQL in Two Weeks
Add Docker for Developers
Cart (2)
React for Beginners x1 Remove
SQL in Two Weeks x1 Remove
Apply SAVE10
Total: Rs 898
Clear
--- after Apply SAVE10 ---
Courses
Add React for Beginners
Add SQL in Two Weeks
Add Docker for Developers
Cart (2)
React for Beginners x1 Remove
SQL in Two Weeks x1 Remove
SAVE10 applied
Total: Rs 808
Clear
--- after Remove (first row) ---
Courses
Add React for Beginners
Add SQL in Two Weeks
Add Docker for Developers
Cart (1)
SQL in Two Weeks x1 Remove
SAVE10 applied
Total: Rs 359
Clear
--- after Remove (last row) ---
Courses
Add React for Beginners
Add SQL in Two Weeks
Add Docker for Developers
Cart (0)
Apply SAVE10
Total: Rs 0
Clear
```

<details><summary>Hint</summary>

The screen part does not change at all, only the memory does. `onClick={() => dispatch({ type: 'add', course: c })}`, `dispatch({ type: 'remove', id })`, and so on. The coupon rule is already inside `cartReducer`'s `remove` case, so you do not write it again in the page.

</details>

<details><summary>Solution file (<code>solutions/src/exercises/Ex12.tsx</code>)</summary>

```tsx
import { useReducer } from 'react'
import { courses } from '../data.ts'
import { cartReducer, initialCart, cartCount, cartTotal } from '../reducers/cartReducer.ts'

// The old version had useState for items and coupon, and four handlers.
// The "empty cart loses its coupon" rule was in the Clear handler only.
// Now every change is a dispatch, and the rule lives in cartReducer.
export default function Ex12() {
  const [cart, dispatch] = useReducer(cartReducer, initialCart)

  return (
    <div className="cols">
      <div className="card">
        <h3>Courses</h3>
        {courses.slice(0, 3).map((c) => (
          <div key={c.id}>
            <button onClick={() => dispatch({ type: 'add', course: c })}>Add</button> {c.title}
          </div>
        ))}
      </div>
      <div className="card">
        <h3>Cart ({cartCount(cart)})</h3>
        {cart.items.map((i) => (
          <div key={i.course.id}>
            {i.course.title} x{i.quantity}{' '}
            <button onClick={() => dispatch({ type: 'remove', id: i.course.id })}>Remove</button>
          </div>
        ))}
        {cart.coupon === null ? (
          <button onClick={() => dispatch({ type: 'applyCoupon', code: 'SAVE10' })}>Apply SAVE10</button>
        ) : (
          <span className="chip">{cart.coupon} applied</span>
        )}
        <p>Total: Rs {cartTotal(cart)}</p>
        <button onClick={() => dispatch({ type: 'clear' })}>Clear</button>
      </div>
    </div>
  )
}
```

</details>

**Where this shows up.** "I fixed it in one place and forgot the other" is the bug a reducer removes. Every rule about the cart lives in one function, no matter how many buttons change the cart.

### 13 · Pure under StrictMode
**Goal.** This reducer looks fine and works with `StrictMode` off. Put `StrictMode` back around the component and click **Add once**. How many rows do you see? Then fix the reducer. (The broken version is in the solutions menu as "Broken 13".)

**Starter code:**

```tsx
function badReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add':
      state.items.push({ course: action.course, quantity: 1 }) // BUG
      return { ...state }
    default:
      return state
  }
}
```

**What you should see.** With the broken reducer, **one click gives two rows** and a total of Rs 998. Real text of the broken version:

```text
--- start ---
Add React for Beginners
Rows: 0
Count 0 · Total Rs 0
--- after one click on Add (reducer pushes) ---
Add React for Beginners
Rows: 2
React for Beginners x1
React for Beginners x1
Count 2 · Total Rs 998
```

After the fix (your `cartReducer` from exercise 11, still inside `StrictMode`), one click gives one row and Rs 499. Real text:

```text
--- start ---
Add React for Beginners
Rows: 0
Count 0 · Total Rs 0
--- after one click on Add (StrictMode on) ---
Add React for Beginners
Rows: 1
React for Beginners x1
Count 1 · Total Rs 499
```

<details><summary>Hint</summary>

In development, `StrictMode` calls every reducer **twice** with the same state, on purpose, to catch exactly this. The `push` ran twice on the same list, because `{ ...state }` is a new object but `state.items` is the same list inside it. A reducer must be a pure function: same state and same action always give the same answer, and nothing outside is changed. Return `{ ...state, items: [...state.items, newItem] }`.

</details>

<details><summary>Solution file (<code>solutions/src/exercises/Ex13.tsx</code>)</summary>

```tsx
import { StrictMode, useReducer } from 'react'
import { courses } from '../data.ts'
import { cartCount, cartTotal, cartReducer, initialCart } from '../reducers/cartReducer.ts'

// StrictMode runs every reducer twice in development, on purpose.
// A reducer that mutates its input gives a wrong answer here. A pure one does not.
// The version with push is in src/broken/B13Mutation.tsx.
function Cart() {
  const [cart, dispatch] = useReducer(cartReducer, initialCart)
  return (
    <div className="card">
      <button onClick={() => dispatch({ type: 'add', course: courses[0] })}>Add React for Beginners</button>
      <p>Rows: {cart.items.length}</p>
      {cart.items.map((i, index) => (
        <div key={index}>
          {i.course.title} x{i.quantity}
        </div>
      ))}
      <p>
        Count {cartCount(cart)} · Total Rs {cartTotal(cart)}
      </p>
    </div>
  )
}

export default function Ex13() {
  return (
    <StrictMode>
      <Cart />
    </StrictMode>
  )
}
```

</details>

<details><summary>Solution file (<code>solutions/src/broken/B13Mutation.tsx</code>)</summary>

```tsx
import { StrictMode, useReducer } from 'react'
import { courses } from '../data.ts'
import { initialCart, cartCount, cartTotal, type CartState, type CartAction } from '../reducers/cartReducer.ts'

// BROKEN on purpose: push changes the list that React still holds as the old state.
function badReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add':
      state.items.push({ course: action.course, quantity: 1 })
      return { ...state } // looks like a copy, but the list inside is the same one
    default:
      return state
  }
}

function Cart() {
  const [cart, dispatch] = useReducer(badReducer, initialCart)
  return (
    <div className="card">
      <button onClick={() => dispatch({ type: 'add', course: courses[0] })}>Add React for Beginners</button>
      <p>Rows: {cart.items.length}</p>
      {cart.items.map((i, index) => (
        <div key={index}>
          {i.course.title} x{i.quantity}
        </div>
      ))}
      <p>
        Count {cartCount(cart)} · Total Rs {cartTotal(cart)}
      </p>
    </div>
  )
}

export default function B13Mutation() {
  return (
    <StrictMode>
      <Cart />
    </StrictMode>
  )
}
```

</details>

**Where this shows up.** Mutation bugs in reducers are invisible in production builds (no double call) and loud in development. StrictMode is a gift: leave it on in your real projects.

### 14 · assertNever: the forgotten case
**Goal.** A study checklist reducer has four actions (`add`, `toggle`, `remove`, `clearDone`), but the `clearDone` case was forgotten. TypeScript can tell you **where** if the `default` branch returns `assertNever(action)`. Run the checker, read the error, then add the case so that "Clear finished" removes the lessons that are done. Build the small page too: a checkbox for each lesson, Remove, an input with Add, and the Clear finished button.

**Starter code:**

```tsx
type Action =
  | { type: 'add'; title: string }
  | { type: 'toggle'; id: number }
  | { type: 'remove'; id: number }
  | { type: 'clearDone' }

function assertNever(value: never): never {
  throw new Error('Unhandled action: ' + JSON.stringify(value))
}
// reducer: add, toggle, remove ... and the default: return assertNever(action)
```

**What you should see.** Before the fix, `npx tsc -p tsconfig.broken.json` (file `solutions/broken/Ex14Broken.tsx`) names the forgotten action:

```text
broken/Ex14Broken.tsx(27,26): error TS2345: Argument of type '{ type: "clearDone"; }' is not assignable to parameter of type 'never'.
```

After the fix: the checklist starts with 2 of 3 done, ticking the third makes it 3 of 3, adding Zustand makes it 3 of 4, and Clear finished leaves only Zustand. Real text:

```text
--- start ---
Study checklist (2 of 3 done)
 Prop drilling Remove
 Context Remove
 useReducer Remove
AddClear finished
--- after ticking useReducer ---
Study checklist (3 of 3 done)
 Prop drilling Remove
 Context Remove
 useReducer Remove
AddClear finished
--- after adding Zustand ---
Study checklist (3 of 4 done)
 Prop drilling Remove
 Context Remove
 useReducer Remove
 Zustand Remove
AddClear finished
--- after Clear finished ---
Study checklist (0 of 1 done)
 Zustand Remove
AddClear finished
```

<details><summary>Hint</summary>

The `default` branch is only reachable when `action` is not one of the cases you wrote. If you wrote them all, TypeScript knows `action` is `never` there, and `assertNever(action)` compiles. If you forgot one, `action` is that leftover action, and passing it to a `never` parameter is a type error that **names it**. Do not patch it with `default: return state`: that compiles, and the button silently does nothing.

</details>

<details><summary>Solution file (<code>solutions/src/exercises/Ex14.tsx</code>)</summary>

```tsx
import { useReducer, useState } from 'react'

type Lesson = { id: number; title: string; done: boolean }
type State = { lessons: Lesson[] }

type Action =
  | { type: 'add'; title: string }
  | { type: 'toggle'; id: number }
  | { type: 'remove'; id: number }
  | { type: 'clearDone' }

function assertNever(value: never): never {
  throw new Error('Unhandled action: ' + JSON.stringify(value))
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add': {
      const id = state.lessons.reduce((max, l) => Math.max(max, l.id), 0) + 1
      return { lessons: [...state.lessons, { id, title: action.title, done: false }] }
    }
    case 'toggle':
      return { lessons: state.lessons.map((l) => (l.id === action.id ? { ...l, done: !l.done } : l)) }
    case 'remove':
      return { lessons: state.lessons.filter((l) => l.id !== action.id) }
    case 'clearDone':
      return { lessons: state.lessons.filter((l) => !l.done) }
    default:
      return assertNever(action)
  }
}

export default function Ex14() {
  const [state, dispatch] = useReducer(reducer, {
    lessons: [
      { id: 1, title: 'Prop drilling', done: true },
      { id: 2, title: 'Context', done: true },
      { id: 3, title: 'useReducer', done: false },
    ],
  })
  const [title, setTitle] = useState('')

  return (
    <div className="card">
      <h3>Study checklist ({state.lessons.filter((l) => l.done).length} of {state.lessons.length} done)</h3>
      {state.lessons.map((l) => (
        <div key={l.id}>
          <label>
            <input type="checkbox" checked={l.done} onChange={() => dispatch({ type: 'toggle', id: l.id })} />{' '}
            {l.title}
          </label>{' '}
          <button onClick={() => dispatch({ type: 'remove', id: l.id })}>Remove</button>
        </div>
      ))}
      <input type="text" value={title} placeholder="New lesson" onChange={(e) => setTitle(e.target.value)} />
      <button
        onClick={() => {
          if (title.trim() === '') return
          dispatch({ type: 'add', title: title.trim() })
          setTitle('')
        }}
      >
        Add
      </button>
      <button onClick={() => dispatch({ type: 'clearDone' })}>Clear finished</button>
    </div>
  )
}
```

</details>

<details><summary>Solution file (<code>solutions/broken/Ex14Broken.tsx</code>)</summary>

```tsx
import { useReducer, useState } from 'react'

type Lesson = { id: number; title: string; done: boolean }
type State = { lessons: Lesson[] }

type Action =
  | { type: 'add'; title: string }
  | { type: 'toggle'; id: number }
  | { type: 'remove'; id: number }
  | { type: 'clearDone' }

function assertNever(value: never): never {
  throw new Error('Unhandled action: ' + JSON.stringify(value))
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add': {
      const id = state.lessons.reduce((max, l) => Math.max(max, l.id), 0) + 1
      return { lessons: [...state.lessons, { id, title: action.title, done: false }] }
    }
    case 'toggle':
      return { lessons: state.lessons.map((l) => (l.id === action.id ? { ...l, done: !l.done } : l)) }
    case 'remove':
      return { lessons: state.lessons.filter((l) => l.id !== action.id) }
    default:
      return assertNever(action)
  }
}

export default function Ex14Broken() {
  const [state, dispatch] = useReducer(reducer, {
    lessons: [
      { id: 1, title: 'Prop drilling', done: true },
      { id: 2, title: 'Context', done: true },
      { id: 3, title: 'useReducer', done: false },
    ],
  })
  const [title, setTitle] = useState('')

  return (
    <div className="card">
      <h3>Study checklist ({state.lessons.filter((l) => l.done).length} of {state.lessons.length} done)</h3>
      {state.lessons.map((l) => (
        <div key={l.id}>
          <label>
            <input type="checkbox" checked={l.done} onChange={() => dispatch({ type: 'toggle', id: l.id })} />{' '}
            {l.title}
          </label>{' '}
          <button onClick={() => dispatch({ type: 'remove', id: l.id })}>Remove</button>
        </div>
      ))}
      <input type="text" value={title} placeholder="New lesson" onChange={(e) => setTitle(e.target.value)} />
      <button
        onClick={() => {
          if (title.trim() === '') return
          dispatch({ type: 'add', title: title.trim() })
          setTitle('')
        }}
      >
        Add
      </button>
      <button onClick={() => dispatch({ type: 'clearDone' })}>Clear finished</button>
    </div>
  )
}
```

</details>

**Where this shows up.** Every time you add a feature to a reducer (a new action), `assertNever` shows you every `switch` that must learn about it. In the lesson, this is how the Clear button bug was found.

---

## Lesson 4 · Context and Reducer Together

### 15 · Cart store: context and reducer
**Goal.** Make a small app-wide store from your `cartReducer`. Create **two contexts**: `CartStateContext` for the state and `CartDispatchContext` for `dispatch`. A `CartProvider` uses `useReducer` and provides both. Two hooks, `useCart()` and `useCartDispatch()`, both throw a clear sentence when the provider is missing. Build **readers** (`Header` count, `Total`), a **reader and writer** (`CartList` with Remove buttons), and **writers** (two `AddButton`s, `CouponButton`, `ClearButton`) that only dispatch. Put a `Renders` counter on every piece. **Predict**: which counters go up when you add a course? Which when you apply the coupon on an **empty** cart?

**Starter code:**

```tsx
const CartStateContext = createContext<CartState | null>(null)
const CartDispatchContext = createContext<Dispatch<CartAction> | null>(null)

function CartProvider({ children }: { children: ReactNode }) {
  // const [state, dispatch] = useReducer(cartReducer, initialCart)
  // two providers, one inside the other
}
```

**What you should see.** Every counter starts at 1. Applying the coupon on the empty cart changes **nothing**: the reducer returns the very same state, so React sees no change and not one counter moves. After Add React: the header, the list and the total go to 2, while **all the buttons stay at 1**. After Add SQL: 3. After the coupon: 4. The readers follow every change, the writers are never drawn again. Real text:

```text
--- start ---
Header: cart 0
times 1
Add React for Beginners
times 1
Add SQL in Two Weeks
times 1
List: 0 rows
times 1
Total: Rs 0
times 1
Apply SAVE10
times 1
Clear
times 1
--- after Apply SAVE10 on the empty cart ---
Header: cart 0
times 1
Add React for Beginners
times 1
Add SQL in Two Weeks
times 1
List: 0 rows
times 1
Total: Rs 0
times 1
Apply SAVE10
times 1
Clear
times 1
--- after Add React ---
Header: cart 1
times 2
Add React for Beginners
times 1
Add SQL in Two Weeks
times 1
List: 1 rows
times 2
React for Beginners x1 Remove
Total: Rs 499
times 2
Apply SAVE10
times 1
Clear
times 1
--- after Add SQL ---
Header: cart 2
times 3
Add React for Beginners
times 1
Add SQL in Two Weeks
times 1
List: 2 rows
times 3
React for Beginners x1 Remove
SQL in Two Weeks x1 Remove
Total: Rs 898
times 3
Apply SAVE10
times 1
Clear
times 1
--- after Apply SAVE10 ---
Header: cart 2
times 4
Add React for Beginners
times 1
Add SQL in Two Weeks
times 1
List: 2 rows
times 4
React for Beginners x1 Remove
SQL in Two Weeks x1 Remove
Total: Rs 808
times 4
Apply SAVE10
times 1
Clear
times 1
```

<details><summary>Hint</summary>

`dispatch` from `useReducer` is the **same function** on every render, so the value of `CartDispatchContext` never changes, and components that read only that box are not drawn again. The `Catalog` and `CartPanel` wrapper components read nothing, so they must not take props from the provider: put them as children of the provider in `Ex15`. Type of dispatch: `Dispatch<CartAction>` from React.

</details>

<details><summary>Solution file (<code>solutions/src/exercises/Ex15.tsx</code>)</summary>

```tsx
import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react'
import { courses, type Course } from '../data.ts'
import { Renders } from '../Renders.tsx'
import {
  cartReducer,
  initialCart,
  cartCount,
  cartTotal,
  type CartAction,
  type CartState,
} from '../reducers/cartReducer.ts'

// Two boxes: one for the state (changes often), one for dispatch (never changes).
const CartStateContext = createContext<CartState | null>(null)
const CartDispatchContext = createContext<Dispatch<CartAction> | null>(null)

function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCart)
  return (
    <CartStateContext value={state}>
      <CartDispatchContext value={dispatch}>{children}</CartDispatchContext>
    </CartStateContext>
  )
}

function useCart(): CartState {
  const value = useContext(CartStateContext)
  if (value === null) throw new Error('useCart must be used inside CartProvider')
  return value
}

function useCartDispatch(): Dispatch<CartAction> {
  const value = useContext(CartDispatchContext)
  if (value === null) throw new Error('useCartDispatch must be used inside CartProvider')
  return value
}

// Readers
function Header() {
  const cart = useCart()
  return (
    <div className="row">
      Header: cart {cartCount(cart)}
      <Renders />
    </div>
  )
}

function Total() {
  const cart = useCart()
  return (
    <div className="row">
      Total: Rs {cartTotal(cart)}
      <Renders />
    </div>
  )
}

// Reader and writer
function CartList() {
  const cart = useCart()
  const dispatch = useCartDispatch()
  return (
    <div>
      <div className="row">
        List: {cart.items.length} rows
        <Renders />
      </div>
      {cart.items.map((i) => (
        <div key={i.course.id}>
          {i.course.title} x{i.quantity}{' '}
          <button onClick={() => dispatch({ type: 'remove', id: i.course.id })}>Remove</button>
        </div>
      ))}
    </div>
  )
}

// Writers: they only dispatch, so they are never drawn again.
function AddButton({ course }: { course: Course }) {
  const dispatch = useCartDispatch()
  return (
    <span className="row">
      <button onClick={() => dispatch({ type: 'add', course })}>Add {course.title}</button>
      <Renders />
    </span>
  )
}

function CouponButton() {
  const dispatch = useCartDispatch()
  return (
    <span className="row">
      <button onClick={() => dispatch({ type: 'applyCoupon', code: 'SAVE10' })}>Apply SAVE10</button>
      <Renders />
    </span>
  )
}

function ClearButton() {
  const dispatch = useCartDispatch()
  return (
    <span className="row">
      <button onClick={() => dispatch({ type: 'clear' })}>Clear</button>
      <Renders />
    </span>
  )
}

function Catalog() {
  return (
    <div>
      {courses.slice(0, 2).map((c) => (
        <AddButton key={c.id} course={c} />
      ))}
    </div>
  )
}

function CartPanel() {
  return (
    <div>
      <CartList />
      <Total />
      <CouponButton />
      <ClearButton />
    </div>
  )
}

export default function Ex15() {
  return (
    <CartProvider>
      <div className="card">
        <Header />
        <Catalog />
        <CartPanel />
      </div>
    </CartProvider>
  )
}
```

</details>

**Where this shows up.** This is the store the lesson built, and a real pattern in many apps that avoid extra libraries. Its limit is also real: a reader is drawn again whenever **anything** in the state changes. Exercise 16 fixes that.

---

## Lesson 5 · Zustand and Choosing Where State Lives

### 16 · Zustand: store and selectors
**Goal.** Install Zustand (`npm install zustand`) and rebuild the counters page with a store: `create<CartState>()((set) => ({ ... }))` with `items`, `coupon`, `add` and `applyCoupon`. No provider. Components: a `Badge` (`state.items.length`), a `Total` (works out the number from the items and the coupon), two `AddButton`s (each selects `state.add`), a `CouponButton` and a `CouponTag`. Every component passes **one selector**. Put `Renders` on all of them and **predict** the counters after Add React, then after Add SQL and Apply SAVE10.

**Starter code:**

```tsx
export const useCartStore = create<CartState>()((set) => ({
  items: [],
  coupon: null,
  add: (course) => set(/* new list, never push */),
  applyCoupon: (code) => set({ coupon: code }),
}))

const count = useCartStore((state) => state.items.length) // a selector
```

**What you should see.** After Add React only the badge and the total move (to 2): the add buttons, the coupon button and the coupon tag stay at 1. After Add SQL and Apply SAVE10 the badge is at 3, the coupon tag at 2 and the total at 4. The coupon did not draw the badge again, which the context version of exercise 15 could not avoid. Real text:

```text
--- start ---
Badge: 0
times 1
Add React for Beginners
times 1
Add SQL in Two Weeks
times 1
Apply SAVE10
times 1
Coupon tag: none
times 1
Total: Rs 0
times 1
--- after Add React ---
Badge: 1
times 2
Add React for Beginners
times 1
Add SQL in Two Weeks
times 1
Apply SAVE10
times 1
Coupon tag: none
times 1
Total: Rs 499
times 2
--- after Add SQL and Apply SAVE10 ---
Badge: 2
times 3
Add React for Beginners
times 1
Add SQL in Two Weeks
times 1
Apply SAVE10
times 1
Coupon tag: SAVE10
times 2
Total: Rs 808
times 4
```

<details><summary>Hint</summary>

A selector is a function that receives the whole board and returns one line of it. Zustand compares each answer with the last one, and only draws the component again when it changed. A function like `add` is created once, so a button that selects it is never drawn again. `set` **merges**: `set({ coupon: code })` keeps `items` as it was. Always make a new list: `set((state) => ({ items: [...state.items, course] }))`.

</details>

<details><summary>Solution file (<code>solutions/src/lib/cartStore16.ts</code>)</summary>

```ts
import { create } from 'zustand'
import type { Course } from '../data.ts'

export type CartState16 = {
  items: Course[]
  coupon: string | null
  add: (course: Course) => void
  applyCoupon: (code: string) => void
}

// The double round brackets are the TypeScript detail from lesson 5.
export const useCartStore = create<CartState16>()((set) => ({
  items: [],
  coupon: null,
  // set merges: fields we do not mention keep their old value.
  add: (course) => set((state) => ({ items: [...state.items, course] })),
  applyCoupon: (code) => set({ coupon: code }),
}))
```

</details>

<details><summary>Solution file (<code>solutions/src/exercises/Ex16.tsx</code>)</summary>

```tsx
import { courses, type Course } from '../data.ts'
import { Renders } from '../Renders.tsx'
import { useCartStore } from '../lib/cartStore16.ts'

// Every component picks ONE slice with a selector. There is no provider anywhere.
function Badge() {
  const count = useCartStore((state) => state.items.length)
  return (
    <div className="row">
      Badge: {count}
      <Renders />
    </div>
  )
}

function Total() {
  const items = useCartStore((state) => state.items)
  const coupon = useCartStore((state) => state.coupon)
  const subtotal = items.reduce((sum, c) => sum + c.price, 0)
  const total = coupon === null ? subtotal : subtotal - Math.round(subtotal * 0.1)
  return (
    <div className="row">
      Total: Rs {total}
      <Renders />
    </div>
  )
}

function AddButton({ course }: { course: Course }) {
  const add = useCartStore((state) => state.add) // a function: created once, never changes
  return (
    <span className="row">
      <button onClick={() => add(course)}>Add {course.title}</button>
      <Renders />
    </span>
  )
}

function CouponButton() {
  const applyCoupon = useCartStore((state) => state.applyCoupon)
  return (
    <span className="row">
      <button onClick={() => applyCoupon('SAVE10')}>Apply SAVE10</button>
      <Renders />
    </span>
  )
}

function CouponTag() {
  const coupon = useCartStore((state) => state.coupon)
  return (
    <div className="row">
      Coupon tag: {coupon ?? 'none'}
      <Renders />
    </div>
  )
}

export default function Ex16() {
  return (
    <div className="card">
      <Badge />
      <AddButton course={courses[0]} />
      <AddButton course={courses[1]} />
      <CouponButton />
      <CouponTag />
      <Total />
    </div>
  )
}
```

</details>

**The two mistakes to try, on purpose** (both are in the solutions menu under "Broken starters"):

1. **No selector.** `const { items } = useCartStore()` works and looks fine, but means "send me everything". The badge is drawn again when only the coupon changes. Real text from the browser (note the badge counter moving on the coupon):

```text
--- start ---
Badge: 0
times 1
Add React for BeginnersApply SAVE10
--- after Add ---
Badge: 1
times 2
Add React for BeginnersApply SAVE10
--- after Apply SAVE10 (badge moved though count did not change) ---
Badge: 1
times 3
Add React for BeginnersApply SAVE10
```

2. **A selector that builds a new object**, `useCartStore((state) => ({ count: state.items.length }))`. The page goes blank, because every call builds a brand new object, Zustand sees a "change", React draws again, and it never stops. Real result:

```text
--- start ---
(the page is blank: the crash removed everything)
--- console errors ---
The result of getSnapshot should be cached to avoid an infinite loop
PAGEERROR Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.
```

The fix is one simple value per selector, or `useShallow` from exercise 17.

**Where this shows up.** Many production React apps keep their cart, their editor state or their notifications in a store like this, because many pieces read a busy value and each picks only its own slice.

### 17 · useShallow and persist
**Goal.** Make a store with `items`, `coupon` and a `note` (a text typed in a small box). (1) A `Summary` component needs **two** values, the number of courses and the coupon, from **one** selector. Return them as an object, wrapped in `useShallow` from `zustand/react/shallow`, so it does not loop. Show that typing in the note box **does not** draw `Summary` again. (2) Wrap the store in `persist` from `zustand/middleware` with the name `m10-ex17`, so a real page refresh keeps everything.

**Starter code:**

```tsx
const { count, coupon } = useStore17(
  useShallow((s) => ({ count: s.items.length, coupon: s.coupon })),
)

export const useStore17 = create<State17>()(
  persist((set) => ({ /* ... */ }), { name: 'm10-ex17' }),
)
```

**What you should see.** `Summary: 0 courses · coupon none`. After Add React, Add SQL and Apply SAVE10, the Summary counter shows 4 (one start plus three changes). Typing `abc` in the note box moves the **NoteBox** counter, but the **Summary stays at 4**. After a real page refresh, the summary and the note are still there. The last block is what persist put on the localStorage shelf: only data, not the functions. Real text:

```text
--- start ---
Summary: 0 courses · coupon none
times 1
Add React for BeginnersAdd SQL in Two WeeksApply SAVE10
times 1
--- after Add, Add, Apply ---
Summary: 2 courses · coupon SAVE10
times 4
Add React for BeginnersAdd SQL in Two WeeksApply SAVE10
times 1
--- after typing abc in the note (Summary must not move) ---
Summary: 2 courses · coupon SAVE10
times 4
Add React for BeginnersAdd SQL in Two WeeksApply SAVE10
times 2
--- after a real page refresh ---
Summary: 2 courses · coupon SAVE10
times 1
Add React for BeginnersAdd SQL in Two WeeksApply SAVE10
times 1
--- localStorage m10-ex17 ---
{"state":{"items":[{"id":1,"title":"React for Beginners","price":499},{"id":2,"title":"SQL in Two Weeks","price":399}],"coupon":"SAVE10","note":"abc"},"version":0}
```

<details><summary>Hint</summary>

Without `useShallow`, a selector that returns `{ count, coupon }` builds a new object every time, which loops (see the broken example in exercise 16). `useShallow` compares the fields **inside** the object, not the object itself. The shelf key is the `name` you give `persist`; open the browser devtools, Application tab, Local Storage, to look at it. Notice the counters restart at 1 after the refresh: the page was built from scratch.

</details>

<details><summary>Solution file (<code>solutions/src/lib/cartStore17.ts</code>)</summary>

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Course } from '../data.ts'

type State17 = {
  items: Course[]
  coupon: string | null
  note: string
  add: (course: Course) => void
  applyCoupon: (code: string) => void
  setNote: (note: string) => void
}

// persist saves the data (not the functions) in localStorage under the key "m10-ex17".
export const useStore17 = create<State17>()(
  persist(
    (set) => ({
      items: [],
      coupon: null,
      note: '',
      add: (course) => set((s) => ({ items: [...s.items, course] })),
      applyCoupon: (code) => set({ coupon: code }),
      setNote: (note) => set({ note }),
    }),
    { name: 'm10-ex17' },
  ),
)
```

</details>

<details><summary>Solution file (<code>solutions/src/exercises/Ex17.tsx</code>)</summary>

```tsx
import { useShallow } from 'zustand/react/shallow'
import { courses } from '../data.ts'
import { Renders } from '../Renders.tsx'
import { useStore17 } from '../lib/cartStore17.ts'

// Two fields in one selector: wrapped in useShallow, so a NEW object with the
// SAME fields inside does not count as a change.
function Summary() {
  const { count, coupon } = useStore17(
    useShallow((s) => ({ count: s.items.length, coupon: s.coupon })),
  )
  return (
    <div className="row">
      Summary: {count} courses · coupon {coupon ?? 'none'}
      <Renders />
    </div>
  )
}

function NoteBox() {
  const note = useStore17((s) => s.note)
  const setNote = useStore17((s) => s.setNote)
  return (
    <div className="row">
      <input type="text" value={note} placeholder="Note" onChange={(e) => setNote(e.target.value)} />
      <Renders />
    </div>
  )
}

function Buttons() {
  const add = useStore17((s) => s.add)
  const applyCoupon = useStore17((s) => s.applyCoupon)
  return (
    <div>
      <button onClick={() => add(courses[0])}>Add React for Beginners</button>
      <button onClick={() => add(courses[1])}>Add SQL in Two Weeks</button>
      <button onClick={() => applyCoupon('SAVE10')}>Apply SAVE10</button>
    </div>
  )
}

export default function Ex17() {
  return (
    <div className="card">
      <Summary />
      <Buttons />
      <NoteBox />
    </div>
  )
}
```

</details>

**Where this shows up.** Persisting a cart, a draft or a user setting is two lines with `persist`. `useShallow` is what lets a component pick several values at once without drawing too much.

### 18 · Where does this state live?
**Goal.** Write a pure function `whereLives(facts)` that answers the three questions of Lesson 5 **in order**: Should a link recreate it? then `address`. Does it come from a server? then `server`. Do two components far apart need it? then `shared`. Otherwise `local`. Add `sharedTool(changesOften)` that returns `zustand` for a busy shared value and `context` for a slow one. Then show a table of eight things from the site and what your function says. Check it with `node scripts/ex18.ts`.

**Starter code:**

```tsx
export type Home = 'address' | 'server' | 'shared' | 'local'
export type Facts = { inAddress: boolean; fromServer: boolean; sharedFar: boolean }

export function whereLives(facts: Facts): Home {
  // ask the questions in order
}
```

**What you should see.** A table with eight rows. Search box words are local. The list of courses is server state. The cart is shared and busy, so Zustand. The catalog level filter and the page number live in the address. The theme and the signed-in user are shared and slow, so context. The menu being open is local. Real text from the browser, then the real output of the node check:

```text
--- start ---
Words in the search box while typing	local
List of courses from the API	server
Items in the cart	shared (zustand)
Level chosen in the catalog filter	address
Dark or light theme	shared (context)
Signed-in user	shared (context)
Is the menu open?	local
Page number of the results	address
```

```text
whereLives: all checks passed
```

<details><summary>Hint</summary>

Order matters: a value that is both in the address and needed in many places (the level filter) lives in the address, because the address is the source of truth, and components read it from there. `local` is the default: if none of the three questions says yes, keep it in `useState` next to the component. "Start local, and move up only when it hurts."

</details>

<details><summary>Solution file (<code>solutions/src/lib/whereLives.ts</code>)</summary>

```ts
export type Home = 'address' | 'server' | 'shared' | 'local'

export type Facts = {
  /** Should a link or a refresh bring it back? */
  inAddress: boolean
  /** Does the real copy live on a server? */
  fromServer: boolean
  /** Do two components far apart need it? */
  sharedFar: boolean
}

// The three questions, asked in this order. Local is the default.
export function whereLives(facts: Facts): Home {
  if (facts.inAddress) return 'address'
  if (facts.fromServer) return 'server'
  if (facts.sharedFar) return 'shared'
  return 'local'
}

// For shared state only: which tool?
export function sharedTool(changesOften: boolean): 'context' | 'zustand' {
  return changesOften ? 'zustand' : 'context'
}
```

</details>

<details><summary>Solution file (<code>solutions/scripts/ex18.ts</code>)</summary>

```ts
// Run with: node scripts/ex18.ts
import assert from 'node:assert/strict'
import { whereLives, sharedTool } from '../src/lib/whereLives.ts'

assert.equal(whereLives({ inAddress: false, fromServer: false, sharedFar: false }), 'local')
assert.equal(whereLives({ inAddress: false, fromServer: true, sharedFar: true }), 'server')
assert.equal(whereLives({ inAddress: false, fromServer: false, sharedFar: true }), 'shared')
assert.equal(whereLives({ inAddress: true, fromServer: false, sharedFar: true }), 'address')
// order matters: the address question comes first
assert.equal(whereLives({ inAddress: true, fromServer: true, sharedFar: true }), 'address')
assert.equal(sharedTool(true), 'zustand')
assert.equal(sharedTool(false), 'context')
console.log('whereLives: all checks passed')
```

</details>

<details><summary>Solution file (<code>solutions/src/exercises/Ex18.tsx</code>)</summary>

```tsx
import { whereLives, sharedTool, type Facts } from '../lib/whereLives.ts'

type Thing = { name: string; facts: Facts; changesOften: boolean }

const things: Thing[] = [
  { name: 'Words in the search box while typing', facts: { inAddress: false, fromServer: false, sharedFar: false }, changesOften: true },
  { name: 'List of courses from the API', facts: { inAddress: false, fromServer: true, sharedFar: true }, changesOften: false },
  { name: 'Items in the cart', facts: { inAddress: false, fromServer: false, sharedFar: true }, changesOften: true },
  { name: 'Level chosen in the catalog filter', facts: { inAddress: true, fromServer: false, sharedFar: true }, changesOften: false },
  { name: 'Dark or light theme', facts: { inAddress: false, fromServer: false, sharedFar: true }, changesOften: false },
  { name: 'Signed-in user', facts: { inAddress: false, fromServer: false, sharedFar: true }, changesOften: false },
  { name: 'Is the menu open?', facts: { inAddress: false, fromServer: false, sharedFar: false }, changesOften: false },
  { name: 'Page number of the results', facts: { inAddress: true, fromServer: false, sharedFar: false }, changesOften: false },
]

export default function Ex18() {
  return (
    <div className="card">
      <table>
        <tbody>
          {things.map((t) => {
            const home = whereLives(t.facts)
            return (
              <tr key={t.name}>
                <td>{t.name}</td>
                <td>
                  <strong>{home}</strong>
                  {home === 'shared' ? ` (${sharedTool(t.changesOften)})` : ''}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
```

</details>

**Where this shows up.** This is the question to ask every time you add a piece of state, and in every interview about state management. Putting everything in one big store is the mistake.

---

## Combine · Two Pieces of the Enrollment Cart

### 19 · Cart totals and coupons
**Goal.** Build the heart of the cart page without any store. (1) A pure function `getTotals(prices, code)` in `src/lib/totals.ts` that returns `{ subtotal, discount, total }`. Coupons: `SAVE10` is 10 percent (rounded), `FLAT200` is Rs 200 off. **The discount can never be more than the subtotal**, so the total never goes below 0. An unknown code gives no discount. Test it with `node scripts/ex19.ts`. (2) A small page with two courses, the subtotal, the discount, the total, and a coupon form with **local state** for the typed text and the message. Trim the spaces and change to capital letters before checking, so `save10` works. An unknown code shows `NOPE is not a coupon`. When a coupon is applied, show its name and a Remove coupon button.

**Starter code:**

```tsx
export const COUPONS: Record<string, Coupon> = {
  SAVE10: { kind: 'percent', value: 10 },
  FLAT200: { kind: 'flat', value: 200 },
}
export function getTotals(prices: number[], code: string | null): Totals {
  // subtotal, discount (capped), total
}
```

**What you should see.** Start: Subtotal Rs 898, Discount -Rs 0, Total Rs 898. Typing `nope` and Apply shows `NOPE is not a coupon` in red. Typing `  save10 ` (with spaces, small letters) works: discount Rs 90 (10 percent of 898 is 89.8, rounded to 90) and total Rs 808. After Remove coupon, `flat200` gives a discount of Rs 200 and a total of Rs 698. Real text from the browser, then the real output of the node test (including the cap: Rs 150 with FLAT200 gives discount 150 and total 0):

```text
--- start ---
React for Beginners · Rs 499
SQL in Two Weeks · Rs 399
Subtotal: Rs 898
Discount: -Rs 0
Total: Rs 898
Apply
--- after nope + Apply ---
React for Beginners · Rs 499
SQL in Two Weeks · Rs 399
Subtotal: Rs 898
Discount: -Rs 0
Total: Rs 898
Apply
NOPE is not a coupon
--- after "  save10 " + Apply ---
React for Beginners · Rs 499
SQL in Two Weeks · Rs 399
Subtotal: Rs 898
Discount: -Rs 90
Total: Rs 808
Coupon SAVE10 Remove coupon
--- after Remove coupon, flat200 + Apply ---
React for Beginners · Rs 499
SQL in Two Weeks · Rs 399
Subtotal: Rs 898
Discount: -Rs 200
Total: Rs 698
Coupon FLAT200 Remove coupon
```

```text
no coupon: { subtotal: 898, discount: 0, total: 898 }
SAVE10: { subtotal: 898, discount: 90, total: 808 }
FLAT200: { subtotal: 898, discount: 200, total: 698 }
FLAT200 on 150: { subtotal: 150, discount: 150, total: 0 }
getTotals: all checks passed
```

<details><summary>Hint</summary>

The three numbers are **derived**: work them out while drawing from the items and the coupon, never store them in state (Module 5, lesson 5). Only three things are state here: the applied coupon, the typed text and the message. `code in COUPONS` checks that the typed code is in the table. The cap is `Math.min(discount, subtotal)`. The rules live in `getTotals`, so if a coupon changes, one file changes.

</details>

<details><summary>Solution file (<code>solutions/src/lib/totals.ts</code>)</summary>

```ts
export type Coupon = { kind: 'percent'; value: number } | { kind: 'flat'; value: number }

export const COUPONS: Record<string, Coupon> = {
  SAVE10: { kind: 'percent', value: 10 },
  FLAT200: { kind: 'flat', value: 200 },
}

export type Totals = { subtotal: number; discount: number; total: number }

export function getTotals(prices: number[], code: string | null): Totals {
  const subtotal = prices.reduce((sum, p) => sum + p, 0)
  const coupon = code === null ? undefined : COUPONS[code]
  let discount = 0
  if (coupon !== undefined) {
    discount = coupon.kind === 'percent' ? Math.round((subtotal * coupon.value) / 100) : coupon.value
  }
  // The discount can never be more than the subtotal.
  discount = Math.min(discount, subtotal)
  return { subtotal, discount, total: subtotal - discount }
}
```

</details>

<details><summary>Solution file (<code>solutions/scripts/ex19.ts</code>)</summary>

```ts
// Run with: node scripts/ex19.ts
import assert from 'node:assert/strict'
import { getTotals } from '../src/lib/totals.ts'

const none = getTotals([499, 399], null)
console.log('no coupon:', none)
assert.deepEqual(none, { subtotal: 898, discount: 0, total: 898 })

const save10 = getTotals([499, 399], 'SAVE10')
console.log('SAVE10:', save10)
assert.deepEqual(save10, { subtotal: 898, discount: 90, total: 808 }) // 89.8 rounds to 90

const flat = getTotals([499, 399], 'FLAT200')
console.log('FLAT200:', flat)
assert.deepEqual(flat, { subtotal: 898, discount: 200, total: 698 })

const capped = getTotals([150], 'FLAT200')
console.log('FLAT200 on 150:', capped)
assert.deepEqual(capped, { subtotal: 150, discount: 150, total: 0 })

assert.deepEqual(getTotals([499, 399], 'NOPE'), { subtotal: 898, discount: 0, total: 898 })
assert.deepEqual(getTotals([], 'SAVE10'), { subtotal: 0, discount: 0, total: 0 })
console.log('getTotals: all checks passed')
```

</details>

<details><summary>Solution file (<code>solutions/src/exercises/Ex19.tsx</code>)</summary>

```tsx
import { useState, type FormEvent } from 'react'
import { courses } from '../data.ts'
import { COUPONS, getTotals } from '../lib/totals.ts'

// A cart page piece with local state only: the typed code, the message, and the applied coupon.
export default function Ex19() {
  const items = courses.slice(0, 2)
  const [coupon, setCoupon] = useState<string | null>(null)
  const [typed, setTyped] = useState('')
  const [message, setMessage] = useState('')

  // The numbers are derived while drawing. They are never stored.
  const { subtotal, discount, total } = getTotals(
    items.map((c) => c.price),
    coupon,
  )

  function apply(e: FormEvent) {
    e.preventDefault()
    const code = typed.trim().toUpperCase() // 'save10' is the same as 'SAVE10'
    if (!(code in COUPONS)) {
      setMessage(`${code} is not a coupon`)
      return
    }
    setCoupon(code)
    setTyped('')
    setMessage('')
  }

  return (
    <div className="card">
      {items.map((c) => (
        <div key={c.id}>
          {c.title} · Rs {c.price}
        </div>
      ))}
      <p>Subtotal: Rs {subtotal}</p>
      <p>Discount: -Rs {discount}</p>
      <p>
        <strong>Total: Rs {total}</strong>
      </p>
      {coupon !== null ? (
        <p>
          <span className="chip">Coupon {coupon}</span> <button onClick={() => setCoupon(null)}>Remove coupon</button>
        </p>
      ) : (
        <form onSubmit={apply}>
          <input type="text" value={typed} placeholder="Coupon code" onChange={(e) => setTyped(e.target.value)} />
          <button type="submit">Apply</button>
          {message !== '' && <p className="error">{message}</p>}
        </form>
      )}
    </div>
  )
}
```

</details>

**Where this shows up.** This is step 4 of the Enrollment Cart build video: the page knows nothing about the rules, only the code and the message. The same function will be used by the server later, because prices and coupons must be worked out there too.

### 20 · Enrollment cart with a safe shelf
**Goal.** Build the real Enrollment Cart store with Zustand and `persist`. Items are `{ slug, title, price }`. (1) `add` **ignores a course that is already in the cart**: a course is bought once. (2) Each course row has an `AddToCart` button that selects a **yes or no** (`state.items.some(...)`) and says **In cart** (disabled) when the course is in. (3) A `Badge` selects only `state.items.length`. (4) A cart page lists the items with Remove, uses `getTotals` from exercise 19, and has the coupon form. (5) `remove` clears the coupon when the cart becomes empty. (6) Persist with the key `m10-ex20-cart`, and **check the saved value with zod** in a `merge` function, so a damaged shelf gives an empty cart instead of a crash.

**Starter code:**

```tsx
const Saved = z.object({
  items: z.array(z.object({ slug: z.string(), title: z.string(), price: z.number() })),
  coupon: z.string().nullable(),
})

persist(creator, {
  name: 'm10-ex20-cart',
  merge: (saved, current) => {
    const result = Saved.safeParse(saved)
    return result.success ? { ...current, ...result.data } : current
  },
})
```

**What you should see.** A long run, every step with a real browser. Start with an empty shelf. Add React: `In cart`, Cart (1). Add SQL: Cart (2), Rs 898. The Docker row is still `Add to cart`. A forced click on a disabled `In cart` button changes nothing. `nope` shows `NOPE is not a coupon`. `save10` gives discount Rs 90 and total Rs 808. A **real refresh** keeps everything (and the block with the localStorage value shows what was saved: only data). Remove SQL: the discount drops to Rs 50 and the total is Rs 449 (10 percent of 499 is 49.9, rounded). Remove React too: the cart is empty and the coupon is gone. Then a **damaged shelf**, `items` set to the word `nope`, is loaded as an empty cart, and a good shelf with one course and `SAVE10` loads with the right totals. Real text:

```text
--- start (empty shelf) ---
Cart (0)
React for Beginners · Rs 499 Add to cart
SQL in Two Weeks · Rs 399 Add to cart
Docker for Developers · Rs 599 Add to cart
Your cart is empty.
--- after Add to cart on React ---
Cart (1)
React for Beginners · Rs 499 In cart
SQL in Two Weeks · Rs 399 Add to cart
Docker for Developers · Rs 599 Add to cart
React for Beginners · Rs 499 Remove
Subtotal: Rs 499
Discount: -Rs 0
Total: Rs 499
Apply
--- after Add to cart on SQL (React is In cart) ---
Cart (2)
React for Beginners · Rs 499 In cart
SQL in Two Weeks · Rs 399 In cart
Docker for Developers · Rs 599 Add to cart
React for Beginners · Rs 499 Remove
SQL in Two Weeks · Rs 399 Remove
Subtotal: Rs 898
Discount: -Rs 0
Total: Rs 898
Apply
--- after clicking the disabled In cart ---
Cart (2)
React for Beginners · Rs 499 In cart
SQL in Two Weeks · Rs 399 In cart
Docker for Developers · Rs 599 Add to cart
React for Beginners · Rs 499 Remove
SQL in Two Weeks · Rs 399 Remove
Subtotal: Rs 898
Discount: -Rs 0
Total: Rs 898
Apply
--- after nope + Apply ---
Cart (2)
React for Beginners · Rs 499 In cart
SQL in Two Weeks · Rs 399 In cart
Docker for Developers · Rs 599 Add to cart
React for Beginners · Rs 499 Remove
SQL in Two Weeks · Rs 399 Remove
Subtotal: Rs 898
Discount: -Rs 0
Total: Rs 898
Apply
NOPE is not a coupon
--- after save10 + Apply ---
Cart (2)
React for Beginners · Rs 499 In cart
SQL in Two Weeks · Rs 399 In cart
Docker for Developers · Rs 599 Add to cart
React for Beginners · Rs 499 Remove
SQL in Two Weeks · Rs 399 Remove
Subtotal: Rs 898
Discount: -Rs 90
Total: Rs 808
Coupon SAVE10 Remove coupon
--- after a real page refresh ---
Cart (2)
React for Beginners · Rs 499 In cart
SQL in Two Weeks · Rs 399 In cart
Docker for Developers · Rs 599 Add to cart
React for Beginners · Rs 499 Remove
SQL in Two Weeks · Rs 399 Remove
Subtotal: Rs 898
Discount: -Rs 90
Total: Rs 808
Coupon SAVE10 Remove coupon
--- localStorage m10-ex20-cart ---
{"state":{"items":[{"slug":"react-for-beginners","title":"React for Beginners","price":499},{"slug":"sql-in-two-weeks","title":"SQL in Two Weeks","price":399}],"coupon":"SAVE10"},"version":0}
--- after Remove SQL ---
Cart (1)
React for Beginners · Rs 499 In cart
SQL in Two Weeks · Rs 399 Add to cart
Docker for Developers · Rs 599 Add to cart
React for Beginners · Rs 499 Remove
Subtotal: Rs 499
Discount: -Rs 50
Total: Rs 449
Coupon SAVE10 Remove coupon
--- after Remove React (cart empty) ---
Cart (0)
React for Beginners · Rs 499 Add to cart
SQL in Two Weeks · Rs 399 Add to cart
Docker for Developers · Rs 599 Add to cart
Your cart is empty.
--- damaged shelf: items = "nope", after refresh ---
Cart (0)
React for Beginners · Rs 499 Add to cart
SQL in Two Weeks · Rs 399 Add to cart
Docker for Developers · Rs 599 Add to cart
Your cart is empty.
--- good shelf: one course and SAVE10, after refresh ---
Cart (1)
React for Beginners · Rs 499 In cart
SQL in Two Weeks · Rs 399 Add to cart
Docker for Developers · Rs 599 Add to cart
React for Beginners · Rs 499 Remove
Subtotal: Rs 499
Discount: -Rs 50
Total: Rs 449
Coupon SAVE10 Remove coupon
```

<details><summary>Hint</summary>

Order inside `remove`: work out the new list first, then set `coupon` to `null` if the list is empty. In `add`, `if (s.items.some(i => i.slug === item.slug)) return s` returns the very same state, so nothing is drawn. The saved text was valid JSON, so `persist` loaded it happily, and TypeScript cannot help because types vanish at run time (Module 9, lesson 4): that is why zod checks the shape in `merge`. The lesson showed the damaged shelf crashing the page with "items.reduce is not a function". Use `slug` from the title with `title.toLowerCase().replace(/[^a-z0-9]+/g, '-')`.

</details>

<details><summary>Solution file (<code>solutions/src/lib/cartStore20.ts</code>)</summary>

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { z } from 'zod'
import { COUPONS } from './totals.ts'

export type CartItem = { slug: string; title: string; price: number }

type CartState20 = {
  items: CartItem[]
  coupon: string | null
  add: (item: CartItem) => void
  remove: (slug: string) => void
  applyCoupon: (code: string) => void
  removeCoupon: () => void
}

// What a good shelf looks like. Types vanish at run time, so we check the saved data with zod.
const Saved = z.object({
  items: z.array(z.object({ slug: z.string(), title: z.string(), price: z.number() })),
  coupon: z.string().nullable(),
})

export const useCart20 = create<CartState20>()(
  persist(
    (set) => ({
      items: [],
      coupon: null,
      add: (item) =>
        set((s) => {
          if (s.items.some((i) => i.slug === item.slug)) return s // a course is bought once
          return { items: [...s.items, item] }
        }),
      remove: (slug) =>
        set((s) => {
          const items = s.items.filter((i) => i.slug !== slug)
          return { items, coupon: items.length === 0 ? null : s.coupon } // empty cart, no coupon
        }),
      applyCoupon: (code) => set((s) => (code in COUPONS && s.items.length > 0 ? { coupon: code } : s)),
      removeCoupon: () => set({ coupon: null }),
    }),
    {
      name: 'm10-ex20-cart',
      // The saved value is input from outside: only merge it when it fits the shape.
      merge: (saved, current) => {
        const result = Saved.safeParse(saved)
        return result.success ? { ...current, ...result.data } : current
      },
    },
  ),
)
```

</details>

<details><summary>Solution file (<code>solutions/src/exercises/Ex20.tsx</code>)</summary>

```tsx
import { useState, type FormEvent } from 'react'
import { courses } from '../data.ts'
import { getTotals } from '../lib/totals.ts'
import { useCart20 } from '../lib/cartStore20.ts'

function slugOf(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}

function Badge() {
  const count = useCart20((s) => s.items.length)
  return <h3>Cart ({count})</h3>
}

function AddToCart({ title, price }: { title: string; price: number }) {
  const slug = slugOf(title)
  const inCart = useCart20((s) => s.items.some((i) => i.slug === slug)) // a yes or no
  const add = useCart20((s) => s.add)
  return (
    <button disabled={inCart} onClick={() => add({ slug, title, price })}>
      {inCart ? 'In cart' : 'Add to cart'}
    </button>
  )
}

function CartPage() {
  const items = useCart20((s) => s.items)
  const coupon = useCart20((s) => s.coupon)
  const remove = useCart20((s) => s.remove)
  const applyCoupon = useCart20((s) => s.applyCoupon)
  const removeCoupon = useCart20((s) => s.removeCoupon)
  const [typed, setTyped] = useState('')
  const [message, setMessage] = useState('')

  const { subtotal, discount, total } = getTotals(
    items.map((i) => i.price),
    coupon,
  )

  function apply(e: FormEvent) {
    e.preventDefault()
    const code = typed.trim().toUpperCase()
    applyCoupon(code)
    if (useCart20.getState().coupon === code) {
      setTyped('')
      setMessage('')
    } else {
      setMessage(`${code} is not a coupon`)
    }
  }

  if (items.length === 0) return <p>Your cart is empty.</p>

  return (
    <div>
      {items.map((i) => (
        <div key={i.slug}>
          {i.title} · Rs {i.price} <button onClick={() => remove(i.slug)}>Remove</button>
        </div>
      ))}
      <p>Subtotal: Rs {subtotal}</p>
      <p>Discount: -Rs {discount}</p>
      <p>
        <strong>Total: Rs {total}</strong>
      </p>
      {coupon !== null ? (
        <p>
          <span className="chip">Coupon {coupon}</span> <button onClick={removeCoupon}>Remove coupon</button>
        </p>
      ) : (
        <form onSubmit={apply}>
          <input type="text" value={typed} placeholder="Coupon code" onChange={(e) => setTyped(e.target.value)} />
          <button type="submit">Apply</button>
          {message !== '' && <p className="error">{message}</p>}
        </form>
      )}
    </div>
  )
}

export default function Ex20() {
  return (
    <div className="card">
      <Badge />
      {courses.slice(0, 3).map((c) => (
        <div key={c.id}>
          {c.title} · Rs {c.price} <AddToCart title={c.title} price={c.price} />
        </div>
      ))}
      <hr />
      <CartPage />
    </div>
  )
}
```

</details>

**Where this shows up.** This is the cart of the Enrollment Cart build video (steps 1 to 5, plus the zod fix). A cart that works on your laptop is still not ready for real users: the price lives in the browser, the cart does not follow the student to another browser, and two tabs do not talk. Those need the server, which starts in Module 11.

---

**Score yourself:** 17 to 20 working solutions means you are ready for Module 11. Under 12, rewatch the lessons named above the exercises you missed. Exercises 3, 9, 13 and 16 (the render counters and the two silent traps) are the best practice for everything that follows.

## What next

In **Module 11 · Why Server State Is Different** you meet the other kind of shared data. The list of courses is not yours: it is a **copy** of data that lives on a server, and a copy can go out of date. It gets a tool of its own, and your cart store stays exactly as it is.
