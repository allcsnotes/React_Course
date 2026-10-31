// runs the four keyboard test files and adds up the results
import { spawnSync } from 'child_process'
import { fileURLToPath } from 'url'
const here = fileURLToPath(new URL('.', import.meta.url))
let pass = 0, fail = 0
for (const n of ['tabs', 'modal', 'dropdown', 'toast']) {
  const out = spawnSync('node', [here + `kb-${n}.mjs`], { encoding: 'utf8' }).stdout.trim().split('\n')
  const [, a, b] = out[out.length - 1].match(/(\d+) passed, (\d+) failed/); pass += +a; fail += +b
  console.log(`${n.padEnd(9)} ${a} passed, ${b} failed`)
}
console.log(`total ${pass} passed, ${fail} failed`)
