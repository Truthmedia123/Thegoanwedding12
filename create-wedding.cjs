const http = require('http');

// Wedding data
const weddingData = {
  brideName: 'Jane',
  groomName: 'John',
  weddingDate: new Date().toISOString(),
  ceremonyVenue: 'Test Ceremony Venue',
  ceremonyVenueAddress: '123 Test St, Test City',
  ceremonyTime: '2:00 PM',
  contactEmail: 'jane@example.com',
  slug: 'jane-john-test'
};

const postData = JSON.stringify(weddingData);

const options = {
  hostname: 'localhost',
  port: 8787,
  path: '/api/weddings',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  
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
      
      if (jsonData.adminSecretLink) {
        console.log('Secret link generated:', jsonData.adminSecretLink);
      } else {
        console.log('No secret link found in response');
      }
    } catch (e) {
      console.log('Response is not valid JSON');
    }
  });
});

req.on('error', (error) => {
  console.error(`Problem with request: ${error.message}`);
});

req.write(postData);
req.end();