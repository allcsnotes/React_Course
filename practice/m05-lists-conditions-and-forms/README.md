# Module 5 practice sheet: 25 component and state exercises

25 small React exercises for Module 5 (lists, conditions and forms), written around allcsvideos.com and its cast (Asha, Lukas, Priya, Meera, and Rahul as interviewer). Do them after the lessons M05-L01 to M05-L05 and the build [M05-B03](../../m05-lists-conditions-and-forms/m05-b03-build-a-study-planner/).

## How to use this sheet

1. Open [sheet.md](sheet.md). Each exercise has a goal, starter code if it helps, what you should see (with the real text from a browser run), a hint, the solution and a "where this shows up" line.
2. **Try first.** Make a practice project (`npm create vite@latest practice`, choose React and JavaScript), put each exercise in its own file `src/exercises/Ex01.jsx` to `Ex25.jsx`, and render it from `src/App.jsx`.
3. **Then check.** Open the hint first, and only then the solution.
4. The [solutions](solutions/) folder is a ready-to-run Vite + React project with a menu of all 25 exercises.

## Before you start

- Node 24 (`node --version`).
- No Docker. No `useEffect`, refs or context are needed.

## Run the solutions

```bash
cd solutions
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`) and click an exercise. Each exercise is `solutions/src/exercises/ExNN.jsx`.

## Files in this folder

| File | What it is |
|------|------------|
| `sheet.md` | The 25 exercises with hints and solutions |
| `solutions/` | The Vite + React project with all 25 solutions and a menu |

## Clean up

```bash
rm -rf solutions/node_modules solutions/dist
```
