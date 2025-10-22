/**
 * Cloudflare Pages Function: Sync Google Maps Photos
 * POST /api/vendors/:id/sync-google-maps
 */

interface Env {
  DB: D1Database;
  GOOGLE_MAPS_API_KEY: string;
}

const ADMIN_TOKENS: Record<string, string> = {
  'admin-2025-goa': 'full-access',
  'vendor-manager': 'vendor-only',
  'content-editor': 'blog-only',
};

async function fetchGoogleMapsPhotos(placeId: string, apiKey: string): Promise<string[]> {
  try {
    console.log(`📍 Fetching Google Maps photos for place: ${placeId}`);
    
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?` +
      `place_id=${placeId}&fields=photos&key=${apiKey}`
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Google Maps API error: ${response.status} - ${errorText}`);
      return [];
    }
    
    const data = await response.json();
    
    if (data.error_message) {
      console.error(`❌ Google Maps API error message: ${data.error_message}`);
      return [];
    }
    
    const photos = data.result?.photos || [];
    console.log(`📍 Found ${photos.length} photos`);
    
    if (photos.length === 0) {
      return [];
    }
    
    const photoUrls = photos.slice(0, 10).map((photo: any) => 
      `https://maps.googleapis.com/maps/api/place/photo?` +
      `maxwidth=1600&photo_reference=${photo.photo_reference}&key=${apiKey}`
    );
    
    console.log(`✅ Generated ${photoUrls.length} photo URLs`);
    return photoUrls;
  } catch (error: any) {
    console.error('❌ Google Maps fetch error:', error);
    return [];
  }
}

export async function onRequestPost(context: { request: Request; env: Env; params: { id: string } }) {
  const { request, env, params } = context;
  const vendorId = parseInt(params.id);

  try {
    // Check authentication
    const token = request.headers.get('x-admin-token') || '';
    const permissions = ADMIN_TOKENS[token];
    
    if (!permissions || (permissions !== 'full-access' && permissions !== 'vendor-only')) {
      return new Response('Unauthorized', { status: 401 });
    }

    console.log(`📍 Starting Google Maps sync for vendor ${vendorId}`);
    
    // Get vendor
    const vendor = await env.DB.prepare(
      'SELECT id, google_maps_place_id, images FROM vendors WHERE id = ?'
    ).bind(vendorId).first();
    
    if (!vendor) {
      return new Response(JSON.stringify({ error: 'Vendor not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    if (!vendor.google_maps_place_id) {
      return new Response(JSON.stringify({ 
        error: 'No Google Maps Place ID configured for this vendor' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    if (!env.GOOGLE_MAPS_API_KEY) {
      return new Response(JSON.stringify({ 
        error: 'Google Maps API key not configured' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const photos = await fetchGoogleMapsPhotos(vendor.google_maps_place_id as string, env.GOOGLE_MAPS_API_KEY);
    
    if (photos.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'No photos found for this location' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // Update vendor images
    const existingImages = JSON.parse((vendor.images as string) || '[]');
    const newImages = [...photos, ...existingImages.filter((img: string) => !img.includes('googleapis.com'))].slice(0, 50);
    
    await env.DB.prepare(
      'UPDATE vendors SET images = ?, updated_at = ? WHERE id = ?'
    ).bind(
      JSON.stringify(newImages),
      new Date().toISOString(),
      vendorId
    ).run();
    
    console.log(`✅ Google Maps sync completed for vendor ${vendorId}: ${photos.length} photos added`);
    
    return new Response(JSON.stringify({
      success: true,
      photosAdded: photos.length,
      totalImages: newImages.length,
      message: `Added ${photos.length} photos from Google Maps`
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('❌ Google Maps sync error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to sync Google Maps photos' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
