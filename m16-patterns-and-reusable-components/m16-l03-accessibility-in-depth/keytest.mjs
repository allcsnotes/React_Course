import { chromium } from 'playwright-core'
import assert from 'node:assert'

const url = process.argv[2] ?? 'http://localhost:5163/?v=good'
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage()
page.setDefaultTimeout(3000)
await page.goto(url)

const tab = name => page.getByRole('tab', { name })
const press = key => page.keyboard.press(key)
for (let i = 0; i < 3; i++) await press('Tab')
assert(await tab('Overview').evaluate(e => e === document.activeElement))
await press('ArrowRight')
assert.equal(await tab('Lessons').getAttribute('aria-selected'), 'true')
await press('Tab')
const left = await page.evaluate(() => document.activeElement.tagName)
assert.equal(left, 'BODY')

console.log('keyboard test passed')
await browser.close()
