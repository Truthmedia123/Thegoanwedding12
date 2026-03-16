import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import { registerRoutes } from '../../server/routes';

const app = new Hono();

// Register all routes
registerRoutes(app);

// Handle all API requests
export const onRequest = handle(app);
