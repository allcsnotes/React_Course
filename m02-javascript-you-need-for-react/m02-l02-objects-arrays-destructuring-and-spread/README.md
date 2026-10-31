# M02-L02 · Objects, Arrays, Destructuring and Spread

> Video: Module 2, Lesson 2. Watch it first, then follow along here.

## What you'll learn

- Objects: one thing described by named pieces (keys and values), read with a dot, changed with `=`
- Arrays: a numbered list that starts at zero, picked with square brackets, counted with `length`
- Destructuring: pulling pieces out of an object or array into names
- Spread (`...`): copying and combining objects and arrays
- Why `const banner = course` does not make a copy, and how spread fixes the sale-banner bug

## Before you start

- Node 24 (`node --version`). Lesson [M02-L01](../m02-l01-let-const-and-arrow-functions/) first: you need `const`, `let`, template strings and arrow functions.
- A terminal in this folder. For the last step you also need `npm install` (inside `preview-app/`).
- No Docker needed.
- Every file here is one step of the video. In the video the snippets share two file names, `course.js` (one object) and `courses.js` (a list of four); here each step has its own name so you can run them side by side.

## Files in this folder

| File | What it is |
|------|------------|
| `object-*.js` (6 files) | One course as an object: print, read, missing key, change and add, `const` error |
| `array-*.js` (6 files) | The list of four courses: index, `length`, last item, out of range, the undefined error |
| `destructure-*.js` (4 files) | Unpacking an object, an array and function parameters |
| `spread-*.js` (4 files) | Copy, sale price, wrong order, joining arrays |
| `shared-name-bug.js`, `spread-fixes-bug.js`, `shallow-copy-trap.js` | The banner mystery, its fix, and the one-level trap |
| `mistake-misspelled-key.js`, `mistake-destructure-undefined.js` | Two more mistakes |
| `preview-app/` | A small Vite project: a Card component, "Add a lesson" and "Likes" buttons |

## Follow along

### 1. The story: a sale banner

Asha wants a one-day sale banner for React for Beginners with the price set to 0 rupees. She makes a copy of the course for the banner and sets the copy's price to 0. The banner is right. But the catalog, where the original lives, says 0 rupees too. Nobody touched the original. By the end of this lesson you will know exactly why.

### 2. Objects: a paper form with labelled boxes

An **object** is one thing described by named pieces. The label is the **key**, what is written in the box is the **value**. Curly braces wrap the object; each line is a key, a colon, a value and a comma. `object-print.js`:

```js
const course = {
  id: 1,
  title: 'React for Beginners',
  teacher: 'Meera',
  lessons: 12,
  price: 499,
  free: false,
};
console.log(course);
```

```bash
node object-print.js
```

```text
{
  id: 1,
  title: 'React for Beginners',
  teacher: 'Meera',
  lessons: 12,
  price: 499,
  free: false
}
```

Read one piece: the object's name, a dot, the key. `course.title` points a finger at one box (`object-read-title.js` prints `React for Beginners`, without quotes, because the terminal shows the value, not the code).

Guess: what do `console.log(course.price);` and `console.log(course.teacher);` print (`object-read-price-teacher.js`)?

```bash
node object-read-price-teacher.js
```

```text
499
Meera
```

A box that does not exist (`console.log(course.rating);` in `object-missing-key.js`) does not crash. It prints `undefined`: nothing is stored under that name.

Write on the form with `=` (`object-change-and-add.js`):

```js
course.price = 399;
course.rating = 4.8;
console.log(course.price, course.rating);
```

```bash
node object-change-and-add.js
```

```text
399 4.8
```

One line changed a value and one added a new box. But wait: last lesson `const` gave an error when we changed it. Why did this work? Try the other kind of change, pointing the name at a brand new object (`object-const-error.js`, last line `course = { title: 'Python from Zero' };`):

```text
~/object-const-error.js:9
course = { title: 'Python from Zero' };
       ^

TypeError: Assignment to constant variable.
```

(`~` is your folder; a few stack lines are left out here and below.) So **`const` protects the name, not the contents.** Think of the name as a label stuck on the form: the label can never move to a different form, but you may write on the form itself. Keep that picture in mind: it explains the banner bug.

React uses this everywhere: every course card in the app is described by an object like this one.

### 3. Arrays: a shelf with numbered slots

An **array** is a numbered list. Each slot has a number called the **index**, and the first slot is **0**, not 1. Square brackets, items separated by commas. The four courses (the start of `array-first-course.js`):

```js
const courses = [
  { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: 'Meera', lessons: 20, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: 'Rahul', lessons: 25, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: 'Asha', lessons: 15, price: 0, free: true },
];
```

`courses[0]` takes out the first course (the whole form: `array-first-course.js` prints the same object as above). `courses[0].title` reads one piece (`array-first-title.js` prints `React for Beginners`). Square brackets pick the course, the dot picks the piece: "from courses, take the first one, then its title".

Guess: what do `courses[2].teacher` and `courses.length` print (`array-teacher-and-length.js`)?

```bash
node array-teacher-and-length.js
```

```text
Rahul
4
```

Index 2 is the third course, System Design. The length is 4 even though the last index is 3. So the last item always sits at `courses.length - 1` (`array-last-course.js` prints `DevOps Basics`). An index that is too big is `undefined` again (`array-out-of-range.js`).

Now the most common error in React. Ask `undefined` for something with a dot (`array-undefined-error.js`, `console.log(courses[10].title);`):

```text
~/array-undefined-error.js:7
console.log(courses[10].title);
                        ^

TypeError: Cannot read properties of undefined (reading 'title')
```

In plain words: you asked for the title of something that does not exist. Look at the thing just before the dot. It is `undefined`: the index may be too big, or a name misspelled.

Checkpoint: an object is a form with named boxes (dot to read, `=` to change). An array is a numbered list from zero (brackets to pick, `length` to count). A list of courses is an array of objects: brackets first, then a dot.

### 4. Destructuring: unpacking a parcel

`destructure-before.js` takes out three pieces the long way:

```js
const title = course.title;
const teacher = course.teacher;
const price = course.price;
console.log(title, teacher, price);
```

```text
React for Beginners Meera 499
```

The short way (`destructure-object.js`): curly braces on the left of `=`, with the keys you want. Read it as "from `course`, take out `title`, `teacher` and `price`". These braces are not an object; on the left side they mean "take these out".

```js
const { title, teacher, price } = course;
console.log(`${title} by ${teacher}: Rs ${price}`);
```

```bash
node destructure-object.js
```

```text
React for Beginners by Meera: Rs 499
```

Arrays unpack with square brackets, by position (`destructure-array.js`). Guess what `first.title` and `second.title` print:

```js
const [first, second] = courses;
console.log(first.title, second.title);
```

```text
React for Beginners Python from Zero
```

For arrays the position decides, so you can choose any names. For objects the names must match the keys. The third place: function parameters (`destructure-parameters.js`):

```js
const line = ({ title, price }) => `${title}: Rs ${price}`;
console.log(line(courses[0]));
console.log(line(courses[1]));
```

```text
React for Beginners: Rs 499
Python from Zero: Rs 0
```

**Where React uses this.** A component is a function that receives its inputs as one object and unpacks what it needs in the parentheses. This is `function Card({ title, teacher, lessons })` in `preview-app/src/App.jsx` (Module 3 teaches how the inputs get in). Second, the counter in the starter project: `const [count, setCount] = useState(0)`. `useState` gives back an array with two items, the current value and a function that changes it, and square brackets unpack both (Module 4).

### 5. Spread: a photocopier

Three dots copy every box onto a new sheet. `spread-copy.js`:

```js
const copy = { ...course };
console.log(copy.title, copy.price);
```

```text
React for Beginners 499
```

After the spread you can add or replace keys. `spread-sale.js`:

```js
const sale = { ...course, price: 0 };
console.log(sale.title, sale.price);
```

```text
React for Beginners 0
```

`sale` is a new object. The order matters, because later keys win. Guess: what does `spread-wrong-order.js` print, with `{ price: 0, ...course }`?

```text
499
```

The spread came last, so it put the old price back on top. The rule: write the spread first, then your changes.

Spread works on arrays too (`spread-arrays.js`):

```js
const next = { id: 5, title: 'Git Basics', teacher: 'Asha', lessons: 8, price: 0, free: true };
const more = [...courses, next];
const both = [...courses, ...more];
console.log(courses.length, more.length, both.length);
```

```text
4 5 9
```

`more` is all the old courses plus the new one at the end; `both` joins two lists into one. The original still has 4 items: spread never changes what it copies from.

**Where React uses this.** When data changes, React wants a new object, not the old one edited. `preview-app/src/App.jsx` has `setCourse({ ...course, lessons: 13 })`: copy the course, replace `lessons`. Run it:

```bash
cd preview-app
npm install
npm run dev
```

Open the address that Vite prints (port 5173 unless busy). The card says `by Meera · 12 lessons`. Click **Add a lesson** and it says `by Meera · 13 lessons`. Click **Likes: 0** and it becomes `Likes: 1`. Module 4 teaches this properly. Stop the server with `Ctrl+C` and go back with `cd ..`.

### 6. The mystery solved

Think of each object as a box in the computer's memory. A name like `course` is a sticky note stuck on the box. `const banner = course` does not make a new box: it sticks a second note on the same box. Two names, one object, like two people holding the link to one shared document. Guess: `shared-name-bug.js`

```js
const banner = course;
banner.price = 0;
console.log(course.price);
```

```bash
node shared-name-bug.js
```

```text
0
```

Through the `banner` note, Asha wrote on the one and only box. That is the bug. The fix is a real copy (`spread-fixes-bug.js`):

```js
const banner = { ...course, price: 0 };
console.log(banner.price, course.price);
```

```text
0 499
```

Two boxes, two prices. The catalog is safe. **The `=` sign never copies an object or an array: it only gives the same thing another name. To copy, use spread.** React decides whether something changed by asking "is this a new object?" If you edit the old object in place, React may not notice, so React code builds new objects with spread.

One more trap, with arrays. Spread copies **one level only**. `shallow-copy-trap.js`:

```js
const copy = [...courses];
copy[0].price = 1;
console.log(courses[0].price);
```

```text
1
```

`copy` is a new shelf, but the course cards on it are the very same cards, so the original changed. The fix is to copy at each level: a new list, and a new object for the card you change. Module 4 shows the exact pattern.

## Common mistakes

1. **A misspelled key** (`mistake-misspelled-key.js`). `courses[0].titel` gives `undefined` with no error at all. But ask that `undefined` for its length and you get the red error:

   ```text
   undefined
   ~/mistake-misspelled-key.js:8
   console.log(courses[0].titel.length);
                                ^

   TypeError: Cannot read properties of undefined (reading 'length')
   ```

2. **Unpacking something that does not exist** (`mistake-destructure-undefined.js`, `const { title } = courses[10];`):

   ```text
   TypeError: Cannot destructure property 'title' of 'courses[10]' as it is undefined.
   ```

   Same cause: the thing is `undefined`. Check the index and the spelling.
3. **Thinking `=` makes a copy.** When something changes that you did not touch, look for an `=` that should have been a spread.

Interview tip. If Rahul, an interviewer, asks "does `const` make an object unchangeable?": no. `const` stops the name from pointing somewhere else, but the contents can still change. And spread makes a shallow copy, one level deep.

## Try it yourself

1. Write an object for your favorite course and a list of three. Unpack the title, then make a `sale` copy with a lower price, and check that the original did not change.
2. What does `const [a, , c] = ['x', 'y', 'z']; console.log(a, c);` print?
3. What does `const { title: name } = { title: 'Git Basics' }; console.log(name);` print? (Hint: it renames while unpacking.)

Answers: 2 prints `x z` (the empty slot skips `'y'`). 3 prints `Git Basics`.

## Clean up

Delete `preview-app/node_modules` and `preview-app/dist` if you created them. Nothing else was created.

## Next

[M02-L03 · map, filter and Friends](../m02-l03-map-filter-and-friends/): now that you have lists of objects, you learn the tools that turn one list into another, which is how React makes a card for every course.
