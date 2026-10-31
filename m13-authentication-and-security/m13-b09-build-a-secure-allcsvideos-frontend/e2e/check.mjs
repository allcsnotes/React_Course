// A real browser test of the running app. Prints PASS or FAIL for each claim.
// Needs: dev server on 5739, practice API on 8139, Google Chrome installed.
// One-time setup (nothing global):  npm install --no-save playwright-core@1.63.0
// Run:  node e2e/check.mjs      (takes about 20 seconds: it waits for the 8-second token to expire)
import { chromium } from 'playwright-core'

const API = 'http://localhost:8139'
const BASE = 'http://localhost:5739'
const J = { 'content-type': 'application/json' }
let failed = 0
const ok = (name, cond, extra = '') => {
  console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? '  ' + extra : ''))
  if (!cond) failed++
}

await fetch(API + '/api/reset', { method: 'POST' })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const context = await browser.newContext({ viewport: { width: 720, height: 405 } })
const p = await context.newPage()
const net = []
p.on('response', r => {
  const u = new URL(r.url())
  if (u.pathname.startsWith('/api/')) net.push(`${r.request().method()} ${u.pathname} ${r.status()}`)
})
await p.goto(BASE + '/')
const text = () => p.innerText('body')
const fill = async (...vals) => {
  const inputs = p.locator('input')
  for (let i = 0; i < vals.length; i++) await inputs.nth(i).fill(vals[i])
}

await p.waitForSelector('form.panel')
ok('signed out: the dashboard sends me to /login', new URL(p.url()).pathname === '/login')

await p.click('a:has-text("Sign up")')
await p.waitForSelector('form.panel')
await fill('P', 'priya-at-example', 'short')
await p.click('button')
await p.waitForSelector('.fieldbad:not(:empty)')
ok('sign-up: three field messages from the server', (await p.locator('.fieldbad:not(:empty)').count()) === 3)

await fill('Priya', 'priya@example.com', 'study-hard-2026') // demo password
await p.click('button')
await p.waitForSelector('.grid')
ok('sign-up: Priya lands on the dashboard as a student', (await text()).includes('Priya · student'))
ok('no Studio link for a student', (await p.locator('a:has-text("Studio")').count()) === 0)

await p.goto(BASE + '/studio')
await p.waitForTimeout(800)
ok('typing /studio as a student: "403: not for your role"', (await text()).includes('403: not for your role'))

const lukas = await (await fetch(API + '/api/auth/login', { method: 'POST', headers: J, body: JSON.stringify({ email: 'lukas@example.com', password: 'learn-fast-42' }) })).json()
const r403 = await fetch(API + '/api/admin/users', { headers: { authorization: 'Bearer ' + lukas.accessToken } })
ok('the server itself says 403 to a student', r403.status === 403, await r403.text())

const sneaky = await (await fetch(API + '/api/auth/signup', { method: 'POST', headers: J, body: JSON.stringify({ name: 'Sneaky', email: 'sneaky@example.com', password: 'let-me-in-123', role: 'admin' }) })).json()
ok('sign-up with role "admin" in the body is ignored', sneaky.user.role === 'student', 'role: ' + sneaky.user.role)

// log out
await p.goto(BASE + '/')
await p.waitForSelector('.grid')
await p.click('button.ghost')
await p.waitForSelector('form.panel')
const cookiesAfter = (await context.cookies()).filter(c => c.name === 'refresh')
ok('log out: back on /login, refresh cookie gone', new URL(p.url()).pathname === '/login' && cookiesAfter.length === 0)
await p.goBack()
await p.waitForTimeout(700)
ok('Back button after log out shows no courses', !(await text()).includes('React for Beginners'))

// open redirect
await p.goto('about:blank')
await p.goto(BASE + '/login?next=//evil.example/steal')
await p.waitForSelector('form.panel')
await fill('lukas@example.com', 'learn-fast-42')
await p.click('button')
await p.waitForSelector('.grid')
ok('?next=//evil.example is ignored: we stay on our own site', new URL(p.url()).origin === BASE && new URL(p.url()).pathname === '/')
await p.click('button.ghost')
await p.waitForSelector('form.panel')

// wrong password, then Meera
await p.goto('about:blank')
await p.goto(BASE + '/login')
await p.waitForSelector('form.panel')
await fill('lukas@example.com', 'not-my-password')
await p.click('button')
await p.waitForSelector('.bad')
ok('wrong password: "Wrong email or password"', (await p.innerText('.bad')) === 'Wrong email or password')
await fill('meera@example.com', 'teach-well-77')
await p.click('button')
await p.waitForSelector('.grid')
ok('instructor Meera sees the Studio link', (await p.locator('a:has-text("Studio")').count()) === 1 && (await p.locator('a:has-text("Admin")').count()) === 0)
await p.reload()
await p.waitForSelector('.grid')
ok('reload: still signed in (silent refresh from the cookie)', (await text()).includes('Meera · instructor'))

// the 8-second access token runs out, the page keeps working
await p.waitForTimeout(9500)
net.length = 0
await p.click('a:has-text("Studio")')
await p.waitForSelector('.row')
await p.waitForSelector('.card')
await p.waitForTimeout(500)
ok('token expired, the page still works: 401 -> refresh 200 -> retry 200',
  net.join('|') === 'GET /api/instructor/courses 401|POST /api/auth/refresh 200|GET /api/instructor/courses 200',
  '\n    ' + net.join('\n    '))

await p.fill('.row input', 'Docker Basics')
await p.click('.row button')
await p.waitForSelector('text=Docker Basics')
ok('instructor creates a course', true)

// admin changes a role
await p.click('button.ghost')
await p.waitForSelector('form.panel')
await fill('asha@example.com', 'admin-only-99')
await p.click('button')
await p.waitForSelector('a:has-text("Admin")')
await p.click('a:has-text("Admin")')
await p.waitForSelector('.users')
await p.locator('tr', { hasText: 'Priya' }).locator('select').selectOption('instructor')
await p.waitForTimeout(700)
const priya = await (await fetch(API + '/api/auth/login', { method: 'POST', headers: J, body: JSON.stringify({ email: 'priya@example.com', password: 'study-hard-2026' }) })).json()
ok('admin Asha makes Priya an instructor, the server agrees', priya.user.role === 'instructor', 'role: ' + priya.user.role)

await browser.close()
console.log(failed === 0 ? 'all checks passed' : failed + ' check(s) failed')
process.exitCode = failed ? 1 : 0
