# M05-L02 · Rendering Lists and Keys

> Video: Module 5, Lesson 2. Watch it first, then follow along here.

## What you'll learn

- What a `key` is: the name tag React uses to match old rows with new rows
- Why `key={index}` breaks the moment rows are added, removed or sorted
- How to choose a good key (stable, unique among siblings, from the data) and where to put it
- Why `key` is not a prop, and how to create new ids with `crypto.randomUUID()` or a counter
- Why `key={Math.random()}` is always wrong
- Filtering and sorting a list without changing it

## Before you start

- Node 24 (`node --version`).
- Best after [M05-L01](../m05-l01-conditional-rendering/). You need `useState` from Module 4 and `map` from Module 2.
- No Docker needed.

## Files in this folder

`src/App.jsx` starts as `versions/v2-index/App.jsx`, the bug from the start of the video. To try any other version, copy its `App.jsx` over `src/App.jsx`.

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | React 19.3.1, Vite 8.3.5 |
| `src/App.jsx`, `src/main.jsx`, `src/index.css` | The app and its styles |
| `src/data/courses.js` | Four courses, each with an `id` |
| `public/` | Favicon and course thumbnails (including Git Basics) |
| `versions/v0-inline`, `v1-nokey` | A list in the page, then the row as its own component with no key |
| `versions/v2-index`, `v3-id` | `key={index}` (broken) and `key={course.id}` (fixed) |
| `versions/v4-inner`, `v5-fragment` | The key on the wrong element, and on a `Fragment` |
| `versions/v6-twolists`, `v6b-dup` | Same ids in two lists (fine), same id twice in one list (warning) |
| `versions/v7-propskey`, `v7b-propsid` | Reading `props.key`, then passing `id` instead |
| `versions/v8-uuid`, `v8b-counter` | Two ways to make a new id |
| `versions/v9-random` | `key={Math.random()}` (never do this) |
| `versions/v10-sort`, `v10b-sortindex` | Filter and sort with ids, and with index keys |

## Follow along

### 1. Set up and see the bug

```bash
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`). Every row has a notes box and a Save button, so every row has its own memory. This is `v2-index`:

`versions/v2-index/App.jsx`:
```jsx
function addGit() {
  setList([gitBasics, ...list])
}

return (
  <>
    <div className="top">
      <b>allcsvideos</b>
      <button onClick={addGit}>Add Git Basics</button>
    </div>
    <ul>
      {list.map((course, index) => (
        <CourseRow key={index} course={course} />
      ))}
    </ul>
  </>
)
```

Do this: type `chapter three` in the first row, click its Save, then click Add Git Basics. The real page, step by step (the text in `[ ]` is what is typed in the notes box):

```text
at start: React for Beginners Save [] | Python from Zero Save [] | System Design Save [] | DevOps Basics Save []
after typing: React for Beginners Save [chapter three] | Python from Zero Save [] | System Design Save [] | DevOps Basics Save []
after Save: React for Beginners Saved [chapter three] | Python from Zero Save [] | System Design Save [] | DevOps Basics Save []
after Add Git Basics: Git Basics Saved [chapter three] | React for Beginners Save [] | Python from Zero Save [] | System Design Save [] | DevOps Basics Save []
```

The note and Saved jumped to Git Basics, and React for Beginners lost both. Nobody touched that row; only the order of the list changed.

### 2. What a key does

React must decide which new row is which old row, so every memory stays with the right row. The key is the name tag: same key as before means the same row (keep its memory), a new key means a new row (empty memory), a missing key means the row is removed and its memory goes with it. So the tag must come from the data.

### 3. Rows with memory, and no key (`v1-nokey`)

The function inside `map` is not a component, and hooks cannot go in a loop, so the row becomes its own component, `CourseRow`, with its own `useState`.

`versions/v1-nokey/App.jsx`:
```jsx
function CourseRow({ course }) {
  const [saved, setSaved] = useState(false)
  return (
    <li className="row">
      <img src={course.image} alt="" />
      <b>{course.title}</b>
      <input placeholder="notes" />
      <button onClick={() => setSaved(!saved)}>
        {saved ? 'Saved' : 'Save'}
      </button>
    </li>
  )
}
```

With no `key` the console shows the real warning, and React falls back on position:

```text
Each child in a list should have a unique "key" prop.

Check the render method of `App`. See https://react.dev/link/warning-keys for more information.
```

### 4. The index is not a good key (`v2-index`)

`map` gives you the position of each item as a second value. Many tutorials write `key={index}`. The warning goes away and the page looks perfect, but the index says where a row sits, not which course it is. Before adding Git Basics the note sits on tag 0. After, tag 0 is Git Basics, so React kept the memory of tag 0 and the note moved to whoever is first.

### 5. The fix: use the id (`v3-id`)

```bash
cp versions/v3-id/App.jsx src/App.jsx
```

The only change is the key:

`versions/v3-id/App.jsx`:
```jsx
<ul>
  {list.map(course => (
    <CourseRow key={course.id} course={course} />
  ))}
</ul>
```

Run the same three steps:

```text
at start: React for Beginners Save [] | Python from Zero Save [] | System Design Save [] | DevOps Basics Save []
after typing: React for Beginners Save [chapter three] | Python from Zero Save [] | System Design Save [] | DevOps Basics Save []
after Save: React for Beginners Saved [chapter three] | Python from Zero Save [] | System Design Save [] | DevOps Basics Save []
after Add Git Basics: Git Basics Save [] | React for Beginners Saved [chapter three] | Python from Zero Save [] | System Design Save [] | DevOps Basics Save []
```

Git Basics is at the top and empty, and React for Beginners keeps `chapter three` and Saved. A good key is stable (does not change when the list changes), unique among its siblings, and comes from the data. An index is fine only for a list that never changes order and has no memory, such as seven weekdays.

### 6. Where the key goes

The key goes on the outermost thing that `map` returns.

`v4-inner` puts the key on the `<li>` inside `CourseRow`, but `map` still returns `CourseRow` elements without a key, so you get the very same warning as in step 3.

When each course needs two sibling lines, wrap them in a `Fragment`. The short form `<>` cannot take a key, so use its long name (`v5-fragment`):

`versions/v5-fragment/App.jsx`:
```jsx
export default function App() {
  return (
    <dl>
      {courses.map(course => (
        <Fragment key={course.id}>
          <dt>{course.title}</dt>
          <dd>by {course.teacher}</dd>
        </Fragment>
      ))}
    </dl>
  )
}
```

```text
page text: React for Beginners | by Meera | Python from Zero | by Meera | System Design | by Rahul | DevOps Basics | by Asha
```

### 7. Unique among whom? (`v6-twolists`, `v6b-dup`)

Unique among siblings only, the items of the same list. Python from Zero (id 2) is in both lists in `v6-twolists`, and the console is clean:

```text
page text: Enrolled | React for Beginners · id 1 | Python from Zero · id 2 | Wishlist | Python from Zero · id 2 | System Design · id 3
```

Inside one list a repeat is a problem. In `v6b-dup` Git Basics copies id 1:

```text
page text: React for Beginners · id 1 | Python from Zero · id 2 | System Design · id 3 | DevOps Basics · id 4 | Git Basics · id 1
```

```text
Encountered two children with the same key, `1`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.
```

### 8. The key is not a prop (`v7-propskey`, `v7b-propsid`)

Your own component never receives `key`. `v7-propskey` tries to show `props.key`:

```text
page text: React for Beginners key: undefined | Python from Zero key: undefined | System Design key: undefined | DevOps Basics key: undefined
```

```text
CourseRow: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)
```

Fix: pass the same value under another name, `id={course.id}` (`v7b-propsid`). The key stays for React, the id is for you:

```text
page text: React for Beginners id: 1 | Python from Zero id: 2 | System Design id: 3 | DevOps Basics id: 4
```

### 9. Where do new ids come from? (`v8-uuid`, `v8b-counter`)

Create the id once, in the event handler, and store it with the item. Option one, `crypto.randomUUID()` (`v8-uuid`); the console prints, for example (yours will differ):

```text
new id: e8b2a53e-8d49-48b6-99e4-6fa2cd80a5bc
```

Option two, a counter outside the component (`v8b-counter`), which prints:

```text
new id: 5
```

When you save the file the page reloads and the counter starts again from 5. That is fine for a demo.

### 10. Never `key={Math.random()}` (`v9-random`)

`versions/v9-random/App.jsx`:
```jsx
<ul>
  {list.map(course => (
    <CourseRow
      key={Math.random()}
      course={course}
    />
  ))}
</ul>
```

It looks unique, but it makes a brand-new tag on every render, so React throws every row away and builds it again. Type a note, click Save, then Add Git Basics:

```text
at start: React for Beginners Save [] | Python from Zero Save [] | System Design Save [] | DevOps Basics Save []
after typing: React for Beginners Save [chapter three] | Python from Zero Save [] | System Design Save [] | DevOps Basics Save []
after Save: React for Beginners Saved [chapter three] | Python from Zero Save [] | System Design Save [] | DevOps Basics Save []
after Add Git Basics: Git Basics Save [] | React for Beginners Save [] | Python from Zero Save [] | System Design Save [] | DevOps Basics Save []
```

Everything is empty. Create the id once when the item is created, never while the page is being drawn.

### 11. Filter and sort (`v10-sort`, `v10b-sortindex`)

Never change state in place. On every draw start from the full `courses` list, filter if one button is on, and make a sorted copy with `toSorted` (plain `sort` would change the original). Each row keeps `key={course.id}`.

`versions/v10-sort/App.jsx`:
```jsx
let shown = courses
if (onlyFree) {
  shown = shown.filter(c => c.free)
}
if (byLessons) {
  shown = shown.toSorted(
    (a, b) => b.lessons - a.lessons
  )
}
```

Type `chapter three` on React for Beginners, click Most lessons first, then Free only twice:

```text
at start: React for Beginners Save [] | Python from Zero Save [] | System Design Save [] | DevOps Basics Save []
after typing: React for Beginners Save [chapter three] | Python from Zero Save [] | System Design Save [] | DevOps Basics Save []
after Most lessons first: System Design Save [] | Python from Zero Save [] | DevOps Basics Save [] | React for Beginners Save [chapter three]
after Free only: Python from Zero Save [] | DevOps Basics Save []
after Free only again: System Design Save [] | Python from Zero Save [] | DevOps Basics Save [] | React for Beginners Save []
```

The note moves with its course. When Free only hides React for Beginners, its memory goes with it, and when it returns it is a new, empty row. With index keys (`v10b-sortindex`) the same sort leaves the note on the first row:

```text
at start: React for Beginners Save [] | Python from Zero Save [] | System Design Save [] | DevOps Basics Save []
after typing: React for Beginners Save [chapter three] | Python from Zero Save [] | System Design Save [] | DevOps Basics Save []
after Most lessons first: System Design Save [chapter three] | Python from Zero Save [] | DevOps Basics Save [] | React for Beginners Save []
```

Sorting breaks index keys, just like adding does.

## Common mistakes

- `key={index}` on a list that can change. Use the item's id.
- The key on the wrong element. It goes on the outermost element returned by `map`.
- Reading `props.key`. Pass the id under another name.
- `key={Math.random()}`. A new tag on every render destroys every row.
- Using `<>` when you need a key. Use `<Fragment key={...}>`.
- Calling `list.sort()` on state. Use `toSorted` or copy first.

## Try it yourself

Add a Remove button to each row. Type a note in the first row and remove that row, once with index keys and once with id keys. With index keys the note stays on the new first row; with id keys it goes away with its course.

## Clean up

```bash
rm -rf node_modules dist
```

Press `Ctrl+C` to stop the dev server.

## Next

Continue with [M05-L03 · Controlled Inputs](../m05-l03-controlled-inputs/).
