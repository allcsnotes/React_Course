// usage: node use.mjs <stage>   e.g. node use.mjs v2-actionstate
// Puts versions/common and versions/<stage> into src/ (main.tsx and index.css stay). Same job as the video's setver.sh.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const stage = process.argv[2]
const root = path.dirname(fileURLToPath(import.meta.url))
if (!stage || stage === 'common' || !fs.existsSync(path.join(root, 'versions', stage))) {
  console.log('stages:', fs.readdirSync(path.join(root, 'versions')).filter(d => d !== 'common').join(', '))
  process.exit(1)
}
const src = path.join(root, 'src')
for (const f of fs.readdirSync(src)) {
  if (f !== 'main.tsx' && f !== 'index.css') fs.unlinkSync(path.join(src, f))
}
for (const dir of ['common', stage]) {
  for (const f of fs.readdirSync(path.join(root, 'versions', dir))) {
    fs.copyFileSync(path.join(root, 'versions', dir, f), path.join(src, f))
  }
}
console.log('src/ now holds common +', stage)
