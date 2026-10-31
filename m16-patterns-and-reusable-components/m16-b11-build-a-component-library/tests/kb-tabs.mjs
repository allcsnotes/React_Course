import { start, focus, check, press, summary } from './kb.mjs'
const S = await start('#tabs'), p = S.p
const from = async (tab, key) => { await p.getByRole('tab', { name: tab }).click(); await press(p, key); return focus(p) }
await p.getByRole('tab', { name: 'Lessons' }).click(); check('A click opens a tab', (await p.innerText('[role=tabpanel]')).includes('97 lessons'), JSON.stringify(await p.innerText('[role=tabpanel]')))
let f = await from('Lessons', 'ArrowRight'); check('ArrowRight moves to the next tab', f === 'tab "Reviews"', f)
check('...and opens its panel', (await p.innerText('[role=tabpanel]')).includes('Rated'), JSON.stringify(await p.innerText('[role=tabpanel]')))
f = await from('Reviews', 'ArrowRight'); check('ArrowRight on the last tab wraps to the first', f === 'tab "Overview"', f)
f = await from('Overview', 'ArrowLeft'); check('ArrowLeft on the first tab wraps to the last', f === 'tab "Reviews"', f)
f = await from('Lessons', 'Home'); check('Home jumps to the first tab', f === 'tab "Overview"', f)
f = await from('Lessons', 'End'); check('End jumps to the last tab', f === 'tab "Reviews"', f)
await p.getByRole('tab', { name: 'Lessons' }).click(); await p.locator('nav a').last().focus(); await press(p, 'Tab')
f = await focus(p); check('Tab from outside lands on the open tab', f === 'tab "Lessons"', f)
await press(p, 'Tab'); f = await focus(p); check('Tab again leaves the list, into the panel', f.startsWith('tabpanel'), f)
summary()
await S.close()
