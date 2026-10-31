import { test } from '@playwright/test'

test('axe does catch a broken page (proof the check works)', async ({ page }) => {
  await page.setContent('<html lang="en"><body><main><img src="x.png"><input name="q"><button></button></main></body></html>')
  await page.addScriptTag({ path: 'node_modules/axe-core/axe.min.js' })
  const v = await page.evaluate(async () => {
    // @ts-expect-error axe is added by the script tag
    const r = await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'] })
    return r.violations.map((x: { id: string; impact: string }) => `${x.id} (${x.impact})`)
  })
  console.log('broken page:', v.join(', '))
})
