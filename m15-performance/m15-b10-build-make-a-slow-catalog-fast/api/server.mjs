// The practice A P I for the slow catalog (module 15, build 10). A local stand-in, not the production server.
//   GET /api/courses  -> 10 000 generated courses (same list on every start)
import http from 'node:http'

function rng(seed) { let a = seed; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
const R = rng(15010)
const pick = a => a[Math.floor(R() * a.length)]
const topics = ['React', 'Python', 'Docker', 'SQL', 'Git', 'TypeScript', 'Node', 'Java', 'Kubernetes', 'Linux', 'Redis', 'MongoDB', 'Django', 'Flask', 'AWS', 'Go', 'Rust', 'C++', 'Swift', 'Kotlin', 'Excel', 'Figma', 'Canva', 'Next', 'Vue', 'Svelte', 'Terraform', 'Jenkins', 'Spring Boot', 'Data Science', 'Machine Learning', 'Statistics', 'Algorithms', 'System Design', 'Networking', 'Security', 'Testing', 'GraphQL', 'Tailwind', 'Photography']
const forms = ['for Beginners', 'in Two Weeks', 'from Zero', 'Crash Course', 'Masterclass', 'Step by Step', 'in Practice', 'Hands-on', 'Interview Prep', 'Deep Dive', 'Essentials', 'Projects']
const lead = ['', '', 'Advanced ', 'Modern ', 'Practical ', 'Complete ', 'Quick ', 'Real-world ']
const people = ['Meera', 'Asha', 'Rahul', 'Priya', 'Lukas', 'Ananya', 'Dev', 'Sofia', 'Kenji', 'Amara', 'Omar', 'Elena', 'Tariq', 'Mei', 'Jonas', 'Nia']
const levels = ['Beginner', 'Beginner', 'Intermediate', 'Advanced']
const categories = ['Web', 'Data', 'Cloud', 'Mobile', 'Design', 'Security']
const COURSES = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1, title: pick(lead) + pick(topics) + ' ' + pick(forms), instructor: pick(people) + ' ' + String.fromCharCode(65 + Math.floor(R() * 26)) + '.',
  category: pick(categories), level: pick(levels), hours: Math.round((1 + R() * 19) * 2) / 2, rating: Math.round((3 + R() * 2) * 10) / 10, students: Math.floor(R() * R() * 90000), price: 199 * (1 + Math.floor(R() * 10)),
}))
const BODY = JSON.stringify(COURSES)
const PORT = Number(process.env.PORT || 8150)
const t0 = Date.now()
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  if (url.pathname === '/api/courses') { res.writeHead(200, { 'content-type': 'application/json', 'content-length': Buffer.byteLength(BODY) }); res.end(BODY) }
  else { res.writeHead(404, { 'content-type': 'application/json' }); res.end('{"detail":"Not found"}') }
  console.log('+' + ((Date.now() - t0) / 1000).toFixed(1).padStart(5) + 's ' + req.method.padEnd(4) + ' ' + url.pathname + '  ' + res.statusCode)
}).listen(PORT, () => console.log('practice API on ' + PORT + ', ' + COURSES.length + ' courses, ' + (BODY.length / 1e6).toFixed(2) + ' MB'))
