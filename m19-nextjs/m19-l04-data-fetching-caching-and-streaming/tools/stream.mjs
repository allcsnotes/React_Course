// usage: node stream.mjs <url> [full]  -> when the pieces of the HTML response arrive (ms since the request)
const t0 = performance.now()
const res = await fetch(process.argv[2])
const dec = new TextDecoder(); let n = 0, first = 0, last = 0, body = ''
for await (const chunk of res.body) { n++; last = Math.round(performance.now() - t0); if (n === 1) first = last; body += dec.decode(chunk)
  if (process.argv[3] === 'full') console.log(`chunk ${n} at ${String(last).padStart(5)} ms, ${String(chunk.length).padStart(6)} bytes`) }
const text = body.replace(/<!-- -->/g, '')
console.log(JSON.stringify({ url: process.argv[2].replace('http://localhost:5194', ''), status: res.status, chunks: n, firstMs: first, lastMs: last, hasFallback: text.includes('Loading reviews'), hasReviews: text.includes('Clear and calm') }))
