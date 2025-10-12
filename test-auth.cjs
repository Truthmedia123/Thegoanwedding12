const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAuth() {
  try {
    console.log('Testing Directus authentication...');
    
    const response = await fetch('http://localhost:8055/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@thegoanwedding.com',
        password: 'SecurePassword123!'
      })
    });

    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));

    if (data.data && data.data.access_token) {
      console.log('✅ Authentication successful!');
      console.log('Access token:', data.data.access_token);
      return data.data.access_token;
    } else {
      console.log('❌ Authentication failed');
      console.log('Error:', data);
      return null;
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    return null;
  }
}

// Run the test
testAuth();