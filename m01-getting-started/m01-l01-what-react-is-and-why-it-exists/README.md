# M01-L01 · What React Is and Why It Exists

> Video: Module 1, Lesson 1. Watch it first, then follow along here.

## What you'll learn

- Why updating a page by hand, place by place, is fragile (the "badge bug")
- What a component is: a small, reusable piece of the screen with its own name
- The big idea of React: the screen comes from data, so you change the data and the screen follows
- What React is (a JavaScript library for building user interfaces) and what it is not (a language, a replacement for HTML and CSS, or a full framework)
- How the course is organized, and the three common misunderstandings to avoid

## Key ideas

**The problem.** On the allcsvideos.com course page, Lukas (a student in Frankfurt) clicks **Enroll**. Three places must change together: the button (Enroll becomes Enrolled), the student count (1204 becomes 1205) and the My courses badge at the top (3 becomes 4). With plain JavaScript each place gets its own line of code, written by hand. Forget one line and the page disagrees with its data, with no error message.

**Data is the facts behind a page.** For example "Lukas has 4 courses". In the buggy page the data says 4 but the screen still says 3.

**React fixes this with two ideas.**

1. **Components.** The page is built from small bricks: `Header`, `MyCoursesBadge`, `CourseCard`, `EnrollButton`. You make a brick once and use it many times. Bricks sit inside bricks, and the picture of that nesting is called the **component tree**.
2. **The UI comes from data.** The UI (user interface) is everything on the screen you can see and click. You describe what the screen should look like for the current data. When a click changes the data (`enrolled` becomes `true`), React works out the new screen, compares it with the old one, and updates only the parts that changed.

**One rule to remember:** change the data, and the screen follows.

**What React is:**

- A JavaScript **library** for building user interfaces. A library is a set of ready-made code you add to your project and use when you need it, like a toolbox.
- Not a new language. You write normal JavaScript plus HTML-like markup called **JSX**.
- Not a replacement for CSS. Colors and layout still come from CSS.
- Not a full **framework** (a bigger kit that decides the shape of your whole app). React focuses on the screen. Next.js is a framework built on top of React, and you use it from Module 19.
- Free, open source, created at Facebook (now Meta), first released in 2013. It runs in the browser; React Native uses the same ideas for phone apps.

**The three misunderstandings:**

1. "React is a programming language." No. It is a library, and you still write JavaScript.
2. "React replaces HTML and CSS." No. You still describe the page with HTML-like markup and style it with CSS.
3. "React redraws the whole page on every change." No. It updates only the parts that changed.

**Interview tip.** If Rahul, an interviewer, asks what React is: "A JavaScript library for building user interfaces from reusable components, where the screen is described from the data."

**The course in seven levels:** 1 foundations, 2 real apps (styling, effects, routing), 3 state and data at scale, 4 advanced React (how it works inside, speed), 5 quality (testing, debugging), 6 full-stack apps with Next.js and deployment, 7 interview ready. Every lesson follows the same rhythm: a real-life picture, then the code, then the running page. Before each run you are asked to guess what the screen will show. Pause, guess, then watch.

## Before you start

- Node 24 is needed only for the React demo at the end. Check with `node --version`. If you do not have it yet, Lesson 3 of this module sets everything up, so you can also skip the React demo for now.
- No earlier lesson is needed. This is the first one.
- No Docker needed.
- The two plain-JavaScript demos need only a web browser.

## Files in this folder

| File or folder | What it is |
|----------------|------------|
| `plain/` | The course page with plain JavaScript (the version that works) |
| `plain/index.html` | The page: header, badge, course card, Enroll button |
| `plain/page.css` | The styling |
| `plain/enroll.js` | The click code: one line per place on the page |
| `plain-bug/` | The same page after the "rewrite" where the badge line got lost |
| `plain-bug/enroll.js` | The click code with the badge line missing |
| `enroll-react/` | The same enroll feature written with React, in a Vite project |
| `enroll-react/src/App.jsx` | The three components: `Header`, `CourseCard`, `App` |
| `enroll-react/package.json` | Exact pinned versions: React 19.3.1, Vite 8.3.5 |

## Follow along

You do not need to understand every line today. Components are taught in Module 3, and clicks and changing data in Module 4.

### 1. Open the plain JavaScript page

Open `plain/index.html` in your browser (double-click it, or drag it onto a browser window). You see the allcsvideos header with **My courses 3**, a card "React for Beginners by Meera", **1204 students**, and an **Enroll** button.

Here is the click code, `plain/enroll.js`:

```js
const button = document.querySelector('#enroll');
const count = document.querySelector('#students');
const badge = document.querySelector('#badge');

let students = 1204;
let myCourses = 3;

button.addEventListener('click', () => {
  students = students + 1;
  myCourses = myCourses + 1;
  button.textContent = 'Enrolled';
  count.textContent = students + ' students';
  badge.textContent = myCourses;
});
```

Look at the last three lines: one for the button, one for the count, one for the badge. Each place on the page needs its own hand-written line.

Click **Enroll**. Before and after, the three places show:

```text
before: button "Enroll",   "1204 students", badge "3"
after:  button "Enrolled", "1205 students", badge "4"
```

### 2. Open the buggy version

Months later Asha rewrites this code for a new design, and the badge line gets lost. Open `plain-bug/index.html`. The only difference is in `plain-bug/enroll.js`:

```js
button.addEventListener('click', () => {
  students = students + 1;
  myCourses = myCourses + 1;
  button.textContent = 'Enrolled';
  count.textContent = students + ' students';
});
```

Guess first: after the click, what do the three places show? Then click **Enroll**:

```text
before: button "Enroll",   "1204 students", badge "3"
after:  button "Enrolled", "1205 students", badge "3"
```

The badge still says 3. No error message, nothing crashed. The page simply shows something wrong, and Lukas notices it before Asha does. The variable `myCourses` is 4 (the data), but the screen says 3.

### 3. Run the React version

Now the same feature in React. Open a terminal in this folder:

```bash
cd enroll-react
npm install
npm run dev
```

The dev server prints something like this (the time will differ):

```text
> enroll-react@0.0.0 dev
> vite

  VITE v8.3.5  ready in 89 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open the **Local** address in your browser. Port 5173 is the default; if it is busy, Vite picks another one and prints it.

Before the click the page shows **Enroll**, **1204 students** and **3** in the badge. Guess: when Lukas clicks Enroll, which places change?

Click it. All three places change:

```text
before: button "Enroll",   "1204 students", badge "3"
after:  button "Enrolled", "1205 students", badge "4"
```

Nobody wrote a line to update the count or the badge. They all read the same data, so none of them can be forgotten.

### 4. Read the React code

This is `enroll-react/src/App.jsx`. Look at just three things.

```jsx
import { useState } from 'react'
import './App.css'

function Header({ myCourses }) {
  return (
    <header>
      <b className="logo">allcsvideos</b>
      <span className="badge">My courses <b>{myCourses}</b></span>
    </header>
  )
}

function CourseCard({ enrolled, onEnroll }) {
  return (
    <div className="course">
      <div className="thumb">React</div>
      <h2>React for Beginners</h2>
      <p>by Meera</p>
      <p>{enrolled ? 1205 : 1204} students</p>
      <button onClick={onEnroll}>
        {enrolled ? 'Enrolled' : 'Enroll'}
      </button>
    </div>
  )
}

export default function App() {
  const [enrolled, setEnrolled] = useState(false)
  return (
    <>
      <Header myCourses={enrolled ? 4 : 3} />
      <CourseCard
        enrolled={enrolled}
        onEnroll={() => setEnrolled(true)}
      />
    </>
  )
}
```

1. **Each brick is a function with a name:** `Header` and `CourseCard`. The parts that look like HTML describe the screen. (HTML is the text that describes a web page; the next lesson explains it.)
2. **Each place is written from the data.** The count says: if `enrolled`, show 1205, otherwise 1204. The button text and the badge work the same way.
3. **The data lives in one place:** `enrolled` in `App`, and it starts as `false`. The click does one thing: `setEnrolled(true)`. It never touches the button, the count or the badge.

Compare that with the plain version, where the click had to change all three places by hand.

### 5. Check the build (optional)

Stop the server with `Ctrl+C`, then:

```bash
npm run build
npm run lint
```

The build output (file names with a hash and the time will differ):

```text
vite v8.3.5 building client environment for production...
transforming...
✓ 17 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.48 kB │ gzip:  0.31 kB
dist/assets/index-BkSdGCeL.css    1.09 kB │ gzip:  0.49 kB
dist/assets/index-0DfUOpvy.js   220.26 kB │ gzip: 68.85 kB

✓ built in 946ms
```

`npm run lint` prints only its two header lines, which means it found nothing to complain about.

## Try it yourself

1. Open any website you use. Find its bricks: which pieces repeat, like cards or buttons? Write down three.
2. In `plain/enroll.js`, add a fourth place: a line under the title that says "You are enrolled" after the click. How many lines did you have to add, and where?
3. Fix `plain-bug/enroll.js` by adding the missing badge line. Which line is it?
4. In `enroll-react/src/App.jsx`, change `myCourses={enrolled ? 4 : 3}` to `myCourses={enrolled ? 6 : 5}`. How many lines did you change to move the badge?

Answers are at the bottom of this README.

## Common mistakes

- Thinking React is a language. It is a JavaScript library, and the code in `App.jsx` is JavaScript plus JSX.
- Thinking React replaces HTML and CSS. The page still has markup, and the styling still lives in `App.css`.
- Thinking React redraws the whole page. It updates only what changed. The title, the picture and the logo are not touched when you click Enroll.
- Starting `npm run dev` outside the `enroll-react` folder. You see `npm error enoent Could not read package.json`. Run `cd enroll-react` first.

## Clean up

Stop the dev server with `Ctrl+C`. To remove what `npm install` and `npm run build` created, delete the `enroll-react/node_modules` and `enroll-react/dist` folders. Nothing else was created.

## Next

[M01-L02 · How a Web Page Works](../m01-l02-how-a-web-page-works/): HTML, CSS and JavaScript, and how the browser turns a page into a tree.

## Answers

1. Common answers: product cards, buttons, the header, a list row, the search box.
2. One new line in `enroll.js` (for example `note.textContent = 'You are enrolled'`), plus a `const note = document.querySelector(...)` line at the top, plus an element in `index.html`. Every new place on the page costs another hand-written line.
3. `badge.textContent = myCourses;` at the end of the click function.
4. One line. The badge reads its number from the data you pass to `Header`, so nothing else needs to change.
