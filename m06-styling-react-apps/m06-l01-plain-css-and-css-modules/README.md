# M06-L01 · Plain CSS and CSS Modules

> Video: Module 6, Lesson 1. Watch it first, then follow along here.

## What you'll learn

- Why two plain CSS files can break each other (a class name is not private to a file)
- CSS Modules: the file name ends in `.module.css`, you import it with a name, and the class names become unique
- Three real mistakes: no import name, a typo in `styles.title`, and a dash in a class name
- Putting two classes on one element, with the tone picked by a ternary
- Global styles and CSS variables in `index.css`
- Inline `style={{ ... }}` for values that come from state, such as a progress bar width
- Which of the three to use

## Before you start

- Node 24 (`node --version`).
- Best after [M05-B03](../../m05-lists-conditions-and-forms/m05-b03-build-a-study-planner/).
- No Docker needed.

## Files in this folder

`src/` is the finished project at the end of the video (course card, progress panel, module styles). `versions/` holds every step: each `vN-name/` folder has the files that change, and they go into `src/` (the `components/` folders map to `src/components/`). `versions/index.css` is the starting `index.css`.

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | React 19.3.1, Vite 8.3.5 |
| `src/App.jsx`, `src/main.jsx`, `src/index.css` | The app and its global style |
| `src/components/CourseCard.jsx` + `.module.css` | The course card |
| `src/components/Progress.jsx` + `.module.css` | The progress panel with the inline width |
| `src/data/courses.js` | The shared courses |
| `versions/v1-unstyled` | The card with no style file |
| `versions/v2a-css`, `v2b-css`, `v2c-css` | A plain `CourseCard.css` built up in three steps |
| `versions/v3a-collide`, `v3b-collide` | A `Banner.css` whose `.title` collides with the card's `.title` |
| `versions/v4a-mod`, `v4b-mod`, `v4c-log` | The same app with CSS Modules (and a `console.log(styles)`) |
| `versions/v5a-noimp`, `v5b-typo`, `v5c-dash`, `v5d-dashfix` | The three mistakes and the dash fix |
| `versions/v6a-tag`, `v6b-tone`, `v6c-undef`, `v6z-notag` | The free/paid tag with two classes, and its mistakes |
| `versions/v7a-vars`, `v7b-purple` | CSS variables for the brand colour |
| `versions/v8a-static`, `v8b-inline` | A fixed bar width, then the width from state |

## Follow along

### 1. Set up

```bash
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`). To try a step, copy that version folder's files into `src/`, for example `cp -R versions/v3b-collide/. src/`. (Delete the files of a different step from `src/components` first if you want an exact copy; `npm run dev` simply uses whatever `App.jsx` imports.)

### 2. No style file at all (`v1-unstyled`)

The course card with only the browser defaults: default font, a grey button. Next, `CourseCard.css` is built up in three steps (`v2a-css`, `v2b-css`, `v2c-css`): the card layout, the title and meta, and the button.

`versions/v2c-css/components/CourseCard.css`:
```css
.card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 10px;
  background: #fff;
  border-radius: 14px;
}

.thumb {
  border-radius: 12px;
}

.info {
  flex: 1;
}

.title {
  margin: 0;
  font-size: 18px;
  color: #16181d;
}

.meta {
  margin: 4px 0 0;
  color: #4a5160;
}

.btn {
  padding: 8px 14px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background: #1a5fd0;
  border: 0;
  border-radius: 8px;
}
```

### 3. The collision (`v3a-collide`, `v3b-collide`)

Priya builds a `Banner` and gives its heading the class `title` too. Her rule is `font-size: 26px; color: #fff` (white on a blue banner). The card's own `.title` is `18px`, dark.

`versions/v3b-collide/components/Banner.css`:
```css
.banner {
  margin-bottom: 12px;
  padding: 10px 14px;
  background: #1a5fd0;
  border-radius: 14px;
}

.title {
  margin: 0;
  font-size: 26px;
  color: #fff;
}
```

Two style files are now loaded, and the card's title vanishes (white text on a white card), though nothing in the card's files changed. A class name is not private to a file: the browser keeps one list of rules for the whole page. Two elements have the class `title`, both rules match, and when two rules ask for the same thing the one loaded later wins. The real computed styles of the two headings in this version:

```text
h2 Featured this week      color rgb(255, 255, 255)  font-size 26px
h3 React for Beginners     color rgb(255, 255, 255)  font-size 26px
```

The card title took the banner's rule.

### 4. CSS Modules (`v4a-mod`, `v4b-mod`, `v4c-log`)

A CSS Module is a normal CSS file whose name ends in `.module.css`. The rules inside do not change (`.title`, `.meta`, `.btn`). What changes is the import: import it with a name, a default import.

`versions/v4b-mod/components/CourseCard.jsx`:
```jsx
import styles from './CourseCard.module.css'

export default function CourseCard({ course }) {
  return (
    <div className={styles.card}>
      <img
        className={styles.thumb}
        src={course.image}
        alt=""
        width="56"
        height="56"
      />
      <div className={styles.info}>
        <h3 className={styles.title}>
          {course.title}
        </h3>
        <p className={styles.meta}>
          {course.teacher} · {course.lessons} lessons
        </p>
      </div>
      <button className={styles.btn}>Enroll</button>
    </div>
  )
}
```

`styles` is an object (a lookup table) whose keys are the names you wrote. `v4c-log` prints it. The real output (the five letters differ per file, so yours will differ):

```text
{"card":"_card_7huwl_1","thumb":"_thumb_7huwl_11","info":"_info_7huwl_15","title":"_title_7huwl_19","meta":"_meta_7huwl_25","btn":"_btn_7huwl_30"}
```

Every long name is: underscore, your name, underscore, five random-looking letters from the file, underscore, a number. The banner got its own (`_title_d54pi_8`), so the two `.title` rules never meet. Real result: the banner heading is white 26px and the card title is dark 18px again.

### 5. Three mistakes

- **No import name (`v5a-noimp`).** You import the module without a name and keep writing `className="card"`. No error, but the card is plain: the string `card` matches nothing because the real class is the long name. With a module always go through `styles`.
- **A typo (`v5b-typo`).** `styles.titel` is `undefined`, so React leaves the class off. The real DOM of the title is a plain `h3` with no class.
- **A dash (`v5c-dash`).** In CSS `card-title` is normal, but in JSX `styles.card-title` means `styles.card` minus `title`. JavaScript looks for a variable `title`, the page goes blank, and the console says:

  ```text
  ReferenceError: title is not defined
  ```

  The fix (`v5d-dashfix`): square brackets with quotes, `styles['card-title']`, or write module names in camel case (`cardTitle`) so `styles.cardTitle` just works.

### 6. Two classes on one element (`v6a-tag`, `v6b-tone`)

The tag pill needs `tag` for the shape and `free` or `paid` for the colour. `className` takes one string, so build it with a template string, and pick the tone with the ternary from Module 5:

`versions/v6b-tone/components/CourseCard.jsx`:
```jsx
<span className={`${styles.tag} ${tone}`}>
  {course.free ? 'FREE' : 'PAID'}
</span>
```

The two tone rules sit below the tag rule in the file, so when both match their colours win: green for free, blue for paid. A typo such as `styles.freee` (`v6c-undef`) puts the word `undefined` into the class string, so the pill loses its tone colour, with no error. (`v6z-notag` is the version without the tag.)

### 7. Global styles and variables (`v7a-vars`, `v7b-purple`)

Not every style belongs to one component. `index.css` is a plain file imported in `main.jsx`; its rules apply everywhere. Two typical blocks are a reset (`* { box-sizing: border-box }`) and the body. The same blue sat in three places (banner, button, paid label), so it becomes a CSS variable:

`versions/v7a-vars/index.css`:
```css
:root {
  --brand: #1a5fd0;
  --ink: #16181d;
  --muted: #4a5160;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 16px;
  font-family: system-ui, sans-serif;
  color: var(--ink);
  background: #f3f5f9;
}
```

The module files use `var(--ink)`, `var(--muted)` and `var(--brand)`. In `v7b-purple` one line in `index.css` changes the brand colour everywhere.

### 8. Inline style for values from state (`v8a-static`, `v8b-inline`)

The progress panel has a bar. With the width written in the CSS file by hand (`v8a-static`) pressing Finish a lesson changes the text but not the bar, because a CSS file is written once, before the app runs. The real text:

```text
4 of 12 lessons · 33%
5 of 12 lessons · 42%
6 of 12 lessons · 50%
```

The fix (`v8b-inline`): keep the look in the CSS Module (grey track, rounded blue fill) and give the width to the element, from state:

`src/components/Progress.jsx`:
```jsx
import { useState } from 'react'
import styles from './Progress.module.css'

export default function Progress({ total }) {
  const [done, setDone] = useState(4)
  const percent = Math.round((done / total) * 100)

  return (
    <div className={styles.panel}>
      <p className={styles.label}>
        {done} of {total} lessons · {percent}%
      </p>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${percent}%` }}
        />
      </div>
      <button
        className={styles.btn}
        onClick={() => setDone(done + 1)}
      >
        Finish a lesson
      </button>
    </div>
  )
}
```

### 9. Which one to use

- Does it apply to the whole app (reset, fonts, page background, colour variables)? A global file: `index.css`.
- Does it describe one component's look? A CSS Module. This is your default.
- Does the number come from state or props? Inline `style={{ ... }}`.

There is one more way that skips CSS files: utility classes. That is the next lesson.

## Common mistakes

- Two plain CSS files with the same class name. One silently wins.
- Importing a module without a name, then using plain strings.
- `styles.card-title`: use `styles['card-title']` or camel case.
- Writing a state-driven number into a CSS file.

## Clean up

```bash
rm -rf node_modules dist
```

Press `Ctrl+C` to stop the dev server.

## Next

Continue with [M06-L02 · Tailwind CSS](../m06-l02-tailwind-css/).
