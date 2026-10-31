# M10-L04 · Context and Reducer Together

> Video: Module 10, Lesson 4. Watch it first, then follow along here.

## What you'll learn

- Join a reducer and a context into one small store: provider, state, `dispatch` and a hook that throws outside the provider
- See, with render counters, why one context re-draws every component that listens
- Split the store into two contexts (state and dispatch) so components that only send actions are not drawn again
- Use the typed `dispatch` so a typo in an action is a compile error
- Avoid two mistakes (a provider in the wrong place, the hook inside the provider) and know the honest limits

## Before you start

- Node 24. Check with `node --version`.
- No Docker needed. Best after M10-L03 in `../m10-l03-usereducer/` (the reducer file `cart.ts` is the same) and M10-L02 (context).
- Work in `allcsvideos-web/`. Swap versions with `sh ../use-version.sh NAME`.

## Files in this folder

| File | What it is |
|------|------------|
| `allcsvideos-web/` | The project (Vite 8.3.5, React 19.3.1, TypeScript 7.0.2); `src/` holds `v2-split` |
| `allcsvideos-web/src/cart.ts` | The plain reducer from lesson 3 |
| `allcsvideos-web/src/CartContext.tsx` | The provider, two contexts and the hooks `useCart` and `useCartDispatch` |
| `allcsvideos-web/src/RenderCount.tsx` | The small render counter shown on screen |
| `versions/v1-one-context/` | One context for the whole store (the counters all go up) |
| `versions/v2-probe/` | The split version plus a probe that logs the `dispatch` function |
| `versions/v2-split/` | The finished store with two contexts |
| `versions/m1-two-providers/` | Mistake one: two cart providers |
| `versions/m3-provider-calls-hook/` | Mistake two: `useCart` called inside the provider |
| `versions/p-typo/` | A typo in an action name (`'adds'`) |
| `use-version.sh` | Replaces everything in `allcsvideos-web/src` with one version |

Each version folder is a complete `src/`.

## Follow along

```bash
cd allcsvideos-web
npm install
sh ../use-version.sh v1-one-context
npm run dev
```

Open the address Vite prints (this project asks for http://localhost:5204).

### 1. The cart page and its counters

The reducer from last lesson holds the rules. The page has nine pieces that draw something: the header (cart count), four course rows with an Add button, the cart list, the coupon button, the total and the clear button. Each piece shows a small render counter (`renders 1`), a ref that adds one every time the function runs.

`RenderCount.tsx`:
```tsx
import { useRef } from 'react'

export function RenderCount() {
  const count = useRef(0)
  count.current += 1
  return <span className="renders">renders {count.current}</span>
}
```

At the start every counter says 1:

```bash
(render counters on the page at the start)
header 1, row React 1, row SQL 1, row Docker 1, row System 1, list 1, coupon line 1, total 1, clear line 1
```

Click Add on React for Beginners. The count goes to 1 and the course appears in the cart. Now look at the counters. Every one of them says 2: nine pieces drawn again, and six of them only hold a button.

```bash
(one context: after Add on React for Beginners)
header 2, row React 2, row SQL 2, row Docker 2, row System 2, list 2, coupon line 2, total 2, clear line 2
```

Why were they drawn again, and how do we stop it? We answer both while we join the reducer and the context into one small store.

### 2. Bank counter plus radio station

From lesson 3, a bank counter: you hand in a slip and a clerk with a rule book updates the ledger. From lesson 2, a radio station that broadcasts a value. Put them together: the clerk and the ledger live inside the station. The station broadcasts the ledger (the state) to every component, and the counter window (`dispatch`) is how anyone hands in a slip. Two kinds of component use it: readers want to see the ledger (the count in the header, the list, the total), writers only want to hand in a slip (the Add button, the coupon button, the clear button).

### 3. One context for everything

The reducer file `cart.ts` stays plain (state, four actions, `assertNever`). `CartContext.tsx` wraps it:

`CartContext.tsx`:
```tsx
import { createContext, useContext, useReducer } from 'react'
import type { Dispatch, ReactNode } from 'react'
import { cartReducer, initialCart } from './cart.ts'
import type { CartAction, CartState } from './cart.ts'

type CartValue = {
  state: CartState
  dispatch: Dispatch<CartAction>
}
type ProviderProps = { children: ReactNode }

const CartContext = createContext<CartValue | null>(null)

export function CartProvider({ children }: ProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialCart)
  return (
    <CartContext value={{ state, dispatch }}>
      {children}
    </CartContext>
  )
}

export function useCart() {
  const value = useContext(CartContext)
  if (value === null) {
    throw new Error('useCart must be used inside <CartProvider>')
  }
  return value
}
```

- A type for what the box holds: the state, and `dispatch`, which takes one `CartAction`.
- `createContext` with `null` as the default, so a missing provider cannot hide (lesson 2).
- The provider keeps the memory with `useReducer(cartReducer, initialCart)`, and puts both into the value.
- The hook `useCart` throws a clear sentence if the value is `null`; otherwise it returns it, and the type has no `null` left.

The header is a reader (`useCart`, add up the quantities). The Add button is a writer (`useCart`, take `dispatch`). Guess: Asha clicks Add on one course. All nine components asked the same box. Which counters go up: only the three readers, or all of them? Real run: the header, the list and the total go to 2, and all six buttons go to 2 as well. The buttons never read the cart, and still they were drawn again.

Here is why. The box has one value, and it is a new object whenever the state changes. React cannot ask a component which part it uses (lesson 2), so it draws everyone who listens. Add SQL in Two Weeks: 3. Apply the coupon: 4. Nine pieces, every time.

```bash
(one context: after Add on SQL in Two Weeks)
header 3, all rows 3, list 3, coupon line 3, total 3, clear line 3
```

```bash
(one context: after Apply SAVE10)
header 4, all rows 4, list 4, coupon line 4, total 4, clear line 4
```

For nine pieces, nobody would feel it. But picture a hundred rows with images and prices.

### 4. The fix: two boxes

One context for the state, the ledger. One for `dispatch`, the counter window. Each component takes only the box it needs: readers take the state, writers take only `dispatch`.

```bash
sh ../use-version.sh v2-split
```

`CartContext.tsx`:
```tsx
import { createContext, useContext, useReducer } from 'react'
import type { Dispatch, ReactNode } from 'react'
import { cartReducer, initialCart } from './cart.ts'
import type { CartAction, CartState } from './cart.ts'

type CartDispatch = Dispatch<CartAction>
type ProviderProps = { children: ReactNode }

const StateContext = createContext<CartState | null>(null)
const DispatchContext = createContext<CartDispatch | null>(null)

export function CartProvider({ children }: ProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialCart)
  return (
    <StateContext value={state}>
      <DispatchContext value={dispatch}>
        {children}
      </DispatchContext>
    </StateContext>
  )
}

export function useCart() {
  const state = useContext(StateContext)
  if (state === null) {
    throw new Error('useCart must be used inside <CartProvider>')
  }
  return state
}

export function useCartDispatch() {
  const dispatch = useContext(DispatchContext)
  if (dispatch === null) {
    throw new Error(
      'useCartDispatch must be used inside <CartProvider>',
    )
  }
  return dispatch
}
```

Two calls to `createContext`; in the provider the state goes into the first and `dispatch` into the second; then two hooks, `useCart` and `useCartDispatch`. Why does this help? React gives us the same `dispatch` function on every render, for as long as the provider lives. To check, `versions/v2-probe` adds a probe to the list: it saves every `dispatch` it sees in a `Set` and logs the size.

```bash
sh ../use-version.sh v2-probe
```
`CartList.tsx`:
```tsx
import { useCart, useCartDispatch } from './CartContext.tsx'
import { RenderCount } from './RenderCount.tsx'

const seen = new Set<unknown>()

export function CartList() {
  const { items } = useCart()
  const dispatch = useCartDispatch()
  seen.add(dispatch)
  console.log('dispatch functions seen:', seen.size)
  const remove = (id: string) => dispatch({ type: 'remove', id })
  return (
    <div>
      <h2>Your cart <RenderCount /></h2>
      {items.map(i => (
        <p key={i.id}>
          {i.title} x {i.qty}
          <button onClick={() => remove(i.id)}>x</button>
        </p>
      ))}
    </div>
  )
}
```

After the clicks the console says the same thing every time:

```bash
(browser console, after the clicks)
dispatch functions seen: 1
dispatch functions seen: 1
dispatch functions seen: 1
dispatch functions seen: 1
```

So the value of the second box never changes, and nobody who reads only that box is drawn again because of it. In the components one line changes, the Add button uses `useCartDispatch`:

`CourseRow.tsx`:
```tsx
import { useCartDispatch } from './CartContext.tsx'
import type { Course } from './types.ts'
import { RenderCount } from './RenderCount.tsx'

export function CourseRow({ course }: { course: Course }) {
  const dispatch = useCartDispatch()
  const add = () => dispatch({ type: 'add', course })
  return (
    <li>
      <span className="name">{course.title}</span>
      <span>Rs {course.price}</span>
      <RenderCount />
      <button onClick={add}>Add</button>
    </li>
  )
}
```

Real run, the same clicks, on `v2-split`. First, Apply SAVE10 on the empty cart: the reducer says no and returns the very same state, React sees nothing changed, and no counter moves:

```bash
sh ../use-version.sh v2-split
```
```bash
(two contexts: Apply SAVE10 on the empty cart)
header 1, rows 1, list 1, coupon line 1, total 1, clear line 1   (the reducer returned the same state: nothing drawn again)
```

Add React for Beginners: the header, the list and the total go to 2; the buttons stay at 1.

```bash
(two contexts: after Add on React for Beginners)
header 2, row React 1, row SQL 1, row Docker 1, row System 1, list 2, coupon line 1, total 2, clear line 1
```

Add SQL: 3. Apply the coupon: 4. The readers follow every change. The buttons are never drawn again.

```bash
(two contexts: after Add on SQL in Two Weeks)
header 3, all rows 1, list 3, coupon line 1, total 3, clear line 1
```

```bash
(two contexts: after Apply SAVE10)
header 4, all rows 1, list 4, coupon line 1, total 4, clear line 1
```

Check the types and the build:

```bash
npx tsc -b
```
```bash
npx tsc -b
```

```bash
npm run build
> allcsvideos-web@0.0.0 build
> tsc -b && vite build

vite v8.3.5 building client environment for production...
transforming...
✓ 27 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.46 kB │ gzip:  0.30 kB
dist/assets/index-B_ORHgiT.css    1.42 kB │ gzip:  0.55 kB
dist/assets/index-CTbkzK23.js   222.31 kB │ gzip: 69.48 kB

✓ built in 440ms
```

(The file hashes can differ on your machine.)

### 5. Types travel through context

`dispatch` takes a `CartAction`, so a typo in any component is caught. Asha writes `adds` instead of `add` in the Add button:

```bash
sh ../use-version.sh p-typo
```
`CourseRow.tsx` (changes marked with + and -):
```diff
@@ -6,3 +6,3 @@
   const dispatch = useCartDispatch()
-  const add = () => dispatch({ type: 'add', course })
+  const add = () => dispatch({ type: 'adds', course })
   return (
```

```bash
npx tsc -b
src/CourseRow.tsx:7:32 - error TS2820: Type '"adds"' is not assignable to type '"add" | "applyCoupon" | "clear" | "remove"'. Did you mean '"add"'?

7   const add = () => dispatch({ type: 'adds', course })
                                 ~~~~

  src/cart.ts:10:7 - The expected type comes from property 'type' which is declared here on type 'CartAction'
    10   | { type: 'add'; course: Course }
             ~~~~

Found 1 error in src/CourseRow.tsx:7
```

### 6. Mistake one: a provider in the wrong place

Asha gives the header its own cart provider, and the page another one. Both work, so there is no error:

```bash
sh ../use-version.sh m1-two-providers
```
`App.tsx` (changes marked with + and -):
```diff
@@ -11,18 +11,22 @@
   return (
-    <CartProvider>
-      <Header />
-      <main>
-        <ul>
-          {COURSES.map(c => (
-            <CourseRow key={c.id} course={c} />
-          ))}
-        </ul>
-        <aside>
-          <CartList />
-          <CouponButton />
-          <Total />
-          <ClearButton />
-        </aside>
-      </main>
-    </CartProvider>
+    <>
+      <CartProvider>
+        <Header />
+      </CartProvider>
+      <CartProvider>
+        <main>
+          <ul>
+            {COURSES.map(c => (
+              <CourseRow key={c.id} course={c} />
+            ))}
+          </ul>
+          <aside>
+            <CartList />
+            <CouponButton />
+            <Total />
+            <ClearButton />
+          </aside>
+        </main>
+      </CartProvider>
+    </>
   )
```

Click Add on a course. The cart list shows `React for Beginners x 1`, but the header still says `Cart 0`: the header listens to a different station. Keep one provider, above everything that uses it.

### 7. Mistake two: calling the hook inside the provider

The provider creates the box, so it is not inside it. `versions/m3-provider-calls-hook` calls `useCart()` inside `CartProvider`:

```bash
sh ../use-version.sh m3-provider-calls-hook
```
`CartContext.tsx` (changes marked with + and -):
```diff
@@ -13,2 +13,4 @@
   const [state, dispatch] = useReducer(cartReducer, initialCart)
+  const { items } = useCart()
+  console.log('items in the cart:', items.length)
   return (
```

The page goes blank, and the console shows the clear sentence from our hook: `useCart must be used inside <CartProvider>`.

### 8. Honest limits

1. A reader is drawn again when anything in the state changes. After the coupon, the header counter went up too, though the header shows only the count.
2. The cart lives in memory, inside the provider. Refresh the page and it is empty. Keeping it in local storage is part of the build at the end of this module.
3. Put in a store only what many far-apart components need. And for a busy store with many readers, there is a library built to let each component pick its own slice: Zustand, next lesson.

## Common mistakes

- One context that carries both the state and `dispatch`: every writer is drawn again on every change.
- Two providers for the same store: the pieces silently disagree.
- Calling `useCart` inside the provider component itself.
- A misspelled action type. Type `dispatch` with `Dispatch<CartAction>` so TypeScript catches it.
- Putting everything in the store. Keep one-off state in the component.

## Clean up

Stop the dev server with Ctrl+C. Delete `allcsvideos-web/node_modules` and `allcsvideos-web/dist` if you want. Run `sh ../use-version.sh v2-split` so `src/` holds the finished store.

## Key ideas (recap)

1. A store is context plus a reducer. The reducer file stays plain, the provider holds the state, and a custom hook hands it out, with a clear error outside the provider.
2. Use two boxes: one for the state, one for `dispatch`. `dispatch` never changes, so components that only send actions are not drawn again. Readers are still drawn on every change.
3. `dispatch` is typed, so a typo in any component is caught. Keep one provider, above everything that uses it. And never call the hook inside the provider.

Interview question (Rahul): why split a context into state and dispatch? A good answer: `dispatch` never changes, so components that only send actions (the writers) do not re-render when the state changes. Only the readers do. With one combined context, every consumer re-renders on every state change.

## Try it yourself

Write a hook `useCartCount` that returns only the number of items. Apply the coupon. Does the header still draw itself again? Check the counter. (Answer below.)

Answer: `export function useCartCount() { return useCart().items.reduce((n, i) => n + i.qty, 0) }`. The header still draws itself again after the coupon: a hook is only a function, and `useCart()` inside it still listens to the whole state box. To avoid the extra draw you would need a store where each component picks its own slice, like Zustand (next lesson).

## Next

Module 10, Lesson 5: [Zustand and Choosing Where State Lives](../m10-l05-zustand-and-choosing-where-state-lives/README.md).
