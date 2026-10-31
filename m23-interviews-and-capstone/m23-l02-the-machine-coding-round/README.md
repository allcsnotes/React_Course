# M23-L02 · The Machine-Coding Round

> Video: Module 23, Lesson 2. Watch it first, then follow along here.

## What you'll learn

- What a machine-coding round is, and the five-step method: ask, write down the data, list the edge cases, plan accessibility, then code
- Task 1, a search box with suggestions: a pause (debounce), a cancel (`AbortController`), keyboard use and a combobox, and the race bug in the naive version
- Task 2, an endless list: an `IntersectionObserver`, a sentinel, a "loading" flag and a cleanup
- Task 3, a star rating: a radio group with one tab stop, the roving `tabIndex`, arrow keys, hover preview
- Task 4, nested comments: recursion, collapse with a count, and an update that makes a new tree
- A checklist to say out loud in the room

## Before you start

- Node 24 (`node --version`) and a browser. No Docker.
- Best after M23-L01 (the 50 questions) and M16-L03 (accessibility), M7 (effects), M11-L04 (intersection observer).
- The practice API (`api/server.mjs`, port 8232) is a local stand-in. Every answer takes a random time, 150 to 1200 ms; `SEED=<number>` makes the random times repeat. The video used seed 3 for the search box (the answer for "p" takes 906 ms, for "py" 190 ms) and seed 29 for the list (every answer 300 to 560 ms).
- This lesson is a narrated build, not a timed run. There is no clock in the video, and none here. The first time you will be slower, and that is normal. Use a real clock when you practise. One rule for the whole round: first make it work, then make it better.

## Key ideas

- A machine-coding round: a small task for a screen, an editor, a browser and a time limit (30 to 60 minutes). Nobody wants a clever trick. The interviewer watches how you work, and whether it runs. Think of a driving test: it is about the mirrors, the signals and the checks.
- The method, in this order: **1. ask questions**, **2. write down the data** (the smallest facts), **3. list the edge cases** (empty, slow, broken, huge), **4. plan accessibility** (keyboard, screen reader), **5. code**. Say your time plan out loud. The budgets used here: search box 45 minutes (about 8 for questions and plan, 22 for code, 15 for the keyboard and edge cases), endless list 35, star rating 30, comment box 45.

## Files in this folder

| File | What it is |
|------|------------|
| `api/server.mjs` | The practice API: `/search?q=`, `/feed?page=`, `/__admin/log`, `/__admin/reset?seed=` |
| `mc/` | One Vite + React 19 project with nine small pages (open them from the dev server) |
| `mc/src/Autocomplete.jsx` | Task 1, the final search box |
| `mc/src/bad/AutocompleteNaive.jsx` | Task 1 mistake: no pause, no cancel |
| `mc/src/bad/AutocompleteOneState.jsx` | Task 1 mistake: one state for the text and the query |
| `mc/src/InfiniteList.jsx`, `mc/src/bad/InfiniteNoGuard.jsx` | Task 2, and the version without the "already loading" flag |
| `mc/src/StarRating.jsx`, `mc/src/bad/StarsDiv.jsx` | Task 3, and the version made of `div` tags |
| `mc/src/Comments.jsx`, `mc/src/bad/CommentsEmpty.jsx`, `mc/src/data.js` | Task 4, and the version that accepts an empty reply |
| `mc/src/entries/*.jsx`, `mc/*.html` | One entry and one page per version |

## Run it

```bash
node api/server.mjs          # terminal 1: practice API on http://localhost:8232
```
```bash
cd mc                        # terminal 2
npm install
npm run dev                  # http://localhost:5232
```
The pages are `http://localhost:5232/autocomplete.html`, `autocomplete-naive.html`, `autocomplete-onestate.html`, `scroll.html`, `scroll-noguard.html`, `stars.html`, `stars-div.html`, `comments.html` and `comments-empty.html`. (`npm run build` is not used: the pages are opened from the dev server.) Restart the API with `SEED=3 node api/server.mjs` to repeat the video's search-box numbers. You can also reset the numbers without restarting: `curl localhost:8232/__admin/reset?seed=3`; the log of requests is at `curl localhost:8232/__admin/log`.

## Task 1 · The search box (45 minutes)

**Bug first.** Many people build a box that asks the server after every key. Open `autocomplete-naive.html` (restart the API with `SEED=3`), click the box, type `p`, wait 0.1 s, type `y`. The answer for `p` is slow (908 ms), the answer for `py` fast (192 ms). First the list shows the Python courses (the right answer for `py`); then the slow answer for `p` arrives and the list changes to six courses, with Docker and FastAPI in it. The box says `py`, but the list answers `p`. The server's own log shows the order:
```text
search q=p | done | 908 ms
search q=py | done | 192 ms
```
This is a **race condition** (M7-L5): the answers arrive in a different order than the questions. Real final list in the naive page: `Python from Zero | Python Basics | Docker for Developers | FastAPI in Practice | Async Python | Python Performance`.

**1. Ask.** How many suggestions? Six at most. When does it search? After the user stops typing, about 250 ms. Which keys? Arrow up and down, Enter to pick, Escape to close. When the server fails or finds nothing? A short message.

**2. Data.** Six facts: `text` (what the box shows), `query` (what the user typed), `items`, `status` (`idle`, `loading`, `done`, `error`), `active` (the active row) and `open`. Why both text and query? When the user picks a course, the box shows its title, but we must not search for that title.

**5. Code.** One effect holds the whole idea (`src/Autocomplete.jsx`): it runs when the query changes; an empty query clears the list; otherwise make an `AbortController` and start a 250 ms timer. If the user types again before it rings, the cleanup clears the timer (debounce). When it rings, set `loading`, fetch with the controller's signal, throw if the answer is not ok, keep the items, set `done`. The catch ignores the abort error, because we cancelled on purpose. The cleanup does two jobs: clears the timer and cancels the request.
```jsx
useEffect(() => {
  const q = query.trim()
  if (!q) { setItems([]); setStatus('idle'); return }
  const controller = new AbortController()
  const timer = setTimeout(async () => {
    setStatus('loading')
    try {
      const res = await fetch(`${API}/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
      if (!res.ok) throw new Error('bad status')
      setItems((await res.json()).items)
      setStatus('done')
    } catch (e) {
      if (e.name !== 'AbortError') setStatus('error')
    }
  }, 250)
  return () => { clearTimeout(timer); controller.abort() }
}, [query])
```
`onChange` sets the text and the query, resets the active row and opens the list; `pick` puts the title in the box and closes the list. The key handler: with no items do nothing; ArrowDown moves to the next row and wraps to the first after the last; ArrowUp does the opposite; `preventDefault` stops the cursor from jumping; Enter picks the active row; Escape closes. The markup: the input is `role="combobox"` with `aria-expanded`, `aria-controls="list"` and `aria-activedescendant` naming the active option (so a screen reader announces it while focus stays in the box); the list is `role="listbox"` and every item `role="option"` with a `key` from the course id and `aria-selected`; `onMouseDown` picks, because it runs before the box loses focus.

**Real runs.** Type `react`, five letters, 80 ms apart: the network log shows one request, not five:
```text
search q=react | done | 908 ms
```
Then the three React courses appear. Now the case from the start (final code, seed 3): type `p`, wait, then type `y`. Guess what happens to the request for `p`:
```text
search q=p  | closed by the browser | 653 ms     (it would have taken 906 ms)
search q=py | done | 191 ms
```
The browser cancelled the request for `p` and only one answer ever reached the page; the list is right (the Python courses). (The 653 ms is how long the request had been waiting when the cleanup cancelled it; yours differs.) The keyboard test: type `re`, press ArrowDown (`aria-activedescendant` is `opt-0`), ArrowDown again (`opt-1`), Enter: the title `React Hooks in Practice` goes in the box and the list closes (`aria-expanded` is `false`).

**A mistake that hides.** `autocomplete-onestate.html` has one state only: the text is also the query. Pick a course with the keyboard, then look at the network log: after Enter, one more request, for the whole title, which nobody asked for:
```text
search q=re | done | 908 ms ; search q=react for beginners | done | 192 ms
```
**Edge cases to say out loud:** empty box, no results, server error, spaces at the ends, a very fast typist, a click outside to close. If time is left: highlight the matching letters and remember the last searches.

## Task 2 · The endless list (35 minutes)

**1. Ask.** How many items in one page? Ten. Is there an end? Yes, the server says so. A failed load? A retry button. A scroll event? No: the browser can tell us when the end of the list is in view.

**Picture.** A conveyor belt at a shop till: you keep working, and the belt brings more. Put a small marker, a **sentinel**, at the very bottom of the list. `IntersectionObserver` tells us when the sentinel comes into view; then we load the next page.

**2. Data.** The items so far, the next page number, a status (`idle`, `loading`, `error`, `end`), and two refs: the sentinel element, and a flag `loading` that says a request is already on its way. In `src/InfiniteList.jsx`, `loadMore` first checks the flag and the status, then sets the flag and status, logs the page (so we can see it), fetches, adds the items after the old ones with spread, takes the server's next page, and clears the flag. The observer is made in an effect with `rootMargin: '200px'` (start early), observes the sentinel, and the cleanup disconnects it:
```jsx
useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) loadMore()
  }, { rootMargin: '200px' })
  observer.observe(sentinel.current)
  return () => observer.disconnect()
}, [page, status])
```
**Real run** (`scroll.html`, seed 29). The page opens, the guard is in view, page 1 loads by itself. Ten rows push the guard below the window, so it stops. Scroll to the bottom and wait, again and again. Console:
```text
load page 1
load page 2
load page 3
load page 4
load page 5
50 lessons loaded        (the sentinel says: That is all)
```
Fifty lessons, five requests. **Mistake:** `scroll-noguard.html` has no flag. The first load changes the status, the effect runs again, and the new observer says "the guard is in view" again:
```text
load page 1 / load page 1 / load page 2 / load page 2 / Encountered two children with the same key ...
```
(40 lessons for 20 rows' worth of requests, and errors in the console: two children with the same key.) The flag is not decoration; it is the safety. **Edge cases:** empty first page, error in the middle, the end, a very fast scroller. After thousands of rows the page gets heavy: that is virtualization (M15-L4).

## Task 3 · The star rating (30 minutes)

**1. Ask.** How many stars? Five, but a prop (`max`). Half stars? Not now. Can the user take the rating back? Yes, by clicking the same star again. A mouse preview? Yes. The keyboard? Yes, that is a must.

**2. Data.** Only two facts: `value` (0 to 5) and `hover` (0 when the mouse is away). What the screen shows is `hover || value`: computed, not a third state.

**4. Accessibility plan.** A star rating is a group of choices where one is chosen: a **radio group**. Each star is a real `<button role="radio" aria-checked>`. The group is one tab stop, the roving `tabIndex`: the chosen star has `tabIndex={0}` and the others `-1` (or the first star when nothing is chosen). Arrow keys move and choose.

**Code** (`src/StarRating.jsx`). A small table in the key handler: ArrowRight and ArrowUp give the next star, ArrowLeft and ArrowDown the previous one, Home gives 1, End gives `max`; a key not in the table is ignored; otherwise `preventDefault`, keep the number between 1 and `max`, set the value, and move focus to that star with a list of refs. A click chooses the star, or clears it when it was already chosen (`setValue(i === value ? 0 : i)`); hover sets the preview.

**Real keys** (`stars.html`): Tab: one stop, focus on the first star, none is checked (`00000`). ArrowRight: two stars (`01000`). ArrowRight: three. End: five. Home: one. Tab again: the focus leaves the whole group in one press. **Real mouse:** hover the fourth star: four are gold, but the rating is still what it was (`10000`); click: the rating is four (`00010`); click the same star again: cleared (`00000`). What a screen reader gets, as a real accessibility snapshot:
```text
- radiogroup "Course rating":
  - radio "1 star" [checked]: ★
  - radio "2 stars": ★
  - radio "3 stars": ★
  - radio "4 stars": ★
  - radio "5 stars": ★
```
**The mistake:** `stars-div.html` has five `div` tags with a click handler. It looks the same and the mouse works. But Tab does nothing (the focus stays on `BODY`), the arrow keys do nothing, and the snapshot is only text: `★ ★ ★ ★ ★`. For a keyboard user or a screen reader user, this component does not exist.

## Task 4 · Nested comments (45 minutes)

**1. Ask.** How deep can replies go? Any depth. Can a comment collapse, and does it say how many replies it hides? Yes. Does a reply open a small form under the comment? Yes. Empty replies? Not allowed. Does it save? No, memory only.

**2. Data.** Every comment has an `id`, an `author`, a `text` and a list of `replies`, and every reply is itself a comment: a tree (`src/data.js`). There are two ways to keep it: nested, or a flat list where each comment names its parent. Nested is easier to draw, flat is easier to update. We choose nested, because the screen is the tree.

**Recursion.** A comment component draws its replies by drawing comment components, like Russian dolls; a comment with an empty list of replies draws nothing more. Two helpers in `src/Comments.jsx`: `count` adds up all the hidden replies (for each reply, 1 plus the count of that reply's own replies), and `addReply` walks the tree and returns a **new** tree (the old one is never changed):
```jsx
const count = c => c.replies.reduce((n, r) => n + 1 + count(r), 0)

function addReply(list, parentId, reply) {
  return list.map(c => c.id === parentId
    ? { ...c, replies: [...c.replies, reply] }
    : { ...c, replies: addReply(c.replies, parentId, reply) })
}
```
Each `Comment` keeps its own three facts: is it open, is the reply form showing, and the reply text. `submit` stops the page reload, ignores an empty text, calls the function from above with this comment's id, then clears the text, closes the form and opens the comment so the new reply is visible. The recursion in the markup: when open, `node.replies.map(r => <Comment key={r.id} node={r} onReply={onReply} />)`.

**Real run** (`comments.html`). Press Reply under a comment: the form opens and the focus is already in the input (`autoFocus`). Type `you are welcome` and press Enter: the reply appears at the end of that comment's replies, one level under it. Collapse a comment: the button now says `Show 2 replies`; collapse another: `Show 4 replies`, a count of every level. Show them again, and everything is back.

One honest detail: when the first comment closes, its replies leave the page, and their own state goes with them. A reply comment you had collapsed is open again. To remember it, hide with CSS instead, or keep all the open flags in one place. Say this out loud in the room: it shows that you understand state.

**The mistake:** `comments-empty.html` has no check for an empty text. Press Reply, then Send with nothing typed: a comment with an author and nothing else is added (`Asha | Reply` in the list). The guard is one line: `if (!text.trim()) return`. Two more mistakes to know: a `key` equal to the index mixes up the state of comments when the list changes (M14-L2), and changing the old tree in place (M4-L4).

## The checklist (say it out loud in the room)

- **Before the code:** ask the questions, write the data, list the edge cases, plan the keyboard.
- **While you code:** small and working first. Name the state. A cleanup in every effect. Keys on every list. Real elements, not `div` tags. A message for loading, empty and error.
- **Before you say done:** test with the keyboard. Test the empty, the slow and the broken case. Then say what you would add with more time: highlighting, virtualization, half stars, saving to a server.
- What each task proved: the search box, a pause and a cancel (shown with a network log); the endless list, an observer, a flag and a cleanup; the star rating, a radio group with one tab stop; the comment box, recursion and an update that makes a new tree.

## Common mistakes

1. No pause and no cancel in a search box (task 1).
2. One state for the box text and the query (task 1).
3. An observer without an "already loading" flag (task 2).
4. `div` tags with `onClick` instead of real buttons (task 3).
5. No check for an empty reply (task 4).
6. Not saying the edge cases out loud.

## Clean up

```bash
# stop the API and the dev server (Ctrl+C in each terminal)
```
Delete `mc/node_modules` when you are finished.

## Next

Interview tip: if Rahul asks "how do you stop a slow old request from replacing a new result?", answer: wait for a pause with debounce, and cancel the old request with an `AbortController` in the cleanup of the effect, and ignore the abort error. Debounce sends fewer requests; the cancel guarantees the order.

Try it yourself: set a timer for 30 minutes and build the star rating from an empty file. Then do the keyboard test with the mouse put away.

[M23-L03 · Frontend System Design](../m23-l03-frontend-system-design/)
