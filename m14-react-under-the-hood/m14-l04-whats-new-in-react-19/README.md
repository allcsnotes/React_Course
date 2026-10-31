# M14-L04 · What's New in React 19

> Video: Module 14, Lesson 4. Watch it first, then follow along here.

Asha is adding a waitlist box to the allcsvideos site, for a course that is coming soon. A student types an email and presses Join. Written by hand, that one text box needs four pieces of state, a submit handler with `preventDefault`, and a `try`, `catch` and `finally`: 35 lines. React 19 was built to remove exactly this kind of code. Every example here ran on React 19.3.1.

## What you'll learn

- Form actions: `<form action={fn}>`, where React calls your function with the form's `FormData` and resets the form afterwards
- `useActionState`: the result of the action plus a pending flag, with the previous state always first
- `useOptimistic`: the optimistic update from Module 11 in one hook, with no rollback code
- `use(promise)` with `Suspense`, and `use(context)` inside an `if`
- `ref` as an ordinary prop (no `forwardRef`)
- Four mistakes, with the real error for each

## Before you start

- Node 24 (`node --version`; recorded with v24.16.0).
- You know controlled forms (Module 5, lesson 4), optimistic updates (Module 11, lesson 3), promises (Module 2, lesson 5) and refs (Module 7, lesson 4).
- Docker is not used.

## Files in this folder

| File | What it is |
|---|---|
| `package.json` | Pinned: React 19.3.1, Vite 8.3.5, TypeScript 7.0.2 |
| `src/Waitlist.tsx` | The waitlist form, finished version (stage v3-optimistic) |
| `src/App.tsx`, `src/api.ts` | The page, and `getCourses` / `joinWaitlist` calls to the practice API |
| `src/main.tsx`, `src/index.css` | Entry point (Strict Mode on) and styles |
| `api/server.mjs` | Practice API on port 8144 (a local stand-in, not the production server). `GET /api/courses` takes 1200 ms, `POST /api/waitlist` takes 1500 ms, and each request prints a log line |
| `api/mode.txt` | `ok` or `fail` (every join answers 500, "The mail service is down") |
| `use.mjs` | `node use.mjs <stage>` puts `versions/common` and the stage into `src/` (the job of the video's `setver.sh`) |
| `versions/` | `v0-byhand`, `v1-action`, `v2-actionstate`, `v3-optimistic`, `v4-use`, `v5-ref`, `v5b-forwardref`, and the mistakes `m1-noprev`, `m2-keep` (the fix for a box that empties), `m3-newpromise`, `x-nostart` |

## Follow along

### 1. Install and start

```bash
npm install
node api/server.mjs
```

```text
practice API on http://localhost:8144
```

In a second terminal:

```bash
npm run dev
```

```text
  VITE v8.3.5  ready in ... ms

  ➜  Local:   http://localhost:5144/
```

Open http://localhost:5144/. Switch stage with `node use.mjs v1-action` (Vite reloads). Without an argument `use.mjs` lists the stages. Switch the server with `echo fail > api/mode.txt` (it reads the file on every request) and `echo ok > api/mode.txt`.

### 2. The by-hand form (stage v0-byhand)

```bash
node use.mjs v0-byhand
```

Four states (`email`, `pending`, `error`, `done`), `e.preventDefault()`, and `try`/`catch`/`finally` just to switch `pending` off. Type `lukas@example.com` and press Join: the button turns grey and says `Joining…`, and a second and a half later a green line says `lukas@example.com is on the list` and the box is empty.

### 3. Actions (stage v1-action)

```bash
node use.mjs v1-action
```

The `form` tag has an attribute `action`, and you give it a function. React calls it with the form's data as a browser `FormData` object. No event, no `preventDefault`, no state for every box:

```tsx
export function Waitlist() {
  const [done, setDone] = useState('')

  async function join(formData: FormData) {
    console.log(Object.fromEntries(formData))
    setDone(await joinWaitlist(String(formData.get('email'))))
  }

  return (
    <form action={join}>
      <label>Email <input name="email" /></label>
      <button>Join</button>
      {done && <p className="msg ok">{done} is on the list</p>}
    </form>
  )
}
```

Guess: type the email and press Join. What does the console print, and what is in the box when the server has answered? Real result:

```text
{email: 'lukas@example.com'}
```

and later the green line appears and the box is empty: React cleared the form after our function finished. But we still do not know when the function is running, and we cannot show what it returned.

### 4. `useActionState` (stage v2-actionstate)

It takes an action function and a starting state, and gives back an array of three: the current state, a new form action, and a pending flag.

```tsx
type State = { message: string; ok: boolean; attempts: number }

async function join(prev: State, formData: FormData): Promise<State> {
  const attempts = prev.attempts + 1
  try {
    const email = await joinWaitlist(String(formData.get('email')))
    return { message: `${email} is on the list`, ok: true, attempts }
  } catch (err) {
    return { message: (err as Error).message, ok: false, attempts }
  }
}

const [state, formAction, pending] = useActionState(join, { message: '', ok: false, attempts: 0 })
// <form action={formAction}> ... <button disabled={pending}>{pending ? 'Joining…' : 'Join'}</button>
```

The action takes two arguments: the previous state first, then the form data. Whatever it returns becomes the new state. A failure is not a crash, it is just a new state. Real run: after half a second the button is grey and says `Joining…`; after two seconds:

```text
lukas@example.com is on the list
Attempts: 1
```

and the box is empty. With `echo fail > api/mode.txt` the server answers 500 and the page shows a red `The mail service is down`, attempts 1, and the button is back to `Join` on its own. Four pieces of state and a `finally` became one hook.

### 5. `useOptimistic` (stage v3-optimistic)

In Module 11 you built an optimistic update by hand with three callbacks. `useOptimistic` takes the real value and a function saying how to add a guess, and gives back the value to show and a function to add a guess:

```tsx
const [emails, setEmails] = useState(initial)
const [shown, addShown] = useOptimistic(emails, (list, email: string) => [...list, email])

async function join(formData: FormData) {
  const email = String(formData.get('email'))
  setError('')
  addShown(email)                       // 1. the guess goes on the screen
  try {
    const saved = await joinWaitlist(email)   // 2. the real request
    startTransition(() => setEmails((list) => [...list, saved]))   // 3. save the real list
  } catch (err) {
    setError((err as Error).message)
  }
}
```

There is no rollback code. The list on screen is the real list plus a guess, and the guess lives only while the action runs. When the action ends the guess is gone: if the real list now has the email it stays, otherwise it vanishes by itself. The save sits inside `startTransition` because it comes after an `await`; without it React does not know it belongs to the action (see the mistakes).

Guess: `echo fail > api/mode.txt`, then press Join. Real result: after 0.2 s the list has three names and the new one is yellow and says `sending…`:

```text
meera@example.com
priya@example.com
lukas@example.com · sending…
```

At about 1.5 s the server says 500, the new line vanishes and a red `The mail service is down` appears. With `ok`, the yellow line turns into a normal one when the real list arrives. Use it when a failure is rare and a wrong guess is harmless for a moment (a new item, a like button). For a payment, wait for the server.

### 6. `use` (stage v4-use)

`use(promise)` reads a promise while a component draws. If the value has not arrived the component stops and waits, and the nearest `Suspense` shows its fallback (Suspense is the next lesson):

```tsx
const coursesPromise = getCourses()          // made once, outside any component

function CourseList({ promise }: Props) {
  const courses = use(promise)
  return <ul className="grid">{courses.map(c => <li key={c.slug}>...</li>)}</ul>
}

export function Courses() {
  return (
    <Suspense fallback={<p className="note">Loading courses…</p>}>
      <CourseList promise={coursesPromise} />
    </Suspense>
  )
}
```

The page opens on `Loading courses…` and after a little over a second the four cards appear. No `useState`, no `useEffect`, no loading flag. In a real app the promise comes from your router or data library (the loaders in Module 8). `use` also reads context, and can sit inside an `if`, which `useContext` cannot:

```tsx
function Price({ course }: { course: Course }) {
  if (course.price === 0) return <span>Free</span>
  const currency = use(CurrencyContext)
  return <span>{currency} {course.price}</span>
}
```

```text
React for Beginners · by Meera · Rs 499
Python from Zero    · by Meera · Free
DevOps Basics       · by Asha  · Free
SQL in Two Weeks    · by Asha  · Rs 399
```

### 7. `ref` as a prop (stages v5-ref, v5b-forwardref)

Before React 19 a component that wanted to pass a ref to its input had to be wrapped in `forwardRef`. Now it just takes `ref` in its props, like `label`:

```tsx
export function Field({ label, ref }: { label: string; ref?: React.Ref<HTMLInputElement> }) {
  return (
    <label>{label}<input ref={ref} name="email" /></label>
  )
}
```

The parent makes `useRef`, passes it down, and a button calls `emailRef.current?.focus()`. Press Focus the box: the cursor lands in the input. The old `forwardRef` version (`v5b-forwardref`) still works in React 19 with no warning, but new code does not need it.

### 8. Build

```bash
npm run build
```

```text
✓ built in 286ms
```

## Common mistakes

1. **`useActionState` with a function that takes only `formData`** (stage `m1-noprev`). The previous state always comes first. TypeScript stops you; read the error from the bottom:

   ```bash
   node use.mjs m1-noprev
   npx tsc -b
   ```

   ```text
   src/Waitlist.tsx(16,55): error TS2769: No overload matches this call.
     ...
     Argument of type '(formData: FormData) => Promise<State>' is not assignable to parameter of type '(state: {...}, payload: unknown) => ...'.
   ```

   If you ignore it, the page runs anyway and the `catch` shows `formData.get is not a function`, because the first argument was the state.
2. **The box empties after an error.** In stage `v2-actionstate` with `fail`: Lukas types an email, the server says no, the red message appears, and so does an empty box. React resets the form after every action, success or failure. The fix (stage `m2-keep`): return the email in the state and give the input `defaultValue={state.email}`. Now the email stays after an error:

   ```text
   The mail service is down        box after error: "lukas@example.com"
   ```

3. **A new promise on every draw** (stage `m3-newpromise`). `use(getCourses())` is called inside the component. Every draw makes a new promise, so the page never gets past `Loading courses…`, and the API log shows a new request again and again. Make the promise outside, and use the same one every time.
4. **Saving the real list after the `await` without `startTransition`** (stage `x-nostart`). The real list arrives but the guess is still on screen, so for a moment the same email is in the list twice. The console says:

   ```text
   Encountered two children with the same key, `lukas@example.com`. Keys should be unique so that components maintain their identity across updates...
   ```

   Keep that line inside `startTransition`.

## Clean up

Press Ctrl+C in both terminals. Make sure `api/mode.txt` says `ok` and run `node use.mjs v3-optimistic` to put the finished form back. Delete `node_modules` and `dist` if you like.

## Try it yourself

Add a second box, a name, to the waitlist form (`useActionState`, stage `v2-actionstate`). Read it with `formData.get('name')`, and keep it in the state when the server says no (like `m2-keep`).

Interview tip. "What is new in React 19 for forms?" Form actions, `useActionState` and `useOptimistic` remove most of the hand-written pending and error state. They do not replace TanStack Query for caching, or React Hook Form for big forms with many rules: those still earn their place.

## Next

[M14-L05 · Suspense and Error Boundaries](../m14-l05-suspense-and-error-boundaries/README.md)
