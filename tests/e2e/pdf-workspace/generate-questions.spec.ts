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
    // Look for tab triggers
    await expect(page.getByRole('tab', { name: /pdf/i })).toBeVisible()
    await expect(page.getByRole('tab', { name: /text/i })).toBeVisible()
  })

  test('should switch between PDF and Text tabs', async ({ page }) => {
    // Click on Text tab
    await page.getByRole('tab', { name: /text/i }).click()

    // Should show text input area
    await expect(page.locator('textarea')).toBeVisible()

    // Click on PDF tab
    await page.getByRole('tab', { name: /pdf/i }).click()

    // Should show PDF dropzone area
    await expect(page.getByText(/drag|drop|upload/i)).toBeVisible()
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
    await page.getByRole('tab', { name: /text/i }).click()

    // Enter text content (need 50+ characters)
    const sampleText = 'Photosynthesis is the process by which plants convert light energy into chemical energy stored in glucose molecules. This process is essential for life on Earth.'
    await page.locator('textarea').fill(sampleText)

    // Click generate button
    const generateButton = page.getByRole('button', { name: /generate/i })
    await expect(generateButton).toBeEnabled()
    await generateButton.click()

    // Wait for and verify results
    await expect(page.getByText('What is photosynthesis?')).toBeVisible({ timeout: 10000 })
  })

  test('should show loading state during generation', async ({ page, mockAPI }) => {
    // Setup mock with delay
    await mockAPI({
      generateFromText: {
        delay: 2000,
      },
    })

    // Switch to text tab and enter text
    await page.getByRole('tab', { name: /text/i }).click()
    await page.locator('textarea').fill('This is a sample text that needs to be at least 50 characters long for validation to pass.')

    // Click generate
    const generateButton = page.getByRole('button', { name: /generate/i })
    await generateButton.click()

    // Should show loading state (button disabled or progress)
    await expect(generateButton).toBeDisabled()
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
    await page.getByRole('tab', { name: /text/i }).click()
    await page.locator('textarea').fill('This is a sample text that needs to be at least 50 characters long for validation to pass.')

    // Click generate
    await page.getByRole('button', { name: /generate/i }).click()

    // Should show error message (toast)
    await expect(page.getByText(/failed|error/i)).toBeVisible({ timeout: 10000 })
  })
})
