const http = require('http');

// Test RSVP form submission
const testData = {
  invitationCode: 'gdjigv9d0ggy072ima70ur',
  guestName: 'John Doe',
  guestEmail: 'john.doe@example.com',
  guestPhone: '+1-555-123-4567',
  attendingCeremony: true,
  attendingReception: true,
  numberOfGuests: 2,
  message: 'Looking forward to celebrating with you!'
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 8787,
  path: '/api/rsvp/submit',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Testing RSVP submission...');
console.log('Test data:', JSON.stringify(testData, null, 2));

const req = http.request(options, (res) => {
  console.log(`\nStatus Code: ${res.statusCode}`);
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
      
      if (res.statusCode === 200) {
        console.log('\n✅ RSVP submission test PASSED');
      } else {
        console.log('\n❌ RSVP submission test FAILED');
      }
    } catch (e) {
      console.log('\n❌ Response is not valid JSON');
    }
  });
});

req.on('error', (error) => {
  console.error(`\n❌ Problem with request: ${error.message}`);
});

req.write(postData);
req.end();