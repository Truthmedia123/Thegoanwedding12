const http = require('http');

// Test a simple API endpoint to verify routing
const options = {
  hostname: 'localhost',
  port: 8787,
  path: '/api/health',
  method: 'GET'
};

console.log('Testing simple API endpoint...');

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`Response Body: ${data}`);
    
    if (res.statusCode === 200) {
      console.log('\n✅ API routing is working');
    } else {
      console.log('\n❌ API routing issue');
    }
  });
});

req.on('error', (error) => {
  console.error(`\n❌ Problem with request: ${error.message}`);
});

req.end();