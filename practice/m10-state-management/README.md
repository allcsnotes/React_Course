# Module 10 practice sheet: 20 state-management exercises

20 small React and TypeScript exercises for Module 10 (prop drilling and composition, context, `useReducer`, context and a reducer together, Zustand, and choosing where state lives), written around allcsvideos.com and its cast (Asha, Lukas, Priya, Meera, and Rahul as interviewer). Do them after the lessons M10-L01 to M10-L05 and the build [M10-B06](../../m10-state-management/m10-b06-build-an-enrollment-cart/).

## How to use this sheet

1. Open [sheet.md](sheet.md). Each exercise has a goal, starter code if it helps, what you should see (with the real text from a browser run), a hint, the solution and a "where this shows up" line.
2. **Try first.** Make a practice project (`npm create vite@latest practice`, choose React and TypeScript, then `npm install zustand zod`), put each exercise in its own file `src/exercises/Ex01.tsx` to `Ex20.tsx`, and render it from `src/App.tsx`. Take `StrictMode` out of `src/main.tsx` for the render counters (the sheet says which exercise needs it back).
3. **Then check.** Open the hint first, and only then the solution.
4. The [solutions](solutions/) folder is a ready-to-run Vite + React + TypeScript project with a menu of all 20 exercises.

## Before you start

- Node 24 (`node --version`).
- No Docker. No server, router or data fetching is needed.

## Run the solutions

```bash
cd solutions
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`) and click an exercise. Each exercise is `solutions/src/exercises/ExNN.tsx`; helpers shared by several exercises are in `solutions/src/lib/` and `solutions/src/reducers/`.

Three exercises are checked with plain Node and no browser (Node 24 runs `.ts` files directly):

```bash
node scripts/ex11.ts
node scripts/ex18.ts
node scripts/ex19.ts
```

Three exercises have a type error to read (2, 7 and 14). Their broken files are in `solutions/broken/`:

```bash
npx tsc -p tsconfig.broken.json
```

```text
broken/Ex02Broken.tsx(16,8): error TS2741: Property 'user' is missing in type '{}' but required in type '{ user: User; }'.
broken/Ex07Broken.tsx(10,11): error TS2339: Property 'theme' does not exist on type 'ThemeValue | null'.
broken/Ex14Broken.tsx(27,26): error TS2345: Argument of type '{ type: "clearDone"; }' is not assignable to parameter of type 'never'.
```

The finished project also passes `npx tsc -b` and `npm run build`.

## Files in this folder

| File | What it is |
|------|------------|
| `sheet.md` | The 20 exercises with hints, solutions and real text |
| `solutions/` | The Vite + React + TypeScript project with all 20 solutions and a menu |
| `solutions/scripts/ex11.ts`, `ex18.ts`, `ex19.ts` | Node-only checks for exercises 11, 18 and 19 |
| `solutions/broken/` | The three files with a type error (exercises 2, 7 and 14) |

## Clean up

```bash
rm -rf solutions/node_modules solutions/dist
```

## Next

Module 11: [M11-L01 Why Server State Is Different](../../m11-server-state-with-tanstack-query/m11-l01-why-server-state-is-different/).
