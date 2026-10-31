# M21-L03 · CI/CD and Monitoring

> Video: Module 21, Lesson 3. Watch it first, then follow along here.

## What you'll learn

- What CI (a robot checks every change) and CD (the robot delivers the checked version) mean, and what a pipeline is
- How to read a GitHub Actions workflow file: triggers, permissions, jobs, `needs`, `if` and `environment`
- How to check a workflow file with `actionlint` (from Docker) before you push anything
- How to run the same commands the robot would run, on a clean copy of the project
- Error sensors in the page: an error boundary, a `window` error listener, and a release tag
- How a collector turns a squeezed stack trace into your own file and line with a source map, and how web vitals show real visitors

## Before you start

- Node 24 (`node --version`) and Docker Desktop running (for `actionlint` only).
- Best after M17 (testing and the CI idea) and M21-L01 (the build and source maps).
- Nothing is pushed to GitHub and GitHub is never contacted. The workflow file is real and `actionlint` checks it; its commands run on your computer. The `deploy` job is NOT run: it needs a real host and a real secret, and `scripts/deploy.sh` is only a placeholder.
- The monitoring is a small stand-in that we wrote (`collector/`) for a service like Sentry. It runs here with no account and no key. Ports: preview 5213, collector 8213.
- The bug in `CartPage.tsx` and `Receipt.tsx` is on purpose.

## Files in this folder

| File | What it is |
|------|------------|
| `.github/workflows/ci.yml` | The pipeline: job `check` and job `deploy`. (GitHub only runs workflows at the root of a repository; here it is an example to read and lint.) |
| `broken-workflow/.github/workflows/ci.yml` | The same file with two typos on purpose, for `actionlint` |
| `scripts/deploy.sh` | Placeholder deploy script |
| `src/CartPage.tsx` | The cart page: Receipt and Print buttons, each with a bug on purpose |
| `src/Receipt.tsx` | Draws `{item}` (an object) instead of `{item.title}`: React cannot draw it |
| `src/ErrorBoundary.tsx` | Sensor 1: shows a fallback sentence and reports the error |
| `src/monitor.ts` | `send`, `report`, and sensors 2 and 3 (`window` errors, web vitals) |
| `src/main.tsx`, `src/totals.ts`, `src/totals.test.ts` | Entry point; the `total` function and its 2 tests |
| `collector/collector.mjs` | The stand-in collector: POST `/collect`, two dashboard pages |
| `collector/decode.mjs`, `collector/pages.mjs` | Turns a minified stack into a source line with the source map; the pages |
| `vite.config.ts` | Builds source maps (`sourcemap: true`) and uses port 5213 |

## Follow along

### 1. Read the pipeline

`.github/workflows/ci.yml`:
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
        env:
          VITE_RELEASE: ${{ github.sha }}
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist

  deploy:
    needs: check
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist
      - run: ./scripts/deploy.sh dist
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```
- `on` says when to run: every push to `main`, and every pull request (a proposed change people read before it joins `main`).
- `permissions: contents read`: the robot may only read the code. Give a robot the smallest key that works.
- Job `check` runs on a fresh machine (`ubuntu-latest`): get the code, install Node 24 with the package cache, then `npm ci`, lint, type check, test, build. The build gets `VITE_RELEASE`, the code of the commit, baked into the bundle (as in lesson 1). The last step saves the `dist` folder as an artifact for the next job.
- Job `deploy` is made safe by three lines: `needs: check` (starts only when the first job is green), `if: github.ref == 'refs/heads/main'` (never for a proposed change), and `environment: production` (a named place where a team can require a person to press approve). It gets a secret by name, `secrets.DEPLOY_TOKEN`: the value lives in the GitHub settings, the file only names it, and the logs hide it. Never type a real password into this file.

### 2. Check the file with actionlint

A workflow file is easy to get wrong, and the only other test is to push it and wait. `actionlint` knows what GitHub accepts. Run it from Docker, so nothing is installed:
```bash
docker run --rm -v "$PWD:/repo" -w /repo rhysd/actionlint:1.7.12 -no-color .github/workflows/ci.yml
echo "exit code: $?"
```
```text
exit code: 0
```
For this tool, silence means valid. Now the broken copy (the machine name is `ubuntu-lastest`, and `needs: chek`). Guess first: how many problems, and where?
```bash
docker run --rm -v "$PWD:/repo" -w /repo rhysd/actionlint:1.7.12 -no-color broken-workflow/.github/workflows/ci.yml
echo "exit code: $?"
```
```text
broken-workflow/.github/workflows/ci.yml:13:14: label "ubuntu-lastest" is unknown. available labels are "windows-latest", ... [runner-label]
   |
13 |     runs-on: ubuntu-lastest
   |              ^~~~~~~~~~~~~~
broken-workflow/.github/workflows/ci.yml:32:3: job "deploy" needs job "chek" which does not exist in this workflow [job-needs]
   |
32 |   deploy:
   |   ^~~~~~~
exit code: 1
```
(The long list of labels is cut here.) Two problems, found in about a second, with no robot and no push.

### 3. Run the check job's commands yourself

In a real repository the robot starts from a fresh clone. Do the same: copy this folder to a clean place with nothing installed, then run the commands in order.
```bash
npm ci
npm run lint
npm run typecheck
npm test
VITE_RELEASE=abc1234 npm run build
```
(In a Git repository you would use the commit code: `VITE_RELEASE=$(git rev-parse --short HEAD)`.) Lint and type check print nothing when they are happy. Then:
```text
 Test Files  1 passed (1)
      Tests  2 passed (2)

dist/index.html                   0.43 kB │ gzip:  0.27 kB
dist/assets/index-K3yoj0_f.css    0.93 kB │ gzip:  0.47 kB
dist/assets/index-Dd6UfWsR.js   229.26 kB │ gzip: 72.18 kB │ map: 1,071.63 kB

✓ built in 267ms
```
(The JS file name depends on the release code, so yours differs.) There is the bundle and a source map next to it (we need it in a minute). So the `check` job would be green: the code type-checks, lint is quiet, two tests pass. Green does not mean every button works: our tests never press Receipt. The `deploy` job is not run here, but it would upload exactly this `dist` folder.

### 4. Start the collector and the site

Terminal 1:
```bash
node collector/collector.mjs
```
```text
collector on http://localhost:8213
```
Terminal 2 (serve exactly the build you just made):
```bash
npx vite preview
```
```text
  ➜  Local:   http://localhost:5213/
```
The collector is a small Node program. It listens for a POST on `/collect`, turns the body into an object, keeps it in a list and prints one line. Open http://localhost:8213 (the Errors page) and http://localhost:8213/vitals (Real users) in two tabs.

### 5. The three sensors

`src/ErrorBoundary.tsx` is the error boundary of module 14: when a component fails while drawing, it shows `Something went wrong. We have been told.` instead of a white page, and `componentDidCatch` calls `report('render', error, ...)`. A boundary cannot see errors inside click handlers, but the browser still announces them on `window`. Sensor 2 in `src/monitor.ts`:
```ts
window.addEventListener('error', (e) => {
  report('window', e.error ?? new Error(e.message))
})
```
Both call `report`, and `report` calls `send`, which uses `navigator.sendBeacon`: a small post that works even while the page closes. Sensor 3 is `onLCP`, `onINP` and `onCLS` from the `web-vitals` library, each calling `send`.

Guess first: someone presses Receipt on http://localhost:5213, someone else presses Print. Which sensor sends a postcard for each, and what does the visitor see? Try both (reload the page between them):
```text
Receipt: the page is replaced by "Something went wrong. We have been told."
Print:   nothing visible changes at all
```
The collector terminal prints one line per postcard:
```text
render Minified React error #31; visit https://react.dev/errors/31?args[]=object%20with%20keys%20%7Bslug%2C%20title%2C%20price%7D for the full message ...
window Cannot read properties of undefined (reading 'title')
```
Without the `window` sensor, nobody would know about the Print bug.

### 6. A source map decodes the stack

The raw stack points into the squeezed bundle (`index-XXXX.js`, line 9, column 51000 or so): unreadable. The collector does the decoding. `collector/decode.mjs` reads each frame of the stack, finds the matching `.map` file in `dist/assets`, asks "where did this spot come from?", skips frames inside `node_modules`, and keeps the first frame that is your own code. The map stays on the collector side; it never has to be public. Reload the Errors page:
```text
2 errors received
Minified React error #31; ...
  draw error · src/Receipt.tsx:1:27 · release abc1234
Cannot read properties of undefined (reading 'title')
  window error · src/CartPage.tsx:16:34 · release abc1234
```
The click error points at `CartPage.tsx` line 16, column 34: the exact spot, `.title` on a missing item (`items[items.length]` does not exist). The draw error points at `Receipt.tsx`: the component that failed, though not the exact line. Both carry a release tag, the same code that the pipeline baked into this build (`VITE_RELEASE`), so you know which delivery brought the bug.

### 7. Real users: web vitals

Stop the collector (Ctrl+C) and start it again to clear its list. Visit the page several times, type a coupon, and leave (a script is easiest: seven visits). Then open http://localhost:8213/vitals. It shows, for each number, the middle value and the worst:
```text
Metric  Visits  Middle  Worst   Good
LCP     7       48 ms   64 ms   7 of 7
INP     2       16 ms   16 ms   2 of 2
CLS     7       0.00    0.00    7 of 7
```
Yours will differ: ours ran in a fast headless browser, on one laptop (INP only counts visits where the page saw a real interaction). In the video, seven visits gave LCP middle 376 ms and worst 516 ms, INP middle 64 and worst 160, CLS 0. The honest reading: one laptop on a fast connection looks far better than real life. What matters is the shape. One visit tells you little; the middle and the slow end of many visits tell the truth, and a release that makes them jump shows up the same day. That is real user monitoring.

## Common mistakes

1. **A real secret in the workflow file**, or in code that ships to the browser. Secrets live in the settings of the provider; the browser bundle is public.
2. **A pipeline that delivers without a gate.** Without `needs`, anything delivers even when the checks are red. Without the `main` branch rule, a half-finished proposal goes live.
3. **Errors without a release tag.** A card that says what broke but not which delivery broke it makes rollback a guessing game.
4. **Sending private data.** Never put what visitors typed, emails or tokens into an error report. Send the message, the place and the release, and nothing more.
5. **An alarm for every tiny error.** A real service groups the same error into one card with a count, and wakes someone up only when something new or big appears.

## Clean up

```bash
# stop the collector and the preview server (Ctrl+C in each terminal)
find dist -delete
```
Delete `node_modules` when you are finished. `actionlint` left nothing behind (`docker rmi rhysd/actionlint:1.7.12` removes the image).

## Next

[M21-B15 · Build a Deploy Pipeline](../m21-b15-build-a-deploy-pipeline/)

Try it yourself: add a third step to the `check` job, then run `actionlint` on it. Then add a sensor for failed requests to the collector.
