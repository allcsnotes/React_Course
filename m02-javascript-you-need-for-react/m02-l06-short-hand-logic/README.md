# M02-L06 · Short-hand Logic

> Video: Module 2, Lesson 6 (the last lesson of the module). Watch it first, then follow along here.

## What you'll learn

- Comparisons (`===`, `!==`, `>`, `<`, `>=`, `<=`) and why you always use triple equals
- `if`, `else if`, `else`, and combining questions with `&&`, `||` and `!`
- Truthy and falsy values (the short list of falsy ones)
- Short-hands React uses all the time: the ternary `? :`, `&&`, `??` and `?.`
- Why a lonely `0` appears on the page, and how to fix it
- Three mistakes of the first week

## Before you start

- Node 24 (`node --version`). Lessons [M02-L01](../m02-l01-let-const-and-arrow-functions/) to [M02-L05](../m02-l05-async-javascript-and-fetch/) first.
- For the page at the end: `npm install` inside `app/`.
- No Docker needed.

## Files in this folder

| File | What it is |
|------|------------|
| `demo/comparisons.js`, `demo/equals-triple-vs-double.js` | The six comparisons; `===` against `==` |
| `demo/price-label-if-else.js` | `if` / `else if` / `else` |
| `demo/and-or-not.js` | `&&`, `\|\|`, `!` |
| `demo/falsy-values.js`, `demo/truthy-surprises.js` | `Boolean(...)` of falsy and surprising truthy values |
| `demo/ternary-499.js`, `demo/ternary-0.js`, `demo/ternary-if-else.js` | The ternary, and the same with `if`/`else` |
| `demo/and-short-circuit.js` | `&&` and the zero |
| `demo/defaults-or-vs-nullish.js` | `\|\|` against `??` for defaults |
| `demo/optional-crash.js`, `demo/optional-chaining.js` | `?.` |
| `demo/single-equals-bug.js`, `demo/single-equals-fixed.js` | Mistake 1 and its fix |
| `demo/empty-list-truthy.js`, `demo/empty-list-length.js` | Mistake 2 and its fix |
| `demo/mixed-operators-error.js`, `demo/mixed-operators-fixed.js` | Mistake 3 and its fix |
| `app/` | A small Vite page that uses every short-hand (the fixed version) |
| `edits/App.*.jsx` | Variants of `app/src/App.jsx` used in the video: `zero-bug`, `enrolled-true`, `badge-two-courses`, `price-or-wrong`, `teacher-crash` |

## Follow along

### 1. The lonely zero

The page `app/` shows the courses a student has joined. This student has joined none, so the grey bar under the heading should be empty. With `edits/App.zero-bug.jsx` copied over `app/src/App.jsx` there is a lonely `0` in it: no error, no warning. Behind it is one short line of JSX. By the end you will understand every symbol in it and why the zero appears.

### 2. Comparisons

A comparison is a yes/no question: it always answers `true` or `false`, the two booleans from Lesson 1. `demo/comparisons.js`:

```js
const price = 499;

console.log(price === 499);
console.log(price !== 0);
console.log(price > 500);
console.log(price < 500);
console.log(price >= 499);
console.log(price <= 100);
```

`===` asks "exactly the same?", `!==` is "not equal", then greater, less, greater or equal, less or equal.

```bash
cd demo
node comparisons.js
```

```text
true
true
false
true
true
false
```

Three equals signs mean "compare"; one (Lesson 1) puts a value into a named box. Why three? `demo/equals-triple-vs-double.js` shows what the two-sign version does:

```js
console.log(1 === '1');
console.log(1 == '1');
console.log(0 == '');
console.log(0 == false);
console.log(null == undefined);
console.log(null === undefined);
```

```text
false
true
true
true
true
false
```

`===` says the number 1 and the text `'1'` are different kinds of things. `==` quietly converts one side first and says true, and it goes further (`0 == ''`, `0 == false`, `null == undefined` are all true). Real surprises cause real bugs. **Always use `===` and `!==`, never the short versions.** In Module 5 you will write `list.length === 0` to ask "is the list empty?".

### 3. if, else if, else

A comparison becomes powerful when it decides what happens next. `demo/price-label-if-else.js`: free if the price is 0, Budget below 500, otherwise Premium.

```js
function priceLabel(price) {
  if (price === 0) {
    return 'Free';
  } else if (price < 500) {
    return 'Budget';
  } else {
    return 'Premium';
  }
}

console.log(priceLabel(499));
console.log(priceLabel(0));
console.log(priceLabel(999));
console.log(priceLabel(500));
```

The computer reads from the top and stops at the first question that is true. Guess the four answers, then run it:

```text
Budget
Free
Premium
Premium
```

499 is not 0 but is below 500, so Budget. 0 is Free. 999 is Premium. Exactly 500 is not below 500, so it lands on the last branch. Order matters: asking "below 500" first would call the free course Budget, because 0 is below 500. The first true question wins.

Three small words combine questions: `&&` means and (both true), `||` means or (at least one true), `!` means not (flip). `demo/and-or-not.js`:

```js
const free = true;
const lessons = 20;

console.log(free && lessons > 10);
console.log(free && lessons > 30);
console.log(free || lessons > 30);
console.log(!free);
```

```text
true
false
true
false
```

In Module 5 you will use `if` like this: if the list of courses is empty, the component answers with a message instead of the list. `app/src/App.jsx` already does it (`function Shelf`): the page says `No courses yet`.

### 4. Truthy and falsy

The question inside an `if` does not have to be `true` or `false`. JavaScript decides yes or no by itself. A value that counts as yes is **truthy**, one that counts as no is **falsy**. Think of a lunch box: an empty box is a no, anything inside is a yes (even a note that says 0).

The falsy values are a short list you can learn: `false`, the number `0`, the empty text `''`, `null`, `undefined` and `NaN` (not a number, the result of broken maths). Two rare ones, `-0` and `0n`, you will almost never meet. **Everything else is truthy.** `Boolean(x)` shows what JavaScript decides. `demo/falsy-values.js` prints `Boolean(0)`, `Boolean('')`, `Boolean(null)`, `Boolean(undefined)` and `Boolean(NaN)`:

```text
false
false
false
false
false
```

Now the surprise (`demo/truthy-surprises.js`: `Boolean('0')`, `Boolean('false')`, `Boolean([])`, `Boolean({})`). Guess, then:

```text
true
true
true
true
```

All true. A text with anything in it is truthy, even `'0'` or `'false'`. An empty list and an empty object exist, so they count as yes. **An empty list is truthy.** To ask whether a list is empty, check its length: the length of an empty list is 0, which is falsy. That zero is the key to our bug.

### 5. The ternary: pick one of two

A **ternary** is a very short `if`/`else` that hands back a value: a question, `?` (read it as "then"), the answer for yes, `:` (read it as "otherwise"), the answer for no. `demo/ternary-499.js`:

```js
const price = 499;

const label = price === 0 ? 'Free' : `Rs ${price}`;

console.log(label);
```

```bash
node ternary-499.js
node ternary-0.js
```

```text
Rs 499
Free
```

`ternary-0.js` is the same with `price = 0`: one number changed and the other answer came out. `demo/ternary-if-else.js` is the same thing with `if`/`else`, six lines and a `let label` set up empty and changed later; it prints `Rs 499`. Keep a ternary simple: one question, two answers. Never put one ternary inside another.

In React this is how a button changes its words: `{enrolled ? 'Enrolled' : 'Enroll'}`. Curly braces in JSX mean "run this JavaScript here and show the answer". With `enrolled` false the button says `Enroll`; copy `edits/App.enrolled-true.jsx` and it says `Enrolled`. It is the idea from M01-L01: if enrolled, 1205, otherwise 1204.

### 6. && : show something only if

A SALE sticker appears on an item only if the item is on sale; if not, no sticker, not even a blank one. The pattern is `question && thing`. If the question is truthy you get the thing. If it is falsy you get the question's own value and the thing is ignored. `demo/and-short-circuit.js`:

```js
const isFree = true;
const count = 0;

console.log(isFree && 'FREE');
console.log(!isFree && 'FREE');
console.log(count && 'You have courses');
```

Pay attention to the last line:

```bash
node and-short-circuit.js
```

```text
FREE
false
0
```

`count` is 0, which is falsy, so `&&` stops there and gives back the question's own value: `0`. Not nothing: zero. In a terminal a zero is harmless. In React it is not: **React draws nothing for `true`, `false`, `null` and `undefined`, but the number zero is a real number, so it draws it.** That is our bug: `{myCount && <span>...</span>}` with `myCount` equal to 0 draws a `0` in the grey bar.

The fix: ask a real yes/no question with a comparison. `myCount > 0` is always `true` or `false`, never a number:

```jsx
{myCount > 0 && (
  <span className="badge">{myCount} courses</span>
)}
```

Now the bar is empty when there are no courses and no zero is drawn (`app/src/App.jsx`). With two courses the badge appears (`edits/App.badge-two-courses.jsx`, `myCount = 2`: the page shows `2 courses`). **The rule: put a comparison, not a bare number, on the left of `&&`.**

### 7. Defaults: ?? against ||

Every course has a price, but a draft course may not have one yet and should show "Price soon". `left || right` means "use the left side unless it is falsy" (and 0 is falsy!). `left ?? right` means "use the left side unless it is really missing, meaning `null` or `undefined`". `demo/defaults-or-vs-nullish.js`:

```js
const python = { title: 'Python from Zero', price: 0 };
const draft = { title: 'Git for Beginners' };

console.log(python.price || 'Price soon');
console.log(python.price ?? 'Price soon');
console.log(draft.price || 'Price soon');
console.log(draft.price ?? 'Price soon');
```

Guess the four lines:

```text
Price soon
0
Price soon
Price soon
```

Python from Zero costs nothing; its price, 0, is a real price. `||` throws it away and says "Price soon", which is wrong. `??` keeps the 0. For the draft, the price is really missing, so both give the default. **For a default value use `??`.** Use `||` only when you really want to replace every falsy value, like an empty text.

In React: with `||` the free Python card says `Price: Rs soon` (`edits/App.price-or-wrong.jsx`). With `??` it says `Price: Rs 0`, the true price, and the draft course says `Price: Rs soon` (the fixed `app/`).

### 8. ?. : look inside safely

To get a letter from room twelve you walk to the room and open the drawer. What if there is no room twelve? A polite person knocks first. `demo/optional-crash.js`:

```js
const react = {
  title: 'React for Beginners',
  teacher: { name: 'Meera' },
};
const draft = { title: 'Git for Beginners' };

console.log(react.teacher.name);
console.log(draft.teacher.name);
```

`react.teacher.name` has two dots: the first opens `teacher`, the second opens `name` inside it. Guess what the second line does for the draft:

```bash
node optional-crash.js
```

```text
Meera
~/demo/optional-crash.js:8
console.log(draft.teacher.name);
                          ^

TypeError: Cannot read properties of undefined (reading 'name')
    at Object.<anonymous> (~/demo/optional-crash.js:8:27)
    ...
```

(`~` is the folder on your computer.) The draft has no teacher, so `draft.teacher` is `undefined`, and `undefined` has nothing inside to open: the second dot walked into a wall. In a React page this is worse: copy `edits/App.teacher-crash.jsx` over `app/src/App.jsx` and the whole page goes blank, with the console message `Cannot read properties of undefined (reading 'name')`.

The fix is to knock first: a question mark before the second dot. `draft.teacher?.name` means "if the thing on the left is missing, stop here and give back `undefined`". It is called **optional chaining** (the short way promised in Lesson 3). `demo/optional-chaining.js`:

```js
console.log(react.teacher?.name);
console.log(draft.teacher?.name);
console.log(draft.teacher?.name ?? 'Teacher soon');
```

```text
Meera
undefined
Teacher soon
```

The two are a team: `?.` avoids the crash and `??` fills in a friendly default. The fixed `app/` page shows `Teacher: to be announced` for the draft, and nothing breaks.

### 9. Run the page

```bash
cd app
npm install
npm run dev
```

Open the address Vite prints (port 5173 by default). The page you should see (the fixed version):

```text
My courses
No courses yet
Python from Zero
Price: Rs 0
Teacher: Meera
Enroll
Git for Beginners
Price: Rs soon
Teacher: to be announced
```

Copy the files in `edits/` over `src/App.jsx` one at a time and compare. From a real run:

```text
zero-bug:           My courses, 0, No courses yet, ...  (the lonely zero)
enrolled-true:      ... the button says Enrolled
badge-two-courses:  My courses, 2 courses, No courses yet, ...
price-or-wrong:     ... Python from Zero, Price: Rs soon ...
teacher-crash:      blank page, red error in the console
```

## Common mistakes

**1. A single `=` inside an `if`** (`demo/single-equals-bug.js`). Guess what it prints and what `price` is at the end:

```js
let price = 499;

if (price = 0) {
  console.log('Free');
} else {
  console.log('Paid');
}

console.log(price);
```

```text
Paid
0
```

No error. The single `=` stored 0 into `price`, then asked about 0, which is falsy. The price was changed by accident. The fix is `===` (`demo/single-equals-fixed.js`):

```text
Paid
499
```

The price stays 499 and it is still `Paid`, now for the right reason.

**2. Asking about a list directly** (`demo/empty-list-truthy.js`):

```js
const myCourses = [];

if (myCourses) {
  console.log('You have courses!');
}
```

```text
You have courses!
```

It prints, with no courses: an empty list is truthy. The fix is to ask about the length (`demo/empty-list-length.js`, `if (myCourses.length > 0)`): nothing prints, which is correct.

**3. Mixing `??` with `||` in one line without brackets** (`demo/mixed-operators-error.js`, `const label = price ?? sale || 'Price soon';`):

```text
~/demo/mixed-operators-error.js:3
const label = price ?? sale || 'Price soon';
                            ^^

SyntaxError: Unexpected token '||'
```

JavaScript does not know which should go first. Put brackets around the part that goes first (`demo/mixed-operators-fixed.js`, `(price ?? sale) || 'Price soon'`); it runs and prints `Price soon`.

## Try it yourself

1. In your own project, set `myCount` to `2` and see the badge.
2. Remove one question mark from a teacher line (`draft.teacher.name`) and read the error.
3. What does `console.log('' ?? 'x')` print, and what does `console.log('' || 'x')` print? (Answers: an empty line, then `x`.)

## Clean up

Delete `app/node_modules` and `app/dist` if you created them. Nothing else was created.

## Next

You finished Module 2. Do the [M02 Practice Sheet](../../practice/m02-javascript-you-need-for-react/) (20 exercises with worked answers). Then continue with [M03-L01 · Components as LEGO Bricks](../../m03-jsx-and-components/m03-l01-components-as-lego-bricks/): from here on you write React itself.
