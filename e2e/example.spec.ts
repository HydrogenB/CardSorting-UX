import { test, expect } from '@playwright/test'

test('homepage has title and navigation links', async ({ page }) => {
  await page.goto('/')
  
  await expect(page.locator('h1')).toContainText('Card Sorting Platform')
  await expect(page.getByRole('link', { name: /Create Template/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /Run Study/i })).toBeVisible()
})

test('can navigate to builder page', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Create Template')
  await expect(page.locator('h1')).toContainText('Template Builder')
})

test('can navigate to run page', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Run Study')
  await expect(page.locator('h1')).toContainText('Run Card Sorting Study')
})
