// what anyone can read from a published source map: node showmap.mjs <map url> <file name ending>
const [url, want] = process.argv.slice(2)
const map = await (await fetch(url)).json()
const own = map.sources.map((s, i) => [s, i]).filter(([s]) => !s.includes('node_modules'))
console.log(`${map.sources.length} source files, ${own.length} of them yours:`)
for (const [s] of own) console.log('  ' + s.replace(/^(\.\.\/)+/, ''))
const i = map.sources.findIndex((s) => s.endsWith(want))
console.log(`--- ${want}, as it was before the build ---`)
console.log(map.sourcesContent[i].split('\n').slice(0, 9).join('\n'))
