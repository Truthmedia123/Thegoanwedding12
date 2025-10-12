import { Context } from 'hono';

// Rate limiting middleware with configurable options
interface RateLimitOptions {
  maxRequests?: number;
  windowMs?: number;
  keyGenerator?: (c: Context) => string;
}

// Default options
const defaultOptions: RateLimitOptions = {
  maxRequests: 100,
  windowMs: 60000, // 1 minute
  keyGenerator: (c: Context) => {
    return c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';
  }
};

// In-memory store for rate limiting (in production, you might want to use Redis or D1)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const apiRateLimit = (options: RateLimitOptions = {}) => {
  const config = { ...defaultOptions, ...options };
  
  return async (c: Context, next: () => Promise<void>) => {
    const key = `${config.keyGenerator?.(c)}:${c.req.path}`;
    const now = Date.now();
    
    const rateLimitInfo = rateLimitStore.get(key);
    
    // Check if we have existing rate limit info
    if (rateLimitInfo) {
      // Check if the window has expired
      if (now > rateLimitInfo.resetTime) {
        // Reset the counter
        rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs! });
      } else {
        // Increment the counter
        if (rateLimitInfo.count >= config.maxRequests!) {
          // Rate limit exceeded
          c.header('X-RateLimit-Limit', config.maxRequests!.toString());
          c.header('X-RateLimit-Remaining', '0');
          c.header('X-RateLimit-Reset', new Date(rateLimitInfo.resetTime).toISOString());
          return c.json({ 
            error: 'Rate limit exceeded',
            message: `Too many requests, please try again later.`
          }, 429);
        }
        rateLimitStore.set(key, { count: rateLimitInfo.count + 1, resetTime: rateLimitInfo.resetTime });
      }
    } else {
      // First request for this IP+path combination
      rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs! });
    }
    
    // Add rate limit headers
    const info = rateLimitStore.get(key);
    if (info) {
      c.header('X-RateLimit-Limit', config.maxRequests!.toString());
      c.header('X-RateLimit-Remaining', (config.maxRequests! - info.count).toString());
      c.header('X-RateLimit-Reset', new Date(info.resetTime).toISOString());
    }
    
    await next();
  };
};