const puppeteer = require('puppeteer');

describe('User Flows E2E Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true, // Set to false for debugging
      slowMo: 10 // Slow down operations for better observation
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:8787');
  });

  afterEach(async () => {
    await page.close();
  });

  test('Creating an invitation', async () => {
    // Navigate to the invitations page
    await page.click('text/Invitations');
    
    // Wait for the page to load
    await page.waitForSelector('text/Select an Invitation Template');
    
    // Select a template
    await page.click('text/Beach Wedding Elegance');
    
    // Wait for the editor to load
    await page.waitForSelector('text/Customize Your Invitation');
    
    // Edit text
    await page.type('input[placeholder="Enter your text here"]', 'John & Jane\'s Wedding');
    
    // Save the invitation
    await page.click('button:has-text("Save Invitation")');
    
    // Verify success message
    await page.waitForSelector('text=Invitation saved successfully');
  }, 30000); // 30 second timeout

  test('Searching vendors', async () => {
    // Navigate to the search page
    await page.click('text=Vendors');
    
    // Wait for the page to load
    await page.waitForSelector('input[placeholder="Search for vendors *"]');
    
    // Perform a search
    await page.type('input[placeholder="Search for vendors *"]', 'photography');
    
    // Wait for results
    await page.waitForSelector('text=Goa Photography Studio');
    
    // Filter by category
    await page.select('select:has-text("All Categories")', 'Photographers');
    
    // Verify filtered results
    await page.waitForSelector('text=Sunset Candid Shots');
  }, 30000);

  test('Booking process', async () => {
    // Navigate to vendors page
    await page.click('text=Vendors');
    
    // Search for a vendor
    await page.type('input[placeholder="Search for vendors *"]', 'Grand Hyatt Goa');
    
    // Click on the vendor
    await page.click('text=Grand Hyatt Goa');
    
    // Verify vendor details
    await page.waitForSelector('text=Luxury beachfront venue');
    
    // Click book now button (if exists)
    const bookButton = await page.$('button:has-text("Book Now")');
    if (bookButton) {
      await bookButton.click();
      
      // Fill in booking form
      await page.type('input[name="name"]', 'John Doe');
      await page.type('input[name="email"]', 'john@example.com');
      await page.type('input[name="phone"]', '+91 98765 43210');
      await page.type('input[name="date"]', '2025-12-15');
      await page.type('textarea[name="message"]', 'Looking forward to our wedding!');
      
      // Submit booking
      await page.click('button:has-text("Submit Booking")');
      
      // Verify booking confirmation
      await page.waitForSelector('text=Booking request submitted');
    }
  }, 30000);

  test('Admin content management', async () => {
    // Navigate to admin login
    await page.goto('http://localhost:8055/admin');
    
    // Wait for login page
    await page.waitForSelector('text=Sign in');
    
    // Fill in admin credentials
    await page.type('input[name="email"]', 'admin@example.com');
    await page.type('input[name="password"]', 'd1r3ctu5');
    
    // Submit login
    await page.click('button:has-text("Sign in")');
    
    // Verify admin dashboard
    await page.waitForSelector('text=Dashboard');
    
    // Navigate to vendors management
    await page.click('text=Content');
    await page.click('text=Vendors');
    
    // Verify vendors list
    await page.waitForSelector('text=Goa Photography Studio');
  }, 30000);
});