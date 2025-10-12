import fetch from 'node-fetch';

async function testAuth() {
  try {
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
    console.log('Response:', data);
    
    if (data.data && data.data.access_token) {
      console.log('✅ Authentication successful!');
      console.log('Access token:', data.data.access_token);
    } else {
      console.log('❌ Authentication failed');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testAuth();