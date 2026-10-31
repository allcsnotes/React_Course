# M22-B16 · Build a Live Classroom Widget

> Video: Module 22, Build 16. Watch it first, then follow along here.

## What you'll learn

- How one small WebSocket server and one React reducer make a live app: Meera teaches, Lukas and Priya learn
- Who is online, live: one `join` message, one `online` count for everybody
- Questions with votes, shown at once with `useOptimistic` and replaced when the server answers
- Notices from the teacher in an always-present live region, with Motion that respects reduced motion
- Two real mistakes: the server trusting the page about who is a teacher, and a green "3 people online" that is a lie when the connection is down
- Tests, type check, lint and a production build

## Before you start

- Node 24 (`node --version`). No Docker.
- Do M22-L01 (WebSockets, reconnect), M22-L02 (Motion) and M22-L03 (plural rules) first. This build does not teach them again. It also uses `useReducer` (M10), `useOptimistic` (M14) and live regions (M16).
- Everything is local: a Next.js page on port 5836 and a small Node WebSocket server on port 8226. The teacher code `demo-code-123` is a fake demo value. Nothing goes to the internet.

## Files in this folder

| File | What it is |
|------|------------|
| `widget/server/server.mjs` | The WebSocket server (plain JavaScript, no framework): `join`, `ask`, `vote`, `notice` |
| `widget/src/lib/classroom.ts` | Types, the `reduce` function, `onlineLabel` (plural rules) |
| `widget/src/lib/classroom.test.ts` | 6 tests for the reducer, run by Node's own test runner |
| `widget/src/lib/useClassroom.ts` | The hook that owns the WebSocket: reducer, status, reconnect, `ask`, `vote`, `notify` |
| `widget/src/components/Classroom.tsx` | The join form (name, role, teacher code) |
| `widget/src/components/Widget.tsx` | The widget: online pill, notices, questions, forms |
| `widget/src/app/` | Layout, page and styles |
| `versions/v1/` | The first versions of six files (before the fix for mistakes 1 and 2) |

## Run it

Two terminals. The server needs a teacher code in an environment variable (a fake demo value):
```bash
cd widget
npm install
TEACHER_CODE=demo-code-123 DELAY_MS=1500 npm run server
```
```text
classroom server on ws://localhost:8226
```
(`DELAY_MS=1500` slows the server's answer to a question on purpose, so you can see the grey "sending" row. Leave it out for normal speed.) Second terminal:
```bash
cd widget
npm run build
npm run start -- -p 5836
```
Open http://localhost:5836 in three browser windows (use private windows, or three different browsers, so they are three people). Join as Lukas (Student), Priya (Student) and Meera (Teacher, with the code `demo-code-123`).

## Build it step by step

The video builds the widget in six steps. The folder is the end state, so each step says what that part of the code does.

### 1. The setup

The starter came from `npx create-next-app@latest widget` with the recommended answers, no Tailwind, and a `src` folder. It chose Next.js 16.4.3 and React 19.3.0. Then two packages, locally (nothing global), and the types for `ws` as a development tool:
```bash
npm install ws motion
npm install -D @types/ws
```
This folder's `package.json` already pins what was installed: `motion` 14.9.0, `ws` 8.22.0, `@types/ws` 8.18.2.

### 2. The server

`widget/server/server.mjs` opens a WebSocket server on port 8226 and keeps the questions in a list, in memory. Three small helpers: `send` writes one message to one client, `members` are the clients that have joined, `broadcast` sends to all of them. Every message is a small JSON text with a `type`. When a client sends `join`, the server remembers its name, answers with `hello` (the questions so far, so a page that arrives late or comes back catches up: fetching what you missed, built into the protocol), then tells everyone the new online count. `ask` makes a question with a new number and broadcasts it. A `vote` is counted once per person, because the server keeps a list of who voted. A `notice` is broadcast to everyone, but only when the sender is a teacher. The first line of the log is real:
```text
classroom server on ws://localhost:8226
```

### 3. The messages and the online count

The page never changes its list by hand. Every message from the server goes into one reducer (`classroom.ts`). The message type is a union: each kind has its own shape.
```ts
export function reduce(state: State, msg: Msg): State {
  switch (msg.type) {
    case "hello":  return { ...state, role: msg.role, questions: msg.questions };
    case "online": return { ...state, online: msg.count };
    case "question": return { ...state, questions: [...state.questions, msg.question] };
    case "votes":
      return { ...state, questions: state.questions.map((q) => q.id === msg.id ? { ...q, votes: msg.votes } : q) };
    case "notice": {
      const notice = { id: msg.id, text: msg.text };
      return { ...state, notices: [notice, ...state.notices].slice(0, 3) };
    }
  }
}
```
Online replaces the count; a question goes to the end; votes change only the matching question, with a new object; a notice goes to the front and only the newest three are kept. `onlineLabel` uses the browser's plural rules: `1 person online`, `2 people online`, `0 people online`. Because the reducer is a plain function with no React inside, the test runner that comes with Node is enough:
```bash
npm test
```
```text
✔ hello carries the role the server decided and the list (0.778875ms)
✔ an online message replaces the count (0.050625ms)
✔ a new question goes to the end of the list (0.363792ms)
✔ votes change only the matching question (0.083792ms)
✔ only the newest three notices are kept, newest first (0.073333ms)
✔ the online label says person for one and people for the rest (0.15875ms)
ℹ tests 6
ℹ pass 6
ℹ fail 0
```
(Node may print a warning about the module type; the times differ for you. Six tests: five at first, one more for the role in `hello`.)

`useClassroom.ts` owns the WebSocket: `useReducer` for the state, a status, and the socket in a `ref`. The effect opens the socket; on open it sends `join` with the name; every message goes to the reducer. Both rules of lesson 1 are here: if the socket closes, wait and try again, doubling the wait up to 8 seconds; and the cleanup sets a `stopped` flag, clears the timer and closes the socket.

Try it. Lukas joins: one person online. Priya joins: both windows say two people online, and nobody pressed anything. Meera joins: three. Priya closes her window and the other two go back to two. The real server log:
```text
join   Lukas (student) -> 1 online
join   Priya (student) -> 2 online
join   Meera (teacher) -> 3 online
leave  Priya -> 2 online
```
In development the console may warn "WebSocket closed before the connection is established". That is Strict Mode, in development only: it starts the effect, runs the cleanup, and starts it again (M7-L02). The first socket is closed on purpose; the cleanup is doing its job.

### 4. Questions

The form is a React 19 action, so it receives `FormData`. `Widget.tsx` takes the text and calls `useOptimistic`: the question shows at once, grey, with the word "sending…". Then it waits for the real one. The hook gives each `ask` a random `ref` and a promise; when the server's `question` message comes back with the same `ref`, the promise is done, the grey row disappears and the real row takes its place. A 5-second timer is the safety net.
```ts
const ask = useCallback((text: string) =>
  new Promise<void>((done) => {
    const ref = crypto.randomUUID();
    waiting.current.set(ref, done);
    send({ type: "ask", text, ref });
    setTimeout(done, 5000);
  }), [send]);
```
With `DELAY_MS=1500`, Lukas types "What is a ref?" and presses Ask. Real result in the windows:
```text
just after Ask, Lukas: ▲ 0 | What is a ref? | sending… | Ask      (Priya: nothing yet)
1.5 seconds later,  Priya: ▲ 0 | What is a ref? | Lukas | Ask
```
Priya asks "Why does useEffect run twice?". Lukas votes for it, and Meera too. The list sorts by votes: her question jumps to the top, in every window. The movement is Motion; one word, `layout`, on each row.
```text
▲ 2 | Why does useEffect run twice? | ▲ 0 | What is a ref?
```
Server log:
```text
ask    Lukas: What is a ref?
ask    Priya: Why does useEffect run twice?
vote   Lukas -> question 2 (1)
vote   Meera -> question 2 (2)
```

### 5. Notices

The teacher's page has a second form. A notice is a message of type `notice`, and the server broadcasts it. In the page the notices sit in one element: `role="log"`, `aria-live="polite"` and `aria-label="Notices"`. A live region must already be on the page before its text changes (M16-L03), so this element is always drawn, even with no notices. New notices slide in with Motion, from above, and fade in. Meera types "Quiz starts in five minutes" and presses Send. Both student windows show it at once:
```text
notice Meera: Quiz starts in five minutes        (server log)
Quiz starts in five minutes                       (Lukas's and Priya's notices area)
```
You cannot hear a screen reader here, so read the accessibility tree (checked in Playwright; not a real screen reader):
```text
- log "Notices":
  - paragraph: Quiz starts in five minutes
```
That text is what a screen reader announces, politely, without taking Lukas away from what he is doing. Reduced motion: the whole widget is inside `<MotionConfig reducedMotion="user">`, so for a visitor who asked for reduced motion the notice simply appears (in the video, 20 positions in a fraction of a second in the normal window, 2 positions, the start and the end, in the reduced window).

### 6. Two mistakes, and the proof

**Mistake 1: the server trusts the page.** Remember the server's check: only a teacher may send a notice. Where does the server learn who is a teacher? From the `join` message, i.e. from the page. Guess: Lukas is a student, but on the join form he picks Teacher. `versions/v1/` is the first version, where the server believes the page. To run it, copy its files over the project (from the folder that holds `widget/` and `versions/`):
```bash
cp versions/v1/server.mjs widget/server/server.mjs
cp versions/v1/classroom.ts versions/v1/classroom.test.ts versions/v1/useClassroom.ts widget/src/lib/
cp versions/v1/Widget.tsx versions/v1/Classroom.tsx widget/src/components/
```
Rebuild and start the page, start the v1 server (it needs no code), and join Meera as Teacher and Lukas as Teacher. Lukas gets a Send button. He sends "free pizza at five", and Meera's window shows the notice too:
```text
join   Meera (teacher) -> 1 online
join   Lukas (teacher) -> 2 online
notice Lukas: free pizza at five
```
The check passed because the page said so. The lesson is the one from module 20: a page can claim anything; the server must decide. The fix (the files now in `widget/`): the `join` message also carries a teacher code, and the server compares it with a secret it was started with (`TEACHER_CODE`, a fake demo value in an environment variable). A wrong code means: you join as a student. The server answers `hello` with the role it decided, and the page uses that role, not the one it asked for. A real app would use the sign-in of module 20, lesson 2. With the final files, Lukas picks Teacher with the wrong code and joins: his page says `Lukas · student`, there is no Send button, and the server log says:
```text
join   Lukas (student) -> 2 online
refuse Lukas: wrong teacher code
```
Meera, with the right code, is a teacher (`Meera · teacher`).

**Mistake 2: a green lie.** Stop the server. The page says "Reconnecting…", good. But with the v1 widget the pill still says `2 people online`. That number is old, and nobody is checking it. The fix is one line in `Widget.tsx`: when the connection is not open, the pill says `offline`, in grey.
```tsx
<span className={status === "open" ? "online" : "online off"}>
  {status === "open" ? onlineLabel(state.online) : "offline"}
</span>
```
With the final files, stop the server and the pill says `offline`. Start it again and a few seconds later (backoff!) it says `3 people online` again. One honest limit: the server keeps the questions in memory, so a restart forgot them. A real classroom would keep them in a database (module 20).

### 7. The proof

```bash
npx next typegen      # or run npm run build once; it makes the LayoutProps type
npx tsc --noEmit
npm run lint
npm test
npm run build
```
```text
(tsc and eslint print nothing when they pass)
ℹ tests 6
ℹ pass 6
Route (app)
┌ ○ /
└ ○ /_not-found
○  (Static)  prerendered as static content
```
Six tests pass, the type check is clean, the lint is clean, and the production build passes with the page prerendered.

Two honest limits. Hosts that run Next.js as serverless functions do not keep WebSocket connections open, so this server would run on its own machine, not inside Next. And one server holding everything in memory means one machine: a second server would not know about the first one's visitors.

## Common mistakes

1. The server believing the page about the role (step 6).
2. A status pill that keeps showing old numbers when the connection is down (step 6).
3. A hook without a cleanup: the page goes away and the socket stays open.
4. A live region added only when the first message arrives. Draw it from the start.
5. Animations that ignore the visitor's reduced-motion setting.

## Clean up

```bash
# stop the page and the server (Ctrl+C in each terminal)
find widget/.next -delete
```
If you copied `versions/v1` over the project, copy the final files back from a fresh download of this folder. Delete `widget/node_modules` when you are finished.

## Next

Three extensions to try: keep the questions in a database; let the teacher mark a question as answered; show the notice in another language with the translations of M22-L03.

Then [M23-L01 · The 50 Most-Asked React Questions](../../m23-interviews-and-capstone/m23-l01-the-50-most-asked-react-questions/)
