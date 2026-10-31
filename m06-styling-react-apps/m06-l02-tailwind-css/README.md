# M06-L02 · Tailwind CSS

> Video: Module 6, Lesson 2. Watch it first, then follow along here.

## What you'll learn

- What a utility class is, and how to add Tailwind CSS 4.3.3 to a Vite + React project (two packages, one plugin line, one CSS line)
- Why the page looks plain at first (Tailwind starts with a reset)
- How to read a long class list: group the words by what they change (shape, colour, space, text)
- Variants such as `hover:` and `focus:`, and arbitrary values in square brackets
- Why repeated class lists go into a component, not into a style sheet
- Why gluing class names together (`bg-${color}-100`) silently fails
- How big the generated CSS is, and an honest comparison with CSS Modules

## Before you start

- Node 24 (`node --version`).
- Best after [M06-L01](../m06-l01-plain-css-and-css-modules/).
- No Docker needed. Tailwind installs into this project only, never globally.

## Files in this folder

`src/` is the card with the free/paid tag written the right way (`versions/v14-free`). The `versions/` folders hold each step; copy the files of a step over `src/` to see it.

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | React 19.3.1, Vite 8.3.5, `tailwindcss` and `@tailwindcss/vite` 4.3.3 |
| `vite.config.js` | Adds the `tailwindcss()` plugin next to `react()` |
| `src/index.css` | The whole file is one line: `@import "tailwindcss";` |
| `src/App.jsx`, `src/CourseCard.jsx` | The page and the card component |
| `src/data/courses.js` | The shared courses |
| `versions/v0-plain` to `v9-flex` | The single card, built one class at a time |
| `versions/v9b-typo` | `bg-blue-6` (a typo) |
| `versions/v10-hover` | `hover:` and `focus:` variants |
| `versions/v11a-w80`, `v11b-arb` | A scale width and arbitrary values |
| `versions/v12-dup`, `v13-comp`, `v13b-round2` | Copy and paste, then one component, then one change |
| `versions/v14-free`, `v14b-dyn` | Free/paid tag with a ternary, and the glued-class trap |
| `versions/v15-css` | The same card with a CSS Module, for the comparison |

## Follow along

### 1. Install Tailwind and wire it in

Start from the plain project (`versions/v0-plain` is the card with no style at all). Install two packages, inside the project folder:

```bash
npm install tailwindcss @tailwindcss/vite
```

The real output of the install:

```text
added 17 packages, and audited 43 packages in 8s

12 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

`package.json` now lists both at `^4.3.3`. Tell Vite about the plugin (one import line and `tailwindcss()` in the plugins list):

`vite.config.js`:
```js
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Then make `src/index.css` contain just this one line, which asks Tailwind to put its styles into the page:

`src/index.css`:
```css
@import "tailwindcss";
```

Save and look: the page looks worse. The heading is no longer big or bold and the button lost its grey box. That is on purpose: Tailwind starts with a reset that removes the default look of every tag, so every style comes from your classes and looks the same in every browser (`versions/v1-reset`). Old tutorials mention `tailwind.config.js` and three `@tailwind` lines: that was version 3. In version 4 the plugin and the one `@import` line are enough.

```bash
npm run dev
```

### 2. Build the card one class at a time (`v2-page` to `v9-flex`)

Each step adds a few classes, and you see the result at once. Colours have a family and a shade: `slate-100` is very light, `slate-500` the middle, `slate-900` nearly black.

- Page: `min-h-screen bg-slate-100 p-4` (at least as tall as the screen, light grey-blue, 16px padding)
- Card: `bg-white`, then `p-4` (16px inside on all sides), `rounded-xl` (round corners), `shadow-md` (a soft shadow)
- Text: title `text-xl font-bold text-slate-900`, teacher `text-slate-500`
- Button: `rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white` (`px` is left and right, `py` is top and bottom)

Read a long list like a sentence, grouped by what it changes: shape (`rounded-lg`), colour (`bg-blue-600`, `text-white`), space (`px-4`, `py-2`), text (`font-semibold`). The order of the words does not matter, but teams keep one fixed order so two people write the same list.

Spell every class exactly. In `v9b-typo` the button says `bg-blue-6`: no error and no warning, the class does not exist, so the button has no background. When a style does not show, check the spelling first.

### 3. Variants: `hover:` and `focus:` (`v10-hover`)

In a style sheet this was a rule with `:hover`. In Tailwind it is a prefix:

```jsx
className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white
  hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none"
```

Move the mouse onto the button and it gets darker; press Tab and the button gets a bright ring. Never remove a focus style without putting another one in its place. The real rule Tailwind wrote for `hover:bg-blue-700` (it only applies on devices that can really hover, so a phone is not stuck in a hover state):

```css
.hover\:bg-blue-700:hover{background-color:var(--color-blue-700)}
```

### 4. Exact values in square brackets (`v11a-w80`, `v11b-arb`)

When the design needs a number that is not on the scale, type it yourself. These are called arbitrary values. The real rules Tailwind wrote:

```css
.w-\[340px\]{width:340px}
.bg-\[\#1a7cff\]{background-color:#1a7cff}
```

Use brackets rarely. If you use them everywhere you throw away the scale. A better home for a brand colour is the theme.

### 5. Repetition goes into a component (`v12-dup`, `v13-comp`, `v13b-round2`)

Four cards written by copy and paste means that changing `rounded-xl` needs four edits (miss one and the cards disagree). This is the problem from Module 3, lesson 1: make a component. `CourseCard` takes the whole course as one prop, and `App` maps over the courses with a key. The page wrapper uses `grid grid-cols-2 gap-3`.

`src/App.jsx`:
```jsx
import courses from './data/courses.js'
import CourseCard from './CourseCard.jsx'

export default function App() {
  return (
    <main
      className="grid min-h-screen grid-cols-2
        content-start gap-2 bg-slate-100 p-2"
    >
      {courses.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </main>
  )
}
```

The designer says the corners should be rounder: change `rounded-xl` to `rounded-3xl` in one file (`v13b-round2`) and all four cards change.

### 6. Dynamic classes (`v14-free`) and the trap (`v14b-dyn`)

The class changes with the data, as in Module 5: the tag is green for free courses and grey for paid ones. Use a ternary between two complete strings:

`src/CourseCard.jsx`:
```jsx
export default function CourseCard({ course }) {
  return (
    <article className="rounded-xl bg-white p-2.5 shadow-md">
      <h2 className="text-lg font-bold text-slate-900">
        {course.title}
      </h2>
      <p className="text-slate-500">by {course.teacher}</p>
      <div className="mt-2 flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1
            font-semibold ${
              course.free
                ? 'bg-green-100 text-green-700'
                : 'bg-slate-100 text-slate-700'
            }`}
        >
          {course.free ? 'Free' : `Rs ${course.price}`}
        </span>
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-3 py-1.5
            font-semibold text-white
            hover:bg-blue-700"
        >
          Enroll
        </button>
      </div>
    </article>
  )
}
```

The trap is building the name from pieces, `bg-${color}-100` (`v14b-dyn`). The paid cards still look right, because `bg-slate-100` appears elsewhere on the page, but the Free tags lose their green. No error, they are just plain. Tailwind never runs your code: it reads your files as plain text, looks for words that look like classes, and writes CSS for those. `bg-green-100` never appears as a whole word, so no rule exists. The rule: write every class as a complete word somewhere in the source. A ternary between two complete strings is fine; gluing pieces together is not.

### 7. How big is the CSS? (build)

```bash
npm run build
```

The real build of the finished cards (the hash in the file names will differ for you):

```text
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-BM9a_WKK.css    9.77 kB │ gzip:  2.69 kB
dist/assets/index-t4955ba3.js   220.78 kB │ gzip: 69.12 kB
built in 71ms
```

A fully styled page in a CSS file under 10 kB. Most of it is not your classes: the reset takes about 3.7 kB, the theme variables (colours, spacing step) under 1 kB, and your own classes about 2 kB. The cards use 29 different class words and Tailwind wrote 33 small rules for them. There is no rule for `rounded-3xl` or `bg-red-500`, because Tailwind makes only the classes that appear in your files (version 4 finds your files by itself). The CSS grows with the classes you use, not with the size of the framework, and using one class on a hundred tags costs nothing more.

### 8. Tailwind or CSS Modules? (`v15-css`)

The same card in a CSS Module is 72 lines of CSS in two files with short names in the tag. The two screenshots differ by at most three colour steps in any pixel, which no eye can see: the only difference is where the style lives.

- Where Tailwind helps: you do not invent names; the style sits next to the tag; delete a component and its styles go with it.
- Where it hurts: class lists get long and the markup gets noisy; you must learn the words; repeated lists must be extracted into components.
- Some things are nicer in plain CSS: a long animation, or styling HTML that comes from somewhere else. You can mix both.

It is a choice and a matter of team taste, not a rule. You will meet both in real projects.

## Common mistakes

- A class typo (`bg-blue-6`): no error, no style. Check spelling first.
- Building class names from variables (`bg-${color}-100`). Write complete class words.
- Expecting styles right after install: Tailwind's reset makes the page plain until you add classes.
- Brackets everywhere. Use the scale, and the theme for brand colours.
- Copying the same class list again and again. Make a component.

## Try it yourself

Add a small "New" tag to the course card, green for new courses and grey for the others, with a ternary and complete class strings. Then change one class in `CourseCard.jsx` and watch every card change.

## Clean up

```bash
rm -rf node_modules dist
```

Press `Ctrl+C` to stop the dev server.

## Next

Continue with [M06-L03 · Responsive Design and Dark Mode](../m06-l03-responsive-design-and-dark-mode/).
