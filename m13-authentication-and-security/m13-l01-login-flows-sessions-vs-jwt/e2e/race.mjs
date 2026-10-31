// Two requests at the same moment with an expired access token.
// Needs: dev server on 5231, practice API on 8131, Google Chrome installed.
// One-time setup (nothing global):  npm install --no-save playwright-core@1.63.0
// Run:  node e2e/race.mjs        (use src/auth.ts = versions/naive or versions/final first)
import { chromium } from 'playwright-core'

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage({ viewport: { width: 720, height: 405 } })
const net = []
page.on('response', r => {
  const u = new URL(r.url())
  if (u.pathname.startsWith('/api')) net.push(`${r.request().method()} ${u.pathname} ${r.status()}`)
})
await page.goto('http://localhost:5231/')
await page.waitForSelector('button')
await page.click('button') // Sign in as Lukas (the form is pre-filled with demo values)
await page.waitForSelector('.hello')
await page.waitForTimeout(11000) // the practice access token lives 10 seconds
net.length = 0
// press Load my courses twice, at the same moment
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(x => x.textContent === 'Load my courses')
  b.click()
  b.click()
})
await page.waitForTimeout(1500)
const result = await page.evaluate(() => ({
  error: document.querySelector('.bad')?.textContent || '',
  courses: document.querySelectorAll('.list li').length,
}))
console.log(JSON.stringify(result))
console.log(net.join('\n'))
await browser.close()
