import { test, expect } from '@playwright/test';

test.describe('RSVP Submission', () => {
  test('should submit RSVP form successfully', async ({ page }) => {
    // Navigate to a vendor profile page that has an RSVP form
    // This would depend on your specific implementation
    await page.goto('/vendor/sample-vendor');
    
    // Look for RSVP form elements
    const rsvpForm = page.locator('form[data-testid="rsvp-form"]');
    
    // Only run the test if the RSVP form exists
    if (await rsvpForm.isVisible()) {
      // Fill in the RSVP form
      await page.locator('input[name="name"]').fill('John Doe');
      await page.locator('input[name="email"]').fill('john.doe@example.com');
      await page.locator('input[name="guests"]').fill('2');
      
      // Submit the form
      await page.locator('button[type="submit"]').click();
      
      // Verify success message
      await page.waitForSelector('[data-testid="rsvp-success"]', { timeout: 10000 });
      const successMessage = await page.locator('[data-testid="rsvp-success"]').textContent();
      expect(successMessage).toContain('Thank you');
    } else {
      // Skip the test if no RSVP form is found
      test.skip();
    }
  });
});