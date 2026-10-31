# M20-B14 · Build a Full-Stack Course Platform

> Video: Module 20, Build 14. Watch it first, then follow along here.

## What you'll learn

- How lessons 1 and 2 of this module (Postgres with Drizzle, sign-in with Auth.js) become one working app
- A five-table schema where the database itself refuses double enrollment and ghost rows
- Students: sign in, enroll in a course, mark lessons done, watch a progress bar fill
- An instructor dashboard with one SQL query, and a plain "Not allowed" page for students
- Server checks everywhere: the page and the server action both ask for the session and the role
- Tests against a real Postgres, a type check, lint, and a production build that stays green

## Before you start

- Node 24 (`node --version`) and Docker Desktop running.
- Do M20-L01 (`../m20-l01-a-database-from-nextjs/`) and M20-L02 (`../m20-l02-authentication-with-authjs/`) first. This build does not teach them again.
- Everything is a demo. The database password `fake-local-password`, the `AUTH_SECRET` and the demo password `demo-password-1` of the three seed users are fake values. Nothing leaves your computer.
- The three lesson-3 pieces (fake payment provider with webhooks, uploads, receipt email) are extensions at the end, not part of this build.

## Files in this folder

| File | What it is |
|------|------------|
| `src/db/schema.ts` | Five tables: users, courses, lessons, enrollments, lesson_progress |
| `src/db/index.ts`, `src/db/seed.ts` | The connection; the seed (3 people, 3 courses, 12 lessons) |
| `drizzle/` | The generated SQL migration and its metadata |
| `src/auth.ts` | Auth.js with the credentials provider and two callbacks |
| `src/lib/session.ts` | `requireUser()` and `requireInstructor()` |
| `src/lib/learn.ts` | `enrollUser`, `completeLesson`, `myCourses`, `instructorStats` ... |
| `src/lib/progress.ts` | The tiny pure function `percent(done, total)` |
| `src/lib/learn.test.ts`, `src/lib/progress.test.ts` | The 7 tests |
| `src/app/actions.ts` | Server actions: `enroll`, `markDone`, `login`, `logout` |
| `src/app/page.tsx`, `src/app/courses/[slug]/page.tsx` | Home and the course page (cached course, personal part behind Suspense) |
| `src/app/my/page.tsx`, `src/app/login/page.tsx` | My courses; sign in |
| `src/app/instructor/page.tsx`, `src/app/forbidden.tsx` | Instructor dashboard; the 403 page |
| `src/components/` | `CourseList`, `Lessons`, `LoginForm`, `Progress`, `UserMenu` |
| `versions/layout.nosuspense.tsx` | The layout without Suspense, for the build-error experiment |
| `next.config.ts`, `vitest.config.mts`, `drizzle.config.ts` | Configuration |
| `.env.example` | Demo settings. Copy to `.env.local` |

## Run it

```bash
npm install
cp .env.example .env.local
docker run -d --name m20b14-pg -e POSTGRES_USER=app -e POSTGRES_PASSWORD=fake-local-password -e POSTGRES_DB=platform -p 5414:5432 postgres:17-alpine
# wait about 5 seconds
docker exec m20b14-pg psql -U app -d platform -c "create database platform_test"
export DATABASE_URL=postgres://app:fake-local-password@localhost:5414/platform
npx drizzle-kit migrate
npm run db:seed
npm run build
npm run start -- -p 5814
```
```text
[✓] migrations applied successfully!
seeded: 3 users, 3 courses, 12 lessons
```
Open http://localhost:5814. Sign in as `lukas@allcsvideos.test` (student), `priya@allcsvideos.test` (student) or `meera@allcsvideos.test` (instructor), all with the demo password `demo-password-1`. (`drizzle-kit` does not read `.env.local`, so the `export` line gives it the address. `npm run db:seed` reads `.env.local` by itself.)

## Build it step by step

The video builds the app in seven steps. The folder is the end state, so each step shows what that part of the code does.

### 1. The setup

The starter was made with:
```bash
npx create-next-app@latest site --ts --app --no-tailwind --eslint --src-dir \
  --import-alias "@/*" --use-npm --turbopack --no-react-compiler --yes
```
It chose Next.js 16.4.3 and React 19.3.0. Then the packages, all local:
```bash
npm install drizzle-orm pg next-auth@beta bcryptjs
npm install -D drizzle-kit vitest tsx @types/pg @types/bcryptjs
npm ls --depth=0
```
```text
+-- bcryptjs@3.0.3
+-- drizzle-kit@0.31.11
+-- drizzle-orm@0.45.4
+-- next-auth@5.0.0-beta.32
+-- next@16.4.3
+-- pg@8.23.1
+-- react-dom@19.3.0
+-- react@19.3.0
+-- typescript@5.9.3
`-- vitest@5.0.5
```
(Auth.js version 5 is still a beta, and the npm tag `latest` still points to version 4. This folder's `package.json` already pins these exact versions, so `npm install` is enough.) The starter turns on `cacheComponents` and `partialPrefetching`. We add one line, `experimental: { authInterrupts: true }`, because `forbidden()` is still experimental:
```ts
const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: { authInterrupts: true },
}
```
The settings file has fake values only: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_TRUST_HOST=true`.

### 2. The database

`src/db/schema.ts`: users (unique email, `password_hash`, role `student` or `instructor`), courses (slug, title, level, summary, `instructor_id`), lessons (with a `position`), and the two link tables:
```ts
export const enrollments = pgTable('enrollments', {
    userId: ref('user_id', () => users.id),
    courseId: ref('course_id', () => courses.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.courseId] })],
)
```
The two-column primary key means the same student cannot enroll twice in the same course. `lesson_progress` works the same way with the user and the lesson. `drizzle-kit generate` writes the SQL (the folder already holds it: `drizzle/0000_watery_scarecrow.sql`; your own run would pick a different random name) and `drizzle-kit migrate` runs it. Look inside:
```bash
docker exec m20b14-pg psql -U app -d platform -c '\dt'
docker exec m20b14-pg psql -U app -d platform -c '\d enrollments'
```
```text
            List of relations
 Schema |      Name       | Type  | Owner
--------+-----------------+-------+-------
 public | courses         | table | app
 public | enrollments     | table | app
 public | lesson_progress | table | app
 public | lessons         | table | app
 public | users           | table | app
(5 rows)

                        Table "public.enrollments"
   Column   |            Type             | Collation | Nullable | Default
------------+-----------------------------+-----------+----------+---------
 user_id    | integer                     |           | not null |
 course_id  | integer                     |           | not null |
 created_at | timestamp without time zone |           | not null | now()
Indexes:
    "enrollments_user_id_course_id_pk" PRIMARY KEY, btree (user_id, course_id)
Foreign-key constraints:
    "enrollments_course_id_courses_id_fk" FOREIGN KEY (course_id) REFERENCES courses(id)
    "enrollments_user_id_users_id_fk" FOREIGN KEY (user_id) REFERENCES users(id)
```
The two foreign keys stop us from enrolling a user or a course that does not exist. The seed (`src/db/seed.ts`) makes Meera (instructor), Lukas and Priya (students) with the same demo password, hashed with bcrypt:
```bash
docker exec m20b14-pg psql -U app -d platform -c "select email, role, left(password_hash,16) as hash from users"
```
```text
         email          |    role    |       hash
------------------------+------------+------------------
 meera@allcsvideos.test | instructor | $2b$10$gFMI380NG
 lukas@allcsvideos.test | student    | $2b$10$lJULeQeY4
 priya@allcsvideos.test | student    | $2b$10$WUl0DZT4g
(3 rows)
```
The hash is different for every person (random salt, yours will differ), and the password is nowhere in the database.

The test database `platform_test` (made in "Run it") needs the same tables once:
```bash
DATABASE_URL=postgres://app:fake-local-password@localhost:5414/platform_test npx drizzle-kit migrate
```

### 3. Sign in

`src/auth.ts` is the credentials provider of lesson 2: `authorize` finds the user in our table, compares with `bcrypt.compare`, returns `{ id, name, role }` or `null`. Two callbacks copy the id and role into the token and from the token into the session (an encrypted cookie). `src/lib/session.ts` has two helpers for the whole app:
```ts
export async function requireUser() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  return { id: Number(session.user.id), name: session.user.name ?? '', role: session.user.role }
}

export async function requireInstructor() {
  const user = await requireUser()
  if (user.role !== 'instructor') forbidden()
  return user
}
```
Lesson 2 had three doors (proxy, page, action). This build uses the page and the action; a proxy is an optional extra. The login form is a client component with `useActionState` and a server action behind it. In the browser: a wrong password answers "Wrong email or password" (no hint which one was wrong). The right password sends Lukas to My courses: "React for Beginners, 2/5 lessons, 40%", and the header says "Sign out (Lukas)".

### 4. Enroll

`enrollUser` inserts a row with `onConflictDoNothing()`, so pressing the button twice is harmless. The server action asks who is calling in its first line (a server action is a public endpoint), then inserts, then `refresh()`:
```ts
export async function enroll(courseId: number) {
  const user = await requireUser()
  await enrollUser(user.id, courseId)
  refresh()
}
```
On the course page the course itself is cached (`use cache`). The personal part, `src/components/Lessons.tsx`, sits inside Suspense: no session shows "Sign in to enroll", a signed-in student who is not enrolled sees a form with the Enroll button. As Lukas, open http://localhost:5814/courses/nextjs-full-stack and press Enroll. The page changes by itself:
```text
Full-Stack with Next.js | Meera · intermediate | A database, sign-in and server actions in one app. | 0/4 lessons · 0% | The App Router | Mark done | A database | Mark done | Sign in | Mark done | Server actions | Mark done
```
In the database Lukas has two rows, and inserting the first one again by hand is refused by Postgres:
```bash
docker exec m20b14-pg psql -U app -d platform -c "insert into enrollments (user_id, course_id) values (2, 1)"
```
```text
ERROR:  duplicate key value violates unique constraint "enrollments_user_id_course_id_pk"
DETAIL:  Key (user_id, course_id)=(2, 1) already exists.
```
Our code never reaches that error because of the do-nothing option.

### 5. Progress

`completeLesson` does three things: find the lesson, check that this student is enrolled in the lesson's course (if not, return `'not enrolled'`), then insert the row with `onConflictDoNothing()`. The action is public, so anybody could send it any lesson number; hiding a button is not security. The bar uses `percent(done, total)` from `src/lib/progress.ts`: done divided by total, rounded to a whole number, and 0 when a course has no lessons. Press "Mark done" on the first lesson, then on the next:
```text
1/4 lessons · 25% | The App Router | Done | A database | Mark done | ...
2/4 lessons · 50% | The App Router | Done | A database | Done | Sign in | Mark done | ...
```
```bash
docker exec m20b14-pg psql -U app -d platform -c "select user_id, lesson_id from lesson_progress where user_id = 2 and lesson_id in (6, 7)"
```
```text
 user_id | lesson_id
---------+-----------
       2 |         6
       2 |         7
(2 rows)
```
Those two rows are the whole progress bar (Lukas is user 2).

### 6. The instructor dashboard

`instructorStats` is one SQL query written with Drizzle's `sql` tag: for each course of this instructor, how many students are enrolled, how many lessons it has, and how many lesson rows are done. The page calls `requireInstructor()` first. Progress for a course is the done rows divided by students times lessons (2 students and 4 lessons: at most 8). Sign in as `meera@allcsvideos.test` and open `/instructor`:
```text
Instructor dashboard | Course  Students  Average progress | React for Beginners  2  50% | Full-Stack with Next.js  2  38% | TypeScript Basics  0  0%
```
(Before Lukas enrolled, Full-Stack with Next.js had one student and 25%; now two students and 38%.) If Lukas types `/instructor` the server answers with our forbidden page: "Not allowed. Only instructors can open this page." The browser did not decide that. The server did.

### 7. Tests, type check, lint and a production build

The tests talk to a real Postgres, the second database `platform_test`, because the rules live in SQL (`vitest.config.mts` sets its `DATABASE_URL`). Make the route types once, then run everything:
```bash
npx next typegen
npm run typecheck
npm run lint
npm test -- --reporter=verbose
```
```text
 ✓ src/lib/learn.test.ts > learning flow > enrolling twice keeps one row 37ms
 ✓ src/lib/learn.test.ts > learning flow > refuses a lesson from a course you are not in 11ms
 ✓ src/lib/learn.test.ts > learning flow > counts progress once per lesson 9ms
 ✓ src/lib/learn.test.ts > learning flow > shows the instructor students and progress 6ms
 ✓ src/lib/progress.test.ts > percent > is 0 when a course has no lessons 1ms
 ✓ src/lib/progress.test.ts > percent > rounds to a whole number 0ms
 ✓ src/lib/progress.test.ts > percent > is 100 when every lesson is done 0ms

 Test Files  2 passed (2)
      Tests  7 passed (7)
```
(The times are different on your computer. The type check and the lint print nothing when they pass.) Seven tests pass: four about the learning flow, three about `percent`.

Now the build:
```bash
npm run build
```
```text
Route (app)                         Revalidate  Expire
┌ ◐ /                                      15m      1y
├ ◐ /_not-found
├ ƒ /api/auth/[...nextauth]
├   /courses/[slug]
│ ├ ◐ /courses/[slug]
│ ├ ◐ /courses/react-for-beginners          1h      1d
│ ├ ◐ /courses/nextjs-full-stack            1h      1d
│ └ ◐ /courses/typescript-basics            1h      1d
├ ◐ /instructor
├ ◐ /login
└ ◐ /my

◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
ƒ  (Dynamic)            server-rendered on demand
```
A half circle for every page: partial prerender. The three course pages are each remembered for one hour.

## Common mistakes

1. **Taking Suspense away from the user menu.** Guess first, then try: `cp versions/layout.nosuspense.tsx src/app/layout.tsx` and run `npm run build`. The build stops:
   ```text
   Error: Route "/instructor": Next.js encountered uncached or runtime data during prerendering.
   Ways to fix this:
     - [stream] Provide a placeholder with `<Suspense fallback={...}>` around the data access
     - [cache] For uncached data (`fetch`, database calls): cache the access with `"use cache"` (does not apply to `connection()`)
     - [block] Set `export const instant = false` to allow a blocking route
   ```
   The header reads cookies, and a page cannot be built ahead of time around that unless the header waits behind Suspense. Put the real layout back (wrap `<UserMenu />` in `<Suspense fallback={null}>`, as in the original `src/app/layout.tsx`).
2. Hiding the "Mark done" button instead of checking enrollment in the action.
3. Trusting the page check alone: always check in the server action too.
4. Running `npm run typecheck` before `npx next typegen` (or a build): `LayoutProps` is not defined yet.
5. Forgetting `export DATABASE_URL=...` for `drizzle-kit`.

## Clean up

```bash
# stop the site (Ctrl+C), then:
docker rm -f -v m20b14-pg
```
Delete `.env.local`, `node_modules` and `.next` when you are finished. (Do not run the layout experiment and leave `src/app/layout.tsx` changed.)

## Next

Three extensions to try, from lesson 3 (`../m20-l03-webhooks-uploads-and-emails/`): pay for a course through the fake test provider with its signed webhook, let Meera upload a thumbnail, and send a receipt email that Mailpit catches.

Then [M21-L01 · Building for Production](../../m21-deployment-and-monitoring/m21-l01-building-for-production/)
