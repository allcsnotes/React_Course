# M20-L02 · Authentication with Auth.js

> Video: Module 20, Lesson 2. Watch it first, then follow along here.

## What you'll learn

- The difference between authentication (who are you?) and authorization (what may you do?)
- How Auth.js (the `next-auth` package, version 5 beta) signs a user in with an email and a password, and why we store only a bcrypt hash
- What the session cookie really is: an encrypted token (JWE) in an HttpOnly cookie
- How to carry the user id and role into the session, and guard pages by role
- The three doors every request must pass: the proxy, the page and the server action
- How "Continue with Google" works (OpenID Connect), tried against a local stand-in, never against Google

## Before you start

- Node 24 (`node --version`) and Docker Desktop running.
- Best after M20-L01 (Drizzle and Postgres) in `../m20-l01-a-database-from-nextjs/`.
- Everything is a demo. The passwords of the three test people, the `AUTH_SECRET` and the database password are fake demo values. No real Google account or key is used, and nothing leaves your computer.

## Files in this folder

| File | What it is |
|------|------------|
| `auth.ts` | The heart: Auth.js setup, the credentials provider, `authorize`, and the two callbacks |
| `proxy.ts` | The guard at the door: `export { auth as proxy }` for `/dashboard` and `/admin` |
| `app/api/auth/[...nextauth]/route.ts` | Passes every `/api/auth/...` request to Auth.js |
| `app/login/page.tsx`, `app/login/actions.ts` | The sign in form and its server action |
| `app/page.tsx`, `app/actions.ts` | The course card and the safe `enroll` action |
| `app/dashboard/page.tsx` | My courses (checks the session again) |
| `app/admin/page.tsx`, `app/forbidden.tsx` | Admin only page and the 403 page |
| `app/session/page.tsx` | Prints what `auth()` returns |
| `app/layout.tsx` | Top bar; shows the Admin link only to admins |
| `types/next-auth.d.ts` | Tells TypeScript that a user has a `role` |
| `db/schema.ts`, `lib/db.ts`, `drizzle/` | Users and enrollments tables, the connection, the migration |
| `seed.mts`, `hash.mts` | Create the 3 test users; show what bcrypt does |
| `next.config.ts` | Switches on the experimental `forbidden()` |
| `scripts/peek.mjs`, `scripts/get.mjs`, `scripts/attack.mjs` | Talk to the running site without a browser |
| `standin/oidc.mjs` | A tiny local OpenID Connect provider. It is NOT Google |
| `variants/` | Changed files for the experiments (see the steps); `env.local.example` files hold their demo settings |
| `.env.example` | Settings with demo values. Copy to `.env.local` |

The three test people (all demo values): `lukas@example.com` / `learn-react-7` (student), `meera@example.com` / `teach-react-8` (instructor), `asha@example.com` / `admin-react-9` (admin).

## Follow along

### 1. Install, settings and the database

```bash
npm install
cp .env.example .env.local
npm ls next react next-auth --depth=0
```
```text
+-- next-auth@5.0.0-beta.32
+-- next@16.4.3
`-- react@19.3.0
```
Surprise from the video: the npm tag `latest` of `next-auth` still points to version 4 (`4.24.15`). The version for the App Router is 5, still marked `beta`, so `package.json` pins `5.0.0-beta.32`.

Start Postgres (demo password) and create the tables and the 3 users:
```bash
docker run -d --name m20l02-pg -e POSTGRES_USER=app -e POSTGRES_PASSWORD=devpassword -e POSTGRES_DB=allcs -p 5402:5432 postgres:17-alpine
# wait about 5 seconds
export DATABASE_URL=postgres://app:devpassword@localhost:5402/allcs
npx drizzle-kit migrate
npx tsx seed.mts
```
```text
[✓] migrations applied successfully!
seeded 3 users
```
(The `drizzle/` folder already holds the migration made with `drizzle-kit generate`. It creates `users` and `enrollments`.) Look at the users:
```bash
docker exec m20l02-pg psql -U app -d allcs -c "select id, name, role, left(password_hash, 20) from users"
```
```text
 id | name  |    role    |         left
----+-------+------------+----------------------
  1 | Lukas | student    | $2b$10$6KrDsTgm1TKKt
  2 | Meera | instructor | $2b$10$jzKkPad.lG6VR
  3 | Asha  | admin      | $2b$10$WxzudB31TD79t
(3 rows)
```
The column is called `password_hash`. We never keep the password itself. The characters will differ for you: every hash gets a new random salt.

### 2. Hash a password with bcrypt

`hash.mts` hashes the same password twice, then checks two guesses:
```bash
npx tsx hash.mts
```
```text
$2b$10$MgtJfLHfvTKIEMBXTJRQCO.eetSy5FuS4YBkemb5PUyJj.MoR6rVK
$2b$10$tgl4TCuXWl4tsgPu05BR6e1/v/N8hsjfUSJ/9wiSy88pDKZK87wxm
true
false
```
Two different strings from one password (bcrypt mixes in a random salt each time and keeps it inside the result). The right password gives `true`, a wrong one `false`. `$2b$10$` means bcrypt with cost 10: 2 to the power 10 rounds of mixing. Slow on purpose.

### 3. Read `auth.ts`

`NextAuth({ providers: [...] })` gives back four things: `handlers`, `auth`, `signIn`, `signOut`. The heart is `authorize`: find the row by email (no row: return `null`), compare the password with the stored hash using `bcrypt.compare` (wrong: `null`), otherwise return `{ id, name, email, role }`.
```ts
Credentials({
  async authorize(credentials) {
    const email = String(credentials.email)
    const password = String(credentials.password)
    const [user] = await db.select().from(users).where(eq(users.email, email))
    if (!user) return null
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return null
    return { id: String(user.id), name: user.name, email: user.email, role: user.role }
  },
}),
```
`app/api/auth/[...nextauth]/route.ts` is two lines that hand every request to the handlers. `app/login/actions.ts` calls `signIn("credentials", { email, password, redirectTo: "/dashboard" })`. A successful sign in does not come back: it throws a special redirect that Next.js catches. So the `catch` handles only `AuthError` and throws everything else again.

### 4. Build and start the site

The site runs as a production build on port 5202 (it is `AUTH_URL` in `.env.local`):
```bash
npm run build
npm run start -- -p 5202
```
The build lists these routes: `/`, `/admin`, `/api/auth/[...nextauth]`, `/dashboard`, `/login`, `/session`, and `Proxy (Middleware)`. Keep this terminal open and use a second one for the rest.

Open http://localhost:5202/dashboard. You have no account session, so you land on `/login?callbackUrl=...`. Sign in as Lukas with the wrong password: the page says "Wrong email or password." and the address ends with `?error=CredentialsSignin`. The message is the same for an unknown email, so a stranger cannot find out which emails have accounts. Now sign in with `learn-react-7`: "Welcome, Lukas, student". Reload: still Lukas.

### 5. Look at the cookie from outside

`scripts/peek.mjs` asks for a CSRF token, posts email and password to the credentials callback, and prints what the server sends back:
```bash
node scripts/peek.mjs lukas@example.com learn-react-7
node scripts/peek.mjs lukas@example.com nope-nope
```
```text
status 302 → /
cookie  authjs.session-token  Path=/; Expires=Mon, 30 Nov 2026 08:46:37 GMT; HttpOnly; SameSite=Lax
pieces  5  lengths 174 0 22 214 43
header  {"alg":"dir","enc":"A256CBC-HS512","kid":"…"}
status 302 → /login?error=CredentialsSignin&code=credentials
```
(The date is 30 days from now for you.) A 302 redirect, one cookie, `HttpOnly` and `SameSite=Lax`. It has five pieces cut by dots, and the header says AES. A plain JWT has three pieces and anyone can read the middle one. This is a JWE, an encrypted token, locked with your `AUTH_SECRET`. Whoever has the secret can make badges.

Open http://localhost:5202/session while signed in. `app/session/page.tsx` prints what `auth()` returns:
```json
{
  "user": { "name": "Lukas", "email": "lukas@example.com", "id": "1", "role": "student" },
  "expires": "2026-11-30T08:47:33.535Z"
}
```
Without a cookie, `auth()` returns `null`.

### 6. Carry the role into the session

`auth.ts` has two callbacks. `jwt` runs when the token is made: if there is a `user` (only at sign in), copy the role into the token. `session` runs whenever a page asks for the session: copy `id` and `role` from the token. TypeScript must be told a user can have a `role`; that is `types/next-auth.d.ts`.

`app/admin/page.tsx`: no session means `redirect("/login")`; a session without the admin role calls `forbidden()`. It is still experimental, so `next.config.ts` switches it on with `experimental: { authInterrupts: true }`.

Guess first: Lukas opens `/admin`. Then Asha does. `scripts/get.mjs` signs in over HTTP and then requests a path (use `-` for no sign in):
```bash
node scripts/get.mjs lukas@example.com learn-react-7 /admin
node scripts/get.mjs asha@example.com admin-react-9 /admin
node scripts/get.mjs lukas@example.com learn-react-7 /dashboard
node scripts/get.mjs - - /admin
node scripts/get.mjs - - /dashboard
```
```text
GET /admin → status 403
GET /admin → status 200
GET /dashboard → status 200
GET /admin → status 307 → /login?callbackUrl=http%3A%2F%2Flocalhost%3A5202%2Fadmin
GET /dashboard → status 307 → /login?callbackUrl=http%3A%2F%2Flocalhost%3A5202%2Fdashboard
```
Lukas gets a plain 403 ("You are signed in, but this page is not for your role."). Asha sees "Everybody on the site (3)" and the menu shows the Admin link only to her.

### 7. Door one: the proxy

`proxy.ts` is one line plus the paths where the guard stands:
```ts
export { auth as proxy } from '@/auth'

export const config = { matcher: ['/dashboard/:path*', '/admin/:path*'] }
```
The `authorized` callback in `auth.ts` asks one question: is there a session? Check without a cookie:
```bash
curl -si localhost:5202/dashboard | head -2
```
```text
HTTP/1.1 307 Temporary Redirect
location: /login?callbackUrl=http%3A%2F%2Flocalhost%3A5202%2Fdashboard
```

### 8. Door two: the page. Door three: the server action

The proxy must never be the only lock. `app/dashboard/page.tsx` asks again, next to the data: `const session = await auth(); if (!session) redirect("/login")`.

The third door is the one people forget: every server action is a public door. `variants/a0/` has the unsafe version: `enroll` reads the user id from a hidden field of the form. Try the attack with a script, no browser, no cookie. Stop the server (Ctrl+C), use the unsafe variant, rebuild and start again:
```bash
cp -R variants/a0/. .
npm run build && npm run start -- -p 5202
```
In the second terminal:
```bash
node scripts/attack.mjs
docker exec m20l02-pg psql -U app -d allcs -c "select id, user_id, course from enrollments"
```
```text
action 40046b76… → status 200
 id | user_id |       course
----+---------+---------------------
  1 |       1 | React for Beginners
(1 row)
```
Status 200, and Lukas (user 1) is enrolled in a course he never asked for. A script that never signed in wrote a row in his name. (The action id will differ for you.) The hidden field was only a note.

Now the cure, `app/actions.ts` in `variants/v1`: ask the cookie, not the browser:
```ts
export async function enroll(formData: FormData) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  await db.insert(enrollments).values({
    userId: Number(session.user.id),
    course: String(formData.get('course')),
  })
  revalidatePath('/dashboard')
}
```
Put the safe files back, empty the table, rebuild and attack again:
```bash
cp -R variants/v1/. .
docker exec m20l02-pg psql -U app -d allcs -c "truncate enrollments restart identity"
npm run build && npm run start -- -p 5202
node scripts/attack.mjs
docker exec m20l02-pg psql -U app -d allcs -c "select u.name, e.course from enrollments e join users u on u.id = e.user_id"
```
```text
action 40587bab… → status 500
 name | course
------+--------
(0 rows)
```
The server log says `Error: Unauthorized` and the table stays empty. Lukas can still enroll from his own signed in browser. The rule: three doors, each asks for the session again. The proxy for quick redirects, the page for what to show, the action for what to change. A hidden button is a picture; the check is the lock.

### 9. Continue with Google (against a stand-in)

OpenID Connect in four steps: the site sends the visitor to the provider; the provider asks them to sign in; the provider sends them back with a one-time code; the server swaps the code for an ID token that says who it is. Then Auth.js makes its own cookie. In `auth.ts` it is one name in the providers list: `Google`, plus two settings, `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`. `variants/gp/` is that plain configuration. It was NOT run against Google: no real keys, no real account.

What can be run is the same flow against the stand-in. `variants/vg/` changes one setting, `Google({ issuer: "http://localhost:8202" })`, and adds a button. Both variants have fake values in their own `env.local.example`.
```bash
node standin/oidc.mjs &          # prints: stand-in OIDC provider on 8202
cp -R variants/vg/. .
cp variants/vg/env.local.example .env.local
npm run build && npm run start -- -p 5202
curl -s localhost:5202/api/auth/providers
```
```text
{"credentials":{"id":"credentials","name":"Credentials","type":"credentials","signinUrl":"http://localhost:5202/api/auth/signin/credentials","callbackUrl":"http://localhost:5202/api/auth/callback/credentials"},"google":{"id":"google","name":"Google","type":"oidc","signinUrl":"http://localhost:5202/api/auth/signin/google","callbackUrl":"http://localhost:5202/api/auth/callback/google"}}
```
Guess: after "Continue with Google", does the browser go to your site or to the provider? In the browser, press Continue with Google. It jumps to the provider (port 8202) with `client_id`, `redirect_uri` and `scope=openid profile email` in the address. The page says "not Google, a local stand-in". Press "Continue as Test Person". The stand-in log:
```text
stand-in OIDC provider on 8202
GET /authorize
GET /approve
  → 302 /api/auth/callback/google?code=3748c0…
POST /token
  code ok → id_token (test.person@…)
```
You land on `/dashboard`: "Welcome, Test Person", role `student`. At `/session` the name and email come from the ID token. The role is `student` because our `jwt` callback gives that to anybody without one. The id is a random one from Auth.js: this person is not yet a row in `users`. Linking them to a row (an Auth.js database adapter) is left out of this lesson. Stop the stand-in when done (`kill %1`) and restore the settings: `cp -R variants/v1/. . && cp .env.example .env.local`. The copy also puts back the plain login page.

## Common mistakes

1. **No secret.** Delete `AUTH_SECRET` from `.env.local` (`variants/m1/env.local.example` has no secret), rebuild, and try to sign in. The browser shows `{"message":"There was a problem with the server configuration. Check the server logs for more information."}` and the log says `MissingSecret: Please define a 'secret'`. Auth.js refuses to run without one, which is good: a site with a known secret is a site where anyone can forge badges.
2. **The role without the type file.** Move `types/next-auth.d.ts` away and run `npx tsc --noEmit`:
   ```text
   auth.ts(33,35): error TS2339: Property 'role' does not exist on type 'User | AdapterUser'.
     Property 'role' does not exist on type 'User'.
   auth.ts(38,20): error TS2339: Property 'role' does not exist on type 'AdapterUser & User'.
   ```
   (The same error shows in every page that reads `session.user.role`.) Put the file back and the errors are gone. If `tsc` complains about `PageProps` or `LayoutProps`, run `npx next typegen` first.
3. **A `catch` that swallows everything.** `variants/m3/app/login/actions.ts` leaves out `throw error`. With the right password the page stays on Sign in: the success redirect was caught and thrown away. The cookie is made, so opening `/dashboard` shows Lukas signed in, but the click did nothing, and that is a bug.
4. Trusting a hidden form field for the user id, or checking only in the proxy.

## Clean up

```bash
# stop the site and the stand-in (Ctrl+C), then:
docker rm -f -v m20l02-pg
cp -R variants/v1/. .
```
Delete `.env.local`, `node_modules` and `.next` when you are finished.

## Next

[M20-L03 · Webhooks, Uploads and Emails](../m20-l03-webhooks-uploads-and-emails/)

Try it yourself: let only instructors and admins enroll people, with a role check inside the action. Then run `scripts/get.mjs`-style requests as Lukas and see what happens.
