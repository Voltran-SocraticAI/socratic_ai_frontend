import { test, expect } from '../fixtures/test'

test.describe('Smoke Tests', () => {
  test('should load the application', async ({ page, mockAPI }) => {
    await mockAPI()
    await page.goto('/')

    // Check that main UI elements are present
    await expect(page.getByTestId('sidebar')).toBeVisible()
    await expect(page.getByTestId('header')).toBeVisible()
    await expect(page.getByTestId('view-pdf-workspace')).toBeVisible()
  })

  test('should have working theme toggle', async ({ page, mockAPI, themeToggle }) => {
    await mockAPI()
    await page.goto('/')

    await expect(page.getByTestId('theme-toggle')).toBeVisible()
    await themeToggle.selectTheme('dark')
    await themeToggle.assertTheme('dark')
  })

  test('should have working language toggle', async ({ page, mockAPI, languageToggle }) => {
    await mockAPI()
    await page.goto('/')

    await expect(page.getByTestId('language-toggle')).toBeVisible()
    await languageToggle.selectLanguage('tr')
    await languageToggle.assertLanguage('tr')
  })

  test('should navigate to all views', async ({ page, mockAPI, sidebar }) => {
    await mockAPI()
    await page.goto('/')

    // PDF Workspace
    await expect(page.getByTestId('view-pdf-workspace')).toBeVisible()

    // Similarity
    await sidebar.navigateTo('similarity')
    await expect(page.getByTestId('view-similarity')).toBeVisible()

    // Studio
    await sidebar.navigateTo('studio')
    await expect(page.getByTestId('view-studio')).toBeVisible()
  })
})
