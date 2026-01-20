import { test, expect } from '../../fixtures/test'

test.describe('Similarity - Generate Similar Questions', () => {
  test.beforeEach(async ({ page, mockAPI, sidebar }) => {
    await mockAPI()
    await page.goto('/')
    await sidebar.navigateTo('similarity')
  })

  test('should display similarity view', async ({ page }) => {
    await expect(page.getByTestId('view-similarity')).toBeVisible()
  })

  test('should have question input form', async ({ page }) => {
    // Should have textarea for question text (inside QuestionInputForm)
    await expect(page.locator('textarea#question-text')).toBeVisible()

    // Should have question type selector
    await expect(page.getByText('Question Type')).toBeVisible()
  })

  test('should generate similar questions', async ({ page, mockAPI }) => {
    // Setup specific mock
    await mockAPI({
      generateSimilar: {
        response: {
          session_id: 'similar-123',
          original_analysis: {
            core_concept: 'Geography',
            difficulty_level: 'easy',
          },
          similar_questions: [
            {
              id: 'sim-1',
              question_text: 'What is the largest city in France?',
              question_type: 'mcq',
              variation_type: 'paraphrase',
              similarity_score: 0.85,
              options: [
                { label: 'A', text: 'Paris', is_correct: true },
                { label: 'B', text: 'Lyon', is_correct: false },
              ],
              correct_answer: 'A',
              difficulty: 'easy',
              confidence_score: 0.9,
            },
          ],
        },
      },
    })

    // Enter question text
    await page.locator('textarea#question-text').fill('What is the capital of France?')

    // Click generate button (text from translations: "Generate Variations")
    const generateButton = page.getByRole('button', { name: /generate variations/i })
    await generateButton.click()

    // Wait for results
    await expect(page.getByText('What is the largest city in France?')).toBeVisible({ timeout: 10000 })
  })

  test('should show loading state during generation', async ({ page, mockAPI }) => {
    await mockAPI({
      generateSimilar: {
        delay: 2000,
      },
    })

    await page.locator('textarea#question-text').fill('What is the capital of France?')

    const generateButton = page.getByRole('button', { name: /generate variations/i })
    await generateButton.click()

    // Button should be disabled during loading
    await expect(generateButton).toBeDisabled()
  })

  test('should handle API error', async ({ page, mockAPI }) => {
    await mockAPI({
      generateSimilar: {
        fail: true,
        failMessage: 'Failed to generate similar questions',
      },
    })

    await page.locator('textarea#question-text').fill('What is the capital of France?')
    await page.getByRole('button', { name: /generate variations/i }).click()

    // Should show error
    await expect(page.getByText(/failed|error/i)).toBeVisible({ timeout: 10000 })
  })
})
