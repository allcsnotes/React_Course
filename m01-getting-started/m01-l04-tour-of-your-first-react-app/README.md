# M01-L04 · Tour of Your First React App

> Video: Module 1, Lesson 4. Watch it first, then follow along here.

## What you'll learn

- Which files in a React project matter: you work in `src`, the browser starts at `index.html`, and npm looks after `node_modules` and `package.json`
- The path your code takes: `index.html`, then `main.jsx`, then `App.jsx`
- What Vite does while it runs: web server, translator (JSX to JavaScript) and messenger (hot reload)
- How to change the page and watch it update by itself
- How to read a red error screen: first line, file and line number, the line above, fix and save

## Before you start

- Node 24 (`node --version`, it should start with `v24`) and the project from [M01-L03](../m01-l03-setting-up-your-tools/). If you did not do Lesson 3, use the `allcsvideos-web` folder in this lesson: it is the finished project of this lesson.
- A code editor (VS Code) with Auto Save on.
- No Docker needed.

## Files in this folder

| File or folder | What it is |
|----------------|------------|
| `allcsvideos-web/` | The project as it is at the end of the video: the allcsvideos welcome page with one course card |
| `allcsvideos-web/src/App.jsx` | The welcome page (16 short lines) |
| `allcsvideos-web/src/App.css` | The few style rules for the card |
| `allcsvideos-web/src/index.css` | Empty at the end of the video |
| `allcsvideos-web/package.json`, `package-lock.json` | Exact versions: React 19.3.1, Vite 8.3.5 |
| `starter/` | The three files the starter made (`App.jsx`, `App.css`, `index.css`), so you can go back to the start |
| `edits/App.hello.jsx` | The starter `App.jsx` with the heading changed to "Hello, allcsvideos!" |
| `edits/main.no-app.jsx` | `main.jsx` with the `<App />` tag removed (blank page test) |
| `edits/App.missing-closing-div.jsx` | The welcome page with one closing `</div>` deleted (red error 1) |
| `edits/App.wrong-css-name.jsx` | The welcome page importing `./Apps.css` (red error 2) |

## Follow along

Start with the project from Lesson 3 (or `starter/` copied into `src/`). In a terminal inside the project folder:

```bash
npm install
npm run dev -- --port 5114
```

(The video uses port 5114; leave `--port` out to use Vite's default, 5173.)

### 1. A map of the project folder

Open the project folder in VS Code (File > Open Folder). Ten items sit at the top level:

```text
.gitignore
.oxlintrc.json
README.md
index.html
node_modules
package-lock.json
package.json
public
src
vite.config.js
```

Think of a small workshop:

- **`index.html`** is the front door: the one page the browser opens. You rarely change it.
- **`src`** (source) is the workshop floor. Your own code lives here.
- **`node_modules`** is the warehouse of ready-made parts. In the video it held 24 packages, about 56 megabytes. Never edit anything inside it. If it is ever deleted, `npm install` brings it back.
- **`package.json`** is the shopping list. `package-lock.json` is the exact versions npm wrote next to it. You never edit the lock file.

Inside `src`:

```text
App.css    index.css   styles (colors and layout, Module 6)
App.jsx    the file you will edit all the time
assets/    the starter's pictures
main.jsx   starts your app (you rarely change it)
```

The leftovers are settings: `vite.config.js` (Vite), `.gitignore` (a list for git, the tool that saves versions of your project), `.oxlintrc.json` (a code checker, Module 18), `public/` (files served as they are: `favicon.svg`, `icons.svg`) and `README.md` (plain notes). Leave them alone for now.

In `package.json`, `scripts` has `"dev": "vite"`, so `npm run dev` starts Vite. `dependencies` are what your app needs while it runs (React and `react-dom`); `devDependencies` are tools for building only, like Vite.

### 2. The path from the browser to the screen

When you open the page, how does the code in `App.jsx` end up on your screen? Three files, always in this order.

**`index.html`** (the browser opens it first):

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>allcsvideos-web</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

Line 10 is a `div` with the ID `root` and nothing inside: one empty box in the DOM tree from Lesson 2. React builds your whole page inside it. Line 11 tells the browser to also load `/src/main.jsx`.

Check it for real: run this in the terminal while the server runs.

```bash
curl -s http://localhost:5114/ | grep 'id="root"'
```

```text
    <div id="root"></div>
```

The page source sent by the server has an empty root. In the browser's **Elements** tab the same box is full a moment later. Who filled it? `main.jsx`:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

The four lines at the top are **imports**: they bring in code from other files (Module 2 explains them fully). Then two jobs:

1. `document.getElementById('root')` finds the empty box, and `createRoot` turns it into a place where React may draw.
2. `.render(...)` draws something in it. What it draws is `<App />`. A tag with a capital letter means "use the component with this name". `StrictMode` is a safety helper: in development it makes React double check your code. Ignore it for now.

`App` is a component, the biggest LEGO brick: the whole page sits inside it. The top of the starter `App.jsx` is a function called `App` that returns markup that looks like HTML. That markup is **JSX** (rules in Module 3).

So the path is: the browser opens `index.html` and finds an empty `root` box and a script tag. The script loads `main.jsx`, which says "draw `App` in here". `App.jsx` describes the page. Every React app that uses Vite begins this way.

### 3. Test the path

Guess: if you remove the `<App />` tag from `main.jsx` and save, what does the page show, and is there an error message? Copy `edits/main.no-app.jsx` over `src/main.jsx` (or delete the line by hand):

```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
  </StrictMode>,
)
```

Result from a real run:

```text
root box in the browser:  <div id="root"></div>
page text:                (empty)
errors in the console:    none
```

A blank page and no error at all. React had nothing to draw, so nothing went wrong. A blank page with no error often means "nothing was drawn": check `main.jsx` first. Put the `<App />` tag back (copy `allcsvideos-web/src/main.jsx` over it) and the page returns. (The counter starts again at `Count is 0`.)

### 4. What the terminal is doing

The terminal where you typed `npm run dev` is still busy:

```text
> allcsvideos-web@0.0.0 dev
> vite --port 5114


  VITE v8.3.5  ready in 119 ms

  ➜  Local:   http://localhost:5114/
  ➜  Network: use --host to expose
```

While that window stays open, Vite does three jobs:

1. **A small web server** on your own computer. When your browser asks for the page, Vite sends back `index.html`.
2. **A translator.** Browsers do not understand JSX. When the browser asks for `App.jsx`, Vite first turns the JSX into plain JavaScript (function calls), and sends that. You never write that yourself.
3. **A messenger.** Vite watches your files. The moment you save one, it tells the browser, and the browser swaps in just that change. This is **hot reload**.

In the browser's **Network** tab you can see the real requests when the page loaded: the page `/`, then `/src/main.jsx`, then `/src/App.jsx`, then the style files and the pictures. When all goes well the terminal stays quiet. It speaks up only when there is a problem, so keep it open.

### 5. Try hot reload

In the browser, click the counter three times: **Count is 3**. Open `src/App.jsx` and find the heading on line 19, `<h1>Get started</h1>`. Change the words to `Hello, allcsvideos!` (or copy `edits/App.hello.jsx` over it).

Guess: when you save, does the browser need a refresh? Does the counter still say 3, or go back to 0? Save (it saves by itself with Auto Save; otherwise `Ctrl+S`, or `Cmd+S` on a Mac). The result:

```text
heading:  Hello, allcsvideos!
counter:  Count is 3
```

The heading changed, the counter still says 3, and you never touched the browser. The page was not reloaded: Vite swapped in only the part that changed. On this computer it took well under a second (the video measured about a tenth of a second; yours will differ). Type, save, look: you will do this thousands of times in this course.

### 6. Make the page ours

Select everything in `App.jsx` and type this (sixteen short lines, or copy `allcsvideos-web/src/App.jsx`). The starter's pictures and counter are gone, so their imports go too. Only the style file stays.

```jsx
import './App.css'

function App() {
  return (
    <main>
      <h1>Welcome to allcsvideos</h1>
      <div className="card">
        <h2>React for Beginners</h2>
        <p>by Meera</p>
        <p>12 lessons</p>
      </div>
    </main>
  )
}

export default App
```

- A function called `App` returns what the page should look like: a `main` box with a heading, then a `div` for the card.
- `className` attaches a style to the div (why it is not `class` comes in Module 3).
- Inside the card are the course title, the teacher and the number of lessons.
- `export default App` lets `main.jsx` import it.

Replace `src/App.css` with these few lines (copy `allcsvideos-web/src/App.css`) and make `src/index.css` empty, so the card looks right. Styling gets its own module (Module 6).

```css
* { box-sizing: border-box; margin: 0; }
body { font-family: system-ui, sans-serif; background: #f3f5f9; color: #16181d; }
main { padding: 56px 48px; text-align: center; }
h1 { font-size: 52px; color: #1a5fd0; }
.card { width: 520px; margin: 40px auto; padding: 32px; text-align: left;
  background: #fff; border: 1px solid #dde2ea; border-radius: 20px; }
h2 { font-size: 36px; }
p { margin-top: 8px; font-size: 24px; color: #4a5160; }
```

Save. The page now shows:

```text
Welcome to allcsvideos
React for Beginners
by Meera
12 lessons
```

One heading, one card. No counter and no clicks yet: Module 3 teaches components properly and Module 4 adds clicks.

### 7. Break it on purpose

Mistakes are normal. Experienced developers see red screens every day. What matters is reading them.

**Error 1: a missing closing tag.** Delete the line `</div>` (line 11) from `App.jsx`, or copy `edits/App.missing-closing-div.jsx` over it. Every opening tag needs a closing partner. Guess: what does the browser show, and does the terminal say anything? When you save, the browser shows a red overlay on top of the page, and the terminal prints the same message. Read it from the top:

```text
Transform failed with 2 errors:

[PARSE_ERROR] Expected corresponding JSX closing tag for 'div'.
    ╭─[ src/App.jsx:11:7 ]
    │
  7 │       <div className="card">
    │        ─┬─  
    │         ╰─── Opened here
    │ 
 11 │     </main>
    │       ──┬─  
    │         ╰─── Expected `</div>`
────╯

[PARSE_ERROR] Unexpected token. Did you mean `{'}'}` or `&rbrace;`?
    ╭─[ src/App.jsx:13:1 ]
    │
 13 │ }
    │ │ 
    │ ╰─ 
────╯
```

- The first line says who found the problem: the translator inside Vite tried to turn your JSX into JavaScript and failed.
- The first error says: expected the closing tag for `div`. In plain words: a `div` was opened but I never found where it closes.
- `src/App.jsx:11:7` is the file, the line number and the column. Go to line 11.
- The little arrows explain it: "Opened here" points at the `div` on line 7, "Expected `</div>`" points at line 11, where `main` closes.
- The second error is only an echo. The first mistake confused the translator, so it complained again at the end of the file. Fix the first error and the second one goes away. Always start with the first.

The browser console (from Lesson 2) shows two red lines: a failed request (500) and `[vite] Failed to reload /src/App.jsx`. They only point you back to the overlay.

Fix: put the `</div>` back and save. The overlay disappears by itself, with no refresh.

**Error 2: a typo in a file name.** Change the import in `App.jsx` from `./App.css` to `./Apps.css` (or copy `edits/App.wrong-css-name.jsx`) and save:

```text
Failed to resolve import "./Apps.css" from "src/App.jsx". Does the file exist?
src/App.jsx:1:7
```

That is almost plain English: Vite cannot find that file. The address says line 1, column 7, and the arrow points at the name. Compare it with the real file in the folder, find the extra `s`, remove it and save. The overlay is gone.

**Four steps for any red screen:**

1. Read the first line.
2. Find the file and the line number.
3. Look at that line, and the line above it.
4. Fix, save, and look.

## Common mistakes

1. **You changed the code but nothing changed on screen.** Is the file saved? Auto Save does it for you. If it is off, look for a dot on the file's tab in VS Code.
2. **"This site can't be reached".** The dev server has stopped. Open the project folder in the terminal and run `npm run dev` again.
3. **A blank page and no red error.** Remember the test in step 3: check `main.jsx` and the browser console.
4. **You need to type another command but the terminal is busy running Vite.** Do not close it. Open a second terminal tab. To stop Vite on purpose, press `Ctrl+C`.

Interview tip. If Rahul, an interviewer, asks where a React app starts: `index.html` has one empty `root` div. `main.jsx` calls `createRoot` on it, and `render` draws the `App` component inside.

## Clean up

Press `Ctrl+C` to stop the dev server. If you ran `npm install` in this repo's `allcsvideos-web` folder, delete its `node_modules` folder when you are done. Your own copy of the project stays as the base for the next lessons.

## Try it yourself

Change the course title and the number of lessons in the card. Then delete a closing tag on purpose, read the error, and fix it.

## Next

[M02-L01 · let, const and Arrow Functions](../../m02-javascript-you-need-for-react/m02-l01-let-const-and-arrow-functions/): React needs a little JavaScript, and Module 2 teaches all of it. This closes Module 1.
