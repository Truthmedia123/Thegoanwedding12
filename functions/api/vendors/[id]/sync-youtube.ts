interface Env {
  DB: any; // Cloudflare D1 Database
  YOUTUBE_API_KEY: string;
}

interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  thumbnailHigh: string;
  publishedAt: string;
}

interface YouTubeSyncResult {
  success: boolean;
  videos: YouTubeVideo[];
  thumbnails: string[];
  error?: string;
}

async function fetchYouTubeVideos(
  channelId: string,
  apiKey: string,
  maxResults: number = 12
): Promise<YouTubeSyncResult> {
  try {
    console.log(`📺 Fetching videos for channel: ${channelId}`);

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
      `key=${apiKey}&` +
      `channelId=${channelId}&` +
      `part=snippet&` +
      `order=date&` +
      `maxResults=${maxResults}&` +
      `type=video`
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ YouTube API error:', error);
      return {
        success: false,
        videos: [],
        thumbnails: [],
        error: error.error?.message || 'YouTube API request failed',
      };
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      console.log('⚠️ No videos found for channel');
      return {
        success: true,
        videos: [],
        thumbnails: [],
      };
    }

    const videos: YouTubeVideo[] = data.items.map((item: any) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default.url,
      thumbnailHigh: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt,
    }));

    const thumbnails = videos.map(v => v.thumbnailHigh);

    console.log(`✅ Fetched ${videos.length} videos from YouTube`);

    return {
      success: true,
      videos,
      thumbnails,
    };
  } catch (error: any) {
    console.error('❌ YouTube fetch error:', error);
    return {
      success: false,
      videos: [],
      thumbnails: [],
      error: error.message,
    };
  }
}

export async function onRequestPost(context: { request: Request; env: Env; params: { id: string } }) {
  const { request, env, params } = context;
  const vendorId = parseInt(params.id);

  try {
    console.log('🔍 YouTube sync request received for vendor:', vendorId);

    // Check if YouTube API key is configured
    if (!env.YOUTUBE_API_KEY) {
      console.error('❌ YouTube API key not configured');
      return new Response(
        JSON.stringify({ 
          error: 'YouTube API key not configured. Please add YOUTUBE_API_KEY to environment variables.' 
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get vendor from D1
    const stmt = env.DB.prepare('SELECT * FROM vendors WHERE id = ?').bind(vendorId);
    const vendor = await stmt.first();

    if (!vendor) {
      console.error('❌ Vendor not found:', vendorId);
      return new Response(
        JSON.stringify({ error: 'Vendor not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!vendor.youtube) {
      console.error('❌ No YouTube channel for vendor:', vendor.name);
      return new Response(
        JSON.stringify({ error: 'No YouTube channel configured for this vendor' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📺 Syncing YouTube gallery for vendor ${vendorId}: ${vendor.name}`);
    console.log(`📺 YouTube Channel ID: ${vendor.youtube}`);

    // Fetch videos from YouTube
    const result = await fetchYouTubeVideos(vendor.youtube as string, env.YOUTUBE_API_KEY);

    if (!result.success) {
      console.error('❌ YouTube fetch failed:', result.error);
      return new Response(
        JSON.stringify({ error: result.error || 'Failed to fetch YouTube videos' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Update vendor images with YouTube thumbnails
    const existingImages = vendor.images ? JSON.parse(vendor.images as string) : [];
    const newImages = [...result.thumbnails, ...existingImages].slice(0, 20);

    const updateStmt = env.DB.prepare(
      'UPDATE vendors SET images = ?, updated_at = ? WHERE id = ?'
    ).bind(JSON.stringify(newImages), new Date().toISOString(), vendorId);

    await updateStmt.run();

    console.log(`✅ Synced ${result.thumbnails.length} YouTube thumbnails for vendor ${vendorId}`);

    return new Response(
      JSON.stringify({
        success: true,
        videosFound: result.videos.length,
        thumbnailsAdded: result.thumbnails.length,
        totalImages: newImages.length,
        videos: result.videos,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('❌ YouTube sync error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to sync YouTube gallery' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
