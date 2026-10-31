# M21-L01 · Building for Production

> Video: Module 21, Lesson 1. Watch it first, then follow along here.

## What you'll learn

- What `npm run build` makes (the bundle in `dist`) and why you never put the development server on a real server
- Fingerprinted file names (hashes), and how a changed word changes only the files that changed
- Environment variables: a Vite value is pasted in at build time; how to read an address at run time instead
- The same rule in Next.js: `NEXT_PUBLIC_` names are always frozen, a server name depends on the page
- Source maps: `true` hands out your source code, `hidden` keeps the map for yourself
- Cache headers: a year and `immutable` for fingerprinted files, `no-cache` for the page, plus gzip

## Before you start

- Node 24 (`node --version`). No Docker in this lesson.
- Best after M18 (Vite and tooling) and M19 (Next.js).
- Everything runs on your own computer. The "server" is `serve.mjs`, a tiny static file server, and the "API" is `api/server.mjs`, a local stand-in with 12 courses. It is NOT the production server. The `SESSION_SECRET` in `nx/.env.production` is a fake demo value.
- Ports: the API on 8211, the site on 5211 (the dev server and `serve.mjs` both use it, one at a time), the Next.js app on 3000.

## Files in this folder

| File | What it is |
|------|------------|
| `web/` | The Vite + React 19 + TypeScript catalog (`src/App.tsx` shows the badge "release 1" and the courses) |
| `web/.env.development`, `web/.env.production` | `VITE_API_URL` for `npm run dev` (staging, 3 courses) and for `npm run build` (12 courses) |
| `api/server.mjs` | The practice API: `/api/courses` (12 courses) and `/staging/api/courses` (3 courses) |
| `serve.mjs` | The tiny static server. `node serve.mjs <dir> <port> <naive or good>` logs one line per request |
| `showmap.mjs` | Downloads a source map and prints what anyone can read from it |
| `variants/App.cfg.tsx` | `App.tsx` that reads the API address from `config.json` at run time |
| `variants/nx_page_static.tsx` | Next.js page that is built ahead of time (the secret gets frozen) |
| `nx/` | The Next.js 16.4.3 app for the environment-variable experiment |
| `nx/.env.production` | `NEXT_PUBLIC_API_URL` and a demo `SESSION_SECRET` |

## Follow along

Use two terminals: one for the API, one for the rest.
```bash
node api/server.mjs
```
```text
Practice API on http://localhost:8211 (answers after 80 ms)
```

### 1. Build for production

```bash
cd web
npm install
npm run build
```
```text
> web@0.0.0 build
> tsc -b && vite build

vite v8.3.5 building client environment for production...
transforming...
✓ 16 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.46 kB │ gzip:  0.29 kB
dist/assets/index-BJqq7tF8.css    1.01 kB │ gzip:  0.49 kB
dist/assets/index-KVZeKeRr.js   220.29 kB │ gzip: 68.90 kB

✓ built in 375ms
```
First `tsc` checks the types, then Vite joins your files into a few and squeezes them. That is the bundle: one page, one style file and one JS file of 220 kB (69 kB compressed for the trip). The folder `dist` ("distribution") holds the files; sizes in bytes:
```bash
wc -c dist/index.html dist/assets/*
```
```text
     461 dist/index.html
    1010 dist/assets/index-BJqq7tF8.css
  220297 dist/assets/index-KVZeKeRr.js
  221768 total
```
(The build time is different on your computer; the names and byte sizes should match.) The JS file is only 8 lines: names squeezed to one letter, no spaces. In the video, the development server (`npm run dev`) sent 15 requests and 3.7 MB for the same page; the built page sent 5 requests and 73 kB. Put the build on the server, never the development server.

### 2. Fingerprints in the file names

`index-KVZeKeRr.js`: the letters are a hash, a fingerprint of the content. Same content, same name. Change one word in `web/src/App.tsx`, `release 1` to `release 2`, and build again:
```bash
sed -i.bak 's/release 1/release 2/' src/App.tsx && npm run build
```
```text
dist/index.html                   0.46 kB │ gzip:  0.29 kB
dist/assets/index-BJqq7tF8.css    1.01 kB │ gzip:  0.49 kB
dist/assets/index-sZbHFWcH.js   220.29 kB │ gzip: 68.90 kB
```
The page keeps its name (it has to). The JS file has a new name. The style file, which you did not touch, keeps its old name. Put the file back: `mv src/App.tsx.bak src/App.tsx && npm run build`.

### 3. Serve the build, and read the headers

```bash
cd ..
node serve.mjs web/dist 5211 good
```
```text
serving web/dist on http://localhost:5211 (good)
```
In another terminal:
```bash
curl -sI localhost:5211/
curl -sI localhost:5211/assets/index-KVZeKeRr.js
curl -sI -H "accept-encoding: gzip" localhost:5211/assets/index-KVZeKeRr.js
curl -sI -H 'if-none-match: "457afc6771db5a6a"' localhost:5211/
```
```text
HTTP/1.1 200 OK
content-type: text/html; charset=utf-8
cache-control: no-cache
etag: "457afc6771db5a6a"
content-length: 461

HTTP/1.1 200 OK
content-type: text/javascript; charset=utf-8
cache-control: public, max-age=31536000, immutable
etag: "f5c88be584b44ec9"
content-length: 220297

HTTP/1.1 200 OK
content-type: text/javascript; charset=utf-8
cache-control: public, max-age=31536000, immutable
etag: "f5c88be584b44ec9"
content-encoding: gzip
content-length: 68154

HTTP/1.1 304 Not Modified
content-type: text/html; charset=utf-8
cache-control: no-cache
etag: "457afc6771db5a6a"
content-length: 0
```
(I dropped the `Date` and `Connection` lines.) Read them like this:
- The JS and CSS files are the numbered books of a library. Their name is a fingerprint, so a copy can never be out of date: `max-age=31536000` is one year, `immutable` means "do not even ask".
- The page `index.html` is the notice board. It has a fixed name and tells the browser which fingerprinted files to use, so it must always be fresh. `no-cache` does not mean "do not keep it": it means "keep it, but ask before you use it". The browser asks with the file's `etag`; if nothing changed the server answers 304 with no body.
- `content-encoding: gzip` makes the JS 220,297 bytes as a file and 68,154 on the wire.

Whatever host you choose, check three things: compression, a year for fingerprinted files, and no cache for the page. Next.js does these jobs for you; its own files get a year and `immutable`.

`serve.mjs` holds the rule in five lines (`cacheControl`). With `naive` as the third argument, it sends `public, max-age=86400` (one day) for every file, even the page. That is the bug from the start of the video: Asha deploys release two, but Lukas's browser keeps the page for a day, never asks, and shows release one. With `good`, the first visit makes 4 requests; a second visit only asks about the page (answer 304) and a third visit, after a new release, fetches only the new page and the new JS file.

### 4. Environment variables are pasted in at build time

`web/src/App.tsx` has one line: `const API = import.meta.env.VITE_API_URL`. Vite hands the page only names that start with `VITE_` (never give a real secret such a name). `npm run dev` reads `.env.development` (staging, 3 courses). `npm run build` reads `.env.production` (12 courses). Open the built JS file and search for the address:
```bash
grep -o "http://localhost:8211[a-z/]*" web/dist/assets/*.js
```
```text
http://localhost:8211/api
```
It is plain text inside the code. Vite pasted the value in while building (build time). Now edit `web/.env.production`, change `/api` to `/staging/api`, and do NOT build. Check again:
```bash
grep -o "http://localhost:8211[a-z/]*" web/dist/assets/*.js
```
```text
http://localhost:8211/api
```
Still the old value, so the page still shows 12 courses. After `npm run build` the JS file gets a new name (`index-BzarK2Zl.js`) and the page shows 3 courses. Put `.env.production` back to `/api`. So staging and production need two different builds, and the file you tested is not the file you ship.

The way around it is to read the address when the page starts. `variants/App.cfg.tsx` fetches `/config.json` first:
```tsx
useEffect(() => {
  fetch('/config.json')
    .then((res) => res.json())
    .then((config: Config) => {
      setApiUrl(config.apiUrl)
      return fetch(`${config.apiUrl}/courses`)
    })
    .then((res) => res.json())
    .then(setCourses)
}, [])
```
Copy it over `web/src/App.tsx`, build, and put a file next to the page on the server: `echo '{ "apiUrl": "http://localhost:8211/api" }' > web/dist/config.json`. Editing that one line on the server changes the page after a reload, without building. The price is one more request before the first. Use build time values for things that never change, and a file like this for things that change from place to place. Restore `App.tsx` afterwards.

### 5. The same rule in Next.js

```bash
cd nx
npm install
npm run build
```
The variables are in `nx/.env.production`. A name that starts with `NEXT_PUBLIC_` goes to the browser and is pasted in at build time. Every other name stays on the server. Prove it by searching the build:
```bash
grep -rl "localhost:8211" .next/static
grep -rl "allcsvideos-demo-secret" .next || echo "not found"
```
```text
.next/static/chunks/0k9b-8xt5ix03.js
not found
```
(The chunk name will be different for you.) But a server name can be frozen too. `variants/nx_page_static.tsx` prints the secret length in a page that is built ahead of time. Use it as `app/page.tsx`, build, and start with other values:
```bash
cp app/page.tsx /tmp/page.dynamic.tsx
cp ../variants/nx_page_static.tsx app/page.tsx
npm run build
SESSION_SECRET=short NEXT_PUBLIC_API_URL=http://localhost:9999/api npm run start
```
Open http://localhost:3000. The page still says `25` characters and the old address. Stop the server. The default `app/page.tsx` (kept in `/tmp/page.dynamic.tsx` now) reads the secret inside `Suspense` after `await connection()`, so the page is made for every visit:
```bash
cp /tmp/page.dynamic.tsx app/page.tsx
npm run build
SESSION_SECRET=short NEXT_PUBLIC_API_URL=http://localhost:9999/api npm run start
```
The page now says `5` characters. The public address is still the old one, always. The table to remember:
```text
A public name (NEXT_PUBLIC_):                          build time, always
A server name, in a page that was made ahead:          build time
A server name, in a page that is made for each visit:  run time
```
Headers from `next start`: `curl -sI` on a JS chunk shows `Cache-Control: public, max-age=31536000, immutable`; on the page, `private, no-cache, no-store, max-age=0, must-revalidate`.

### 6. Source maps

Add one line to `web/vite.config.ts`: `build: { sourcemap: true }`, then build:
```bash
cd ../web
npm run build
wc -c dist/assets/*
grep -o "sourceMappingURL.*" dist/assets/*.js
```
```text
    1010 dist/assets/index-BJqq7tF8.css
  220340 dist/assets/index-KVZeKeRr.js
 1047988 dist/assets/index-KVZeKeRr.js.map
 1269338 total
sourceMappingURL=index-KVZeKeRr.js.map
```
The map is almost five times bigger than the JS, and the JS now ends with a comment that names it. The map is a file on the server like any other, so anyone can fetch it. Serve this build and read the map as a stranger would:
```bash
node ../serve.mjs dist 5215 good &
node ../showmap.mjs http://localhost:5215/assets/index-KVZeKeRr.js.map src/App.tsx
kill %1
```
```text
13 source files, 3 of them yours:
  src/index.css
  src/App.tsx
  src/main.tsx
--- src/App.tsx, as it was before the build ---
import { useEffect, useState } from 'react'

type Course = { slug: string; title: string; teacher: string; level: string; price: number; free: boolean }

const API = import.meta.env.VITE_API_URL

export default function App() {
  const [courses, setCourses] = useState<Course[]>([])

```
A public map hands out your source code. For a public site use `sourcemap: 'hidden'`: the map is still made, but the JS file no longer points to it (`grep` prints nothing, so we add `|| echo "no map comment"`):
```text
  220297 dist/assets/index-KVZeKeRr.js
 1047988 dist/assets/index-KVZeKeRr.js.map
no map comment
```
Keep hidden maps for yourself, or give them to an error tracking tool (M21-L03). Remove the `sourcemap` line again when you are done.

## Common mistakes

1. **A variable without the prefix.** Rename `VITE_API_URL` to `API_URL` in `.env.production` and `App.tsx`. The build passes with no warning, but the value is `undefined`, the page asks this same server for `/undefined/courses`, gets the HTML page back, and cannot read it as JSON. The page shows the header and no courses, and "data from" stays empty (the console shows a JSON error: unexpected token `<`).
2. **Opening the built page by double clicking.** The address starts with `file://` and the page is blank. The console says: `Access to script at 'file:///assets/index-KVZeKeRr.js' from origin 'null' has been blocked by CORS policy`. The built page expects a server because its files are named with a slash at the start. Always serve `dist`, even with a tiny server.
3. **A type error.** Dev mode would still run, but `npm run build` starts with `tsc` and stops. Change `c.teacher` to `c.teachr` in `App.tsx`:
   ```text
   src/App.tsx(30,20): error TS2551: Property 'teachr' does not exist on type 'Course'. Did you mean 'teacher'?
   ```
   Good: it stops here, and not in front of your visitor.
4. A single cache rule for every file (the `naive` mode): the page is cached for a day and visitors see the old site.
5. Publishing source maps on a public site.

## Clean up

```bash
# stop every server (Ctrl+C), then:
find web/dist nx/.next -delete
```
Delete `node_modules` in `web/` and `nx/` when you are finished.

## Next

[M21-L02 · Deploying React and Next.js](../m21-l02-deploying-react-and-nextjs/)

Try it yourself: build a project of yours, search `dist` for your API address, and look at the headers of the page and of a JS file with `curl -sI`.
