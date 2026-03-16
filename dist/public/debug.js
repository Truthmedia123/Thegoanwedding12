console.log('Debug script loaded');

// Check if root element exists
const rootElement = document.getElementById('root');
console.log('Root element exists:', !!rootElement);

// Check if React is loaded
console.log('React loaded:', !!window.React);

// Try to fetch a simple endpoint
fetch('/api/health')
  .then(response => {
    console.log('API Health Check Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('API Health Check Data:', data);
  })
  .catch(error => {
    console.error('API Health Check Error:', error);
  });