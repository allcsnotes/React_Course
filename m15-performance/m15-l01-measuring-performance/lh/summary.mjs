// prints the numbers of a Lighthouse json report
import fs from 'node:fs'

const file = process.argv[2]
const lhr = JSON.parse(fs.readFileSync(file, 'utf8'))
const score = lhr.categories.performance.score
const pct = Math.round(score * 100)
console.log('Performance score', pct)
for (const id of [
  'first-contentful-paint',
  'largest-contentful-paint',
  'total-blocking-time',
  'cumulative-layout-shift',
  'speed-index',
]) {
  const a = lhr.audits[id]
  console.log(a.title.padEnd(28), a.displayValue)
}
