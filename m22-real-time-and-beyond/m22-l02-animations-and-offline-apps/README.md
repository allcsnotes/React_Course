# M22-L02 · Animations and Offline Apps

> Video: Module 22, Lesson 2. Watch it first, then follow along here.

## What you'll learn

- Motion that helps: a card that fades in, leaves with a fade, and lets the others slide into place (`motion.li`, `AnimatePresence`, `layout`)
- Why Motion uses a spring by default, and what a stagger is
- Why you animate `transform` and `opacity` and not `left`, `top`, `width` or `height`
- How to respect the visitor's "reduce motion" setting with one wrapper
- A progressive web app: a manifest plus a service worker
- Three service-worker plans (cache first, network first, stale while revalidate), and why offline works on the second visit, not the first

## Before you start

- Node 24 (`node --version`) and Chrome. No Docker.
- Best after M15-L01 (the 16 ms picture), M16-L03 and M19 (Next.js).
- Everything runs on your computer: the practice API (`api/server.mjs`, port 8222) is a local stand-in, and the Next.js 16.4.3 app runs on port 5222. I could not run an iPhone: where a phone differs, the README says so.
- The numbers about frames and layouts in steps 2 to 4 were measured in the video with Chrome's own tools. The pages to repeat them are in this folder (`/bench`, `/plain`), but the numbers are not re-measured in this README.

## Files in this folder

| File | What it is |
|------|------------|
| `api/server.mjs` | The practice API: `GET /api/courses` returns `{ servedAt, courses }` (3 courses) |
| `pwa-app/components/Catalog.tsx` | The animated course list: Motion props, a Hide button, an online/offline bar |
| `pwa-app/components/PlainCatalog.tsx`, `pwa-app/app/plain/page.tsx` | The same list with no motion (cards jump) |
| `pwa-app/components/Bench.tsx`, `pwa-app/app/bench/page.tsx` | Two boxes: one animates `left`, one animates `x` |
| `pwa-app/components/Providers.tsx` | `MotionConfig reducedMotion="user"` and the service worker registration |
| `pwa-app/components/RegisterSW.tsx` | `navigator.serviceWorker.register('/sw.js')` in an effect |
| `pwa-app/public/sw.js` | The service worker: install, activate, fetch with two plans |
| `pwa-app/app/manifest.ts` | The web app manifest (served as `/manifest.webmanifest`) |
| `pwa-app/public/icon-192.png`, `icon-512.png` | The two icons (a blue square with an A) |

## Follow along

### 1. Install and start

```bash
node api/server.mjs
```
(in one terminal), then in another:
```bash
cd pwa-app
npm install
npm ls motion --depth=0
npm run build
npm run start -- -p 5222
```
```text
`-- motion@14.9.0
```
The build lists `/`, `/bench`, `/manifest.webmanifest` and `/plain`. Motion is one package (`npm install motion`), and the React part lives at `motion/react`. Open http://localhost:5222.

### 2. Motion: initial, animate, transition

`components/Catalog.tsx` starts with `'use client'` (Motion needs the browser) and imports `motion` and `AnimatePresence` from `motion/react`. Instead of `<li>` it writes `<motion.li>`: an ordinary list item that can move.
```tsx
<motion.li
  key={c.slug}
  className="card"
  layout
  initial={{ opacity: 0, y: 24 }}
  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
  exit={{ opacity: 0, scale: 0.8 }}
  transition={{ duration: 0.35 }}
>
```
- `initial`: where it starts, invisible and 24 pixels lower.
- `animate`: where it goes, fully visible and in place.
- `transition`: how it gets there. The `delay: i * 0.1` is the stagger: the first card waits nothing, the second a tenth of a second, the third two tenths. The list arrives like a wave, not like a thump.

Guess: does the card move in a straight line, and does it stop exactly at its place? No. Motion moves things with a spring by default, like a ball on a rubber band: the card goes a little past its place and comes back, while the fade uses a plain curve. In the video's recording, at about 60 ms the first card was 0.37 visible and 7 pixels too low; at about 130 ms opacity 0.73 and already 2.3 pixels too high; the movement dips to minus 2.8 pixels and settles. You can change both with `transition`. In a real app, keep it small.

### 3. Leaving and sliding: AnimatePresence and layout

First the plain list. Open http://localhost:5222/plain and press Hide on the first card: in one single picture the cards go from three to two, and the others jump up by 83 pixels. There is nothing to animate, because React removed the card at once.

In `Catalog.tsx`, two additions fix that. `AnimatePresence` keeps a removed card on the page a little longer, so its `exit` prop can run (fade to zero and shrink to 80%). The `layout` prop makes Motion measure where a card was and where it is now, and slide it between the two, with no maths from you. Press Hide on http://localhost:5222/:
```text
Hide: card gone after ~ 379 ms
My lessons | Online · data from 15:16:53 (saved copy) | Python from Zero | Meera · beginner | Hide | SQL in Two Weeks | Asha · intermediate | Hide
```
(The time is different on your computer; the video measured about 340 ms.) First the fade, then the slide: the card stays about a third of a second, fading and shrinking, then the cards go from three to two and the others glide 83 pixels to their place in about 350 ms. The numbers are `opacity` and a `transform`, not `top` or `height`. That is no accident.

### 4. Why transform and opacity

A picture lasts about 16 ms, and an animation must finish its work in each one. For each picture the browser may do three jobs: layout (sizes and places), paint (colour the pixels), composite (slide finished layers). Changing `left`, `top`, `width` or `height` starts again from layout every picture. `transform` and `opacity` can skip layout and paint.

`/bench` has a page with 3000 rows and two boxes; `components/Bench.tsx` animates `left` in one lane and `x` (a transform) in the other, same distance and same one second. The video asked Chrome's counters (five runs each, the middle result kept):
```text
animate left:  61 layouts, 65 style recalculations, main thread busy 67 ms
animate x:      1 layout,  10 style recalculations, main thread busy  9 ms
```
(Measured in the video, not re-run here.) Honest reading: the layout time itself was only about 2 ms, because the box is alone in its lane, and timings change from run to run. On a real page, a layout can move many boxes, and each costs more. The rule: move with `x`, `y`, `scale`, `rotate`, and fade with `opacity`.

### 5. Respect "reduce motion"

For some people, things that slide and bounce are uncomfortable, even dizzying. Phones and laptops have a setting, "reduce motion", and the browser tells every page (`prefers-reduced-motion`). In Motion one wrapper listens, once, at the top of the app (`components/Providers.tsx`, used by the layout):
```tsx
<MotionConfig reducedMotion="user">
  <RegisterSW />
  {children}
</MotionConfig>
```
With the setting on, the card never moves (its transform is `none` from the second picture on), but the fade still works in the same time. Remove the travelling, keep the information. To try it, switch on "Reduce motion" in your system accessibility settings (or in Chrome DevTools: Rendering, "Emulate CSS media feature prefers-reduced-motion") and reload.

### 6. The manifest

`app/manifest.ts` is the small file that says "this website is an app": a name, a short name for the icon, `start_url`, `display: 'standalone'` (no browser bars), two colours, and icons in two sizes. Next.js serves it as `/manifest.webmanifest`. Chrome can tell you if it accepted it (DevTools, Application, Manifest). With a normal profile, the video's real answer was: the manifest was read with no errors, `display` is `standalone`, two icons (192x192, 512x512), and the list of reasons why the app could not be installed was empty. (A private or automated browser window adds one reason, `in-incognito`.)

### 7. The service worker

`public/sw.js` is served from the top of the site, so it can watch every page. The page asks the browser to run it with one line in an effect that runs once (`components/RegisterSW.tsx`): `navigator.serviceWorker.register('/sw.js')`. A worker wakes up for events:
```js
const CACHE = 'allcs-v1'

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(['/'])))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})
```
`install` happens once, when the file is new: fill the first shelf (a named cache) with the home page; `skipWaiting` means "do not wait for old tabs". `activate` happens when the worker takes charge: delete every shelf that is not the current one, and claim the open pages.

The third event, `fetch`, runs for every request, and the worker chooses the answer. Three classic plans: cache first (shelf first, network only if missing; best for files that never change), network first (network first, shelf if it fails; best for data that changes), and stale while revalidate (serve the shelf at once, refresh it in the background). Our file:
```js
self.addEventListener('fetch', (event) => {
  const req = event.request
  const url = new URL(req.url)
  if (req.method !== 'GET') return
  if (url.pathname.startsWith('/_next/static/')) event.respondWith(cacheFirst(req))
  else if (url.port === '8222' || req.mode === 'navigate') event.respondWith(networkFirst(req))
})
```
`cacheFirst` opens the shelf, returns a hit if there is one, otherwise fetches, puts a copy on the shelf, and returns it. `networkFirst` tries the network, puts a copy on the shelf and returns it; if the network fails, the `catch` looks on the shelf, throws if nothing is there, and otherwise returns the saved copy with one extra header, `x-from-cache: yes`. That mark lets the page say honestly that the data is a saved copy.

### 8. Three visits

Guess: Lukas visits once, reloads while online, then goes offline and reloads. Which visits does the service worker answer? Here is a real run (a script drove Chrome, with `setOffline(true)` for the third visit; it is the same as DevTools, Network, "Offline"):
```text
visit 1 (online)  | requests 11 | answered by the service worker 0  | shelf {"allcs-v1":1}  | Online · data from 15:16:51
visit 2 (online)  | requests 11 | answered by the service worker 10 | shelf {"allcs-v1":10} | Online · data from 15:16:53
visit 3 (OFFLINE) | requests 10 | answered by the service worker 10 | shelf {"allcs-v1":10} | Offline · data from 15:16:53 (saved copy)
```
- Visit 1: every request goes to the network. The worker was only installed while the page loaded, and a worker sees only the requests after it has taken charge. The shelf holds one saved response, the home page.
- Visit 2: now 10 of the 11 requests are answered by the worker, and the shelf holds 10 saved responses: the page, the style file, the scripts and the course list. Only the tab icon skipped it.
- Visit 3, network off: all three cards, from the shelf. The bar says `Offline · data from 15:16:53 (saved copy)`. A browser without the worker shows the dinosaur and `ERR_INTERNET_DISCONNECTED`. So the worker answered visits two and three, not the first.

To try it yourself in Chrome: open http://localhost:5222, reload once, then DevTools (Application, Service Workers) tick "Offline" and reload.

## Common mistakes

1. **The same shelf name forever**, so visitors get stuck on an old version. Put a version in the name. Change `allcs-v1` to `allcs-v2` in `sw.js` and update: the new worker deletes the old shelf. A real run:
   ```text
   before:                  {"allcs-v1":10}
   after the new sw.js:     {"allcs-v2":1}
   after one more visit:    {"allcs-v2":10}
   ```
   (Change it back to `allcs-v1` afterwards.)
2. **Saving private data.** A shelf lives on the device. Never save pages or answers that hold account details, tokens or orders, on a computer that others may use.
3. **A worker you cannot get rid of.** A broken worker keeps serving old pages even after you fix the code. While you build, remove it in DevTools (Application, Service Workers, Unregister) or test in a fresh profile.
4. **Animating `left`, `top`, `width`, `height`** instead of transforms.
5. **Motion that is too long, or that ignores reduced motion.** Keep it to a few hundred milliseconds and let the visitor's setting win.
6. Honest limits: a PWA is a website, not a native app. A worker needs HTTPS (or `localhost` for testing) and the browser may stop it any time. On iPhones the rules are stricter: from the Next.js guide (not run here), the visitor installs through the share menu and your code cannot trigger an install prompt. Check the current documents for your target phones.

## Clean up

```bash
# stop the app and the API (Ctrl+C in each terminal)
find pwa-app/.next -delete
```
In Chrome, unregister the worker (Application, Service Workers, Unregister) and clear the site data for `localhost:5222`. Delete `pwa-app/node_modules` when you are finished.

## Next

[M22-L03 · Translations and a React Native Taster](../m22-l03-translations-and-a-react-native-taster/)

Try it yourself: add a stale-while-revalidate rule for one more request, then change the version of the shelf and watch the old one disappear.
