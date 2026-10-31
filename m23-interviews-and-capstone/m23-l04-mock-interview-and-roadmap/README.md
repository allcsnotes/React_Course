# M23-L04 · Mock Interview and Roadmap

> Video: Module 23, Lesson 4. Watch it first, then use this page to practise.

## What you'll learn

- How a mock interview works: five rounds, and honest feedback in two parts (what was good, what to add)
- Five model answers, each with a short first answer, the reason, and a tiny proof you can run
- What to learn next: React Native, advanced TypeScript, interfaces for generative AI, and the habit under all three
- A seven-day plan for your first week of job preparation

## Before you start

- Node 24 (`node --version`) if you want to run the three small proofs. Nothing else is needed to read.
- Rahul is the interviewer you know from the earlier lessons; Priya answers. There are no scores. This is coaching.
- Rahul takes his questions from M23-L01 (the 50 questions), M23-L02 (the machine-coding round) and M23-L03 (frontend system design). Do those first, in `../m23-l01-the-50-most-asked-react-questions/` and the two folders after it.

## Key ideas

- A good answer has a shape: the short answer first, then why, then a tiny proof, then what you would add.
- After each question in the video, pause it and answer out loud yourself before Priya does. That is where the lesson helps most.
- Three habits to keep: think aloud, ask before you build, prove a claim with a small example.
- Two things to practise: a short first answer with a clear last sentence, and the honest line "I do not know that yet, here is how I would find out". An honest answer beats a bluff.
- Read the official documents first: react.dev, the Next.js documentation, MDN Web Docs, and the W3C ARIA Authoring Practices. Tutorials age; the official docs are updated with the tools.

## The five rounds

### Round 1 · A hooks question

**Rahul:** A button calls `setCount(count + 1)` three times in one click. The count starts at zero. What does the page show after one click, and why?

**Priya:** Not three. It shows one. Inside one click, `count` is a snapshot: it is 0 for the whole handler. All three calls say the same thing: set the count to 0 + 1. To really add three, I pass a function, `n => n + 1`. Each function receives the latest value.

Her proof is `src/counters.jsx`: two counters, one with `setPlain(plain + 1)` three times, one with `setUpdater(n => n + 1)` three times.
```bash
npm install
npm run build
npm run run1
```
```text
before any click: plain: 0 | updater: 0
after one click on plain: plain: 1
after one click on updater: updater: 3
```
(This runs React 19.3.1 in Node with jsdom.)

**Feedback.** Good: she said the word snapshot, explained why before giving the rule, and offered a proof. To add: the word batching (React groups the three updates into one render), and when to use the updater: whenever the new value depends on the old one (M4-L3).

### Round 2 · An effects question

**Rahul:** Your component starts a timer in `useEffect`. In development you see the effect run twice. Is that a bug in React?

**Priya:** No. It is Strict Mode, on purpose, and only in development. React starts the effect, runs the cleanup, and starts it again, to check that my cleanup really undoes the setup. If the cleanup were missing, I would get two timers, and I would notice. In production the effect runs once.

Her component is `src/clock.jsx`: the effect logs, starts a timer, and returns a cleanup that logs and stops it.
```bash
npm run run2
```
```text
-- with StrictMode (development) --
effect: start the timer
cleanup: stop the timer
effect: start the timer
(page closes)
cleanup: stop the timer
-- without StrictMode --
effect: start the timer
(page closes)
cleanup: stop the timer
```
Start, stop, start; then the page closes and one more cleanup. Without Strict Mode: start, then stop when the page closes. The Strict Mode run is a rehearsal.

**Feedback.** Good: "on purpose, and only in development", and she said what it checks. To add: what a cleanup should do (stop timers, close connections, remove listeners), and that you fix the effect, you never remove Strict Mode (M7-L2).

### Round 3 · A Next.js question

**Rahul:** In a Next.js app, when do you write `"use client"` at the top of a file?

**Priya:** By default, components in the `app` folder are Server Components. They run on the server and their code is not sent to the browser. I add `"use client"` only when a component needs the browser: state, effects, click handlers, or things like `localStorage`. I keep those client components small, at the edges of the tree, so most of the page stays on the server.

**Feedback.** Good: the default, the rule, and the habit of small client components. To add: one real example, like an Enroll button; the cost (a client component's code is sent to the browser); and that props going from server to client must be plain values (M19-L3).

### Round 4 · Machine coding

**Rahul:** Build a search box that shows suggestions while the user types. Before you write any code, what do you do?

**Priya:** I ask questions first. How many suggestions? What shows when the box is empty, or when the request fails? Must the arrow keys and Enter work? Then my plan: a controlled input, a short wait after the last key (debounce), and cancelling an old request when a new one starts, so a slow old answer never replaces a fresh one.

**Rahul:** Show me the debounce. She writes it on the board (`src/debounce.mjs`): keep a timer; every call clears the old timer and starts a new one; only when the user stops typing for 250 ms does the real function run.
```js
function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
```
She types the five letters of "react", 80 ms apart:
```bash
npm run debounce
```
```text
typed: r
typed: re
typed: rea
typed: reac
typed: react
search called with: react
```
Five lines of typing, but the search is called just once, with the whole word.

**Feedback.** Good: questions before code, a plan before code, and she thought of the slow old answer. To add: say how it works with the keyboard and a screen reader (M16-L3), and clear the timer when the component goes away, the same cleanup idea as round 2 (M7-L6).

### Round 5 · System design

**Rahul:** Design the front end of a news feed. You have ten minutes.

**Priya:** Before I draw anything, I ask who uses it: phones or laptops? How many posts, and how fast must it feel? Then I walk the same seven steps every time: requirements, data and API, component tree, state, performance and caching, accessibility, and failure modes. For the feed: a list that loads page by page, with a cursor from the API. Only the posts near the screen are drawn. Images have a fixed size, so nothing jumps. While a page loads, a skeleton. If a page fails, a retry button, and the posts already shown stay on the screen.

**Feedback.** Good: she asked before she drew, and she kept her order. To add: say what you will skip. In ten minutes you cannot cover everything, so name the parts you leave out, and why (M23-L3).

### At the end

Rahul asks: "Do you have questions for us?" Priya asks: "What does a good first month look like here, and how does the team review code?" Good questions show that you are thinking about the work, not only about the test.

## The roadmap

You can build, test, deploy and explain a React app. What next? Three honest options. You do not need all of them; choose by what you want to build.

1. **React Native.** iPhone and Android apps with the React you know. You had a taste in M22-L03, in a browser only. Read the React Native and Expo documentation, then build one small app on a simulator or a real phone. Phones bring their own topics: navigation, permissions, app stores and review times.
2. **Advanced TypeScript.** Module 9 taught the everyday part. Next: generics in depth, utility types, typing library code. Read the TypeScript Handbook and solve small type exercises. It pays off most when you build shared components, like the library in module 16.
3. **Interfaces for generative AI.** Chat screens, and text that arrives word by word. The React part is familiar: state, effects, loading states, and the streaming idea from M19-L4. The hard parts are new: cost, delay, and answers that are wrong. Start with the AI SDK documentation and the documentation of the model you choose. This area changes fast, so check the date on any tutorial, including this one.

## Look back at what you built

Fifteen builds, then the live classroom widget (M22-B16), and the capstone (M23-B17) is next: a course card gallery, a flashcard quiz, a study planner, a live search, the first allcsvideos front end; an enrollment cart, a student dashboard, an instructor course editor, a secure front end with roles, a fast catalog; a component library, a test suite in CI, the site rebuilt on Next.js, a full-stack platform with a database, and a deploy pipeline.

## Your first week of job preparation

One week will not make you ready, but it starts a rhythm, and rhythm is what works.

1. **Day 1: choose your story.** Pick one project from this course, ideally the capstone, and write five sentences: what it does, how it is built, one hard bug you fixed, one number you improved, and what you would do next.
2. **Days 2 and 3: the fifty questions.** Ten a day. Answer each one out loud in under a minute, then check the model answer and note the lesson to watch again.
3. **Day 4: one machine-coding task, with a timer.** Ask your requirement questions first, build, and keep the last five minutes for the keyboard and the edge cases.
4. **Day 5: one system design**, on paper, ten minutes, using the seven steps, talking aloud while you draw.
5. **Days 6 and 7: a practice interview with a real person**, a friend or a mentor, and then send your first applications. A person's feedback beats any video.

Be patient. For most people, finding a job takes weeks or months. A "no" is information, not a verdict. Keep the weekly rhythm going.

## Try it yourself

1. Ask a friend to be Rahul. Pick five questions from lesson 1 (`../m23-l01-the-50-most-asked-react-questions/`), answer them out loud without notes, then swap.
2. In `src/counters.jsx`, change the plain counter to `setPlain(n => n + 1)` three times. Predict the number after one click, run `npm run build` and `npm run run1`, and compare.
3. In `src/debounce.mjs`, change the wait to 40 ms (less than the 80 ms between keys). How many times is the search called? Run it and check.
4. Write your own 5-sentence project story (day 1 of the plan) and say it out loud in under a minute.

**Answers.** (2) 3: each call gets the latest value, so the plain counter now behaves like the updater counter. (3) 5 times (once per letter): each key is further apart than the wait, so the timer runs out before the next key arrives.

## Clean up

```bash
find run node_modules -delete
```
The folder only has these small files and nothing was left running.

## Next

[M23-B17 · Capstone: The allcsvideos Learner App](../m23-b17-capstone-the-allcsvideos-learner-app/)

This is the last lesson before the capstone. After it comes the final practice sheet in `../../practice/m23-interviews-and-capstone/`.
