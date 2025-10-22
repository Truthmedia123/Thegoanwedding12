/**
 * Cloudflare Pages Function: Clean Placeholder Images
 * POST /api/vendors/clean-placeholders
 * Uses Supabase (not D1)
 */

interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
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

    // Get all vendors with images from Supabase
    const vendorsResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/vendors?select=id,images&images=not.is.null`,
      {
        headers: {
          'apikey': env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!vendorsResponse.ok) {
      throw new Error(`Failed to fetch vendors: ${vendorsResponse.statusText}`);
    }

    const allVendors = await vendorsResponse.json();
    
    let cleanedCount = 0;
    let totalRemoved = 0;

    for (const vendor of allVendors) {
      const images = vendor.images || [];
      const originalCount = images.length;

      // Filter out placeholder images
      const cleanedImages = images.filter((img: string) => {
        const isPlaceholder = 
          img.includes('mqdefault.jpg') ||
          img.includes('default.jpg') ||
          img.includes('/vi/%20') || // Invalid video IDs with spaces
          img === '' ||
          !img.startsWith('http');
        return !isPlaceholder;
      });

      // Update if any images were removed
      if (cleanedImages.length < originalCount) {
        const updateResponse = await fetch(
          `${env.SUPABASE_URL}/rest/v1/vendors?id=eq.${vendor.id}`,
          {
            method: 'PATCH',
            headers: {
              'apikey': env.SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
              images: cleanedImages,
              updated_at: new Date().toISOString(),
            }),
          }
        );

        if (!updateResponse.ok) {
          console.error(`Failed to update vendor ${vendor.id}`);
          continue;
        }

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
