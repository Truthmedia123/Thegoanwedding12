require('dotenv').config({ path: '.env.development' });
const { createDirectus, rest, staticToken, createItem } = require('@directus/sdk');

// Define the schema interface
const DirectusSchema = {};

async function testCreateCategory() {
  console.log('Testing category creation...');
  
  // Initialize Directus client
  const directus = createDirectus(process.env.DIRECTUS_URL || 'http://localhost:8055')
    .with(staticToken(process.env.DIRECTUS_TOKEN))
    .with(rest());

  try {
    // Try to create a simple category
    const category = {
      name: 'Test Category',
      slug: 'test-category',
      description: 'A test category for debugging',
      icon: 'fas fa-test',
      color: '#ff0000',
      sort: 1,
      status: 'published'
    };

    const result = await directus.request(createItem('categories', category));
    console.log('✅ Category created successfully:', result);
  } catch (error) {
    console.error('❌ Error creating category:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response text:', await error.response.text());
    }
  }
}

testCreateCategory();