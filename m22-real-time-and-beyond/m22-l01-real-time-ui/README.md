# M22-L01 · Real-Time UI

> Video: Module 22, Lesson 1. Watch it first, then follow along here.

## What you'll learn

- Why a page that asked the server once never hears about news, and the three ways to fix that: polling, server-sent events and WebSockets
- How to write each one in React (`setInterval`, `EventSource`, `WebSocket`) and what the real messages look like
- How a connection that breaks reconnects with backoff (1 s, 2 s, 4 s, up to 8 s), and why a socket does not remember what you missed
- How to put socket messages into the TanStack Query cache, and refetch on every open so nothing is lost
- How a live region (`role="status"`) tells screen reader users about new messages
- Mistakes: a socket that is never closed, no reconnect, trusting every message, a list that grows forever

## Before you start

- Node 24 (`node --version`). No Docker.
- Best after M11 (server state) and M16-L03 (live regions).
- Everything runs on your computer: a small Node server (`server/server.mjs`, port 8221) and a Next.js 16.4.3 page (port 5221). No cloud service, no account. Both are local stand-ins.

## Files in this folder

| File | What it is |
|------|------------|
| `server/server.mjs` | The practice server: `/notifications`, `/events` (SSE), `/ws` (WebSocket), `/publish`, `/stats` |
| `live-app/app/page.tsx` | The page that asks once: the bell stays empty |
| `live-app/app/poll/page.tsx` | Way 1: polling with `setInterval` |
| `live-app/app/sse/page.tsx` | Way 2: server-sent events with `EventSource` |
| `live-app/app/ws/page.tsx`, `live-app/lib/useSocket.ts` | Way 3: a WebSocket in a hook, with backoff reconnect and "Mark read" |
| `live-app/app/cache/page.tsx` | Messages go into the TanStack Query cache; refetch on every open |
| `live-app/app/leak/page.tsx`, `clean/page.tsx`, `away/page.tsx` | The socket that is never closed, and the one that is |
| `live-app/components/Panel.tsx` | Bell, header chip, and the list with its `role="status"` strip |
| `live-app/lib/api.ts` | Addresses and types |

## Follow along

### 1. Start the server and the page

Terminal 1:
```bash
cd server
npm install
node server.mjs
```
```text
15:03:29 listening on 8221
```
(The server keeps its notifications in `server/notes.json`, which it creates. Delete that file to start again.) Terminal 2:
```bash
cd live-app
npm install
npm run build
npm run start -- -p 5221
```
The build lists these static routes: `/`, `/poll`, `/sse`, `/ws`, `/cache`, `/leak`, `/clean`, `/away`. Open http://localhost:5221. The bell shows nothing, even after a moment. Nothing is broken: the page asked the server once when it opened, and a server only answers when it is asked. Only a refresh brings the news. To "publish a lesson" as Meera, use this in a third terminal whenever you need it:
```bash
curl -s -X POST localhost:8221/publish -d '{"title":"Hooks in Depth is now live"}'
```

### 2. Way 1: polling

`app/poll/page.tsx`: an effect starts a timer. Every 2 seconds it asks for notifications after the last one it has, and adds anything new. The cleanup stops the timer.
```tsx
useEffect(() => {
  const timer = setInterval(async () => {
    const res = await fetch(`${API}/notifications?after=${last.current}`);
    const fresh: Note[] = await res.json();
    if (fresh.length) {
      last.current = fresh[0].id;
      setItems((old) => [...fresh, ...old]);
    }
  }, 2000);
  return () => clearInterval(timer);
}, []);
```
Guess: ten seconds go by, and Meera publishes one lesson after five seconds. How many requests does the server see, and how many come back empty? Open http://localhost:5221/poll, wait 5 seconds, publish (the curl above), and watch Terminal 1 for 5 more seconds:
```text
15:09:09 GET /notifications?after=0 -> 0 new
15:09:11 GET /notifications?after=0 -> 0 new
15:09:12 publish #1 -> 0 sse, 0 ws
15:09:13 GET /notifications?after=0 -> 1 new
15:09:15 GET /notifications?after=1 -> 0 new
15:09:17 GET /notifications?after=1 -> 0 new
```
Five requests in 10 seconds, one every 2 seconds, and four came back empty. The news arrived about a second after it was published. Polling works, but it asks and asks.

### 3. Way 2: server-sent events (SSE)

On the server, `/events` answers with `Content-Type: text/event-stream` and never ends the answer; it keeps the connection in a set. To send, it writes an id, the data, and a blank line (the blank line ends one message). See the real messages with curl (the `-N` flag turns buffering off), and publish twice from another terminal:
```bash
curl -N localhost:8221/events
```
```text
retry: 1000

id: 1
data: {"id":1,"title":"Hooks in Depth is now live","by":"Meera","at":"2026-10-31T09:33:39.026Z"}

id: 2
data: {"id":2,"title":"Meera answered your question","by":"Meera","at":"2026-10-31T09:33:39.337Z"}
```
In React the browser gives us `EventSource`:
```tsx
useEffect(() => {
  const source = new EventSource(`${API}/events`);
  source.onopen = () => setStatus("live");
  source.onmessage = (e) => setItems((old) => [JSON.parse(e.data), ...old]);
  source.onerror = () => setStatus("reconnecting");
  return () => source.close();
}, []);
```
Open http://localhost:5221/sse and publish: the notification appears and the chip says `live`. The page sent one request in total, to `/events`, and that request stays open. Two limits: the page can only listen (it cannot send anything back on this line), and the browser reconnects by itself if the line drops.

### 4. Way 3: a WebSocket

A WebSocket starts as a normal HTTP request that asks to upgrade. The real answer from our server is status 101:
```bash
curl -si -N -H 'Connection: Upgrade' -H 'Upgrade: websocket' -H 'Sec-WebSocket-Version: 13' \
  -H 'Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==' --max-time 1 localhost:8221/ws | head -4
```
```text
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```
After that, the same connection carries messages in both directions. The server uses the `ws` library: on a connection it logs; when a message arrives it reads it, and for a `read` message it sends back an `ack`; to publish it loops over every connected client and sends. In React, the same four ideas live in a hook (`lib/useSocket.ts`): `new WebSocket`, `onopen`, `onmessage`, and a cleanup that closes it. Open http://localhost:5221/ws, publish, and press Mark read. The page sends a message up and the server answers with an ack:
```text
15:10:06 ws connected (1 open)
15:10:07 publish #1 -> 0 sse, 1 ws
15:10:07 ws got {"type":"read","id":1}
15:10:08 ws closed (0 open)
```
The note first shows a "Mark read" button, then `read ✓`. That is the two-way part. (The last line shows the tab closing.)

### 5. Connections break: reconnect with backoff

When the socket closes, `useSocket` waits and opens a new one. The wait doubles each time: 1 second, 2, 4, up to 8. That is backoff; it stops thousands of pages hammering a server that has just come back. A `stopped` flag keeps the cleanup from reconnecting.
```ts
socket.onclose = () => {
  if (stopped) return;
  const wait = Math.min(1000 * 2 ** retry++, 8000);
  console.log(`socket closed, trying again in ${wait} ms`);
  setStatus("reconnecting");
  timer = setTimeout(open, wait);
};
```
Stop the server (Ctrl+C in Terminal 1) while `/ws` is open. The chip turns `reconnecting` (amber), and the browser console says:
```text
socket closed, trying again in 1000 ms
socket closed, trying again in 2000 ms
socket closed, trying again in 4000 ms
socket closed, trying again in 8000 ms
```
Each try is refused until the server is back. But look at the catch: restart the server, publish while the page is still waiting, and the page never hears it. A socket does not remember what you missed. `EventSource` reconnects by itself and even sends a `Last-Event-ID` header (in the video's log the new connection says `last id 1`). Our server does not use it, but a better one could send what was missed.

### 6. The fix: messages go into the query cache

`app/cache/page.tsx`. The socket no longer owns the list. A message calls `setQueryData` on the `["notifications"]` key, and every component that uses that key updates. On every open the socket calls `invalidateQueries`, which fetches the list again, so anything you missed arrives:
```tsx
socket.onopen = () => {
  retry = 0;
  setStatus("live");
  qc.invalidateQueries({ queryKey: ["notifications"] });
};
socket.onmessage = (e) => {
  const msg = JSON.parse(e.data);
  qc.setQueryData<Note[]>(["notifications"], (old = []) => [msg.note, ...old]);
};
```
Open http://localhost:5221/cache and publish: one message updates the bell and the list together with no extra request. Now the same break: publish #1, stop the server, start it, publish #2 while the page waits, and watch. After the socket comes back (one fetch) the page shows both:
```text
live | 2 | Notifications | Just now: Live Q&A starts at 6 pm | Live Q&A starts at 6 pm | Meera · #2 | Hooks in Depth is now live | Meera · #1
```
The badge says 2. Push for speed, fetch for the truth.

### 7. People who cannot see the page

`components/Panel.tsx` has a live region: an element with `role="status"` that is always on the page, and whose text changes with each message (module 16, lesson 3). Its real HTML before and after a message:
```html
<div role="status" class="strip"></div>
<div role="status" class="strip">Just now: Live Q&amp;A starts at 6 pm</div>
```
A screen reader reads the second one out. (We checked the accessibility tree, not a real screen reader.)

## Common mistakes

1. **Opening a socket and never closing it.** `/leak` does `new WebSocket(WS_URL)` in an effect with no cleanup. Go away (the "go away" link) and come back three times, then check how many connections the server counts for one visitor:
   ```bash
   curl -s localhost:8221/stats
   ```
   ```text
   {"sse":0,"ws":4}
   ```
   With the cleanup (`return () => ws.close()`, page `/clean`) the same visits end with `{"sse":0,"ws":1}`. Restart the server between the two tests.
2. **No reconnect.** A short network drop kills the live part of the page for good.
3. **Trusting every message.** Parse it carefully and check its shape (module 9, lesson 4: zod).
4. **A list that grows forever.** Keep only what you show; let the server hold the rest. (`List` shows the latest 3.)
5. **A WebSocket by reflex.** Polling is fine for rare news, SSE for one-way, a WebSocket for two-way. Many serverless hosts do not keep connections open, so check yours and run the socket server on its own.

## Clean up

```bash
# stop the page and the server (Ctrl+C in each terminal)
find live-app/.next -delete
find server/notes.json -delete
```
Delete the `node_modules` folders when you are finished.

## Next

[M22-L02 · Animations and Offline Apps](../m22-l02-animations-and-offline-apps/)

Try it yourself: change the polling time to 5 seconds and predict the requests. Then add a `clear all` message to the socket.
