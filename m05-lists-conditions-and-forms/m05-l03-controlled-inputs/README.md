# M05-L03 · Controlled Inputs

> Video: Module 5, Lesson 3. Watch it first, then follow along here.

## What you'll learn

- The difference between a controlled input (React state is the boss) and an uncontrolled input (the browser keeps the text)
- Text boxes, text areas, check boxes, drop-down menus (select) and radio buttons, all driven by state
- A live search that filters a list on every key, with no search button
- One state object and one handler for a whole form, using `[name]:` in square brackets
- The classic mistakes: `value` without `onChange`, `value` on a check box, a missing `Number()`, a missing `[ ]` or spread

## Before you start

- Node 24 (`node --version`).
- Best after [M05-L02](../m05-l02-rendering-lists-and-keys/) and Module 4 (`useState`, updating objects).
- No Docker needed.

## Files in this folder

`src/App.jsx` starts as `versions/v1-ctrl/App.jsx`. To try another version, copy its `App.jsx` over `src/App.jsx`.

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | React 19.3.1, Vite 8.3.5 |
| `src/App.jsx`, `src/main.jsx`, `src/index.css` | The app and its styles |
| `src/data/courses.js` | The four courses |
| `versions/v1-ctrl` | The smallest controlled input |
| `versions/v2-upper` | Upper-casing proves who is in charge |
| `versions/v3-readonly`, `v3c-readonlyattr` | `value` without `onChange` (frozen), then `readOnly` |
| `versions/v4-search` | Live search |
| `versions/v5-textarea` | Review box with a character counter |
| `versions/v6-check`, `v6b-checkbad` | Check box with `checked`, and the `value` mistake |
| `versions/v7-select`, `v7b-selectbad` | Drop-down with `Number()`, and without |
| `versions/v8-radio` | Radio group with one state |
| `versions/v9-form`, `v9b-nobrackets`, `v9c-nospread` | One object for the whole form, and two mistakes |
| `versions/v10a-ctrl`, `v10b-unctrl` | Controlled vs uncontrolled draw counts |
| `versions/node-keys/keys.js` | A node demo of `[field]:` keys |

## Follow along

### 1. Set up

```bash
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`). Switch versions with `cp versions/<name>/App.jsx src/App.jsx`.

### 2. A controlled input (`v1-ctrl`)

A plain HTML box remembers its own letters, like a notepad: that is an uncontrolled input. In a controlled input React keeps the text in state and the box only shows it, like a stadium scoreboard: the score changes in the system, and the board shows it. The loop has five steps: the user presses a key, `onChange` runs, it calls `setName(e.target.value)`, React changes the state and calls the component again, and the box shows the state.

`versions/v1-ctrl/App.jsx`:
```jsx
function App() {
  const [name, setName] = useState('')

  return (
    <div className="page">
      <label htmlFor="name">Your name</label>
      <input
        id="name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p className="out">Hello, {name}!</p>
    </div>
  )
}
```

`value` reads the state, `onChange` writes it. Type `Lukas` one key at a time. The real box and page text after each key:

```text
at start -> boxes=[""]  page: Your name | Hello, !
typed 'L' -> boxes=["L"]  page: Your name | Hello, L!
typed 'u' -> boxes=["Lu"]  page: Your name | Hello, Lu!
typed 'k' -> boxes=["Luk"]  page: Your name | Hello, Luk!
typed 'a' -> boxes=["Luka"]  page: Your name | Hello, Luka!
typed 's' -> boxes=["Lukas"]  page: Your name | Hello, Lukas!
```

### 3. The state is the boss (`v2-upper`)

Change one line: the text goes through `.toUpperCase()` before it goes into the state.

`versions/v2-upper/App.jsx`:
```jsx
onChange={e =>
  setName(e.target.value.toUpperCase())
}
```

Type lower-case `lukas`:

```text
at start -> boxes=[""]  page: Your name | Hello, !
typed 'l' -> boxes=["L"]  page: Your name | Hello, L!
typed 'u' -> boxes=["LU"]  page: Your name | Hello, LU!
typed 'k' -> boxes=["LUK"]  page: Your name | Hello, LUK!
typed 'a' -> boxes=["LUKA"]  page: Your name | Hello, LUKA!
typed 's' -> boxes=["LUKAS"]  page: Your name | Hello, LUKAS!
```

The browser wanted a lower-case letter in the box, but React put the capital on the state and the box obeyed. Every letter passes through your code, so you can change it, block it or check it (limit the length, allow only digits, format a phone number).

### 4. Mistake: `value` without `onChange` (`v3-readonly`)

`versions/v3-readonly/App.jsx`:
```jsx
function App() {
  const [name, setName] = useState('Lukas')

  return (
    <div className="page">
      <label htmlFor="name">Your name</label>
      <input id="name" value={name} />
      <p className="out">Hello, {name}!</p>
    </div>
  )
}
```

The box shows Lukas and nothing you type goes in. Typing `a`, `b`, `c`:

```text
at start -> boxes=["Lukas"]  page: Your name | Hello, Lukas!
typed 'a' -> boxes=["Lukas"]  page: Your name | Hello, Lukas!
typed 'b' -> boxes=["Lukas"]  page: Your name | Hello, Lukas!
typed 'c' -> boxes=["Lukas"]  page: Your name | Hello, Lukas!
```

The console shows this warning as soon as the page loads:

```text
You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
```

Three ways out. One: add `onChange` (the answer 99 times out of 100). Two: add `readOnly` if the box is only meant to show a value (`v3c-readonlyattr`; the warning goes away, typing still does nothing). Three: use `defaultValue` (see step 12). Remember: `value` and `onChange` always travel as a pair.

### 5. Live search (`v4-search`)

`versions/v4-search/App.jsx`:
```jsx
function App() {
  const [query, setQuery] = useState('')

  const q = query.toLowerCase()
  const shown = courses.filter(c =>
    c.title.toLowerCase().includes(q)
  )

  return (
    <div className="page">
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search courses"
      />
      <p className="dim">
        {shown.length} of {courses.length} courses
      </p>
      <ul>
        {shown.map(c => (
          <li key={c.id}>{c.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

`shown` is not a second state. It is worked out from the course list and the query on every draw. Type `d`, `e`, `v`:

```text
at start -> boxes=[""]  page: 4 of 4 courses | React for Beginners | Python from Zero | System Design | DevOps Basics
typed 'd' -> boxes=["d"]  page: 2 of 4 courses | System Design | DevOps Basics
typed 'e' -> boxes=["de"]  page: 2 of 4 courses | System Design | DevOps Basics
typed 'v' -> boxes=["dev"]  page: 1 of 4 courses | DevOps Basics
```

There is no search button and no code that touches the list. Every key changes the state, the state changes `shown`, and the page follows.

### 6. Text area (`v5-textarea`)

A text area works like the input: `value` and `onChange`, nothing between the tags.

`versions/v5-textarea/App.jsx`:
```jsx
<textarea
  id="review"
  value={review}
  onChange={e => setReview(e.target.value)}
/>
<p className="dim">
  {review.length} / 40 characters
</p>
```

Type `Loved it`:

```text
at start -> boxes=[""]  page: Write a review | 0 / 40 characters
typed 'L' -> boxes=["L"]  page: Write a review | 1 / 40 characters
typed 'o' -> boxes=["Lo"]  page: Write a review | 2 / 40 characters
typed 'v' -> boxes=["Lov"]  page: Write a review | 3 / 40 characters
typed 'e' -> boxes=["Love"]  page: Write a review | 4 / 40 characters
typed 'd' -> boxes=["Loved"]  page: Write a review | 5 / 40 characters
typed ' ' -> boxes=["Loved "]  page: Write a review | 6 / 40 characters
typed 'i' -> boxes=["Loved i"]  page: Write a review | 7 / 40 characters
typed 't' -> boxes=["Loved it"]  page: Write a review | 8 / 40 characters
```

### 7. Check box (`v6-check`)

A check box holds a yes or no, so the attribute is `checked` and the event gives `e.target.checked`.

`versions/v6-check/App.jsx`:
```jsx
  <input
    type="checkbox"
    checked={agree}
    onChange={e => setAgree(e.target.checked)}
  />
  I agree to the terms
</label>
```

One state drives three parts of the page: the tick, the text line, and `disabled={!agree}` on the button. Click the box twice:

```text
at start -> boxes=[false]  page: I agree to the terms | Agreed: no | Enroll
click -> boxes=[true]  page: I agree to the terms | Agreed: yes | Enroll
click -> boxes=[false]  page: I agree to the terms | Agreed: no | Enroll
```

### 8. Drop-down menu (`v7-select`)

`e.target.value` is always text, even when it looks like a number. The ids in the data are numbers, so convert with `Number()` before storing. The options come from data with `map`.

`versions/v7-select/App.jsx`:
```jsx
const [courseId, setCourseId] = useState(1)
const course = courses.find(c => c.id === courseId)

return (
  <div className="page">
    <label htmlFor="course">Pick a course</label>
    <select
      id="course"
      value={courseId}
      onChange={e =>
        setCourseId(Number(e.target.value))
      }
    >
      {courses.map(c => (
        <option key={c.id} value={c.id}>
          {c.title}
        </option>
      ))}
    </select>
    <p className="out">{course.teacher}</p>
    <p className="dim">
      {course.lessons} lessons · Rs {course.price}
    </p>
```

Pick System Design:

```text
at start -> boxes=["1"]  page: Pick a course | React for Beginners | Python from Zero | System Design | DevOps Basics | Meera | 12 lessons · Rs 499
pick -> boxes=["3"]  page: Pick a course | React for Beginners | Python from Zero | System Design | DevOps Basics | Rahul | 25 lessons · Rs 999
```

### 9. Radio buttons (`v8-radio`)

A whole radio group needs only one state. Each radio is checked when the state equals its own value.

`versions/v8-radio/App.jsx`:
```jsx
{levels.map(l => (
  <label className="row" key={l}>
    <input
      type="radio"
      name="level"
      value={l}
      checked={level === l}
      onChange={e => setLevel(e.target.value)}
    />
    {l}
  </label>
))}
```

Click Advanced, then Medium:

```text
at start -> boxes=[true, false, false]  page: Beginner | Medium | Advanced | Your level: Beginner
click -> boxes=[false, false, true]  page: Beginner | Medium | Advanced | Your level: Advanced
click -> boxes=[false, true, false]  page: Beginner | Medium | Advanced | Your level: Medium
```

No code ever un-ticks the old one. The state changed, React drew again, and each radio asked itself: does the state say me?

### 10. One handler for a whole form (`v9-form`)

Keep one object in state, give each input a `name` equal to its key, and write one handler. The new piece of JavaScript is the key in square brackets: it means "use whatever the variable holds as the key".

`versions/v9-form/App.jsx`:
```jsx
function handleChange(e) {
  const { name, type, value, checked } = e.target
  setForm({
    ...form,
    [name]: type === 'checkbox' ? checked : value,
  })
}
```

The node proof, `versions/node-keys/keys.js`:

`versions/node-keys/keys.js`:
```js
const field = 'email'
const input = { [field]: 'l@x.de' }

console.log(input)
```

```bash
node versions/node-keys/keys.js
```

```text
{ email: 'l@x.de' }
```

The key is `email`, not `field`. Type a name letter by letter, then an email, then tick the box. The real run:

```text
at start -> boxes=["", "", false]  page: Send me updates | Hello, !
typed 'L' -> boxes=["L", "", false]  page: Send me updates | Hello, L!
typed 'u' -> boxes=["Lu", "", false]  page: Send me updates | Hello, Lu!
typed 'k' -> boxes=["Luk", "", false]  page: Send me updates | Hello, Luk!
typed 'a' -> boxes=["Luka", "", false]  page: Send me updates | Hello, Luka!
typed 's' -> boxes=["Lukas", "", false]  page: Send me updates | Hello, Lukas!
typed 'l' -> boxes=["Lukas", "l", false]  page: Send me updates | Hello, Lukas!
typed '@' -> boxes=["Lukas", "l@", false]  page: Send me updates | Hello, Lukas!
typed 'x' -> boxes=["Lukas", "l@x", false]  page: Send me updates | Hello, Lukas!
typed '.' -> boxes=["Lukas", "l@x.", false]  page: Send me updates | Hello, Lukas!
typed 'd' -> boxes=["Lukas", "l@x.d", false]  page: Send me updates | Hello, Lukas!
typed 'e' -> boxes=["Lukas", "l@x.de", false]  page: Send me updates | Hello, Lukas!
click -> boxes=["Lukas", "l@x.de", true]  page: Send me updates | Hello, Lukas!
```

Adding a fourth field costs two things: a new key in the state and a new input with a matching `name`. The handler never changes.

### 11. Three more mistakes

**A check box with `value` (`v6b-checkbad`).** A check box's `value` is always the text `on`, and any text counts as true, so the state can never become false. Tick it twice: still checked, and the console prints `on` both times. Fix: use `checked`.

```text
at start -> boxes=[false]  page: I agree to the terms | Agreed: no | Enroll
click -> boxes=[true]  page: I agree to the terms | Agreed: yes | Enroll
click -> boxes=[true]  page: I agree to the terms | Agreed: yes | Enroll
```

**A select without `Number` (`v7b-selectbad`).** The state now holds the text `3`, but the ids are numbers and `===` compares the type too, so `find` gives `undefined` and the page goes blank:

```text
TypeError: Cannot read properties of undefined (reading 'teacher')
```

**No square brackets (`v9b-nobrackets`).** The key is always the word `name`. Click the email box and type `a`: the email box stays empty and the greeting says `Hello, a!`.

```text
at start -> boxes=["", "", false]  page: Send me updates | Hello, !
typed 'a' -> boxes=["a", "", false]  page: Send me updates | Hello, a!
```

**No spread (`v9c-nospread`).** `setForm({ [name]: ... })` throws away the other fields, their boxes get `undefined`, and React warns:

```text
A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://react.dev/link/controlled-components
```

Both fixes live in one line: spread the old form, then the key in square brackets.

### 12. Uncontrolled input (`v10b-unctrl`)

`defaultValue` is only the starting text. After that the browser owns the box and React is not asked about any key.

`versions/v10b-unctrl/App.jsx`:
```jsx
function App() {
  console.log('drawing')

  return (
    <div className="page">
      <label htmlFor="name">Uncontrolled</label>
      <input id="name" defaultValue="Lukas" />
    </div>
  )
}
```

Both `v10a-ctrl` (controlled) and `v10b-unctrl` print `drawing` on their first line. Type `a`, `b`, `c` at the end of `Lukas` in each. In development every draw prints twice (StrictMode), so the controlled box logged 8 lines for 4 draws, and the uncontrolled box logged 2 lines for 1 draw:

```text
controlled:   drawing x8   (4 draws)
uncontrolled: drawing x2   (1 draw)
```

Use a controlled input when the page must react while the user types (live search, counters, a button that turns on when the form is complete) or when you need to change or clear the value from code. Use an uncontrolled input when you need the text only once, at the end, for example when the form is sent (read it with a ref, Module 7). The file picker is always uncontrolled. In this course controlled is the default.

## Common mistakes

- `value` without `onChange`: the box is frozen. Add `onChange` (or `readOnly`).
- Using `value` for a check box. Use `checked` and `e.target.checked`.
- Forgetting `Number()` on a select whose ids are numbers.
- Forgetting the square brackets in `[name]:`, or forgetting `...form`.
- Mixing `value` and `defaultValue` on the same input.

## Try it yourself

Add a drop-down with Free and Paid to the search page, and make it filter the list together with the search box. Two controlled inputs, one list: `shown` filters by the query and by the chosen kind.

## Clean up

```bash
rm -rf node_modules dist
```

Press `Ctrl+C` to stop the dev server.

## Next

Continue with [M05-L04 · Forms and Validation](../m05-l04-forms-and-validation/).
