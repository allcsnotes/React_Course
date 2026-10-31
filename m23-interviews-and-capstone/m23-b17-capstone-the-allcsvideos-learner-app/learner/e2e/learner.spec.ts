import { expect, test } from '@playwright/test'

test('sign in, search, open a course, mark done', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Sign in' }).click()
  await page.getByLabel('Email').fill('lukas@example.test')
  await page.getByLabel('Password').fill('fake-demo-pass')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByText('Welcome, Lukas')).toBeVisible()

  await page.goto('/')
  await page.getByLabel('Search courses').fill('docker')
  await page.getByRole('button', { name: 'Search' }).click()
  await expect(page.getByRole('listitem')).toHaveCount(1)
  await page.getByRole('link', { name: /Docker for/ }).click()

  await page.getByRole('button', { name: /Mark done: Images/ }).click()
  const bar = page.getByRole('progressbar', { name: 'Course progress' })
  await expect(bar).toHaveAttribute('aria-valuenow', '33')
  await page.reload()
  await expect(page.getByText('1 of 3 lessons · 33%')).toBeVisible()
})
