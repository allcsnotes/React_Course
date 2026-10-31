# M16-L04 · Designing a Component API

> Video: Module 16, Lesson 4. Watch it first, then follow along here.

## What you'll learn

- Why a pile of on-off props (`primary`, `danger`, `small`, `large`) allows 32 combinations and most are nonsense
- Habit one, closed choices: literal unions such as `variant` and `size`
- Habit two, safe defaults, and why `children` has no question mark
- Habit three, impossible combinations that cannot be written: a discriminated union with `never`
- Controlled and uncontrolled components, with a Switch that offers both
- Passing the real element's props through (`ComponentProps<'button'>`) and three real mistakes

## Before you start

- Node 24 (`node --version`). No earlier lesson folder and no Docker needed: a complete Vite + React 19.3.1 + TypeScript 7.0.2 project (Vite 8.3.5).
- You should know literal unions and discriminated unions (Module 9, Lessons 1 and 3) and default values (Module 3, Lesson 4).
- Priya is the teammate using Asha's components. All text on the page is demo text.

## Files in this folder

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | Pinned project |
| `index.html`, `vite.config.ts`, `tsconfig*.json` | Setup (dev server on port 5164) |
| `src/` | What the dev server runs. It starts as `s0-soup` |
| `versions/` | One folder per stage; `versions/common/index.css` is copied with each |
| `use-version.sh` | Copies one version into `src/` |

Versions in video order:

| Folder | Stage |
|--------|-------|
| `s0-soup` | The Button with five boolean props |
| `s1-variant` | `variant` and `size` unions with defaults |
| `m1-typo` | Priya's three mistakes, caught by TypeScript |
| `s3-union` | Button as a button or a link (discriminated union) |
| `m3-unionbad` | Three wrong calls to it |
| `s4-notice` | A Notice that can be dismissed |
| `m4-noticebad` | Two wrong calls to it |
| `s5-switch` | A Switch, controlled or uncontrolled |
| `m5-both` | Both kinds at once, and half of each |
| `s2-native` | Button passing through all native button props |
| `m2-class` | Mistake one: `className` after the spread |
| `m6-flip`, `m6-flipfix` | Mistake two: a value that starts as nothing |
| `m7-zero`, `s7-zerofix` | Mistake three: `||` instead of a default |

## Follow along

### 1. Install and start

```bash
npm install
npm run dev
```

Open http://localhost:5164. Switch version with `./use-version.sh <name>` (Vite reloads). `npx tsc -b` checks the types of whatever is in `src/`.

### 2. The problem: a soup of switches

`s0-soup` (already in `src/`):

```tsx
type ButtonProps = {
  primary?: boolean
  secondary?: boolean
  danger?: boolean
  small?: boolean
  large?: boolean
  children: ReactNode
}
```

Priya sees `primary` and `danger` and writes both, and `small large` for a Buy button. TypeScript says nothing (`npx tsc -b` exits with 0). The page shows (my measured styles):

```text
Enroll  btn primary        blue   (rgb 26,124,255)
Remove  btn primary danger red    (rgb 217,54,54)   <- red only because the red rule is lower in the style sheet
Buy     btn small large    grey   (rgb 239,239,239) <- large, but no colour at all
```

Five on-off switches make 32 combinations. Nobody decided any of this; it just happened. That is a badly designed component API: the list of props is how other developers talk to your component.

A well designed one has three habits: choices are a closed list of exact words, leaving a prop out gives a safe default, and combinations that make no sense cannot be written. Then one more question: who owns the value, the component or its parent?

### 3. Habits one and two: closed choices and defaults

```bash
./use-version.sh s1-variant
```

```tsx
import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger'
type Size = 'sm' | 'md' | 'lg'

type ButtonProps = {
  variant?: Variant
  size?: Size
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
}: ButtonProps) {
  return <button className={`btn ${variant} ${size}`}>{children}</button>
}
```

- `variant` and `size` are literal unions: exact words only.
- `variant = 'primary'` and `size = 'md'` are used only when the prop is missing.
- `children` has no question mark, so it is required. A button with nothing inside is never wanted.

Priya writes `<Button>Enroll</Button>`, `<Button variant="danger">Remove</Button>` and `<Button variant="secondary" size="lg">Preview</Button>`. Real result: Enroll is the blue default, Remove is red, Preview is white with a blue border and larger. Classes: `btn primary md`, `btn danger md`, `btn secondary lg`. One prop holds one choice, so they cannot clash.

### 4. The safety net

```bash
./use-version.sh m1-typo
npx tsc -b
```

`App.tsx` has Priya's old habits: `variant="primry"`, a lone `danger`, and a Button with no text. Real output:

```text
src/App.tsx(6,15): error TS2820: Type '"primry"' is not assignable to type 'Variant | undefined'. Did you mean '"primary"'?
src/App.tsx(7,15): error TS2322: Type '{ danger: true; children: string; }' is not assignable to type 'IntrinsicAttributes & ButtonProps'.
  Property 'danger' does not exist on type 'IntrinsicAttributes & ButtonProps'.
src/App.tsx(8,8): error TS2741: Property 'children' is missing in type '{}' but required in type 'ButtonProps'.
```

Three mistakes, three errors, and TypeScript even suggests the right word. Before, Priya got a silent wrong page. Now she gets a red line in the editor before she saves.

### 5. Habit three: impossible combinations

One Button for two jobs: a real button that runs a function, or a link that goes to an address. A button needs `onClick`, a link needs `href`, both together make no sense. Making both optional lets Priya write a link with no address. The better way is a discriminated union (tag: `as`).

```bash
./use-version.sh s3-union
```

```tsx
type Variant = 'primary' | 'secondary' | 'danger'
type Size = 'sm' | 'md' | 'lg'

type Base = { variant?: Variant; size?: Size; children: ReactNode }

type ButtonProps = Base &
  (
    | { as?: 'button'; onClick: () => void; href?: never }
    | { as: 'link'; href: string; onClick?: never }
  )

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', children } = props
  const cls = `btn ${variant} ${size}`
  if (props.as === 'link') {
    return <a className={cls} href={props.href}>{children}</a>
  }
  return <button className={cls} onClick={props.onClick}>{children}</button>
}
```

`never` on a prop means: if you pass it, it is an error. Inside, `props.as === 'link'` narrows the type, so `props.href` is safe in the first branch and `props.onClick` in the second.

Correct calls work: Enroll runs a function (press it twice and the page says `Seats taken: 2`), and Syllabus is a real link: `<a class="btn secondary md" href="#syllabus">Syllabus</a>`.

Now three wrong calls:

```bash
./use-version.sh m3-unionbad
npx tsc -b
```

```text
src/App.tsx(6,8): error TS2322: Type '{ as: "link"; onClick: () => void; children: string; }' is not assignable to type 'IntrinsicAttributes & ButtonProps'.
  Types of property 'onClick' are incompatible.
    Type '() => void' is not assignable to type 'undefined'.
src/App.tsx(7,8): error TS2322: Type '{ href: string; children: string; }' is not assignable to type 'IntrinsicAttributes & ButtonProps'.
  Property 'as' is missing in type '{ href: string; children: string; }' but required in type '{ as: "link"; href: string; onClick?: undefined; }'.
src/App.tsx(8,8): error TS2322: Type '{ as: "link"; children: string; }' is not assignable to type 'IntrinsicAttributes & ButtonProps'.
  Property 'href' is missing in type '{ as: "link"; children: string; }' but required in type '{ as: "link"; href: string; onClick?: undefined; }'.
```

None is accepted. Each message names the exact problem.

#### A second example: Notice

```bash
./use-version.sh s4-notice
```

```tsx
type NoticeProps = {
  tone?: 'info' | 'warning'
  children: ReactNode
} & (
  | { dismissible?: false; onDismiss?: never }
  | { dismissible: true; onDismiss: () => void }
)
```

If `dismissible` is true, `onDismiss` is required; if not, `onDismiss` is forbidden. Run it: the yellow notice closes when you press the cross. Two wrong calls (`./use-version.sh m4-noticebad`, then `npx tsc -b`):

```text
src/App.tsx(6,8): error TS2322: Type '{ dismissible: true; children: string; }' is not assignable to type 'IntrinsicAttributes & NoticeProps'.
  Property 'onDismiss' is missing in type '{ dismissible: true; children: string; }' but required in type '{ dismissible: true; onDismiss: () => void; }'.
src/App.tsx(7,8): error TS2322: Type '{ onDismiss: () => void; children: string; }' is not assignable to type 'IntrinsicAttributes & NoticeProps'.
  Property 'dismissible' is missing in type '{ onDismiss: () => void; children: string; }' but required in type '{ dismissible: true; onDismiss: () => void; }'.
```

Without the union, the second call would compile and the cross would simply never appear. A silent mistake, caught.

### 6. Who owns the value? Controlled and uncontrolled

An uncontrolled Switch keeps its own state (you give it only `defaultChecked`). A controlled one gets `checked` and `onChange`, and the parent keeps the state.

```bash
./use-version.sh s5-switch
```

```tsx
import { useState } from 'react'

type SwitchProps = { label: string } & (
  | {
      checked: boolean
      onChange: (next: boolean) => void
      defaultChecked?: never
    }
  | {
      checked?: never
      onChange?: (next: boolean) => void
      defaultChecked?: boolean
    }
)

export function Switch(props: SwitchProps) {
  const [inner, setInner] = useState(props.defaultChecked ?? false)
  const controlled = props.checked !== undefined
  const on = controlled ? props.checked : inner

  function toggle() {
    if (!controlled) setInner(!on)
    props.onChange?.(!on)
  }

  return (
    <button className="sw" role="switch" aria-checked={on} onClick={toggle}>
      <span className="track" />
      {props.label}
      <span className="st">{on ? 'on' : 'off'}</span>
    </button>
  )
}
```

- The type has two shapes. Controlled: `checked` and `onChange` required, `defaultChecked` is `never`. Uncontrolled: `checked` is `never`. Priya must pick one way.
- `const controlled = props.checked !== undefined` decides who owns the value. `on` comes from the prop when controlled and from the Switch's own state otherwise.
- The click handler changes its own state only when it is not controlled, and always tells the parent with `onChange`.

(The build video, M16-B11, moves this pattern into a small helper called `useControllable`.)

The page has three switches: Email (uncontrolled, starts on), Dark mode (controlled by the parent's state) and Locked (controlled, `checked={false}`, an `onChange` that does nothing). Under them a button turns dark mode on from outside.

Guess first: press Email, then Locked, then the button. Real result:

```text
start:               Email on   | Dark mode off | Locked off
press Email:         Email off  | Dark mode off | Locked off   (it flipped by itself)
press Locked:        Email off  | Dark mode off | Locked off   (nothing: the parent said off, and the parent is the boss)
press the button:    Email off  | Dark mode on  | Locked off   (the parent changed its state; the switch shows what it is told)
```

The parent can change the value, refuse it, or copy it. The price: the parent must hold the state. Uncontrolled is less code when the parent does not care.

The types protect you. `./use-version.sh m5-both` and `npx tsc -b`:

```text
src/App.tsx(8,8): error TS2322: Type '{ label: string; checked: boolean; onChange: Dispatch<SetStateAction<boolean>>; defaultChecked: true; }' is not assignable to type 'IntrinsicAttributes & SwitchProps'.
  Types of property 'defaultChecked' are incompatible.
    Type 'true' is not assignable to type 'undefined'.
src/App.tsx(9,8): error TS2322: Type '{ label: string; checked: boolean; }' is not assignable to type 'IntrinsicAttributes & SwitchProps'.
  Property 'onChange' is missing in type '{ label: string; checked: boolean; }' but required in type '{ checked: boolean; onChange: (next: boolean) => void; defaultChecked?: undefined; }'.
```

### 7. Do not hide the platform

A real button already has dozens of props (`disabled`, `type`, `aria-label`). If Button accepts only `variant` and `size`, Priya will ask Asha for a new prop every week.

```bash
./use-version.sh s2-native
```

```tsx
import type { ComponentProps } from 'react'

type Variant = 'primary' | 'secondary' | 'danger'
type Size = 'sm' | 'md' | 'lg'

type ButtonProps = ComponentProps<'button'> & {
  variant?: Variant
  size?: Size
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}: ButtonProps) {
  const cls = `btn ${variant} ${size} ${className}`
  return <button className={cls.trim()} {...rest} />
}
```

`ComponentProps<'button'> & {...}` adds our props to everything a button accepts. `...rest` collects the rest and hands it to the button, and `className` is joined with ours. In `App.tsx`: `<Button type="submit">Enroll</Button>`, `<Button disabled>Sold out</Button>` and `<Button className="wide" aria-label="Preview the course">Preview</Button>`. Real result: Enroll is a submit button, Sold out is grey and cannot be pressed, Preview got the class `wide` (`btn primary md wide`) and keeps the blue look.

## Common mistakes

### 1. The spread order

```bash
./use-version.sh m2-class
```

This Button does not take `className` out of `rest`, and the spread comes after our `className`. Priya passes `className="wide"` and her class replaces ours. Real result: Preview lost every style and is a plain grey box (it no longer has the `btn` class). Fix: take `className` out of the rest and join it, as in `s2-native`.

### 2. A value that starts as nothing

```bash
./use-version.sh m6-flip
```

`TextField` takes `value?: string`, and the parent's state starts as `undefined`. The first letter changes the box from uncontrolled to controlled. Type a letter in the box and the console shows this error (real output, shortened):

```text
A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen.
```

The fix belongs in the API. Make `value` required, a `string`:

```bash
./use-version.sh m6-flipfix
npx tsc -b
```

```text
src/App.tsx(11,40): error TS2322: Type 'string | undefined' is not assignable to type 'string'.
  Type 'undefined' is not assignable to type 'string'.
```

Priya fixes it at the call: `useState('')`. The wrong use no longer compiles.

### 3. `||` instead of a default

```bash
./use-version.sh m7-zero
```

`useState(start || 1)` with `<Quantity start={0} />`. Zero is falsy (Module 2, Lesson 6), so the picker shows `1`. The fix, `s7-zerofix`: a default in the round brackets, `{ start = 1 }`. It fills in only when the prop is missing. Real result: `0`.

```bash
./use-version.sh s7-zerofix
```

## Clean up

Stop the dev server (Ctrl+C). `./use-version.sh s0-soup` goes back to the start. `node_modules/` can be deleted any time.

## Key points

- Props are the component's API. Use closed choices (literal unions) instead of piles of booleans, give safe defaults, make `children` required.
- A discriminated union with a tag forbids impossible combinations; `never` marks a prop that must not be given. Extend the real element's props with `ComponentProps`.
- Controlled: the parent passes the value and `onChange`. Uncontrolled: the component keeps its own state from `defaultChecked`. Offer one or the other, never both, typed as two shapes.

Interview tip. If Rahul, the interviewer, asks "how do you design the props of a reusable component?": a small set of closed choices, safe defaults, a discriminated union to forbid impossible combinations, native element props passed through, and a clear choice between controlled and uncontrolled, typed so the two cannot be mixed.

## Try it yourself

Give `Notice` a `size` prop, a literal union with a default. Then pass a word that is not in the list and read the error.

## Next

[M16-B11 · Build a Component Library](../m16-b11-build-a-component-library/README.md)
