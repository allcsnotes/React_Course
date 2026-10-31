# M21-L02 · Deploying React and Next.js

> Video: Module 21, Lesson 2. Watch it first, then follow along here.

## What you'll learn

- The two shapes of deploy: files on a counter (a React single-page app) and a running Node program (Next.js)
- A two-stage Docker file: build the files in one stage, copy only `dist` into an nginx image
- Why refreshing `/courses/react-for-beginners` gives 404, and the one-line `try_files` fix
- Long caching for hashed files, and gzip that silently does nothing when the type is wrong
- Next.js `output: "standalone"`, a three-stage Docker file, and the 404 you get when the `static` folder is not copied
- Which settings are read when the container starts and which are frozen into the image

## Before you start

- Node 24 (`node --version`) and Docker Desktop running (`docker --version`). The first build pulls `node:24-alpine` and `nginx:1.29-alpine` from Docker Hub.
- Best after M21-L01 (`../m21-l01-building-for-production/`). It also uses the DevOps course ideas of containers and multi-stage builds.
- Everything runs on your computer. `api/server.mjs` is the practice API (a local stand-in, not the production server). Ports: API 8212, containers 5212.
- Free disk space: the images below take about 1 GB together (the lazy Next.js image alone is over 1 GB).

## Files in this folder

| File | What it is |
|------|------------|
| `api/server.mjs` | The practice API: `/api/courses`, `/api/courses/:slug`, slow reviews |
| `spa/` | The React single-page app (Vite, React 19, React Router): Home, Courses, one Course page |
| `spa/Dockerfile` | Two stages: node builds `dist`, nginx serves it |
| `spa/nginx.v1.conf` | The smallest config: no fallback, no caching, no gzip |
| `spa/nginx.v2.conf` | Adds the fallback and caching, and a gzip list with the WRONG type |
| `spa/nginx.final.conf` | The finished config (same as `spa/nginx.conf`) |
| `next-app/` | The Next.js 16.4.3 app: a courses page and `/api/status` |
| `next-app/Dockerfile` | Three stages: deps, build, run (standalone, user `app`) |
| `next-app/Dockerfile.naive` | The lazy single-stage Docker file, for the size comparison |
| `next-app/Dockerfile.nostatic` | The three stages with the `static` copy line left out (mistake) |
| `managed/vercel.json`, `managed/netlify.toml` | The two small files for managed static hosts. Explained only, never run |

The two `package-lock.json` files are included on purpose: the Docker files run `npm ci`, which needs them.

## Follow along

Start the practice API in its own terminal and keep it running:
```bash
node api/server.mjs
```
(Other containers need to reach it as `host.docker.internal:8212`.)

### 1. Build the single-page app image

`spa/Dockerfile` has two stages. Stage one starts from `node:24-alpine`, copies the package files, runs `npm ci` (exactly what the lock file says), copies the source and runs `npm run build`. The `ARG` line is a build setting for the API address. Stage two starts again from `nginx:1.29-alpine`, copies the config, and copies only `dist` out of stage one. Everything else (Node, packages, source) is thrown away.
```bash
cd spa
cp nginx.v1.conf nginx.conf
docker build -t m21l02-spa:v1 .
```
In the output you see the build from lesson 1:
```text
vite v8.3.5 building client environment for production...
dist/index.html                   0.46 kB │ gzip:  0.29 kB
dist/assets/index-PBVAj3cB.css    2.43 kB │ gzip:  0.92 kB
dist/assets/index-Dmjf2uSl.js   258.05 kB │ gzip: 81.95 kB
```
The real JS file is 258.05 kB. Check the finished image against the build stage (sizes on disk, not compressed):
```bash
docker build -q --target build -t m21l02-spa-build .
docker images "m21l02-spa*"
```
```text
IMAGE                     ID             DISK USAGE   CONTENT SIZE   EXTRA
m21l02-spa-build:latest   6dae82abed33        438MB          127MB
m21l02-spa:v1             9a1bc16d66bb       92.2MB         25.9MB
```
(The ids differ. Your numbers should be close.) 92.2 MB against 438 MB: Docker threw away more than 340 MB of tools a visitor never needs.

### 2. nginx, version 1: refresh gives 404

`nginx.v1.conf` is the smallest config: listen on 80, serve files from this folder, default file `index.html`.
```bash
docker run -d --name m21l02-nginx -p 5212:80 m21l02-spa:v1
curl -s -o /dev/null -w "GET /                              %{http_code}\n" localhost:5212/
curl -s -o /dev/null -w "GET /courses/react-for-beginners    %{http_code}\n" localhost:5212/courses/react-for-beginners
```
```text
GET /                              200
GET /courses/react-for-beginners    404
```
In a browser (http://localhost:5212), the home page works, the Courses link works, a course works. Guess: Lukas presses refresh on the course page. 404, nginx page `404 Not Found`. `/courses/react-for-beginners` is not a file. The router (module 8) decides it in the browser; a click never asks the server, but a refresh does. Clean up this container: `docker rm -f m21l02-nginx`.

### 3. Version 2: the fallback, caching and a gzip mistake

`nginx.v2.conf` adds three things:
```nginx
gzip on;
gzip_types text/css text/javascript application/json image/svg+xml;

location /assets/ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}

location / {
  add_header Cache-Control "no-cache";
  try_files $uri /index.html;
}
```
`try_files` is the single-page-app fallback: look for a file with this name, and if there is none, send `index.html` and let the router decide. The hashed files in `/assets/` may be kept for a year; the page must be asked about every time.
```bash
cp nginx.v2.conf nginx.conf
docker build -t m21l02-spa:v2 .
docker run -d --name m21l02-nginx -p 5212:80 m21l02-spa:v2
curl -s -o /dev/null -w "GET /courses/react-for-beginners    %{http_code}\n" localhost:5212/courses/react-for-beginners
curl -sI localhost:5212/courses/react-for-beginners | grep -i -E "^(cache-control|content-type)"
curl -sI localhost:5212/assets/index-Dmjf2uSl.js | grep -i -E "^(cache-control|content-type)"
```
```text
GET /courses/react-for-beginners    200
Content-Type: text/html
Cache-Control: no-cache
Content-Type: application/javascript
Cache-Control: public, max-age=31536000, immutable
```
The course page is back (status 200), the page is `no-cache`, the JS file is a year and `immutable`. Now guess: we ask for the JS file and say we accept gzip. Is the answer smaller?
```bash
curl -s -o /dev/null -w "without gzip   %{size_download} bytes\n" localhost:5212/assets/index-Dmjf2uSl.js
curl -s -o /dev/null -H 'Accept-Encoding: gzip' -w "asking for gzip %{size_download} bytes\n" localhost:5212/assets/index-Dmjf2uSl.js
```
```text
without gzip   258052 bytes
asking for gzip 258052 bytes
```
No. The header of the JS file says `Content-Type: application/javascript`, but our `gzip_types` list says `text/javascript`. nginx compares the exact words and says nothing when they differ. No error, only a file that stayed big.

### 4. The final config

`nginx.final.conf` uses the type from the real header:
```nginx
gzip_types text/css application/javascript application/json image/svg+xml;
```
```bash
docker rm -f m21l02-nginx
cp nginx.final.conf nginx.conf
docker build -t m21l02-spa:v3 -t m21l02-spa .
docker run -d --name m21l02-nginx -p 5212:80 m21l02-spa:v3
curl -s -o /dev/null -H 'Accept-Encoding: gzip' -w "asking for gzip %{size_download} bytes\n" localhost:5212/assets/index-Dmjf2uSl.js
curl -sI -H 'Accept-Encoding: gzip' localhost:5212/assets/index-Dmjf2uSl.js | grep -i -E "^(content-encoding|content-length)"
docker exec m21l02-nginx ls /usr/share/nginx/html /usr/share/nginx/html/assets
```
```text
asking for gzip 95398 bytes
Content-Encoding: gzip
/usr/share/nginx/html:
50x.html
assets
favicon.svg
index.html

/usr/share/nginx/html/assets:
index-Dmjf2uSl.js
index-PBVAj3cB.css
```
Nearly three times smaller. (The default nginx image has no Brotli, so we use gzip.) That is the whole SPA deploy: build, copy, serve with a fallback, long caching for hashed files, and gzip with the right type. The `ARG VITE_API_URL` line is how a Docker build receives a different address, because Vite pastes it in at build time (lesson 1): `docker build --build-arg VITE_API_URL=http://localhost:8212 .`. Stop it: `docker rm -f m21l02-nginx` and go back with `cd ..`.

### 5. Next.js: standalone output

`next-app/next.config.ts` has one new line, `output: "standalone"`. Next.js then collects only the files the server needs into `.next/standalone`, with its own small `server.js`. Sizes from the build stage:
```bash
cd next-app
docker build -q --target build -t m21l02-next-build .
docker run --rm m21l02-next-build sh -c 'du -sh node_modules .next/standalone .next/static; ls .next/standalone'
```
```text
447.4M	node_modules
39.3M	.next/standalone
620.0K	.next/static
node_modules
package.json
server.js
```
(The video shows 448 MB, 40 MB and 604 K: same shape.) Two folders are NOT inside `standalone`: `.next/static` (the files for the browser) and `public`. Next.js leaves them out on purpose, because big sites serve them from a CDN. In our container we copy them in ourselves.

### 6. The three-stage Docker file

`next-app/Dockerfile`: stage `deps` runs `npm ci`; stage `build` copies the packages and source and runs `npm run build` (the `ARG NEXT_PUBLIC_BRAND` is a public setting); stage `run` starts from a fresh node image, adds a user with no special powers (`app`) instead of root, and has three copies:
```dockerfile
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
USER app
CMD ["node", "server.js"]
```
```bash
docker build -t m21l02-next .
docker build -f Dockerfile.naive -t m21l02-next:naive .
docker images "m21l02-next*"
```
The build prints the route table (`/`, `/_not-found`, `/api/status`) and takes about a minute. Sizes:
```text
IMAGE                  ID             DISK USAGE   CONTENT SIZE
m21l02-next:latest     862b8b351773        293MB         74.7MB
m21l02-next:naive      c8f1e52e549c       1.22GB          324MB
```
Our image is about four times smaller than the lazy single-stage one (the video measured 1.14 GB on its computer; yours is close to 1.2 GB), and has no build tools in production.

### 7. Run it

Port 5212 on the computer to port 3000 in the container. From inside a container, `host.docker.internal` means this computer, where the practice API runs.
```bash
docker run -d --name m21l02-node -p 5212:3000 -e API_URL=http://host.docker.internal:8212 m21l02-next
docker logs m21l02-node
docker exec m21l02-node sh -c 'cd /app && ls -A && du -sh /app && whoami'
```
```text
▲ Next.js 16.4.3
- Local:         http://localhost:3000
- Network:       http://0.0.0.0:3000
✓ Ready in 0ms
✓ Running next.config took 0.8ms
.next
node_modules
package.json
public
server.js
40.0M	/app
app
```
Open http://localhost:5212 for the courses from the practice API, drawn by the server inside the container. It is 40 MB, running as the user `app`.

### 8. Settings in a container

`src/app/api/status/route.ts` returns one server setting and one public setting (`await connection()` makes the route run for each request):
```ts
return Response.json({
  environment: process.env.DEPLOY_ENV ?? 'not set',
  brand: process.env.NEXT_PUBLIC_BRAND,
})
```
```bash
curl -s localhost:5212/api/status
```
```text
{"environment":"not set","brand":"allcsvideos"}
```
Run the same image again with `-e DEPLOY_ENV=staging -e NEXT_PUBLIC_BRAND=Other` (first `docker rm -f m21l02-node`):
```bash
docker run -d --name m21l02-node -p 5212:3000 -e API_URL=http://host.docker.internal:8212 -e DEPLOY_ENV=staging -e NEXT_PUBLIC_BRAND=Other m21l02-next
curl -s localhost:5212/api/status
```
```text
{"environment":"staging","brand":"allcsvideos"}
```
The server setting changed with no rebuild. The public brand did not: it was frozen at build time. To change it, build again with a build setting:
```bash
docker rm -f m21l02-node
docker build --build-arg NEXT_PUBLIC_BRAND=Other -t m21l02-next:other .
docker run -d --name m21l02-node -p 5212:3000 -e API_URL=http://host.docker.internal:8212 m21l02-next:other
curl -s localhost:5212/api/status
```
```text
{"environment":"not set","brand":"Other"}
```
So in Docker, server settings go in with `-e` when the container starts, and public settings go in with a build argument and are frozen into the image. A secret never goes in a `NEXT_PUBLIC_` value: it ships to every browser.

### 9. Managed platforms (explained only, never run)

I could not run these: they need an account on someone else's servers, so nothing here was run. A single-page app on a static host has the same refresh problem; the answer is a tiny file. `managed/vercel.json` is a `rewrites` entry (checked only that the JSON parses), `managed/netlify.toml` is a redirect from `/*` to `/index.html` with status 200 plus the build command and publish folder. For Next.js the platform made by the same company, Vercel, builds and runs the repository for you, with settings in its dashboard (the same two kinds). Choose: an SPA on any static host or nginx in a container; Next.js on a platform made for it or in the container you built, on any server that runs Docker.

## Common mistakes

1. **404 on refresh** of a single-page app: no `try_files $uri /index.html;` (step 2).
2. **gzip does nothing**: the type in `gzip_types` must match the real `Content-Type` of the file (`application/javascript`, not `text/javascript`). No error appears, so always test with `curl -H 'Accept-Encoding: gzip'` (step 3).
3. **A Next.js site with no styling.** Build `Dockerfile.nostatic`, which leaves out the `.next/static` copy:
   ```bash
   docker build -f Dockerfile.nostatic -t m21l02-next:nostatic .
   docker rm -f m21l02-node
   docker run -d --name m21l02-node -p 5212:3000 -e API_URL=http://host.docker.internal:8212 m21l02-next:nostatic
   curl -s -o /dev/null -w "GET /   %{http_code}\n" localhost:5212/
   ```
   ```text
   GET /   200
   ```
   The page answers 200, but the style file under `/_next/static/chunks/...css` (copy its address from the page source) answers 404. In the browser: no style and a giant logo. Put the copy line back.
4. Putting a secret in a `NEXT_PUBLIC_` or `VITE_` value.
5. Shipping the lazy single-stage image: 1 GB+ and full of build tools.

## Clean up

```bash
docker rm -f m21l02-nginx m21l02-node
docker rmi m21l02-spa m21l02-spa:v1 m21l02-spa:v2 m21l02-spa:v3 m21l02-spa-build m21l02-next m21l02-next:naive m21l02-next:nostatic m21l02-next:other m21l02-next-build
# stop the practice API with Ctrl+C
```
Put `spa/nginx.conf` back with `cp spa/nginx.final.conf spa/nginx.conf` if you changed it.

## Next

[M21-L03 · CI/CD and Monitoring](../m21-l03-ci-cd-and-monitoring/)

Try it yourself: add a health check route to the Next.js app, and a Docker Compose file that starts both containers.
