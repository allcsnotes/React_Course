// shared keyboard-test helper: real Playwright key presses, one PASS / FAIL line per claim
import { chromium } from 'playwright-core'
export const lines = []
// Opens the gallery page in a real Chrome. Set BASE_URL if your dev server is not on port 5771.
const BASE = process.env.BASE_URL ?? 'http://localhost:5771/'
export async function start(hash) {
  const browser = await chromium.launch({ channel: 'chrome' })
  const p = await browser.newPage({ viewport: { width: 480, height: 270 } })
  await p.goto(BASE + hash)
  await p.waitForSelector('.page')
  await p.waitForTimeout(300)
  // close(false) only closes the browser; close() also ends the process (a test file is done)
  const close = async (exit = true) => {
    await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 4000))])
    if (exit) process.exit(0)
  }
  return { p, hash, close }
}
// where the keyboard focus is, in plain words:  tab "Lessons"  /  button "Open"  /  body
export const focus = p => p.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return 'body'; const role = e.getAttribute('role') || e.tagName.toLowerCase(); const lb = e.getAttribute('aria-labelledby'), name = e.getAttribute('aria-label') || (lb && document.getElementById(lb)?.textContent) || (e.textContent || '').trim().slice(0, 24); return `${role} "${name}"` })
export function check(name, ok, got) { const l = `${ok ? 'PASS' : 'FAIL'} ${name}${got ? ': ' + got : ''}`; lines.push(l); console.log(l); return ok }
export const press = async (p, ...keys) => { for (const k of keys) { await p.keyboard.press(k); await p.waitForTimeout(80) } }
export const summary = () => { const f = lines.filter(l => l.startsWith('FAIL')).length; const l = `${lines.length - f} passed, ${f} failed`; console.log(l); return l }
