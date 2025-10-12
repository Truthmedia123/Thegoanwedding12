import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { getDb, type Env } from './db';
import { registerRoutes } from './routes';

const app = new Hono<{ Bindings: Env }>();

// Security middleware
app.use('*', async (c, next) => {
  // Security headers
  c.header('X-Frame-Options', 'DENY');
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-XSS-Protection', '1; mode=block');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  c.header('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://www.google-analytics.com;");
  
  await next();
});

// Middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use('*', cors({
  origin: ['*'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Register API routes
registerRoutes(app);

// For all other routes, let Cloudflare Pages handle the static assets
// This is a placeholder - in production, Cloudflare Pages will serve the frontend
app.notFound((c) => {
  // Return a simple response indicating this should be handled by Pages
  return c.text('Not Found - This should be handled by Cloudflare Pages', 404);
});

// Export for Cloudflare Workers
export default app;