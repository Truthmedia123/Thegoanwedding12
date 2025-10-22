/**
 * Cloudflare Pages Function: Clean Placeholder Images
 * POST /api/vendors/clean-placeholders
 */

interface Env {
  DB: D1Database;
}

const ADMIN_TOKENS: Record<string, string> = {
  'admin-2025-goa': 'full-access',
  'vendor-manager': 'vendor-only',
  'content-editor': 'blog-only',
};

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    // Check authentication
    const token = request.headers.get('x-admin-token') || '';
    const permissions = ADMIN_TOKENS[token];
    
    if (!permissions || (permissions !== 'full-access' && permissions !== 'vendor-only')) {
      return new Response('Unauthorized', { status: 401 });
    }

    console.log('🧹 Starting placeholder cleanup for all vendors...');

    // Get all vendors with images
    const { results: allVendors } = await env.DB.prepare(
      'SELECT id, images FROM vendors WHERE images IS NOT NULL'
    ).all();
    
    let cleanedCount = 0;
    let totalRemoved = 0;

    for (const vendor of allVendors as any[]) {
      const images = JSON.parse(vendor.images || '[]');
      const originalCount = images.length;

      // Filter out placeholder images
      const cleanedImages = images.filter((img: string) => {
        const isPlaceholder = 
          img.includes('mqdefault.jpg') ||
          img.includes('default.jpg') ||
          img === '' ||
          !img.startsWith('http');
        return !isPlaceholder;
      });

      // Update if any images were removed
      if (cleanedImages.length < originalCount) {
        await env.DB.prepare(
          'UPDATE vendors SET images = ?, updated_at = ? WHERE id = ?'
        ).bind(
          JSON.stringify(cleanedImages),
          new Date().toISOString(),
          vendor.id
        ).run();

        cleanedCount++;
        totalRemoved += (originalCount - cleanedImages.length);
        console.log(`✅ Cleaned ${originalCount - cleanedImages.length} placeholders from vendor ${vendor.id}`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      vendorsCleaned: cleanedCount,
      totalPlaceholdersRemoved: totalRemoved,
      message: `Removed ${totalRemoved} placeholder images from ${cleanedCount} vendors`
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('❌ Placeholder cleanup error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to clean placeholders' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
