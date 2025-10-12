require('dotenv').config({ path: '.env.development' });

console.log('DIRECTUS_URL:', process.env.DIRECTUS_URL);
console.log('DIRECTUS_TOKEN:', process.env.DIRECTUS_TOKEN);
console.log('NODE_ENV:', process.env.NODE_ENV);