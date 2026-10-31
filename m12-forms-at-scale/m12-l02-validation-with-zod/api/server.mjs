// The practice A P I (module 12, lesson 2): POST /api/courses
//   mode.txt = hand   -> the server checks with its OWN hand-written rules (a second copy of the rule book)
//   mode.txt = schema -> the server checks with the SAME zod schema file the form imports
import http from 'node:http'
import fs from 'node:fs'
import { z } from 'zod'
import { courseSchema } from '../src/schema.ts'

const TAKEN = ['react basics']
const mode = () => fs.readFileSync(new URL('./mode.txt', import.meta.url), 'utf8').trim()
const readJson = req => new Promise(ok => { let s = ''; req.on('data', c => s += c); req.on('end', () => { try { ok(JSON.parse(s)) } catch { ok({}) } }) })

function byHand(b) {
  const problems = {}
  if (b.title.trim().length < 5) {
    problems.title = ['Title needs at least 5 letters']
  }
  if (b.price > 0 && b.description.trim().length < 20) {
    problems.description = ['A paid course needs a description']
  }
  return problems
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const send = (code, body) => { console.log(req.method, url.pathname, code); res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(body)) }
  if (url.pathname === '/api/courses' && req.method === 'POST') {
    const body = await readJson(req)
    console.log('body', JSON.stringify(body))
    await new Promise(r => setTimeout(r, 400))
    if (mode() === 'hand') {
      const problems = byHand(body)
      if (Object.keys(problems).length) return send(422, { errors: problems })
      return send(201, { title: body.title })
    }
    const result = courseSchema.safeParse(body)
    if (!result.success) {
      return send(422, { errors: z.flattenError(result.error).fieldErrors })
    }
    if (TAKEN.includes(result.data.title.toLowerCase())) {
      return send(409, {
        errors: { title: ['A course with this title already exists'] },
      })
    }
    return send(201, { title: result.data.title })
  }
  send(404, { error: 'not found' })
}).listen(8122, () => console.log('API on http://localhost:8122'))
