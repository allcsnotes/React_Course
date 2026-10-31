// usage: node measure/lh-summary.mjs before after   -> reads lh-<name>-1.json to lh-<name>-3.json (Lighthouse, desktop preset) and prints the middle value of each number
import fs from 'fs'
const med = a => [...a].sort((x, y) => x - y)[Math.floor((a.length - 1) / 2)]
for (const name of process.argv.slice(2)) {
  const runs = [1, 2, 3].map(i => JSON.parse(fs.readFileSync(`lh-${name}-${i}.json`, 'utf8'))), g = f => med(runs.map(f))
  const score = g(r => Math.round(r.categories.performance.score * 100)), si = g(r => r.audits['speed-index'].numericValue), tbt = g(r => r.audits['total-blocking-time'].numericValue)
  console.log(`${name.padEnd(7)} score ${String(score).padStart(3)} · speed index ${(si / 1000).toFixed(1)} s · blocking ${Math.round(tbt).toLocaleString('en-US')} ms`)
}
