// The practice A P I for the machine-coding round (port 8232). Every answer takes a RANDOM time (150 to 1200 ms).
// SEED=<number> makes the random numbers repeat, so a recording can be repeated.
import http from 'node:http'

const COURSES = [
  { id: 1, title: 'React for Beginners' }, { id: 2, title: 'Python from Zero' },
  { id: 3, title: 'Python Basics' }, { id: 4, title: 'SQL in Two Weeks' },
  { id: 5, title: 'Git and GitHub' }, { id: 6, title: 'Docker for Developers' },
  { id: 7, title: 'FastAPI in Practice' }, { id: 8, title: 'Async Python' },
  { id: 9, title: 'Python Performance' }, { id: 10, title: 'React Hooks in Practice' },
  { id: 11, title: 'Testing React Apps' }, { id: 12, title: 'DevOps Basics' },
  { id: 13, title: 'System Design' }, { id: 14, title: 'Linux Essentials' },
]
const LESSONS = [
  'What React Is', 'How a Web Page Works', 'Setting Up Your Tools', 'Tour of Your First App', 'let, const and Arrow Functions',
  'Objects and Arrays', 'map, filter and Friends', 'Modules', 'Async JavaScript', 'Short-hand Logic',
  'Components as LEGO Bricks', 'The Rules of JSX', 'JavaScript Inside JSX', 'Props', 'Children and Composition',
  'Handling Events', 'useState', 'How Rendering Works', 'Updating State', 'Lifting State Up',
  'Conditional Rendering', 'Lists and Keys', 'Controlled Inputs', 'Forms and Validation', 'Choosing the State Shape',
  'Plain CSS', 'Tailwind CSS', 'Responsive Design', 'Dark Mode', 'Accessibility Basics',
  'useEffect', 'Dependencies and Cleanup', 'You Might Not Need an Effect', 'useRef', 'Fetching in an Effect',
  'Custom Hooks', 'React Router', 'Routes and Links', 'Nested Routes', 'Loaders and Actions',
  'TypeScript in One Video', 'Typing Props', 'Generic Components', 'Typing API Data', 'Prop Drilling',
  'Context', 'useReducer', 'Zustand', 'Server State', 'useQuery',
]
let seed = Number(process.env.SEED || Date.now() % 100000)
const rnd = () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
const delayMs = () => 150 + Math.floor(rnd() * 1050)
let log = []
const t0 = Date.now(); const now = () => Date.now() - t0

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const send = (code, body) => { res.writeHead(code, { 'content-type': 'application/json', 'access-control-allow-origin': '*' }); res.end(JSON.stringify(body)) }
  if (url.pathname === '/__admin/log') return send(200, log)
  if (url.pathname === '/__admin/reset') { log = []; console.log('--- reset'); if (url.searchParams.get('seed')) seed = Number(url.searchParams.get('seed')); return send(200, { ok: true }) }
  let body, what
  if (url.pathname === '/search') {
    const q = (url.searchParams.get('q') || '').trim().toLowerCase(); what = 'search q=' + q
    body = { items: COURSES.filter(c => c.title.toLowerCase().includes(q)).slice(0, 6) }
  } else if (url.pathname === '/feed') {
    const page = Number(url.searchParams.get('page') || 1); what = 'feed page=' + page
    const items = LESSONS.slice((page - 1) * 10, page * 10).map((t, i) => ({ id: (page - 1) * 10 + i + 1, title: `Lesson ${(page - 1) * 10 + i + 1}: ${t}` }))
    body = { items, nextPage: page * 10 < LESSONS.length ? page + 1 : null }
  } else return send(404, { error: 'not found' })
  const delay = url.searchParams.has('delay') ? Number(url.searchParams.get('delay')) : delayMs()
  const entry = { what, delay, start: now(), end: null, how: 'waiting' }; log.push(entry)
  const timer = setTimeout(() => { entry.how = 'done'; entry.end = now(); console.log(`${what}  answered after ${delay} ms`); send(200, body) }, delay)
  res.on('close', () => { if (!res.writableFinished) { clearTimeout(timer); entry.how = 'closed by the browser'; entry.end = now(); console.log(`${what}  closed by the browser after ${entry.end - entry.start} ms (it would take ${delay} ms)`) } })
}).listen(8232, () => console.log('practice API on http://localhost:8232'))
