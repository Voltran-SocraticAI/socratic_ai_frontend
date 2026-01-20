import { test, expect } from '../../fixtures/test'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page, mockAPI }) => {
    await mockAPI()
    await page.goto('/')
  })

  test('should start on PDF Workspace view by default', async ({ page }) => {
    await expect(page.getByTestId('view-pdf-workspace')).toBeVisible()
  })

  test('should navigate between views using sidebar', async ({ sidebar, page }) => {
    // Start on PDF Workspace
    await expect(page.getByTestId('view-pdf-workspace')).toBeVisible()

    // Navigate to Similarity
    await sidebar.navigateTo('similarity')
    await expect(page.getByTestId('view-similarity')).toBeVisible()

    // Navigate to Studio
    await sidebar.navigateTo('studio')
    await expect(page.getByTestId('view-studio')).toBeVisible()

    // Navigate back to PDF Workspace
    await sidebar.navigateTo('pdf-workspace')
    await expect(page.getByTestId('view-pdf-workspace')).toBeVisible()
  })

  test('should highlight active nav item', async ({ sidebar }) => {
    // PDF Workspace should be active by default
    await sidebar.assertActiveView('pdf-workspace')

    // Navigate to Similarity and check active state
    await sidebar.navigateTo('similarity')
    await sidebar.assertActiveView('similarity')

    // Navigate to Studio and check active state
    await sidebar.navigateTo('studio')
    await sidebar.assertActiveView('studio')
  })

  test('should toggle sidebar open/closed', async ({ sidebar }) => {
    // Sidebar starts expanded
    await sidebar.assertExpanded()

    // Collapse sidebar
    await sidebar.collapse()
    await sidebar.assertCollapsed()

    // Expand sidebar
    await sidebar.expand()
    await sidebar.assertExpanded()
  })

  test('should update header title when navigating', async ({ sidebar, header }) => {
    // Check PDF Workspace title
    await header.assertViewTitle(/PDF|Workspace/i)

    // Navigate to Similarity
    await sidebar.navigateTo('similarity')
    await header.assertViewTitle(/Similar/i)

    // Navigate to Studio
    await sidebar.navigateTo('studio')
    await header.assertViewTitle(/Studio/i)
  })

  test('should show menu button in header when sidebar is collapsed', async ({ sidebar, page }) => {
    // Menu button should not be visible when sidebar is open
    await sidebar.assertExpanded()
    await expect(page.getByTestId('header-menu-button')).not.toBeVisible()

    // Collapse sidebar - menu button should appear
    await sidebar.collapse()
    await expect(page.getByTestId('header-menu-button')).toBeVisible()

    // Click menu button to expand sidebar
    await page.getByTestId('header-menu-button').click()
    await sidebar.assertExpanded()
  })
})
