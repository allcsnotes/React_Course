// Optional. Measures the tooltip's first painted position with useEffect vs useLayoutEffect.
// Setup (once):  npm install --no-save playwright   and   npx playwright install chromium
// Run:           npm run dev   (in another terminal; port 5162), then:  node flicker-check.mjs 40
// Switch between ./use-version.sh e1-effect and ./use-version.sh e2-layout and run it for each.
import { chromium } from 'playwright'

const N = Number(process.argv[2]) || 40
const url = process.argv[3] || 'http://localhost:5162/'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined }) // CHROME_PATH is optional
const page = await browser.newPage({ viewport: { width: 720, height: 405 } })
// record the tooltip's top on every animation frame (before each paint)
await page.addInitScript(() => {
  window.__runs = []
  let cur = null
  const tick = () => {
    const t = document.querySelector('.tip')
    if (t) {
      if (!cur) { cur = []; window.__runs.push(cur) }
      cur.push(Math.round(t.getBoundingClientRect().top * 10) / 10)
    } else cur = null
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})
let wrongFirst = 0
let firstTops = new Set()
for (let i = 0; i < N; i++) {
  await page.goto(url)
  await sleep(450)
  const btn = await page.locator('.tipwrap button').boundingBox()
  await page.mouse.move(5, 300)
  await sleep(50)
  await page.mouse.move(btn.x + btn.width / 2, btn.y + btn.height / 2)
  await sleep(500)
  const runs = await page.evaluate(() => window.__runs)
  const run = runs[0]
  if (run) {
    const settled = run[run.length - 1]
    firstTops.add(run[0])
    if (run[0] !== settled) wrongFirst++
  }
}
console.log(`first frame wrong: ${wrongFirst} out of ${N}  (first-frame tops seen: ${[...firstTops].join(', ')})`)
await browser.close()
