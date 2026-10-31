// Prints the accessibility tree and the axe-core result for one page of the app.
// Usage (dev server running on port 5163):  node a11y-check.mjs "?v=bad"
//   pages: ?v=bad  ?v=good  ?d=m1  ?d=m2  ?d=m3
import { chromium } from 'playwright-core'
import fs from 'node:fs'

const query = process.argv[2] ?? '?v=good'
const url = 'http://localhost:5163/' + query
const axeSource = fs.readFileSync('node_modules/axe-core/axe.min.js', 'utf8')

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage()
await page.goto(url)

console.log('--- accessibility tree ---')
console.log(await page.locator('body').ariaSnapshot())

await page.addScriptTag({ content: axeSource })
const result = await page.evaluate(() => axe.run())
console.log('--- axe-core ---')
console.log('violations:', result.violations.length, ' checks passed:', result.passes.length)
for (const v of result.violations) {
  console.log(`  ${v.id} (${v.impact}): ${v.help}`)
}
await browser.close()
