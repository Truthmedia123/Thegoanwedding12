const http = require('http');

// Test invitation endpoint that the RSVP form uses
const options = {
  hostname: 'localhost',
  port: 8787,
  path: '/api/rsvp/invitation/gdjigv9d0ggy072ima70ur',
  method: 'GET'
};

console.log('Testing invitation endpoint...');

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`\nResponse Body: ${data}`);
    
    try {
      const jsonData = JSON.parse(data);
      console.log('\nParsed JSON response:', JSON.stringify(jsonData, null, 2));
      
      if (res.statusCode === 200 && jsonData.wedding) {
        console.log('\n✅ Invitation endpoint test PASSED');
        console.log(`Wedding: ${jsonData.wedding.bride_name} & ${jsonData.wedding.groom_name}`);
      } else {
        console.log('\n❌ Invitation endpoint test FAILED');
      }
    } catch (e) {
      console.log('\n❌ Response is not valid JSON');
    }
  });
});

req.on('error', (error) => {
  console.error(`\n❌ Problem with request: ${error.message}`);
});

req.end();