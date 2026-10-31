# M10-B06 · Build an Enrollment Cart

> Video: Module 10, Build 6. Watch it first, then follow along here.

## What you'll learn

- Plan a feature by asking where each piece of state lives (address, server, shared, local, or derived)
- Build a Zustand cart store with a pure `getTotals` function and coupons (`SAVE10`, `FLAT200`)
- Add an `Add to cart` button that knows when a course is already in the cart
- Build the cart page, a coupon form, and fix the bugs the video hits on the way (duplicates, `Free`, capital letters)
- Save the cart with `persist`, and check the saved value with Zod when it loads
- Know what a browser-only cart cannot do (prices, two tabs, other browsers)

## Before you start

- Node 24. Check with `node --version`.
- No Docker needed. The courses come from `api/server.mjs`, a small local Node stand-in for the allcsvideos API (port 8106). It is not the production server.
- Best after M10-L05 (`../m10-l05-zustand-and-choosing-where-state-lives/`), M08 (router) and M09 (TypeScript and Zod).
- The project is `allcsvideos-web/` (Vite 8.3.5, React 19.3.1, React Router 8.5.1, TypeScript 7.0.2, Zustand 5.0.16, Zod 4.6.7). It is a small copy of the M08 site.

## Files in this folder

| File | What it is |
|------|------------|
| `allcsvideos-web/` | The finished cart (same as `steps/step5b-persist-with-zod`) |
| `allcsvideos-web/src/cart/types.ts` | The `CartItem` type |
| `allcsvideos-web/src/cart/totals.ts` | The coupon table and `getTotals` |
| `allcsvideos-web/src/cart/cartStore.ts` | The Zustand store, `persist` and the Zod check |
| `allcsvideos-web/src/components/AddToCartButton.tsx` | The button used on the card and the course page |
| `allcsvideos-web/src/pages/Cart.tsx` | The cart page with the coupon form |
| `api/server.mjs` | The local API stand-in |
| `steps/` | Complete `src/` snapshots: `step0-start`, `step1-store`, `step2a-add-duplicates`, `step2b-add-fixed`, `step3a-cart-free-bug`, `step3b-cart-page`, `step4a-coupon-case-bug`, `step4b-coupon`, `step5a-persist`, `step5b-persist-with-zod`, `ext1-tab-sync` |
| `use-step.sh` | Replaces `src/` with one snapshot |

## Run it

```bash
cd allcsvideos-web
npm install
```

In one terminal start the API (from this lesson folder), in another the dev server:

```bash
node api/server.mjs
```
```bash
API on http://localhost:8106
```
```bash
cd allcsvideos-web
npm run dev
```

Open the address Vite prints (usually http://localhost:5173). Add React for Beginners and SQL in Two Weeks (the badge says `Cart 2`), open the cart, type `save10` as the coupon: the discount is `Rs 90` and the total `Rs 808`. Refresh the page: the cart is still there, with its coupon.

## Build it step by step

Every step below has a snapshot in `steps/`. To jump to one, from inside `allcsvideos-web/`: `sh ../use-step.sh step1-store` (it replaces `src/`). To build along instead, start from `step0-start` and make the edits shown.

### The plan

The cart must do five things:

1. Every course card and the course page has an `Add to cart` button. When the course is already in the cart it says `In cart` and cannot be clicked again (a course is bought once).
2. The header has a badge with the number of courses in the cart. Click it to open the cart page.
3. The cart page lists the courses, each with a Remove button, and shows the subtotal, the discount and the total.
4. Coupons: `SAVE10` takes ten percent off, `FLAT200` takes two hundred rupees off. The discount can never be more than the subtotal, so the total never goes below zero. A code that does not exist shows a message.
5. The cart follows the student from page to page, and survives a refresh.

### Where does each piece of state live?

Four questions, in order (lesson M10-L05): Should a link recreate it? Does it come from a server? Do two pieces far apart need it? Otherwise it is local.

- The list of courses comes from a server. The router's loader fetches it (module 8). It is not ours to store.
- The letters typed in the coupon box, and the message under it, are local: `useState` inside the cart page.
- The items in the cart and the coupon that was applied are shared: the header, every Add button and the cart page read them, and they must survive a refresh. That is our store (Zustand, for a cart that changes on every click and is read by many pieces).
- The numbers (subtotal, discount, total, the badge count) are not stored. They can always be worked out from the items and the coupon, so we work them out while drawing.

### Step 0: the starting point

`steps/step0-start` is the course list and a course page. No cart anywhere. Install the packages and run it:

```bash
sh ../use-step.sh step0-start
npx tsc -b
```
```bash
npx tsc -b
```

### Step 1: the store

No screen yet. First the type, then the totals, then the store.

`steps/step1-store/src/cart/types.ts`:
```ts
export type CartItem = {
  slug: string
  title: string
  price: number
}
```

`steps/step1-store/src/cart/totals.ts`:
```ts
import type { CartItem } from './types'

export type Coupon = {
  label: string
  percent?: number
  flat?: number
}

export const COUPONS: Record<string, Coupon> = {
  SAVE10: { label: '10% off', percent: 10 },
  FLAT200: { label: 'Rs 200 off', flat: 200 },
}

export function getTotals(
  items: CartItem[],
  code: string | null,
) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price,
    0,
  )
  const coupon = code ? COUPONS[code] : undefined
  const percent = coupon?.percent ?? 0
  const flat = coupon?.flat ?? 0
  const percentOff = (subtotal * percent) / 100
  const off = Math.round(percentOff) + flat
  const discount = Math.min(off, subtotal)
  return {
    subtotal,
    discount,
    total: subtotal - discount,
  }
}
```

A table of coupons and one plain function, `getTotals`: it adds up the prices for the subtotal, looks up the coupon, works out the percent and flat parts, and the discount stops at the subtotal.

`steps/step1-store/src/cart/cartStore.ts`:
```ts
import { create } from 'zustand'
import type { CartItem } from './types'

type CartStore = {
  items: CartItem[]
  coupon: string | null
  add: (item: CartItem) => void
  remove: (slug: string) => void
  applyCoupon: (code: string) => void
  removeCoupon: () => void
}

export const useCartStore = create<CartStore>()(
  (set) => ({
    items: [],
    coupon: null,
    add: (item) =>
      set((state) => ({
        items: [...state.items, item],
      })),
    remove: (slug) =>
      set((state) => ({
        items: state.items.filter(
          (item) => item.slug !== slug,
        ),
      })),
    applyCoupon: (code) => set({ coupon: code }),
    removeCoupon: () => set({ coupon: null }),
  }),
)
```

The same shape as in lesson M10-L05: `create`, the type in angle brackets, the double round brackets, items start empty, the coupon starts as `null`. A store works without React, so try it in the terminal. `src/cart/demo.ts` adds React for Beginners and SQL in Two Weeks, applies `SAVE10`, then tries the rule with a Rs 150 course and `FLAT200`:

`steps/step1-store/src/cart/demo.ts`:
```ts
import { useCartStore } from './cartStore.ts'
import { getTotals } from './totals.ts'

const react = {
  slug: 'react',
  title: 'React for Beginners',
  price: 499,
}
const sql = {
  slug: 'sql',
  title: 'SQL in Two Weeks',
  price: 399,
}

const { add, applyCoupon } = useCartStore.getState()
add(react)
add(sql)
applyCoupon('SAVE10')

const { items, coupon } = useCartStore.getState()
console.log(items.length, 'items')
console.log(getTotals(items, coupon))

const cheap = { slug: 'a', title: 'A', price: 150 }
console.log(getTotals([cheap], 'FLAT200'))
```

```bash
sh ../use-step.sh step1-store
```
```bash
node src/cart/demo.ts
2 items
{ subtotal: 898, discount: 90, total: 808 }
{ subtotal: 150, discount: 150, total: 0 }
```

The discount stopped at the subtotal in the last line: `discount: 150, total: 0`.

### Step 2: the badge and the buttons

In `RootLayout`, the badge asks the store for one thing, `state.items.length` (a selector), so the header is drawn again only when the count changes. The Add button is its own small component, used on the course card and the course page; it asks the store for the `add` function and calls it with the three fields of the course.

```bash
sh ../use-step.sh step2a-add-duplicates
```
`layouts/RootLayout.tsx` (changes marked with + and -):
```diff
@@ -1,4 +1,9 @@
 import { NavLink, Outlet } from 'react-router'
+import { useCartStore } from '../cart/cartStore'
 
 export default function RootLayout() {
+  const count = useCartStore(
+    (state) => state.items.length,
+  )
+
   return (
@@ -10,2 +15,5 @@
         </nav>
+        <NavLink to="/cart" className="badge">
+          Cart {count}
+        </NavLink>
       </header>
```

`steps/step2a-add-duplicates/src/components/AddToCartButton.tsx`:
```tsx
import { useCartStore } from '../cart/cartStore'
import type { Course } from '../types'

export default function AddToCartButton({
  course,
}: {
  course: Course
}) {
  const add = useCartStore((state) => state.add)
  const { slug, title, price } = course

  return (
    <button
      onClick={() => add({ slug, title, price })}
    >
      Add to cart
    </button>
  )
}
```

`components/CourseCard.tsx` (changes marked with + and -):
```diff
@@ -3,2 +3,3 @@
 import formatPrice from '../utils/formatPrice'
+import AddToCartButton from './AddToCartButton'
 
@@ -18,2 +19,3 @@
         <span>{formatPrice(course.price)}</span>
+        <AddToCartButton course={course} />
       </div>
```

`pages/CourseDetail.tsx` (changes marked with + and -):
```diff
@@ -1,2 +1,3 @@
 import { useLoaderData } from 'react-router'
+import AddToCartButton from '../components/AddToCartButton'
 import type { Course } from '../types'
@@ -15,2 +16,3 @@
       <p>{formatPrice(course.price)}</p>
+      <AddToCartButton course={course} />
     </>
```

Guess: React for Beginners is already in the cart, then Asha opens the Docker for Developers page and clicks `Add to cart`, then clicks it again. What does the badge say? Two courses, and the badge says three. The same course is in the cart twice (here without React, 1 then 2):

```bash
(read the badge in the header)
Cart 1   (badge after the first click on the Docker page)
Cart 2   (badge after clicking the same button again)
```

`add` never asks "is this course already in?". The fix has two parts. In the store: if some item has this slug, return the same state. In the button: read a yes-or-no from the store, `inCart`, disable the button and change its text.

```bash
sh ../use-step.sh step2b-add-fixed
```
`cart/cartStore.ts` (changes marked with + and -):
```diff
@@ -17,5 +17,10 @@
     add: (item) =>
-      set((state) => ({
-        items: [...state.items, item],
-      })),
+      set((state) => {
+        const has = state.items.some(
+          (i) => i.slug === item.slug,
+        )
+        return has
+          ? state
+          : { items: [...state.items, item] }
+      }),
     remove: (slug) =>
```

`components/AddToCartButton.tsx` (changes marked with + and -):
```diff
@@ -10,2 +10,5 @@
   const { slug, title, price } = course
+  const inCart = useCartStore((state) =>
+    state.items.some((i) => i.slug === slug),
+  )
 
@@ -13,5 +16,6 @@
     <button
+      disabled={inCart}
       onClick={() => add({ slug, title, price })}
     >
-      Add to cart
+      {inCart ? 'In cart' : 'Add to cart'}
     </button>
```

```bash
(after adding React for Beginners and SQL in Two Weeks from the catalog)
badge: Cart 2
buttons: In cart / Add to cart / Add to cart / In cart / Add to cart / Add to cart
```

Two pages, one store, no props. Back in the catalog both buttons say `In cart`.

### Step 3: the cart page

One more route (`cart`) in the router, and the page. It asks the store for the items, the coupon and `remove`, each with its own selector; the numbers come from `getTotals`.

```bash
sh ../use-step.sh step3a-cart-free-bug
```
`router.tsx` (changes marked with + and -):
```diff
@@ -3,2 +3,3 @@
 import RootLayout from './layouts/RootLayout'
+import Cart from './pages/Cart'
 import Catalog from './pages/Catalog'
@@ -18,2 +19,3 @@
       },
+      { path: 'cart', element: <Cart /> },
     ],
```

`steps/step3a-cart-free-bug/src/pages/Cart.tsx`:
```tsx
import { Link } from 'react-router'
import { useCartStore } from '../cart/cartStore'
import { getTotals } from '../cart/totals'
import formatPrice from '../utils/formatPrice'

export default function Cart() {
  const items = useCartStore((state) => state.items)
  const coupon = useCartStore((state) => state.coupon)
  const remove = useCartStore((state) => state.remove)
  const totals = getTotals(items, coupon)

  if (items.length === 0) {
    return (
      <>
        <h1>Your cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/">Browse the courses</Link>
      </>
    )
  }

  return (
    <>
      <h1>Your cart</h1>
      <ul className="lines">
        {items.map((item) => (
          <li key={item.slug}>
            <span>{item.title}</span>
            <span>{formatPrice(item.price)}</span>
            <button
              className="ghost"
              onClick={() => remove(item.slug)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <dl className="totals">
        <dt>Subtotal</dt>
        <dd>{formatPrice(totals.subtotal)}</dd>
        <dt>Discount</dt>
        <dd>- {formatPrice(totals.discount)}</dd>
        <dt>Total</dt>
        <dd>{formatPrice(totals.total)}</dd>
      </dl>
    </>
  )
}
```

If the cart is empty: a friendly line and a link back to the courses. Otherwise a heading, one row per item with a Remove button, and a box with the subtotal, discount and total. Add three courses and open the cart. The discount line says `- Free`:

```bash
(cart page, Step 3a)
Subtotal  Rs 898
Discount  - Free
Total     Rs 898
```

Free? The discount is zero rupees. `formatPrice` prints `Free` for zero, which is right for a course and wrong for a discount. These three amounts are not course prices, so we print them ourselves, with `Rs` in front:

```bash
sh ../use-step.sh step3b-cart-page
```
`pages/Cart.tsx` (changes marked with + and -):
```diff
@@ -40,7 +40,7 @@
         <dt>Subtotal</dt>
-        <dd>{formatPrice(totals.subtotal)}</dd>
+        <dd>Rs {totals.subtotal}</dd>
         <dt>Discount</dt>
-        <dd>- {formatPrice(totals.discount)}</dd>
+        <dd>- Rs {totals.discount}</dd>
         <dt>Total</dt>
-        <dd>{formatPrice(totals.total)}</dd>
+        <dd>Rs {totals.total}</dd>
       </dl>
```

Now Remove: click it on Docker for Developers. The row goes, the badge changes and the subtotal drops. One click, and three places changed: the list, the badge and the totals.

### Step 4: the coupon

Two small pieces of local state (the code being typed and a message) and two more functions from the store, `applyCoupon` and `removeCoupon`. `apply` runs when the form is sent: it stops the page from reloading (module 5), trims the spaces, and asks whether the code is in the coupon table.

```bash
sh ../use-step.sh step4a-coupon-case-bug
```
`pages/Cart.tsx` (changes marked with + and -):
```diff
@@ -1,4 +1,6 @@
+import { useState } from 'react'
+import type { FormEvent } from 'react'
 import { Link } from 'react-router'
 import { useCartStore } from '../cart/cartStore'
-import { getTotals } from '../cart/totals'
+import { COUPONS, getTotals } from '../cart/totals'
 import formatPrice from '../utils/formatPrice'
@@ -9,4 +11,24 @@
   const remove = useCartStore((state) => state.remove)
+  const applyCoupon = useCartStore(
+    (state) => state.applyCoupon,
+  )
+  const removeCoupon = useCartStore(
+    (state) => state.removeCoupon,
+  )
+  const [code, setCode] = useState('')
+  const [message, setMessage] = useState('')
   const totals = getTotals(items, coupon)
 
+  function apply(e: FormEvent) {
+    e.preventDefault()
+    const clean = code.trim()
+    if (!(clean in COUPONS)) {
+      setMessage(`${clean} is not a coupon`)
+      return
+    }
+    applyCoupon(clean)
+    setMessage('')
+    setCode('')
+  }
+
   if (items.length === 0) {
@@ -38,10 +60,37 @@
       </ul>
-      <dl className="totals">
-        <dt>Subtotal</dt>
-        <dd>Rs {totals.subtotal}</dd>
-        <dt>Discount</dt>
-        <dd>- Rs {totals.discount}</dd>
-        <dt>Total</dt>
-        <dd>Rs {totals.total}</dd>
-      </dl>
+      <div className="summary">
+        <div>
+          {coupon ? (
+            <p>
+              Coupon <b>{coupon}</b>{' '}
+              <button
+                className="ghost"
+                onClick={removeCoupon}
+              >
+                Remove
+              </button>
+            </p>
+          ) : (
+            <form onSubmit={apply}>
+              <input
+                value={code}
+                onChange={(e) =>
+                  setCode(e.target.value)
+                }
+                placeholder="Coupon code"
+              />{' '}
+              <button>Apply</button>
+              <p className="err">{message}</p>
+            </form>
+          )}
+        </div>
+        <dl className="totals">
+          <dt>Subtotal</dt>
+          <dd>Rs {totals.subtotal}</dd>
+          <dt>Discount</dt>
+          <dd>- Rs {totals.discount}</dd>
+          <dt>Total</dt>
+          <dd>Rs {totals.total}</dd>
+        </dl>
+      </div>
     </>
```

Guess: Asha types `save10` in small letters and presses Apply. The message says it is not a coupon, because the table has capital letters and a computer treats small and capital letters as different:

```bash
(cart page, Step 4a, typing save10 in small letters)
Subtotal  Rs 898
Discount  - Rs 0
Total     Rs 898
save10 is not a coupon
```

The fix: change the code to capital letters before the check.

```bash
sh ../use-step.sh step4b-coupon
```
`pages/Cart.tsx` (changes marked with + and -):
```diff
@@ -23,3 +23,3 @@
     e.preventDefault()
-    const clean = code.trim()
+    const clean = code.trim().toUpperCase()
     if (!(clean in COUPONS)) {
```

Now `save10` in small letters works (`Coupon SAVE10`, discount 90, total 808), a code that does not exist shows `NOPE is not a coupon`, and `FLAT200` takes 200 off:

```bash
(typing nope)
NOPE is not a coupon
```

```bash
(typing save10)
Coupon SAVE10
Subtotal  Rs 898
Discount  - Rs 90
Total     Rs 808
```

Look at what the store never needed to know: the rules. It only keeps a code. The check is in the page and the counting is in `getTotals`. If the coupon rules change, one file changes.

### Step 5: saved

Without more, a refresh empties the cart: the store lives in memory. Wrap the store in `persist` (lesson M10-L05) and give the shelf a name:

```bash
sh ../use-step.sh step5a-persist
```
`cart/cartStore.ts` (changes marked with + and -):
```diff
@@ -1,2 +1,3 @@
 import { create } from 'zustand'
+import { persist } from 'zustand/middleware'
 import type { CartItem } from './types'
@@ -13,23 +14,26 @@
 export const useCartStore = create<CartStore>()(
-  (set) => ({
-    items: [],
-    coupon: null,
-    add: (item) =>
-      set((state) => {
-        const has = state.items.some(
-          (i) => i.slug === item.slug,
-        )
-        return has
-          ? state
-          : { items: [...state.items, item] }
-      }),
-    remove: (slug) =>
-      set((state) => ({
-        items: state.items.filter(
-          (item) => item.slug !== slug,
-        ),
-      })),
-    applyCoupon: (code) => set({ coupon: code }),
-    removeCoupon: () => set({ coupon: null }),
-  }),
+  persist(
+    (set) => ({
+      items: [],
+      coupon: null,
+      add: (item) =>
+        set((state) => {
+          const has = state.items.some(
+            (i) => i.slug === item.slug,
+          )
+          return has
+            ? state
+            : { items: [...state.items, item] }
+        }),
+      remove: (slug) =>
+        set((state) => ({
+          items: state.items.filter(
+            (item) => item.slug !== slug,
+          ),
+        })),
+      applyCoupon: (code) => set({ coupon: code }),
+      removeCoupon: () => set({ coupon: null }),
+    }),
+    { name: 'cart' },
+  ),
 )
```

Add React and SQL, apply `save10`, and look at the shelf, the browser's local storage:

```bash
(browser console)
localStorage.getItem("cart")
{"state":{"items":[{"slug":"react-for-beginners","title":"React for Beginners","price":499},{"slug":"sql-in-two-weeks","title":"SQL in Two Weeks","price":399}],"coupon":"SAVE10"},"version":0}
```

One key, `cart`, with the items and the coupon, saved as text, and a version number. The functions are not saved. Refresh: the cart is back, the badge says 2 and the totals are the same. It was a new page, so any counters start again. In the catalog the buttons still say `In cart`.

Now a mistake that shows up later. The shelf is only text, and anyone can change it, even an old version of our own code. Put a damaged value on the shelf: `items` equals the word `nope`:

```js
localStorage.setItem('cart', JSON.stringify({ state: { items: 'nope', coupon: null }, version: 0 }))
```

Reload. The text was valid, so `persist` loaded it and put the word `nope` where a list belongs:

```bash
(step 5a, the page with the damaged shelf)
Unexpected Application Error!
state.items.some is not a function
```

TypeScript cannot help: the types vanish when the code runs (module 9, lesson 4). The fix is the same tool: a Zod schema, checked when the value loads, with `merge` in the `persist` options.

```bash
sh ../use-step.sh step5b-persist-with-zod
```
`cart/cartStore.ts` (changes marked with + and -):
```diff
@@ -2,4 +2,16 @@
 import { persist } from 'zustand/middleware'
+import { z } from 'zod'
 import type { CartItem } from './types'
 
+const saved = z.object({
+  items: z.array(
+    z.object({
+      slug: z.string(),
+      title: z.string(),
+      price: z.number(),
+    }),
+  ),
+  coupon: z.string().nullable(),
+})
+
 type CartStore = {
@@ -36,3 +48,10 @@
     }),
-    { name: 'cart' },
+    {
+      name: 'cart',
+      merge: (persisted, current) => {
+        const result = saved.safeParse(persisted)
+        if (!result.success) return current
+        return { ...current, ...result.data }
+      },
+    },
   ),
```

With the same damaged shelf the page opens with an empty cart and no crash:

```bash
(step 5b, the same damaged shelf)
Cart 0, and the course list with every button on "Add to cart". No error.
```

A good shelf, with one course and a coupon, still loads with the right totals (`Rs 499`, discount `Rs 50`, total `Rs 449`). And if the shelf is not even valid text, `persist` ignores it too. Check types and build:

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
✓ 207 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.39 kB │ gzip:   0.26 kB
dist/assets/index-WkX1bN-x.css    2.18 kB │ gzip:   0.84 kB
dist/assets/index-Dizu6LdC.js   404.54 kB │ gzip: 124.81 kB

✓ built in 452ms
```

(The file hashes can differ on your machine.)

### Test it like a user

Start with a fresh browser (an empty shelf) and the API running. The course list: add React for Beginners and SQL in Two Weeks; the badge says 2. Open the cart. First a code that does not exist, `nope`: `NOPE is not a coupon`. Then `save10` in small letters: discount 90, total 808. Refresh for real: the same cart, the same coupon, and the badge says 2. Remove SQL: the badge says 1 and the discount drops to 50, because ten percent of 499 is 50 after rounding; the total is 449:

```bash
(after Remove on SQL in Two Weeks)
Cart 1
Coupon SAVE10
Subtotal  Rs 499
Discount  - Rs 50
Total     Rs 449
```

Back in the catalog: React shows `In cart`, SQL shows `Add to cart` again.

## What is still not production

A cart that works on your laptop is not ready for real users. Three things break:

1. The price lives in the browser. Open the shelf and change the price of System Design from 999 to 1, then open the cart: the total is one rupee. Anyone can do this. The server must recompute the prices and coupons.

```bash
(cart page after changing the price on the shelf)
Cart 1
System Design  Rs 1
Subtotal  Rs 1
Total     Rs 1
```

2. Two tabs. In the first tab remove the course; the second tab still says `Cart 1` and its button says `In cart` until a refresh. `persist` writes to the shelf, but it does not listen to it.
3. Another browser. A new browser has a new shelf, so the badge says 0. The cart lives in this browser, not with the student. A real cart is saved on the server with the student's account.

## Your turn: two extensions

**Task one: keep the tabs in sync.** The browser sends an event called `storage` to the other tabs when the shelf changes. Listen for it in `main.tsx` and ask the store to read the shelf again with `useCartStore.persist.rehydrate()`. The solution is `steps/ext1-tab-sync`:

```bash
sh ../use-step.sh ext1-tab-sync
```
`main.tsx` (changes marked with + and -):
```diff
@@ -3,2 +3,3 @@
 import { RouterProvider } from 'react-router/dom'
+import { useCartStore } from './cart/cartStore'
 import router from './router'
@@ -6,2 +7,6 @@
 
+window.addEventListener('storage', (e) => {
+  if (e.key === 'cart') useCartStore.persist.rehydrate()
+})
+
 createRoot(document.getElementById('root')!).render(
```

With two tabs open, removing the course in the first tab makes the second tab say `Cart 0` and its button `Add to cart` at once.

**Task two: forget the coupon of an empty cart.** Right now, if she removes the last course, the code stays in the store. Make `remove` clear the coupon when the list becomes empty. Hint: work out the new list first, then decide. A possible answer (tested with a small script: after `remove` the list is empty and the coupon is `null`):

```ts
remove: (slug) =>
  set((state) => {
    const items = state.items.filter(
      (item) => item.slug !== slug,
    )
    return {
      items,
      coupon: items.length === 0 ? null : state.coupon,
    }
  }),
```

## The folder

```text
allcsvideos-web/src/
  main.tsx  router.tsx  api.ts  types.ts  index.css
  cart/        cartStore.ts  totals.ts  types.ts
  components/  AddToCartButton.tsx  CourseCard.tsx
  layouts/     RootLayout.tsx
  pages/       Cart.tsx  Catalog.tsx  CourseDetail.tsx
  utils/       formatPrice.ts
```

## Common mistakes

- `add` that never checks whether the course is already in the cart.
- Using `formatPrice` for a discount: it prints `Free` for zero. It is for course prices only.
- Comparing the coupon code without normalising it (`toUpperCase`).
- Storing the totals. They can always be worked out from the items and the coupon.
- Trusting the saved cart. A saved value is input from outside: check it with Zod when you load it. And in production, prices, coupons and the cart itself belong on the server.

## Clean up

Stop the API and the dev server with Ctrl+C. In the browser, delete the `cart` key from local storage (or clear site data for the dev address). Delete `allcsvideos-web/node_modules` and `allcsvideos-web/dist` if you want. Run `sh ../use-step.sh step5b-persist-with-zod` so `src/` holds the finished cart.

## Key ideas (recap)

1. Ask where each piece of state lives, in order: address, server, shared, local. The items and the coupon are shared, so they live in one store. The totals are derived, so they are never stored.
2. Selectors keep every piece small: the badge asks for a length, the button asks for a yes or no. `add` must ignore a course that is already in. And `formatPrice` is for course prices only.
3. `persist` saves the store in local storage, but a saved value is input from outside: check it with Zod when you load it. And in production, prices, coupons and the cart itself belong on the server.

## Next

The Module 10 practice sheet: [20 state-management exercises](../../practice/m10-state-management/README.md). Then Module 11, Lesson 1: [Why Server State Is Different](../../m11-server-state-with-tanstack-query/m11-l01-why-server-state-is-different/README.md).
