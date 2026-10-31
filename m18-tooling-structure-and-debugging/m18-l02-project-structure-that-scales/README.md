# M18-L02 · Project Structure That Scales

> Video: Module 18, Lesson 2. Watch it first, then follow along here.

## What you'll learn

- Packing by type (components, pages, store) versus packing by feature, and why a change should not be a treasure hunt
- Four rules: group by feature, a `shared` folder, a front door (`index.ts`) per feature, imports that go one way
- How to refactor safely: move one thing, run the tests, the type check and the build, then move the next
- `git mv`, and what the type checker tells you after files move
- Splitting `api.ts` into a shared client and one small API file per feature
- An import alias (`@`) and why it must be told to two tools

## Before you start

- Node 24 (`node --version`) and git. No Docker. Nothing is pushed anywhere.
- Earlier: Module 17 (tests are the safety net), Module 10 (the cart store). The app is Asha's shop: a course list, a cart with coupons, and a login. Versions: React 19.3.1, React Router 8.5.1, Zustand 5.x, TanStack Query 5.x, Vitest 5.0.5, MSW 3.0.3, TypeScript 7.0.2, Vite 8.3.5.
- The login `lukas@example.com` / `learn-fast-42` in the tests and in `api/server.mjs` is a **demo value** for the practice API only.
- This lesson moves files with git. Work on a **copy of this folder outside the course repository**, so you do not touch its history:

```bash
cp -R m18-l02-project-structure-that-scales ~/shop-refactor
cd ~/shop-refactor
git init -b main
npm install
git add -A && git commit -m "start"
```

## Files in this folder

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json`, `tsconfig*.json`, `vite.config.ts`, `index.html` | Project setup. Scripts: `test`, `typecheck`, `build`. In `vite.config.ts` I set `include: ['src/**/*.test.{ts,tsx}']` so Vitest ignores `versions/` |
| `src/` | The app, packed by type (`components/`, `pages/`, `store/`, ...). This is version `v0` |
| `versions/` | `v0` (by type), `v1` (cart moved, imports not fixed), `v2` (cart moved and fixed), `final` (by feature, with the `@` alias), `m1` and `m2` (alias in only one config), `common` (configs) |
| `scripts/step1-move-the-cart.sh`, `scripts/step2-move-the-rest.sh` | The exact `git mv` commands of the video |
| `use-version.sh` | `./use-version.sh final` puts a version's `src/` and configs in place |
| `api/server.mjs` | The practice API (the tests use MSW, so it is only needed for `npm run dev`) |

## Follow along

### 1. The problem: every change is a treasure hunt

Twelve tests pass, the type checker is happy and the build works. Meera asks for one small change to the cart. Asha searches the project for the word `cart`:

```bash
grep -rli cart src
```

```text
src/App.tsx
src/test/setup.ts
src/types.ts
src/components/AddToCartButton.tsx
src/components/CourseCard.tsx
src/components/RootLayout.tsx
src/pages/Cart.tsx
src/pages/Catalog.test.tsx
src/pages/Cart.test.tsx
src/store/cartStore.ts
src/store/totals.ts
src/store/cartStore.test.ts
```

Twelve files, in five different folders. Here is the tree:

```bash
npx tree-node-cli src
```

```text
src
├── App.tsx
├── api.ts
├── components
│   ├── AddToCartButton.tsx
│   ├── CourseCard.tsx
│   └── RootLayout.tsx
├── context
│   └── AuthContext.tsx
├── index.css
├── main.tsx
├── pages
│   ├── Cart.test.tsx
│   ├── Cart.tsx
│   ├── Catalog.test.tsx
│   ├── Catalog.tsx
│   ├── Login.test.tsx
│   ├── LoginPage.tsx
│   └── MyCourses.tsx
├── store
│   ├── cartStore.test.ts
│   ├── cartStore.ts
│   ├── totals.test.ts
│   └── totals.ts
├── test
│   ├── renderApp.tsx
│   ├── server.ts
│   └── setup.ts
├── types.ts
└── utils
    └── formatPrice.ts
```

(`tree-node-cli` is a small npm tool that prints the same picture as the `tree` command. `npx` downloads it the first time.) Every folder is named after what its files are (components, pages, store, context, utils), none after what they are for. To change how the cart works Asha opens a page, a store, a button, a layout and a type file, and nothing on the screen says they belong together.

### 2. Pack the school bag by subject

Packing by type is one pouch for all the pens, one for all the notebooks, for every subject together. Packing by feature is one folder per subject. Neither is wrong; by type is fine for a small app and hurts as it grows. A feature is something a person can do: browse the courses, use the cart, log in, see their own courses.

Four rules:

1. **Group by feature.** A feature folder holds its page, components, server calls, types and tests.
2. **A `shared` folder** for pieces two or more features use and that know nothing about any one feature. A price formatter is shared; a cart total is not, because it knows about the cart.
3. **A front door.** Every feature has one `index.ts` that lists what other features may use. Everything else is private.
4. **Imports go one way:** `app` may use features, features may use `shared`, `shared` never uses features. If two features need each other, one is cut in the wrong place.

### 3. The safety net first

```bash
npm test
npm run typecheck
npm run build
```

Baseline, all green: 5 test files and 12 tests pass, `typecheck` prints nothing (nothing means no errors), and the build ends with

```text
dist/assets/index-_Yc9U378.css    2.25 kB │ gzip:   0.87 kB
dist/assets/index-CH9jW6Vp.js   382.25 kB │ gzip: 117.34 kB
✓ built in 415ms
```

(382.25 kB of JavaScript before the refactor; your times will differ.)

### 4. Step one: move the cart

```bash
bash scripts/step1-move-the-cart.sh
git status --short
```

`git mv` moves a file and lets git remember it was moved. Seven commands, and the cart has a home. Git agrees: seven lines, each starting with `R` for renamed.

```text
R  src/components/AddToCartButton.tsx -> src/features/cart/AddToCartButton.tsx
R  src/pages/Cart.test.tsx -> src/features/cart/CartPage.test.tsx
R  src/pages/Cart.tsx -> src/features/cart/CartPage.tsx
R  src/store/cartStore.test.ts -> src/features/cart/cartStore.test.ts
R  src/store/cartStore.ts -> src/features/cart/cartStore.ts
R  src/store/totals.test.ts -> src/features/cart/totals.test.ts
R  src/store/totals.ts -> src/features/cart/totals.ts
```

No code has changed. Guess what the type checker says:

```bash
npm run typecheck
```

Red: 23 errors, and the first lines say `Cannot find module` again and again.

```text
src/App.tsx(3,18): error TS2307: Cannot find module './pages/Cart' or its corresponding type declarations.
src/components/CourseCard.tsx(4,29): error TS2307: Cannot find module './AddToCartButton' or its corresponding type declarations.
src/components/RootLayout.tsx(3,30): error TS2307: Cannot find module '../store/cartStore' or its corresponding type declarations.
...
```

Every import that pointed to an old place is broken; the type checker found them all at once, before any user could. Now fix the imports (`./use-version.sh v2` does it for you; compare it with `git diff`). Inside the cart folder, files import each other with `./`. One more change: the button used to take a whole course; now it takes a small cart item (`slug`, `title`, `price`), so the cart never has to know what a course is. And the cart gets a front door, `src/features/cart/index.ts`:

```ts
export { default as AddToCartButton } from './AddToCartButton'
export { default as CartPage } from './CartPage'
export { useCartStore } from './cartStore'
```

```bash
./use-version.sh v2
git add -A
npm run typecheck
npm test
```

Type check: nothing. Tests: the same 12 pass, and the paths in the output now point into the cart folder (`src/features/cart/totals.test.ts`, ...).

```text
cart
├── AddToCartButton.tsx
├── CartPage.test.tsx
├── CartPage.tsx
├── cartStore.test.ts
├── cartStore.ts
├── index.ts
├── totals.test.ts
├── totals.ts
└── types.ts
```

That is the rhythm: move one thing, run the checks, then move the next. Never everything at once.

### 5. The rest of the features

Same rhythm: the login page and its context go to `auth`, the course list and the course card to `catalog`, My courses gets its own folder, and the app and the layout go to `app`. Twelve more `git mv` commands (`scripts/step2-move-the-rest.sh`), then the checks.

One file needs more than a move: `api.ts` held every server call in one place, so every feature depended on it. Asha splits it. The generic part (the request function and the login token) goes to `shared/api/client.ts`, and each feature gets a small `api.ts` with only its own calls:

```ts
import { request } from '@/shared/api/client'
import type { Course } from './types'

export const getCourses = () => request<Course[]>('/api/courses')
```

One import in the cart still has an ugly path with two jumps up the tree. Asha adds an alias, a short name for the source folder: `@`. Now `import formatPrice from '@/shared/lib/formatPrice'` reads the same from every file. An alias must be told to **two tools**: the type checker reads it in `tsconfig.app.json`, the bundler (Vite, and therefore Vitest) in `vite.config.ts`:

```json
"paths": { "@/*": ["./src/*"] }
```

```ts
resolve: {
  alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
},
```

All together (`final` has the moved files, the split API, the alias and the front doors):

```bash
bash scripts/step2-move-the-rest.sh
./use-version.sh final
git add -A
```

### 6. The result

Here is the new tree, two levels deep. You can read it like a table of contents:

```text
src
├── app
│   ├── App.tsx
│   ├── RootLayout.tsx
│   └── index.css
├── features
│   ├── auth
│   ├── cart
│   ├── catalog
│   └── my-courses
├── main.tsx
├── shared
│   ├── api
│   └── lib
└── test
    ├── renderApp.tsx
    ├── server.ts
    └── setup.ts
```

Proof: `npm test` still shows 5 files and 12 tests passing (the same 12), `npm run typecheck` prints nothing, and the build finished. The bundle is 382.25 kB before and 382.27 kB after. Git counts the whole refactor in one line (`git diff -M --cached --shortstat HEAD`):

```text
 36 files changed, 127 insertions(+), 109 deletions(-)
```

Do the rules hold? A search for imports that reach into another feature's private files prints nothing:

```bash
grep -rnE "@/features/[a-z-]+/" src
```

(no output, exit code 1 from grep). A search is not a guard, though; an ESLint rule from lesson one can enforce this on a team. That is not shown here.

## Common mistakes

1. **Deep folders for a tiny app.** Start flat, and split when a folder gets crowded (around eight to ten files in one folder is a good sign).
2. **A dumping ground called `utils` or `common`.** If a file does not know where to live, it often belongs to a feature.
3. **Features that import each other's insides.** Use the front door only. If two features need each other (the cart and the catalog did), change what is passed in (the cart item) instead of importing the other side.
4. **Moving files and changing code in one step.** Move first, check, then change. If something breaks, you know why.
5. **Forgetting that an alias lives in two places.** Try both halves:

   - Only `tsconfig.app.json` (`cp versions/m1/vite.config.ts versions/m1/tsconfig.app.json .`, with `final` in `src/`): the type check is happy but the tests are red:

```text
> vitest run --reporter=verbose


 RUN  v5.0.5 /path/to/your-project


⎯⎯⎯⎯⎯⎯ Failed Suites 5 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/features/cart/CartPage.test.tsx [ src/features/cart/CartPage.test.tsx ]
 FAIL  src/features/cart/cartStore.test.ts [ src/features/cart/cartStore.test.ts ]
 FAIL  src/features/cart/totals.test.ts [ src/features/cart/totals.test.ts ]
 FAIL  src/features/auth/LoginPage.test.tsx [ src/features/auth/LoginPage.test.tsx ]
 FAIL  src/features/catalog/CatalogPage.test.tsx [ src/features/catalog/CatalogPage.test.tsx ]
Error: Failed to resolve import "@/features/cart" from "src/test/setup.ts". Does the file exist?
  Plugin: vite:import-analysis
```

   - Only `vite.config.ts` (`versions/m2`): the tests pass, but the type check says `Cannot find module '@/features/auth'` and so on (25 errors in my run).

   Two tools, two places, and both must agree. `./use-version.sh final` puts both configs back.

One honest note: this is one way to arrange a project, not a law. Other teams use other names. A framework like Next.js (Module 19) decides some folder names for you, and the same ideas still apply.

## Clean up

Delete the `~/shop-refactor` copy when you are done. In this folder nothing was changed: `src/` is still version `v0`.

## Key points

- Pack by feature, not by type: a folder for everything a feature needs, a `shared` folder for pieces many features use, a front door for each feature, and imports that go one way (app, then features, then shared).
- Move one feature at a time, and after every step run the tests, the type check and the build. The safety net from Module 17 is what makes a refactor safe.

Interview tip. If Rahul, the interviewer, asks "how would you structure a large React app?": by feature, with a shared folder and one-way imports, so people can work on one feature without touching the others.

## Try it yourself

Take your own project, pick the smallest feature, and move it into its own folder with a front door. Run the tests after every move.

## Next

[M18-L03 · Debugging React Apps](../m18-l03-debugging-react-apps/README.md)
