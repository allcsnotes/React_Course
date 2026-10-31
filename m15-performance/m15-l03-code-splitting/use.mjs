// usage: node use.mjs <stage>   e.g. node use.mjs v1-lazy
// Puts versions/_shared and versions/<stage> into src/ (the job of the video's use.sh).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const stage = process.argv[2]
const root = path.dirname(fileURLToPath(import.meta.url))
if (!stage || stage === '_shared' || !fs.existsSync(path.join(root, 'versions', stage))) {
  console.log('stages:', fs.readdirSync(path.join(root, 'versions')).filter(d => d !== '_shared').join(', '))
  process.exit(1)
}
const src = path.join(root, 'src')
fs.mkdirSync(src, { recursive: true })
for (const f of fs.readdirSync(src)) fs.unlinkSync(path.join(src, f))
for (const dir of ['_shared', stage]) {
  for (const f of fs.readdirSync(path.join(root, 'versions', dir))) {
    fs.copyFileSync(path.join(root, 'versions', dir, f), path.join(src, f))
  }
}
console.log('src/ now holds _shared +', stage)
