// Performance budget check: cold load of each page in a real browser against the production server.
// Budget (set before measuring): JavaScript sent <= 200 kB compressed per page, LCP <= 2500 ms.
import { chromium } from '@playwright/test'

const BASE = process.env.BASE_URL ?? 'http://localhost:5847'
const BUDGET = { jsKB: 200, lcpMs: 2500 }
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' })
const signIn = async (ctx) => {
  const p = await ctx.newPage()
  await p.goto(BASE + '/login'); await p.getByLabel('Email').fill('lukas@example.test'); await p.getByLabel('Password').fill('fake-demo-pass')
  await p.getByRole('button', { name: 'Sign in' }).click(); await p.waitForURL('**/my'); await p.close()
}
async function measure(path, signedIn) {
  const ctx = await browser.newContext()
  if (signedIn) await signIn(ctx)
  const page = await ctx.newPage(), cdp = await ctx.newCDPSession(page)
  await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', { cacheDisabled: !process.env.ALLOW_CACHE }); const js = new Map(), urls = new Map()
  cdp.on('Network.responseReceived', (e) => { if (e.type === 'Script') urls.set(e.requestId, e.response.url) })
  cdp.on('Network.loadingFinished', (e) => { if (urls.has(e.requestId)) js.set(e.requestId, e.encodedDataLength) })
  await page.addInitScript(() => { window.__lcp = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime }).observe({ type: 'largest-contentful-paint', buffered: true }) })
  await page.goto(BASE + path, { waitUntil: 'networkidle' }); await page.waitForTimeout(500)
  const lcp = await page.evaluate(() => window.__lcp)
  await ctx.close()
  return { jsKB: [...js.values()].reduce((a, b) => a + b, 0) / 1000, scripts: js.size, lcp }
}
const rows = [['/', false], ['/login', false], ['/courses/docker-for-developers', true]]
console.log(`budget: JS <= ${BUDGET.jsKB} kB compressed, LCP <= ${BUDGET.lcpMs} ms`)
let fail = 0
for (const [path, si] of rows) {
  const runs = []; for (let i = 0; i < 5; i++) runs.push(await measure(path, si))
  const lcps = runs.map((r) => r.lcp).sort((a, b) => a - b), lcp = lcps[2], r = runs[0]
  const ok = r.jsKB <= BUDGET.jsKB && lcp <= BUDGET.lcpMs; if (!ok) fail++
  console.log(`${path.padEnd(32)} JS ${r.jsKB.toFixed(1).padStart(5)} kB · LCP ${lcp.toFixed(0).padStart(3)} ms · ${ok ? 'ok' : 'OVER'}`)
}
await browser.close(); console.log(fail ? `${fail} page(s) over budget` : 'all pages within budget'); process.exit(fail ? 1 : 0)
