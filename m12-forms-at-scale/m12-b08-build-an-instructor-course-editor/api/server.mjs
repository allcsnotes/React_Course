// The practice A P I for the instructor course editor (module 12, build 8). Meera is signed in; there is no login yet (module 13).
//   GET  /api/instructor/course        -> the course Meera is editing
//   PUT  /api/instructor/course        -> saves it (title, summary, level, price, thumbnail, lessons)
//   POST /api/instructor/thumbnail     -> receives the picture (multipart, field "thumbnail"); answers with its address
//   GET  /api/thumbs/:name             -> serves an uploaded picture
//   POST /api/reset                    -> back to the starting data (for the video's tests)
// mode.txt:  ok = all works | fail = saving fails with 500 | upfail = the upload fails with 500
// Reading takes 400 ms, saving takes 1000 ms. The server checks every rule again (the page is not the proof).
import http from 'node:http'
import fs from 'node:fs'

const START = () => ({
  title: 'React for Beginners',
  summary: 'Learn React from zero: components, state, forms and data, with small projects.',
  level: 'beginner',
  price: 499,
  thumbnail: '',
  lessons: [
    { title: 'What React is', minutes: 8 },
    { title: 'Components as bricks', minutes: 11 },
    { title: 'Props', minutes: 9 },
    { title: 'State', minutes: 12 },
  ],
})
const OTHER_TITLES = ['python from zero', 'sql in two weeks']
let COURSE = START()
let PICS = new Map()
let SAVES = 0
const mode = () => fs.readFileSync(new URL('./mode.txt', import.meta.url), 'utf8').trim()

const check = c => {
  const e = {}
  if (typeof c.title !== 'string' || c.title.trim().length < 5) e.title = 'Title needs at least 5 letters'
  if (typeof c.summary !== 'string' || c.summary.trim().length < 20) e.summary = 'Summary needs at least 20 letters'
  if (!['beginner', 'intermediate', 'advanced'].includes(c.level)) e.level = 'Pick a level'
  if (typeof c.price !== 'number' || !(c.price >= 0)) e.price = 'Enter a price'
  if (!Array.isArray(c.lessons) || c.lessons.length < 1) e.lessons = 'A course needs at least one lesson'
  return e
}

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const send = (code, body) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)) }
  const wait = (ms, fn) => setTimeout(fn, ms)
  const body = cb => { const parts = []; req.on('data', d => parts.push(d)); req.on('end', () => cb(Buffer.concat(parts))) }
  if (req.method === 'POST' && url.pathname === '/api/reset') { COURSE = START(); PICS = new Map(); SAVES = 0; return send(200, { ok: true }) }
  if (req.method === 'GET' && url.pathname === '/api/stats') return send(200, { saves: SAVES, pictures: PICS.size })
  if (req.method === 'GET' && url.pathname === '/api/instructor/course') return wait(400, () => send(200, COURSE))
  if (req.method === 'PUT' && url.pathname === '/api/instructor/course') {
    return body(buf => wait(1000, () => {
      if (mode() === 'fail') return send(500, { error: 'The server could not save the course' })
      let c; try { c = JSON.parse(buf.toString()) } catch { return send(400, { error: 'Bad JSON' }) }
      const e = check(c); if (Object.keys(e).length) return send(422, { errors: e })
      if (OTHER_TITLES.includes(c.title.trim().toLowerCase())) return send(409, { field: 'title', error: `You already have a course called ${c.title.trim()}` })
      COURSE = c; SAVES++; send(200, COURSE)
    }))
  }
  if (req.method === 'POST' && url.pathname === '/api/instructor/thumbnail') {
    const bm = /boundary=(.+)$/.exec(req.headers['content-type'] || '')
    if (!bm) { req.resume(); return req.on('end', () => send(400, { error: 'The upload has no boundary. Do not set Content-Type yourself.' })) }
    return body(buf => wait(300, () => {
      if (mode() === 'upfail') return send(500, { error: 'The server could not store the picture' })
      const start = buf.indexOf('\r\n\r\n'), head = buf.toString('latin1', 0, start), end = buf.lastIndexOf('\r\n--' + bm[1])
      const type = (/Content-Type: ([^\r\n]+)/.exec(head) || [])[1] || ''
      if (!/^image\/(png|jpeg)$/.test(type)) return send(415, { error: 'Only PNG or JPEG pictures are accepted' })
      const file = buf.subarray(start + 4, end)
      if (file.length > 5 * 1024 * 1024) return send(413, { error: 'That picture is too big' })
      const name = `thumb-${PICS.size + 1}.${type.split('/')[1]}`
      PICS.set(name, { type, buf: file }); send(200, { url: `/api/thumbs/${name}`, bytes: file.length })
    }))
  }
  const m = url.pathname.match(/^\/api\/thumbs\/([\w.-]+)$/)
  if (req.method === 'GET' && m && PICS.has(m[1])) { const p = PICS.get(m[1]); res.writeHead(200, { 'content-type': p.type }); return res.end(p.buf) }
  send(404, { error: 'not found' })
}).listen(8128, () => console.log('Practice API on http://localhost:8128'))
