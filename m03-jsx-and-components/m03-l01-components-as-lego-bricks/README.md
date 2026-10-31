# M03-L01 · Components as LEGO Bricks

> Video: Module 3, Lesson 1. Watch it first, then follow along here.

## What you'll learn

- What a component is in code: a function that returns what the screen should show
- How to build a page one brick at a time: `Header`, `CourseCard`, `Footer`
- How to put each component in its own file with `export default` and `import`
- How one brick used three times gives you one place to edit
- The capital letter rule, and what happens when you break it
- Reading the component tree of an app, and two common mistakes

## Before you start

- Node 24 (`node --version`) and the `allcsvideos-web` project from [M01-L04](../../m01-getting-started/m01-l04-tour-of-your-first-react-app/). The finished project of this lesson is the `allcsvideos-web` folder here, if you want to compare or start from it (`npm install` inside it).
- Module 2 helps: functions, `return`, `export` and `import` (see [M02-L04](../../m02-javascript-you-need-for-react/m02-l04-modules-import-and-export/)).
- No Docker needed.

## Files in this folder

| File or folder | What it is |
|----------------|------------|
| `allcsvideos-web/` | The project at the end of the video: `Header`, `CourseCard` (with an Enroll button), `Footer`, and an `App` that uses three cards |
| `allcsvideos-web/src/index.css` | The styles for the page (header bar, cards, button, footer) |
| `allcsvideos-web/src/components/` | `Header.jsx`, `CourseCard.jsx`, `Footer.jsx` |
| `stages/01-blank-app.jsx` to `04-header-card-footer.jsx` | `App.jsx` as you build it brick by brick, all in one file |
| `stages/05-one-big-function.jsx` | Asha's beginner way: one big function, the card written out three times |
| `stages/06-app-with-imports.jsx`, `06b-CourseCard-no-button.jsx` | `App.jsx` with imports, and the card before the button is added |
| `stages/07-three-cards.jsx` | `App.jsx` with three `<CourseCard />` tags |
| `stages/08-lowercase-tag.jsx` | Mistake: a lowercase tag name |
| `stages/09-CourseCard-with-button.jsx` | `CourseCard.jsx` with the Enroll button |
| `stages/10-Footer-two-paragraphs.jsx`, `11-Footer-no-export.jsx` | Two broken versions of `Footer.jsx` |

To follow along in your own project, copy `allcsvideos-web/src/index.css` over yours (the video has these styles ready) and edit `src/App.jsx` step by step. Run `npm run dev` in the project folder (port 5173 unless Vite picks another one and tells you).

## Follow along

### 1. The page we will build

The allcsvideos home page: a blue header, three course cards (each with an Enroll button) and a footer. Now imagine Asha writes it the beginner way: one big function with the card written out three times (`stages/05-one-big-function.jsx`):

```jsx
function App() {
  return (
    <main className="page">
      <header className="header">
        <h1>allcsvideos</h1>
        <p>Learn to code with videos</p>
      </header>
      <div className="card">
        <h2>React for Beginners</h2>
        <p>by Meera</p>
        <p>12 lessons</p>
        <p>Rs 499</p>
      </div>
      <div className="card">
        <h2>React for Beginners</h2>
        <p>by Meera</p>
        <p>12 lessons</p>
        <p>Rs 499</p>
      </div>
      <div className="card">
        <h2>React for Beginners</h2>
        <p>by Meera</p>
        <p>12 lessons</p>
        <p>Rs 499</p>
      </div>
      <footer className="footer">
        <p>Made by Asha and Meera</p>
      </footer>
    </main>
  )
}

export default App
```

Copy, paste, change the values: the problem from Module 2, Lesson 1. Now the manager says "put an Enroll button on every card". How many places must Asha edit? Three. With ten cards, ten. If she misses one, that card looks different, the forgotten badge line from M01-L01 all over again.

React's answer: write the card once, give it a name, and use that name wherever a card is needed. That is a **component**. The page ends up the same (the video compared the two real screenshots pixel by pixel), but now there is one place to edit.

### 2. A component is a function

A component is a small reusable piece of the screen with its own name. In code it is a **function** (Module 2, Lesson 1) that takes something in and gives back a description of what the screen should show. `Header`:

```jsx
function Header() {
  return (
    <header className="header">
      <h1>allcsvideos</h1>
      <p>Learn to code with videos</p>
    </header>
  )
}
```

`return` is the answer the function gives back. What follows looks like HTML; in React it is called **JSX** (the next lesson teaches its rules). For today, read it as "this is what the screen should show". The function's name, `Header`, is the brick's name, and it starts with a capital letter. So: a component is a function, its name starts with a capital letter, and it returns what the screen should show.

### 3. Build the page, brick by brick

Make `App.jsx` as small as possible: `App` returns one empty `main` tag (`stages/01-blank-app.jsx`). The page is blank.

```jsx
function App() {
  return <main className="page"></main>
}

export default App
```

`App` is a component too: the biggest brick, the one that `main.jsx` draws (M01-L04).

**Brick one: Header.** Above `App`, type `function Header` as above. To use the brick, write its name inside `App` like a tag: `<Header />`, a tag that closes itself (`stages/02-header.jsx`):

```jsx
function App() {
  return (
    <main className="page">
      <Header />
    </main>
  )
}
```

Guess what the page shows. The blue header is there, and nothing else yet. React called the function `Header`, took what it returned, and drew it where the tag stands.

**Brick two: CourseCard.** Same shape: a function, a `return`, and markup with the title, the teacher, and the lessons and price. For now the words are typed right inside; Lesson 4 makes each card different. Use `<CourseCard />` in `App`, under the `Header` (`stages/03-header-and-card.jsx`). The card appears.

```jsx
function CourseCard() {
  return (
    <div className="card">
      <h2>React for Beginners</h2>
      <p>by Meera</p>
      <p>12 lessons</p>
      <p>Rs 499</p>
    </div>
  )
}
```

**Brick three: Footer.** Seven short lines and one tag in `App`, below the card (`stages/04-header-card-footer.jsx`):

```jsx
function Footer() {
  return (
    <footer className="footer">
      <p>Made by Asha and Meera</p>
    </footer>
  )
}

function App() {
  return (
    <main className="page">
      <Header />
      <CourseCard />
      <Footer />
    </main>
  )
}
```

The page has grown one brick at a time: three functions, each used like a tag. (You may have spotted `className`: it attaches a style to a tag. Lesson 2 explains why it is not just `class`.)

### 4. One file per component

One file holding every brick gets long. Real projects put each component in its own file, with the tools from Module 2, Lesson 4: `export` and `import`. Inside `src`, make a folder `components` with one file for each brick: `Header.jsx`, `CourseCard.jsx` and `Footer.jsx`. In `Header.jsx` move the function `Header` and add one line at the end:

```jsx
function Header() {
  return (
    <header className="header">
      <h1>allcsvideos</h1>
      <p>Learn to code with videos</p>
    </header>
  )
}

export default Header
```

The other two files look the same: the function, a blank line, and `export default` (use `stages/06b-CourseCard-no-button.jsx` for `CourseCard.jsx` at this point, and `allcsvideos-web/src/components/Footer.jsx`). Back in `App.jsx`, three imports, one per file (`stages/06-app-with-imports.jsx`):

```jsx
import Header from './components/Header.jsx'
import CourseCard from './components/CourseCard.jsx'
import Footer from './components/Footer.jsx'

function App() {
  return (
    <main className="page">
      <Header />
      <CourseCard />
      <Footer />
    </main>
  )
}

export default App
```

A default import has no curly braces and you pick the name. **The name you pick is the name you use as the tag.** Now `App` only describes the page. Guess what changes on the screen when you save: nothing. Moving code into other files changes how the code is organized, not what the page shows.

Recap: a component is a function that returns markup. It lives in its own file with `export default`. You import it and use it like a tag.

### 5. Reuse: one brick, three cards, one edit

Need three cards? Write the tag three times (`stages/07-three-cards.jsx`):

```jsx
<Header />
<CourseCard />
<CourseCard />
<CourseCard />
<Footer />
```

Guess how many cards the page shows and which courses. Three cards, all three showing React for Beginners: each tag is a separate use of the same brick, and the words are typed inside the brick. That is on purpose for today. In Lesson 4 you hand each card its own course.

Now the manager's request: open `CourseCard.jsx` and add a button (`stages/09-CourseCard-with-button.jsx`):

```jsx
function CourseCard() {
  return (
    <div className="card">
      <h2>React for Beginners</h2>
      <p>by Meera</p>
      <p>12 lessons</p>
      <p>Rs 499</p>
      <button className="btn">
        Enroll
      </button>
    </div>
  )
}

export default CourseCard
```

Save. All three cards have the button: one edit, one place. No copy can be forgotten, because there is only one copy of the card. That is the idea from M01-L01: write a piece once, reuse it everywhere, change it in one place.

### 6. The capital letter rule

Why does `CourseCard` start with a capital C? React looks at the first letter of a tag. **A small letter means a built-in HTML tag** (`div`, `p`, `header`). **A capital letter means one of your own components**, a function. Let's break it: in `App.jsx` change only the first card tag to `<courseCard />` (`stages/08-lowercase-tag.jsx`). The other two stay.

Guess: how many cards, a red error screen, and what in the console? Real result:

```text
cards on the page:  2
red error screen:   none
console (2 errors):
  <%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements. courseCard
  The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter. courseCard
```

Two cards and no red screen: one card is simply missing, a quiet bug. React saw a small letter, treated `courseCard` as an HTML tag and put it into the page. The browser does not know any such tag and shows nothing. The fix: a capital C. The rule: a component's name starts with a capital letter (PascalCase: every word starts with a capital, no spaces). If a piece of your page is missing and there is no error screen, check the capital letters and open the console.

### 7. The component tree

Draw the real component tree straight from the code. At the top is `App`, drawn by `main.jsx`. `App` returns a `Header`, three `CourseCard`s and a `Footer`, so it has five children. The `main` tag is not in the tree: it starts with a small letter, so it is plain HTML, not one of our bricks. The same brick used three times is three places in the tree; each is its own copy and none knows about the others.

```text
App
├── Header
├── CourseCard
├── CourseCard
├── CourseCard
└── Footer
```

A good habit: whenever you read a React app, ask first "what is the tree?".

## Common mistakes

**1. Returning two things side by side.** `stages/10-Footer-two-paragraphs.jsx` returns two `<p>` tags with nothing around them. Copy it over `src/components/Footer.jsx` and save: the red screen from M01-L04.

```text
Transform failed with 1 error:

[PARSE_ERROR] Adjacent JSX elements must be wrapped in an enclosing tag.
   ╭─[ src/components/Footer.jsx:4:5 ]
   │
 4 │     <p>allcsvideos.com</p>
```

A component can give back only one thing. The fix is one outer tag around everything, like the `footer` tag in the real `Footer`. The next lesson teaches this properly.

**2. Forgetting `export default`.** In `stages/11-Footer-no-export.jsx` the last line is missing. The page goes blank (after a refresh) and there is no red screen. The console says:

```text
SyntaxError: The requested module '/src/components/Footer.jsx' does not provide an export named 'default'
```

You know this from M02-L04: the file exports nothing, so `App` has nothing to import. (While the page is still open Vite may instead print `require is not defined` and `Failed to reload`, then show the error above after a refresh.) Put the line back and the page returns.

Interview tip. If Rahul, an interviewer, asks what a component is: a function that returns what the screen should show, whose name starts with a capital letter, and that you use like a tag.

## Try it yourself

In your own project make a component called `Banner`, put it in its own file, and use it twice. Then rename the tag to lowercase and read the console.

## Clean up

Press `Ctrl+C` to stop the dev server. If you ran `npm install` in this repo's `allcsvideos-web`, delete its `node_modules` and `dist` folders when you are done. Put your own project back to the version you need for the next lesson (the finished project here is a good start).

## Next

[M03-L02 · The Rules of JSX](../m03-l02-the-rules-of-jsx/): why `className`, why one parent, and what JSX really turns into.
