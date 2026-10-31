// The practice A P I (module 12, lesson 3). A stand-in for the allcsvideos server.
//   POST /api/courses   -> saves a course (JSON), 201 with an id
//   POST /api/upload    -> a multipart upload; reads the body slowly so progress is visible; 400 if the boundary is missing
//   GET  /log           -> one line per request
//   POST /reset         -> log emptied
import http from 'node:http'

let log = [], saved = []
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost'), p = url.pathname
  const send = (code, body, type = 'application/json') => { res.writeHead(code, { 'content-type': type }); res.end(typeof body === 'string' ? body : JSON.stringify(body)) }
  if (p === '/log') return send(200, log.map(l => l + '\n').join(''), 'text/plain')
  if (p === '/reset') { log = []; saved = []; return send(200, { ok: true }) }
  if (p === '/saved') return send(200, saved)
  if (p.startsWith('/api/')) log.push(`${req.method} ${p}`)
  if (p === '/api/courses' && req.method === 'POST') {
    let b = ''; req.on('data', c => b += c); req.on('end', () => {
      let c; try { c = JSON.parse(b) } catch { return send(400, { error: 'The body is not JSON' }) }
      if (!Array.isArray(c.lessons) || !c.lessons.length) return send(422, { error: 'A course needs at least one lesson' })
      saved.push(c); send(201, { id: saved.length, lessons: c.lessons.length }) })
    return }
  if (p === '/api/upload' && req.method === 'POST') {
    const ct = req.headers['content-type'] || ''
    if (!/boundary=/.test(ct)) { req.resume(); return req.on('end', () => send(400, { error: 'The upload has no boundary. Do not set Content-Type yourself.' })) }
    let n = 0, head = ''
    req.on('data', c => { if (head.length < 600) head += c.toString('latin1', 0, 600); n += c.length; req.pause(); setTimeout(() => req.resume(), 6) })
    req.on('end', () => { const f = /filename="([^"]+)"/.exec(head); const t = /Content-Type: ([^\r\n]+)/.exec(head)
      if (!t || !/^image\/(png|jpeg)$/.test(t[1])) return send(415, { error: 'Only PNG or JPEG pictures are accepted' })
      send(200, { ok: true, filename: f ? f[1] : '?', type: t[1], bytes: n }) })
    return }
  send(404, { error: 'not found' })
}).listen(8123, () => console.log('API on http://localhost:8123'))
