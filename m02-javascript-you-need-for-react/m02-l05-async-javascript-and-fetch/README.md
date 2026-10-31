# M02-L05 · Async JavaScript and fetch

> Video: Module 2, Lesson 5. Watch it first, then follow along here.

## What you'll learn

- Why slow jobs must not freeze a page, and what asynchronous (async) means
- `setTimeout`, callbacks and the "staircase" problem
- Promises: pending, fulfilled, rejected, with `.then` and `.catch`
- `async` and `await` with `try` and `catch`
- `fetch`, status codes, `res.ok`, JSON (`stringify` and `parse`) and `res.json()`
- The three looks of every data page: loading, the list, an error message

## Before you start

- Node 24 (`node --version`). Lessons [M02-L01](../m02-l01-let-const-and-arrow-functions/) to [M02-L04](../m02-l04-modules-import-and-export/) first.
- Two terminals: one for the little server, one for the demo files.
- Nothing leaves your computer: the "API" in this lesson is a small server on `localhost`. It is a local stand-in for the allcsvideos API built in the Python course, not the real server.
- No Docker needed.

## Files in this folder

| File | What it is |
|------|------------|
| `demos/timer-two-seconds.js`, `demos/timer-zero.js` | `setTimeout` order puzzle |
| `demos/callback-one.js`, `demos/callback-staircase.js` | Callbacks, and the staircase |
| `demos/kitchen-promise.js`, `demos/promise-then.js`, `demos/promise-catch.js` | A promise: the buzzer |
| `demos/async-await.js`, `demos/async-await-catch.js` | `async`, `await`, `try`, `catch` |
| `demos/fetch-hook.js` | The opening mystery: `Promise { <pending> }` |
| `demos/json-stringify-parse.js` | `JSON.stringify` and `JSON.parse` |
| `demos/forgot-await-json.js`, `demos/not-ok-404.js`, `demos/await-without-async.js` | Three mistakes |
| `api/server.mjs` | The local stand-in server: `/api/courses` (after 1.2 seconds), everything else under `/api/` is a 404 |
| `api/courses.json` | The four courses it serves |
| `api/public/` | The page: `index.html`, `style.css` and `app.js` (the final version) |
| `api/steps/` | `app0.js`, `app1.js`, `app2.js`, `app3bad.js`: the other versions of `app.js` used in the video |

## Follow along

### 1. Start the local server

In the first terminal, from this lesson folder:

```bash
cd api
node server.mjs
```

```text
API ready at http://localhost:5125
```

Leave it running. (To use another port: `PORT=5200 node server.mjs`; then change the address in the demo files too.) The server answers `/api/courses` after 1.2 seconds on purpose, so you can see the waiting.

### 2. The mystery

Asha asks the server for the courses and prints the answer (`demos/fetch-hook.js`):

```js
const res = fetch('http://localhost:5125/api/courses')
console.log(res)
```

Guess: the list of four courses? In the second terminal, from this lesson folder:

```bash
cd demos
node fetch-hook.js
```

```text
Promise { <pending> }
```

Not the courses. A word, `Promise`, and the word `pending`. No crash, no error: the list is not here yet, and the code does not wait for it.

### 3. Why: one cashier and a buzzer

At a restaurant counter you order a pizza that takes ten minutes. The cashier does not stare at the kitchen. You get a buzzer and the cashier serves the next customer. When the food is ready, the buzzer rings. JavaScript is like one cashier: it can do one thing at a time. If it stood still waiting for a server, the whole page would freeze (no clicks, no scrolling, no typing). So for slow jobs it hands the job away, takes a buzzer, and carries on.

- **Synchronous**: one step after another, each waits for the one before.
- **Asynchronous (async)**: start a slow job, carry on, come back when it is done.

### 4. setTimeout

`setTimeout` is built in. You give it a function to run later and how long to wait in milliseconds (a thousandth of a second, so 2000 is two seconds). `demos/timer-two-seconds.js`:

```js
console.log('1. Take the order')

setTimeout(() => {
  console.log('2. The food is ready')
}, 2000)

console.log('3. Greet the next customer')
```

Guess the order, then run it:

```bash
node timer-two-seconds.js
```

```text
1. Take the order
3. Greet the next customer
2. The food is ready
```

One, three, then two. The first and third lines print at once; the food message comes two seconds later. The timer did not stop the code. Now `demos/timer-zero.js`: the same file with a wait of `0`. In what order now?

```text
1. Take the order
3. Greet the next customer
2. The food is ready
```

Still one, three, two. **Waiting code always runs after the current code has finished.** It explains many puzzles. React uses this everywhere data comes from a server: the page is drawn first with nothing in it, and filled in when the data arrives.

### 5. Callbacks and the staircase

The callback from Lesson 3 is a function handed over so another function can call it later. `demos/callback-one.js`:

```js
function orderFood(dish, callback) {
  console.log('Cooking', dish)
  setTimeout(() => callback(dish + ' is ready'), 1000)
}

orderFood('pizza', (message) => {
  console.log(message)
})
```

```bash
node callback-one.js
```

```text
Cooking pizza
pizza is ready
```

(The second line appears one second after the first.) Three dishes one after another, soup then pizza then cake (`demos/callback-staircase.js`): each order sits inside the callback of the one before.

```js
orderFood('soup', (a) => {
  console.log(a)
  orderFood('pizza', (b) => {
    console.log(b)
    orderFood('cake', (c) => {
      console.log(c)
    })
  })
})
```

```text
soup is ready
pizza is ready
cake is ready
```

It works, one second apart, but every step pushes the code further to the right like a staircase. With ten steps it is very hard to read, and handling a failure at each step is worse. JavaScript has a better tool: the promise.

### 6. Promises: the buzzer

A **promise** is an object that stands for a result that has not arrived yet. It is always in one of three states: **pending** (still cooking), **fulfilled** (it rang, you get your food) or **rejected** (it rang with a problem, like the kitchen is closed). It starts pending, becomes fulfilled or rejected once, and never changes again.

`demos/kitchen-promise.js` is a function that gives back such a buzzer. You will almost never write this part yourself, because `fetch` gives you promises already:

```js
function orderFood(dish, kitchenIsOpen) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (kitchenIsOpen) {
        resolve(dish)
      } else {
        reject(new Error('The kitchen is closed'))
      }
    }, 1000)
  })
}
```

After one second: open means `resolve` (the food is ready); closed means `reject` (a problem). Now use it (`demos/promise-then.js` adds these lines):

```js
const buzzer = orderFood('pizza', true)
console.log(buzzer)

buzzer.then((food) => {
  console.log('Eating', food)
})

setTimeout(() => console.log(buzzer), 1500)
```

```bash
node promise-then.js
```

```text
Promise { <pending> }
Eating pizza
Promise { 'pizza' }
```

Pending first (the same word as in our mystery). One second later, `then` receives the food. At 1.5 seconds the buzzer prints again, now with the pizza inside: fulfilled. The other ending (`demos/promise-catch.js`), the kitchen is closed (`orderFood('pizza', false)`), with `.catch` for the problem:

```js
orderFood('pizza', false)
  .then((food) => {
    console.log('Eating', food)
  })
  .catch((error) => {
    console.log('Problem:', error.message)
  })
```

```text
Problem: The kitchen is closed
```

The `then` function never ran; `catch` took over. A promise is a buzzer: `then` receives the food, `catch` receives the problem.

### 7. async and await

Code that jumps from function to function is harder to read than a plain list of steps. `async` and `await` fix that. `demos/async-await.js`:

```js
async function dinner() {
  console.log('Ordering...')
  const food = await orderFood('pizza', true)
  console.log('Eating', food)
}

dinner()
console.log('Meanwhile, I read the menu')
```

`await` means "wait here for the buzzer and give me the food". Guess the order of the three messages:

```bash
node async-await.js
```

```text
Ordering...
Meanwhile, I read the menu
Eating pizza
```

`await` paused only the `dinner` function. The rest of the code kept going, like the cashier serving the next customer. Two rules: `await` only works inside a function marked `async`, and an `async` function itself gives back a promise, so you can `await` it too.

For the closed kitchen use `try` (attempt these lines) and `catch` (if anything goes wrong inside, jump here with the error). `demos/async-await-catch.js`:

```js
async function dinner() {
  try {
    const food = await orderFood('pizza', false)
    console.log('Eating', food)
  } catch (error) {
    console.log('Problem:', error.message)
  }
}
```

```text
Problem: The kitchen is closed
```

Three ways to say the same thing: callbacks, `then`/`catch`, and `async`/`await`. In real projects you mostly write `async`/`await` and still meet `.then` in older code.

### 8. fetch and JSON

JavaScript can send requests too, with `fetch`. It gives back a promise: a buzzer for the server's reply. In the browser page, `api/public/app.js` starts life as `api/steps/app0.js`. Copy it over `api/public/app.js` to follow the video (the server serves the files from `public/`, no restart needed):

```bash
cp api/steps/app0.js api/public/app.js     # from the lesson folder
```

```js
const button = document.querySelector('#load')

async function loadCourses() {
  const res = await fetch('/api/courses')
  console.log(res.status)
  console.log(res.ok)
  console.log(res.headers.get('content-type'))
  const courses = await res.json()
  console.log(courses)
}

button.addEventListener('click', loadCourses)
```

Open `http://localhost:5125/`, open the browser console (right-click, **Inspect**, **Console**) and click **Load courses**. After about a second the console prints:

```text
200
true
application/json; charset=utf-8
[{...}, {...}, {...}, {...}]
```

(Chrome shows the array of four objects with little arrows you can open.) `200` is the **status code**: OK, here is what you asked for. `ok` is `true`. The content type says what is inside: JSON. In the **Network** tab you see `GET /api/courses`, status 200, about 1.2 seconds (the video measured 359 bytes).

**JSON** (JavaScript Object Notation) is a way to write data as plain text so it can travel over the internet. It looks like a JavaScript array of objects, but it is only text: keys and text use double quotes only. You met it in `package.json`. Two built-in tools convert between the two worlds: `JSON.stringify` turns an object into text and `JSON.parse` turns the text back. `demos/json-stringify-parse.js`:

```js
const course = { id: 1, title: 'React for Beginners' }

const text = JSON.stringify(course)
console.log(text)
console.log(typeof text)

const back = JSON.parse(text)
console.log(back.title)
```

```bash
node json-stringify-parse.js
```

```text
{"id":1,"title":"React for Beginners"}
string
React for Beginners
```

That is why the reply has a method `res.json()`: it reads the text and builds real JavaScript objects. Reading the whole body can take a moment too, so it also gives back a promise. So there are two buzzers: the first rings when the reply arrives, the second when the data is ready to use. **Await the reply, then await the data.**

Now put it on the page: copy `api/steps/app1.js` to `api/public/app.js` and reload.

```js
async function loadCourses() {
  message.textContent = 'Loading...'
  const res = await fetch('/api/courses')
  const courses = await res.json()
  message.textContent = `${courses.length} courses`
  const rows = courses.map((c) => `<li>${c.title}</li>`)
  list.innerHTML = rows.join('')
}
```

Click **Load courses**. The page says `Loading...` (and it is not frozen: it is waiting for the buzzer). After about a second:

```text
4 courses
- React for Beginners
- Python from Zero
- System Design
- DevOps Basics
```

### 9. When the server is not happy

There are two different kinds of trouble. **First: a bad reply.** Copy `api/steps/app2.js` (the address is `/api/course`, the final `s` is missing) and click the button. Guess what the message and the console say. Real result:

```text
message:  undefined courses
console:  Failed to load resource: the server responded with a status of 404 (Not Found)
          plus a red "courses.map is not a function" error
network:  GET /api/course  404
```

`fetch` did not fail. A buzzer that rings with bad news about the address is still a buzzer that rang. The server answered: its answer says 404 and the body is a small object, `{ detail: 'Not Found' }`, not a list. An object has no `length` and no `map`, so the code carried on with the wrong thing. A 404 does not throw by itself.

The fix: ask the reply. `res.ok` is `true` for statuses 200 to 299 and `false` otherwise. If it is `false`, `throw new Error(...)` creates a problem on purpose and jumps to `catch`. Wrap everything in `try`/`catch` so the visitor sees a message, not a blank screen. This is the final `api/public/app.js`:

```js
async function loadCourses() {
  message.textContent = 'Loading...'
  list.innerHTML = ''
  try {
    const res = await fetch('/api/courses')
    if (!res.ok) {
      throw new Error(`the server said ${res.status}`)
    }
    const courses = await res.json()
    message.textContent = `${courses.length} courses`
    const rows = courses.map((c) => `<li>${c.title}</li>`)
    list.innerHTML = rows.join('')
  } catch (error) {
    const text = `Could not load courses: ${error.message}`
    message.textContent = text
  }
}
```

Same typo, new code (copy `api/steps/app3bad.js`):

```text
Could not load courses: the server said 404
```

A clear message, and the page did not break. With the address fixed (the final `app.js`), the page shows the four courses again.

**Second kind of trouble: no answer at all.** Stop the server (`Ctrl+C` in the first terminal) and click the button:

```text
Could not load courses: Failed to fetch
```

and the console says `net::ERR_CONNECTION_REFUSED`. This time `fetch` itself failed: the buzzer rang with a problem and our `catch` handled it. Start the server again to continue.

So there are three endings: a good reply (`ok` is true), a bad reply like 404 (`fetch` still succeeds, so check `res.ok`), and no reply at all (`fetch` is rejected, `catch` handles it).

### 10. Where React uses this

A page that loads data always has three looks: **loading** while the buzzer is pending, **the list** when it is fulfilled, and **an error message** when something went wrong. You just built exactly those three. In Module 7 you put this `fetch` inside an effect, and in Module 11 TanStack Query takes over loading, errors and retries. Under the hood it is always: `fetch`, `await`, check `res.ok`, and `res.json()`.

## Common mistakes

**1. Forgetting `await` on `res.json()`** (`demos/forgot-await-json.js`):

```bash
node forgot-await-json.js
```

```text
undefined
Promise { <pending> }
```

`courses.length` is `undefined` and `courses` is a promise, still pending. Add `await`.

**2. `await` in a function that is not `async`** (`demos/await-without-async.js`):

```text
~/demos/await-without-async.js:2
  const food = await orderFood('pizza', true)
               ^^^^^

SyntaxError: await is only valid in async functions and the top level bodies of modules
```

Put `async` before the word `function`.

**3. Not checking `res.ok`** (`demos/not-ok-404.js`, the address is `/api/course`):

```text
404 false
{ detail: 'Not Found' }
~/demos/not-ok-404.js:6
  courses.map((c) => c.title)
          ^

TypeError: courses.map is not a function
```

Check `res.ok` before you use the data.

Interview tip. If Rahul, an interviewer, asks the difference between a promise and `async`/`await`: a promise is an object for a result that arrives later (pending, fulfilled or rejected). `async`/`await` is a cleaner way to use promises: `await` waits for the result inside an `async` function, and `try`/`catch` handle a rejection.

## Try it yourself

Change the address in `app.js` by one letter and read the message. Then stop the server and click again. What are the three endings?

## Clean up

Stop the server with `Ctrl+C`. Put `api/public/app.js` back to the final version (it is the same as the code in step 9). Nothing else was created.

## Next

[M02-L06 · Short-hand Logic](../m02-l06-short-hand-logic/): small one-line tricks that React uses to show a part of the screen only when it should be shown.
