/**
 * Cloudflare Pages Function: Sync Google Maps Photos
 * POST /api/vendors/:id/sync-google-maps
 * Uses Supabase (not D1)
 */

interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
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
    
    // Get vendor from Supabase
    const vendorResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/vendors?select=id,google_maps_place_id,images&id=eq.${vendorId}`,
      {
        headers: {
          'apikey': env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!vendorResponse.ok) {
      throw new Error(`Failed to fetch vendor: ${vendorResponse.statusText}`);
    }

    const vendors = await vendorResponse.json();
    const vendor = vendors[0];
    
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
    const existingImages = vendor.images || [];
    const newImages = [...photos, ...existingImages.filter((img: string) => !img.includes('googleapis.com'))].slice(0, 50);
    
    const updateResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/vendors?id=eq.${vendorId}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          images: newImages,
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (!updateResponse.ok) {
      throw new Error(`Failed to update vendor: ${updateResponse.statusText}`);
    }
    
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
