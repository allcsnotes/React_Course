// Shared Playwright helper for the end-to-end check (viewport 720 x 405). Needs: npm install (playwright-core) in this folder.
// By default it uses a Chrome/Chromium you point to with the CHROME environment variable (for example on a Mac:
// CHROME='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'). Without it Playwright looks for its own Chromium (npx playwright install chromium).
import { chromium } from 'playwright-core'
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url'
const HERE = path.dirname(fileURLToPath(import.meta.url))
export const APP = process.env.APP ?? 'http://localhost:5717/'
export const API = process.env.API ?? 'http://localhost:8217'
export const setMode = m => fs.writeFileSync(path.join(HERE, '../api/mode.txt'), m + '\n')
export const reset = () => fetch(API + '/api/reset', { method: 'POST' })
export async function open(url = APP, { w = 720, h = 405 } = {}) {
  const b = await chromium.launch({ executablePath: process.env.CHROME || undefined, headless: true })
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 })
  const p = await ctx.newPage(); const logs = [], reqs = []
  p.on('console', m => logs.push({ type: m.type(), text: m.text() })); p.on('pageerror', e => logs.push({ type: 'pageerror', text: e.message }));
  p.on('request', r => { if (r.url().includes('/api/')) reqs.push({ t: Date.now(), method: r.method(), url: new URL(r.url()).pathname }) });
  if (url) await p.goto(url);
  const S = {
    b, p, logs, reqs,
    text: () => p.evaluate(() => document.body.innerText),
    box: async sel => { const r = await p.locator(sel).first().boundingBox(); return r },
    close: async (exit = true) => { await Promise.race([b.close(), new Promise(r => setTimeout(r, 4000))]); if (exit) setTimeout(() => process.exit(0), 300) },
  };
  return S;
}
