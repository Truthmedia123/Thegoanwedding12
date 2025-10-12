const http = require('http');

// Load environment variables
require('dotenv').config({ path: '.env.development' });

const categoryData = JSON.stringify({
  name: 'Test Category',
  slug: 'test-category',
  description: 'A test category for debugging',
  icon: 'fas fa-test',
  color: '#ff0000',
  sort: 1,
  status: 'published'
});

const options = {
  hostname: 'localhost',
  port: 8055,
  path: '/items/categories',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': categoryData.length,
    'Authorization': `Bearer ${process.env.DIRECTUS_TOKEN}`
  }
};

const req = http.request(options, res => {
  let responseData = '';

  res.on('data', chunk => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Response Status:', res.statusCode);
    console.log('Response:', responseData);
    try {
      const jsonData = JSON.parse(responseData);
      if (jsonData.data) {
        console.log('✅ Category created successfully:', jsonData.data);
      } else {
        console.log('❌ Error creating category:', jsonData);
      }
    } catch (error) {
      console.error('Error parsing response:', error);
    }
  });
});

req.on('error', error => {
  console.error('Error during request:', error);
});

req.write(categoryData);
req.end();