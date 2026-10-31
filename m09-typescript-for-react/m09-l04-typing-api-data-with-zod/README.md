# M09-L04 · Typing API Data with Zod

> Video: Module 9, Lesson 4. Watch it first, then follow along here.

## What you'll learn

- Why a TypeScript type cannot protect you from data that arrives from a server (types are erased, `as` is only a promise, `res.json()` gives `any`)
- Describe the shape of data once with a Zod schema, and get the check and the type from it (`z.infer`)
- Use `safeParse` (never throws) and `parse` (throws), and read Zod's list of problems
- Put the schema inside a typed `getJson` helper so every caller gets checked data
- Know the limits: shape not truth, unknown keys are dropped, `z.coerce` follows JavaScript rules, the cost

## Before you start

- Node 24. Check with `node --version`.
- No Docker needed. The data comes from `api/server.mjs`, a small local Node stand-in for the allcsvideos API (port 8195). It is not the production server. Its `api/mode.txt` file switches the answer between `ok` and `drift` (Meera's new release: `teacher` becomes `instructor`, and `price` is sent as text).
- Best after M09-L03 in `../m09-l03-generic-components-and-ui-states/`.

## Files in this folder

| File | What it is |
|------|------------|
| `allcsvideos-web/` | The finished project (Vite 8.3.5, React 19.3.1, TypeScript 7.0.2, Zod 4.6.7) |
| `allcsvideos-web/src/schema.ts` | The Zod schema and the `Course` type from `z.infer` |
| `allcsvideos-web/src/api.ts` | `getJson(url, schema)` and `getCourses()` |
| `allcsvideos-web/src/App.tsx` | The courses page |
| `allcsvideos-web/demos/` | Small Node scripts that try Zod on its own (`safe.ts`, `issue.ts`, `parse.ts`, `coerce.ts`, `limits.ts`, `strict.ts`, `cost.ts`) |
| `versions/v1-cast/` | Asha's first version: `types.ts` interface and `as Course[]` |
| `versions/v2-zod/` | The finished `App.tsx`, `api.ts` and `schema.ts` (same as `src/`) |
| `versions/m2-parse/` | `api.ts` that uses `parse` instead of `safeParse` (mistake two) |
| `probes/` | Five tiny files used to show real type errors |
| `api/server.mjs`, `api/mode.txt` | The local API stand-in and its mode switch |

## Follow along

```bash
cd allcsvideos-web
npm install
```

Start the API in a second terminal, from this lesson folder (it listens on port 8195):

```bash
node api/server.mjs
```
```bash
API on http://localhost:8195
```

### 1. Asha's page, working

`versions/v1-cast/` holds the first version: an `interface Course` in `types.ts`, and an API file that casts the answer with `as`. Copy it into `src/`:

```bash
cp ../versions/v1-cast/* src/
npm run dev
```

`types.ts`:
```ts
export interface Course {
  slug: string
  title: string
  teacher: string
  level: 'beginner' | 'intermediate' | 'advanced'
  price: number
  free: boolean
  lessonCount: number
}
```

`api.ts`:
```ts
import type { Course } from './types'

export async function getCourses(): Promise<Course[]> {
  const res = await fetch('/api/courses')
  if (!res.ok) throw new Error(`Server answered ${res.status}`)
  return (await res.json()) as Course[]
}
```

Open http://localhost:5194. You see `All courses`, eight cards, a teacher on every card, and a total with a 50 rupee fee (`Rs 549` for React for Beginners). The type checker agrees:

```bash
npx tsc -b
```

No output means no errors.

### 2. Meera ships an update

Meera changes the API: `teacher` is now `instructor`, and `price` is now sent as text. Switch the stand-in to that mode and reload the page:

```bash
echo drift > ../api/mode.txt
curl -s http://localhost:8195/api/courses
```

The first course is now:

```json
{"slug":"react-for-beginners","title":"React for Beginners","instructor":"Meera","level":"beginner","price":"499","free":false,"lessonCount":4}
```

Asha changed no code. Run the checker again: still nothing, no errors. Then open the page: every card says `by` and then nothing, and the totals are `Rs 49950` (text does not add, it sticks: `"499" + 50`). It is the bug from lesson 2.

### 3. Why the checker did not notice

A type is a label we write before the app runs. The checker reads labels but never opens the box. And the labels do not even travel. This is the file the browser receives for `api.ts` from the dev server (a real request while the page runs; the long source-map line at the end is left out):

```bash
curl -s http://localhost:5194/src/api.ts
export async function getCourses() {
	const res = await fetch("/api/courses");
	if (!res.ok) throw new Error(`Server answered ${res.status}`);
	return await res.json();
}
```

The `Promise<Course[]>` label and the `as` are gone: type erasure. There are two reasons the checker stayed quiet. First, the cast is a promise from us:

```bash
grep -n " as " src/api.ts
```
```bash
6:  return (await res.json()) as Course[]
```

Second, `res.json()` gives back `any`, so the checker is switched off for that value. This probe file shows it (`probes/p-any.ts`):

`probes/p-any.ts`:
```ts
export async function peek() {
  const res = await fetch('/api/courses')
  const data = await res.json()
  return data.nothing.here.at.all
}
```

Copy it in and check; no error:

```bash
cp ../probes/p-any.ts src/probe.ts
npx tsc -b
```

(Remove `src/probe.ts` again afterwards.) Types do help in one place, the code we type ourselves. A course written by hand with level `expert` and a text price (`probes/p-wrong.ts`, which needs `types.ts` from `v1-cast`, already in `src/`):

```bash
cp ../probes/p-wrong.ts src/probe.ts
```
```bash
npx tsc -b
src/probe.ts:7:3 - error TS2322: Type '"expert"' is not assignable to type '"advanced" | "beginner" | "intermediate"'.

7   level: 'expert',
    ~~~~~

  src/types.ts:5:3 - The expected type comes from property 'level' which is declared here on type 'Course'
    5   level: 'beginner' | 'intermediate' | 'advanced'
        ~~~~~

src/probe.ts:8:3 - error TS2322: Type 'string' is not assignable to type 'number'.

8   price: '499',
    ~~~~~

  src/types.ts:6:3 - The expected type comes from property 'price' which is declared here on type 'Course'
    6   price: number
        ~~~~~

Found 2 errors in the same file, starting at: src/probe.ts:7
```

Types protect the code we type, not the data that arrives. The cast `as Course[]` is exactly where the two worlds meet, with nobody on guard. Remove the probe: `rm src/probe.ts`.

### 4. The fix: a schema

Install Zod (it is already in this project's `package.json`; this is how the video added it to a project):

```bash
npm install zod
```
```bash
npm install zod
added 1 package, and audited 2 packages in 769ms

1 package is looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

```bash
npm ls zod
zoddemo@1.0.0 …/zoddemo
`-- zod@4.6.7
```

This is `src/schema.ts` (it is already in this project's `src/`):

`allcsvideos-web/src/schema.ts`:
```ts
import { z } from 'zod'

export const CourseSchema = z.object({
  slug: z.string(),
  title: z.string(),
  teacher: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  price: z.number(),
  free: z.boolean(),
  lessonCount: z.number(),
})

export const CoursesSchema = z.array(CourseSchema)

export type Course = z.infer<typeof CourseSchema>
```

`z.object` describes the shape, one line per field. `z.enum([...])` is the idea of a union from lesson 1: only these three words. `CoursesSchema` is a list of courses. The last line is the clever one: `z.infer` works out the type from the schema. Is it really the type we need? A probe that puts a course into a plain `string`:

```bash
cp ../probes/p-infer.ts src/probe.ts
```
```bash
npx tsc -b
src/probe.ts:4:14 - error TS2322: Type '{ slug: string; title: string; teacher: string; level: "advanced" | "beginner" | "intermediate"; price: number; free: boolean; lessonCount: number; }' is not assignable to type 'string'.

4 export const x: string = course
               ~

Found 1 error in src/probe.ts:4
```

TypeScript prints the type Zod made. So we write the shape once, and get a checker for real data and a type for our code. The old `types.ts` interface is deleted (`rm src/types.ts src/probe.ts`).

### 5. The door: safeParse

Every schema has `safeParse`. It checks any value and never throws; it returns an object with a `success` flag. If `success` is true the object holds `data` with the exact type. If false it holds an `error` with every problem found. It is a discriminated union (lesson 3). Try it on the real answer, first with the old shape:

```bash
echo ok > ../api/mode.txt
```

`allcsvideos-web/demos/safe.ts`:
```ts
import { CoursesSchema } from './schema.ts'
import { z } from 'zod'

const res = await fetch('http://localhost:8195/api/courses')
const json = await res.json()
const result = CoursesSchema.safeParse(json)

console.log('success:', result.success)
if (result.success) {
  console.log('first title:', result.data[0].title)
} else {
  console.log(z.prettifyError(result.error))
}
```

```bash
node demos/safe.ts
```
```bash
node demos/safe.ts
success: true
first title: React for Beginners
```

Now Meera's new answer:

```bash
echo drift > ../api/mode.txt
node demos/safe.ts
```
```bash
node demos/safe.ts
success: false
✖ Invalid input: expected string, received undefined
  → at [0].teacher
✖ Invalid input: expected number, received string
  → at [0].price
✖ Invalid input: expected string, received undefined
  → at [1].teacher
✖ Invalid input: expected number, received string
... (16 problems in all: teacher and price, for each of the 8 courses)
```

(`z.prettifyError` prints every problem with its place. The full run lists both problems for each of the 8 courses.) That is the exact mistake from the page, now with a name and an address. Every problem is also plain data. The first one (`demos/issue.ts`):

```bash
node demos/issue.ts
```
```bash
node demos/issue.ts
{
  expected: 'string',
  code: 'invalid_type',
  path: [ 0, 'teacher' ],
  message: 'Invalid input: expected string, received undefined'
}
```

There is also `parse`, without `safe`. If the data is right it returns it; if not it throws a `ZodError`. Same check, different style (`demos/parse.ts`):

```bash
node demos/parse.ts
```
```bash
node demos/parse.ts
ZodError 16
```

Back in the ok mode it prints `parse worked: 8 courses`:

```bash
echo ok > ../api/mode.txt
node demos/parse.ts
```
```bash
node demos/parse.ts
parse worked: 8 courses
```

Use `safeParse` when you want to handle the failure yourself, `parse` when a throw is fine.

### 6. Put the door into the app

Asha's fetch helper grows: `getJson` now takes the schema as a second argument. `z.ZodType<T>` says it works for any schema and returns whatever type that schema describes (the generic from lesson 3). Inside: fetch, throw on a bad status, then `safeParse`; on failure throw our own error with the place and the message.

Put the finished files back into `src/` (`v1-cast` overwrote them) and remove the old `types.ts`:

```bash
cp ../versions/v2-zod/* src/
rm -f src/types.ts src/probe.ts
```

This is `src/api.ts`:

`allcsvideos-web/src/api.ts`:
```ts
import { z } from 'zod'
import { CoursesSchema } from './schema'

async function getJson<T>(
  url: string,
  schema: z.ZodType<T>,
) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Server answered ${res.status}`)
  const result = schema.safeParse(await res.json())
  if (!result.success) {
    const { path, message } = result.error.issues[0]
    throw new Error(`Bad data at ${path.join('.')}: ${message}`)
  }
  return result.data
}

export const getCourses = () => getJson('/api/courses', CoursesSchema)
```

`getCourses` is one line, and the word `as` is gone from the whole file. The page needs almost no change; only the import, since the `Course` type now comes from the schema file:

`App.tsx` (changes marked with + and -):
```diff
@@ -2,3 +2,3 @@
 import { getCourses } from './api'
-import type { Course } from './types'
+import type { Course } from './schema'
 
```

Check and build:

```bash
npx tsc -b
```
```bash
npm run build
> allcsvideos-web@0.0.0 build
> tsc -b && vite build

vite v8.3.5 building client environment for production...
transforming...
✓ 113 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-7IZAQhtv.css    0.61 kB │ gzip:  0.33 kB
dist/assets/index-BMEDK1yR.js   304.97 kB │ gzip: 92.71 kB

✓ built in 380ms
```

(The file hashes can differ on your machine.) Run it against the old answer, then the new answer:

```bash
echo ok > ../api/mode.txt
```
Reload http://localhost:5194: the page works again, and the total for React for Beginners is `Rs 549`.

```bash
echo drift > ../api/mode.txt
```
Reload: the page says `Bad data at 0.teacher: Invalid input: expected string, received undefined`. Asha knows within a second what changed, instead of a student finding a wrong total a month later. The same helper also works in a router loader from module 8.

### 7. Coercion, limits, strictness and cost

Sometimes an answer is nearly right, like the price that arrived as text. `z.coerce.number()` can convert it (`demos/coerce.ts`):

`allcsvideos-web/demos/coerce.ts`:
```ts
import { z } from 'zod'

const Price = z.coerce.number()

console.log(Price.parse('499'))
console.log(Price.safeParse('abc').success)
console.log(Price.parse(''))
console.log(Price.parse(null))
```

```bash
node demos/coerce.ts
```
```bash
node demos/coerce.ts
499
false
0
0
```

Look at the last two lines: an empty string and `null` both become `0`. Coercion follows the JavaScript rules, so it can hide a real problem. Use it on purpose, for a field you know about.

Honest limits. First, Zod checks the shape, not the truth: a price of `-5` is a perfectly good number. Add `.min(0)` to say more. Second, by default Zod drops keys it does not know (`demos/limits.ts`):

`allcsvideos-web/demos/limits.ts`:
```ts
import { z } from 'zod'

const sent = { slug: 'react', price: -5, badge: 'new' }

const Loose = z.object({ slug: z.string(), price: z.number() })
console.log(Loose.parse(sent))

const Safer = z.object({ slug: z.string(), price: z.number().min(0) })
console.log(Safer.safeParse(sent).success)
```

```bash
node demos/limits.ts
```
```bash
node demos/limits.ts
{ slug: 'react', price: -5 }
false
```

If you would rather be told, use `z.strictObject` (`demos/strict.ts`):

```bash
node demos/strict.ts
```
```bash
node demos/strict.ts
false
✖ Unrecognized key: "badge"
```

Dropping is friendly to new fields a server adds; strict is better when an unknown key means a mistake. Third: a schema is code you must keep in line with the API. When the server changes, the schema fails loudly, which is the point, but somebody must update it. Many teams generate the schema from the API description. Fourth: the cost. Checking all eight courses (`demos/cost.ts`, run in the ok mode):

```bash
echo ok > ../api/mode.txt
node demos/cost.ts
```
```bash
node demos/cost.ts
8 courses checked 10000 times: 0.8 microseconds each
```

(Yours will differ: about one or two millionths of a second each on the video's laptop.) For huge lists, measure before you worry. Fifth: check data only at the door, once, where it comes in. After that your own code can trust the type.

### 8. Three mistakes

One: `as` on data from outside. It silences the checker and the box is still unopened. Search your code for `as`:

```bash
grep -n " as " src/*.ts src/*.tsx
```

In the finished project this prints nothing.

Two: `parse` and nobody catches it. `versions/m2-parse/api.ts` uses `parse`:

`api.ts`:
```ts
import { z } from 'zod'
import { CoursesSchema } from './schema'

async function getJson<T>(
  url: string,
  schema: z.ZodType<T>,
) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Server answered ${res.status}`)
  return schema.parse(await res.json())
}

export const getCourses = () => getJson('/api/courses', CoursesSchema)
```

The page's error handler catches it, but look at the message: a wall of JSON from the Zod error. `safeParse` lets you write one clear line.

```bash
cp ../versions/m2-parse/api.ts src/api.ts
echo drift > ../api/mode.txt
```
Reload and read the page, then put the final file back with `cp ../versions/v2-zod/api.ts src/api.ts`.

Three: reading the data before checking `success`. TypeScript stops you (`probes/p-first-bad.ts`):

`probes/p-first-bad.ts`:
```ts
import { CoursesSchema } from './schema'

export function first(json: unknown) {
  const result = CoursesSchema.safeParse(json)
  return result.data[0].title
}
```

```bash
cp ../probes/p-first-bad.ts src/probe.ts
```
```bash
npx tsc -b
src/probe.ts:5:10 - error TS18048: 'result.data' is possibly 'undefined'.

5   return result.data[0].title
           ~~~~~~~~~~~

Found 1 error in src/probe.ts:5
```

On failure there is no data. Check `success` first, and the error goes away (`probes/p-first-ok.ts`):

```bash
cp ../probes/p-first-ok.ts src/probe.ts
npx tsc -b
```

Remove the probe when you are done: `rm src/probe.ts`.

## Common mistakes

- `as` on server data. It is a promise, not a check.
- Trusting `res.json()`: it is `any`, which switches the checker off.
- Writing both an `interface` and a schema. Write the schema once and use `z.infer`.
- `parse` with nobody catching the error. Prefer `safeParse` and a short message.
- Reading `result.data` before checking `result.success`.
- `z.coerce` everywhere: an empty string and `null` both become `0`.
- Forgetting that the schema must be updated when the API changes.

## Clean up

Stop the API and the dev server with Ctrl+C. Put `ok` back in `api/mode.txt`. Delete `allcsvideos-web/node_modules` and `allcsvideos-web/dist` if you want. Make sure `src/` holds the final files: run `cp ../versions/v2-zod/* src/` and `rm -f src/types.ts src/probe.ts`.

## Key ideas (recap)

1. Types are labels. They are checked while we write and removed before the browser runs. An `as` cast on server data is only a promise, and an answer of type `any` switches the checker off.
2. A Zod schema opens the box at the door. One schema gives the check and, with `z.infer`, the type. `safeParse` returns success or an error; `parse` throws.
3. Put the schema inside the fetch helper, so every caller gets checked data. Zod checks shape, not truth, and by default drops unknown keys. Coerce on purpose.

Interview question (Rahul): TypeScript already checks types, so why do you need Zod? A good answer: TypeScript types exist only while compiling and are erased. Data from outside (a server, a form, a file) can be anything at run time, so you need a runtime check at the boundary. Zod gives that check and, with `z.infer`, the type from the same schema.

## Try it yourself

Write a schema for one course with its list of lessons inside (`z.array`), then point the helper at the course address `/api/courses/react-for-beginners` and break one field on purpose. (Answer below.)

Answer: add `LessonSchema = z.object({ id: z.number(), title: z.string(), minutes: z.number(), summary: z.string() })` and `CourseDetailSchema = CourseSchema.extend({ lessons: z.array(LessonSchema) })`, then `getJson('/api/courses/react-for-beginners', CourseDetailSchema)`. In `drift` mode the page reports `Bad data at teacher: ...`.

## Next

Module 10, Lesson 1: [Prop Drilling](../../m10-state-management/m10-l01-prop-drilling/README.md).
