const http = require('http');

// Test the secret link API endpoint
const options = {
  hostname: 'localhost',
  port: 8787,
  path: '/api/rsvp/manage/secret/admin_secret456',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  res.on('data', (chunk) => {
    console.log(`Body: ${chunk}`);
  });
  
  res.on('end', () => {
    console.log('Request completed');
  });
});

req.on('error', (error) => {
  console.error(`Problem with request: ${error.message}`);
});

req.end();