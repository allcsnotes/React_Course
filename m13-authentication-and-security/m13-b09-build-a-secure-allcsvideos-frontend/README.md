# M13-B09 · Build a Secure allcsvideos Frontend

> Video: Module 13, Build 9. Watch it first, then follow along here.

Today you build the secure version of the allcsvideos site: sign up, log in, three roles (student, instructor, admin), and a token that renews itself. It puts the three lessons of this module into one app: the login flow from lesson 1, the roles from lesson 2, the safety checks from lesson 3, and one promise: the refresh. Everything runs against a practice API on your laptop with made-up accounts.

## What you'll learn

- Where each piece of state lives: access token in a variable in memory, refresh token in an `HttpOnly` cookie, the signed-in user in context, courses in the TanStack Query cache, the open page in the address
- One request helper that adds the token, validates answers with Zod, refreshes once on a 401 and retries
- Sign up and log in with field messages from the server, and a safe `next` redirect (no open redirect)
- Guards that wait until they know who is signed in, plus the same role table for links and routes
- One shared refresh with a pending promise, also under React Strict Mode
- A real browser test of the whole flow, and five things that break in production

## Before you start

- Node 24 (`node --version`; recorded with v24.16.0).
- You did [M13-L01](../m13-l01-login-flows-sessions-vs-jwt/README.md), [M13-L02](../m13-l02-protected-routes-and-roles/README.md), [M13-L03](../m13-l03-frontend-security/README.md), and Modules 10 and 11 (context, TanStack Query).
- Google Chrome only for the optional browser test in step 5. Docker is not used.
- The demo accounts are made-up values, listed once here: `lukas@example.com` / `learn-fast-42` (student), `meera@example.com` / `teach-well-77` (instructor), `asha@example.com` / `admin-only-99` (admin). Never reuse them anywhere real.

## Files in this folder

| File | What it is |
|---|---|
| `package.json` | Pinned: react-router 8.5.1, @tanstack/react-query 5.105.0, zod 4.6.7, React 19.3.1, Vite 8.3.5, TypeScript 7.0.2 |
| `src/schema.ts` | Zod schemas: `User` (with `Role` union), `Session`, `Course`, lists |
| `src/tokens.ts` | The whole token store: one variable, `getToken`, `setToken` |
| `src/api.ts` | `request` helper, `ApiError`, `login`, `signup`, `refresh` (with `pending`), `logout`, and the data calls |
| `src/AuthContext.tsx` | `AuthProvider` and `useAuth`: `user`, `checking`, `logIn`, `signUp`, `logOut` |
| `src/roles.ts`, `src/RequireRole.tsx` | The role table, `can()`, and the guard |
| `src/router.tsx`, `src/RootLayout.tsx` | Routes behind guards, and the header |
| `src/LoginPage.tsx`, `src/SignupPage.tsx` | The forms |
| `src/Dashboard.tsx`, `src/InstructorPage.tsx`, `src/AdminPage.tsx` | My courses, Studio, Admin |
| `src/main.tsx`, `src/index.css` | Query client, providers, styles |
| `api/server.mjs` | Practice API on port 8139, all local. Passwords hashed with scrypt, refresh tokens rotated |
| `api/access-seconds.txt` | Access token life in seconds (8 here; real servers use about 15 minutes) |
| `api/refresh-delay.txt` | Extra delay for `/api/auth/refresh` in milliseconds (0; set 300 to see the race in mistake 2) |
| `e2e/check.mjs` | The real browser test (optional) |
| `versions/` | The `src/` files at the end of each step: `s1` to `s4` (`s4` is the same as `src/`), and the mistakes `s2a` and `s4x` |

The practice API:

| Request | What it does |
|---|---|
| `POST /api/auth/signup` | `{name, email, password}`, 201 with `{accessToken, user}` and the refresh cookie. The role is always `student` |
| `POST /api/auth/login` | `{email, password}`, 200 with the same |
| `POST /api/auth/refresh` | Cookie only. 200 with a new access token and a NEW refresh cookie (rotation). A used refresh token ends all sessions of that user |
| `POST /api/auth/logout` | 204, cookie cleared |
| `GET /api/me/courses` | Any signed-in user |
| `GET`, `POST /api/instructor/courses` | Instructor or admin |
| `GET /api/admin/users`, `PATCH /api/admin/users/:id` | Admin only |
| `POST /api/reset` | Back to the starting data (for tests) |

## Run it

```bash
npm install
node api/server.mjs
```

```text
Practice API on http://localhost:8139 (access token lives 8 s)
```

The API prints one line per request, with the status. Keep that terminal visible. In a second terminal:

```bash
npm run dev
```

```text
  VITE v8.3.5  ready in ... ms

  ➜  Local:   http://localhost:5739/
```

Open http://localhost:5739/ . The dev server forwards `/api` to the practice API, so page and API share an address and the cookie just works.

To see a step, replace the code files in `src/` (keep `index.css`):

```bash
find src -type f \( -name '*.ts' -o -name '*.tsx' \) -delete && cp versions/s1/* src/
```

Put `versions/s4` back at the end. To try an overlay like `s4x`, copy it on top of `s4`: `cp versions/s4x/* src/`.

## Build it step by step

| Step | Folder | What it adds |
|---|---|---|
| 1 | `versions/s1` | Schema, token variable, request helper, a tiny dashboard |
| 2 | `versions/s2` | Sign up, log in, auth context, one shared refresh |
| 3 | `versions/s3` | Roles, the guard, the pages |
| 4 | `versions/s4` | The automatic refresh inside the helper |

### Step 1. Schema, token store, request helper

Setup: a Vite React TypeScript project with the same short package list as the last builds (the folder already has it). Real install output:

```text
added 32 packages, and audited 33 packages in 3s
found 0 vulnerabilities
```

`schema.ts` (from Module 9, lesson 4): a user has an id, a name, an email and a role; the role is a union written in Zod as a list of the allowed words (`student`, `instructor`, `admin`). A session is the access token plus the user.

`tokens.ts` is the whole token store, one variable and two small functions. It lives in memory, so a reload empties it and nothing in the page's storage ever holds it:

```ts
let accessToken: string | null = null
export const getToken = () => accessToken
export const setToken = (token: string | null) => { accessToken = token }
```

`api.ts` has the request helper: it adds the `Authorization` header when there is a token and the content type when there is a body, throws our own `ApiError` (with the server's message, status code and field messages) when the answer is not ok, and otherwise lets Zod check the data.

Use `versions/s1`: a tiny dashboard asks for my courses, and the header says `Not signed in`. Real run: a red `Not signed in`, and one line in the API terminal:

```text
GET   /api/me/courses          401  no token
```

Before one line of login code, the data was already locked.

### Step 2. Sign up, log in, and the auth context

Here is the real answer to a login with curl. Status 200 and a `Set-Cookie` header with `HttpOnly` and `SameSite=Strict`:

```bash
curl -si -X POST localhost:8139/api/auth/login -H 'content-type: application/json' \
  -d '{"email":"lukas@example.com","password":"learn-fast-42"}'
```

```text
HTTP/1.1 200 OK
set-cookie: refresh=aab5c71e5faa0aceac021f07d7e8cef4ca0ff83077dbb28c; HttpOnly; SameSite=Strict; Path=/api/auth; Max-Age=604800
...
{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJz...","user":{"id":1,"name":"Lukas","email":"lukas@example.com","role":"student"}}
```

(The token and cookie values differ every time.) The access token lives only 8 seconds here. The refresh token never appears in the body: it travels only in that cookie, and the server accepts each refresh token once, then hands out a new one. That is called rotation.

In `api.ts`, `startSession` stores the access token and gives back the user; `login` and `signup` are one line each. The auth context (`AuthContext.tsx`, from Module 10, lesson 2) keeps `user` and `checking` (true while we find out whether someone is already signed in). Log out does three things, in order: tell the server (so it cancels the refresh token), clear the whole TanStack Query cache (so the next person on this computer never sees these courses), and set the user to `null`.

The login page is a form from Module 5. The server says the same thing for a wrong email and a wrong password (`Wrong email or password`), so a stranger cannot learn which emails have accounts. After login the visitor goes to the `next` query value, but only when it starts with one slash and not two:

```tsx
const asked = useSearchParams()[0].get('next') ?? '/'
const next = asked.startsWith('/') && !asked.startsWith('//') ? asked : '/'
```

Otherwise `next=//evil.example` could send a freshly logged-in person to another website (an open redirect).

Use `versions/s2a` first (the version without the shared refresh). Sign in as Lukas and look at the cookie. The server set it with `HttpOnly`, `SameSite=Strict` and path `/api/auth`, but inside the page `document.cookie` is an empty string. In the browser console:

```js
document.cookie
```

```text
''
```

When the page loads, the context asks the server's refresh address with no body, just the cookie, to find out whether someone is already signed in. Guess: Lukas logs in and presses reload. Is he still signed in? Real run: signed out! The page shows `Log in` and a red `Not signed in`. The API terminal shows two refreshes in the same instant:

```text
GET   /api/me/courses          401  no token
POST  /api/auth/refresh        200
POST  /api/auth/refresh        401  REUSED refresh token: all sessions of this user ended
```

Why twice? React Strict Mode (Module 7, lesson 2) runs every effect twice in development. Both refreshes carry the same cookie. The first wins and gets a new cookie; the second still carries the old one, and the server treats a used token as a stolen one and ends the session. It is the same race as in lesson 1, with a different cause.

The cure is the pending promise from lesson 1 (`versions/s2`):

```ts
let pending: Promise<User> | null = null

export function refresh() {
  pending ??= startSession(
    request('/api/auth/refresh', SessionSchema, { method: 'POST' }),
  ).finally(() => {
    pending = null
  })
  return pending
}
```

Reload again: one refresh in the log, and Lukas stays signed in. But look at the page: the header says `Lukas · student` and the body says `Not signed in`. The page asked for courses before the refresh finished, and the failure was kept:

```text
POST  /api/auth/refresh        200
GET   /api/me/courses          401  no token
```

Step 3 fixes that.

The sign-up page has the same shape with a name field and a message under each box (the server sends them in a `fields` object). Real run: a name of `P`, an email of `priya-at-example` and a short password give three messages, then a new account works. The same email again shows `That email already has an account`. A bigger form would use React Hook Form (Module 12); plain state keeps our eyes on the login.

### Step 3. Roles and guards

Most of this is lesson 2. One table says which role may open which page (`roles.ts`: `mine` for all three, `studio` for instructor and admin, `admin` for admin), and `can()` reads it. The guard is the layout route from lesson 2 with one new line at the top:

```tsx
if (checking) return <p className="note">Checking your session...</p>
if (!user) return <Navigate to={`/login?next=${next}`} replace />
if (!roles.includes(user.role)) {
  return <p className="bad">403: not for your role ({user.role})</p>
}
return <Outlet />
```

`checking` is the fix for the stale error: nobody is sent to login before we know who they are. `router.tsx` puts each group of pages behind a guard, and the header draws each link with the same table, so links and guards always agree.

Use `versions/s3`. Real runs:

- Lukas has no Studio link. If he types `/studio`, the page says `403: not for your role (student)`.
- A reload on My courses shows `Checking your session...` and then the courses. The stale error is gone.
- Meera sees Studio and creates `Docker Basics` (a normal query and a mutation, like Module 11). Asha sees Admin and the list of users, where she can change a role.

But remember lesson 2: the page is not the lock. Go straight to the API with Lukas's token (`node` and `fetch`, or curl) and ignore every button:

```bash
TOKEN=$(curl -s -X POST localhost:8139/api/auth/login -H 'content-type: application/json' \
  -d '{"email":"lukas@example.com","password":"learn-fast-42"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).accessToken')
curl -s -w ' -> %{http_code}\n' localhost:8139/api/admin/users -H "authorization: Bearer $TOKEN"
curl -s -w ' -> %{http_code}\n' localhost:8139/api/admin/users
curl -s -X POST localhost:8139/api/auth/signup -H 'content-type: application/json' \
  -d '{"name":"Sneaky","email":"sneaky@example.com","password":"let-me-in-123","role":"admin"}' \
  | node -pe 'JSON.parse(require("fs").readFileSync(0)).user.role'
```

```text
{"error":"You are not allowed to do that"} -> 403
{"error":"Not signed in"} -> 401
student
```

A student gets 403, no token gets 401, and a sign-up that sends `role: admin` gets a user whose role is `student` (the server reads the role from its own table, never from the request). The browser test below checks this too.

### Step 4. The token that renews itself

The problem, first (`versions/s3` still has it): Meera logs in, waits 10 seconds, and clicks Studio. A red box: `Token expired`. The page asked with an old token, the server said 401, and we showed the error. The API terminal: `GET /api/instructor/courses 401 token expired`.

The fix goes into one place, the helper every request uses (`versions/s4`). `send` makes one request; if the answer is a 401 and the address is not an auth address, it waits for `refresh()` and sends the same request one more time:

```ts
const res = await call()
if (res.status !== 401 || url.startsWith('/api/auth/')) return res
try {
  await refresh()
} catch {
  onEnded()
  return res
}
return call()
```

Why skip the auth addresses? A wrong password is also a 401. Refreshing would not help and we could loop. If the refresh itself fails (the cookie is gone or used up), the session is really over: the helper calls `onEnded`, which the context registered in an effect: clear the cache and set the user to `null`. The guard sees no user and sends Meera to login.

Guess: Meera waits 10 seconds and clicks Studio. Which requests does the API log? Real run:

```text
GET   /api/instructor/courses  401  token expired
POST  /api/auth/refresh        200
GET   /api/instructor/courses  200
```

The page shows her courses. Three lines in a log, and no trace on the screen.

Two requests at once (every part of the page uses this helper, so it will happen). Let the token expire and ask twice at the same moment, from the browser console:

```js
const m = await import('/src/api.ts')
await Promise.allSettled([m.getMyCourses(), m.getMyCourses()])
```

```text
GET   /api/me/courses          401  token expired
GET   /api/me/courses          401  token expired
POST  /api/auth/refresh        200
GET   /api/me/courses          200
GET   /api/me/courses          200
```

Two 401 answers, then one single refresh, then two 200s. The pending promise made both wait for the same new token.

Last case: the session truly ends, like a cookie after seven days. Delete the cookie in the browser tools (Application tab), wait 10 seconds, click Studio:

```text
GET   /api/instructor/courses  401  token expired
POST  /api/auth/refresh        401  no cookie
```

The page sends Meera to `/login?next=/studio`. Nobody sees an error, only a login.

### Step 5. Test it like a user

A Playwright script drives the running app and prints one line per claim (the redirect, sign-up messages, role pages, the server's 403, log out, the open redirect, the refresh after 8 seconds, and an admin changing a role). It needs Google Chrome, the dev server and the API running, and one package that is not saved in `package.json`:

```bash
npm install --no-save playwright-core@1.63.0
node e2e/check.mjs
```

```text
PASS signed out: the dashboard sends me to /login
PASS sign-up: three field messages from the server
PASS sign-up: Priya lands on the dashboard as a student
PASS no Studio link for a student
PASS typing /studio as a student: "403: not for your role"
PASS the server itself says 403 to a student  {"error":"You are not allowed to do that"}
PASS sign-up with role "admin" in the body is ignored  role: student
PASS log out: back on /login, refresh cookie gone
PASS Back button after log out shows no courses
PASS ?next=//evil.example is ignored: we stay on our own site
PASS wrong password: "Wrong email or password"
PASS instructor Meera sees the Studio link
PASS reload: still signed in (silent refresh from the cookie)
PASS token expired, the page still works: 401 -> refresh 200 -> retry 200
    GET /api/instructor/courses 401
    POST /api/auth/refresh 200
    GET /api/instructor/courses 200
PASS instructor creates a course
PASS admin Asha makes Priya an instructor, the server agrees  role: instructor
all checks passed
```

The test resets the API first (`POST /api/reset`) and takes about 20 seconds.

### Step 6. The production build

```bash
npm run build
```

```text
✓ 244 modules transformed.
dist/index.html                   0.46 kB │ gzip:   0.29 kB
dist/assets/index-DBL7ewOB.css    2.03 kB │ gzip:   0.74 kB
dist/assets/index-CRvqdNIl.js   442.18 kB │ gzip: 135.16 kB
✓ built in 325ms
```

The type checker runs first, then the bundler. (Your hashes and sizes may differ a little.)

## Common mistakes

1. **No shared refresh under Strict Mode** (`versions/s2a`): two refreshes with the same cookie, the second is treated as theft and the user is signed out. See step 2.
2. **The pending line taken out** (`versions/s4x`). Copy it on top of `s4` and set `300` in `api/refresh-delay.txt` so the race is easy to see (the file is read on every request):

   ```bash
   cp versions/s4x/* src/
   echo 300 > api/refresh-delay.txt
   ```

   Two requests with a dead token now start two refreshes (the only difference is `pending = startSession(...)` instead of `pending ??= startSession(...)`). Real run: one of the two requests fails with `Token expired`:

   ```text
   GET   /api/me/courses          401  token expired
   GET   /api/me/courses          401  token expired
   POST  /api/auth/refresh        200
   GET   /api/me/courses          200
   POST  /api/auth/refresh        401  REUSED refresh token: all sessions of this user ended
   ```

   Put `versions/s4` back and `0` in `api/refresh-delay.txt`.
3. **Trusting the visitor for a role or a `next` address.** The server ignores a role sent at sign-up; the login page accepts a `next` only if it starts with one slash.
4. **Refreshing on an auth address.** A wrong password is a 401 too; refreshing would loop.
5. **Showing the guard's answer before it knows who you are.** Without `checking`, a reload sends a signed-in person to login or shows a stale error.

## What breaks in production

1. The cookie needs the `Secure` flag, so the browser sends it only over HTTPS. The practice server runs on plain HTTP, so the flag is off; a real server must switch it on.
2. The access token lives 8 seconds here to make the demo quick. Real servers use 5 to 15 minutes. The refresh token lives 7 to 30 days, with rotation, like here.
3. The page and the API must share an address. Otherwise you need the credentials and cross-origin setup from lesson 1. Here the dev server forwards `/api` to the practice server.
4. The server must slow down guessing: limit login attempts, and never write a token or a password into a log.
5. Log out must end the refresh token on the server, as ours does, so a stolen cookie dies too.

## Clean up

Press Ctrl+C in both terminals. Check that `src/` is `versions/s4`, `api/refresh-delay.txt` says `0`, and `api/access-seconds.txt` says `8`. Delete `node_modules` and `dist` if you like.

## Try it yourself

Three extensions:

1. Log out in every open tab, with the `storage` event.
2. Refresh a little before the token expires, by reading its expiry time (the middle piece of the token, as in lesson 1).
3. Swap the plain forms for React Hook Form with Zod (Module 12).

Interview tip. "How does your single-page app keep a user signed in safely?" A short-lived access token in memory, a rotating refresh token in an `HttpOnly`, `SameSite` cookie, one shared refresh when a request gets a 401, and a server that checks the role on every request.

## Next

[M14-L01 · The Virtual DOM and Reconciliation](../../m14-react-under-the-hood/m14-l01-the-virtual-dom-and-reconciliation/README.md)
