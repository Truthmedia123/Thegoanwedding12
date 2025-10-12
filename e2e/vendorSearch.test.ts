import { test, expect } from '@playwright/test';

test.describe('Vendor Search', () => {
  test('should search for vendors and display results', async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
    
    // Find the search input and enter a search term
    const searchInput = page.locator('input[placeholder*="Search"]');
    await searchInput.fill('photography');
    
    // Submit the search
    await searchInput.press('Enter');
    
    // Wait for search results to load
    await page.waitForSelector('.vendor-card', { timeout: 10000 });
    
    // Verify that vendors are displayed
    const vendorCards = page.locator('.vendor-card');
    expect(await vendorCards.count()).toBeGreaterThan(0);
    
    // Verify that the search results are relevant
    const firstVendor = vendorCards.first();
    const vendorName = await firstVendor.locator('h3').textContent();
    expect(vendorName).toContain('photography');
  });

  test('should filter vendors by category', async ({ page }) => {
    // Navigate to the vendors page
    await page.goto('/vendors/photography');
    
    // Verify that vendors are displayed
    await page.waitForSelector('.vendor-card', { timeout: 10000 });
    const vendorCards = page.locator('.vendor-card');
    expect(await vendorCards.count()).toBeGreaterThan(0);
    
    // Verify that all vendors are in the photography category
    // This would depend on the specific implementation of your vendor cards
  });
});