import fs from 'node:fs'
import { SourceMap } from 'node:module'

const DIST = new URL('../dist/assets/', import.meta.url)
const maps = new Map()

function find(file, line, col) {
  if (!maps.has(file)) {
    const text = fs.readFileSync(new URL(file + '.map', DIST), 'utf8')
    maps.set(file, new SourceMap(JSON.parse(text)))
  }
  const at = maps.get(file).findEntry(line - 1, col - 1)
  const src = at.originalSource.replace(/^(\.\.\/)+/, '')
  return `${src}:${at.originalLine + 1}:${at.originalColumn + 1}`
}

export function decode(text = '') {
  for (const line of text.split('\n')) {
    const m = line.match(/([\w-]+\.js):(\d+):(\d+)/)
    if (!m) continue
    const where = find(m[1], +m[2], +m[3])
    if (!where.includes('node_modules')) return where
  }
  return null
}
