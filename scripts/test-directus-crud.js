import { createDirectus, rest, authentication, readItems, createItem, updateItem, deleteItem } from '@directus/sdk';

// Configuration
const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'd1r3ctu5';

// Initialize Directus client with authentication
const directus = createDirectus(DIRECTUS_URL)
  .with(authentication())
  .with(rest());

async function testDirectusCRUD() {
  try {
    console.log('Testing Directus CRUD operations...');
    console.log(`Directus URL: ${DIRECTUS_URL}`);
    
    // Authenticate
    console.log('Authenticating...');
    await directus.login(ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('✅ Authentication successful!');
    
    // Test reading vendors
    console.log('Fetching vendors...');
    const vendors = await directus.request(readItems('vendors'));
    console.log(`✅ Successfully fetched ${vendors.length} vendors`);
    
    // Test reading categories
    console.log('Fetching categories...');
    const categories = await directus.request(readItems('categories'));
    console.log(`✅ Successfully fetched ${categories.length} categories`);
    
    // Test reading blog posts
    console.log('Fetching blog posts...');
    const blogPosts = await directus.request(readItems('blog_posts'));
    console.log(`✅ Successfully fetched ${blogPosts.length} blog posts`);
    
    // Test reading invitation templates
    console.log('Fetching invitation templates...');
    const invitations = await directus.request(readItems('invitation_templates'));
    console.log(`✅ Successfully fetched ${invitations.length} invitation templates`);
    
    console.log('\n🎉 All Directus read operations successful!');
    return true;
  } catch (error) {
    console.error('❌ Directus operations failed:', error.message);
    return false;
  }
}

// Run the test
testDirectusCRUD().then(success => {
  if (success) {
    console.log('\n✅ Directus integration is working correctly.');
  } else {
    console.log('\n❌ Please check your Directus configuration.');
  }
});