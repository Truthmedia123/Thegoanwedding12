import { test, expect } from '@playwright/test';

test.describe('Invitation Customization', () => {
  test('should customize wedding invitation', async ({ page }) => {
    // Navigate to the invitations page
    await page.goto('/invitations');
    
    // Look for invitation templates
    await page.waitForSelector('.invitation-template', { timeout: 10000 });
    
    // Select the first template
    const firstTemplate = page.locator('.invitation-template').first();
    await firstTemplate.click();
    
    // Wait for the customization interface to load
    await page.waitForSelector('.invitation-editor', { timeout: 10000 });
    
    // Customize the invitation
    await page.locator('input[name="brideName"]').fill('Sarah');
    await page.locator('input[name="groomName"]').fill('John');
    await page.locator('input[name="weddingDate"]').fill('2025-12-25');
    await page.locator('input[name="weddingVenue"]').fill('Grand Hyatt Goa');
    
    // Verify that the changes are reflected in the preview
    const preview = page.locator('.invitation-preview');
    expect(await preview.textContent()).toContain('Sarah');
    expect(await preview.textContent()).toContain('John');
  });

  test('should save customized invitation', async ({ page }) => {
    // Navigate to the invitations page
    await page.goto('/invitations');
    
    // Select a template
    await page.waitForSelector('.invitation-template', { timeout: 10000 });
    const firstTemplate = page.locator('.invitation-template').first();
    await firstTemplate.click();
    
    // Wait for the editor
    await page.waitForSelector('.invitation-editor', { timeout: 10000 });
    
    // Customize the invitation
    await page.locator('input[name="brideName"]').fill('Sarah');
    await page.locator('input[name="groomName"]').fill('John');
    
    // Save the invitation
    const saveButton = page.locator('button:has-text("Save")');
    await saveButton.click();
    
    // Verify success message or confirmation
    // This would depend on your specific implementation
  });
});