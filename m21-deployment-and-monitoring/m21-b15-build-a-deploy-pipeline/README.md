# M21-B15 · Build a Deploy Pipeline

> Video: Module 21, Build 15. Watch it first, then follow along here.

## What you'll learn

- What a pipeline is: stations (install, lint, type check, test, build, deploy) where the first failure stops everything
- How one small shell script (`shop/scripts/pipeline.sh`) runs the stations and stops on a non-zero exit code
- The same pipeline as a GitHub Actions file, checked with `actionlint` (never pushed)
- A deploy station with Docker and nginx: an image named after the commit, and a smoke check
- A local "server" (a bare Git repository) with a `post-receive` hook that runs the pipeline on every push
- Three bad changes that each stop at a different station, and a rollback to the old image

## Before you start

- Node 24 (`node --version`), Git, and Docker Desktop running.
- Best after M21-L01 to M21-L03 and M17-B12 (this is the shop with its tests).
- Everything is local. Nothing is pushed to GitHub and no real cloud host is used. The "server" is a second Git folder on your computer, and the hook is our stand-in for GitHub Actions. The practice API (`shop/api/server.mjs`) is a local stand-in, not the production server.
- Ports: the live site on 5825, the practice API on 8225. Docker names: container `m21b15-web`, images `m21b15-shop:<commit>`.

## Files in this folder

The project is in `shop/`. This README refers to paths inside it.

| File | What it is |
|------|------------|
| `shop/` | The allcsvideos shop: React 19, React Router, TanStack Query, Zustand, with 12 tests |
| `shop/scripts/pipeline.sh` | The runner: `stage` function, then install, lint, typecheck, test, build, deploy |
| `shop/scripts/deploy.sh` | Builds the image, starts the container on 5825, runs the smoke check |
| `shop/Dockerfile`, `shop/nginx.conf` | nginx image with the `dist` folder, caching, fallback, `/api` proxy |
| `shop/.github/workflows/pipeline.yml` | The same pipeline as a GitHub Actions file |
| `shop/.oxlintrc.json` | Lint config: one rule, `rules-of-hooks` as an error |
| `shop/api/server.mjs` | The practice API |
| `shop/src/` | The app and its tests (`src/cart/totals.ts` has the coupon maths) |
| `hook-post-receive.sh` | The hook that runs after every push on the "server" |
| `versions/` | The three bad changes and the tagline layout, as files to copy in |

## Follow along

### 1. Add lint, and one script that runs all stations

The shop already has a type check and tests. Lint is missing, so we add the fast linter from module 18:
```bash
cd shop
npm install            # in the video: npm install -D oxlint  (added 2 packages)
npm run lint
echo "exit code: $?"
```
```text
> shop@0.0.0 lint
> oxlint

exit code: 0
```
(`shop/package.json` already has oxlint and the `lint` script. `.oxlintrc.json` has one rule, an error: `react/rules-of-hooks`. No output means no problems.)

`scripts/pipeline.sh` is the runner. The function `stage` takes a name and a command, prints the name, runs the command, then looks at the exit code (0 means it worked). Anything else prints FAILED and `exit` stops the whole script, so nothing after it runs:
```sh
stage() {
  name="$1"; shift
  echo ">>> $name: $*"
  "$@"
  code=$?
  if [ "$code" -ne 0 ]; then
    echo "<<< $name FAILED with exit code $code"
    echo "<<< pipeline stopped: nothing was deployed"
    exit "$code"
  fi
  echo "<<< $name passed"
}

stage install npm ci
stage lint npm run lint
stage typecheck npm run typecheck
stage test npm test
stage build npm run build
if [ "$BRANCH" = "main" ]; then stage deploy sh scripts/deploy.sh "$SHA"; fi
```
(The real file also prints seconds per stage.) Deploy runs only on the `main` branch, because a change that is still being reviewed must never go live. At the top, `export VITE_BUILD_SHA="$SHA"` puts the commit id into a `VITE_` variable. Vite writes it into the code at build time (lesson 1), and the footer of the page shows it. The quick, cheap stations come first, so a typo fails in a second.

### 2. The workflow file, checked with actionlint

`shop/.github/workflows/pipeline.yml` is the same line as a GitHub Actions file: job `checks` (checkout, Node 24 with cache, `npm ci`, lint, typecheck, test, build with `VITE_BUILD_SHA: ${{ github.sha }}`, upload the `dist` artifact) and job `deploy` with `needs: checks` and `if: github.ref == 'refs/heads/main'`. We never start GitHub's machines, so check the file with a real tool, `actionlint`, through Docker:
```bash
docker run --rm -v "$PWD:/repo" -w /repo rhysd/actionlint:1.7.7 -no-color .github/workflows/pipeline.yml
echo "exit code: $?"
```
```text
exit code: 0
```
Now break it on a scratch copy (do not edit the real file): change `needs: checks` to `needs: check`, and run actionlint on the copy:
```text
.github/workflows/pipeline.yml:27:3: job "deploy" needs job "check" which does not exist in this workflow [job-needs]
   |
27 |   deploy:
   |   ^~~~~~~
```
A typo is caught here, before any robot sees it.

### 3. The deploy station

Deploy means: get the finished site to where people can reach it. `shop/Dockerfile` has three lines:
```dockerfile
FROM nginx:1.29-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html
```
Build once, ship exactly that. `nginx.conf` does the jobs of lessons 1 and 2: files in `/assets/` are kept for a year (`public, max-age=31536000, immutable`), the home page is `no-cache`, any other address falls back to `index.html` (`try_files`), and `/api/` goes to the practice API (`proxy_pass http://host.docker.internal:8225`). `scripts/deploy.sh` builds an image named after the commit, removes the old container, starts the new one on port 5825, and runs a smoke check: fetch the home page, find the main code file, and look for this commit id inside it. If the id is missing, the live site is not the version we think, and the station fails.
```sh
IMAGE="m21b15-shop:$SHA"
docker build -t "$IMAGE" . || exit 1
docker rm -f m21b15-web > /dev/null 2>&1
docker run -d --name m21b15-web -p 5825:80 "$IMAGE" || exit 1
sleep 1
JS=$(curl -fsS http://localhost:5825 | grep -o 'assets/index-[^"]*\.js') || exit 1
curl -fsS "http://localhost:5825/$JS" | grep -q "$SHA" || exit 1
echo "smoke check passed: http://localhost:5825 serves $SHA"
```
Start the practice API in its own terminal and leave it running (from `shop/`): `PORT=8225 node api/server.mjs`.

### 4. A "server" with a hook: run it on every push

Two folders. `shop` is where Asha works. `remote.git` is the server's copy: a bare repository (history only, no working files, receives pushes). Make both, next to the `shop` folder (go up one level first with `cd ..`):
```bash
git init -q --bare -b main remote.git
cp hook-post-receive.sh remote.git/hooks/post-receive
chmod +x remote.git/hooks/post-receive
mkdir runs
cd shop
git init -q -b main
git remote add origin ../remote.git
git remote -v
```
```text
origin	../remote.git (fetch)
origin	../remote.git (push)
```
The hook runs after every push Git accepts. It reads which branch and which commit arrived, unpacks exactly that commit into a new empty folder `runs/<sha>` (so no old files sneak in), and runs the pipeline there:
```sh
while read old new ref; do
  branch="${ref#refs/heads/}"
  sha=$(echo "$new" | cut -c1-7)
  dir="../runs/$sha"
  mkdir -p "$dir"
  git archive "$new" | tar -x -C "$dir"
  echo "pipeline for $sha on $branch, in a clean copy"
  ( cd "$dir"; unset GIT_DIR; sh scripts/pipeline.sh "$sha" "$branch" )
done
```
First push (Git needs a name and email for the commit; use these demo values for this one command):
```bash
git add -A
git -c user.name=Asha -c user.email=asha@example.com commit -m "Add the pipeline"
git push origin main
```
Every line that starts with `remote:` comes from the hook, running on the "server" while the push waits:
```text
remote: pipeline for fc48e5b on main, in a clean copy
remote: >>> install: npm ci
remote: <<< install passed in 1s
remote: >>> lint: npm run lint
remote: <<< lint passed in 1s
remote: >>> typecheck: npm run typecheck
remote: <<< typecheck passed in 1s
remote: >>> test: npm test
remote:  ✓ src/cart/cartStore.test.ts > keeps one copy of a course 1ms
remote:  ... (12 tests in all)
remote:  Test Files  5 passed (5)
remote:       Tests  12 passed (12)
remote: <<< test passed in 2s
remote: >>> build: npm run build
remote: dist/assets/index-BbEdykhH.js   382.30 kB │ gzip: 117.37 kB
remote: <<< build passed in 1s
remote: >>> deploy: sh scripts/deploy.sh fc48e5b
remote: smoke check passed: http://localhost:5825 serves fc48e5b
remote: <<< deploy passed in 2s
remote: PIPELINE PASSED for fc48e5b
```
(The commit id `fc48e5b` and the times differ for you.) The site is live: open http://localhost:5825. The footer shows the commit id, written into the code by the build station. Docker agrees:
```bash
docker ps --filter name=m21b15 --format '{{.Names}} {{.Image}} {{.Ports}}'
```
```text
m21b15-web m21b15-shop:fc48e5b 0.0.0.0:5825->80/tcp, [::]:5825->80/tcp
```

### 5. Break things on purpose

Three bad changes, each should stop at a different station. The first two go to their own branches (the pipeline runs on every branch but deploys only from `main`). First set the demo name and email once inside `shop`, so the `git commit` commands below work: `git config user.name Asha` and `git config user.email asha@example.com`.

**Change 1, a conditional hook.** Free courses should say Free, so the button returns early before the second hook (`versions/AddToCartButton.bug.tsx`). Guess which station turns red.
```bash
git switch -c lint-bug
cp ../versions/AddToCartButton.bug.tsx src/components/AddToCartButton.tsx
git add -A && git commit -m "Show Free for free courses"
git push origin lint-bug
git switch main
```
```text
remote: pipeline for 1002d6d on lint-bug, in a clean copy
remote: <<< install passed in 1s
remote: >>> lint: npm run lint
remote: src/components/AddToCartButton.tsx:12:18: error react-hooks(rules-of-hooks): React Hook "useCartStore" is called conditionally. React Hooks must be called in the exact same order in every component render. ...
remote: <<< lint FAILED with exit code 1 after 1s
remote: <<< pipeline stopped: nothing was deployed
```
Type check, tests, build and deploy never ran. When a course goes from paid to free, React would lose count of its hooks. Lint saw that before anything ran.

**Change 2, a number passed as text.** In `CourseCard`, `formatPrice(String(course.price))` (`versions/CourseCard.bug.tsx`). The page would look the same.
```bash
git switch -c type-bug
cp ../versions/CourseCard.bug.tsx src/components/CourseCard.tsx
git add -A && git commit -m "Pass the price as text"
git push origin type-bug
git switch main
```
```text
remote: <<< lint passed in 1s
remote: >>> typecheck: npm run typecheck
remote: src/components/CourseCard.tsx(19,28): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
remote: <<< typecheck FAILED with exit code 1 after 0s
remote: <<< pipeline stopped: nothing was deployed
```
Lint passes: the code is not dangerous. The type check stops it.

**Change 3, straight on main, the Friday evening mistake.** `Math.floor` instead of `Math.round` in the coupon (`versions/totals.floor.ts`), the same bug as in build 12.
```bash
cp ../versions/totals.floor.ts src/cart/totals.ts
git add -A && git commit -m "Round the coupon down"
git push origin main
```
```text
remote: <<< lint passed in 0s
remote: <<< typecheck passed in 1s
remote: >>> test: npm test
remote:  × src/cart/totals.test.ts > getTotals > takes ten percent off with SAVE10 4ms
remote:    → expected { subtotal: 898, discount: 89, …(1) } to deeply equal { subtotal: 898, discount: 90, …(1) }
remote:  × src/pages/Cart.test.tsx > applies a coupon typed in small letters 92ms
remote: <<< test FAILED with exit code 1
remote: <<< pipeline stopped: nothing was deployed
```
Lint and the type check pass, because `Math.floor` is valid code of the right kind. Only the tests see it: the discount is 89, not 90. Now the proof: the bad commit is on `main`, but did it go live?
```bash
docker ps --filter name=m21b15 --format '{{.Names}} {{.Image}}'
curl -s localhost:5825/ | grep -o 'assets/index-[^"]*js'
```
```text
m21b15-web m21b15-shop:fc48e5b
assets/index-BbEdykhH.js
```
Docker still runs the image of the first commit and the page points at the same file as before. The bad version never reached a visitor.

### 6. The fix, and the rollback

`git revert` makes a new commit that undoes the bad one, and Asha adds a tagline to the footer (`versions/RootLayout.v2.tsx`). One push:
```bash
git revert --no-edit HEAD
cp ../versions/RootLayout.v2.tsx src/layouts/RootLayout.tsx
git add -A && git commit -m "Add a tagline"
git push origin main
docker images m21b15-shop --format '{{.Repository}}:{{.Tag}}  {{.Size}}'
```
```text
remote: PIPELINE PASSED for 3b28960
m21b15-shop:3b28960  92.3MB
m21b15-shop:fc48e5b  92.3MB
```
Every station passes, deploy builds a new image, replaces the container, and the smoke check passes. Reload the browser: the footer shows the new commit id and "learn at your own speed". The old image is still on your machine: that is the rollback. Remove the running container and start the old image:
```bash
docker rm -f m21b15-web
docker run -d --name m21b15-web -p 5825:80 m21b15-shop:fc48e5b
curl -s localhost:5825/assets/index-BbEdykhH.js | grep -o "fc48e5b" | head -1
```
```text
fc48e5b
```
The footer shows the old commit id again.

## Common mistakes

1. **Running the checks only on `main`**, so you find the bug after the merge. Run them on every branch.
2. **A deploy with no `needs` line**, so it starts even when the checks fail.
3. **No smoke check**, so a container that starts broken still shows green.
4. **No way back.** Keep the last images, so a rollback takes a minute.
5. A real provider also needs: the pipeline running on the provider's machines, a secret key in the provider's settings (never in the file), and a rule that a branch cannot be merged while its checks are red.

## Clean up

```bash
docker rm -f m21b15-web
docker images m21b15-shop -q | xargs docker rmi -f
cd ..
find remote.git runs -delete
find shop/.git -delete
# stop the practice API with Ctrl+C
```
Delete `shop/node_modules` and `shop/dist` when you are finished. (`shop/.git` is the repository you made in step 4. If this folder is already inside another Git repository, delete only what you created.) Remove the actionlint image with `docker rmi rhysd/actionlint:1.7.7`.

## Next

Three extensions to try: add the browser tests of build 12 as a station after the build; run lint, type check and tests at the same time to save minutes; deploy a preview of every branch on its own port.

Then [M22-L01 · Real-Time UI](../../m22-real-time-and-beyond/m22-l01-real-time-ui/)
