# M06-L04 · Component Libraries and Accessibility Basics

> Video: Module 6, Lesson 4. Watch it first, then follow along here.

## What you'll learn

- Why a page can look right and still be broken for people who use the keyboard or a screen reader
- Why a homemade dialog is not enough (the keyboard escapes behind the dim layer)
- Headless libraries (Radix UI) and copy-the-code libraries (shadcn/ui), and what each gives you
- Four accessibility basics, each with a real test: real buttons, labels, `alt` text, and contrast
- How to run an automatic check with axe-core

## Before you start

- Node 24 (`node --version`).
- Best after [M06-L03](../m06-l03-responsive-design-and-dark-mode/) (the Tailwind lessons help with the shadcn part).
- No Docker needed. The `npm install` and `npx shadcn` commands only download packages; nothing here uses a real account.

## Files in this folder

The project in the root folder is the Radix dialog and accessibility project (`@radix-ui/react-dialog` 1.3.1 and `axe-core` 4.14.0). `shadcn/` is a second, separate Tailwind project for the shadcn/ui step. Each `versions/` folder holds the `App.jsx` (and extra files) of one step; copy it over `src/App.jsx`.

| File | What it is |
|------|------------|
| `package.json`, `package-lock.json` | React 19.3.1, Vite 8.3.5, Radix dialog, axe-core |
| `src/App.jsx`, `src/EnrollDialog.jsx`, `src/index.css` | The Enroll page and the Radix dialog |
| `src/data/courses.js` | The shared courses |
| `versions/v1-div` | An Enroll "button" that is a `div` |
| `versions/v1b-button` | The same, with a real `button` |
| `versions/v2a-naive`, `v2b-radix` | A homemade dialog, then the Radix dialog |
| `versions/v3a-nolabel`, `v3b-label` | A text box with no label, then with a `label` |
| `versions/v4a-noalt`, `v4b-alt`, `v4c-decor` | Images with no `alt`, with `alt`, and decorative (`alt=""`) |
| `versions/v5a-lowcontrast`, `v5b-contrast` | Light grey text, then `#595959` |
| `versions/v6a-audit-bad`, `v6b-audit-good` | A page with four problems, then fixed |
| `versions/v7-shadcn-App.jsx` | The `App.jsx` for the shadcn project |
| `versions/v8-noring` | A focus ring removed with CSS |
| `shadcn/` | Vite + Tailwind 4.3.3 + shadcn 4.23.0 project with `components/ui/button.jsx` and `dialog.jsx` |

## Follow along

### 1. Set up

```bash
npm install
npm run dev
```

Open the address Vite prints (normally `http://localhost:5173`). Switch steps with `cp versions/<name>/App.jsx src/App.jsx`.

### 2. A page that looks right but is not (`v1-div`)

The Enroll "button" is a `div` with an `onClick`; Save for later is a real `button`. The two look the same. With the mouse both work. Now use only the keyboard: reload and press Tab. The real focus order, as Playwright saw it:

```text
focus after Tab: button "Save for later", then nothing (the ring leaves the page)
Enroll is never focused
```

There is no way to reach Enroll, and the accessibility tree lists it as plain text, `text: Enroll`, while the real button is listed as `button "Save for later"`. Nothing is red, no error anywhere, yet for Lukas (who cannot use a mouse) that button does not exist.

### 3. Fix one: use a real `button` (`v1b-button`)

Change the `div` to a `button`: same class, same click handler, same looks.

```text
Tab: button "Enroll"         Enter: Enrolled!
Tab: button "Save for later" Enter: Saved!
```

A real button comes with keyboard support for free: Tab lands on it, Enter or Space press it. The tree now says `button "Enroll"`. A `div` is just a box.

### 4. A dialog (`v2a-naive`, `v2b-radix`)

A dialog appears on top of the page, dims everything behind it and asks one question. The easy homemade way is a state `open` and `{open && <div>...}`. Using only the keyboard: Tab lands on Enroll, Enter opens the dialog, it looks right. Tab again and the ring goes to Save for later, which is behind the dim layer: the keyboard still reaches it. Making a safe dialog is hard (a lock for a door is solved by experts, not by you), so use a library.

There are two kinds. A styled library comes with its own looks. A headless library gives you only the behaviour and no looks, so you style it yourself. Radix UI is headless. It installs into this project only:

```bash
npm install @radix-ui/react-dialog
```

```text
added 26 packages, and audited 51 packages in 3s

9 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

`versions/v2b-radix/EnrollDialog.jsx`:
```jsx
import * as Dialog from '@radix-ui/react-dialog'

function EnrollDialog({ title, onConfirm }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="btn">
        Enroll
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="dialog">
          <Dialog.Title>
            Enroll in {title}?
          </Dialog.Title>
          <Dialog.Description>
            The first lesson starts right away.
          </Dialog.Description>
          <div className="row">
            <Dialog.Close
              className="btn"
              onClick={onConfirm}
            >
              Yes, enroll
            </Dialog.Close>
            <Dialog.Close className="ghost">
              Cancel
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default EnrollDialog
```

The pieces are little components: `Dialog.Root` wraps it all, `Dialog.Trigger` opens it, `Dialog.Overlay` dims the page, `Dialog.Content` is the box, then `Dialog.Title`, `Dialog.Description` and two `Dialog.Close` buttons. Every piece takes a `className`, so the looks are your own CSS. The library handles the hard part: the keyboard stays inside the open dialog, so Tab can no longer reach the buttons behind the dim layer.

### 5. shadcn/ui (the `shadcn/` project)

shadcn/ui gives you both the behaviour (from Radix) and ready-made looks (Tailwind). You do not install it like a normal package: a command copies the component files into your own project, so they are yours to edit. In a project that already has Vite and Tailwind 4:

```bash
cd shadcn
npm install
npx shadcn@latest init -t vite -b radix -d -y
npx shadcn@latest add dialog -y
```

The real output of the two commands:

```text
$ npx shadcn@latest init -t vite -b radix -d -y
[ok] Preflight checks.
[ok] Verifying framework. Found Vite.
[ok] Validating Tailwind CSS. Found v4.
[ok] Validating import alias.
[ok] Writing components.json.
[ok] Checking registry.
[ok] Installing dependencies.
[ok] Created 2 files:
  - src/components/ui/button.jsx
  - src/lib/utils.js
[ok] Updating src/index.css
Project initialization completed.
You may now add components.

$ npx shadcn@latest add dialog -y
[ok] Checking registry.
[ok] Updating files.
[ok] Created 1 file:
  - src/components/ui/dialog.jsx
[info] Skipped 1 file: (files might be identical, use --overwrite to overwrite)
  - src/components/ui/button.jsx
```

The folder already contains the result of these commands, so you can simply run `npm install && npm run dev` inside `shadcn/`. (There is no `package-lock.json` in `shadcn/` because the real one is over 200 KB; `npm install` resolves the version ranges in `package.json`, and a real build of this folder succeeded with them.) `dialog.jsx` is plain JSX (shadcn supports TypeScript too): an import from Radix, the `cn` helper that joins class names, and every piece as a small component. `versions/v7-shadcn-App.jsx` is the `App.jsx` that uses it. (The `init` and `add` commands download from the shadcn registry, so they need the internet; running them again is not required.)

### 6. Basic two: labels (`v3a-nolabel`, `v3b-label`)

A sign-up page with the words "Email address" in a paragraph above a box looks fine. Click the words: nothing happens, and the tree lists the box as `textbox` with no name, so a screen reader says only "edit text". The fix is a `label` with `htmlFor` pointing at the `id` of the input (Module 3). Click the words again and the focus jumps into the box, and the tree says `textbox "Email address"`. A label names the box for a screen reader and makes the words a bigger click target. A placeholder is not a label: it disappears as soon as you type.

### 7. Basic three: images (`v4a-noalt`, `v4b-alt`, `v4c-decor`)

Course thumbnails with no `alt` are listed as `image` with no name. Add `alt`: the tree says `image "React for Beginners course thumbnail"`. Write what the picture tells a person who cannot see it. If the picture is only decoration and the words are right beside it, write an empty `alt=""` (`v4c-decor`) so the screen reader skips it.

### 8. Basic four: contrast (`v5a-lowcontrast`, `v5b-contrast`)

The line "20 lessons by Meera" in light grey on white looks elegant indoors and disappears on a phone in the sun. Contrast is a ratio between the lightness of text and background. White on white is 1 to 1; the rule of thumb is at least 4.5 to 1. The real ratios:

```text
#b0b0b0 on #ffffff  2.17 to 1  (too low)
#767676 on #ffffff  4.54 to 1  (just enough)
#595959 on #ffffff  7.00 to 1  (the fix in the video)
```

### 9. Let a tool check (`v6a-audit-bad`, `v6b-audit-good`)

axe-core (4.14.0) runs inside the page and lists problems. It is installed locally with `npm install axe-core`. Run on the bad page it found four problems, and on the fixed page none (real results):

```text
v6a-audit-bad:   button-name (1), color-contrast (1), image-alt (1), label (1)
v6b-audit-good:  no violations
```

The color-contrast message even prints our number: `Element has insufficient color contrast of 2.16 (foreground color: #b0b0b0, background color: #ffffff ...). Expected contrast ratio of 4.5:1`. Automatic tools find only part of the problems, so still try the keyboard yourself.

### 10. Do not remove the focus ring (`v8-noring`)

`v8-noring` hides the ring with CSS (`outline: none`). The page looks cleaner and keyboard users are lost. Never remove a focus style without putting another one in its place.

## Common mistakes

- A `div` or `span` with `onClick` instead of a `button`.
- A homemade dialog: the keyboard escapes behind it. Use Radix or shadcn.
- Words above an input instead of a `label`; a placeholder as the only label.
- Images with no `alt` (or a long `alt` on a decorative image).
- Light grey text on white. Check the ratio.
- `outline: none` with no replacement.

## Try it yourself

Take the Enroll page and press Tab through it with the mouse unplugged (do not touch the mouse). Fix the first thing you cannot reach. Then run axe on your own page and fix one violation.

## Clean up

```bash
rm -rf node_modules dist shadcn/node_modules shadcn/dist
```

Press `Ctrl+C` to stop the dev server.

## Next

Module 7 starts with [M07-L01 · useEffect: Syncing with the Outside World](../../m07-effects-and-hooks/m07-l01-useeffect-syncing-with-the-outside-world/).
