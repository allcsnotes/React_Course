// usage: node use.mjs <stage> [compiler|panic]
//   node use.mjs v1-memo              plain Vite config (no compiler)
//   node use.mjs pl-plain compiler    React Compiler on
//   node use.mjs x-skip panic         React Compiler on, build stops on any problem (panicThreshold: 'all_errors')
// Puts versions/_base (shared files) and versions/<stage> into src/, and the matching vite.config.ts.
// Same job as the video's use.sh.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const [stage, mode] = process.argv.slice(2)
const root = path.dirname(fileURLToPath(import.meta.url))
const stages = fs.readdirSync(path.join(root, 'versions')).filter(d => d !== '_base' && d !== 'c-config')
if (!stage || !stages.includes(stage)) {
  console.log('stages:', stages.join(', '))
  process.exit(1)
}
const src = path.join(root, 'src')
for (const f of fs.readdirSync(src)) {
  if (f !== 'index.css') fs.unlinkSync(path.join(src, f))
}
const shared = ['counters.css', 'main.tsx', 'useRenderCount.ts', 'data.ts', 'Header.tsx', 'LikeButton.tsx', 'Footer.tsx']
for (const f of shared) fs.copyFileSync(path.join(root, 'versions', '_base', f), path.join(src, f))
for (const f of fs.readdirSync(path.join(root, 'versions', stage))) {
  fs.copyFileSync(path.join(root, 'versions', stage, f), path.join(src, f))
}
const config =
  mode === 'compiler' ? ['c-config', 'vite.config.ts'] :
  mode === 'panic' ? ['c-config', 'vite.panic.config.ts'] :
  ['_base', 'vite.config.ts']
fs.copyFileSync(path.join(root, 'versions', ...config), path.join(root, 'vite.config.ts'))
console.log('src/ now holds _base +', stage, '| vite.config.ts =', config.join('/'))
