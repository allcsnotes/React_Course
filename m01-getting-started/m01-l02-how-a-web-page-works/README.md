# M01-L02 · How a Web Page Works

> Video: Module 1, Lesson 2. Watch it first, then follow along here.

## What you'll learn

- The three languages of every web page: HTML (structure), CSS (looks), JavaScript (behavior)
- The six steps from typing an address to seeing a page
- What a tag, an element, an attribute, a class and an ID are
- How a CSS rule works: selector, property, value
- What the DOM is: the tree of objects the browser builds from your HTML, which JavaScript can read and change
- Three beginner mistakes and the browser's reaction to each

## Before you start

- A web browser (Chrome is used in the video) and a code editor such as VS Code.
- Python 3 for a tiny local web server (`python3 --version`). No Node or React is needed in this lesson.
- Lesson 1 of this module helps but is not required: [M01-L01](../m01-l01-what-react-is-and-why-it-exists/).
- No Docker needed.

## Files in this folder

| File or folder | What it is |
|----------------|------------|
| `main/index.html` | The course page: header, badge, course box, Enroll button |
| `main/style.css` | The CSS rules |
| `main/script.js` | The enroll click code (the same as Lesson 1) |
| `variants/join-now/` | The button's words changed to "Join now" |
| `variants/green-button/` | The button rule changed to a green background |
| `variants/no-css/` | The `link` tag to the style sheet removed |
| `variants/thanks-message/` | A script that also adds a thank-you message |
| `variants/script-too-early/` | Mistake 1: the script tag is in the head |
| `variants/typo-buton/` | Mistake 2: `buton` instead of `button` |
| `variants/wrong-selector/` | Mistake 3: a rule for `.button`, but the button has no class |

Every variant has the same three files as `main/` (`index.html`, `style.css`, `script.js`). Only one line differs from `main/`.

## Follow along

### 1. Serve the page

Open a terminal in this folder and start a tiny web server:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/main/` in your browser. You see a white header with "allcsvideos" and a badge "My courses 3", and below it a card: React for Beginners, by Meera, 1204 students, and a blue Enroll button. Stop the server any time with `Ctrl+C`.

Now look at what the browser asked for. In Chrome press `F12`, open the **Network** tab and reload the page. You see three requests, all with status 200 (which means "okay"):

```text
Name         Status
main/        200       (the HTML file, 537 bytes)
style.css    200       (the style file, 742 bytes)
script.js    200       (the script file, 406 bytes)
```

The terminal where the server runs prints the same conversation:

```text
127.0.0.1 - - [31/Oct/2026 14:07:10] "GET /main/ HTTP/1.1" 200 -
127.0.0.1 - - [31/Oct/2026 14:07:10] "GET /main/script.js HTTP/1.1" 200 -
127.0.0.1 - - [31/Oct/2026 14:07:10] "GET /main/style.css HTTP/1.1" 200 -
```

(The date and the order of the last two lines will differ for you. You may also see a 404 for `/favicon.ico`: the page has no icon, and that is fine.)

The six steps of a visit:

1. You type an address; the browser sends a request.
2. A server answers with a file written in HTML.
3. The browser reads the HTML and builds a tree.
4. It reads the CSS and works out how every piece should look.
5. It runs the JavaScript, which can change the tree.
6. It paints the result on the screen, and again every time the tree changes.

### 2. Read the HTML

Open `main/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>React for Beginners</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <header>
      <b class="logo">allcsvideos</b>
      <span class="badge">My courses <b id="badge">3</b></span>
    </header>
    <div class="course">
      <h2>React for Beginners</h2>
      <p>by Meera</p>
      <p id="students">1204 students</p>
      <button id="enroll">Enroll</button>
    </div>
    <script src="script.js"></script>
  </body>
</html>
```

- The words in angle brackets are **tags**. `<h2>` is an opening tag, `</h2>` is a closing tag (same name, with a slash).
- Opening tag + content + closing tag is one **element**.
- Extra information inside the opening tag is an **attribute**: `id="enroll"` is a name, an equals sign and a value in quotes. An ID names one element so code can find it, so it must be unique.
- `class` is a label many elements can share. This page uses the classes `logo`, `badge` and `course`.
- Elements sit inside other elements, like boxes in boxes: the `header` holds the logo and the badge; the `.course` box holds the heading, two paragraphs and the button.

Guess: if you change the word Enroll to Join now and reload, what changes? Open `variants/join-now/` (`http://localhost:8000/variants/join-now/`) to see. Only the button's words change. The file is the page.

### 3. Read the CSS

Open `main/style.css`. The button rule:

```css
button {
  width: 100%;
  height: 64px;
  margin-top: 26px;
  font-size: 26px;
  color: white;
  background: #1a5fd0;
  border: 0;
  border-radius: 14px;
}
```

A rule has a **selector** (`button`: which elements) and, between curly braces, **declarations**: each one is a property, a colon, a value and a semicolon. A pixel (`px`) is one tiny dot of the screen.

Three common selectors:

```css
p { ... }          /* a plain name: every p element */
.logo { ... }      /* a dot: every element whose class is logo */
#students { ... }  /* a hash: the one element whose ID is students */
```

The `link` tag in the HTML head (`<link rel="stylesheet" href="style.css" />`) is how the browser finds the style file. That was the second request in the Network tab.

Guess: the button's background becomes green. Open `http://localhost:8000/variants/green-button/`. Only the button turns green, because only the button rule changed. To see the page with no styling at all, open `http://localhost:8000/variants/no-css/`: the same words and button, but everything stacks from top to bottom.

### 4. See the DOM tree

The browser does not keep your HTML as text. It builds a tree, like folders inside folders:

```text
html (the root)
  head: meta, title, link
  body
    header: b.logo, span.badge (text, b#badge)
    div.course: h2, p, p#students, button#enroll
    script
```

Even the words are part of the tree: each piece of text becomes its own small node (a node is one item of the tree). This tree is the **DOM**, the Document Object Model. The element above is the **parent**, the elements directly below are its **children**, and children of the same parent are **siblings**.

Ask the real page about its own tree. Open `http://localhost:8000/main/`, press `F12`, open the **Console** tab and type these lines, one at a time:

```js
document.querySelectorAll('*').length
document.body.children.length
document.querySelector('.course').children.length
document.querySelector('#enroll').parentElement.className
```

The answers, from a real run:

```text
16
3
4
'course'
```

Sixteen elements in all, the body has three children (header, div, script), the course box has four, and the parent of the button is the element with class `course`. The screen is drawn from this tree, not from the text file, and the tree can change while the page is open.

### 5. Let JavaScript change the tree

`main/script.js` is the same enroll code as Lesson 1:

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

It does three things: **finds** elements (`document.querySelector('#enroll')` means "give me the element with this ID"), **listens** for an event (a click, via `addEventListener`), and **changes** the tree (`textContent = 'Enrolled'`).

Guess: after the click, what do the button, the count and the badge show, and does the tree still have 16 elements? Click Enroll:

```text
button: Enrolled     count: 1205 students     badge: 4
elements in the tree: 16   (still 16)
```

Three text nodes were replaced and nothing else changed. In the Network tab there are still three requests: the page was not loaded again.

JavaScript can also add brand new elements. Open `http://localhost:8000/variants/thanks-message/`. Its `script.js` has three extra lines at the end of the click function:

```js
  const thanks = document.createElement('p');
  thanks.textContent = 'Welcome aboard, Lukas!';
  document.querySelector('.course').append(thanks);
```

Guess: how many elements now, and where does the message appear? Click Enroll and run `document.querySelectorAll('*').length` again:

```text
17
```

The message appears inside the course box, under the button. The `.course` box now has 5 children.

### 6. Why this leads to React

One click now needs four hand-written jobs: change the button, change the count, change the badge, add a message. A real site has hundreds of elements and dozens of events. Remember the badge that stayed on 3 in Lesson 1: one forgotten line.

React takes a different path. You stop editing the tree yourself. You describe what the screen should look like for the current data, and React changes the real tree for you, only where needed. Nothing you learned today goes away: React still produces HTML, still uses CSS, and still changes the same DOM.

## Common mistakes

**1. The script tag is too early.** Open `http://localhost:8000/variants/script-too-early/`. The `script` tag is in the `head`, above the button. The page loads, you click Enroll, and nothing happens. The console shows a red error:

```text
Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')
```

In plain words: the finder found nothing (that is `null`), and you cannot add a listener to nothing. The browser builds the tree while it reads from top to bottom, and when the script ran, the button was not in the tree yet. The `head` of this variant has four children (meta, title, link, script) and the body only two. Fix: put the `script` tag at the end of the `body`, after the elements it needs.

**2. A typo in a tag name.** Open `http://localhost:8000/variants/typo-buton/`. The line says `<buton id="enroll">Enroll</buton>`. No error, no warning. The browser does not know the tag `buton`, so it shows the words as plain text, with no button look. HTML never complains, so check the spelling first.

**3. A selector that matches nothing.** Open `http://localhost:8000/variants/wrong-selector/`. The rule says `.button`, which means "a class named button", but our button has no class. The rule is silently ignored and the button stays the plain grey default. A dot means class, a hash means ID, and a bare name means the tag.

Interview tip. If Rahul, an interviewer, asks what the DOM is: it is the tree of objects the browser builds from the HTML. JavaScript can read and change it, and the browser paints the screen again when it changes.

## Try it yourself

1. Open any website, right-click a heading and choose **Inspect**. Find that same element in the tree and name its parent.
2. In `main/index.html` add a second `class` to the button: `class="big"`. Then in `main/style.css` write a rule `.big { background: green; }`. Does the button change? Why or why not?
3. In the console of `main/`, run `document.querySelector('#students').textContent = '9999 students'`. Reload. What happened to the change?

Answers are at the bottom.

## Clean up

Press `Ctrl+C` in the terminal to stop the Python server. Nothing else was created.

## Next

[M01-L03 · Setting Up Your Tools](../m01-l03-setting-up-your-tools/): get your computer ready to write and run real React code.

## Answers

1. Typical: a heading's parent is a `div` or `section` that holds the other text of that block.
2. It depends on the order. Both rules (`button` and `.big`) say how to paint the background, and the more specific `.big` class wins over the plain `button` name, so the button turns green. If nothing changes, check that the class name is spelled the same in both files.
3. The text on the screen changes at once, because you edited the tree. After a reload it is back to 1204, because the tree is rebuilt from the HTML file. The file did not change.
