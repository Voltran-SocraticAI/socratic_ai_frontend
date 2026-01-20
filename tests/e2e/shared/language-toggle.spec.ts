import { test, expect } from '../../fixtures/test'

test.describe('Language Toggle', () => {
  test.beforeEach(async ({ page, mockAPI }) => {
    await mockAPI()
    await page.goto('/')
  })

  test('should switch to Turkish', async ({ languageToggle }) => {
    await languageToggle.selectLanguage('tr')
    await languageToggle.assertLanguage('tr')
  })

  test('should switch to English', async ({ languageToggle }) => {
    // First switch to Turkish, then back to English
    await languageToggle.selectLanguage('tr')
    await languageToggle.assertLanguage('tr')

    await languageToggle.selectLanguage('en')
    await languageToggle.assertLanguage('en')
  })

  test('should persist language in localStorage', async ({ page, languageToggle }) => {
    await languageToggle.selectLanguage('tr')
    await languageToggle.assertStoredLocale('tr')

    // Reload page and verify language persists
    await page.reload()
    await languageToggle.assertLanguage('tr')
  })

  test('should update UI text when switching language', async ({ page, languageToggle }) => {
    // Check English text is present
    await languageToggle.selectLanguage('en')
    // The exact text will depend on translations - checking that it changes
    const englishTitle = await page.getByTestId('view-title').textContent()

    // Switch to Turkish
    await languageToggle.selectLanguage('tr')
    const turkishTitle = await page.getByTestId('view-title').textContent()

    // Titles should be different
    expect(englishTitle).not.toBe(turkishTitle)
  })

  test('should show current language flag', async ({ page, languageToggle }) => {
    // English should show EN
    await languageToggle.selectLanguage('en')
    await expect(page.getByTestId('language-toggle')).toContainText('EN')

    // Turkish should show TR
    await languageToggle.selectLanguage('tr')
    await expect(page.getByTestId('language-toggle')).toContainText('TR')
  })
})
