# M10-L03 · useReducer

> Video: Module 10, Lesson 3. Watch it first, then follow along here.

## What you'll learn

- Why one rule scattered over several handlers gets forgotten (the coupon that outlives an empty cart)
- Put every rule about the cart in one pure function, the reducer, and send it actions with `dispatch`
- Type the actions as a discriminated union, and end the `switch` with `assertNever`
- Avoid the three reducer mistakes: changing the state, mutating a copy, and a silent `default`
- Test a reducer with plain Node, no browser

## Before you start

- Node 24. Check with `node --version`.
- No Docker needed. Best after M10-L02 in `../m10-l02-context/` and the discriminated unions of M09-L03.
- Work in `cartlab/`. Swap versions with `sh ../use-version.sh NAME`.

## Files in this folder

| File | What it is |
|------|------------|
| `cartlab/` | The project (Vite 8.3.5, React 19.3.1, TypeScript 7.0.2); `src/` holds `v2-reducer` |
| `versions/v1-state/` | The cart built with two `useState` lines and four handlers (has the coupon bug) |
| `versions/v2-reducer/` | The cart with `useReducer` and `cart.ts` (the lesson's result) |
| `versions/v2-log/`, `v2-log-nostrict/` | Same with one `console.log` in the reducer, with and without strict mode |
| `versions/v3-mutate-same/` | Mistake one: changes the state and returns the same object |
| `versions/v4-mutate-copy/`, `v4-mutate-copy-nostrict/` | Mistake two: `push` on the list, returns a copy of the state |
| `versions/v5-nodefault/`, `v5-silent/`, `v5-assertnever/` | Mistake three: the `clear` case is missing |
| `probes/p-wrong.ts`, `probes/p-narrow.ts` | Two tiny files that show real type errors |
| `node-check/` | `check.ts`: calls the reducer by hand with plain Node |
| `use-version.sh` | Replaces everything in `cartlab/src` with one version |

Each version folder is a complete `src/`.

## Follow along

```bash
cd cartlab
npm install
sh ../use-version.sh v1-state
npm run dev
```

Open the address Vite prints (this project asks for http://localhost:5203).

### 1. The cart that forgets a rule

On the left, four courses each with an Add button. On the right, the cart with a coupon button and the total. Click Add on React for Beginners, then on SQL in Two Weeks. The total is `Rs 898`. Click `Apply SAVE10` and the total becomes `Rs 808`.

Now remove both courses. The cart is empty and the total says `Rs 0`, which is right. But the green chip still says `SAVE10 applied`. No error, no red text: the page simply forgot a rule. When the cart becomes empty, the coupon must go too.

`App.tsx`:
```tsx
import { useState } from 'react'
import { addItem } from './addItem.ts'
import type { CartItem, Course } from './types.ts'
import { View } from './View.tsx'

export default function App() {
  const [items, setItems] = useState<CartItem[]>([])
  const [coupon, setCoupon] = useState<string | null>(null)

  function add(course: Course) {
    setItems(addItem(items, course))
  }
  function remove(id: string) {
    setItems(items.filter(i => i.id !== id))
  }
  function applyCoupon(code: string) {
    if (items.length > 0 && code === 'SAVE10') setCoupon(code)
  }
  function clear() {
    setItems([])
    setCoupon(null)
  }

  return (
    <View
      items={items}
      coupon={coupon}
      onAdd={add}
      onRemove={remove}
      onCoupon={applyCoupon}
      onClear={clear}
    />
  )
}
```

Count the places: two states, four handlers, and the rule "an empty cart has no coupon" belongs in two of them (`remove` and `clear`)... and was forgotten in one. Add a fifth handler tomorrow and you must remember the rule again.

### 2. The bank counter

You never reach into the safe yourself. You fill in a slip, "withdraw five hundred", and hand it to the clerk, who has a rule book and decides. Four names:

- The ledger is the state (module 4).
- The slip is an action: a small plain object that says what you want.
- The clerk is the reducer: a function that takes the current state and a slip, and returns the next state.
- Handing in the slip is `dispatch`.

Everyone who wants to change the cart hands in a slip, and only the reducer touches the state. So every rule lives in one place. You already know the shape: in module 2, lesson 3, `reduce` took a running total and one item and gave back the new total. And the updater function `setCount(c => c + 1)` is a tiny reducer.

### 3. The cart with a reducer

```bash
sh ../use-version.sh v2-reducer
```

One object holds the items and the coupon together, because both facts must agree. The actions are the slips: a discriminated union with four shapes. The reducer is a plain function with two parameters and a `switch` on `action.type`:

`cart.ts`:
```ts
import { addItem } from './addItem.ts'
import type { CartItem, Course } from './types.ts'

export type CartState = {
  items: CartItem[]
  coupon: string | null
}

export type CartAction =
  | { type: 'add'; course: Course }
  | { type: 'remove'; id: string }
  | { type: 'applyCoupon'; code: string }
  | { type: 'clear' }

export const initialCart: CartState = {
  items: [],
  coupon: null,
}

export function cartReducer(
  state: CartState,
  action: CartAction,
): CartState {
  const { items, coupon } = state
  switch (action.type) {
    case 'add':
      return { items: addItem(items, action.course), coupon }
    case 'remove': {
      const left = items.filter(i => i.id !== action.id)
      if (left.length === 0) return initialCart
      return { items: left, coupon }
    }
    case 'applyCoupon':
      if (items.length === 0) return state
      if (action.code !== 'SAVE10') return state
      return { items, coupon: action.code }
    case 'clear':
      return initialCart
    default:
      return assertNever(action)
  }
}

function assertNever(x: never): never {
  throw new Error('Unhandled action: ' + JSON.stringify(x))
}
```

The rule we forgot is written once, in the `remove` case: if nothing is left, return `initialCart`, which has no coupon. Apply coupon returns the same state when the cart is empty or the code is wrong.

Notice what is missing: there is no React in this file. No hook, no component. A reducer is a plain function, so it is easy to read, to reuse and to test.

In the component, one line gives you `cart` and `dispatch`; every handler becomes one line:

`App.tsx`:
```tsx
import { useReducer } from 'react'
import { cartReducer, initialCart } from './cart.ts'
import { View } from './View.tsx'

export default function App() {
  const [cart, dispatch] = useReducer(cartReducer, initialCart)

  return (
    <View
      items={cart.items}
      coupon={cart.coupon}
      onAdd={course => dispatch({ type: 'add', course })}
      onRemove={id => dispatch({ type: 'remove', id })}
      onCoupon={code => dispatch({ type: 'applyCoupon', code })}
      onClear={() => dispatch({ type: 'clear' })}
    />
  )
}
```

Guess: the same clicks as before (add React, add SQL, apply the coupon, remove both). What does the page show at the end, the green chip or not? Try it. After adding both: `Rs 898`; with the coupon `Rs 808`; remove one: `Rs 359`; remove the other: the cart is empty, the chip is gone, and the button `Apply SAVE10` is back.

```bash
npx tsc -b
```

No output means no errors.

```bash
npm run build
> cartlab@0.0.0 build
> tsc -b && vite build

vite v8.3.5 building client environment for production...
transforming...
✓ 20 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.39 kB │ gzip:  0.26 kB
dist/assets/index-BgmaI36r.css    0.98 kB │ gzip:  0.48 kB
dist/assets/index-BXOCdOBC.js   221.72 kB │ gzip: 69.35 kB

✓ built in 344ms
```

(The file hashes can differ on your machine.)

### 4. What happens inside

`versions/v2-log-nostrict` puts one log line at the top of the reducer (strict mode is off, as in module 7):

```bash
sh ../use-version.sh v2-log-nostrict
```
`cart.ts` (changes marked with + and -):
```diff
@@ -24,2 +24,3 @@
   const { items, coupon } = state
+  console.log('reducer', action.type, items.length)
   switch (action.type) {
```

Open the browser console and click Add once. You see:

```text
reducer add 0
```

The cycle: a click, then `dispatch` with a slip. React calls the reducer with the current state and the slip. The answer becomes the new state, and the screen is drawn again. With strict mode on (`versions/v2-log`, the normal `main.tsx`), React calls the reducer twice in development, so you see the line twice:

```bash
sh ../use-version.sh v2-log
```
```text
reducer add 0
reducer add 0
```

That double call is a feature: it exposes impure reducers (mistake two below).

### 5. TypeScript checks every slip

Because the actions are a discriminated union, TypeScript checks every slip. A slip with the wrong shape, and a slip with a type that does not exist:

```bash
sh ../use-version.sh v2-reducer
cp ../probes/p-wrong.ts src/probe.ts
```
`probes/p-wrong.ts`:
```ts
import { cartReducer, initialCart } from './cart.ts'

cartReducer(initialCart, { type: 'add' })
cartReducer(initialCart, { type: 'delete', id: 'sql' })
```

```bash
npx tsc -b
src/probe.ts:3:26 - error TS2345: Argument of type '{ type: "add"; }' is not assignable to parameter of type 'CartAction'.
  Property 'course' is missing in type '{ type: "add"; }' but required in type '{ type: "add"; course: Course; }'.

3 cartReducer(initialCart, { type: 'add' })
                           ~~~~~~~~~~~~~~~

  src/cart.ts:10:20 - 'course' is declared here.
    10   | { type: 'add'; course: Course }
                          ~~~~~~

src/probe.ts:4:28 - error TS2322: Type '"delete"' is not assignable to type '"add" | "applyCoupon" | "clear" | "remove"'.

4 cartReducer(initialCart, { type: 'delete', id: 'sql' })
                             ~~~~

  src/cart.ts:10:7 - The expected type comes from property 'type' which is declared here on type 'CartAction'
    10   | { type: 'add'; course: Course }
             ~~~~

Found 2 errors in the same file, starting at: src/probe.ts:3
```

Inside the reducer, narrowing (M09-L03) works: in the `add` case `action` has a `course`, in the `remove` case it has an `id`. A function that reads `action.id` after only handling `remove`:

```bash
cp ../probes/p-narrow.ts src/probe.ts
```
`probes/p-narrow.ts`:
```ts
import type { CartAction } from './cart.ts'

export function describe(action: CartAction): string {
  if (action.type === 'remove') return action.id
  return action.id
}
```

```bash
npx tsc -b
src/probe.ts:5:17 - error TS2339: Property 'id' does not exist on type '{ type: "add"; course: Course; } | { type: "applyCoupon"; code: string; } | { type: "clear"; }'.
  Property 'id' does not exist on type '{ type: "add"; course: Course; }'.

5   return action.id
                  ~~

Found 1 error in src/probe.ts:5
```

Remove the probe with `rm src/probe.ts`.

### 6. Mistake one: changing the state

`add` sets `state.items` and returns the very same state object:

```bash
sh ../use-version.sh v3-mutate-same
```
`cart.ts` (changes marked with + and -):
```diff
@@ -26,3 +26,4 @@
     case 'add':
-      return { items: addItem(items, action.course), coupon }
+      state.items = addItem(items, action.course)
+      return state
     case 'remove': {
```

Click Add: nothing happens. The cart stays at `Your cart (0)`. React compares the old and the new state; it is the same object, so it thinks nothing changed (you know this from module 4). Return a new object.

### 7. Mistake two: mutating a copy

`add` calls `push` on the list and returns a copy of the state. It looks fine:

```bash
sh ../use-version.sh v4-mutate-copy-nostrict
```
`cart.ts` (changes marked with + and -):
```diff
@@ -1,2 +1 @@
-import { addItem } from './addItem.ts'
 import type { CartItem, Course } from './types.ts'
@@ -26,3 +25,4 @@
     case 'add':
-      return { items: addItem(items, action.course), coupon }
+      items.push({ ...action.course, qty: 1 })
+      return { items, coupon }
     case 'remove': {
```

With strict mode off, it seems to work: one click, one row, `Rs 499`. Guess what happens with strict mode on (the normal `main.tsx`), same single click on Add:

```bash
sh ../use-version.sh v4-mutate-copy
```

Two rows of React for Beginners, and a total of `Rs 998`. The console complains about two children with the same key. In development, strict mode calls the reducer twice with the same state and the same slip, and a pure reducer gives the same answer both times. Ours pushed twice into the same list.

A reducer must be a pure function, like a component (module 7, lesson 4): the same state and the same action always give the same answer, and it never changes the state it receives.

### 8. Mistake three: the end of the switch

Asha adds the `clear` slip to the type, and forgets the case. There is no `default`:

```bash
sh ../use-version.sh v5-nodefault
```
`cart.ts` (changes marked with + and -):
```diff
@@ -36,11 +36,3 @@
       return { items, coupon: action.code }
-    case 'clear':
-      return initialCart
-    default:
-      return assertNever(action)
   }
 }
-
-function assertNever(x: never): never {
-  throw new Error('Unhandled action: ' + JSON.stringify(x))
-}
```

```bash
npx tsc -b
src/cart.ts:23:4 - error TS2366: Function lacks ending return statement and return type does not include 'undefined'.

23 ): CartState {
      ~~~~~~~~~

Found 1 error in src/cart.ts:23
```

The tempting patch is `default: return state`. TypeScript is now silent and the page does not crash:

```bash
sh ../use-version.sh v5-silent
```
```bash
npx tsc -b
```

Click Clear: nothing happens. No error anywhere. A silent bug. The fix is the exhaustive check from lesson M09-L03: `default` returns `assertNever(action)`:

```bash
sh ../use-version.sh v5-assertnever
```
```bash
npx tsc -b
src/cart.ts:38:26 - error TS2345: Argument of type '{ type: "clear"; }' is not assignable to parameter of type 'never'.

38       return assertNever(action)
                            ~~~~~~

Found 1 error in src/cart.ts:38
```

The forgotten slip is named in the error. Add the `clear` case back (as in `v2-reducer`) and it is clean again.

### 9. Test the reducer with no browser

Because the reducer is a plain function, you can test it with Node alone. `node-check/check.ts` adds React twice, applies the coupon, then clears:

`node-check/check.ts`:
```ts
import { cartReducer, initialCart } from './cart.ts'

const react = { id: 'react', title: 'React', price: 499 }

let s = initialCart
s = cartReducer(s, { type: 'add', course: react })
s = cartReducer(s, { type: 'add', course: react })
s = cartReducer(s, { type: 'applyCoupon', code: 'SAVE10' })
console.log(s)
console.log(cartReducer(s, { type: 'clear' }))
console.log(initialCart.items.length)
```

```bash
cd ../node-check
```
```bash
node check.ts
{
  items: [ { id: 'react', title: 'React', price: 499, qty: 2 } ],
  coupon: 'SAVE10'
}
{ items: [], coupon: null }
0
```

The first object has one row with `qty: 2` and the coupon `SAVE10`. After `clear` the state is empty with no coupon, and `initialCart` itself is untouched (`0` rows).

### 10. When to reach for useReducer

When several values change together, when many events change the same state, or when the rules are worth testing. For one simple value, `useState` is still the right tool.

## Common mistakes

- Changing the state inside the reducer (`state.items = ...`). Return a new object.
- Calling `push` on the incoming list and returning a copy of the state. Strict mode runs the reducer twice and shows the double row.
- A `switch` with no `default`, or with `default: return state`. Use `assertNever(action)` so a forgotten action is a compile error.
- Putting side effects (fetching, logging for real, timers) in the reducer. It must be pure.
- Reaching for `useReducer` for a single boolean.

## Clean up

Stop the dev server with Ctrl+C. Delete `cartlab/node_modules` and `cartlab/dist` if you want. Run `sh ../use-version.sh v2-reducer` so `src/` holds the finished version, and remove `src/probe.ts` if it is still there.

## Key ideas (recap)

1. A reducer is a plain function: the current state and an action in, the next state out. `dispatch` hands it an action, and React does the rest. Every rule about the state lives in one place.
2. Type the actions as a discriminated union with a `type` tag, and end the `switch` with `assertNever`. A typo or a forgotten case becomes a compile error.
3. A reducer must be pure. Never change the state you receive. Return a new object. Strict mode calls it twice in development and shows you the mistake.

Interview question (Rahul): when would you choose `useReducer` over `useState`? A good answer: when the state has several parts that change together, when many different events update the same state, or when the update rules are complicated enough to deserve one pure function that you can test without React.

## Try it yourself

Add an action called `setQuantity`, with an `id` and a number, which removes the course when the number is zero. Let `assertNever` show you what is missing. (Answer below.)

Answer: add `| { type: 'setQuantity'; id: string; qty: number }` to `CartAction`. `npx tsc -b` now reports `Argument of type '{ type: "setQuantity"; ... }' is not assignable to parameter of type 'never'` in the `default` branch. Add the case:

```ts
case 'setQuantity': {
  const left = items
    .map(i => (i.id === action.id ? { ...i, qty: action.qty } : i))
    .filter(i => i.qty > 0)
  if (left.length === 0) return initialCart
  return { items: left, coupon }
}
```

## Next

Module 10, Lesson 4: [Context and Reducer Together](../m10-l04-context-and-reducer-together/README.md).
