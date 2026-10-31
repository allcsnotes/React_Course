// Drives every machine-coding task in a real browser with Playwright and writes shots/tNN.{json,txt,png}.
// Usage:  node scripts/drive.mjs [taskNumber ...]
// Needs: the dev server on BASE (default http://localhost:5239) and the practice API on API (default http://localhost:8239, started with SEED=1).
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const BASE = process.env.BASE ?? 'http://localhost:5239'
const API = process.env.API ?? 'http://localhost:8239'
const PW = process.env.PW ?? '../../../_engine/node/node_modules/playwright-core/index.mjs'
const { chromium } = await import(new URL(PW, import.meta.url).href)

mkdirSync(new URL('../shots/', import.meta.url), { recursive: true })
const out = (name) => new URL('../shots/' + name, import.meta.url)
const browser = await chromium.launch({ executablePath: process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true })
const only = process.argv.slice(2).map(Number)
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const active = (page) => page.evaluate(() => document.activeElement?.getAttribute('aria-label') ?? document.activeElement?.textContent ?? document.activeElement?.tagName)

const scripts = {
  1: async (c) => {
    const { page } = c
    const input = page.getByRole('combobox')
    await c.snap('start')
    await fetch(API + '/__admin/reset')
    await input.click(); await page.keyboard.type('rea', { delay: 80 })
    await page.getByRole('option').first().waitFor()
    await c.snap('after typing "rea" fast (3 keys, 80 ms apart)')
    await c.note('practice API log: how many searches were sent?', (await (await fetch(API + '/__admin/log')).json()).map((e) => `${e.what} (${e.how})`).join('\n'))
    await input.fill(''); await page.keyboard.press('Escape')
    await c.note('keyboard: ArrowDown, ArrowDown, then Enter', await (async () => {
      await input.fill('react'); await page.getByRole('option').first().waitFor()
      await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowDown')
      const sel = await page.locator('[aria-selected=true]').innerText()
      await page.keyboard.press('Enter')
      return `highlighted: ${sel}\ninput now: ${await input.inputValue()}\nlist open: ${await page.locator('#list').count() > 0}`
    })())
    await input.fill('zzz'); await page.getByText('No courses found').waitFor(); await c.snap('empty case: "zzz"')
    await input.fill('')
    await fetch(API + '/__admin/reset')
    await page.getByLabel('Slow API (2.5 s)').check()
    await input.fill('py'); await wait(500) // the request for "py" is now on its way and will take 2.5 s
    await input.fill('pyt')
    await page.getByRole('option').first().waitFor({ timeout: 6000 })
    await c.snap('slow case: typed "py", then "pyt" while the first answer was still on its way')
    await c.note('practice API log (the first request must be closed by the browser)', (await (await fetch(API + '/__admin/log')).json()).map((e) => `${e.what} (${e.how})`).join('\n'))
    await page.getByLabel('Slow API (2.5 s)').uncheck(); await page.getByLabel('Failing API (500)').check()
    await input.fill('react'); await page.getByText('Something went wrong').waitFor(); await c.snap('error case: API answers 500')
  },
  2: async (c) => {
    const { page } = c
    await page.waitForFunction(() => document.querySelector('[data-testid=counter]')?.textContent?.startsWith('10'))
    await c.snapText('after the first load (no scrolling yet, the window is tall)', await c.feedText())
    for (let i = 0; i < 20; i++) {
      if ((await page.getByTestId('sentinel').innerText()).includes('That is all')) break
      await page.mouse.wheel(0, 3000); await wait(700)
    }
    await c.snapText('after scrolling to the bottom', await c.feedText())
    await c.note('console log of the page', c.logLines.join('\n'))
    await page.goto(BASE + '/?fail=1#/2'); await page.reload()
    await page.getByText('Could not load more.').waitFor(); await c.snapText('error case: API answers 500 on page 1 (opened with ?fail=1)', await c.feedText())
    await page.getByLabel('Failing API (500)').uncheck()
    await page.getByRole('button', { name: 'Retry' }).click(); await page.waitForFunction(() => document.querySelector('[data-testid=counter]')?.textContent?.startsWith('10'))
    await c.snapText('after the API is fixed and Retry was clicked', await c.feedText())
  },
  3: async (c) => {
    const { page } = c
    const said = () => page.getByTestId('said').innerText()
    const checked = () => page.evaluate(() => document.querySelector('[aria-checked=true]')?.getAttribute('aria-label') ?? 'none checked')
    await c.snap('start')
    await page.getByRole('radio', { name: '4 stars' }).click(); await c.snap('after clicking the 4th star')
    await page.getByRole('radio', { name: '4 stars' }).click(); await c.snap('after clicking the 4th star again (clears it)')
    await page.getByRole('radio', { name: '1 star' }).focus()
    for (const [k, n] of [['ArrowRight', 2], ['End', 1], ['ArrowLeft', 1], ['Home', 1], ['ArrowLeft', 1]]) {
      for (let i = 0; i < n; i++) await page.keyboard.press(k)
      await c.note(`keyboard: ${k} x${n}`, `${await said()}\nfocused: ${await active(page)}\nchecked: ${await checked()}`)
    }
    await c.note('Tab order: stars in the tab order', String(await page.evaluate(() => [...document.querySelectorAll('[role=radio]')].filter((e) => e.tabIndex === 0).length)))
  },
  4: async (c) => {
    const { page } = c
    const btn = (n, i = 0) => page.locator('#exercise').getByRole('button', { name: n, exact: true }).nth(i)
    await c.snap('start')
    await btn('Collapse', 0).click(); await c.snap('after Collapse on Lukas')
    await btn('Show 3 replies').click(); await c.snap('after Show 3 replies')
    await btn('Reply', 3).click(); await page.keyboard.type('Welcome, Priya'); await page.keyboard.press('Enter'); await c.snap('after Reply on Priya: "Welcome, Priya"')
    await btn('Reply', 4).click(); await page.keyboard.press('Enter'); await c.snap('empty reply on Asha: Enter with nothing typed')
    await btn('Clear all comments').click(); await c.snap('after Clear all comments')
  },
  5: async (c) => {
    const { page } = c
    const sel = () => page.evaluate(() => `selected tab: ${document.querySelector('[role=tab][aria-selected=true]').textContent} | focused: ${document.activeElement.textContent} | visible panel: ${[...document.querySelectorAll('[role=tabpanel]')].filter((p) => !p.hidden).map((p) => p.textContent)}`)
    await c.snap('start')
    await page.keyboard.press('Tab'); await c.note('after Tab (first stop is the Back to menu button above)', await sel())
    await page.keyboard.press('Tab'); await c.note('after a second Tab (focus enters the tab list)', await sel())
    for (const k of ['ArrowRight', 'End', 'ArrowRight', 'Home', 'ArrowLeft']) { await page.keyboard.press(k); await c.note('after ' + k, await sel()) }
    await c.note('tab stops in the list', String(await page.evaluate(() => [...document.querySelectorAll('[role=tab]')].filter((e) => e.tabIndex === 0).length)))
  },
  6: async (c) => {
    const { page } = c
    await page.getByLabel('Time on screen').selectOption('1500')
    await c.snap('start')
    for (let i = 0; i < 4; i++) await c.click('Add success toast')
    await c.snap('after 4 success toasts (only the newest 3 stay)')
    await c.click('Add error toast'); await c.note('error toast role', await page.locator('.toast.error').getAttribute('role'))
    await wait(2200); await c.snap('after 2.2 s (1.5 s time on screen)')
    await c.click('Add success toast'); await page.locator('.toast').hover(); await wait(2200)
    await c.snap('hovering the toast for 2.2 s (the clock is paused)')
    await page.mouse.move(5, 5); await wait(2200); await c.snap('mouse moved away, 2.2 s later')
    await c.click('Add success toast'); await page.getByRole('button', { name: /^Close:/ }).click(); await c.snap('after clicking × on a toast')
  },
  7: async (c) => {
    const { page } = c
    const focus = () => page.getByTestId('focus').innerText()
    await c.snap('start')
    await c.click('Open unenroll dialog'); await c.note('dialog opened', await focus())
    for (const k of ['Tab', 'Tab', 'Tab', 'Shift+Tab']) { await page.keyboard.press(k); await wait(60); await c.note('after ' + k, await focus()) }
    await c.note('page behind the dialog is inert', String(await page.evaluate(() => document.querySelector('[inert]') !== null)))
    await page.keyboard.press('Escape'); await wait(60); await c.note('after Escape', await focus())
    await c.click('Open unenroll dialog'); await page.mouse.click(5, 5); await wait(60); await c.note('after clicking the dark backdrop', await focus())
  },
  8: async (c) => {
    const { page } = c
    const input = page.getByLabel('Filter courses')
    await c.snap('start')
    await input.click(); await page.keyboard.type('react')
    await c.snap('right after typing "react" (5 keys, debounce still waiting)')
    await wait(500); await c.snap('500 ms later')
    await page.getByRole('button', { name: /^Price/ }).click(); await c.snap('after clicking Price (ascending)')
    await page.getByRole('button', { name: /^Price/ }).click(); await c.snap('after clicking Price again (descending)')
    await input.fill('zzz'); await wait(500); await c.snap('empty case: "zzz"')
    await c.click('Clear filter'); await wait(500); await c.snap('after Clear filter')
  },
  9: async (c) => {
    const { page } = c
    await c.snap('start')
    await page.getByRole('button', { name: 'Move Props up' }).click(); await c.note('after Move Props up', await c.text())
    await page.getByRole('button', { name: 'Move Context up' }).focus()
    for (let i = 0; i < 4; i++) await page.keyboard.press('Enter')
    await c.note('Enter pressed 4 times on Move Context up', `${await c.text()}\nfocused: ${await active(page)}`)
    await c.note('buttons that are disabled', (await page.locator('ol button:disabled').evaluateAll((l) => l.map((b) => b.getAttribute('aria-label')))).join('\n'))
    await c.click('Reset order'); await c.snap('after Reset order')
  },
  10: async (c) => {
    const { page } = c
    const next = () => c.click('Next')
    await c.snap('start')
    await next(); await c.note('Next with empty step 1', `${await c.text()}\nfocused: ${await page.evaluate(() => document.activeElement.id)}`)
    await page.getByLabel('Name').fill('A'); await page.getByLabel('Email').fill('nope'); await next(); await c.snap('name "A", email "nope"')
    await page.getByLabel('Name').fill('Asha'); await page.getByLabel('Email').fill('asha@example.com'); await next(); await c.snap('step 1 fixed, moved on')
    await next(); await c.snap('Next with empty step 2')
    await page.getByLabel('Plan').selectOption('pro'); await page.getByLabel('I accept the terms').check(); await next(); await c.snap('step 2 done, review')
    await c.click('Back'); await c.note('after Back: the plan is still', await page.getByLabel('Plan').inputValue())
    await next(); await c.click('Enroll'); await c.note('right after Enroll', await c.text())
    await page.getByText('Welcome').waitFor(); await c.snap('after the fake server answered')
    await page.reload()
    await page.getByLabel('Name').fill('Rahul'); await page.getByLabel('Email').fill('rahul@fail.test'); await next()
    await page.getByLabel('Plan').selectOption('free'); await page.getByLabel('I accept the terms').check(); await next()
    await c.click('Enroll'); await page.getByText('Could not enroll').waitFor(); await c.snap('error case: the server refuses @fail.test')
    await c.click('Back'); await c.click('Back'); await c.note('values kept after the error: name, email', `${await page.getByLabel('Name').inputValue()}, ${await page.getByLabel('Email').inputValue()}`)
  },
}

for (const n of Object.keys(scripts).map(Number).filter((n) => only.length === 0 || only.includes(n))) {
  const name = 't' + String(n).padStart(2, '0')
  const context = await browser.newContext({ viewport: { width: 780, height: 900 } })
  const page = await context.newPage()
  const errors = []
  const logLines = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 300)); else if (m.type() === 'log') logLines.push(m.text()) })
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message.slice(0, 300)))
  if (n === 2) await fetch(API + '/__admin/reset')
  await page.goto(BASE + '/#/' + n)
  await page.waitForSelector('#exercise', { timeout: 5000 })
  await page.waitForTimeout(300)
  const steps = []
  const text = async () => (await page.locator('#exercise').innerText({ timeout: 2000 })).replace(/\n{2,}/g, '\n').trim()
  const ctx = {
    page, logLines, text,
    async feedText() { return [await page.getByTestId('counter').innerText(), 'last row: ' + (await page.locator('.feedrow').last().innerText().catch(() => '(none)')), 'bottom: ' + (await page.getByTestId('sentinel').innerText() || '(empty)')].join('\n') },
    async snap(label) { await page.waitForTimeout(150); steps.push({ label, text: await text() }) },
    async snapText(label, t) { steps.push({ label, text: t }) },
    async note(label, value) { steps.push({ label, text: String(value) }) },
    async click(btn) { await page.locator('#exercise').getByRole('button', { name: btn, exact: true }).first().click({ timeout: 3000 }); await page.waitForTimeout(100) },
  }
  try { await scripts[n](ctx) } catch (e) { steps.push({ label: 'DRIVER ERROR', text: e.message.split('\n')[0] }) }
  if (errors.length) steps.push({ label: 'console errors', text: [...new Set(errors)].join('\n') })
  writeFileSync(out(name + '.json'), JSON.stringify(steps, null, 1))
  writeFileSync(out(name + '.txt'), steps.map((s) => `--- ${s.label} ---\n${s.text}`).join('\n') + '\n')
  await page.locator('#root').screenshot({ path: fileURLToPath(out(name + '.png')) }).catch(() => {})
  await context.close()
  console.log(name, steps.length, 'steps', errors.length ? `(${errors.length} console errors)` : '')
}
await browser.close()
