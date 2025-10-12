const http = require('http');

// Test the secret link API endpoint with the secret link we know exists
const options = {
  hostname: 'localhost',
  port: 8787,
  path: '/api/rsvp/manage/secret/admin_secret456',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Response Body: ${data}`);
    
    // Try to parse as JSON
    try {
      const jsonData = JSON.parse(data);
      console.log('Parsed JSON response:', JSON.stringify(jsonData, null, 2));
    } catch (e) {
      console.log('Response is not valid JSON');
    }
  });
});

req.on('error', (error) => {
  console.error(`Problem with request: ${error.message}`);
});

req.end();