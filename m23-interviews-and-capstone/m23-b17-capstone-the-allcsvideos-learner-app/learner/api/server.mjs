// The practice A P I for the capstone (module 23, build 17). A local stand-in, not the production server.
//   GET  /api/courses?q=text            the catalog
//   GET  /api/courses/:slug             one course with its lessons
//   GET  /api/progress/:userId          { slug: [lesson numbers done] }
//   POST /api/progress                  { userId, slug, lesson }
//   POST /api/feedback                  { name, email, rating, message }
import http from 'node:http'

const PORT = Number(process.env.PORT || 8247)
const LESSONS = {
  'react-for-beginners': ['What React is', 'Components and props', 'State and events', 'Lists and forms'],
  'python-from-zero': ['Your first program', 'Variables and types', 'Loops and functions'],
  'sql-in-two-weeks': ['Select and filter', 'Joins', 'Group and count'],
  'docker-for-developers': ['Images and containers', 'Volumes and ports', 'Compose'],
  'javascript-essentials': ['let, const and arrow functions', 'Objects and arrays', 'Promises and fetch', 'Modules'],
  'git-and-github': ['Commits and branches', 'Merging', 'Pull requests'],
  'html-and-css-basics': ['Tags and structure', 'Selectors', 'Flexbox and grid', 'Responsive pages'],
  'system-design-primer': ['Servers and requests', 'Caches and CDNs', 'Databases and scaling'],
}
const COURSES = [
  ['react-for-beginners', 'React for Beginners', 'Meera', 'beginner', 499, 'Build your first screens with components, props and state, step by step.'],
  ['python-from-zero', 'Python from Zero', 'Meera', 'beginner', 0, 'Learn to program with Python. No experience needed, and it is free.'],
  ['sql-in-two-weeks', 'SQL in Two Weeks', 'Asha', 'intermediate', 399, 'Ask questions of a database with select, join and group.'],
  ['docker-for-developers', 'Docker for Developers', 'Rahul', 'intermediate', 599, 'Package an app so it runs the same on every machine.'],
  ['javascript-essentials', 'JavaScript Essentials', 'Asha', 'beginner', 449, 'The JavaScript every React developer needs: functions, objects and promises.'],
  ['git-and-github', 'Git and GitHub', 'Rahul', 'beginner', 0, 'Save your work in commits, work in branches and share it on GitHub.'],
  ['html-and-css-basics', 'HTML and CSS Basics', 'Meera', 'beginner', 299, 'Build and style a real web page from a blank file.'],
  ['system-design-primer', 'System Design Primer', 'Rahul', 'advanced', 699, 'How big websites stay fast: caches, CDNs, databases and queues.'],
].map(([slug, title, teacher, level, price, summary]) => ({ slug, title, teacher, level, price, free: price === 0, summary, lessonCount: LESSONS[slug].length }))
// in memory: a restart forgets all of this
const progress = {} // userId -> slug -> Set of lesson numbers
const feedback = []
const t0 = Date.now()
const stamp = () => '+' + ((Date.now() - t0) / 1000).toFixed(1).padStart(5, ' ') + 's'
const body = (req) => new Promise((ok) => { let s = ''; req.on('data', (c) => (s += c)); req.on('end', () => { try { ok(JSON.parse(s || '{}')) } catch { ok({}) } }) })
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const send = (code, obj) => {
    console.log(`${stamp()} ${req.method.padEnd(4)} ${(url.pathname + url.search).padEnd(34)} ${code}`)
    res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(obj))
  }
  const p = url.pathname
  if (p === '/api/courses' && req.method === 'GET') {
    const q = (url.searchParams.get('q') || '').toLowerCase()
    return send(200, COURSES.filter((c) => !q || (c.title + ' ' + c.summary).toLowerCase().includes(q)))
  }
  let m = p.match(/^\/api\/courses\/([a-z0-9-]+)$/)
  if (m) { const c = COURSES.find((x) => x.slug === m[1]); return c ? send(200, { ...c, lessons: LESSONS[c.slug] }) : send(404, { error: 'Course not found' }) }
  m = p.match(/^\/api\/progress\/(\w+)$/)
  if (m && req.method === 'GET') return send(200, Object.fromEntries(Object.entries(progress[m[1]] || {}).map(([s, set]) => [s, [...set].sort()])))
  if (p === '/api/progress' && req.method === 'POST') {
    const { userId, slug, lesson } = await body(req)
    if (!userId || !LESSONS[slug] || !Number.isInteger(lesson) || lesson < 0 || lesson >= LESSONS[slug].length) return send(400, { error: 'bad progress' })
    ;((progress[userId] ||= {})[slug] ||= new Set()).add(lesson)
    return send(200, { ok: true })
  }
  if (p === '/api/feedback' && req.method === 'POST') {
    const f = await body(req); feedback.push(f)
    return send(201, { id: feedback.length })
  }
  send(404, { error: 'not found' })
}).listen(PORT, () => console.log(`Practice API on http://localhost:${PORT}`))
