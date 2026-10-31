# M05-L04 · Forms and Validation

> Video: Module 5, Lesson 4. Watch it first, then follow along here.

## What you'll learn

- What a form does when you press its button and you do nothing about it (a full page reload)
- `onSubmit` on the `<form>`, and `e.preventDefault()` as the first line of the handler
- A `validate(form)` function that returns an object of error messages
- `touched` state, so messages show only after a field was visited, or after Enroll is pressed
- `disabled={!isValid}`, resetting the form after a good send, and the browser's own validation bubbles
- Two mistakes: a second button inside a form submits it, and `if (errors) return` always stops

## Before you start

- Node 24 (`node --version`).
- Best after [M05-L03](../m05-l03-controlled-inputs/) (controlled inputs, one state object, one handler).
- No Docker needed.

## Files in this folder

`src/EnrollForm.jsx` starts as `versions/v0-reload/EnrollForm.jsx`. To try a version, copy its `EnrollForm.jsx` (and `App.jsx` for the Clear versions) into `src/`.

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | React 19.3.1, Vite 8.3.5 |
| `src/App.jsx`, `src/EnrollForm.jsx`, `src/App.css`, `src/index.css` | The page and the form |
| `src/data/courses.js` | The four courses for the select |
| `versions/v0-reload` | `onSubmit` that only prints (the page reloads) |
| `versions/v1-prevent` | `e.preventDefault()` added |
| `versions/v2-thanks` | A `sent` state and the Thanks message |
| `versions/v3-val` | `validate`, `touched`, `isValid` |
| `versions/v4-disabled` | `disabled={!isValid}` on the button |
| `versions/v5-reset` | The form clears after a good send |
| `versions/v6-native` | Browser validation (`required`, `type="email"`) |
| `versions/v7-novalidate` | `noValidate` so our own messages come back |
| `versions/v8-clear`, `v8b-clearfix` | A Clear button that submits, then `type="button"` |
| `versions/v9-truthy` | `if (errors) return` (always stops) |

## Follow along

### 1. Set up

```bash
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`). Each step below is one folder in `versions/`; copy its `EnrollForm.jsx` over `src/EnrollForm.jsx`:

```bash
cp versions/v1-prevent/EnrollForm.jsx src/EnrollForm.jsx
```

The form starts from last lesson: four controlled inputs (name, email, course, agree), one state object with four keys, and one `handleChange` that updates the right key with `[name]`.

### 2. A form that reloads the page (`v0-reload`)

The `<form>` gets `onSubmit`. It belongs to the form tag, not the button, so one handler covers both the button and the Enter key. For now it only prints the state.

`versions/v0-reload/EnrollForm.jsx`:
```jsx
function handleSubmit(e) {
  console.log('submitted', form)
}

```

Fill in Lukas, `lukas@example.com`, React for Beginners, tick the terms, press Enroll. The console prints this for a moment:

```text
submitted {name: 'Lukas', email: 'lukas@example.com', course: '1', agree: true}
```

Then the whole page reloads, the boxes are empty and the address bar now holds the answers (real address):

```text
http://localhost:5173/?name=Lukas&email=lukas%40example.com&course=1&agree=on
```

That is the old way a browser sends a form: it packs the boxes into the address and loads a new page. A React app throws away the whole page and all its state.

### 3. Stop the reload (`v1-prevent`)

`e.preventDefault()` tells the browser: do not do your usual thing, I will take care of it. It is the first line of the handler.

`versions/v1-prevent/EnrollForm.jsx`:
```jsx
function handleSubmit(e) {
  e.preventDefault()
  console.log('submitted', form)
}

```

Now the page stays, the boxes keep their text and the console prints the object. The course is the text `'1'` in quotes (a select always gives text) and `agree` is a real `true` (because we used `checked`). The state object already is the data to send; later it goes to the API.

### 4. Show a result (`v2-thanks`)

A second state, `sent`, starts as `null`. On submit set it to the form, and in the JSX use `&&` (lesson one of this module).

`versions/v2-thanks/EnrollForm.jsx`:
```jsx
{sent && (
  <p className="thanks">
    Thanks, {sent.name}! We sent a
    confirmation to {sent.email}.
  </p>
)}
```

After Enroll the page ends with:

```text
Thanks, Lukas! We sent a confirmation to lukas@example.com.
```

### 5. Validation (`v3-val`)

Right now Lukas can press Enroll with an empty form. The check is a plain function: form in, errors out. An empty object means no problems. It touches neither the screen nor the state.

`versions/v3-val/EnrollForm.jsx`:
```jsx
function validate(form) {
  const errors = {}

  if (form.name.trim() === '') {
    errors.name = 'Name is required'
  } else if (form.name.trim().length < 2) {
    errors.name = 'Enter at least 2 letters'
  }

  if (form.email === '') {
    errors.email = 'Email is required'
  } else if (!form.email.includes('@')) {
    errors.email = 'Email needs an @'
  }

  if (form.course === '') {
    errors.course = 'Please choose a course'
  }

  if (!form.agree) {
    errors.agree = 'Please accept the terms'
  }

  return errors
}

```

Inside the component, `errors` is worked out on every draw (never stored in state), and `isValid` counts its keys:

`versions/v3-val/EnrollForm.jsx`:
```jsx
const errors = validate(form)
const isValid = Object.keys(errors).length === 0
```

Red text on an untouched page is rude, so a message shows only for a field the person has touched (clicked into and left), and pressing Enroll counts every field as touched. That needs `touched` state and a `handleBlur`:

`versions/v3-val/EnrollForm.jsx`:
```jsx
function handleBlur(e) {
  setTouched({
    ...touched,
    [e.target.name]: true,
  })
}

function handleSubmit(e) {
  e.preventDefault()
  setTouched({
    name: true,
    email: true,
    course: true,
    agree: true,
  })
  if (!isValid) return
  console.log('submitted', form)
  setSent(form)
}
```

Under each box, both things must be true, the box was touched and it has a problem (conditional rendering):

`versions/v3-val/EnrollForm.jsx`:
```jsx
{touched.name && errors.name && (
  <p className="error">{errors.name}</p>
)}
```

The real results of `validate` for each rule:

```text
name ""        -> Name is required
name "   "     -> Name is required       (trim removes spaces)
name "L"       -> Enter at least 2 letters
email ""       -> Email is required
email "lukas"  -> Email needs an @
course ""      -> Please choose a course
agree false    -> Please accept the terms
all filled in  -> {}
```

Try it: type `L` in the name box and press Tab. Under the name you see `Enter at least 2 letters`, and nothing under the email, which you have not touched. Press Enroll with the rest empty: all four messages appear and nothing is sent. Type `ukas`, and the name message vanishes by itself, because errors are worked out on every draw. Type `lukas` in the email: `Email needs an @`. Make it `lukas@example.com`, choose a course, tick the box, press Enroll: the console prints the object and the page says `Thanks, Lukas!`.

### 6. A disabled button (`v4-disabled`)

One attribute, from the flashcard quiz in Module 4:

```jsx
<button disabled={!isValid}>Enroll</button>
```

The empty form has a grey button. It turns active the moment the last problem is gone, because it only reads `isValid`. A grey button alone is confusing (what is wrong?), so keep the messages under the boxes. Many designers keep the button enabled and let the messages explain, as in step 5. Both are fine. Keep the `if (!isValid) return` check inside `handleSubmit` as well: a disabled button helps the person, but your code should never trust it.

### 7. Reset after a good send (`v5-reset`)

After a good send the boxes still hold the answers, so he could enroll twice. Set the form back to the `empty` object you started from, and clear `touched` too, or the empty boxes would start out red.

`versions/v5-reset/EnrollForm.jsx`:
```jsx
  setForm(empty)
  setTouched({})
}
```

After Enroll the boxes are empty, no red anywhere, the button is grey and the Thanks message is still there, because `sent` holds its own copy (state is a snapshot, Module 4).

### 8. The browser's own checking (`v6-native`, `v7-novalidate`)

The attribute `required` on a box and `type="email"` on the email box switch on the browser's checks (`v6-native`). With an empty form the browser shows its own bubble on the first empty box, `Please fill in this field.`, and our messages never appear and our `onSubmit` never runs. For `lukas` the email bubble says:

```text
Please include an '@' in the email address. 'lukas' is missing an '@'.
```

These bubbles cost no code, but you cannot style them, the wording differs per browser and language, and they show one problem at a time. Keep `required` and `type="email"` (they help phone keyboards and screen readers) and add `noValidate` to the `<form>` tag to get your own messages back (`v7-novalidate`):

`versions/v7-novalidate/EnrollForm.jsx`:
```jsx
<form
  className="card"
```

An empty form then shows all four of our messages.

### 9. Mistake: a second button submits (`v8-clear`, `v8b-clearfix`)

A button inside a form is a submit button unless you say otherwise. A Clear button with `onClick={handleClear}` empties the boxes and also submits the empty form, so every red message appears. The fix is one attribute (`v8b-clearfix`):

`versions/v8b-clearfix/EnrollForm.jsx`:
```jsx
type="button"
className="clear"
onClick={handleClear}
```

### 10. Mistake: `if (errors) return` (`v9-truthy`)

An empty object `{}` is still an object, and every object counts as true in an `if`, so this version always stops, even when the form is perfect. The console prints:

```text
errors is {}
```

Ask the right question instead: `if (!isValid) return`, where `isValid` is `Object.keys(errors).length === 0`.

### 11. Two last rules

All this checking is for the person's comfort. Anyone can skip your page and call your API directly, so the server must check again. And when a form grows to twenty fields nobody writes this by hand: Module 12 brings React Hook Form and Zod.

## Common mistakes

- Forgetting `e.preventDefault()`: the page reloads and the answers land in the address bar.
- Putting `onSubmit` on the button: it belongs on the `<form>`.
- Storing `errors` in state. Work them out on every draw.
- A second button without `type="button"`: it submits the form.
- `if (errors) return`: an empty object is truthy. Use `isValid`.
- Mixing browser bubbles and your own messages without `noValidate`.

## Try it yourself

Add a password box with a rule of at least eight characters, and a second box, repeat password, with a message when the two do not match.

## Clean up

```bash
rm -rf node_modules dist
```

Press `Ctrl+C` to stop the dev server.

## Next

Continue with [M05-L05 · Choosing the State Shape](../m05-l05-choosing-the-state-shape/).
