# M12-L03 · Dynamic Fields, Wizards and File Upload

> Video: Module 12, Lesson 3. Watch it first, then follow along here.

Asha is building the instructor's course editor. The form now gets harder in three ways: a list that grows, a form split into steps, and a picture with a progress bar. Everything runs against the practice API on your laptop.

## What you'll learn

- `useFieldArray`: a list of rows in a form (`fields`, `append`, `remove`, and `field.id` as the key)
- A wizard: one `useForm` in the parent, steps as views, `trigger` to check only this step's fields
- Why going Back does not lose anything (the values live in the form, not in the boxes)
- A file input checked by the schema, sent as `FormData`, with upload progress from `XMLHttpRequest`
- Four real mistakes: stale `fields`, a `Next` button without a type, setting `Content-Type` yourself, and putting a file into JSON

## Before you start

- Node 24 (`node --version`; recorded with v24.16.0).
- You did [M12-L01](../m12-l01-react-hook-form/README.md) and [M12-L02](../m12-l02-validation-with-zod/README.md) (React Hook Form and Zod).
- Docker is not used.

## Files in this folder

| File | What it is |
|---|---|
| `package.json` | Pinned: React 19.3.1, react-hook-form 7.91.0, zod 4.6.7, @hookform/resolvers 6.0.2, Vite 8.3.5, TypeScript 7.0.2 |
| `src/CourseWizard.tsx` | The three-step wizard (finished version) |
| `src/schema.ts` | The Zod schema, including the thumbnail file rules |
| `src/upload.ts` | `upload(file, onProgress)` using `XMLHttpRequest` |
| `src/App.tsx`, `src/main.tsx`, `src/index.css` | Page shell and styles |
| `api/server.mjs` | Practice API on port 8123: `POST /api/courses`, `POST /api/upload`, `GET /log`. A local stand-in, not the real server |
| `assets/make-test-files.mjs` | Makes `react-thumbnail.png` (about 6.2 MB) and `notes.txt` for the upload test |
| `versions/` | One folder per stage of the video (a complete `src/` each) |

| Stage folder | What it shows |
|---|---|
| `v1` | `useFieldArray`: the lessons list |
| `m1` | Mistake 1: the outline built from `fields` (goes stale) |
| `v1b` | The fix: the outline built from `watch` |
| `v2` | The wizard with `trigger` and `mode: 'onTouched'` |
| `m2` | Mistake 2: the Next button without `type="button"` |
| `v3` | The finished wizard with the thumbnail upload (same as `src/`) |
| `v3b` | Mistake 3: `Content-Type` set by hand |

To try a stage, replace `src/` with it (Vite reloads on its own):

```bash
find src -type f -delete && cp versions/v1/* src/
```

Put the finished version back at the end with `versions/v3`.

## Follow along

### 1. Install, make the test files, start both servers

```bash
npm install
node assets/make-test-files.mjs
node api/server.mjs
```

```text
react-thumbnail.png 6501495 bytes
API on http://localhost:8123
```

In a second terminal:

```bash
npm run dev
```

```text
  VITE v8.3.5  ready in ... ms
  ➜  Local:   http://localhost:5123/
```

### 2. A list that grows: `useFieldArray` (stage v1)

```bash
find src -type f -delete && cp versions/v1/* src/
```

`useForm` has default values: a title and three lessons. `useFieldArray` gets the form's `control` and the name of the list, and gives back `fields` (the rows), `append` (add a row at the end) and `remove` (take a row away by its number):

```tsx
const { fields, append, remove } = useFieldArray({ control, name: 'lessons' })

{fields.map((field, i) => (
  <div className="row" key={field.id}>
    <input {...register(`lessons.${i}.title`)} />
    <input type="number" {...register(`lessons.${i}.minutes`, { valueAsNumber: true })} />
    <button type="button" className="rm" onClick={() => remove(i)}>Remove</button>
  </div>
))}
<button type="button" onClick={() => append({ title: '', minutes: 10 })}>Add lesson</button>
```

- `field.id` is a ticket number React Hook Form gives each row, and keeps while the row lives. It is the key.
- Each box registers a name with the row's number inside: `lessons.0.title`, `lessons.0.minutes`, and so on.
- `valueAsNumber` is needed again, because a number box hands back text.

In the browser: three lessons from the default values. Press Add lesson, type `State` in the new row, remove the second lesson, press Save. The console shows exactly the rows on screen, in order:

```text
{title: 'React for Beginners', lessons: [{title: 'What React is', minutes: 12}, {title: 'Props', minutes: 15}, {title: 'State', minutes: 10}]}
```

No extra state and no bookkeeping.

### 3. The wizard (stage v2)

```bash
find src -type f -delete && cp versions/v2/* src/
```

One form, one `useForm` in the parent. The steps are views of the same form. A number in state says which view to show:

```tsx
const steps = ['Details', 'Lessons', 'Review']
const fieldsOf: (keyof CourseValues)[][] = [['title', 'price'], ['lessons'], []]

const form = useForm<CourseValues>({
  resolver: zodResolver(courseSchema),
  mode: 'onTouched',
  defaultValues: { title: '', price: 0, lessons: [{ title: '', minutes: 10 }] },
})

async function next() {
  const ok = await trigger(fieldsOf[step])
  if (ok) setStep(step + 1)
}
```

- The schema (`src/schema.ts`) has the messages written for people: `Give the course a title of 3 letters or more`, `A price cannot be below 0`, `Name this lesson`, `Add at least one lesson`.
- `mode: 'onTouched'` checks a box when the user leaves it, then on every key, so a message goes away as soon as it is fixed. (In lesson 2, checking began at the first press of the button. A wizard has no such press until the last step.)
- `trigger(fieldsOf[step])` checks only this step's fields and answers `true` or `false`. True: go on. False: the red messages show and you stay.

Run it:

1. On step 1 press Next with everything empty: `Give the course a title of 3 letters or more`.
2. Type a title and a price, press Next. Step 2 opens. Press Next with the lesson empty: `Name this lesson`.
3. Type a name, press Add lesson, name the second one `Props`.
4. Press Back. Guess what the title and price boxes show. Real result: `React for Beginners` and `499`. The boxes left the screen, but the values never lived in the boxes. They live in the form.
5. Press Next, Next. The review shows the title, the price and both lessons. Press Publish.

```text
React for Beginners · Rs 499
1. What React is (10 min)
2. Props (10 min)
Saved: course 1, 2 lessons
```

Check the API log:

```bash
curl http://localhost:8123/log
```

```text
POST /api/courses
```

### 4. The picture and the progress bar (stage v3)

```bash
find src -type f -delete && cp versions/v3/* src/
```

A file input gives a `FileList`. `register('thumbnail')` hands it to the form and the schema checks it:

```ts
thumbnail: z
  .instanceof(FileList, { error: 'Pick a picture' })
  .refine(list => list.length === 1, 'Pick a picture')
  .refine(list => !list[0] || TYPES.includes(list[0].type), 'Pick a PNG or a JPEG')
  .refine(list => !list[0] || list[0].size <= 10 * MB, 'That picture is over 10 megabytes'),
```

Walk to the last step and try:

- Publish with nothing picked: `Pick a picture`.
- Pick `assets/notes.txt`, press Publish: `Pick a PNG or a JPEG`.
- Pick `assets/react-thumbnail.png`: `react-thumbnail.png · 6.2 MB`, and the form is happy.

Sending it. A file travels in a multipart form: one parcel with labelled parts. In the browser, `FormData` builds that parcel. `fetch` cannot tell you how much of an upload was sent. The older `XMLHttpRequest` can, through its `upload` object (`src/upload.ts`):

```ts
xhr.open('POST', '/api/upload')
xhr.upload.onprogress = e => {
  if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
}
xhr.onload = () => {
  const data = JSON.parse(xhr.responseText)
  if (xhr.status === 200) resolve(data)
  else reject(new Error(data.error))
}
const body = new FormData()
body.append('thumbnail', file)
xhr.send(body)
```

In the component, `setPercent` is that function. Each progress event changes a number in state, and the bar is a box whose width is that number. Press Publish with the picture picked. The API reads the body slowly so you can watch. The bar steps through (your numbers will differ):

```text
38%  60%  87%  100%
Published: course 1, 1 lesson
```

The second request saves the course. The API log shows two requests, in order:

```bash
curl http://localhost:8123/log
```

```text
POST /api/upload
POST /api/courses
```

### 5. Build

```bash
npm run build
```

```text
vite v8.3.5 building client environment for production...
✓ built in 430ms
```

## Common mistakes

1. **Showing live values from `fields`.** Stage `m1` adds `Outline: {fields.map(f => f.title).join(', ')}`. Type `Why React` in the first lesson and the outline still says `What React is`: `fields` is the list as it was when the rows were made, not what the user is typing. The fix (stage `v1b`) is `watch`:

   ```tsx
   const lessons = watch('lessons')
   // Outline: {lessons.map(l => l.title).join(', ')}
   ```

   ```text
   Outline: Why React, Your first component, Props
   ```

2. **A Next button without `type="button"`.** Inside a form a button submits by default. In stage `m2`, Next also submits, which checks every step at once, and step 2 opens already full of red errors before you typed a word (`Name this lesson`). Fix: `type="button"`.
3. **Setting the content type yourself.** In stage `v3b`, `upload.ts` has one extra line:

   ```ts
   xhr.setRequestHeader('Content-Type', 'multipart/form-data')
   ```

   The real header also carries a random boundary word that the browser writes. Set it by hand and the boundary is gone. The practice API answers `The upload has no boundary. Do not set Content-Type yourself.` and the log shows only `POST /api/upload`. Delete the line and the browser does it right.
4. **Putting a file into JSON.** A file has no readable fields:

   ```bash
   node -e "console.log(JSON.stringify({ title: 'React for Beginners', thumbnail: new File(['x'], 'a.png') }))"
   ```

   ```text
   {"title":"React for Beginners","thumbnail":{}}
   ```

   Send files with `FormData` and everything else as JSON.

## Clean up

Press Ctrl+C in both terminals. Put `versions/v3` back into `src/` if you tried other stages. Delete `assets/react-thumbnail.png`, `node_modules` and `dist` if you like.

## Try it yourself

Add a Cancel button next to the bar. Keep the request in a ref (Module 7, lesson 4) and call `abort()` on it. Hint: store `xhr` in a `useRef` when you open the request, and call `ref.current?.abort()` from the button. In the interview: "How do you show upload progress in the browser?" A good answer: `fetch` has no upload progress event, so use `XMLHttpRequest`, read `loaded` and `total` from its `upload.onprogress`, and keep the percent in state.

## Next

[M12-B08 · Build an Instructor Course Editor](../m12-b08-build-an-instructor-course-editor/README.md)
