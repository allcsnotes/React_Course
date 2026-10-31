# M12-L01 · React Hook Form

> Video: Module 12, Lesson 1. Watch it first, then follow along here.

Meera, the instructor, uses a new course form on allcsvideos.com. Asha built it with controlled inputs and it is drawn again on every key. In this lesson you replace that with React Hook Form and watch a render counter drop from 13 to 2.

## What you'll learn

- Why a controlled form is drawn again on every key, and how an uncontrolled form avoids it
- `useForm`, `register`, and `handleSubmit`: the three tools for a basic form
- Rules inside `register` (`required`, `valueAsNumber`) and `formState.errors`
- `watch` versus `useWatch`: show a live value without redrawing the whole form
- `Controller` for components that are not real boxes (a custom level picker)
- `defaultValues`, `isSubmitting` and `reset` to finish the form, and three common mistakes

## Before you start

- Node 24: run `node --version` (this lesson was recorded with v24.16.0).
- You know controlled inputs from Module 5 (lessons 3 and 4), and refs from Module 7, lesson 4.
- No other lesson folder is needed. Docker is not used.

## Files in this folder

| File | What it is |
|---|---|
| `package.json` | Pinned versions: React 19.3.1, React Hook Form 7.91.0, Vite 8.3.5, TypeScript 7.0.2 |
| `src/CourseForm.tsx` | The finished form (the version at the end of the video) |
| `src/LevelPicker.tsx` | The custom three-button level picker |
| `src/main.tsx`, `src/index.css` | Entry point and styles |
| `api/server.mjs` | The practice API on port 8121, with a request log. A local stand-in, not the real allcsvideos server |
| `versions/` | One folder per stage of the video. Copy a stage into `src/` to see that stage run |
| `vite.config.ts` | Dev server on port 5221, and a proxy from `/api` to the practice API |

The stages in `versions/`:

| Folder | Stage in the video |
|---|---|
| `v1` | The by-hand controlled form (render counter reaches 13) |
| `reg` | Prints what `register('title')` returns |
| `v2` | React Hook Form with `register` and `handleSubmit` |
| `v2b` | Adds `valueAsNumber` to the price |
| `v3` | Adds `required` and `errors` |
| `v4` | `watch('title')` for a live preview (redraws on every key) |
| `v4b` | `useWatch` inside a small `Preview` component |
| `v5` | `Controller` with the `LevelPicker` |
| `v6` | Finished: default values, `isSubmitting`, `reset` and a real `fetch` (same as `src/`) |
| `m1`, `m2`, `m3`, `m4` | The three mistakes at the end (`m1` is the picker with `register`) |

## Follow along

Open two terminals in this folder.

### 1. Install and start

```bash
npm install
node api/server.mjs
```

```text
API on http://localhost:8121
```

In the second terminal:

```bash
npm run dev
```

```text
  VITE v8.3.5  ready in 172 ms

  ➜  Local:   http://localhost:5221/
```

Open http://localhost:5221/. The finished form shows (a `/favicon.svg` 404 in the dev server log is harmless). To follow the video from the start, copy a stage into `src/`, for example:

```bash
cp versions/v1/CourseForm.tsx src/CourseForm.tsx
```

Some stages also have a second file (`LevelPicker.tsx`, `Preview.tsx`). Copy every file in the stage folder. The `LevelPicker.tsx` that stays in `src/` is simply unused in the early stages.

### 2. The by-hand form (stage v1)

One state object, one `handleChange`, and `value` plus `onChange` on every box:

```tsx
const [form, setForm] = useState({ title: '', price: '', level: 'beginner', description: '' })

function handleChange(e: ChangeEvent<Box>) {
  setForm({ ...form, [e.target.name]: e.target.value })
}

<input name="title" value={form.title} onChange={handleChange} />
```

The black badge is a ref that adds one each time the component function runs. A ref can change without causing a draw, so it does not disturb what it counts. When the page opens it says `renders: 1`. Type `React Basics` (12 letters) into the title:

```text
renders: 13
```

Thirteen draws for twelve letters. Nothing is broken, but a real course form has twenty boxes.

### 3. Install the library and use `register` (stage v2)

The library is already in `package.json`. To add it to your own project:

```bash
npm install react-hook-form@7.91.0
npm ls react-hook-form
```

```text
allcsvideos-web@0.0.0
└── react-hook-form@7.91.0
```

The form with the library has no state, no `handleChange`, no `value` and no `onChange`:

```tsx
const { register, handleSubmit } = useForm<FormValues>()

function onSubmit(data: FormValues) {
  console.log(data)
}

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('title')} />
```

`handleSubmit` stops the page reload for you, reads the boxes, and calls your function with one object called `data`.

Stage `reg` prints what `register` gives back, with `console.log(Object.keys(register('title')))`:

```text
['name', 'onChange', 'onBlur', 'ref']
```

A name, plus three things: `onChange`, `onBlur` and `ref`. The `ref` hands the real box to the library, so the text does not have to live in React state.

Now type `React Basics` again. The badge starts at `renders: 2` (the library sets itself up with one extra draw right after the page opens) and stays at 2 for all twelve letters:

```text
renders: 2
```

By hand: 13. With the library: 2.

### 4. Numbers are text (stage v2b)

Fill the form (title `React Basics`, price `499`) and press Create course. The console prints:

```text
{title: 'React Basics', price: '499', level: 'beginner', description: ''}
```

The price is in quotes: whatever a box gives you is text, even a number box. The fix is a second argument to `register`:

```tsx
<input type="number" {...register('price', { valueAsNumber: true })} />
```

```text
{title: 'React Basics', price: 499, level: 'beginner', description: ''}
```

A real number, ready for the API.

### 5. Required and errors (stage v3)

A rule goes into `register` as an option. The message comes from `formState.errors`:

```tsx
const { register, handleSubmit, formState: { errors } } = useForm<FormValues>()

<input {...register('title', { required: 'The title is required' })} />
{errors.title && <p className="err">{errors.title.message}</p>}
```

Press Create course with an empty title. The message shows and nothing is sent. The badge goes to 3 because something new is on the screen. Type one letter and it goes to 4 (the message left). Type the rest and the badge stays at 4:

```text
The title is required
renders: 3  ->  renders: 4  ->  renders: 4
```

`formState` draws the component only when a part you read has changed. We read `errors`, so only an error appearing or disappearing causes a draw. Typing changes nothing we read.

Other rules exist (minimum length, pattern). In lesson 2 one Zod schema will replace them. Today `required` is enough.

### 6. A live preview: `watch`, then `useWatch` (stages v4 and v4b)

`watch('title')` returns the text in the box right now:

```tsx
const title = watch('title')
<p className="prev wide">Preview: {title}</p>
```

The preview follows every key, but the badge counts again, one draw for every letter:

```text
Preview: React Basics     renders: 14
```

`watch` tells the form to draw the whole component whenever the title changes. Stage `v4b` moves it into a small component of its own with `useWatch`:

```tsx
// src/Preview.tsx (stage v4b)
const title = useWatch({ control, name: 'title' })
```

```text
Preview: React Basics   form renders: 2   preview renders: 14
```

Now only the preview is drawn on every key. Rule of thumb: ask only for what you must show, and ask as low in the tree as you can.

### 7. A component that is not a box: `Controller` (stage v5)

`register` needs a real box to attach its `ref` to. `LevelPicker` is three buttons. Stage `m1` spreads `register` on the picker. Click `advanced`:

```text
Uncaught TypeError: Cannot read properties of undefined (reading 'name')
```

The editor also warned that the type of `onChange` does not fit: `register` expects an event, and the picker sends the plain word `advanced`. The tool for this is `Controller`:

```tsx
<Controller
  name="level"
  control={control}
  render={({ field }) => (
    <LevelPicker value={field.value} onChange={field.onChange} />
  )}
/>
```

Click `advanced`: it lights up. The form badge still says `form renders: 2` and the picker counts its own (`picker renders: 3`). Plain boxes use `register`, controlled components (a custom select, a date picker, a star rating) use `Controller`. One form can mix both.

### 8. Finish the form (stage v6)

Three more tools: `defaultValues`, `isSubmitting` and `reset`. The submit function is now `async` and sends the object to the practice API:

```tsx
async function onSubmit(data: FormValues) {
  const res = await fetch('/api/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const saved = await res.json()
  setMessage('Saved: ' + saved.title)
  reset()
}
```

Press Create course with an empty title: the message shows. Then fill everything in and press the button. The button says `Saving...` for 400 milliseconds, then:

```text
Saved: React Basics
```

The form is empty again and the level is back to `beginner`. The API log has exactly one request:

```bash
curl http://localhost:8121/log
```

```text
POST /api/courses
```

(In the Module 12 build this fetch becomes a mutation from Module 11, lesson 3.)

### 9. Run the build

```bash
npm run build
```

```text
vite v8.3.5 building client environment for production...
✓ 18 modules transformed.
✓ built in 259ms
```

## Common mistakes

1. **Forgetting the spread.** `<input name="title" />` has no `register`. There is no error anywhere, but the submitted object has no `title` at all. Stage `m2` prints `{price: 499, level: 'beginner', description: ''}`. A box the library has not met does not exist for it.
2. **A button without a type.** Inside a form, a button is a submit button unless you say `type="button"`. If you remove it from the picker (stage `m3`), clicking `advanced` submits the form and prints the data object.
3. **A typo in a field name.** `register('titel')` still runs, but the field has the wrong name. Because we wrote `useForm<FormValues>`, the type checker catches it before the page opens (stage `m4`):

   ```bash
   cp versions/m4/CourseForm.tsx src/CourseForm.tsx
   npx tsc -b
   ```

   ```text
   src/CourseForm.tsx(21,31): error TS2345: Argument of type '"titel"' is not assignable to parameter of type '"description" | "level" | "price" | "title"'.
   ```

## Clean up

Press Ctrl+C in both terminals. Remove `node_modules` and `dist` if you like. Nothing else was created.

## Try it yourself

Add a fifth box, a duration in hours, with `register('duration', { valueAsNumber: true })`. Before you run it, predict what the badge says after you type in it. (Answer: it stays the same. Typing in a registered box draws nothing.)

## Next

[M12-L02 · Validation with Zod](../m12-l02-validation-with-zod/README.md)
