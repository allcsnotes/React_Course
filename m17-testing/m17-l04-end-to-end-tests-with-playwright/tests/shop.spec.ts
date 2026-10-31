import { test, expect } from '@playwright/test'

test('a student adds a course to the cart', async ({ page }) => {
  await page.goto('/')
  const card = page.getByRole('listitem').filter({ hasText: 'React for Beginners' })
  await card.getByRole('button', { name: 'Add to cart' }).click()
  await expect(card.getByRole('button', { name: 'In cart' })).toBeDisabled()
  await expect(page.getByRole('link', { name: 'Cart (1)' })).toBeVisible()
})
