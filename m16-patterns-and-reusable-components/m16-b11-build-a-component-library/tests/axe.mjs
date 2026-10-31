// axe-core on every demo, in the state where the component is OPEN (real run)
import { start, press } from './kb.mjs'
import path from 'path'
const AXE = path.resolve('node_modules/axe-core/axe.min.js')
const cases = [['#tabs', async p => { await p.getByRole('tab', { name: 'Lessons' }).click() }], ['#modal', async p => { await p.getByRole('button', { name: 'Delete course' }).click() }],
  ['#dropdown', async p => { await p.getByRole('button', { name: 'Actions' }).click() }], ['#toast', async p => { await p.getByRole('button', { name: 'Save' }).click() }]]
let total = 0
for (const [hash, go] of cases) {
  const S = await start(hash), p = S.p; await go(p); await p.waitForTimeout(200); await p.addScriptTag({ path: AXE })
  const r = await p.evaluate(() => axe.run(document, { resultTypes: ['violations'] }))
  console.log(`${hash.padEnd(10)} axe ${r.violations.length ? r.violations.length + ' violation(s)' : '0 violations'}`)
  for (const v of r.violations) { total++; console.log(`  ${v.id} (${v.impact}): ${v.help}`); for (const n of v.nodes.slice(0, 2)) console.log(`    ${n.html.slice(0, 90)}`) }
  await S.close(false)
}
console.log(total ? `axe found ${total} problem(s)` : 'axe found 0 problems')
process.exit(0)
