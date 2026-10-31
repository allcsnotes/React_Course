// Page on one port, API on another = two origins. What the browser does with the session cookie.
// Needs: dev server on 5231, practice API on 8131, Google Chrome installed.
// One-time setup (nothing global):  npm install --no-save playwright-core@1.63.0
// Run:  node e2e/cors.mjs   (it changes api/mode.txt and puts it back to "same")
import { chromium } from 'playwright-core'
import fs from 'node:fs'

const mode = m => fs.writeFileSync(new URL('../api/mode.txt', import.meta.url), m + '\n')
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage()
const errors = []
page.on('console', m => {
  if (m.type() === 'error') errors.push(m.text())
})
mode('cors') // the API names the exact origin and allows credentials
await page.goto('http://localhost:5231/')
await page.waitForSelector('button')
await page.evaluate(() =>
  fetch('http://localhost:8131/api/session/login', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ email: 'lukas@example.com', password: 'pass1234' }),
  }),
)
const run = name =>
  page.evaluate(async name => {
    const m = await import('/src/who.ts')
    try {
      const r = await m[name]()
      return r.status + ' ' + JSON.stringify(await r.json())
    } catch (e) {
      return e.name + ': ' + e.message
    }
  }, name)

console.log('without credentials:    ', await run('without'))
console.log('credentials: include:   ', await run('withCookie'))
mode('wild') // the API answers Allow-Origin: *
errors.length = 0
console.log('wildcard + include:     ', await run('withCookie'))
await page.waitForTimeout(300)
console.log('console error:          ', errors[0])
mode('same')
await browser.close()
