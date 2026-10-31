// usage: node use.mjs <stage>   e.g. node use.mjs s0
// Puts the stage's component files into src/ (api.ts, perf.ts, main.tsx and index.css stay). Same job as the video's setv.sh.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const stage = process.argv[2]
const root = path.dirname(fileURLToPath(import.meta.url))
if (!stage || !fs.existsSync(path.join(root, 'versions', stage))) {
  console.log('stages:', fs.readdirSync(path.join(root, 'versions')).join(', '))
  process.exit(1)
}
const src = path.join(root, 'src')
for (const f of ['Catalog', 'CourseCard', 'Insights', 'CourseGrid']) {
  fs.rmSync(path.join(src, f + '.tsx'), { force: true })
}
for (const f of fs.readdirSync(path.join(root, 'versions', stage))) {
  fs.copyFileSync(path.join(root, 'versions', stage, f), path.join(src, f))
}
console.log('src/ now holds stage', stage)
