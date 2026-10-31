# M10-L01 · Prop Drilling

> Video: Module 10, Lesson 1. Watch it first, then follow along here.

## What you'll learn

- What prop drilling is: passing a value through components that do not use it, only to reach one further down
- See it in real numbers: how many files a new shared fact changes, and which components re-run
- Spot the bugs drilling invites: a forgotten prop crashes the page or fails silently
- Try composition (`header` and `list` passed as props) to remove floors
- Know when plain props are the right tool, and when you need context (next lesson)

## Before you start

- Node 24. Check with `node --version`.
- No Docker needed. `git` is used once, only to count changed files in a scratch repo.
- Best after M09-L04 in `../../m09-typescript-for-react/m09-l04-typing-api-data-with-zod/` and the lifting-state lesson (M04-L05).

## Files in this folder

| File | What it is |
|------|------------|
| `web/` | The project (Vite 8.3.5, React 19.3.1, TypeScript 7.0.2); `src/` holds version `v2-language` |
| `versions/v1-drilling/` | The page before the language: theme and user drilled down |
| `versions/v2-language/` | After Priya's request: `lang` added, and drilled through five components |
| `versions/v3-composition/` | `header` and `list` passed to `Page` as props |
| `versions/bad1-missing-user/` | Mistake one: `user` not handed to the button |
| `versions/bad2-missing-lang/` | Mistake two: `lang` not handed to the button |
| `versions/counters/` | Every component shows a render counter (`Renders.tsx`); React strict mode removed |
| `use-version.sh` | Replaces everything in `web/src` with one version |

Every folder in `versions/` is a complete `src/` (code, CSS and `main.tsx`), like the small script the video uses to swap them. From inside `web/`: `sh ../use-version.sh v1-drilling`.

## Follow along

```bash
cd web
npm install
sh ../use-version.sh v1-drilling
npm run dev
```

Open the address Vite prints (this project asks for http://localhost:5201).

### 1. Asha's page

A header with the logo, the name of the logged-in person, and a switch for dark mode. Below it, three course cards with an Enroll button. Two facts are shared by the whole page: the theme (light or dark) and the current user (Lukas, free plan). Click the switch: the page goes dark, the logo changes colour, and the button icons change too.

The two facts live in `App.tsx`, the closest parent of everything that needs them:

`App.tsx`:
```tsx
import { useState } from 'react'
import Page from './Page.tsx'
import type { Theme, User } from './types.ts'

export default function App() {
  const [theme, setTheme] = useState<Theme>('light')
  const [user] = useState<User>({ name: 'Lukas', plan: 'free' })

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  return (
    <div className={`app ${theme}`}>
      <Page theme={theme} user={user} onToggleTheme={toggleTheme} />
    </div>
  )
}
```

### 2. Follow the user down

Who really needs them? The `Logo` needs the theme. The `ThemeSwitch` needs the theme and the function that flips it. The `UserMenu` and `Avatar` need the user. And the `EnrollButton` needs both. Now follow the user from the top:

`Page.tsx`:
```tsx
import Header from './Header.tsx'
import CourseList from './CourseList.tsx'
import Footer from './Footer.tsx'
import type { Theme, User } from './types.ts'

type Props = { theme: Theme; user: User; onToggleTheme: () => void }

export default function Page({ theme, user, onToggleTheme }: Props) {
  return (
    <main>
      <Header theme={theme} user={user} onToggleTheme={onToggleTheme} />
      <CourseList theme={theme} user={user} />
      <Footer />
    </main>
  )
}
```

`Page` takes `theme`, `user` and `onToggleTheme`, and does nothing with them except hand them on.

`CourseList.tsx`:
```tsx
import CourseCard from './CourseCard.tsx'
import { courses } from './courses.ts'
import type { Theme, User } from './types.ts'

type Props = { theme: Theme; user: User }

export default function CourseList({ theme, user }: Props) {
  return (
    <section className="grid">
      {courses.map(c => (
        <CourseCard key={c.slug} course={c} theme={theme} user={user} />
      ))}
    </section>
  )
}
```

`CourseCard.tsx`:
```tsx
import EnrollButton from './EnrollButton.tsx'
import type { Course, Theme, User } from './types.ts'

type Props = { course: Course; theme: Theme; user: User }

export default function CourseCard({ course, theme, user }: Props) {
  const price = course.price === 0 ? 'Free' : `Rs ${course.price}`
  return (
    <article className="card">
      <h2>{course.title}</h2>
      <p>{course.teacher} · {price}</p>
      <EnrollButton theme={theme} user={user} />
    </article>
  )
}
```

`EnrollButton.tsx`:
```tsx
import type { Theme, User } from './types.ts'

type Props = { theme: Theme; user: User }

export default function EnrollButton({ theme, user }: Props) {
  const color = theme === 'dark' ? '#8ab4ff' : '#1a56db'
  return (
    <button className="enroll">
      <svg width="14" height="14" viewBox="0 0 14 14">
        <path d="M2 1 L13 7 L2 13 Z" fill={color} />
      </svg>
      Enroll as {user.name}
    </button>
  )
}
```

So the user travels from `App`, through `Page`, through `CourseList`, through `CourseCard`, and only there, in the button, it is used. A real check: which files contain the word `user`?

```bash
cd src
```
```bash
grep -lw user *.tsx
App.tsx
Avatar.tsx
CourseCard.tsx
CourseList.tsx
EnrollButton.tsx
Header.tsx
Page.tsx
UserMenu.tsx
```

```bash
cd ..
```

Eight files. This is called prop drilling: the value goes through the middle floors like a drill. Think of an office building with five floors: a parcel for Priya on the fifth floor, and the only road is the lift. Every floor's desk must take the parcel and pass it on. If one forgets, the parcel is lost.

Check that this version compiles:

```bash
npx tsc -b
```

No output means no errors.

### 3. Real numbers: what re-runs

`versions/counters` adds a tiny counter to every component. It uses a ref (module 7, lesson 4): each time the function runs, it adds one and draws the number. Strict mode is removed from `main.tsx` in this version, so each component runs exactly once on the first draw.

`Renders.tsx`:
```tsx
import { useRef } from 'react'

export default function Renders({ name }: { name: string }) {
  const count = useRef(0)
  count.current += 1
  return <i className="rc" data-name={name}>×{count.current}</i>
}
```

```bash
sh ../use-version.sh counters
```

Every counter says `×1`:

```bash
(read the counters on the page)
App ×1  Page ×1  Header ×1  Logo ×1  UserMenu ×1  Avatar ×1  ThemeSwitch ×1
CourseList ×1  CourseCard ×1  EnrollButton ×1 (three of each)  Footer ×1
```

Guess first: Lukas clicks the dark mode switch once. The Footer takes no props at all. What will its counter show? Now click the switch and read the counters:

```bash
(read the counters after one click on the dark mode switch)
App ×2  Page ×2  Header ×2  Logo ×2  UserMenu ×2  Avatar ×2  ThemeSwitch ×2
CourseList ×2  CourseCard ×2  EnrollButton ×2 (three of each)  Footer ×2
```

The Footer, which takes not a single prop, also ran again. That is the rule from module 4, lesson 3: when React draws a component, it draws everything below it again. The whole tree re-ran.

### 4. Priya's request: German buttons

Lukas lives in Frankfurt, so the buttons should speak German. That is one new fact: the language. It sounds like a ten second change. Switch to the version with the new fact:

```bash
sh ../use-version.sh v2-language
```

`types.ts`:
```ts
export type Theme = 'light' | 'dark'

export type Lang = 'en' | 'de'

export type User = {
  name: string
  plan: 'free' | 'pro'
}

export type Course = {
  slug: string
  title: string
  teacher: string
  price: number
}
```

In `App` there is one more line of state: `lang`, starting as `'de'`. Here is the real change, from git. In a scratch folder with two commits (v1 and v2), `git diff --stat` says:

```bash
git diff --stat
 src/App.tsx          | 10 ++++++++--
 src/CourseCard.tsx   |  8 ++++----
 src/CourseList.tsx   |  8 ++++----
 src/EnrollButton.tsx | 13 +++++++++----
 src/Page.tsx         |  8 ++++----
 src/types.ts         |  2 ++
 6 files changed, 31 insertions(+), 18 deletions(-)
```

Six files, 31 lines added, 18 removed. And of the five components on the road, only `EnrollButton` actually uses the language. The others just receive it and hand it on:

`Page.tsx` (changes marked with + and -):
```diff
@@ -3,7 +3,7 @@
 import Footer from './Footer.tsx'
-import type { Theme, User } from './types.ts'
+import type { Lang, Theme, User } from './types.ts'
 
-type Props = { theme: Theme; user: User; onToggleTheme: () => void }
+type Props = { theme: Theme; user: User; lang: Lang; onToggleTheme: () => void }
 
-export default function Page({ theme, user, onToggleTheme }: Props) {
+export default function Page({ theme, user, lang, onToggleTheme }: Props) {
   return (
@@ -11,3 +11,3 @@
       <Header theme={theme} user={user} onToggleTheme={onToggleTheme} />
-      <CourseList theme={theme} user={user} />
+      <CourseList theme={theme} user={user} lang={lang} />
       <Footer />
```

`CourseList.tsx` (changes marked with + and -):
```diff
@@ -2,7 +2,7 @@
 import { courses } from './courses.ts'
-import type { Theme, User } from './types.ts'
+import type { Lang, Theme, User } from './types.ts'
 
-type Props = { theme: Theme; user: User }
+type Props = { theme: Theme; user: User; lang: Lang }
 
-export default function CourseList({ theme, user }: Props) {
+export default function CourseList({ theme, user, lang }: Props) {
   return (
@@ -10,3 +10,3 @@
       {courses.map(c => (
-        <CourseCard key={c.slug} course={c} theme={theme} user={user} />
+        <CourseCard key={c.slug} course={c} theme={theme} user={user} lang={lang} />
       ))}
```

`CourseCard.tsx` (changes marked with + and -):
```diff
@@ -1,7 +1,7 @@
 import EnrollButton from './EnrollButton.tsx'
-import type { Course, Theme, User } from './types.ts'
+import type { Course, Lang, Theme, User } from './types.ts'
 
-type Props = { course: Course; theme: Theme; user: User }
+type Props = { course: Course; theme: Theme; user: User; lang: Lang }
 
-export default function CourseCard({ course, theme, user }: Props) {
+export default function CourseCard({ course, theme, user, lang }: Props) {
   const price = course.price === 0 ? 'Free' : `Rs ${course.price}`
@@ -11,3 +11,3 @@
       <p>{course.teacher} · {price}</p>
-      <EnrollButton theme={theme} user={user} />
+      <EnrollButton theme={theme} user={user} lang={lang} />
     </article>
```

Only at the bottom something really happens, a small table of labels, English and German:

`EnrollButton.tsx` (changes marked with + and -):
```diff
@@ -1,6 +1,11 @@
-import type { Theme, User } from './types.ts'
+import type { Lang, Theme, User } from './types.ts'
 
-type Props = { theme: Theme; user: User }
+type Props = { theme: Theme; user: User; lang: Lang }
 
-export default function EnrollButton({ theme, user }: Props) {
+const LABELS: Record<Lang, string> = {
+  en: 'Enroll as',
+  de: 'Einschreiben als',
+}
+
+export default function EnrollButton({ theme, user, lang }: Props) {
   const color = theme === 'dark' ? '#8ab4ff' : '#1a56db'
@@ -11,3 +16,3 @@
       </svg>
-      Enroll as {user.name}
+      {LABELS[lang]} {user.name}
     </button>
```

```bash
npm run build
> allcsvideos-web@0.0.0 build
> tsc -b && vite build

vite v8.3.5 building client environment for production...
transforming...
✓ 27 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.43 kB │ gzip:  0.28 kB
dist/assets/index-Cdin64Ya.css    1.61 kB │ gzip:  0.66 kB
dist/assets/index-BtFRkrW8.js   221.79 kB │ gzip: 69.39 kB

✓ built in 305ms
```

(The file hashes can differ on your machine.) The page now shows `Einschreiben als Lukas` on every button. Everything else in those six files was the road.

Prop drilling costs three things in daily work: every new shared fact edits every file on the road; the middle components must know about things they do not use; and one forgotten prop is a bug in the middle of the road.

### 5. Mistake one: a forgotten prop crashes the page

Asha forgets to hand the user down to the button in `CourseCard`:

```bash
sh ../use-version.sh bad1-missing-user
```
`CourseCard.tsx` (changes marked with + and -):
```diff
@@ -11,3 +11,3 @@
       <p>{course.teacher} · {price}</p>
-      <EnrollButton theme={theme} user={user} lang={lang} />
+      <EnrollButton theme={theme} lang={lang} />
     </article>
```

The whole page goes blank, and the browser console says `Uncaught TypeError: Cannot read properties of undefined (reading 'name')`. The `EnrollButton` asks the user for `name`, but the user never arrived. TypeScript finds it before you run the page:

```bash
npx tsc -b
src/CourseCard.tsx:6:53 - error TS6133: 'user' is declared but its value is never read.

6 export default function CourseCard({ course, theme, user, lang }: Props) {
                                                      ~~~~

src/CourseCard.tsx:12:8 - error TS2741: Property 'user' is missing in type '{ theme: Theme; lang: Lang; }' but required in type 'Props'.

12       <EnrollButton theme={theme} lang={lang} />
          ~~~~~~~~~~~~

  src/EnrollButton.tsx:3:30 - 'user' is declared here.
    3 type Props = { theme: Theme; user: User; lang: Lang }
                                   ~~~~

Found 2 errors in the same file, starting at: src/CourseCard.tsx:6
```

### 6. Mistake two: the silent bug

This time she forgets the language in `CourseCard`:

```bash
sh ../use-version.sh bad2-missing-lang
```
`CourseCard.tsx` (changes marked with + and -):
```diff
@@ -11,3 +11,3 @@
       <p>{course.teacher} · {price}</p>
-      <EnrollButton theme={theme} user={user} lang={lang} />
+      <EnrollButton theme={theme} user={user} />
     </article>
```

No crash. The button just says `Lukas`, and the console is empty: no error, no warning. The label for an undefined language is `undefined`, and React draws nothing for `undefined`. A student in Frankfurt would see a broken button. Again only the checker catches it:

```bash
npx tsc -b
src/CourseCard.tsx:6:59 - error TS6133: 'lang' is declared but its value is never read.

6 export default function CourseCard({ course, theme, user, lang }: Props) {
                                                            ~~~~

src/CourseCard.tsx:12:8 - error TS2741: Property 'lang' is missing in type '{ theme: Theme; user: User; }' but required in type 'Props'.

12       <EnrollButton theme={theme} user={user} />
          ~~~~~~~~~~~~

  src/EnrollButton.tsx:3:42 - 'lang' is declared here.
    3 type Props = { theme: Theme; user: User; lang: Lang }
                                               ~~~~

Found 2 errors in the same file, starting at: src/CourseCard.tsx:6
```

### 7. Composition: remove floors

Before any new tool, ask: does the middle really have to hold the value? Composition (module 3, lesson 5): a component can receive a finished piece of the page. In `App.tsx`, Asha builds the `Header` and the `CourseList` herself, right where the data lives, and hands them to `Page` as two props, `header` and `list`:

```bash
sh ../use-version.sh v3-composition
```

`App.tsx`:
```tsx
import { useState } from 'react'
import Page from './Page.tsx'
import Header from './Header.tsx'
import CourseList from './CourseList.tsx'
import type { Lang, Theme, User } from './types.ts'

export default function App() {
  const [theme, setTheme] = useState<Theme>('light')
  const [user] = useState<User>({ name: 'Lukas', plan: 'free' })
  const [lang] = useState<Lang>('de')

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  return (
    <div className={`app ${theme}`}>
      <Page
        header={<Header theme={theme} user={user} onToggleTheme={toggleTheme} />}
        list={<CourseList theme={theme} user={user} lang={lang} />}
      />
    </div>
  )
}
```

`Page.tsx`:
```tsx
import type { ReactNode } from 'react'
import Footer from './Footer.tsx'

type Props = { header: ReactNode; list: ReactNode }

export default function Page({ header, list }: Props) {
  return (
    <main>
      {header}
      {list}
      <Footer />
    </main>
  )
}
```

`Page` does not know about theme, user or language any more. The real change from git:

```bash
git diff --stat
 src/App.tsx  |  8 ++++----
 src/Page.tsx | 12 +++++-------
 2 files changed, 9 insertions(+), 11 deletions(-)
```

```bash
npx tsc -b
```

The page looks exactly the same, German buttons and all. One floor of the building is gone. But theme and user still go from `Header` to `Logo`, `UserMenu` and `Avatar`, and theme, user and language still go from `CourseList` to the cards and buttons. Composition removes floors where a piece is placed once, like a header. It does not help when something is needed in many places at many depths, like a theme, a language or the current user.

### 8. Is drilling bad?

No. Passing props one or two levels down is the clearest code there is: you open any file and see exactly where each value comes from. Rule of thumb:

- A value that goes one or two levels down: hand it down as props.
- A piece of the page that is placed once: composition.
- A fact that many components, at many depths, need: a better tool is coming next, context.

You have met small drilling before: in module 8, build 5, the outlet handed the list of enrolled courses down one level.

## Common mistakes

- Treating every prop chain as a problem. One or two levels is fine.
- Adding a new shared fact and forgetting one file on the road: a crash (`undefined`) or a silent bug (nothing drawn).
- Leaving props untyped. With types, `npx tsc -b` finds the forgotten prop before the page runs.
- Expecting the Footer not to re-run when its parent re-runs. React draws a component's whole subtree again.
- Reaching for context before trying composition.

## Clean up

Stop the dev server with Ctrl+C. Delete `web/node_modules` and `web/dist` if you want. The scratch git repo is not in this folder. Run `sh ../use-version.sh v2-language` so `src/` holds the finished lesson state.

## Key ideas (recap)

1. Prop drilling is passing a value through components that do not use it, only to reach one further down. It comes from lifting state up (module 4, lesson 5).
2. It costs you: every new shared fact edits every file on the road, the middle components know things they do not need, and a forgotten line gives a crash or a silent bug. Type your props.
3. One or two levels is fine. Try composition to remove floors. For a fact needed everywhere, like theme, user or language, there is a better tool: context.

Interview question (Rahul): what is prop drilling, and how do you avoid it? A good answer: it is passing props through components that do not use them, only to reach a deeper one. Avoid it with composition (pass finished elements as props or children), and for facts many components need, use context or a state library.

## Try it yourself

Add a third shared fact, the currency (rupees or euros), and show it in the price on each card. Count the files that change. Then try to remove one floor with composition. (Answer below.)

Answer: expect the same road as the language: `types.ts`, `App.tsx`, `Page.tsx`, `CourseList.tsx` and `CourseCard.tsx` all change (five files), even though only the price line in `CourseCard` uses it. With composition (`versions/v3-composition`) `Page.tsx` no longer needs the new prop.

## Next

Module 10, Lesson 2: [Context](../m10-l02-context/README.md).
