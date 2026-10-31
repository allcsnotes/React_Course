# M03-B01 · Build a Course-Card Gallery

> Video: Module 3, Build 1. Watch it first, then follow along here.

Until now each lesson taught one idea. This build puts them all together: components, props, curly braces, `map`, `children` and keys, to build a real piece of the allcsvideos website from the course data.

## What you'll learn

- How to sketch a screen, cut it into components on paper, and decide where the data lives
- How to build in small steps and check each one in the browser and the console
- A data file, a small helper, and four components: `Tag`, `CourseCard`, `Gallery`, `Layout`
- Why a typo in a prop name is silent and a missing `key` is only a warning
- What would break in production, and two extensions to try yourself

## Before you start

- Node 24 (`node --version`). All of Module 3, Lessons [01](../m03-l01-components-as-lego-bricks/) to [05](../m03-l05-children-and-composition/).
- The finished project is `allcsvideos-web/` here. To build it yourself, start from a fresh Vite React project (as in [M01-L03](../../m01-getting-started/m01-l03-setting-up-your-tools/)) and clean the starter (step 0).
- No Docker needed.

## Files in this folder

| File or folder | What it is |
|----------------|------------|
| `allcsvideos-web/` | The finished project (run it with `npm install` then `npm run dev`) |
| `allcsvideos-web/src/App.jsx` | The biggest brick: `Layout` holding `Gallery` |
| `allcsvideos-web/src/components/` | `Tag.jsx`, `CourseCard.jsx`, `Gallery.jsx`, `Layout.jsx` |
| `allcsvideos-web/src/data/courses.js` | The four courses (the only home of the data) |
| `allcsvideos-web/src/utils/formatPrice.js` | The small price helper from Module 2 |
| `allcsvideos-web/src/index.css` | The styles |
| `allcsvideos-web/public/thumbs/` | Four small pictures |
| `edits/01-...` to `edits/23-...` | The numbered snapshots from the video: each file is what a file looked like at that step, including the mistakes and the two extensions. The name says which file it replaces |

## Run it

```bash
cd allcsvideos-web
npm install
npm run dev
```

Open the address Vite prints (port 5173 unless busy). You see the finished page: a white header with the logo on the left and a "My courses" badge on the right; a heading "All courses" with the line `4 courses, 72 lessons`; four cards in a row; and a footer `© 2026 allcsvideos.com`. The two free courses, Python from Zero and DevOps Basics, have a green FREE tag, and their price line says `Free`.

```text
allcsvideos | My courses
All courses
4 courses, 72 lessons
React for Beginners | by Meera | 12 lessons | Rs 499
Python from Zero    | by Meera | 20 lessons | Free      (FREE tag)
System Design       | by Rahul | 25 lessons | Rs 999
DevOps Basics       | by Asha  | 15 lessons | Free      (FREE tag)
© 2026 allcsvideos.com
```

The build checks (`npm run build` and `npm run lint`) pass with no warnings or errors.

## Build it step by step

### The plan

First a sketch of the screen. Then cut it into components, on paper. Then decide where the data lives. Then write the code one small step at a time and check each step. At the end, ask what would break in production.

**The mockup.** A bar at the top with the logo on the left and a "My courses" badge on the right. Under it a heading and a line that counts the courses. Then a row of cards. A footer at the bottom. Every card has a small picture and the same four facts: title, teacher, number of lessons, price. If the course is free the price says `Free` and the card gets a small green tag. The data is the list from Module 2: each course has `id`, `title`, `teacher`, `lessons`, `price`, `free` and an `image` path.

Checklist: a header with the logo and the badge; a heading with a count; one card per course; a FREE tag on free courses; a footer.

**Cut the sketch into bricks.**

- The frame of the page with a hole in the middle is a wrapper (Lesson 5): `Layout`.
- The section with the heading, the count and the cards: `Gallery`.
- One card, four copies for four courses: `CourseCard`.
- The little green label, a brick of its own: `Tag`.

```text
App
└── Layout
    └── Gallery
        ├── CourseCard  (may hold a Tag)
        ├── CourseCard
        ├── CourseCard
        └── CourseCard
```

A rule of thumb: one component, one job; one component, one file. Folders: `components/` (four files), `data/` (the course list), `utils/` (the price helper).

**Where does the data live?** Data flows down through props. The list has one home, `courses.js`, and only `App` imports it. `App` hands the whole list to `Gallery` as the prop `courses`. `Gallery` uses `map` to make one `CourseCard` per course and hands each the prop `course`. `CourseCard` hands just a word to `Tag` as the prop `text`. `Layout` receives no data: it receives the `Gallery` as its `children`. Nobody in the middle keeps a copy: change the file and the page changes (UI from data, Module 1). Data that changes while the page is open comes in Module 4.

### Step 0: a fresh project

Create the project as in Module 1 and clean the starter: delete the demo files (`App.css`, `assets/`), and replace `src/index.css` with a few lines that only set the text size and the picture size (`edits/16-index-0-text-size.css`):

```css
body {
  margin: 24px;
  font: 21px system-ui;
}
img { width: 44px; }
```

Put a placeholder in `src/App.jsx` (`edits/01-App-placeholder.jsx`): `function App() { return <p>Nothing here yet</p> }` with `export default App`. The page shows `Nothing here yet`.

### Step 1: the data and the helper

`src/data/courses.js` is a constant `courses` holding a list of objects, and on the last line `export default courses`. This is the first course (the other three have the same shape; see the real file):

```js
const courses = [
  {
    id: 1,
    title: 'React for Beginners',
    teacher: 'Meera',
    lessons: 12,
    price: 499,
    free: false,
    image: '/thumbs/react.svg',
  },
  // ... the other three courses, same shape
]

export default courses
```

`src/utils/formatPrice.js` (from Module 2): if the price is exactly zero, give back the word `Free`, otherwise `Rs` and the price.

```js
function formatPrice(price) {
  return price === 0 ? 'Free' : `Rs ${price}`
}

export default formatPrice
```

It asks a real yes/no question (`price === 0`). Remember that care: we use the same in the card. Nothing changes on the page yet; data and helpers have no picture of their own. `formatPrice(0)` gives `Free`, `formatPrice(499)` gives `Rs 499`, `formatPrice(999)` gives `Rs 999`.

### Step 2: the Tag, the smallest brick

`src/components/Tag.jsx` (`edits/02-Tag.jsx`): a function with one prop `text`, returning a `span` with the class `tag`.

```jsx
function Tag({ text }) {
  return (
    <span className="tag">{text}</span>
  )
}

export default Tag
```

To see it, put it in `App` for a moment (`edits/03-App-shows-Tag.jsx`):

```jsx
import Tag from './components/Tag'

function App() {
  return <Tag text="FREE" />
}

export default App
```

The page shows `FREE`, plain for now: the styles come last.

**A real mistake.** In `App`, mistype the prop name: `<Tag txt="FREE" />` (`edits/04-App-prop-typo.jsx`). Guess what the page shows and whether there is an error. The page is blank, with no error and no warning in the console. The real HTML is an empty span:

```html
<span class="tag"></span>
```

`Tag` asked for a prop called `text`. Nobody gave it, so `text` is `undefined`, and React draws nothing for `undefined`. **A typo in a prop name is silent.** When some text disappears, check the prop names first. Fix the typo and the label is back.

### Step 3: the CourseCard

`src/components/CourseCard.jsx` takes one prop, `course`, the whole object. First without the tag (`edits/06-CourseCard-no-tag.jsx`):

```jsx
import formatPrice from '../utils/formatPrice'

function CourseCard({ course }) {
  return (
    <div className="card">
      <img src={course.image} alt="" />
      <h3>{course.title}</h3>
      <p>by {course.teacher}</p>
      <p>{course.lessons} lessons</p>
      <p>{formatPrice(course.price)}</p>
    </div>
  )
}

export default CourseCard
```

Every value comes from the `course` object: a dot, and curly braces put it into the markup (Lesson 3). The `..` in the import climbs out of the `components` folder. For now `App` shows only the first course (`edits/07-App-first-course.jsx`: `<CourseCard course={courses[0]} />`). Save:

```text
React for Beginners | by Meera | 12 lessons | Rs 499
```

**Another real mistake** (`edits/08-CourseCard-price-typo.jsx`): mistype `course.prise`. Guess what the price line says. `Rs undefined`:

```text
React for Beginners | by Meera | 12 lessons | Rs undefined
```

Not an empty line this time: the ternary found a price that is not zero, so it built the text `Rs` and `undefined`. A name that does not exist gives `undefined`. Read the data names slowly.

Now the FREE tag (`edits/09-CourseCard-with-tag.jsx`): import `Tag` and add one line at the top of the card:

```jsx
{course.free && <Tag text="FREE" />}
```

This is the shortcut from M02-L06: if `free` is true the right side is drawn, if false nothing is drawn. `free` is a real `true`/`false`, not a number. Had we written `course.price && <Tag />`, the free courses would print a lonely zero. Show the second course in `App` (`edits/10-App-second-course.jsx`, `courses[1]`). Guess what is different from the first card:

```text
FREE | Python from Zero | by Meera | 20 lessons | Free
```

The tag is there and the price line says `Free`. Both come from the data: `free` is `true` and the price is `0`.

### Step 4: the Gallery

`src/components/Gallery.jsx` takes one prop, `courses`. Before the markup, two small facts: the total lessons (with `reduce`, M02-L03, starting at zero) and the count (the length of the list). The markup: a `section` with a heading, a paragraph with both numbers, and a `div` with the class `grid` holding `courses.map(...)`.

First without a key (`edits/11-Gallery-no-key.jsx`, with `edits/12-App-shows-Gallery.jsx` that gives `App` just `<Gallery courses={courses} />`):

```jsx
<div className="grid">
  {courses.map(c => (
    <CourseCard course={c} />
  ))}
</div>
```

Save. The cards stand one under the other and the paragraph says `4 courses, 72 lessons` (12 + 20 + 25 + 15 = 72). It works, but open the console:

```text
Each child in a list should have a unique "key" prop.
Check the render method of `Gallery`.
```

Remember Lesson 3: a key is a name tag for each item, and the course `id` is perfect. Add `key={c.id}` on the outermost tag inside `map`, which is the `CourseCard`, not something inside it (`edits/13-Gallery-with-key.jsx`, also the real file). The console is clean.

### Step 5: the Layout

`src/components/Layout.jsx` (`edits/14-Layout.jsx`), a wrapper like Lesson 5:

```jsx
function Layout({ children }) {
  return (
    <div className="page">
      <header>
        <strong>allcsvideos</strong>
        <span>My courses</span>
      </header>
      <main>{children}</main>
      <footer>© 2026 allcsvideos.com</footer>
    </div>
  )
}

export default Layout
```

The badge only says "My courses" for now: the number on it will need memory, and that is Module 4. `App` becomes the real thing (`edits/15-App-final.jsx`):

```jsx
import courses from './data/courses'
import Layout from './components/Layout'
import Gallery from './components/Gallery'

function App() {
  return (
    <Layout>
      <Gallery courses={courses} />
    </Layout>
  )
}

export default App
```

Nesting dolls: `App` holds `Layout`, `Layout` holds `Gallery`, and `Gallery` gets the list. The page still looks plain, but the whole structure is in place.

### Step 6: the style

Styling is Module 6, so keep it short. Add the first part (`edits/17-index-1-page-header-footer.css`: the page, the header, the footer) to `index.css`, then the second part (`edits/18-index-2-grid-cards-tag-ADD.css`: a grid with four equal columns, a white box per card and a green pill in the top right corner of its card). Together they are `edits/19-index-2-complete.css`, which is the real `src/index.css`. The class names we wrote in the JSX are what the CSS looks for. The page now matches the mockup. Four columns are fixed here; making them fit every screen size is Module 6.

## Test it like a user

- Four cards, in the order of the data. Titles, teachers and lessons match.
- The two free courses have the green tag, and their price line says `Free`.
- The count says `4 courses, 72 lessons`.

Now the real test of UI from data. Add a fifth course to `data/courses.js` (`edits/20-courses-with-fifth-course.js`: Git Basics, by Asha, 8 lessons, free), and do not touch any component. Five cards, and the count says `5 courses, 80 lessons`. The new card has the FREE tag. One change in the data and the whole page followed. After a fresh load the console is clean, with no warnings and no errors. Remove the fifth course again.

## What would break in production

1. **The data is hard-coded.** To add a course a developer must edit a file and publish the site again. In a real site the courses come from the allcsvideos API, with `fetch` (Module 2). We get there in Module 7.
2. **No loading state and no empty state.** Here is the page when the list is empty (`edits/21-App-empty-list.jsx`, `courses={[]}`): `0 courses, 0 lessons` and a blank space. A visitor would wonder if the site is broken. When data arrives from a server there is a moment exactly like this. Loading and empty states come in Module 7.
3. **Nothing happens when you click.** A card is only a drawing: no Enroll button, no link to the lesson. Clicks are Module 4, starting with the next video.

## Your turn

Two extensions that need only the JavaScript of Module 2.

**Task 1: sort the courses by lessons, fewest first.** Hint: `sort` (M02-L03). But `sort` changes the list it works on, so copy the list first with spread, then `map` over the sorted copy in `Gallery`.

**Task 2: a free-only gallery.** Hint: `filter`. Keep the courses where `free` is true and give that smaller list to `Gallery`. The count should then say two courses, 35 lessons.

Try both before you look. What you should see from a real run:

```text
Sorted:
React for Beginners | 12 lessons
DevOps Basics       | 15 lessons
Python from Zero    | 20 lessons
System Design       | 25 lessons

Free only: 2 cards, "2 courses, 35 lessons"
```

A possible answer for task 1 is `edits/23-Gallery-sorted.jsx` (it adds `const sorted = [...courses].sort((a, b) => a.lessons - b.lessons)` and maps over `sorted`). For task 2 see `edits/22-App-free-only.jsx` (`const free = courses.filter(c => c.free)` and `<Gallery courses={free} />`).

## Common mistakes

- A typo in a prop name (`txt` instead of `text`): silent, the text just disappears.
- A typo in a data name (`prise`): `Rs undefined`.
- `map` without a `key`: only a console warning. Put the key on the outermost tag inside `map`.
- A bare number on the left of `&&`: a lonely `0`. Use a real true/false value such as `course.free`.

## Recap

1. Sketch first, then cut the sketch into components: a frame, a section, a repeated card, a small label. One component, one file.
2. Data lives in one place and flows down through props: `courses`, then `course`, then `text`. `Layout` takes the `Gallery` as children. Keys name each card.
3. Build in small steps, and test every step in the browser and the console.

## Clean up

Press `Ctrl+C` to stop the dev server. If you ran `npm install` in this repo's `allcsvideos-web`, delete its `node_modules` and `dist` folders when you are done.

## Next

[M04-L01 · Handling Events](../../m04-state-and-events/m04-l01-handling-events/): the cards finally react when you click.
