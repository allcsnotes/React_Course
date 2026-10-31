import { test, expect, type Page } from '@playwright/test'

async function addCourse(page: Page, title: string) {
  const card = page.getByRole('listitem').filter({ hasText: title })
  await card.getByRole('button', { name: 'Add to cart' }).click()
}

test('a student buys two courses with a coupon', async ({ page }) => {
  await page.goto('/')
  await addCourse(page, 'React for Beginners')
  await addCourse(page, 'SQL in Two Weeks')
  await page.getByRole('link', { name: 'Cart (2)' }).click()
  await page.getByLabel('Coupon code').fill('SAVE10')
  await page.getByRole('button', { name: 'Apply' }).click()
  await expect(page.getByText('Total: Rs 808')).toBeVisible()
  await page.getByRole('button', { name: 'Pay now' }).click()
  await expect(page.getByText('Order confirmed')).toBeVisible()
})

test('an unknown coupon shows a message', async ({ page }) => {
  await page.goto('/')
  await addCourse(page, 'React for Beginners')
  await page.getByRole('link', { name: 'Cart (1)' }).click()
  await page.getByLabel('Coupon code').fill('NOPE')
  await page.getByRole('button', { name: 'Apply' }).click()
  await expect(page.getByRole('alert')).toHaveText('That code does not exist')
})

test('the cart starts empty', async ({ page }) => {
  await page.goto('/cart')
  await expect(page.getByText('Your cart is empty')).toBeVisible()
})
