import { Context } from 'hono';

// Cloudflare Cache API implementation
export const cache = (ttl: number = 300000) => { // Default 5 minutes
  return async (c: Context, next: () => Promise<void>) => {
    // Try to get from Cloudflare cache first
    const cache = await caches.open('wedding-platform-cache');
    const cachedResponse = await cache.match(c.req.url);
    
    if (cachedResponse) {
      // Return cached response
      return new Response(cachedResponse.body, cachedResponse);
    }
    
    // Continue with the request
    await next();
    
    // Cache the response if it's successful
    if (c.res.status === 200) {
      // Clone the response for caching
      const responseClone = c.res.clone();
      
      // Create a new Response object with cache headers
      const cacheableResponse = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: new Headers(responseClone.headers)
      });
      
      // Set cache control headers
      cacheableResponse.headers.set('Cache-Control', `public, max-age=${ttl/1000}`);
      
      // Cache the response
      await cache.put(c.req.url, cacheableResponse);
    }
  };
};