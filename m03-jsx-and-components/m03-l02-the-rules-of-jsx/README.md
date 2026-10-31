# M03-L02 · The Rules of JSX

> Video: Module 3, Lesson 2. Watch it first, then follow along here.

## What you'll learn

- What JSX really is: tags that Vite turns into plain JavaScript function calls
- The six rules: one parent, close every tag, `className`, camelCase attributes, `style` takes an object, comments go in curly braces
- How to tell the two kinds of messages apart: the red overlay (stops the page) and console warnings (the page may still work)
- How to fix a pasted HTML page, one error at a time

## Before you start

- Node 24 (`node --version`) and a React project from the earlier lessons. The finished project of this lesson is `allcsvideos-web/` here (`npm install` inside it). [M03-L01](../m03-l01-components-as-lego-bricks/) first.
- No Docker needed.

## Files in this folder

| File or folder | What it is |
|----------------|------------|
| `allcsvideos-web/` | The Vite project; `src/App.jsx` is the finished page, `src/App.css` has its styles, `public/meera.svg` is the picture |
| `variants/page-0-pasted-html.jsx` to `page-5-final.jsx` | `App.jsx` at each step of fixing Asha's pasted page |
| `variants/rule1-*.jsx` to `variants/rule6-*.jsx` | One small `App.jsx` per rule: the mistake and the fix |
| `examples/Greeting.jsx`, `examples/Card.jsx` | The two tiny components used to show what JSX turns into |

To try a variant, copy it over `allcsvideos-web/src/App.jsx` and look at the browser. Start the page with `npm run dev` inside `allcsvideos-web/` (port 5173 unless Vite says another).

## Follow along

### 1. Asha pastes her HTML

Asha wants this page: a header with a "My courses" badge, and a course box with a picture of Meera, the title, the teacher, a seats box, the student count and an Enroll button. She copies the HTML of that page into `App.jsx`, inside `return` (`variants/page-0-pasted-html.jsx`). There is a picture, a seats box and a comment, which the old page did not have:

```jsx
import './App.css'

function App() {
  return (
    <header>
      <b class="logo">allcsvideos</b>
      <span class="badge">My courses 3</span>
    </header>
    <div class="course">
      <img src="/meera.svg" alt="Meera">
      <h2>React for Beginners</h2>
      <p>by Meera<br>12 lessons</p>
      <label for="seats">Seats</label>
      <input id="seats" tabindex="0">
      <p style="color: blue">1204 students</p>
      <!-- enroll button -->
      <button>Enroll</button>
    </div>
  )
}

export default App
```

Guess: the same page, a red error, or a blank page? Copy it over `src/App.jsx` and save. A red error on top of the page:

```text
Transform failed with 1 error:

[PARSE_ERROR] Adjacent JSX elements must be wrapped in an enclosing tag.
   ╭─[ src/App.jsx:9:5 ]
 9 │     <div class="course">
   │     ┬
   │     ╰──
   │ Help: Did you want a JSX fragment `<>...</>`?
```

The arrow points at line 9, the `div`: the `header` ended on line 8, and then a second thing started. This is the first of six rules. JSX looks like HTML, but it is not HTML, and every difference has its own error. At the end of this lesson the same page works.

### 2. What JSX really is

JSX is a way to describe what the screen should look like, using tags, right inside JavaScript. The tags are a friendly costume. Browsers do not understand JSX, so Vite (the translator from M01-L04) turns every JSX file into plain JavaScript first. `examples/Greeting.jsx`:

```jsx
function Greeting() {
  return (
    <h1 className="title">
      Hello, Lukas
    </h1>
  )
}

export default Greeting
```

What Vite really sends to the browser (the extra debugging arguments are elided with `...`):

```js
function Greeting() {
  return _jsxDEV("h1", {
    className: "title",
    children: "Hello, Lukas"
  }, ...);
}
```

The tag became a function call: first the name of the tag as text (`"h1"`), then an object with its settings (`className`, and `children`, which means whatever sits inside the tag). A bigger one, `examples/Card.jsx`: a `div` with a heading and a paragraph is one call whose children are a list of two more calls:

```js
function Card() {
  return _jsxDEV("div", {
    className: "course",
    children: [
      _jsxDEV("h2", { children: "Python" }, ...),
      _jsxDEV("p", { children: "by Meera" }, ...)
    ]
  }, ...);
}
```

You can see the real thing: with the dev server running, open `http://localhost:5173/src/Greeting.jsx` after copying the file into `src/`. So tags are just a friendlier way to type function calls, and that one fact explains every rule:

- A function call hands back exactly one thing, so JSX needs **exactly one parent**.
- Every call needs its closing bracket, so **every tag must be closed**.
- The settings are the keys of an object, so **attribute names follow JavaScript naming**, and **`style` is an object**.

### 3. Rule 1: exactly one parent

A delivery person can carry only one parcel at a time. Two things to deliver go into one box first. The smallest case is a heading and a paragraph side by side (`variants/rule1-two-things-error.jsx`). Save: the same error as in Lesson 1, when the Footer returned two paragraphs (`Adjacent JSX elements must be wrapped in an enclosing tag`).

Fix 1: put them in a `div` (`variants/rule1-div.jsx`). The page works, but look at the real HTML inside the root box:

```html
<div><h2>React for Beginners</h2><p>by Meera</p></div>
```

The `div` is really there: an extra box nobody asked for. Fix 2: a **fragment**, an empty tag `<>` ... `</>`, an invisible bag that holds the two things together and leaves no trace (`variants/rule1-fragment.jsx`):

```jsx
<>
  <h2>React for Beginners</h2>
  <p>by Meera</p>
</>
```

```html
<h2>React for Beginners</h2><p>by Meera</p>
```

The heading and the paragraph sit directly in the root box. Rule of thumb: use a `div` when you need a box (for example to style it); use a fragment when you only need to satisfy the rule.

### 4. Rule 2: every tag must be closed

In HTML the browser is a forgiving teacher: an `img` with no closing partner is understood. Tags like `img`, `br` and `input` never needed one. JSX is a strict translator: every tag becomes a function call and every call needs its closing bracket. `variants/rule2-img-not-closed.jsx` has `<img src="/meera.svg" alt="Meera">`:

```text
Transform failed with 2 errors:

[PARSE_ERROR] Expected corresponding JSX closing tag for 'img'.
   ╭─[ src/App.jsx:8:7 ]
 6 │       <img src="/meera.svg" alt="Meera">
   │        ─┬─
   │         ╰─── Opened here
 8 │     </div>
   │       ─┬─
   │        ╰─── Expected `</img>`
```

In plain words: I found an `img` tag that opened, and never found where it ends. The two labels show where it opened and where the translator expected its end. The line break tag fails the same way (`variants/rule2-br-not-closed.jsx`, `<br>`): the error names `br`, and the extra messages below are only echoes (like in M01-L04): fix the first one and the echoes go away.

The fix is a **self-closing tag**: a slash just before the closing bracket (`variants/rule2-self-closing.jsx`):

```jsx
<img src="/meera.svg" alt="Meera" />
<h2>React for Beginners</h2>
<p>by Meera<br />12 lessons</p>
```

The picture, the title and both lines show. **No exceptions:** even the tags HTML lets you leave open (`img`, `br`, `input`) get a slash.

### 5. Rule 3: class becomes className

`variants/rule3-class.jsx` has `<div class="course">`, exactly as in HTML. No red screen, and the card even looks right. But the browser console (M01-L02) has an error line:

```text
Invalid DOM property `class`. Did you mean `className`?
```

JavaScript already uses the word `class` for something else, and the attributes of a tag become names inside an object. So React uses the name the browser itself uses for this property: `className`. In Lesson 1 and in M01-L04 you typed `className`, and each time the reason was promised for this lesson. The page happens to work with `class` today, but a warning is a warning: always write `className` (`variants/rule3-className.jsx`). The console is then clean.

Checkpoint: one parent (a `div` or a fragment); close every tag, with a slash when it has no content; `className`, not `class`. And the two kinds of messages: a red overlay stops the page, a console warning only complains.

### 6. Rule 4: attribute names are camelCase

camelCase is one word where every new word starts with a capital letter, like the humps of a camel: `className`, `tabIndex`, `htmlFor`. In HTML a label points to its box with `for` and the tab order is `tabindex`, all in small letters. `variants/rule4-for-and-tabindex.jsx` writes them the HTML way. No red screen, but two console errors:

```text
Invalid DOM property `for`. Did you mean `htmlFor`?
Invalid DOM property `tabindex`. Did you mean `tabIndex`?
```

`htmlFor` for the same reason as `className`: `for` is already a JavaScript word (the loops of Module 2). A third example you will use a lot from Module 4: the click handler of a button is spelled `onClick`, with a capital C (Module 4 teaches what it does). Two kinds of names keep their dashes: those starting with `data-` and `aria-`. `variants/rule4-camel-case.jsx`:

```jsx
<div className="course">
  <label htmlFor="seats">Seats</label>
  <input id="seats" tabIndex="0" />
  <button data-id="1" aria-label="Enroll">
    Enroll
  </button>
</div>
```

The console stays clean. Rule of thumb: if a name is made of two words, write it in camelCase. Single words like `id`, `src`, `alt` and `type` stay as they are.

### 7. Rule 5: style takes an object

In HTML you write `style="color: blue"`. Paste that into a paragraph (`variants/rule5-style-string.jsx`). This time the whole page goes blank with no red overlay, because the mistake is not found while translating but while React draws the page. Check the console:

```text
The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.
```

A mapping is an object (M02-L02). The fix (`variants/rule5-style-object.jsx`):

```jsx
<p style={{ color: 'blue' }}>
  1204 students
</p>
```

The outer curly braces mean "JavaScript starts here" (the next lesson explains them). Inside, a second pair holds the object itself. That is why you see double curly braces. The page shows `1204 students` in blue.

A different property (`variants/rule5-font-size.jsx`): `style={{ fontSize: 32 }}`. A plain number means pixels, so you do not write `px`. Property names are camelCase too. Write `background-color` with a dash (`variants/rule5-background-color-dash.jsx`) and JavaScript reads a minus sign:

```text
[PARSE_ERROR] Expected `,` or `}` but found `-`
 6 │       <p style={{ background-color: 'gold' }}>
```

Write `backgroundColor` (`variants/rule5-backgroundColor.jsx`) and the paragraph gets a gold background.

### 8. Rule 6: comments

In JavaScript a comment starts with `//`. Put one between tags (`variants/rule6-slash-comment.jsx`): no error, and that is worse. The page shows the comment as text, right above the title:

```text
// the course title
React for Beginners
```

Between tags, everything is text unless you say otherwise. An HTML comment `<!-- the course title -->` (`variants/rule6-html-comment.jsx`) fails:

```text
[PARSE_ERROR] HTML comments are not allowed in modules
 6 │       <!-- the course title -->
```

The right way (`variants/rule6-jsx-comment.jsx`): curly braces open a door into JavaScript, and a JavaScript comment lives behind it.

```jsx
<div className="course">
  {/* the course title */}
  <h2>React for Beginners</h2>
</div>
```

The page shows only the title.

### 9. All six rules on Asha's page

Paste the whole page back (`variants/page-0-pasted-html.jsx`) and let the errors lead you. Each step below is a file in `variants/`.

1. **Adjacent elements:** a `header` and a `div` have no parent, so wrap everything in a fragment (`page-1-fragment.jsx`). Save. Now 4 errors at once. The first is only an echo; the others say it clearly: `br` was never closed, `input` was never closed, and HTML comments are not allowed.
2. **Close the tags:** a slash for `img`, `br` and `input` (`page-2-closed-tags.jsx`). One error is left: the HTML comment.
3. **Comment:** turn it into `{/* enroll button */}` (`page-3-comment.jsx`). Save. A blank page, so the mistake is in the console. Three errors come first (`class`, `for`, `tabindex`), then the one that stopped the page: `style` must be an object.
4. **Style:** `style={{ color: 'blue' }}` (`page-4-style-object.jsx`). The page is back, but the console still has the three warnings (refresh to see them again): the page works and it complains.
5. **Names:** `className`, `htmlFor`, `tabIndex` (`page-5-final.jsx`). The console is empty. This is the page Asha wanted: the header with its badge, the picture, the title, the teacher and lessons, the seats box, the students in blue, and the Enroll button.

```text
allcsvideos | My courses 3
React for Beginners
by Meera
12 lessons
Seats
1204 students
Enroll
```

This is `allcsvideos-web/src/App.jsx`. Six rules, one page. In Lesson 1 you split a page into files; here we stayed in one file so that we could focus on the rules.

## The cheat sheet

| HTML | JSX |
|------|-----|
| two things side by side | one parent: a `div`, or a fragment `<>...</>` |
| `<img>`, `<br>`, `<input>` | `<img />`, `<br />`, `<input />` |
| `class="x"` | `className="x"` |
| `for="x"`, `tabindex="0"` | `htmlFor="x"`, `tabIndex="0"` |
| `style="color: blue"` | `style={{ color: 'blue' }}` |
| `<!-- comment -->` | `{/* comment */}` |

You met curly braces three times today: in the `style` object, in the comment, and in the error message. Every time they mean "JavaScript lives here". The next lesson is all about them.

Interview tip. If Rahul, an interviewer, asks whether JSX is HTML: no. JSX is syntax that gets translated into function calls that create elements. It looks like HTML, with stricter rules: one parent, closed tags, `className`, camelCase attributes and a `style` object.

## Common mistakes

- Two tags at the top of `return`: wrap them in a fragment.
- Forgetting the slash on `img`, `br` and `input`.
- Writing `class`, `for` or `tabindex`: React only warns in the console, so the page can look fine. Check the console.
- `style="..."` as a string: a blank page and a console error, no red overlay.
- A `//` comment between tags shows up as text on the page.

## Try it yourself

Copy any HTML snippet from a website into `App.jsx` and fix the errors one by one, the way we did today.

## Clean up

Press `Ctrl+C` to stop the dev server. If you ran `npm install` in this repo's `allcsvideos-web`, delete its `node_modules` and `dist` folders when you are done. Nothing else was created.

## Next

[M03-L03 · JavaScript Inside JSX](../m03-l03-javascript-inside-jsx/): curly braces let you put real values, calculations and styles into your markup.
