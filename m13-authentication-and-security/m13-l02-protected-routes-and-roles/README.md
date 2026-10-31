# M13-L02 · Protected Routes and Roles

> Video: Module 13, Lesson 2. Watch it first, then follow along here.

Lukas, a student, signs in to allcsvideos and clicks Admin. He sees every user of the site with their email address. Nothing is broken: the guard from Module 8 only asked "is somebody signed in?" In this lesson you ask the right questions (who are you, and what may you do?) and learn why hiding things in the page is never enough.

## What you'll learn

- Authentication (who are you?) versus authorization (what may you do?), and what a role is
- One table that says which role may open which page, plus a `can()` helper
- A guard component on layout routes (`RequireRole`) with `Navigate` and `Outlet`
- Role-based menu items that follow the same table
- 401 (I do not know who you are) versus 403 (I know who you are, and the answer is no)
- Why the server must check the token and the role on every request, and three mistakes

## Before you start

- Node 24 (`node --version`; recorded with v24.16.0).
- You know React Router (Module 8), context (Module 10, lesson 2), and the token flow from [M13-L01](../m13-l01-login-flows-sessions-vs-jwt/README.md).
- Docker is not used.
- The practice sign-in takes only an email, no password, to keep the code short. The emails (`lukas@example.com`, `meera@example.com`, `asha@example.com`, `priya@example.com`) are made-up demo values.

## Files in this folder

| File | What it is |
|---|---|
| `package.json` | Pinned: React 19.3.1, react-router 8.5.1, Vite 8.3.5, TypeScript 7.0.2 |
| `src/roles.ts` | The `Role` type, the `ACCESS` table, and `can()` |
| `src/auth.tsx` | Context: user, token, `signIn`, `signOut`, and `useAuth` |
| `src/guard.tsx` | `RequireRole`: the guard layout route |
| `src/layout.tsx` | Header with `NavItem`s that follow the table |
| `src/main.tsx` | The router: one guard per group of routes |
| `src/pages.tsx`, `src/api.ts` | The pages (including `Forbidden`) and the `useGet` hook that keeps a status for errors |
| `api/server.mjs` | Practice API on port 8132: sign-in, tokens, role checks. Local stand-in with demo users |
| `api/mode.txt` | `strict` (checks roles) or `open` (checks nothing, to show the problem) |
| `cli/ask.mjs` | Signs in as someone, asks the API one path, prints the status |
| `versions/` | Overlays for `src/`: `v0` (the guard from Module 8), `m1`, `m3`, `noguard` (mistakes and the experiment), and `final` (a copy of the finished `src/`) |

The practice API:

| Request | Who may |
|---|---|
| `POST /api/login` with `{email}` | anyone with a known email |
| `GET /api/courses` | public list |
| `GET /api/my-courses` | any signed-in user |
| `GET /api/studio/courses` | instructor or admin |
| `GET /api/admin/users` | admin only |

401 means no (or an unknown) token. 403 means a known user with the wrong role.

To try an overlay, copy its files over `src/` (`cp versions/v0/* src/`). To go back to the finished version, copy `versions/final/*` over `src/` (it is the same as the files you start with).

## Follow along

### 1. Install and start

```bash
npm install
node api/server.mjs
```

```text
practice API on http://localhost:8132
```

In a second terminal:

```bash
npm run dev
```

```text
  VITE v8.3.5  ready in ... ms

  ➜  Local:   http://localhost:5232/
```

### 2. The problem: a guard that asks the wrong question (stage v0)

```bash
cp versions/v0/* src/
echo open > api/mode.txt
```

`versions/v0/guard.tsx` is the guard from Module 8: `RequireAuth`, which only asks "is there a user?". Open http://localhost:5232/login, press Sign in as Lukas. The menu shows My courses, Studio and Admin. Click Admin:

```text
Lukas student
Meera instructor
Asha admin
Priya student
```

(each with an email address.) A student just read the admin page. The guard did exactly what we asked: we asked the wrong question. (The API is in `open` mode here so the data comes back as well.)

Put things back for the rest of the lesson:

```bash
cp versions/final/* src/
echo strict > api/mode.txt
```

### 3. Roles: one table (`src/roles.ts`)

The server decides the role, never the browser. A sign-in answers with a token and a user:

```bash
curl -s -X POST localhost:8132/api/login -d '{"email":"lukas@example.com"}'
```

```text
{"token":"tok_f7e375867f8986ce","user":{"id":1,"name":"Lukas","role":"student"}}
```

(The token differs every time.) The table, and one helper:

```ts
export type Role = 'student' | 'instructor' | 'admin'
export type Page = 'mine' | 'studio' | 'admin'

export const ACCESS: Record<Page, Role[]> = {
  mine: ['student', 'instructor', 'admin'],
  studio: ['instructor', 'admin'],
  admin: ['admin'],
}

export const can = (role: Role | undefined, page: Page) =>
  role !== undefined && ACCESS[page].includes(role)
```

`Role` is a union (Module 9), so a typo cannot slip in. A visitor who is not signed in has no role, so `can` is false.

### 4. Remember who is signed in (`src/auth.tsx`)

Context (Module 10) holds `user`, `token`, `signIn` and `signOut`. `useAuth` throws a clear sentence when the provider is missing. `signIn` posts the email and stores the answer; `signOut` sets both to `null`. The token lives in memory (as lesson 1 recommends), so a reload signs Lukas out here. The refresh cookie that brings him back is part of the project at the end of this module.

### 5. The guard (`src/guard.tsx`)

The same idea as the loader in Module 8, lesson 4, but a loader cannot read context, so it is a component on a layout route:

```tsx
export function RequireRole({ roles }: { roles: Role[] }) {
  const { user } = useAuth()
  const next = useLocation().pathname

  if (!user) {
    return <Navigate to={`/login?next=${next}`} replace />
  }
  if (!roles.includes(user.role)) {
    return <Forbidden role={user.role} />
  }
  return <Outlet />
}
```

No user: go to login with `next` set to the page they wanted (`replace` keeps the blocked page out of the history). A user with the wrong role: show the forbidden page. Otherwise `Outlet` draws the page. In `src/main.tsx`, each group of routes gets one guard, with its list from the table:

```tsx
{ element: <RequireRole roles={ACCESS.admin} />, children: [
  { path: '/admin', element: <Admin /> },
] },
```

The pages inside need no checks of their own. A new admin page only has to move into the admin group.

Guess: Lukas is signed out and types `/admin`. Where does he land? Real result (open http://localhost:5232/admin in a new tab):

1. The address becomes `/login?next=/admin`.
2. He presses Sign in as Lukas and lands on `/admin`, as `next` says.
3. The page says `403: not for your role`, and the menu does not even show Admin.

Signed out: go to login, because signing in would fix it. Signed in with the wrong role: a plain no, because signing in again changes nothing. 401 means "I do not know who you are". 403 means "I know who you are, and the answer is no".

### 6. A menu that follows the table (`src/layout.tsx`)

```tsx
function NavItem({ to, page, label }: ItemProps) {
  const { user } = useAuth()
  if (!can(user?.role, page)) return null
  return <NavLink to={to}>{label}</NavLink>
}
```

The header has three `NavItem`s, one line each, with the same `can` and the same table as the guards. Change the table once and the links and guards change together. Real runs of the menu:

```text
Lukas  (student):    allcsvideos, My courses
Meera  (instructor): allcsvideos, My courses, Studio
Asha   (admin):      allcsvideos, My courses, Studio, Admin
```

Meera's studio lists her courses with their students (`React for Beginners, 412 students`, `Python from Zero, 1280 students`). Asha's admin page lists the users. This is role-based UI: the page shows what your role can use, so the site stays clear. It is not security.

### 7. The UI is not security: the server is

Everything above runs in the browser, and the browser belongs to the visitor. Experiment: delete the admin guard from the route table (`cp versions/noguard/* src/`). The link is still hidden for students. Sign in as Lukas and go to `/admin` by typing the address into the console:

```js
history.pushState({}, '', '/admin'); dispatchEvent(new PopStateEvent('popstate'))
```

Real result: the admin page draws, but with a red box and no names or emails:

```text
Admin
The server answered 403: forbidden
```

The page is open, but the data stays locked. And Lukas does not need our page at all. Ask the API directly with `cli/ask.mjs` (it signs in as the person, then asks):

```bash
node cli/ask.mjs /api/my-courses
node cli/ask.mjs /api/admin/users
node cli/ask.mjs /api/admin/users lukas
node cli/ask.mjs /api/admin/users meera
node cli/ask.mjs /api/admin/users asha
```

```text
401 {"error":"not signed in"}
401 {"error":"not signed in"}
403 {"error":"forbidden","needs":["admin"]}
403 {"error":"forbidden","needs":["admin"]}
200 [{"id":1,"name":"Lukas","email":"lukas@example.com","role":"studen...
```

The lock is on the server (`check` in `api/server.mjs`): find the user from the token (none: 401); a user whose role is not in the list: 403. It runs on every single request. The guard in the browser is a polite sign on the door; this check is the lock.

So the rule: the UI decides what to show, the server decides what is allowed. Every endpoint that returns private data must check the token and the role itself, and the page must handle the no (`useGet` in `src/api.ts` keeps a status for errors, which drew the red box). A token that expires mid-session gives a 401: ask for a new one once (lesson 1); if that fails too, sign the person out and send them to login. The whole flow is in the project at the end of this module.

Put the finished files back when you are done: `cp versions/final/* src/`.

## Common mistakes

1. **A role spelled wrong.** In `versions/m1/roles.ts` the admin entry is `'Admin'` with a capital A. Because `Role` is a union, TypeScript stops you:

   ```bash
   cp versions/m1/roles.ts src/roles.ts
   npx tsc -b
   ```

   ```text
   src/roles.ts(7,11): error TS2820: Type '"Admin"' is not assignable to type 'Role'. Did you mean '"admin"'?
   ```

   Without the type, every admin would be locked out and nothing would explain why.
2. **Believing the browser about the role.** A sign-in request that says `role: admin`:

   ```bash
   curl -s -X POST localhost:8132/api/login -d '{"email":"lukas@example.com","role":"admin"}'
   ```

   ```text
   {"token":"tok_f7e375867f8986ce","user":{"id":1,"name":"Lukas","role":"student"}}
   ```

   The server read the role from its own table and ignored the request. Never let a request, a cookie or a `localStorage` value tell you who is an admin. (A role inside a token is different: the server signed it, as in lesson 1.)
3. **Sending a signed-in student to the login page.** In `versions/m3/guard.tsx` a wrong role also goes to login. Real result: Lukas lands on the sign-in page while the header says `Lukas student`, and signing in again changes nothing. No user: login. Wrong role: a clear no.

## Clean up

Press Ctrl+C in both terminals. Make sure `api/mode.txt` says `strict` and `src/` holds the finished files. Delete `node_modules` and `dist` if you like.

## Try it yourself

Add a fourth role, `helper`, who may open the studio but not the admin page. Change only the table (and the `Role` type), and watch the menu and the guards follow. (Answer: add `'helper'` to `Role` and to `ACCESS.studio`, and give the practice API a user with that role if you want to sign in as one.)

Interview tip. "Is hiding a button enough to protect an admin page?" No. Hiding and route guards are for clarity. The browser belongs to the user, so the server must check the token and the role on every request, and answer 401 or 403.

## Next

[M13-L03 · Frontend Security](../m13-l03-frontend-security/README.md)
