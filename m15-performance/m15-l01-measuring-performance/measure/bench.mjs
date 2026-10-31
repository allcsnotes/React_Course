// What a visitor waits for: types "react" one letter at a time and prints, for each run,
// the Profiler console lines and the browser's own event timings [event, total ms, handler ms].
// Needs the app served on port 5151 (npm run dev, or npm run preview after a build) and Google Chrome.
// One-time setup (nothing global):  npm install --no-save playwright-core@1.63.0
// Run:  node measure/bench.mjs 5        (5 runs)
import { chromium } from 'playwright-core'

const runs = Number(process.argv[2] || 1)
const sleep = ms => new Promise(r => setTimeout(r, ms))
const browser = await chromium.launch({ channel: 'chrome', headless: true })
for (let r = 0; r < runs; r++) {
  const ctx = await browser.newContext({ viewport: { width: 720, height: 405 } })
  const page = await ctx.newPage()
  await page.addInitScript(() => {
    window.__ev = []
    new PerformanceObserver(list => {
      for (const e of list.getEntries()) {
        if (e.name === 'keydown' || e.name === 'input') {
          window.__ev.push([e.name, Math.round(e.duration), Math.round(e.processingEnd - e.processingStart)])
        }
      }
    }).observe({ type: 'event', durationThreshold: 16, buffered: true })
  })
  const logs = []
  page.on('console', m => {
    const t = m.text()
    if (/^(catalog|header|LCP|INP|CLS)/.test(t)) logs.push(t)
  })
  await page.goto('http://localhost:5151/')
  await page.waitForSelector('input')
  await sleep(900)
  await page.locator('input').click()
  await sleep(300)
  for (const ch of 'react') {
    await page.keyboard.type(ch)
    await sleep(700)
  }
  console.log(JSON.stringify({ logs, ev: await page.evaluate(() => window.__ev) }))
  await ctx.close()
}
await browser.close()
