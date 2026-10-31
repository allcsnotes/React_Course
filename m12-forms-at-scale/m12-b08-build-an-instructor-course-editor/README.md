# M12-B08 · Build an Instructor Course Editor

> Video: Module 12, Build 8. Watch it first, then follow along here.

Meera, the instructor, edits her course "React for Beginners" on the allcsvideos site: title, summary, level, price, a thumbnail and a list of lessons she can add to, remove and reorder. A save bar tells the truth: nothing to save, Unsaved changes, Saving, or Saved. Everything runs against the practice API on your laptop.

This build puts lessons 1, 2 and 3 of Module 12 to work: React Hook Form, Zod, `useFieldArray`, a file upload with progress, and a mutation from Module 11.

## What you'll learn

- Where each piece of state lives: form values and errors in React Hook Form, the saved course in the TanStack Query cache, the upload percent in a small `useState`
- One Zod schema that grows by one line at every step
- Creating the form only after the data has arrived (`defaultValues` are read once)
- Lessons as a field array with `move`, `remove` and `append`
- A thumbnail component joined to the form with `Controller`, checked before it leaves the computer, with a progress bar
- Saving with `useMutation`: `setQueryData` and `reset` on success, `setError` for the server's messages, one calm sentence on failure
- A real browser test of 15 claims, and four things that break in production

## Before you start

- Node 24 (`node --version`; recorded with v24.16.0).
- You did [M12-L01](../m12-l01-react-hook-form/README.md), [M12-L02](../m12-l02-validation-with-zod/README.md) and [M12-L03](../m12-l03-dynamic-fields-wizards-and-file-upload/README.md), and Module 11 (TanStack Query, mutations).
- Google Chrome is only needed for the optional browser test in step 7. Docker is not used.

## Files in this folder

| File | What it is |
|---|---|
| `package.json` | Pinned: react-hook-form 7.91.0, @hookform/resolvers 6.0.2, zod 4.6.7, @tanstack/react-query 5.105.0, React 19.3.1, Vite 8.3.5, TypeScript 7.0.2 |
| `src/main.tsx` | Query client (`staleTime` 30 seconds, `retry` 1) and the provider |
| `src/App.tsx` | Loads the course with `useQuery`, then draws the form |
| `src/schema.ts` | The one schema: `CourseSchema`, `LoadedSchema`, the `Course` type |
| `src/api.ts` | `getCourse`, `uploadThumbnail` (XHR with progress), `ApiError`, `saveCourse` |
| `src/CourseForm.tsx` | The editor form |
| `src/Field.tsx` | Label, box and error message in one small component |
| `src/Thumbnail.tsx` | The picture box with the progress bar |
| `src/index.css` | Styles |
| `api/server.mjs` | Practice API on port 8128. A local stand-in, not the real server. No login yet (Module 13) |
| `api/mode.txt` | `ok`, `fail` (saving answers 500) or `upfail` (the upload answers 500) |
| `assets/make-test-files.mjs` | Makes `course-thumb.png` (1.5 MB), `huge-thumb.png` (3.4 MB) and `notes.txt` |
| `e2e/check.mjs` | The 15-claim browser test (optional) |
| `versions/` | The project at the end of each step: `s1` to `s5`, and the mistakes `s5m1`, `s5m2` |

The practice API:

| Request | What it does |
|---|---|
| `GET /api/instructor/course` | The course Meera edits (takes 400 ms) |
| `PUT /api/instructor/course` | Saves it (takes 1000 ms, slow on purpose). 422 for bad data, 409 for a taken title |
| `POST /api/instructor/thumbnail` | Receives the picture (multipart, field `thumbnail`), answers with its address |
| `GET /api/stats`, `POST /api/reset` | Saves and pictures counted; back to the starting data (for tests) |

## Run it

```bash
npm install
node assets/make-test-files.mjs
node api/server.mjs
```

```text
course-thumb.png 1501495 bytes
huge-thumb.png 3401495 bytes
Practice API on http://localhost:8128
```

In a second terminal:

```bash
npm run dev
```

```text
  VITE v8.3.5  ready in ... ms

  ➜  Local:   http://localhost:5728/
```

Open http://localhost:5728/. This is the finished editor.

## Build it step by step

To see any step run, replace `src/` with that step (keep `index.css`), and Vite reloads:

```bash
find src -type f ! -name index.css -delete && cp versions/s1/* src/
```

Put `versions/s5` back at the end.

| Step | Folder | What it adds |
|---|---|---|
| 1 | `versions/s1` | Setup, the details schema, `getCourse`, show the title |
| 2 | `versions/s2` | `Field`, the details form, `isDirty` |
| 3 | `versions/s3` | The lessons: `useFieldArray` with `move` |
| 4 | `versions/s4` | The thumbnail with its progress bar |
| 5 | `versions/s5` | Saving with a mutation, the server's messages |

### Step 1. Setup, schema and loading the course

Four packages next to a fresh Vite React TypeScript project (the folder already has them; the template's output changes over time, so use these files rather than creating a new one):

```bash
npm install react-hook-form@7.91.0 @hookform/resolvers@6.0.2 zod@4.6.7 @tanstack/react-query@5.105.0
```

The dev server runs on port 5728 and proxies `/api` to the practice API on 8128 (`vite.config.ts`). `main.tsx` is as in Module 11: one query client and a provider.

The schema lives in its own file. At this step only the details:

```ts
export const CourseSchema = z.object({
  title: z.string().trim().min(5, 'Title needs at least 5 letters'),
  summary: z.string().trim().min(20, 'Summary needs at least 20 letters'),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  price: z.number({ error: 'Enter a price' }).min(0, 'No negative prices'),
})
export type Course = z.infer<typeof CourseSchema>
```

`getCourse` calls `fetch`, throws when the answer is an error, and checks the answer with the schema (`parse`), so a surprise from the server fails here with a clear error, not three screens later. `App.tsx` uses `useQuery` with the key `['course']`. Use `versions/s1` and open the page:

```text
Loading the course...
React for Beginners
```

One request went to the server (`GET /api/instructor/course`). The type checker prints nothing:

```bash
npx tsc -b
```

### Step 2. The details form

First `Field`: a label, the box that comes inside as `children`, and the error under it. Then `CourseForm` gets the course as a prop called `initial`:

```tsx
const { register, handleSubmit, formState: { errors, isDirty } } = useForm<Course>({
  resolver: zodResolver(CourseSchema),
  defaultValues: initial,
})
```

Why a prop and not loading inside the form? `defaultValues` are used only once, when the form is created, so the form must be created after the data has arrived. The app waits, and only then draws the form.

Four boxes: title (`register('title')`), summary (textarea), level (select), and price with `valueAsNumber` so the form holds a number. The save bar shows `Unsaved changes` only when `isDirty` is true, and the button is disabled when it is false. For now `onSubmit` just logs the values.

Use `versions/s2`. Guess first: clear the title, cut the summary to two words, empty the price, press Save. Real result: three messages, each under its own box, nothing sent, and the label says `Unsaved changes`:

```text
Title needs at least 5 letters
Summary needs at least 20 letters
Enter a price
```

Now type good values and press Save. The console shows the price as the number `599`, not text, and no thumbnail or lessons yet:

```text
{title: 'React for Beginners', summary: 'Learn React from zero with small projects.', level: 'beginner', price: 599}
```

### Step 3. The lessons

The schema grows by two pieces: a lesson is a title of at least 3 letters and whole minutes of at least 1, and the course gets `lessons: z.array(LessonSchema).min(1, 'Add at least one lesson')`.

In the form, `useFieldArray({ control, name: 'lessons' })` returns `fields`, `append`, `remove` and `move`. One list item per field, `key={f.id}`: the row number, the title input registered as `lessons.${i}.title`, the minutes input with `valueAsNumber`, and three buttons: up (disabled on the first row), down (disabled on the last) and remove. Row errors come from `errors.lessons?.[i]`, the message about the whole list from `errors.lessons.root`. The Add lesson button appends `{ title: '', minutes: 5 }`.

Use `versions/s3`. Press the down arrow on lesson 1, press Add lesson, press Save. Real result: `Give the lesson a title`, right under the new row only. Type `Effects` and save: the console shows the lessons in the new order, with Effects at the end. Remove every lesson and save: `Add at least one lesson` (the message of the whole list).

### Step 4. The thumbnail

The schema gets `thumbnail: z.string().min(1, 'Add a thumbnail')`. The value is the address of the picture once uploaded, not the file. A brand-new course may have no picture yet, so for reading from the server a copy of the schema drops that rule:

```ts
export const LoadedSchema = CourseSchema.extend({ thumbnail: z.string() })
```

`uploadThumbnail(file, onProgress)` in `api.ts` is the XHR upload from lesson 3: `FormData`, the upload `progress` event, and no `Content-Type` (the browser writes it). The `Thumbnail` component keeps two small pieces of `useState`, the percent and a problem text. Nobody else needs the percent and it changes many times a second. Its `pick` function checks the file before anything leaves the computer:

```tsx
if (!file.type.startsWith('image/')) return setProblem('Pick a picture file')
if (file.size > 2 * 1024 * 1024) return setProblem('Pick a picture under 2 MB')
setProblem('')
setPct(0)
try { onChange(await uploadThumbnail(file, setPct)) }
catch { setProblem('The upload failed. Please try again.') }
finally { setPct(null) }
```

It joins the form with `Controller`, because it is our own component, not a plain box.

Use `versions/s4`. Guess: Save with no picture, then pick `assets/huge-thumb.png`, then `assets/notes.txt`. How many requests leave the browser? Real result: zero.

```text
Add a thumbnail
Pick a picture under 2 MB
Pick a picture file
```

Now pick `assets/course-thumb.png`. The bar fills (your numbers will differ), then the picture shows in its box and the message is gone. The server holds exactly one picture:

```bash
curl http://localhost:8128/api/stats
```

```text
{"saves":0,"pictures":1}
```

To watch the bar slowly, open Chrome DevTools, Network tab, and choose a slow preset, or use the throttling in `e2e/check.mjs` (500 KB per second).

### Step 5. Saving

The server can answer three ways: fine, 409 (a conflict, with a message for one field, like in lesson 2), or a failure (500). In `api.ts`, `saveCourse` sends a `PUT` with the course as JSON. For a 409 it throws our own `ApiError`, which carries the name of the field; for any other bad answer it throws a plain error; when all is fine it reads the saved course back.

The mutation, from Module 11, lesson 3:

```tsx
const save = useMutation({
  mutationFn: saveCourse,
  onSuccess: (saved) => {
    queryClient.setQueryData(['course'], saved)
    reset(saved)
  },
  onError: (err) => {
    if (err instanceof ApiError && err.field)
      setError(err.field, { type: 'server', message: err.message })
  },
})
```

`setQueryData` makes the cache hold the truth. `reset(saved)` tells the form that these values are the new start, so `isDirty` is false again. `onSubmit` is now `handleSubmit((v) => save.mutate(v))`, and the button is `disabled={!isDirty || save.isPending}`, saying `Saving...` while it runs. Any error that is not an `ApiError` shows one calm sentence at the bottom.

Use `versions/s5` (this is `src/`). Guess: change the title and press Save twice, quickly. Real result: the button says `Saving...` and is disabled, a second later `Saved`, and the server counted one save. After a reload the new title and picture are there.

- A taken name: set the title to `Python from Zero`, Save. The server says 409 and under the title appears `You already have a course called Python from Zero`. The other edits stay, and the label still says `Unsaved changes`. Change the title and the message goes away at once.
- A bad day: put `fail` in `api/mode.txt` (the server reads it on every request), then Save. After a second a red box shows `We could not save your course. Please try again.` Nothing Meera typed is lost. Put `ok` back.

Test the server directly, because the form's checks are a help, not a wall:

```bash
curl -i -X PUT http://localhost:8128/api/instructor/course -H 'content-type: application/json' \
  -d '{"title":"Hi","summary":"short","level":"beginner","price":1,"thumbnail":"","lessons":[{"title":"x","minutes":1}]}'
```

```text
HTTP/1.1 422 Unprocessable Entity
...
{"errors":{"title":"Title needs at least 5 letters","summary":"Summary needs at least 20 letters"}}
```

### Step 6. Build

```bash
npm run build
```

```text
✓ 164 modules transformed.
dist/index.html                   0.43 kB │ gzip:   0.28 kB
dist/assets/index-ClFhrYWv.css    3.05 kB │ gzip:   1.10 kB
dist/assets/index-D7k6AnF4.js   391.53 kB │ gzip: 119.69 kB
✓ built in 279ms
```

`tsc -b` runs first, then `vite build`. The file hash in the name may differ on your machine.

### Step 7. A real browser test (optional)

A Playwright script drives the page the way Meera does and prints one line per claim. It needs Google Chrome installed, the dev server and the API running, and one package that is not saved in `package.json`:

```bash
npm install --no-save playwright-core@1.63.0
node e2e/check.mjs
```

```text
PASS  the form loads the saved course  (4 lessons)
PASS  Save is disabled until something changes
PASS  an empty title is stopped before the server  (no request sent)
PASS  typing a good title clears its own message  (the others stay)
PASS  the down arrow moves lesson 1 to place 2
PASS  the cross removes a lesson  (3 left)
PASS  a new empty lesson and no thumbnail: both messages at once  (Add a thumbnail / Give the lesson a title)
PASS  a 3.4 MB picture is refused on the page  (no upload request)
PASS  the progress bar moves in many steps up to 100%  (30 steps)
PASS  the server received exactly 1 picture
PASS  all messages are gone once everything is valid
PASS  a double click sends exactly 1 save  (Save is disabled while saving)
PASS  after a reload the saved order and title are there
PASS  the server says the title is taken: message under Title, edits kept
PASS  the server fails: a friendly message, edits kept
15 of 15 checks passed
```

(The video's picture was 3.2 MB; the one made by `make-test-files.mjs` is 3.4 MB.) The script resets the API and uses `api/mode.txt`, and leaves it at `ok`.

## Common mistakes

1. **Default values are read once.** Use `versions/s5m1`: `App.tsx` draws the form before the course has arrived, with an empty course as the start. The course arrives (one request) but every box stays empty, because the form was created with empty defaults and does not look again. The fix is what we did: draw the form after the data.
2. **Forgetting `reset`.** Use `versions/s5m2`, which has no `reset(saved)` in `onSuccess`. Meera saves, the server has everything, and the label still says `Unsaved changes` with the Save button awake. One missing line, and a lie on the screen.
3. **The picture is stored before the course is.** Pick a picture and close the tab: the server holds a picture that no course uses (`{"saves":0,"pictures":1}` from `/api/stats`). A real server throws away unused uploads after a day. The page cannot fix this.
4. **The server is the proof.** Anyone can send a `PUT` by hand. The server checks every rule again, as the `curl` in step 5 shows. This practice API has no login: a real sign-in comes in Module 13.

## Clean up

Press Ctrl+C in both terminals. Make sure `api/mode.txt` says `ok` and `src/` is `versions/s5` again. Delete `assets/*.png`, `node_modules` and `dist` if you like.

## Try it yourself

1. **A warning before leaving.** When the form is dirty and Meera closes the tab, the browser should ask "Leave this page?". Use the `beforeunload` event in an effect (Module 7), with a cleanup that removes the listener.
2. **A Duplicate button on every lesson.** It puts a copy of the row right below it. Look up `insert` in the `useFieldArray` documentation.

Hint for 1: `useEffect(() => { if (!isDirty) return; const h = (e: BeforeUnloadEvent) => e.preventDefault(); window.addEventListener('beforeunload', h); return () => window.removeEventListener('beforeunload', h) }, [isDirty])`. Hint for 2: remember from lesson 3 that `fields` can be stale, so read the live row with `getValues` before you `insert` it.

Interview tip. "How does a form know it has unsaved changes?" React Hook Form tracks `isDirty` by comparing the values with the default values, and `reset` sets the new starting point after a save.

## Next

[M13-L01 · Login Flows: Sessions vs JWT](../../m13-authentication-and-security/m13-l01-login-flows-sessions-vs-jwt/README.md)
