# M09-L01 · TypeScript in One Video

> Video: Module 9, Lesson 1. Watch it first, then follow along here.

## What you'll learn

- What a type is, and what the type checker (`tsc`) does before your code runs
- The everyday types: `string`, `number`, `boolean`, arrays, interfaces, optional properties
- Labels on function inputs and results, unions, and literal unions
- Why `any` switches checking off and `unknown` makes you check first
- Why types are erased at runtime, and why the word `as` is only a promise
- Where the checker runs: your editor, the terminal and `npm run build`

## Before you start

- Node 24. Check with `node --version`.
- No Docker needed. This is the first TypeScript lesson, so no earlier lesson folder is required. A little JavaScript from modules 2 to 8 helps.
- Work inside the `allcsvideos-ts/` folder of this lesson. Every lab file lives in `labs/`; you copy one at a time into `allcsvideos-ts/src/lab.ts`.

## Files in this folder

| File | What it is |
|------|------------|
| `allcsvideos-ts/` | The Vite + React + TypeScript project from the video (price typo already fixed) |
| `allcsvideos-ts/src/types.ts` | The `Course` interface used by the labs |
| `labs/app-typo.tsx` | `App.tsx` with the `prise` typo from the start of the video |
| `labs/types.ts`, `labs/types-discount.ts` | Two versions of the `Course` interface (without and with `discount?`) |
| `labs/data.ts` | The small `courses` list used by three labs |
| `labs/d1-...` to `labs/m1-...` | One file per lab, in the order of the video |
| `erase/erased.ts` | The file used to show type erasure |

The lab files are named with a short letter-and-number code (d1, e1, f1 ...) followed by what they show. Each one is a complete `lab.ts`.

## Follow along

### 1. The bug TypeScript catches

The page shows a course card with the price line `Rs` and nothing after it. No red error appears anywhere. The code that draws the price line is `Rs {course.prise}`: a spelling mistake. JavaScript quietly gives `undefined` for a property that does not exist.

Install the project and start the dev server with the typo in place:

```bash
cd allcsvideos-ts
npm install
cp ../labs/app-typo.tsx src/App.tsx
npm run dev
```

Open the address that Vite prints (this project asks for http://localhost:5191). The card says `React for Beginners`, `by Meera`, and then `Rs` with no number. The dev server did not stop you: Vite only removes the labels, it does not check them.

Now ask TypeScript, with no browser at all:

```bash
npx tsc -b
src/App.tsx(19,41): error TS2551: Property 'prise' does not exist on type 'Course'. Did you mean 'price'?
```

(In a real terminal the same message is drawn in color, with the code line and tildes under it, as in the labs below.) The checker names the file, the line, the column, and even the fix.

### 2. A picture: the warehouse and the clerk

JavaScript is a warehouse where boxes have no labels: a box can hold a number today and a text tomorrow. TypeScript adds the labels. A type is a label that says what kind of value a place may hold. The clerk at the door is the type checker, `tsc`.

TypeScript is not a new language. It is JavaScript plus labels, so every JavaScript file is already valid TypeScript. You write files ending in `.ts` (or `.tsx` when they contain JSX). There are two jobs: job one is checking (`tsc`), job two is removing the labels (Vite does that in a Vite project).

### 3. Set up a project with TypeScript

The project of this lesson was created like this (you do not need to repeat it, the folder is already here):

```bash
npm create vite@latest allcsvideos-ts -- --template react-ts
cd allcsvideos-ts
npm install
```

The main file is `src/App.tsx` (not `App.jsx`). Three `tsconfig` files hold the checker settings, and `typescript` plus the `@types/...` packages are normal dev dependencies. Strict checking is switched on by default.

```bash
npx tsc --version
Version 7.0.2
```

Check the whole project. `-b` means build mode, the same way the project's build script runs it. No output means no mistakes:

```bash
npx tsc -b
```

From here on you practise in one small file, `src/lab.ts`. After every change you run the same command and read the real output. For each lab below, copy the lab file over `src/lab.ts`. A few labs need other files, and the step says so.

Put the shared files in place once:

```bash
cp ../labs/types.ts src/types.ts
cp ../labs/data.ts src/data.ts
```

### 4. string, number, boolean

A text is `string`, a number is `number`, a yes-or-no is `boolean`. Put a colon after the variable name, then the type. Then the lab gives `lessons` (a number) the text `'twelve'`.

```bash
cp ../labs/d1-string-number-boolean.ts src/lab.ts
```
`src/lab.ts`:
```ts
let title: string = 'React for Beginners'
let lessons: number = 12
let free: boolean = false

lessons = 'twelve'

console.log(title, lessons, free)
```
```bash
npx tsc -b
src/lab.ts:5:1 - error TS2322: Type 'string' is not assignable to type 'number'.

5 lessons = 'twelve'
  ~~~~~~~

Found 1 error in src/lab.ts:5
```

Read an error from the top: first the place (file, line, column), then a code (`TS2322`) you can search for, then the sentence. The sentence is the part to read.

### 5. Inference: you rarely write the label

`let price = 499` has no label, but TypeScript looks at the value and decides the box holds a number. Putting a text in later is still an error.

`src/lab.ts`:
```ts
let price = 499
price = '499'

console.log(price)
```
```bash
npx tsc -b
src/lab.ts:2:1 - error TS2322: Type 'string' is not assignable to type 'number'.

2 price = '499'
  ~~~~~

Found 1 error in src/lab.ts:2
```

Rule of thumb: let TypeScript infer simple variables. Write labels where it cannot guess: function inputs and the shape of an object.

### 6. Arrays

An array type is the item type followed by `[]`: `string[]` is a list of texts. Adding a number to the list of tags is refused.

`src/lab.ts`:
```ts
const tags: string[] = ['react', 'vite']
const prices: number[] = [499, 999]

tags.push(42)

console.log(tags, prices)
```
```bash
npx tsc -b
src/lab.ts:4:11 - error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.

4 tags.push(42)
            ~~

Found 1 error in src/lab.ts:4
```

### 7. Objects: interface

An `interface` describes the shape of an object. Here is a correct file; the checker is quiet and node can run a `.ts` file directly (it skips the labels).

`src/lab.ts`:
```ts
interface Course {
  id: number
  title: string
  teacher: string
  price: number
}

const course: Course = {
  id: 1,
  title: 'React for Beginners',
  teacher: 'Meera',
  price: 499,
}
console.log(course.title)
```
```bash
npx tsc -b
node src/lab.ts
React for Beginners
```

From now on the shape lives in `src/types.ts` with `export` in front, and other files bring it in with `import type`. Break it: the object forgets `teacher`.

`src/lab.ts`:
```ts
import type { Course } from './types.ts'

const course: Course = {
  id: 1,
  title: 'React for Beginners',
  price: 499,
}
console.log(course.title)
```
```bash
npx tsc -b
src/lab.ts:3:7 - error TS2741: Property 'teacher' is missing in type '{ id: number; title: string; price: number; }' but required in type 'Course'.

3 const course: Course = {
        ~~~~~~

  src/types.ts:4:3 - 'teacher' is declared here.
    4   teacher: string
        ~~~~~~~

Found 1 error in src/lab.ts:3
```

The typo from the start of the video, now in the lab file:

`src/lab.ts`:
```ts
import type { Course } from './types.ts'

const course: Course = {
  id: 1,
  title: 'React for Beginners',
  teacher: 'Meera',
  price: 499,
}
console.log(course.prise)
```
```bash
npx tsc -b
src/lab.ts:9:20 - error TS2551: Property 'prise' does not exist on type 'Course'. Did you mean 'price'?

9 console.log(course.prise)
                     ~~~~~

  src/types.ts:5:3 - 'price' is declared here.
    5   price: number
        ~~~~~

Found 1 error in src/lab.ts:9
```

The right name but the wrong kind of value, a price that is the text `'499'`:

`src/lab.ts`:
```ts
import type { Course } from './types.ts'

const course: Course = {
  id: 1,
  title: 'React for Beginners',
  teacher: 'Meera',
  price: '499',
}
console.log(course.price)
```
```bash
npx tsc -b
src/lab.ts:7:3 - error TS2322: Type 'string' is not assignable to type 'number'.

7   price: '499',
    ~~~~~

  src/types.ts:5:3 - The expected type comes from property 'price' which is declared here on type 'Course'
    5   price: number
        ~~~~~

Found 1 error in src/lab.ts:7
```

There is a second way to name a shape, with the word `type`. In this course: `interface` for object shapes, `type` for unions and other names.

`src/lab.ts`:
```ts
interface Teacher {
  name: string
  courses: number
}

type Student = {
  name: string
  courses: number
}

const meera: Teacher = { name: 'Meera', courses: 2 }
const lukas: Student = { name: 'Lukas', courses: 1 }
console.log(meera, lukas)
```
```bash
npx tsc -b
```

### 8. Optional properties

A question mark after the name makes a property optional. Use `labs/types-discount.ts` as `src/types.ts` for the next two labs:

```bash
cp ../labs/types-discount.ts src/types.ts
```

Subtracting an optional value is a mistake the checker finds:

`src/lab.ts`:
```ts
import type { Course } from './types.ts'

const course: Course = {
  id: 1,
  title: 'React for Beginners',
  teacher: 'Meera',
  price: 499,
}
console.log(course.price - course.discount)
```
```bash
npx tsc -b
src/lab.ts:9:28 - error TS18048: 'course.discount' is possibly 'undefined'.

9 console.log(course.price - course.discount)
                             ~~~~~~~~~~~~~~~

Found 1 error in src/lab.ts:9
```

The fix is the double question mark from module 2, lesson 6: use zero when there is no discount.

`src/lab.ts`:
```ts
import type { Course } from './types.ts'

const course: Course = {
  id: 1,
  title: 'React for Beginners',
  teacher: 'Meera',
  price: 499,
}
console.log(course.price - (course.discount ?? 0))
```
```bash
npx tsc -b
node src/lab.ts
499
```

Put the normal `Course` back before the next lab:

```bash
cp ../labs/types.ts src/types.ts
```

### 9. Functions: labels on inputs and results

After each input name, a colon and its type. After the closing bracket, a colon and the type of the result. A call with a text instead of a number:

`src/lab.ts`:
```ts
function formatPrice(price: number): string {
  return 'Rs ' + price
}

console.log(formatPrice('499'))
```
```bash
npx tsc -b
src/lab.ts:5:25 - error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.

5 console.log(formatPrice('499'))
                          ~~~~~

Found 1 error in src/lab.ts:5
```

A parameter is the name inside the function. An argument is the value you pass in. The error sits on the call. A result label is a promise too:

`src/lab.ts`:
```ts
function formatPrice(price: number): string {
  return price
}

console.log(formatPrice(499))
```
```bash
npx tsc -b
src/lab.ts:2:3 - error TS2322: Type 'number' is not assignable to type 'string'.

2   return price
    ~~~~~~

Found 1 error in src/lab.ts:2
```

The labels are a contract: what the function needs and what it gives back. And labels flow through `map`, `filter` and every callback: `c` is a `Course` because `courses` is a list of `Course` (this lab imports `data.ts`).

`src/lab.ts`:
```ts
import { courses } from './data.ts'

const titles = courses.map(c => c.titel)

console.log(titles)
```
```bash
npx tsc -b
src/lab.ts:3:35 - error TS2551: Property 'titel' does not exist on type 'Course'. Did you mean 'title'?

3 const titles = courses.map(c => c.titel)
                                    ~~~~~

  src/types.ts:3:3 - 'title' is declared here.
    3   title: string
        ~~~~~

Found 1 error in src/lab.ts:3
```

### 10. Unions and narrowing

A bar between two types means "or". An id that is a number or a string:

`src/lab.ts`:
```ts
function describe(id: number | string) {
  return id.toFixed(2)
}

console.log(describe(7))
```
```bash
npx tsc -b
src/lab.ts:2:13 - error TS2339: Property 'toFixed' does not exist on type 'string | number'.
  Property 'toFixed' does not exist on type 'string'.

2   return id.toFixed(2)
              ~~~~~~~

Found 1 error in src/lab.ts:2
```

`toFixed` belongs to numbers only. Ask first with `typeof`; inside that block the checker knows the type. This is called narrowing.

`src/lab.ts`:
```ts
function describe(id: number | string) {
  if (typeof id === 'number') {
    return id.toFixed(2)
  }
  return id.toUpperCase()
}

console.log(describe(7), describe('c-7'))
```
```bash
npx tsc -b
node src/lab.ts
7.00 C-7
```

### 11. Literal unions

A union made of exact words. This is the status note from module 5, lesson 5, and now a one-letter slip is caught:

`src/lab.ts`:
```ts
type Status = 'idle' | 'loading' | 'error' | 'done'

let status: Status = 'idle'
status = 'loadin'

console.log(status)
```
```bash
npx tsc -b
src/lab.ts:4:1 - error TS2820: Type '"loadin"' is not assignable to type 'Status'. Did you mean '"loading"'?

4 status = 'loadin'
  ~~~~~~

Found 1 error in src/lab.ts:4
```

### 12. A value, or nothing

`find` gives back a course or `undefined`. Check first, with `if (found)`:

`src/lab.ts`:
```ts
import { courses } from './data.ts'

const found = courses.find(c => c.id === 3)

console.log(found.title)
```
```bash
npx tsc -b
src/lab.ts:5:13 - error TS18048: 'found' is possibly 'undefined'.

5 console.log(found.title)
              ~~~~~

Found 1 error in src/lab.ts:5
```

`src/lab.ts`:
```ts
import { courses } from './data.ts'

const found = courses.find(c => c.id === 3)

if (found) {
  console.log(found.title)
}
```
```bash
npx tsc -b
node src/lab.ts
System Design
```

### 13. any versus unknown

`any` switches the checking off for that value. The checker says nothing, but the program crashes:

`src/lab.ts`:
```ts
const data: any = JSON.parse('{"title":"React"}')

console.log(data.title.toUpperCase())
console.log(data.price.toFixed(2))
```
```bash
npx tsc -b
node src/lab.ts
REACT
file:///…/allcsvideos-ts/src/lab.ts:4
console.log(data.price.toFixed(2))
                       ^

TypeError: Cannot read properties of undefined (reading 'toFixed')
    at file:///…/allcsvideos-ts/src/lab.ts:4:24
    at ModuleJob.run (node:internal/modules/esm/module_job:439:25)
    at async node:internal/modules/esm/loader:633:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

Node.js v24.16.0
```

`unknown` means: prove what it is before you use it.

`src/lab.ts`:
```ts
const data: unknown = JSON.parse('{"title":"React"}')

console.log(data.title.toUpperCase())
```
```bash
npx tsc -b
src/lab.ts:3:13 - error TS18046: 'data' is of type 'unknown'.

3 console.log(data.title.toUpperCase())
              ~~~~

Found 1 error in src/lab.ts:3
```

`src/lab.ts`:
```ts
const value: unknown = JSON.parse('"React"')

if (typeof value === 'string') {
  console.log(value.toUpperCase())
}
```
```bash
npx tsc -b
node src/lab.ts
REACT
```

Any says "trust me". Unknown says "show me". Reach for `unknown`, never for `any`.

### 14. When does the checker run?

Three safety nets: your editor (red lines while you type), the terminal (`npx tsc -b`), and the build. The build script runs `tsc` first and Vite second. With the typo in place the build stops and nothing is made:

```bash
cp ../labs/app-typo.tsx src/App.tsx
rm src/lab.ts src/data.ts
```
```bash
npm run build
> allcsvideos-ts@0.0.0 build
> tsc -b && vite build

src/App.tsx(19,41): error TS2551: Property 'prise' does not exist on type 'Course'. Did you mean 'price'?
```

Fix the spelling (`cp` the fixed `App.tsx` from the project folder in the repo, or edit `prise` to `price`). The page shows `Rs 499` and the build works:

```bash
npm run build
> allcsvideos-ts@0.0.0 build
> tsc -b && vite build

vite v8.3.5 building client environment for production...
transforming...
✓ 16 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.46 kB │ gzip:  0.29 kB
dist/assets/index-B1vD-gU3.css    0.45 kB │ gzip:  0.27 kB
dist/assets/index-Bipacw7s.js   219.90 kB │ gzip: 68.73 kB

✓ built in 54ms
```

### 15. Types are erased

Types exist only while you write. Compile `erase/erased.ts` and look at the result:

```bash
cp ../erase/erased.ts .
```
`erase/erased.ts`:
```ts
interface Course {
  title: string
  price: number
}

const course: Course = { title: 'React', price: 499 }

function formatPrice(price: number): string {
  return 'Rs ' + price
}

console.log(formatPrice(course.price))
```

```bash
npx tsc erased.ts
```

```bash
cat erased.js
"use strict";
const course = { title: 'React', price: 499 };
function formatPrice(price) {
    return 'Rs ' + price;
}
console.log(formatPrice(course.price));
```

The interface and every colon label are gone. Types cost nothing at runtime, and they cannot check anything at runtime either.

### 16. The trap: `as` with outside data

Text from a server says `price: "free"`. We tell TypeScript it is a `Course` with `as`, then add one to the price. The checker is quiet; node prints `free1`.

`src/lab.ts`:
```ts
import type { Course } from './types.ts'

const text = '{"title":"React","price":"free"}'
const course = JSON.parse(text) as Course

console.log(course.price + 1)
```
```bash
npx tsc -b
node src/lab.ts
free1
```

`as` never changes the data. It only silences the checker. The proper runtime check is the last lesson of this module (Zod).

Because types are gone at runtime, you cannot ask about them:

`src/lab.ts`:
```ts
import type { Course } from './types.ts'

const course: Course = JSON.parse('{}')

console.log(course instanceof Course)
```
```bash
npx tsc -b
src/lab.ts:5:31 - error TS2693: 'Course' only refers to a type, but is being used as a value here.

5 console.log(course instanceof Course)
                                ~~~~~~

Found 1 error in src/lab.ts:5
```

### 17. Mistakes you will meet in your first week

Mistake one: a function input with no label. In strict mode the checker will not guess:

`src/lab.ts`:
```ts
function formatPrice(price) {
  return 'Rs ' + price
}

console.log(formatPrice(499))
```
```bash
npx tsc -b
src/lab.ts:1:22 - error TS7006: Parameter 'price' implicitly has an 'any' type.

1 function formatPrice(price) {
                       ~~~~~

Found 1 error in src/lab.ts:1
```

The fix: add the label, `price: number`.

## Common mistakes

- A function input with no label (`implicitly has an any type`). Add `: number` or the right type.
- Using `as` to silence an error. It is only a promise; the data can still break it.
- Writing `any` everywhere to make red lines disappear. Use `unknown` and narrow it.
- Expecting types to exist at runtime (`instanceof Course`). They are erased; use a runtime check for outside data.
- Forgetting that Vite does not check types. Run `npx tsc -b` or the build.
- Forgetting to put `types.ts` back after the optional-discount labs.

## Clean up

Stop the dev server with Ctrl+C. To remove the install, delete `allcsvideos-ts/node_modules` and `allcsvideos-ts/dist`; the lab files you copied into `src/` (`lab.ts`, `data.ts`) can be deleted too.

## Key ideas (recap)

1. Types are labels. `tsc` reads them before the code runs, then they are erased.
2. Everyday labels: `string`, `number`, `boolean`, `Type[]`, `interface`, `?` for optional, `|` for unions, exact words for literal unions, labels on function inputs and results.
3. `any` switches checking off, `unknown` makes you check first, `as` is a promise and never a check.

Interview question (Rahul): what is the difference between `any` and `unknown`? Good answer: `any` turns type checking off for that value. `unknown` also accepts anything but forces you to check the type before you use it, so it is the safe one.

## Try it yourself

Add a field `level` to the course whose type is a union of `'beginner'`, `'intermediate'` and `'advanced'`. Then try a fourth word and read the error. (Answer below.)

Answer: in `types.ts` add `level: 'beginner' | 'intermediate' | 'advanced'` (every `Course` object, including the one in `App.tsx`, then needs a `level`). Writing `level: 'expert'` gives `Type '"expert"' is not assignable to type '"advanced" | "beginner" | "intermediate"'`.

## Next

Module 9, Lesson 2: [Typing Props, State and Events](../m09-l02-typing-props-state-and-events/README.md).
