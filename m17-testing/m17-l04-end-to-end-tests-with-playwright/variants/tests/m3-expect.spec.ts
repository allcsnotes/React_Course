import { test, expect } from '@playwright/test'

test('lists four courses', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('listitem')).toHaveCount(4)
})
