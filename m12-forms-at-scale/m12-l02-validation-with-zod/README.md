# M12-L02 · Validation with Zod

> Video: Module 12, Lesson 2. Watch it first, then follow along here.

Meera adds a course called "Go" for 499 rupees. The form says yes, the API says no, and the reply is one blob of text. The rules were written twice. In this lesson you write them once, in a Zod schema, and let both the form and the practice API read the same file.

## What you'll learn

- Why two hand-written copies of the rules drift apart
- How to write a Zod schema with the friendly message beside each rule
- A rule about two boxes with `.refine`, and why it needs a `path`
- How to connect the schema to React Hook Form with `zodResolver`, and get the form type from `z.infer`
- How the API imports the very same schema file, and how `setError` shows server-only messages (a taken title)
- How to check that the versions of `zod` and `@hookform/resolvers` fit together

## Before you start

- Node 24 (`node --version`; recorded with v24.16.0). Node 24 runs `.ts` files directly, which the probe scripts use.
- You did [M12-L01](../m12-l01-react-hook-form/README.md) (React Hook Form) and Module 9, lesson 4 (Zod basics).
- Docker is not used.

## Files in this folder

| File | What it is |
|---|---|
| `package.json` | Pinned: zod 4.6.7, react-hook-form 7.91.0, @hookform/resolvers 6.0.2, React 19.3.1, Vite 8.3.5, TypeScript 7.0.2 |
| `src/schema.ts` | The one rule book: the Zod schema and `CourseValues` type |
| `src/CourseForm.tsx` | The form, using `resolver: zodResolver(courseSchema)` and `setError` |
| `src/LevelPicker.tsx` | The three-button picker from lesson 1 |
| `api/server.mjs` | Practice API on port 8122. It imports `../src/schema.ts`. A local stand-in, not the real server |
| `api/mode.txt` | `schema` (use the shared schema) or `hand` (the second, hand-written rule book) |
| `probes/` | Small scripts that print what Zod and the resolver say |
| `old-resolver/` | A separate mini project with the old resolvers 3.10.0, for mistake 3 |
| `versions/v1-hand/` | The form from lesson 1, with only a `required` rule |
| `versions/v2-zod/` | The finished form and schema (same as `src/`), plus `schema-nopath.ts` |

## Follow along

### 1. Install

```bash
npm install
```

```text
added 5 packages ... found 0 vulnerabilities
```

(The exact count depends on your cache.) Check the versions that must fit together:

```bash
npm ls @hookform/resolvers react-hook-form zod
```

```text
+-- @hookform/resolvers@6.0.2
+-- react-hook-form@7.91.0
`-- zod@4.6.7
```

To add them to your own project: `npm install zod@4.6.7 react-hook-form@7.91.0 @hookform/resolvers@6.0.2`.

### 2. See the problem: two rule books (stage v1)

Copy the lesson 1 form and make the API use its own hand-written rules:

```bash
cp versions/v1-hand/CourseForm.tsx src/CourseForm.tsx
echo hand > api/mode.txt
```

Start the API and the app in two terminals:

```bash
node api/server.mjs
```

```text
API on http://localhost:8122
```

```bash
npm run dev
```

```text
  VITE v8.3.5  ready in ... ms
  ➜  Local:   http://localhost:5222/
```

In the form type title `Go`, price `499`, level `advanced`, empty description, then press Create course. The form's only rule (`required`) is happy, the API answers 422 with "Title needs at least 5 letters" and "A paid course needs a description". Copy 1 (the form) and copy 2 (`byHand` in `api/server.mjs`) have drifted apart.

Put the finished files back:

```bash
cp versions/v2-zod/CourseForm.tsx src/CourseForm.tsx
echo schema > api/mode.txt
```

Restart the API.

### 3. Write the schema (`src/schema.ts`)

```ts
import { z } from 'zod'

export const courseSchema = z
  .object({
    title: z.string().trim().min(5, 'Use at least 5 letters'),
    price: z
      .number({ error: 'Enter the price as a number' })
      .min(0, 'The price cannot be below zero'),
    level: z.enum(['beginner', 'intermediate', 'advanced'], {
      error: 'Pick a level',
    }),
    description: z.string().trim().max(300, 'At most 300 letters'),
  })
  .refine(c => c.price === 0 || c.description.length >= 20, {
    error: 'Paid courses need a description of 20+ letters',
    path: ['description'],
  })

export type CourseValues = z.infer<typeof courseSchema>
```

- `trim()` cuts spaces from both ends. `min(5, '...')` takes the message as its second argument.
- `z.number({ error: '...' })` is the message for the wrong kind of value, such as an empty box.
- One field cannot see another, so the paid-needs-description rule goes on the whole object with `.refine`. `path: ['description']` says under which box the message belongs.
- `z.infer` makes the form's type from the schema. Nothing is written twice.

### 4. Zod's own words versus ours

`probes/plain.ts` is a schema with no messages, run on bad data (title `Go`, price `NaN`, level `expert`):

```bash
node probes/plain.ts
```

```text
title: Too small: expected string to have >=5 characters
price: Invalid input: expected number, received NaN
level: Invalid option: expected one of "beginner"|"intermediate"|"advanced"
```

Correct, but written for programmers. Our schema on the same data:

```bash
node probes/friendly.ts
```

```text
title: Use at least 5 letters
price: Enter the price as a number
level: Pick a level
```

The refine rule, alone and together with a short title:

```bash
node probes/refine.ts
```

```text
only the description is missing: [ 'description -> Paid courses need a description of 20+ letters' ]
the title is short as well: [
  'title -> Use at least 5 letters',
  'description -> Paid courses need a description of 20+ letters'
]
```

### 5. Hand the schema to the form (`src/CourseForm.tsx`)

Three new imports and one new option. The type goes in the angle brackets so `register` and `errors` only accept names that exist:

```tsx
import { zodResolver } from '@hookform/resolvers/zod'
import { courseSchema, type CourseValues } from './schema'

const { register, handleSubmit, control, reset, setError,
  formState: { errors, isSubmitting },
} = useForm<CourseValues>({
  resolver: zodResolver(courseSchema),
  defaultValues: { title: '', price: 0, level: 'beginner', description: '' },
})
```

The JSX has no rules left: `<input {...register('title')} />` and `{errors.title && <p className="err">{errors.title.message}</p>}`. The price box keeps `valueAsNumber` (that is about reading the box, not checking it). The `Controller` for the level is unchanged.

### 6. Try the form

Open http://localhost:5222/ (API mode `schema`).

- Title `Go`, price `499`, empty description, press Create course. Guess how many messages first. Real result: two, and no request is sent.

  ```text
  Use at least 5 letters
  Paid courses need a description of 20+ letters
  ```

- Change the title to `React Basics`: the first message goes away at once, while you type. Write a description of 20 or more letters: the second goes too. After the first press of the button, every key checks that box again.
- Clear the price and press the button: `Enter the price as a number`. Type `-5`: `The price cannot be below zero`. Two rules on one field, two messages.

### 7. The second door: the API reads the same file

`api/server.mjs` imports `../src/schema.ts` and calls `safeParse`. On failure it answers 422 with `z.flattenError(result.error).fieldErrors`. Send a bad course straight to the API with no form at all (`probes/bad.json` holds a title of `Go` and the level `expert`):

```bash
curl -i -X POST http://localhost:8122/api/courses -H 'content-type: application/json' --data @probes/bad.json
```

```text
HTTP/1.1 422 Unprocessable Entity
...
{"errors":{"title":["Use at least 5 letters"],"level":["Pick a level"]}}
```

The same words as the form. Some rules only the server knows, such as "is this title taken?". The server answers 409 (conflict) with the same body shape. The practice API treats `react basics` as taken:

```bash
curl -s -X POST http://localhost:8122/api/courses -H 'content-type: application/json' \
  -d '{"title":"React Basics","price":499,"level":"beginner","description":"A long enough description for a paid course."}' -w ' -> %{http_code}\n'
```

```text
{"errors":{"title":["A course with this title already exists"]}} -> 409
```

The form shows these with `setError`, in `onSubmit`:

```tsx
if (!res.ok) {
  for (const [field, messages] of Object.entries<string[]>(body.errors)) {
    setError(field as keyof CourseValues, { message: messages[0] })
  }
  return
}
```

In the browser: title `React Basics`, price `499`, a good description, press the button. The schema passes, a request is sent, and under the title appears `A course with this title already exists`, in the same place and look as any other message.

### 8. Trim cleans the data

Type `  React for Everyone ` (extra spaces at both ends) and press the button. The form shows `Saved: React for Everyone`, and the API received the title without the spaces. `probes/trim.ts` shows the same:

```bash
node probes/trim.ts
```

```text
{ title: 'React Basics', price: 0, level: 'beginner', description: '' }
```

### 9. Build

```bash
npm run build
```

```text
✓ 116 modules transformed.
✓ built in 297ms
```

## Common mistakes

1. **A refine rule with no `path`.** Copy `versions/v2-zod/schema-nopath.ts` over `src/schema.ts`. A paid course with no description now shows no message and sends nothing: the form seems dead. Ask the resolver directly:

   ```bash
   node probes/nopath.ts
   ```

   ```text
   {"":{"message":"Paid courses need a description of 20+ letters","type":"custom"}}
   description: undefined
   ```

   The message belongs to the whole form (key `""`), and the page looks under `description` and finds nothing. Add the `path`.
2. **A field name that is not in the schema.** `register('titel')` is stopped by the type checker because `useForm` got the type `CourseValues`:

   ```text
   src/CourseForm.tsx(49,31): error TS2345: Argument of type '"titel"' is not assignable to parameter of type '"description" | "level" | "price" | "title"'.
   ```

   (The line number is yours to find.) Without the type, the box would never be checked.
3. **An old resolvers package with a new Zod.** `old-resolver/` has resolvers 3.10.0 next to zod 4.6.7:

   ```bash
   cd old-resolver
   npm install
   node resolver.ts
   ```

   The resolver throws a raw `ZodError` instead of returning an `errors` object, and the form does nothing useful:

   ```text
   ZodError: [
     {
       "code": "custom",
       "path": ["description"],
       "message": "Paid courses need a description of 20+ letters"
     }
   ]
   ```

   When a form stops validating after an update, check both versions first with `npm ls`. The resolvers package lists which Zod it accepts: `npm view @hookform/resolvers peerDependencies.zod` prints `^3.25.0 || ^4.0.0`.

## Honest limits

- Write messages for the person, not the programmer: say what to do ("Use at least 5 letters"), no jargon, no blame.
- A schema checks shape, not truth. "Is the title taken?" needs the server, which is why we have `setError`. A schema is a minimum check, not security (Module 13).
- The form and the API can share one file only because both are JavaScript here. With the Python API from the Python course, the API publishes a description of its rules and a tool builds the Zod schema from it. One source, never two hand-written copies.
- Keep the schema in its own file with no JSX, so it is easy to share and test.

## Clean up

Press Ctrl+C in both terminals. Reset `api/mode.txt` to `schema` and `src/CourseForm.tsx` to the finished version if you changed them. Delete `node_modules` and `dist` if you like.

## Try it yourself

Add a field `seats`: a whole number between 1 and 50, with its own messages (use `z.number().int(...)`, `.min(1, ...)`, `.max(50, ...)`). Then change a rule in `src/schema.ts` and watch both the form and the API follow. Answer: after you restart the API, it uses the new rule, and the form picks it up through Vite, because both import `src/schema.ts`.

## Next

[M12-L03 · Dynamic Fields, Wizards and File Upload](../m12-l03-dynamic-fields-wizards-and-file-upload/README.md)
