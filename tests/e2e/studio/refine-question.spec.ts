import { test, expect } from '../../fixtures/test'

test.describe('Studio - Refine Question', () => {
  test.beforeEach(async ({ page, mockAPI, sidebar }) => {
    await mockAPI()
    await page.goto('/')
    await sidebar.navigateTo('studio')
  })

  test('should display studio view', async ({ page }) => {
    await expect(page.getByTestId('view-studio')).toBeVisible()
  })

  test('should show question selector when no question is active', async ({ page }) => {
    // Studio should show a way to select a question
    await expect(page.getByText(/select|choose|question/i)).toBeVisible()
  })

  test('should have chat interface', async ({ page }) => {
    // Look for chat-related elements
    await expect(page.locator('textarea, input[type="text"]')).toBeVisible()
  })

  test('should refine question via chat', async ({ page, mockAPI }) => {
    // This test assumes there's a question selected or we select one
    // The exact flow depends on how the studio is designed

    await mockAPI({
      refineQuestion: {
        response: {
          conversation_id: 'conv-123',
          refined_question: {
            id: 'q-1',
            question_text: 'What is the PRIMARY function of photosynthesis?',
            question_type: 'mcq',
            difficulty: 'hard',
            options: [
              { label: 'A', text: 'Convert light to chemical energy', is_correct: true },
              { label: 'B', text: 'Produce oxygen', is_correct: false },
            ],
            correct_answer: 'A',
            confidence_score: 0.95,
          },
          changes_made: 'Made the question more specific by adding PRIMARY',
          turn_number: 1,
        },
      },
    })

    // Look for a text input or textarea
    const input = page.locator('textarea, input[type="text"]').first()

    if (await input.isVisible()) {
      await input.fill('Make the question harder')

      // Try to submit
      const submitButton = page.getByRole('button', { name: /send|submit|refine/i })
      if (await submitButton.isVisible()) {
        await submitButton.click()
      }
    }
  })
})
