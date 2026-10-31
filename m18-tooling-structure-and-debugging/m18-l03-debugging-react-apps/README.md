# M18-L03 · Debugging React Apps

> Video: Module 18, Lesson 3. Watch it first, then follow along here.

## What you'll learn

- A debugging order that goes from quick to deep: the console, the network tab, a breakpoint
- Why a total shows `0499399`: a server that sends prices as text, and `+` that glues text together
- Fixing the cause where the data enters the app, not the symptom, and adding a test so it never comes back
- The React Developer Tools (components, profiler), and the `<Profiler>` component as a plain-text substitute
- Reading a production error: the minified React error number, the decoder, and the source map
- Storybook: showing one component alone, in any state

## Before you start

- Node 24 (`node --version`) and Google Chrome (for the browser developer tools; F12 or Cmd+Option+I). No Docker.
- Versions (from `package-lock.json`): React 19.3.1, Vite 8.3.5, TypeScript 7.0.2. Storybook 10.6.5 in the `storybook/` folder.
- The practice API is `api/server.mjs` (port 8183): a small Node stand-in that sends each price as **text** on purpose. It is not a real server.
- Honest note from the video: the React Developer Tools are a browser extension and the recording could not drive an extension, so the video shows built-in substitutes. You can install the extension yourself in a minute.

## Files in this folder

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json`, `vite.config.ts` (source maps on), `tsconfig*.json`, `index.html` | The cart app (dev port 5183) |
| `src/CartPage.tsx`, `src/Receipt.tsx`, `src/main.tsx`, `src/index.css` | The cart page; starts as version `bug` |
| `versions/` | `bug` (the problem), `log` (with `console.log`), `fix` (prices turned into numbers), `prof` (with `<Profiler>` and a coupon box); `common` holds `Receipt.tsx`, `main.tsx`, `index.css` |
| `use-version.sh` | `./use-version.sh fix` copies `common` and one `CartPage.tsx` into `src/` |
| `api/server.mjs` | The practice API |
| `sourcemap-demo.mjs` | Asks a `.map` file where a spot in the squeezed file came from |
| `storybook/` | A second, separate project for the Storybook part (its own `package.json`) |

## Follow along

```bash
npm install
node api/server.mjs     # in a second terminal
npm run dev             # http://localhost:5183
```

### 1. The problem: a total of 0499399

The cart shows React for Beginners at 499 rupees and SQL in Two Weeks at 399. The total at the bottom (version `bug`):

```text
Your cart | React for Beginners | ₹499 | SQL in Two Weeks | ₹399 | Total: ₹0499399 | Receipt | Print
```

A shop cannot charge that. There is no red error and no warning. A bug is a mistake in a program; debugging is the hunt. Use the order of a mechanic: check the dashboard first (the console), then what goes in and out (the network tab), and only then open the hood and run the engine slowly (a breakpoint). For React itself there is a fourth helper, the React Developer Tools.

### 2. The console

Add one line where the answer arrives, with a name first so you can find it later. That is `versions/log`:

```bash
./use-version.sh log
```

```tsx
.then((data) => {
  console.log('cart items', data.items)
  setItems(data.items)
})
```

Reload and open the Console. It prints `cart items` and an array of two objects, each with a `slug`, a `title` and a `price`. Look closely at the price: it is inside quotes. A price in quotes is text, not a number. Hold on to that clue.

### 3. The network tab

A page does not own its data; it asks a server. In the Network tab, filter by Fetch (it keeps only requests that ask for data). One row is left: `cart`, status 200, about 600 ms because the practice API pauses on purpose. Click it and open the Response: the raw answer, with the same quotes. You can see the same without a browser:

```bash
curl -s localhost:8183/api/cart
```

```text
{"items":[{"slug":"react-for-beginners","title":"React for Beginners","price":"499"},{"slug":"sql-in-two-weeks","title":"SQL in Two Weeks","price":"399"}]}
```

So this is not a React bug and the server did not break: it sends each price as text. But where exactly does the sum go wrong?

### 4. A breakpoint

A breakpoint is a stop sign on a line of code. In the Sources tab open `CartPage.tsx` and click the line number of `return sum + item.price`. Add two watch expressions: `item.price` and `typeof sum`. Reload. This line runs once per course. Guess: on the second turn, what is `sum`, and is it a number or text?

- First turn: `sum` is `0`, a number, and the price is the text `"499"`. Press resume.
- Second turn: `sum` is the text `"0499"`, and its type is `string`.

Caught in the act. When both sides of a plus are numbers, it adds; when one side is text, JavaScript glues the pieces together. The same in Node:

```text
first turn:  0 number  price "499"
second turn: "0499" string
then "0499399"
499 "0499"
```

The call stack on the right is the list of who called whom, newest on top: this line was called by the cart page, which React called while drawing the screen.

### 5. The fix, and a test

The fix belongs where the text enters the app, not in the sum. Right after the answer arrives, turn each price into a real number with `Number` (capital N). That is `versions/fix`:

```bash
./use-version.sh fix
```

```tsx
.then((data) =>
  setItems(data.items.map((i: Item) => ({ ...i, price: Number(i.price) }))),
)
```

The type `price: number` was only a promise. TypeScript cannot see the network and trusted what Asha wrote. That is why Module 9, Lesson 4 checked incoming data with Zod. Reload: 

```text
Your cart | React for Beginners | ₹499 | SQL in Two Weeks | ₹399 | Total: ₹898 | Receipt | Print
```

A fixed bug deserves a test so it never comes back (Module 17): two prices go in, and the total must be 898.

### 6. React Developer Tools, and the Profiler substitute

The React Developer Tools are a free extension for Chrome and Firefox. They add two tabs: Components (your tree of components with the props and state of each) and Profiler (which components drew and how long they took). The extension is not recorded in the video.

The substitute for the profiler tab is the `<Profiler>` component (Module 15, Lesson 1). `versions/prof` wraps the page in it and adds a coupon box:

```bash
./use-version.sh prof
```

Type `SAVE` into the coupon box. The console prints one line per draw. Real output from my run in development:

```text
[Profiler] cart mount 1.3 ms
[Profiler] cart mount 0.2 ms
[Profiler] cart update 0.2 ms
[Profiler] cart update 0.2 ms
[Profiler] cart update 0.1 ms
[Profiler] cart update 0.0 ms
[Profiler] cart update 0.1 ms
```

Each line says which part (mount or update) and how many milliseconds. There is one real mount (the second `mount` line is React's StrictMode drawing the page twice in development), then five updates: one when the courses arrived and four for the four letters. That is the profiler tab as plain text. For the Components tab, the substitute is the console from step 2: print the props and state you are unsure about.

### 7. A production error

The production build squeezes the code and writes a source map next to it. Remember that file.

```bash
./use-version.sh bug
npm run build
npm run preview        # http://localhost:5183
```

```text
dist/index.html                   0.43 kB │ gzip:  0.28 kB
dist/assets/index-DbxrvxsK.css    0.61 kB │ gzip:  0.33 kB
dist/assets/index-BL5zaQD_.js   220.35 kB │ gzip: 68.95 kB │ map: 1,047.83 kB

✓ built in 399ms
```

Open the page and click Receipt. The page goes white and the console says:

```text
Minified React error #31; visit https://react.dev/errors/31?args[]=object%20with%20keys%20%7Bslug%2C%20title%2C%20price%7D for the full message ...
```

To save space React sends only a number and the facts; the address on react.dev is a decoder that joins them back into the full sentence. Open it: *Objects are not valid as a React child (found: object with keys {slug, title, price}). If you meant to render a collection of children, use an array instead.* (This is the video's decoder result; it needs the internet.) A component tried to draw a whole object between tags: `versions/common/Receipt.tsx` shows `{item}` instead of `{item.title}`. This white page is the one from Module 14, Lesson 5: if a component throws while drawing, React throws the whole tree away. An error boundary would show a fallback instead.

A second error. Reload and click Print. Nothing seems to happen on the page, but the console shows a type error:

```text
TypeError: Cannot read properties of undefined (reading 'title')
    at a (http://localhost:5183/assets/index-BL5zaQD_.js:9:51342)
```

Column 51342 on line 9: the squeezed code sits on a few huge lines, and the function is named `a`. A person cannot read that. A source map remembers, for every spot in the squeezed code, where it came from; browser tools read it for you. Ask it by hand with the script in this folder (use the file name, line and column from your own console):

```bash
node sourcemap-demo.mjs dist/assets/index-BL5zaQD_.js.map 9 51342
```

```text
../../src/CartPage.tsx 22 34
```

That is `src/CartPage.tsx`, line 22, column 34: the line `console.log(`Printing ${last.title}`)` (in the video's longer file it was line 24). Above it, `const last = items[items.length]`: a list counts from zero, so the last item sits at `length - 1`. `items.length` is one past the end, so `last` is `undefined`. Fix it.

Notice that no error boundary would have helped here: boundaries do not catch errors inside click handlers (Module 14, Lesson 5). Also, a source map shows your original code to anyone who downloads it, so many teams keep it off the public site and give it only to an error-tracking tool.

### 8. Storybook: one component alone

To debug a component you often need it in one exact state: a very long title, a free course, no data. In the real app that means clicking through pages and waiting for the API. Storybook is a workshop bench where each component is shown alone, in the state you choose. It lives in the separate `storybook/` project:

```bash
cd storybook
npm install
npm run storybook      # http://localhost:6006
```

It was installed in the video with `npm create storybook@latest` and flags that skip the questions and keep it from opening a browser (Storybook 10.6.5). The init also made some sample files, which were deleted, and `.storybook/preview.tsx` imports the project's own style sheet. The install also added a test add-on that can run stories as tests; it was not used in the video, and Storybook was not tried with the network off.

A story is a small file next to the component. It says: here is the component, here are normal props, and here are named examples. `src/CourseCard.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { CourseCard } from './CourseCard.tsx'

const meta = {
  component: CourseCard,
  args: { title: 'React for Beginners', teacher: 'Meera', lessons: 4, price: 499 },
} satisfies Meta<typeof CourseCard>

export default meta
type Story = StoryObj<typeof meta>

export const Paid: Story = {}

export const Free: Story = {
  args: { title: 'Python from Zero', price: 0 },
}

export const LongTitle: Story = {
  args: { title: 'Docker for Developers: Images, Volumes and Compose' },
}
```

I started Storybook and opened the three stories in a real browser (`iframe.html?id=coursecard--paid`, `--free`, `--long-title`): they show `React for Beginners | Meera · 4 lessons | ₹499`, `Python from Zero | Meera · 4 lessons | Free` and `Docker for Developers: Images, Volumes and Compose | Meera · 4 lessons | ₹499`. In the Storybook window, on the left is the list of stories. Click Free and the card shows the free course. Click Long Title and the title wraps onto several lines, without the API and without clicking through the real page. Below the card the Controls panel lists every prop with a box: change `lessons` from 4 to 12 and the card changes at once. These are the props from Module 3, Lesson 4 turned into knobs, and the component API of Module 16, Lesson 4 made visible.

## Common mistakes

1. **Debugging by guessing** and changing things at random. Use the order: console, network, breakpoint.
2. **Fixing the symptom.** Wrapping only the total in `Number` leaves text prices everywhere else, and the bug returns at the next place that adds. Fix the cause, where the data enters.
3. **Leaving `console.log` lines** in code that goes to production. Take them out before you ship.
4. **Reading a minified message and giving up.** Copy the number into the decoder, or reproduce the error in the development build, where the message is already whole.
5. **Trusting a type for data that comes from outside.** A type is a promise from you. Check the real answer in the network tab, or with Zod.

## Clean up

Stop the API, the dev server and Storybook (Ctrl+C). Delete `dist/` and `node_modules/` (also in `storybook/`) when you are done. `./use-version.sh bug` restores the start.

## Key points

- Debug from quick to deep: the console, the network tab, a breakpoint. Fix the cause where the data enters, not the symptom.
- The React Developer Tools add a component tree and a profiler; the `<Profiler>` component is a built-in substitute. A production error is a number: decode it, then read the stack through the source map. Storybook shows one component alone, in any state.

Interview tip. If Rahul, the interviewer, asks "a bug appears only in production, and the error is unreadable; what do you do?": decode the error number, use the source map to find the line, reproduce it in a development build, and add a test so it cannot come back.

## Try it yourself

Change the receipt so it shows the title (`{item.title}`), then add a story for the card with an empty list.

## Next

[M19-L01 · Why a Framework](../../m19-nextjs/m19-l01-why-a-framework/README.md)
