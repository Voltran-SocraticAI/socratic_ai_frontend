import { test, expect } from '../../fixtures/test'

test.describe('PDF Workspace - Generate Questions', () => {
  test.beforeEach(async ({ page, mockAPI }) => {
    await mockAPI()
    await page.goto('/')
  })

  test('should display PDF workspace view by default', async ({ page }) => {
    await expect(page.getByTestId('view-pdf-workspace')).toBeVisible()
  })

  test('should show tabs for PDF and Text input', async ({ page }) => {
    // Look for tab triggers - actual text from translations
    await expect(page.getByRole('tab', { name: /upload pdf/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /or enter text/i })).toBeVisible()
  })

  test('should switch between PDF and Text tabs', async ({ page }) => {
    // Click on Text tab
    await page.getByRole('tab', { name: /or enter text/i }).click()

    // Should show text input area (textarea inside TextInputPanel)
    await expect(page.locator('textarea#content-text')).toBeVisible()

    // Click on PDF tab
    await page.getByRole('tab', { name: /upload pdf/i }).click()

    // Should show PDF dropzone area
    await expect(page.getByText(/drop pdf here|click to upload/i)).toBeVisible()
  })

  test('should generate questions from text input', async ({ page, mockAPI }) => {
    // Setup specific mock
    await mockAPI({
      generateFromText: {
        response: {
          session_id: 'test-session',
          questions: [
            {
              id: 'q-1',
              question_text: 'What is photosynthesis?',
              question_type: 'mcq',
              difficulty: 'medium',
              options: [
                { label: 'A', text: 'Process of converting light to energy', is_correct: true },
                { label: 'B', text: 'Process of breathing', is_correct: false },
              ],
              correct_answer: 'A',
              confidence_score: 0.9,
            },
          ],
          generation_summary: 'Generated 1 question',
          source_type: 'text',
        },
      },
    })

    // Switch to text tab
    await page.getByRole('tab', { name: /or enter text/i }).click()

    // Enter text content (need 50+ characters)
    const sampleText = 'Photosynthesis is the process by which plants convert light energy into chemical energy stored in glucose molecules. This process is essential for life on Earth.'
    await page.locator('textarea#content-text').fill(sampleText)

    // Click generate button - use data-testid container to be specific
    const generateButton = page.getByTestId('view-pdf-workspace').getByRole('button', { name: /generate questions/i })
    await expect(generateButton).toBeEnabled()
    await generateButton.click()

    // Wait for and verify results
    await expect(page.getByText('What is photosynthesis?')).toBeVisible({ timeout: 10000 })
  })

  test('should show loading state during generation', async ({ page, mockAPI }) => {
    // Setup mock with longer delay to ensure we can check loading state
    await mockAPI({
      generateFromText: {
        delay: 5000,
      },
    })

    // Switch to text tab and enter text
    await page.getByRole('tab', { name: /or enter text/i }).click()
    await page.locator('textarea#content-text').fill('This is a sample text that needs to be at least 50 characters long for validation to pass.')

    // Get button within the view container and click
    const generateButton = page.getByTestId('view-pdf-workspace').locator('button').filter({ hasText: /generate|generating/i })
    await generateButton.click()

    // Should show loading state - button should be disabled during loading
    await expect(generateButton).toBeDisabled({ timeout: 2000 })
  })

  test('should handle API error gracefully', async ({ page, mockAPI }) => {
    // Setup failing mock
    await mockAPI({
      generateFromText: {
        fail: true,
        failMessage: 'Failed to generate questions',
      },
    })

    // Switch to text tab and enter text
    await page.getByRole('tab', { name: /or enter text/i }).click()
    await page.locator('textarea#content-text').fill('This is a sample text that needs to be at least 50 characters long for validation to pass.')

    // Click generate - use specific container
    await page.getByTestId('view-pdf-workspace').getByRole('button', { name: /generate questions/i }).click()

    // Should show error message (toast)
    await expect(page.getByText(/failed|error/i)).toBeVisible({ timeout: 10000 })
  })
})
