// Environment configuration for the client application
const config = {
  directus: {
    url: import.meta.env.VITE_DIRECTUS_URL || 
         (import.meta.env.PROD ? 'YOUR_DIRECTUS_URL_HERE' : 'http://localhost:8055'),
  },
  // Add other configurations as needed
};

export default config;