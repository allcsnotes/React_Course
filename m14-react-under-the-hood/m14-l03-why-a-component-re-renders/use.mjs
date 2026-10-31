// usage: node use.mjs <stage>   e.g. node use.mjs v2-down
// Puts versions/_base and versions/<stage> into src/ (data.ts and index.css stay). Same job as the video's use.sh.
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
for (const f of fs.readdirSync(src)) {
  if (f !== 'data.ts' && f !== 'index.css') fs.unlinkSync(path.join(src, f))
}
for (const dir of ['_base', stage]) {
  for (const f of fs.readdirSync(path.join(root, 'versions', dir))) {
    fs.copyFileSync(path.join(root, 'versions', dir, f), path.join(src, f))
  }
}
console.log('src/ now holds _base +', stage)
