// Asks the source map where a spot in the squeezed production file came from.
// Usage:  node sourcemap-demo.mjs <file.js.map> <line> <column>
// Example: node sourcemap-demo.mjs dist/assets/index-XXXX.js.map 9 51381   (the line and column from the console error)
import fs from 'node:fs'
import { SourceMap } from 'node:module'

const [file, line, column] = process.argv.slice(2)
if (!file || !line || !column) {
  console.log('usage: node sourcemap-demo.mjs <file.js.map> <line> <column>')
  process.exit(1)
}
const map = JSON.parse(fs.readFileSync(file, 'utf8'))
const at = new SourceMap(map).findEntry(Number(line) - 1, Number(column) - 1)
console.log(at.originalSource, at.originalLine + 1, at.originalColumn + 1)
