# M02-L04 · Modules: import and export

> Video: Module 2, Lesson 4. Watch it first, then follow along here.

## What you'll learn

- Why we split code into files, and what a module is: one file with its own private space
- `export` and `import`: named exports (curly braces, exact name, `as` to rename) and default exports (no braces, any name)
- What `./`, `../` and a plain name in an import path mean
- How the same `import` works in the browser with Vite
- The errors every beginner meets in the first week, and how to read each
- How to read every line of `main.jsx` and `App.jsx`

## Before you start

- Node 24 (`node --version`). Lessons [M02-L01](../m02-l01-let-const-and-arrow-functions/) to [M02-L03](../m02-l03-map-filter-and-friends/) first.
- For the last part you need the `allcsvideos-web` project: use the folder in this lesson (`npm install` inside it) or your own copy from [M01-L04](../../m01-getting-started/m01-l04-tour-of-your-first-react-app/).
- No Docker needed.

## Files in this folder

| File or folder | What it is |
|----------------|------------|
| `shop/` | The small node project: `package.json` (with `"type": "module"`), `courses.js`, `price.js`, `main.js` |
| `shop/main-*.js` | One file per experiment (private name, default import, rename, banner, and the four error files) |
| `shop/banner.js` | A file with one `console.log`, imported just to run it |
| `shop-lib/` | The tidied shop: `price.js` moved into `lib/`, and a new `lib/summary.js` |
| `shop-commonjs/` | A project made with `npm init -y`: `"type": "commonjs"`, so `import` fails until you change it |
| `allcsvideos-web/` | The Vite project at the end of the video: `src/courses.js`, `src/price.js` and an `App.jsx` that imports them |
| `edits/App.before.jsx` | The welcome page from Lesson M01-L04 (text typed by hand) |
| `edits/App.wrong-path.jsx`, `edits/App.export-typo.jsx` | Two broken versions of `App.jsx` for the error experiments |

## Follow along

### 1. The four questions

In [M01-L04](../../m01-getting-started/m01-l04-tour-of-your-first-react-app/) you saw four lines that start with `import` in `main.jsx`. They raise four questions:

1. Why are some names inside curly braces and others are not?
2. What does the `./` in front of some file names mean?
3. Why does `react` have no `./` and no file ending?
4. What is `export default`, the words that end `App.jsx`?

### 2. Why modules

Imagine a book with five hundred pages and no chapters. Books have chapters so you can find things fast and two authors can write two chapters at the same time. It is the same with code. One file is fine for ten lines; a big app needs one file for the courses, one for the price helpers, and one that uses them both.

A **module** is one file with its own private space. Think of a room with a closed door: the names inside stay inside, so two files can both have a variable called `price` without a clash. Rooms must share some things, so JavaScript gives you two words. **`export`** puts something on the shelf by the door. **`import`** goes to that shelf and takes it. Everything not on a shelf stays private.

### 3. Export and import in node

Open a terminal in `shop/`. The `package.json` has one line that matters, `"type": "module"`. It tells node that the files here use `import` and `export` (your React project has the same line).

```json
{
  "name": "shop",
  "version": "1.0.0",
  "type": "module"
}
```

`price.js`:

```js
const symbol = 'Rs'

export function formatPrice(price) {
  return `${symbol} ${price}`
}

export function totalPrice(list) {
  return list.reduce((sum, course) => sum + course.price, 0)
}
```

`formatPrice` and `totalPrice` have `export`, so they are on the shelf. The constant `symbol` has no `export`, so it stays in the room. `main.js` uses one of them:

```js
import { formatPrice } from './price.js'

console.log(formatPrice(499))
```

Read the import from left to right: bring in `formatPrice` (curly braces, the exact name the other file exports), `from` the file at this path. Guess what `node main.js` prints.

```bash
node main.js
```

```text
Rs 499
```

`main.js` never wrote that function. It imported it from `price.js`.

Experiment: `symbol` is a real constant in `price.js`. Will `console.log(symbol)` work in `main-private.js`?

```bash
node main-private.js
```

```text
Rs 499
~/shop/main-private.js:4
console.log(symbol)
            ^

ReferenceError: symbol is not defined
```

(`~` is the folder on your computer; the stack lines are left out.) The first line still prints, then a red error. `main-private.js` cannot see inside the room. Only what was exported crosses the door. That is a feature: each file can use any helper names it likes and nobody else's code can break them.

Checkpoint: `export` puts a name on the shelf. `import` with curly braces and the exact name takes it. A name that is not exported stays private. Line 2 of `main.jsx` is exactly this form: `import { createRoot } from 'react-dom/client'`.

### 4. Default exports, renaming and bare imports

A file with one main thing to offer uses a **default** export. `courses.js` ends with:

```js
export default courses
```

(above it, the same four courses as before). A file can have only one default, and importing it has **no curly braces**: you choose the name. `main-default.js` uses both kinds:

```js
import courses from './courses.js'
import { formatPrice, totalPrice } from './price.js'

console.log(courses[0].title)
console.log(formatPrice(courses[0].price))
console.log(formatPrice(totalPrice(courses)))
```

```bash
node main-default.js
```

```text
React for Beginners
Rs 499
Rs 1498
```

If a name is too long or clashes with one you have, rename it while importing with `as`. `main-rename.js`:

```js
import allCourses from './courses.js'
import { formatPrice as money, totalPrice } from './price.js'

console.log(allCourses[0].title)
console.log(money(allCourses[0].price))
console.log(money(totalPrice(allCourses)))
```

Same output: the new names exist only in this file. In `price.js` the function is still called `formatPrice`.

- **Named:** many per file, imported with curly braces, exact name.
- **Default:** one per file, imported without braces, you choose the name.

A way to remember: curly braces mean "take these exact items off the shelf"; no braces means "give me the main thing".

One more form: import a file not for a name but just to run it. `banner.js` has one line, `console.log('--- allcsvideos shop ---')`. In `main-banner.js` we write `import './banner.js'` and nothing else:

```bash
node main-banner.js
```

```text
--- allcsvideos shop ---
Rs 499
```

Importing a file runs it. That is line 3 of `main.jsx`: `import './index.css'` has no name and no braces; it just loads the file so its styles apply to the page. In React, component files end with `export default` and `main.jsx` imports them without braces; tools like `createRoot` are named exports.

### 5. Paths: ./ and ../

The path in quotes says where to find the file. `./` means "start from the folder I am in". Now tidy the shop: `price.js` moves into a new folder `lib/` and a new file `lib/summary.js` is added next to it (this is `shop-lib/`):

```text
shop-lib/
  courses.js
  main.js
  package.json
  lib/
    price.js
    summary.js
```

`main.js` is in the shop folder and wants `summary`, which is inside `lib`:

```js
import { summary } from './lib/summary.js'

console.log(summary())
```

`lib/summary.js` needs two things. The price helper sits next to it, so `./price.js`. The courses list is one folder up, so `../courses.js`:

```js
import courses from '../courses.js'
import { formatPrice } from './price.js'

export function summary() {
  return courses.map(c => `${c.title}: ${formatPrice(c.price)}`)
}
```

One dot means here, two dots mean one folder up.

```bash
cd ../shop-lib
node main.js
```

```text
[
  'React for Beginners: Rs 499',
  'Python from Zero: Rs 0',
  'System Design: Rs 999',
  'DevOps Basics: Rs 0'
]
```

What if the path has no dots, like `react`? Then it is not a file of yours: it is a **package name**, and node and Vite look for it in `node_modules`, the warehouse from Module 1 where npm put React. **If the text starts with a dot, it is a file of yours. A plain name is a package someone else made.** `react-dom/client` is the package `react-dom` plus its `client` part. Always write the file ending (`.js`, `.jsx`): the path is the exact file name.

### 6. The same import in the browser

Browsers understand `import` and `export` by themselves. In `allcsvideos-web/src/` there are the same two files, `courses.js` and `price.js`, and `App.jsx` now imports them:

```jsx
import './App.css'
import courses from './courses.js'
import { formatPrice } from './price.js'

function App() {
  const course = courses[0]
  return (
    <main>
      <h1>Welcome to allcsvideos</h1>
      <div className="card">
        <h2>{course.title}</h2>
        <p>by {course.teacher}</p>
        <p>{formatPrice(course.price)}</p>
      </div>
    </main>
  )
}

export default App
```

Line 2 imports the default list, line 3 the named `formatPrice`. In JSX, curly braces mean "put this JavaScript value here" (Module 3 teaches it properly). Run it:

```bash
cd ../allcsvideos-web
npm install
npm run dev
```

The page shows:

```text
Welcome to allcsvideos
React for Beginners
by Meera
Rs 499
```

Before, the card text was typed by hand (`edits/App.before.jsx`). Now it comes from the data file. In the browser's **Network** tab you see the requests for `/src/main.jsx`, `/src/App.jsx`, `/src/App.css`, and then, because of the two import lines, `/src/courses.js` and `/src/price.js`. Each import makes the browser ask for one more file.

## Common mistakes

Every beginner meets these in the first week.

**1. A wrong path.** In `main-wrong-path.js` the import is `./prices.js` (extra s):

```bash
cd ../shop
node main-wrong-path.js
```

```text
node:internal/modules/esm/resolve:271
    throw new ERR_MODULE_NOT_FOUND(
          ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find module '~/shop/prices.js' imported from ~/shop/main-wrong-path.js
  code: 'ERR_MODULE_NOT_FOUND',
  url: '~/shop/prices.js'
```

Node turned `./` into the full folder path and put `prices.js` at the end: no such file. Check the spelling and the folder. In the browser, copy `edits/App.wrong-path.jsx` over `src/App.jsx` and save: the red overlay from M01-L04 appears.

```text
Failed to resolve import "./prices.js" from "src/App.jsx". Does the file exist?
src/App.jsx:3:28
```

Now you know what the `Apps.css` error really said: an import points to a file that is not there. Put the right file back and the overlay disappears.

**2. A missing file ending** (`main-no-extension.js`, `./price`). Node says module not found again, and even asks:

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '~/shop/price' imported from ~/shop/main-no-extension.js
Did you mean to import "./price.js"?
```

Vite forgives this one, but do not count on it. Write the whole name.

**3. A name that is not exported** (`main-export-typo.js`, `formatPrise` with an s instead of a c):

```text
~/shop/main-export-typo.js:1
import { formatPrise } from './price.js'
         ^^^^^^^^^^^
SyntaxError: The requested module './price.js' does not provide an export named 'formatPrise'
```

It tells you what you asked for and which file. Open that file and compare the spelling with its export. In the browser (copy `edits/App.export-typo.jsx`) this one is sneaky: the page still looks fine with no overlay, but the console says in red:

```text
[vite] SyntaxError: The requested module '/src/price.js' does not provide an export named 'formatPrise'
[vite] Failed to reload /src/App.jsx. This could be due to syntax errors or importing non-existent modules. (see errors above)
```

Hot reload failed, so the page still shows the old version. Refresh and the page is blank, with no overlay: open the console, as Lesson M01-L04 said.

**4. Default and named mixed up.** `main-braces-on-default.js` writes `import { courses } from './courses.js'`:

```text
SyntaxError: The requested module './courses.js' does not provide an export named 'courses'
```

`courses` is the default, so it has no name on the shelf: remove the braces. The other way round, `main-default-on-named.js` writes `import formatPrice from './price.js'`:

```text
SyntaxError: The requested module './price.js' does not provide an export named 'default'
```

`formatPrice` is a named export, so there is no default on that shelf: add the braces.

**5. Your own project (`shop-commonjs/`).** `npm init -y` writes `"type": "commonjs"`, the old way of sharing code:

```bash
cd ../shop-commonjs
node main.js
```

```text
Warning: Failed to load the ES module: ~/shop-commonjs/main.js. Make sure to set "type": "module" in the nearest package.json file or use the .mjs extension.
~/shop-commonjs/main.js:1
import { formatPrice } from './price.js'
^^^^^^

SyntaxError: Cannot use import statement outside a module
```

Change `"commonjs"` to `"module"` in `package.json` and it runs and prints `Rs 499`. (Node may also print a `(node:1234)` prefix before `Warning:`; the number differs.)

**Four messages to remember:**

- *Cannot find module*: the path or the file ending is wrong.
- *does not provide an export named*: a typo, or default and named mixed up.
- *is not defined*: that name was never exported, or never imported.
- *Cannot use import statement*: the `type` in `package.json`.

### Reading main.jsx and App.jsx again

Now every line of `main.jsx` makes sense:

```jsx
import { StrictMode } from 'react'              // named import, from a package (no dot)
import { createRoot } from 'react-dom/client'   // named import, from a package
import './index.css'                            // just load the file, same folder
import App from './App.jsx'                     // default import, a file of ours
```

And `App.jsx`: line 1 loads a style file, line 2 is the default import `courses`, line 3 the named import `formatPrice`, and the last line `export default App` is the shelf that `main.jsx` takes `App` from. So the four answers: **braces** mean named imports. **`./`** means a file in this folder. **No dot** means a package. **`export default`** is the main thing a file offers.

Interview tip. If Rahul, an interviewer, asks the difference between a default export and a named export: a file can have one default export, imported without braces under any name. It can have many named exports, imported with curly braces by their exact names.

## Try it yourself

1. Take a function from an earlier lesson, move it into its own file, export it, and import it in a second file.
2. Break the path on purpose and read the error.
3. In `shop/`, add `export const discount = 100` to `price.js`. What is the import line in `main.js` to use it together with `formatPrice`? (Answer: `import { formatPrice, discount } from './price.js'`.)

## Clean up

Delete `allcsvideos-web/node_modules` and `allcsvideos-web/dist` if you created them. In `shop-commonjs/` change the `type` back to `"commonjs"` if you want to repeat the experiment. Nothing else was created.

## Next

[M02-L05 · Async JavaScript and fetch](../m02-l05-async-javascript-and-fetch/): real projects do not keep their courses in a file. They ask a server. Next you learn how a program waits for a server, and how `fetch` brings the data back.
