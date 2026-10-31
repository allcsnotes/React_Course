// Quick numbers for the stage in src/: how many elements the page has, how long the first paint took,
// and how long each typed letter took to appear.
// Needs the dev server on port 5154 (npm run dev) and Google Chrome.
// One-time setup (nothing global):  npm install --no-save playwright-core@1.63.0
// Run:  node measure/probe.mjs        or        node measure/probe.mjs py   (the letters to type)
import { chromium } from 'playwright-core'

const keys = process.argv[2] || 'py'
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 720, height: 405 } })
const logs = []
page.on('console', m => logs.push(m.text()))
page.on('pageerror', e => logs.push('PAGEERROR ' + e.message))
await page.goto('http://localhost:5154/')
await page.waitForTimeout(1500)
const nodes = () => page.evaluate(() => document.querySelectorAll('*').length)
console.log('elements:', await nodes(), logs.filter(l => /painted|ERROR/.test(l)))
await page.click('input')
await page.waitForTimeout(300)
logs.length = 0
for (const k of keys) {
  await page.keyboard.type(k)
  await page.waitForTimeout(2500)
}
console.log('after typing', keys, logs.filter(l => /key painted|ERROR/.test(l)), 'elements:', await nodes(),
  await page.evaluate(() => document.querySelector('.count,.found')?.textContent))
await browser.close()
