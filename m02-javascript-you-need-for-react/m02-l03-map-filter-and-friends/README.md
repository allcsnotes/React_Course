# M02-L03 · map, filter and Friends

> Video: Module 2, Lesson 3. Watch it first, then follow along here.

## What you'll learn

- What a loop is, and why array methods save you the same three steps every time
- `map` (change every item), `filter` (keep some items), `find` (one item or `undefined`)
- `reduce` (many items become one value) and why it always needs a starting value
- `some` and `every` (true or false), and `sort` with its big surprise: it changes the original
- Chaining tools one after another, and where React uses `courses.map(...)`

## Before you start

- Node 24 (`node --version`). Lessons [M02-L01](../m02-l01-let-const-and-arrow-functions/) and [M02-L02](../m02-l02-objects-arrays-destructuring-and-spread/) first: you need arrow functions, objects and spread.
- A terminal in this folder. For the last step, `npm install` inside `react-list/`.
- No Docker needed.

## Files in this folder

| File | What it is |
|------|------------|
| `01-loop-print.js`, `02-loop-collect.js` | The slow way: a `for` loop |
| `03-map-title.js` to `05b-map-return.js` | `map`: titles, GST prices, labels, the curly-braces mistake and its fix |
| `06-filter-loop.js` to `08-filter-price.js` | `filter`: the loop first, then free courses, then price over 500 |
| `09a-find.js`, `09b-find-missing.js`, `10-find-error.js` | `find`, nothing found, and the classic error |
| `11-reduce-loop.js` to `14-reduce-nostart.js` | `reduce`: the loop, one line, prices, no starting value |
| `15-some-every.js` | `some` and `every` |
| `16-sort-mutate.js` to `18-sort-default.js` | `sort` changes the original; `toSorted`; spread; sort as text |
| `19-chain-free.js`, `20-chain-labels.js` | Chaining `filter` and `map` |
| `21-try.js` | A possible answer to "Try it yourself" |
| `react-list/` | A small Vite project: `courses.map(...)` turns four courses into four cards |
| `react-list/extras/App.free.jsx` | The same page with `courses.filter(c => c.free).map(...)` |

Every `.js` file starts with the same list of four courses, then adds the step. Each runs on its own with `node <file>`.

## Follow along

### 1. The catalog page and four questions

The allcsvideos catalog shows a card for every course. Behind it is the list from the last lesson: four objects, each with an `id`, `title`, `teacher`, `lessons`, `price` and a `free` flag. The page keeps asking questions about the list:

1. What are the titles of all courses?
2. Which courses are free?
3. How many lessons are there in total?
4. How do we show the courses from cheapest to most expensive?

Each is one line with an **array method**: a function that belongs to a list. There are seven tools to learn.

### 2. The slow way: a loop

A **loop** does the same thing for every item in a list, like a teacher taking attendance. `01-loop-print.js` ends with:

```js
for (const course of courses) {
  console.log(course.title)
}
```

Read it like English: for each `course` in `courses`, do what is inside the curly braces. On the first round `course` holds the first course, then the second, and so on.

```bash
node 01-loop-print.js
```

```text
React for Beginners
Python from Zero
System Design
DevOps Basics
```

Question one the slow way (`02-loop-collect.js`): make an empty list, loop, and `push` each title (add it at the end):

```js
const titles = []
for (const course of courses) {
  titles.push(course.title)
}
console.log(titles)
```

```text
[
  'React for Beginners',
  'Python from Zero',
  'System Design',
  'DevOps Basics'
]
```

Nearly every question about a list follows the same three steps (empty list, loop, push) and only one small piece changes. Array methods are that recipe, written once and named.

### 3. map: the factory belt

`map` goes through a list, turns every item into something new, and gives you a **new list with the same number of items**. The original is untouched. `03-map-title.js`:

```js
const titles = courses.map(c => c.title)
console.log(titles)
```

The small function `c => c.title` is a **callback**: a function you hand over so another function can call it for you. `map` calls it once per course; `c` is the course of this round and what comes after the arrow is what you want back. The output is the same four titles as the loop, in one line instead of five.

A callback can return anything. `04-map-gst.js` adds 18 percent GST to each price and builds labels with a template string:

```js
const withGst = courses.map(c => Math.round(c.price * 1.18))
console.log(withGst)
const labels = courses.map(c => `${c.title}: ${c.lessons} lessons`)
console.log(labels)
```

```bash
node 04-map-gst.js
```

```text
[ 589, 0, 1179, 0 ]
[
  'React for Beginners: 12 lessons',
  'Python from Zero: 20 lessons',
  'System Design: 25 lessons',
  'DevOps Basics: 15 lessons'
]
```

**The number one `map` mistake** (`05-map-braces.js`): curly braces around the title.

```js
const titles = courses.map(c => { c.title })
console.log(titles)
```

```bash
node 05-map-braces.js
```

```text
[ undefined, undefined, undefined, undefined ]
```

As soon as you add curly braces you are writing a full function body and must write `return` (you met this in Lesson 1). Two fixes: remove the braces, or keep them and write `return` (`05b-map-return.js`: `courses.map(c => { return c.title })` prints the four titles again).

### 4. filter: the bouncer

`filter` asks a yes or no question about every item and keeps only the items where the answer is yes. You get a new list, the same size or smaller. The slow way first (`06-filter-loop.js`) uses `if`: if the thing in the round brackets is true, run the lines inside the braces, otherwise skip them.

```bash
node 06-filter-loop.js
```

```text
2
```

Now with `filter` (`07-filter-free.js`). The callback must answer true or false; `c.free` already is:

```js
const free = courses.filter(c => c.free)
console.log(free.length)
console.log(free.map(c => c.title))
```

```bash
node 07-filter-free.js
```

```text
2
[ 'Python from Zero', 'DevOps Basics' ]
```

The question can be any comparison (`08-filter-price.js`): price greater than 500, then more than 100 lessons.

```js
const pricey = courses.filter(c => c.price > 500)
console.log(pricey.map(c => c.title))
const none = courses.filter(c => c.lessons > 100)
console.log(none)
```

```text
[ 'System Design' ]
[]
```

When nobody passes you get an **empty list**, not an error: `filter` always gives you a list. Remember the difference: `map` changes the items, `filter` chooses the items.

### 5. find: look for a friend in a crowd

`find` returns the **first** item that passes the test, then stops. You get one item, not a list (`09a-find.js`, with `===`, "is the same as", covered in Lesson 6):

```js
const course = courses.find(c => c.id === 3)
console.log(course.title)
```

```text
System Design
```

Guess: what does `find` give back when no course has the id 99 (`09b-find-missing.js`)?

```text
undefined
```

Not an empty list and not an error: `undefined`. And the classic trap (`10-find-error.js`): `find` found nothing, `missing` is `undefined`, and then we ask it for its title (`const missing = courses.find(c => c.id === 99)` then `console.log(missing.title)`):

```text
~/10-find-error.js:9
console.log(missing.title)
                    ^
TypeError: Cannot read properties of undefined (reading 'title')
```

The same error as in Lesson 2. When you see it, look for a `find` that found nothing, or data that has not arrived yet. The fix is to check the result before you use it (Lesson 6 shows the short way, `?.`). In React you will use `find` to look up one course from the id in the web address.

### 6. reduce: the cashier's running total

`reduce` goes through a list, carries one running value along, and gives you one final value. Question three, the slow way (`11-reduce-loop.js`): `let total = 0`, and on every round add the lessons.

```bash
node 11-reduce-loop.js
```

```text
72
```

The rounds: `0 + 12 = 12`, then `12 + 20 = 32`, then `32 + 25 = 57`, then `57 + 15 = 72`. `reduce` is that loop in one line (`12-reduce.js`):

```js
const total = courses.reduce((sum, c) => sum + c.lessons, 0)
console.log(total)
```

`reduce` takes two things separated by a comma. The second is the `0` at the end: where the running total starts. The first is a function with two inputs: `sum` is the running total so far and `c` is the course of this round. Whatever it returns becomes the new `sum` for the next round. Guess: at the start of the System Design round, `sum` is 32. The function returns 57, which is the sum for the last round.

```text
72
```

Add the price instead of the lessons (`13-reduce-price.js`, `courses.reduce((sum, c) => sum + c.price, 0)`): 499 + 0 + 999 + 0.

```text
1498
```

**The mistake everybody makes once** (`14-reduce-nostart.js`): forgetting the starting `0`.

```js
const bill = courses.reduce((sum, c) => sum + c.price)
console.log(bill)
```

```text
[object Object]09990
```

Without a starting value, `reduce` starts with the first course itself, which is an object, and adding a number to an object makes JavaScript glue everything together as text. For totals the starting value is `0`. In Module 10 you use this to add up an enrollment cart.

### 7. some and every

`some` asks "does at least one item pass?", `every` asks "do all pass?". Both return `true` or `false` (`15-some-every.js`):

```js
console.log(courses.some(c => c.free))
console.log(courses.every(c => c.free))
```

```text
true
false
```

`some` stops as soon as one course passes (Python from Zero is free). `every` stops as soon as one fails (React for Beginners is not free).

### 8. sort: the big surprise

`sort` takes a callback that compares two items, `a` and `b`. `a.price - b.price` is negative if `a` is cheaper (so `a` goes first), positive if `a` costs more (so `b` goes first), and zero if equal. `16-sort-mutate.js` prints the first course three times and asks if `sorted` and `courses` are the same thing. Guess what the third line prints:

```js
console.log(courses[0].title)
const sorted = courses.sort((a, b) => a.price - b.price)
console.log(sorted[0].title)
console.log(courses[0].title)
console.log(sorted === courses)
```

```bash
node 16-sort-mutate.js
```

```text
React for Beginners
Python from Zero
Python from Zero
true
```

The original list now starts with Python from Zero too. `sorted` is not a copy: it is a second sticky note on the same list (Lesson 2), and `sort` rearranged that one list in place. In React, quietly changing your original data causes bugs that are very hard to find (Module 4). **Never sort the original.**

Fix 1: `toSorted` sorts the same way but returns a new list (`17-sort-safe.js`). Fix 2: copy first with spread, `[...courses].sort(...)` (`17b-sort-spread.js`).

```bash
node 17-sort-safe.js
```

```text
Python from Zero
React for Beginners
false
```

The new list starts with the cheapest, the original still starts with React for Beginners, and the last line is `false`: two different lists. `17b-sort-spread.js` prints the same three lines.

One more trap: `sort` with no callback sorts everything as text, and as text `10` comes before `9`. So with numbers always pass the comparing callback (`18-sort-default.js`):

```js
console.log([10, 9, 1].sort())
console.log([10, 9, 1].sort((a, b) => a - b))
```

```text
[ 1, 10, 9 ]
[ 1, 9, 10 ]
```

### 9. Chaining

`filter` and `map` give you lists back, so you can attach one tool after another. `19-chain-free.js` reads like a recipe, top to bottom: take the courses, keep the free ones, then take their titles.

```js
const freeTitles = courses
  .filter(c => c.free)
  .map(c => c.title)
console.log(freeTitles)
```

```text
[ 'Python from Zero', 'DevOps Basics' ]
```

`20-chain-labels.js` keeps the courses that cost something, then builds a label from title and price:

```text
[ 'React for Beginners: Rs 499', 'System Design: Rs 999' ]
```

Filter first, map second, so `map` only works on the courses that are left.

### 10. Where React uses all this

Run the project in `react-list/`:

```bash
cd react-list
npm install
npm run dev
```

Open the address Vite prints. The page has the heading "All courses" and four cards. The key lines of `src/App.jsx`:

```jsx
{courses.map(c => (
  <CourseCard key={c.id} course={c} />
))}
```

A list of four courses became a list of four cards. Each card gets a `key`, a unique id, which you learn in Module 5. Now copy `extras/App.free.jsx` over `src/App.jsx` (it has `courses.filter(c => c.free).map(c => (` instead) and only the two free courses become cards: Python from Zero and DevOps Basics. This is how every search box, filter button and sort menu works: a list goes in, the tools change it, cards come out. Do not worry about the React part yet. Notice the shape.

## The seven tools side by side

| Tool | Gives back |
|------|------------|
| `map` | a new list, same size, every item changed |
| `filter` | a new list with only the items that pass |
| `find` | one item (the first that passes) or `undefined` |
| `reduce` | one single value; needs a starting value |
| `some`, `every` | `true` or `false` |
| `sort` | the same list rearranged (it changes the original); use `toSorted` or sort a copy |

Interview tip. If Rahul, an interviewer, asks "does `sort` change the original array?": yes. It sorts in place and returns that same array. To avoid it, use `toSorted` (capital S) or copy the array first with spread.

## Common mistakes

- Curly braces in a `map` callback without `return`: you get a list of `undefined`.
- Asking a `find` that found nothing for a property: `Cannot read properties of undefined`.
- `reduce` without a starting value: `[object Object]...` text instead of a number.
- `courses.sort(...)` changes `courses`. Use `toSorted`.
- `sort` of numbers without a callback sorts as text (`[1, 10, 9]`).

## Try it yourself

From the courses, get the titles of the courses with more than 15 lessons. Filter first, then map. (A possible answer is `21-try.js`; try before you look.)

## Clean up

Delete `react-list/node_modules` and `react-list/dist` if you created them. Nothing else was created.

## Next

[M02-L04 · Modules: import and export](../m02-l04-modules-import-and-export/): how to split your code into files and share it between them.
