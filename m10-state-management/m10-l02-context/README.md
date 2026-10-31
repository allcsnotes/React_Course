# M10-L02 · Context

> Video: Module 10, Lesson 2. Watch it first, then follow along here.

## What you'll learn

- What context is, as a radio station: `createContext` (the channel), the provider (the station) and `useContext` (the radio)
- Build a theme context and a user context, and read them at any depth with nothing passed through the middle
- Override a context for one part of the tree, and nest stations
- Avoid the two mistakes: the silent default value, and one big context that re-draws everything
- Know when to use context and when plain props are simpler

## Before you start

- Node 24. Check with `node --version`.
- No Docker needed. Best after M10-L01 in `../m10-l01-prop-drilling/` (the same page, with the same two shared facts).
- Work in `web/`. Swap versions with `sh ../use-version.sh NAME`.

## Files in this folder

| File | What it is |
|------|------------|
| `web/` | The project (Vite 8.3.5, React 19.3.1, TypeScript 7.0.2); `src/` holds `v2-hooks` |
| `versions/v0-drilled/` | Last lesson's page: theme and user passed down as props |
| `versions/v1-context/` | `ThemeContext.tsx` and `UserContext.tsx` with `useContext` |
| `versions/v1-nested-provider/` | One card wrapped in its own provider with the value `dark` |
| `versions/v1-old-provider-syntax/` | The same with the older `<Context.Provider>` syntax |
| `versions/v1-footer-default/` | Mistake one: the footer is outside the providers |
| `versions/v2-footer-throws/` | Default `null`, hooks that throw, footer still outside |
| `versions/v2-hooks/` | The finished version with `useTheme` and `useUser` |
| `versions/p-null-probe/` | A tiny file that shows the type error `ThemeValue \| null` |
| `versions/v3-one-big-context/` | Mistake two: theme and user in one context, with render counters |
| `versions/v3-split-contexts/` | One context per topic, with render counters |
| `use-version.sh` | Replaces everything in `web/src` with one version |

Each version folder is a complete `src/` (code, CSS, `main.tsx`, `data.ts`).

## Follow along

```bash
cd web
npm install
sh ../use-version.sh v0-drilled
npm run dev
```

Open the address Vite prints (this project asks for http://localhost:5202).

### 1. Last lesson's page

The page has two shared facts: the theme and the current user. The `CourseList` takes a theme and a user and only passes them on; so do `Page` and `CourseCard`. Only the `EnrollButton` at the bottom reads the user. Click `Dark mode`: every card turns dark. Click `Log in`: the header says `Hello, Lukas` and the three disabled buttons turn into `Enroll`.

```bash
npx tsc -b
```

No output means no errors. Now look at the same page after today's lesson: `CourseList` has no props at all, `CourseCard` has no `user`, and a button four levels down still knows who is logged in. That is context.

### 2. A radio station

The station sends a signal into the air. It does not run a cable to every house. Any radio in range can tune in, and the houses in between do not need to know. Context has three parts:

1. The channel, made with `createContext`.
2. The station, the provider, which broadcasts a value.
3. The radio, `useContext`, which listens to the closest station above it.

Two rules: a radio hears the closest station above it, and a radio outside every station hears only the default value, a recording you write when you create the channel.

### 3. The theme context

```bash
sh ../use-version.sh v1-context
```

`ThemeContext.tsx`:
```tsx
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'

export type Theme = 'light' | 'dark'
type ThemeValue = {
  theme: Theme
  toggle: () => void
}

export const ThemeContext = createContext<ThemeValue>({
  theme: 'light',
  toggle: () => {},
})

type Props = { children: ReactNode }

export function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState<Theme>('light')
  const toggle = () =>
    setTheme(theme === 'light' ? 'dark' : 'light')
  return (
    <ThemeContext value={{ theme, toggle }}>
      <div className="app" data-theme={theme}>
        {children}
      </div>
    </ThemeContext>
  )
}
```

`Theme` is a union (module 9). `createContext<ThemeValue>` takes the shape in angle brackets and a default value (`light` and a toggle that does nothing). `ThemeProvider` keeps the real memory with `useState` and returns the context with `value={{ theme, toggle }}`. It also draws the page `div` with a `data-theme` attribute (module 6, lesson 3). `children` is whatever sits inside it.

In React 19 the context itself is the provider tag: `<ThemeContext value={...}>`. In older code you will see `<ThemeContext.Provider value={...}>`; both work (`versions/v1-old-provider-syntax` shows the old form).

In `App`, wrap the page with the provider:

`App.tsx`:
```tsx
import { ThemeProvider } from './ThemeContext.tsx'
import { UserProvider } from './UserContext.tsx'
import Page from './Page.tsx'

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Page />
      </UserProvider>
    </ThemeProvider>
  )
}
```

Now a radio: the theme switch in the header. One line asks "what is the closest station saying?":

`Header.tsx`:
```tsx
import { useContext } from 'react'
import { ThemeContext } from './ThemeContext.tsx'
import { UserContext } from './UserContext.tsx'

function ThemeSwitch() {
  const { theme, toggle } = useContext(ThemeContext)
  return (
    <button className="ghost" onClick={toggle}>
      {theme === 'light' ? 'Dark mode' : 'Light mode'}
    </button>
  )
}

function UserMenu() {
  const { user, login, logout } = useContext(UserContext)
  if (!user) return <button onClick={login}>Log in</button>
  return (
    <>
      <span className="hello">Hello, {user.name}</span>
      <button className="ghost" onClick={logout}>
        Log out
      </button>
    </>
  )
}

export default function Header() {
  return (
    <div className="header">
      <span className="logo">allcsvideos</span>
      <div className="bar">
        <UserMenu />
        <ThemeSwitch />
      </div>
    </div>
  )
}
```

Guess first: the page is light, Lukas clicks the button once. What does the page do, and what does the button say afterwards? Click it. The whole page turns dark and the button says `Light mode`. One click called `setTheme` inside the provider, and every radio drew itself again.

`CourseCard` listens too, and reads the theme to pick its class (`card-light` or `card-dark`). The `CourseList` in between passes nothing, not one prop:

`CourseCard.tsx`:
```tsx
import { useContext } from 'react'
import type { Course } from './data.ts'
import { ThemeContext } from './ThemeContext.tsx'
import { UserContext } from './UserContext.tsx'

function EnrollButton() {
  const { user } = useContext(UserContext)
  if (!user) {
    return (
      <button disabled>Log in to enroll</button>
    )
  }
  return <button>Enroll</button>
}

type Props = { course: Course }

export default function CourseCard({ course }: Props) {
  const { theme } = useContext(ThemeContext)
  return (
    <div className={`card card-${theme}`}>
      <div className="thumb" />
      <h2>{course.title}</h2>
      <p>
        by {course.teacher} · Rs {course.price}
      </p>
      <EnrollButton />
    </div>
  )
}
```

`CourseList.tsx`:
```tsx
import { courses } from './data.ts'
import CourseCard from './CourseCard.tsx'

export default function CourseList() {
  return (
    <div className="main">
      <h1>Courses</h1>
      <div className="grid">
        {courses.map((c) => (
          <CourseCard key={c.slug} course={c} />
        ))}
      </div>
    </div>
  )
}
```

Check the types and the build:

```bash
npx tsc -b
```

### 4. Override for one part of the tree

Wrap one single card in its own provider with the value `dark`:

```bash
sh ../use-version.sh v1-nested-provider
```
`CourseList.tsx` (changes marked with + and -):
```diff
@@ -2,2 +2,3 @@
 import CourseCard from './CourseCard.tsx'
+import { ThemeContext } from './ThemeContext.tsx'
 
@@ -8,5 +9,9 @@
       <div className="grid">
-        {courses.map((c) => (
-          <CourseCard key={c.slug} course={c} />
-        ))}
+        <CourseCard course={courses[0]} />
+        <ThemeContext
+          value={{ theme: 'dark', toggle: () => {} }}
+        >
+          <CourseCard course={courses[1]} />
+        </ThemeContext>
+        <CourseCard course={courses[2]} />
       </div>
```

The middle card is dark on a light page. The other two still hear the first station. (A radio hears the closest station above it.)

### 5. A second station: the user

The pattern is the same. The user is `User | null` (nobody logged in). Login sets Lukas, logout sets `null` again; this practice login asks for no password.

`UserContext.tsx`:
```tsx
import { createContext, useState } from 'react'
import type { ReactNode } from 'react'

export type User = { name: string }
type UserValue = {
  user: User | null
  login: () => void
  logout: () => void
}

export const UserContext = createContext<UserValue>({
  user: null,
  login: () => {},
  logout: () => {},
})

type Props = { children: ReactNode }

export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const login = () => setUser({ name: 'Lukas' })
  const logout = () => setUser(null)
  return (
    <UserContext value={{ user, login, logout }}>
      {children}
    </UserContext>
  )
}
```

In `App` the second station goes inside the first. Stations can nest. Page sits under both. The user menu in the header reads the user and both functions, and deep inside every card the `EnrollButton` reads only the user; `null` means log in first. Run `v1-context`: logged out you see three disabled buttons that say `Log in to enroll`. Click `Log in`: the header says `Hello, Lukas`, and all three buttons say `Enroll`.

`Page`, `CourseList` and `CourseCard` know nothing about the user. There is not one line about the user in those three files (the card only has the small `EnrollButton` that uses it). That is the point of context.

### 6. Mistake one: the default value surprise

Asha makes the footer show the current theme, and puts the footer outside the stations, in `App`, below the provider:

```bash
sh ../use-version.sh v1-footer-default
```
`App.tsx` (changes marked with + and -):
```diff
@@ -3,2 +3,3 @@
 import Page from './Page.tsx'
+import Footer from './Footer.tsx'
 
@@ -6,7 +7,10 @@
   return (
-    <ThemeProvider>
-      <UserProvider>
-        <Page />
-      </UserProvider>
-    </ThemeProvider>
+    <>
+      <ThemeProvider>
+        <UserProvider>
+          <Page />
+        </UserProvider>
+      </ThemeProvider>
+      <Footer />
+    </>
   )
```

`Footer.tsx` (changes marked with + and -):
```diff
@@ -1,3 +1,11 @@
+import { useContext } from 'react'
+import { ThemeContext } from './ThemeContext.tsx'
+
 export default function Footer() {
-  return <div className="footer">allcsvideos</div>
+  const { theme } = useContext(ThemeContext)
+  return (
+    <div className="footer">
+      allcsvideos · theme: {theme}
+    </div>
+  )
 }
```

Click `Dark mode`: the page goes dark, but the footer stays light and says `theme: light`. The footer is outside every station, so it hears the default value. A default is used only when there is no provider above. The app looks like it works, and the footer quietly lies.

Let's make the silent bug loud. Change the default to `null` and say so in the type: `createContext<ThemeValue | null>(null)`. Now a forgotten station cannot hide. But `useContext` may now return `null`, and TypeScript objects (this is `versions/p-null-probe`: it exports the context and reads it directly):

```bash
sh ../use-version.sh p-null-probe
```
`Probe.tsx`:
```tsx
import { useContext } from 'react'
import { ThemeContext } from './ThemeContext.tsx'

export default function Probe() {
  const { theme } = useContext(ThemeContext)
  return <span>{theme}</span>
}
```

```bash
npx tsc -b
src/Probe.tsx:5:11 - error TS2339: Property 'theme' does not exist on type 'ThemeValue | null'.

5   const { theme } = useContext(ThemeContext)
            ~~~~~

Found 1 error in src/Probe.tsx:5
```

The fix is a small custom hook (module 7): `useTheme` calls `useContext`, and if the value is `null` it throws our own sentence.

```bash
sh ../use-version.sh v2-hooks
```

`ThemeContext.tsx`:
```tsx
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type Theme = 'light' | 'dark'
type ThemeValue = {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeValue | null>(null)

type Props = { children: ReactNode }

export function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState<Theme>('light')
  const toggle = () =>
    setTheme(theme === 'light' ? 'dark' : 'light')
  return (
    <ThemeContext value={{ theme, toggle }}>
      <div className="app" data-theme={theme}>
        {children}
      </div>
    </ThemeContext>
  )
}

export function useTheme() {
  const value = useContext(ThemeContext)
  if (value === null) {
    throw new Error(
      'useTheme must be used inside <ThemeProvider>',
    )
  }
  return value
}
```

Every radio now says `useTheme()` instead of `useContext(ThemeContext)`. The user context gets the same treatment, a `useUser` hook (see `versions/v2-hooks/UserContext.tsx`). The components get shorter, and nobody can use the context without a provider.

```bash
npx tsc -b
```
```bash
npx tsc -b
```

```bash
npm run build
> allcsvideos-web@0.0.0 build
> tsc -b && vite build

vite v8.3.5 building client environment for production...
transforming...
✓ 24 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-txG4Ils6.css    2.02 kB │ gzip:  0.81 kB
dist/assets/index-nbmBRKTI.js   221.91 kB │ gzip: 69.32 kB

✓ built in 390ms
```

(The file hashes can differ on your machine.) Now put the footer outside the provider again:

```bash
sh ../use-version.sh v2-footer-throws
```

The screen goes blank, and the console says, in red: `useTheme must be used inside <ThemeProvider>`. A clear sentence, instead of a quiet lie. You met this crash in module 8, lesson 1: a link outside the router crashed with an error about `useContext` being `null`. The router is a provider too.

### 7. Mistake two: one big station

Asha puts the theme and the user into a single context, one value with five parts. It looks tidy. To see the cost, `versions/v3-one-big-context` has render counters from lesson 1 on the menu, the switch, the page, the list, the cards, the enroll buttons and the footer.

```bash
sh ../use-version.sh v3-one-big-context
```

`AppContext.tsx`:
```tsx
import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export type Theme = 'light' | 'dark'
export type User = { name: string }
type AppValue = {
  theme: Theme
  toggle: () => void
  user: User | null
  login: () => void
  logout: () => void
}

const AppContext = createContext<AppValue | null>(null)

type Props = { children: ReactNode }

export function AppProvider({ children }: Props) {
  const [theme, setTheme] = useState<Theme>('light')
  const [user, setUser] = useState<User | null>(null)
  const toggle = () =>
    setTheme(theme === 'light' ? 'dark' : 'light')
  const login = () => setUser({ name: 'Lukas' })
  const logout = () => setUser(null)
  return (
    <AppContext
      value={{ theme, toggle, user, login, logout }}
    >
      <div className="app" data-theme={theme}>
        {children}
      </div>
    </AppContext>
  )
}

export function useApp() {
  const value = useContext(AppContext)
  if (value === null) {
    throw new Error(
      'useApp must be used inside <AppProvider>',
    )
  }
  return value
}
```

At the start every counter says 1:

```bash
(counters on the page at the start)
menu 1, switch 1, page 1, list 1, card 1 enroll 1 (three of each), footer 1
```

Click `Log in`. The menu goes to 2 and so do the enroll buttons, as expected. But look: the theme switch and the three cards went up too, though nothing about the theme changed:

```bash
(counters after clicking Log in)
menu 2, switch 2, page 1, list 1, cards 2, enroll buttons 2, footer 1
```

When the value of a provider changes, React draws every component that listens again. It cannot tell which part of the object you read. The user changed, so the whole value changed. Then click `Dark mode`:

```bash
(then after clicking Dark mode)
menu 3, switch 3, page 1, list 1, cards 3, enroll buttons 3, footer 1
```

The fix is one station for each topic, like the two we built.

```bash
sh ../use-version.sh v3-split-contexts
```

Same start, then the same click on `Log in`: only the menu and the enroll buttons go to 2; the switch and the cards stay at 1:

```bash
(counters on the page at the start)
menu 1, switch 1, page 1, list 1, card 1 enroll 1 (three of each), footer 1
```

```bash
(counters after clicking Log in)
menu 2, switch 1, page 1, list 1, cards 1, enroll buttons 2, footer 1
```

Now `Dark mode`: the switch and the cards go up. The enroll buttons go up too, but only because they sit inside the cards, and React draws the children of a card when the card draws again:

```bash
(then after clicking Dark mode)
menu 2, switch 2, page 1, list 1, cards 2, enroll buttons 3, footer 1
```

### 8. When to use context

Use context for a value that many components, at many different depths, need, and that changes rarely: the theme, the current user, the language of the page. Do not use it if a value travels only one or two levels (plain props are simpler, because you can see where it comes from), or for a value that changes all the time. And context does not store anything: `useState` still holds the memory, inside each provider. Context only carries the value down to whoever listens.

## Common mistakes

- Putting a component that needs a provider outside it. With a `null` default and a throwing hook you get a clear error instead of a wrong default.
- Writing a context default that looks reasonable (`'light'`) and hides a missing provider.
- One big context for unrelated facts. Every listener re-draws when any part changes. Split by topic.
- Reaching for context for a value that goes one or two levels. Plain props show where the value comes from.
- Forgetting that context stores nothing. You still need `useState` (or `useReducer`) in the provider.

## Clean up

Stop the dev server with Ctrl+C. Delete `web/node_modules` and `web/dist` if you want. Run `sh ../use-version.sh v2-hooks` so `src/` holds the finished version.

## Key ideas (recap)

1. Context is a radio station. `createContext` makes the channel, the provider broadcasts a value, and `useContext` listens at any depth, with nothing passed through the middle.
2. A radio hears the closest provider above it. Outside every provider it hears the default, silently. So default to `null`, and wrap `useContext` in a hook that throws a clear error.
3. When the value changes, every listener draws again. Split contexts by topic, and use context for slow, wide values like the theme and the user, not for fast ones.

Interview question (Rahul): what is context, and what is its drawback? A good answer: context lets a component read a value from the closest provider above it, without passing props through every level. The drawback is that when the provider's value changes, every component that listens re-renders, so keep contexts small and split by topic, and do not use it for fast-changing state.

## Try it yourself

Add a third station, a language, with the values `english` and `hindi`, and a button that switches it. Add a render counter to one radio and check that it does not re-draw when the language changes. (Answer below.)

Answer: copy `ThemeContext.tsx` to `LanguageContext.tsx` with `type Language = 'english' | 'hindi'`, a `LanguageProvider` that keeps the value in `useState`, and a `useLanguage` hook that throws outside the provider. Wrap it in `App`. Use `useRenderCount` from `versions/v3-split-contexts/` in a component that only reads the theme: because the language is its own context, that component's counter does not move when you switch the language.

## Next

Module 10, Lesson 3: [useReducer](../m10-l03-usereducer/README.md).
