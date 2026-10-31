// prints the four Lighthouse scores and the main numbers of a saved report: node lh-summary.mjs <report.json>
import fs from 'node:fs'
const r = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
const name = { performance: 'Performance', accessibility: 'Accessibility', 'best-practices': 'Best practices', seo: 'S E O' }
for (const [k, c] of Object.entries(r.categories)) if (name[k]) console.log(`${(k === 'seo' ? 'SEO' : name[k]).padEnd(15)}${Math.round(c.score * 100)}`)
const a = r.audits
console.log(`Largest paint  ${a['largest-contentful-paint'].displayValue}`)
console.log(`Page weight    ${a['total-byte-weight'].displayValue.replace('Total size was ', '')}`)
