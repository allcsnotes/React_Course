// A tiny local stand-in for the allcsvideos API. Serves the page and /api/courses (after a short wait). Everything else is a 404.
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const port = Number(process.env.PORT || 5125)
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' }

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  if (url.pathname === '/api/courses') {
    setTimeout(() => {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify(JSON.parse(fs.readFileSync(path.join(here, 'courses.json'), 'utf8'))))
    }, 1200)
    return
  }
  if (url.pathname.startsWith('/api/')) {
    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ detail: 'Not Found' }))
    return
  }
  const file = path.join(here, 'public', url.pathname === '/' ? 'index.html' : url.pathname)
  if (file.startsWith(path.join(here, 'public')) && fs.existsSync(file) && fs.statSync(file).isFile()) {
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'text/plain' })
    res.end(fs.readFileSync(file))
    return
  }
  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.end('Not Found')
})
server.listen(port, () => console.log(`API ready at http://localhost:${port}`))
