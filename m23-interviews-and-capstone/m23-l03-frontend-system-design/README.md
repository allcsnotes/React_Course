# M23-L03 · Frontend System Design

> Video: Module 23, Lesson 3. Watch it first, then follow along here.

## What you'll learn

- A seven-step method for a frontend design round: requirements, data and API, component tree, state, performance and caching, accessibility, failure modes
- Design 1, a news feed: a cursor instead of page numbers, a virtual list, an optimistic like that rolls back, and a feed that keeps what it has when a page fails
- Design 2, a video player page: segments, one state value for the player, a year of cache for files that never change, and the keyboard
- Design 3, a dashboard: small endpoints, averaged data, the range in the address, polling, and a frame for every widget so one failure stays alone
- Three mistakes from real candidates, and how to answer with numbers and reasons

## Before you start

- Node 24 (`node --version`) and Chrome or another browser. ffmpeg only for the video-player demo (to make the 60 second test video, see below).
- Best after M23-L01 and M23-L02, M11 (TanStack Query), M15-L4 (virtual lists), M16-L3 (accessibility), M21-L1 (caching headers).
- Everything runs on your computer: a Vite page on port 5233 and a practice API on port 8233 (plain Node, no packages). Nothing is deployed. The numbers belong to this test on one laptop, not to every app.

## Key ideas

Think of planning a restaurant before anyone cooks: who will eat here, how many, how fast; the menu and how an order reaches the kitchen; the stations; who remembers what; what happens when the grill breaks. A page is the same. Seven questions, always in this order:

1. **Requirements:** what must the screen do, and how well?
2. **Data and API:** what does the data look like, and how does the page ask for it?
3. **Component tree:** which pieces is the page made of?
4. **State:** where does each piece of information live (server cache, local state, the address)?
5. **Performance and caching:** what gets slow, and what can be kept?
6. **Accessibility:** can it be used with a keyboard and a screen reader?
7. **Failure modes:** what can break, and what does the person see?

Two habits make it work: ask questions out loud before you draw anything and write the answers down; and use numbers, even rough ones (10,000 posts, a one minute video, four live counters). A design with no numbers cannot be wrong, and that is not a good thing.

## Files in this folder

| File | What it is |
|------|------------|
| `api/server.mjs` | The practice API: feed (cursor and offset), likes, video details and segments, dashboard endpoints, and test switches (`/api/_set?failLike=1`, `failPage=`, `failManifest=1`, `failWidget=`, `reset=1`) |
| `api/make-media.sh` | Makes the 60 second test video (10 segments of 6 seconds), a playlist and one caption with ffmpeg |
| `web/src/Feed.tsx`, `PostCard.tsx`, `useLike.ts` | Design 1: infinite query, virtual list, optimistic like |
| `web/src/FeedOffset.tsx` | The same feed with page numbers (the mistake) |
| `web/src/Watch.tsx` | Design 2: hls.js, the player reducer, keyboard |
| `web/src/Dashboard.tsx` | Design 3: four widgets, the range in the address |
| `web/src/api.ts`, `main.tsx` | Fetch helpers; which page shows at which address |

## Run it

```bash
sh api/make-media.sh        # needs ffmpeg; makes api/media (about 6 MB, not kept in the repository)
node api/server.mjs         # terminal 1: practice API on http://localhost:8233
```
```bash
cd web                      # terminal 2
npm install
npm run dev                 # http://localhost:5233
```
Pages: `/` (the feed, `?mode=virtual` or `?mode=plain`), `/offset` (page numbers), `/watch` (the video page), `/dashboard`.

## Design 1 · The news feed

**1. Requirements.** Asha does not draw yet; she asks. Who sees what? The latest posts of the people you follow. What can a reader do? Scroll without end, and like a post. How well? The first posts must show fast, scrolling must stay smooth even after a very long session, and a like must feel instant.

**2. Data and API.** A post is a small object: id, author, text, like count, and whether I liked it. How does the page ask for more? Page numbers are the simple way, but a feed changes while you read. Real run (the API starts with 10,000 posts, newest first):
```text
page 1 last post id: 9981
(a new post arrives)
OFFSET page 2 starts with: 9981     (the post she already read)
CURSOR page 2 starts with: 9980
```
The new post pushed everything down by one place, so the list moved under her. A cursor works like a bookmark: continue after 9981. In code the cursor is the last id we received; the API answers with the posts and the cursor for the next page, and `useInfiniteQuery` (M11-L4) keeps all pages in one box (`Feed.tsx`):
```tsx
const feed = useInfiniteQuery({
  queryKey: ['feed'],
  queryFn: ({ pageParam }) => fetchFeed(pageParam),
  initialPageParam: null as number | null,
  getNextPageParam: (last) => last.nextCursor,
})
```
The `/offset` page uses page numbers (`FeedOffset.tsx`). In the video, once a new post arrived, React logged "Encountered two children with the same key" because the same post was on the screen twice (mistake 1 below).

**3. Component tree.** Name every box by its job: `Feed` page holds the `Feed`; the feed holds a list of `PostCard`s; each card holds the author line, the text and a `LikeButton`. At the bottom, one more row: "try again" when loading fails.

**4. State.** Ask three questions about every piece of information. Does it come from the server? Server state, in a cache (TanStack Query). Is it only for one component, like a text being typed? Local state. Should it survive a reload or be shared by link? Put it in the address. The list and the likes are server state.

**5. Performance.** A reader who keeps scrolling loads page after page. Real run: scroll through 1000 posts (50 pages).
```text
VIRTUAL | feed requests: 50 | articles in the DOM: 9    | all elements in the page: 96
PLAIN   | feed requests: 50 | articles in the DOM: 1000 | all elements in the page: 9006
```
(The video measured 9,015 elements for a plain list and 105 for the virtual one; your numbers are close.) A virtual list (`useVirtualizer` from TanStack Virtual, M15-L4) draws only the posts in the window. Open `/?mode=plain` to see the plain list.

The like button is a matter of feeling, not speed: the server takes 800 ms here. Waiting would make the button feel broken, so use an optimistic update (M11-L3): change the count first and ask the server after (`useLike.ts`).
```text
before:                    ... ♥ 4
50 ms after the click:     ... ♥ 5
after the server answered: ... ♥ 5
```
And when the server says no (switch it with `curl "localhost:8233/api/_set?failLike=1"`)? The count goes up at once, then goes back:
```text
FAIL before:        ... ♥ 4
FAIL 60 ms:         ... ♥ 5
FAIL after ~1 s:    ... ♥ 4
```
Two small pieces of code do it: `onMutate` keeps a copy of the old list and changes the count; `onError` puts the copy back. Switch it off again with `failLike=0`.

**6. Accessibility.** Ask the browser what it sees (M16-L3). The feed is named Posts (`role="feed"`), each post is an `article` named by its author, and the like button is named Like and says pressed after the click:
```text
- article "Asha":
  - strong: Asha
  - text: post 10000
  - paragraph: Finished the lesson on state today
  - button "Like" [pressed]: "5"
```
A virtual list removes posts from the page, so keep the list roles and a stable order, and let the keyboard move through what is drawn.

**7. Failure modes.** Make page two fail (`curl "localhost:8233/api/_set?failPage=9981"`, 9981 is the cursor of page two). The posts she already has stay on the screen, and a row at the bottom says `Could not load more posts.` with a Try again button. One failure must never erase what the reader already has. Switch the server back on (`failPage=-1`) and press the button: the alert goes away and the list continues.

## Design 2 · The video player page

**1. Requirements.** Play a lesson, pause, jump to any second, show captions. Start fast even on a slow phone, never download the whole lesson, keep working when one piece fails, and be usable with the keyboard.

**2. Data and API.** Three things: the details (title, teacher, length, address of the manifest), the **manifest** (a small list of the pieces of the video, called segments, six seconds each), and the **segments** (the real video bytes). Guess: the 60 second test lesson has 10 segments, numbered 0 to 9. Asha drags the slider to second 40. Which segment is asked for first, and how many?
```text
after the jump to 40 s: /media/v1/seg-006.ts /media/v1/seg-007.ts /media/v1/seg-008.ts /media/v1/seg-009.ts
```
Segment 6, because second 40 is inside the seventh piece (counting from zero), then 7, 8 and 9: four requests. Segment 5, between where it had played and where Asha jumped, was never asked for. The player downloads only what it needs.

**3. Component tree.** The watch page holds the player, the title block, the lesson list and the comments. Inside the player: the video element, the controls and a status line. The page and the player do not know each other's insides; the page hands the player a video, and the player says what is happening.

**4. State.** The player is always in one of five situations: `loading`, `paused`, `playing`, `buffering` (waiting for more data) or `error`. Not five switches, but one value, with allowed moves between them: a small state machine written with a reducer (M10-L3), in `Watch.tsx`:
```ts
function reduce(_status: Status, action: Action): Status {
  switch (action) {
    case 'ready': return 'paused'
    case 'play': return 'playing'
    case 'pause': return 'paused'
    case 'wait': return 'buffering'
    case 'fail': return 'error'
    case 'retry': return 'loading'
  }
}
```
With five switches you could be playing and in error at the same time. With one value, you cannot.

**5. Caching** (M21-L1). A segment never changes, because its name says which piece it is: `cache-control: public, max-age=31536000, immutable`. The manifest could change, so `max-age=60`. The details are `no-cache` with an `etag`, so the answer is a quick `304`. The server sets exactly these (see `api/server.mjs`); check with `curl -sI localhost:8233/media/v1/seg-000.ts`. Why does the player not load all ten segments? One option of hls.js: `maxBufferLength: 20` means load about 20 seconds ahead, then stop. Little is wasted when the viewer leaves, and nothing waits when they stay.

**6. Accessibility.** A video player is a custom widget, so the browser gives you nothing for free. Real run: Tab moves the focus to the group named `Video player`; the key `K` starts the video and the status says `playing`; ArrowRight jumps ahead:
```text
Tab focus: Video player
after K: playing | time: 2 s
after ArrowRight: 7 s
after K again: paused
```
There is a visible focus outline, a caption track, and a status line with `role="status"`.

**7. Failure modes.** Make the manifest disappear (`curl "localhost:8233/api/_set?failManifest=1"`, then reload `/watch`). A black box would tell Asha nothing; the page says:
```text
Closures, part one | Play | 0 s | This video could not be played. | Try again
```
Fix the server (`failManifest=0`), press Try again, and the status is `paused`: the player is ready. The error belongs to the player, not to the whole page.

## Design 3 · The dashboard

**1. Requirements.** Meera, the instructor, opens it every morning. It must show requests per second over a day, revenue today, the top courses, and learners online right now. It must open fast, never show a blank page because one number failed, and stay up to date without a refresh.

**2. Data and API.** Four widgets, four small endpoints, not one huge call: a slow number must not hold back the fast ones. The chart is the dangerous one: a day of one reading per second is 86,400 points. Real run (the same day of data):
```text
raw points JSON bytes: 335715 | averaged 288 points JSON bytes: 1149 | raw count: 86400
```
Does it matter on the screen? With the averaged points (`?points=288`, one point per five minutes) the chart is just as readable. The line's path description is 3,116 characters; with the raw points (`/dashboard?points=raw`) it is far longer (the video measured 934,577 characters against 3,116) and the chart appeared much later.

**3. Component tree.** The dashboard holds a range picker and a grid. The grid holds four widgets. Every widget is the same small component, a frame with a title and three possible insides: loading, error, and the data (`Widget` in `Dashboard.tsx`). One frame, written once. Inside it go the chart, a big number, a list, and a counter.

**4. State.** The time range belongs in the address. Real run: click Last hour, and the address becomes:
```text
/dashboard?range=1h
```
Reload the page: still Last hour (`aria-pressed` is `true`). And Meera can send that link to Priya, who sees the same view.

**5. Staying fresh.** Learners online must move by itself. The simplest answer is polling: `refetchInterval: 5000`. Real log: one request when the page opens, then three more in the next sixteen seconds (we saw four in all). Polling is simple, and enough for four numbers. If a number must change in a split second, use server-sent events or a WebSocket (M22-L1). With a framework (M19-L4) the server sends the title and the grid at once and streams the slow widgets later, behind a Suspense placeholder, so the reader sees a page, not a blank screen.

**6. Accessibility.** A chart is a picture, and a screen reader cannot read a picture. Give it a name that holds the important numbers:
```text
Requests per second, 288 points, lowest 69, highest 356
```
(`role="img"` with an `aria-label`; the numbers are different for you if you change the data.)

**7. Failure modes.** The star of every dashboard: one widget fails. Make the revenue service fail (`curl "localhost:8233/api/_set?failWidget=revenue"`), then reload:
```text
Revenue today  revenue service is down  Retry
Top courses  Closures, part one 1840 ... 
Learners online  130
```
The revenue widget says so, with a Retry button. The chart, the list and the counter keep working. Switch the server back (`failWidget=`), press Retry, and the number comes back: `Revenue today $4,820`. If one failed number broke the whole page, Meera would see nothing.

## Common mistakes (from real candidates)

1. **Page numbers in a feed that changes.** After a new post arrives, page 2 starts with a post you already read (see Design 1). Use a cursor.
2. **Designing only the happy path.** With no loading, no empty list and no error you have designed a third of the screen (M9-L3: loading, empty, error, data). Say them out loud for every widget.
3. **No numbers and no reasons.** Say: "ten thousand posts, so I use a virtual list." Say: "polling is enough for four counters, but for a chat I would choose a WebSocket." A decision with its reason is worth more than a long list of tools.

## Try it yourself

Pick one page of a site that you use every day. Answer the seven questions on a single sheet of paper, and put a number in at least three of the answers.

**Interview tip.** If Rahul asks "design a news feed, what do you do first?": ask what it must do and how well, give rough numbers, and only then draw. Walk the seven steps and go deeper where he points. Also say what you will skip.

## Clean up

```bash
# stop the API and the dev server (Ctrl+C in each terminal)
find api/media -delete
```
Delete `web/node_modules` when you are finished.

## Next

[M23-L04 · Mock Interview and Roadmap](../m23-l04-mock-interview-and-roadmap/)
