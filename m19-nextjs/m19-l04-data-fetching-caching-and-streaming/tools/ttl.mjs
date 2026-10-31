// usage: node ttl.mjs <path> <count> <every ms>  -> what the page says at each visit, and how often the practice A P I was called
const [path, n, every] = [process.argv[2], +process.argv[3], +process.argv[4]]
const t0 = Date.now()
for (let i = 0; i < n; i++) {
  const ta = Date.now()
  const html = (await (await fetch('http://localhost:5194' + path)).text()).replace(/<!-- -->/g, '')
  const m = html.match(/Offer number (\d+)/)
  const hits = await (await fetch('http://localhost:8194/api/_hits')).json()
  console.log(`+${((ta - t0) / 1000).toFixed(1).padStart(4)} s   page: offer ${m ? m[1] : '?'}   API calls: ${hits.offer || 0}`)
  await new Promise((r) => setTimeout(r, every))
}
