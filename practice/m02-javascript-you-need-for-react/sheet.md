# Module 02 · Practice Sheet: 20 JavaScript-for-React Exercises

Write each exercise yourself before you open the answer. Every exercise is a small JavaScript file you can run in the terminal with `node`, and nothing here needs more than Module 2 of this course.

**How to work:**
- Use **Node 24** (check with `node --version`). Put all your files in one folder with a `package.json` that contains `{ "type": "module" }`, so `import` and `export` work (lesson 4).
- Put each exercise in its own file, `Ex01.js` to `Ex20.js`. Run it with **`node Ex01.js`**.
- The exercises use the allcsvideos platform and its cast: Asha, Lukas, Priya, Meera and Rahul. Money is written as **Rs**.
- They go from easy to harder, in the order the lessons teach them: **about three or four per lesson**. Some are **predict the output** (guess on paper first, then run), some are **fix the broken code** (read the error, then repair it), and some build a small program. Exercises 19 and 20 combine everything.
- Each answer has a hint, a full solution, and the **real output** from running it with Node 24. Open the hint first, and only then the solution.
- All 20 solutions are in the folder **`solutions/`** next to this sheet. Run them with `node ex07.js` from inside that folder. (The solutions are lowercase, `ex07.js`; yours can be `Ex07.js`.)
- Exercises 15 and 20 use `fetch`. They start the tiny local server in `solutions/server.js` themselves, so there is **no internet involved** and nothing to start by hand.

**The data.** From Exercise 4 on, paste this array at the top of your file whenever an exercise says "paste the courses array" (in Exercise 11 you move it into its own file):

```js
const courses = [
  { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: 'Meera', lessons: 20, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: 'Rahul', lessons: 25, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: 'Asha', lessons: 15, price: 0, free: true },
];
```

---

## M02 · L01 let, const and Arrow Functions

### 1 · Predict the output (values and variables)
**Do not run it yet.** Read `Ex01.js` below and write down, on paper, what each of the 11 `console.log` lines prints. Then run it and mark your wrong guesses. Pay special attention to the lines with quotes, and to the one with single quotes around `${...}`.

**Starter code:**

```js
const title = 'React for Beginners';
const lessons = 12;
const isFree = false;

console.log(title);
console.log(lessons + 8);
console.log('12' + '8');
console.log('price');

let price = 499;
console.log(price);
price = price - 100;
console.log(price);

console.log(`${title} has ${lessons} lessons`);
console.log('${title} has ${lessons} lessons');
console.log(`Two seats: Rs ${price * 2}`);
console.log(isFree);
```

(No expected output on purpose: guess first, then run and compare.)

### 2 · The course card, built from functions
Asha needs the text for a course card. In `Ex02.js`:

1. Make `const` variables `title`, `teacher`, `lessons` and `price` for React for Beginners (Meera, 12 lessons, Rs 499).
2. Write **arrow functions**: `finalPrice(price, discount)`, `twoSeats(price)`, `describe(title, lessons, price)` (returns a template string) and `greet()` (returns `Hello, Lukas!`).
3. Write one **normal function** with the word `function`: `seatsLeft(total, taken)`.
4. Print: the description for React for Beginners, the description for Python from Zero (20 lessons, Rs 0), the teacher line, the price after a Rs 100 discount, the price for two seats, the greeting.
5. Use a `let` called `seats` that starts at `seatsLeft(20, 0)`, then goes down by one when Priya enrols. Print it in a sentence.


**Expected output:**

```text
React for Beginners has 12 lessons and costs Rs 499
Python from Zero has 20 lessons and costs Rs 0
Teacher: Meera
399
998
Hello, Lukas!
Seats left after Priya enrols: 19
```

### 3 · Fix the four broken files
Four tiny files, four different problems. For each one, **read what node says first**, find the rule that was broken, and fix it. Put the four fixed versions together in `Ex03.js`.

```js
// file a
const teacher = 'Meera';
teacher = 'Rahul';
console.log(teacher);
```
```js
// file b
const total = (a, b) => {
  a + b;
};
console.log(total(2, 3));
```
```js
// file c
const price = 499;
console.log('Price: Rs ${price}');
```
```js
// file d
console.log(seats);
let seats = 20;
```

What node says when you run each file (last line only):

```text
a: TypeError: Assignment to constant variable.
b: undefined      (no error at all, just a wrong result)
c: Price: Rs ${price}     (no error either)
d: ReferenceError: Cannot access 'seats' before initialization
```


**Expected output of your fixed `Ex03.js`:**

```text
Rahul
5
Price: Rs 499
20
```

## M02 · L02 Objects, Arrays, Destructuring and Spread

### 4 · Predict the output (objects and arrays)
**Do not run it first.** Here is the `courses` array and the first course as `course`. Write down what the nine `console.log` lines print. Then run it and compare. Finally remove the two slashes in front of the last line, run again, and read the error.

**Starter code:**

```js
// paste the courses array from the top of this sheet here
const course = courses[0];

console.log(course.title);
console.log(course.rating);

course.price = 399;
course.rating = 4.8;
console.log(course.price, course.rating);

console.log(courses[2].teacher);
console.log(courses.length);
console.log(courses[courses.length - 1].title);
console.log(courses[10]);
console.log(courses[1].title, courses[1].free);

// console.log(courses[10].title);
```

(No expected output on purpose: guess first, then run and compare.)

### 5 · Unpacking with destructuring
In `Ex05.js` (with the `courses` array pasted at the top and `const course = courses[0];`):

1. Use **object destructuring** to take `title`, `teacher` and `price` out of `course` in one line, then print `React for Beginners by Meera, Rs 499`.
2. Use **array destructuring** to take the first two courses out of `courses` as `first` and `second`, and print both titles.
3. Write an arrow function `line` that unpacks `title` and `price` **inside its parentheses** and returns `React for Beginners: Rs 499`. Call it for the first two courses.
4. Here is a pair like the one React's `useState` gives you: `const pair = [0, (n) => n + 1];`. Unpack it into `likes` and `addLike`, print `likes`, then print `addLike(likes)`.

**Starter code:**

```js
// paste the courses array from the top of this sheet here
const course = courses[0];

// 1) objects

// 2) arrays

// 3) function parameters
const line = 

// 4) a pair
const pair = [0, (n) => n + 1];
```


**Expected output:**

```text
React for Beginners by Meera, Rs 499
React for Beginners
Python from Zero
React for Beginners: Rs 499
Python from Zero: Rs 0
0
1
```

### 6 · Spread, and the banner bug
Asha made a sale banner by writing `const banner = course; banner.price = 0;` and now the catalog says Rs 0 as well. In `Ex06.js`:

1. **Reproduce the bug.** Make an object `original` (React for Beginners, Rs 499), `const alias = original;`, set `alias.price = 0`, and print both prices.
2. **Fix it** with spread: a new object `banner` that copies `course` but with `price: 0`. Print both prices.
3. **Order matters.** Make `good = { ...course, price: 1 }` and `wrong = { price: 1, ...course }`. Print both prices.
4. **Spread with arrays.** With a list of four items, make `more` (the four plus one new item) and `both` (the four plus a list of two). Print the three lengths.
5. **One level only.** `const copy = [...courses];` then set `copy[0].id = 99` and print `courses[0].id`.


**Expected output:**

```text
Alias price: 0
Original price: 0
Banner price: 0
Course price: 499
Spread first: 1
Spread last: 499
4 5 6
99
```

## M02 · L03 map, filter and Friends

### 7 · From one list to another with map
In `Ex07.js` (with the `courses` array pasted at the top):

1. The slow way: make an empty list `titles`, use a **`for (const course of courses)`** loop and `push` each title into it. Print it.
2. The same with **`map`**.
3. Use `map` to get the price **with 18 percent GST**, rounded: `Math.round(c.price * 1.18)`.
4. Use `map` and a template string to get labels like `React for Beginners (12 lessons)`.
5. The classic mistake: write a `map` callback with curly braces but **no `return`**. Print the result and see what comes back.
6. Print `courses.length` and the first title to prove that `map` did not change the original.

**Starter code:**

```js
// paste the courses array from the top of this sheet here

const titles = [];
// for ... of ... push ...

```


**Expected output:**

```text
[
  'React for Beginners',
  'Python from Zero',
  'System Design',
  'DevOps Basics'
]
[
  'React for Beginners',
  'Python from Zero',
  'System Design',
  'DevOps Basics'
]
[ 589, 0, 1179, 0 ]
[
  'React for Beginners (12 lessons)',
  'Python from Zero (20 lessons)',
  'System Design (25 lessons)',
  'DevOps Basics (15 lessons)'
]
[ undefined, undefined, undefined, undefined ]
4 React for Beginners
```

### 8 · filter, find, some and every
In `Ex08.js` (with the `courses` array pasted at the top):

1. `filter` the free courses. Print how many there are and their titles.
2. `filter` the courses with a price greater than 500. Print the titles.
3. `filter` the courses with more than 100 lessons. Print the result (is it an error?).
4. `find` the course with id 3 and print its title.
5. `find` the course with id 99 and print what you get back.
6. Print `some` (is any course free?) and `every` (are all courses free? do all have more than 10 lessons?).
7. Remove the slashes in front of the last line to cause the classic error, and read it.

**Starter code:**

```js
// paste the courses array from the top of this sheet here

const free = courses.filter(

```


**Expected output:**

```text
2 [ 'Python from Zero', 'DevOps Basics' ]
[ 'System Design' ]
[]
System Design
undefined
true
false
true
```

### 9 · One value from many with reduce
In `Ex09.js` (with the `courses` array pasted at the top):

1. Use `reduce` to add up all the lessons. Print `Total lessons: 72`.
2. Use `reduce` to add up all the prices and print the bill (`Bill for all four: Rs 1498`).
3. **Chain**: `filter` the free courses first, then `reduce` their lessons.
4. Make a `reduce` callback that prints `sum is ..., adding ...` on every round, so you can watch the running total.
5. The mistake everybody makes once: do the price sum **without the starting value**. What do you get?

**Starter code:**

```js
// paste the courses array from the top of this sheet here

const totalLessons = courses.reduce(

```


**Expected output:**

```text
Total lessons: 72
Bill for all four: Rs 1498
Lessons in free courses: 35
sum is 0, adding 12
sum is 12, adding 20
sum is 32, adding 25
sum is 57, adding 15
[object Object]09990
```

### 10 · Sorting without breaking the original, and chaining
In `Ex10.js` (with the `courses` array pasted at the top):

1. Use **`toSorted`** to list the titles from the cheapest to the most expensive. Print them, then print the first title of `courses` to prove the original is untouched.
2. Sort by lessons, **most lessons first**, and print `title lessons` for each.
3. **The surprise.** Make a copy `pretend = [...courses]`, call `pretend.sort((a, b) => a.price - b.price)`, and save the result in `sorted`. Print `sorted === pretend`, then the first title of `pretend` and of `courses`.
4. `[1, 10, 9].sort()` against `[1, 10, 9].sort((a, b) => a - b)`: print both.
5. **Chain**: the titles of the courses with more than 15 lessons (filter, then map).
6. **Chain**: the title of the cheapest **paid** course (filter, toSorted, then take the first).

**Starter code:**

```js
// paste the courses array from the top of this sheet here

const cheapestFirst = courses.toSorted(

```


**Expected output:**

```text
[
  'Python from Zero',
  'DevOps Basics',
  'React for Beginners',
  'System Design'
]
Original still starts with: React for Beginners
[
  'System Design 25',
  'Python from Zero 20',
  'DevOps Basics 15',
  'React for Beginners 12'
]
true
Python from Zero
React for Beginners
[ 1, 10, 9 ]
[ 1, 9, 10 ]
[ 'Python from Zero', 'System Design' ]
React for Beginners
```

## M02 · L04 Modules: import and export

### 11 · Split the code into modules
Build a small folder (with `package.json` containing `{ "type": "module" }`) with three files:

1. **`courses.js`**: the `courses` array, with `export default courses;` at the end.
2. **`helpers/price.js`**: a private `const symbol = 'Rs';` (no export) and three **named exports**: `formatPrice(price)` (returns `Rs 499`), `withGst(price)` (the price plus 18 percent, rounded) and `totalPrice(list)` (adds up the prices with `reduce`).
3. **`Ex11.js`**: import everything and print the first title, the first price formatted, the first price with GST formatted, and the total of all prices formatted. Import `totalPrice` under another name with **`as`** (`sumOfPrices`). Finally import the default list a second time under the name `allCourses` and print its length.

All three files are in the `solutions` folder, ready to run.

**Files you need** (already in the `solutions` folder): `courses.js`, `helpers/price.js`.


**Expected output:**

```text
React for Beginners
Rs 499
Rs 589
Rs 1498
4
```

### 12 · Read the import errors and fix them
Five small files in the `broken` folder each have **one** import problem. Run each, read the first line of the error, and decide: is the path wrong, is the name misspelled, are braces missing or extra, or was the name never imported? Then write `Ex12.js` with the correct imports of `courses` and `formatPrice`, and print the title and formatted price of the third course.

```js
// broken/b1.js
import { formatPrice } from '../helpers/prices.js';
// broken/b2.js
import { formatPrise } from '../helpers/price.js';
// broken/b3.js
import { courses } from '../courses.js';
// broken/b4.js
import formatPrice from '../helpers/price.js';
// broken/b5.js  (imports formatPrice correctly, then does this)
console.log(symbol);
```

What node says (shortened, `…/solutions` stands for your folder):

```text
b1: Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/solutions/helpers/prices.js' imported from …/solutions/broken/b1.js
b2: SyntaxError: The requested module '../helpers/price.js' does not provide an export named 'formatPrise'
b3: SyntaxError: The requested module '../courses.js' does not provide an export named 'courses'
b4: SyntaxError: The requested module '../helpers/price.js' does not provide an export named 'default'
b5: ReferenceError: symbol is not defined
```


**Expected output of your fixed `Ex12.js`:**

```text
System Design
Rs 999
```

## M02 · L05 Async JavaScript and fetch

### 13 · Who goes first? Waiting code runs last
**Part 1, predict.** Read `Ex13.js` below and write down in what order the lines appear. Note the second timer waits **zero** milliseconds. Then run it.

**Part 2, callbacks.** `orderFood(dish, callback)` prints `cooking ...`, waits 300 ms with `setTimeout`, then calls the callback with a message. Order soup, and **inside its callback** order pizza. See how the code staircases to the right.

**Starter code:**

```js
console.log('1: take the order');

setTimeout(() => {
  console.log('2: food is ready');
}, 500);

setTimeout(() => {
  console.log('2b: even zero waits its turn');
}, 0);

console.log('3: greet the next customer');
```

(No expected output on purpose: guess first, then run and compare.)

### 14 · The kitchen buzzer: promises, then/catch, async/await
A kitchen function that gives back a promise is already written for you:

```js
const kitchen = (dish, isOpen) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isOpen) resolve(dish);
      else reject(new Error('the kitchen is closed'));
    }, 300);
  });
```

In `Ex14.js`:

1. Order a pizza, keep it in `buzzer`, and print `buzzer` straight away (what does it say?).
2. Use **`.then`** to print `then: eating pizza` when the food arrives.
3. Order a cake from a closed kitchen and use **`.catch`** to print `catch: Problem, the kitchen is closed`.
4. Write `const dinner = async (isOpen) => { ... }` that prints `ordering...`, **awaits** the soup, prints `eating soup`, and has a **try/catch** that prints `Problem: ...`.
5. Call `dinner(true)`, then on the next line print `meanwhile, I read the menu`, then `await` the dinner and call `dinner(false)`. (Put this in an `async` function called `main` and start it with `setTimeout(main, 1000)`.) In what order do the messages appear?


**Expected output:**

```text
Promise { <pending> }
then: eating pizza
catch: Problem, the kitchen is closed
--- async/await ---
ordering...
meanwhile, I read the menu
eating soup
ordering...
Problem: the kitchen is closed
```

### 15 · JSON and fetch from a local server
The folder has a tiny server (`server.js`) that plays the allcsvideos API on your own computer, so there is no internet. Your file starts it with `const { server, url } = await startServer();` inside an `async` function, and stops it at the end with `await stopServer(server);` (already written in the starter).

In `Ex15.js`:

1. **JSON is text.** `JSON.stringify` an object into `text`, print it, and print `typeof text`. Then `JSON.parse` it back and print the title and `typeof`.
2. **fetch.** Fetch `${url}/api/courses`, print `res.status` and `res.ok`, then `await res.json()` and print how many courses came back, and their titles.
3. **A typo in the address**: fetch `${url}/api/course` (no `s`). Print the status, `ok`, and the body. Did `fetch` fail?
4. **Forgetting `await`** on `res.json()`: print the result and its `.length`.

**Starter code:**

```js
import { startServer, stopServer } from './server.js';

const main = async () => {
  const { server, url } = await startServer();

  // your fetch code here

  await stopServer(server);
};

main();
```

**Files you need** (already in the `solutions` folder): `server.js`.


**Expected output:**

```text
{"id":1,"title":"React for Beginners","price":499,"free":false}
string
React for Beginners object
200 true
4 courses:
[
  'React for Beginners',
  'Python from Zero',
  'System Design',
  'DevOps Basics'
]
404 false
{ detail: 'Not Found' }
Promise { <pending> }
undefined
```

## M02 · L06 Short-hand Logic

### 16 · Comparisons and if / else if / else
**Part 1, predict.** With `const price = 499;` write down what these nine lines print: `price === 499`, `price !== 0`, `price > 500`, `price < 500`, `price >= 499`, `price <= 100`, `1 === '1'`, `1 == '1'`, `0 == ''`. Then run them.

**Part 2.** Write `priceLabel(price)` (an arrow function with an `if / else if / else` inside): `0` gives `Free`, below 500 gives `Budget`, anything else `Premium`. Print the label for 499, 0, 999 and exactly 500.

**Starter code:**

```js
const price = 499;
console.log(price === 499);
// ... and so on

const priceLabel = (price) => {
  // if / else if / else
};
```

(No expected output on purpose: guess first, then run and compare.)

### 17 · Truthy, falsy, && and the lonely zero
**Part 1, predict.** `Boolean(value)` tells you whether JavaScript counts a value as yes or no. First line: `Boolean(0), Boolean(''), Boolean(null), Boolean(undefined), Boolean(NaN), Boolean(false)`. Second line: `Boolean('0'), Boolean('false'), Boolean([]), Boolean({}), Boolean(12)`. Write down both lines, then run.

**Part 2.** `const isFree = true; const lessons = 20;` Print `isFree && lessons > 10`, `isFree && lessons > 30`, `isFree || lessons > 30` and `!isFree`.

**Part 3, the zero bug.** `const count = 0;` Print `isFree && 'FREE'`, `!isFree && 'FREE'`, `count && 'badge'` and `count > 0 && 'badge'`. Do the last two again for `joined = 2`. Which line would draw a stray `0` in a React page?

**Part 4, three mistakes.** (a) `if (list)` with `const list = []`: does it run? How do you ask properly? (b) `let cost = 499; if (cost = 0) {...} else {...}`: what happens, and what is `cost` afterwards?

**Starter code:**

```js
console.log(Boolean(0), Boolean(''), Boolean(null), Boolean(undefined), Boolean(NaN), Boolean(false));
console.log(Boolean('0'), Boolean('false'), Boolean([]), Boolean({}), Boolean(12));

const isFree = true;
const lessons = 20;
// && || !

```

(No expected output on purpose: guess first, then run and compare.)

### 18 · The ternary, ?? and ?.
Use these two courses:

```js
const free = { id: 2, title: 'Python from Zero', teacher: { name: 'Meera' }, price: 0 };
const draft = { id: 5, title: 'Git Basics' };
```

1. **Ternary.** Write `label(c)`: `Free` when the price is `0`, otherwise `Rs 499`-style text. Print it for `free` and for `{ price: 499 }`.
2. **`||` against `??`.** Print `free.price || 'price soon'`, `free.price ?? 'price soon'`, and the same two for `draft`.
3. **`?.`** Print `free.teacher.name`, `draft.teacher?.name`, and `draft.teacher?.name ?? 'to be announced'`.
4. **One card line.** Write `cardLine(c)` that returns `Title - teacher - price`, using the default text for a missing teacher (`to be announced`) and `price soon` for a missing price. Print it for both courses.
5. What happens if you mix `??` and `||` in one expression without brackets? Try `draft.price ?? 0 || 'price soon'` in a scratch file, read the error, then fix it with brackets.

**Starter code:**

```js
const free = { id: 2, title: 'Python from Zero', teacher: { name: 'Meera' }, price: 0 };
const draft = { id: 5, title: 'Git Basics' };

const label = (c) => 

```


**Expected output:**

```text
Free
Rs 499
price soon
0
price soon
price soon
Meera
undefined
to be announced
Python from Zero - Meera - Free
Git Basics - to be announced - price soon
price soon
```

## M02 · Combine everything

### 19 · Combine everything: the catalog report
Use the shared files (`courses.js`, `helpers/price.js`) with `import`. In `Ex19.js`, add this list of who enrolled in what (Asha asked for a course that does not exist):

```js
const enrollments = [
  { student: 'Lukas', courseId: 1 },
  { student: 'Priya', courseId: 4 },
  { student: 'Lukas', courseId: 3 },
  { student: 'Asha', courseId: 99 },
  { student: 'Priya', courseId: 2 },
];
```

Print four sections:

1. **CATALOG**: a **sale copy** of the list where every paid course is 20 percent cheaper (`map` + spread + ternary, original untouched). Show it most expensive first with `toSorted`, one line per course using **destructuring** in a `for...of`, and show `Free` or the formatted price with GST.
2. **ENROLLMENTS**: for each enrollment, `find` the course and print `Student: Title`, or `course not found` (use `?.` and `??`).
3. **BILLS**: for each student, `filter` their enrollments, `map` them to courses, and `reduce` to a total. Print `nothing to pay` when it is 0.
4. A **summary object** (number of courses, number free, total lessons, `some` free, `every` free), then destructure two values out of it into one sentence.

**Starter code:**

```js
import courses from './courses.js';
import { formatPrice, withGst } from './helpers/price.js';

const enrollments = [ /* the list above */ ];

```

**Files you need** (already in the `solutions` folder): `courses.js`, `helpers/price.js`.


**Expected output:**

```text
CATALOG
  System Design by Rahul, 25 lessons, Rs 799 (with GST Rs 943)
  React for Beginners by Meera, 12 lessons, Rs 399 (with GST Rs 471)
  Python from Zero by Meera, 20 lessons, Free
  DevOps Basics by Asha, 15 lessons, Free
Original price of the first course: Rs 499
ENROLLMENTS
  Lukas: React for Beginners
  Priya: DevOps Basics
  Lukas: System Design
  Asha: course not found
  Priya: Python from Zero
BILLS
  Lukas: Rs 1498
  Priya: nothing to pay
  Asha: nothing to pay
{ courses: 4, free: 2, lessons: 72, anyFree: true, allFree: false }
2 free courses, 72 lessons in total
```

### 20 · Combine everything: an async loader with three endings
Use the tiny server again. It has a second endpoint, `/api/catalog`, where `teacher` is an object and the last course (Git Basics) is a **draft** with no teacher and no price. In `Ex20.js`:

1. Write `loadJson(url)`: an `async` function with `try/catch` that fetches, throws `new Error(`the server said ${res.status}`)` when `!res.ok`, and otherwise returns `await res.json()`. On any problem it prints `Could not load: ...` and returns an empty list.
2. Write `cardLine({ title, teacher, price })` that returns `Title | teacher | price text`: `teacher to be announced` when the teacher is missing, `price soon` when the price is missing, `Free` when it is 0, `Rs 499`-style otherwise. Keep each ternary simple (use a small helper, no nested ternary).
3. In `main`: start the server, print `Loading...`, start `loadJson` (**without** awaiting yet), print `(the page is not frozen)`, then await the list.
4. Print one `cardLine` per course (a `for...of` loop). Then print how many courses, how many are paid (use `?? 0` for the missing price), and the bill. Print the cheapest paid course with `toSorted`, and prove the catalog was not reordered.
5. **Three endings**: load `${url}/api/catalogue` (typo, a 404) and print the length of what you get back. Then stop the server and load the good address again. Print the length of that too.

**Starter code:**

```js
import { startServer, stopServer } from './server.js';

const loadJson = async (url) => {
  // try / catch, res.ok, res.json()
};

const main = async () => {
  const { server, url } = await startServer();
  // ...
  await stopServer(server);
};

main();
```

**Files you need** (already in the `solutions` folder): `server.js`.


**Expected output:**

```text
Loading...
(the page is not frozen)
  React for Beginners | Meera | Rs 499
  Python from Zero | Meera | Free
  System Design | Rahul | Rs 999
  DevOps Basics | Asha | Free
  Git Basics | teacher to be announced | price soon
5 courses, 2 paid, bill Rs 1498
Cheapest paid: React for Beginners
First in catalog still: React for Beginners
Could not load: the server said 404
After the typo, the list has 0 items
Could not load: fetch failed
After the server stopped, the list has 0 items
```

---

# Hints, solutions and real output

Every output below was produced by running the solution file with **Node v24.16.0**. Work from the top, and open one answer at a time.


## M02 · L01 let, const and Arrow Functions

<details>
<summary><b>1 · Predict the output (values and variables)</b></summary>

**Hint.** Numbers add up, text glues. `'12' + '8'` has quotes, so it is text. A variable is a named box: `price = price - 100` first works out the right side, then puts the result back. Only **backticks** understand `${...}`; with normal quotes the dollar sign and braces are printed as they are.

Line 2 is a number sum (12 + 8 = 20). Line 3 glues two pieces of text (`128`). `'price'` in quotes is the word, `price` without quotes is the box. After `price = price - 100` the box holds 399, so `price * 2` is 798. The single-quoted line shows the characters `${title}` exactly as typed.

**Where React uses this:** every `className={`btn ${size}`}` in React uses a template string, and `let` is the reason a counter can change while a `const` title cannot.

`solutions/ex01.js`, run with `node ex01.js`:

```js
// Exercise 01 - Predict the output
const title = 'React for Beginners';
const lessons = 12;
const isFree = false;

console.log(title);
console.log(lessons + 8);
console.log('12' + '8');
console.log('price');

let price = 499;
console.log(price);
price = price - 100;
console.log(price);

console.log(`${title} has ${lessons} lessons`);
console.log('${title} has ${lessons} lessons');
console.log(`Two seats: Rs ${price * 2}`);
console.log(isFree);
```

Output (Node 24):

```text
React for Beginners
20
128
price
499
399
React for Beginners has 12 lessons
${title} has ${lessons} lessons
Two seats: Rs 798
false
```

</details>

<details>
<summary><b>2 · The course card, built from functions</b></summary>

**Hint.** `const f = (a, b) => a + b;` returns automatically. If you use curly braces `{ }`, you must write `return` yourself. The template string is `` `${title} has ${lessons} lessons and costs Rs ${price}` `` (backticks).

The one-line arrows have no braces, so their value is returned automatically. `seatsLeft` uses the older `function` form, so it needs `return`. `seats` is `let` because it changes; everything else never changes, so it is `const`.

**Where React uses this:** a React component is just a function, often an arrow function: `const Card = ({ title }) => <h2>{title}</h2>`. Lesson 4 of module 1 showed one.

`solutions/ex02.js`, run with `node ex02.js`:

```js
// Exercise 02 - The course card, built from functions
const title = 'React for Beginners';
const teacher = 'Meera';
const lessons = 12;
const price = 499;

const finalPrice = (price, discount) => price - discount;
const twoSeats = (price) => price * 2;
const describe = (title, lessons, price) =>
  `${title} has ${lessons} lessons and costs Rs ${price}`;
const greet = () => 'Hello, Lukas!';

function seatsLeft(total, taken) {
  return total - taken;
}

console.log(describe(title, lessons, price));
console.log(describe('Python from Zero', 20, 0));
console.log(`Teacher: ${teacher}`);
console.log(finalPrice(price, 100));
console.log(twoSeats(price));
console.log(greet());

let seats = seatsLeft(20, 0);
seats = seats - 1;
console.log(`Seats left after Priya enrols: ${seats}`);
```

Output (Node 24):

```text
React for Beginners has 12 lessons and costs Rs 499
Python from Zero has 20 lessons and costs Rs 0
Teacher: Meera
399
998
Hello, Lukas!
Seats left after Priya enrols: 19
```

</details>

<details>
<summary><b>3 · Fix the four broken files</b></summary>

**Hint.** **a)** The teacher really does change, so which word should you use instead of `const`? **b)** Braces mean you write `return` yourself. **c)** Which quote characters understand `${...}`? **d)** The variable has to exist on an **earlier** line.

a) `const` is a sealed lid; `let` can change. b) Without `return` a function with braces gives back `undefined`. c) Only backticks fill the holes. d) JavaScript runs top to bottom, so the box must be made before it is used. Always read the first line of the error and the line number above it.

**Where React uses this:** the same four mistakes show up in React projects all the time, and Vite's red error overlay shows the same messages you just read.

`solutions/ex03.js`, run with `node ex03.js`:

```js
// Exercise 03 - Fixed versions of the four broken files

// a) const cannot be reassigned. The teacher does change, so use let.
let teacher = 'Meera';
teacher = 'Rahul';
console.log(teacher);

// b) braces mean you must write return
const total = (a, b) => {
  return a + b;
};
console.log(total(2, 3));

// c) only backticks understand ${...}
const price = 499;
console.log(`Price: Rs ${price}`);

// d) create the variable on an earlier line, before you use it
let seats = 20;
console.log(seats);
```

Output (Node 24):

```text
Rahul
5
Price: Rs 499
20
```

The four broken files, as node really reported them (`…` hides the folder name):

```text
# a
TypeError: Assignment to constant variable.

# b
undefined

# c
Price: Rs ${price}

# d
ReferenceError: Cannot access 'seats' before initialization
```

</details>

## M02 · L02 Objects, Arrays, Destructuring and Spread

<details>
<summary><b>4 · Predict the output (objects and arrays)</b></summary>

**Hint.** Arrays count from **zero**. `courses.length` is the number of items, so the last one is at `length - 1`. A key that is not on the object gives `undefined` (no crash), but asking `undefined` for something with a dot **does** crash. Note that `course` and `courses[0]` are the same object, so changing the price is visible through both names.

`courses[2]` is System Design, so `.teacher` is Rahul. `courses[10]` does not exist, so it is `undefined`. `course.rating` was missing at first (`undefined`) and was added by the assignment. The final line fails with `TypeError: Cannot read properties of undefined (reading 'title')`: look at what is just before the dot, it is `undefined`.

**Where React uses this:** a list of cards starts as an array of objects like this, and `Cannot read properties of undefined` is the most common error you will see in React.

`solutions/ex04.js`, run with `node ex04.js`:

```js
// Exercise 04 - Predict the output (objects and arrays)
const courses = [
  { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: 'Meera', lessons: 20, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: 'Rahul', lessons: 25, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: 'Asha', lessons: 15, price: 0, free: true },
];
const course = courses[0];

console.log(course.title);
console.log(course.rating);

course.price = 399;
course.rating = 4.8;
console.log(course.price, course.rating);

console.log(courses[2].teacher);
console.log(courses.length);
console.log(courses[courses.length - 1].title);
console.log(courses[10]);
console.log(courses[1].title, courses[1].free);

// Now remove the two slashes in front of the next line, run again, and read the error.
// console.log(courses[10].title);
```

Output (Node 24):

```text
React for Beginners
undefined
399 4.8
Rahul
4
DevOps Basics
undefined
Python from Zero true
```

And after removing the slashes from the last line:

```text
TypeError: Cannot read properties of undefined (reading 'title')
```

</details>

<details>
<summary><b>5 · Unpacking with destructuring</b></summary>

**Hint.** For objects: `const { title, teacher } = course;` (curly braces, the names must match the keys). For arrays: `const [a, b] = list;` (square brackets, the **position** decides, so any names work). For parameters: `({ title, price }) => ...`.

Curly braces on the left of `=` mean "take these out", not "make an object". Arrays are unpacked by position. The last part is exactly what `const [count, setCount] = useState(0)` does: `useState` returns an array with the current value and a function.

**Where React uses this:** `const [count, setCount] = useState(0)` and `function Card({ title, teacher })` both use destructuring, in almost every component.

`solutions/ex05.js`, run with `node ex05.js`:

```js
// Exercise 05 - Unpacking with destructuring
const courses = [
  { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: 'Meera', lessons: 20, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: 'Rahul', lessons: 25, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: 'Asha', lessons: 15, price: 0, free: true },
];
const course = courses[0];

// 1) objects: curly braces, the names must match the keys
const { title, teacher, price } = course;
console.log(`${title} by ${teacher}, Rs ${price}`);

// 2) arrays: square brackets, the position decides
const [first, second] = courses;
console.log(first.title);
console.log(second.title);

// 3) function parameters
const line = ({ title, price }) => `${title}: Rs ${price}`;
console.log(line(courses[0]));
console.log(line(courses[1]));

// 4) a pair like the one useState gives you: [value, function]
const pair = [0, (n) => n + 1];
const [likes, addLike] = pair;
console.log(likes);
console.log(addLike(likes));
```

Output (Node 24):

```text
React for Beginners by Meera, Rs 499
React for Beginners
Python from Zero
React for Beginners: Rs 499
Python from Zero: Rs 0
0
1
```

</details>

<details>
<summary><b>6 · Spread, and the banner bug</b></summary>

**Hint.** `=` never copies, it only sticks a second name on the same object. `{ ...course, price: 0 }` builds a new object: copy everything first, then write your changes (later keys win). `[...list, item]` makes a new list. Spread is shallow: the objects *inside* the new list are still the same objects.

In part 1 two names point to one object, so both prices are 0. In part 2 the spread builds a second object, so the course stays at 499. In part 3 the spread came last, so it put 499 back on top. In part 5 the new list holds the *same* course objects, so changing one through `copy` changes `courses` too (the id becomes 99).

**Where React uses this:** when state changes, React wants a **new** object, so you write `setCourse({ ...course, lessons: 13 })` instead of editing the old one.

`solutions/ex06.js`, run with `node ex06.js`:

```js
// Exercise 06 - Spread, and the banner bug
// Part 1: the bug. The equals sign gives the SAME object a second name.
const original = { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false };
const alias = original;
alias.price = 0;
console.log('Alias price:', alias.price);
console.log('Original price:', original.price);

// Part 2: the fix. Spread makes a real copy.
const course = { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false };
const banner = { ...course, price: 0 };
console.log('Banner price:', banner.price);
console.log('Course price:', course.price);

// Part 3: order matters. Later keys win.
const good = { ...course, price: 1 };
const wrong = { price: 1, ...course };
console.log('Spread first:', good.price);
console.log('Spread last:', wrong.price);

// Part 4: spread with arrays
const courses = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
const next = { id: 5 };
const more = [...courses, next];
const extra = [{ id: 6 }, { id: 7 }];
const both = [...courses, ...extra];
console.log(courses.length, more.length, both.length);

// Part 5: spread copies ONE level only
const copy = [...courses];
copy[0].id = 99;
console.log(courses[0].id);
```

Output (Node 24):

```text
Alias price: 0
Original price: 0
Banner price: 0
Course price: 499
Spread first: 1
Spread last: 499
4 5 6
99
```

</details>

## M02 · L03 map, filter and Friends

<details>
<summary><b>7 · From one list to another with map</b></summary>

**Hint.** `courses.map((c) => c.title)` runs the small function once for every course and collects the answers in a **new** list of the same size. If you add `{ }` after the arrow you must also write `return`.

Four in, four out: `map` never changes the size of the list or the original. Rs 499 times 1.18 is 588.82, which rounds to 589, and Rs 999 gives 1179. The broken callback gives back four `undefined` because nothing was returned.

**Where React uses this:** `courses.map((c) => <CourseCard key={c.id} title={c.title} />)` turns a list of data into a list of cards. This is the line you will write most in React.

`solutions/ex07.js`, run with `node ex07.js`:

```js
// Exercise 07 - From a list to a new list with map
const courses = [
  { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: 'Meera', lessons: 20, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: 'Rahul', lessons: 25, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: 'Asha', lessons: 15, price: 0, free: true },
];
// 1) The slow way: for...of and push
const titles = [];
for (const course of courses) {
  titles.push(course.title);
}
console.log(titles);

// 2) The same with map
const titles2 = courses.map((c) => c.title);
console.log(titles2);

// 3) Prices with 18 percent GST, rounded
const withGst = courses.map((c) => Math.round(c.price * 1.18));
console.log(withGst);

// 4) A label for each course
const labels = courses.map((c) => `${c.title} (${c.lessons} lessons)`);
console.log(labels);

// 5) The classic mistake: braces without return
const broken = courses.map((c) => {
  c.title;
});
console.log(broken);

// map never changes the original
console.log(courses.length, courses[0].title);
```

Output (Node 24):

```text
[
  'React for Beginners',
  'Python from Zero',
  'System Design',
  'DevOps Basics'
]
[
  'React for Beginners',
  'Python from Zero',
  'System Design',
  'DevOps Basics'
]
[ 589, 0, 1179, 0 ]
[
  'React for Beginners (12 lessons)',
  'Python from Zero (20 lessons)',
  'System Design (25 lessons)',
  'DevOps Basics (15 lessons)'
]
[ undefined, undefined, undefined, undefined ]
4 React for Beginners
```

</details>

<details>
<summary><b>8 · filter, find, some and every</b></summary>

**Hint.** `filter((c) => c.free)` keeps the items where the callback says `true`. `find` returns **one item** (the first match) or `undefined`. `some` and `every` return only `true` or `false`. A filter with no matches gives an empty list `[]`, not an error.

`filter` returns a list, `find` returns one thing. Nobody has more than 100 lessons, so the answer is an empty list. `find` with id 99 gives `undefined`, and asking `undefined` for `.title` crashes with `TypeError: Cannot read properties of undefined (reading 'title')`. Check the result before you use it (lesson 6 shows a short way).

**Where React uses this:** searching the catalog is `courses.filter(...)`, and a course page finds one course from the id in the web address with `courses.find((c) => c.id === id)`.

`solutions/ex08.js`, run with `node ex08.js`:

```js
// Exercise 08 - filter, find, some and every
const courses = [
  { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: 'Meera', lessons: 20, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: 'Rahul', lessons: 25, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: 'Asha', lessons: 15, price: 0, free: true },
];
const free = courses.filter((c) => c.free);
console.log(free.length, free.map((c) => c.title));

const expensive = courses.filter((c) => c.price > 500);
console.log(expensive.map((c) => c.title));

const huge = courses.filter((c) => c.lessons > 100);
console.log(huge);

const three = courses.find((c) => c.id === 3);
console.log(three.title);

const missing = courses.find((c) => c.id === 99);
console.log(missing);

console.log(courses.some((c) => c.free));
console.log(courses.every((c) => c.free));
console.log(courses.every((c) => c.lessons > 10));

// The trap: find gave back nothing, then we ask it for something.
// Remove the slashes, run again, and read the error.
// console.log(missing.title);
```

Output (Node 24):

```text
2 [ 'Python from Zero', 'DevOps Basics' ]
[ 'System Design' ]
[]
System Design
undefined
true
false
true
```

And with the last line switched on:

```text
TypeError: Cannot read properties of undefined (reading 'title')
```

</details>

<details>
<summary><b>9 · One value from many with reduce</b></summary>

**Hint.** `courses.reduce((sum, c) => sum + c.lessons, 0)`: `sum` is the running total, `c` is the course of this round, and the `0` at the end is where the total starts. The function must return the new sum.

The cashier's running total: 0, 12, 32, 57, 72. Without the starting value, `sum` begins as the first **course object**, and adding a number to an object glues everything together as text, so you get `[object Object]` followed by digits. For totals, always start at 0.

**Where React uses this:** the total in a shopping cart is `cart.reduce((sum, item) => sum + item.price, 0)`; you will use it in module 10.

`solutions/ex09.js`, run with `node ex09.js`:

```js
// Exercise 09 - One value from many, with reduce
const courses = [
  { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: 'Meera', lessons: 20, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: 'Rahul', lessons: 25, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: 'Asha', lessons: 15, price: 0, free: true },
];
const totalLessons = courses.reduce((sum, c) => sum + c.lessons, 0);
console.log('Total lessons:', totalLessons);

const bill = courses.reduce((sum, c) => sum + c.price, 0);
console.log(`Bill for all four: Rs ${bill}`);

// Chain: filter first, then reduce
const freeLessons = courses
  .filter((c) => c.free)
  .reduce((sum, c) => sum + c.lessons, 0);
console.log('Lessons in free courses:', freeLessons);

// Watch the running total, round by round
courses.reduce((sum, c) => {
  console.log(`sum is ${sum}, adding ${c.lessons}`);
  return sum + c.lessons;
}, 0);

// The mistake: no starting value
const oops = courses.reduce((sum, c) => sum + c.price);
console.log(oops);
```

Output (Node 24):

```text
Total lessons: 72
Bill for all four: Rs 1498
Lessons in free courses: 35
sum is 0, adding 12
sum is 12, adding 20
sum is 32, adding 25
sum is 57, adding 15
[object Object]09990
```

</details>

<details>
<summary><b>10 · Sorting without breaking the original, and chaining</b></summary>

**Hint.** `a.price - b.price` is negative when `a` is cheaper, so `a` goes first. For most lessons first, swap them: `b.lessons - a.lessons`. `sort` rearranges the **same** list and gives it back; `toSorted` gives a new one.

`sort` changes the list it is called on and returns that same list, so `sorted === pretend` is `true`. We did it on a copy so your `courses` stayed safe, but on the real list it would have rearranged your data. Without a callback, `sort` compares numbers as text, so `10` comes before `9`. Because `filter` and `map` give back lists, you can attach the next tool straight after.

**Where React uses this:** search boxes, filter buttons and sort menus in React are all chains like `courses.filter(...).toSorted(...).map(...)`; the data is never edited in place.

`solutions/ex10.js`, run with `node ex10.js`:

```js
// Exercise 10 - sort without breaking the original, and chaining
const courses = [
  { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: 'Meera', lessons: 20, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: 'Rahul', lessons: 25, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: 'Asha', lessons: 15, price: 0, free: true },
];
const cheapestFirst = courses.toSorted((a, b) => a.price - b.price);
console.log(cheapestFirst.map((c) => c.title));
console.log('Original still starts with:', courses[0].title);

const mostLessonsFirst = courses.toSorted((a, b) => b.lessons - a.lessons);
console.log(mostLessonsFirst.map((c) => `${c.title} ${c.lessons}`));

// The surprise: sort changes the list it is called on
const pretend = [...courses];
const sorted = pretend.sort((a, b) => a.price - b.price);
console.log(sorted === pretend);
console.log(pretend[0].title);
console.log(courses[0].title);

// Without a callback, numbers sort as text
console.log([1, 10, 9].sort());
console.log([1, 10, 9].sort((a, b) => a - b));

// Chaining
const longOnes = courses.filter((c) => c.lessons > 15).map((c) => c.title);
console.log(longOnes);

const cheapestPaid = courses
  .filter((c) => c.price > 0)
  .toSorted((a, b) => a.price - b.price)[0];
console.log(cheapestPaid.title);
```

Output (Node 24):

```text
[
  'Python from Zero',
  'DevOps Basics',
  'React for Beginners',
  'System Design'
]
Original still starts with: React for Beginners
[
  'System Design 25',
  'Python from Zero 20',
  'DevOps Basics 15',
  'React for Beginners 12'
]
true
Python from Zero
React for Beginners
[ 1, 10, 9 ]
[ 1, 9, 10 ]
[ 'Python from Zero', 'System Design' ]
React for Beginners
```

</details>

## M02 · L04 Modules: import and export

<details>
<summary><b>11 · Split the code into modules</b></summary>

**Hint.** Named import: curly braces and the **exact** name: `import { formatPrice } from './helpers/price.js';`. Default import: no braces, any name you like: `import courses from './courses.js';`. A path starting with `./` is a file in this folder, and you always write the file ending.

`symbol` is not exported, so it stays inside `price.js`. The default export is what a file mainly offers (one per file); named exports can be many. `totalPrice as sumOfPrices` renames it in this file only.

**Where React uses this:** `import App from './App.jsx'` (default, no braces) and `import { useState } from 'react'` (named, braces, a package name without a dot) appear at the top of every React file.

`solutions/courses.js`:

```js
// The shared allcsvideos data. One default export: the list of courses.
const courses = [
  { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: 'Meera', lessons: 20, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: 'Rahul', lessons: 25, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: 'Asha', lessons: 15, price: 0, free: true },
];

export default courses;
```

`solutions/helpers/price.js`:

```js
// Price helpers. symbol has no export, so it stays private to this file.
const symbol = 'Rs';

export const formatPrice = (price) => `${symbol} ${price}`;

export const withGst = (price) => Math.round(price * 1.18);

export const totalPrice = (list) => list.reduce((sum, c) => sum + c.price, 0);
```

`solutions/ex11.js`, run with `node ex11.js`:

```js
// Exercise 11 - Split the code into modules
// This file is main.js of the exercise. It needs courses.js and helpers/price.js next to it.
import courses from './courses.js';
import { formatPrice, withGst, totalPrice as sumOfPrices } from './helpers/price.js';

console.log(courses[0].title);
console.log(formatPrice(courses[0].price));
console.log(formatPrice(withGst(courses[0].price)));
console.log(formatPrice(sumOfPrices(courses)));

// A default import can have any name:
import allCourses from './courses.js';
console.log(allCourses.length);
```

Output (Node 24):

```text
React for Beginners
Rs 499
Rs 589
Rs 1498
4
```

</details>

<details>
<summary><b>12 · Read the import errors and fix them</b></summary>

**Hint.** b1: look at the file name in the path. b2: compare the name with the `export` line, letter by letter. b3 and b4: one is a **default** export and one is a **named** export; decide who needs braces. b5: `symbol` was never exported, so no other file can see it.

The message tells you what you asked for and which file you asked. "Cannot find module" is a wrong path or file ending. "does not provide an export named" is a typo or default and named mixed up (a default export is called `default`). "is not defined" means the name was never imported, or never exported. The fixed file has the default import without braces and the named import with braces.

**Where React uses this:** in a Vite project the same mistakes give a red error overlay ("Failed to resolve import"), or a blank page with the message only in the console.

`solutions/ex12.js`, run with `node ex12.js`:

```js
// Exercise 12 - The fixed imports
import courses from './courses.js';
import { formatPrice } from './helpers/price.js';

console.log(courses[2].title);
console.log(formatPrice(courses[2].price));
```

Output (Node 24):

```text
System Design
Rs 999
```

`solutions/broken/b1.js`, run with `node broken/b1.js` (error line only):

```js
import courses from '../courses.js';
import { formatPrice } from '../helpers/prices.js';

console.log(formatPrice(courses[0].price));
```
```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '…/solutions/helpers/prices.js' imported from …/solutions/broken/b1.js
```

`solutions/broken/b2.js`, run with `node broken/b2.js` (error line only):

```js
import courses from '../courses.js';
import { formatPrise } from '../helpers/price.js';

console.log(formatPrise(courses[0].price));
```
```text
SyntaxError: The requested module '../helpers/price.js' does not provide an export named 'formatPrise'
```

`solutions/broken/b3.js`, run with `node broken/b3.js` (error line only):

```js
import { courses } from '../courses.js';

console.log(courses[0].title);
```
```text
SyntaxError: The requested module '../courses.js' does not provide an export named 'courses'
```

`solutions/broken/b4.js`, run with `node broken/b4.js` (error line only):

```js
import formatPrice from '../helpers/price.js';

console.log(formatPrice(499));
```
```text
SyntaxError: The requested module '../helpers/price.js' does not provide an export named 'default'
```

`solutions/broken/b5.js`, run with `node broken/b5.js` (error line only):

```js
import { formatPrice } from '../helpers/price.js';

console.log(formatPrice(499));
console.log(symbol);
```
```text
ReferenceError: symbol is not defined
```

</details>

## M02 · L05 Async JavaScript and fetch

<details>
<summary><b>13 · Who goes first? Waiting code runs last</b></summary>

**Hint.** `setTimeout(fn, ms)` hands the job away and carries on. Even with `0`, the waiting function runs only **after** the current code has finished. First list the lines that run right away, in file order. Then add the waiting callbacks afterwards, shortest wait first (a callback that starts another `setTimeout` adds its own wait on top).

JavaScript is one cashier with a buzzer: it prints 1, starts both timers, prints 3, and goes on to `orderFood('soup', ...)`, which prints `cooking soup...`. Then the buzzers ring: the zero-millisecond timer first, then soup (300 ms), which starts pizza, and the 500 ms timer lands before pizza is ready. Each extra step in a callback chain pushes the code further right, which is why promises exist.

**Where React uses this:** React draws the page first, empty, and fills in the data when it arrives later; the same waiting rule explains why.

`solutions/ex13.js`, run with `node ex13.js`:

```js
// Exercise 13 - Who goes first? Waiting code runs last
console.log('1: take the order');

setTimeout(() => {
  console.log('2: food is ready');
}, 500);

setTimeout(() => {
  console.log('2b: even zero waits its turn');
}, 0);

console.log('3: greet the next customer');

// Part 2: a callback that is called later
const orderFood = (dish, callback) => {
  console.log(`cooking ${dish}...`);
  setTimeout(() => {
    callback(`${dish} is ready`);
  }, 300);
};

orderFood('soup', (message) => {
  console.log(message);
  orderFood('pizza', (message2) => {
    console.log(message2);
  });
});
```

Output (Node 24):

```text
1: take the order
3: greet the next customer
cooking soup...
2b: even zero waits its turn
soup is ready
cooking pizza...
2: food is ready
pizza is ready
```

The order in the output is the order the *buzzers ring*, not the order of the lines in the file.

</details>

<details>
<summary><b>14 · The kitchen buzzer: promises, then/catch, async/await</b></summary>

**Hint.** A promise starts **pending**, then becomes fulfilled (`.then` gets the food) or rejected (`.catch` gets the error object, and `error.message` is the text). `await` only works inside an `async` function. `await` pauses only that function, not the rest of the program.

`console.log(buzzer)` prints `Promise { <pending> }` because the food is not ready yet. `meanwhile, I read the menu` appears before `eating soup`: `await` paused only `dinner`, like the cashier who serves the next customer. The rejected promise skips `then` and lands in `catch`; with `async/await` the same rejection lands in the `catch` block.

**Where React uses this:** `fetch` gives you a promise, so loading data in React is always `then` or `await` on a buzzer (module 7).

`solutions/ex14.js`, run with `node ex14.js`:

```js
// Exercise 14 - The kitchen buzzer: promises and async/await
const kitchen = (dish, isOpen) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (isOpen) {
        resolve(dish);
      } else {
        reject(new Error('the kitchen is closed'));
      }
    }, 300);
  });

// 1) A buzzer is pending at first
const buzzer = kitchen('pizza', true);
console.log(buzzer);

// 2) then and catch
buzzer.then((food) => console.log('then: eating', food));
kitchen('cake', false)
  .then((food) => console.log('this never runs', food))
  .catch((error) => console.log('catch: Problem,', error.message));

// 3) async and await
const dinner = async (isOpen) => {
  try {
    console.log('ordering...');
    const food = await kitchen('soup', isOpen);
    console.log('eating', food);
  } catch (error) {
    console.log('Problem:', error.message);
  }
};

const main = async () => {
  console.log('--- async/await ---');
  const first = dinner(true);
  console.log('meanwhile, I read the menu');
  await first;
  await dinner(false);
};

// Wait one second, so the first part has finished, then start the second part.
setTimeout(main, 1000);
```

Output (Node 24):

```text
Promise { <pending> }
then: eating pizza
catch: Problem, the kitchen is closed
--- async/await ---
ordering...
meanwhile, I read the menu
eating soup
ordering...
Problem: the kitchen is closed
```

</details>

<details>
<summary><b>15 · JSON and fetch from a local server</b></summary>

**Hint.** There are two buzzers: `await fetch(...)` rings when the reply arrives, and `await res.json()` rings when the data is ready. A 404 is still a reply, so `fetch` itself does **not** fail; `res.ok` is `false` and the body is a small object, not a list.

`res.ok` is `true` for status 200 to 299 only. The 404 reply came back as the object `{ detail: 'Not Found' }`, which has no `.length` or `.map`, so code that carries on would crash later. A promise printed without `await` shows `Promise { <pending> }` and has no `length`. In a real page you check `res.ok` before using the data (exercise 20 does that).

**Where React uses this:** React loads data in an effect with exactly these lines: `fetch`, `await`, check `res.ok`, `res.json()`.

`solutions/server.js`:

```js
// A tiny local server that plays the allcsvideos API. No internet needed.
// Other files: import { startServer, stopServer } from './server.js'
// Or run it alone: node server.js   (then open http://localhost:5125/api/courses)
import http from 'node:http';
import courses from './courses.js';

// Same data, but teacher is an object, and one course is a draft with no teacher and no price.
const catalog = [
  { id: 1, title: 'React for Beginners', teacher: { name: 'Meera' }, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: { name: 'Meera' }, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: { name: 'Rahul' }, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: { name: 'Asha' }, price: 0, free: true },
  { id: 5, title: 'Git Basics', free: false },
];

const send = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
};

export const startServer = (port = 0) =>
  new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      // Wait a little before answering, so you can see the waiting.
      setTimeout(() => {
        if (req.url === '/api/courses') return send(res, 200, courses);
        if (req.url === '/api/catalog') return send(res, 200, catalog);
        return send(res, 404, { detail: 'Not Found' });
      }, 100);
    });
    server.listen(port, '127.0.0.1', () => {
      resolve({ server, url: `http://127.0.0.1:${server.address().port}` });
    });
  });

export const stopServer = (server) =>
  new Promise((resolve) => {
    server.close(() => resolve());
    server.closeAllConnections();
  });

// Run directly: node server.js
if (import.meta.url === `file://${process.argv[1]}`) {
  const { url } = await startServer(5125);
  console.log(`Server running at ${url}  (Ctrl+C to stop)`);
}
```

`solutions/ex15.js`, run with `node ex15.js`:

```js
// Exercise 15 - JSON, and fetch from a local server
import { startServer, stopServer } from './server.js';

// Part 1: JSON is text. stringify makes text, parse makes objects.
const course = { id: 1, title: 'React for Beginners', price: 499, free: false };
const text = JSON.stringify(course);
console.log(text);
console.log(typeof text);
const back = JSON.parse(text);
console.log(back.title, typeof back);

// Part 2: fetch. Two buzzers: the reply, then the data.
const main = async () => {
  const { server, url } = await startServer();

  const res = await fetch(`${url}/api/courses`);
  console.log(res.status, res.ok);
  const courses = await res.json();
  console.log(`${courses.length} courses:`);
  console.log(courses.map((c) => c.title));

  // Part 3: a typo in the address. fetch still "works", so check res.ok.
  const bad = await fetch(`${url}/api/course`);
  console.log(bad.status, bad.ok);
  console.log(await bad.json());

  // Part 4: forgetting await on res.json()
  const res2 = await fetch(`${url}/api/courses`);
  const oops = res2.json();
  console.log(oops);
  console.log(oops.length);
  await oops;

  await stopServer(server);
};

main();
```

Output (Node 24):

```text
{"id":1,"title":"React for Beginners","price":499,"free":false}
string
React for Beginners object
200 true
4 courses:
[
  'React for Beginners',
  'Python from Zero',
  'System Design',
  'DevOps Basics'
]
404 false
{ detail: 'Not Found' }
Promise { <pending> }
undefined
```

</details>

## M02 · L06 Short-hand Logic

<details>
<summary><b>16 · Comparisons and if / else if / else</b></summary>

**Hint.** Three equals compare without converting; two equals quietly convert first, which gives surprises (`1 == '1'` is `true`, `0 == ''` is `true`). Always use `===` and `!==`. The computer reads the questions from the top and stops at the first one that is true, so the order matters: ask `price === 0` before `price < 500`.

`1 === '1'` is `false` (a number is not text) but `1 == '1'` is `true`, which is why we never use the short version. 500 is not below 500, so it falls to the last branch: `Premium`. If you asked "below 500" first, the free course would be called `Budget`.

**Where React uses this:** in module 5 you will write `if (courses.length === 0) return <p>No courses yet</p>`.

`solutions/ex16.js`, run with `node ex16.js`:

```js
// Exercise 16 - Comparisons and if / else if / else
// Part 1: predict. Each line prints true or false.
const price = 499;
console.log(price === 499);
console.log(price !== 0);
console.log(price > 500);
console.log(price < 500);
console.log(price >= 499);
console.log(price <= 100);
console.log(1 === '1');
console.log(1 == '1');
console.log(0 == '');

// Part 2: the label function
const priceLabel = (price) => {
  if (price === 0) {
    return 'Free';
  } else if (price < 500) {
    return 'Budget';
  } else {
    return 'Premium';
  }
};

console.log(priceLabel(499));
console.log(priceLabel(0));
console.log(priceLabel(999));
console.log(priceLabel(500));
```

Output (Node 24):

```text
true
true
false
true
true
false
false
true
true
Budget
Free
Premium
Premium
```

</details>

<details>
<summary><b>17 · Truthy, falsy, && and the lonely zero</b></summary>

**Hint.** Falsy values: `false`, `0`, `''`, `null`, `undefined`, `NaN`. **Everything else is truthy**, even `'0'`, `'false'`, `[]` and `{}`. `a && b` gives `b` if `a` is truthy, otherwise it gives back `a` itself, so `0 && 'badge'` is `0`. A comparison always gives `true` or `false`.

`count && 'badge'` gives back the number `0`. React draws nothing for `true`, `false`, `null` and `undefined`, but it **does** draw the number zero, which is the stray `0` from the start of the lesson. Put a comparison on the left (`count > 0 && ...`). An empty list is truthy, so ask about `list.length > 0`. A single `=` inside `if` stores the value; use `===` to compare.

**Where React uses this:** `{courses.length > 0 && <Badge />}` shows something only when it should; with `{courses.length && ...}` an empty list draws a `0`.

`solutions/ex17.js`, run with `node ex17.js`:

```js
// Exercise 17 - Truthy, falsy, && || !, and the lonely zero
// Part 1: what counts as yes?
console.log(Boolean(0), Boolean(''), Boolean(null), Boolean(undefined), Boolean(NaN), Boolean(false));
console.log(Boolean('0'), Boolean('false'), Boolean([]), Boolean({}), Boolean(12));

// Part 2: and, or, not
const isFree = true;
const lessons = 20;
console.log(isFree && lessons > 10);
console.log(isFree && lessons > 30);
console.log(isFree || lessons > 30);
console.log(!isFree);

// Part 3: && gives back a value, not always true or false
const count = 0;
console.log(isFree && 'FREE');
console.log(!isFree && 'FREE');
console.log(count && 'badge');
console.log(count > 0 && 'badge');

// Part 4: the same with two joined courses
const joined = 2;
console.log(joined && 'badge');
console.log(joined > 0 && 'badge');

// Part 5: asking about a list
const list = [];
if (list) {
  console.log('Bug: the empty list counted as yes');
}
if (list.length > 0) {
  console.log('This never prints');
}
console.log('Length of an empty list:', list.length, Boolean(list.length));

// Part 6: one equals sign stores, three compare
let cost = 499;
if ((cost = 0)) {
  console.log('Paid');
} else {
  console.log('Free, because cost is now', cost);
}
```

Output (Node 24):

```text
false false false false false false
true true true true true
true
false
true
false
FREE
false
0
false
badge
badge
Bug: the empty list counted as yes
Length of an empty list: 0 false
Free, because cost is now 0
```

</details>

<details>
<summary><b>18 · The ternary, ?? and ?.</b></summary>

**Hint.** A ternary is `question ? answerIfYes : answerIfNo`. `a ?? b` uses `b` only when `a` is `null` or `undefined`, so a price of `0` stays `0`; `a || b` replaces **every** falsy value, including `0`. `draft.teacher?.name` stops and gives `undefined` instead of crashing. The two work as a team: `?.` avoids the crash, `??` fills in the friendly default.

With `||` the free course shows `price soon`, which is wrong (a price of 0 is a real price); with `??` it stays `0`. The draft has no price at all, so both give `price soon`. `draft.teacher.name` (without the question mark) would crash with `Cannot read properties of undefined (reading 'name')`. Mixing `??` with `||` unbracketed is a syntax error: `SyntaxError: missing ) after argument list`; write `(draft.price ?? 0) || 'price soon'`.

**Where React uses this:** `{course.price ?? 'soon'}`, `{enrolled ? 'Enrolled' : 'Enroll'}` and `course.teacher?.name` are in nearly every real component.

`solutions/ex18.js`, run with `node ex18.js`:

```js
// Exercise 18 - Ternary, ?? and ?.
const free = { id: 2, title: 'Python from Zero', teacher: { name: 'Meera' }, price: 0 };
const draft = { id: 5, title: 'Git Basics' };

// 1) ternary
const label = (c) => (c.price === 0 ? 'Free' : `Rs ${c.price}`);
console.log(label(free));
console.log(label({ price: 499 }));

// 2) || against ??
console.log(free.price || 'price soon');
console.log(free.price ?? 'price soon');
console.log(draft.price || 'price soon');
console.log(draft.price ?? 'price soon');

// 3) ?. looks inside safely
console.log(free.teacher.name);
console.log(draft.teacher?.name);
console.log(draft.teacher?.name ?? 'to be announced');

// 4) a whole card line
const cardLine = (c) =>
  `${c.title} - ${c.teacher?.name ?? 'to be announced'} - ${c.price === undefined ? 'price soon' : label(c)}`;
console.log(cardLine(free));
console.log(cardLine(draft));

// 5) brackets when you mix ?? and ||
console.log((draft.price ?? 0) || 'price soon');
```

Output (Node 24):

```text
Free
Rs 499
price soon
0
price soon
price soon
Meera
undefined
to be announced
Python from Zero - Meera - Free
Git Basics - to be announced - price soon
price soon
```

</details>

## M02 · Combine everything

<details>
<summary><b>19 · Combine everything: the catalog report</b></summary>

**Hint.** Break it into the small tools from lessons 2 to 6: each section is one or two chained lines. For the bill: `enrollments.filter(...).map(...).reduce((sum, course) => sum + (course?.price ?? 0), 0)`. Remember that `find` returns `undefined` for id 99, so ask with `?.` and give a default with `??`.

This is the whole module in one file: modules (`import`), objects and arrays, spread (the sale copy, the original stays Rs 499), destructuring, `map`, `filter`, `find`, `reduce`, `toSorted`, `some`/`every`, a ternary, and `?.` with `??`. Asha's missing course never crashes the program because of `?.` and `??`.

**Where React uses this:** a real page is this same shape: data in, a chain of list tools, a ternary or `&&` for each piece of the screen, and cards out.

`solutions/courses.js`:

```js
// The shared allcsvideos data. One default export: the list of courses.
const courses = [
  { id: 1, title: 'React for Beginners', teacher: 'Meera', lessons: 12, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: 'Meera', lessons: 20, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: 'Rahul', lessons: 25, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: 'Asha', lessons: 15, price: 0, free: true },
];

export default courses;
```

`solutions/helpers/price.js`:

```js
// Price helpers. symbol has no export, so it stays private to this file.
const symbol = 'Rs';

export const formatPrice = (price) => `${symbol} ${price}`;

export const withGst = (price) => Math.round(price * 1.18);

export const totalPrice = (list) => list.reduce((sum, c) => sum + c.price, 0);
```

`solutions/ex19.js`, run with `node ex19.js`:

```js
// Exercise 19 - Combine everything: the catalog report
import courses from './courses.js';
import { formatPrice, withGst } from './helpers/price.js';

const enrollments = [
  { student: 'Lukas', courseId: 1 },
  { student: 'Priya', courseId: 4 },
  { student: 'Lukas', courseId: 3 },
  { student: 'Asha', courseId: 99 },
  { student: 'Priya', courseId: 2 },
];

// 1) a sale copy of the list: every paid course, 20 percent off. Originals untouched.
const onSale = courses.map((c) => (c.price > 0 ? { ...c, price: Math.round(c.price * 0.8) } : c));

// 2) the catalog, most expensive first
console.log('CATALOG');
const byPriceDesc = onSale.toSorted((a, b) => b.price - a.price);
for (const { title, teacher, lessons, price } of byPriceDesc) {
  const tag = price === 0 ? 'Free' : `${formatPrice(price)} (with GST ${formatPrice(withGst(price))})`;
  console.log(`  ${title} by ${teacher}, ${lessons} lessons, ${tag}`);
}
console.log('Original price of the first course:', formatPrice(courses[0].price));

// 3) who joined what
console.log('ENROLLMENTS');
for (const { student, courseId } of enrollments) {
  const course = courses.find((c) => c.id === courseId);
  console.log(`  ${student}: ${course?.title ?? 'course not found'}`);
}

// 4) the bill for each student
console.log('BILLS');
const students = ['Lukas', 'Priya', 'Asha'];
for (const student of students) {
  const bill = enrollments
    .filter((e) => e.student === student)
    .map((e) => courses.find((c) => c.id === e.courseId))
    .reduce((sum, course) => sum + (course?.price ?? 0), 0);
  console.log(`  ${student}: ${bill === 0 ? 'nothing to pay' : formatPrice(bill)}`);
}

// 5) summary
const summary = {
  courses: courses.length,
  free: courses.filter((c) => c.free).length,
  lessons: courses.reduce((sum, c) => sum + c.lessons, 0),
  anyFree: courses.some((c) => c.free),
  allFree: courses.every((c) => c.free),
};
console.log(summary);
const { free, lessons } = summary;
console.log(`${free} free courses, ${lessons} lessons in total`);
```

Output (Node 24):

```text
CATALOG
  System Design by Rahul, 25 lessons, Rs 799 (with GST Rs 943)
  React for Beginners by Meera, 12 lessons, Rs 399 (with GST Rs 471)
  Python from Zero by Meera, 20 lessons, Free
  DevOps Basics by Asha, 15 lessons, Free
Original price of the first course: Rs 499
ENROLLMENTS
  Lukas: React for Beginners
  Priya: DevOps Basics
  Lukas: System Design
  Asha: course not found
  Priya: Python from Zero
BILLS
  Lukas: Rs 1498
  Priya: nothing to pay
  Asha: nothing to pay
{ courses: 4, free: 2, lessons: 72, anyFree: true, allFree: false }
2 free courses, 72 lessons in total
```

</details>

<details>
<summary><b>20 · Combine everything: an async loader with three endings</b></summary>

**Hint.** A rejected `fetch` (server down) and a bad status (404) are different problems: the first throws by itself, the second you must catch by checking `res.ok` and throwing. Because `loadJson` returns `[]` on failure, the rest of the page never breaks. Starting a call without `await` and awaiting it later is how the `(the page is not frozen)` line appears before the data.

You see all three of the page's looks: **loading** (before the buzzer rings), the **list** (when it is fulfilled) and the **error** (404 or no answer). Node's message for a stopped server is `fetch failed` (a browser says `Failed to fetch`). `?.` and `??` keep the draft course from crashing the page, and `toSorted` keeps the catalog in its original order.

**Where React uses this:** this is the whole data-loading story of a React page: loading, success, error. Module 7 puts it in an effect, and module 11 hands it to TanStack Query.

`solutions/server.js`:

```js
// A tiny local server that plays the allcsvideos API. No internet needed.
// Other files: import { startServer, stopServer } from './server.js'
// Or run it alone: node server.js   (then open http://localhost:5125/api/courses)
import http from 'node:http';
import courses from './courses.js';

// Same data, but teacher is an object, and one course is a draft with no teacher and no price.
const catalog = [
  { id: 1, title: 'React for Beginners', teacher: { name: 'Meera' }, price: 499, free: false },
  { id: 2, title: 'Python from Zero', teacher: { name: 'Meera' }, price: 0, free: true },
  { id: 3, title: 'System Design', teacher: { name: 'Rahul' }, price: 999, free: false },
  { id: 4, title: 'DevOps Basics', teacher: { name: 'Asha' }, price: 0, free: true },
  { id: 5, title: 'Git Basics', free: false },
];

const send = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
};

export const startServer = (port = 0) =>
  new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      // Wait a little before answering, so you can see the waiting.
      setTimeout(() => {
        if (req.url === '/api/courses') return send(res, 200, courses);
        if (req.url === '/api/catalog') return send(res, 200, catalog);
        return send(res, 404, { detail: 'Not Found' });
      }, 100);
    });
    server.listen(port, '127.0.0.1', () => {
      resolve({ server, url: `http://127.0.0.1:${server.address().port}` });
    });
  });

export const stopServer = (server) =>
  new Promise((resolve) => {
    server.close(() => resolve());
    server.closeAllConnections();
  });

// Run directly: node server.js
if (import.meta.url === `file://${process.argv[1]}`) {
  const { url } = await startServer(5125);
  console.log(`Server running at ${url}  (Ctrl+C to stop)`);
}
```

`solutions/ex20.js`, run with `node ex20.js`:

```js
// Exercise 20 - Combine everything: an async loader with three endings
import { startServer, stopServer } from './server.js';

const loadJson = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`the server said ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.log(`Could not load: ${error.message}`);
    return [];
  }
};

const priceText = (price) => (price === 0 ? 'Free' : `Rs ${price}`);

const cardLine = ({ title, teacher, price }) =>
  `${title} | ${teacher?.name ?? 'teacher to be announced'} | ${price === undefined ? 'price soon' : priceText(price)}`;

const main = async () => {
  const { server, url } = await startServer();

  console.log('Loading...');
  const promise = loadJson(`${url}/api/catalog`);
  console.log('(the page is not frozen)');
  const catalog = await promise;

  // 1) one line per course
  for (const c of catalog) {
    console.log(' ', cardLine(c));
  }

  // 2) numbers
  const paid = catalog.filter((c) => (c.price ?? 0) > 0);
  const bill = paid.reduce((sum, c) => sum + c.price, 0);
  console.log(`${catalog.length} courses, ${paid.length} paid, bill Rs ${bill}`);

  // 3) the cheapest paid course, without changing the catalog
  const cheapest = paid.toSorted((a, b) => a.price - b.price)[0];
  console.log('Cheapest paid:', cheapest?.title);
  console.log('First in catalog still:', catalog[0].title);

  // 4) the three endings
  const typo = await loadJson(`${url}/api/catalogue`);
  console.log('After the typo, the list has', typo.length, 'items');

  await stopServer(server);
  const down = await loadJson(`${url}/api/catalog`);
  console.log('After the server stopped, the list has', down.length, 'items');
};

main();
```

Output (Node 24):

```text
Loading...
(the page is not frozen)
  React for Beginners | Meera | Rs 499
  Python from Zero | Meera | Free
  System Design | Rahul | Rs 999
  DevOps Basics | Asha | Free
  Git Basics | teacher to be announced | price soon
5 courses, 2 paid, bill Rs 1498
Cheapest paid: React for Beginners
First in catalog still: React for Beginners
Could not load: the server said 404
After the typo, the list has 0 items
Could not load: fetch failed
After the server stopped, the list has 0 items
```

</details>

---

**Score yourself:** 16-20 working solutions means you are ready for Module 03. Under 12, rewatch the lesson named above the exercises you missed. Exercises 3, 12 and 15 (reading error messages and replies) are the best practice for every module that follows.

## What next

In **Module 03 · Components as LEGO Bricks** you stop running small scripts and start writing React itself. A component is just a function that returns a piece of the screen, written with the arrow functions, template strings, destructured parameters and `map` calls you have just practised.
