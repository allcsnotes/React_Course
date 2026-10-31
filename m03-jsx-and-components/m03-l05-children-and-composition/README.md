# M03-L05 · Children and Composition

> Video: Module 3, Lesson 5. Watch it first, then follow along here.

## What you'll learn

- `children`: the special prop that holds whatever you write between a component's opening and closing tags
- Wrapper components (`Card`, `Layout`, `Panel`) that draw a frame once
- Composition (passing pieces in) against configuration (adding more and more props)
- A second "hole" is just another prop that holds JSX, like `footer`
- What `children` can be: a string, an element, a list of elements, or `undefined`
- The mistake of forgetting to put `children` in the return

## Before you start

- Node 24 (`node --version`). [M03-L04](../m03-l04-props/) first (props), and Lesson 3 for `map` and curly braces.
- The finished project is `allcsvideos-web/` here (`npm install` inside it).
- No Docker needed.

## Files in this folder

| File or folder | What it is |
|----------------|------------|
| `allcsvideos-web/` | The Vite project at the end of the video: a `Card` that wraps a paragraph |
| `allcsvideos-web/src/index.css` | The styles (blue title bar, white body, rounded border) |
| `allcsvideos-web/src/Card.jsx`, `App.jsx`, `courses.js` | The final `Card`, a page using it, and the four courses |
| `versions/00-blank-page/` to `08b-fixed/` | One folder per step of the video, each with the files it needs |

To follow a step, copy every file of that folder into `allcsvideos-web/src/` (overwrite what is there) and look at the browser. Run `npm run dev` inside `allcsvideos-web/` (port 5173 unless Vite says another).

## Follow along

### 1. The same frame, three times

Three boxes on Asha's page: a course, a note from a student and an announcement. Each box has the same blue title bar, the same white body and the same rounded border. Only the words inside change. A component can draw that frame, and props (Lesson 4) can fill in the title. But what goes inside the box is not one small value; it is a piece of the page: a line of text, a button, a whole list. The answer is a prop with a special name, **`children`**, and a way of building pages called **composition**.

`versions/01-repeated-boxes/App.jsx` shows the problem in real code:

```jsx
export default function App() {
  return (
    <div className="page">
      <div className="card">
        <h2>Python from Zero</h2>
        <p>by Meera</p>
      </div>
      <div className="card">
        <h2>Student note</h2>
        <p>Priya finished lesson 3.</p>
      </div>
      <div className="card">
        <h2>Announcement</h2>
        <p>New batch on Monday.</p>
      </div>
    </div>
  )
}
```

The same lines three times; only the words change. With forty boxes and a designer who says "make the title bar green" you would fix forty places and miss one. The cure is a component: write the frame once. But this frame has a hole in the middle, and something different goes into the hole every time. The name for that hole is `children`.

### 2. The gift box

A gift box is always the same: same size, same ribbon. The gift inside changes. A **wrapper component** is that box: it draws the frame, the title bar and the border, and the gift is whatever you write between its opening and closing tags. It arrives inside the component, in the place the component chooses. That gift is called `children`. (You met the word in the browser tree in M01-L02 and the component tree in Lesson 1: the children of something are what sits directly inside it.)

`versions/02-card-logs-props/Card.jsx`, with a `console.log` so we can see what arrives:

```jsx
function Card(props) {
  console.log(props)
  return (
    <div className="card">
      <h2>{props.title}</h2>
      <div className="body">
        {props.children}
      </div>
    </div>
  )
}

export default Card
```

The frame is a `div` with a title in an `h2` and a second `div` with `props.children` in curly braces. That line is the hole. `App.jsx` uses it with an opening and a closing tag, not a self-closing one:

```jsx
<Card title="Python from Zero">
  <p>by Meera</p>
</Card>
<Card title="Student note">
  <p>Priya finished lesson 3.</p>
</Card>
<Card title="Announcement">
  <p>New batch on Monday.</p>
</Card>
```

The paragraph between the tags is the gift. Guess what `props` contains for the first card. The page shows three cards, the same frame with different gifts, and the console printed:

```text
{title: Python from Zero, children: Object}
{title: Python from Zero, children: Object}
{title: Student note, children: Object}
...
```

An object with two things: `title`, a string, and `children`. `children` is not text here: it is a React element, the paragraph described as a small object, with its type `p` and its own props that hold the text `by Meera`. (Each message appears twice: React calls components twice in development to catch mistakes; Module 7 explains it. From now on each message is shown once.)

So `children` is just a prop, filled in for you by whatever you write between the tags. You never write `children=` yourself. Because it is a prop you can pick it out in the round brackets, as in Lesson 4 (`versions/03-card-destructured/Card.jsx`):

```jsx
function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="body">{children}</div>
    </div>
  )
}
```

The same page, shorter code, and the console is quiet again.

### 3. Layout: a wrapper for a whole page

Think of any website: going from page to page, the top bar and the bottom bar stay and only the middle changes. That wrapper is a **Layout** (`versions/04-layout/Layout.jsx`):

```jsx
function Layout({ children }) {
  return (
    <div className="layout">
      <header>allcsvideos</header>
      <main>{children}</main>
      <footer>allcsvideos.com</footer>
    </div>
  )
}

export default Layout
```

`Layout` has no `title` prop; it has only a hole. `App.jsx` nests everything:

```jsx
import Layout from './Layout.jsx'
import Card from './Card.jsx'
import { courses } from './courses.js'

export default function App() {
  return (
    <Layout>
      {courses.map(c => (
        <Card key={c.id} title={c.title}>
          <p>by {c.teacher}</p>
          <p>{c.lessons} lessons</p>
        </Card>
      ))}
    </Layout>
  )
}
```

Read it like nesting dolls: the `Layout` holds the cards, each `Card` holds paragraphs. The page shows the top bar, four cards made from the course list, and the bottom bar:

```text
allcsvideos
React for Beginners | by Meera | 12 lessons
Python from Zero | by Meera | 20 lessons
System Design | by Rahul | 25 lessons
DevOps Basics | by Asha | 15 lessons
allcsvideos.com
```

Neither `Layout` nor `Card` knows anything about courses. Each only draws a frame. Tomorrow, Asha makes a lesson page and wraps it in the same `Layout`: change the header once and every page changes.

The component tree before and after:

```text
before:                          after:
App                              App
├── div.card (own frame)         └── Layout
├── div.card (own frame)             ├── Card
└── div.card (own frame)             │   └── p
                                     ├── Card ...
                                     └── Card ...
```

Watch the gift travel: the paragraph is written in `App`, handed to the `Card` as `children`, and the `Card` puts it in its hole. The wrapper sits between the parent and the content and passes the content on. The frame code now lives in only two places: `Layout` and `Card`.

### 4. Configuration is a trap, composition is the cure

Another way to make a `Card` flexible is a trap. Asha wants a badge in some cards, so she adds a prop to switch the badge on. Then a button. Then a note. `versions/05-config-with-many-props/CourseBox.jsx` runs for real, with seven props:

```jsx
function CourseBox({
  title,
  subtitle,
  badgeText,
  showBadge,
  buttonText,
  showButton,
  note,
}) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="body">
        <p>{subtitle}</p>
        {showBadge && <span className="badge">{badgeText}</span>}
        {showButton && <button>{buttonText}</button>}
        <p>{note}</p>
      </div>
    </div>
  )
}
```

Using it takes seven lines (`title`, `subtitle`, `badgeText`, `showBadge={true}`, `buttonText`, `showButton={true}`, `note`). Every new request means one more prop and one more `if` inside the component. It works, but the component only grows. This is called **configuration**.

Now the same page with composition (`versions/05b-composition/App.jsx`). The `Card` stays exactly as simple as before:

```jsx
<Card title="Python from Zero">
  <p>by Meera</p>
  <span className="badge">Free</span>
  <button>Enroll</button>
  <p>20 lessons</p>
</Card>
```

The very same page (`Python from Zero | by Meera | FreeEnroll | 20 lessons`), and the `Card` did not change at all. That is **composition**: instead of adding more and more props to one big component, you pass the pieces in and the wrapper only gives the frame. Small components, put together like the LEGO bricks of Lesson 1. A good rule: if you catch yourself adding `show...` props, ask "could this be children?".

### 5. A second hole: a named prop

What if a box needs two holes: a title bar, a body and a footer with a button? `children` is only one hole. A prop can hold a piece of the page too: put the JSX in curly braces (Lesson 3) and pass it like any other prop. So a second hole is just another prop. `versions/06-panel-two-holes/Panel.jsx`:

```jsx
function Panel({ title, footer, children }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <div className="body">{children}</div>
      {footer && (
        <div className="foot">{footer}</div>
      )}
    </section>
  )
}
```

`{footer && (...)}` is the shortcut from M02-L06: draw the footer only if there is one. Using it:

```jsx
<Panel
  title="Python from Zero"
  footer={<button>Enroll</button>}
>
  <p>by Meera · 20 lessons</p>
</Panel>
<Panel title="Announcement">
  <p>New batch on Monday.</p>
</Panel>
```

The big gift goes between the tags; the small piece goes into a named prop. The first panel has its Enroll button in the footer; the second has no `footer` prop, and no empty strip either:

```text
Python from Zero | by Meera · 20 lessons | Enroll
Announcement | New batch on Monday.
```

The rule: one hole, `children`, for the main content. Any extra hole is a normal prop with a name that says what it is: `footer`, `header`, `sidebar`, `icon`.

### 6. What can children be?

It depends on what you write between the tags. `versions/07-kinds-of-children/` prints `children` in the `Card` (`console.log(children)`) and uses four cards:

```jsx
<Card title="A string">
  Just some text
</Card>
<Card title="One element">
  <p>by Meera</p>
</Card>
<Card title="Two elements">
  <p>by Meera</p>
  <button>Enroll</button>
</Card>
<Card title="Nothing" />
```

Guess what the console prints for the last one, with nothing inside. The page shows four cards; the last has only its title bar and an empty body, with no error and no warning. The console:

```text
Just some text
{$$typeof: Symbol(react.transitional.element), type: p, key: null, props: Object, _owner: FiberNode}
[Object, Object]
undefined
```

Plain text: a string. One paragraph: one React element. A paragraph and a button: an array holding two elements. Nothing between the tags: `undefined`. (Each line appears twice in development.) So `children` can be a string, an element, a list of elements or `undefined`, and in all four cases `{children}` does the right thing. You do not need to check anything.

## Common mistakes

**Forgetting to put `children` in the return** (`versions/08-forgot-children/Card.jsx`). Asha takes `children` in the round brackets and forgets to use it:

```jsx
function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
    </div>
  )
}
```

The card shows only its title (`Python from Zero`). The paragraph is gone, with no error and no warning. React received the paragraph; the `Card` never drew it. The fix (`versions/08b-fixed/`): put `{children}` in the frame exactly where the hole should be. The page then shows `Python from Zero | by Meera`. If a gift disappears, look inside the wrapper for `children`.

Interview tip. If Rahul, an interviewer, asks "what is `children` in React?": a special prop that holds whatever is written between a component's opening and closing tags. It lets one component wrap different content, and it is the base of composition.

## Try it yourself

Write a `Banner` component with a `title` and `children`. Then wrap two different things in it: a paragraph, and a button.

## Clean up

Press `Ctrl+C` to stop the dev server. If you ran `npm install` in this repo's `allcsvideos-web`, delete its `node_modules` and `dist` folders when you are done.

## Next

[M03-B01 · Build a Course-Card Gallery](../m03-b01-build-a-course-card-gallery/): the first build of the course. You put components, JSX, curly braces, lists, props and children together and build the allcsvideos course-card gallery from the course data.
