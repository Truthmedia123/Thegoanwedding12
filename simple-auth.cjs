const http = require('http');

const data = JSON.stringify({
  email: 'admin@thegoanwedding.com',
  password: 'SecurePassword123!'
});

const options = {
  hostname: 'localhost',
  port: 8055,
  path: '/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let responseData = '';

  res.on('data', chunk => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Response:', responseData);
    try {
      const jsonData = JSON.parse(responseData);
      if (jsonData.data && jsonData.data.access_token) {
        console.log('✅ Authentication successful!');
        console.log('Access token:', jsonData.data.access_token);
      } else {
        console.log('❌ Authentication failed');
        console.log('Error:', jsonData);
      }
    } catch (error) {
      console.error('Error parsing response:', error);
    }
  });
});

req.on('error', error => {
  console.error('Error during authentication:', error);
});

req.write(data);
req.end();