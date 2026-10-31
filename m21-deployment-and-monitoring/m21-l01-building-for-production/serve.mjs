// A tiny static file server for the built site. usage: node serve.mjs <dir> <port> <naive|good>
// It writes one log line per request, so we can see what the browser really asks for.
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import crypto from 'node:crypto'

const [dir, port, mode = 'good'] = process.argv.slice(2)
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.map': 'application/json' }

function cacheControl(file) {
  if (mode === 'naive') return 'public, max-age=86400'
  if (file.startsWith('/assets/')) return 'public, max-age=31536000, immutable'
  return 'no-cache'
}

http
  .createServer((req, res) => {
    let file = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    const asked = file
    let full = path.join(dir, file)
    if (!fs.existsSync(full) || fs.statSync(full).isDirectory()) { file = '/index.html'; full = path.join(dir, file) }
    const ext = path.extname(file)
    let body = fs.readFileSync(full)
    const etag = '"' + crypto.createHash('md5').update(body).digest('hex').slice(0, 16) + '"'
    const headers = { 'content-type': (TYPES[ext] || 'application/octet-stream') + (ext === '.svg' ? '' : '; charset=utf-8'), 'cache-control': cacheControl(file), etag }
    let status = 200
    if (req.headers['if-none-match'] === etag) { status = 304; body = Buffer.alloc(0) }
    else if (/gzip/.test(req.headers['accept-encoding'] || '') && /html|javascript|css|json|svg/.test(headers['content-type'])) { body = zlib.gzipSync(body); headers['content-encoding'] = 'gzip' }
    headers['content-length'] = body.length
    res.writeHead(status, headers)
    res.end(body)
    console.log(`${req.method} ${asked}  ${status}  ${status === 304 ? 'not modified' : body.length + ' B'}`)
  })
  .listen(Number(port), () => console.log(`serving ${dir} on http://localhost:${port} (${mode})`))
