# M18-L01 · Linting, Formatting and Strict Mode

> Video: Module 18, Lesson 1. Watch it first, then follow along here.

## What you'll learn

- What a linter (a proofreader) and a formatter (a typesetter) do, and the difference between them
- How to read an oxlint or ESLint message: file, line, column, severity, rule, help
- The three classic mistakes: a missing effect dependency, a hook called conditionally, an unused import
- Prettier: one agreed style, `--check` and `--write`
- TypeScript `strict` mode and React `<StrictMode>`, and a bug that only strict mode shows
- A pre-commit gate with Husky and lint-staged, and four mistakes (silencing, skipping, fighting strict mode, ignoring warnings)

## Before you start

- Node 24 (`node --version`) and git. No Docker. Nothing is pushed anywhere; the Husky demo uses a scratch git repository.
- The starter is the Vite + React 19.3.1 + TypeScript project from Module 1. Versions from `package-lock.json`: oxlint 1.90.0, ESLint 10.13.0, eslint-plugin-react-hooks 7.1.1, typescript-eslint 8.72.1, Prettier 3.9.10, Husky 9.1.7, lint-staged 17.6.0, Vite 8.3.5. `tsc` is TypeScript 7.0.2.
- The practice API is `api/server.mjs` (port 8181), a local Node stand-in; the page needs it for the course title.

## Files in this folder

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json`, `.npmrc` | Pinned project. `.npmrc` sets `legacy-peer-deps=true` (see step 4) |
| `.oxlintrc.json` | oxlint rules. I added `ignorePatterns` so it skips `versions/` and `demo/` |
| `eslint.config.js` | ESLint flat config (also ignores `versions` and `demo`) |
| `.prettierrc` | Two choices: no semicolons, single quotes |
| `.husky/pre-commit` | One line: `npx lint-staged` (the `lint-staged` block is in `package.json`) |
| `src/` | The course page. It starts as version `v0` (with the three problems) |
| `versions/` | `common` (shared app files) and layers `v0` (the bug), `v1`, `vfix` (all fixed), `vdis` (silenced with a comment), `vs` / `vsfix` (React StrictMode demo) |
| `use-version.sh` | `./use-version.sh vfix` puts `common` into `src/` then applies the layer |
| `demo/` | `cart.ts` and two tsconfig files for the `strict` demo |
| `api/server.mjs` | The practice API |

## Follow along

```bash
npm install
node api/server.mjs     # in a second terminal
npm run dev             # http://localhost:5181
```

### 1. The problem: a page that quietly shows the wrong course

Asha's page has two buttons, React and Python. Click React: React for Beginners, taught by Meera. Click Python: the button lights up but the page still says React for Beginners. No red error, no warning. A tool can find it in a second, before the page opens.

### 2. The proofreader and the typesetter

A **linter** reads your code without running it and warns about mistakes and risky habits. A **formatter** rewrites how the code looks (spaces, quotes, line breaks) and changes nothing about what it does. Two more guards work while you build: TypeScript in strict mode, and React's StrictMode. And a **pre-commit hook** (a little program git runs right before it saves a commit) closes the gate on bad code.

### 3. The first linter: oxlint

The starter has `.oxlintrc.json` and a `lint` script:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": [
    "react",
    "typescript",
    "oxc"
  ],
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": [
      "warn",
      {
        "allowConstantExport": true
      }
    ]
  },
  "ignorePatterns": [
    "versions/**",
    "demo/**",
    "dist/**"
  ]
}
```

`plugins` says which families of rules to use. `react/rules-of-hooks` is an error (must be fixed); `only-export-components` is a warning. Run it on the broken page (`src/` is `v0`):

```bash
npm run lint
```

```text

> web@0.0.0 lint
> oxlint

src/App.tsx:1:10: warning eslint(no-unused-vars): Identifier 'useEffect' is imported but never used. help: Consider removing this import.
src/SeatsBadge.tsx:7:29: error react-hooks(rules-of-hooks): React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render. help: Move the Hook call before the condition, or call it unconditionally and branch inside the Hook/effect instead.
src/CoursePage.tsx:10:33: warning react-hooks(exhaustive-deps): React Hook useEffect has a missing dependency: 'slug' help: Either include it or remove the dependency array.
exit code: 1
```

Every message has the same shape: file, line, column; how serious (warning or error); the rule in brackets; a help sentence. The three problems:

1. `src/CoursePage.tsx` line 10: `useEffect` has a missing dependency `slug`. The effect reads `slug`, but the list at the end is empty (`[]`), which promises "this effect reads nothing that can change". When the button changes `slug`, the effect does not run again.
2. `src/SeatsBadge.tsx` line 7: `useState` is called after an early `return` (Module 4, Lesson 2). On a sold-out draw the hook is skipped and React loses count.
3. `src/App.tsx` line 1: `useEffect` is imported but never used.

The fixes: put `slug` in the list (`[slug]`), move the hook above the `if`, delete the import. All three are in `versions/vfix`:

```bash
./use-version.sh vfix
npm run lint
```

```text

> web@0.0.0 lint
> oxlint

exit code: 0
```

No output at all: on the command line, no news is good news. On the real page, click Python and the title says Python from Zero.

### 4. The second linter: ESLint

Almost every team already uses ESLint (a project with `eslint.config.js` uses it). The packages are in `package.json` already: `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`, `prettier`.

A real snag from the video: typescript-eslint 8.72 does not support TypeScript 7 yet. The TypeScript team's fix uses two names. The name `typescript` points at the older 6.0 package that tools like typescript-eslint still read, and `@typescript/native` holds 7.0, so the `tsc` command is still version 7. In `package.json`:

```json
"typescript": "npm:@typescript/typescript6@^6.0.2",
"@typescript/native": "npm:typescript@^7.0.2",
```

and install with `--legacy-peer-deps` (a workaround until typescript-eslint supports TypeScript 7; the `.npmrc` here does it for you). Check:

```bash
npx tsc --version
npx eslint --version
```

```text
Version 7.0.2
v10.13.0
```

`eslint.config.js` is a list: the recommended rules for JavaScript, TypeScript, hooks and fast refresh, applied to every `ts`/`tsx` file, with `dist` ignored:

```js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'versions', 'demo']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
  },
])
```

Run it on the broken page (`./use-version.sh v0` first):

```bash
npx eslint .
```

```text
src/App.tsx
  1:10  error  'useEffect' is defined but never used  @typescript-eslint/no-unused-vars

src/CoursePage.tsx
  13:6  warning  React Hook useEffect has a missing dependency: 'slug'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

src/SeatsBadge.tsx
  7:29  error  React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render  react-hooks/rules-of-hooks

✖ 3 problems (2 errors, 1 warning)
```

(ESLint prints the full path of each file; I shortened it.) The same three problems, with different words. Apply the three fixes (`./use-version.sh vfix`), run again, and nothing is printed. Ask the shell: `echo $?` prints `0`. When a linter finds problems it ends with `1`, and that is how other programs know to stop.

### 5. The formatter: Prettier

`src/price.ts` was written in a hurry: no spaces around the colon, a missing indent, double quotes here and there. `.prettierrc` holds the only two choices the team makes, once:

```text
{
  "semi": false,
  "singleQuote": true
}
```

```bash
./use-version.sh v0
npx prettier --check src
```

```text
Checking formatting...
[warn] src/price.ts
[warn] Code style issues found in the above file. Run Prettier with --write to fix.
```

`--check` only looks. With `--write`, Prettier fixes the file and prints every file it looked at, with the time (`unchanged` means it was already tidy):

```bash
npx prettier --write src
```

```text
src/api.ts 27ms (unchanged)
src/App.tsx 10ms (unchanged)
src/CoursePage.tsx 8ms (unchanged)
src/index.css 12ms (unchanged)
src/main.tsx 1ms (unchanged)
src/price.ts 1ms
src/SeatsBadge.tsx 2ms (unchanged)
```

(Your times will differ.) The same code, the same meaning. `price.ts` before:

```ts
export function formatPrice(cents:number){
const dollars=cents/100
    const label = "USD"
  return "$"+dollars.toFixed(2)+" "+ label
}
```

and after:

```ts
export function formatPrice(cents: number) {
  const dollars = cents / 100
  const label = 'USD'
  return '$' + dollars.toFixed(2) + ' ' + label
}
```

With a formatter nobody argues about commas in a review, and git shows only real changes. A linter finds mistakes; a formatter only changes the look. The "format on save" from Module 1, Lesson 3 runs Prettier for you.

### 6. TypeScript strict mode

`demo/cart.ts` is written the loose way: a function with no label on its input, a `find` that may find nothing, and a page element that may not exist. First with `strict` set to false:

```bash
npx tsc -p demo/tsconfig.nostrict.json --strict false
echo $?
```

```text
0
```

Every line is accepted. Now `"strict": true` (`demo/tsconfig.strict.json`):

```bash
npx tsc -p demo/tsconfig.strict.json
```

```text
demo/cart.ts(1,28): error TS7006: Parameter 'items' implicitly has an 'any' type.
demo/cart.ts(2,24): error TS7006: Parameter 'sum' implicitly has an 'any' type.
demo/cart.ts(2,29): error TS7006: Parameter 'item' implicitly has an 'any' type.
demo/cart.ts(6,13): error TS18048: 'found' is possibly 'undefined'.
demo/cart.ts(9,1): error TS18047: 'title' is possibly 'null'.
exit code: 1
```

Five errors, three kinds: the parameter implicitly has an `any` type (the checker will not guess your input); `found` is possibly `undefined` (`find` returns nothing when no name matches); `title` is possibly `null` (`getElementById` returns `null` when there is no such element). Each is a real crash waiting in the browser (`Cannot read properties of undefined`); strict mode turns it into a red line in your editor. In TypeScript 7, `strict` is on unless you turn it off: `demo/tsconfig.nostrict.json` has no `strict` key at all and gives the same five errors. Older projects often have it off, so always look.

### 7. React StrictMode

`main.tsx` wraps the app in `<StrictMode>`. In development it runs effects twice (Module 7) and it also calls every component twice, to catch components that change what they should not. `versions/vs/App.tsx` reverses a list of three courses in place:

```tsx
const courses = ['React', 'Python', 'SQL']

function Newest({ list }: { list: string[] }) {
  const newest = list.reverse()
  return (
    <ul>
      {newest.map((name) => (
        <li key={name}>{name}</li>
      ))}
    </ul>
```

```bash
./use-version.sh vs
npm run dev
```

Guess the order. Real result in development: `React Python SQL`, as if `reverse` did nothing. Now build and open the built site, like your visitors:

```bash
npm run build
npm run preview     # the built site, also on port 5181 (stop the dev server first)
```

On the built site: `SQL Python React`. Same code, two different pages. `reverse()` changes the list that came in. In development React calls the component twice, so the list is reversed and then reversed back. On the real site it is called once. The bug is in our code: a component must never change what it receives. The fix is a copy first (`versions/vsfix`, `[...list].reverse()`), and then both development and production show `SQL Python React`. ESLint, run on the broken version, said nothing: linters cannot catch everything.

### 8. The gate: Husky and lint-staged

Husky sets up the git hook; lint-staged runs your checks only on the files staged for this commit. The setup is already in this folder: `npx husky init` made `.husky/pre-commit`, whose one line is `npx lint-staged`, and `package.json` has:

```json
"lint-staged": {
  "*.{ts,tsx}": [
    "prettier --write",
    "eslint --max-warnings=0"
  ]
}
```

`--max-warnings=0` means even a warning stops the commit. Try it in a scratch copy (never in the course repository):

```bash
cp -R . ../gate-demo   # then work inside ../gate-demo, without node_modules if you like
cd ../gate-demo
git init -b main
npm install            # the "prepare" script runs husky and installs the hook
./use-version.sh vfix
git add -A
git reset src/CoursePage.tsx          # leave the course page for the next commit
git commit -m "start the course page"
```

(Set a throw-away `git config user.name` / `user.email` in the scratch repo if git asks.) The first commit passes: lint-staged runs Prettier and ESLint on the staged files, all with a tick. Now Asha commits the page with the missing dependency:

```bash
cp versions/v0/CoursePage.tsx src/CoursePage.tsx
git add src/CoursePage.tsx
git commit -m "load the course in an effect"
```

Guess: does the commit happen? Real run:

```text
⋯ Backing up original state…
✔ Done backing up original state (e0243f6)!
⋯ Running tasks for staged files…
    src/**/*.{ts,tsx} — 1 file
      ⋯ prettier --write
      ⋯ eslint --max-warnings=0

✔ prettier --write
✖ eslint --max-warnings=0

✖ Failed to run tasks for staged files!
↓ Skipped staging changes from tasks…
⋯ Reverting to original state because of errors…
✔ Done reverting to original state!
⋯ Cleaning up temporary files…
✔ Done cleaning up temporary files!

✖ eslint --max-warnings=0:

/path/to/your-project/src/CoursePage.tsx
  13:6  warning  React Hook useEffect has a missing dependency: 'slug'. Either include it or remove the dependency array  react-hooks/exhaustive-deps

✖ 1 problem (0 errors, 1 warning)

ESLint found too many warnings (maximum: 0).
husky - pre-commit script failed (code 1)
```

Prettier is fine, ESLint fails, Husky says `pre-commit script failed`, and git did not make the commit: the bad code never entered the history. Fix the list (`cp versions/vfix/CoursePage.tsx src/CoursePage.tsx`), stage again, commit: both tasks show a tick and the commit is made.

## Common mistakes

1. **Silencing the linter.** `versions/vdis` adds `// eslint-disable-next-line react-hooks/exhaustive-deps`. `npx eslint src/CoursePage.tsx` prints nothing (exit code 0) and the bug is still there: Python still shows React. The comment only hides the smoke alarm. Fix the list instead.
2. **Skipping the gate.** `git commit --no-verify` skips the hook. Real run: the commit goes in, with the bug inside. Never make it a habit. The back-up for a hurried day is the same checks running on a server for every push (adding a lint step to the CI of Module 17 is your exercise; it was not run in the video).
3. **Fighting strict mode.** When an effect runs twice in development, some people take StrictMode out. The double run is not a bug in React. Add the cleanup (Module 7).
4. **Treating warnings as noise.** A project with 200 warnings hides the one that matters. Fix them, or switch a rule off on purpose in the config file, where everybody can see it.

## Clean up

Delete the scratch `gate-demo` folder. Stop the API and the dev server (Ctrl+C). `./use-version.sh v0` puts `src/` back to the start. `node_modules/` and `dist/` can be deleted any time.

## Key points

- A linter reads code without running it and finds mistakes; read each message as file, line, severity, rule, help. `react-hooks/exhaustive-deps` and `rules-of-hooks` protect you from most hook mistakes.
- Prettier formats the layout and changes nothing else. TypeScript `strict` finds `any`, `undefined` and `null` before you run. React StrictMode draws components twice in development to show code that changes its input.
- Husky and lint-staged run the checks on every commit and stop the commit when they fail.

Interview tip. If Rahul, the interviewer, asks "what is the difference between a linter and a formatter?": a linter finds mistakes and risky patterns, like a missing dependency. A formatter only changes layout, never meaning. Teams use both, and run both on every commit.

## Try it yourself

In your own project change Prettier to double quotes and run `--write`: watch every file change. Then add the check to the pre-commit hook and try to commit one messy file.

## Next

[M18-L02 · Project Structure That Scales](../m18-l02-project-structure-that-scales/README.md)
