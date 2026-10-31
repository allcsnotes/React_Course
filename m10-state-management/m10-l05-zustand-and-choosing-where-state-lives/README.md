# M10-L05 · Zustand and Choosing Where State Lives

> Video: Module 10, Lesson 5. Watch it first, then follow along here.

## What you'll learn

- What a store is: a plain object outside React that components subscribe to with a selector
- Build the cart with Zustand: `create`, `set`, a hook with no provider, and `getState()` from plain code
- Compare render counters with the context version from lesson 4
- Save the store across refreshes with `persist`
- Avoid three mistakes: no selector, a selector that builds a new object, and changing the state in place
- Choose where each piece of state lives: local, shared, server or address

## Before you start

- Node 24. Check with `node --version`.
- No Docker needed. Best after M10-L04 in `../m10-l04-context-and-reducer-together/`.
- Work in `cart-web/`. Swap versions with `sh ../use-version.sh NAME`.

## Files in this folder

| File | What it is |
|------|------------|
| `cart-web/` | The project (Vite 8.3.5, React 19.3.1, TypeScript 7.0.2, Zustand 5.0.16); `src/` holds `good` |
| `cart-web/src/cartStore.ts` | The Zustand store |
| `cart-web/src/ZustandShop.tsx` | Five small components with render counters, each with its own selector |
| `cart-web/src/cartContext.tsx`, `ContextShop.tsx` | The same page with the two-context version from lesson 4 |
| `cart-web/src/outside.ts` | Plain code that uses the store with `getState()` |
| `cart-web/store-demo.mjs` | A store with no React at all, run with Node |
| `versions/good/` | The finished lesson state |
| `versions/mis1-no-selector/` | Mistake one: no selector |
| `versions/mis2-new-object/` | Mistake two: a selector that returns a new object |
| `versions/shallow/` | The fix with `useShallow` |
| `versions/mis3-mutate-state/` | Mistake three: `push` inside `set` |
| `versions/persist/` | The store wrapped in `persist` |
| `use-version.sh` | Replaces everything in `cart-web/src` with one version |

The address picks the page: `?store=context` shows the context shop, anything else shows the Zustand shop.

## Follow along

```bash
cd cart-web
npm install
npm run dev
```

Open http://localhost:5205 (the Zustand page) and http://localhost:5205/?store=context (the context page).

### 1. The limit of context

This is the cart from lesson 4: a reducer and two contexts. Each piece shows a render counter (`renders 1`). Add a course and the count and total go up; the Add buttons stay at 1. Add a second course: the tag also says 3. Then apply the coupon. The tag needs it, fine. But the cart count says 4, and so does the total, though the number of items did not change.

```bash
(render counters on http://localhost:5205/?store=context)
start:        badge 1, add buttons 1/1/1, total 1, coupon button 1, coupon tag 1
add 1st:      badge 2, add buttons 1/1/1, total 2, coupon button 1, coupon tag 2
add 2nd:      badge 3, add buttons 1/1/1, total 3, coupon button 1, coupon tag 3
apply coupon: badge 4, add buttons 1/1/1, total 4, coupon button 1, coupon tag 4
```

Now the same page with the cart kept in Zustand: add a course, and the count and total tick up while the coupon tag stays at 1. Each piece is drawn again only when its own data changed.

```bash
(render counters on http://localhost:5205/ , the zustand page)
start:        badge 1, add buttons 1/1/1, total 1, coupon button 1, coupon tag 1
add 1st:      badge 2, add buttons 1/1/1, total 2, coupon button 1, coupon tag 1
add 2nd:      badge 3, add buttons 1/1/1, total 3, coupon button 1, coupon tag 1
apply coupon: badge 3, add buttons 1/1/1, total 4, coupon button 1, coupon tag 2
```

### 2. What a store is

Until now, state lived inside a component or inside a provider that wraps the app. A store is a plain object that lives outside React, like a notice board. Any component can walk up to the board and say "tell me when this changes". That is subscribing. When somebody updates the board, it tells every subscriber. A good subscriber does not ask for the whole board; it says "I only care about this one line". That line is a selector. If the line did not change, the subscriber is not told.

A store with no React at all is a real file, run with Node (`store-demo.mjs`):

`cart-web/store-demo.mjs`:
```js
import { createStore } from 'zustand/vanilla'

const cart = createStore((set) => ({
  items: [],
  add: (slug) =>
    set((state) => ({ items: [...state.items, slug] })),
}))

cart.subscribe((state, before) => {
  console.log('changed:', before.items.length,
    'to', state.items.length)
})

cart.getState().add('react-for-beginners')
cart.getState().add('sql-in-two-weeks')
console.log('items now:', cart.getState().items.length)
```

```bash
node store-demo.mjs
```
```bash
node store-demo.mjs
changed: 0 to 1
changed: 1 to 2
items now: 2
```

We add two courses and the terminal prints each change.

### 3. Zustand

Zustand is exactly this, plus a hook that lets a component subscribe. (The name is the German word for state.) It is a package:

```bash
npm install zustand
npm ls zustand
```
```bash
npm ls zustand
`-- zustand@5.0.16
```

(This project already lists it in `package.json`.) The store file:

`cart-web/src/cartStore.ts`:
```ts
import { create } from 'zustand'

type CartState = {
  items: string[]
  coupon: string | null
  add: (slug: string) => void
  applyCoupon: (code: string) => void
}

export const useCartStore = create<CartState>()((set) => ({
  items: [],
  coupon: null,
  add: (slug) => set((state) => ({ items: [...state.items, slug] })),
  applyCoupon: (code) => set({ coupon: code }),
}))
```

- `create` comes from `zustand`. A type `CartState` lists the data and the two functions.
- `create<CartState>()((set) => ({ ... }))`: the double bracket is a TypeScript detail, and you simply copy it.
- `add` calls `set` with only the new list; `applyCoupon` calls `set` with only the coupon. `set` merges what you give it into the state, so the other fields stay.
- What we exported is a hook. No provider, no wrapper around the app: any component, anywhere, can use it.

The components, each with its own selector:

`cart-web/src/ZustandShop.tsx`:
```tsx
import { COURSES, totalOf } from './courses'
import { useCartStore } from './cartStore'
import { useRenders } from './useRenders'

function CartBadge() {
  const count = useCartStore((state) => state.items.length)
  const renders = useRenders()
  return (
    <span className="badge">
      Cart: {count} <small>renders {renders}</small>
    </span>
  )
}

function AddButton({ slug }: { slug: string }) {
  const add = useCartStore((state) => state.add)
  const renders = useRenders()
  return (
    <button onClick={() => add(slug)}>
      Add <small>renders {renders}</small>
    </button>
  )
}

function CartTotal() {
  const total = useCartStore((state) =>
    totalOf(state.items, state.coupon),
  )
  const renders = useRenders()
  return (
    <p className="total">
      Total: Rs {total} <small>renders {renders}</small>
    </p>
  )
}

function CouponButton() {
  const applyCoupon = useCartStore((state) => state.applyCoupon)
  const renders = useRenders()
  return (
    <button onClick={() => applyCoupon('SAVE10')}>
      Apply SAVE10 <small>renders {renders}</small>
    </button>
  )
}

function CouponTag() {
  const coupon = useCartStore((state) => state.coupon)
  const renders = useRenders()
  return (
    <span className="tag">
      Coupon: {coupon ?? 'none'} <small>renders {renders}</small>
    </span>
  )
}

export default function ZustandShop() {
  return (
    <main>
      <header>
        <h1>allcsvideos · zustand</h1>
        <CartBadge />
      </header>
      <ul className="rows">
        {COURSES.map((c) => (
          <li key={c.slug}>
            <span>{c.title}</span>
            <span className="price">Rs {c.price}</span>
            <AddButton slug={c.slug} />
          </li>
        ))}
      </ul>
      <CartTotal />
      <div className="coupon">
        <CouponButton />
        <CouponTag />
      </div>
    </main>
  )
}
```

`useCartStore((state) => state.items.length)` is the selector: the badge is drawn again only when the count changes. The add button's selector returns the `add` function, which is created once and never changes, so the button is never drawn again.

Guess: Asha clicks Add on React for Beginners. Which counters go up? The badge and the total, only. The Add buttons, the coupon button and the coupon tag stay at 1. Then add a second course and apply the coupon: the coupon changed the total and the tag, so those two move (total to 4, tag to 2); the badge stays at 3.

Now compare after two adds and the coupon. With context: badge 4, add buttons 1 each, total 4, coupon button 1, coupon tag 4: sixteen draws. With Zustand: 3, then 1 each, 4, 1, 2: thirteen draws. Three fewer, and nobody would feel it on this page. Context is not bad: it is built for values that change rarely, like the theme or the signed-in user.

Another difference: a store lives outside React, so any code can use it. `useCartStore.getState()` gives the board anywhere, in a helper, in a plain function:

`cart-web/src/outside.ts`:
```ts
import { useCartStore } from './cartStore'

// plain code: no component, no hook
export function addFromShortcut(slug: string) {
  useCartStore.getState().add(slug)
}
```

```bash
npx tsc -b
```

No output means no errors.

```bash
npm run build
> cart-web@0.0.0 build
> tsc -b && vite build

vite v8.3.5 building client environment for production...
transforming...
✓ 24 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-BV-bzsHy.css    0.95 kB │ gzip:  0.46 kB
dist/assets/index-D48b1B5Q.js   224.34 kB │ gzip: 70.00 kB

✓ built in 358ms
```

(The file hashes can differ on your machine.)

### 4. Keep the cart across refreshes: persist

In lesson 4 a refresh emptied the cart. Zustand has a helper called `persist`. It saves the store in local storage (the shelf from module 5, build 3) and puts it back when the page loads.

```bash
sh ../use-version.sh persist
```
`cartStore.ts` (changes marked with + and -):
```diff
@@ -1,2 +1,3 @@
 import { create } from 'zustand'
+import { persist } from 'zustand/middleware'
 
@@ -9,7 +10,12 @@
 
-export const useCartStore = create<CartState>()((set) => ({
-  items: [],
-  coupon: null,
-  add: (slug) => set((state) => ({ items: [...state.items, slug] })),
-  applyCoupon: (code) => set({ coupon: code }),
-}))
+export const useCartStore = create<CartState>()(
+  persist(
+    (set) => ({
+      items: [],
+      coupon: null,
+      add: (slug) => set((state) => ({ items: [...state.items, slug] })),
+      applyCoupon: (code) => set({ coupon: code }),
+    }),
+    { name: 'cart' },
+  ),
+)
```

Two changes: import `persist` from `zustand/middleware`, then wrap the function in `persist` and give it a name, `cart`. That name is the key on the shelf. Add React for Beginners, then Docker for Developers, then apply the coupon. In the browser console:

```bash
(browser console, after two adds and the coupon)
localStorage.getItem("cart")
{"state":{"items":["react-for-beginners","docker-for-developers"],"coupon":"SAVE10"},"version":0}
```

One key, `cart`, with the items and the coupon saved as text. The functions are not saved, only the data. Refresh the page: the cart is still there, two items, and the total is `Rs 988`. The counters start at 1 again, because the page was built from scratch.

```bash
(the total after a refresh; all counters start at 1 again)
Total: Rs 988 renders 1
```

### 5. Mistake one: no selector

```bash
sh ../use-version.sh mis1-no-selector
```
`ZustandShop.tsx` (changes marked with + and -):
```diff
@@ -5,3 +5,3 @@
 function CartBadge() {
-  const count = useCartStore((state) => state.items.length)
+  const { items } = useCartStore()
   const renders = useRenders()
@@ -9,3 +9,3 @@
     <span className="badge">
-      Cart: {count} <small>renders {renders}</small>
+      Cart: {items.length} <small>renders {renders}</small>
     </span>
```

`const { items } = useCartStore()` works. But watch the badge: add a course, it goes to 2; apply the coupon, which has nothing to do with the cart count, and the badge is drawn again:

```bash
(render counters, no selector)
start:        badge 1, add buttons 1/1/1, total 1, coupon button 1, coupon tag 1
add 1st:      badge 2, add buttons 1/1/1, total 2, coupon button 1, coupon tag 1
add 2nd:      badge 3, add buttons 1/1/1, total 3, coupon button 1, coupon tag 1
apply coupon: badge 4, add buttons 1/1/1, total 4, coupon button 1, coupon tag 2
```

We lost the whole benefit. The fix: always pass a selector.

### 6. Mistake two: a selector that builds a new object

```bash
sh ../use-version.sh mis2-new-object
```
`ZustandShop.tsx` (changes marked with + and -):
```diff
@@ -5,3 +5,5 @@
 function CartBadge() {
-  const count = useCartStore((state) => state.items.length)
+  const { count } = useCartStore((state) => ({
+    count: state.items.length,
+  }))
   const renders = useRenders()
```

It looks harmless, but the page goes completely blank:

```bash
(browser console; the page is blank)
The result of getSnapshot should be cached to avoid an infinite loop
Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside ...
```

Every time, the selector builds a brand new object. Zustand compares it with the last answer, sees a different object, and asks React to draw again, which builds another new object, forever. The fix: return one simple value from each selector, as in `good`. Or, if you really want an object, wrap the selector in `useShallow` from `zustand/react/shallow`, which compares the fields inside the object:

```bash
sh ../use-version.sh shallow
```
`ZustandShop.tsx` (changes marked with + and -):
```diff
@@ -1,2 +1,3 @@
 import { COURSES, totalOf } from './courses'
+import { useShallow } from 'zustand/react/shallow'
 import { useCartStore } from './cartStore'
@@ -5,3 +6,7 @@
 function CartBadge() {
-  const count = useCartStore((state) => state.items.length)
+  const { count } = useCartStore(
+    useShallow((state) => ({
+      count: state.items.length,
+    })),
+  )
   const renders = useRenders()
```

The page works, and the badge is not drawn again when the coupon is applied (badge stays at 3 while the coupon moves the total to 4 and the tag to 2).

### 7. Mistake three: changing the state in place

```bash
sh ../use-version.sh mis3-mutate-state
```
`cartStore.ts` (changes marked with + and -):
```diff
@@ -12,3 +12,6 @@
   coupon: null,
-  add: (slug) => set((state) => ({ items: [...state.items, slug] })),
+  add: (slug) => set((state) => {
+    state.items.push(slug)
+    return state
+  }),
   applyCoupon: (code) => set({ coupon: code }),
```

Click Add: nothing happens. The badge keeps saying `Cart: 0` and no render counter moves. It is the bug from module 4: the new answer is the same object as the old one, so there is nothing to draw. Always make a new list.

### 8. Where does each piece of state live?

React gives you four places to keep state. Name each one with an example from the site.

1. Local state: `useState` inside one component. The words a student types in the search box, or whether a menu is open.
2. Shared state: many components, far apart, need the same thing. The cart, the theme, the signed-in user. Context fits a value that rarely changes; a store like Zustand fits a value many components read and that changes often.
3. Server state: the list of courses, a student's progress. This data lives on the server and the browser only holds a copy that can go out of date. It gets its own tool in module 11.
4. Address state: the level filter on the catalog page, or which course is open. It lives in the address bar (module 8), so a refresh keeps it and a link recreates it.

Ask three questions, in this order: Should a link recreate it? Then it goes in the address. Does it come from a server? Then it is server state. Do many far-apart components need it? Then it is shared state. Otherwise it is local. Test yourself with four things from the site: the words in the search box (local), the list of courses from the API (server), the items in the cart (shared), the chosen level in the catalog filter (address). Putting all of them in one big store would be a mistake.

And between the two shared tools: context is built in, needs nothing installed, and is right for a few values that change rarely (theme, language, current user). Zustand is a small extra package, needs no provider, and is right when many components read slices of state that change often (a cart).

## Common mistakes

- Calling `useCartStore()` with no selector: every change re-draws the component.
- A selector that returns a new object or array each time (`(s) => ({ count: s.items.length })`): infinite loop and a blank page. Return one simple value, or wrap in `useShallow`.
- Changing the state in place (`state.items.push(...)` inside `set`). Return a new list.
- Putting everything in one big store. Search words are local; server data is server state; the chosen level is address state.
- Forgetting that `persist` saves only data, not functions, under the name you chose.

## Clean up

Stop the dev server with Ctrl+C. In the browser, delete the `cart` key from local storage (or clear site data for `localhost:5205`) if you tried `persist`. Delete `cart-web/node_modules` and `cart-web/dist` if you want. Run `sh ../use-version.sh good` so `src/` holds the finished lesson state.

## Key ideas (recap)

1. A store is an object outside React. Components subscribe with a selector and are drawn again only when their slice changes. Zustand gives you `create`, `set` and a hook, with no provider.
2. Always pass a selector. Never return a new object from one, unless it is wrapped in `useShallow`. And never change the state in place.
3. Start local. Use the address for what a link should recreate. Server data gets its own tool, in module 11. For shared state: context for values that rarely change, a store for values that change often.

Interview question (Rahul): when would you choose Zustand over context? A good answer: when many components read state that changes often, because a selector lets each component re-render only when its own slice changes, while a context value re-renders every listener. Also when code outside React needs the state, since a store can be read with `getState()`.

## Try it yourself

Add a `remove` button and a `clear` cart button to the store, then watch the counters. Which components are drawn again? (Answer below.)

Answer: add `remove: (slug) => set((state) => ({ items: state.items.filter((s) => s !== slug) }))` and `clear: () => set({ items: [], coupon: null })`, each used through its own selector. Only the pieces whose slice changed move: the badge and the total on `remove`, plus the coupon tag on `clear` (the coupon went back to `null`). The buttons, whose selectors return functions that never change, stay at 1.

## Next

Module 10, Build 6: [Build an Enrollment Cart](../m10-b06-build-an-enrollment-cart/README.md).
