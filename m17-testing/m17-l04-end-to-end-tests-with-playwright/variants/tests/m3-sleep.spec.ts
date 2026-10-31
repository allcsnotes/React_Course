import { test, expect } from '@playwright/test'

test('lists four courses', async ({ page }) => {
  await page.goto('/')
  await page.waitForTimeout(3000)
  const count = await page.getByRole('listitem').count()
  expect(count).toBe(4)
})
