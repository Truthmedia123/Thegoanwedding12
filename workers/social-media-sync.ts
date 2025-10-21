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
  auto_update_main_image?: boolean;
  main_image_selection?: 'first' | 'random' | 'highest_quality';
}

// Select main image based on strategy
function selectMainImage(images: string[], strategy: 'first' | 'random' | 'highest_quality' = 'first'): string {
  if (images.length === 0) return '';
  
  switch (strategy) {
    case 'random':
      return images[Math.floor(Math.random() * images.length)];
    
    case 'highest_quality':
      // Prefer maxresdefault for YouTube, larger sizes for others
      const highQuality = images.find(img => img.includes('maxresdefault') || img.includes('maxwidth=1600'));
      return highQuality || images[0];
    
    case 'first':
    default:
      return images[0];
  }
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
    console.log(`📍 Fetching Google Maps photos for place: ${placeId}`);
    
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?` +
      `place_id=${placeId}&fields=photos&key=${apiKey}`,
      {
        headers: {
          'Accept': 'application/json',
        }
      }
    );
    
    console.log(`📍 Google Maps API response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Google Maps API error: ${response.status} - ${errorText}`);
      return [];
    }
    
    const data = await response.json();
    console.log(`📍 Google Maps API response:`, JSON.stringify(data).substring(0, 200));
    
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
    console.error('❌ Google Maps fetch error:', error.message);
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
    console.log(`📍 Attempting to fetch Google Maps photos for vendor ${vendor.id}: ${vendor.name}`);
    const images = await fetchGoogleMapsPhotos(vendor.google_maps_place_id, env.GOOGLE_MAPS_API_KEY);
    newImages.push(...images);
    mapsCount = images.length;
    console.log(`📍 Google Maps returned ${mapsCount} images for ${vendor.name}`);
  } else if (vendor.google_maps_place_id) {
    console.log(`⚠️ Google Maps Place ID found but API key missing for vendor ${vendor.name}`);
  }

  // Update Supabase
  if (newImages.length > 0) {
    const existingImages = vendor.images || [];
    const combinedImages = [...newImages, ...existingImages].slice(0, 50);
    
    // Prepare update data
    const updateData: any = {
      images: combinedImages,
      last_synced_at: new Date().toISOString(),
    };
    
    // Update main image only if auto_update_main_image is enabled (default true)
    if (vendor.auto_update_main_image !== false) {
      const strategy = vendor.main_image_selection || 'first';
      const mainImage = selectMainImage(newImages, strategy);
      
      updateData.profile_image_url = mainImage;
      updateData.cover_image_url = mainImage;
      
      console.log(`🖼️ Auto-updating main images for ${vendor.name} using strategy: ${strategy}`);
      console.log(`   Selected image: ${mainImage.substring(0, 60)}...`);
    } else {
      console.log(`⏭️ Skipping main image update for ${vendor.name} (auto-update disabled)`);
    }
    
    await fetch(`${env.SUPABASE_URL}/rest/v1/vendors?id=eq.${vendor.id}`, {
      method: 'PATCH',
      headers: {
        'apikey': env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
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
    `${env.SUPABASE_URL}/rest/v1/vendors?select=id,name,youtube,google_maps_place_id,images,auto_update_main_image,main_image_selection`,
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