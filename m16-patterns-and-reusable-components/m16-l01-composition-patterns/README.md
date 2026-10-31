# M16-L01 · Composition Patterns

> Video: Module 16, Lesson 1. Watch it first, then follow along here.

## What you'll learn

- Why a component that grows one new prop for every wish becomes hard to use
- Pattern one, slots: a prop that holds a piece of the page
- Pattern two, compound components: parts that share state through context, plus a hook that throws a clear message
- Pattern three, render props: a function you hand over to say how each item looks
- Pattern four, headless components: behaviour in a custom hook, with no markup
- Three mistakes (a part outside its parent, a render prop that returns nothing, a typo in a value) and how a union type catches one of them

## Before you start

- Node 24. Check with `node --version`.
- No earlier lesson folder is needed. This folder is a complete Vite + React 19 + TypeScript project (the same one Module 9 used). Docker is not needed.
- You should know children and composition (Module 3, Lesson 5), context (Module 10, Lesson 2) and custom hooks (Module 7, Lesson 6).

## Files in this folder

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | Pinned project: React 19.3.1, TypeScript 7.0.2, Vite 8.3.5 |
| `index.html`, `vite.config.ts`, `tsconfig*.json` | Vite and TypeScript setup (dev server on port 5161) |
| `src/main.tsx`, `src/index.css` | Entry file and the styles shared by every version |
| `src/App.tsx`, `src/Tabs.tsx` | The code you edit. Right now it is version `v0-props` |
| `versions/` | One folder per stage of the video (see the list below) |
| `use-version.sh` | Copies one version folder into `src/` |

The folders in `versions/`:

| Folder | Stage in the video |
|--------|--------------------|
| `v0-props` | The Tabs component with a prop for every wish (the problem) |
| `v1-slots` | Pattern one: a Card with header, footer and children slots |
| `v2-compound` | Pattern two: Tabs.List, Tabs.Tab, Tabs.Panel sharing state through context |
| `v2b-flex` | The designer's wishes added from the outside, with no new props |
| `v3a-cards`, `v3b-rows` | Pattern three: one `List` with a render prop, two looks |
| `v4-headless` | Pattern four: the `useDisclosure` hook used by `FaqItem` and `MoreText` |
| `m1-outside` | Mistake one: a Tab with no Tabs around it |
| `m2-void` | Mistake two: a render prop that returns nothing |
| `m3-typo` | Mistake three: `review` instead of `reviews` |
| `m3-union` | The fix for mistake three: a union type |

## Follow along

### 1. Install and start

```bash
npm install
npm run dev
```

Open http://localhost:5161. The first time, `npm install` prints `added 29 packages`. Stop the server with Ctrl+C when you want to switch to another version.

### 2. The problem: one prop per wish

Asha builds a course page with three tabs: About, Lessons and Reviews. The designer asks for a star and a number on the Reviews tab, and small print under the panel. Each wish became a prop. This is `versions/v0-props`, which is already in `src/`.

`src/Tabs.tsx`:

It holds the tab list, a `showIcons` flag, a `showBadges` flag, a `footer` and an `onChange` in one long props type (see `src/Tabs.tsx`).

`src/App.tsx` has to give every tab four fields (label, content, icon, badge) and switch things on with `showIcons`, `showBadges`, `footer` and `onChange`.

Click Reviews. You should see (in the page):

```text
allcsvideos | Course page | React for Beginners | About | Lessons | ★ Reviews12 | Lukas: clear and calm. | Updated this week
```

and the console shows `tab 2` (the `onChange` call). Next week the designer will ask for a lock on one tab and a button next to the tabs. Each wish means a new prop, a new `if` inside the component, and a new way to get it wrong. The four patterns below fix that.

To switch versions, stop the server, then run `./use-version.sh <folder name>` and start it again. The script clears the demo files in `src/` (it keeps `main.tsx` and `index.css`) and copies the files of the version folder in.

### 3. Pattern one: slots

A slot is a prop that holds a piece of the page, not just a word. Anything you can write in JSX can go in.

```bash
./use-version.sh v1-slots
```

`src/Card.tsx` has three slots: `header`, an optional `footer`, and `children`.

```tsx
import type { ReactNode } from 'react'

type Props = {
  header: ReactNode
  footer?: ReactNode
  children: ReactNode
}

export function Card({ header, footer, children }: Props) {
  return (
    <section className="box">
      <div className="box-head">{header}</div>
      <div className="box-body">{children}</div>
      {footer && <div className="box-foot">{footer}</div>}
    </section>
  )
}
```

`src/App.tsx` fills them. The header holds a title and a small tag inside an empty tag `<>...</>`. The second card has no `footer` prop at all.

Page text you should see:

```text
allcsvideos | Course page | React for Beginners | New | 24 lessons with Meera. | Enroll | Announcement | Live Q and A on Friday.
```

The second card has no footer and no empty strip, because `{footer && ...}` draws nothing when `footer` is missing. The Card never learned what a tag or a button is.

### 4. Pattern two: compound components

A compound component is a set of parts that work together and share what they need. Here the root `Tabs` keeps the active tab, and the parts read it through context.

```bash
./use-version.sh v2-compound
```

`src/Tabs.tsx`:

```tsx
function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs parts must be used inside <Tabs>')
  return ctx
}

export function Tabs({ initial, children }: RootProps) {
  const [active, setActive] = useState(initial)
  return (
    <TabsContext value={{ active, setActive }}>
      <div className="tabs">{children}</div>
    </TabsContext>
  )
}

function List({ children }: Kids) {
  return <div className="tablist">{children}</div>
}

function Tab({ value, children }: PartProps) {
  const { active, setActive } = useTabs()
  return (
    <button
      className={value === active ? 'tab on' : 'tab'}
      onClick={() => setActive(value)}
    >
      {children}
    </button>
  )
}

function Panel({ value, children }: PartProps) {
  const { active } = useTabs()
  if (value !== active) return null
  return <div className="panel">{children}</div>
}

Tabs.List = List
Tabs.Tab = Tab
```

Four things to notice:

1. `TabsContext` holds the active tab and a function to change it.
2. `useTabs()` reads the context and throws our own sentence if there is none, like `useTheme` in Module 10.
3. `Tab` is highlighted when its `value` is the active one, and a click calls `setActive`. `Panel` draws its children only when its `value` is the active one.
4. At the bottom, `Tabs.List = List`, `Tabs.Tab = Tab` and `Tabs.Panel = Panel` hang the parts on the `Tabs` function. That is why it is called compound.

Using it reads like the page itself. There is no list of objects and no option props:

```tsx
        <h2>React for Beginners</h2>
        <Tabs initial="about">
          <Tabs.List>
            <Tabs.Tab value="about">About</Tabs.Tab>
            <Tabs.Tab value="lessons">Lessons</Tabs.Tab>
            <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="about">
```

Guess first: Lukas clicks Reviews. What does the tab bar show, and what does the panel show? Then run `npm run dev` and click it. The page text changes from

```text
allcsvideos | Course page | React for Beginners | About | Lessons | Reviews | 24 lessons with Meera.
```

to

```text
allcsvideos | Course page | React for Beginners | About | Lessons | Reviews | Lukas: clear and calm.
```

The click changed one thing, the active value, in one place. Every part that reads it drew itself again.

#### The designer's wishes, from the outside

```bash
./use-version.sh v2b-flex
```

The star and the number go inside the Tab as its children, the review button goes inside the List, and the small print goes inside that Panel. `Tabs.tsx` did not change by one letter:

```tsx
            <Tabs.Tab value="about">About</Tabs.Tab>
            <Tabs.Tab value="lessons">Lessons</Tabs.Tab>
            <Tabs.Tab value="reviews">
              ★ Reviews <span className="badge">12</span>
            </Tabs.Tab>
            <button className="link">Write a review</button>
          </Tabs.List>
          <Tabs.Panel value="about">
            <p>24 lessons with Meera.</p>
          </Tabs.Panel>
```

Page text you should see for the Reviews panel:

```text
allcsvideos | Course page | React for Beginners | About | Lessons | ★ Reviews 12 | Write a review | Lukas: clear and calm. | Updated this week
```

### 5. Pattern three: render props

A render prop is a prop whose value is a function. The component does the looping, and your function decides how each item looks.

```bash
./use-version.sh v3a-cards
```

`src/List.tsx` is a generic component (Module 9, Lesson 3), so it works for any kind of item:

```tsx
type Props<T> = {
  items: T[]
  renderItem: (item: T) => ReactNode
}

export function List<T>({ items, renderItem }: Props<T>) {
  return <ul className="items">{items.map(renderItem)}</ul>
}
```

`src/courses.ts` is the data (four courses, prices are demo numbers).

`src/App.tsx` hands `renderItem` an arrow function that returns a card (title, teacher, price). The `key` goes on the element we return (Module 5, Lesson 2).

You should see four cards in two columns:

```text
allcsvideos | Course page | All courses | React for Beginners | Meera | Rs 499 | Python from Zero | Meera | Free | DevOps Basics | Asha | Free | SQL in Two Weeks | Asha | Rs 399
```

Now the same `List` and the same four courses, with only the function changed (a row with the title on the left and the price on the right):

```bash
./use-version.sh v3b-rows
```

You should see four plain rows (title on the left, price on the right):

```text
allcsvideos | Course page | All courses | React for Beginners | Rs 499 | Python from Zero | Free | DevOps Basics | Free | SQL in Two Weeks | Rs 399
```

`List.tsx` did not change. The data did not change. Only the note we handed over did. The component owns the looping, the caller owns the looks.

### 6. Pattern four: headless components

A headless component is only behaviour: state and rules, with nothing to see. In React that is usually a custom hook.

```bash
./use-version.sh v4-headless
```

`src/useDisclosure.ts` keeps one piece of state, `open`, and hands back a toggle function and the props a button needs. Look at what is not in the file: not a single tag.

```ts
import { useState } from 'react'

export function useDisclosure(start = false) {
  const [open, setOpen] = useState(start)
  const toggle = () => setOpen((o) => !o)
  return {
    open,
    toggle,
    buttonProps: { onClick: toggle, 'aria-expanded': open },
  }
}
```

Look one, an FAQ item (`src/FaqItem.tsx`):

```tsx
export function FaqItem({ question, children }: Props) {
  const { open, buttonProps } = useDisclosure()
  return (
    <div className="faq">
      <button className="faq-q" {...buttonProps}>
        {question} <span>{open ? '−' : '+'}</span>
      </button>
      {open && <p className="faq-a">{children}</p>}
    </div>
```

Look two, a "show more" text (`src/MoreText.tsx`). It calls the same hook, shows `text.slice(0, 44)` when closed, and the button label changes with `open`.

Guess: Lukas clicks the first question, then Show more. What happens to the first answer, the plus sign and the long text? Run it and try. Before the clicks:

```text
allcsvideos | Course page | Questions | Can I start from zero? | + | Is there a certificate? | + | Meera teaches React from the first tag to a … Show more
```

After clicking the first question and then Show more:

```text
allcsvideos | Course page | Questions | Can I start from zero? | − | Yes. The first lesson explains what a web page is. | Is there a certificate? | + | Meera teaches React from the first tag to a deployed app, one small idea at a time. Show less
```

Two looks, one hook, and each one has its own `open` state: a hook shares the recipe, not the dough.

### 7. Which pattern, and when?

- A few places to fill in: slots.
- Several parts that must agree on shared state: compound components.
- The caller decides how each item looks: a render prop.
- The caller wants their own markup and needs only the behaviour: a headless hook.

They mix well: our Tabs is compound, and the star and number inside a tab are children, like a slot. Start with plain children, then slots, and only then the heavier ones.

### 8. Check the types and build

With any good version in `src/`, `npx tsc -b` prints nothing (exit code 0) and `npm run build` ends with `✓ built in 492ms` (yours will differ a little).

## Common mistakes

### Mistake 1: a part outside its parent

```bash
./use-version.sh m1-outside
npm run dev
```

`App.tsx` writes `<Tabs.Tab value="about">About</Tabs.Tab>` with no `Tabs` around it. The whole page goes blank, and the console shows, in red:

```text
Uncaught Error: Tabs parts must be used inside <Tabs>
```

That is our own sentence from `useTabs`. Without it, the error would say something is null and nobody would know why. `tsc -b` finds nothing wrong here.

### Mistake 2: a render prop that returns nothing

```bash
./use-version.sh m2-void
```

`renderItem` is written with curly braces and no `return`, so it returns `undefined`.

The heading is there and the list is empty. TypeScript says nothing and React shows nothing (`tsc -b` exits with 0). An arrow function with curly braces needs `return`. Without braces, it returns by itself (Module 2, Lesson 1). Page text:

```text
allcsvideos | Course page | All courses
```

### Mistake 3: a typo in a value

```bash
./use-version.sh m3-typo
```

The Panel says `review` but the Tab says `reviews`. Click Reviews: the panel stays empty and no error appears anywhere. The two values simply never match.

The fix is a type from Module 9, a union of the three allowed words, in `Tabs.tsx`:

```tsx
type TabId = 'about' | 'lessons' | 'reviews'
type RootProps = Kids & { initial: TabId }
type PartProps = Kids & { value: TabId }
```

```bash
./use-version.sh m3-union
npx tsc -b
```

Real output:

```text
src/App.tsx(24,23): error TS2820: Type '"review"' is not assignable to type 'TabId'. Did you mean '"reviews"'?
```

The typo is caught before the page even runs. Fix `review` to `reviews` in `App.tsx` and `tsc -b` is quiet again.

## Clean up

Stop the dev server with Ctrl+C. To go back to the start, run `./use-version.sh v0-props`. You can delete `node_modules/` and `dist/` any time; `npm install` brings them back.

## Key points

- A slot is a prop that holds a piece of the page.
- A compound component is a set of parts that share state through context, with a hook that throws a clear message when a part is used outside its parent.
- A render prop is a function you hand over to say how each item looks; the component does the looping.
- A headless component is behaviour in a hook, with no markup, so any look can use it.
- Start with children and slots. Reach for the heavier patterns when props start to pile up.

Interview tip. If Rahul, the interviewer, asks "what is the compound component pattern?", a good answer: a set of components that share implicit state, usually through context, so the caller composes them in JSX. It avoids a long list of option props, like the tabs and select components in most design systems.

## Try it yourself

Build an Accordion as a compound component with `Accordion`, `Accordion.Item`, `Accordion.Button` and `Accordion.Panel`, keeping the open item in the top component. Use the `v2-compound` Tabs file as your model.

## Next

Next lesson: [M16-L02 · Portals, Modals and Special Hooks](../m16-l02-portals-modals-and-special-hooks/README.md).
