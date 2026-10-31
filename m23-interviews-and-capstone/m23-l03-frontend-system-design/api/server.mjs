// The practice API for M23-L03: a feed, a video player and a dashboard. Plain node, no packages.
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const PORT = 8233
const NAMES = ['Asha', 'Lukas', 'Priya', 'Meera']
const TEXTS = ['Finished the lesson on state today', 'Shipped my first custom hook', 'Why does my effect run twice?', 'Our build is now 40 percent smaller', 'Reading about cursors for feeds', 'Tests are green at last', 'Anyone tried the new compiler?', 'Deployed the app on a small server']

// ---------- feed: newest first, ids count down ----------
let nextId = 10000
const posts = new Map()
const order = []
for (let id = 1; id <= 10000; id++) {
  posts.set(id, { id, author: NAMES[id % 4], text: TEXTS[id % 8], likes: id % 17, liked: false })
}
for (let id = 10000; id >= 1; id--) order.push(id)
const latency = { like: 800 }
let failLike = false
let failPage = -1
const sendJson = (res, status, body, extra = {}) => {
  res.writeHead(status, { 'content-type': 'application/json', 'access-control-allow-origin': '*', ...extra })
  res.end(JSON.stringify(body))
}

// ---------- dashboard: one data point per second for 24 hours, deterministic ----------
const RAW = 86400
const rawAt = (i) => Math.round(200 + 120 * Math.sin(i / 3600) + 40 * Math.sin(i / 97) + ((i * 7919) % 31))
const series = (points, secs) => {
  const size = secs / points
  const from = RAW - secs
  const out = []
  for (let b = 0; b < points; b++) {
    let sum = 0
    for (let i = from + b * size; i < from + (b + 1) * size; i++) sum += rawAt(i)
    out.push(Math.round(sum / size))
  }
  return out
}
const RANGES = { '1h': 3600, '24h': 86400 }
let failWidget = ''
let failManifest = false

const MIME = { '.m3u8': 'application/vnd.apple.mpegurl', '.ts': 'video/mp2t', '.json': 'application/json' }
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x')
  const p = url.pathname
  if (req.method === 'OPTIONS') { res.writeHead(204, { 'access-control-allow-origin': '*', 'access-control-allow-methods': '*', 'access-control-allow-headers': '*' }); return res.end() }
  // ----- feed
  if (p === '/api/feed') {
    const limit = Math.min(Number(url.searchParams.get('limit') || 20), 100)
    const cursor = url.searchParams.get('cursor')
    if (failPage >= 0 && Number(cursor) === failPage) return sendJson(res, 503, { error: 'feed unavailable' })
    let start = 0
    if (cursor) start = order.findIndex((id) => id < Number(cursor))
    const slice = order.slice(start, start + limit).map((id) => posts.get(id))
    const last = slice[slice.length - 1]
    const more = start + limit < order.length
    return sendJson(res, 200, { posts: slice, nextCursor: more && last ? last.id : null })
  }
  if (p === '/api/feed-offset') {
    const limit = Math.min(Number(url.searchParams.get('limit') || 20), 100)
    const offset = Number(url.searchParams.get('offset') || 0)
    const slice = order.slice(offset, offset + limit).map((id) => posts.get(id))
    return sendJson(res, 200, { posts: slice, nextOffset: offset + limit < order.length ? offset + limit : null })
  }
  if (p === '/api/feed/new' && req.method === 'POST') {
    nextId++
    const post = { id: nextId, author: 'Meera', text: 'A brand new post', likes: 0, liked: false }
    posts.set(post.id, post); order.unshift(post.id)
    return sendJson(res, 201, post)
  }
  if (p.startsWith('/api/posts/') && p.endsWith('/like') && req.method === 'POST') {
    const id = Number(p.split('/')[3]); const post = posts.get(id)
    return setTimeout(() => {
      if (failLike || !post) return sendJson(res, 500, { error: 'could not like' })
      post.liked = !post.liked; post.likes += post.liked ? 1 : -1
      sendJson(res, 200, post)
    }, latency.like)
  }
  // ----- test switches (used by my capture scripts only)
  if (p === '/api/_set') {
    if (url.searchParams.has('failLike')) failLike = url.searchParams.get('failLike') === '1'
    if (url.searchParams.has('failPage')) failPage = Number(url.searchParams.get('failPage'))
    if (url.searchParams.has('failManifest')) failManifest = url.searchParams.get('failManifest') === '1'
    if (url.searchParams.has('failWidget')) failWidget = url.searchParams.get('failWidget')
    if (url.searchParams.has('reset')) { nextId = 10000; for (const id of [...posts.keys()]) if (id > 10000) { posts.delete(id) } while (order[0] > 10000) order.shift(); for (const q of posts.values()) { q.liked = false; q.likes = q.id % 17 } }
    return sendJson(res, 200, { ok: true, failLike, failPage, failWidget, nextId })
  }
  // ----- video
  if (p.startsWith('/api/video/')) {
    const body = JSON.stringify({ id: 1, title: 'Closures, part one', teacher: 'Meera', durationSeconds: 60, manifest: '/media/v1/index.m3u8', captions: '/media/v1/captions.vtt' })
    const etag = '"' + crypto.createHash('md5').update(body).digest('hex').slice(0, 12) + '"'
    const headers = { 'content-type': 'application/json', etag, 'cache-control': 'no-cache', 'access-control-allow-origin': '*' }
    if (req.headers['if-none-match'] === etag) { res.writeHead(304, headers); return res.end() }
    res.writeHead(200, headers); return res.end(body)
  }
  if (p.startsWith('/media/v1/')) {
    if (failManifest && p.endsWith('.m3u8')) { res.writeHead(404, { 'access-control-allow-origin': '*' }); return res.end('gone') }
    const file = path.join(HERE, 'media', path.basename(p))
    if (!fs.existsSync(file)) { res.writeHead(404, { 'access-control-allow-origin': '*' }); return res.end('not found') }
    const ext = path.extname(file)
    const cc = ext === '.ts' ? 'public, max-age=31536000, immutable' : 'public, max-age=60'
    const buf = fs.readFileSync(file)
    res.writeHead(200, { 'content-type': MIME[ext] || 'text/vtt', 'content-length': buf.length, 'cache-control': cc, 'access-control-allow-origin': '*' })
    return res.end(buf)
  }
  // ----- dashboard
  if (p === '/api/dash/series') {
    const range = url.searchParams.get('range') || '24h'
    const points = Number(url.searchParams.get('points') || 288)
    if (failWidget === 'series') return sendJson(res, 500, { error: 'series failed' })
    const raw = url.searchParams.get('raw') === '1'
    const secs = RANGES[range] || 86400
    if (raw) return sendJson(res, 200, { range, values: Array.from({ length: secs }, (_, i) => rawAt(RAW - secs + i)) })
    return sendJson(res, 200, { range, values: series(points, secs) })
  }
  if (p === '/api/dash/top') {
    if (failWidget === 'top') return sendJson(res, 500, { error: 'top failed' })
    return sendJson(res, 200, { rows: [['Closures, part one', 1840], ['Hooks from scratch', 1522], ['Fetching data', 1311], ['Forms that work', 987]] })
  }
  if (p === '/api/dash/revenue') {
    if (failWidget === 'revenue') return sendJson(res, 500, { error: 'revenue service is down' })
    return sendJson(res, 200, { today: 4820, currency: 'USD' })
  }
  if (p === '/api/dash/live') {
    if (failWidget === 'live') return sendJson(res, 500, { error: 'live failed' })
    return sendJson(res, 200, { learners: 128 + (Math.floor(Date.now() / 5000) % 9), at: Date.now() })
  }
  res.writeHead(404, { 'content-type': 'text/plain' }); res.end('not found')
})
server.listen(PORT, () => console.log('practice API on ' + PORT))
