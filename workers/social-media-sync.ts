/**
 * Cloudflare Worker: Automated Social Media Sync
 * Syncs YouTube & Google Maps photos every 10 days
 */

interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  GOOGLE_MAPS_API_KEY: string;
}

interface Vendor {
  id: number;
  name: string;
  youtube?: string;
  google_maps_place_id?: string;
  images?: string[];
}

// YouTube RSS Fetcher (no API key needed)
async function fetchYouTubeRSS(channelId: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`
    );
    
    if (!response.ok) return [];
    
    const xml = await response.text();
    const videoIds = [...xml.matchAll(/yt:videoId>([^<]+)</g)].map(m => m[1]);
    
    return videoIds.slice(0, 12).map(id => 
      `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
    );
  } catch (error) {
    console.error('YouTube RSS error:', error);
    return [];
  }
}

// Google Maps Photos
async function fetchGoogleMapsPhotos(placeId: string, apiKey: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?` +
      `place_id=${placeId}&fields=photos&key=${apiKey}`
    );
    
    if (!response.ok) return [];
    
    const data = await response.json();
    const photos = data.result?.photos || [];
    
    return photos.slice(0, 10).map((photo: any) => 
      `https://maps.googleapis.com/maps/api/place/photo?` +
      `maxwidth=1600&photo_reference=${photo.photo_reference}&key=${apiKey}`
    );
  } catch (error) {
    console.error('Google Maps error:', error);
    return [];
  }
}

// Sync single vendor
async function syncVendor(vendor: Vendor, env: Env) {
  const newImages: string[] = [];
  let youtubeCount = 0;
  let mapsCount = 0;

  // YouTube
  if (vendor.youtube) {
    const images = await fetchYouTubeRSS(vendor.youtube);
    newImages.push(...images);
    youtubeCount = images.length;
  }

  // Google Maps
  if (vendor.google_maps_place_id && env.GOOGLE_MAPS_API_KEY) {
    const images = await fetchGoogleMapsPhotos(vendor.google_maps_place_id, env.GOOGLE_MAPS_API_KEY);
    newImages.push(...images);
    mapsCount = images.length;
  }

  // Update Supabase
  if (newImages.length > 0) {
    const existingImages = vendor.images || [];
    const combinedImages = [...newImages, ...existingImages].slice(0, 50);
    
    await fetch(`${env.SUPABASE_URL}/rest/v1/vendors?id=eq.${vendor.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        images: combinedImages,
        last_synced_at: new Date().toISOString(),
      }),
    });
  }

  return { 
    vendorId: vendor.id, 
    vendorName: vendor.name,
    youtubeCount, 
    mapsCount,
    totalAdded: newImages.length 
  };
}

// Main sync
async function syncAllVendors(env: Env) {
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/vendors?select=id,name,youtube,google_maps_place_id,images`,
    {
      headers: {
        'apikey': env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
      },
    }
  );

  const vendors: Vendor[] = await response.json();
  const results = [];

  for (const vendor of vendors) {
    const result = await syncVendor(vendor, env);
    results.push(result);
    console.log(`✅ Synced ${vendor.name}: +${result.totalAdded} images`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limit
  }

  // Log to Supabase
  const summary = {
    total_vendors: vendors.length,
    successful_syncs: results.filter(r => r.totalAdded > 0).length,
    total_images_added: results.reduce((sum, r) => sum + r.totalAdded, 0),
    results: results,
  };

  await fetch(`${env.SUPABASE_URL}/rest/v1/sync_logs`, {
    method: 'POST',
    headers: {
      'apikey': env.SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(summary),
  });

  return summary;
}

export default {
  // Cron trigger (every 10 days)
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    console.log('🔄 Auto-sync started:', new Date().toISOString());
    const results = await syncAllVendors(env);
    console.log('✅ Sync complete:', results);
  },

  // Manual trigger
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'POST') {
      const results = await syncAllVendors(env);
      return new Response(JSON.stringify({ success: true, ...results }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response('Social Media Sync Worker - Ready');
  },
};