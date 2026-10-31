# M20-L01 · A Database from Next.js

> Video: Module 20, Lesson 1. Watch it first, then follow along here.

## What you'll learn

- Why a plain file loses data when two people save at the same moment
- What a database, a table, a row and SQL are, and how to start Postgres 17 in Docker
- How to describe tables in TypeScript with Drizzle, and turn them into SQL with a migration
- How a server component reads rows and a server action writes rows
- How the database refuses bad data (foreign key, not null, unique and check rules)
- How a transaction makes two writes all or nothing

## Before you start

- Node 24. Check with `node --version`.
- Docker Desktop running. Check with `docker --version`.
- Best after M19-L05 (Server Actions) and M19-L03 (Server Components) in `../../m19-nextjs/`.
- Everything here is a demo. The database password `devpassword` is a fake demo value for this lesson only. Nothing leaves your computer.

## Files in this folder

| File | What it is |
|------|------------|
| `filedemo/reviews-file.ts` | The file way: read the whole file, add one review, write the whole file back |
| `filedemo/race.ts` | Two saves at the same moment |
| `filedemo/package.json` | Marks the folder as ES modules, so `node race.ts` runs without a warning |
| `filedemo/tally.sh` | Runs `race.ts` 20 times and counts the results |
| `db/index.ts` | The connection to Postgres, wrapped with Drizzle |
| `db/schema.ts` | The final schema (courses, reviews, enrollments). It is the end state of the lesson |
| `variants/v1/schema.ts` | The first schema: only `courses` and `reviews` |
| `variants/v2/schema.ts` | The second schema: adds the check rule and `enrollments` (same as `db/schema.ts`) |
| `variants/m2/typo.mts` | The typo from the "Common mistakes" section |
| `drizzle.config.ts` | Tells drizzle-kit where the schema is and where to write migrations |
| `expected/0000_init.sql`, `expected/0001_rules.sql` | The SQL that `drizzle-kit generate` should write, to compare with yours |
| `scripts/seed.mts` | Puts 4 courses and 2 reviews into the tables |
| `scripts/list.mts` | The first `select` |
| `scripts/race.mts` | The two-saves race, now on the database |
| `scripts/rules1.mts`, `scripts/rules2.mts` | Bad data the database refuses |
| `scripts/enroll.mts` | Enroll with and without a transaction |
| `app/page.tsx`, `app/course-page.tsx` | The page: a server component that reads the course and its reviews |
| `app/actions.ts` | Server actions `postReview` and `enroll` |
| `.env.example` | The connection string (demo value). Copy to `.env` |

## Follow along

Open a terminal in this folder. Nothing is installed globally.

### 1. The file way loses data

`filedemo/reviews-file.ts`:
```ts
import { readFile, writeFile } from "node:fs/promises";

export async function addReview(name: string, body: string) {
  const list = JSON.parse(await readFile("reviews.json", "utf8"));
  list.push({ name, body });
  await writeFile("reviews.json", JSON.stringify(list));
}
```

`filedemo/race.ts` calls it twice at the same moment, for Lukas and for Priya:
```ts
import { addReview } from "./reviews-file.ts";

await Promise.all([
  addReview("Lukas", "Clear and calm."),
  addReview("Priya", "Great labs."),
]);
```

Guess first: how many reviews will the file hold? Then run it:
```bash
cd filedemo
echo '[]' > reviews.json
node race.ts
cat reviews.json
```
```text
[{"name":"Lukas","body":"Clear and calm."}]
```

One review. Both calls read the empty list before either wrote, so each wrote a list with only its own review, and the last one won. No error anywhere. Now run it 20 times:
```bash
./tally.sh
```
```text
20 runs: both saved 0, one lost 0, file broken 20
```

Yours will differ: the numbers change from run to run and from computer to computer. In the video, 20 runs gave "both saved 0, one lost 6, file broken 14". On this computer the file was broken every time. In no run were both reviews saved. (`tally.sh` is a zsh script, so it runs on a Mac. On Linux use `zsh` or run `race.ts` by hand.) Then go back: `cd ..`.

### 2. Install the project

```bash
npm install
cp .env.example .env
```

`.env` holds the connection string. Never put `.env` in git and never use it in a client component.

### 3. Start Postgres in Docker

One command starts it. The password is fake on purpose. Port 5401 of your computer is forwarded to Postgres inside the box.
```bash
docker run -d --name m20l01-pg -e POSTGRES_PASSWORD=devpassword -e POSTGRES_DB=allcs -p 5401:5432 postgres:17-alpine
```
```text
7624607a3e659bb319d73b1e2c1606a3d9dd92265d5836bf1dcf5e2fff0a4f71
```
(The long number is different on your computer.) Wait about 5 seconds for Postgres to start, then ask it a question through psql, a small window that comes inside the box:
```bash
docker exec m20l01-pg psql -U postgres -d allcs -c "select version();"
```
```text
                                            version
------------------------------------------------------------------------------------------------
 PostgreSQL 17.11 on aarch64-unknown-linux-musl, compiled by gcc (Alpine 15.2.0) 15.2.0, 64-bit
(1 row)
```
On an Intel computer you see `x86_64` instead of `aarch64`. Now the list of tables:
```bash
docker exec m20l01-pg psql -U postgres -d allcs -c "\dt"
```
```text
Did not find any relations.
```
A database, and nothing inside it yet.

Read the connection string in `.env` from the left: `postgres://postgres:devpassword@localhost:5401/allcs` is program, user, password, computer, port, database name.

### 4. Describe the tables

Start with the first schema. The project folder holds the final one in `db/schema.ts`, so copy the first one over it:
```bash
cp variants/v1/schema.ts db/schema.ts
```
In Drizzle a table is an object: `pgTable("courses", { ... })`. `serial` counts up by itself, `text` is words, `integer` is a whole number, `notNull` means never empty, `unique` means no two rows share the value, `primaryKey` marks the column that identifies each row. In `reviews`, `references(() => courses.id)` is a foreign key: a review can never point at a course that does not exist. `defaultNow()` lets the database fill in `created_at`.

The connection is one small file, `db/index.ts`. `logger: true` prints every SQL statement in the terminal:
```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema, logger: true });
```

### 5. Generate and apply the first migration

Guess: how many SQL statements will it write for two tables?
```bash
npx drizzle-kit generate --name init
```
```text
No config path provided, using default 'drizzle.config.ts'
Reading config file '.../drizzle.config.ts'
2 tables
courses 6 columns 0 indexes 0 fks
reviews 5 columns 0 indexes 1 fks

[✓] Your SQL migration file ➜ drizzle/0000_init.sql 🚀
```
Open `drizzle/0000_init.sql`. It has three statements: `CREATE TABLE "courses"`, `CREATE TABLE "reviews"`, and last an `ALTER TABLE` that adds the foreign key (it comes last because both tables must exist first). It should match `expected/0000_init.sql`. This file is a migration: one numbered, saved change to the database, like git for the shape of the database. Apply it:
```bash
npx drizzle-kit migrate
```
```text
No config path provided, using default 'drizzle.config.ts'
Reading config file '.../drizzle.config.ts'
Using 'postgres' driver for database querying
[✓] migrations applied successfully!
```
Look inside Postgres:
```bash
docker exec m20l01-pg psql -U postgres -d allcs -c "\dt"
docker exec m20l01-pg psql -U postgres -d allcs -c "\d reviews"
```
```text
         List of relations
 Schema |  Name   | Type  |  Owner
--------+---------+-------+----------
 public | courses | table | postgres
 public | reviews | table | postgres
(2 rows)

                                        Table "public.reviews"
   Column   |            Type             | Collation | Nullable |               Default
------------+-----------------------------+-----------+----------+-------------------------------------
 id         | integer                     |           | not null | nextval('reviews_id_seq'::regclass)
 course_id  | integer                     |           | not null |
 name       | text                        |           | not null |
 body       | text                        |           | not null |
 created_at | timestamp without time zone |           | not null | now()
Indexes:
    "reviews_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "reviews_course_id_courses_id_fk" FOREIGN KEY (course_id) REFERENCES courses(id)
```
Drizzle also keeps a small table of its own (`drizzle.__drizzle_migrations`) with one row for every migration it applied.

### 6. Put data in and read it back

`scripts/seed.mts` puts four courses and two reviews in. `scripts/list.mts` asks for the courses with `db.select().from(courses)`:
```bash
npx tsx --env-file=.env scripts/seed.mts
npx tsx --env-file=.env scripts/list.mts
```
```text
Query: insert into "courses" ("id", "slug", "title", "teacher", "price", "seats_left") values (default, $1, ...) -- params: ["react-for-beginners", "React for Beginners", "Meera", 499, 25, ...]
Query: insert into "reviews" ("id", "course_id", "name", "body", "created_at") values (default, $1, $2, $3, default), (default, $4, $5, $6, default) -- params: [2, "Priya", "Joins finally make sense.", 2, "Lukas", "Clear and calm. I could follow every step."]
seeded: 4 courses, 2 reviews
```
```text
Query: select "id", "slug", "title", "teacher", "price", "seats_left" from "courses"
4 rows. The first one:
{
  id: 1,
  slug: 'react-for-beginners',
  title: 'React for Beginners',
  teacher: 'Meera',
  price: 499,
  seatsLeft: 25
}
```
The keys are the words of your schema (`seatsLeft`, camel case) while the column in the table is `seats_left`. psql shows the same four rows:
```bash
docker exec m20l01-pg psql -U postgres -d allcs -c "select id, title, price, seats_left from courses"
```
```text
 id |         title         | price | seats_left
----+-----------------------+-------+------------
  1 | React for Beginners   |   499 |         25
  2 | SQL in Two Weeks      |   399 |         30
  3 | Docker for Developers |   599 |         20
  4 | Git Live Cohort       |   299 |          0
(4 rows)
```

### 7. The page reads from the database

`app/course-page.tsx` is an async server component. It asks two questions: the course whose slug is `sql-in-two-weeks`, then its reviews, newest first:
```tsx
const [course] = await db
  .select()
  .from(courses)
  .where(eq(courses.slug, "sql-in-two-weeks"));

const list = await db
  .select()
  .from(reviews)
  .where(eq(reviews.courseId, course.id))
  .orderBy(desc(reviews.createdAt));
```
`app/page.tsx` wraps it in `Suspense` (module 19, lesson 4). Because this project turns on `cacheComponents` in `next.config.ts`, use the production build to see it the way the video did:
```bash
npm run build
npm run start
```
Open http://localhost:3000. You see "SQL in Two Weeks", the price, "30 seats left", and the two reviews. The terminal shows the two `select` statements that Drizzle sent. The browser never sees them: it only talks to your own site.

The build output ends with:
```text
Route (app)
┌ ◐ /
└ ○ /_not-found

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

### 8. Write with a server action

`app/actions.ts` has the write. `"use server"`, then `insert into reviews`, then `revalidatePath("/")` so Next.js draws the page again:
```ts
export async function postReview(formData: FormData) {
  await db.insert(reviews).values({
    courseId: Number(formData.get("courseId")),
    name: String(formData.get("name")),
    body: String(formData.get("body")),
  });
  revalidatePath("/");
}
```
In the page, type the name `Asha` and the review `Short lessons, real data.`, then press Post review. Guess first: how many reviews, and which one is on top? The page now says:
```text
Reviews (3)
AshaShort lessons, real data.
PriyaJoins finally make sense.
LukasClear and calm. I could follow every step.
```
Asha is on top, newest first, because of `orderBy`. The proof is in the database:
```bash
docker exec m20l01-pg psql -U postgres -d allcs -c "select id, name, body from reviews order by id desc limit 3"
```
```text
 id | name  |                    body
----+-------+--------------------------------------------
  3 | Asha  | Short lessons, real data.
  2 | Lukas | Clear and calm. I could follow every step.
  1 | Priya | Joins finally make sense.
(3 rows)
```
In the log the values are separate parameters (`$1`, `$2`, `$3`). They are never glued into the SQL sentence. That is what stops SQL injection.

### 9. The same race, now on the database

Stop the server (Ctrl+C). `scripts/race.mts` makes the same two saves at the same moment, now with `insert`:
```bash
npx tsx --env-file=.env scripts/race.mts
docker exec m20l01-pg psql -U postgres -d allcs -c "select id, name, body from reviews order by id desc limit 2"
```
```text
Query: insert into "reviews" ("id", "course_id", "name", "body", "created_at") values (default, $1, $2, $3, default) -- params: [2, "Lukas", "Clear and calm."]
Query: insert into "reviews" ("id", "course_id", "name", "body", "created_at") values (default, $1, $2, $3, default) -- params: [2, "Priya", "Great labs."]
```
```text
 id | name  |      body
----+-------+-----------------
  4 | Priya | Great labs.
  3 | Lukas | Clear and calm.
(2 rows)
```
(The ids on your computer depend on how many reviews you already posted.) Both reviews are saved. Each call adds one row and nobody rewrites a list. Run it 20 times in the video and 20 times both were saved. We did the same on this computer: `20 runs: both reviews saved in 20`.

### 10. The database says no to bad data

`scripts/rules1.mts` talks straight to the table, skipping the form: a review for course 999 (it does not exist), and a review with no name.
```bash
npx tsx --env-file=.env scripts/rules1.mts
```
```text
Query: insert into "reviews" ("id", "course_id", "name", "body", "created_at") values (default, $1, $2, $3, default) -- params: [999, "Lukas", "Great"]
course 999: 23503 insert or update on table "reviews" violates foreign key constraint "reviews_course_id_courses_id_fk"
Query: insert into "reviews" ("id", "course_id", "name", "body", "created_at") values (default, $1, $2, $3, default) -- params: [2, null, "Great"]
no name: 23502 null value in column "name" of relation "reviews" violates not-null constraint
```
Code 23503 is a foreign key violation, 23502 a not null violation. Nothing was saved.

### 11. A new rule is a new migration

To add rules later, never edit the table by hand. Change the schema and make a new migration. The second schema adds a `check` rule on courses (seats left can never go below zero) and a new table `enrollments` with a `unique` rule (one student enrolls in a course only once):
```bash
cp variants/v2/schema.ts db/schema.ts
npx drizzle-kit generate --name rules
npx drizzle-kit migrate
```
```text
3 tables
courses 6 columns 0 indexes 0 fks
enrollments 3 columns 0 indexes 1 fks
reviews 5 columns 0 indexes 1 fks

[✓] Your SQL migration file ➜ drizzle/0001_rules.sql 🚀
```
The migrate command prints two harmless NOTICE messages ("schema drizzle already exists, skipping") and then `[✓] migrations applied successfully!`. The new file is `0001_rules.sql` (compare with `expected/0001_rules.sql`). It holds `CREATE TABLE "enrollments"` and two `ALTER TABLE ... ADD CONSTRAINT` lines, one of them `CHECK ("courses"."seats_left" >= 0)`. Migrations pile up in order, like pages of a book.

Run the rules:
```bash
npx tsx --env-file=.env scripts/rules2.mts
```
```text
Query: insert into "enrollments" ("id", "course_id", "student") values (default, $1, $2) -- params: [1, "Priya"]
first time: saved
Query: insert into "enrollments" ("id", "course_id", "student") values (default, $1, $2) -- params: [1, "Priya"]
second time: 23505 duplicate key value violates unique constraint "student_course"
Query: update "courses" set "seats_left" = $1 where "courses"."id" = $2 -- params: [-1, 1]
seats -1: 23514 new row for relation "courses" violates check constraint "seats_not_negative"
```
Clean the test row: `docker exec m20l01-pg psql -U postgres -d allcs -c "delete from enrollments"`.

### 12. A transaction: all or nothing

Enrolling is two steps: add a row to `enrollments`, take one seat from the course. `scripts/enroll.mts` tries both ways for the course Git Live Cohort, which has 0 seats left. Without a transaction for Lukas, with `db.transaction` for Priya:
```bash
npx tsx --env-file=.env scripts/enroll.mts
docker exec m20l01-pg psql -U postgres -d allcs -c "select e.student, c.title, c.seats_left from enrollments e join courses c on c.id = e.course_id"
```
```text
Query: insert into "enrollments" ("id", "course_id", "student") values (default, $1, $2) -- params: [4, "Lukas"]
Query: update "courses" set "seats_left" = "courses"."seats_left" - 1 where "courses"."id" = $1 -- params: [4]
no transaction: new row for relation "courses" violates check constraint "seats_not_negative"
Query: insert into "enrollments" ("id", "course_id", "student") values (default, $1, $2) -- params: [4, "Priya"]
Query: update "courses" set "seats_left" = "courses"."seats_left" - 1 where "courses"."id" = $1 -- params: [4]
transaction: new row for relation "courses" violates check constraint "seats_not_negative"
```
```text
 student |      title      | seats_left
---------+-----------------+------------
 Lukas   | Git Live Cohort |          0
(1 row)
```
Both fail. But Lukas is enrolled in a course with 0 seats: a ghost enrollment, because his first step was already saved. Priya is not there: her failed step took the first one back. Clean up: `docker exec m20l01-pg psql -U postgres -d allcs -c "delete from enrollments"`.

The real `enroll` action in `app/actions.ts` is the safe way:
```ts
await db.transaction(async (tx) => {
  await tx.insert(enrollments).values({ courseId, student });
  await tx
    .update(courses)
    .set({ seatsLeft: sql`${courses.seatsLeft} - 1` })
    .where(eq(courses.id, courseId));
});
```
Start the app again (`npm run build && npm run start`) and press Enroll as Lukas. The seats go from 30 to 29:
```bash
docker exec m20l01-pg psql -U postgres -d allcs -c "select student, course_id from enrollments"
docker exec m20l01-pg psql -U postgres -d allcs -c "select title, seats_left from courses where id = 2"
```
```text
 student | course_id
---------+-----------
 Lukas   |         2
(1 row)

      title       | seats_left
------------------+------------
 SQL in Two Weeks |         29
(1 row)
```

## Common mistakes

1. **The tables do not exist yet.** On a new empty database nobody ran the migration. The script fails with `relation "courses" does not exist`, code `42P01`, inside a `DrizzleQueryError: Failed query: ...`. Fix: run `npx drizzle-kit migrate`.
2. **A typo in a column name.** `variants/m2/typo.mts` asks for `courses.titel`. Copy it to `scripts/typo.mts` and run `npx tsc --noEmit`:
   ```text
   scripts/typo.mts(4,46): error TS2551: Property 'titel' does not exist on type 'PgTableWithColumns<{ name: "courses"; ...'. Did you mean 'title'?
   ```
   With raw SQL text you would learn it at run time, from a visitor. Delete `scripts/typo.mts` afterwards.
3. **The database is not running.** Stop the container (`docker stop m20l01-pg`) and open the page: the browser shows an error page and the log says `ECONNREFUSED` for port 5401. `docker start m20l01-pg` brings it back. In production, a stopped or unreachable database is the first thing to check.
4. Putting `.env` in git, or reading `DATABASE_URL` in a client component.
5. Editing a table by hand instead of writing a new migration.

## Clean up

```bash
docker rm -f -v m20l01-pg
find drizzle -type f -delete; find drizzle -depth -type d -empty -delete
rm -f filedemo/reviews.json
```
Delete `node_modules`, `.next` and `.env` too if you are finished (`.env` holds only the demo value).

## Next

[M20-L02 · Authentication with Auth.js](../m20-l02-authentication-with-authjs/)

Try it yourself: add a column `rating` to `reviews`, a whole number with a check rule that allows only 1 to 5. Change the schema, run `generate`, read the new file before you apply it, then `migrate`.
