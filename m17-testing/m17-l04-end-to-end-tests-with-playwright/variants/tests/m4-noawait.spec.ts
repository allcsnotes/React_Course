import { test, expect } from '@playwright/test'

test('adds a course', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Add to cart' }).first().click()
  expect(page.getByRole('link', { name: 'Cart (9)' })).toBeVisible()
})
