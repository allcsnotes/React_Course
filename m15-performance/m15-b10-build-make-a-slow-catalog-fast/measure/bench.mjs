// The same measurements every time. Usage:  node measure/bench.mjs <label> [runs]
// It opens the PROFILING build (npm run build:profile, served on port 5760), slows Chrome's CPU by 4,
// then: counts the page's elements, reads the Profiler, clicks Enroll on one card, types "react" key by key,
// and prints the middle value of the runs. Needs the practice API (port 8150) and Google Chrome.
// One-time setup (nothing global):  npm install --no-save playwright-core@1.63.0
// CPU slowdown: THROTTLE=4 (default). Your numbers will differ from the video's.
import { chromium } from 'playwright-core'

const label = process.argv[2] || 'run'
const runs = Number(process.argv[3] || 3)
const url = 'http://localhost:5760/'
const RATE = Number(process.env.THROTTLE || 4)
const med = a => [...a].sort((x, y) => x - y)[Math.floor((a.length - 1) / 2)]
const browser = await chromium.launch({ channel: 'chrome', headless: true })

async function once() {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } })
  const p = await ctx.newPage()
  const cdp = await ctx.newCDPSession(p)
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: RATE })
  await p.addInitScript(() => {
    window.__ev = []
    window.__lcp = 0
    new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lcp = e.startTime })
      .observe({ type: 'largest-contentful-paint', buffered: true })
    new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.interactionId) window.__ev.push({ d: e.duration, id: e.interactionId }) })
      .observe({ type: 'event', durationThreshold: 16, buffered: true })
  })
  await p.goto(url)
  await p.waitForSelector('.card', { timeout: 120000 })
  await p.waitForFunction(() => window.__perf && window.__perf.commits.length >= 2, null, { timeout: 120000 })
  await p.waitForTimeout(1500)
  const load = await p.evaluate(() => ({
    dom: document.querySelectorAll('*').length,
    list: Math.max(...window.__perf.commits.map(c => c.ms)),
    lcp: Math.round(window.__lcp),
  }))
  const reset = () => p.evaluate(() => { window.__ev = []; window.__perf.commits = []; window.__perf.renders = {}; window.__perf.timings = {} })
  const read = () => p.evaluate(() => {
    const by = {}
    for (const e of window.__ev) by[e.id] = Math.max(by[e.id] || 0, e.d)
    const v = Object.values(by)
    return {
      slow: v.length ? Math.round(Math.max(...v)) : 16,
      commit: window.__perf.commits.length ? Math.max(...window.__perf.commits.map(c => c.ms)) : 0,
      cards: window.__perf.renders.CourseCard || 0,
    }
  })
  await reset()
  await p.locator('.card button').nth(1).click()
  await p.waitForTimeout(1500)
  const click = await read()
  await p.click('input')
  await p.waitForTimeout(300)
  await reset()
  for (const ch of 'react') {
    await p.keyboard.type(ch)
    await p.waitForTimeout(1200)
  }
  await p.waitForTimeout(1500)
  const typing = await read()
  await ctx.close()
  return { load, click, typing }
}

const all = []
for (let i = 0; i < runs; i++) all.push(await once())
await browser.close()
const n = x => Math.round(x).toLocaleString('en-US')
const lo = x => (x <= 16 ? '16 or less' : n(x))
const M = f => med(all.map(f))
const row = (k, v, u = '') => '  ' + k.padEnd(22) + String(v).padStart(10) + (u ? ' ' + u : '')
console.log([
  `bench ${label} - ${runs} runs - CPU ${RATE}x slower - median`,
  row('DOM nodes', n(M(r => r.load.dom))),
  row('show the list', n(M(r => r.load.list)), 'ms'),
  row('largest paint (LCP)', n(M(r => r.load.lcp)), 'ms'),
  row('enroll: cards run', n(M(r => r.click.cards))),
  row('enroll: click', lo(M(r => r.click.slow)), 'ms'),
  row('type: slowest key', lo(M(r => r.typing.slow)), 'ms'),
  row('type: biggest commit', n(M(r => r.typing.commit)), 'ms'),
].join('\n'))
