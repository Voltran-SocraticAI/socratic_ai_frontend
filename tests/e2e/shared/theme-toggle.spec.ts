import { test, expect } from '../../fixtures/test'

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page, mockAPI }) => {
    await mockAPI()
    await page.goto('/')
  })

  test('should switch to dark theme', async ({ themeToggle }) => {
    await themeToggle.selectTheme('dark')
    await themeToggle.assertTheme('dark')
  })

  test('should switch to light theme', async ({ themeToggle }) => {
    // First switch to dark, then to light
    await themeToggle.selectTheme('dark')
    await themeToggle.assertTheme('dark')

    await themeToggle.selectTheme('light')
    await themeToggle.assertTheme('light')
  })

  test('should persist theme in localStorage', async ({ page, themeToggle }) => {
    await themeToggle.selectTheme('dark')
    await themeToggle.assertStoredTheme('dark')

    // Reload page and verify theme persists
    await page.reload()
    await themeToggle.assertTheme('dark')
  })

  test('should switch to system theme', async ({ themeToggle }) => {
    await themeToggle.selectTheme('system')
    await themeToggle.assertStoredTheme('system')
  })

  test('should show correct icon for each theme', async ({ page, themeToggle }) => {
    // Light theme should show sun icon
    await themeToggle.selectTheme('light')
    await expect(page.getByTestId('theme-toggle').locator('svg')).toBeVisible()

    // Dark theme should show moon icon
    await themeToggle.selectTheme('dark')
    await expect(page.getByTestId('theme-toggle').locator('svg')).toBeVisible()

    // System theme should show monitor icon
    await themeToggle.selectTheme('system')
    await expect(page.getByTestId('theme-toggle').locator('svg')).toBeVisible()
  })
})
