# M03-L03 · JavaScript Inside JSX

> Video: Module 3, Lesson 3. Watch it first, then follow along here.

## What you'll learn

- Curly braces as a window from JSX into JavaScript, between tags and inside attributes
- Which things fit in the window: expressions (values, calculations, function calls, template strings, ternaries), not `if` or `for`
- What React shows for text, numbers, `true`, `false`, `null`, `undefined`, lists and objects
- The zero trap with `&&`
- `map` to show a list, and why each item needs a `key`

## Before you start

- Node 24 (`node --version`). [M03-L02](../m03-l02-the-rules-of-jsx/) first. You also use `formatPrice` from [M02-L04](../../m02-javascript-you-need-for-react/m02-l04-modules-import-and-export/), the ternary from [M02-L06](../../m02-javascript-you-need-for-react/m02-l06-short-hand-logic/) and `map` from [M02-L03](../../m02-javascript-you-need-for-react/m02-l03-map-filter-and-friends/).
- The finished project is `allcsvideos-web/` here (`npm install` inside it).
- No Docker needed.

## Files in this folder

| File or folder | What it is |
|----------------|------------|
| `allcsvideos-web/` | The Vite project. `src/App.jsx` is the last version of the lesson (the list with keys) |
| `allcsvideos-web/src/data/courses.js` | The four courses, now each with an `image` |
| `allcsvideos-web/src/price.js` | `formatPrice` from Module 2 |
| `allcsvideos-web/public/thumbs/` | Four small pictures: `react.svg`, `python.svg`, `design.svg`, `devops.svg` |
| `versions/00-typed-by-hand.jsx` to `17-map-with-key.jsx` | `App.jsx` at every step of the video, in order |

To follow a step, copy that file over `allcsvideos-web/src/App.jsx` and look at the browser. Start with `npm run dev` inside `allcsvideos-web/` (port 5173 unless Vite says another).

## Follow along

### 1. The problem: text typed by hand

Asha's card from Lesson 1 works, but the title, the teacher and the lessons are typed by hand inside the JSX (`versions/00-typed-by-hand.jsx`). Next week Meera renames the course, or a new course arrives, and Asha must edit the code every time. In Module 1 you learned the better way: the screen should come from data. The data already exists. The top of the file brings in the courses file and the price function from Module 2:

```jsx
import courses from './data/courses.js'
import { formatPrice } from './price.js'
import './App.css'

export default function App() {
  const course = courses[0]
  return (
    <div className="card">
      <h2>React for Beginners</h2>
      <p>by Meera</p>
      <p>12 lessons</p>
    </div>
  )
}
```

Inside the function, `course` is the first course in the list: `courses[0]`. So the title is `course.title`. Asha types that into the heading (`versions/01-title-as-text.jsx`): `<h2>course.title</h2>`. Guess what the heading shows. Real page:

```text
course.title
```

Exactly the letters Asha typed. No error, no warning. Between two tags, JSX treats everything as plain text, like a printed page. To reach the data we need a way back into JavaScript.

### 2. Curly braces are a window

Picture a printed poster with a small window cut out of it. Everything printed stays as it is, but through the window you see what lies behind it, and that can change. JSX is the poster and curly braces are the window. (You met it in Lesson 2: the comment and the style with double curly braces.) Inside the window you are writing JavaScript. React runs it, takes the value it produces and shows that value.

What fits in the window? It must be an **expression**: any piece of JavaScript that works out to a value. `course.title` works out to a text, `2 + 3` works out to 5, `formatPrice(499)` works out to a text. But an instruction such as `if` or a `for` loop does not work out to a value: it tells the computer what to do. Those do not fit.

### 3. One expression at a time

Put curly braces around `course.title` (`versions/02-title-window.jsx`):

```jsx
<h2>{course.title}</h2>
```

Real page: `React for Beginners`. The text now comes from the data, not from the code. Text and windows mix freely. The plain word `by` is poster text and `course.teacher` is a window (`versions/03-teacher.jsx`):

```jsx
<p>by {course.teacher}</p>
```

Real page: `by Meera`. A number works the same way (`versions/04-lessons.jsx`): `<p>{course.lessons} lessons</p>` shows `12 lessons`.

Calculations are expressions too (`versions/05-seats-calculation.jsx`):

```jsx
<p>2 seats: Rs {course.price * 2}</p>
```

Real page: `2 seats: Rs 998`. A function call is an expression: `formatPrice` from Module 2 (`versions/06-format-price.jsx`):

```jsx
<p>{formatPrice(course.price)}</p>
```

Real page: `Rs 499`, made by the function. And a template string is an expression too (`versions/07-template-string.jsx`). It looks busy but it is the same window:

```jsx
<p>{`${course.lessons} lessons`}</p>
```

The page is exactly the same: `12 lessons`. Two different expressions, one value. The window only cares about the value.

### 4. Windows in attributes

Windows can sit in attributes too: settings on a tag, like the source of a picture. Every course in our data has an `image`. `versions/08-image-and-tag.jsx`:

```jsx
<div className="card">
  <img src={course.image} alt={course.title} />
  <h2>{course.title}</h2>
  <span
    className={course.free ? 'tag free' : 'tag'}
  >
    {course.free ? 'Free' : 'Paid'}
  </span>
</div>
```

`src={course.image}`: no quotes around the braces. `alt` gets `course.title` the same way. A free course should have a green tag and a paid one a grey tag. Remember `className`, not `class`. Its value gets a window with a ternary: if `course.free`, `'tag free'`, otherwise just `'tag'`. The text inside the tag uses the same ternary: `Free` or `Paid`. Windows work both in attributes and between tags.

Real page: the React logo, the title and a grey tag that says `Paid` (React for Beginners is not free). Change the data: in `const course = courses[0]` change the 0 to a 1 (`versions/10-python-course.jsx`). Same code, other course: Python from Zero, its own picture, and a green tag that says `Free`. One number changed and everything followed.

**The mistake to know** (`versions/09-quotes-around-braces.jsx`): quotes around the braces, `src="{course.image}"`. Inside quotes it is plain text again. The browser tries to load a picture named, literally, `{course.image}`. The picture is broken and the alt text shows instead.

**Rule:** for a value from JavaScript use curly braces and no quotes. For fixed text use quotes and no curly braces.

### 5. Only expressions fit: if is not one

Asha wants Free or Paid and she knows `if` and `else`, so she writes them inside the window (`versions/11-if-in-braces-error.jsx`). Guess: will this work?

```jsx
<p>{if (course.free) 'Free' else 'Paid'}</p>
```

No. The page turns into a real error from Vite:

```text
Transform failed with 1 error:

[PARSE_ERROR] Unexpected token
 10 │       <p>{if (course.free) 'Free' else 'Paid'}</p>
    │           ─┬
```

The marker points at the word `if`. The window only fits an expression, something that works out to a value. An `if` is an instruction, not a value, so there is no place for it. The ternary is the fix, the short `if`/`else` that hands back a value (`versions/12-ternary.jsx`):

```jsx
<p>{course.free ? 'Free' : 'Paid'}</p>
```

Real page: `Paid`. The same goes for a `for` loop: it cannot go inside the window either. For lists we use `map`, in a moment. Remember: a window shows an answer. An `if` does not give an answer; a ternary does.

### 6. What does React show for each kind of value?

`versions/13-values-demo.jsx` puts one value in a window per line, between square brackets so you can see where nothing is shown:

```jsx
<p>string: [{'hello'}]</p>
<p>number: [{42}]</p>
<p>true: [{true}]</p>
<p>false: [{false}]</p>
<p>null: [{null}]</p>
<p>undefined: [{undefined}]</p>
<p>array: [{['a', 'b', 'c']}]</p>
```

Guess what appears between the brackets. Real page:

```text
string: [hello]
number: [42]
true: []
false: []
null: []
undefined: []
array: [abc]
```

React draws nothing for `true`, `false`, `null` and `undefined`: a window that holds nothing leaves no trace. A list shows every item one after the other, with no spaces.

Now the trap from M02-L06. A count of zero and `&&` to show a badge only when there is something to show (`versions/14-zero-bug.jsx`):

```jsx
const count = 0
...
<p>bar: [{count && <b>3 new</b>}]</p>
<p>fixed: [{count > 0 && <b>3 new</b>}]</p>
```

Guess what appears in each pair of brackets:

```text
bar: [0]
fixed: []
```

The first shows a zero: zero is a number, and numbers are shown. The second shows nothing because its answer is `false`. **A window must never end up as a bare zero by accident.** Put a comparison on the left: `count > 0`.

One more value: a whole object (`versions/15-object-error.jsx`, `<p>{course}</p>`). The page goes blank and the browser console prints:

```text
Objects are not valid as a React child (found: object with keys {id, title, teacher, lessons, price, free, image}). If you meant to render a collection of children, use an array instead.
```

React cannot guess how to draw a whole object. Say which property you want: `course.title`. A text and a number are fine, a whole object is not.

### 7. Lists with map, and keys

In M02-L03 you met `map`, which turns a list into a new list. A list of JSX items is exactly what React shows. `versions/16-map-without-key.jsx`:

```jsx
export default function App() {
  return (
    <ul>
      {courses.map(c => (
        <li>{c.title}</li>
      ))}
    </ul>
  )
}
```

The window holds `courses.map`. For each course `c` we return a list item with a window of its own, `c.title`. Real page: four list items. But open the console. React prints a warning:

```text
Each child in a list should have a unique "key" prop.
Check the render method of `App`.
```

A **key** is a name tag for each item. It helps React tell the items apart when the list changes. It goes on the outermost tag inside `map`. Add `key={c.id}` (`versions/17-map-with-key.jsx`, also `allcsvideos-web/src/App.jsx`):

```jsx
{courses.map(c => (
  <li key={c.id}>{c.title}</li>
))}
```

```text
React for Beginners
Python from Zero
System Design
DevOps Basics
```

The id is unique for each course, so it is a perfect name tag. Same page, and this time the console is clean. Why keys matter so much is the topic of Module 5. For now: always add a key when you use `map`.

## Common mistakes

- Typing `course.title` without braces: the page shows those exact letters.
- Quotes around the braces (`src="{course.image}"`): a broken picture.
- `if` or `for` inside the window: `Unexpected token`. Use a ternary, or `map`.
- A bare number on the left of `&&`: a lonely `0` on the page.
- Putting a whole object in the window: `Objects are not valid as a React child`.
- `map` without a `key`: a console warning.

## Try it yourself

Show the teacher and the price of the second course, using a ternary for `Free`. (One possible answer: `const course = courses[1]`, then `<p>by {course.teacher}</p>` and `<p>{course.price === 0 ? 'Free' : formatPrice(course.price)}</p>`.)

## Clean up

Press `Ctrl+C` to stop the dev server. If you ran `npm install` in this repo's `allcsvideos-web`, delete its `node_modules` and `dist` folders when you are done.

## Next

[M03-L04 · Props](../m03-l04-props/): instead of one course inside the card, we hand each card its own course.
