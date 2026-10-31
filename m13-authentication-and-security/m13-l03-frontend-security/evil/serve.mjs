// the "other website" for the practice demo: evil.localhost:5236 serves one page (module 13, lesson 3). Local only.
import http from 'node:http'
import fs from 'node:fs'
const page = fs.readFileSync(new URL('./evil.html', import.meta.url))
http.createServer((req, res) => { res.writeHead(200, { 'content-type': 'text/html' }); res.end(page) }).listen(5236, () => console.log('other site on http://evil.localhost:5236'))
