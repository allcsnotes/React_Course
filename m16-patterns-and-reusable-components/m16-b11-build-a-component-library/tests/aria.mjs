// real accessibility tree (Playwright ariaSnapshot) of a component:  node aria.mjs '#tabs' 'selector' [steps...]
import { start, press } from './kb.mjs'
const [hash, sel, ...steps] = process.argv.slice(2)
const S = await start(hash), p = S.p
for (const s of steps) { if (s.startsWith('click:')) await p.getByRole(...s.slice(6).split('|')).click(); else if (s.startsWith('key:')) await press(p, s.slice(4)); else if (s.startsWith('focus:')) await p.locator(s.slice(6)).focus() }
console.log(await p.locator(sel).ariaSnapshot())
await S.close()
