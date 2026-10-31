// Loads the app (stage v3-vitals, v4-banner or v5-fixedbanner, built and served on port 5151),
// types "react", and prints the last LCP, INP and CLS lines the page logged, for each run.
// One-time setup (nothing global):  npm install --no-save playwright-core@1.63.0
// Run:  node measure/vitals.mjs 3       (3 runs)
import { chromium } from 'playwright-core'

const runs = Number(process.argv[2] || 1)
const sleep = ms => new Promise(r => setTimeout(r, ms))
const browser = await chromium.launch({ channel: 'chrome', headless: true })
for (let r = 0; r < runs; r++) {
  const ctx = await browser.newContext({ viewport: { width: 720, height: 405 } })
  const page = await ctx.newPage()
  const logs = []
  page.on('console', m => {
    const t = m.text()
    if (/^(LCP|INP|CLS)/.test(t)) logs.push(t)
  })
  await page.goto('http://localhost:5151/')
  await page.waitForSelector('input')
  await sleep(1800)
  await page.locator('input').click()
  await sleep(300)
  for (const ch of 'react') {
    await page.keyboard.type(ch)
    await sleep(700)
  }
  await sleep(500)
  const last = n => logs.filter(l => l.startsWith(n)).pop()
  console.log(JSON.stringify({ LCP: last('LCP'), CLS: last('CLS'), INP: last('INP') }))
  await ctx.close()
}
await browser.close()
