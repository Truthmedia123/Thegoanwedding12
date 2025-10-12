import { Context } from 'hono';

const ADMIN_TOKENS: Record<string, string> = {
  'admin-2025-goa': 'full-access',
  'vendor-manager': 'vendor-only',
  'content-editor': 'blog-only',
};

export function authenticateAdmin(action: 'vendors' | 'blog' | 'templates' | 'analytics' | 'business' | 'contacts' | 'weddings') {
  return async (c: Context, next: () => Promise<void>) => {
    const token = c.req.header('x-admin-token') || '';
    const permissions = ADMIN_TOKENS[token];
    
    if (!permissions) {
      return c.text('Unauthorized', 401);
    }
    
    if (
      permissions === 'full-access' ||
      (permissions === 'vendor-only' && (action === 'vendors' || action === 'business' || action === 'contacts' || action === 'weddings')) ||
      (permissions === 'blog-only' && action === 'blog') ||
      (permissions === 'full-access' && (action === 'templates' || action === 'analytics'))
    ) {
      await next();
    } else {
      return c.text('Forbidden', 403);
    }
  };
}