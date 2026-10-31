# M13-L01 · Login Flows: Sessions vs JWT

> Video: Module 13, Lesson 1. Watch it first, then follow along here.

Lukas signs in on the allcsvideos page, then reloads, and he is a stranger again. The page forgot him, because a reload throws every variable away. After the server says "yes", who remembers it, and where? In this lesson you run both big answers for real (a session and a JWT), decide where the browser keeps them, and handle expiry, logout, and three common mistakes.

## What you'll learn

- A session is a cloakroom ticket (the server keeps a notebook); a JWT is a wristband with a stamp (no notebook)
- What a cookie is and what `HttpOnly` and `SameSite=Lax` do
- How to read a JWT, and why the signature stops Lukas from becoming an admin
- Memory, `localStorage` and an `HttpOnly` cookie: what a script on the page can steal from each
- The popular mix: a short access token in memory, a refresh token in an `HttpOnly` cookie, and one `api()` function that refreshes once on a 401
- Logout, and three mistakes: a different origin, `credentials: 'include'` with a wildcard, and refreshing twice

## Before you start

- Node 24 (`node --version`; recorded with v24.16.0).
- You know `fetch` and `useEffect` from earlier modules. The server side of login is in the Python course (Module 17, lesson 2).
- Docker is not used.
- All accounts here are made-up demo values: `lukas@example.com` and `meera@example.com` with the password `pass1234`, and a server secret that says `practice-secret-do-not-reuse`. Never use real accounts or secrets.

## Files in this folder

| File | What it is |
|---|---|
| `package.json` | Pinned: React 19.3.1, Vite 8.3.5, TypeScript 7.0.2 |
| `src/auth.ts` | The finished token flow: access token in memory, refresh, `api()` with one shared refresh |
| `src/http.ts` | `post()` helper for the login request |
| `src/who.ts` | Two tiny functions for the cross-origin demo (mistake 1) |
| `src/App.tsx`, `src/main.tsx`, `src/index.css` | The sign-in page |
| `api/server.mjs` | Practice API on port 8131 with both flows. Local only, demo accounts |
| `api/mode.txt` | CORS mode: `same` (no CORS), `cors` (allow `http://localhost:5231` with credentials), `wild` (`Access-Control-Allow-Origin: *`) |
| `cli/` | Small Node scripts that call the API: `login.mjs`, `peek.mjs`, `check.mjs`, `tools.mjs`, `logout.mjs`, and `lukas.json` |
| `e2e/cors.mjs`, `e2e/race.mjs` | Optional browser scripts for the two cross-origin and race demos |
| `versions/` | Five versions of `auth.ts`: `session`, `memory`, `local`, `naive` and `final` (the same as `src/auth.ts`) |

The practice API has two sets of routes:

| Flow | Routes |
|---|---|
| Session | `POST /api/session/login`, `GET /api/session/me`, `GET /api/session/my-courses`, `POST /api/session/logout` |
| Token | `POST /api/login`, `GET /api/me`, `GET /api/my-courses` (Bearer token), `POST /api/refresh`, `POST /api/logout` |

The access token lives only 10 seconds here (so you can watch it expire). A real server uses about 15 minutes, and a refresh token about 7 days.

To try a version, copy it over `src/auth.ts`: `cp versions/memory/auth.ts src/auth.ts`. Put `versions/final` back at the end.

## Follow along

### 1. Install and start

```bash
npm install
node api/server.mjs
```

```text
practice A P I on http://localhost:8131
```

In a second terminal (for the page):

```bash
npm run dev
```

```text
  VITE v8.3.5  ready in ... ms

  ➜  Local:   http://localhost:5231/
```

### 2. The session flow, with curl

`cli/lukas.json` holds the demo email and password. The `-i` flag shows the headers, and `-c jar` saves the cookie to a file:

```bash
curl -si -c jar -d @cli/lukas.json localhost:8131/api/session/login
```

```text
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: sid=16dc4c46cc23c2996c91214ec8ea7e24; Path=/; HttpOnly; SameSite=Lax
...

{"name":"Lukas","role":"student"}
```

(Your `sid` will differ.) The one header that matters is `Set-Cookie`: a cookie called `sid`, a long random ticket number, with two flags. `HttpOnly`: the page's own code may not read it. `SameSite=Lax`: the browser will not attach it when another website sends the request.

Now the browser's job: send the cookie back (`-b jar`) and ask who am I. Without the cookie the answer is 401:

```bash
curl -s -b jar localhost:8131/api/session/me
curl -si localhost:8131/api/session/me
```

```text
{"name":"Lukas","role":"student"}
HTTP/1.1 401 Unauthorized
...
{"detail":"not logged in"}
```

The session version of the page code (`versions/session/auth.ts`) sends the email and password and stores nothing:

```ts
export async function login(creds: Creds) {
  const res = await post('/api/session/login', creds)
  if (!res.ok) throw new Error('Sign in failed')
}

export async function whoAmI() {
  const res = await fetch('/api/session/me')
  return res.ok ? await res.json() : null
}
```

Guess: Lukas signs in with this version and reloads. Still signed in. When the page starts it asks the server who am I; the browser sent the cookie; the server found the ticket. The ticket lives in the browser, not in a variable. Remember the question "who am I on start": every login page needs it.

### 3. The token flow, and what is inside a JWT

```bash
curl -s -d @cli/lukas.json localhost:8131/api/login | cut -c1-60
```

```text
{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWI
```

The whole token is three pieces joined by dots: header, payload, signature. `cli/peek.mjs` logs in, splits at the dots and reads each piece with base64:

```bash
node cli/peek.mjs
```

```text
{ alg: 'HS256', typ: 'JWT' }
{
  sub: '1',
  name: 'Lukas',
  role: 'student',
  iat: 1793436580,
  exp: 1793436590
}
signature: 43 characters
```

(`iat` and `exp` are Unix seconds and will differ; `exp` is 10 seconds after `iat`.) Everything is readable by anyone. Base64 is not a lock, only a way to write bytes as text. So never put anything secret inside a token.

What stops Lukas from changing `student` to `admin`? The signature, made from the header, the payload and a secret key only the server has. `cli/check.mjs` asks who am I three times: with the real token, with a forged one (payload edited to `admin`, `cli/tools.mjs`), and 11 seconds later with the real token:

```bash
node cli/check.mjs
```

```text
200 {"name":"Lukas","role":"student"}
401 {"detail":"invalid token"}
401 {"detail":"token expired"}
```

### 4. Where do we keep the token? Three tests

For each version, open http://localhost:5231/, press Sign in (the form is pre-filled with the demo values), reload, and play the villain: a script running inside your page. In the browser console:

```js
[localStorage.getItem('token'), document.cookie, window.accessToken]
```

**Memory** (`cp versions/memory/auth.ts src/auth.ts`): `let accessToken = ''`.

```text
[null, '', undefined]
```

Nothing to steal. But after a reload Lukas is a stranger: the sign-in form is back. That is the price.

**localStorage** (`versions/local/auth.ts`): one line changed, `localStorage.setItem('token', accessToken)`. After a reload Lukas stays signed in, but the villain prints the token:

```text
['eyJhbGciOiJIUzI1NiIsInR5cCI6Ik...', '', undefined]
```

Any script on the page can steal it and use it from anywhere until it expires. That attack is cross-site scripting (XSS), and lesson 3 of this module is about it.

**The cookie** (`versions/session/auth.ts`): after a reload Lukas stays signed in, and the villain finds:

```text
[null, '', undefined]
```

`HttpOnly` hides the cookie from every script, but the browser still sends it. The price: because the browser sends it by itself, another website could make it send it. That is cross-site request forgery (CSRF); `SameSite=Lax` is the first defence. Also lesson 3.

Scoreboard:

| Place | Survives a reload | A script on the page can read it | Needs |
|---|---|---|---|
| Memory | no | hard to reach | a way to get a new token on reload |
| localStorage | yes | yes | nothing, but unsafe |
| HttpOnly cookie | yes | no | a CSRF defence |

### 5. The popular mix: access token in memory, refresh token in a cookie

The short access token stays in a variable. A long-lived refresh token stays in an `HttpOnly` cookie, scoped to `Path=/api`. On every reload the page asks `POST /api/refresh` and the cookie goes along by itself; the server answers with a new access token. `versions/final/auth.ts` (also `src/auth.ts`) has the heart of it:

```ts
let accessToken = ''
let pending: Promise<boolean> | null = null

async function askForNewToken() {
  const res = await fetch('/api/refresh', { method: 'POST' })
  if (!res.ok) return false
  accessToken = (await res.json()).accessToken
  return true
}

export function refresh() {
  pending ??= askForNewToken().finally(() => { pending = null })
  return pending
}

export async function api(path: string) {
  const send = () => fetch(path, { headers: { Authorization: `Bearer ${accessToken}` } })
  let res = await send()
  if (res.status === 401 && (await refresh())) res = await send()
  return res
}

export async function whoAmI() {
  if (!accessToken && !(await refresh())) return null
  const res = await api('/api/me')
  return res.ok ? await res.json() : null
}
```

One function, `api()`, carries every request. On a 401 it refreshes once and sends the same request again. `whoAmI` refreshes first if memory is empty (after a reload).

Guess: Lukas signs in, waits 11 seconds so the token has expired, and presses Load my courses. Which requests go over the network? Real result (open the browser's Network tab, or look at the API):

```text
GET /api/my-courses 401
POST /api/refresh 200
GET /api/my-courses 200
```

The three courses appear and Lukas saw nothing but a normal page. After a reload the page starts with empty memory, calls refresh, and Lukas is still signed in:

```text
POST /api/refresh 200
GET /api/me 200
```

(In development, React StrictMode runs the start effect twice, so you may see a second `GET /api/me`.)

### 6. Logout

For a session it is easy: the server tears the page out of its notebook. Keep a copy of the old cookie first:

```bash
curl -s -c jar -d @cli/lukas.json localhost:8131/api/session/login > /dev/null
cp jar jar-old
curl -s -b jar -X POST localhost:8131/api/session/logout
curl -s -b jar-old localhost:8131/api/session/me
```

```text
{"ok":true}
{"detail":"not logged in"}
```

For a token the wristband is already on the wrist. `cli/logout.mjs` logs out, then tries the old access token and the old refresh cookie:

```bash
node cli/logout.mjs
```

```text
/logout 200 {"ok":true}
/me 200 {"name":"Lukas","role":"student"}
/refresh 401 {"detail":"refresh token not valid"}
```

The old access token still works for the few seconds it has left, and the refresh is refused. After logout nobody can make new tokens and the old one dies by itself. That is why access tokens live for minutes, not days. A session can kick someone out right now; a token can only wait.

## Common mistakes

1. **The API lives at another origin and you forgot the credentials.** The page is on port 5231 and the API on 8131: a different port is a different origin. `src/who.ts` has `fetch(url)` and `fetch(url, { credentials: 'include' })`. With the API in `cors` mode (it names the exact origin and says `Access-Control-Allow-Credentials: true`):

   ```bash
   node e2e/cors.mjs
   ```

   ```text
   without credentials:     401 {"detail":"not logged in"}
   credentials: include:    200 {"name":"Lukas","role":"student"}
   ```

2. **`credentials: 'include'` and a server that answers `*`.** In `wild` mode the browser refuses, and the call fails with `TypeError: Failed to fetch`:

   ```text
   wildcard + include:      TypeError: Failed to fetch
   console error:           Access to fetch at 'http://localhost:8131/api/session/me' from origin 'http://localhost:5231' has been blocked by CORS policy: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.
   ```

   The server must name the exact origin and send `allow credentials: true`. If the server says nothing, you get the other message: no `Access-Control-Allow-Origin` header is present. (The script puts `api/mode.txt` back to `same`.)
3. **Refreshing twice.** Two parts of the page get a 401 at the same moment and each calls refresh, but the server accepts a refresh token only once. The practice API answers a refresh a little slowly to make the race easy to see. Use `versions/naive/auth.ts` (no sharing), then:

   ```bash
   npm install --no-save playwright-core@1.63.0
   node e2e/race.mjs
   ```

   ```text
   {"error":"token expired","courses":3}
   GET /api/my-courses 401
   GET /api/my-courses 401
   POST /api/refresh 200
   POST /api/refresh 401
   GET /api/my-courses 200
   ```

   The second refresh is refused. The cure is the `pending` variable: the first caller starts the refresh and stores the promise, the second finds it and waits for the same answer. With `versions/final/auth.ts`:

   ```text
   {"error":"","courses":3}
   GET /api/my-courses 401
   GET /api/my-courses 401
   POST /api/refresh 200
   GET /api/my-courses 200
   GET /api/my-courses 200
   ```

   (The race script needs Google Chrome and waits 11 seconds.)

## Clean up

Press Ctrl+C in both terminals. Delete `jar` and `jar-old`. Check `api/mode.txt` says `same` and `src/auth.ts` is `versions/final`. Delete `node_modules` and `dist` if you like.

## Try it yourself

1. Sign in on any site you build, open the browser tools, and in the Application tab find the cookie and its `HttpOnly` tick.
2. Copy the middle piece of a token and decode it with `atob` (note: base64url uses `-` and `_`; replace them with `+` and `/` first).
3. Delete the refresh cookie on purpose and watch the page sign out.

Interview tip. "Where would you store a JWT in a single-page app?" Not in `localStorage`, because any script on the page can read it. Keep the short access token in memory and the refresh token in an `HttpOnly`, `SameSite` cookie with a CSRF defence. On reload, the page uses the refresh cookie to get a new access token.

## Next

[M13-L02 · Protected Routes and Roles](../m13-l02-protected-routes-and-roles/README.md)
