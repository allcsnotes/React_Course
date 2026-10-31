# Module 23 practice sheet: 50 interview questions and 10 machine-coding tasks

The last sheet of the course. **Part 1** is the fifty most-asked React questions (the same fifty, in the same order, as [M23-L01](../../m23-interviews-and-capstone/m23-l01-the-50-most-asked-react-questions/)), each with a hint and a model answer you can say out loud. **Part 2** is ten machine-coding tasks: the four from [M23-L02](../../m23-interviews-and-capstone/m23-l02-the-machine-coding-round/) (search box, endless list, star rating, nested comments) and six more in the same style (tabs, a toast stack, a modal with a focus trap, a debounced filter table, a reorder list with buttons, a multi-step form). Do it after the lessons [M23-L01](../../m23-interviews-and-capstone/m23-l01-the-50-most-asked-react-questions/) to [M23-L04](../../m23-interviews-and-capstone/m23-l04-mock-interview-and-roadmap/) and the capstone [M23-B17](../../m23-interviews-and-capstone/m23-b17-capstone-the-allcsvideos-learner-app/).

## How to use this sheet

1. Open [sheet.md](sheet.md). For each question, say the answer out loud in your own words first. Then open the hint (it tells you where the course taught it), and last the model answer.
2. For Part 2, make your own practice project (see below) and put each task in its own file. Set a timer. Ask the requirement questions first, out loud, and write the answers at the top of the file as comments. Only then open the solution.
3. The same code is in [solutions/](solutions/) as a ready-to-run project, with the real text each finished solution showed in a real browser run (`solutions/shots/`).

## Before you start

- Node 24. Check with `node --version`.
- For Part 2 make one practice project: `npm create vite@latest practice`, choose **React** and **TypeScript**, then `cd practice` and `npm run dev`. Put each task in `src/tasks/T01.tsx` to `T10.tsx`, each with `export default function T01() { ... }`, and show it from `src/App.tsx`. Take `StrictMode` out of `src/main.tsx` while you do tasks 1, 2 and 8: they count real runs and real requests, and `StrictMode` runs effects twice in development (M7-L2).
- Docker is not needed. Nothing is installed globally.

## Run the solutions

```bash
cd solutions
npm install
npm run build                 # tsc -b and vite build
```
```text
dist/index.html                   0.49 kB │ gzip:  0.31 kB
dist/assets/index-BvIzsC7X.css    3.77 kB │ gzip:  1.24 kB
dist/assets/index-Doj1nxdp.js   237.58 kB │ gzip: 74.36 kB

✓ built in 271ms
```
The type check and the build pass. Then start the practice API in one terminal and the menu in another:
```bash
SEED=1 node api/server.mjs    # terminal 1: the practice API, port 8239; SEED=1 makes the random answer times repeat
npm run dev                   # terminal 2: the menu of tasks, http://localhost:5239
```
Open http://localhost:5239 and click a task (or go straight to `http://localhost:5239/#/7`). The API (`api/server.mjs`) is a small local stand-in: every answer takes a random time from 150 to 1200 ms, `&delay=2500` makes one request slow and `&fail=1` makes it answer with a 500. The two tick boxes at the top of tasks 1 and 2 do this for you.

Four tasks have a check that needs no browser (Node 24 runs `.ts` files directly):
```bash
node scripts/check04.ts       # nested comments
node scripts/check08.ts       # the filter table
node scripts/check09.ts       # reorder
node scripts/check10.ts       # the multi-step form
```
```text
comments: all checks passed
filter: all checks passed
reorder: all checks passed
wizard: all checks passed
```
Their full output is in `solutions/shots/check04.txt`, `check08.txt`, `check09.txt` and `check10.txt` (this run printed the same text).

To repeat the browser run that made the "what you should see" text in the sheet, start the API and the dev server as above and run `node scripts/drive.mjs` (or `node scripts/drive.mjs 7` for one task). It needs `playwright-core` and a Chrome; set `PW` (the path to `playwright-core/index.mjs`) and `CHROME` (the Chrome program) if yours are in other places. It writes `shots/tNN.txt`, `.json` and `.png` (the screenshots are not kept in this repository). When this was repeated for the repository, nine of the ten text files came out identical to the ones in `solutions/shots/`; in task 2 one line about the bottom of the list (`bottom: Loading...` or `bottom: (empty)`) depends on timing and can differ.

## Files in this folder

| File | What it is |
|------|------------|
| `sheet.md` | The sheet: 50 questions (hint and model answer) and 10 tasks (goal, questions to ask, what you should see, a checklist) |
| `solutions/package.json`, `index.html`, `vite.config.ts`, `tsconfig*.json` | The Vite + React 19 + TypeScript project |
| `solutions/src/App.tsx` | The menu of ten tasks |
| `solutions/src/tasks/T01.tsx` to `T10.tsx` | The ten solutions |
| `solutions/src/lib/` | Pure helpers that need no browser: `comments.ts`, `courses.ts`, `reorder.ts`, `wizard.ts`, `api.tsx` |
| `solutions/api/server.mjs` | The practice API for tasks 1 and 2 |
| `solutions/scripts/check04.ts`, `check08.ts`, `check09.ts`, `check10.ts` | Checks that need no browser |
| `solutions/scripts/drive.mjs` | Drives every task in a real browser with Playwright |
| `solutions/shots/` | The real text and data of every browser run (`tNN.txt`, `tNN.json`) and of the checks |

## The tasks

| # | Task | Time budget in the sheet |
|---|------|--------------------------|
| 1 | Search box with suggestions (debounce, cancel, keyboard) | 45 minutes |
| 2 | Endless list (observer, loading flag) | 35 minutes |
| 3 | Star rating (radio group, one tab stop) | 30 minutes |
| 4 | Nested comments (recursion, a new tree) | 45 minutes |
| 5 | Tabs | 25 minutes |
| 6 | Toast stack | 30 minutes |
| 7 | Modal with a focus trap | 30 minutes |
| 8 | Debounced filter table | 30 minutes |
| 9 | Reorder list with buttons | 25 minutes |
| 10 | Multi-step form | 45 minutes |

Every task in the sheet has: a goal, requirement questions to ask first, starter notes, what you should see (real text from a Playwright run), an acceptance checklist (keyboard, empty case, slow case, error case) and the name of the solution file.

## Clean up

```bash
# stop the API and the dev server (Ctrl+C in each terminal)
find dist node_modules -delete
```

## Next

You finished the course. Back to the [repository start page](../../README.md), or go through the module 23 lessons again: [M23-L04 · Mock Interview and Roadmap](../../m23-interviews-and-capstone/m23-l04-mock-interview-and-roadmap/).
