import { expect, test } from '@playwright/test'

test('shopping trip with a coupon', async ({ page }) => {
  await page.goto('/')

  const titles = ['React for Beginners', 'SQL in Two Weeks']
  for (const title of titles) {
    await page
      .getByRole('article')
      .filter({ hasText: title })
      .getByRole('button', { name: 'Add to cart' })
      .click()
  }
  await page.getByRole('link', { name: 'Cart 2' }).click()

  const box = page.getByRole('textbox', { name: /coupon/i })
  await box.fill('save10')
  await page.getByRole('button', { name: 'Apply' }).click()

  await expect(page.getByText('- Rs 90')).toBeVisible()
  await expect(page.getByText('Rs 808')).toBeVisible()
})

test('login shows the courses', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('lukas@example.com')
  await page.getByLabel('Password').fill('learn-fast-42')
  await page.getByRole('button', { name: 'Log in' }).click()

  const title = page.getByRole('heading', { name: /Welcome/ })
  await expect(title).toHaveText('Welcome, Lukas')
  const course = page.getByText('React for Beginners')
  await expect(course).toBeVisible()
})

test('wrong password shows the message', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email').fill('lukas@example.com')
  await page.getByLabel('Password').fill('nope')
  await page.getByRole('button', { name: 'Log in' }).click()

  const alert = page.getByRole('alert')
  await expect(alert).toHaveText('Wrong email or password')
})
