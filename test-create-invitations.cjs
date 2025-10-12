const http = require('http');

// Test creating invitations
const testInvitations = [
  {
    wedding_id: 1,
    guest_name: 'John Doe',
    guest_email: 'john.doe@example.com',
    max_guests: 2,
    allow_plus_one: true
  },
  {
    wedding_id: 1,
    guest_name: 'Jane Smith',
    guest_email: 'jane.smith@example.com',
    max_guests: 1,
    allow_plus_one: false
  }
];

const postData = JSON.stringify(testInvitations);

const options = {
  hostname: 'localhost',
  port: 8787,
  path: '/api/rsvp/invitations',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Creating test invitations...');
console.log('Test data:', JSON.stringify(testInvitations, null, 2));

const req = http.request(options, (res) => {
  console.log(`\nStatus Code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`\nResponse Body: ${data}`);
    
    try {
      const jsonData = JSON.parse(data);
      console.log('\nParsed JSON response:', JSON.stringify(jsonData, null, 2));
      
      if (res.statusCode === 200 && jsonData.success) {
        console.log('\n✅ Invitation creation test PASSED');
        console.log(`Created ${jsonData.invitations.length} invitations`);
        
        // Save the first invitation code for testing
        if (jsonData.invitations.length > 0) {
          const firstCode = jsonData.invitations[0].invitationCode;
          console.log(`\nFirst invitation code: ${firstCode}`);
          console.log(`RSVP Link: ${jsonData.invitations[0].rsvpLink}`);
        }
      } else {
        console.log('\n❌ Invitation creation test FAILED');
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