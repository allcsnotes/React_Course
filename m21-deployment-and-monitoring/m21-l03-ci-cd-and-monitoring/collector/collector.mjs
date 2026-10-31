import http from 'node:http'
import { decode } from './decode.mjs'
import { page } from './pages.mjs'

const events = []

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'POST' && req.url === '/collect') {
    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', () => {
      const event = JSON.parse(body)
      if (event.kind !== 'vital') event.source = decode(event.stack + event.extra)
      events.push(event)
      console.log(event.kind, event.name ?? event.message)
      res.writeHead(204).end()
    })
    return
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.end(page(req.url, events))
})

server.listen(8213, () => console.log('collector on http://localhost:8213'))
