// The practice A P I for the deploy lesson (module 21, lesson 2). A local stand-in, not the production server.
//   GET /api/courses?q=text      -> the catalog (summary of each course)
//   GET /api/courses/:slug       -> one course with its lessons
//   GET /api/courses/:slug/reviews -> reviews (deliberately slow: 1.2 s)
import http from 'node:http'

const PORT = Number(process.env.PORT || 8212)
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
const REVIEWS = [
  { name: 'Lukas', stars: 5, text: 'Clear and calm. I built my first page on day one.' },
  { name: 'Priya', stars: 5, text: 'The examples are small, so I could follow every step.' },
  { name: 'Asha', stars: 4, text: 'Good pace. I wanted a few more exercises.' },
]
const t0 = Date.now()
const stamp = () => '+' + ((Date.now() - t0) / 1000).toFixed(1).padStart(5, ' ') + 's'
http
  .createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost')
    const send = (code, obj, delay = 120) => setTimeout(() => {
      console.log(`${stamp()} ${req.method.padEnd(4)} ${(url.pathname + url.search).padEnd(40)} ${code}`)
      res.writeHead(code, { 'content-type': 'application/json', 'access-control-allow-origin': '*' }); res.end(JSON.stringify(obj))
    }, delay)
    const p = url.pathname
    if (p === '/api/courses') {
      const q = (url.searchParams.get('q') || '').toLowerCase()
      return send(200, COURSES.filter((c) => !q || (c.title + ' ' + c.summary).toLowerCase().includes(q)))
    }
    let m = p.match(/^\/api\/courses\/([a-z0-9-]+)$/)
    if (m) { const c = COURSES.find((x) => x.slug === m[1]); return c ? send(200, { ...c, lessons: LESSONS[c.slug] }) : send(404, { error: 'Course not found' }) }
    m = p.match(/^\/api\/courses\/([a-z0-9-]+)\/reviews$/)
    if (m) return COURSES.find((x) => x.slug === m[1]) ? send(200, REVIEWS, 1200) : send(404, { error: 'Course not found' })
    send(404, { error: 'not found' })
  })
  .listen(PORT, () => console.log(`Practice API on http://localhost:${PORT}`))
