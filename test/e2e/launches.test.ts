import { test, expect } from '@playwright/test';

test('navigate to launches page', async ({ page }) => {
  await page.goto('/');
  // Should show skeleton while data is loading
  await expect(page.getByTestId('skeleton-card')).toHaveCount(5);
  // Should show 10 launch cards
  await expect(page.getByTestId('launch-card')).toHaveCount(10);
});
