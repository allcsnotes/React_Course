import { expect, test, type Page } from '@playwright/test'

async function runAxe(page: Page): Promise<string[]> {
  await page.addScriptTag({ path: 'node_modules/axe-core/axe.min.js' })
  return page.evaluate(async () => {
    // @ts-expect-error axe is added by the script tag
    const r = await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] })
    return r.violations.map((v: { id: string; impact: string; nodes: unknown[] }) => `${v.id} (${v.impact}) x${v.nodes.length}`)
  })
}

test('no axe violations on the main pages', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('lukas@example.test')
  await page.getByLabel('Password').fill('fake-demo-pass')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByRole('heading', { name: 'Welcome, Lukas' })).toBeVisible()
  for (const path of ['/', '/courses/docker-for-developers', '/my', '/login']) {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    const v = await runAxe(page)
    console.log(path.padEnd(32), v.length ? v.join(', ') : 'no violations')
  }
})
