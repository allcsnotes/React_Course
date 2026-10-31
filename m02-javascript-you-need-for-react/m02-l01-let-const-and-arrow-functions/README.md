# M02-L01 · let, const and Arrow Functions

> Video: Module 2, Lesson 1. Watch it first, then follow along here.

## What you'll learn

- The three kinds of value: string, number and boolean, and how `console.log` prints them
- Variables as named boxes: `const` when the value never changes, `let` when it does
- Template strings (backticks and `${}`) for building sentences
- Functions: parameters, `return`, calling with arguments
- Arrow functions, including the one-line form that returns by itself
- The error messages you will meet first, and how to read them

## Before you start

- Node 24: `node --version` should print something like `v24.16.0`. Set up in [M01-L03](../../m01-getting-started/m01-l03-setting-up-your-tools/).
- You need only a terminal and a code editor. No React yet, and no Docker.
- In the video each example lives in a file with a short name (`hello.js`, `variables.js`, `price.js`). Several examples change the same file step by step. In this folder every step has its own file, so you can run them side by side. The README tells you which one to run.

## Files in this folder

| File | What it is |
|------|------------|
| `card.js` | The small program from the start: makes the text for a course card |
| `hello.js`, `hello-three-values.js` | `console.log` with a string, a number and a boolean |
| `plus.js`, `both.js` | `12 + 8` against `'12' + '8'` |
| `web/index.html` | A page that prints the same three messages to the browser console |
| `variables-price.js`, `variables-types.js`, `variables-change.js` | `let`, three kinds of value, changing a value |
| `constants-basic.js`, `constants-error.js`, `constants-seats.js` | `const`, the sealed lid error, `const` and `let` together |
| `template-plus.js`, `template-backticks.js`, `template-expressions.js`, `template-wrong-quotes.js` | Building sentences |
| `cards-repeated.js` | Three cards by copy and paste (the problem) |
| `price-function.js`, `price-call.js`, `price-call-2.js`, `price-pay.js` | `finalPrice`: define, call, call again, save the result |
| `describe.js`, `describe-no-return.js` | One recipe for three cards, and the missing `return` |
| `price-arrow.js`, `price-arrow-short.js`, `arrows-twice-greet.js`, `price-arrow-no-return.js` | Arrow functions |
| `error-typo.js`, `error-early.js`, `error-twice.js` | Three more mistakes |
| `react-check/` | A tiny project that renders `<CourseCard />` to HTML, to prove a component is just a function |

## Follow along

Open a terminal in this folder.

### 1. The program we will understand

```bash
node card.js
```

```text
React for Beginners: 12 lessons, Rs 499
```

`card.js` makes the line of text that sits on a course card:

```js
const describe = (title, lessons, price) => {
  return `${title}: ${lessons} lessons, Rs ${price}`;
};

console.log(describe('React for Beginners', 12, 499));
```

`const`, the arrow, the backticks and the dollar sign: by the end of this lesson you will understand every symbol.

### 2. Values and console.log

A **value** is one piece of information. There are three kinds today: text (a **string**, written in quotes), a **number** (no quotes) and a **boolean** (only `true` or `false`, no quotes). `console.log(...)` prints a value; the console is the computer's message area.

`hello.js` has exactly one line:

```js
console.log('React for Beginners');
```

To run a file, type `node` and the file name:

```bash
node hello.js
```

```text
React for Beginners
```

The quotes are gone: they belong to the code and only tell JavaScript "this is text". All three kinds, one per line (`hello-three-values.js`):

```js
console.log('React for Beginners');
console.log(12);
console.log(true);
```

```bash
node hello-three-values.js
```

```text
React for Beginners
12
true
```

Guess time: `plus.js` adds twelve and eight without quotes, then the strings `'12'` and `'8'`. What does each line print?

```js
console.log(12 + 8);
console.log('12' + '8');
```

```bash
node plus.js
```

```text
20
128
```

Numbers add up. But with quotes, `'12'` and `'8'` are text, and `+` on text does not add: it glues the pieces together, `12` then `8`, `128`. Quotes matter.

### 3. The browser console

`console.log` also works in every browser. Open `web/index.html` in your browser (double-click it). It has three lines of JavaScript: the same string and the same two additions. To open the console, right-click the page, choose **Inspect** and click the **Console** tab. On a Mac you can press `Cmd+Option+J`; on Windows, `Ctrl+Shift+J`. You see:

```text
React for Beginners
20
128
```

(`both.js` is the same three lines for the terminal: `node both.js`.) In the terminal, node runs your file; in the browser, the console shows what the page printed. This lesson uses the terminal because it is quickest. Everything works the same in React.

### 4. Variables with let

The problem: we need the same value (a price) in many places. A **variable** is a named box that holds a value. `variables-price.js`:

```js
let price = 499;
console.log('price');
console.log(price);
```

`let` makes a new box, `price` is the label we choose, `=` means "put this value into the box" (not "equals" as in maths), and `;` ends the instruction like a full stop.

```bash
node variables-price.js
```

```text
price
499
```

With quotes, `price` is just text. Without quotes, JavaScript looks for the box with that label and prints what is inside.

A variable can hold any kind of value (`variables-types.js`):

```js
let courseTitle = 'React for Beginners';
let lessons = 12;
let isFree = false;
console.log(courseTitle);
console.log(lessons);
console.log(isFree);
```

```bash
node variables-types.js
```

```text
React for Beginners
12
false
```

Names: no spaces. When a name has two words, the first starts small and the second gets a capital letter (`courseTitle`): this style is called **camel case**. Names for booleans often start with `is`.

`let` means the value is allowed to change. Guess: what does the last line of `variables-change.js` print?

```js
let lessons = 12;
lessons = lessons + 1;
console.log(lessons);
```

```bash
node variables-change.js
```

```text
13
```

JavaScript first works out the right side (12 + 1 = 13), then puts 13 into the box; the old 12 is gone. The second line has no `let`: `let` only makes the box. Take the old value, calculate, put the new value back. That is exactly how a counter button works in React (Module 4).

### 5. Constants with const

Some values never change, like the teacher of a course. `const` is a box with a sealed lid (`constants-basic.js`):

```js
const teacher = 'Meera';
console.log(teacher);
```

```bash
node constants-basic.js
```

```text
Meera
```

Guess: `constants-error.js` tries to open the sealed box. Does it print Rahul, Meera, or something else?

```js
const teacher = 'Meera';
teacher = 'Rahul';
console.log(teacher);
```

```bash
node constants-error.js
```

```text
~/project/constants-error.js:2
teacher = 'Rahul';
        ^

TypeError: Assignment to constant variable.
    at Object.<anonymous> (~/project/constants-error.js:2:9)
    ...

Node.js v24.16.0
```

(`~/project` stands for the folder on your computer. The `...` hides a few lines of the stack.) A red error and nothing else printed: node stopped at line 2, so `console.log` on line 3 never ran. In plain words: you tried to give a new value to something that is constant. Above the message node shows the file, the line number and an arrow at the spot. This is a gift: if you change a value by accident, the computer tells you at once.

**The rule professionals follow: always start with `const`. Only if the value really must change later, switch to `let`.** In React code you will see `const` at the start of almost every line. `constants-seats.js`:

```js
const courseTitle = 'React for Beginners';
const teacher = 'Meera';
const price = 499;
let seats = 20;
seats = seats - 1;
console.log(seats);
```

```bash
node constants-seats.js
```

```text
19
```

The title, the teacher and the price never change, so they are `const`. The seats change when Priya enrolls, so that one is `let`.

You may see `var` in older code. It was the only choice before 2015 and has odd habits. Never use it; read it as `let`.

### 6. Template strings

We have `courseTitle` and `lessons` and want one line: `React for Beginners has 12 lessons`. The first way is `+` (`template-plus.js`):

```js
const courseTitle = 'React for Beginners';
const lessons = 12;
console.log(courseTitle + ' has ' + lessons + ' lessons');
```

It works, but look at all those quotes, spaces and plus signs: easy to forget a space, hard to read. The better way is a **template string**: backticks (the key left of the number 1) and `${name}` wherever a value goes (`template-backticks.js`):

```js
const courseTitle = 'React for Beginners';
const lessons = 12;
console.log(`${courseTitle} has ${lessons} lessons`);
```

```bash
node template-plus.js
node template-backticks.js
```

```text
React for Beginners has 12 lessons
React for Beginners has 12 lessons
```

Inside `${ }` you can put any calculation (`template-expressions.js`):

```js
const price = 499;
console.log(`Price: Rs ${price}`);
console.log(`Two seats: Rs ${price * 2}`);
```

```bash
node template-expressions.js
```

```text
Price: Rs 499
Two seats: Rs 998
```

Guess: `template-wrong-quotes.js` uses normal quotes instead of backticks. What does it print?

```js
const price = 499;
console.log('Price: Rs ${price}');
```

```bash
node template-wrong-quotes.js
```

```text
Price: Rs ${price}
```

Only backticks understand the holes. If you ever see a dollar sign in your output, check your quotes. React uses this all the time to build text from data.

### 7. Functions

Three cards, copy, paste, change the values (`cards-repeated.js`):

```js
console.log(`React for Beginners: 12 lessons, Rs 499`);
console.log(`Python from Zero: 20 lessons, Rs 0`);
console.log(`System Design: 25 lessons, Rs 999`);
```

If Asha later wants "lessons in total", she must fix three places. Programmers do not like repeating themselves. A **function** is a named recipe: write it once, use it often. Think of a juice machine: fruit goes in, the machine works, juice comes out.

`price-function.js`:

```js
function finalPrice(price, discount) {
  return price - discount;
}
```

- `function` says "I am making a recipe".
- `finalPrice` is the name we choose.
- `(price, discount)` are the **parameters**: labelled slots for what goes in.
- The curly braces hold the **body**, the work to do. `return` hands the result back.

```bash
node price-function.js
```

Nothing appears. Writing a function is like writing a recipe: it cooks nothing yet. To use it, **call** it: its name, then round brackets with real values, the **arguments** (`price-call.js`):

```js
console.log(finalPrice(499, 100));
```

```bash
node price-call.js
node price-call-2.js
```

```text
399
799
```

The second file calls `finalPrice(999, 200)`: same machine, different fruit. You can also save the result in a variable (`price-pay.js`):

```js
const pay = finalPrice(499, 100);
console.log(`You pay Rs ${pay}`);
```

```bash
node price-pay.js
```

```text
You pay Rs 399
```

Now back to the three cards: one function `describe` with three parameters, and three calls (`describe.js`):

```js
function describe(title, lessons, price) {
  return `${title}: ${lessons} lessons, Rs ${price}`;
}

console.log(describe('React for Beginners', 12, 499));
console.log(describe('Python from Zero', 20, 0));
console.log(describe('System Design', 25, 999));
```

```bash
node describe.js
```

```text
React for Beginners: 12 lessons, Rs 499
Python from Zero: 20 lessons, Rs 0
System Design: 25 lessons, Rs 999
```

If Asha wants to change the sentence, she changes one line and all three cards change.

**The classic mistake: forgetting `return`** (`describe-no-return.js`). The function builds the text but never hands it back:

```bash
node describe-no-return.js
```

```text
undefined
```

`undefined` means "nothing". If your function gives you `undefined`, check that it has a `return`.

### 8. Arrow functions

Functions are so common in React that JavaScript has a shorter way: the **arrow function** (`price-arrow.js`). Step 1: remove the word `function`. Step 2: put `const` in front of the name and `=` after it, so the function is stored in a constant. Step 3: after the round brackets add an arrow, `=>`.

```js
const finalPrice = (price, discount) => {
  return price - discount;
};

console.log(finalPrice(499, 100));
```

Same parameters, same body, same `return`. When the body is just one calculation you can drop the curly braces and the word `return`; the value after the arrow is returned automatically (`price-arrow-short.js`):

```js
const finalPrice = (price, discount) => price - discount;

console.log(finalPrice(499, 100));
```

```bash
node price-arrow.js
node price-arrow-short.js
```

```text
399
399
```

With curly braces you must write `return` yourself. Without curly braces the return is automatic. This short form is what you will see most in React. With one parameter, and with none (`arrows-twice-greet.js`):

```js
const twice = (n) => n * 2;
const greet = () => 'Hello, Lukas!';

console.log(twice(21));
console.log(greet());
```

Guess what they print:

```bash
node arrows-twice-greet.js
```

```text
42
Hello, Lukas!
```

The mistake to know (`price-arrow-no-return.js`): keep the curly braces but forget `return`, and the function gives back `undefined` again.

```js
const finalPrice = (price, discount) => {
  price - discount;
};

console.log(finalPrice(499, 100));
```

```bash
node price-arrow-no-return.js
```

```text
undefined
```

Why arrows, if `function` already works? They are short, and in React we hand small functions to other code all the time.

### 9. Where React uses all of this

These are real lines from the starter project you toured in [M01-L04](../../m01-getting-started/m01-l04-tour-of-your-first-react-app/): `const [count, setCount] = useState(0)` starts with `const` (the square brackets come in the next lesson), and the button runs the arrow function `() => setCount((count) => count + 1)` when clicked.

A component is just a function. Run the tiny project in `react-check/`:

```bash
cd react-check
npm install
npm start
```

```text
> start
> node run.mjs

<h2>React for Beginners</h2>
```

`Card.jsx` is one arrow function that returns a heading: `const CourseCard = () => <h2>React for Beginners</h2>;`. `run.mjs` turns it into plain JavaScript and renders it to HTML text. Almost every line of React is built from three things: `const`, template strings and arrow functions.

## Common mistakes

All of these follow the same method: read the first line of the error, then the file and line number.

**1. A typo in a name** (`error-typo.js`):

```text
~/project/error-typo.js:2
console.log(courseTitel);
            ^

ReferenceError: courseTitel is not defined
```

There is no box with that label. Check the spelling.

**2. Using a box before it exists** (`error-early.js`):

```text
~/project/error-early.js:1
console.log(price);
            ^

ReferenceError: Cannot access 'price' before initialization
```

Fix: create the variable on an earlier line.

**3. Making the same box twice** (`error-twice.js`):

```text
~/project/error-twice.js:2
let price = 399;
    ^

SyntaxError: Identifier 'price' has already been declared
```

Fix: use `let` only once. To change the value later, write the name without `let`.

**And three you already know:** `Assignment to constant variable` (change `const` to `let`), `undefined` from a function (check `return`), a `${...}` in the output (use backticks).

Interview tip. If Rahul, an interviewer, asks the difference between `let` and `const`: both create a variable. `let` can be reassigned, `const` cannot. I use `const` by default and `let` only when the value changes.

## Try it yourself

1. Make a file called `card.js` of your own (use a different folder). Write `const` variables for a title, a teacher and a price, and an arrow function that returns a template string. Run it with node.
2. Change one `const` on purpose and read the error.
3. Write `const double = (n) => n * 2;` and call it with `console.log(double(8))`. What prints?
4. Why does `console.log('3' + 4)` print `34`?

Answers: 3 prints `16`. 4: one side is a string, so `+` glues the pieces together instead of adding.

## Clean up

Delete `react-check/node_modules` and the generated `react-check/Card.mjs` when you are done. Nothing else was created.

## Next

[M02-L02 · Objects, Arrays, Destructuring and Spread](../m02-l02-objects-arrays-destructuring-and-spread/): right now our card needs a separate variable for everything. Next you pack the title, teacher, lessons and price into one object, and four courses into one list.
