import { start, focus, check, press, summary } from './kb.mjs'
const S = await start('#modal'), p = S.p
const inside = () => p.evaluate(() => !!document.activeElement?.closest('[role=dialog]'))
await p.locator('nav a').last().focus(); await press(p, 'Tab'); let f = await focus(p)
check('Tab reaches the opener', f === 'button "Delete course"', f)
await press(p, 'Enter')
check('Enter opens a dialog', await p.getByRole('dialog', { name: 'Delete this course?' }).isVisible(), 'dialog "Delete this course?"')
f = await focus(p); check('focus moves into the dialog', await inside(), f)
let ok = true, seen = []
for (let i = 0; i < 7; i++) { await press(p, 'Tab'); seen.push(await focus(p)); ok = ok && await inside() }
check('7 Tab presses never leave the dialog', ok, 'last focus: ' + seen[6])
await press(p, 'Shift+Tab'); f = await focus(p); check('Shift+Tab goes backwards', await inside(), f)
await press(p, 'Escape')
check('Escape closes it', await p.getByRole('dialog').count() === 0, 'no dialog left')
f = await focus(p); check('focus returns to the opener', f === 'button "Delete course"', f)
summary()
await S.close()
