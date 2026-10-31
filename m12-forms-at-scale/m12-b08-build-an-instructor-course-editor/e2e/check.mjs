// The real end-to-end check from the video: 15 claims, one line each.
// Needs the dev server on 5728, the practice API on 8128, and Google Chrome installed.
// One-time setup, nothing global:  npm install --no-save playwright-core@1.63.0
// Run:  node e2e/check.mjs
import { chromium } from 'playwright-core'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const AS = f => path.join(HERE, '..', 'assets', f)
const setMode = m => fs.writeFileSync(path.join(HERE, '..', 'api', 'mode.txt'), m + '\n')
const reset = () => fetch('http://localhost:8128/api/reset', { method: 'POST' })
const stats = async () => (await fetch('http://localhost:8128/api/stats')).json()

const out = []
const pass = (ok, what, val) => {
  out.push(`${ok ? 'PASS' : 'FAIL'}  ${what}${val !== undefined ? '  (' + val + ')' : ''}`)
}

await reset()
setMode('ok')
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const P = await (await browser.newContext({ viewport: { width: 720, height: 405 } })).newPage()
const reqs = []
P.on('request', r => {
  if (r.url().includes('/api/')) reqs.push({ method: r.method(), url: new URL(r.url()).pathname })
})
await P.goto('http://localhost:5728/')
const w = ms => P.waitForTimeout(ms)
const rows = () => P.evaluate(() => [...document.querySelectorAll('.lessons li')].map(li => li.querySelector('input.grow').value))
const errs = () => P.evaluate(() => [...document.querySelectorAll('.err')].map(e => e.textContent))
const chip = () => P.evaluate(() => document.querySelector('.bar .chip')?.textContent || '')

await P.waitForSelector('.lessons')
await w(300)
pass((await rows()).length === 4 && (await P.inputValue('label.field input')) === 'React for Beginners', 'the form loads the saved course', '4 lessons')
pass((await P.locator('.bar button').isDisabled()) && (await chip()) === '', 'Save is disabled until something changes')
let n = reqs.length
await P.fill('label.field input', '')
await P.click('.bar button')
await w(300)
pass((await errs())[0] === 'Title needs at least 5 letters' && reqs.length === n, 'an empty title is stopped before the server', 'no request sent')
await P.fill('label.field input', 'React for Beginners 2026')
await w(150)
pass(!(await errs()).includes('Title needs at least 5 letters'), 'typing a good title clears its own message', 'the others stay')
await P.click('.lessons li:nth-child(1) button:nth-of-type(2)')
await w(200)
pass((await rows())[0] === 'Components as bricks', 'the down arrow moves lesson 1 to place 2')
await P.click('.lessons li:nth-child(4) button:nth-of-type(3)')
await w(200)
pass((await rows()).length === 3, 'the cross removes a lesson', '3 left')
await P.click('.add')
await w(150)
await P.click('.bar button')
await w(300)
pass((await errs()).includes('Give the lesson a title') && (await errs()).includes('Add a thumbnail'), 'a new empty lesson and no thumbnail: both messages at once', (await errs()).join(' / '))
n = reqs.length
await P.setInputFiles('input[type=file]', AS('huge-thumb.png'))
await w(250)
pass((await P.textContent('.thumb .err')) === 'Pick a picture under 2 MB' && reqs.length === n, 'a 3.4 MB picture is refused on the page', 'no upload request')
// slow the connection to 500 KB/s so the progress bar can be watched
const cdp = await P.context().newCDPSession(P)
await cdp.send('Network.enable')
await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 40, downloadThroughput: -1, uploadThroughput: 500 * 1024 })
await P.evaluate(() => {
  window.__p = new Set()
  new MutationObserver(() => {
    const s = document.querySelector('.prog span')
    if (s) window.__p.add(s.textContent)
  }).observe(document.body, { subtree: true, childList: true, characterData: true })
})
await P.setInputFiles('input[type=file]', AS('course-thumb.png'))
await P.waitForSelector('.pic img', { timeout: 20000 })
const seen = await P.evaluate(() => [...window.__p])
pass(seen.length >= 10 && seen.includes('100%'), 'the progress bar moves in many steps up to 100%', seen.length + ' steps')
pass((await stats()).pictures === 1, 'the server received exactly 1 picture')
await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 0, downloadThroughput: -1, uploadThroughput: -1 })
await P.fill('.lessons li:nth-child(4) input.grow', 'Effects')
await w(150)
pass((await errs()).length === 0, 'all messages are gone once everything is valid')
n = reqs.length
await P.click('.bar button')
await w(200)
await P.click('.bar button', { force: true, timeout: 400 }).catch(() => {})
await P.waitForSelector('.bar .chip.ok', { timeout: 6000 })
pass(reqs.slice(n).filter(r => r.method === 'PUT').length === 1 && (await stats()).saves === 1, 'a double click sends exactly 1 save', 'Save is disabled while saving')
await P.reload()
await P.waitForSelector('.lessons')
await w(300)
pass(
  JSON.stringify(await rows()) === JSON.stringify(['Components as bricks', 'What React is', 'Props', 'Effects']) &&
    (await P.inputValue('label.field input')) === 'React for Beginners 2026',
  'after a reload the saved order and title are there',
)
await P.fill('label.field input', 'Python from Zero')
await P.click('.bar button')
await P.waitForSelector('.err', { timeout: 6000 })
pass((await errs())[0] === 'You already have a course called Python from Zero' && (await chip()) === 'Unsaved changes', 'the server says the title is taken: message under Title, edits kept')
setMode('fail')
await P.fill('label.field input', 'React for Beginners 2027')
await P.click('.bar button')
await P.waitForSelector('.bad', { timeout: 6000 })
pass((await P.textContent('.bad')) === 'We could not save your course. Please try again.' && (await chip()) === 'Unsaved changes', 'the server fails: a friendly message, edits kept')
setMode('ok')

console.log(out.join('\n'))
console.log(`${out.filter(l => l.startsWith('PASS')).length} of ${out.length} checks passed`)
await browser.close()
