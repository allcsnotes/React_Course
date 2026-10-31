# M19-L05 · Server Actions

> Video: Module 19, Lesson 5. Watch it first, then follow along here.

## What you'll learn

- A server action: an async function marked `'use server'` that a `<form>` calls with `action`
- What really travels: one POST to the page's own address, with an action ID, and no API route
- That the form works with JavaScript switched off (progressive enhancement)
- Why `revalidatePath` is needed, and what happens without it
- `useActionState` for validation errors and `useFormStatus` for the "Posting..." button
- That every server action is a public door into your server: check who is calling, check the data, return little
- Two mistakes: `useFormStatus` in the same component as the form, and a missing `'use server'`

## Before you start

- Node 24 (`node --version`) and Google Chrome for the browser checks. No Docker.
- Versions (from `package-lock.json`): Next.js 16.4.3 (Turbopack), React 19.3.0. Earlier: Lesson 3 (server and client components), Lesson 4 (caching), Module 14, Lesson 4 (`useActionState`).
- There is no database yet (Module 20): reviews live in a plain file, `data/reviews.json`. `data/seed-1.json` has one review, `data/seed-2.json` has two. The admin cookie value `asha-secret-7421` is a **demo value**; nothing here is a real login.
- This folder is the finished lesson (version `v3b`). The stages are in `variants/`; `set-version.sh` copies a stage in, resets the data, builds the site and starts it on port 5195.

## Files in this folder

| File | What it is |
|------|------------|
| `app/actions.ts` | `postReview` (validates, waits 1.2 s, saves, `revalidatePath('/')`) and `deleteReview` (checks `isAdmin()`) |
| `app/page.tsx` | A server component: the review form, the review list in `<Suspense>`, a Delete form per review |
| `components/ReviewForm.tsx`, `components/SubmitButton.tsx` | The client form with `useActionState`, and its button with `useFormStatus` |
| `lib/reviews.ts`, `lib/session.ts` | Read and write the JSON file; `isAdmin()` reads the cookie on the server |
| `data/seed-1.json`, `data/seed-2.json` | Starting data; `data/reviews.json` is the live copy |
| `variants/` | `v1`, `v1b`, `v2`, `v2b`, `v3a`, `v3b`, `m2` |
| `set-version.sh` | `./set-version.sh v1` (optionally with a seed file) |
| `attack.mjs` | A script with no browser and no cookie that calls the delete action |

## Follow along

```bash
npm install
./set-version.sh v1        # builds the first stage and starts it on http://localhost:5195
```

(Stop it any time with `kill $(cat start.pid)`.)

### 1. The whole function and the form

A server action is a function that lives in the kitchen (the server), and a form on the table that sends its slip to it. `variants/v1/app/actions.ts` is the first version; the first line `'use server'` marks functions that run on the server and that a form may call. As `"use client"` marks a file for the browser, `'use server'` marks server functions. The function receives `FormData` (Module 14, Lesson 4), reads the name and the text, saves them with `addReview` (a plain file; a real database comes in Module 20) and ends with `revalidatePath('/')`.

And the form, in the page (`variants/v1/app/page.tsx`): a `<form action={postReview}>` with two named boxes and a button. No `'use client'`, no state, no submit handler, no `fetch`:

```tsx
export default function Page() {
  return (
    <>
      <div className="top">allcs<span>videos</span></div>
      <main>
        <h1>React for Beginners</h1>
        <div className="grid">
          <form action={postReview} className="card">
            <h2>Write a review</h2>
            <label htmlFor="name">Your name</label>
            <input id="name" name="name" required />
            <label htmlFor="text">Your review</label>
            <textarea id="text" name="text" required />
            <button type="submit">Post review</button>
          </form>
          <Suspense fallback={<div className="card">Loading reviews…</div>}>
            <Reviews />
```

The folder of the project has no folder called `api`. In Module 11 a change like this needed an endpoint on the server, a mutation in the browser and state for the waiting and the errors.

```bash
npm ls next react react-dom --depth=0
```

```text
+-- next@16.4.3
+-- react-dom@19.3.0
`-- react@19.3.0
```

### 2. What really travels

Guess: Lukas presses Post review. Which request does the browser send, a GET to some API address or something else? And to which address? I recorded it with Playwright:

```text
before >> allcs | videos | React for Beginners | Write a review | Your name | Your review | Post review | Reviews (1) | Priya | Clear and slow. Props finally make sense.
after >> allcs | videos | React for Beginners | Write a review | Your name | Your review | Post review | Reviews (2) | Lukas | Great start for beginners. | Priya | Clear and slow. Props finally make sense.
POST >> http://localhost:5195/ next-action=4056d8d92754… content-type=multipart/form-data
body >> ------WebKitFormBoundaryQvkgPgKAu9cFtPu6 Content-Disposition: form-data; name="_1_$ACTION_ID_4056d8d927540d445b26135bf58f614728292acff7" ------WebKitFormBoundaryQvkgPgKAu9cFtPu6 Content-Disposition: form-data; name="_1_name" Lukas ------WebKitFormBoundaryQvkgPgKAu9cFtPu6 Content-Disposition: form-da
```

One request: a **POST to the page's own address**, `http://localhost:5195/`, with the multipart form as the body. One header is called `next-action`; its value is a long code, the ID of our function. Next.js made it when it built the site and wrote it into the page, as a hidden input in the form's HTML (`$ACTION_ID_...`). The body of the request is the form: the name and the text. A server action is not magic: it is a POST request, and Next.js writes both ends, the sender in the browser and the receiver on the server. In Lesson 3 a function could not travel from the server to the browser; a server action is the exception, because what travels is not the function, only its ID.

```bash
curl -s localhost:5195 | grep -o '<form[^>]*>'
```

```text
<form class="card" action="" encType="multipart/form-data" method="POST">
```

### 3. It works without JavaScript

It is a real HTML form, so it works even when the JS has not arrived. I switched JavaScript off in the test browser, typed a review and pressed the button: the page loaded again with the review in the list, at the same address (`Reviews (2) | Lukas | Great start for beginners. | Priya | ...`), and `data/reviews.json` holds Lukas's review. That is why the hidden input exists: a plain form post carries the ID in its body. A page that works first with nothing and gets better when JS arrives is called **progressive enhancement**; server actions give it to you for free.

### 4. `revalidatePath`

Now the line we skipped. `variants/v1b` has no `revalidatePath` (set it with `./set-version.sh v1b`). Lukas posts his review:

```text
before >> allcs | videos | React for Beginners | Write a review | Your name | Your review | Post review | Reviews (1) | Priya | Clear and slow. Props finally make sense.
after >> allcs | videos | React for Beginners | Write a review | Your name | Your review | Post review | Reviews (1) | Priya | Clear and slow. Props finally make sense.
after reload >> allcs | videos | React for Beginners | Write a review | Your name | Your review | Post review | Reviews (1) | Priya | Clear and slow. Props finally make sense.
```

The review is saved, but the list still says `Reviews (1)`. He reloads: still one review. In the built site Next.js made this page once and keeps that copy. Our action changed the data and nobody told Next.js the copy is old. `revalidatePath('/')` says exactly that: this address is out of date, make it again. With the line back (`v1`), the list shows two reviews right after the click: the server sends the new page in the same answer as the result, so there is no second fetch. Lesson 4 explains when Next.js keeps an answer and when it does not.

### 5. Waiting and complaining: `useActionState` and `useFormStatus`

Two things are missing. If the server is slow nothing tells Lukas that his click worked, and if he writes only two words the server must say no. `./set-version.sh v2` has the form as a client component with `useActionState` (Module 14): the only new thing is that the action is imported from the server file.

```tsx
'use client'

import { useActionState } from 'react'
import { postReview } from '@/app/actions'
import { SubmitButton } from './SubmitButton'

export function ReviewForm() {
  const [state, formAction] = useActionState(postReview, {})
  return (
    <form action={formAction} className="card">
      <h2>Write a review</h2>
      <label htmlFor="name">Your name</label>
      <input id="name" name="name" defaultValue={state.name} />
      <label htmlFor="text">Your review</label>
      <textarea id="text" name="text" defaultValue={state.text} />
      <SubmitButton />
      {state.error && <p className="err">{state.error}</p>}
      {state.ok && <p className="ok">{state.ok}</p>}
    </form>
  )
}
```

The button is its own small component. It calls `useFormStatus` (from `react-dom`), which tells it whether the form around it is sending. While `pending` is true the button is grey and says "Posting…". It needs no props:

```tsx
'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Posting…' : 'Post review'}
    </button>
  )
}
```

The action takes the previous state first. It checks the name and that the text has at least 10 characters; if not it returns an error with the typed values so the boxes do not empty. Then a pause of 1.2 seconds (added to make the wait visible), then save, revalidate and thank you:

```ts
'use server'

import { revalidatePath } from 'next/cache'
import { addReview, removeReview } from '@/lib/reviews'
import { isAdmin } from '@/lib/session'

export type FormState = {
  error?: string
  ok?: string
  name?: string
  text?: string
}

export async function postReview(
  prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = String(formData.get('name') ?? '').trim()
  const text = String(formData.get('text') ?? '').trim()
  if (!name) {
    return { error: 'Please write your name.', name, text }
  }
  if (text.length < 10) {
    return { error: 'Write at least 10 characters.', name, text }
  }
  await new Promise(r => setTimeout(r, 1200))
  await addReview(name, text)
  revalidatePath('/')
  return { ok: 'Thank you, ' + name + '!' }
}
```

Guess: Lukas writes "Too short" and presses the button. What does the page say? Then he writes a good review. What does the button show half a second after the click? Real run (`./set-version.sh v2`):

```text
too short >> allcs | videos | React for Beginners | Write a review | Your name | Your review | Post review | Write at least 10 characters. | Reviews (1) | Priya | Clear and slow. Props finally make sense.
button at 0.5 s >> "Posting…" disabled=true
after >> allcs | videos | React for Beginners | Write a review | Your name | Your review | Post review | Thank you, Lukas! | Reviews (2) | Lukas | Great start for beginners. | Priya | Clear and slow. Props finally make sense.
```

The error appears in red under the button and the name stays; half a second after the second click the button is grey and says "Posting…" (`disabled=true`); after another second and a half: "Thank you, Lukas!" and the list has two reviews.

### 6. The door

A server action is a door into our server, and Next.js built that door for us. A door a browser can open, a script can open too. You know the sentence from Module 13, Lesson 2: the UI is not security, the server checks every request. Here it is in practice.

Asha adds a Delete button for the admin only. The page reads a cookie (`lib/session.ts`): for Asha it is a red, working button; for everybody else it is grey and disabled. `./set-version.sh v3a data/seed-2.json`, then the page as Lukas and as Asha (the cookie `admin=asha-secret-7421`):

```text
page >> allcs | videos | React for Beginners | Write a review | Your name | Your review | Post review | Reviews (2) | Priya | Clear and slow. Props finally make sense. | Delete | Lukas | Great start for beginners. | Delete
delete buttons >> ["Post review","Delete (disabled)","Delete (disabled)"]
```

```text
page >> allcs | videos | React for Beginners | Write a review | Your name | Your review | Post review | Reviews (2) | Priya | Clear and slow. Props finally make sense. | Delete | Lukas | Great start for beginners. | Delete
delete buttons >> ["Post review","Delete","Delete"]
```

The action behind the button (`v3a`) is short: it takes the review number from the form, removes the review and revalidates. Look for a line that asks who is calling. There is none. The grey button is still a form with an ID in the page, for everybody. `attack.mjs` is a script with no browser and no cookie: it downloads the page, finds the ID and sends what the form would send, the ID and the review number `r1`:

```js
const SITE = 'http://localhost:5195/'
const html = await (await fetch(SITE)).text()
const id = html.match(/ACTION_ID_(\w+)/)[1]
const form = new FormData()
form.set('$ACTION_ID_' + id, '')
form.set('id', 'r1')
const res = await fetch(SITE, { method: 'POST', body: form })
console.log('action', id.slice(0, 8) + '…', '→ status', res.status)
```

Guess: what status will the server answer, and is Priya's review still there?

```bash
node attack.mjs
```

```text
action 40c7543b… → status 200
```

Status 200, and Priya's review is gone from `data/reviews.json` (only `r2`, Lukas, is left). A script without any login deleted a review. The grey button was only a picture.

The cure is the check that guards the admin page, **inside the action** (`v3b`, the version in `app/actions.ts`): read the cookie on the server and say no.

```ts
export async function deleteReview(formData: FormData) {
  if (!(await isAdmin())) throw new Error('Forbidden')
  await removeReview(String(formData.get('id')))
  revalidatePath('/')
}
```

Run the script again on the fixed site (`./set-version.sh v3b data/seed-2.json`, then `node attack.mjs`):

```text
action 4053a7e5… → status 500
```

Status 500, and both reviews are still in the file. The server log shows a warning, `Missing origin header from a forwarded Server Actions request` (the header where a browser says which site it comes from; it did not stop the script), and then the real answer, `Error: Forbidden`. Asha's own browser still deletes, because her cookie passes the check: with the admin cookie, pressing Delete leaves `Reviews (1) | Lukas | Great start for beginners.`

Three rules for every server action:

1. Check who is calling, **inside the action**.
2. Check the data. `required` in the form is only a request to the browser and a script skips it; that is why our action checked the name and the length itself.
3. Return only what the page needs.

The Next.js docs say it directly: treat every action as an untrusted entry point.

## Common mistakes

### 1. `useFormStatus` in the same component as the form

`./set-version.sh v2b` calls the hook in the form component itself. Lukas presses the button; half a second later it still says "Post review" and is not grey (real run: `button at 0.5 s >> "Post review" disabled=false`). The hook asks for the form *around* the component, and there is none: this component is the form. It must live in a child, like our submit button.

### 2. Forgetting `'use server'`

`./set-version.sh m2` builds the site with an actions file without the line. The function is a plain function, and the page, a server component, hands it to the form. The build fails and the message says it plainly:

```text
Error occurred prerendering page "/". Read more: https://nextjs.org/docs/messages/prerender-error
Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server". Or maybe you meant to call this function rather than return it.
  {action: function i, className: "card", children: ...}
           ^^^^^^^^^^
```

Add the line `'use server'` at the top of the file.

## Clean up

`kill $(cat start.pid)` stops the site. `cp data/seed-2.json data/reviews.json` restores the data and `./set-version.sh v3b data/seed-2.json` restores the finished version (then stop it again). Delete `.next/` and `node_modules/`.

## Key points

- A server action is an async function marked `'use server'`. A form calls it with `action`, and it receives `FormData`. It runs on the server, where the secrets and the data stay.
- It is a real POST request with an ID, to the page's own address, and it works without JS. `revalidatePath` tells Next.js which page is old, so the answer carries the new page. `useActionState` and `useFormStatus` give the error and the waiting.
- Every action is a public endpoint. Check who is calling, check the data, return little. Hiding a button is not security.

Interview tip. If Rahul, the interviewer, asks "are server actions safe?": they are public POST endpoints, with an ID that anyone can read, so every action must check authentication, authorization and its input, like an API route.

## Try it yourself

Add a Report button to every review, with its own server action. Then call that action from a script, without the page, and see what happens.

## Next

[M19-L06 · Route Handlers, Middleware and SEO](../m19-l06-route-handlers-middleware-and-seo/README.md)
