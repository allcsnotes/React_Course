# M06-L03 · Responsive Design and Dark Mode

> Video: Module 6, Lesson 3. Watch it first, then follow along here.

## What you'll learn

- Why a page built on a laptop breaks on a phone, and what mobile-first means
- `@media (min-width: ...)` rules, and a gallery that needs no media query: `repeat(auto-fill, minmax(240px, 1fr))`
- The viewport meta tag, and making images shrink with `max-width: 100%; height: auto`
- The same job in Tailwind: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- Dark mode with CSS variables, `prefers-color-scheme`, and your own switch with a `data-theme` attribute and `useState`
- Dark mode in Tailwind (`dark:`), and two mistakes

## Before you start

- Node 24 (`node --version`).
- Best after [M06-L02](../m06-l02-tailwind-css/) and M03-B01 (the course gallery). Tailwind is used only in the `v5-tw`, `v8-twdark`, `v8a-twdark-media` and `v9-twbad` steps.
- No Docker needed.

## Files in this folder

`src/` is the plain-CSS gallery with automatic dark mode. `versions/base/` holds the starting project files (`index.html`, `vite.config.js`, `main.jsx`, components); every other `versions/` folder holds the files that change in that step. Copy a step's files over `src/` (for `index.html` and `vite.config.js` the files go in the project root).

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | React 19.3.1, Vite 8.3.5, Tailwind 4.3.3 |
| `src/App.jsx`, `src/components/` | Layout, Gallery, CourseCard, Tag |
| `src/index.css` | All the styles, with CSS variables |
| `public/banner.svg` | The 1200px wide banner for the image lesson |
| `versions/v1-fixed` | Four fixed columns |
| `versions/v2-mq` | A media query for tablet and desktop |
| `versions/v3-auto` | `auto-fill` and `minmax`, no media query |
| `versions/x-nometa` | A page without the viewport meta tag |
| `versions/v4-hero`, `v4b-hero-fix` | A 1200px banner image, then `max-width: 100%` |
| `versions/v5-tw` | The gallery in Tailwind |
| `versions/v6-dark`, `v6b-dark-bad` | Dark mode with variables, and a colour written straight into a rule |
| `versions/v7-toggle` | A Dark / Light switch with `data-theme` |
| `versions/v8-twdark`, `v8a-twdark-media` | Dark mode in Tailwind, system setting and your own switch |
| `versions/v9-twbad` | `sm:` thought to mean "small screen only" |

## Follow along

### 1. Set up

```bash
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`) and use the browser's device toolbar (F12, then the phone icon), or just drag the window narrower. Nothing in the code is wrong in the first version: the page was never told that screens come in different sizes.

A responsive page is like water in a glass: the content stays the same, the layout takes the shape of the screen. Mobile-first means: design the smallest screen first (one column, big text), then add bigger layouts as the screen gets wider.

### 2. Four fixed columns (`v1-fixed`)

The grid rule is `display: grid; grid-template-columns: repeat(4, 1fr)`: four equal columns on every screen. The real measurements from the video's three screens:

```text
fixed (narrow phone) page 542px wide on a 375px screen: 4 columns of about 105-139px, titles break inside words
fixed (tablet 768px)  4 columns of 168px
fixed (laptop 1280px) 4 columns of 296px
```

On the phone the columns cannot get thinner than their words, so the page grows wider than the screen and Lukas has to scroll sideways.

### 3. A media query (`v2-mq`)

A media query is an `if` for the screen: use these rules only when the screen is at least this wide. Mobile-first means the plain rule is the phone (one column) and `min-width` queries add the bigger layouts. The real result:

```text
phone   (375px)   1 column of 327px
tablet  (768px)   2 columns of 352px
laptop  (1280px)  4 columns of 296px
```

### 4. No media query at all (`v3-auto`)

For equal cards, let the grid decide: `grid-template-columns: repeat(auto-fill, minmax(240px, 1fr))`. Each column is at least 240px and at most one equal share, and `auto-fill` makes as many columns as fit. The real result is the same as above: 1 column of 327px on the phone, 2 of 352px on the tablet, 4 of 296px on the laptop, from one line.

### 5. The viewport meta tag (`x-nometa`)

`index.html` must have `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`. Without it a phone pretends to be a wide desktop: in the video the "phone" measured 981px wide and showed 2 columns of 458px, zoomed out.

### 6. Images (`v4-hero`, `v4b-hero-fix`)

A banner image with `width: 1200px` looks perfect on the laptop. On the phone the page measured 1224px wide on a 375px screen. The fix is two rules: `max-width: 100%` (never wider than the box you sit in) and `height: auto` (keep the picture's shape while it shrinks). Real result: the page is exactly 375px wide again, with no sideways scroll.

### 7. The same in Tailwind (`v5-tw`)

Tailwind has media queries built in as prefixes. Read it mobile-first: a class with no prefix is every screen (the phone), `sm:` means 640px and up, `lg:` means 1024px and up.

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
```

In the real build the CSS file is 8775 bytes and holds two media queries, `@media (width>=40rem)` and `@media (width>=64rem)`, with these rules:

```css
.sm\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}
.lg\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}
```

The real layouts: 1 column of 327px (phone), 2 of 352px (tablet), 4 of 296px (laptop).

### 8. Dark mode with CSS variables (`v6-dark`)

Day or night the furniture (layout) does not move, only the lights (colours) change. So put every colour in a named variable once, and use `var(--bg)` everywhere else:

`src/index.css`:
```css
:root {
  --bg: #f3f5f9; --text: #16181d; --muted: #4a5160;
  --card: #ffffff; --border: #dde2ea; --link: #1a5fd0;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f1115; --text: #eceef2; --muted: #a6adbb;
    --card: #1a1d24; --border: #2c313b; --link: #6aa5ff;
  }
}
* { box-sizing: border-box; }
```

The browser tells your CSS about the system setting with `prefers-color-scheme`. In the real run the page background was `rgb(243, 245, 249)` in light mode and `rgb(15, 17, 21)` in dark mode.

### 9. Your own switch (`v7-toggle`)

A switch must remember which theme is on, and remembering is state. `useState` gets a small function that asks the browser whether the system prefers dark. The page div gets `data-theme={theme}` (any attribute starting with `data-` is yours to invent), and the button flips it. In the CSS the colours move out of the media query into two rules, one for `[data-theme='light']` and one for `[data-theme='dark']`, using the same variable names.

`versions/v7-toggle/components/Layout.jsx`:
```jsx
import { useState } from 'react'

function Layout({ children }) {
  const [theme, setTheme] = useState(() =>
    matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark' : 'light'
  )

  return (
    <div className="page" data-theme={theme}>
      <header>
        <strong>allcsvideos</strong>
        <nav>
          <a href="#">Courses</a>
          <a href="#">Pricing</a>
          <a href="#">My courses</a>
        </nav>
        <button onClick={() => setTheme(
          theme === 'dark' ? 'light' : 'dark'
        )}>
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </header>
      <main>{children}</main>
    </div>
  )
}

export default Layout
```

The real button text goes `Dark`, `Light`, `Dark`, `Light` on each click.

### 10. Dark mode in Tailwind (`v8a-twdark-media`, `v8-twdark`)

In Tailwind it is a prefix too: `bg-white dark:bg-slate-900` reads "white, but in dark mode nearly black". By default `dark:` follows the system setting (the build shows a `@media (prefers-color-scheme:dark)` rule, 9570 bytes of CSS). To use your own switch, one line in the CSS file changes what `dark` means:

`versions/v8-twdark/index.css`:
```css
@import "tailwindcss";

@custom-variant dark
  (&:where([data-theme=dark], [data-theme=dark] *));

body { font-size: 22px; }
```

The generated rule now says "where `data-theme` is dark", and the same click gives a dark page (9849 bytes of CSS).

### 11. Two mistakes

**A colour written straight into a rule (`v6b-dark-bad`).** The card title has a near-black colour typed into the rule. In dark mode the card turns dark and the titles vanish: near-black on dark grey. Always use the variable.

**`sm:` does not mean small only (`v9-twbad`).** Writing `grid-cols-4 sm:grid-cols-1` to get one column on phones does not work: `sm:` means "small and up". The phone has no prefix, so plain `grid-cols-4` applies, and the real phone showed four columns of 70px. Put the phone value first and add bigger layouts with prefixes.

## Common mistakes

- Four fixed columns on every screen (sideways scrolling on a phone).
- No viewport meta tag.
- A fixed pixel width on an image. Use `max-width: 100%; height: auto`.
- A colour typed into a rule instead of a CSS variable (invisible text in dark mode).
- Reading `sm:` as "only small screens".

## Try it yourself

Add a third theme (for example "Sepia") to the switch. Hint: the state becomes a string with three values and you add a third `[data-theme='sepia']` rule with the same variable names.

## Clean up

```bash
rm -rf node_modules dist
```

Press `Ctrl+C` to stop the dev server.

## Next

Continue with [M06-L04 · Component Libraries and Accessibility Basics](../m06-l04-component-libraries-and-accessibility-basics/).
